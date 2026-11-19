# Practice Pack — `les_a2_it_terms_basics`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_terms_basics_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_terms_basics.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US); the glossary comes from everyday engineering contexts — tickets, docs and stand-ups — and no external source text is reproduced or adapted.
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_terms_basics_v1
lesson_id: les_a2_it_terms_basics
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 6 current / 1 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 0
  br_pt_form_coverage: 6/6 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 3 | 2–3 | ✅ |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_it_terms_compound_head_001
skill: `grammar.technical_noun_compound`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "We closed the review of code before the release."
    br_pt_form: "Nós fechamos a revisão do código antes da release."
    note: "Portuguese inserts a preposition; the technical term is a compound noun with the modifier first"
  - option: "We closed the reviews of code before the release."
    br_pt_form: "Nós fechamos as revisões do código antes da release."
    note: "the plural belongs on the head noun, so code review becomes code reviews, not reviews of code"
  - option: "We closed the code reviewing before the release."
    br_pt_form: "Nós fechamos a revisão de código antes da release."
    note: "the established term uses the noun review rather than the gerund reviewing"
```

**Item:**
> A tech lead recaps a release in the daily stand-up. Choose the natural sentence.

| Slot | Value |
|------|-------|
| A | "We closed the review of code before the release." |
| B | **"We closed the code reviews before the release."** ✓ |
| C | "We closed the reviews of code before the release." |
| D | "We closed the code reviewing before the release." |

**Key:** B

**Feedback:**
> The term is a compound noun: **`code review`** puts the modifier first and marks the plural on the head, so **`code reviews`**. **A** inserts the preposition that Portuguese requires but the English term does not use. **C** moves the plural onto the modifier, and **D** swaps the noun for a gerund.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, prerequisite review

```yaml
item_id: grm_it_terms_title_article_001
skill: `grammar.job_title_articles`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_greetings_intro`
distractors:
  - option: "Bruno is QA engineer on this squad."
    br_pt_form: "O Bruno é engenheiro QA neste squad."
    note: "Portuguese drops the article before a job title; English uses a or an when describing a role"
  - option: "Bruno is an QA engineer on this squad."
    br_pt_form: "O Bruno é um engenheiro QA neste squad."
    note: "QA starts with a consonant sound, so the article is a rather than an"
  - option: "Bruno is a QA engineers on this squad."
    br_pt_form: "O Bruno é um engenheiros QA neste squad."
    note: "one person takes a singular countable noun after the article"
```

**Item:**
> In a stand-up you introduce a teammate's role. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "Bruno is QA engineer on this squad." |
| B | **"Bruno is a QA engineer on this squad."** ✓ |
| C | "Bruno is an QA engineer on this squad." |
| D | "Bruno is a QA engineers on this squad." |

**Key:** B

**Feedback:**
> Describing someone's job takes an article in English: **`Bruno is a QA engineer`**. **A** drops the article as Portuguese does. **C** uses *an* before a consonant sound, and **D** puts a plural noun after a singular article.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_it_terms_document_documentation_001
skill: `vocab.document_documentation_register`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "I wrote a documentation and added a documentations to the wiki."
    br_pt_form: "Eu escrevi uma documentação e adicionei umas documentações à wiki."
    note: "documentation is uncountable in English, so it takes neither an article nor a plural"
  - option: "I wrote a documentation and added a document to the wiki."
    br_pt_form: "Eu escrevi uma documentação e adicionei um documento à wiki."
    note: "the first clause still treats the uncountable noun as if it were a single countable file"
  - option: "I wrote documentations and added a documentation to the wiki."
    br_pt_form: "Eu escrevi umas documentações e adicionei uma documentação à wiki."
    note: "both clauses invent a plural and an article for a noun that has neither"
```

**Item:**
> Ana wrote one page for the login endpoint and put it on the team wiki. Choose the sentence that uses both words correctly.

| Slot | Value |
|------|-------|
| A | "I wrote a documentation and added a documentations to the wiki." |
| B | **"I wrote documentation and added a document to the wiki."** ✓ |
| C | "I wrote a documentation and added a document to the wiki." |
| D | "I wrote documentations and added a documentation to the wiki." |

**Key:** B

**Feedback:**
> *Documentation* is the uncountable body of docs, while a single page is **`a document`**. **A** gives the uncountable noun both an article and a plural, **C** keeps the article where it does not belong, and **D** pluralises the uncountable noun in the first clause.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: voc_it_terms_ship_send_001
skill: `vocab.ship_vs_send`
type: `contextual_selection`
difficulty_b: 0.0
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Ana shipped Bruno the ticket link and sent the fix to production."
    br_pt_form: "A Ana entregou o link do ticket ao Bruno e enviou a correção para produção."
    note: "the verbs are swapped; a link is sent to a person and a fix is shipped to users"
  - option: "Ana shipped Bruno the ticket link and shipped the fix to production."
    br_pt_form: "A Ana entregou o link do ticket ao Bruno e entregou a correção em produção."
    note: "ship does not mean hand a link to a colleague"
  - option: "Ana sent Bruno the ticket link and sent the fix to production."
    br_pt_form: "A Ana enviou o link do ticket ao Bruno e enviou a correção para produção."
    note: "send describes the delivery of a message, not the release of a change to users"
```

**Item:**
> Ana released the fix to users yesterday and then messaged Bruno the ticket link. Choose the natural sentence.

| Slot | Value |
|------|-------|
| A | "Ana shipped Bruno the ticket link and sent the fix to production." |
| B | **"Ana sent Bruno the ticket link and shipped the fix to production."** ✓ |
| C | "Ana shipped Bruno the ticket link and shipped the fix to production." |
| D | "Ana sent Bruno the ticket link and sent the fix to production." |

**Key:** B

**Feedback:**
> **`Send`** moves a message or file to a person; **`ship`** releases a change to users. **A** swaps the two verbs, **C** uses *ship* for a link, and **D** uses *send* for a production release.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Reading, current lesson

```yaml
item_id: rdg_it_terms_standup_note_001
skill: `reading.standup_status_note`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The login fix."
    br_pt_form: "A correção de login."
    note: "Ana already shipped the login fix, so it is finished, not still open"
  - option: "The link to the ticket."
    br_pt_form: "O link para o ticket."
    note: "Ana already sent the link to the team"
  - option: "The QA engineer role."
    br_pt_form: "O cargo de engenheiro QA."
    note: "Bruno introduced his role; it is not a pending task"
```

**Stimulus:**
> "Stand-up notes: I shipped the login fix last night and sent the link to Bruno. Bruno is a QA engineer on this squad. I wrote a document for the endpoint, but our documentation is still short. Eventually we will add the guide."

**Item:**
> What is still open at the end of the note?

| Slot | Value |
|------|-------|
| A | "The login fix." |
| B | "The link to the ticket." |
| C | **"The guide for the endpoint."** ✓ |
| D | "The QA engineer role." |

**Key:** C

**Feedback:**
> The note ends with **`Eventually we will add the guide`**, so the guide is the pending item. **A** is already shipped, **B** is already sent, and **D** is a role that Bruno simply holds.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Coherence, current lesson

```yaml
item_id: coh_it_terms_actually_eventually_001
skill: `coherence.actually_eventually_connectives`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Eventually he is a QA engineer; actually we will add the guide."
    br_pt_form: "Eventualmente ele é engenheiro QA; na verdade vamos adicionar o guia."
    note: "the connectives are swapped: actually corrects a belief, eventually points to a later time"
  - option: "Actually he is a QA engineer; actually we will add the guide."
    br_pt_form: "Na verdade ele é engenheiro QA; na verdade vamos adicionar o guia."
    note: "the second clause needs the time connective, not a second correction"
  - option: "Eventually he is a QA engineer; eventually we will add the guide."
    br_pt_form: "Eventualmente ele é engenheiro QA; eventualmente vamos adicionar o guia."
    note: "the first clause corrects a belief, so actually belongs there"
```

**Item:**
> Your teammate thinks Bruno is a developer. You want to correct that, then say the guide will come later. Choose the sentence that matches both meanings.

| Slot | Value |
|------|-------|
| A | "Eventually he is a QA engineer; actually we will add the guide." |
| B | **"Actually he is a QA engineer; eventually we will add the guide."** ✓ |
| C | "Actually he is a QA engineer; actually we will add the guide." |
| D | "Eventually he is a QA engineer; eventually we will add the guide." |

**Key:** B

**Feedback:**
> **`Actually`** corrects the wrong belief about the role and **`eventually`** places the guide at a later time. **A** swaps the two connectives, **C** repeats the correction where a time marker is needed, and **D** uses the time marker in the clause that corrects the belief.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: prn_it_terms_scluster_voicedth_001
skill: `pronunciation.s_cluster_voiced_th`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *stack* /stæk/ and *docs* /dɒks/ carry s-clusters that Brazilian Portuguese tends to break with an extra vowel; *that* /ðæt/ opens with the voiced TH, which has no counterpart in pt-BR.
**Step 2 — produce (ASR-scored):** read aloud:

> "That tech lead shipped the docs and sent the stack trace."

**Target phonemes:** /st/ in *stack* with no vowel before it · /ks/ in *docs* inside one syllable · voiced /ð/ in *that* · no /dʒ/ or /z/ substitution.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `compound_head_plural` | Item 1 missed | **L2** | Rebuild *code review / code reviews* against *review of code* and move the plural back to the head noun. |
| `document_documentation_count` | Item 3 missed | **L2** | Sort *a document* (one file) from *documentation* (the uncountable body of docs). |
| `ship_send_contrast` | Item 4 missed | **L2** | Drill *sent the link* against *shipped the fix* in stand-up status updates. |
| `actually_eventually_connectives` | Item 6 missed | **L2** | Rebuild the correction versus later-time contrast with short stand-up sentences. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration; audio rendering is blocked.
3. `coherence.actually_eventually_connectives` is a coherence skill namespace; its tracked domain is `grammar` because `coherence` is not a domain.
4. Items target authored lesson content; no external source text is reproduced or adapted.
