---
adr: 046
title: "RAG sobre o conteúdo das lições — o retorno do `pgvector`, uma query nomeada, e o portão de licenciamento"
status: Accepted
date: 2026-10-20
authors: [@database-engineer]
deciders: [unassigned]
consulted: [@system-design-architect, @content-owner, @security-lead, @backend-lead, @qa-sdet]
informed: [@team]
tags: [data-model, adr, rag, pgvector, retrieval, embeddings, licensing, invariant-floor, adr-014, adr-016, adr-018, adr-021, human-decision, needs-human-review]
relates_to: [014, 016, 018, 021]
supersedes: [018]
supersedes_scope: "ADR-018 §8 somente — a remoção de `pgvector`/`content_embeddings` do MVP. §8 volta ao status «deferido com bloqueador satisfeito», não ao status «removido». Todo o resto do ADR-018 (as 16 correções, o invariant floor, o §10) permanece inalterado e não é tocado."
---

**Accepted** (2026-10-20). Ratificação humana, naquele dia: **D1–D7 como propostos**, e as cinco
*Open questions* **fechadas por decisão do usuário** — OQ-1 dimensão `1024`, OQ-2 modelo `bge-m3`
via Ollama local, OQ-3 um chunk por fase com `chunker_version = "phase-v1"`, OQ-4 cosine com
`m = 16`/`ef_construction = 64`, OQ-5 a formulação de Q-RAG-1/Q-RAG-2 (§*Open questions —
resolved*). O que a ratificação **não** fecha é a **spec de retrieval** (Confirmation, item 1) —
ela é o produto do próximo passo, e por isso D1 continua valendo como bloqueio: **o substrato está
autorizado, a implementação não começou.**

Este ADR existe porque o [ADR-018](018-persistence-derived-from-specs.md) **§8
o exigiu por escrito**, não porque alguém decidiu reintroduzir uma tecnologia:

> *"Deferred to P3 with a stated blocker: a retrieval requirement that names a query. If it returns,
> it is its own ADR — an HNSW index on authored pedagogical content is a pedagogical decision (what
> counts as semantically near a lesson) wearing a database hat."*

O ADR-018 §8 não proibiu o `pgvector` para sempre; ele **nomeou a condição** que autorizaria o
retorno — *uma query*. Este ADR satisfaz a condição, escolhe o substrato `pgvector` (decisão do
usuário, §Decision) e **nomeia**, para cada parte, o que ela exige e o que ela quebra. O
`CONSTITUTION.md` §5 exige ADR para "Data model change" e "New external dependency"; ambos se
aplicam.

A parte do §8 do ADR-018 que este ADR reverte é a **remoção**. A parte que ele **preserva** é o
**invariant floor** e o alerta de que a decisão é pedagógica: por isso o §Decision condiciona a
escolha a uma query nomeada, a uma política de licenciamento verificável e a uma projeção vetorial
com proveniência — as três, não uma.

O que fica registrado com todas as letras, para que o escopo não se alargue depois:

- **Fecha:** a decisão de *deferimento com bloqueador* do ADR-018 §8. O `pgvector` volta como
  extensão declarada; a tabela de embeddings volta como `content_embeddings`, com proveniência.
- **Não abre:** nenhuma rota nova, nenhum endpoint de retrieval. A query que justifica o substrato
  é **interna** (§Decision D1) — a superfície HTTP que a consumiria é outra decisão, com o seu
  próprio ADR (a mesma objeção R3 que o ADR-044 D4 aplicou a uma superfície sem consumidor).
- **Não decide:** a **spec de retrieval** — o artefato que formaliza Q-RAG-1/Q-RAG-2 com predicado,
  parâmetros e consumidor (Confirmation, item 1). Ela é o próximo passo e continua sendo o bloqueio
  de D1: o ADR autoriza o substrato, não antecipa a implementação. As decisões de *valor* que a spec
  consumiria (dimensão, modelo, chunker, métrica) foram fechadas na ratificação e estão em *Open
  questions — resolved (2026-10-20)*; o que segue em aberto é o **documento**, não os números.

## Context

### 1. A remoção foi medida, e o bloqueador foi declarado

O CHANGELOG registra a remoção com a razão exata:

> `content_embeddings`, `pgvector`, HNSW index | **No endpoint uses it, no spec mentions it, and
> `RNF-001` forbids an asserted artefact.** Content is served by id. Deferred to P3 with a stated
> blocker: *a retrieval requirement that names a query.*

`RNF-001` (`PRD.md` §10) é o princípio que torna a remoção correta: *"Every count, state and
readiness claim in the shipped UI derives from a generated inventory, never from a hand-maintained
table."* Um índice HNSW sobre conteúdo sem consumidor é exatamente um artefato assertado — uma
capacidade declarada que nada lê. O ERD v1.0.0 fechou o ciclo em §4 (*"Deleted — with their
replacement named"*) e §10 (*"semantic search | none in MVP | `content_embeddings` had no
consumer"*).

**O que mudou não é a tecnologia. É que existe uma query.** Este ADR existe para nomeá-la.

### 2. A query que justifica o retorno — e ela é duas, não uma

O bloqueador do §8 é *"a retrieval requirement that names a query"*. Uma query de retrieval só é um
requisito se tiver **obra a fazer que o substrato atual não faz**. Nomeio-a com o predicado que ela
serve:

**Q-RAG-1 — Recuperação semântica de trechos de lição/pack para o tutor adaptativo.**
Dado um estado do aprendiz `(skill desbloqueada, último erro, item errado)` e um acervo de trechos
autorados (fases de lição, exemplos, notas de distrator, explicações do `learner_model`), devolver
os *k* trechos cujo conteúdo seja semanticamente próximo do que o aprendiz está prestes a praticar —
para alimentar o feedback do ciclo 30–60 s da prática guiada (o *micro-ciclo* de recast do
`AGENTS.md`) e para explicar *por que* um distrator é plausível. O consumidor dessa query é o tutor,
no servidor; não é o cliente HTTP.

**Q-RAG-2 — Seleção de conteúdo i+1 (input acessível).** Dado o θ do aprendiz para uma skill e o
acervo de lições, devolver as lições cujo `learner_model` declarado esteja **um passo além** do
estado atual (`i+1` de Krashen), como **insumo** do `NextActivitySelector` —
não como substituto do seu grafo de pré-requisitos.

A distinção entre Q-RAG-1/Q-RAG-2 e o substrato alternativo (opção B) é o coração deste ADR: as
duas queries não são o grafo de *pré-requisitos* (o quê, nesta ordem); são *similaridade de
conteúdo* (o quê se parece com isto).

### 3. Por que o substrato alternativo do ADR-018 §10 não responde a estas duas queries

O ADR-018 §10 (*Neutral*) sugere:

> *"If semantic retrieval turns out to matter, ADR-016's skill registry is the better substrate for
> it anyway."*

Escrito antes de o ADR-016, o ADR-021 e a implementação existirem, §10 apontou para o substrato
certo **para uma pergunta**: o grafo de skills e pré-requisitos responde "quais lições introduzem a
skill X" e "quais lições são pré-requisito da skill Y" — join exato sobre `skill_registry`,
`skill_prerequisite` e `items.skill_ids TEXT[]`. O ADR-016 §Decision 1-2 tornou esse substrato
consultável (o registry é dado, não código; a alias table resolve as formas históricas), e o
ADR-021 §Decision 1-2 materializa por lição `New skills` e `Prerequisite skills`.

Nenhum dos dois responde às duas queries acima, e a razão é estrutural, não de performance:

- **O registry guarda identificar, não conteúdo.** `grammar.be_affirmative` diz o *que* a lição
  ensina; não diz que "a explicação deste trecho para o aprendiz que errou *I am go* usa o mesmo
  enquadramento que a explicação do trecho X". A similaridade é sobre o **texto autorado** — a
  explicação, o exemplo, a nota de distrator — que não tem id e não entra no registry.
- **A ordenação do grafo é topológica por pré-requisito, não por proximidade de conteúdo.** `i+1`
  de Krashen tem duas metades: *acessível* (o aprendiz consegue entender — a metade que o grafo
  modela) e *um passo além* (o conteúdo se parece com o que ele já sabe — a metade que o grafo
  **não** modela, porque duas lições sem aresta podem estar arbitrariamente próximas ou distantes
  em conteúdo).

Logo, §10 estava certo sobre *o melhor substrato para a pergunta que ele tinha em mente*, e
silencioso sobre a pergunta que Q-RAG-1/Q-RAG-2 fazem. As duas convivem: o grafo é a ordem, o
embedding é a proximidade (opção B × opção A abaixo).

### 4. O que o ADR-014 realmente diz sobre `pgvector` em PGlite

O ADR-014 §Decision fixa o `pgvector` como parte do ambiente de produção (`Staging / production |
PostgreSQL 16 + pgvector`) e trata o PGlite em §Neutral:

> *"Extension set is a subset. pgvector is available through the extensions API, but the catalogue
> is smaller than a full PostgreSQL installation. An extension required in production must be
> confirmed present in PGlite before being used in a unit test."*

Ou seja: a regra **não é** "PGlite não suporta `pgvector`" (a §Context do ADR-014 lista *"`pgvector`
via the extensions API"* entre as capacidades). A regra é: **uma extensão exigida em produção tem
de ser confirmada presente no PGlite antes de aparecer num unit test.** A confirmação é uma
tarefa do plan (§Confirmation), não uma suposição deste ADR. O que **é** certo e não depende de
confirmação: PGlite tem **uma conexão exclusiva** (ADR-014 §Context), logo qualquer coisa que
exija concorrência (`CREATE INDEX CONCURRENTLY`, dois escritores) fica fora dele — a mesma regra
de fronteira que já vale para RLS e `SET LOCAL`.

## Decision Drivers

| # | Driver | Fonte | Consequência sobre a decisão |
|---|---|---|---|
| 1 | **Spec-First** — *"No implementation without a spec"* | `CONSTITUTION.md` §2 | O substrato não entra na implementação antes de a query (Q-RAG-1/Q-RAG-2) ganhar uma spec de retrieval com `§`. Sem isso, o ADR está proposto e a migração **não** se escreve |
| 2 | **Invariant Floor** — *"A cached projection carries the id of what it was derived from and the instant it was derived"* | `CONSTITUTION.md` §2 (ADR-018 §1) | Todo vetor é projeção derivada: carrega `source_kind`, `source_id`, `chunker_version`, `embedding_model`, `embedding_model_version`, `chunk_index` e `derived_at`. O modelo muda ⇒ o vetor é derivado, nunca fonte de verdade |
| 3 | **O bloqueador do ADR-018 §8** | ADR-018 §8 | Uma query **nomeada** é a condição; sem Q-RAG-1/Q-RAG-2 este ADR não teria razão de existir e a remoção ficaria de pé |
| 4 | **Licenciamento** | `AGENTS.md` *Licensing*; `external-sources.md` §7.0 | Vetor é derivado do texto; derivar de conteúdo restrito é reprodução derivada. **Só conteúdo com reuse basis compatível gera vetor** (D3) — regra idêntica à do `verify-integrity.py` |
| 5 | **RLS e isolamento** | ADR-003; ERD §9 | `content_embeddings` é **conteúdo global**, não learner-scoped ⇒ **sem** policy (a ERD §9 rule 2 é explícita: contextos 1–3 não são learner-scoped e não ganham policy). O isolamento não sofre: um vetor de lição não carrega dado pessoal |
| 6 | **Custo operacional** | ADR-018 §8; RNF-001 | Mais uma extensão, mais um índice a reconstruir, mais um refit a versionar. É uma dependência a mais na superfície do `dependabot`/§8.2 e um índice que cresce com o corpus |
| 7 | **PGlite não é Postgres inteiro** | ADR-014 §Neutral | A extensão tem de ser confirmada no PGlite antes de um unit test a usar; o índice HNSW e o `SET LOCAL` de RLS não são testáveis em concorrência lá |
| 8 | **Decisão pedagógica disfarçada de técnica** | ADR-018 §8 (alerta literal) | "O que conta como semanticamente próximo de uma lição" é decisão de produto. Por isso D1 a nomeia e D4 a deixa com o Content Owner, não com o DBA |

## Considered Options

### (a) `pgvector` + HNSW sobre chunks de conteúdo — **escolhida**

Uma extensão `pgvector` em produção, uma tabela `content_embeddings` com coluna `vector`, um índice
HNSW, e uma rotina de *embedding* que percorre as lições/packs já carregados. Responde às duas
queries; é o substrato que o usuário escolheu.

- **A favor:** um datastore só (nada de vector DB separado ao lado do Postgres); a projeção fica
  sob o mesmo backup (ADR-009), a mesma política de retenção e o mesmo RLS de *conteúdo* (nenhum,
  por ser global); o índice HNSW é consultável por `QueryBuilder` no mesmo `DataSource` do resto.
- **Contra:** mais dependência (§Driver 6); `pgvector` não está confirmado no PGlite (§Driver 7);
  e o alerta do §8 é real — o *parâmetro* do HNSW (`m`, `ef_construction`) e a métrica de distância
  *são* a decisão pedagógica.

### (b) Registry de skills do ADR-016 — retrieval por grafo, sem embeddings

Não adicionar nada: responder Q-RAG-1/Q-RAG-2 por join exato sobre `skill_registry`,
`skill_prerequisite`, `lesson_prerequisites` e `items.skill_ids`, e por `New skills` /
`Prerequisite skills` do ADR-021.

- **A favor:** zero dependência nova; derivado de dados que já existem e já têm gate (ADR-016
  `verify-identifiers.py`, ADR-021 §Decision 6); o ADR-018 §10 **nomeia** este substrato.
- **Contra:** responde "quais lições introduzem X" (exato) e **não** responde "quais trechos se
  parecem com isto" nem "o que está um passo além em conteúdo" (§Context 3). Sobrevive como
  **complemento**, não como substituto — ver D5 abaixo.

### (c) Não fazer RAG

Manter a remoção do ADR-018 §8 e servir conteúdo por id, como hoje.

- **A favor:** é o estado atual, que passa todos os gates; nenhuma dependência, nenhum índice,
  nenhuma decisão pedagógica escondida.
- **Contra:** as duas queries ficam sem resposta e o tutor adaptativo fica limitado ao que o grafo
  exato modela. É uma opção **legítima** se, ao nomear a query, o custo não se justificar — razão
  pela qual este ADR deixa a porta aberta para *não* implementar (D1): o ADR registra a decisão e a
  implementação só começa quando a query tiver spec.

## Decision

**D1 — O substrato é `pgvector + HNSW` sobre chunks de conteúdo, condicionado a uma query nomeada
com spec.** A query é Q-RAG-1 (recuperação semântica de trechos para o tutor) e Q-RAG-2 (seleção
i+1 por proximidade); ambas são **internas** (consumidor: o servidor, não o cliente). Nenhuma rota
HTTP nova é autorizada por este ADR — a superfície que serviria a query é uma decisão futura, com
o seu próprio ADR, pela mesma objeção R3 que o ADR-044 D4 aplicou. **Enquanto a spec de retrieval
não existir (`CONSTITUTION.md` §2 Spec-First), a migração não se escreve** — este ADR autoriza o
substrato, não antecipa a implementação.

**D2 — A consulta nomeada vira um requisito rastreável, não uma frase.** Q-RAG-1/Q-RAG-2 entram
como linhas numeradas na spec de retrieval (nome ainda em aberto), com o predicado, os parâmetros
(`k`, limiar de similaridade, métrica de distância) e o consumidor nomeados. Sem esse artefato, este
ADR produz zero código. É a tradução, para o caso concreto, da regra que `RNF-001` e o ADR-018 §8
já enunciaram: uma capacidade sem consumidor é um artefato assertado.

**D3 — Política de licenciamento: só conteúdo com reuse basis compatível gera vetor, e a regra é a
mesma do `verify-integrity.py`.** Um vetor é um derivado do texto; derivar de conteúdo restrito é
uma forma de reprodução derivada, e o `AGENTS.md` é explícito — *"None of the 7 local PDFs is
permissively licensed… The local PDFs are the reasoning substrate, not the publishable
substrate."* A regra, idêntica à do `external-sources.md` §7.0 e à do `verify-integrity.py`:

| `lessons.reuse_basis` | Pode gerar vetor? | Razão |
|---|---|---|
| `adapt_with_attribution` | **sim** | A fonte é permissiva (CC-BY family) e o material derivado é publicável com a atribuição §7.1 |
| `cite_only` | **sim, com ressalva** | *"Reproduce nothing. Cite in the bibliography."* — o material **é original nosso** (a lista-shaped que usaria `cite_only` está barrada em baixo); o vetor é do **nosso** texto, não do restrito. Uma lição `cite_only` cuja lista é a fonte é na prática `adapt_requires_permission` e cai na linha seguinte |
| `adapt_requires_permission` | **não** | As 48 lições restritas list-shaped: *"Written, perpetual, redistribution-granting permission before publication"*, e o `external-sources.md` §7.0 registra que a permissão ainda é uma dependência aberta (P3.15) |

A consulta que materializa o portão é sobre `lessons.reuse_basis` + `lessons.publication_state`
(o segundo entra para que um vetor de uma lição `restricted_pending_permission` não escape). **O
gate não é opcional:** a rotina de embedding filtra por ele e o gate de CI (D6) falha se um
`source_id` embutido apontar para uma lição cujo `reuse_basis` seja `adapt_requires_permission`. A
mesma classe de erro que o `verify-integrity.py` [11] existe para pegar — uma fonte restrita
declarada publicável — vale aqui para o vetor.

**D4 — A dimensão do vetor, o modelo de embedding e o formato do *chunk* eram decisões em aberto, e
foram fechadas na ratificação de 2026-10-20 (OQ-1…OQ-3).** O ADR-018 (e o ERD v0.1.0-draft
que ele supersedou) declarava `VECTOR(1536)` — mas **essa era uma linha do modelo de draft que o
ADR-018 deletou inteiro**, e o ERD v1.0.0 não a carrega. Não havia, na proposta, nenhuma fonte no
repositório que fixasse 1536, o modelo ou o tamanho do chunk; por isso as três entraram como
*Open questions* em vez de números assertados. A decisão humana fixou: **dimensão `1024`** (a do
`bge-m3`), **modelo de embedding `bge-m3` servido localmente via Ollama**, e **um chunk por fase de
lição** com `chunker_version = "phase-v1"` — os três com a sua derivação registrada em
*Open questions — resolved (2026-10-20)*. A regra que D4 enuncia **permanece**: a coluna
`embedding_model_version` existe para que **a dimensão não seja o contrato** — se o modelo muda de
1024 para N, a tabela ganha uma linha por vetor com o novo modelo, nunca uma migração de coluna com
`DROP`. A dimensão `1024` é um *valor* ancorado na versão do modelo, não o tipo da coluna.

**D5 — O grafo do ADR-016 continua sendo a *ordem*; o embedding é a *proximidade*.** Este ADR não
substitui a opção (b): `skill_registry`/`skill_prerequisite`/`lesson_prerequisites` e o ADR-021
`New skills`/`Prerequisite skills` permanecem o substrato **autoritativo** para pré-requisitos e
progressão. O retrieval por vetor **enriquece** o `NextActivitySelector` (Q-RAG-2 como insumo de
ranking) e o tutor (Q-RAG-1 como insumo de feedback); nunca o substitui como fonte de verdade do
grafo. Isto preserva a parte do ADR-018 §10 que continua correta e resolve a tensão sem escolher
entre os dois.

**D6 — O portão é uma verificação, não uma promessa.** Um gate (em `verify-integrity.py`, no lado
do conteúdo, ou `scripts/retrieval-check.mjs`, no lado da plataforma — mesma família do
`content-check.mjs` do ADR-020 §3) afirma, sobre o acervo real:

- **(i)** todo `source_id` em `content_embeddings` resolve para uma lição/pack/item **com
  `reuse_basis` compatível** (D3) — o portão de licenciamento;
- **(ii)** todo vetor carrega `embedding_model`, `embedding_model_version`, `chunker_version`,
  `source_kind`, `source_id`, `chunk_index` e `derived_at` — o invariant floor (§Driver 2);
- **(iii)** a dimensão de todo vetor bate com a dimensão declarada para a sua
  `embedding_model_version` — impede a coluna de virar fonte de verdade silenciosa;
- **(iv)** o número de vetores é o da cobertura da query (Q-RAG-1/Q-RAG-2), derivado, nunca
  assertado — a regra do `RNF-001`.

**D7 — O ADR-018 §8 é emendado por referência, não apagado.** O §8 do ADR-018 não é reescrito e o
arquivo do ADR-018 não é tocado; este ADR registra a emenda no seu próprio frontmatter
(`supersedes: [018]`, `supersedes_scope`) e no índice `docs/adr/README.md`. A metade do §8 que
permanece **é o invariant floor e o alerta pedagógico** — os dois são acatados por D2/D4 e não são
supersedidos. A metade que muda é uma só: *a remoção do `pgvector` do MVP* passa de *"removed"* a
*"deferred, with the blocker satisfied by ADR-046"*.

## Consequences

### Positive

- **O bloqueador é satisfeito e fica verificável.** O ADR-018 §8 pediu uma query; D1/D2 a nomeiam, e
  a spec de retrieval a torna um artefato com `§`, não uma frase. Um revisor futuro lê *por que* o
  `pgvector` voltou, em vez de encontrar a extensão sem justificativa.
- **A projeção é honesta por construção.** O invariant floor é acatado na schema (D6-ii): um vetor
  não é uma coluna nua, é um derivado com identidade e instante.
- **O licenciamento é o primeiro portão, não uma nota de rodapé.** D3 torna a regra do
  `verify-integrity.py` **[11] executável sobre vetores** — a única forma de a regra sobreviver a um
  dataset gerado por script.
- **A separação grafo × proximidade (D5) resolve a tensão do §10 sem escolher um vencedor.** O
  substrato alternativo não é descartado; é reescopado para o que ele faz bem.

### Negative

- **Mais uma dependência.** `pgvector` entra na superfície de auditoria (`CONSTITUTION.md` §8.2) e
  no `dependabot`, como o ADR-014 já fez com o PGlite; o `pgvector` não está confirmado no PGlite
  (§Driver 7) — uma tarefa de plan, não um fato assumido.
- **Mais um índice a manter, reconstruir e versionar.** Um HNSW é caro de construir e cresce com o
  corpus; um refit de modelo obriga a recomputar **todo** o acervo. É o custo que a opção (c) não
  tem.
- **É uma decisão pedagógica com roupa de banco de dados — o próprio §8 o diz.** D4 a nomeia e a
  deixa em aberto *de propósito*, porque o DBA não deve escolher "o que é semanticamente próximo de
  uma lição"; essa é decisão do Content Owner, com o `database-engineer` a implementar o que for
  decidido.
- **A query Q-RAG-1/Q-RAG-2, ao ser especificada, pode não se justificar.** Se a spec concluir que
  o ganho não paga o custo, aplica-se a opção (c) e este ADR vira o registro de uma decisão revista
  — o que é um resultado legítimo, não um fracasso.

### Neutral

- **`content_embeddings` não ganha RLS.** É conteúdo global (ERD §9 rule 2; contextos 1–3 não são
  learner-scoped); nenhuma das 15 tabelas learner-scoped do §9 é tocada por este ADR.
- **O backup muda de tamanho, não de forma.** A tabela entra no `pgBackRest` existente (ADR-009)
  como qualquer outra; o RPO/RTO não são renegociados aqui.
- **A contagem de tabelas do ERD volta de 33 para 34** se a implementação seguir, e essa é uma
  alteração do ERD que este ADR **não** faz sozinho (§Confirmation, item ERD).

### What weakens (CONSTITUTION.md §9 step 3)

| Weakened | Before | After | Why accepted |
|---|---|---|---|
| **Simplicidade do datastore** | PostgreSQL 16 sem extensão vetorial, conteúdo servido por id | uma extensão a mais, um índice HNSW a construir e reconstruir a cada mudança de modelo | A query nomeada (D1) não tem resposta no substrato atual; o custo é o preço de a ter. Se a spec mostrar que o ganho não existe, a opção (c) reverte isto |
| **Garantia de "nenhuma capacidade sem consumidor" (RNF-001 / §8)** | `content_embeddings` removido justamente por não ter consumidor | a capacidade volta **condicionada** a uma query nomeada com spec, e a implementação não começa antes dela | É uma tensão real com `RNF-001`, e é por isso que D1/D2 a condicionam: a capacidade não volta como artefato assertado, volta com predicado e consumidor. **Se a spec não existir, a condição não foi satisfeita e a tabela não se cria** |
| **Determinismo de dimensão** | não havia coluna vetorial, logo não havia dimensão a fixar | a dimensão passa a depender de `embedding_model_version`, que é uma decisão em aberto (D4) | O `VECTOR(1536)` do draft era uma linha de um modelo deletado, não uma fonte. D6-iii mantém a dimensão verificável contra a versão declarada, então a abertura é *gerida*, não esquecida |
| **Portabilidade dev/test** | PGlite e Postgres exercitam o mesmo SQL em unit test | se o `pgvector` não estiver confirmado no PGlite, os testes de vetor só correm em Postgres, como já acontece com RLS concorrente | Mesma classe de fronteira que o ADR-014 §Binding constraint já traça para `SET LOCAL`; não é uma regra nova, é uma instância dela |

## Confirmation

Para que este ADR esteja **cumprido** — e antes de qualquer migration ser escrita — a checklist é:

- [ ] **Spec de retrieval nomeada** — Q-RAG-1/Q-RAG-2 com predicado, parâmetros (`k`, limiar,
      métrica) e consumidor declarados, citando o `§` de origem (`CONSTITUTION.md` §2 Spec-First;
      bloqueador do ADR-018 §8). **Sem isto, a migração não se escreve** — e é o único item desta
      lista que a ratificação de 2026-10-20 **não** fechou: as queries foram *formalizadas* na
      decisão de OQ-5, mas o artefato com `§` (a spec) é o produto do próximo passo
- [ ] **`pgvector` confirmado no PGlite** — a extensão presente no catálogo do PGlite, ou a
      decisão explícita de rotear os testes de vetor para o `@requires-postgres` do ADR-014
- [ ] **Migration TypeORM** `src/migrations/<ts>-content-embeddings.ts` — `CREATE EXTENSION IF NOT
      EXISTS vector`, `CREATE TABLE content_embeddings`, `CREATE INDEX ... USING hnsw (...)` (ou
      `CREATE INDEX CONCURRENTLY`, que exige Postgres real — ADR-014), com `down()` que faz `DROP
      TABLE IF EXISTS` e **não** `DROP EXTENSION` (a extensão é do ambiente, não da migração).
      Reversível: up → down → up (ADR-018 §6 / P0.4)
- [ ] **Proveniência completa (invariant floor)** — `source_kind`, `source_id`, `chunk_index`,
      `chunker_version`, `embedding_model`, `embedding_model_version`, `derived_at`, todos
      `NOT NULL`; a dimensão verificada contra a versão (D6-ii, D6-iii)
- [ ] **Portão de licenciamento (D3/D6-i)** — a consulta sobre `lessons.reuse_basis` +
      `lessons.publication_state` que barra `adapt_requires_permission`, e a asserção de CI que
      falha se um `source_id` embutido violar o portão; espelha `verify-integrity.py` [11]
- [ ] **Gate `retrieval-check.mjs` (ou extensão do `verify-integrity.py`)** — os quatro
      predicados de D6, sobre o acervo real, na mesma família do `content-check.mjs` (ADR-020 §3)
- [ ] **`docs/data-model.erd.md`** — a tabela entra no §6 (DDL), no §6.9 (o índice HNSW ao lado dos
      GIN dos §6.9 existentes) e a contagem do §4 volta a 34; **é uma emenda do ERD, com a sua
      própria aceitação** — este ADR não a faz por si
- [ ] **Entrada de CHANGELOG** — a reversão de uma remoção registrada, nomeando o ADR-018 §8 como
      emendado e o escopo exato (D7). Não é breaking: nenhuma rota, campo ou resposta muda
- [x] **Decisões de valor fechadas (2026-10-20)** — dimensão (`1024`, OQ-1), modelo (`bge-m3` via
      Ollama local, OQ-2), chunker (`phase-v1`, OQ-3) e métrica (`cosine`, `m = 16`,
      `ef_construction = 64`; OQ-4) decididas com a derivação citada em
      *Open questions — resolved (2026-10-20)*; a implementação não as inventa. Ressalvas que
      **seguem abertas** dentro desta linha: `ef_search` e o ajuste fino (OQ-4) permanecem
      *to be measured*, e o **limiar coseno 0.75** de Q-RAG-1/Q-RAG-2 é *a confirmar* contra o
      acervo. **A spec de retrieval (item 1) ainda está aberta e é pré-requisito de toda a
      implementação de D1**

## Open questions — resolved (2026-10-20)

Estas eram **decisões humanas** e foram **fechadas pelo usuário na ratificação de 2026-10-20**. A
tabela preserva, para cada questão, *o que existia no repositório* na proposta e acrescenta a
**decisão** com a sua **derivação** — o *porquê* medido, não o número nu (regra *Derivation over
Assertion*: um número sem derivação é um defeito neste documento). As cinco linhas ficam como
rastro: quem ler este ADR depois da ratificação vê o que estava em dúvida, o que se decidiu e sobre
o que se decidiu.

| # | Pergunta | O que existia no repositório (na proposta) | Decisão (2026-10-20) | Derivação |
|---|---|---|---|---|
| OQ-1 | **Dimensão do vetor** | O `VECTOR(1536)` está registrado **apenas** no ERD v0.1.0-draft, que o ADR-018 deletou inteiro; o ERD v1.0.0 não o carrega. **Nenhuma fonte viva fixa 1536** | **`1024`** — a dimensão do `bge-m3`, ancorada em `embedding_model_version`, **nunca** no tipo da coluna (D4) | 1024 é a dimensão do modelo escolhido em OQ-2, não um número assertado; o `1536` do draft não tem fonte viva. A recomendação de D4 (guardar a dimensão em `embedding_model_version`) foi acatada |
| OQ-2 | **Modelo de embedding** (provedor, custo, LGPD) | Nenhum modelo é nomeado em spec alguma. O `AGENTS.md` e o `CONSTITUTION.md` §8 impõem LGPD sobre conteúdo — e o conteúdo aqui é **material do curso**, não dado pessoal, o que simplifica | **Local via Ollama**, modelo **`bge-m3`** (1024 dim, ~1.2 GB, multilíngue 100+ idiomas) | O corpus é **bilíngue**: texto de ensino em inglês, mas com glosses, `br_pt_form` e distratores em português; um modelo monolíngue representaria mal os trechos em PT. O Ollama **já está instalado** na máquina (v0.34.4) e o provider `ollama` já está configurado. Por ser **local**, nenhum texto do curso sai da máquina — a LGPD sobre conteúdo (`CONSTITUTION.md` §8) fica satisfeita sem contrato de subprocessador |
| OQ-3 | **Formato do chunk e `chunker_version`** | Nenhuma spec define unidade de chunk (fase? parágrafo? exemplo?). Depende da resposta a Q-RAG-1/Q-RAG-2 na spec de retrieval | **Um chunk por FASE de lição**, com a fase e o `Lesson ID` no preâmbulo/metadados do chunk; `chunker_version = "phase-v1"` | Medido: as **122 lições** no disco têm **exatamente as 4 fases** (122 de cada `FASE 1`…`FASE 4`) — 115 no dialeto `FASE N — …` e 7 no dialeto `FASE N: …`, mas todas com as quatro. O `**Lesson ID:**` está presente em **122/122** e é a chave natural do `source_id` |
| OQ-4 | **Métrica de distância e parâmetros HNSW** (`m`, `ef_construction`, `ef_search`) | Nenhum valor em spec | **Cosine** (operador `<=>`), com `m = 16`, `ef_construction = 64` | 16 e 64 são os **defaults do `pgvector`** (documentados em `CREATE INDEX ... USING hnsw ... WITH (m = 16, ef_construction = 64)`), e cosine é o padrão de facto para embeddings de texto normalizados. **Recomendação do próprio ADR acatada só em parte:** `ef_search` e o ajuste fino dos parâmetros continuam **to be measured** contra o acervo real — não são definitivos |
| OQ-5 | **A formulação exata de Q-RAG-1/Q-RAG-2** | O §Context 2 deste ADR as enuncia em prosa; nenhuma spec as formaliza | **Formalizadas** — ver §*Q-RAG-1/Q-RAG-2 formalizadas* abaixo | É o bloqueador material do ADR-018 §8. A decisão fecha a **enunciação**; a spec de retrieval (Confirmation, item 1) é o artefato que a materializa, e **sem ela a implementação não começa** (D1) |

**Dois resíduos, declarados para não serem lidos como definitivos:**

1. **`ef_search` e o ajuste fino de OQ-4** não foram fixados — continuam *to be measured* contra o
   acervo real, como a recomendação original de OQ-4 pedia. O que a decisão fixou foram a métrica e
   os dois parâmetros de **construção** do índice.
2. **O limiar de similaridade coseno (0.75)** é o único valor das queries abaixo que entra como
   *a confirmar*: o próprio usuário o registrou assim ao fixá-lo em Q-RAG-1 e Q-RAG-2. Ele é um
   valor de partida medido contra o acervo na spec, não um número assertado.

### Q-RAG-1/Q-RAG-2 formalizadas (a decisão de OQ-5)

Estas são as duas queries que satisfazem o bloqueador do ADR-018 §8 (*"a retrieval requirement that
names a query"*). Ambas são **internas** (consumidor: o servidor) — nenhuma rota HTTP (D1/D6).

**Q-RAG-1 — Recuperação semântica de trechos de fase para o tutor adaptativo.**

- **Entrada (query):** o texto da fase da lição correspondente ao **padrão de erro** do aprendiz —
  derivada de uma entrada de `ErrorLogEntry` (`skill_id`, `pattern`, `produced_form`) e/ou do item
  errado. O `ErrorLogEntry` já existe e é escrito em produção
  (`src/domain/entities/learner-model.ts`, `src/domain/services/error-log.service.ts`; **P1.4 DONE**,
  2026-10-10 — `BACKLOG.md` P1.4).
- **Parâmetros:** `k ≤ 6` (alinhado ao *cap at 6 items* do `post-lesson-practice-spec.md` §4.2,
  passo 4); limiar de similaridade coseno **0.75** (*a confirmar* contra o acervo real); métrica
  **cosine** (OQ-4).
- **Resultado:** os *k* trechos de fase autorados semanticamente mais próximos, **filtrados por
  `reuse_basis` compatível** (D3) e afins ao `skill`.
- **Consumidor:** o tutor adaptativo no servidor — enriquece o passo de seleção da *remediation* do
  `post-lesson-practice-spec.md` §4.2 (hoje filtrado só por `b` do IRT — *"the IRT item with `b`
  closest to learner's current θ(skill)"* — e pelo distrator). **Não** é rota HTTP.

**Q-RAG-2 — Seleção de conteúdo i+1 por proximidade.**

- **Entrada:** `θ(skill)` do aprendiz.
- **Parâmetros:** `k = 5`; mesmo limiar coseno (**0.75**, *a confirmar*).
- **Resultado:** lições cujo conteúdo esteja **um passo além**, como **insumo de ranking**.
- **Consumidor:** o `NextActivitySelector` (`src/domain/services/next-activity-selector.ts`).
  **Atenção — o consumidor ainda não funciona:** o **P1.3 está NOT DONE** (`BACKLOG.md` P1.3,
  corrigido em 2026-10-10: `iPlus1Score` é constante `0`, o que torna a regra `i_plus_1`
  inalcançável; bloqueado por **ADR-021**). Portanto Q-RAG-2 é registrada como **insumo futuro**,
  cujo consumidor só passa a funcionar quando o ADR-021 desbloquear o seletor. Ela **nunca**
  substitui o grafo de pré-requisitos (D5).

## Alternatives Considered

1. **Deixar o `pgvector` removido (opção c) e responder Q-RAG-1/Q-RAG-2 pelo grafo do ADR-016.**
   Rejeitada **como substituto**, mantida **como complemento** (D5): o grafo responde "quais lições
   introduzem X" e não responde "quais trechos se parecem com isto" — §Context 3. É a alternativa
   honesta caso a spec de retrieval conclua que a proximidade não compensa o custo.
2. **Vector DB separado (fora do Postgres).** Rejeitada — um segundo datastore ao lado do
   PostgreSQL significaria uma segunda política de backup (contra o ADR-009), uma segunda
   superfície de retenção e um segundo conjunto de credenciais, para resolver dentro do Postgres o
   que o `pgvector` resolve no lugar. O ADR-014 já decidiu "um datastore"; este ADR o respeita.
3. **Embeddings como `BYTEA`/`JSONB` sem extensão, distância em SQL.** Rejeitada — o cálculo de
   distância sobre um tipo sem operador vetorial é `O(n)` por query e serializa a tabela inteira; a
   extensão existe para o índice, não para o tipo. É o argumento de performance, não de forma.
4. **Recriar `content_embeddings` sem coluna de proveniência** (a forma do draft: `id`, `vector`,
   `content_id`). Rejeitada pelo **invariant floor**: o ADR-018 §1 exige que uma projeção carregue
   "the id of what it was derived from and the instant it was derived", e a forma do draft não
   carrega nem o modelo nem o instante — recriá-la seria reintroduzir exatamente o artefato que o
   §8 removeu, agora com um nome novo.
5. **Embutir todo o corpus, incluindo as 48 lições `adapt_requires_permission`.** Rejeitada por
   D3: um vetor é um derivado do texto, e o `external-sources.md` §7.0/`AGENTS.md` exigem permissão
   escrita antes de qualquer forma de reprodução derivada dessas lições. O portão de licenciamento
   (D6-i) é o que impede que a regra dependa de disciplina.
6. **Servir o retrieval por HTTP agora** (`GET /content/search?q=` ou equivalente). Rejeitada por
   R3, o mesmo motivo do ADR-044 D4: não se constrói superfície sem consumidor nomeado. A query é
   interna; a superfície, se existir, vem com o seu próprio ADR.

## Implementation Plan

Nenhum item abaixo começa antes de a spec de retrieval (Confirmation, item 1) existir —
`CONSTITUTION.md` §2 Spec-First, e o bloqueador do ADR-018 §8.

- [ ] **ADR-046.1 — a spec.** Escrever a spec de retrieval formalizando Q-RAG-1/Q-RAG-2 com
      predicado, parâmetros (`k`, limiar coseno, métrica) e consumidor, citando o `§`. **Os valores
      de configuração já foram decididos** (1024, `bge-m3` via Ollama, `phase-v1`, cosine, `m = 16`,
      `ef_construction = 64` — *Open questions — resolved*), mas `ef_search` e o ajuste fino seguem
      *to be measured*; o limiar 0.75 é *a confirmar* contra o acervo. A spec é o artefato com `§`,
      e **sem ela a migração não se escreve** (D1; bloqueador ADR-018 §8)- [ ] **ADR-046.2 — confirmação do PGlite.** Confirmar `pgvector` no catálogo do PGlite; se
      ausente, marcar os testes de vetor `// @requires-postgres` (ADR-014 §Binding constraint)
- [ ] **ADR-046.3 — migration.** `src/migrations/<ts>-content-embeddings.ts`: extensão, tabela,
      HNSW, `down()` reversível; `synchronize: false` (ADR-014)
- [ ] **ADR-046.4 — a entidade.** `src/infrastructure/entities/content-embedding.entity.ts`
      (`@Entity('content_embeddings')` **só** sob `infrastructure/entities/`, ADR-014/`npm run
      domain:check`); o NUMERIC/vetor mapeado na borda, nunca no domínio
- [ ] **ADR-046.5 — o indexador.** Rotina de chunking + embedding que percorre o conteúdo já
      carregado (ADR-020 loader), filtrando por `reuse_basis` (D3); idempotente por
      `(source_kind, source_id, chunk_index, embedding_model_version)` — o mesmo critério de
      upsert do ADR-020 §2
- [ ] **ADR-046.6 — o gate.** `retrieval-check.mjs` (PGlite + `DATABASE_URL`), os quatro
      predicados de D6, com o controle negativo de D6-i: uma lição `adapt_requires_permission`
      reintroduzida no acervo embutido derruba uma asserção nomeada
- [ ] **ADR-046.7 — a emenda do ERD.** §6/§6.9/§4 do `data-model.erd.md` (contagem 33 → 34), com a
      sua própria aceitação
- [ ] **ADR-046.8 — CHANGELOG.** A reversão de uma remoção registrada (D7), não-breaking
- [ ] **ADR-046.9 — relatório.** `reports/` com o antes → depois dos gates, por sub-fase, na linha
      de A5a/A5b/A6b

## References

- [ADR-018](018-persistence-derived-from-specs.md) §8 — **a remoção e o bloqueador que este ADR
  satisfaz**; §10 — o substrato alternativo (mantido como complemento, D5); §1 — o invariant floor
- `its-platform/CHANGELOG.md` — a entrada de remoção (`content_embeddings`, `pgvector`, HNSW)
- `its-platform/docs/data-model.erd.md` §4, §6.9, §9 (rule 2), §10 — o estado derivado, os índices
  existentes, a ausência de RLS em conteúdo global, e a reconciliação de tabelas
- [ADR-016](016-canonical-identifier-registry.md) — o registry canônico de identificadores (a
  *ordem* do grafo, D5)
- [ADR-021](021-per-lesson-skill-metadata.md) — `New skills` / `Prerequisite skills` por lição
  (complemento exato do que o retrieval enriquece)
- [ADR-003](003-postgresql-rls.md) — RLS e as 15 tabelas learner-scoped; este ADR não toca nenhuma
- [ADR-014](014-datastore-pglite-dev-postgres-prod.md) §Decision (prod = PG16 + pgvector), §Neutral
  (extensão no PGlite), §Binding constraint (o que não corre em PGlite)
- [ADR-020](020-content-loader-port.md) §2/§3 — o loader e o `content-check.mjs`, o precedente da
  família de gates e do upsert idempotente
- [ADR-044](044-a6-no-answer-key-in-served-payloads.md) D4 — R3: não se constrói superfície sem
  consumidor nomeado
- `its-platform/CONSTITUTION.md` §2 (Spec-First, Derivation over Assertion, **Invariant Floor**), §5
  (ADR obrigatório para data model change e nova dependência), §8 (segurança/compliance), §9 step 3
- `AGENTS.md` (raiz do repo) — **Licensing**: nenhum dos 7 PDFs é permissivo; list-shaped não pode
  usar `cite_only`; 13 de 123 lições têm fonte reutilizável
- `external-sources.md` §0.5, §7.0 — as três reuse bases e a obrigação de permissão escrita
- `PRD.md` §10 — **RNF-001**: nenhuma capacidade derivada assertada
- skill `database-design` — a decisão de schema usada para enquadrar este ADR
