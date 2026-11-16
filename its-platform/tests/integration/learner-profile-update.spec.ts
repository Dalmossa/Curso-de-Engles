/**
 * `PATCH /api/v1/learners/{learner_id}/profile` — provado sobre HTTP, com o banco de verdade.
 *
 * O que este arquivo mede são as três propriedades que a rota promete, e cada uma delas tem um
 * jeito próprio de ser falsa:
 *
 * 1. **A escrita chega à linha do aluno endereçado** — e só a ela. A tabela `users` não tem RLS
 *    (só `learners` tem), e por isso o predicado `learner_id = $1` do repositório **é** a
 *    fronteira. Um repositório que escrevesse "a linha de quem tem este e-mail" passaria num
 *    teste de unidade e falharia aqui.
 * 2. **A escrita para a linha de outro aluno não acontece** — e a resposta é o mesmo 404 que um
 *    aluno inexistente recebe (ADR-038 D3). A afirmação é feita **com a ligação no papel da
 *    aplicação** (`SET ROLE its_platform_app`), porque a política só vale para quem não é o dono
 *    da tabela: como dono, a ligação vê tudo, e o 404 seria um accidents do fixture e não da
 *    política.
 * 3. **O que o contrato recusa é recusado** — um avatar que não é um `https://` nem um `data:` de
 *    imagem raster, e um membro que o corpo não declara. As duas recusas são `400` em
 *    `application/problem+json` (§4.3), e não um `500` nem um corpo silenciosamente ignorado.
 *
 * **A aplicação é a real**: os controllers, a URL versionada, `configureApp` (o composition root
 * que `main.ts` chama), o `ValidationPipe` global e o `ProblemExceptionFilter`. A credencial é um
 * token RS256 de verdade verificado contra uma JWKS de verdade (`tests/helpers/tokens.ts`) — um
 * verificador simulado provaria que *alguma coisa* foi chamada, e o que este arquivo mede é o que
 * o **guard** e a **política** respondem.
 *
 * **O módulo é montado aqui, e não importado.** O harness compartilhado
 * (`tests/helpers/learner-routes-app.ts`) sobe os cinco controllers de rota — o de conteúdo e o
 * de prática também, com as suas dependências — e este arquivo mede **uma** rota. Montar o
 * módulo localmente é o que mantém a medição honesta: o que sobe aqui é o que a rota precisa, e
 * nada mais. E é o que impede que a correção de um controller vizinho (uma dependência nova, um
 * provider novo) altere o resultado de um teste que não a mede.
 */

import { Module } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'net';
import { DataSource } from 'typeorm';

import { configureApp } from '../../src/app.setup.js';
import { TOKEN_VERIFIER } from '../../src/modules/auth/tokens.js';
import { tokenVerifierFromEnv } from '../../src/infrastructure/auth/token-verifier-from-env.js';
import { LearnersController } from '../../src/modules/learners/learners.controller.js';
import { LearnersService } from '../../src/modules/learners/learners.service.js';
import { LearnerScopeService } from '../../src/modules/learners/learner-scope.service.js';
import { LearnerProfileRepository } from '../../src/infrastructure/repositories/learner-profile.repository.js';
import { UserIdentityRepository } from '../../src/infrastructure/repositories/user-identity.repository.js';
import { LearnerRepository } from '../../src/infrastructure/repositories/learner.repository.js';
import { PgSessionContext } from '../../src/infrastructure/persistence/pg-session-context.js';
import { createTestDb, type TestDbContext } from '../helpers/db.js';
import {
  authorization,
  clearOidcEnv,
  setOidcEnv,
  startTokenFixture,
  type TokenFixture,
} from '../helpers/tokens.js';

/** O chamador. É o `sub` de todos os tokens deste arquivo. */
const LEARNER_A = 'aaaaaaaa-aaaa-4111-8111-111111111111';
/** Outro learner, com uma conta própria — um 404 sobre ele não pode ser explicado pela ausência. */
const LEARNER_B = 'bbbbbbbb-bbbb-4222-8222-222222222222';
/** Ninguém. Um uuid bem formado sem linha. */
const ABSENT = 'cccccccc-cccc-4333-8333-333333333333';

const PROBLEM_MEDIA_TYPE = /^application\/problem\+json(; charset=utf-8)?$/;

/** Um PNG de 1×1, em base64 — o menor avatar que é uma imagem. */
const PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

/** `learner:self` — o escopo que a rota exige (ADR-038 D2). */
const LEARNER_SELF_SCOPE = 'learner:self';

/**
 * The module, composed inside a function because the `DataSource` is an argument.
 *
 * The harness's own pattern (`tests/helpers/learner-routes-app.ts`): a decorator's metadata is
 * read when the class is *defined*, so the connection has to be in scope at that moment — which
 * is why the class lives inside the function that receives it.
 */
function profileRoutesModule(dataSource: DataSource): new () => unknown {
  @Module({
    controllers: [LearnersController],
    providers: [
      LearnersService,
      LearnerScopeService,
      LearnerRepository,
      // A7b: the profile's four sources.
      LearnerProfileRepository,
      // The identity — the `users` row behind the display name, the e-mail and the avatar.
      UserIdentityRepository,
      PgSessionContext,
      // The `DataSource` is the harness's own — a role is a property of the connection the
      // application actually uses, and `SET ROLE` needs a connection, not a description.
      { provide: DataSource, useValue: dataSource },
      {
        provide: TOKEN_VERIFIER,
        useFactory: () => tokenVerifierFromEnv(),
      },
    ],
  })
  class ProfileRoutesHttpModule {}

  return ProfileRoutesHttpModule;
}

interface ProfileRoutesApp {
  /** `http://127.0.0.1:<ephemeral port>` — the app listens on port 0, so two specs cannot collide. */
  readonly base: string;
  /** The header a caller presents, for a real RS256 token whose `sub` is `subject`. */
  auth(subject: string): Promise<Record<string, string>>;
  close(): Promise<void>;
}

/**
 * Boot the module above through `configureApp` — the composition root `main.ts` calls — so the
 * guard, the pipes and the error filter are the deployed ones, and publish a real JWKS the
 * application fetches and verifies against.
 */
async function startProfileRoutesApp(dataSource: DataSource): Promise<ProfileRoutesApp> {
  const fixture: TokenFixture = await startTokenFixture();
  setOidcEnv(fixture);

  const app: INestApplication = await NestFactory.create(profileRoutesModule(dataSource) as never, {
    logger: false,
  });
  configureApp(app);
  await app.listen(0);
  const { port } = app.getHttpServer().address() as AddressInfo;

  return {
    base: `http://127.0.0.1:${port}`,
    auth: async (subject: string) =>
      authorization(await fixture.accessToken(subject, [LEARNER_SELF_SCOPE])),
    close: async () => {
      await app.close();
      clearOidcEnv();
      await fixture.close();
    },
  };
}

let testDb: TestDbContext;
let started: ProfileRoutesApp;
let AUTH: Record<string, string> = {};

function call(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${started.base}${path}`, { ...init, headers: { ...AUTH, ...(init.headers ?? {}) } });
}

function patch(path: string, body: unknown): Promise<Response> {
  return call(path, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Roda `work` com a ligação no papel da aplicação, e devolve o papel ao dono no fim.
 *
 * O mesmo formato que `rls-isolation.spec.ts` usa: `SET ROLE` na ligação do pool, `RESET ROLE` no
 * `finally` — para que nenhum teste deixe a ligação em outro papel.
 */
async function asApp<T>(work: () => Promise<T>): Promise<T> {
  await testDb.dataSource.query('SET ROLE its_platform_app');
  try {
    return await work();
  } finally {
    await testDb.dataSource.query('RESET ROLE');
  }
}

/** A linha de `users` do learner — lida como o dono, que é quem a escreve. */
async function accountOf(learnerId: string): Promise<{ display_name: string | null; avatar_url: string | null }> {
  const rows = (await testDb.dataSource.query(
    'SELECT display_name, avatar_url FROM users WHERE learner_id = $1',
    [learnerId],
  )) as Array<{ display_name: string | null; avatar_url: string | null }>;
  return rows[0] ?? { display_name: null, avatar_url: null };
}

beforeAll(async () => {
  testDb = await createTestDb();

  // As duas contas, como o dono, antes de qualquer papel trocado: a política precisa de duas
  // linhas para que um 404 sobre a segunda seja indistinguível de um fixture que não escreveu nada.
  await testDb.dataSource.query(
    `INSERT INTO learners (id) VALUES ($1), ($2) ON CONFLICT (id) DO NOTHING`,
    [LEARNER_A, LEARNER_B],
  );
  await testDb.dataSource.query(
    `INSERT INTO users (id, email, display_name, avatar_url, learner_id)
     VALUES ($1, 'ana@example.com', 'Ana', NULL, $3),
            ($2, 'bruno@example.com', 'Bruno', NULL, $4)
     ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name, learner_id = EXCLUDED.learner_id`,
    [
      'dddddddd-dddd-4444-8444-444444444444',
      'eeeeeeee-eeee-4555-8555-555555555555',
      LEARNER_A,
      LEARNER_B,
    ],
  );

  started = await startProfileRoutesApp(testDb.dataSource);
  AUTH = await started.auth(LEARNER_A);
});

afterAll(async () => {
  await started.close();
  await testDb.cleanup();
});

describe('RN16 — o PATCH grava o nome e a foto do aluno endereçado', () => {
  it('responde 200 com a identidade, e a linha mudou', async () => {
    const response = await patch(`/api/v1/learners/${LEARNER_A}/profile`, {
      display_name: 'Ana Souza',
      avatar_url: PNG_DATA_URL,
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      learner_id: LEARNER_A,
      display_name: 'Ana Souza',
      email: 'ana@example.com',
      avatar_url: PNG_DATA_URL,
      cefr_level: null,
    });

    expect(await accountOf(LEARNER_A)).toEqual({
      display_name: 'Ana Souza',
      avatar_url: PNG_DATA_URL,
    });
  });

  it('não toca na conta de outro learner', async () => {
    await patch(`/api/v1/learners/${LEARNER_A}/profile`, { display_name: 'Ana Souza' });

    expect(await accountOf(LEARNER_B)).toEqual({ display_name: 'Bruno', avatar_url: null });
  });

  it('publica a identidade no GET do perfil', async () => {
    await patch(`/api/v1/learners/${LEARNER_A}/profile`, { display_name: 'Ana Souza' });

    const response = await call(`/api/v1/learners/${LEARNER_A}/profile`);

    expect(response.status).toBe(200);
    const body = (await response.json()) as Record<string, unknown>;
    expect(body['display_name']).toBe('Ana Souza');
    expect(body['email']).toBe('ana@example.com');
    expect(body).toHaveProperty('avatar_url');
  });
});

describe('RN17 — a escrita para a linha de outro learner não acontece', () => {
  it('responde 404 — o mesmo 404 de um learner inexistente', async () => {
    const foreign = await asApp(() =>
      patch(`/api/v1/learners/${LEARNER_B}/profile`, { display_name: 'Invadido' }),
    );
    const absent = await asApp(() => patch(`/api/v1/learners/${ABSENT}/profile`, { display_name: 'Invadido' }));

    expect(foreign.status).toBe(404);
    expect(absent.status).toBe(404);

    // A conta do outro learner é a mesma linha nos dois casos — e está intacta.
    expect(await accountOf(LEARNER_B)).toEqual({ display_name: 'Bruno', avatar_url: null });
  });
});

describe('RN18 — o que o contrato recusa é recusado com 400', () => {
  it('recusa um SVG, um http e um data URL que não é imagem', async () => {
    for (const avatar_url of [
      'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
      'http://cdn.example.com/ana.png',
      'data:text/html;base64,PGgxPm9pPC9oMT4=',
    ]) {
      const response = await patch(`/api/v1/learners/${LEARNER_A}/profile`, { avatar_url });

      expect(response.status).toBe(400);
      expect(response.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
    }
  });

  it('recusa um nome de espaços e um nome de 81 caracteres', async () => {
    expect((await patch(`/api/v1/learners/${LEARNER_A}/profile`, { display_name: '   ' })).status).toBe(400);
    expect(
      (await patch(`/api/v1/learners/${LEARNER_A}/profile`, { display_name: 'a'.repeat(81) })).status,
    ).toBe(400);
  });

  it('recusa um membro que o contrato não declara', async () => {
    const response = await patch(`/api/v1/learners/${LEARNER_A}/profile`, {
      displayName: 'Ana',
      email: 'outro@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
  });
});

describe('RN19 — a rota exige uma credencial', () => {
  it('responde 401 sem token, e 401 com um token que não verifica', async () => {
    const anonymous = await fetch(`${started.base}/api/v1/learners/${LEARNER_A}/profile`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ display_name: 'Ana' }),
    });

    expect(anonymous.status).toBe(401);
    expect(anonymous.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
  });
});
