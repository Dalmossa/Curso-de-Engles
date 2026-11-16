/**
 * `GET /api/v1/learners/{learner_id}/data-export` e `DELETE /api/v1/learners/{learner_id}` —
 * os dois direitos da LGPD (Art. 18), provados sobre HTTP, com o banco de verdade.
 *
 * **Por que este arquivo existe.** A rota da exportação estava escrita contra colunas que
 * **nunca existiram**: a tabela `diagnostic_results` guarda θ em `theta` e não tem
 * `completed_at`, e `practice_attempts` não tem `score` — tem `total_items` e `correct_count`.
 * A consulta falhava com `coluna "theta_estimate" não existe`, e o download respondia `500`.
 * A rota da exclusão falhava por três motivos diferentes, e cada um deles é uma forma de a
 * apagamento **não acontecer**:
 *
 * 1. `DELETE FROM append_only_events` — o trigger `trg_append_only_guard` recusa a operação.
 *    E está certo: ADR-042 R3 rejeita "apagar = apagar as linhas do log" **pelo nome**, e o
 *    log fica; o `ON DELETE SET NULL` da FK anonimiza o vínculo.
 * 2. `DELETE FROM user_sessions WHERE learner_id = $1` — a tabela não tem `learner_id`; ela
 *    pendura em `users`. O erro de coluna desfaz a transação inteira.
 * 3. A conta (`users`) sobrevivia à eliminação — e quem sobrevive pode entrar de novo e
 *    receber um learner novo de `ensureLearner`. Isso não é eliminação; é um reset com atraso.
 *
 * **O que o teste mede, e o que ele não mede.** Ele mede que a rota **responde** com o arquivo
 * que o contrato promete, e que a eliminação **apaga** as linhas do chamador. Ele não mede que
 * a eliminação apaga os dados de outra pessoa — essa é a RLS, e a política que decide quem é
 * visível é `withVisible`, o mesmo mecanismo que o `404` de um id alheio usa.
 *
 * **A aplicação é a real**: os controllers, a URL versionada, `configureApp`, o `ValidationPipe`
 * global e o `ProblemExceptionFilter`. A credencial é um token RS256 de verdade verificado
 * contra uma JWKS de verdade (`tests/helpers/tokens.ts`).
 *
 * **O módulo é montado aqui, e não importado.** O harness compartilhado sobe cinco controllers
 * de rota; este arquivo mede **duas** rotas, e uma delas apaga. Montar o módulo localmente é o
 * que mantém a medição honesta: o que sobe aqui é o que a rota precisa, e nada mais.
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
/** A conta do chamador — a linha `users` que a eliminação tem de apagar. */
const USER_A = 'dddddddd-dddd-4444-8444-444444444444';
/** Outro learner, com conta própria: um 404 sobre ele não pode ser explicado pela ausência. */
const LEARNER_B = 'bbbbbbbb-bbbb-4222-8222-222222222222';
const USER_B = 'eeeeeeee-eeee-4555-8555-555555555555';

const PROBLEM_MEDIA_TYPE = /^application\/problem\+json(; charset=utf-8)?$/;

/**
 * The module, composed inside a function because the `DataSource` is an argument.
 *
 * O padrão do harness (`tests/helpers/learner-routes-app.ts`): a metadata de um decorator é lida
 * quando a classe é **definida**, então a conexão precisa estar em escopo nesse momento.
 */
function lgpdRoutesModule(dataSource: DataSource): new () => unknown {
  @Module({
    controllers: [LearnersController],
    providers: [
      LearnersService,
      LearnerScopeService,
      LearnerRepository,
      LearnerProfileRepository,
      UserIdentityRepository,
      PgSessionContext,
      { provide: DataSource, useValue: dataSource },
      {
        provide: TOKEN_VERIFIER,
        useFactory: () => tokenVerifierFromEnv(),
      },
    ],
  })
  class LgpdRoutesHttpModule {}

  return LgpdRoutesHttpModule;
}

interface LgpdRoutesApp {
  /** `http://127.0.0.1:<porta efêmera>` — a aplicação escuta na porta 0, então dois specs não colidem. */
  readonly base: string;
  /** O header que um chamador apresenta, para um token RS256 real cujo `sub` é `subject`. */
  auth(subject: string, scopes: string[]): Promise<Record<string, string>>;
  close(): Promise<void>;
}

async function startLgpdRoutesApp(dataSource: DataSource): Promise<LgpdRoutesApp> {
  const fixture: TokenFixture = await startTokenFixture();
  setOidcEnv(fixture);

  const app: INestApplication = await NestFactory.create(lgpdRoutesModule(dataSource) as never, {
    logger: false,
  });
  configureApp(app);
  await app.listen(0);
  const { port } = app.getHttpServer().address() as AddressInfo;

  return {
    base: `http://127.0.0.1:${port}`,
    auth: async (subject: string, scopes: string[]) =>
      authorization(await fixture.accessToken(subject, scopes)),
    close: async () => {
      await app.close();
      clearOidcEnv();
      await fixture.close();
    },
  };
}

let testDb: TestDbContext;
let started: LgpdRoutesApp;

/**
 * Roda `work` com a ligação no papel da aplicação, e devolve o papel ao dono no fim.
 *
 * O mesmo formato que `learner-profile-update.spec.ts` usa: `SET ROLE` na ligação do pool,
 * `RESET ROLE` no `finally`. **A ligação tem de estar no papel da aplicação durante a
 * requisição** — como o dono, a ligação vê todas as linhas e a RLS não decide nada: um 404
 * sobre o learner de outro sairia como 200, e o teste mediria o dono, não a política.
 */
async function asApp<T>(work: () => Promise<T>): Promise<T> {
  await testDb.dataSource.query('SET ROLE its_platform_app');
  try {
    return await work();
  } finally {
    await testDb.dataSource.query('RESET ROLE');
  }
}

/** Uma requisição ao servidor — sempre sob o papel da aplicação, como em produção. */
function call(path: string, init: RequestInit = {}): Promise<Response> {
  return asApp(() => fetch(`${started.base}${path}`, init));
}

async function countRows(table: string, learnerId: string): Promise<number> {
  const rows = (await testDb.dataSource.query(
    `SELECT count(*)::int AS n FROM ${table} WHERE learner_id = $1`,
    [learnerId],
  )) as Array<{ n: number }>;
  return rows[0]?.n ?? 0;
}

/** A linha do learner — a tabela se chama por `id`, não por `learner_id`. */
async function learnerExists(learnerId: string): Promise<boolean> {
  const rows = (await testDb.dataSource.query('SELECT id FROM learners WHERE id = $1', [
    learnerId,
  ])) as Array<{ id: string }>;
  return rows.length > 0;
}

beforeAll(async () => {
  testDb = await createTestDb();

  // As duas contas, como o dono, antes de qualquer papel trocado.
  await testDb.dataSource.query(
    `INSERT INTO learners (id) VALUES ($1), ($2) ON CONFLICT (id) DO NOTHING`,
    [LEARNER_A, LEARNER_B],
  );
  await testDb.dataSource.query(
    `INSERT INTO users (id, email, display_name, avatar_url, learner_id)
     VALUES ($1, 'ana@example.com', 'Ana', NULL, $3),
            ($2, 'bruno@example.com', 'Bruno', NULL, $4)
     ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name, learner_id = EXCLUDED.learner_id`,
    [USER_A, USER_B, LEARNER_A, LEARNER_B],
  );

  // Uma sessão da conta do chamador: a eliminação tem de levá-la junto, porque a sessão é o que
  // continuaria dando acesso depois de "apagar a conta".
  await testDb.dataSource.query(
    `INSERT INTO user_sessions (id, user_id, token_hash, expires_at)
     VALUES ('11111111-1111-4111-8111-111111111111', $1, 'hash-de-teste', now() + interval '1 day')`,
    [USER_A],
  );

  // As faixas CEFR: `modules.cefr_level`, `lessons.cefr_level` e `diagnostic_results.cefr`
  // apontam para `cefr_levels(code)`, e a tabela nasce vazia.
  await testDb.dataSource.query(
    `INSERT INTO cefr_levels (code, label, sort_order, theta_threshold)
     VALUES ('A1', 'Iniciante', 1, -1.000), ('A2', 'Elementar', 2, 0.000)
     ON CONFLICT (code) DO NOTHING`,
  );

  // Um módulo e uma lição: `diagnostic_results.start_node` referencia `lessons(id)`, e a lição
  // referencia o módulo. Sem as duas linhas o diagnóstico não entra.
  await testDb.dataSource.query(
    `INSERT INTO modules (id, title, cefr_level, track, source_markdowns, sort_order, expected_lessons)
     VALUES ('mod_de_teste', 'Módulo de teste', 'A2', 'General', ARRAY[]::varchar[], 1, 1)
     ON CONFLICT (id) DO NOTHING`,
  );
  await testDb.dataSource.query(
    `INSERT INTO lessons (id, module_id, title, cefr_level, reuse_basis, authoring_state,
                          publication_state, permission_state, source_ref)
     VALUES ('les_de_teste', 'mod_de_teste', 'Lição de teste', 'A2', 'cite_only', 'authored',
             'publishable', 'not_required', 'fonte-de-teste')
     ON CONFLICT (id) DO NOTHING`,
  );

  // Um diagnóstico e uma tentativa de prática — as duas linhas que a exportação promete ler.
  // **Os valores são os que a tabela realmente guarda**: `theta` (não `theta_estimate`) e
  // `total_items`/`correct_count` (não `score`/`total_count`).
  await testDb.dataSource.query(
    `INSERT INTO diagnostic_results (
        id, learner_id, form_version, theta, se_statistical, se_parameter, se_effective,
        precision_label, ci95_lower, ci95_upper, cefr, start_cefr, start_node,
        stopping_rule, skill_theta)
     VALUES ('22222222-2222-4222-8222-222222222222', $1, 'diagnostic_form_v1',
             0.750, 0.300, 0.300, 0.300, 'good', 0.200, 1.300, 'A2', 'A1',
             'les_de_teste', 'cefr_based', '{}'::jsonb)`,
    [LEARNER_A],
  );
  // O pacote: `practice_attempts.pack_id` aponta para ele.
  await testDb.dataSource.query(
    `INSERT INTO packs (id, lesson_id, schema_version, reuse_basis, manifest, item_ids)
     VALUES ('pack_de_teste', 'les_de_teste', 'canonical', 'cite_only', '{}'::jsonb, ARRAY[]::varchar[])`,
  );

  // A sessão de aprendizagem: `practice_attempts.session_id` aponta para ela.
  await testDb.dataSource.query(
    `INSERT INTO sessions (id, learner_id) VALUES ('44444444-4444-4444-8444-444444444444', $1)`,
    [LEARNER_A],
  );
  await testDb.dataSource.query(
    `INSERT INTO practice_attempts (id, session_id, learner_id, pack_layer, pack_id, started_at,
                                    completed_at, total_items, correct_count)
     VALUES ('33333333-3333-4333-8333-333333333333', '44444444-4444-4444-8444-444444444444',
             $1, 'L1', 'pack_de_teste', now(), now(), 4, 3)`,
    [LEARNER_A],
  );
  await testDb.dataSource.query(
    `INSERT INTO consent_records (learner_id, purpose, version, legal_basis, granted_at)
     VALUES ($1, 'personalization', 'v1', 'consent', now())`,
    [LEARNER_A],
  );

  started = await startLgpdRoutesApp(testDb.dataSource);
});

afterAll(async () => {
  await started.close();
  await testDb.cleanup();
});

describe('RN28 — a exportação entrega o arquivo que o contrato promete', () => {
  it('responde 200 com o JSON do contrato', async () => {
    const auth = await started.auth(LEARNER_A, ['learner:export']);
    const response = await call(`/api/v1/learners/${LEARNER_A}/data-export`, { headers: auth });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      learner: {
        learner_id: LEARNER_A,
        created_at: expect.any(String),
        last_active_at: null,
      },
      profile: {
        // A faixa vem do **último diagnóstico concluído** — a mesma origem que o perfil publica.
        cefr_level: 'A2',
        mastery: {},
        theta_estimates: {},
        fsrs_states: {},
        preferences: {
          recast_enabled: true,
          meta_button_enabled: true,
          audio_autoplay: false,
          daily_goal_minutes: 15,
        },
      },
      diagnostics: [
        {
          id: '22222222-2222-4222-8222-222222222222',
          cefr: 'A2',
          theta_estimate: 0.75,
          skill_theta: {},
          form_version: 'diagnostic_form_v1',
          completed_at: expect.any(String),
        },
      ],
      practice: [
        {
          id: '33333333-3333-4333-8333-333333333333',
          pack_id: 'pack_de_teste',
          score: 0.75,
          correct_count: 3,
          total_count: 4,
          started_at: expect.any(String),
          completed_at: expect.any(String),
        },
      ],
      consents: [
        {
          purpose: 'personalization',
          version: 'v1',
          granted_at: expect.any(String),
          withdrawn_at: null,
          legal_basis: 'consent',
        },
      ],
      exported_at: expect.any(String),
    });
  });

  it('lê o θ da coluna que a tabela tem, e não de uma que não existe', async () => {
    const auth = await started.auth(LEARNER_A, ['learner:export']);
    const response = await call(`/api/v1/learners/${LEARNER_A}/data-export`, { headers: auth });

    const body = (await response.json()) as {
      diagnostics: Array<{ theta_estimate: number }>;
      practice: Array<{ score: number; total_count: number }>;
    };

    // `diagnostic_results.theta` = 0.750 → o contrato publica `theta_estimate`.
    expect(body.diagnostics[0]?.theta_estimate).toBeCloseTo(0.75, 6);
    // `practice_attempts` guarda `total_items` e `correct_count`; a razão é o `score`.
    expect(body.practice[0]?.total_count).toBe(4);
    expect(body.practice[0]?.score).toBeCloseTo(0.75, 6);
  });

  it('recusa quem não tem o escopo `learner:export`', async () => {
    const auth = await started.auth(LEARNER_A, ['learner:self']);
    const response = await call(`/api/v1/learners/${LEARNER_A}/data-export`, { headers: auth });

    expect(response.status).toBe(403);
    expect(response.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
  });

  it('responde 404 sobre o learner de outro, sem confirmar a existência', async () => {
    const auth = await started.auth(LEARNER_A, ['learner:export']);
    const response = await call(`/api/v1/learners/${LEARNER_B}/data-export`, { headers: auth });

    expect(response.status).toBe(404);
    expect(response.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
  });
});

describe('RN29 — a eliminação apaga a conta, e só a conta', () => {
  it('responde 204 e apaga o learner, a conta, a sessão e os dados do chamador', async () => {
    const auth = await started.auth(LEARNER_A, ['learner:erase']);
    const response = await call(`/api/v1/learners/${LEARNER_A}`, {
      method: 'DELETE',
      headers: auth,
    });

    expect(response.status).toBe(204);

    // O learner e os dados que ele carrega.
    expect(await learnerExists(LEARNER_A)).toBe(false);
    expect(await countRows('diagnostic_results', LEARNER_A)).toBe(0);
    expect(await countRows('practice_attempts', LEARNER_A)).toBe(0);
    expect(await countRows('consent_records', LEARNER_A)).toBe(0);

    // A conta — e a sessão, que pendurava nela.
    const accounts = (await testDb.dataSource.query('SELECT id FROM users WHERE id = $1', [
      USER_A,
    ])) as Array<{ id: string }>;
    expect(accounts).toHaveLength(0);

    const sessions = (await testDb.dataSource.query(
      'SELECT id FROM user_sessions WHERE user_id = $1',
      [USER_A],
    )) as Array<{ id: string }>;
    expect(sessions).toHaveLength(0);
  });

  it('deixa a conta do outro learner intacta', async () => {
    const accounts = (await testDb.dataSource.query('SELECT id FROM users WHERE id = $1', [
      USER_B,
    ])) as Array<{ id: string }>;
    expect(accounts).toHaveLength(1);
  });

  it('recusa quem não tem o escopo `learner:erase`', async () => {
    const auth = await started.auth(LEARNER_B, ['learner:self']);
    const response = await call(`/api/v1/learners/${LEARNER_B}`, {
      method: 'DELETE',
      headers: auth,
    });

    expect(response.status).toBe(403);
    expect(response.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
  });
});
