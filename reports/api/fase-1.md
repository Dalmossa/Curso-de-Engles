# Fase A1 — Decisões de contrato (somente ADRs)

**Data:** 2026-10-14 · **Branch:** `main` (HEAD de partida `ec5648e`, o commit de A0) · **Escopo:** documentação apenas — **nenhuma linha de `src/` alterada**
**Veredito:** ✅ **A1 concluída** — 13 ADRs `Proposed` + índice atualizado; os gates ficam verdes, exceto o vermelho pré-existente de `npm test`, que **não** é afetado por esta fase.
**Bloqueio remanescente:** ⛔ **R11** — o gate de teste continua vermelho **e é não-determinístico** (ver §3.1 e §1.1-4). Ratificação da allowlist por ID continua pendente (D-0 de A0).

---

## 1. Tarefas e veredito

| # | Tarefa (A1) | Veredito | Evidência |
|---:|---|---|---|
| 0 | R11 — confirmar que os gates continuam verdes/confiáveis | ⛔ **FALHA** (inalterado) | §3; `reports/api/fase-1/tests.txt` |
| 1 | (a) Identificadores, URLs e aninhamento | ✅ feito | `docs/adr/031-identifiers-urls-nesting.md` |
| 2 | (b) Paginação, ordenação, filtros, projeções | ✅ feito | `docs/adr/032-pagination-filtering-projections.md` |
| 3 | (c) Versionamento e depreciação | ✅ feito | `docs/adr/033-versioning-deprecation.md` |
| 4 | (d) Erros — perfil RFC 9457 | ✅ feito | `docs/adr/034-problem-details-profile.md` |
| 5 | (e) Idempotência e concorrência otimista | ✅ feito | `docs/adr/035-idempotency-and-optimistic-concurrency.md` |
| 6 | (f) Cache condicional e entrega de áudio | ✅ feito | `docs/adr/036-caching-and-range.md` |
| 7 | (g) Jobs assíncronos | ✅ feito | `docs/adr/037-async-jobs.md` |
| 8 | (h) Escopos e autorização por objeto | ✅ feito | `docs/adr/038-authz-scopes-and-object-level-404.md` |
| 9 | (i) Rate limiting | ✅ feito | `docs/adr/039-rate-limit-response-shape.md` |
| 10 | D-1 / D-2 — fonte de verdade do contrato | ✅ enquadrado e resolvido por citação | `docs/adr/040-canonical-http-contract.md` |
| 11 | H1 — catálogo: leitura ou autoria | ✅ enquadrado, **NÃO decidido** (R9) | `docs/adr/041-h1-catalog-write-surface.md` |
| 12 | H2 — LGPD × log imutável | ✅ enquadrado, **NÃO decidido** (R9) | `docs/adr/042-h2-erasure-vs-append-only-log.md` |
| 13 | H3 — θ, CORS, SDK | ✅ enquadrado, **NÃO decidido** (R9) | `docs/adr/043-h3-theta-cors-sdk.md` |
| 14 | Índice do diretório de ADRs atualizado | ✅ feito | `docs/adr/README.md` (13 linhas + seção *Open ADRs*) |

**Contagem:** 13 ADRs novos (031–043), **todos `Proposed`**, formato MADR 3.0.0 do `docs/adr/README.md`,
**2.039 linhas** (`wc -l`, §2). Nenhum código escrito (escopo de A1).

### 1.1 Os quatro achados que mudam o custo de A2–A3 (e que corrigem A0)

Esta é a parte de A1 com valor além dos ADRs. Quatro medições **contrariam** o que A0 registrou, e
cada uma tem consequência de trabalho.

**1. Não existem 2 leitores do spec obsoleto; existem 5 — e nenhum compara com a implementação.**
A0 registrou `contract-check.mjs:5` e `tests/contract/openapi.spec.ts:6`. Medido agora:

| Leitor | Spec lido | É gate? |
|---|---|---|
| `contract-check.mjs:5` | `docs/api/openapi.yaml` | **sim** (`npm run contract:check`) |
| `scripts/contract-check-full.mjs:6` | `docs/api/openapi.yaml` | não — não está no `package.json` |
| `scripts/kong-config-check.mjs:48` | `docs/api/openapi.yaml` | **sim** (`npm run kong:check`) |
| `tests/contract/endpoints.spec.ts:9` | `docs/api/openapi.yaml` | sim (via `npm test`) |
| `tests/contract/openapi.spec.ts:6` | `docs/api/openapi.yaml` | sim (via `npm test`) |
| `tests/contract/schemas.spec.ts:250` | **os dois** (`SPEC_PATHS`) | sim (via `npm test`) |

**2. A0 errou ao dizer "não existe gate de drift".** Existe — para schema. `tests/contract/schemas.spec.ts`
valida **instâncias reais** do `ContentService` contra os dois documentos com um validador escrito à
mão (`:691-710`; cobre `$ref`, `type`, `required`, `enum`, `const`, `pattern`, `if`/`then`/`else`,
`additionalProperties`) e mantém a guarda de drift entre eles:

```
:712  it('the two files define the six content schemas identically (drift guard)', () => {
:723    expect(withoutAnnotations(schemaOf(second.doc, name))).toEqual(
:724      withoutAnnotations(schemaOf(first.doc, name)),
```

O que **não** existe é **spec ↔ implementação**: nenhum gate falha quando uma rota implementada
diverge do documento — que é exatamente o que o controle negativo N-4 de A0 demonstrou. A distinção
importa: o gate novo (ADR-040 D5.1) **complementa** esse arquivo, não o substitui.

**3. Há um teste verde que protege o defeito.** `tests/contract/endpoints.spec.ts:59`:

```ts
expect(r400.content['application/json']).toBeDefined();
```

Ele exige `application/json` nas respostas de erro 400/404 — o media type que a `CONSTITUTION.md` §4.3
**proíbe** (RFC 9457 → `application/problem+json`, ADR-034 D4). Corrigir o filtro de exceções sem
corrigir este teste deixa o gate vermelho. Registrado em ADR-034 e ADR-040.

**4. O `npm test` é não-determinístico — o que é pior que vermelho.** Mesmo comando, mesmo código
(a A1 mudou **só** documentação):

| Execução | Suítes FAIL | Testes FAIL | Passados | Suítes que falharam |
|---|---|---|---|---|
| A0 (baseline) | 4 | **36** | 311 | selector, rls-isolation, diagnostic-persistence, db-setup |
| A1#1 | 1 | **5** | 342 | selector |
| A1#2 | 2 | **6** | 341 | selector, content-loader |

As **5** falhas de `next-activity-selector` são constantes nas três execuções (§3.1); o que varia são
as de integração — timeout de `createTestDb()`/PGlite sob paralelismo — que somaram 31 em A0, 0 em
A1#1 e 1 em A1#2, em **três conjuntos disjuntos**. **R11 exige gates verdes *e confiáveis*; um gate que
muda de resultado entre execuções não prova nada.** A allowlist por ID (D-0) precisa cobrir a *causa*
(o flake do harness), não só os 5 IDs reais — que, aliás, **permanecem vermelhos**.

### 1.2 Fatos de fonte primária verificados (R2/R9)

Nenhum número destes ADRs foi inventado. Os que não têm fonte estão marcados `UNVERIFIED` (§5).

**RFCs** — lidos em `rfc-editor.org/rfc/rfcNNNN.txt` em 2026-10-14 (categoria e data no cabeçalho):

| RFC | Título | Categoria | Data | Relação |
|---|---|---|---|---|
| 7807 | Problem Details for HTTP APIs | Standards Track | mar/2016 | **obsoletada por 9457** |
| **9457** | Problem Details for HTTP APIs | Standards Track | jul/2023 | obsoleta 7807 |
| **9745** | The Deprecation HTTP Response Header Field | Standards Track | mar/2025 | era `draft-ietf-httpapi-deprecation-header` |
| **8594** | The Sunset HTTP Header Field | Informational | mai/2019 | — |
| 9110 | HTTP Semantics | Standards Track | jun/2022 | obsoleta 7230–7235 |
| 9111 | HTTP Caching | Standards Track | jun/2022 | obsoleta 7234 |
| 6585 | Additional HTTP Status Codes | Standards Track | abr/2012 | 428, 429, 431, 511 |
| 8288 | Web Linking | Standards Track | out/2017 | obsoleta 5988 |

**Drafts (não são RFC — é a diferença que os ADRs 035/039 tratam):**
`draft-ietf-httpapi-idempotency-key-header` rev **07**, expira **2026-04-18**;
`draft-ietf-httpapi-ratelimit-headers` rev **11**, expira **2026-11-24** (datatracker).

**LGPD** — texto compilado em `planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm` (2026-10-14):
art. 18 *caput* e II/IV/VI; art. 18 §5 (*"prazos ... previstos em **regulamento**"*); art. 16 I–IV
(conservação; II e IV **exigem anonimização**); art. 19 II (**15 dias**, só para acesso/confirmação).

> **Lei ≠ costume.** O `BACKLOG.md` usa *"< 30 dias"* e o agente de segurança cita *"48h / 72h"*.
> **Nenhum dos dois tem fonte** neste ADR — a lei remete a regulamento. Ambos ficam `UNVERIFIED`
> (ADR-042 §Context).

**Uma contradição constitucional, encontrada por leitura de fonte primária:**
`CONSTITUTION.md` §4.4 manda `Deprecation: true`. A RFC 9745 (mar/2025) define `Deprecation` como
**campo estruturado com valor de data** — o booleano é a forma do draft que ela obsoletou. A §4.4
prescreve, hoje, uma forma que a norma vigente não define. **Isso exige emenda à CONSTITUTION (§9),
que é ato humano** (ADR-033 D2) — e é o item mais consequente desta fase.

---

## 2. Arquivos / commits

| Arquivo | Ação | Linhas |
|---|---|---|
| `its-platform/docs/adr/031-identifiers-urls-nesting.md` | novo | 140 |
| `its-platform/docs/adr/032-pagination-filtering-projections.md` | novo | 141 |
| `its-platform/docs/adr/033-versioning-deprecation.md` | novo | 153 |
| `its-platform/docs/adr/034-problem-details-profile.md` | novo | 175 |
| `its-platform/docs/adr/035-idempotency-and-optimistic-concurrency.md` | novo | 169 |
| `its-platform/docs/adr/036-caching-and-range.md` | novo | 145 |
| `its-platform/docs/adr/037-async-jobs.md` | novo | 152 |
| `its-platform/docs/adr/038-authz-scopes-and-object-level-404.md` | novo | 172 |
| `its-platform/docs/adr/039-rate-limit-response-shape.md` | novo | 139 |
| `its-platform/docs/adr/040-canonical-http-contract.md` | novo | 218 |
| `its-platform/docs/adr/041-h1-catalog-write-surface.md` | novo | 121 |
| `its-platform/docs/adr/042-h2-erasure-vs-append-only-log.md` | novo | 159 |
| `its-platform/docs/adr/043-h3-theta-cors-sdk.md` | novo | 155 |
| `its-platform/docs/adr/README.md` | modificado | +13 linhas de índice, +1 parágrafo em *Open ADRs* |
| `reports/api/fase-1.md` | novo | este relatório |
| `reports/api/fase-1/*.txt` | novo | 8 saídas de gate (§3) |

**Commit:** um único commit, `docs(api): A1 — 13 ADRs de contrato (Proposed) e correções ao A0`.
Só arquivos desta fase (R8). Os 7 `packs/a2/pack-les-a2-*.md` que aparecem modificados na árvore são
**pré-existentes e alheios** a esta fase; ficaram de fora.

> **Idioma.** Os ADRs 031–043 estão em **português**, ao contrário de 001–030 (inglês). A
> `CONSTITUTION.md` **não** impõe idioma (verificado em §4.1/§4.3/§4.4), logo é permitido, mas é
> **inconsistente** com o diretório. A divergência está declarada em `docs/adr/README.md` (*Open
> ADRs*) para que um revisor possa converter em vez de descobrir a mistura depois.

---

## 3. Saídas dos gates — ANTES → DEPOIS

| Gate | A0 (baseline) | A1 | Comparação |
|---|---|---|---|
| `verify-integrity.py` | PASS — 0 fail / 1 warn | PASS — 0 fail / 1 warn | **idêntico** |
| `prd-score.py` | PASS — 92.6% | PASS — 92.6% | **idêntico** |
| `npm run domain:check` | PASS | PASS | **idêntico** |
| `npm run typecheck` | PASS | PASS | **idêntico** |
| `npm run rls:check` | PASS | PASS | **idêntico** |
| `npm run contract:check` | PASS | PASS | **idêntico** |
| `npm run kong:check` | *(não estava no baseline A0)* | PASS — 1 serviço / 5 rotas / 3 plugins | gate **acrescentado** ao conjunto |
| `npm test` | **FAIL** — 36/355, 4 suítes | **FAIL** — 5/355, 1 suíte · depois 6/355, 2 suítes | vermelho **e instável** — nunca o mesmo vermelho (§3.1) |

Verificação por `diff` de arquivo: `domain-check`, `typecheck`, `rls-check`, `contract-check` e
`prd-score` são **byte-idênticos** ao baseline de A0; o `RESULT` do `verify-integrity` é idêntico.
Prova de N-5 (repetida em A1): **adicionar documentos não quebra gate algum** — a alteração é
invisível para todos eles, o que é simultaneamente a confirmação do escopo e a razão pela qual os
ADRs precisam de um gate próprio (§1.1-2, ADR-040 D5).

### 3.1 Decomposição do vermelho do `npm test` (medido em três execuções)

**Terceiro ponto de amostragem obtido ao final da fase**, para que a evidência registrada reflita o
estado depois de *todas* as edições:

```
A0   (baseline)   Test Suites: 4 failed, 1 skipped, 18 passed, 22 of 23
                  Tests:       36 failed, 8 skipped, 311 passed, 355 total
                  FAIL  next-activity-selector · rls-isolation · diagnostic-persistence · db-setup

A1#1              Test Suites: 1 failed, 1 skipped, 21 passed, 22 of 23
                  Tests:       5 failed, 8 skipped, 342 passed, 355 total
                  FAIL  next-activity-selector

A1#2 (re-run)     Test Suites: 2 failed, 1 skipped, 20 passed, 22 of 23
                  Tests:       6 failed, 8 skipped, 341 passed, 355 total
                  FAIL  next-activity-selector · content-loader
```

**O vermelho que importa é estável e pequeno.** As **5** falhas de
`tests/domain/services/next-activity-selector.spec.ts` aparecem **idênticas nas três execuções**:

| Teste que falha (estável) | Marcador |
|---|---|
| `selectNextActivity() › returns a lesson when at entry point with no current node` | `P1.3` |
| `selectNextActivity() › respects track (General vs IT) when selecting next activity` | `P1.3` |
| `selectNextActivity() › prefers i+1 activities (new skills at right difficulty)` | `P1.3` |
| `selectNextActivity() › includes spaced review items when FSRS items are due` | `P1.3` |
| `track switching › respects module sequence constraints` | `P1.3` |

É o *NOT DONE* bloqueado pelo `ADR-021` (`Proposed`). **Não é regressão e não é desta fase.**

**O vermelho que muda é o de integração — e ele é um flake de ambiente.** A 6ª falha de A1#2 é
`Content Loader Integration (PGlite) › is idempotent when loading same content twice`, e as 31 falhas
extras de A0 eram timeout de `createTestDb()`/PGlite (`rls-isolation`, `diagnostic-persistence`,
`db-setup`). Os três conjuntos **não se sobrepõem** entre execuções ⇒ a causa é o harness sob
paralelismo, não o código.

**Consequência (R11).** R11 exige gates "verdes **e confiáveis**". Este gate é **vermelho**: não é
apenas instável, ele tem 5 falhas reais. As duas coisas são problemas distintos e ambos precisam de
tratamento: (i) o flake de integração (timeout/`--runInBand`) e (ii) os 5 IDs reais do `P1.3`. A
allowlist por ID de D-0 é **insuficiente sozinha** — ela cobriria os 5 IDs e deixaria o flake passar
por sorte, que é exatamente o padrão de falha que R11 existe para proibir.

---

## 4. Controles negativos executados (R7)

| # | Controle | Resultado |
|---|---|---|
| N-1 | Nenhum arquivo de `src/` foi alterado em A1 | ✅ `git status` mostra só `docs/adr/**` + `reports/**` |
| N-2 | Os gates são insensíveis a esta mudança (prova de que A1 não "passa por fraqueza do gate") | ✅ 5 gates byte-idênticos (§3) |
| N-3 | Nenhum ADR afirma número sem fonte | ✅ todos os números têm tabela (§1.2) ou estão em `UNVERIFIED` (§5.2) |
| N-4 | Nenhum ADR decide H1/H2/H3 | ✅ 041/042/043 têm seção *"Decisão requerida (ato humano)"* e **nenhuma** marca `[x]` de aceitação |
| N-5 | Nenhum ADR `Proposed` se declara `Accepted` nem supersede um `Accepted` sem registro | ✅ 031–043 são `Proposed`; 040 diz explicitamente que **não** supersede o ADR-027 |

**Controle negativo que *não* foi possível rodar (e por quê):** não é possível testar o gate de
contrato *novo* de ADR-040 D5 — ele ainda não existe, e criá-lo seria A2, não A1. O que existe é a
**caracterização do gate atual** pelo N-4 de A0 (`docs/api/inventario.md` §7), que continua válida e
foi **refinada** em §1.1-2 (o gate *wired* é substring-only; a suíte de contrato faz mais do que A0
supôs).

---

## 5. Decisões humanas pendentes e UNVERIFIED

### 5.1 Bloqueiam A2 (nesta ordem)

| # | Decisão | Onde | O que trava |
|---|---|---|---|
| H-1 | Emendar `CONSTITUTION.md` §4.4: `Deprecation: true` → forma da RFC 9745 (§9) | ADR-033 D2 | publicar headers de depreciação; não bloqueia A2 inteiro |
| H-2 | **H1** — catálogo somente-leitura (A) / CRUD (B) / leitura agora + autoria depois (C) | ADR-041 | qualquer endpoint de escrita de catálogo |
| H-3 | **H2** — eliminação LGPD × log WORM; + parecer jurídico sobre art. 16 | ADR-042 | export/erase (A6); desenho das tabelas de evento |
| H-4 | **H3** — exposição de θ, CORS obrigatório, SDK no MVP | ADR-043 | serialização de diagnóstico; CORS de produção |
| H-5 | Emendar `tests/bdd/README.md:237`: 403 → **404** para objeto de outro aprendiz (R6) | ADR-038 D4.1 | implementar authz por objeto sem deixar o BDD contraditório |
| H-6 | Domínio canônico das URIs de `Problem.type` (hoje *placeholder*) | ADR-034 D1 | congelar o catálogo de problemas |
| H-7 | `Idempotency-Key`: draft expirado × header próprio | ADR-035 D3.1 | contrato dos `POST` que movem estado |
| H-8 | Headers de limite: draft `RateLimit`/`RateLimit-Policy` × só `Retry-After` | ADR-039 D3 | contrato do 429 |
| H-9 | Avaliar `npm audit`/`pip audit` sem rede bloqueada (herdado de A0) | §5.2 | — |

**D-0 continua sendo o bloqueio de R11** (de A0): 5 falhas reais + flake não-determinístico, **sem
allowlist ratificada por ID**. Ele **não** impede escrever ADRs (feito), mas impede declarar qualquer
fase seguinte "verde".

### 5.2 UNVERIFIED (sem medição/spec/lei — **não** usar número inventado)

| Item | Fonte que falta | Fixado em |
|---|---|---|
| `limit` default/máximo, TTL do cursor | medição de carga no corpus real | ADR-032 D7 → A7 |
| `max-age` do catálogo; granularidade do `ETag` de coleção | frequência do loader | ADR-036 D3 → A7 |
| TTL da chave de idempotência; DB do Redis; política em queda | medição / operação | ADR-035 D4 → A7 |
| `Retry-After` por camada; limites por endpoint além do ADR-030 | medição | ADR-039 D4 → A7 |
| `Retry-After` por tipo de job; validade de `links.result`; retenção do job | medição | ADR-037 D7 → A7 |
| Prazo de eliminação LGPD (**"<30 dias"** e **"48h/72h"** circulam **sem fonte**) | regulamento ANPD (não lido) | ADR-042 → H-3 |
| Domínio canônico de `Problem.type` | decisão organizacional | ADR-034 D1 → H-6 |
| `prd-score` caiu 96.1% → 92.6% com `C3` marcando 26 §-refs *"(file unreadable)"* | suspeita de bug de caminho no scorer | herdado de A0; gate passa |

**Um `UNVERIFIED` de A0 foi fechado nesta fase, por citação (não por medição).** A0 registrou *"`Range`/`206` para áudio sem object
store no repo"* como pendência. `ADR-028` decide que `GET /content/listening/{id}/audio` devolve um
**descritor** com URL assinada de 300 s (a API não serve bytes). Logo `Range`/`206` **não se aplicam à
API** → ADR-036 D5. Fechado por citação, sem medição nova.

### 5.3 O que os ADRs *propõem* sem poder decidir

Nenhum destes é uma decisão tomada; são recomendações para ratificação:

1. `/api/v1` na aplicação **e** paths do `kong.yml` **e** asserção 6 do `kong:check`, na ordem de
   ADR-033 D7 (senão o gate verde quebra).
2. Canônico = `docs/api-spec.openapi.yaml` (por citação da §4.4), tornado **YAML de verdade**;
   `docs/api/openapi.yaml` deprecado e removido por último.
3. 404 (não 403) para objeto de outro aprendiz; 403 só para escopo insuficiente.
4. `ETag` forte no catálogo + `no-store` em `/learners/*`; `202`+`Location` para trabalho assíncrono.
5. θ: expor nível derivado, **não** θ/`se`; e corrigir o vazamento de `key` em
   `content.service.ts:237` **independentemente de H3**.

---

## 6. O que NÃO foi feito e por quê

| Não feito | Por quê |
|---|---|
| Qualquer alteração em `src/` ou `tests/` | Escopo de A1 é "somente ADRs; nada de código" |
| Criar o gate de contrato novo (ADR-040 D5) | é A2; A1 apenas o especifica, com os casos de N-4 como testes |
| Decidir H1/H2/H3 | R9 — ADR `Proposed` e **PARAR**; exigem ato humano (e, no caso de H2, parecer jurídico) |
| Emendar a CONSTITUTION (§4.4) | §9 é processo humano; A1 registra a contradição com fonte primária |
| Emendar `tests/bdd/README.md:237` | é artefato de aceitação; muda o que a suíte BDD exige (H-5) |
| Ratificar a allowlist de R11 | decisão humana herdada (D-0); A1 apenas comprovou que o gate é **flaky** |
| Extrair o YAML do spec canônico | é A2 (D-2); A1 só provou que o arquivo não parseia e que ninguém o lê |
| Corrigir `content.service.ts:237` (vazamento de `key`) | é A3; ADR-043 o marca como urgente e independente de H3 |

---

## Apêndice — evidência crua

- `reports/api/fase-1/verify-integrity.txt` · `prd-score.txt` · `domain-check.txt` · `typecheck.txt` ·
  `rls-check.txt` · `contract-check.txt` · `kong-check.txt` · `tests.txt`
- `reports/api/baseline/*` — baseline de A0, usado nos `diff` de §3
- `docs/api/inventario.md` — auditoria de A0 (rotas × spec, ERD→recursos, gap, violações)
- Citações de código deste relatório: `contract-check.mjs:5,9,13-30`;
  `scripts/kong-config-check.mjs:23,48,122-129,131-149`; `tests/contract/endpoints.spec.ts:9,59`;
  `tests/contract/openapi.spec.ts:6`; `tests/contract/schemas.spec.ts:1-20,237,250,691-727`.
