# Fase A0 — Auditoria do estado atual

**Data:** 2026-10-14 · **Branch:** `main` (HEAD `48f67d2`) · **Escopo:** read-only (nenhum código de produto alterado)
**Veredito:** ✅ **A0 concluída** — inventário, divergências, mapa ERD→recursos, gap analysis e violações de semântica HTTP entregues.
**Bloqueio remanescente:** ⛔ **R11** — o gate de teste é vermelho (5 falhas reais conhecidas) e não confiável na forma como está configurado; **não há allowlist por ID**. Ver §3 e §5/D-0.

---

## 1. Tarefas e veredito

| # | Tarefa (A0) | Veredito | Evidência |
|---:|---|---|---|
| 0 | R11 — rodar os gates e confirmar que são verdes e confiáveis | ⛔ **FALHA** | `reports/api/baseline/tests.txt`; §3 |
| 1 | Inventário rotas implementadas × `api-spec.openapi.yaml`, divergências nos dois sentidos | ✅ feito | `docs/api/inventario.md` §2–§3 |
| 2 | Mapa ERD (33 tabelas) → recursos, com classe e consumidor | ✅ feito | `docs/api/inventario.md` §4 |
| 3 | Gap analysis vs. checklist §5 | ✅ feito | `docs/api/inventario.md` §5 (0 `ok` · 5 parciais · 10 ausentes) |
| 4 | Endpoints do MVP que violam semântica HTTP | ✅ feito | `docs/api/inventario.md` §6 (10 itens) |
| — | R3 — endpoints sem consumidor → `candidatos.md` | ✅ feito | `docs/api/candidatos.md` (1 implementado sem consumidor; 15 candidatos bloqueados) |

**Saída principal:** a API não é hoje a fonte de verdade de nada. 12 rotas, 10 publicadas em **dois
specs divergentes**, **0 guards**, **0 DTOs de request**, **8 das 12 rotas mock**, e o gate de
contrato validando o spec **obsoleto**. Detalhe completo: `docs/api/inventario.md`.

### 1.1 Os cinco achados que mudam o custo de A1–A3

1. **Dois contratos, e o gate lê o velho.** `docs/api-spec.openapi.yaml` é **markdown** (não YAML),
   com 15 schemas (inclui `Problem`), `servers /api/v1` e `/auth/refresh` anotado
   `x-mvp-scope: excluded` + `501`; `docs/api/openapi.yaml` é YAML, 14 schemas, `servers /v1`, sem
   nada disso. `contract-check.mjs:5` e `tests/contract/openapi.spec.ts:6` leem **o velho**.
2. **`POST /auth/refresh` devolve um token mock.** `auth.service.ts:5` →
   `{access_token:'mock_access_token'}`. `BACKLOG.md:90` diz *"the implementation must not
   [implement /auth/refresh]"*; `CHANGELOG.md` diz que retorna `501`; `P1.14` diz que rotação é do
   IdP. Três artefatos, três histórias, e a implementação contradiz a ADR-013 ao **emitir** credencial.
3. **Nenhuma rota passa por `PgSessionContext`.** `withLearner` só é chamado por
   `audit.service.ts:141` e `diagnostic-result.service.ts:26`. As 15 tabelas learner-scoped com RLS
   são **inalcançáveis pela API** — nem para ler nem para escrever. As 5 rotas `/learners/*` são
   mocks que ecoam o `:id` da URL: BOLA estrutural.
4. **`/content/packs/{pack_id}` serve `items[].key`** (`content.service.ts:237`). O plano R6 e A3
   exigem que o aprendiz **nunca** receba gabarito. Hoje recebe, na rota real.
5. **Zero DTOs de request.** `src/dto/content/` e `src/dto/learners/` estão **vazios**; não há um
   `class-validator` em `src/`. Todo `@Body()` é `any`, então `whitelist`/`forbidNonWhitelisted`
   (`main.ts:10-17`) não tem metadados para agir.

---

## 2. Arquivos / commits

**Criados nesta fase** (nenhum arquivo de produto tocado):

| Arquivo | Conteúdo |
|---|---|
| `its-platform/docs/api/inventario.md` | inventário completo (§0–§6) + apêndices de reprodução e veredito por rota |
| `its-platform/docs/api/candidatos.md` | R3 — endpoints sem consumidor nomeado |
| `reports/api/baseline/*.txt` | 7 saídas de gate + `verify-integrity-DEPOIS.txt` |
| `reports/api/fase-0.md` | este relatório |

**Commit desta fase:** único, `docs(api): A0 — inventário, candidatos e relatório de fase`
(`git log --oneline -1 -- reports/api/fase-0.md`). Deliberadamente **não** inclui os 7 packs
`packs/a2/pack-les-a2-*.md` que já estavam modificados na árvore (classe de mudança diferente — R8).

---

## 3. Saídas dos gates — ANTES → DEPOIS

A0 não altera código de produto, então a expectativa **falsificável** é: todo gate idêntico.

| Gate | Comando | ANTES | DEPOIS | Arquivo |
|---|---|---|---|---|
| verify-integrity | `python3 verify-integrity.py` | ✅ PASS — 0 fail, 1 warn (exit 0) | ✅ **idêntico** | `baseline/verify-integrity[-DEPOIS].txt` |
| prd-score | `python3 prd-score.py` | ✅ PASS — **92.6%** (exit 0) | (não re-executado; só lê a raiz) | `baseline/prd-score.txt` |
| domain:check | `npm run domain:check` | ✅ PASS — 23 files, 0 viol. | ✅ **idêntico** | `baseline/domain-check.txt` |
| typecheck | `npm run typecheck` | ✅ PASS (exit 0) | ✅ **idêntico** | `baseline/typecheck.txt` |
| rls:check | `npm run rls:check` | ✅ PASS — 120 files, 0 viol. | ✅ **idêntico** | `baseline/rls-check.txt` |
| contract:check | `node contract-check.mjs` | ⚠️ PASS — *mas ver §4/N-4: não valida nada além de 10 substrings* | ✅ idêntico | `baseline/contract-check.txt` |
| **testes** | `npm test` | ❌ **FAIL — 36 falhas** (4 suites) | não re-executado (sem mudança de código) | `baseline/tests.txt` |

### 3.1 Decomposição do vermelho do `npm test` (medido)

36 falhas = **31 falsas (paralelismo)** + **5 reais e pré-existentes**.

**(a) 31 falsas — `createTestDb()` estoura o timeout de 5 s sob paralelismo.** Todas as mensagens são
`Exceeded timeout of 5000 ms` em `beforeAll`/`it` que criam PGlite (`tests/helpers/db.ts`). Isoladas
com o runner correto e `--runInBand`, **passam**:

| Suíte | `npm test` (paralelo) | `--runInBand` |
|---|---|---|
| `tests/integration/db-setup.spec.ts` | ❌ timeout | ✅ PASS 2/2 (5.8 s) |
| `tests/integration/rls-isolation.spec.ts` | ❌ timeout | ✅ PASS |
| `tests/integration/diagnostic-persistence.spec.ts` | ❌ timeout | ✅ PASS — 29 passed / 4 skipped / 33 |

**(b) 5 reais — `tests/domain/services/next-activity-selector.spec.ts`.** Determinísticas isoladas
(`5 failed / 8 passed / 13`). É estado **documentado**, não regressão: `BACKLOG.md:119` — `P1.3`
**"NOT DONE"**, bloqueada por **ADR-021 (Proposed)** (`getPrerequisiteSkills()`/`getNewSkills()` leem
`node.metadata['skills'|'newSkills']` que `curriculum-parser.ts` nunca popula; `iPlus1Score` é
constante `0`; `getFsrsPriorityForLesson()` é `return 0`). `MEMORY.md` registra o mesmo.

**Confirmação aritmética:** observado `311 / 36 / 8 / 355`; o repo documenta `342 / 5 / 8 / 355`.
A diferença é exatamente **31** — as falhas de paralelismo. As 5 reais são as documentadas.

---

## 4. Controles negativos executados (R7)

Nenhum **gate novo** foi criado em A0 (é read-only; A2 criará os gates). Os controles abaixo
caracterizam os gates **existentes** — cada um injeta uma condição e observa o comportamento.

| ID | Injeção | Observado | Veredito |
|---|---|---|---|
| N-1 | Rodar as suítes de DB em paralelo (`npm test`) | ❌ 31 timeouts | **gate de teste não confiável como configurado** |
| N-2 | Remover o paralelismo (`--runInBand`) | ✅ as 3 suítes passam | as 31 são artefato de ambiente, não defeito |
| N-3 | Invocar `npx jest` (sem `--experimental-vm-modules`) | ❌ `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` | o gate depende do runner declarado no `package.json` |
| N-4 | Mutar uma **cópia** de `docs/api/openapi.yaml` e rodar `contract-check.mjs` (cwd temporário, repo intocado) | ver abaixo | **o gate de contrato não valida contrato** |
| N-5 | Adicionar `docs/api/*.md` + `reports/api/*` e re-rodar todos os gates | ✅ todos idênticos ao ANTES | a documentação nova não quebra nem infla gate algum |

**N-4, em detalhe** (em `/tmp/opencode/neg-ctrl-contract`, cópia — o repo não foi tocado):

| Mutação | Resultado esperado de um gate | Resultado real |
|---|---|---|
| N-4a — cópia intacta | PASS | ✅ PASS |
| N-4b — `components.schemas = {}` (**todos os schemas deletados**) | FAIL | ❌ **PASS** |
| N-4c — `POST /auth/refresh` → `GET` (path inalterado) | FAIL | ❌ **PASS** |
| N-4d — path fictício `/apenas/no/spec` no spec | FAIL | ❌ **PASS** |

Conclusão com evidência: `contract:check` = *"estas 10 substrings aparecem no arquivo"*
(`contract-check.mjs:9-30`). Não detecta drift de schema, de método, de path extra, de resposta, de
`security`, nem divergência código↔spec em **nenhum** sentido. O teste mais forte que existe,
`tests/contract/endpoints.spec.ts:14-25`, é uma **enumeração hardcoded das mesmas 10 rotas** — uma
rota nova no código ou removida do spec é invisível. **Não existe gate de drift.**

---

## 5. Decisões humanas pendentes e UNVERIFIED

### 5.1 Bloqueiam A1

| ID | Decisão | Por que é humana | Referência |
|---|---|---|---|
| **D-0** | Aceitar o vermelho conhecido (`P1.3`/ADR-021) como **allowlist por ID**, e corrigir o flake de paralelismo do gate de teste — ou corrigir `P1.3` antes? | R11: sem allowlist por ID, os gates não são confiáveis | §3 |
| **D-1** | **Qual arquivo é a fonte de verdade do contrato?** | os ADRs amendam o markdown; os gates leem o YAML | `inventario.md` §3.4 |
| **D-2** | `docs/api-spec.openapi.yaml` é markdown: extrair o bloco para um YAML publicável, ou converter o arquivo? | muda o pipeline de A2 | `inventario.md` §3.4 |
| **D-3** | `/auth/refresh`: remover (ADR-013) ou manter reduzido a `501` (CHANGELOG)? | ADR-013 exige proposta de ADR; remoção é breaking | `CHANGELOG.md` (*Added*), `BACKLOG.md:90` |
| **D-5** | BOLA: **404** (plano R6) ou **403** (`tests/bdd/README.md:237`)? | os dois não podem valer; o BDD precisa ser corrigido ou o plano | `inventario.md` §6.5 |

### 5.2 UNVERIFIED (sem fonte; não usar número inventado)

| ID | Item | Situação |
|---|---|---|
| D-4 | `/health` vs `/healthz`, e dependências reais de `/ready` | consumidor existe (`P0.8`, `P2.7`); sem valores a derivar |
| D-6 | `Range`/`206` para áudio | ADR-028 entrega URL assinada; **não há object store no repo** → UNVERIFIED |
| D-7 | PII em logs | não há configuração de logging no repositório |
| D-8 | `prd-score` caiu **96.1 → 92.6** e `C3` marca 26 §-refs como "(file unreadable)" | `prd-score.py` inalterado desde `de03fbd`; suspeita de bug de resolução de caminho (`(ROOT / fn).exists()` sem `specs/`). O gate **passa**, mas pode medir uma categoria às cegas |
| D-9 | `tests/bdd/README.md` manda rodar `pytest tests/bdd/` (linha do bloco *Test Execution*) | o stack é Jest; a instrução é herança FastAPI (R10). Também: o cenário *"Audio upload requires consent"* contradiz ADR-028 §4 (consentimento **não** é pré-condição) |

### 5.3 Débitos de código encontrados (para A2, não desta fase)

`src/common/filters/transform-interceptor.ts` duplica `src/common/interceptors/transform-interceptor.ts`
e **não é registrado** (código morto); `src/dto/content/` e `src/dto/learners/` vazios;
`src/dto/common/error-response.dto.ts` não é usado por ninguém.

---

## 6. O que NÃO foi feito e por quê

1. **Não avancei para A1.** O plano: uma fase por sessão, e "Não avance antes do meu *continuar*".
2. **Não escrevi nenhum ADR.** A1 é a fase dos ADRs; escrevê-los agora seria antecipar decisões que
   dependem de D-1/D-2/D-3.
3. **Não toquei nos 7 packs modificados** (`packs/a2/pack-les-a2-*.md`): classe de mudança alheia a
   esta missão (R8).
4. **Não consertei `P1.3`** (`next-activity-selector`): depende de **ADR-021 (Proposed)** — decisão
   humana (R9). Não implementei o que depende dela.
5. **Não corrigi o flake do gate de teste nem criei a allowlist por ID** — ambos são decisão D-0.
6. **Não implementei nada de `/content/*`** (p.ex. esconder `items[].key`): A0 é read-only; o achado
   está registrado para A3.
7. **Não modifiquei os specs** para corrigir o drift: D-1/D-2 são humanas; alterar o contrato antes
   da decisão criaria uma terceira versão.

---

## Apêndice — evidência crua

- `reports/api/baseline/tests.txt` — `npm test` completo (148 s), 4 suites falhas.
- `reports/api/baseline/prd-score.txt` — rubric C1–C10 (92.6%).
- `reports/api/baseline/verify-integrity.txt` e `verify-integrity-DEPOIS.txt` — 0 fail / 1 warn, ambos.
- `reports/api/baseline/{domain-check,rls-check,contract-check,typecheck}.txt`.
- `docs/api/inventario.md` · `docs/api/candidatos.md` — as duas entregas.
- `/tmp/opencode/neg-ctrl-contract/` — controle negativo N-4 (fora do repo, por desenho).
