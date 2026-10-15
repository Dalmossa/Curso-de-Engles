# Fase A7 — os corpos das cinco rotas `/learners/{id}/*`: a medição, o *pin*, e a decomposição

**Data:** 2026-10-15 · **Baseline:** `43d8d91` (A6b fechada) · **Estado:** A7 **medida e entregue
como *pin***; `ADR-045` **`Proposed`** — a decomposição (A7b–A7f) e as duas dependências humanas
ficam para ratificação (R9). **Nada em `src/` foi tocado.**

---

## 1. Nota de escopo: o "A7" desta fase não é o `A7+` do plano

`reports/api/fase-2.md` §2.7 reserva **A7+** para outra superfície — paginação (ADR-032),
idempotência (035), cache condicional/ETag (036), jobs assíncronos (037), forma do 429 (039), CORS
(043) —, seis itens dos quais o próprio plano diz "cada um é um ADR inteiro". Esta fase é outra
coisa: **ela continua A5b.**

O plano de A5 era *autorização por objeto e RLS* nas cinco rotas `/learners/*`; o escopo que A5b
recebeu foi ratificado como *"só a leitura que a RLS governa"*, e essa metade foi fechada — a linha
que a rota pode ler passa a ser decidida pela política sob o contexto do chamador. Os **corpos**
ficaram para depois, **por decisão registrada** no header de `LearnersService`, não por descuido.
A7 é o "depois".

O nome "A7" é o do ciclo desta sessão. O `A7+` do plano continua onde estava.

---

## 2. A medição (R1/R2) — cinco rotas, 17 asserções, nenhuma delas lendo o payload

O método é o de A6a, aplicado ao corpo em vez do catálogo: **escrever cada tabela de que a resposta
poderia ser função e mostrar que o corpo não se move.** O bloco `A7` de
`tests/integration/learner-routes-bodies.spec.ts` é essa medição em forma executável, e ele passa —
logo o estado medido é o estado vigente, não uma leitura de código.

| Rota | O que é servido | O que a tabela diz |
|---|---|---|
| `GET /profile` | `cefr_level:'A2'`, `streak_days:0`, `xp:0`, `created_at:<relógio>`, `mastery:{grammar:.5,vocab:.5}`, `theta_estimates:{}`, `fsrs_states:{}`, `preferences.daily_goal_minutes:20` | o run completo do aprendiz é **C1**; `learners` **não tem** coluna de banda, streak nem xp (`created_at, id, last_active_at, updated_at`); a linha guarda **2020-01-01**; `learner_mastery` tem `grammar.articles` **.930** e `vocabulary.airport` **.050**; `theta_estimates` tem θ **1.200**; `fsrs_states` tem stability **12.5**; o documento diz **15** e nenhuma tabela guarda preferência alguma |
| `GET /mastery` | chaves `grammar`/`vocab`, `mastery:.5`, `gate_passed:false`, `last_practice:<relógio>` | as skills do aprendiz são duas outras; as cinco cláusulas do gate **passam** para `grammar.articles` (⇒ `true`), e `false` é constante também para a skill de .050 |
| `POST /placement` | `start_node:'les_a2_airport'`, `theta_estimate:{0,.5,[-.98,.98]}`, `blueprint_coverage:{}` e **nada** de `confidence` | o run gravado tem **C1**, θ **1.900**, `start_node` **`les_c1_test`** e `form_version` **`diagnostic_form_v1`**; `confidence` é `required` no schema e **indefinido** em `properties`, e nenhum dos seis specs o declara |
| `POST /practice` | `scored_items:[{item_id:'vocab.airport.001', correct:true, skill:'vocab', bkt_update:{prior:.5, posterior:.8, transition:'learned'}}]` | dois itens diferentes submetidos, a mesma resposta; a linha do mesmo aprendiz e do mesmo item diz `bkt_prior` **.850**, `bkt_posterior` **.920**, `correct` **false**; `bkt_transition` foi **eliminada** do schema (correção 7) |
| `GET /next` | `activity_id:'les_a2_airport'`, `rationale.mastery_gaps:[]`, `selection_rule:'prerequisite'`, `i_plus_1:true` | `learner_mastery` tem uma skill abaixo de 0.85 — que é a definição que o próprio contrato dá a `mastery_gaps` — e o run do aprendiz é C1 |

Três propriedades do arquivo merecem registro, porque são o que faz a medição ser uma medição:

1. **O *fingerprint*.** As cinco respostas, lidas antes e depois do seed, com os dois membros que
   *são* o relógio normalizados. É a asserção da classe; cada teste abaixo é um membro dela.
2. **O *oráculo* é a tabela, o documento ou o gate de domínio — nunca o payload.** É a lição que A6
   pagou caro: a primeira versão daquele bloco lia a identidade da chave de `options[].is_key` e
   ficava vácuo exatamente quando o membro desaparecia.
3. **O seed é lido de volta.** O segundo teste do primeiro bloco lê `learners`/`learner_mastery`/
   `theta_estimates`/`fsrs_states`/`item_responses` e confirma que as linhas estão lá — sem ele, o
   *fingerprint* passaria num fixture vazio.

---

## 3. O achado desta fase: quando as cinco são medidas juntas, são **quatro estados**

A nota que abriu a fase dizia "os corpos são constantes e citam colunas que não existem". As duas
coisas são verdade, e são coisas diferentes:

| # | Estado | Membros | Conserto |
|---|---|---|---|
| 1 | **sem artefato nenhum** | `xp`, `streak_days`, `bkt_update.transition`, `PlacementResult.confidence` | a **declaração** muda (não o valor: `0` é indistinguível de um fato) |
| 2 | **o artefato existe e nada é lido** | os 14 do quadro acima | ler a linha / chamar o domínio |
| 3 | **a substituição já foi decidida** | `blueprint_coverage` → `form_version` (correção 15) | o contrato publica o eliminado e não o substituto |
| 4 | **o documento se contradiz** | `required` ⊄ `properties` — **uma** ocorrência, e é na resposta do placement | a emenda + a regra |

E um quinto, que é de forma e não de conteúdo: no `/mastery`, o schema é um `additionalProperties`
puro, então **as chaves são a resposta inteira** — o handler não errou um valor, escolheu o
conteúdo.

O estado 4 tem uma propriedade que os outros não têm: é decidível **sem o servidor**. A caminhada do
pin percorre os 15 schemas e todos os objetos aninhados do documento canônico e encontra
`schemas.PlacementResult.confidence` — e só. É a classe inteira em uma asserção.

---

## 4. Controle negativo executado (R7) — quatro mutações

Aplicadas a cópias dos arquivos e revertidas em seguida (`git status` de `src/` e do documento volta
a zero ao fim; o script é `/tmp/opencode/a7-negative-control.py`).

| Mutação | O que ela reintroduz | Vermelhos |
|---|---|---|
| **A** | os literais de todas as rotas mudam de valor (≥1 por rota) | **7** — um por membro; e o *fingerprint* fica **verde** |
| **B** | `cefr_level` lido do último diagnóstico completo (a correção, em miniatura) | **3** — o *fingerprint*, o membro, e o teste do segundo aprendiz |
| **C** | o placement responde `form_version` no lugar de `blueprint_coverage` | **1** |
| **D** | o documento perde `confidence` de `required` | **2**, e nenhum byte servido muda |

A e C são os controles que definem o formato do arquivo: **o *fingerprint* não é sensível a uma
constante virar outra constante** — ele mede o corpo *deixar* de ser constante. É exatamente por isso
que cada membro precisa da sua própria asserção, e não há redundância entre elas. D prova que as duas
asserções do bloco do placement leem o **documento**: elas ficam vermelhas sem que nada mude na
resposta HTTP.

Árvore restaurada: **17/17 verde**.

---

## 5. O que foi entregue

| Commit | Classe | Artefato |
|---|---|---|
| `a6ba4ab` | `test(api)` | o harness extraído para `tests/helpers/learner-routes-app.ts`; `learner-scope-rls.spec.ts` (A5b) reescrito sobre ele — **−73 linhas de composição, 0 asserções alteradas** |
| `ed75842` | `test(api)` | o *pin* de A7, `tests/integration/learner-routes-bodies.spec.ts` — 17 asserções |
| `2c794b4` | `docs(adr)` | `docs/adr/045-a7-learner-route-bodies.md` (**`Proposed`**) + a linha no índice de `docs/adr/README.md` |
| *(este)* | `docs(reports)` | `reports/api/fase-7.md` |

**O que não foi feito, e por quê:**

- **Nenhuma mudança de comportamento, em `src/` ou no contrato.** ADR-045 é `Proposed`: ele emenda
  cinco schemas publicados e depende de H3. O pin é a superfície de inversão da correção; ele não é a
  correção.
- **Nenhuma entrada de CHANGELOG.** Nada mudou na superfície servida. As remoções que A7b+ vão
  *obedecer* já estão no CHANGELOG desde A3/A4 (`mastery.gate_passed`, `item_responses.bkt_transition`,
  `learners.cefr_level/streak_days/xp`) — a API simplesmente não as obedeceu até hoje, que é o mesmo
  achado de A5a na sua forma atual.
- **`GET /next` não foi tocada.** ADR-021 é `Proposed` e os cinco vermelhos allowlistados do
  `test:gate` são exatamente `tests/domain/services/next-activity-selector.spec.ts`.

---

## 6. Gates — antes → depois

| Gate | Antes (`43d8d91`) | Depois | O que mudou |
|---|---|---|---|
| `npm run test:gate` | PASS — 504 passed, 5 known-red, 8 skipped, 517 | **PASS — 521 passed, 5 known-red (ADR-021), 8 skipped, 534** | +17: o *pin* |
| — idem, commit `a6ba4ab` isolado | — | PASS — 504 passed, 5 known-red, 8 skipped, **517** | medido: a extração do harness é **neutra** (−0 asserções) |
| `npm run contract:gate` | PASS | PASS | — |
| `npm run rls:check` | PASS — 133 arquivos, 0 violações | PASS — igual | o RLS spec só trocou a composição pelo helper |
| `npm run domain:check` | PASS — 23 arquivos, 0 violações | PASS — igual | — |
| `npm run kong:check` | PASS — 9 asserções | PASS — igual | — |
| `npm run typecheck` | clean | clean | — |
| `npm run lint` | 0 errors, 3 warnings (arquivos ignorados) | igual | — |
| `python3 verify-integrity.py` | PASS — 0 falhas, 1 aviso herdado | PASS — igual | — |
| `python3 prd-score.py` | 92,6% | 92,6% | — |

`format:check` continua vermelho **antes e depois** (arquivos de `src/` fora do Prettier) — não é
gate nesta série, não foi tocado, e fica registrado para não ser confundido com regressão.

---

## 7. A decomposição que o ADR propõe

Uma sub-fase por rota, porque cada uma emenda um schema publicado e cada emenda é uma entrada
*breaking* com a sua própria migração — é o que mantém "um commit por classe" (R8) verdadeiro:

| Sub-fase | Rota | Depende de |
|---|---|---|
| A7b | `GET /profile` — `cefr_level` do último run, `mastery`/`fsrs_states` da tabela, `preferences` com os `default:` do documento, `xp`/`streak_days` fora | **ADR-043 R1** (o membro `theta_estimates`) |
| A7c | `GET /mastery` — as chaves são as skills do aprendiz; `gate_passed` é o veredito das cinco cláusulas | — |
| A7d | `POST /practice` — pontua o item submetido; `prior`/`posterior` da linha; `transition` fora do contrato | — |
| A7e | `POST /placement` — lê o run (§3.6); `form_version` no lugar de `blueprint_coverage`; `confidence` fora de `required`; **e a regra `required ⊆ properties` do gate no mesmo commit** | **ADR-043 R1** |
| A7f | `GET /next` | **ADR-021**, `Proposed` — bloqueada |

Duas dessas dependências são humanas, e nenhuma é contornável por código:

- **ADR-043 R1 (H3)** propõe que **θ bruto e `se` não sejam expostos** pela API pública. O perfil
  declara `theta_estimates` e o placement serve `theta_estimate` — é a mesma pergunta, e ela não é
  desta fase. A7 **segura** o membro em A7b em vez de escolher por conta; o que ela não pode aceitar
  é a resposta de hoje, que é uma terceira: θ servido a todo mundo, sem consultar
  `skill_theta_reportable` (§3.6) nem a lattice de ADR-024 §3.3a.
- **ADR-021** decide a fonte canônica do metadata por aula, os ids canônicos e o fail-closed do
  seletor. Enquanto ele estiver `Proposed`, `/next` não é implementável sem escolher o metadata no
  lugar de quem decide.

---

## 8. Pendências humanas em aberto

**Nova (esta fase) — a ratificação de `ADR-045` (D1–D11).** A pergunta é uma: ratificar a
decomposição A7b–A7f e as recomendações D2–D5/D7–D11 — com D6 e D11 **aceitas como bloqueios**, isto
é, A7b/A7e esperam H3 e A7f espera ADR-021 — ou preferir outro recorte.

**Herdadas, nenhuma bloqueia A7:**

- **ADR-044 D6** — a regra de `br_pt_form` por item (manter / remover globalmente / aceitar o canal);
  as três alternativas medidas estão em `reports/api/fase-6b.md` §2.
- **ADR-043 R1** — θ/CORS/SDK: bloqueia A7b (o membro `theta_estimates`) e A7e.
- **ADR-021** — o seletor de `/next`: bloqueia A7f.
- **ADR-038 D4** — a tensão 403 × 404 (`reports/api/fase-5b.md` §4.1); a credencial da conexão
  (§4.2); `x-required-scope`; e os ADRs 031–043 `Proposed`.

**Registrado, e não tocado (não é desta fase):** o *working tree* carrega **7 arquivos
`packs/a2/pack-les-a2-*.md` modificados** — `**Reuse basis:** cite_only` acrescentado ao cabeçalho —
fora do escopo de A7 e fora dos commits acima. É uma **declaração de licença**, é **parcial** (7 de
~110 packs que não a declaram) e portanto pertence à trilha de conteúdo, não a esta. Medido:
`python3 verify-integrity.py` passa **com e sem** essas 7 linhas, então nenhum gate depende delas.
Elas ficam no *working tree*, intactas, para quem for dono da decisão — eu não as commito nem as
reverto.
