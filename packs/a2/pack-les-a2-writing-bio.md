# Practice Pack — `les_a2_writing_bio`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_writing_bio_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_writing_bio.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_writing_bio_v1
lesson_id: les_a2_writing_bio
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
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
| Grammar | 2 | 2–3 | ✅ |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 2 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_bio_third_person_001
skill: `grammar.third_person_bio`
type: `error_correction`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "He work as a backend developer."
    br_pt_form: "Ele trabalha como desenvolvedor back-end."
    note: "the third-person -s ending disappears; Portuguese has no such ending"
  - option: "He is work as a backend developer."
    br_pt_form: "Ele está trabalhar como desenvolvedor back-end."
    note: "'está trabalhando' maps onto 'is work'; a job title takes the simple present, not the progressive"
  - option: "Him works as a backend developer."
    br_pt_form: "Ele (objeto) trabalha como desenvolvedor back-end."
    note: "'him' is an object pronoun and cannot be the subject of 'works'"
```

**Item:**
> You are writing a teammate's bio for the team README. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "He work as a backend developer." |
| B | "He is work as a backend developer." |
| C | "Him works as a backend developer." |
| D | **"He works as a backend developer."** ✓ |

**Key:** D

**Feedback:**
> A fixed role takes the third-person present with *-s*: **`He works as a backend developer.`** **A** drops the *-s*, **B** puts *is* before the bare verb, and **C** uses the object pronoun *him* as the subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_bio_draft_001
skill: `reading.bio_draft`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "She joined the platform team in 2022."
    br_pt_form: "Ela entrou no time de plataforma em 2022."
    note: "a past joining date, not an action for new colleagues"
  - option: "She graduated in Computer Science in 2019."
    br_pt_form: "Ela se formou em Ciência da Computação em 2019."
    note: "a completed study milestone, not a current mentoring role"
  - option: "She writes SQL queries for the payments team."
    br_pt_form: "Ela escreve consultas SQL para o time de pagamentos."
    note: "SQL is listed as a skill, but the draft never assigns her to the payments team"
```

**Stimulus:**
> "Team bio draft — Marina is a data engineer on the platform team. She joined the team in 2022. She graduated in Computer Science in 2019. Her skills include SQL and Airflow. She acts as a mentor for new joiners."

**Item:**
> What does Marina do for new colleagues on the team?

| Slot | Value |
|------|-------|
| A | "She joined the platform team in 2022." |
| B | **"She acts as a mentor for new joiners."** ✓ |
| C | "She graduated in Computer Science in 2019." |
| D | "She writes SQL queries for the payments team." |

**Key:** B

**Feedback:**
> The draft states **`She acts as a mentor for new joiners.`** **A** gives a joining date, **C** gives a graduation year, and **D** invents a team assignment that the draft never mentions.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_bio_role_words_001
skill: `vocab.bio_role`
type: `contextual_selection`
difficulty_b: 0.0
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "She specializes em cloud data pipelines."
    br_pt_form: "Ela se especializa em pipelines de dados em nuvem."
    note: "'em' is the Portuguese preposition copied into English; the verb takes 'in'"
  - option: "She is specialist in cloud data pipelines."
    br_pt_form: "Ela é especialista em pipelines de dados em nuvem."
    note: "'specialist' is a noun; after 'is' it needs an article, or use the verb 'specializes'"
  - option: "She has specialization in cloud data pipelines."
    br_pt_form: "Ela tem especialização em pipelines de dados em nuvem."
    note: "'has specialization' is a calque of 'tem especialização'; the natural verb is 'specializes in'"
```

**Item:**
> Which line states a specialization the natural en-US way in a bio?

| Slot | Value |
|------|-------|
| A | "She specializes em cloud data pipelines." |
| B | "She is specialist in cloud data pipelines." |
| C | "She has specialization in cloud data pipelines." |
| D | **"She specializes in cloud data pipelines."** ✓ |

**Key:** D

**Feedback:**
> The verb takes the preposition *in*: **`She specializes in cloud data pipelines.`** **A** keeps the Portuguese *em*, **B** uses a noun without an article after *is*, and **C** calques *tem especialização*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_bio_tense_keys_001
skill: `reading.bio_tense_keys`
type: `detail_identification`
difficulty_b: 0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "She joined the quality team in 2023."
    br_pt_form: "Ela entrou no time de qualidade em 2023."
    note: "past simple with a year; the joining is already complete"
  - option: "She graduated in 2020."
    br_pt_form: "Ela se formou em 2020."
    note: "past simple marking a finished study milestone"
  - option: "I updated Ana's bio draft."
    br_pt_form: "Eu atualizei o rascunho da bio da Ana."
    note: "the -ed form anchors the edit before the note; it is not a plan"
```

**Stimulus:**
> "Profile note — I updated Ana's bio draft. She works as a QA engineer. She joined the quality team in 2023. She graduated in 2020. Tomorrow I will send the final version to the conference page."

**Item:**
> Which action is still in the future when the note is written?

| Slot | Value |
|------|-------|
| A | "She joined the quality team in 2023." |
| B | "She graduated in 2020." |
| C | "I updated Ana's bio draft." |
| D | **"I will send the final version to the conference page."** ✓ |

**Key:** D

**Feedback:**
> *Tomorrow I will send...* is the only future action: **`I will send the final version to the conference page.`** **A** and **B** are completed past milestones, and **C** is a past edit already captured in the note.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_bio_endings_001
skill: `pronunciation.bio_third_person_endings`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_bio_endings_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *work* /wɜːrk/ becomes *works* /wɜːrks/, and *skill* /skɪl/ becomes *skills* /skɪlz/. The final /s/ (after a voiceless sound) or /z/ (after a voiced one) carries the third-person and plural marker. Brazilian readers tend to add a vowel after the consonant, which blurs the ending. In *specializes* /ˈspeʃəlaɪz/, the *c* before *i* is /ʃ/, not /s/.
**Step 2 — produce (ASR-scored):** read aloud:

> "She works as a QA engineer and specializes in SQL. Her skills include Airflow."

**Target phonemes:** /s/ in *works* · /ʃ/ in *specializes* · /z/ in *skills* · /ð/ in *the* (if inserted before a role).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_bio_prereq_svo_001
skill: `grammar.svo_order`
type: `error_correction`
difficulty_b: -0.5
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a2_writing_svo
distractors:
  - option: "At the company works as a data engineer."
    br_pt_form: "Na empresa trabalha como engenheira de dados."
    note: "the Portuguese fronted locative is copied; English needs the subject before the verb"
  - option: "Works as a data engineer at the company."
    br_pt_form: "Trabalha como engenheira de dados na empresa."
    note: "Portuguese drops the subject; the English finite clause has no subject"
  - option: "At the company she work as a data engineer."
    br_pt_form: "Na empresa ela trabalha como engenheira de dados."
    note: "the subject is present but the third-person -s is lost"
```

**Item:**
> Reviewing SVO order before you write a bio line, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "At the company works as a data engineer." |
| B | "Works as a data engineer at the company." |
| C | "At the company she work as a data engineer." |
| D | **"She works as a data engineer at the company."** ✓ |

**Key:** D

**Feedback:**
> The subject comes first and the verb agrees: **`She works as a data engineer at the company.`** **A** and **B** carry the Portuguese dropped subject or fronted locative into English, and **C** keeps the subject but drops the third-person *-s*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_bio_prereq_chunks_001
skill: `vocab.writing_svo_chunks`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_writing_svo
distractors:
  - option: "She has 4 years of experience. She has Python skills."
    br_pt_form: "Ela tem 4 anos de experiência. Ela tem habilidades em Python."
    note: "two 'has' clauses make the bio heavy; 'with...' compresses the same facts"
  - option: "She is formed in Computer Science."
    br_pt_form: "Ela é formada em Ciência da Computação."
    note: "'formed' means assembled; the verb for a degree is 'graduated'"
  - option: "She responsible for the data team."
    br_pt_form: "Ela responsável pelo time de dados."
    note: "the copula is missing; Portuguese allows 'ela responsável', English needs 'is'"
```

**Item:**
> Reviewing the writing chunks from the previous lesson, which line is natural en-US for a bio?

| Slot | Value |
|------|-------|
| A | "She has 4 years of experience. She has Python skills." |
| B | "She is formed in Computer Science." |
| C | "She responsible for the data team." |
| D | **"With 4 years of experience, she specializes in Python."** ✓ |

**Key:** D

**Feedback:**
> The *with* chunk plus *specializes in* is concise and idiomatic: **`With 4 years of experience, she specializes in Python.`** **A** repeats *has*, **B** uses *formed* for a degree, and **C** omits the copula *is*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `third_person_bio_repair` | Item 1 missed | **L2** | Rebuild *He works...* against *He work*, *He is work* and *Him works* in one-line role sentences. |
| `bio_detail_reading` | Items 2 and 4 missed | **L2** | Separate current role, completed milestone and future plan in a short team bio note. |
| `bio_chunks_svo_review` | Items 3, 6 and 7 missed | **L2** | Drill *specializes in*, *graduated in*, *with ... years* and subject-before-verb against *em*, *is formed*, repeated *has* and fronted locatives. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_writing_svo` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.
5. Every `item_id` carries the distinctive `bio` stem, so no generic id is reused from another pack.
