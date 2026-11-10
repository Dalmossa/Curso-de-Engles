---
name: property-testing
description: Use ao testar algoritmos do domínio (BKT, FSRS, mastery gate) e parsers com testes de propriedade usando fast-check + Jest.
---

# Property-Based Testing — ITS Platform (fast-check)

> Antes Hypothesis/pytest (Python). Este repo usa **fast-check ^4** (já no `devDependencies`) + Jest ESM.

## When to Use

- Algoritmos com propriedades matemáticas (BKT, FSRS, mastery gate) em `src/domain/services/`
- Parsers com invariante de round-trip
- Achar casos-limite que testes por exemplo erram

## Onde

- `tests/property/*.spec.ts` — a pasta já existe (hoje vazia), padrão Jest `*.spec.ts`.
- Rodar: `npm run test:unit -- tests/property` (Jest ESM via `--experimental-vm-modules`).
- Alvo: camada `domain/` pura (sem Nest/DB) — ver `clean-architecture`.

## Padrão básico

```ts
// tests/property/bkt-engine.property.spec.ts
import fc from 'fast-check';
import { BktEngine } from '../../src/domain/services/bkt-engine.service.js';

const params = { pL0: 0.3, pT: 0.15, pS: 0.1, pG: 0.2 };

// Limites: evita NaN/Infinity — sempre noNaN em floats de probabilidade
const prob = fc.double({ min: 0, max: 1, noNaN: true });

describe('BktEngine — propriedades', () => {
  it('pKnow do posterior fica sempre em [0, 1]', () => {
    fc.assert(
      fc.property(prob, fc.boolean(), (pKnow, correct) => {
        const engine = new BktEngine(params);
        const state = { pKnow, pLearn: params.pT, pSlip: params.pS, pGuess: params.pG };
        const result = engine.update(state, correct);
        expect(result.stateAfter.pKnow).toBeGreaterThanOrEqual(0);
        expect(result.stateAfter.pKnow).toBeLessThanOrEqual(1);
      }),
      { numRuns: 1000 },
    );
  });

  it('resposta correta sempre supera (ou empata) a incorreta no mesmo estado', () => {
    fc.assert(
      fc.property(prob, (pKnow) => {
        const engine = new BktEngine(params);
        const base = { pKnow, pLearn: params.pT, pSlip: params.pS, pGuess: params.pG };
        const acerto = engine.update({ ...base }, true).stateAfter.pKnow;
        const erro = engine.update({ ...base }, false).stateAfter.pKnow;
        expect(acerto).toBeGreaterThanOrEqual(erro);
      }),
      { numRuns: 1000 },
    );
  });
});
```

## Propriedades-alvo por módulo

| Módulo (arquivo real) | Propriedades |
|---|---|
| `bkt-engine.service.ts` | `stateAfter.pKnow ∈ [0,1]`; monotonicidade (correto ≥ incorreto); convergência: N correções → pKnow → 1; `pKnowDelta ≥ 0` após acerto |
| `fsrs-scheduler.service.ts` | `getRetrievability(stability, elapsedDays) ∈ [0,1]` e não crescente nos `elapsedDays`; `review()` nunca produz estabilidade negativa; `FsrsRating` só aceita `1 \| 2 \| 3 \| 4` |
| `mastery-gate.service.ts` | `allPass(map)` true ⇔ todos os `evaluate(...)` passam; resultado determinístico para a mesma evidência |
| parsers (packs/lessons) | round-trip: `parse(serialize(x))` ≡ `x`; parser nunca lança para entrada estruturalmente válida |

## Arbitraries customizados (fc.record / fc.constantFrom)

```ts
const lessonId = fc
  .string({ minLength: 1, maxLength: 30 })
  .map((s) => s.toLowerCase().replace(/[^a-z0-9_]/g, ''))
  .chain((slug) => fc.constantFrom('les', 'pack', 'dlg').map((p) => `${p}_${slug}`));

const evidence = fc.record({
  learnerId: fc.uuid(),
  itemId: lessonId,
  correct: fc.boolean(),
  responseTimeMs: fc.integer({ min: 200, max: 120_000 }),
});
```

## Reprodutibilidade e debugging

- Falha de `fc.assert` imprime o **seed** — reproduza com `{ seed: <n>, endOnFailure: true }`.
- Local rápido: `{ numRuns: 100 }`; CI/nightly: `{ numRuns: 1000 }` (como no exemplo).
- Shrink automatizado: o fast-check reduz a entrada ao contraexemplo mínimo — leia o valor reportado, não reinvente reprodução manual.
- `numRuns` alto em CI não substitui testes por exemplo para caminhos conhecidos (boundary explícito continua sendo teste unitário).

## Checklist

- [ ] Testes em `tests/property/*.spec.ts`, fast-check + Jest (nada de framework extra)
- [ ] `noNaN: true` em floats de probabilidade
- [ ] Propriedades do módulo tabelado cobertas (BKT primeiro — ≥ 90% do score de mutação, ver `mutation-testing`)
- [ ] Seed anotado no CI para repro
- [ ] `npm run test:unit -- tests/property` verde
