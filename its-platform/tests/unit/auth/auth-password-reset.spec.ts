/**
 * A recuperação de senha, provada no nível do serviço.
 *
 * O fluxo tem quatro propriedades que só a prova do serviço consegue fixar, porque cada
 * uma delas é uma decisão de **segurança** e não de roteamento:
 *
 * 1. **O token não é o segredo guardado.** O que vai para `users.reset_token_hash` é o
 *    SHA-256 do token, e o token em si só existe na resposta — em produção.
 * 2. **Há no máximo um token pendente.** Pedir um token novo revoga o anterior por
 *    substituição; dois tokens válidos ao mesmo tempo transformariam o e-mail em um
 *    segundo fator de acesso.
 * 3. **O token é de uso único e expira.** Consumido uma vez, ele deixa de existir; vencido
 *    o TTL, ele é apagado e rejeitado.
 * 4. **A senha nova é um hash que o `login` reconhece.** É `bcrypt.hash(password, 12)` —
 *    o mesmo caminho do `register`. Um hash diferente criaria exatamente o defeito que este
 *    fluxo existe para consertar: uma conta cuja senha foi "redefinida" e que continua sem
 *    conseguir entrar.
 *
 * As asserções rodam contra o `AuthService` real, com os repositórios substituídos por
 * dublês que guardam o estado em memória. Nenhum banco, nenhuma rede.
 */

import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import type { Repository } from 'typeorm';

import { AuthService } from '../../../src/modules/auth/auth.service.js';
import { UserEntity } from '../../../src/infrastructure/entities/user.entity.js';
import { UserSessionEntity } from '../../../src/infrastructure/entities/user-session.entity.js';

const EMAIL = 'learner@its.local';
const USER_ID = '11111111-1111-4111-8111-111111111111';
const LEARNER_ID = '22222222-2222-4222-8222-222222222222';
const OLD_PASSWORD = 'senha-antiga-123';
const NEW_PASSWORD = 'senha-nova-456';

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

interface UserStore {
  /** O usuário cadastrado — `null` quando o e-mail não existe. */
  user: UserEntity | null;
}

interface Harness {
  readonly service: AuthService;
  readonly users: {
    save: jest.Mock;
    findOne: jest.Mock;
    createQueryBuilder: jest.Mock;
    create: jest.Mock;
  };
  readonly sessions: {
    save: jest.Mock;
    update: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
  };
  readonly store: UserStore;
  readonly savedUsers: UserEntity[];
}

async function createHarness(options: { withUser?: boolean } = {}): Promise<Harness> {
  const store: UserStore = { user: null };

  if (options.withUser !== false) {
    store.user = {
      id: USER_ID,
      email: EMAIL,
      passwordHash: await bcrypt.hash(OLD_PASSWORD, 12),
      displayName: 'Learner',
      avatarUrl: null,
      emailVerified: true,
      provider: 'local',
      providerId: null,
      learnerId: LEARNER_ID,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
      role: 'learner',
      cefrLevel: null,
      googleId: null,
    } as UserEntity;
  }

  const savedUsers: UserEntity[] = [];

  const users = {
    save: jest.fn(async (user: UserEntity): Promise<UserEntity> => {
      savedUsers.push(user);
      store.user = user;
      return user;
    }),
    findOne: jest.fn(async (options: { where?: Record<string, unknown> }): Promise<UserEntity | null> => {
      const where = options?.where ?? {};
      if (!store.user) return null;
      if (typeof where['email'] === 'string') {
        return store.user.email.toLowerCase() === String(where['email']).toLowerCase()
          ? store.user
          : null;
      }
      if (typeof where['resetTokenHash'] === 'string') {
        return store.user.resetTokenHash === where['resetTokenHash'] ? store.user : null;
      }
      return null;
    }),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(async (): Promise<UserEntity | null> => store.user),
    })),
    create: jest.fn((values: Partial<UserEntity>): UserEntity =>
      ({ ...values }) as UserEntity,
    ),
  };

  const sessions = {
    save: jest.fn(async (session: UserSessionEntity): Promise<UserSessionEntity> => session),
    update: jest.fn(async (): Promise<{ affected?: number }> => ({ affected: 1 })),
    findOne: jest.fn(async (): Promise<UserSessionEntity | null> => null),
    create: jest.fn((values: Partial<UserSessionEntity>): UserSessionEntity =>
      ({ ...values }) as UserSessionEntity,
    ),
  };

  const learners = {
    createQueryBuilder: jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      orIgnore: jest.fn().mockReturnThis(),
      execute: jest.fn(async () => ({ raw: [] })),
    })),
  };

  const service = new AuthService(
    users as unknown as Repository<UserEntity>,
    sessions as unknown as Repository<UserSessionEntity>,
    learners as unknown as Repository<never>,
  );

  return { service, users, sessions, store, savedUsers };
}

const originalNodeEnv = process.env['NODE_ENV'];

afterEach(() => {
  if (originalNodeEnv === undefined) {
    delete process.env['NODE_ENV'];
  } else {
    process.env['NODE_ENV'] = originalNodeEnv;
  }
});

describe('AuthService — recuperação de senha', () => {
  it('RN01 — guarda o SHA-256 do token, com validade de 30 minutos, e devolve o token', async () => {
    const { service, users, store } = await createHarness();

    const result = await service.forgotPassword(EMAIL);

    expect(result.devResetToken).toMatch(/^[0-9a-f]{64}$/);
    expect(result.devResetUrl).toContain('/reset-password?token=');

    const persisted = store.user!;
    expect(persisted.resetTokenHash).toBe(sha256(result.devResetToken!));
    expect(persisted.resetTokenHash).not.toBe(result.devResetToken);

    const ttl = persisted.resetTokenExpiresAt!.getTime() - Date.now();
    expect(ttl).toBeGreaterThan(29 * 60 * 1000);
    expect(ttl).toBeLessThanOrEqual(30 * 60 * 1000);

    expect(users.save).toHaveBeenCalledTimes(1);
  });

  it('RN02 — um token novo revoga o anterior: a tabela guarda no máximo um pendente', async () => {
    const { service, store } = await createHarness();

    const first = await service.forgotPassword(EMAIL);
    const firstHash = store.user!.resetTokenHash;

    const second = await service.forgotPassword(EMAIL);

    expect(second.devResetToken).not.toBe(first.devResetToken);
    expect(store.user!.resetTokenHash).not.toBe(firstHash);
    expect(store.user!.resetTokenHash).toBe(sha256(second.devResetToken!));
  });

  it('RN03 — e-mail inexistente recebe a mesma mensagem e nenhum token', async () => {
    const { service, users } = await createHarness({ withUser: false });

    const result = await service.forgotPassword('ninguem@its.local');

    expect(result.devResetToken).toBeUndefined();
    expect(result.devResetUrl).toBeUndefined();
    expect(result.message).toContain('Se o e-mail estiver cadastrado');
    expect(users.save).not.toHaveBeenCalled();
  });

  it('RN04 — em produção o token não é devolvido, mesmo sem SMTP configurado', async () => {
    process.env['NODE_ENV'] = 'production';
    delete process.env['SMTP_HOST'];
    const { service, store } = await createHarness();

    const result = await service.forgotPassword(EMAIL);

    expect(result.devResetToken).toBeUndefined();
    expect(result.devResetUrl).toBeUndefined();
    // O token continua existindo no banco — ele é o que o e-mail entregaria.
    expect(store.user!.resetTokenHash).toBeTruthy();
  });

  it('RN05 — token desconhecido é recusado com 404', async () => {
    const { service } = await createHarness();

    await expect(service.resetPassword('token-que-nunca-existiu', NEW_PASSWORD)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('RN06 — token expirado é recusado com 400 e apagado', async () => {
    const { service, store } = await createHarness();
    const token = 'token-expirado';
    store.user!.resetTokenHash = sha256(token);
    store.user!.resetTokenExpiresAt = new Date(Date.now() - 1000);

    const error = await service.resetPassword(token, NEW_PASSWORD).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadRequestException);
    expect((error as BadRequestException).getStatus()).toBe(400);
    expect(store.user!.resetTokenHash).toBeNull();
    expect(store.user!.resetTokenExpiresAt).toBeNull();
  });

  it('RN07 — consome o token, grava bcrypt e revoga as sessões ativas', async () => {
    const { service, sessions, store } = await createHarness();
    const token = 'token-valido';
    store.user!.resetTokenHash = sha256(token);
    store.user!.resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const result = await service.resetPassword(token, NEW_PASSWORD);

    expect(result.message).toContain('Senha redefinida com sucesso');
    expect(store.user!.resetTokenHash).toBeNull();
    expect(store.user!.resetTokenExpiresAt).toBeNull();
    expect(await bcrypt.compare(NEW_PASSWORD, store.user!.passwordHash!)).toBe(true);
    expect(sessions.update).toHaveBeenCalledWith({ userId: USER_ID }, { revoked: true });
  });

  it('RN08 — o token é de uso único: a segunda tentativa é recusada', async () => {
    const { service, store } = await createHarness();
    const token = 'token-de-uso-unico';
    store.user!.resetTokenHash = sha256(token);
    store.user!.resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await service.resetPassword(token, NEW_PASSWORD);

    await expect(service.resetPassword(token, NEW_PASSWORD)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('RN09 — depois da redefinição, o login aceita a senha nova e rejeita a antiga', async () => {
    const { service, store } = await createHarness();
    const token = 'token-para-o-login';
    store.user!.resetTokenHash = sha256(token);
    store.user!.resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await service.resetPassword(token, NEW_PASSWORD);

    const session = await service.login({ email: EMAIL, password: NEW_PASSWORD });
    expect(session.user.id).toBe(USER_ID);
    expect(session.accessToken).toBeTruthy();

    await expect(service.login({ email: EMAIL, password: OLD_PASSWORD })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
