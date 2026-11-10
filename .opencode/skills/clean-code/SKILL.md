---
name: clean-code
description: Use ao escrever, revisar ou refatorar código-fonte para aplicar Clean Code (nomes, funções, comentários, duplicação) no projeto ITS.
---

# Clean Code — TypeScript (ITS Platform)

## Nomes

- Escolha nomes intencionais e completos: `submitPracticeAnswers`, nunca `sp` ou `handleData`.
- Funções com verbo de ação: `calcularMasteryGate`, `agendarRevisaoFSRS`.
- Booleanos com `is`/`has`/`can`/`should`: `isLessonUnlocked`, `hasStreakBonus`.
- Sem números mágicos nem strings soltas: extraia para constantes nomeadas (`shared/constants.ts` ou `core/constants/`).

```ts
// ❌ ruim
if (p.p > 0.8 && p.n >= 5) ok.push(p);
// ✅ bom
const MASTERY_THRESHOLD = 0.8;
const MIN_ATTEMPTS_FOR_GATE = 5;
if (skill.mastery >= MASTERY_THRESHOLD && skill.attempts >= MIN_ATTEMPTS_FOR_GATE) {
  lessonsDisponiveis.push(lesson);
}
```

## Funções

- Pequenas, com uma única responsabilidade — alvo: menos de 20 linhas.
- Máximo 2 parâmetros posicionais; acima disso, passe um objeto:

```ts
// ❌
function registrarResposta(itemId, learnerId, correto, tempoMs, modo) { ... }
// ✅
function registrarResposta(input: RespostaInput): ResultadoResposta { ... }
```

- O corpo deve ser legível como prosa: extrair funções nomeadas em vez de comentários que explicam blocos.

## Comentários

- Comente apenas o "porquê", nunca o "o quê" — código autoexplicativo não precisa de legenda.
- `TODO`/`FIXME` sempre com responsável ou ticket: `// TODO(PLAT-123): remover após migração do schema v2`.
- Comentário de bloco morto ou código comentado = delete (o Git guarda o histórico).

## Duplicação (DRY)

- Elimine **conhecimento duplicado** (regra de negócio escrita em dois lugares) — essa duplicação é veneno.
- Não generalize cedo: três ocorrências parecidas (Rule of Three) antes de abstrair.
- Não confunda DRY com "nunca repita linhas parecidas" — dois loops parecidos com regras diferentes são código saudável.

## Tratamento de erros

- Falhe cedo, falhe claro: valide entrada na borda (route handler, Server Action) com Zod; o núcleo pode assumir entrada válida.
- Nunca engula erro: `catch {}` ou `catch { return null }` sem log é proibido; sempre propagar ou logar com contexto.
- Erros de domínio tipados em vez de strings soltas:

```ts
export class MasteryGateError extends Error {
  constructor(public readonly lessonId: string, public readonly mastery: number) {
    super(`Lição ${lessonId} bloqueada: mastery ${mastery} < ${MASTERY_THRESHOLD}`);
  }
}
```

## Efeitos colaterais nas bordas

- Mantenha `core/` e `application/` puros (sem fetch, DB, `Date.now()` aleatório) — regra de negócio pura é testável sem mock.
- I/O isolado em `infrastructure/` (clients de API, storage, audio); injete via interface.

## Imutabilidade

- `const` por padrão; `let` só quando reatribuir de fato.
- Prefira `readonly`, `Object.freeze` e spreads a mutação:

```ts
// ❌ muta estado compartilhado
mastery.theta += delta;
// ✅ retorna novo valor
const novaMastery = { ...mastery, theta: mastery.theta + delta };
```

## Formatação e ferramentas

- Prettier + ESLint são a lei do repo: rode `lint` e `format:check` antes de commit; zero warnings.
- Tipos explícitos em contratos públicos (props, DTOs, interfaces de repositório); inferência interna é bem-vinda.

## Testes como documentação

- Nome de teste em formato frase: `it('bloqueia lição quando mastery < 80%')`.
- Teste que precisa de comentário para ser entendido tem nome ruim — renomeie, não comente.

## Checklist de code review (sinais de máscara)

- [ ] Função que mistura I/O com regra de negócio
- [ ] Boolean params mudando comportamento (`fn(id, true)`)
- [ ] Mais de 3 níveis de aninhamento (extraia early return)
- [ ] Nomes genéricos (`data`, `info`, `manager`, `util`)
- [ ] `any` ou `@ts-ignore` sem justificativa
- [ ] Conhecimento de negócio escrito em dois arquivos
