import {
  Injectable,
  UnauthorizedException,
  ConflictException,
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