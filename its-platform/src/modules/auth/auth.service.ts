import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as jose from 'jose';
import { UserEntity } from '../../infrastructure/entities/user.entity.js';
import { UserSessionEntity } from '../../infrastructure/entities/user-session.entity.js';
import { LearnerEntity } from '../../infrastructure/entities/learner.entity.js';
import { LocalJwtTokenVerifier } from '../../infrastructure/auth/local-jwt-token-verifier.js';
import type { TokenVerifier } from '../../common/auth/token-principal.js';

export interface LoginInput {
  email: string;
  password: string;
}

export interface SessionPayload {
  sessionId: string;
  /** Rotating refresh token. Kept because the published contract names it `token`. */
  token: string;
  /** RS256 access token, presented as `Authorization: Bearer …` by the BFF. */
  accessToken: string;
  expiresAt: Date;
  user: {
    id: string;
    email: string;
    displayName: string | null;
    learnerId: string | null;
    emailVerified: boolean;
    provider: string;
  };
}

export interface RefreshResult {
  sessionId: string;
  token: string;
  accessToken: string;
  expiresAt: Date;
}

/**
 * A resposta de `POST /auth/forgot-password`.
 *
 * `devResetToken` e `devResetUrl` só existem **fora de produção**: sem um provedor SMTP
 * configurado não há canal para entregar o token, e o laboratório precisa de um caminho
 * para testá-lo. Em produção os dois campos estão ausentes e a resposta é a mesma para um
 * e-mail existente e para um e-mail inexistente.
 */
export interface ForgotPasswordResult {
  message: string;
  devResetToken?: string;
  devResetUrl?: string;
}

/** A resposta de `POST /auth/reset-password`. */
export interface ResetPasswordResult {
  message: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private privateKey!: crypto.KeyObject;
  private publicKey!: crypto.KeyObject;
  private readonly issuer = 'its-platform';
  private readonly audience = 'its-learners';
  private readonly accessTokenTtl = 15 * 60; // 15 minutes
  private readonly refreshTokenTtl = 30 * 24 * 60 * 60; // 30 days

  /**
   * The scopes the learner UI needs. This is deliberately the least authority that makes the
   * dashboard, lessons and practice work: `learner:self` for the portfolio routes and
   * `content:read` for the lesson/pack routes. Export and erasure stay out — they require a
   * deliberate grant and are not part of the normal signing flow.
   */
  private readonly accessTokenScopes = 'learner:self content:read';

  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(UserSessionEntity)
    private readonly sessions: Repository<UserSessionEntity>,
    @InjectRepository(LearnerEntity)
    private readonly learners: Repository<LearnerEntity>,
  ) {
    this.generateKeyPair();
  }

  /**
   * The verifier the global guard uses while no external OIDC provider is configured.
   *
   * The platform's own JWKS is published at `/api/v1/.well-known/jwks.json`, but fetching it over
   * HTTP from the same process buys nothing and breaks whenever the generated key pair changes.
   * `LocalJwtTokenVerifier` performs the same signature/claim checks against the in-process public
   * key; `tokenVerifierFromEnv` still wins whenever `OIDC_*` is set.
   */
  tokenVerifier(): TokenVerifier {
    return new LocalJwtTokenVerifier({
      publicKey: this.publicKey,
      issuer: this.issuer,
      audience: this.audience,
    });
  }

  /**
   * Every authenticated user gets a `learners` row, because the learner routes and the RLS policy
   * address a learner by id. Registration has no learner yet (the learner is created on first
   * session), and users created before this rule existed have `learner_id = NULL`; both cases are
   * repaired here, once, idempotently.
   *
   * The row is created with `id = user.id` so a token's `sub` can be the learner id throughout.
   * `ON CONFLICT DO NOTHING` makes a concurrent login harmless.
   */
  private async ensureLearner(user: UserEntity): Promise<string> {
    const learnerId = user.learnerId ?? user.id;

    await this.learners
      .createQueryBuilder()
      .insert()
      .into(LearnerEntity)
      .values({ id: learnerId })
      .orIgnore()
      .execute();

    if (user.learnerId !== learnerId) {
      user.learnerId = learnerId;
      await this.users.save(user);
    }

    return learnerId;
  }

  /** Claims shared by the login-time token and the rotated one. */
  private accessClaims(user: UserEntity, learnerId: string, sessionId: string): Record<string, unknown> {
    return {
      sub: learnerId,
      email: user.email,
      learnerId,
      sid: sessionId,
      scope: this.accessTokenScopes,
    };
  }

  private generateKeyPair(): void {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    this.publicKey = crypto.createPublicKey(publicKey);
    this.privateKey = crypto.createPrivateKey(privateKey);
    this.logger.log('Generated RSA key pair for JWT signing');
  }

  async getJwks(): Promise<{ keys: unknown[] }> {
    const publicKeyPem = this.publicKey.export({ type: 'spki', format: 'pem' }) as string;
    const key = await jose.importSPKI(publicKeyPem, 'RS256');
    const jwk = await jose.exportJWK(key);
    return {
      keys: [{ ...jwk, kid: 'its-platform-1', use: 'sig', alg: 'RS256' }],
    };
  }

  async login(input: LoginInput, meta?: { userAgent?: string; ipHash?: string }): Promise<SessionPayload> {
    const user = await this.users.findOne({ where: { email: input.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createSessionForUser(user, meta);
  }

  async register(input: { email: string; password: string; displayName?: string }): Promise<UserEntity> {
    const existing = await this.users.findOne({ where: { email: input.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = this.users.create({
      email: input.email,
      passwordHash,
      displayName: input.displayName ?? null,
      learnerId: null,
      emailVerified: false,
      provider: 'local',
    });

    return this.users.save(user);
  }

  // ---------------------------------------------------------------------------
  // Recuperação de senha
  // ---------------------------------------------------------------------------

  /**
   * O token de redefinição vive 30 minutos — o TTL publicado no contrato.
   *
   * Curto porque o token dá conta do usuário; longo o bastante para o e-mail ser lido. O
   * valor é uma constante do serviço, não um parâmetro da chamada: um TTL ajustável por
   * requisição é um TTL que alguém esquece de validar.
   */
  private readonly passwordResetTtlMs = 30 * 60 * 1000;

  /**
   * SHA-256 do token, em hex.
   *
   * O token **não** é o hash: 32 bytes aleatórios viram o token que o usuário recebe, e o
   * SHA-256 desse token é o que fica no banco. Um atacante com acesso de leitura à tabela
   * `users` não consegue usar o que leu — o que ele lê não é o segredo.
   */
  private hashResetToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * `true` quando este processo **não** está em produção.
   *
   * O token de laboratório (`devResetToken`/`devResetUrl`) só existe fora da produção: ele
   * é uma chave de conta devolvida no corpo da resposta, e um corpo de resposta chega a
   * logs, proxies e históricos de navegação. Nenhuma configuração de SMTP muda isso — sem
   * SMTP configurado, a produção registra um aviso e **não** entrega o token, porque
   * "não havia e-mail" não é autorização para expor a conta.
   */
  private isProduction(): boolean {
    const environment = process.env['NODE_ENV'] ?? process.env['ENVIRONMENT'] ?? 'development';
    return environment === 'production';
  }

  /** `true` quando há um provedor de e-mail configurado. */
  private hasSmtpConfigured(): boolean {
    return Boolean(
      process.env['SMTP_HOST'] ?? process.env['SMTP_URL'] ?? process.env['MAIL_SERVER'],
    );
  }

  /**
   * O link de laboratório, montado a partir do ambiente.
   *
   * `FRONTEND_BASE_URL` é a base do Next.js (`:3100` no bare-metal local). O backend não
   * decide o roteamento do frontend — ele só entrega o link que o contrato descreve.
   */
  private devResetUrl(token: string): string {
    const base = (process.env['FRONTEND_BASE_URL'] ?? 'http://localhost:3100').replace(/\/+$/, '');
    return `${base}/reset-password?token=${encodeURIComponent(token)}`;
  }

  /**
   * Pede um token de redefinição de senha.
   *
   * O token anterior é revogado **por substituição**: `users` guarda no máximo um token
   * pendente por usuário, e sobrescrevê-lo invalida o anterior — não há duas chaves
   * válidas ao mesmo tempo.
   *
   * A resposta é a mesma para um e-mail cadastrado e para um e-mail inexistente: a
   * existência da conta não pode ser revelada por este endpoint. A única diferença é o
   * par `devResetToken`/`devResetUrl`, que só é devolvido fora de produção.
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResult> {
    const message =
      'Se o e-mail estiver cadastrado, você receberá as instruções de redefinição de senha.';

    const normalized = email.trim();
    const user = await this.users
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email: normalized })
      .getOne();

    if (!user) {
      return { message };
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetTokenHash = this.hashResetToken(token);
    user.resetTokenExpiresAt = new Date(Date.now() + this.passwordResetTtlMs);
    await this.users.save(user);

    if (this.isProduction()) {
      if (!this.hasSmtpConfigured()) {
        // O e-mail não pode ser entregue e o token não pode ser devolvido em produção:
        // registra-se o problema (sem o token, sem o e-mail) e a resposta segue genérica.
        this.logger.error(
          'Recuperação de senha solicitada sem provedor SMTP configurado; o token não foi entregue.',
        );
      }
      return { message };
    }

    return {
      message,
      devResetToken: token,
      devResetUrl: this.devResetUrl(token),
    };
  }

  /**
   * Consome o token e redefine a senha.
   *
   * O token é de uso único: a busca é pelo SHA-256 guardado, e o sucesso **apaga** o token
   * junto com a nova senha — o mesmo token não volta a valer, nem se a senha nova for
   * rejeitada depois. Token expirado é `400` (o pedido é inválido agora) e token
   * desconhecido é `404` (não existe); nos dois casos a resposta não diz se o e-mail existe.
   *
   * A senha nova é gravada com `bcrypt.hash(password, 12)` — **o mesmo** caminho do
   * `register` e o mesmo que o `login` confere, porque um hash que o login não reconhece é
   * exatamente o defeito que este fluxo existe para consertar.
   *
   * As sessões ativas do usuário são revogadas: a senha mudou, e uma sessão aberta antes
   * da mudança continua sendo a sessão de alguém que já não tem a senha.
   */
  async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResult> {
    const tokenHash = this.hashResetToken(token.trim());
    const user = await this.users.findOne({ where: { resetTokenHash: tokenHash } });

    if (!user) {
      throw new NotFoundException('Token de redefinição de senha inválido.');
    }

    if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt.getTime() <= Date.now()) {
      user.resetTokenHash = null;
      user.resetTokenExpiresAt = null;
      await this.users.save(user);
      throw new BadRequestException(
        'O token de redefinição de senha expirou. Solicite um novo link de redefinição.',
      );
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.resetTokenHash = null;
    user.resetTokenExpiresAt = null;
    await this.users.save(user);

    await this.sessions.update({ userId: user.id }, { revoked: true });

    return { message: 'Senha redefinida com sucesso. Faça login com a nova senha.' };
  }

  async createSessionForUser(user: UserEntity, meta?: { userAgent?: string; ipHash?: string }): Promise<SessionPayload> {
    const learnerId = await this.ensureLearner(user);
    const sessionId = crypto.randomUUID();
    const now = new Date();
    const accessExpiresAt = new Date(now.getTime() + this.accessTokenTtl * 1000);
    const refreshExpiresAt = new Date(now.getTime() + this.refreshTokenTtl * 1000);

    // Create access token (JWT). `sub` is the learner id: the learner routes compare the token's
    // subject with the addressed learner through RLS, not through a controller-side `if`.
    const accessToken = await new jose.SignJWT(this.accessClaims(user, learnerId, sessionId))
      .setProtectedHeader({ alg: 'RS256', kid: 'its-platform-1' })
      .setIssuedAt(now)
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime(accessExpiresAt)
      .sign(this.privateKey);

    // Create refresh token (opaque token stored in DB)
    const refreshToken = crypto.randomBytes(32).toString('base64url');

    const session = this.sessions.create({
      id: sessionId,
      userId: user.id,
      tokenHash: await bcrypt.hash(refreshToken, 12),
      accessToken,
      userAgent: meta?.userAgent ?? null,
      ipHash: meta?.ipHash ?? null,
      expiresAt: refreshExpiresAt,
      revoked: false,
      reused: false,
    });

    await this.sessions.save(session);

    return {
      sessionId,
      token: refreshToken,
      accessToken,
      expiresAt: refreshExpiresAt,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        learnerId,
        emailVerified: user.emailVerified,
        provider: user.provider,
      },
    };
  }

  async refresh(sessionId: string, refreshToken: string): Promise<RefreshResult> {
    const session = await this.sessions.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.revoked) {
      throw new UnauthorizedException('Session revoked');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Check for reuse detection
    const tokenValid = await bcrypt.compare(refreshToken, session.tokenHash);
    if (!tokenValid) {
      // Reuse detected - revoke session and all related sessions
      session.reused = true;
      await this.sessions.save(session);
      throw new UnauthorizedException('Token reuse detected');
    }

    // Rotate refresh token
    const newRefreshToken = crypto.randomBytes(32).toString('base64url');
    const now = new Date();
    const newAccessExpiresAt = new Date(now.getTime() + this.accessTokenTtl * 1000);
    const newRefreshExpiresAt = new Date(now.getTime() + this.refreshTokenTtl * 1000);

    // Create new access token
    const user = await this.users.findOne({ where: { id: session.userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const learnerId = await this.ensureLearner(user);
    const accessToken = await new jose.SignJWT(this.accessClaims(user, learnerId, sessionId))
      .setProtectedHeader({ alg: 'RS256', kid: 'its-platform-1' })
      .setIssuedAt(now)
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime(newAccessExpiresAt)
      .sign(this.privateKey);

    // Update session with new tokens
    session.tokenHash = await bcrypt.hash(newRefreshToken, 12);
    session.accessToken = accessToken;
    session.expiresAt = newRefreshExpiresAt;
    await this.sessions.save(session);

    return {
      sessionId,
      token: newRefreshToken,
      accessToken,
      expiresAt: newRefreshExpiresAt,
    };
  }

  async logout(sessionId: string, accessToken: string): Promise<void> {
    const session = await this.sessions.findOne({ where: { id: sessionId } });
    if (session) {
      session.revoked = true;
      await this.sessions.save(session);
    }
  }

  /**
   * Revoke a token (RFC 7009 - OAuth 2.0 Token Revocation).
   *
   * Per RFC 7009, the revocation endpoint should:
   * - Accept POST with application/x-www-form-urlencoded body
   * - Parameter: token (required) - the token to revoke
   * - Parameter: token_type_hint (optional) - "access_token" or "refresh_token"
   * - Return 200 on success (even if token was already revoked or invalid)
   * - The response body is empty per RFC 7009
   *
   * This implementation revokes the session associated with the token.
   * For refresh tokens, it finds the session by token hash.
   * For access tokens, it finds the session by the access token value.
   */
  async revokeToken(
    token: string,
    tokenTypeHint?: 'access_token' | 'refresh_token',
  ): Promise<void> {
    let session: UserSessionEntity | null = null;

    if (tokenTypeHint === 'access_token' || !tokenTypeHint) {
      // Try to find session by access token
      session = await this.sessions.findOne({ where: { accessToken: token } });
    }

    if (!session && (tokenTypeHint === 'refresh_token' || !tokenTypeHint)) {
      // Try to find session by refresh token hash
      // We need to check all sessions since we only store the hash
      const sessions = await this.sessions.find();
      for (const s of sessions) {
        const match = await bcrypt.compare(token, s.tokenHash);
        if (match) {
          session = s;
          break;
        }
      }
    }

    if (session) {
      session.revoked = true;
      await this.sessions.save(session);
      this.logger.log(`Revoked session ${session.id} via token revocation`);
    }
    // Per RFC 7009, we return success even if token was not found
  }

  async me(sessionId: string, accessToken: string): Promise<{
    id: string;
    email: string;
    displayName: string | null;
    learnerId: string | null;
    emailVerified: boolean;
    provider: string;
  } | null> {
    const session = await this.sessions.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });

    if (!session || !session.user) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      displayName: session.user.displayName,
      learnerId: session.user.learnerId,
      emailVerified: session.user.emailVerified,
      provider: session.user.provider,
    };
  }

  async findOrCreateGoogleUser(profile: {
    email: string;
    sub: string;
    name?: string;
    picture?: string;
  }): Promise<UserEntity> {
    let user = await this.users.findOne({ where: { email: profile.email } });

    if (!user) {
      user = this.users.create({
        email: profile.email,
        passwordHash: '', // No password for OAuth users
        displayName: profile.name ?? null,
        learnerId: null,
        emailVerified: true,
        provider: 'google',
        googleId: profile.sub,
      });
      user = await this.users.save(user);
    }

    return user;
  }

  // Cleanup expired sessions (can be called by a cron job)
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.sessions
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute();
    return result.affected ?? 0;
  }
}