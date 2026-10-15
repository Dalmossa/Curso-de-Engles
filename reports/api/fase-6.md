# Fase A6 — o gabarito servido pelo catálogo: a medição, o *pin*, e a decisão que ela exige

**Data:** 2026-10-15 · **Baseline:** `07e7b9f` (A5b fechada, gates verdes) · **Estado:** A6 **parada
por decisão humana** (R9). Nenhum código de produção, contrato ou CHANGELOG foi tocado.

---

## 1. Uma correção de escopo, antes de tudo

A nota que abriu esta fase dizia "A6 = superfície de erro/observabilidade". **Está errado** — o
plano ratificado diz outra coisa. `reports/api/fase-2.md` §2.7:

> **A6** | confidencialidade: `content.service.ts:237` serve `items[].key` — o gabarito sai na
> resposta | **uma linha de `select`**. É o único item de R6 que é trivial, e exatamente por isso
> não pode esperar uma fase grande | R6, ADR-027 §3

`reports/api/fase-5.md` §8.11 já havia registrado que "uma linha" é falso — o spec canônico declara
`key`/`is_key` **`required`** e o teste de integração os asserta, logo removê-los é *breaking*
(§4.4), não uma linha. Esta fase mediu **quanto** essa frase é falsa, e a resposta é: mais do que
§8.11 supunha.

---

## 2. A medição (R1/R2) — seis superfícies, não uma

Sobre o catálogo real carregado em PGlite, lido de `ContentService` (o mesmo caminho que a API
serve). O bloco `A6` de `tests/integration/content-api.spec.ts` é esta tabela em forma executável, e
ele **passa**: o estado atual é este.

| # | Rota | Membro | Medido |
|---|---|---|---|
| 1 | `GET /content/packs/{id}` | `items[].key` | **841 de 841** itens `scoring: 'choice'` (os outros 6 são `asr_phoneme_match`, `key: null` por desenho — ADR-004) |
| 2 | `GET /content/packs/{id}` | `items[].options[].is_key` | **841** opções — exatamente uma por item pontuável |
| 3 | `GET /content/packs/{id}` | `items[].options[].note` | **derivado**: `null` em **841 de 841** opções-chave e em **0 de 2523** distratoras |
| 4 | `GET /content/listening/{id}` | `slots[].key` | **74 de 74** slots, nos 13 diálogos publicados |
| 5 | `GET /content/listening/{id}` | `slots[].distractors[]` | **derivado**: em **74 de 74** slots a letra correta é a que **falta** no conjunto de distratores |
| 6 | `GET /content/lessons/{id}` | `phases[].markdown` | **122 de 122** aulas servem a linha `**Key:** B` e a linha correta em negrito |

Contexto: 122 packs, 847 itens servidos, 3364 opções publicadas; 13 diálogos, 74 slots. **Todo item
`choice` serve quatro opções com as letras A–D sem lacuna** — é isso que faz dos itens 3 e 5
*canais*: retirar o membro declarado não esvazia o conjunto, só deixa de rotulá-lo.

`br_pt_form` foi medido e **não** é canal (`null` em 43/841 opções-chave contra 48/2523 distratoras —
há `null` dos dois lados).

---

## 3. O achado desta fase: dois canais derivados

1. **`note === null` é o gabarito.** A coluna é `null` exatamente na opção correta (841/841) e nunca
   nas distratoras (0/2523). Retirar `is_key` deixa o gabarito legível.
2. **Os distratores de um slot são o complemento do gabarito.** Em 74 de 74 slots, {A…D} \
   `distractors[]` = a letra correta. Retirar `slots[].key` deixa o gabarito recuperável.

Havia ainda um defeito *no próprio pin*, encontrado pelo controle negativo e corrigido: a primeira
versão da asserção do `note` lia a identidade da opção-chave **do payload** (`option.is_key`) e, com
o membro retirado, ela **não provava nada** em vez de provar que o canal seguia aberto. A asserção passou a
ler de `items.key` — **a tabela é o oráculo, nunca o payload**, a mesma regra que A5b precisou em
`learner-scope-rls`.

---

## 4. Controle negativo executado (R7) — o que a correção ingênua deixa aberto

Injetado em `content.service.ts` (cópia, revertida em seguida; `git diff` de `src/` volta a zero).

**N-1 — só `options[].is_key` retirado:** 1 de 7 asserções vermelha; as outras 6 verdes. O canal do
`note` continua aberto, como medido.

**N-2 — "uma linha de `select`": `items[].key`, `options[].is_key` e `slots[].key` todos retirados:**

```
✕ serves `items[].key` for every item the pack can score
✕ serves `options[].is_key` — exactly one key option per scorable item, on the table key
✓ hands the key over through `options[].note` too, which is null on exactly the key options
✓ does not leak through `options[].br_pt_form`, which separates no option from another
✕ serves `slots[].key`, equal to the table value
✓ hands the key over through `slots[].distractors[]` too — the letter the slot distractor set omits
✓ serves the authored key inside the lesson body itself
Tests: 3 failed, 15 skipped, 4 passed, 22 total
```

**Três canais continuam abertos** depois da correção que o plano supunha suficiente. O que fecha R6
não é a lista de membros a remover: é um **predicado** — nenhum membro da projeção pode ser função do
gabarito, as opções de um item têm de ser isomórficas, e o conjunto de letras servido tem de ser o
completo (ADR-044 D6).

---

## 5. O que foi entregue

| Commit | Classe | Artefato |
|---|---|---|
| `test(api)` | o *pin* | `tests/integration/content-api.spec.ts` — bloco `A6`, 7 asserções, oráculo na tabela |
| `docs(adr)` | o registro | `docs/adr/044-...md` (**Proposed**) + a linha no índice de `docs/adr/README.md` |
| `docs(reports)` | este relatório | `reports/api/fase-6.md` |

**O que não foi feito, e por quê:**

- **Nenhuma mudança de comportamento.** ADR-044 é **Proposed**: emenda ADR-027 (Accepted) e quebra
  dois schemas publicados (§4.4). Decidir isso é humano (R9), e o registro existe para a decisão.
- **Nenhuma entrada de CHANGELOG.** Nada mudou na superfície servida — a entrada *breaking* entra
  com a implementação (A6b), não com a proposta.
- **Nada em `src/`.** A exposição é do *payload*, e o banco continua correto: o loader escreve
  `items.key`/`item_options.is_key`, a pontuação server-side os lê. Remover a coluna seria destruir
  a capacidade de pontuar para esconder um vazamento — o defeito está na projeção.
- **`gate_passed`/`theta`/`xp`/`streak_days`/`cefr_level` não foram tocados.** `docs/api/inventario.md`
  §6.8 os lista como campos proibidos e eles continuam servidos por `learners.service.ts`,
  `placement.service.ts` e `practice.service.ts` — mas são P1.10/P1.11 (substituição do stub), **fora
  do escopo ratificado de A6** (que é o gabarito em `/content/*`). Medidos e registrados aqui para
  não se perderem; A6 **não** os absorve, pelo mesmo princípio de A5b: não alargar escopo.

---

## 6. Gates — antes → depois

| Gate | Antes (`07e7b9f`) | Depois | O que mudou |
|---|---|---|---|
| `npm run test:gate` | PASS — 497 passed, 5 known-red (allowlist), 8 skipped, 510 | **PASS — 504 passed, 5 known-red, 8 skipped, 517** | +7: o bloco `A6` |
| `npm run contract:gate` | PASS | PASS | inalterado (nada no contrato mudou) |
| `npm run rls:check` | PASS — 0 violações | PASS — 133 arquivos, 0 violações | inalterado |
| `npm run domain:check` | PASS | PASS — 23 arquivos, 0 violações | inalterado |
| `npm run kong:check` | PASS | PASS — 9 asserções | inalterado |
| `npm run typecheck` | clean | clean | — |
| `npm run lint` | 0 errors, 3 warnings (arquivos ignorados) | igual | — |
| `python3 verify-integrity.py` | PASS — 0 falhas, 1 aviso herdado | PASS — igual | — |
| `python3 prd-score.py` | 92,6% | 92,6% | — |

`format:check` continua vermelho **antes e depois** (83 arquivos de `src/` fora do Prettier) — não é
gate nesta série e não foi tocado aqui; registrado para que não seja confundido com regressão.

---

## 7. A pergunta (uma só)

ADR-044 propõe D1–D4 e D6 e **recomenda** D5. A resposta muda o escopo de A6b:

> **Ratifica D1–D4 e D6 como propostos, e D5 como recomendado** — a aula mantém o gabarito no corpo
> autorado, por ser material didático (prática guiada), e R6 passa a valer para as duas cargas de
> avaliação (`/packs` e `/listening`) — **ou prefere a outra metade de D5**, retirar também do corpo
> da aula (122 de 122), com o custo e o risco descritos no ADR (projeção de markdown, segunda
> renderização)?

Com "ratifico D1–D4/D6 + D5 como recomendado", A6b é a fase seguinte e é pequena: uma projeção em
`ContentService`, dois schemas emendados, as 6 asserções do *pin* invertidas, CHANGELOG, controle
negativo da implementação.

---

## 8. Pendências humanas em aberto (herdadas, nenhuma bloqueia A6)

- **ADR-038 D4** — a tensão entre a linha 1 (403 por escopo) e a nota (404): a pergunta única está em
  `reports/api/fase-5b.md` §4.1 e no ADR.
- **A credencial da conexão** (`reports/api/fase-5b.md` §4.2): `data-source.ts` conecta como
  `DB_USERNAME` (default `postgres`, o *owner*), e as políticas de RLS de 15 tabelas exigem a role
  `its_platform_app` para governar de fato. RLS hoje **não governa** em desenvolvimento.
- **`docs/api/problem-types.md`** (ADR-034) não existe; **`x-required-scope`** por operação segue
  pendente de A5b.
- **ADR-031/032/034–039/041–043** seguem `Proposed`; a lista herdada (aviso de 90 dias, `Sunset`,
  `format: uri`, `additionalProperties: false`, `201`+`Location`, remoção de `/auth/refresh`) está em
  `reports/api/fase-5b.md` §4.
