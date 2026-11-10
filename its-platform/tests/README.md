# Test Strategy — ITS Platform

**Philosophy:** Test Pyramid + Contract Testing + Property-Based Testing
**Source:** `ITS-ARCHITECTURE.md` §5, `CONSTITUTION.md` §3
**Stack de teste:** Jest 29 + ts-jest (`jest.config.ts`) · fast-check (property) · Stryker (mutation) · PGlite (dev) + PostgreSQL real (RLS)

---

## Test Pyramid

```
        ┌─────────────┐
        │   E2E / BDD │  ← 10%  (PRD milestones, critical paths)
        │ Gherkin/Jest│
        └─────────────┘
      ┌───────────────────┐
      │  Contract Tests   │  ← 20%  (Spec ↔ Implementation)
      │  (Schema, Specs)  │
      └───────────────────┘
    ┌───────────────────────────┐
    │  Integration Tests        │  ← 30%  (Service interactions)
    │  (DB, Redis, BullMQ, Kong)│
    └───────────────────────────┘
  ┌───────────────────────────────────┐
  │  Unit Tests + Property Tests      │  ← 40%  (Pure functions, invariants)
  │  (BKT, FSRS, mastery gate, parsers)│
  └───────────────────────────────────┘
```

---

## 1. Unit Tests (40%)

### Target: Pure functions, algorithms, parsers

```bash
# Run unit tests (ESM via --experimental-vm-modules — já embutido no script)
npm run test:unit
# Com coverage
npm run test:cov
```

### Key Modules to Test (arquivos reais)

| Module | What to Test | Property Tests |
|---|---|---|
| `src/domain/services/bkt-engine.service.ts` | `BktEngine.update(state, correct)` | `0 ≤ stateAfter.pKnow ≤ 1`, monotonic in evidence |
| `src/domain/services/fsrs-scheduler.service.ts` | `review()`, `getRetrievability(stability, elapsedDays)` | retrievability ∈ [0,1] e não crescente no tempo |
| `src/domain/services/mastery-gate.service.ts` | `evaluate(evidence)`, `allPass(map)` | `allPass` ⇔ todos os `evaluate` passam |
| `src/domain/services/adaptive-engine.service.ts` | orquestração BKT + FSRS | invariantes compõem sem violar limites |
| `src/domain/services/next-activity-selector.ts` | seleção i+1, pré-requisitos | retorna nó válido, respeita DAG |
| `src/domain/services/diagnostic-placement.service.ts` | parada por SE, mapping de start node | SE decresce com mais itens |
| parsers/loaders de conteúdo (ADR-020/022) | pack canonical/legacy, lesson FASE 1-4 | item_id prefix ↔ skill namespace, round-trip |

### Property-Based Testing (fast-check)

```ts
// tests/property/bkt-engine.property.spec.ts
import fc from 'fast-check';
import { BktEngine } from '../../src/domain/services/bkt-engine.service.js';

const prob = fc.double({ min: 0, max: 1, noNaN: true });
const params = { pL0: 0.3, pT: 0.15, pS: 0.1, pG: 0.2 };

// bounds: posterior sempre em [0, 1]
fc.assert(
  fc.property(prob, fc.boolean(), (pKnow, correct) => {
    const engine = new BktEngine(params);
    const r = engine.update({ pKnow, pLearn: params.pT, pSlip: params.pS, pGuess: params.pG }, correct);
    expect(r.stateAfter.pKnow).toBeGreaterThanOrEqual(0);
    expect(r.stateAfter.pKnow).toBeLessThanOrEqual(1);
  }),
  { numRuns: 1000 },
);

// monotonicidade: acerto sempre supera (ou empata) o erro no mesmo estado
fc.assert(
  fc.property(prob, (pKnow) => {
    const base = { pKnow, pLearn: params.pT, pSlip: params.pS, pGuess: params.pG };
    const acerto = new BktEngine(params).update({ ...base }, true).stateAfter.pKnow;
    const erro = new BktEngine(params).update({ ...base }, false).stateAfter.pKnow;
    expect(acerto).toBeGreaterThanOrEqual(erro);
  }),
  { numRuns: 1000 },
);
```

- Testes em `tests/property/*.spec.ts` (pasta reservada)
- Falha de `fc.assert` imprime o **seed** — reproduza com `{ seed, endOnFailure: true }`

---

## 2. Integration Tests (30%)

### Target: Service interactions, DB, Redis, BullMQ, Kong

```bash
npm run test:integration
```

- Suites PGlite constroem o schema completo (33 tabelas, 45 policies RLS) em `beforeAll` — por isso `testTimeout: 30000` no `jest.config.ts`
- Helpers reais em `tests/helpers/`: `db.ts` (PGlite), `fixtures.ts`, `tokens.ts` (auth), `learner-routes-app.ts`
- **RLS/GUC só valem em PostgreSQL real** (ADR-014) — PGlite verde não prova isolamento

### Key Integration Points

| Test | What It Validates |
|---|---|
| `test_practice_submission_flow` | API → BullMQ → BKT update → DB → FSRS schedule |
| `test_diagnostic_placement_flow` | API → θ estimation → start node mapping |
| `test_lesson_rendering` | Content loader → FASE 1-4 → learner_model JSON |
| `test_listening_delivery` | Shipped items only, Q-L2 ≥ 45s |
| `test_rls_isolation` | Learner A cannot read Learner B's data (PG real) |
| `test_kong_jwt_validation` | Invalid JWT → 401, valid JWT → 200 |
| `test_kong_rate_limiting` | 101st request → 429 |
| `test_bullmq_retry_dlq` | Max retries → dead letter queue |
| `test_migration_round_trip` | migration up → revert → up (PGlite e PG real) |

---

## 3. Contract Tests (20%)

### Target: Spec ↔ Implementation compliance

```bash
npm run contract:gate          # scripts/contract-gate.mjs — falha se código e spec divergirem
npm run test:unit -- tests/contract   # gate.spec.ts + schemas.spec.ts
```

### Contract Test Categories

| Contract | Test File | Spec Source |
|---|---|---|
| OpenAPI ↔ NestJS | `tests/contract/gate.spec.ts` + `contract:gate` | `api-spec.openapi.yaml` |
| Schemas/DTOs ↔ OpenAPI | `tests/contract/schemas.spec.ts` | `api-spec.openapi.yaml` |
| Lesson schema | *planned* | `post-lesson-practice-spec.md` §3 |
| Pack schema (both) | *planned* | `post-lesson-practice-spec.md` §8 |
| Assessment item | *planned* | `assessment-item-spec.md` §1.2 |
| Listening corpus | *planned* | `listening-corpus-spec.md` §3 |
| Curriculum graph | *planned* | `curriculum-graph-spec.md` §4.3 |
| Adaptive params | *planned* | `stats-progress-evaluation-spec.md` §2-4 |
| Diagnostic blueprint | *planned* | `diagnostic-spec.md` §2 |

### Example: endpoint presence no contrato

```ts
// tests/contract/gate.spec.ts (padrão real)
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const spec = parse(readFileSync('docs/api-spec.openapi.yaml', 'utf8'));

it.each([
  ['post', '/v1/learners/{id}/placement'],
  ['get', '/v1/learners/{id}/next'],
  ['post', '/v1/learners/{id}/practice'],
  ['get', '/v1/content/lessons/{id}'],
])('%s %s existe no contrato', (method, path) => {
  expect(spec.paths[path]).toBeDefined();
  expect(spec.paths[path][method]).toBeDefined();
});
```

- Exemplos obrigatórios em request/response bodies da spec (gate verifica)

---

## 4. BDD / E2E Tests (10%)

### Target: PRD Milestones, Critical User Journeys

```bash
npm run test:bdd
# Cenário específico (filtro de nome)
npm run test:bdd -- -t "Mastery gate"
```

- Cenários Gherkin (formato vivo) em `tests/bdd/README.md` — mapeados 1:1 com PRD §9 (M1–M7)
- Steps implementados como testes Jest em TypeScript

---

## Test Configuration

Arquivo real: `jest.config.ts` (ts-jest, environment node, roots `tests/` + `src/`):

- `testMatch: ['**/*.spec.ts', '**/*.test.ts']`
- `testTimeout: 30000` — suites PGlite constroem schema completo (33 tabelas, 45 RLS policies)
- `moduleNameMapper`: `@/` → `src/`, e strip de `.js` em imports relativos (ESM)
- Coverage: `src/**`, reporters text/lcov/html, `coverageDirectory: coverage`
- `coverageThreshold.global`: 80% (branches/functions/lines/statements)

### Coverage Targets

| Layer | Target | Rationale |
|---|---|---|
| Unit (algorithms) | 95% | Pure functions, fully testable |
| Unit (parsers) | 90% | Edge cases in markdown parsing |
| Integration | 80% | DB/Redis interactions |
| Contract | 100% | Every spec endpoint covered |
| BDD | 100% of PRD milestones | Critical paths only |

---

## CI Pipeline (npm scripts reais)

```yaml
# .github/workflows/test.yml
jobs:
  unit:
    steps:
      - uses: actions/setup-node@v4   # Node 20+
      - run: npm ci
      - run: npm run test:unit -- --coverage   # threshold global 80%, alvo 90%+

  integration:
    services:
      postgres: { image: postgres:16 }
      redis:    { image: redis:7 }
    steps:
      - run: npm run test:integration   # PGlite + PG real (RLS)

  contract:
    steps:
      - run: npm run contract:gate
      - run: npm run test:unit -- tests/contract

  bdd:
    steps:
      - run: npm run test:bdd

  quality:
    steps:
      - run: npm run domain:check      # domain/ puro (sem Nest/TypeORM)
      - run: npm run rls:check         # contexto RLS por transação
      - run: npm run kong:check        # config declarativa do gateway
      - run: python3 verify-integrity.py   # gates de conteúdo do repo
      - run: python3 prd-score.py
```

- **Gate**: all jobs must pass → merge allowed (`npm run test:gate`)

---

## Mutation Testing (Periodic — Stryker)

```bash
# Semanal ou em release branches (lento — não em todo PR)
cd its-platform
NODE_OPTIONS=--experimental-vm-modules npx stryker run
# relatório: reports/mutation/index.html
```

- Escopo: `src/domain/services/` (BKT, FSRS, mastery gate, adaptive engine)
- Target: **mutation score ≥ 85%** (BKT ≥ 90%)
- Stryker **ainda não está instalado** — `npm i -D @stryker-mutator/core @stryker-mutator/jest-runner` antes do primeiro run (ver skill `mutation-testing`)

---

## Test Data Management

| Approach | When |
|---|---|
| **Factories** (funções TS em `tests/helpers/fixtures.ts`) | Unit/Integration — consistent test data |
| **Fixtures** (Jest setup + `tests/helpers/db.ts`) | Shared setup (PGlite DB, tokens de auth) |
| **Snapshots** (`toMatchSnapshot()`) | Contract tests — freeze JSON responses |
| **Property-based** (fast-check) | Algorithms — BKT, FSRS, mastery gate invariants |
| **Golden files** | Parser tests — markdown ↔ parsed object |
