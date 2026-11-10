# Retrieval Spec — RAG over lesson content (pgvector, internal queries)

**Purpose:** Formalize **Q-RAG-1** (semantic retrieval of lesson-phase chunks for the adaptive tutor) and **Q-RAG-2** (i+1 content selection by semantic proximity, as a ranking input). This spec satisfies the blocker of **ADR-018 §8**: "a retrieval requirement that names a query". 

**Scope:** Internal queries only; no HTTP route is defined or authorized by this spec. The consumer of Q-RAG-1 is the adaptive tutor (server-side) enriching remediation selection per **post-lesson-practice-spec.md §4.2**; the consumer of Q-RAG-2 is `NextActivitySelector` (`its-platform/src/domain/services/next-activity-selector.ts`) as an **insumo futuro** (P1.3 NOT DONE, blocked by ADR-021). 

**Upstream specs:** [ADR-046](../its-platform/docs/adr/046-rag-pgvector-retrieval.md) (Accepted 2026-10-20), [ADR-018](../its-platform/docs/adr/018-persistence-derived-from-specs.md) §8/§10, [ADR-016](../its-platform/docs/adr/016-canonical-identifier-registry.md), [ADR-021](../its-platform/docs/adr/021-per-lesson-skill-metadata.md), [ADR-014](../its-platform/docs/adr/014-datastore-pglite-dev-postgres-prod.md), [ADR-020](../its-platform/docs/adr/020-content-loader-port.md), [post-lesson-practice-spec.md](post-lesson-practice-spec.md) §4.2, [stats-progress-evaluation-spec.md](stats-progress-evaluation-spec.md) §2/§4, [curriculum-graph-spec.md](curriculum-graph-spec.md), [PRD.md](../its-platform/PRD.md) §10 (RNF-001).

**Downstream:** Embeddings table `content_embeddings`, retrieval gate (`retrieval-check.mjs` or extension of `verify-integrity.py`, family of `content-check.mjs` per ADR-020).

---

## 1. Purpose

1. Satisfy the blocker of **ADR-018 §8** ("a retrieval requirement that names a query"). If it returns, it is its own ADR — satisfied by ADR-046; this spec **formalizes** the queries with predicate, parameters, and named consumer (§-named), citing the origin (`CONSTITUTION.md` §2 *Spec-First*).
2. Define internal, deterministic retrieval semantics so implementation cannot invent values. Values not yet fixed to be measured remain explicitly marked *to be measured/a confirmar*.
3. Enforce the licensing gate (D3) and provenance/Invariant Floor (D6-ii/D6-iii).
4. Clarify scope: **no HTTP surface** (D1). Q-RAG-2 is an **insumo futuro** for `NextActivitySelector` (P1.3 NOT DONE, ADR-021).

## 2. Definitions

| Term | Definition |
|---|---|
| **Chunk (por fase)** | One chunk per **lesson phase**. A chunk contains the textual content of a lesson phase (input/guided practice/output task/formative check) plus the preamble/metadados including `Lesson ID` and phase identity. Format: `phase-v1`. |
| **`chunker_version`** | `"phase-v1"` (decided OQ-3). |
| **`Lesson ID`** | Canonical lesson identifier (`les_*`) as declared in each lesson file (`**Lesson ID:**`). Present in 122/122 authored lessons. |
| **Source identity** | `source_kind = "lesson_phase"`, `source_id` derived from `Lesson ID` + phase. `chunk_index` is the 0-based position of the phase within the lesson (1..4). |
| **Embedding model** | `"bge-m3"`, local via Ollama (decided OQ-2). |
| **Vector dimension** | `1024` (decided OQ-1), anchored in `embedding_model_version` — **never** in the column type (D4). |
| **`embedding_model_version`** | `"bge-m3@1024"`. |
| **Metric** | **Cosine distance** with pgvector operator `<=>` (vector_cosine_ops). Parameters HNSW: `m = 16`, `ef_construction = 64` (defaults pgvector, decided OQ-4). `ef_search` = *to be measured* against the real corpus. |
| **Q-RAG-1** | Semantic retrieval of lesson-phase chunks for the **adaptive tutor** (remediation). |
| **Q-RAG-2** | Semantic retrieval of lesson content to support **i+1** selection by proximity — **ranking input only**, never a substitute for the prerequisite graph (D5). |

## 3. Requirements (normativos)

| ID | Requirement | Verificação |
|---|---|---|
| **R-RAG-001** | Q-RAG-1 and Q-RAG-2 are **internal only**; no HTTP endpoint, route, query param (`?q`, `?similar_to`) or public surface is created by this spec. | Design gate (D1, R3 ADR-044). |
| **R-RAG-002** | Before any migration/indexing, the retrieval spec exists with predicate, parameters and named consumer (§-named). | Spec-First (`CONSTITUTION.md` §2). |
| **R-RAG-003** | Licensing gate: only chunks from content with `reuse_basis ∈ {cite_only, adapt_with_attribution}` and compatible `publication_state` may be embedded or returned. Chunks whose source has `adapt_requires_permission` are **never** embedded (D3). Espelha `verify-integrity.py` [11]. | Gate (D6-i), CI assertion. |
| **R-RAG-004** | Provenance (Invariant Floor): every vector has `source_kind`, `source_id`, `chunk_index`, `chunker_version`, `embedding_model`, `embedding_model_version`, `derived_at` all `NOT NULL`. Dimension matches the declared version (D6-ii, D6-iii). | Entity/migration + retrieval-check (D6). |
| **R-RAG-005** | `content_embeddings` is **content global** (contexts 1–3); no RLS policies apply. Do not add to the 15 learner-scoped tables (ERD §9 rule 2). | Schema review. |
| **R-RAG-006** | Graph vs embedding: the prerequisite/skill graph (ADR-016/ADR-021) is the **order**; embedding is the **proximity**. Q-RAG-2 is a **ranking input** to `NextActivitySelector`, never a substitute for graph prerequisites (D5). | Design constraint. |
| **R-RAG-007** | Chunking is **phase-v1**: one chunk per lesson phase; `chunker_version = "phase-v1"`. `Lesson ID` and phase identity are present in chunk preamble/metadata. | Parser/indexer. |
| **R-RAG-008** | Vector dimension `1024` is anchored in `embedding_model_version = "bge-m3@1024"`, **not** in the column type. Model/version changes require new rows (re-embed), never DROP COLUMN. | Migration + D6-iii. |
| **R-RAG-009** | HNSW index uses `vector_cosine_ops` (`<=>`), `m=16`, `ef_construction=64`. `ef_search` is **to be measured** against the real corpus (not fixed here). | Index DDL. |
| **R-RAG-010** | Q-RAG-1 consumer is the adaptive tutor (server-side) enriching remediation selection per `post-lesson-practice-spec.md` §4.2 (steps 1–4). Returns phase-chunks (not whole lessons). `k ≤ 6`. | Contract with tutor/remediation. |
| **R-RAG-011** | Q-RAG-2 consumer is `NextActivitySelector` (`its-platform/src/domain/services/next-activity-selector.ts`) as **insumo futuro** (P1.3 NOT DONE, blocked by ADR-021). It does **not** replace graph-based prerequisites; proximity is combined with graph/ranking in the selector. `k = 5`. | Contract with selector (future). |
| **R-RAG-012** | Similarity threshold for both queries is **cosine ≥ 0.75** (*a confirmar com o acervo real*). This is a starting value, not asserted as final. | Parameterized, explicit “a confirmar”. |
| **R-RAG-013** | Input to Q-RAG-1 is derived from `ErrorLogEntry` (`skill_id`, `pattern`, `produced_form`, `frequency`, `severity`, `firstSeenAt`, `lastSeenAt`) and/or the incorrect item; the query text is built from the lesson **phase** content corresponding to that error pattern (including `Lesson ID` + phase in preamble). | Alignment with `error-log.service.ts`/`learner-model.ts`. |
| **R-RAG-014** | Retrieval gate (D6) covers: (i) license filter, (ii) full provenance, (iii) dimension×version match, (iv) derived coverage (RNF-001). Implemented as `retrieval-check.mjs` (family `content-check.mjs`, ADR-020). | Verification gate. |

## 4. Q-RAG-1 — Retrieval semântico para remediation (tutor adaptativo)

### 4.1 Predicado
Dado um padrão de erro observado para um aprendiz (`ErrorLogEntry` para `skill_id`, com `pattern` e `produced_form`), recuperar até `k` **trechos de fase** (chunks `lesson_phase`, versão `phase-v1`) autorados, semanticamente mais próximos do texto da fase correspondente ao padrão de erro, **filtrados por `reuse_basis` compatível** (R-RAG-003), afinados a `skill_id`, ordenados por similaridade descrescente. O resultado enriquece a seleção de *remediation* definida em [post-lesson-practice-spec.md §4.2](post-lesson-practice-spec.md#42-remediation-is-generated-from-error-logs-not-from-the-lesson) (passos 1–4).

### 4.2 Entrada
- **Fonte dos dados de erro:** [`ErrorLogEntry`](../its-platform/src/domain/entities/learner-model.ts#74-87) com campos: `id`, `learnerId`, `skillId`, `pattern` (ErrorPattern), `producedForm`, `frequency`, `severity`, `firstSeenAt`, `lastSeenAt`.
- **Ranking pré-retrieval (para contexto):** [`rankErrorPatternsForRemediation`](../its-platform/src/domain/services/error-log.service.ts#170-203) produz `RankedErrorPattern` ordenado por `rankScore = frequency × severity × recency` (recency via [`computeRecencyWeight`](../its-platform/src/domain/services/error-log.service.ts#76-79), `λ=0.1`, half-life ~7 dias). Este ranking **não** substitui a similaridade vetorial; informa **qual padrão de erro** deve gerar a query de embedding.
- **Texto da query:** construído a partir do **texto da fase da lição** correspondente ao padrão de erro selecionado (topo do ranking para `skill_id`), incluindo no preâmbulo/metadados do chunk: `Lesson ID` + identidade da fase. O embedding da query é produzido com o **mesmo modelo e versão** (`bge-m3@1024`) usado na indexação.
- **Contexto adicional (opcional):** `item_id`/item errado que gerou a observação (quando disponível).

### 4.3 Parâmetros
| Parâmetro | Valor | Observação |
|---|---|---|
| `k` | `≤ 6` | Alinhado a [post-lesson-practice-spec.md §4.2 passo 4](post-lesson-practice-spec.md#42-remediation-is-generated-from-error-logs-not-from-the-lesson) (*"Cap at 6 items"*). |
| **Limiar de similaridade (cosine)** | **`≥ 0.75`** | *a confirmar com o acervo real*. Valor de partida. |
| **Métrica** | **Cosine (`<=>`)** | Operator class `vector_cosine_ops`. |
| **Índice HNSW** | `m=16`, `ef_construction=64` | Defaults pgvector (OQ-4). `ef_search` *to be measured*. |

### 4.4 Filtros
1. **Licenciamento (obrigatório):** `reuse_basis ∈ {cite_only, adapt_with_attribution}` E `publication_state` compatível. **Nunca** retornar chunk com fonte `adapt_requires_permission` (R-RAG-003/D3). 
2. **Afinidade a skill:** chunk pertence a lição/fase relevante a `skill_id` do `ErrorLogEntry` (ou ao menos afim). O filtro pode ser relaxado apenas para fallback, nunca para ignorar (1).
3. **Tipo de chunk:** `source_kind = "lesson_phase"` e `chunker_version = "phase-v1"`.
4. **Cobertura:** chunk existe e foi derivado com proveniência completa (R-RAG-004).

### 4.5 Ordenação
Por **similaridade coseno descrescente** (`1 - distance_cosine`), respeitando limiar `≥ 0.75`. Empates: manter estabilidade (ordem por `source_id`, `chunk_index`).

### 4.6 Consumidor
**Adaptive tutor** (server-side). Enriquecimento da seleção de *remediation* conforme [post-lesson-practice-spec.md §4.2](post-lesson-practice-spec.md#42-remediation-is-generated-from-error-logs-not-from-the-lesson): 
- Passo 1: rank por `frequency×severity×recency` (via `rankErrorPatternsForRemediation`) — define **quais padrões** buscar.
- Passo 2: para cada top pattern, selecionar item com `b` mais próximo de `θ(skill)` (**+0.3 logit** via [`buildRemediationCriteria`](../its-platform/src/domain/services/error-log.service.ts#216-227)) **E** com *distractor set contendo a forma errada produzida* ([`getDistractorRequirements`](../its-platform/src/domain/services/error-log.service.ts#240-248), `requiredDistractor = producedForm`). **Q-RAG-1 fornece trechos de fase autorados** para apoiar a explicação/seleção contextual daquele passo (não substitui a condição de distractor). 
- Passos 3–4: ordenar por `b` ascendente, **cap at 6 items** (`k ≤ 6`).

**Sem rota HTTP.** Q-RAG-1 não expõe superfície pública.

## 5. Q-RAG-2 — Seleção i+1 por proximidade (insumo de ranking)

### 5.1 Predicado
Dado `θ(skill)` do aprendiz para uma skill, recuperar até `k=5` lições (representadas por seus chunks de fase relevantes) cujo conteúdo esteja **um passo além** do estado atual (`i+1`), ordenadas por similaridade coseno descrescente, retornando-as como **insumo de ranking** para o seletor de atividades. **Nunca substitui** o grafo de pré-requisitos (R-RAG-006, D5).

### 5.2 Entrada
- **θ(skill):** estimativa de habilidade por skill conforme [stats-progress-evaluation-spec.md](stats-progress-evaluation-spec.md) (ver §2/§4). Entrada por skill (ou agregada conforme o contexto do seletor).
- **Texto da query:** construído a partir do estado atual do aprendiz para a skill-alvo (ex.: representação do conteúdo já dominado/atual) para buscar conteúdo semanticamente próximo, com um passo além. O embedding usa `bge-m3@1024`.

### 5.3 Parâmetros
| Parâmetro | Valor | Observação |
|---|---|---|
| `k` | `5` | Conforme decisão OQ-5. |
| **Limiar de similaridade (cosine)** | **`≥ 0.75`** | *a confirmar com o acervo real*. |
| **Métrica** | **Cosine (`<=>`)** | `vector_cosine_ops`. |
| **Índice HNSW** | `m=16`, `ef_construction=64` | `ef_search` *to be measured*. |

### 5.4 Filtros
1. **Licenciamento:** mesmos de 4.4 (1): `reuse_basis ∈ {cite_only, adapt_with_attribution}`, estado de publicação compatível; **nunca** `adapt_requires_permission`.
2. **Escopo de conteúdo:** chunks `lesson_phase`, `phase-v1`. Pode abranger múltiplas fases/lessons candidatas.
3. **Princípio de não-substituição do grafo:** o resultado **não** ignora pré-requisitos. O filtro/seleção final **deve** respeitar grafo ([curriculum-graph-spec.md](curriculum-graph-spec.md)), registry ([ADR-016](../its-platform/docs/adr/016-canonical-identifier-registry.md)) e metadados por lição ([ADR-021](../its-platform/docs/adr/021-per-lesson-skill-metadata.md), `New skills`/`Prerequisite skills`). Este é um **requisito normativo** (R-RAG-006/D5).
4. **Cobertura/proveniência:** completa (R-RAG-004).

### 5.5 Ordenação
Por **similaridade coseno descrescente** (`≥ 0.75`), com desempate por `source_id`, `chunk_index`.

### 5.6 Consumidor
[`NextActivitySelector`](../its-platform/src/domain/services/next-activity-selector.ts) (server-side). 

**Status:** **INSUMO FUTURO**. Conforme [BACKLOG.md](../its-platform/BACKLOG.md) P1.3 (*"Next-activity selector (i+1) — NOT DONE — corrected 2026-10-10"*): `getPrerequisiteSkills()` lê `node.metadata['skills']`, `getNewSkills()` lê `node.metadata['newSkills']`, e `curriculum-parser.ts` nunca os popula; `iPlus1Score` é constante `0` (torna regra `i_plus_1` inalcançável); bloqueado por **[ADR-021](../its-platform/docs/adr/021-per-lesson-skill-metadata.md)**. 

**Regra de integração (obrigatória):** Q-RAG-2 produz um **ranking de candidatos por proximidade semântica** (i+1). Esse ranking é **combinado** com as regras baseadas em grafo/pré-requisitos do `NextActivitySelector` (não substitui). A implementação só deve acoplar Q-RAG-2 quando P1.3 estiver desbloqueado por ADR-021. **Sem rota HTTP.**

## 6. Proveniência, versionamento e Invariant Floor

Mapeamento para colunas de `content_embeddings` (R-RAG-004):

| Coluna | Valor/Regra | Origem |
|---|---|---|
| `source_kind` | `"lesson_phase"` | chunking phase-v1 |
| `source_id` | Derivado de `Lesson ID` + fase (ex.: `les_a2_greetings_intro#phase1`) — identidade estável | chunk metadata |
| `chunk_index` | Posição da fase na lição (0-based ou 1-based), `NOT NULL` | chunking |
| `chunker_version` | `"phase-v1"` | OQ-3 |
| `embedding_model` | `"bge-m3"` | OQ-2 |
| `embedding_model_version` | `"bge-m3@1024"` | OQ-1 (ancora dimensão 1024) |
| `derived_at` | Instante da derivação (timestamp), `NOT NULL` | geração de embedding |
| (vetor) | `vector(1024)` (tipo) com valores produzidos por `bge-m3@1024` | embedding |

**Invariant Floor (`CONSTITUTION.md` §2):** projeção derivada carrega o id do que foi derivado e o instante em que foi derivado. Se o modelo mudar (1024→N), **novas linhas** com nova `embedding_model_version` são criadas — **nunca** `ALTER TABLE ... DROP COLUMN`/mudança de tipo forçada. A verificação (D6-iii) garante que **toda** linha tem dimensão compatível com a sua `embedding_model_version`.

## 7. Gates de verificação

Implementar conforme ADR-046 D6, na família de [`content-check.mjs`](../its-platform/docs/adr/020-content-loader-port.md) (ADR-020 §3):

| Predicado | Descrição | Tipo |
|---|---|---|
| **(i) Licenciamento** | Todo `source_id` em `content_embeddings` resolve para lição/fase com `reuse_basis ∈ {cite_only, adapt_with_attribution}` e `publication_state` compatível. **Falha** se apontar para `adapt_requires_permission`. Espelha `verify-integrity.py` [11]. | Obrigatório (D6-i) |
| **(ii) Proveniência completa** | Todo vetor tem `source_kind`, `source_id`, `chunk_index`, `chunker_version`, `embedding_model`, `embedding_model_version`, `derived_at` — todos `NOT NULL`. | Obrigatório (D6-ii) |
| **(iii) Dimensão × versão** | Dimensão de todo vetor bate com a dimensão declarada para sua `embedding_model_version` (1024 para `bge-m3@1024`). | Obrigatório (D6-iii) |
| **(iv) Cobertura derivada (RNF-001)** | Número de vetores é derivado da cobertura das queries (Q-RAG-1/Q-RAG-2) sobre o corpus elegível (após filtro de licenciamento), **nunca assertado manualmente**. (`PRD.md` §10 RNF-001). | Obrigatório (D6-iv) |

**Implementação sugerida:** `retrieval-check.mjs` (ou estender `verify-integrity.py`). Roda em PGlite + PostgreSQL real (ADR-014). Se `pgvector` não confirmado no PGlite, testes de vetor vão para `// @requires-postgres`.

## 8. Open/To be measured

Explicitados (não fechados aqui):

| Item | Estado | Observação |
|---|---|---|
| **`ef_search`** (HNSW) | *to be measured* | Ajuste fino contra acervo real; não fixado nesta spec. |
| **Parâmetros HNSW — ajuste fino** (`m`, `ef_construction`) | *to be measured* (parcial) | Fixados `m=16`, `ef_construction=64` (defaults). Ajuste fino permanece *to be measured*. |
| **Limiar coseno 0.75** (Q-RAG-1 e Q-RAG-2) | *a confirmar com o acervo real* | Valor de partida. Deve ser validado empiricamente contra qualidade de retrieval no corpus real. |
| **Spec de retrieval (artefato com §)** | **[ ]** (Confirmation item 1 ADR-046) | Esta spec é o artefato; as queries foram formalizadas aqui. O bloqueio D1 permanece: **sem este artefato com §, a migração não se escreve**. |

## 9. References

- [ADR-046](../its-platform/docs/adr/046-rag-pgvector-retrieval.md) — Accepted (2026-10-20), D1–D7, *Open questions — resolved (2026-10-20)*, Q-RAG-1/Q-RAG-2 formalizadas
- [ADR-018](../its-platform/docs/adr/018-persistence-derived-from-specs.md) §8 (bloqueador satisfeito por ADR-046), §10 (substrato alternativo, D5), §1 (Invariant Floor)
- [ADR-016](../its-platform/docs/adr/016-canonical-identifier-registry.md) — registry canônico (ordem do grafo)
- [ADR-021](../its-platform/docs/adr/021-per-lesson-skill-metadata.md) — `New skills`/`Prerequisite skills`; P1.3 NOT DONE (bloqueador para acoplamento completo de Q-RAG-2)
- [ADR-020](../its-platform/docs/adr/020-content-loader-port.md) §2/§3 — loader, `content-check.mjs`, upsert idempotente
- [ADR-014](../its-platform/docs/adr/014-datastore-pglite-dev-postgres-prod.md) §Decision/§Neutral/§Binding constraint (PGlite × pgvector)
- [ADR-044](../its-platform/docs/adr/044-a6-no-answer-key-in-served-payloads.md) D4 — R3: sem superfície sem consumidor nomeado
- [post-lesson-practice-spec.md](post-lesson-practice-spec.md) §4.2 — remediation (ranking `frequency×severity×recency`, cap 6 items, distractor deve conter `producedForm`)
- [stats-progress-evaluation-spec.md](stats-progress-evaluation-spec.md) §2/§4 — `θ(skill)`, mastery gates
- [curriculum-graph-spec.md](curriculum-graph-spec.md) — grafo (ordem), pré-requisitos
- [PRD.md](../its-platform/PRD.md) §10 — **RNF-001**: nenhuma capacidade derivada assertada
- [CONSTITUTION.md](../its-platform/CONSTITUTION.md) §2 (Spec-First, Derivation over Assertion, **Invariant Floor**), §5 (ADR obrigatório), §8 (segurança/compliance), §9 step 3
- [AGENTS.md](../AGENTS.md) — *Licensing* (reuse basis; list-shaped não pode usar `cite_only`; 13 de 123 com fonte reutilizável)
- [external-sources.md](../external-sources.md) §0.5, §7.0 — três reuse bases, obrigação de permissão escrita
- [`learner-model.ts`](../its-platform/src/domain/entities/learner-model.ts) — `ErrorLogEntry` (campos citados)
- [`error-log.service.ts`](../its-platform/src/domain/services/error-log.service.ts) — `rankErrorPatternsForRemediation`, `computeRecencyWeight`, `buildRemediationCriteria`, `getDistractorRequirements` (§4.2 alignment)
- [`next-activity-selector.ts`](../its-platform/src/domain/services/next-activity-selector.ts) — consumidor futuro de Q-RAG-2 (P1.3 NOT DONE, bloqueado ADR-021)