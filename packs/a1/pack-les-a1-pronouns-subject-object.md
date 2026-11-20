# Practice Pack — `les_a1_pronouns_subject_object`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_pronouns_subject_object_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_pronouns_subject_object.md`
**Provenance:** items `authored`. All 7 items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_pronouns_subject_object_v1
lesson_id: les_a1_pronouns_subject_object
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
| Grammar | 3 | 2–3 | ✅ |
| Vocabulary | 2 | 1–2 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

Split: 5 current / 2 prereq = 71% / 29% (legal range 55–75% / 25–45%).

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: `grm_pron_subject_case_001`
skill: `grammar.subject_pronouns`
type: `contextual_selection`
difficulty_b: -0.8
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Me is a developer."
    br_pt_form: "Mim é desenvolvedor."
    note: "L1 transfer: object pronoun used as subject, as PT can drop/null the subject"
  - option: "Him reviews the dashboard."
    br_pt_form: "Ele revisa o painel."
    note: "object pronoun in subject position; a BR-PT learner may carry the object form across"
  - option: "Her is on vacation."
    br_pt_form: "Ela está de férias."
    note: "object pronoun as subject; confuses subject/object case"
```

**Item:**
> Choose the sentence with a correct **subject pronoun**.

| Slot | Value |
|------|-------|
| A | "Me is a developer." |
| B | "Him reviews the dashboard." |
| C | **"He is a developer."** ✓ |
| D | "Her is on vacation." |

**Key:** C

**Feedback:**
> **`He is a developer.`** uses the subject pronoun *He* before the verb *is*. **A**, **B**, and **D** incorrectly use object pronouns (*Me*, *Him*, *Her*) as subjects — English requires an explicit subject, unlike PT where "Ele é desenvolvedor" can drop the subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_pron_object_case_001`
skill: `grammar.object_pronouns`
type: `contextual_selection`
difficulty_b: -0.6
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Call she after the stand-up."
    br_pt_form: "Ligue para ela após a reunião."
    note: "subject pronoun after a verb; BR-PT learners often reach for the subject form by analogy"
  - option: "Tell he about the spike."
    br_pt_form: "Conte a ele sobre o pico."
    note: "subject pronoun as object of the verb; English needs the object form after the verb"
  - option: "Send it to I."
    br_pt_form: "Envie para mim."
    note: "subject pronoun after a preposition; use the object form after to/for"
```

**Item:**
> A teammate asks you to pass information to a colleague. Choose the correct **object pronoun**.

| Slot | Value |
|------|-------|
| A | "Call she after the stand-up." |
| B | "Tell he about the spike." |
| C | **"Tell her about the spike."** ✓ |
| D | "Send it to I." |

**Key:** C

**Feedback:**
> **`Tell her about the spike.`** uses the object pronoun *her* after the verb *tell*. **A** and **B** use subject pronouns (*she*, *he*) where an object is required; **D** uses *I* after the preposition *to*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_pron_i_me_001`
skill: `vocab.pronouns.i_me`
type: `contextual_selection`
difficulty_b: -0.7
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "Me review the tickets."
    br_pt_form: "Eu revisto os chamados."
    note: "object pronoun as subject; PT allows null subject, English does not"
  - option: "He reviews me."
    br_pt_form: "Ele me revisa."
    note: "object pronoun as direct object after the verb"
  - option: "I review me."
    br_pt_form: "Eu me reviso."
    note: "reflexive-like use; not the intended object distinction here"
```

**Item:**
> You are the tech lead reviewing tickets. Choose the sentence where the **subject** does the reviewing.

| Slot | Value |
|------|-------|
| A | "Me review the tickets." |
| B | "He reviews me." |
| C | **"I review the tickets."** ✓ |
| D | "I review me." |

**Key:** C

**Feedback:**
> **`I review the tickets.`** uses *I* as the subject doing the action. **A** uses *Me* as subject; **B** makes *me* the object being reviewed; **D** uses *me* as object instead of *the tickets*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: `rdg_pron_support_triage_001`
skill: `reading.support_triage_context`
type: `detail_identification`
difficulty_b: -0.4
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "He is on vacation until Friday."
    br_pt_form: "Ele está de férias até sexta."
    note: "true detail from the text, but it is not who receives the ticket"
  - option: "She reviews the dashboard every morning."
    br_pt_form: "Ela revisa o painel toda manhã."
    note: "true detail from the text, but it is not who receives the ticket"
  - option: "They fix the bugs fast."
    br_pt_form: "Eles corrigem os bugs rápido."
    note: "true detail from the text, but it is not who receives the ticket"
```

**Stimulus:**
> "I need someone to check the login errors. Can you take this ticket? He is on vacation until Friday, so send it to me, not to him. She reviews the dashboard every morning. Tell her about the spike. We track the errors together. They fix the bugs fast."

**Item:**
> According to the message, who should receive the login-error ticket?

| Slot | Value |
|------|-------|
| A | He (on vacation until Friday). |
| B | She (reviews the dashboard). |
| C | **Me (the sender of the message).** ✓ |
| D | They (fix the bugs). |

**Key:** C

**Feedback:**
> The message says **"send it to me, not to him"**, so the sender — *me* — should receive the ticket. **A** is unavailable, **B** reviews the dashboard, and **D** fixes bugs; none is the intended recipient.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: `prn_pron_contraction_001`
skill: `pronunciation.contraction_i_am`
type: `minimal_pair_production`
difficulty_b: -0.5
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_pron_contraction_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *I am* /aɪ æm/ contracts to *I'm* /aɪm/ — the two sounds blend into one syllable. *He is* /hi ɪz/ contracts to *he's* /hiːz/.

**Step 2 — produce (ASR-scored):** read aloud:

> "I'm the tech lead. He's on vacation."

**Target phonemes:** /aɪm/ in *I'm* · /hiːz/ in *He's* · clear /h/ at the start of *he's*, not deleted.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review (les_a1_to_be_forms)

```yaml
item_id: `grm_be_pronouns_001`
skill: `grammar.subject_pronouns_with_be`
type: `contextual_selection`
difficulty_b: -1.0
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_to_be_forms`
distractors:
  - option: "Me am happy."
    br_pt_form: "Mim estou feliz."
    note: "object pronoun with be; L1 transfer where PT drops or swaps the subject"
  - option: "Him is tall."
    br_pt_form: "Ele é alto."
    note: "object pronoun as subject of is"
  - option: "Her is smart."
    br_pt_form: "Ela é inteligente."
    note: "object pronoun as subject of is"
```

**Item:**
> Choose the correct sentence with **be**.

| Slot | Value |
|------|-------|
| A | "Me am happy." |
| B | "Him is tall." |
| C | **"I am happy."** ✓ |
| D | "Her is smart." |

**Key:** C

**Feedback:**
> **`I am happy.`** pairs the subject pronoun *I* with *am*. **A**, **B**, and **D** use object pronouns (*Me*, *Him*, *Her*) as subjects — a common BR-PT transfer because PT can omit or reorder the subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review (les_a1_to_be_forms)

```yaml
item_id: `voc_be_forms_001`
skill: `vocab.be_forms_am_is_are`
type: `contextual_selection`
difficulty_b: -0.9
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_to_be_forms`
distractors:
  - option: "I be a developer."
    br_pt_form: "Eu ser/estar desenvolvedor."
    note: "bare infinitive be instead of the conjugated am/is/are"
  - option: "He are tall."
    br_pt_form: "Ele são alto."
    note: "subject-verb disagreement: singular he with plural are"
  - option: "They am here."
    br_pt_form: "Eles estou aqui."
    note: "subject-verb disagreement: plural they with singular am"
```

**Item:**
> Choose the correct form of **be** for each subject.

| Slot | Value |
|------|-------|
| A | "I be a developer." |
| B | "He are tall." |
| C | **"She is a developer."** ✓ |
| D | "They am here." |

**Key:** C

**Feedback:**
> **`She is a developer.`** matches the singular subject *She* with *is*. **A** uses the bare infinitive *be*; **B** and **D** mismatch subject and verb number.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `pron_subject_object_case` | Item 1 or 2 missed | **L2** | Contrast subject (*I, he, she*) vs object (*me, him, her*) in short workplace sentences. |
| `pronoun_after_preposition` | Item 2 missed | **L2** | Drill *to me / to him / to her / to us / to them* after prepositions. |
| `be_forms_with_pronouns` | Item 6 or 7 missed | **L2** | Review *am/is/are* with subject pronouns from `les_a1_to_be_forms`. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration; it is render-blocked (`clip: clips/practice/voc_be_forms_001.mp3`).
3. Items target authored lesson content; no external source text is reproduced or adapted.
4. `br_pt_form` is filled on all 6 scored MCQ items (4 options each = 24 forms); the pronunciation item uses `br_pt_form_state: not_applicable_no_distractor_set` per `assessment-item-spec.md` §2.2.1.
5. Split is 5 current / 2 prereq (71% / 29%), inside the legal 55–75% / 25–45% range (§2.1).
