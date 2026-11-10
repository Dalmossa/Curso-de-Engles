---
name: mutation-testing
description: Use ao medir a efetividade da suite de testes do domínio com mutation testing (Stryker) no ITS Platform.
---

# Mutation Testing — ITS Platform (Stryker)

> Antes mutmut (Python). Este repo é TypeScript/Jest: a ferramenta é **Stryker**. **Ainda não está instalada** — instale antes de usar.

## When to Use

- Medir a efetividade real da suite (cobertura mente; mutation score não)
- Garantir que os testes de BKT/FSRS/mastery gate pegam bugs de lógica
- Quality gate de release

## Setup (uma vez)

```bash
cd its-platform
npm i -D @stryker-mutator/core @stryker-mutator/jest-runner
```

```js
// its-platform/stryker.config.mjs
export default {
  testRunner: 'jest',
  jest: { projectType: 'jest' },
  mutate: [
    'src/domain/services/bkt-engine.service.ts',
    'src/domain/services/fsrs-scheduler.service.ts',
    'src/domain/services/mastery-gate.service.ts',
    'src/domain/services/adaptive-engine.service.ts',
    'src/domain/services/next-activity-selector.ts',
  ],
  thresholds: { mutationScore: 85, highMutationScore: 90, lowMutationScore: 75 },
  reporters: ['progress', 'html', 'clear-text'],
};
```

## Rodando

```bash
cd its-platform
NODE_OPTIONS=--experimental-vm-modules npx stryker run   # ESM: mesmo flag do Jest do repo
# relatório: reports/mutation/index.html
```

- Escopo só no `domain/` puro (regras matemáticas); infraestrutura (DB, filas) é caro e irrelevante para mutação.

## Target Scores

| Arquivo real | Score alvo | Rationale |
|---|---|---|
| `bkt-engine.service.ts` | ≥ 90% | Algoritmo central de mastery |
| `fsrs-scheduler.service.ts` | ≥ 85% | Agendador de repetição espaçada |
| `mastery-gate.service.ts` | ≥ 85% | Gate de progressão (≥80% mastery) |
| `adaptive-engine.service.ts` | ≥ 80% | Orquestrador |
| `next-activity-selector.ts` | ≥ 80% | Seleção i+1 |

## Interpretação de status

- **Killed** ✅ — teste pegou a mutação
- **Survived** ❌ — mutação sobreviveu = **gap de teste** (prioridade)
- **NoCoverage** ⚠️ — código sem teste algum (pior que survived)
- **Timeout / Runtime error** ⏱️ — investigar (loop infinito ou mutação inválida)

## Corrigindo survivors

```ts
// Exemplo: sinal trocado sobreviveu em bkt-engine
// Original: delta = pKnow * (1 - slip);   Mutante: delta = pKnow * slip
// Teste que mata o mutante:
it('slip maior reduz o ganho de mastery em acerto', () => {
  const engine = new BktEngine({ pL0: 0.3, pT: 0.15, pS: 0.3, pG: 0.2 });
  const alto = engine.update({ pKnow: 0.5, pLearn: 0.15, pSlip: 0.3, pGuess: 0.2 }, true);
  const baixo = engine.update({ pKnow: 0.5, pLearn: 0.15, pSlip: 0.05, pGuess: 0.2 }, true);
  expect(alto.pKnowDelta).toBeLessThan(baixo.pKnowDelta);
});
```

- Survivors agrupados em torno de uma propriedade = adicionar teste de propriedade (skill `property-testing`) em vez de N casos pontuais.

## CI

- Agendado (nightly/semanal) + release branches — mutation testing é lento, não roda em todo PR.
- Gate: falhar build se score do escopo cair abaixo do threshold do config.
- Reports html anexados ao artefato do job para investigação.

## Checklist

- [ ] Stryker instalado e `stryker.config.mjs` versionado
- [ ] `NODE_OPTIONS=--experimental-vm-modules` (ESM do repo)
- [ ] BKT ≥ 90%, FSRS/mastery-gate ≥ 85%, orquestradores ≥ 80%
- [ ] Survivors investigados; gaps viram testes (unit ou property)
- [ ] CI semanal + release com gate de score
