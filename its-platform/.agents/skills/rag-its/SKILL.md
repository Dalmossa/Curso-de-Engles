---
name: rag-its
description: Use ao implementar RAG (retrieval semântico com pgvector) sobre o conteúdo das lições do ITS Platform — deve ser lida antes de escrever qualquer migration, entidade ou indexador de embeddings, porque o ADR-046 só autoriza a implementação depois que a query de retrieval estiver specada.
---

# RAG no ITS Platform — derivada do ADR-046

Esta skill ensina **somente o que o `its-platform/docs/adr/046-rag-pgvector-retrieval.md`
decide**. Ela não decide nada por si: onde o ADR deixa uma questão aberta, aqui se manda
consultar, e **proíbe-se inventar o valor** (`CONSTITUTION.md` §2, *Derivation over Assertion*:
"every number in code/docs names its derivation … 'magic numbers' are forbidden").

> **Fonte primária:** `its-platform/docs/adr/046-rag-pgvector-retrieval.md`.
> **Contexto obrigatório:** `its-platform/docs/adr/018-persistence-derived-from-specs.md` §8 (a
> remoção do `pgvector` e o bloqueador) e §10 (o substrato alternativo); `its-platform/CONSTITUTION.md`
> §2, §4.1, §4.8; `its-platform/docs/adr/014-datastore-pglite-dev-postgres-prod.md`;
> `its-platform/docs/adr/016-canonical-identifier-registry.md`;
> `its-platform/docs/adr/021-per-lesson-skill-metadata.md`; `AGENTS.md` (seção *Licensing*).
> Se esta skill e o ADR-046 divergirem, **o ADR-046 vence**.

---

## 0. Gate de entrada — NÃO implemente antes de a query estar specada

**Esta é a primeira regra e ela é um bloqueio, não uma recomendação.** O ADR-046 **D1** autoriza o
substrato, não a implementação: enquanto a **spec de retrieval nomeada** não existir, a migration,
a entidade e o indexador **não se escrevem**.

O ADR-046 existe por causa de um bloqueador textual do `ADR-018` §8:

> *"Deferred to P3 with a stated blocker: a retrieval requirement that names a query. If it returns,
> it is its own ADR — an HNSW index on authored pedagogical content is a pedagogical decision (what
> counts as semantically near a lesson) wearing a database hat."*

O ADR-046 **satisfaz** esse bloqueador nomeando **duas** queries, ambas **internas** (consumidor é o
servidor, nunca o cliente HTTP):

| Query | O que ela recupera | Consumidor |
|---|---|---|
| **Q-RAG-1** | trechos de lição/pack semanticamente próximos do estado do aprendiz (fase de lição, exemplo, nota de distrator, explicação do `learner_model`) | o tutor adaptativo, no micro-ciclo de recast da prática guiada (ver `AGENTS.md`, seção *Pedagogical Architecture*) |
| **Q-RAG-2** | lições cujo `learner_model` está **um passo além** do θ atual (*i+1*) | **insumo** do `NextActivitySelector` — ver §6 abaixo |

**Antes de escrever qualquer código, confirme que existe:**

- [ ] a **spec de retrieval** com Q-RAG-1/Q-RAG-2 formalizadas — predicado, parâmetros (`k`, limiar
      de similaridade, métrica de distância) e consumidor nomeados, cada um citando o seu `§`
      (`CONSTITUTION.md` §2, *Spec-First*: *"No implementation without a spec"*);
- [ ] as decisões abertas correspondentes fechadas (§7 abaixo) **ou** explicitamente marcadas como
      pendentes para quem as detém.

Sem isso, o trabalho honesto é **escrever a spec**, não a migration. O ADR-046 §Open questions
registra OQ-5 (*a formulação exata de Q-RAG-1/Q-RAG-2*) como **o bloqueador material**: *"Sem esta
decisão, o ADR não autoriza implementação."*

---

## 1. Substrato — `pgvector + HNSW` em produção; honestidade em dev/test

**ADR-046 D1:** o substrato é **`pgvector` + índice HNSW** sobre *chunks* de conteúdo, no
**PostgreSQL 16** (staging/produção). `ADR-014` §Decision já fixa:

| Ambiente | Driver | O que vale |
|---|---|---|
| **Staging / produção** | **PostgreSQL 16 + pgvector** | `ADR-014` §Decision |
| **Unit tests** | **PGlite** (in-memory) | `ADR-014` §Decision |
| **Integration / RLS / CI** | **PostgreSQL 16** (service container) | `ADR-014` §Decision |

### PGlite × pgvector — o mito que o ADR-046 §Context 4 corrige

**NÃO afirme que "PGlite não suporta pgvector".** O que `ADR-014` §Neutral **de fato** diz é:

> *"Extension set is a subset. pgvector is available through the extensions API, but the catalogue
> is smaller than a full PostgreSQL installation. **An extension required in production must be
> confirmed present in PGlite before being used in a unit test.**"*

Ou seja, a regra é: **uma extensão exigida em produção tem de ser confirmada presente no PGlite
antes de aparecer num unit test** — confirmação é uma tarefa, não uma suposição. Se a extensão não
estiver presente, os testes de vetor seguem o mesmo roteamento que já existe no `ADR-014` §Binding
constraint para `SET LOCAL`/RLS concorrente: marque-os `// @requires-postgres` e corra-os no serviço
PostgreSQL do CI.

O que **é** certo e não depende de confirmação: **PGlite tem uma conexão exclusiva**
(`ADR-014` §Context: *"As PGlite only has a single exclusive connection to the database…"*), logo
qualquer coisa que exija concorrência — `CREATE INDEX CONCURRENTLY`, dois escritores — fica **fora**
do PGlite, exatamente como já vale para RLS e `SET LOCAL` (`ADR-014` §Binding constraint).

**Não invente o resultado da confirmação.** Se você não confirmou que a extensão existe no PGlite,
diga que não confirmou.

---

## 2. A tabela `content_embeddings` — proveniência obrigatória (Invariant Floor)

**ADR-046 D6-ii** exige que todo vetor carregue a proveniência que o **Invariant Floor** do
`CONSTITUTION.md` §2 manda:

> *"A cached projection carries the id of what it was derived from and the instant it was derived."*

As colunas que o ADR-046 **nomeia** (e **nada além destas**) são:

| Coluna | Papel | Exigência |
|---|---|---|
| `source_kind` | que tipo de conteúdo foi embutido (lição/pack/item) | `NOT NULL` |
| `source_id` | **o id do que foi derivado** (o `TEXT[]` que resolve para a tabela de origem) | `NOT NULL`; resolvido contra a origem (portão de licenciamento, §3) |
| `chunk_index` | posição do *chunk* dentro da fonte | `NOT NULL` |
| `chunker_version` | versão do *chunker* que produziu o *chunk* | `NOT NULL` |
| `embedding_model` | **qual modelo** produziu o vetor | `NOT NULL` |
| `embedding_model_version` | **qual versão** do modelo — é ela que **ancora a dimensão** (OQ-1) | `NOT NULL` |
| `derived_at` | **o instante** em que foi derivado | `NOT NULL` |

Além destas, a tabela tem a coluna vetorial propriamente dita e uma **chave de idempotência** que o
ADR-046 §Implementation Plan (item **ADR-046.5**) descreve como
`(source_kind, source_id, chunk_index, embedding_model_version)` — o mesmo critério de upsert
idempotente do `ADR-020` §2.

**Regras que decorrem do Invariant Floor:**

1. **O vetor é projeção derivada — nunca fonte de verdade.** Se o modelo muda, o vetor é
   **re-derivado**; uma linha nova por vetor com o novo `embedding_model_version`, nunca uma
   migração de coluna com `DROP` (ADR-046 D4).
2. **`embedding_model_version` é o que ancora a dimensão** (ADR-046 D4): a dimensão **não** deve
   ser o contrato da coluna. É por isso que **D6-iii** exige que a dimensão de todo vetor bata com a
   dimensão declarada para a sua `embedding_model_version` — a verificação impede que a coluna vire
   fonte de verdade silenciosa.
3. **`derived_at` é obrigatório.** Um vetor sem o instante da derivação é exatamente a forma do
   draft que o `ADR-018` §8 removeu (ver *Alternatives Considered* item 4 do ADR-046).

**Onde a entidade vive:** `src/infrastructure/entities/content-embedding.entity.ts`, com
`@Entity('content_embeddings')` **somente** sob `src/infrastructure/entities/` (`ADR-014`;
`npm run domain:check` falha se um `@Entity()` aparecer fora dali). O vetor/`NUMERIC` é mapeado na
borda, **nunca** no domínio — a mesma regra que o `database-design` aplica a `p_know`.

---

## 3. Portão de licenciamento — só conteúdo com `reuse_basis` compatível gera vetor

**Esta é a regra que nenhuma outra substitui.** Um vetor é um **derivado do texto**; derivar de
conteúdo restrito é uma forma de **reprodução derivada**, e `AGENTS.md` (seção *Licensing*) é
inequívoco:

> *"None of the 7 local PDFs is permissively licensed. This constrains everything below… The local
> PDFs are the reasoning substrate, not the publishable substrate."*

A regra do **ADR-046 D3** é **idêntica** à do `external-sources.md` §7.0 e à do `verify-integrity.py`
**[11]** (que falha se uma fonte restrita for declarada publicável):

| `lessons.reuse_basis` | Pode gerar vetor? | Razão (ADR-046 D3) |
|---|---|---|
| `adapt_with_attribution` | **sim** | fonte permissiva (CC-BY family); material derivado publicável com a atribuição de `external-sources.md` §7.1 |
| `cite_only` | **sim, com ressalva** | *"Reproduce nothing. Cite in the bibliography."* — o material é **original nosso**; o vetor é do **nosso** texto. Uma lição `cite_only` cuja lista *é* a fonte é, na prática, `adapt_requires_permission` — cai na linha de baixo |
| `adapt_requires_permission` | **não** | as 48 lições restritas *list-shaped*: *"Written, perpetual, redistribution-granting permission before publication"* — dependência aberta registrada em `external-sources.md` §7.0 (ver `BACKLOG.md` P3.15) |

**A consulta do portão** roda sobre `lessons.reuse_basis` **+ `lessons.publication_state`** (o
segundo barra uma lição `restricted_pending_permission` que o primeiro não pegaria). O portão **não é
opcional**: a rotina de embedding **filtra por ele**, e **D6-i** exige que o gate de CI falhe se um
`source_id` embutido apontar para uma lição cujo `reuse_basis` seja `adapt_requires_permission`.

> Um vetor de conteúdo restrito é a mesma classe de erro que o `verify-integrity.py` [11] existe
> para pegar — uma fonte restrita tratada como publicável —, só que materializada como embedding.
> O portão transforma a regra em verificação, e não em disciplina.

---

## 4. RLS — `content_embeddings` é conteúdo global, **não** é learner-scoped

**ADR-046 (Neutral) e ERD `data-model.erd.md` §9 rule 2:** conteúdo dos contextos 1–3 **não** é
learner-scoped — não carrega coluna de aprendiz e **não ganha policy**. Portanto:

- **NÃO** crie `CREATE POLICY` sobre `content_embeddings`.
- **NÃO** a adicione à lista das **15 tabelas learner-scoped** do ERD §9 (que não muda).
- **NÃO** toque em `PgSessionContext` nem no `SET LOCAL app.current_learner_id` (single writer,
  `ERD data-model.erd.md` §9 rule 1 / `docs/domain-model.md` X-4).

**O isolamento não sofre:** um vetor de conteúdo autorado não carrega dado pessoal. **Se** algum dia
houver embedding de algo derivado **do aprendiz** (ex.: o texto de uma resposta livre), isso é
**outra decisão** — é dado learner-scoped, exige o seu próprio ADR e a sua própria policy. Esta
skill **não** autoriza isso.

---

## 5. Grafo × embedding — a **ordem** e a **proximidade**

**ADR-046 D5:** o grafo é a **ordem**; o embedding é a **proximidade**. Os dois convivem, e este é o
ponto onde a skill evita o erro mais provável (usar o vetor como se fosse o grafo):

| Pergunta | Substrato **autoritativo** | Fonte |
|---|---|---|
| Quais lições introduzem a skill X? Quais são pré-requisito de Y? | **grafo** — `skill_registry`, `skill_prerequisite`, `lesson_prerequisites`, `items.skill_ids` | `ADR-016` (registry canônico); `data-model.erd.md` §6 |
| `New skills` / `Prerequisite skills` de cada lição | **grafo** — colunas do registry do currículo | `ADR-021` D1–D2 |
| Quais trechos **se parecem** com isto? O que está **um passo além** em conteúdo? | **embedding** — Q-RAG-1/Q-RAG-2 | `ADR-046` D1, D5 |

**Consequências práticas:**

- O retrieval por vetor **enriquece** o `NextActivitySelector` e o tutor como **insumo**; **nunca**
  substitui o grafo como fonte de verdade de pré-requisitos e progressão (`ADR-046` D5).
- O gate de mastery continua sendo o predicado L-2 do domínio sobre as colunas de evidência
  (`data-model.erd.md` §8 row 1) — o retrieval **não** é um gate e **não** decide desbloqueio.
- O `NextActivitySelector` opera sobre o grafo com metadata de skill; sem ela ele **falha fechado**
  (`ADR-021` D4). Q-RAG-2 é um critério de ranking a mais, não um substituto da metadata.

Se você se pegar escrevendo "o embedding decide quais lições são pré-requisito", pare: isso é o
grafo, e o `ADR-018` §10 registrou o grafo como o substrate correto **para as perguntas dele**.

---

## 6. Sem rota HTTP nova — a query é **interna**

**ADR-046 D1:** Q-RAG-1/Q-RAG-2 são **internas**; o consumidor é o servidor. **Este ADR não abre
nenhum endpoint de retrieval**, pela mesma objeção **R3** que o `ADR-044` D4 aplicou a uma superfície
sem consumidor nomeado.

- **NÃO** crie `GET /content/search`, `?q=`, `?similar_to=`, rota irmã nem escopo novo.
- A superfície que um dia servir consultas de retrieval vem com o **seu próprio ADR** e o **seu
  próprio escopo** (`ADR-046` D1/D7; `ADR-038` D2 mantém o conjunto de escopos fechado).

---

## 7. Decisões em aberto — consulte, **não invente**

O ADR-046 §Open questions registra cinco decisões **humanas** que a skill **proíbe** o agente de
resolver sozinho. Se a sua tarefa precisa de um destes valores e ele não está fixado numa spec, o
trabalho correto é **reportar a pendência** a quem a detém — não escolher:

| # | Decisão | Estado no repositório (não invente) |
|---|---|---|
| **OQ-1** | **Dimensão do vetor** | O `VECTOR(1536)` existe **só** no ERD v0.1.0-**draft** (deletado inteiro pelo `ADR-018`); o `data-model.erd.md` v1.0.0 **não** o carrega. **Nenhuma fonte viva fixa 1536.** Recomendação do ADR: guardar a dimensão em `embedding_model_version`, não no tipo da coluna |
| **OQ-2** | **Modelo de embedding** (provedor, custo, LGPD) | **Nenhum** modelo é nomeado em spec alguma. É decisão de produto/segurança (modelo hospedado envia o texto do curso a terceiros) |
| **OQ-3** | **Formato do *chunk* / `chunker_version`** | Nenhuma spec define a unidade (fase? parágrafo? exemplo?). Depende de Q-RAG-1/Q-RAG-2 na spec de retrieval |
| **OQ-4** | **Métrica de distância e parâmetros HNSW** (`m`, `ef_construction`, `ef_search`) | Nenhum valor em spec. É a "decisão pedagógica com roupa de banco" que o `ADR-018` §8 alertou; medir contra o acervo antes de fixar |
| **OQ-5** | **Formulação exata de Q-RAG-1/Q-RAG-2** | O bloqueador material (§0). Sem ela, **não há implementação** |

**Regra dura:** um número sem derivação é um defeito neste repositório (`AGENTS.md`: *"A number
without a derivation is a defect in that document."*). Copiar `1536` do draft deletado, ou escolher
`m=16` "porque é comum", é exatamente o defeito que o `CONSTITUTION.md` §2 (*Derivation over
Assertion*) proíbe.

---

## 8. Como citar — nada sem `§`

Toda afirmação nesta área de trabalho cita a sua fonte. Convenções do repositório:

- **A fonte primária é o ADR-046**: `its-platform/docs/adr/046-rag-pgvector-retrieval.md`, com o
  número da decisão (`D1`…`D7`) e/ou o `§` da seção.
- **O `ADR-018` §8/§10** é obrigatório no contexto: §8 é a remoção e o bloqueador que o ADR-046
  satisfaz; §10 é o substrato alternativo (mantido como complemento, `ADR-046` D5).
- **As specs** (`specs/*.md`) — a spec de retrieval quando existir, e as que ela citar.
- **A emenda ao `ADR-018` §8 é por referência** (`ADR-046` D7 e o seu frontmatter `supersedes` /
  `supersedes_scope`): **não** edite o arquivo do ADR-018; a metade que muda é só a remoção, e a
  metade que fica é o Invariant Floor e o alerta pedagógico.
- Referência `§` **sempre nomeia o documento** dela (`ADR-046` §Confirmation; é a mesma regra que o
  `verify-integrity.py` **[10]** verifica nos documentos que ele varre).

---

## Checklist de conformidade

- [ ] A **spec de retrieval** existe e formaliza Q-RAG-1/Q-RAG-2 com predicado, parâmetros e
      consumidor (`ADR-046` D1/D2; `CONSTITUTION.md` §2 *Spec-First*) — **sem ela, não implementar**
- [ ] O substrato é **`pgvector` + HNSW** em PostgreSQL 16 (`ADR-046` D1; `ADR-014` §Decision)
- [ ] A **presença de `pgvector` no PGlite foi confirmada** — ou os testes de vetor foram roteados
      para `// @requires-postgres` (`ADR-014` §Neutral/§Binding constraint; **não** afirme sem
      confirmar)
- [ ] `content_embeddings` carrega **todas** as colunas de proveniência do Invariant Floor
      (`source_kind`, `source_id`, `chunk_index`, `chunker_version`, `embedding_model`,
      `embedding_model_version`, `derived_at`) — `ADR-046` D6-ii; `CONSTITUTION.md` §2
- [ ] A **dimensão é ancorada em `embedding_model_version`**, e o gate verifica
      dimensão × versão (`ADR-046` D4/D6-iii)
- [ ] O **portão de licenciamento** filtra `reuse_basis ∈ {cite_only, adapt_with_attribution}` +
      `publication_state`, e o gate **falha** se um `source_id` embutido for
      `adapt_requires_permission` (`ADR-046` D3/D6-i; `AGENTS.md` *Licensing*;
      `external-sources.md` §7.0; espelha `verify-integrity.py` [11])
- [ ] **Nenhuma policy** foi criada sobre `content_embeddings`; ela **não** entra nas 15 tabelas
      learner-scoped (`ADR-046` Neutral; `data-model.erd.md` §9 rule 2)
- [ ] O embedding é **insumo** do grafo, não substituto (`ADR-046` D5; `ADR-016`; `ADR-021`)
- [ ] **Nenhuma rota HTTP** nova foi criada (`ADR-046` D1; `ADR-044` D4)
- [ ] Nenhum valor das **Open questions** (OQ-1…OQ-5) foi **inventado** — os que faltam foram
      reportados como pendência (`ADR-046` §Open questions; `CONSTITUTION.md` §2)
- [ ] Migration verificada **up → down → up**; qualquer coisa de vetor/RLS concorrente em
      **PostgreSQL real** (`ADR-014` §Binding constraint)
- [ ] A entidade `@Entity('content_embeddings')` vive **só** em
      `src/infrastructure/entities/` (`ADR-014`; `npm run domain:check` verde)
- [ ] O **gate** (`retrieval-check.mjs` ou extensão do `verify-integrity.py`) cobre os quatro
      predicados de `ADR-046` D6, com o controle negativo de D6-i
- [ ] A emenda ao **`data-model.erd.md`** (§6/§6.9/§4, contagem 33 → 34) e a entrada de
      **CHANGELOG** foram feitas como **itens do plano do ADR-046** — não silenciosamente

---

## Referências

- `its-platform/docs/adr/046-rag-pgvector-retrieval.md` — **a fonte primária** desta skill (D1–D7,
  §Open questions, §Implementation Plan, §Confirmation)
- `its-platform/docs/adr/018-persistence-derived-from-specs.md` §8 (remoção + bloqueador), §10
  (substrato alternativo), §1 (Invariant Floor)
- `its-platform/docs/adr/014-datastore-pglite-dev-postgres-prod.md` §Decision, §Neutral (extensão no
  PGlite), §Binding constraint (o que não corre em PGlite)
- `its-platform/docs/adr/016-canonical-identifier-registry.md` — o registry canônico (a *ordem*)
- `its-platform/docs/adr/021-per-lesson-skill-metadata.md` — `New skills`/`Prerequisite skills`
- `its-platform/docs/adr/044-a6-no-answer-key-in-served-payloads.md` D4 — R3: sem superfície sem
  consumidor nomeado
- `its-platform/CONSTITUTION.md` §2 (Spec-First, Derivation over Assertion, Invariant Floor), §4.1
  (stack), §4.8 (teste/datastore), §5 (ADR obrigatório para mudança de data model e nova dependência)
- `its-platform/docs/data-model.erd.md` §6 (DDL), §6.9 (índices), §9 (RLS — rule 2), §10
- `AGENTS.md` (raiz do repo) — seção *Licensing* (reuse basis; list-shaped; 13 de 123 lições com
  fonte reutilizável) e *Pedagogical Architecture*
- `external-sources.md` §0.5, §7.0 — as três reuse bases e a obrigação de permissão escrita
- `PRD.md` §10 — `RNF-001`: nenhuma capacidade derivada assertada
