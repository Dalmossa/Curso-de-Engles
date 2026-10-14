# Inventário da API — estado em A0 (2026-10-14)

> **Fase:** A0 da missão "API REST completa" · **Branch:** `main` (HEAD `48f67d2`) · **Read-only.**
> Toda afirmação abaixo cita `arquivo:linha`. Números sem fonte estão marcados **UNVERIFIED**.
> Método: leitura de `src/**`, dos **dois** specs OpenAPI, do ERD v1.0.0, de `BACKLOG.md`,
> `CHANGELOG.md`, `PRD.md`, `ADR-012/013/018/027/028/030` e `tests/bdd/README.md`.

---

## 0. Sumário executivo

| Fato | Evidência |
|---|---|
| **12 rotas implementadas**, **10 operações nos specs** | `grep @Get/@Post src/**` (12) vs. parse de `docs/api/openapi.yaml` (10) |
| **2 rotas sem spec**: `GET /health`, `GET /ready` | spec tem 10 paths, nenhum é health/ready |
| **0 operações de spec sem rota** — as 10 existem no código | §2 |
| **2 arquivos OpenAPI concorrentes e divergentes** | §3.4 |
| **Os gates de contrato validam o arquivo OBOLETO** | `contract-check.mjs:5`, `tests/contract/*.spec.ts:9` leem `docs/api/openapi.yaml` |
| **0 guards em 0 controllers** | `grep @UseGuards src/` → vazio |
| **0 DTOs de request** (nenhum `class-validator` em `src/`) | `src/dto/content/` e `src/dto/learners/` estão **vazios** |
| **8 das 12 rotas são mocks** que não tocam o DB | §2, coluna *Implementação* |
| **`/auth/refresh` devolve token mock** onde o CHANGELOG manda `501` | `auth.service.ts:5` vs `CHANGELOG.md` (*Added*) |
| **Nenhum prefixo global / versão** apesar de §4.4 e ADR-012 os exigirem | `grep setGlobalPrefix src/` → vazio |

**Veredito do contrato:** a API não é a fonte de verdade de nada hoje. O ERD é contrato (ADR-018),
mas o runtime é 2/3 mock; o contrato é publicado em dois arquivos divergentes, nenhum deles validado
por schema; e cada camada (spec, código, CHANGELOG, BACKLOG) conta uma história diferente sobre as
mesmas 10 rotas.

---

## 1. Método e fontes

| Fonte | O que define |
|---|---|
| `docs/api/openapi.yaml` (771 l., **YAML válido**) | o que `contract-check.mjs` e `tests/contract/*` leem |
| `docs/api-spec.openapi.yaml` (1132 l., **markdown que contém 1 bloco ```yaml de 1092 l.**) | o que `ADR-012` e `CHANGELOG.md` amendam — **é o mais novo** |
| `src/modules/*/**.controller.ts` | as rotas que existem |
| `docs/data-model.erd.md` (1073 l., ADR-018) | as 33 tabelas e as 9 derivações que não podem virar coluna |
| `BACKLOG.md`, `PRD.md` §9, `tests/bdd/README.md` | os consumidores nomeados (R3) |

**Não** existe mapa rota↔spec em nenhum lugar, e **não** existe teste HTTP: nenhum teste usa
`supertest`/`app.inject` (`grep supertest tests/` → vazio). `tests/integration/content-audio.spec.ts:173`
instancia `new ContentController(service)` **diretamente**. Portanto nada testa roteamento, o
`ValidationPipe` global, o filtro de exceções, CORS ou a ausência de guards.

---

## 2. Rotas implementadas × contrato

Prefixo real: **nenhum**. `src/main.ts:6-29` não chama `setGlobalPrefix` nem `enableVersioning`, e
não registra interceptors. Todo path abaixo é servido na raiz.

| # | Método | Path (código) | Path (contrato) | Controller:linha | DTO request | Guard | Teste | Consumidor nomeado (R3) | Implementação |
|---|---|---|---|---|---|---|---|---|---|
| 1 | POST | `/auth/refresh` | `/auth/refresh` | `auth.controller.ts:8` | — | **nenhum** | `tests/contract/endpoints.spec.ts:24` (só presença da string no spec) | **NENHUM** — excluído por `ADR-013`, `BACKLOG.md:90`, `P1.14` | **mock** — devolve `{access_token:'mock_access_token'}` |
| 2 | GET | `/learners/:id/profile` | `/learners/{learner_id}/profile` | `learners.controller.ts:8` | — | **nenhum** | `endpoints.spec.ts:22` | `tests/bdd/README.md:237` (fluxo BOLA); `PRD.md` §9 M6 | **mock** — `learners.service.ts:5` |
| 3 | GET | `/learners/:id/mastery` | `/learners/{learner_id}/mastery` | `learners.controller.ts:15` | — | **nenhum** | `endpoints.spec.ts:23` | `PRD.md` §9 M6; `P1.2` | **mock** — `learners.service.ts:24` |
| 4 | GET | `/learners/:id/next` | `/learners/{learner_id}/next` | `curriculum.controller.ts:8` | `query: any` | **nenhum** | `endpoints.spec.ts:20` | `P1.3` — **NOT DONE** (`BACKLOG.md:119`) | **mock** — `curriculum.service.ts:5` |
| 5 | POST | `/learners/:id/practice` | `/learners/{learner_id}/practice` | `practice.controller.ts:8` | `body: any` | **nenhum** | `endpoints.spec.ts:21` | `tests/bdd/README.md:81`; `P1.6` | **mock** — `practice.service.ts:5` |
| 6 | POST | `/learners/:id/placement` | `/learners/{learner_id}/placement` | `placement.controller.ts:8` | `body: any` | **nenhum** | `endpoints.spec.ts:19` | `P1.9`/`P1.10`; `tests/bdd/README.md:10` | **mock** — `placement.service.ts:5` |
| 7 | GET | `/content/lessons/:lesson_id` | `/content/lessons/{lesson_id}` | `content.controller.ts:40` | — | **nenhum** | `tests/integration/content-api.spec.ts:121` | `P1.12` | **real** (DB) |
| 8 | GET | `/content/packs/:pack_id` | `/content/packs/{pack_id}` | `content.controller.ts:53` | — | **nenhum** | `content-api.spec.ts:158` | `P1.12` | **real** (DB) |
| 9 | GET | `/content/listening/:dialogue_id` | `/content/listening/{dialogue_id}` | `content.controller.ts:66` | — | **nenhum** | `content-api.spec.ts:216` | `P1.12` | **real** (DB) |
| 10 | GET | `/content/listening/:dialogue_id/audio` | `/content/listening/{dialogue_id}/audio` | `content.controller.ts:92` | `rate?` (validado inline) | **nenhum** | `tests/integration/content-audio.spec.ts` | `P1.13` | **real** (DB + assinatura) |
| 11 | GET | `/health` | **ausente do contrato** | `health.controller.ts:5` | — | **nenhum** | `tests/unit/health.controller.spec.ts` | `P0.8` (`BACKLOG.md:78`) | mock estático |
| 12 | GET | `/ready` | **ausente do contrato** | `health.controller.ts:10` | — | **nenhum** | idem | `P0.8`; `P2.7` | mock — `checks` fixos em `true` |

Notas por linha:

- **(1) `/auth/refresh`.** Três artefatos dizem três coisas: `BACKLOG.md:90` *"It must not implement
  `/auth/refresh` — the platform is a Resource Server only. The published contract contains that
  path; the implementation must not."*; `CHANGELOG.md` (*Added*) diz que o path ficou anotado
  `x-mvp-scope: excluded` e **retorna `501`**; o código retorna **200 com um token mock**. O
  `AuthService` não valida nada, não conhece o IdP e **emite** credencial — exatamente o que a
  ADR-013 proíbe. É o achado mais grave do inventário: não é incompleto, é **contrário ao desenho**.
- **(2)/(3)/(4)/(5)/(6)** são `Mock*Service`: devolvem literais com o `:id` da URL ecoado. Nenhum
  abre transação, nenhum usa `PgSessionContext`, nenhum lê o DB. `withLearner` só aparece em
  `audit.service.ts:141` e `diagnostic-result.service.ts:26` — **nenhuma rota o aciona**.
- **(2)** ecoa o `:id` recebido e devolve `200` para **qualquer** UUID: não há conceito de
  propriedade. É o cenário BOLA do próprio repo (`tests/bdd/README.md:237`) falhando por construção.
- **(11)/(12)** `GET /ready` devolve `database: true`, `redis: true` **hardcoded**
  (`health.controller.ts:16-20`, com `TODO` admitido). Um probe de prontidão que sempre diz "pronto"
  é pior que ausente: o orquestrador nunca tira a instância do balanceamento.

---

## 3. Divergências (nos dois sentidos)

### 3.1 Rota sem spec — 2

| Rota | Consumidor | Por que está fora do contrato |
|---|---|---|
| `GET /health` | `P0.8` | o plano (§4/A2) pede `/healthz` e `/readyz` **fora** de `/v1`; nenhum dos dois specs declara qualquer probe |
| `GET /ready` | `P0.8`, `P2.7` | idem |

### 3.2 Spec sem rota — 0

As 10 operações de ambos os specs têm uma rota correspondente no código. **Não** há operação
publicada sem implementação.

### 3.3 Divergência de prefixo e versão

| | Contrato | Código |
|---|---|---|
| `docs/api/openapi.yaml` | `servers: https://api.its.example.com/v1` | rota na raiz (`/content/...`) |
| `docs/api-spec.openapi.yaml` | `servers: https://api.its.example.com/api/v1` | idem |
| `CONSTITUTION.md` §4.4 / `ADR-012` | versionamento por path **obrigatório** | `grep setGlobalPrefix src/` → **vazio** |

Um cliente que monte a base a partir do spec pede `/api/v1/content/lessons/x` e recebe **404**.

### 3.4 Dois specs concorrentes — e o gate valida o obsoleto

| | `docs/api-spec.openapi.yaml` | `docs/api/openapi.yaml` |
|---|---|---|
| Formato | **markdown** com 1 bloco ```yaml (1092 l.) | YAML puro (771 l.) |
| Parsea como YAML? | **não** (o arquivo é markdown) | sim |
| `servers` | `/api/v1` (pós-ADR-012) | `/v1` (pré-ADR-012) |
| Schemas | **15** (inclui `Problem`) | **14** (sem `Problem`) |
| `/auth/refresh` | `x-mvp-scope: excluded`, respostas `501` + `200` | sem anotação, só `200` |
| Content-types de erro | `application/json` **e** `application/problem+json` | só `application/json` |
| Quem lê? | **ADR-012 e CHANGELOG** (é o novo) | `contract-check.mjs:5`, `tests/contract/*.spec.ts:9`, `tests/contract/openapi.spec.ts:6` |

Isto é o **drift de contrato na sua forma mais perigosa**: o gate `contract:check` passa, mas passa
validando o arquivo **antigo**. E o gate não é um parser — é `String.includes`
(`contract-check.mjs:9-30`): confirma que 10 substrings aparecem no texto, não valida schema, não
compara com o código e não falha para uma rota nova. Não existe gate de drift.

---

## 4. Mapa ERD → recursos (33 tabelas)

Fonte das tabelas: `docs/data-model.erd.md` §6 (DDL) e §1 (contextos). Fonte das classes:
o desenho de A3/A4/A5 do plano e as rotas de §2. **Nenhuma** das 33 é `derived-never-stored` —
as derivações que nunca podem virar coluna estão em §8 do ERD e são listadas em §4.3 abaixo.

### 4.1 As 33 tabelas

| # | Contexto | Tabela | Classe | Superfície hoje | Consumidor / ADR |
|---:|---|---|---|---|---|
| 1 | 1 Catalog | `cefr_levels` | referência (leitura) | sem rota | A3; `stats` §3.1 |
| 2 | 1 Catalog | `domains` | referência (leitura) | sem rota | A3; `assessment` §1.2 |
| 3 | 1 Catalog | `skills` | referência (leitura) | sem rota | A3 |
| 4 | 1 Catalog | `modules` | **recurso público** | sem rota | A3 |
| 5 | 1 Catalog | `lessons` | **recurso público** | `GET /content/lessons/{id}` | P1.12 |
| 6 | 1 Catalog | `lesson_prerequisites` | sub-recurso (embutido) | sem rota | A3; `curriculum-graph` §4.3 |
| 7 | 1 Catalog | `skill_prerequisite` | interno (grafo) | sem rota | P1.3; ADR-021 |
| 8 | 2 Item Bank | `packs` | **recurso público** | `GET /content/packs/{id}` | P1.12 |
| 9 | 2 Item Bank | `items` | embutido (2 representações) | via pack/dialogue | A3; ADR-004 |
| 10 | 2 Item Bank | `item_options` | **interno** (contém `is_key`) | nunca servido cru | ADR-027 §2 |
| 11 | 3 Listening | `dialogues` | **recurso público** | `GET /content/listening/{id}` | P1.12 |
| 12 | 3 Listening | `dialogue_speakers` | interno (join) | sem rota | `listening-corpus` §2.1 |
| 13 | 3 Listening | `speakers` | embutido (`display_name`) | via dialogue | idem |
| 14 | 3 Listening | `voices` | **sub-recurso** (`voices[]`) | via dialogue | P1.12 |
| 15 | 3 Listening | `clips` | interno (vira playlist) | via `/audio` | P1.13 |
| 16 | 3 Listening | `clip_renders` | interno (URL assinada) | via `/audio` | ADR-028 |
| 17 | 4 Learner | `learners` | **recurso** (perfil) | `GET /learners/{id}/profile` (**mock**) | A4 (`/learners/me`); ADR-015 §3 |
| 18 | 4 Learner | `learner_mastery` | **sub-recurso** | `GET /learners/{id}/mastery` (**mock**) | A4; P1.2 |
| 19 | 4 Learner | `theta_estimates` | sub-recurso (gated) | via placement (**mock**) | A4; R6 / `diagnostic` §3.6 |
| 20 | 4 Learner | `fsrs_states` | sub-recurso (fila) | sem rota | A4 |
| 21 | 4 Learner | `error_log` | sub-recurso (leitura) | sem rota | A4; `post-lesson` §4.2 |
| 22 | 4 Learner | `affective_signals` | **somente interno** | sem rota | `curriculum-graph` §11 — sensível |
| 23 | 4 Refit | `fsrs_parameters` | interno/admin | sem rota | ADR-018 §3 |
| 24 | 4 Refit | `bkt_skill_params` | interno/admin | sem rota | `stats` §9.2 |
| 25 | 5 Delivery | `sessions` | recurso do aprendiz | sem rota | A4 |
| 26 | 5 Delivery | `practice_attempts` | recurso do aprendiz | `POST /learners/{id}/practice` (**mock**) | A4 |
| 27 | 5 Delivery | `item_responses` | interno/sub-recurso | via practice (**mock**) | A4; R6 |
| 28 | 5 Delivery | `listening_attempts` | recurso do aprendiz | sem rota | A4 |
| 29 | 5 Delivery | `slot_responses` | interno/sub-recurso | via practice (**mock**) | A4 |
| 30 | 6 Diagnostic | `diagnostic_results` | **sub-recurso** | `POST /learners/{id}/placement` (**mock**) | P1.10 |
| 31 | 6 Diagnostic | `diagnostic_responses` | interno | sem rota | P1.10 |
| 32 | 8 Compliance | `consent_records` | **sub-recurso** | sem rota | A4/A6; P1.15 |
| 33 | 8 Compliance | `append_only_events` | **admin** (WORM, só leitura) | sem rota | P2.2; ADR-029 |

### 4.2 Isolamento (RLS)

As 15 tabelas learner-scoped com política estão em `data-model.erd.md` §9. `its_platform_app`
é o único writer do GUC, via `PgSessionContext.withLearner` (`pg-session-context.ts:61`).
**Hoje nenhuma rota passa por ele** (§2). Portanto, das 15 tabelas learner-scoped, **zero são
alcançáveis pela API** — nem para escrever, nem para ler. O isolamento existe no banco e não é
exercido pela superfície que o plano vai construir.

### 4.3 Derivações que nunca podem ser coluna (ERD §8) — 9 predicados

Mastery gate · CI₉₅ · Retrievability `R(t)` · tamanho de pack L1 · modulação de estabilidade ·
`placement_provisional` · `skill_theta_reportable` · aciclicidade do DAG · composição de opções.
**Consequência para A3/A4:** `gate_passed` e `retrievability` aparecem como campos de resposta em
mocks (`learners.service.ts:26`) — são legítimos **se calculados**, e hoje são literais.

---

## 5. Gap analysis vs. checklist §5 do plano

| # | Item do checklist | Estado | Evidência |
|---:|---|---|---|
| 1 | Recursos substantivos no plural, kebab-case | ❌ ausente | `:id/profile`, `:id/next`, `:id/practice`, `:id/placement`, `/auth` (singular), `/health`, `/ready`; nenhum recurso de coleção |
| 2 | Verbos corretos (GET seguro, POST 201+Location, DELETE 204) | ⚠️ parcial | métodos certos; **nenhum `201`** — ambos os POST devolvem o `200` default |
| 3 | Códigos com critério (20+ códigos) | ⚠️ parcial | usados: `200,400,401,404,429,501`; **ausentes**: `201,204,202,304,405,406,409,412,415,422,428,500,503` |
| 4 | `application/problem+json` em todo erro | ❌ ausente | `problem-exception.filter.ts:43` usa `res.json()` → `Content-Type: application/json`; `grep problem+json src/` → **vazio**. O spec novo declara o media type; o código não o emite. Dois formatos coexistem: o filtro (Problem-like) e o 404 dos controllers (`{error,message,request_id}`, `content.controller.ts:44`) |
| 5 | Paginação por cursor + `Link` | ❌ ausente | não há endpoint de coleção |
| 6 | Filtros/ordenação documentados | ❌ ausente | único filtro é `?rate=` (`content.controller.ts:95`), validado inline |
| 7 | `ETag` + `If-None-Match` / `If-Match` | ❌ ausente | `grep -i etag src/` → vazio |
| 8 | `Idempotency-Key` | ❌ ausente | nenhum header lido em nenhum controller |
| 9 | `Range`/`206` para áudio | ⚠️ by-design | ADR-028 entrega playlist com URL assinada; o `Range` teria de vir do object store — **UNVERIFIED** (não há object store) |
| 10 | `Deprecation`/`Sunset` | ❌ ausente | usa-se `x-mvp-scope: excluded` (spec novo) em vez dos headers RFC |
| 11 | Correlação ponta a ponta | ⚠️ parcial | `request_id` gerado no filtro (`problem-exception.filter.ts:39`); **sem `traceparent`/W3C**; o `request_id` não é o mesmo entre sucesso e erro |
| 12 | Sem PII em logs | **UNVERIFIED** | não há configuração de logging no repo |
| 13 | Links `self`/`next`/`related` | ❌ ausente | nenhum payload tem `_links` |
| 14 | **Contrato OpenAPI = código (gate de drift)** | ❌ ausente | `contract-check.mjs` é `String.includes` sobre o spec **obsoleto**; nenhum teste compara rota↔código (§3.4) |
| 15 | Autenticação/segurança em toda operação | ❌ ausente | specs declaram `BearerAuth` global; o código **não tem guard**; `/health` e `/ready` estão fora do spec |

**Placar:** 0 `ok` · 5 `parcial`/`by-design`/`UNVERIFIED` · 10 `ausente`.

---

## 6. Endpoints do MVP que violam semântica HTTP

1. **`/health` e `/ready` na raiz e fora do contrato.** O plano quer `/healthz` e `/readyz` fora de
   `/v1`. `GET /ready` afirma `database:true`/`redis:true` sem checar nada.
2. **`POST /auth/refresh` → `200` com token mock.** Deve ser `501` (CHANGELOG) e idealmente não
   existir (ADR-013, `BACKLOG.md:90`). Emitir credencial contradiz "Resource Server".
3. **Sem versão de path.** `CONSTITUTION.md` §4.4 e ADR-012 exigem `/api/v1`; o código serve na raiz.
4. **POST sem `201`/`Location`** em `/practice` e `/placement`.
5. **BOLA/IDOR estrutural.** O `learner_id` vem do path (`ParseUUIDPipe`), não do token; não há
   guard nem checagem de propriedade. `GET /learners/{qualquer-uuid}/profile` devolve `200`.
   O plano (R6) quer **404** para objeto de outro aprendiz; o BDD do repo quer **403**
   (`tests/bdd/README.md:237`) — **os dois se contradizem** (§7, D-5).
6. **Mass assignment impossível de barrar.** `@Body() body: any` não tem metadados; o
   `whitelist`/`forbidNonWhitelisted` de `main.ts:10-17` não age. Não há um único DTO de request.
7. **Erros sem `application/problem+json`** e com **dois formatos** simultâneos (§5.4).
8. **Campos proibidos nas respostas.** `learners.service.ts:9-20` devolve `streak_days`, `xp` e
   `cefr_level` — removidos por ADR-015 §3 e ADR-018 §9.9 ("had no basis in any spec"); e
   `gate_passed` (`:26`), cuja coluna foi eliminada e que só pode existir **calculado** (4 cláusulas).
   `placement.service.ts:9-13` devolve `theta_estimate.theta` incondicionalmente, sem a
   reportabilidade de `diagnostic` §3.6 (R6).
9. **Sem idempotência em POST com estado.** `/practice` e `/placement` não leem `Idempotency-Key`
   nem têm unicidade no banco (A4 exige ambas).
10. **`GET /learners/:id/next` com `query: any`** — entrada não validada, não tipada.

---

## 7. Não resolvido em A0 (UNVERIFIED / decisões humanas)

| ID | Item | Estado |
|---|---|---|
| D-1 | Qual dos dois specs é a fonte de verdade? (o novo é o markdown; os gates leem o obsoleto) | **decisão humana** — A1 |
| D-2 | `docs/api-spec.openapi.yaml` é markdown, não YAML: publicá-lo como contrato exige um passo de extração, ou convertê-lo em YAML | **decisão humana** — A1 |
| D-3 | `/auth/refresh`: remover, ou manter e reduzir a `501`? | **decisão humana** (ADR-013 pede proposta de ADR) |
| D-4 | `/health` vs `/healthz`, e a dependência real de `/ready` | A2 (P0.8/P2.7 já têm o consumidor) |
| D-5 | BOLA: **404** (plano R6) vs **403** (`tests/bdd/README.md:237`). Um dos dois deve mudar | **decisão humana** — A1 |
| D-6 | `Range`/`206` para áudio: o object store o fornece? Não há object store no repo | **UNVERIFIED** — A3 |
| D-7 | PII em logs: não há config de logging | **UNVERIFIED** — A7 |
| D-8 | `src/common/filters/transform-interceptor.ts` duplica `src/common/interceptors/transform-interceptor.ts` e não é registrado (código morto); `src/dto/content/` e `src/dto/learners/` vazios; `error-response.dto.ts` não é usado | limpeza — A2 |

---

## Apêndice A — como reproduzir

```bash
cd its-platform
grep -rn "@Controller(\|@Get(\|@Post(\|@Put(\|@Patch(\|@Delete(" src --include=*.ts   # 12 rotas
grep -rn "UseGuards\|setGlobalPrefix\|enableVersioning\|problem+json\|class-validator" src   # vazio
python3 -c "import yaml;print(len(yaml.safe_load(open('docs/api/openapi.yaml'))['paths']))"  # 10
node contract-check.mjs                                                                     # PASS (substring)
```

## Apêndice B — veredito por rota (para dirigir A3/A4)

| Rota | Ação que A3/A4/A5 deve tomar |
|---|---|
| `/content/lessons\|packs\|listening\|listening/audio` | **manter**: é a única camada real; falta ETag/304, `problem+json` e a checagem "aprendiz nunca recebe `key`" (hoje `PackContent.items[].key` **é servido** — `content.service.ts:237`) |
| `/learners/{id}/profile\|mastery\|next\|practice\|placement` | **reescrever** sobre o DB + `PgSessionContext`; trocar `:id` por identidade derivada do token (A1(h)); DTOs estritos |
| `/auth/refresh` | **remover** ou `501` (D-3) |
| `/health`, `/ready` | **renomear/mover** para `/healthz`,`/readyz` e implementar as checagens reais |
