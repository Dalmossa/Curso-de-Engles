---
adr: 045
title: "A7 — os corpos de `/learners/{learner_id}/*`: de que artefato cada membro é função, e os que o contrato pede sem lastro"
status: Proposed
date: 2026-10-15
authors: [@api-lead]
deciders: [unassigned]
consulted: [@adaptive-lead, @content-owner, @security-lead, @qa-sdet]
informed: [@team]
tags: [api, r2, r3, r6, contracts, human-decision, needs-human-review, adr-015, adr-018, adr-021, adr-024, adr-043, adr-044]
---

**Proposed — 2026-10-15.** Este ADR **mede, recomenda e para** (R9). Nenhuma linha de `src/` mudou
em A7: o que existe é um *pin* de 17 asserções, `tests/integration/learner-routes-bodies.spec.ts`,
que fixa o estado atual para que a correção tenha superfície exata de inversão — o mesmo método de
A6a (`docs/adr/044-a6-no-answer-key-in-served-payloads.md` §1) e a mesma relação entre o pin e a
implementação.

O escopo é uma frase: **as cinco rotas `/learners/{id}/*` respondem o mesmo corpo a qualquer
aprendiz que A5b deixe ver — a exceção é o `learner_id`, que é o que a leitura de A5b devolve — e
nenhum número desses corpos é lido de uma tabela.** Isso não é uma leitura de código: é o resultado
do pin, e o §4 mostra as mutações que o fazem falhar.

**Nota de nome.** O `A7+` do plano ratificado (`reports/api/fase-2.md` §2.7) é *outra* superfície —
paginação (ADR-032), idempotência (035), cache condicional (036), jobs (037), forma do 429 (039),
CORS (043). O "A7" deste ADR é o do ciclo desta sessão, e ele continua A5b: os **corpos** das mesmas
cinco rotas, que A5b deixou intocados por decisão. O `A7+` do plano segue onde estava.

## Context

### 1. O que A7 mede, e o que A5b já tinha fechado

`docs/api/inventario.md` §6 item 8 (linhas 231–235) registrou os dois fatos em A0, com as fontes:

> **Campos proibidos nas respostas.** `learners.service.ts:9-20` devolve `streak_days`, `xp` e
> `cefr_level` — removidos por ADR-015 §3 e ADR-018 §9.9 ("had no basis in any spec"); e
> `gate_passed` (`:26`), cuja coluna foi eliminada e que só pode existir **calculado** (4 cláusulas).
> `placement.service.ts:9-13` devolve `theta_estimate.theta` incondicionalmente, sem a
> reportabilidade de `diagnostic` §3.6 (R6).

A instrução estava certa e um dos números estava velho: o gate tem **cinco** cláusulas
(`p_know ≥ 0.85`, `CI₉₅_lower > 0.70`, `n_obs ≥ 3`, `distinct_days ≥ 2`, `spaced_obs ≥ 1` —
`docs/data-model.erd.md` §8, linha 1), e `src/domain/services/mastery-gate.service.ts` já as
implementa. A7 mediu as cinco rotas; o A0 nomeou três. (O nome "four-clause" sobrevive em três
lugares — `ERD` §6.5, `CHANGELOG.md` e o cabeçalho do próprio serviço — e os três listam cinco
cláusulas logo abaixo. É um nome, não uma contagem.)

A5b mudou o que uma rota faz **antes** do corpo: a linha que a rota pode ler passa a ser decidida
pela política de ADR-003 sob o contexto do chamador (ADR-026/ADR-038 D3), e por isso o mesmo id em
duas mãos devolve `404` nos dois casos. O corpo ficou como estava **por decisão registrada**
(`LearnersService`'s header), e A7 mede o que estava ali: não "o corpo é um mock", mas *de que
artefato cada membro é função* — que é uma afirmação verificável membro a membro.

### 2. O método

O pin faz a pergunta do jeito que ela pode ser respondida: **escreve as tabelas de que a resposta
deveria ser função e mostra que o corpo não se move.**

1. **O *fingerprint*.** As cinco respostas, lidas **antes** do seed e **depois** dele, com
   `created_at` e `last_practice` normalizados (são o relógio; §3 mede isso separadamente). A
   asserção é a igualdade. Ela é a afirmação da classe; cada teste abaixo é um membro dela.
2. **O seed é a testemunha, e ele é lido de volta.** Cada valor é escolhido para ser inconfundível
   se for lido: `learners.created_at` em **2020-01-01**, `learner_mastery` **0.930** e **0.050**,
   `theta_estimates.theta` **1.200**, `diagnostic_results` **C1** com `start_node` **`les_c1_test`**,
   θ **1.900**, `fsrs_states.stability` **12.5**, `item_responses` `0.850/0.920` com `correct`
   **false**. O segundo teste do primeiro bloco lê as linhas de volta — sem ele, o primeiro bloco
   passaria num fixture vazio.
3. **A tabela é o oráculo, nunca o payload.** Toda asserção nomeia a fonte pela qual ela responde:
   `information_schema` (a coluna existe?), a linha (o valor é esse?), o documento ou um serviço de
   domínio. É a regra que A5b e A6/ADR-044 §3 aprenderam a preço de defeito — uma asserção que lê a
   identidade do que está sendo testado não prova nada quando o membro desaparece.
4. **O pin não toca em `src/`.** A conexão é o **owner** da tabela: RLS é a pergunta de A5b, medida
   no arquivo dela; aqui interessa o que o handler faz com a linha que tem.

O harness HTTP foi **extraído para `tests/helpers/learner-routes-app.ts`** e é compartilhado pelo
pin de A5b (`tests/integration/learner-scope-rls.spec.ts`, reescrito para usá-lo). A lista de
controllers e providers é uma decisão sobre o módulo; duas cópias seriam uma segunda resposta que
ninguém relê.

### 2.1 A segunda pergunta: o corpo está de acordo com a própria declaração?

`confidence` está em `PlacementResult.required` e **não** está em `properties`
(`docs/api-spec.openapi.yaml:139`) — é insatisfazível por construção. A caminhada do teste
*"is the only schema in the document that requires a member it does not define"* mede isso no
documento inteiro, e o resultado é: **uma violação, no documento todo**.

### 3. A medição, membro por membro

Onde a coluna diz *Fonte*, a rota não a lê; é o artefato que o membro nomeia. O seed de que a tabela
fala está no pin (`seedEverything`).

| Rota | Membro | O que é servido | Fonte que existe | Medido |
|---|---|---|---|---|
| `GET /profile` | `learner_id` | a linha carregada | `learners.id` | o **único** membro que é função da leitura (um `UPDATE` de `id` é outra história) |
| | `created_at` | `new Date()` | `learners.created_at` | a linha vale **2020-01-01**; o corpo responde o relógio |
| | `cefr_level` | `'A2'` | `diagnostic_results.cefr` do último run completo (ERD §2 correção 9; ADR-017 §3) | a linha do aprendiz diz **C1** |
| | `mastery` | `{grammar: 0.5, vocab: 0.5}` | `learner_mastery.p_know` | duas linhas: `grammar.articles` **0.930**, `vocabulary.airport` **0.050** |
| | `theta_estimates` | `{}` | `theta_estimates.theta` | uma linha: θ **1.200** |
| | `fsrs_states` | `{}` | `fsrs_states.stability` | uma linha: **12.5** |
| | `preferences.daily_goal_minutes` | **20** | o próprio documento (`default: 15`) | o documento diz **15**; `learner_preferences` foi eliminada (ERD §10, ADR-018 *Neutral*) |
| | `streak_days`, `xp` | `0` | **nenhuma** | `learners` tem `created_at, id, last_active_at, updated_at` (ERD §2 correções 9/10; §6.5: *"Gamification has no persistence at all"*) |
| `GET /mastery` | as **chaves** | `grammar`, `vocab` | `learner_mastery.skill_id` | as skills do aprendiz são `grammar.articles` e `vocabulary.airport`; o schema é um `additionalProperties` puro, então as chaves **são** a resposta |
| | `mastery` | `0.5` nas duas | `p_know` | 0.930 / 0.050 |
| | `gate_passed` | `false` nas duas | a função de domínio L-2 (5 cláusulas) | as cinco cláusulas **passam** para `grammar.articles` ⇒ `true`; para a skill de 0.050, `false` também é constante — e um `false` que não vem de cláusula nenhuma não é uma resposta conservadora |
| | `last_practice` | `new Date()` | `learner_mastery.last_practice_at` | idem `created_at` |
| `POST /placement` | `start_node` | `'les_a2_airport'` | `diagnostic_results.start_node` | a linha do aprendiz recomenda **`les_c1_test`** |
| | `theta_estimate` | `{theta: 0, se: 0.5, ci95: [-0.98, 0.98]}` | `diagnostic_results` (θ/`se_*`/CI) e §3.6 | θ armazenado **1.900** |
| | `blueprint_coverage` | `{}` | — **substituído**: `diagnostic_results.form_version` | ERD §2 correção 15; a coluna existe e vale `'diagnostic_form_v1'`, o membro não está mais definido em spec alguma |
| | `confidence` | **ausente** | — | `required` em `PlacementResult`, indefinido em `properties`, declarado por **nenhum** dos seis specs |
| `POST /practice` | `scored_items[]` | o item `vocab.airport.001` | `items`/`item_options` do que foi enviado | dois itens enviados, uma resposta: o mesmo `item_id` |
| | `bkt_update.prior`/`posterior` | `0.5`/`0.8` | `item_responses.bkt_prior`/`bkt_posterior` | a linha do mesmo aprendiz e do mesmo item diz `0.850`/`0.920` |
| | `bkt_update.transition` | `'learned'` | **nenhuma** | `bkt_transition` foi eliminada (ERD §2 correção 7 e §10: substituída por `confidence` + os snapshots de antes/depois) |
| | `mastery_updates[].gate_passed` | `false` | a função de domínio | o contrato descreve o membro como *"Whether mastery ≥ 0.85"* — uma cláusula só, mais fraca que o predicado de cinco que ADR-018 §1 manda calcular |
| `GET /next` | `activity_id` | `'les_a2_airport'` | o seletor | o run do aprendiz é C1, cujo `start_node` é outro |
| | `rationale.mastery_gaps` | `[]` | `learner_mastery` — o contrato diz *"Skill IDs where mastery < 0.85"* | o aprendiz tem `vocabulary.airport` a **0.050** |

### 4. O controle negativo (R7)

Quatro mutações, aplicadas a cópias dos arquivos e revertidas em seguida (`git status` de `src/` e do
documento volta a zero). A primeira coluna é o que o estado atual produz.

**A — os literais de todas as rotas mudam de valor.** 7 vermelhos, um por membro mutado, incluindo
`gate_passed:true` no serviço e `activity_id` trocado. O teste-fingerprint fica **verde**: ele não é
sensível a uma constante virar outra constante. É o que define o papel dele — e por que cada membro
tem o seu próprio teste.

**B — `cefr_level` passa a ser lido do último diagnóstico completo** (a correção, em miniatura). 3
vermelhos: o fingerprint (o seed move o corpo entre as duas leituras), o teste que nomeia o membro, e
o *"a second learner differs in the one member it reads"* — porque o outro aprendiz não tem run.

**C — o placement responde `form_version` no lugar de `blueprint_coverage`.** 1 vermelho: o teste que
nomeia o par. O fingerprint fica verde (o membro é constante nos dois mundos).

**D — o documento perde `confidence` de `required`.** 2 vermelhos: os dois testes que leem o
documento. Nenhum byte servido muda — o que prova que aquelas duas asserções leem o contrato, e não
o payload.

A árvore volta verde em 17/17 depois das quatro.

### 5. São quatro estados, e a diferença importa

1. **Membro sem artefato nenhum** — `xp`, `streak_days`, `bkt_update.transition`,
   `PlacementResult.confidence`. Nenhum dos seis specs define um badge, um limiar, uma transição ou
   um `confidence` para essas respostas; o ERD já tinha eliminado dois deles (correções 9 e 10 —
   *"no spec defines a badge, threshold, award or revocation"*).
   Um membro assim não se conserta servindo-se `0`: o que se conserta é a declaração.
2. **Membro ignorado: o artefato existe e o corpo é constante** — `created_at`, `cefr_level`,
   `mastery`, `theta_estimates`, `fsrs_states`, `start_node`, `theta_estimate`, `item_id`, `skill`,
   `mastery_gaps`, `activity_id`, `preferences`. É a maioria, e é a classe que A7 existe para medir:
   não "os valores estão errados", e sim *nada é lido*.
3. **Membro cuja substituição o ERD já decidiu** — `blueprint_coverage` (correção 15:
   `blueprint_coverage` → `form_version`, *"coverage is a property of the fixed form"*). O contrato
   publica o eliminado e não o substituto.
4. **O documento contradiz a si mesmo** — `required` ⊄ `properties`, uma ocorrência, e ela está na
   resposta do placement.

E um quinto, do `/mastery`: **as chaves são a resposta inteira.** O schema é
`additionalProperties`, então um handler que escreve `grammar`/`vocab` escolheu o conteúdo, não o
formato.

## Decisions (proposta — não vinculante até decisão humana)

**D1 — A7 fecha por rota, não por arquivo: cinco sub-fases, e cada uma é a sua própria classe.**

| Sub-fase | Rota | O corpo passa a ser função de | Depende de |
|---|---|---|---|
| A7b | `GET /profile` | `learners.created_at`; o último run completo (`cefr`); `learner_mastery`; `fsrs_states`; os `default:` do documento em `preferences` | D3, D5; **D6** (θ) |
| A7c | `GET /mastery` | `learner_mastery` (as chaves e o `p_know`) + a função de domínio L-2 sobre a evidência | — |
| A7d | `POST /practice` | os itens/opções submetidos; `item_responses.bkt_prior`/`posterior`; o agendador FSRS | D8 |
| A7e | `POST /placement` | `diagnostic_results` (§3.6), com o run gravado | **ADR-043 R1** (θ) |
| A7f | `GET /next` | — | **ADR-021**, `Proposed` |

Nenhuma das cinco cabe num só commit: cada uma emenda um schema publicado, e cada emenda é uma
entrada *breaking* com a sua migração. A divisão é o que mantém "um commit por classe" (R8)
verdadeiro.

**D2 — Um membro é servido quando algum artefato do repositório o determina; quando nenhum
determina, o membro sai da resposta *e* do contrato.** O `default:` do documento não é artefato: ele
diz ao cliente o que assumir na ausência, e um servidor que tem uma preferência armazenada responde
o que armazenou. Servir `0` em `xp` é a única alternativa que *não* é aceitável, porque é
indistinguível de um fato para qualquer cliente.

**D3 — `cefr_level` = o `cefr` do último `diagnostic_results` completo; sem nenhum, `null`.** Três
alternativas medidas: (a) `null` — exige emendar o schema (hoje `required` com `pattern`, então não
há como expressar "não avaliado"); (b) `404` no perfil — recusa a resposta a quem já tem linha, e
confunde "não tenho o nível" com "não existe o aprendiz"; (c) manter um valor fixo — é o defeito.
Recomendada (a). **Os dois casos ficam medidos:** o run completo que o seed escreve é C1, e o
aprendiz sem run nenhum não pode receber C1.

**D4 — `streak_days` e `xp` saem da resposta e do contrato.** O ERD já os eliminou por duas razões
distintas (correção 9: precedência; correção 10: ausência de spec), e `docs/data-model.erd.md` §6.1
registra o porquê com todas as letras: *"Gamification has no persistence at all (ADR-015 §3)"*. O
`default: 0` do documento é a aparência de um fato; a alternativa honesta é uma fase que **crie** a
persistência (uma tabela, um limiar, uma regra), e essa fase não existe.

**D5 — `preferences` responde os `default:` do documento, exatamente — inclusive 15, e não 20.**
`learner_preferences` foi eliminada (ERD §10) porque preferências sem spec *são* o default do
domínio; o contrato é onde esse default está escrito. Um valor diferente do default, sem store, é
indistinguível de um valor lido — e a diferença entre os dois é todo o assunto deste ADR. Criar o
store é outra fase.

**D6 — θ: as duas superfícies do `/learners/*` são a mesma pergunta, e a pergunta é H3.** O perfil
declara `theta_estimates` (`{theta, se, last_updated}`) e o placement serve
`theta_estimate.{theta, se, ci95}`. `docs/adr/043-h3-theta-cors-sdk.md` R1 propõe: **θ bruto e `se`
não expostos pela API pública**, e o nível exposto ao próprio aprendiz. Ou seja: o perfil não ganha
o membro e o placement não o mantém por conta desta fase. A7b **segura** o membro `theta_estimates`
(não é uma correção adiada: é a resposta a uma pergunta já feita, à espera de ratificação) e A7e
depende de H3. O que A7 não pode deixar como está é a **terceira** resposta, a de hoje: θ servido,
sem reportabilidade, a todo mundo — `skill_theta_reportable` (diagnostic §3.6) e a lattice de
ADR-024 §3.3a não são consultados em lugar nenhum.

**D7 — `GET /mastery`: as chaves são as skills do aprendiz, e `gate_passed` é veredito.** `mastery`
= `learner_mastery.p_know` da skill; `gate_passed` = `MasteryGateService.evaluate(...).passed`, o
predicado das cinco cláusulas sobre a evidência — a coluna foi eliminada justamente porque o gate
não é um número (ERD §10: *"`gate_passed` + trigger | domain function L-2 over the evidence columns"*).
Duas consequências medidas: hoje o corpo responde `false` para uma skill que **passa** nas cinco, e a
mesma resposta para a skill a 0.050 — o que mostra que `false` não é conservador, é ausente. O
`description` de `PracticeResult.mastery_updates[].gate_passed` (*"Whether mastery ≥ 0.85"*) reduz o
predicado a uma cláusula, e emenda junto.

**D8 — `POST /practice` pontua o que foi submetido, e `bkt_update.transition` sai do contrato.** O
item vem da submissão (a chave é server-side, em `item_options`); `prior`/`posterior` vêm da linha;
o que **não** tem fonte é `transition`, e a substituição já está decidida (ERD §10: `confidence` +
os snapshots de antes/depois). `mastery_updates[].mastery_before/after` e o gate seguem a mesma
regra de D7.

**D9 — `POST /placement` serve `diagnostic_results`, e duas trocas no contrato.** O run completo é a
autoridade do nível (ERD §2 correção 9) e `specs/diagnostic-spec.md` §3.6 é a autoridade da forma da
resposta; `diagnostic-fixed-form`, `diagnostic-placement` e o estimador de ADR-025 §3.4 já existem em
`src/domain/services/` e não estão ligados a nenhum handler. As trocas: `blueprint_coverage` sai e
`form_version` entra (correção 15); **`confidence` sai de `required`** — nenhum spec o declara, e o
membro não tem produtor. O que sobra do θ é a pergunta de H3 (D6).

**D10 — `required ⊆ properties` vira regra do gate, e a regra entra com a emenda que a satisfaz.**
Medido hoje: **uma** violação no documento inteiro (`PlacementResult.confidence`). A regra é do
`contract-gate.mjs` — é uma coerência do documento com ele mesmo, o mesmo território das regras de
`Problem`, `$ref` e `servers` que já estão lá; `tests/contract/schemas.spec.ts` continua dono da
validação instância × schema (ADR-040 D5.1). Uma regra que hoje **falharia** não pode entrar antes da
emenda (o commit tem de passar o gate); por isso o pin é que a mede, e ela entra em A7e, com a
mudança que a satisfaz.

**D11 — `GET /next` não é fechável por este caminho, e isso é um fato, não um adiamento.** O
`NextActivitySelector` lê `node.metadata['skills']`, que nada escreve, e `getFsrsPriorityForLesson()`
devolve `0`; a fonte canônica, os ids e o fail-closed são o objeto de `docs/adr/021-...md`
(**`Proposed`**) — e os cinco testes vermelhos que `npm run test:gate` allowlista são exatamente
`tests/domain/services/next-activity-selector.spec.ts`. A medição do pin é a contribuição desta
fase: `mastery_gaps` é *conteúdo* (`learner_mastery` o responde), não um campo que se preenche
depois.

## Consequences

### Positive

- **A fase tem um consumidor, e ele é nomeado:** quem corrige uma dessas rotas P1.x sabe exatamente
  o que serve de artefato, o que é constante e o que não tem fonte — e o pin vira o teste de
  inversão da correção, sem escrever um segundo.
- **A5b e A7 dividem um harness** (`tests/helpers/learner-routes-app.ts`), e a lista de providers é
  escrita uma vez.
- **A dívida deixa de ser difusa.** `xp` não é "um campo a preencher": é um membro a remover. O
  placement não é "um θ a gatear": é uma declaração autocontraditória, uma troca de membro e uma
  pergunta de H3.
- **O contrato fica satisfazível.** A caminhada do pin mede `required ⊆ properties` no documento
  inteiro — os 15 schemas e todos os objetos aninhados, não o nó onde a violação foi achada — e
  encontra uma só; a mutação D prova que as asserções estão presas a ele: a regra que entra em A7e já
  tem o seu teste de inversão.

### Negative

- **Quatro sub-fases emendam schemas publicados.** `cefr_level` nullable, `streak_days`/`xp` fora,
  `blueprint_coverage` → `form_version`, `confidence` fora, `transition` fora, e as duas descrições
  de `gate_passed`. Cada uma é §4.4-*breaking*. Para três delas a entrada **já existe** no
  `CHANGELOG.md` — `mastery.gate_passed` (`Unreleased`), `item_responses.bkt_transition`, e
  `learners.cefr_level`/`streak_days`/`xp` — com a migração escrita e o consumidor nomeado: a API
  simplesmente não as obedeceu, e é o mesmo achado de A5a na sua forma de hoje. `blueprint_coverage`
  e `confidence` não estão no CHANGELOG: são do contrato, e é o contrato que os declara sem lastro.
- **A7 não corrige nada.** É um módulo de leitura sobre rotas que continuam mentindo até A7b+.
- **D6 obriga a esperar H3** para uma das cinco rotas. Não há como consertar o placement sem saber se
  o θ sai; e o θ não pode continuar saindo sem lattice.

### Neutral

- Os membros constantes de hoje continuam constantes até a implementação. O pin é quem muda de
  status, não o handler.
- `learner_id` no path não é tocado: nada aqui é sobre autorização (A5b mediu isso).

## Alternatives Considered

1. **Corrigir as cinco rotas numa fase só, sem ADR.** Rejeitada: são quatro schemas publicados, duas
   emendas de descrição e uma dependência de H3. O ADR é o que separa "esta rota mente" de *"o que
   exatamente, e com qual classe de correção"*.
2. **Ligar os domain services direto no handler e medir só o resultado.** Rejeitada: é a correção de
   A7b–A7e. O estado precisa ser mensurável antes, e o pin é a única coisa que a fase entrega.
3. **Servir `0` em `xp`/`streak_days` "como o documento manda".** Rejeitada: o `default:` diz o que
   o cliente assume na ausência, não o que o servidor sabe. `0` é indistinguível de um streak que
   acabou de quebrar.
4. **Aceitar θ não-reportável porque o handler não consulta a lattice.** Rejeitada (R6 +
   ADR-038 D4): não consultar é o defeito, não uma licença.
5. **`required ⊆ properties` só como comentário, sem regra.** Rejeitada: é a classe que o
   `contract-gate` existe para pegar (uma ocorrência, achada por caminhada), e uma regra custa menos
   que a próxima ocorrência.
6. **Tratar `/next` como implementável agora.** Rejeitada: ADR-021 é `Proposed` e o gate allowlista
   os cinco vermelhos. Escrever o seletor antes da decisão seria escolher o metadata por conta.

## Implementation Plan

- [x] A7 — pin (`tests/integration/learner-routes-bodies.spec.ts`, 17 asserções) e o harness
      compartilhado (`tests/helpers/learner-routes-app.ts`); controle negativo de 4 mutações.
- [x] **A7b — `GET /profile` executada** (2026-10-15): `created_at`, `cefr_level` (D3), `mastery`,
      `fsrs_states`, `preferences` (D5) vêm das tabelas que os possuem, através de
      `LearnerScopeService.withVisible`; `streak_days`/`xp` fora do corpo **e** do documento (D4);
      `theta_estimates` **segura em `{}`** até H3 (D6, aberta abaixo). Controle negativo de 10
      mutações, todas vermelhas, cada uma nomeada pela asserção que a pega. O pin passa de 17 para 21
      asserções, e ganha o fixture que torna a palavra *latest* de D3 mensurável: uma learner só deste
      teste com três runs cujo `cefr` não é monótono no tempo — "a mais recente" não pode ser
      satisfeita por "a primeira", "a única" nem "a mais alta". O contrato foi emendado nos dois
      pontos (§4.4): `cefr_level` alarga para `[string, 'null']` e `streak_days`/`xp` saem.
      Implementação: `src/infrastructure/repositories/learner-profile.repository.ts`,
      `src/modules/learners/{learner-scope,learners}.service.ts`,
      `src/infrastructure/repositories/learner.repository.ts`; medição: `reports/api/fase-7b.md`.
- [ ] A7c — `GET /mastery`: as chaves (D7) e o gate calculado pelo domínio; `description` de
      `PracticeResult.mastery_updates[].gate_passed` emendada.
- [ ] A7d — `POST /practice`: pontuação do item submetido, `prior`/`posterior` da linha, `transition`
      fora do contrato (D8).
- [ ] A7e — `POST /placement`: `diagnostic_results` (§3.6), `form_version` no lugar de
      `blueprint_coverage`, `confidence` fora de `required`, **e a regra `required ⊆ properties` do
      gate no mesmo commit** (D9/D10) — sujeita a H3.
- [ ] A7f — `GET /next`, **bloqueada** até ADR-021 (D11).
- [ ] H3 (ADR-043 R1) ratificação: decide se θ/`se` deixam a API; A7b e A7e esperam por ela.

## References

- `docs/api/inventario.md` §6 item 8 (linhas 231–235) — a medição de A0 que nomeia a classe.
- `its-platform/tests/integration/learner-routes-bodies.spec.ts` — o pin, e a medição executável
  deste ADR; `tests/helpers/learner-routes-app.ts` — o harness.
- `docs/data-model.erd.md` §2 (correções 9, 10 e 15), §6.1 (a linha de `learners` e o que a
  substitui) e §11 (o que foi eliminado e por quê).
- `docs/adr/015` §3 (`xp`/`streak_days` sem spec), `018` §9.7/§9.9 (`bkt_transition`; `cefr_level`
  como projeção), `017` §3, `024` §3.3a (a lattice da reportabilidade), `025` §3.4 (o estimador),
  `040` D5.1 (a divisão do gate), `043` R1 (θ: a proposta de H3), `044` §1 (o método do pin).
- `specs/diagnostic-spec.md` §3.6 — a forma da saída do placement.
- `src/domain/services/mastery-gate.service.ts` — o predicado do `gate_passed`.
