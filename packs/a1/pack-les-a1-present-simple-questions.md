# Practice Pack — `les_a1_present_simple_questions`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_present_simple_questions_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_present_simple_questions.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_present_simple_questions_v1
lesson_id: les_a1_present_simple_questions
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
item_id: `grm_do_does_select_001`
skill: `grammar.do_does_auxiliary`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Does the deploy runs on Friday?"
    br_pt_form: "O deploy roda na sexta-feira?"
    note: "the auxiliary does already carries the third person marker; the main verb must stay in the base form (run)"
  - option: "Do the deploy runs on Friday?"
    br_pt_form: "O deploy roda na sexta-feira?"
    note: "the subject is third person singular, so the auxiliary must be does, not do"
  - option: "Does the deploy to run on Friday?"
    br_pt_form: "O deploy para rodar na sexta-feira?"
    note: "the base verb follows the auxiliary directly; the infinitive with to is not used in this pattern"
```

**Item:**
> In a distributed team, you want to confirm the release schedule. Choose the correct question.

| Slot | Value |
|------|-------|
| A | "Does the deploy runs on Friday?" |
| B | "Do the deploy runs on Friday?" |
| C | **"Does the deploy run on Friday?"** ✓ |
| D | "Does the deploy to run on Friday?" |

**Key:** C

**Feedback:**
> The subject is singular (**the deploy**), so the auxiliary is **`does`** and the main verb stays in the base form (`run`). **A** wrongly keeps the verb ending after the auxiliary, **B** uses the wrong auxiliary for a singular subject, and **D** adds an infinitive that this pattern does not take.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_do_does_short_answer_002`
skill: `vocab.do_does_short_answers`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "Yes, I check."
    br_pt_form: "Sim, eu verifico."
    note: "copies the main verb instead of the auxiliary; the natural short answer repeats do"
  - option: "Yes, I am."
    br_pt_form: "Sim, eu sou/estou."
    note: "uses the verb to be as the auxiliary; this question is built with do"
  - option: "Yes, you do."
    br_pt_form: "Sim, você faz."
    note: "switches the person; the answer keeps the first person of the question (I)"
```

**Item:**
> Your teammate asks: "Do you check the logs every morning?" Answer naturally for yourself with a yes.

| Slot | Value |
|------|-------|
| A | "Yes, I check." |
| B | **"Yes, I do."** ✓ |
| C | "Yes, I am." |
| D | "Yes, you do." |

**Key:** B

**Feedback:**
> English short answers repeat the auxiliary and keep the person of the question: **`Yes, I do.`** **A** repeats the main verb and sounds incomplete, **C** brings in the verb *to be*, and **D** changes the person to *you*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_do_does_chat_003`
skill: `reading.do_does_message_context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "If the team runs the tests on her laptop."
    br_pt_form: "Se o time roda os testes no laptop dela."
    note: "the laptop detail never appears in the message"
  - option: "If the stand-up starts before the build."
    br_pt_form: "Se o stand-up começa antes do build."
    note: "inverts the time relation asked in the message"
  - option: "If the deploy fails on staging."
    br_pt_form: "Se o deploy falha no staging."
    note: "the message asks about tests on staging, not about a failure"
```

**Stimulus:**
> "Hi team. Quick question about the routine: does the nightly build start before the stand-up? The dashboard shows a green check, but I don't see the email alert. Do the tests run on the staging server too? Thanks, Rafa."

**Item:**
> What does Rafa want to know first?

| Slot | Value |
|------|-------|
| A | "If the team runs the tests on her laptop." |
| B | "If the stand-up starts before the build." |
| C | "If the deploy fails on staging." |
| D | **"If the nightly build starts before the stand-up."** ✓ |

**Key:** D

**Feedback:**
> The message opens with the schedule question: **`does the nightly build start before the stand-up?`**, so **D** states exactly that. The other options add details that are not in the message (**A**, **C**) or reverse the order of the comparison (**B**).

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: `rdg_do_does_email_004`
skill: `reading.do_does_email_inference`
type: `detail_identification`
difficulty_b: 0.0
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "He reports the blockers to QA."
    br_pt_form: "Ele reporta os blockers para o QA."
    note: "inverts the roles; the email asks whether the QA engineers report the blockers"
  - option: "He starts work at nine every day."
    br_pt_form: "Ele começa o trabalho às nove todos os dias."
    note: "the email states the opposite: he does not start work at nine"
  - option: "He writes the build notes in São Paulo."
    br_pt_form: "Ele escreve as notas do build em São Paulo."
    note: "he only wants to prepare the build notes; the location detail is not about him"
```

**Stimulus:**
> "Email from Ben (remote developer): 'I don't start work at nine. Does the stand-up run at nine thirty in São Paulo time? If it does, I join from home. Do the QA engineers report the blockers first? I want to prepare the build notes.'"

**Item:**
> What can you infer about Ben from the email?

| Slot | Value |
|------|-------|
| A | **"He works from home and needs the stand-up time."** ✓ |
| B | "He reports the blockers to QA." |
| C | "He starts work at nine every day." |
| D | "He writes the build notes in São Paulo." |

**Key:** A

**Feedback:**
> Ben says **`I join from home`** and asks **`Does the stand-up run at nine thirty`**, which shows he works remotely and needs the meeting time. **B** reverses the roles, **C** contradicts his first sentence, and **D** turns a preparation goal into an action he already does.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: `grm_present_simple_review_005`
skill: `grammar.present_simple_questions`
type: `error_correction`
difficulty_b: -0.1
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "Works she on the API team?"
    br_pt_form: "Trabalha ela no time da API?"
    note: "copies the Portuguese question order; English needs the auxiliary does before the subject"
  - option: "Does she works on the API team?"
    br_pt_form: "Ela trabalha no time da API?"
    note: "the main verb loses the -s after the auxiliary; the base form work is required"
  - option: "Do she work on the API team?"
    br_pt_form: "Ela trabalha no time da API?"
    note: "the pronoun she is third person singular, so the auxiliary is does, not do"
```

**Item:**
> Review from present simple: rewrite "She works on the API team." as a correct question.

| Slot | Value |
|------|-------|
| A | "Works she on the API team?" |
| B | "Does she works on the API team?" |
| C | **"Does she work on the API team?"** ✓ |
| D | "Do she work on the API team?" |

**Key:** C

**Feedback:**
> The statement has a third person singular subject, so the question uses **`does` + subject + base verb**: **`Does she work on the API team?`** **A** keeps Portuguese word order, and **B** and **D** each break one rule: the base form after the auxiliary and the choice of auxiliary for *she*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_present_routine_review_006`
skill: `vocab.present_routine_verbs`
type: `error_correction`
difficulty_b: 0.1
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "Do you deploys every Friday?"
    br_pt_form: "Você faz deploy toda sexta?"
    note: "after the auxiliary do the verb keeps the base form; there is no -s ending"
  - option: "Do you deploying every Friday?"
    br_pt_form: "Você faz deploy toda sexta (com -ing)?"
    note: "the -ing form is not used after do in this question pattern"
  - option: "Do you to deploy every Friday?"
    br_pt_form: "Você faz para deploy toda sexta?"
    note: "the infinitive with to does not follow the auxiliary do"
```

**Item:**
> Review from present simple: choose the question that correctly asks about a weekly routine.

| Slot | Value |
|------|-------|
| A | **"Do you deploy every Friday?"** ✓ |
| B | "Do you deploys every Friday?" |
| C | "Do you deploying every Friday?" |
| D | "Do you to deploy every Friday?" |

**Key:** A

**Feedback:**
> After **`do`**, the main verb stays in the base form (**deploy**), so **A** is the correct question. **B** adds a third person ending to a verb governed by *do*, **C** uses the -ing form, and **D** inserts an infinitive with *to* that does not belong here.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_do_does_vowel_007`
skill: `pronunciation.aux_vowel_contrast`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** the auxiliaries carry different vowels in connected speech: *does* uses a short central vowel (as in *cup*), while *do* uses a rounded vowel (as in *two*, but shorter). In fast questions *do* also weakens before *you*.
**Step 2 — produce (ASR-scored):** read aloud:

> "Do you run the tests, and does the build start at noon?"

**Target phonemes:** rounded /u/ in *do* · short central vowel in *does* · clear final /t/ in *don't*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `do_does_aux_choice` | Item 1 missed | **L2** | Contrast *do* vs *does* with singular and plural subjects in release questions. |
| `short_answer_pattern` | Item 2 missed | **L2** | Drill *Yes, I do / No, I don't / Yes, she does* with routine questions. |
| `base_form_after_aux` | Item 5 missed | **L2** | Rebuild the rule: after *do/does* the main verb stays in the base form (no -s, no -ing, no *to*). |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.