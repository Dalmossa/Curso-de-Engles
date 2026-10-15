# Fase A5a — O corpo que a API aceita, e o que ela recusa

**Data:** 2026-10-15 · branch `main` · `5365c11` → `a2797fa`, **6 commits** (o 7º é este relatório)
**Não há remoto configurado** (`git remote -v` é vazio) e **`git tag` devolve 0 tags** — nada foi publicado.
**Escopo:** os dois corpos de *request* que o contrato publica; o status de sucesso que as duas operações
`POST` servem; a borda de `/auth/refresh`; a regra `request body` do `contract-gate.mjs`; `CHANGELOG.md`;
notas de estado em `BACKLOG.md` (P0.6, P1.14) e `docs/adr/013`; a prosa viva `docs/api-spec.md`.
**Nenhum endpoint, migration ou schema novos. Nenhuma rota removida.** Uma rota passa a responder `501` e
deixa de responder `200` com um token falso.

**A fase foi cortada em duas por medição, não por preferência.**

| metade | conteúdo | o que a autoriza | estado |
|---|---|---|---|
| **A5a** | validação estrita dos 2 corpos contra o schema publicado; o status de sucesso servido; a borda de `/auth/refresh`; a regra `request body` no gate | `CONSTITUTION.md` §4.5 (lei) + o spec canônico, que **já declarava tudo** (os `required`/`enum`/`pattern` e o `501`) + ADR-013, cuja metade *Settled* se declara *"binding on `BACKLOG.md` P0/P1"* | **fechada aqui** |
| **A5b** | autorização por objeto — 404 e nunca 403 (R6) | exige o **sujeito** da requisição, que ADR-013 define apenas na metade *Open*; ADR-038 segue `Proposed`; e a fixture de BDD afirma 403 onde §4.4/R6 exigem 404 | **bloqueada** (§8.1) |

O corte não é conveniência de escopo: A5b depende de uma decisão que não existe, enquanto A5a implementa
obrigações que já eram lei e cujo descumprimento é medível **sem decidir nada**.

---

## 1. Tarefas e veredito

| # | tarefa | obrigação que a manda | evidência | veredito |
|---|---|---|---|---|
| **C1** | `DiagnosticRequestDto` / `PriorEstimateDto`, `PracticeSubmissionDto` / `PracticeResponseDto`, `response-shape.ts`; os 2 controllers deixam de receber `@Body() body: any`; o fallback `body.pack_id \|\| …` é deletado | §4.5; `components.schemas.DiagnosticRequest` e `PracticeSubmission` | `tests/integration/request-validation.spec.ts` **24/24**; `tests/unit/response-shape.spec.ts` **8/8** | ✅ |
| **C2** | `@HttpCode(200)` nas duas operações | o spec: **uma** resposta de sucesso por operação, e é `200` | `tests/integration/post-success-status.spec.ts` **3/3**, lendo o documento em vez de citá-lo | ✅ |
| **C3** | `/auth/refresh` → `501`; `AuthService` deletado; `AuthModule` sem provider | §4.5 (*"does not issue tokens"*); ADR-013 *Settled*; o spec (`x-mvp-scope: excluded`, `x-blocked-by: ADR-013`, resposta `501`) | `tests/integration/auth-refresh.spec.ts` **6/6** | ✅ |
| **C4** | `additionalProperties: false` nos 2 schemas de request e em **todo** nível aninhado; descrições; prosa de `docs/api-spec.md` corrigida | §4.5 vs. o default do OpenAPI — o schema silencioso documentava uma tolerância que o servidor não tem | a regra (C5) falhava nomeando **5** schemas antes da anotação e passa depois | ✅ |
| **C5** | regra `request body` no `scripts/contract-gate.mjs` (caminhada recursiva; mapas livres isentos) | §4.5, R7 | **N-20** (raiz) e **N-21** (aninhado), sobre o CLI real | ✅ |
| **C6** | `CHANGELOG.md`: as 3 mudanças breaking, com caminho de migração | §4.4 | o arquivo; a linha *Added* de `/auth/refresh` ganha a data em que passou a ser verdadeira | ✅ |
| **C7** | notas de estado datadas (`BACKLOG.md` P0.6 e P1.14, `docs/adr/013`) + este relatório | §4.5, §4.4, disciplina da casa | — | ✅ |

---

## 2. Achados

### 2.1 O `ValidationPipe` existia desde 2026-10-07 e não tinha sobre o que agir

`BACKLOG.md` P0.6 está marcado **DONE 2026-10-07** com a aceitação *"`whitelist` +
`forbidNonWhitelisted` + `transform`; unknown field → 400, not silent strip"*. O pipe está configurado
exatamente assim desde então — e o *segundo* membro da aceitação era impossível: **não havia um único DTO
de request no repositório**, então todo `@Body()` era `any` e um pipe não tem metatype para validar contra
`any`. Medido, revertendo os dois controllers a `5365c11` (o estado commitado antes de A5a):
**18 dos 24 casos de `request-validation.spec.ts` falham**, todos com `Expected: 400, Received: 201`. `{}`
era aceito; `mode: 'irt'` era aceito; `pack_id: 'lesson-a2-email'` era aceito; qualquer membro a mais era
aceito **e chegava ao serviço**. Nada no repositório podia ver isso: a aceitação é prosa, e um pipe que não
age sobre nada é indistinguível de um pipe que age.

A5a fecha a lacuna e, com ela, corrige o registro: a linha de P0.6 passa a dizer o que passou a ser
verdade e **quando** (a nota em `BACKLOG.md`).

### 2.2 O servidor servia `201` onde o contrato declara `200` — e o inventário medira o documento, não o servido

`docs/api-spec.openapi.yaml` dá a cada operação **uma** resposta de sucesso, e para as duas é `200`.
Medido: o servidor respondia **`201`** — o default do NestJS para `POST` — e `git log -S '@HttpCode'` sobre
`src/` não encontra nenhum commit que tenha posto decorator de status em qualquer dos dois métodos. A
auditoria de A0 (`docs/api/inventario.md`) registrou o `200` **do documento** como o fato; o status
**servido** nunca foi medido. É a mesma classe de defeito do prefixo `/api/v1` de A3: um documento que
afirma o falso — mas na direção oposta, porque aqui o documento estava certo e o código errado.

`200` também é o lado defensável: nenhuma das duas operações cria recurso endereçável (não volta
`Location`, nenhum id é cunhado — o placement calcula uma faixa para um corpo cujo dono o chamador já
identificou pelo caminho; o practice pontua uma submissão).

### 2.3 Cinco artefatos afirmavam `501` para `/auth/refresh`; o código discordava dos cinco

O endpoint devolvia `200` com `{access_token: 'mock_access_token', expires_in: 900}` — um valor com forma
de bearer token, emitido por uma API que §4.5 proíbe de emitir token. Já diziam `501`:
`CHANGELOG.md` (*"Returns `501`"*, desde A2), `docs/security-audit.md` V2.2.1, `iac/kong/kong.yml`
(*"501 until P1.15–P1.17"*), o spec canônico (`x-mvp-scope: excluded` + `x-blocked-by: ADR-013` + resposta
`501` com descrição *"Do not implement"*) e `BACKLOG.md` P1.14. **O código concordava com nenhum.**

A execução segue a instrução de ADR-013 ao pé da letra — *"must not be implemented"*, com o path
**mantido** e anotado — e **não** remove a rota: remover um path publicado é breaking (§4.4) e o próprio
ADR declina autorizar (*"this record is not the place to authorise one"*).

Um artefato **não** dizia `501`: `docs/api-spec.md` afirmava que a rota *"must be deleted from the NestJS
routes, not merely annotated"* e atribuía a remoção a **ADR-038 / ADR-043** — medido, **nenhum dos dois
documentos menciona o endpoint**. O que aquela frase tinha de operativo era a *emissão* do mock, que era a
violação; isso A5a removeu. A remoção da rota continua nomeada como a opção aberta de
`docs/api/inventario.md` D-3 (§8.10).

### 2.4 O default do OpenAPI é o oposto de §4.5, e a regra do gate foi escrita antes da anotação

`additionalProperties` vale `true` por default. Um schema que se cala **documenta uma tolerância que o
servidor não tem** — e um cliente gerado a partir do documento seria escrito para confiar nela. A regra
nova foi escrita **primeiro** e falhou, nomeando exatamente os cinco schemas alcançáveis a partir de um
`requestBody` (`DiagnosticRequest`, `DiagnosticRequest.prior_estimate`, `PracticeSubmission`,
`responses[]` e o ramo objeto do `oneOf` de `response`); a lista anotada em C4 **deriva da regra**, não foi
adivinhada. Um mapa livre (sem `properties`, só um schema de valor em `additionalProperties`) é isento de
propósito: não declara conjunto de membros contra o qual rejeitar, e a regra de §4.5 é sobre membros. Um
limite fica declarado no próprio módulo em vez de sugerir cobertura total: a caminhada cobre `properties`,
`items`, `oneOf`/`anyOf`/`allOf` e `$ref` (com guarda de ciclo), e um schema cujos membros cheguem por
composição não coberta não é alcançado — motivo pelo qual os cinco schemas que a regra nomeia foram
conferidos um a um contra o YAML, e não aceitos por inferência.

### 2.5 O `pattern` de `item_id` do contrato admite 84 dos 855 ids que o catálogo declara

Consequência de *enforcement*, não defeito de código — e é medível. O catálogo tem dois esquemas de pack:

| esquema | arquivos | ids distintos | conformes a `^(grm\|voc\|rdg\|prn\|lst\|coh)_[a-z0-9_.-]+$` |
|---|---|---|---|
| `pack-les-*.md` (hífen) — o que o check [9] cobre | 7 | 49 | **49** |
| `pack_les_*_v1.md` (underscore) — *"outstanding migration"* | 115 | 806 | **35** |

Ou seja: **771** ids (`vocab.writing.svo`, `grammar.svo_order`, …) passam a ser **recusados** na borda, como
o contrato declara desde A2 enquanto nada verificava. Os 115 packs são exatamente os que
`python3 verify-integrity.py` já marca como migração pendente (`post-lesson-practice-spec.md` §12), e
`src/infrastructure/content/content-loader.ts` os carrega. `pack_id` **não** tem esse problema: os 122
packs efetivos casam o `pattern` (os 7 arquivos de nome hífen declaram `pack_id` explícito em forma
underscore). Registrado no `CHANGELOG.md` e em §8.4.

---

## 3. Arquivos e commits

| commit | hash | conteúdo |
|---|---|---|
| C1 | `e26eb44` | `src/modules/placement/dto/diagnostic-request.dto.ts`, `src/modules/practice/dto/practice-submission.dto.ts`, `src/modules/practice/dto/response-shape.ts`, os 2 controllers, os 2 services, `tests/integration/request-validation.spec.ts`, `tests/unit/response-shape.spec.ts` |
| C2 | `f4c6422` | os 2 controllers (`@HttpCode(200)` + import), `tests/integration/post-success-status.spec.ts` |
| C3 | `e4d6941` | `src/modules/auth/auth.controller.ts`, `auth.module.ts`, **`auth.service.ts` deletado**, `tests/integration/auth-refresh.spec.ts` |
| C4 | `9e67a4b` | `docs/api-spec.openapi.yaml`, `docs/api-spec.md` |
| C5 | `81a1bf4` | `scripts/contract-gate.mjs`, `tests/contract/gate.spec.ts` (N-20/N-21) |
| C6 | `a2797fa` | `CHANGELOG.md` |
| C7 | este commit | `BACKLOG.md`, `docs/adr/013-…md`, `reports/api/fase-5.md` |

Uma classe por commit (R8). Nenhum arquivo alheio à fase foi tocado; os 7 `packs/a2/*` que já estavam
modificados no início da fase continuam fora dos commits (ver §9).

---

## 4. Saídas dos gates — ANTES → DEPOIS

| gate | antes (abertura de A5a) | depois |
|---|---|---|
| `npm run typecheck` | OK | OK |
| `npm run lint` | 0 erros, 3 *warnings* (arquivos ignorados) | 0 erros, os mesmos 3 *warnings* |
| `npm run domain:check` | 23 arquivos, 0 violações | 23 arquivos, 0 violações |
| `npm run rls:check` | 121 arquivos, 0 violações | **123** arquivos, 0 violações (A5a somou DTOs a `src/`) |
| `npm run contract:gate` | PASS | PASS |
| `npm run kong:check` | PASS (1 serviço, 5 rotas, 3 plugins, 9 asserções) | PASS (o mesmo) |
| `node scripts/migration-check.mjs` | 13 passando | 13 passando |
| `npm run test:gate` | PASS — **361 passando**, 5 vermelhas allowlistadas (ADR-021), 8 *skipped*, 374 no total | PASS — **404 passando**, as mesmas 5 vermelhas, 8 *skipped*, **417** no total |
| `tests/contract/` | 33 (gate 20 + schemas 13) | **35** (+2: N-20, N-21) |
| `python3 verify-integrity.py` | PASS — 0 falhas | PASS — 0 falhas, 1 advertência (a pré-existente do esquema `pack_les_*`) |
| `python3 prd-score.py` | PASS | PASS — **92.6%** (limiar 80%) |

`npm run test:gate` passa de 374 para 417 testes: **43 novos** — 24 (`request-validation`) + 8
(`response-shape`) + 3 (`post-success-status`) + 6 (`auth-refresh`) + 2 (N-20/N-21).

---

## 5. Controles negativos (R7)

Nenhum veredito desta fase se apoia em "o teste passa". Cada um tem um controle que **falha** se a
obrigação não estiver sendo cumprida, e o controle roda contra o artefato que embarca:

| controle | o que ele fixa | resultado |
|---|---|---|
| **N-20** — `additionalProperties` removido de `DiagnosticRequest`, CLI real | a regra `request body` pega a **raiz** | `FAIL`, nomeando o schema |
| **N-21** — removido só de `responses[]` | a caminhada **recursa** (o nível onde um `whitelist` também age) | `FAIL`, nomeando `responses.items` |
| reverte os 2 controllers a `5365c11` (`body: any`) | cada uma das 18 recusas é uma recusa que **não existia** | 18/24 vermelhos, `Expected: 400, Received: 201` |
| remove `@HttpCode(200)` | o `201` do framework é o estado anterior | 2/3 vermelhos, `Expected: 200, Received: 201` |
| o C3 antes de `e4d6941` | a ausência do `501` e do corpo `Problem` | 5/6 vermelhos, `Expected: 501, Received: 201` |
| caso permanente em `auth-refresh.spec.ts` | o corpo **não pode conter `token`** — é a regressão que A0 registrou | verde |
| `post-success-status.spec.ts` lê o documento | o status servido **tem** de estar entre os declarados; um `201`/`202` futuro falha em qualquer direção | verde |

---

## 6. Desvios registrados

1. **Duas asserções que já estavam certas mudaram de lugar.** `request-validation.spec.ts` afirmava
   `200` nos casos positivos; passou a afirmar `< 400` (é uma suíte sobre aceitar/recusar), e o status
   virou o objeto de `post-success-status.spec.ts`, que o lê do documento. Sem isso, o commit C1 não
   seria verde por si ([R8](CONSTITUTION.md)) e o `200` ficaria afirmado em dois lugares.
2. **`@HttpCode(200)` é commit separado do DTO** embora ambos sejam "conformar as duas `POST` ao
   documento": o caminho de migração de um consumidor é diferente (§4.4 lista *"changing a success status
   code"* e *"tightening validation"* como entradas distintas), e o `CHANGELOG.md` as registra
   separadamente.
3. **A prosa viva foi corrigida, o documento datado não.** `docs/api-spec.md` é vivo e ganhou a correção
   de §2.3; `docs/api/inventario.md` é datado (medição de A0) e ficou intacto, inclusive a linha
   *"`/auth/refresh` devolve token mock"*, que era **verdadeira quando foi escrita**.
4. **`additionalProperties: false` reverte uma decisão minha anterior** (não adicionar). A razão da
   reversão é §4.5 ser lei superior ao spec: o silêncio do schema é uma afirmação, e ela é falsa. O
   arquivo já usava a chave nos schemas de *response*.
5. **A medição de §2.1 só apareceu porque dois controllers foram revertidos.** A suíte nasceu verde
   contra o código já mudado; o número "18 de 24" é de uma execução contra `5365c11`, não uma inferência.

---

## 7. Onde cada obrigação mora agora

| obrigação | onde ela é cumprida | o que falha se parar de ser |
|---|---|---|
| membro não declarado é recusado (§4.5) | `src/modules/*/dto/*.dto.ts` + o `ValidationPipe` de `src/app.setup.ts` | `tests/integration/request-validation.spec.ts` |
| o schema **declara** que recusa (§4.5 vs. default do OpenAPI) | `docs/api-spec.openapi.yaml`, 5 lugares | `npm run contract:gate`, regra `request body` (N-20/N-21) |
| o status servido está entre os declarados | `@HttpCode(200)` nos 2 controllers | `tests/integration/post-success-status.spec.ts` |
| a API não emite token | `auth.controller.ts` (`NotImplementedException`); `AuthService` não existe | `tests/integration/auth-refresh.spec.ts` (inclui o caso do `token` ausente) |
| o caminho de migração de quem já chamava | `CHANGELOG.md`, seção *Changed — breaking* | leitura humana; §4.4 é a lei |
| a aceitação de P0.6 é verdadeira | `BACKLOG.md` (a nota datada na própria linha) | leitura humana |

---

## 8. Pendências humanas e bloqueios

### 8.1 A5b está bloqueada, e o bloqueio é uma decisão, não trabalho

Autorização por objeto exige saber **quem é o sujeito** da requisição. ADR-013 só define isso na metade
*Open* — nenhuma das suas perguntas foi respondida, e A5a não respondeu nenhuma. ADR-038 segue `Proposed`.
Além disso, `tests/bdd/` afirma **403** onde `CONSTITUTION.md` §4.4/R6 exigem **404** para o objeto de
outro learner; implementar A5b antes disso cristalizaria a resposta errada numa suíte. Nada de A5b foi
antecipado.

### 8.2 O aviso de 90 dias para o *tightening* de validação — decisão aberta

§4.4 lista *"tightening validation so previously valid input is rejected"* como breaking e descreve um
regime de aviso para **recurso deprecado**. Medido: **0 tags**, nenhuma versão publicada, nenhum cliente
no repositório. A questão que fica é se um aviso de 90 dias (`Deprecation`/`Sunset`) era devido e **contra
qual recurso** — o regime de §4.4 é escrito para recursos, e aqui nenhum recurso é deprecado. A5a registra
o breaking no `CHANGELOG.md` com o caminho de migração (o que §4.4 exige de forma inequívoca) e **não**
inventa um `Sunset` que ninguém pode datar.

### 8.3 `201` + `Location`: a recomendação de A0 contra o contrato

`docs/api/inventario.md` registra, da auditoria de A0, a recomendação *"POST sem 201/Location"* para as
duas operações. A5a fez o oposto — serviu o `200` que o contrato declara — porque o contrato é lei e o
código nunca fora conformante. Adotar `201` + `Location` exige **emendar o contrato primeiro** (§4.4,
*"changing a success status code"*) e é decisão humana. Fica nomeado, não silenciado.

### 8.4 O `item_id` de 771 ids da metade legada do catálogo (§2.5)

O contrato admite `^(grm|voc|rdg|prn|lst|coh)_[a-z0-9_.-]+$`; 115 packs declaram `vocab.writing.svo` e
formas próximas, e o loader os carrega. Hoje o endpoint de practice é **stub** (não consulta item nenhum),
então nada quebra; quando o fluxo real for ligado, esses itens não serão submartíveis até a migração que
`verify-integrity.py` já cobra. As duas saídas são decisão humana: migrar os packs, ou emendar o pattern —
A5a não fez nenhuma das duas e registrou a medição no `CHANGELOG.md`.

### 8.5 `learner_id` no corpo *vs.* o parâmetro de caminho

Os dois DTOs aceitam `learner_id` do corpo sem exigir que ele concorde com o `{learner_id}`/`:id` do
caminho — o contrato não declara essa regra e inventá-la seria inventar lei. É uma checagem de
autorização disfarçada de validação, e portanto pertence a A5b.

### 8.6 `NextActivityRequest` continua órfão, e §4.3 vs. o spec continua aberto

`NextActivityRequest` não é referenciado por nenhuma operação, e o spec publica `snake_case` enquanto
§4.3 exige `camelCase`. A5a não toca nenhum dos dois: o primeiro é contrato morto (remover é breaking, é
ato humano) e o segundo é o mesmo atrito que A5a encontrou nos dois corpos — agora **nomeado** em §8.5.

### 8.7 `format: uri`, `^(A|B|C|D)$` e o `{}` continuam como o contrato os deixa

- `response.audio_ref` declara `format: uri` e **nenhuma das duas linguagens de validação** o verifica por
  default: um `audio_ref: "não é uri"` passa no DTO. `format` é anotação no OpenAPI 3.1 e obrigação no
  validador, e não há um aqui.
- O ramo string de `response` aceita qualquer string, porque o contrato descreve `A`–`D` **em
  `description`**, não em `enum`/`pattern`. Recusar seria inventar uma restrição — e `items[].response` é
  texto livre para os itens de produção.
- `{}` no ramo objeto de `response` é aceito (o contrato não declara `required` ali).

Os três estão no mesmo lugar: são decisões de contrato, não omissões de implementação.

### 8.8 Os ADRs afetados seguem `Proposed`

`docs/adr/038`, `040`, `041`, `042`, `043` continuam `Proposed`. A5a não os ratifica; a nota datada em
`docs/adr/013` diz item por item o que passou a ser verdade no terreno.

### 8.9 `Sunset` do `ErrorResponse` — herdado de A4a e ainda aberto

A tabela *Deprecated* do `CHANGELOG.md` continua sem `Sunset` para `ErrorResponse`, pela mesma razão de
antes (`reports/api/fase-4.md` §8.4): a data exige decisão humana. A5a não a inventou.

### 8.10 A remoção de `/auth/refresh` (inventario D-3) é ato humano

Ver §2.3. A rota fica publicada e responde `501`. Remover o path — do NestJS **e** do contrato — continua
sendo o outro ramo de `docs/api/inventario.md` D-3, e exige emenda do contrato.

### 8.11 Aviso de escopo para A6

`reports/api/fase-2.md` diz (§121) que a confidencialidade de A6 é "uma linha de `select`". Isso é falso
como afirmação: o spec canônico declara `key` e `is_key` como **`required`** (linhas 386, 479, 510, 571) e
`tests/integration/content-api.spec.ts` os asserta. Removê-los é breaking (§4.4), logo é decisão humana,
não uma linha.

---

## 9. O que NÃO foi feito e por quê

- **Nada foi removido** além de `src/modules/auth/auth.service.ts` (cujo único método cunhava o mock — a
  violação de §4.5 em si) e do fallback inalcançável `body.pack_id || …`. Os 4 `cryptoRandom()` sem *call
  site* (P2 registrado em `reports/api/fase-4.md` §2.7) continuam onde estão: remoção não é desta classe, já
  estavam registrados como P2 antes de A5a, e A5a não os transformou em trabalho.
- **Os 80 `*.spec.{js,js.map,d.ts,d.ts.map}` rastreados** continuam rastreados (P2 herdado, registro em
  `reports/api/fase-4.md`); nenhum foi criado por A5a.
- **`tsc -p tsconfig.test.json --noEmit` continua falhando** (TS6059 + TS5110) — P2 herdado, não medido
  por esta fase. `npm run typecheck` (o gate real) passa.
- **A suíte de BDD não foi tocada**, inclusive os cenários que afirmam 403: eles dependem exatamente da
  decisão que A5b espera (§8.1).
- **`/auth/refresh` não foi removido** (§2.3, §8.10).
- **Os 7 `packs/a2/*` que estavam modificados na abertura da fase não foram commitados nem revertidos.**
  Eles precedem A5a, não pertencem a nenhuma das classes desta fase e misturá-los tornaria os commits
  irrevisáveis por classe (R8). Ficam como estavam: no working tree.

---

## Apêndice — evidência crua

Transcrições das execuções. Nada abaixo foi reescrito: os nomes de caso, as contagens e as mensagens são
as que cada comando imprimiu, e cada bloco diz contra qual revisão rodou.

```
# 1. A lacuna de §2.1 — contra 5365c11 (os 2 controllers com `@Body() body: any`)
$ git show 5365c11:…/placement.controller.ts > src/modules/placement/placement.controller.ts   # idem practice
$ npx jest tests/integration/request-validation.spec.ts
  ✓ accepts the body the contract publishes (38 ms)
  ✓ accepts the optional `prior_estimate` object and each of its three members (3 ms)
  ✕ rejects an empty body: both required members are named (5 ms)
  ✕ rejects a member the schema does not declare (`forbidNonWhitelisted`, §4.5) (3 ms)
  ✕ rejects a `mode` outside the enum (3 ms)
  ✕ rejects a `learner_id` that is not a uuid (`format: uuid`) (2 ms)
  ✕ rejects a non-numeric `prior_estimate.theta` (2 ms)
  ✕ rejects an undeclared `prior_estimate.source` (enum) (2 ms)
  ✕ rejects an undeclared member *inside* `prior_estimate` — the nested object is whitelisted too (2 ms)
  ✕ answers 400, never 500, when the body is not a JSON object (2 ms)
  ✓ accepts the body the contract publishes (2 ms)
  ✓ answers with the pack the caller submitted, not a fallback (2 ms)
  ✕ rejects a missing `responses` (1 ms)
  ✕ rejects a valid body carrying an undeclared top-level member (2 ms)
  ✕ rejects a `pack_id` outside the published pattern (2 ms)
  ✕ rejects zero responses (`minItems: 1`) (2 ms)
  ✕ rejects an `item_id` outside the published pattern (1 ms)
  ✓ accepts an `item_id` in the catalogue’s form (1 ms)
  ✕ rejects a negative `response_time_ms` (`minimum: 0`) (1 ms)
  ✕ rejects a `confidence` above 1 (`maximum: 1`) (2 ms)
  ✓ accepts the object branch of `response` (`oneOf`) (2 ms)
  ✕ rejects an undeclared member inside the object branch of `response` (2 ms)
  ✕ rejects a non-string `transcript` (2 ms)
  ✕ rejects a member inside an item that the item schema does not declare (2 ms)
Tests:       18 failed, 6 passed, 24 total

# e a mesma suíte contra o código de A5a:
Tests:       24 passed, 24 total

# 2. O status de §2.2 — sem `@HttpCode(200)` (o estado de e26eb44)
  ✓ the document declares exactly one success status per operation, and it is 200 (1 ms)
  ✕ `POST …/placement` answers 200 — not NestJS's default 201 for POST (27 ms)
  ✕ `POST /learners/{learner_id}/practice` answers 200 for the same reason (4 ms)
  Expected: 200
  Received: 201
  Expected: 200
  Received: 201
Tests:       2 failed, 1 passed, 3 total

# 3. A borda de §2.3 — contra 5365c11 (controller + module + service restaurados)
  ✕ answers 501, not 200 (27 ms)
  ✕ answers with `Problem`, not a body of its own shape (4 ms)
  ✓ omits `detail`: a 5xx never serialises an internal message (2 ms)
  ✕ carries a `request_id` that is a uuid (2 ms)
  ✕ carries the correlation id in the header as well as the body (1 ms)
  ✕ serves no token of any kind — the regression A0 logged is closed (1 ms)
  Expected: 501
  Received: 201
  Expected pattern: /^application\/problem\+json(; charset=utf-8)?$/
  Received string:  "application/json; charset=utf-8"
  Expected substring: not "access_token"
  Received string:        "{\"access_token\":\"mock_access_token\",\"expires_in\":900}"
Tests:       5 failed, 1 passed, 6 total
```

Note-se o terceiro caso: o único que passa no estado anterior é o que afirma que um 5xx **omite** `detail`
— verdade por acidente, porque não havia `Problem` nenhum. É a razão de o controle negativo do `token` (§5)
ser um caso separado e não uma consequência dos outros.

```
# 4. A regra de §2.4 — (a) contra o spec de 5365c11, ANTES da anotação (C4)
$ node scripts/contract-gate.mjs --spec <spec de 5365c11> --src src
FAIL: request body: POST /learners/{learner_id}/placement requestBody (application/json) declares members but not `additionalProperties: false`; §4.5 mandates that non-whitelisted properties are rejected, so the document would promise a tolerance the server refuses
FAIL: request body: POST /learners/{learner_id}/placement requestBody (application/json).prior_estimate declares members but not `additionalProperties: false`; …
FAIL: request body: POST /learners/{learner_id}/practice requestBody (application/json) declares members but not `additionalProperties: false`; …
FAIL: request body: POST /learners/{learner_id}/practice requestBody (application/json).responses[] declares members but not `additionalProperties: false`; …
FAIL: request body: POST /learners/{learner_id}/practice requestBody (application/json).responses[].response (oneOf 1) declares members but not `additionalProperties: false`; …
FAIL: contract gate — 5 violation(s)          # exit=1

# (b) N-20 — removida SÓ a raiz de DiagnosticRequest
FAIL: request body: POST /learners/{learner_id}/placement requestBody (application/json) declares members but not `additionalProperties: false`; …
FAIL: contract gate — 1 violation(s)          # exit=1

# (c) N-21 — removida só a de `responses.items` (a caminhada recursa?)
FAIL: request body: POST /learners/{learner_id}/practice requestBody (application/json).responses[] declares members but not `additionalProperties: false`; …
FAIL: contract gate — 1 violation(s)          # exit=1
```

Uma armadilha que a (b) revelou, e que vale registrar: a **primeira** tentativa desta medição removeu a
*descrição* que cita a frase `` `additionalProperties: false` `` — a string aparece em prosa dentro do
próprio schema — e o gate, corretamente, **passou**, porque a chave continuava lá. A cirurgia por texto foi
refeita pela chave. O controle N-20 de `gate.spec.ts` não corre esse risco: ele muta a AST do YAML.

```
# 5. O censo de item ids de §2.5 (medido sobre `packs/`, os dois esquemas)
pack-les-*.md        (7 arquivos)  ids distintos  49  →  conformes  49  |  não-conformes   0
pack_les_*_v1.md   (115 arquivos)  ids distintos 806  →  conformes  35  |  não-conformes 771
pack_id efetivo    (122 packs)                        conformes 122/122  ^pack[-_]les_[a-z0-9_]+(_v1)?$
verify-integrity.py [11]: "all 855 item ids are unique across every pack and both schemas"   # 49 + 806

# 6. A suíte inteira, no fechamento de A5a
Test Suites: 1 failed, 1 skipped, 26 passed, 27 of 28 total
Tests:       5 failed, 8 skipped, 404 passed, 417 total
PASS: test gate — failing set equals the allowlist (5 known-red from ADR-021)
```

**Censo de commits desta fase:** 6 + este. **Vermelho antes de verde:** as 4 classes de mudança de
comportamento (§5) têm o vermelho capturado acima, cada uma contra a revisão anterior à sua. **Números
citados sem medição própria:** os de "antes" em §4 — `374`/`361` testes e `20`+`13` da suíte de contrato —
vêm de `reports/api/fase-4.md` §4 e do seu apêndice, onde foram medidos no fechamento de A4.
