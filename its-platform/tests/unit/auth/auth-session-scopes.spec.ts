/**
 * O token de sessão do aprendiz carrega os escopos que a LGPD lhe dá.
 *
 * **O problema que este arquivo mede.** Os dois escopos da LGPD — `learner:export` e
 * `learner:erase` — estão no conjunto fechado de ADR-038 D2, e o **detentor** de ambos
 * é o *aprendiz*: eles são os direitos do próprio aluno, não um privilégio de staff. A
 * plataforma os mantém fora do token assinado, e o resultado é que as duas rotas da LGPD
 * respondem `403` a um aluno autenticado — o botão "Exportar meus dados" funciona, e
 * recusa.
 *
 * **Por que um direito inalcançável não é um direito.** Um escopo que a plataforma nunca
 * emite é um escopo que não existe para quem o deveria exercer. A correção não é afrouxar
 * a autorização: é **emitir** o escopo que ADR-038 D2 já atribui ao aprendiz. A
 * autorização por objeto continua sendo a RLS (D3) — estas rotas só enxergam a linha do
 * chamador.
 *
 * **O que o teste prova, e o que ele não prova.** Ele prova que o token *assinado* pelo
 * login carrega os quatro escopos, lidos do próprio token — não de uma constante. Ele não
 * prova que o escopo concede acesso a dados alheios: isso é o trabalho da RLS, e um teste
 * que aqui afirmasse "o escopo é amplo" estaria medindo a coisa errada.
 */

import * as bcrypt from 'bcrypt';
import { generateKeyPair } from 'jose';

import { AuthService } from '../../../src/modules/auth/auth.service.js';
import type { UserEntity } from '../../../src/infrastructure/entities/user.entity.js';

const LEARNER_ID = '74726c7a-efa6-4c4e-b145-916013e34033';
const USER_ID = 'b0a9e4a4-0d1f-4a44-9f36-2d6a0f7c1b21';
const PASSWORD = 'dev12345';

let service: AuthService;
let passwordHash: string;

beforeAll(async () => {
  passwordHash = await bcrypt.hash(PASSWORD, 4);

  const { privateKey, publicKey } = await generateKeyPair('RS256', { extractable: true });

  const user = {
    id: USER_ID,
    email: 'dev@its.local',
    passwordHash,
    displayName: 'Dev User',
    learnerId: LEARNER_ID,
    emailVerified: true,
    provider: 'local',
  } as unknown as UserEntity;

  const users = {
    findOne: jest.fn(async () => user),
    save: jest.fn(async (u: UserEntity) => u),
    create: jest.fn((values: Partial<UserEntity>) => values),
  };

  const sessions = {
    create: jest.fn((values: Record<string, unknown>) => values),
    save: jest.fn(async (s: unknown) => s),
  };

  const learners = {
    createQueryBuilder: () => ({
      insert: () => ({
        into: () => ({
          values: () => ({
            orIgnore: () => ({ execute: async () => undefined }),
          }),
        }),
      }),
    }),
  };

  /**
   * The key manager is the **fourth** argument, and the argument is always passed —
   * whether the current `AuthService` takes it or not. A signature that ignores an extra
   * argument is the JavaScript norm, and the alternative (a test that reads the
   * constructor's arity) would make a test about the *scope claim* hostage to a
   * refactor of the *key management*. The claim is what this file measures.
   */
  const keyManagement = {
    getSigningKeyPair: async () => ({ kid: 'test-1', privateKey, publicKey }),
    getVerificationKey: async () => null,
    rotateKeys: async () => ({ kid: 'test-1', privateKey, publicKey }),
  };

  const Auth = AuthService as unknown as new (...args: unknown[]) => AuthService;
  service = new Auth(users, sessions, learners, keyManagement);
});

/** The claims of the token the service minted — read from the token, not from a constant. */
async function claimsOf(accessToken: string): Promise<Record<string, unknown>> {
  const payload = accessToken.split('.')[1] ?? '';
  const decoded = Buffer.from(payload, 'base64url').toString('utf8');
  return JSON.parse(decoded) as Record<string, unknown>;
}

describe('RN27 — o token de sessão carrega os escopos da LGPD', () => {
  it('assina um token com `learner:export` e `learner:erase`', async () => {
    const session = await service.login({ email: 'dev@its.local', password: PASSWORD });

    const claims = await claimsOf(session.accessToken);
    const scopes = String(claims['scope'] ?? '').split(' ');

    expect(scopes).toContain('learner:export');
    expect(scopes).toContain('learner:erase');
  });

  it('mantém os escopos que a trilha de aprendizagem usa', async () => {
    const session = await service.login({ email: 'dev@its.local', password: PASSWORD });

    const claims = await claimsOf(session.accessToken);
    const scopes = String(claims['scope'] ?? '').split(' ');

    expect(scopes).toContain('learner:self');
    expect(scopes).toContain('content:read');
  });

  it('não concede nenhum escopo de staff ao aprendiz', async () => {
    const session = await service.login({ email: 'dev@its.local', password: PASSWORD });

    const claims = await claimsOf(session.accessToken);
    const scopes = String(claims['scope'] ?? '').split(' ');

    expect(scopes).not.toContain('learners:read');
    expect(scopes).not.toContain('learners:admin');
  });
});
