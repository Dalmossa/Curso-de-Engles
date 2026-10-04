# Lição de 15 Minutos: "As Palavras do Time — como o inglês técnico junta substantivos"

**Lesson ID:** `les_a2_it_terms_basics`
**Reuse basis:** `adapt_with_attribution` — **primeira lição do repositório com esta base.** Adapta, com atribuição, **S01** (Google developer documentation style guide, CC-BY-4.0) e **S16** (Kubernetes docs, CC-BY-4.0). Todo o restante é original. Ver `external-sources.md` §7.0 e "Fontes e Atribuição" no fim.
**Input de listening:** `dlg_a2_04_bug_report` (autorado, `listening-corpus.md`) — reuso **declarado**, ver FASE 1.3
**Target:** Brasileiro, nível A2 (CEFR), perfil desenvolvedor/tech
**Princípio ITS:** Input i+1 → Guided Practice → Output Task → Formative Check
**Foco SLA:** Comprehensible Input, Affective Filter baixo, contrastive analysis
**Pronúncia BR-PT alvo:** TH [ð] em *that*, s-cluster inicial (/st/, /sk/, /sp/) em *stack/docs/sprint*, H aspirado
**Mastery Gate:** P(mastery) ≥ 0.85 AND CI₉₅ lower bound > 0.70 (per skill)

> **Por que esta lição existe.** Um dev brasileiro que já fala inglês em reunião não tem problema de
> vocabulário — tem problema de **agregação**. Ele sabe *review*, sabe *code*, sabe *root* e *cause*,
> e mesmo assim escreve *"the review of the code"*, *"the analysis of root cause"*, *"the window of
> the deploy"*. São todas gramaticais em inglês e todas **erradas como termo técnico**: o termo é
> uma unidade, sem preposição. Nenhum dicionário ensina isso, porque não é vocabulário — é
> **morfossintaxe**, e o português eliminou a preposição porque em PT a preposição é obrigatória.
>
> **O ponto gramatical central é o compound noun com modificador-cabeça**, porque o português não
> tem o mecanismo. E o **segredo** está na palavra *head*: em *root cause analysis*, o que
> concorda em número é *analysis*, nunca *causes*. Errar isso é o sinal de que o aluno decorou o
> termo como string em vez de entender a estrutura — e é o sinal que o ITS procura.
>
> ⚠️ **Esta lição NÃO usa `content-map.md` §11.1.** O deck de 40 siglas foi reescrito em 2026-09-30
> e é um *rascunho de pesquisa* derivado de uma fonte **restrita** — serve para checar frequência e
> cobertura, não para ensinar. Ver `verify-integrity.py` [11] e `external-sources.md` §0.5.1.

---

## 📋 METADADOS DA LIÇÃO

| Campo | Valor |
|-------|-------|
| **Lesson ID** | `les_a2_it_terms_basics` |
| **CEFR Level** | A2 (Can understand short technical texts; can produce fixed technical terms) |
| **Bloom Level** | Understand → Apply |
| **Skills (Tracking Domains)** | Grammar, Vocabulary, Listening, Pronunciation |
| **Output Modalities** | Speaking |
| **Vocabulary Load** | 8 compounds (all new) + 3 acronyms (1 review) + 2 false cognates (1 review) |
| **Grammar Points** | `technical_noun_compound`, `compound_head_agreement`, `cannot_one_word` |
| **Time Budget** | 15 min (Input 4 → Practice 5 → Output 4 → Check 2) |
| **Spaced Review Tags** | `it-terms`, `noun-compounds`, `acronyms`, `false-cognates`, `doc-register` |
| **Prereq Lessons** | `les_a2_greetings_intro`, `les_a2_small_talk` |
| **Next Lessons (Unlocked)** | `les_a2_it_roles_hierarchy`, `les_a2_it_reading_strategy`, `les_a2_it_computer_parts` |
| **Entry point** | **Sim** — A2 do IT track (`curriculum-graph-spec.md` §4.4.6) |

---

## 🎯 OBJETIVOS DE APRENDIZAGEM (Can-Do CEFR)

Ao final da lição, o aluno **consegue**:

1. ✅ Produzir 6 termos técnicos compostos **sem preposição**: *code review*, *bug report*, *root cause analysis*, *version control*, *deploy window*, *on-call rotation*
2. ✅ Identificar a **cabeça** do compound e fazer a concordância nela (*root cause analys**es***, nunca *root causes analysis*)
3. ✅ Decidir quando expandir uma sigla e quando não — a regra é **sobre o leitor**, não sobre o documento
4. ✅ Reconhecer o padrão de glosa **"X, that is, …"**, que é como a documentação técnica explica um termo
5. ✅ Não usar *actually* para "atualmente" nem *eventually* para "eventualmente"
6. ✅ Pronunciar: s-cluster inicial /st/ /sk/ /sp/ e TH [ð] em *that*

---

## 📥 FASE 1: INPUT COMPREENSÍVEL (i+1) — 4 min

### 1.1 Texto — a nota de segunda-feira (2,5 min)

> **Contexto:** *Você é novo no time. Isto é a nota que o dev de payments deixa no canal depois do
> standup. Leia **uma vez** sem parar. Na segunda leitura, volte marked.*

```text
Standup notes — Monday

Quick update on the payment service. The nightly batch job failed again — the
root cause analysis points to a database connection leak, not a code review
problem. I opened a bug report with a reproduction case and attached a crash log.

The CI pipeline is red, so I can't merge the PR until the fix lands. If the
deploy window slips, I will update the change log and notify the support team
before end of day.
```

### 1.2 Tarefa de notar (1 min) — antes de qualquer explicação

**Duas perguntas. Responda oralmente; o ITS só registra.**

1. **Quantas "coisas de duas palavras" você vê?** *(Resposta: 13 — standup notes, payment service,
   nightly batch job, root cause analysis, code review, bug report, reproduction case, crash log,
   CI pipeline, deploy window, change log, support team, end of day.)*
2. **A nota usa `CI` e `PR` sem explicar. Isso é um erro?**

> **A resposta da 2 é "depende" — e é a resposta que ensina mais nesta lição.** A regra **não** é
> "sempre expandir". A regra é sobre **quem vai ler**: no canal do seu time, onde todo mundo já sabe
> o que é CI, *não expandir* é o certo — expandir todo mundo toda vez é ruído. Num **design doc**
> que um novato vai abrir amanhã, expandir é obrigatório. Um aluno que responde "sempre expandir"
> errou por fraqueza; um aluno que responde "sempre não expandir" errou porimpaciência. O registro de
> registro do ITS é `acronym_expansion_register` com dois estados, não um booleano.

### 1.3 Áudio — `dlg_a2_04_bug_report` (1,5 min)

> **Reuso declarado.** Este clipe é o input natural de `les_a2_it_incidents` (módulo seguinte). Aqui
> ele serve para uma **tarefa diferente e mais estreita**: o aluno não precisa entender a estrutura do
> relato, só **contar os compounds** que ouve. Uso espaçado do mesmo material com objetivo distinto —
> legítimo, e declarado, porque reutilizar sem dizer é o que transforma corpus em lixo.

> **Contexto:** *uma usuária liga para o helpdesk porque não consegue entrar no dashboard.*

**Tarefa (só receptiva):** * quantos compounds você ouviu? Liste três. *
Resposta-alvo: *log in*, *password reset*, *crash log* / *debug mode* / *service restart* (varia por
renderização — o ITS aceita qualquer lista de 3 plausíveis e registra o total como estimativa).

⚠️ **Gate:** o áudio **não existe ainda** (nenhum clip foi renderizado). Esta fase está
**render-blocked**, declarada em `post-lesson-practice-spec.md` §10.11. Até a renderização, o ITS
serve o texto e marca o item como `deferred_render`.

---

## 🛠 FASE 2: GUIDED PRACTICE — 5 min

### 2.1 O compound é uma unidade (2 min) — a tabela que é a lição

| O que o brasileiro escreve | ERRO TÍPICO (o que o aluno de fato produz) | CORRETO |
|---------------------------|------------------------------------------------|---------|
| revisão de código | *the review of the code* | **code review** |
| relatório de erro | *the report of the bug* | **bug report** |
| análise da causa raiz | *analysis of the root cause* | **root cause analysis** |
| controle de versão | *control of the version* | **version control** |
| janela de publicação | *window of the deploy* | **deploy window** |
| pedido de correção (GitHub) | *request of correction* | **pull request (PR)** |
| registro de mudanças | *log of changes* | **change log** |
| rotação de plantão | *rotation of the duty* | **on-call rotation** |

> **A regra em uma frase: o termo é um bloco só. Não há preposição dentro dele, e não há "de" para
> traduzir.** Isso não é uma peculiaridade do inglês técnico — é o sintagma nominal, e vale para
> *side effect*, *end user*, *input validation*. O português traduz o sintagma inteiro, e o
> tradutor automático reintroduz a preposição. É por isso que o erro é tão persistente: **o
> tradutor o produz, e o aluno o aceita porque soa correto.**

### 2.2 A cabeça do compound (1 min) — o erro que revela se você decorou

Em *root cause analysis*, **qual palavra concorda em número?**

| | Correto | Errado | Por quê |
|---|---------|--------|---------|
| singular | one root cause analysis | — | — |
| plural | two root cause analys**es** | ~~two root causes analysis~~ | a cabeça é *analysis*; *cause* e *root* são modificadores |

Mesmo teste: *two bug report**s*** (não *two bugs report*); *three deploy window**s*** (não
*three deploys window*).

> **Por que isso importa pedagogicamente.** O aluno que escreve *"two bugs report"* não decorou mal
> — ele **não internalizou a cabeça**. Ele está tratando o termo como uma string, e uma string
> memorized não transfere para *design document*, *feature flag* ou *security patch*. Esta é a
> pergunta que separa decorado de aprendido, e por isso é o item de prática de maior valor da lição.

### 2.3 O padrão de glosa: "X, that is, …" (1,5 min)

Documentação técnica em inglês **redefine, não descreve**. O padrão é *X, that is, Y*:

- *A cluster is a group of machines, **that is**, a group of computers that work together.*
- *A node is one machine, **that is**, one computer inside the group.*
- *The control plane manages the cluster, **that is**, it decides where each piece of work runs.*

> **Adaptação declarada.** A estrutura vem de **S16** (*"it scales horizontally — that is, it scales
> by deploying more instances"*, CC-BY-4.0) e as três frases acima são adaptações, não citações.
> Atribuição completa no fim da lição.

> **Por que isto importa mais do que parece.** Um dev BR lê documentação técnica em inglês há anos e
> ainda trava na primeira frase de um termo novo. Não é vocabulário — é que ele está procurando
> **definição** e o texto está fazendo **reiteração em linguagem mais simples**. Ensinar o padrão é
> ensinar a ler o dicionário que já está na página.

### 2.4 Error correction — 4 erros, 1 bônus (1,5 min)

> Hi team. I prepared the analysis of the root cause for the API outage. The review of the code was
> actually finished yesterday, but the deploy window is not closed yet, so I can not merge the PR.
> Eventually the CI pipeline will be green and then I will do the bug report.

| # | Erro | Correção | `br_pt_form` |
|---|------|----------|---------------|
| 1 | *the analysis of the root cause* | **root cause analysis** | sintagma nominal com "de" obrigatório em PT |
| 2 | *the review of the code* | **code review** | "revisão **de** código" |
| 3 | *was actually finished* | **was already finished** | *actually* = *atualmente* (falso cognado, `content-map.md` §11.2 A1) |
| 4 | *Eventually the pipeline will be green* | **As soon as** / **Once** the pipeline is green | *eventualmente* lido como *"no fim das contas"*, usado como certeza |
| ★ | *I can not merge* | **I cannot merge** | *can not* (2 palavras) é erro de escrita, não de gramática |

---

## 🎭 FASE 3: OUTPUT TASK (Communicative) — 4 min

### Tarefa: "Explain the stack" (falado, 60 segundos, gravado)

> **Cenário:** *quinta-feira, 15h. Um colega novo (`Rui`, voice `v_b`) entra na sua call e diz
> "can you explain what we do here?". Você tem 60 segundos. Ele vai escrever um design doc na
> semana que vem — ou seja, **ele é o leitor que você está considerando ao escolher o que expandir.***

**Requisitos (todos obrigatórios):**

1. **≥ 4 compounds**, sem preposição interna
2. **≥ 2 siglas**, com a **expansão na primeira ocorrência** — porque o leitor é um novato
3. **≥ 1 glosa** no padrão "X, that is, …"
4. **Nenhum** *actually* / *eventually* no sentido português

**Roteiro sugerido (não obrigatório):** o que o serviço faz → como é montado → onde você mora
dentro disso.

**Rubrica de Sucesso (CEFR A2→B1 Speaking + compound formation):**

| Critério | 0,5 pts | 1 pt | 1,5 pts |
|----------|---------|------|---------|
| **Compounds sem preposição** | ≤ 2 corretos, ou nenhum | 3–4 corretos | 5+ corretos, nenhum com preposição |
| **Cabeça no plural** | erra se houver plural | acerta o singular | acerta **e** corrige o próprio erro em voz alta |
| **Expansão de sigla** | nenhuma expandida | 1 expandida na 1ª ocorrência | 2+ expandidas, e **justifica** a escolha do leitor |
| **Glosa "that is"** | ausente | presente, mas com *that is*tropeçando | presente e natural, sem hesitação |
| **Falsos cognados** | usa *actually* como "atualmente" | não usa | usa *actually* com o sentido correto (*"na verdade"*) |
| **Fluência** | pausas > 5 s | 1–2 pausas | fala contínuo, 55–70 s |

> **Nota de desenho:** a rubrica não pontua "quantas siglas o aluno sabe". Ela pontua **a decisão**.
> Um aluno que expande tudo para sempre e um aluno que nunca expande recebem a mesma nota no
> critério 3 — que é exatamente o que a FASE 1.2 perguntou. Isso é coerência entre o input e a
> avaliação, e é rara.

---

## ✅ FASE 4: FORMATIVE CHECK — 2 min

**Shadow CAT — 4 itens, `provenance: authored_illustrative`.** Não entram no banco: não há
calibração (X2 em `assessment-item-spec.md`) e a densidade do pool é 0 de 4. São diagnóstico de
pós-aula, e o ITS os descarta ao fim da sessão.

### ITEM 1 — `grm_technical_noun_compound_001` · MCQ · Grammar

> **Which is the standard fixed term in English for "revisão de código"?**

| Slot | Value |
|------|-------|
| A | code review |
| B | review of the code |
| C | review from the code |
| D | code's review |

**Key:** A
**Feedback:** B e C são English correto e **significam a mesma coisa** — e é por isso que a
pergunta diz *standard fixed term*. Em texto técnico, o termo é o bloco *code review*; a forma com
"of" é a tradução literal de "revisão de código" e soa como não-inglês escrito. D é possessive e
significa outra coisa (a revisão *pertencente* ao código).

### ITEM 2 — `voc_acronym_first_use_001` · contextual_selection · Vocabulary

> **You are writing the first paragraph of a design doc. A new joiner will read it tomorrow.
> Which opening is correct?**

| Slot | Value |
|------|-------|
| A | The API is the interface our mobile app uses to talk to the backend. |
| B | The API is what our mobile app uses to talk to the backend. |
| C | The API stands for the interface our mobile app uses to talk to the backend. |
| D | The interface our mobile app uses to talk to the backend is the API. |

**Key:** A
**Feedback:** A dá a expansão e o sentido em uma frase só. B usa a sigla sem explicar. C usa
*stand for* pelo motivo errado — em inglês *stand for* é o que se pergunta **sobre** uma sigla, não
o que se diz **para** defini-la. D inverte a ordem e obriga o leitor a segurar a sigla antes de
saber o que é.

### ITEM 3 — `voc_false_cognate_actually_001` · MCQ · Vocabulary

> **In which sentence does *actually* mean "atualmente"?**

| Slot | Value |
|------|-------|
| A | The service is actually down right now. |
| B | The service was actually down. I checked twice. |
| C | I actually liked the meeting. |
| D | He actually works in the payments team. |

**Key:** D
**Feedback:** *actually* significa *na verdade / de fato* em A, B e C. Em português *atualmente* é o
falso cognado. Para "atualmente" o inglês é **currently** (ou *nowadays*). A é a distração mais
perigosa: tem *right now* na frase, e por isso parece a resposta.

### ITEM 4 — `voc_false_cognate_eventually_001` · MCQ · Vocabulary

> **Choose the sentence where *eventually* is correct English.**

| Slot | Value |
|------|-------|
| A | Eventually, we will migrate the database. |
| B | Eventually, the server does not crash. |
| C | Eventually, the test passes. |
| D | We will eventually the database. |

**Key:** A
**Feedback:** A está correto: *eventually* = *no fim das contas, em algum momento futuro*. B e C
usam *eventually* como *eventualmente* (certeza sobre o momento), que em inglês é **probably** ou
**likely**. D não é uma frase — *eventually* é advérbio, não verbo.

### Registro do check

| Skill tocada | Item | Resultado esperado |
|--------------|------|--------------------|
| `grammar.technical_noun_compound` | ITEM 1 | ≥ 80% antes de `les_a2_it_reading_strategy` |
| `vocab.acronym_expansion_register` | ITEM 2 | entra no diagnóstico, não bloqueia |
| `vocab.false_cognate_actually` | ITEM 3 | entra no FSRS (revisão: +1d, +4d, +10d) |
| `vocab.false_cognate_eventually` | ITEM 4 | entra no FSRS (revisão: +1d, +4d, +10d) |

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_terms_basics",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S16",
        "title": "Kubernetes documentation - Cluster Architecture and Glossary",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "the 'X, that is, Y' glossing pattern in 2.3, from 'it scales horizontally - that is, it scales by deploying more instances'; adapted, not quoted",
        "attribution_location": "section 'Fontes e Atribuicao' below"
      },
      {
        "id": "S01",
        "title": "Google developer documentation style guide",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "the reader-first framing in 1.2 and 3, from the guide's /highlights#tone-and-content and /voice sections; the substance is the argument in 2.3, which is authored",
        "attribution_location": "section 'Fontes e Atribuicao' below"
      }
    ],
    "authored_material": "all exercises, the standup note, the correction table, the rubric, the 4 Shadow CAT items, the 8-row compound table",
    "explicitly_not_used": {
      "reference": "content-map.md 11.1",
      "reason": "rewritten 2026-09-30 as a RESEARCH SCAFFOLD derived from a restricted source; usable for frequency and coverage checking only, never as a teaching vocabulary source. verify-integrity.py [11] enforces this."
    },
    "bibliography_only": [
      "Ingles-Tecnico-Para-Informatica.md (CETAM, no licence grant) - scoping of what a beginner IT course treats as core",
      "Dicionario-de-Siglas...md BaixoLivros notice applies - scoping of which acronyms are frequent, not content",
      "frases-ingles-trabalho.md - register of a workplace note, no text reproduced"
    ],
    "listening_input": "dlg_a2_04_bug_report",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - the two adapted passages are reworded, not quoted; the verbatim CC-BY footer lines are quoted only in the attribution block, as the licence requires"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.technical_noun_compound",
      "grammar.compound_head_agreement",
      "grammar.cannot_one_word"
    ],
    "vocabulary": [
      "vocab.acronym_expansion_register",
      "vocab.gloss_pattern_that_is",
      "vocab.false_cognate_actually",
      "vocab.false_cognate_eventually",
      "vocab.doc_register_note"
    ],
    "listening": [
      "listening.noun_compound_identification"
    ],
    "pronunciation": [
      "pronunciation.s_consonant_cluster",
      "pronunciation.th_voiced"
    ]
  },
  "prereq_lessons": ["les_a2_greetings_intro", "les_a2_small_talk"],
  "unlocks": [
    "les_a2_it_roles_hierarchy",
    "les_a2_it_reading_strategy",
    "les_a2_it_computer_parts"
  ],
  "fsrs_anchors": [
    {
      "construct": "vocab.false_cognate_actually",
      "note": "already introduced in mod_a1_comm_basic; this is spaced review, not new input"
    },
    {
      "construct": "vocab.false_cognate_eventually",
      "note": "A2 in content-map.md 11.2; new here"
    }
  ],
  "expected_error_rates": {
    "grammar.technical_noun_compound": 0.55,
    "grammar.compound_head_agreement": 0.62,
    "vocab.acronym_expansion_register": 0.40,
    "vocab.false_cognate_eventually": 0.48
  },
  "error_rates_are": "AUTHOR PRIORS, not measurements. No item has been calibrated (X2); these seed the learner's first observation and are replaced by measurement after 3 responses."
}
```

---

## 🔄 PRÓXIMOS PASSOS NO CURRICULUM GRAPH

**Ao mastering (P ≥ 0.85, CI₉₅ lower > 0.70 em `technical_noun_compound` E `compound_head_agreement`):**

1. `les_a2_it_roles_hierarchy` — o mesmo mecanismo em outro registro (papéis, não ferramentas)
2. `les_a2_it_reading_strategy` — o compound como **âncora de leitura**: é o que permite adivinhar o
   termo seguinte sem diccionario
3. `les_a2_it_computer_parts` — o vocabulário físico

**Se reprovar `compound_head_agreement` duas vezes:** mediação — 6 substantivos em coluna, aluno
marca a cabeça, depois reconstrói o plural. Sem nova lição; é drills sobre o construct.

---

## 🎮 GAMIFICATION HOOKS

| Hook | Gatilho | Recompensa |
|------|---------|------------|
| **Compound Collector** | 4+ compounds corretos no Shadow CAT | +50 XP, badge *No Preposition* |
| **Streak de cabeça** | 7 dias sem errar plural de compound | +100 XP |
| **Detetive de sigla** | acerta `voc_acronym_first_use_001` de primeira | +25 XP |
| **False-Cognate Slayer** | 3 falsos cognatos consecutivos | +75 XP, badge *Not Currently* |

> **Nota:** XP é tied a mastery, não a tempo na lição. Ficar 15 min sem acertar não gera XP; acertar
> no dia 14 depois de espaçamento gera. Ver `AGENTS.md` §Gamification Layer.

---

## 📝 NOTAS PARA O DESENVOLVEDOR DO ITS

### O que esta lição está ensinando, em uma frase

**Termo técnico em inglês é uma unidade morfosintática, e o português não teprepared para isso.**

### Bugs known

1. **A FASE 1.3 está render-blocked.** `dlg_a2_04_bug_report` não tem áudio. Servir texto + marcar
   `deferred_render`; não pontuar como listening.
2. **ITEM 1 tem duas respostas gramaticalmente corretas** (A e B). Isso é deliberado e é o item mais
   defensável do banco *se* a chave for `standard fixed term`. Se o banco migrar para
   `contextual_selection`, trocar o stem para eliminate a ambiguidade.
3. **O texto da FASE 1.1 tem 13 compounds declarados.** A contagem é verificável
   mecanicamente — se um exercises for reescrito, recontar. Não é decoração: o aluno é
   **instruído a contar**, e o ITS compara com a verdade.

### A decisão de design que esta lição registra

`acronym_expansion_register` é o **primeiro skill com dois estados de verdade** em vez de um
booleano: *expande para quem não sabe* e *não expande para quem sabe*. Um boolean
(`expand_on_first_use: true`) seria mais simples e **erraria em metade dos casos reais**, porque
metade dos documentos técnicos do mundo é escrita para quem já sabe. O modelo precisa de
`{expand_for: unknown_reader}`.

### Licença — o que o revisor tem de saber

Esta é a **primeira** lição `adapt_with_attribution` do repositório, e ela existe em parte para
**provar que o padrão funciona**. O que foi realmente adaptado: o padrão de glosa "X, that is, Y"
(2.3) e o enquadramento leitor-primeiro (1.2, FASE 3). Duas passages curtas, parafraseadas, de
fontes CC-BY-4.0, com atribuição abaixo. **Nenhum texto das fontes locais é reproduzido**, e
`content-map.md` §11.1 foi deliberadamente deixado de fora.

Se um revisor encontrar reprodução literal de S01 ou S16 nesta lição, isso é um defeito, não uma
referência de escopo.

---

## 📚 FONTES E ATRIBUIÇÃO

> `adapt_with_attribution` exige atribuição visível. As duas fontes adaptadas são CC-BY-4.0; os
> footers verbatim são citados aqui porque a licença exige a atribuição no material derivado.

**S16 — Kubernetes documentation**

- *Cluster Architecture*: <https://kubernetes.io/docs/concepts/architecture/>
- *Glossary*: <https://kubernetes.io/docs/reference/glossary/>
- Licença declarada em cada página: *"© 2026 The Kubernetes Authors | Documentation Distributed
  under CC BY 4.0"*
- **O que foi adaptado:** o padrão de glosa *"X, that is, Y"*, a partir de *"kube-apiserver is
  designed to scale horizontally — that is, it scales by deploying more instances"*. As três frases
  de 2.3 são **paráfrases**, não citações.
- **O que NÃO foi adaptado:** o modelo de objetos do Kubernetes (Pod, Deployment, StatefulSet),
  registrado em `external-sources.md` S16 como *too much infrastructure support vocabulary for a
  non-architect*.

**S01 — Google developer documentation style guide**

- <https://developers.google.com/style>
- Licença declarada: *"Except as otherwise noted, the content of this page is licensed under the
  Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0
  License. For details, see the Google Developers Site Policies."*
- **O que foi adaptado:** o enquadramento leitor-primeiro em 1.2 e na rubrica da FASE 3, a partir
  de `/highlights#tone-and-content` e `/voice` — em particular *"Use second person: 'you' rather
  than 'we'"* e *"If you want to tell the reader to do something, try to mention the circumstance,
  conditions, or goal before you provide the instruction."* A **substância** do drill 2.3 — que a
  documentação técnica **redefine** em vez de descrever — é **argumento original desta lição**, e
  S01 é a evidência de que o registro existe na indústria, não a fonte dele.
- **O que NÃO foi adaptado:** os pares *Recommended / Not recommended* da seção de procedures, que
  `external-sources.md` S01 reserva para `les_b1_it_write_docs`.

**Fontes locais — escopo apenas, nenhuma reprodução**

- `Ingles-Tecnico-Para-Informatica.md` (© CETAM, sem concessão de licença) — consultado para
  *decidir o que* um curso básico de IT cobre; nenhum texto reproduzido.
- `Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md` (aviso BaixeLivros: *"Caso deseje
  compartilhar-lo fora deste ambiente, é necessário obter a devida permissão."*) — consultado apenas
  para *decidir quais siglas são frequentes*. **Nenhum termo, gloss ou pronúncia foi reproduzido**;
  o deck de `content-map.md` §11.1 foi deliberadamente não usado como fonte de ensino.
- `frases-ingles-trabalho.md` (mesmo aviso BaixeLivros) — apenas para *decidir o registro* de uma
  nota de trabalho. Nenhuma frase reproduzida.
