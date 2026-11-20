# Practice Pack — `les_a2_feedback_praise`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_feedback_praise_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_feedback_praise.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_feedback_praise_v1
lesson_id: les_a2_feedback_praise
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
item_id: grm_feedback_sorry_for_ing_001
skill: `grammar.feedback_sorry_for_ing`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "I'm sorry for push the branch late."
    br_pt_form: "Desculpe por empurrar o branch atrasado."
    note: "the Portuguese infinitive after 'por' is carried into English; 'sorry for' takes the -ing form"
  - option: "I'm sorry by pushing the branch late."
    br_pt_form: "Desculpe ao empurrar o branch atrasado."
    note: "the Portuguese 'ao + infinitive' construction maps onto 'by + -ing'; English uses 'for' to name the reason"
  - option: "I'm sorry that pushing the branch late."
    br_pt_form: "Desculpe que empurrei o branch atrasado."
    note: "the Portuguese complementiser 'que' gets inserted before the clause; English needs 'for + -ing' or a finite 'that I pushed'"
```

**Item:**
> You pushed a branch after the agreed time. Choose the natural apology to your tech lead.

| Slot | Value |
|------|-------|
| A | "I'm sorry for push the branch late." |
| B | **"I'm sorry for pushing the branch late."** ✓ |
| C | "I'm sorry by pushing the branch late." |
| D | "I'm sorry that pushing the branch late." |

**Key:** B

**Feedback:**
> After **`sorry for`** the verb takes the **-ing** form: **`I'm sorry for pushing the branch late.`** **A** copies the Portuguese infinitive, **C** replaces *for* with the agent preposition *by*, and **D** inserts a complementiser that this pattern does not take.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_feedback_review_note_001
skill: `reading.feedback_review_note`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The loading state."
    br_pt_form: "O estado de carregamento."
    note: "the note says the loading state is to be fixed, not removed; Brazilian readers collapse 'fix' and 'remove' in a short note"
  - option: "The currency bug."
    br_pt_form: "O bug de moeda."
    note: "the bug is praised as a good catch, so it is salient, but the note asks for no action on it"
  - option: "The test run."
    br_pt_form: "A execução dos testes."
    note: "the tests will be re-run after lunch; the future marker gets lost and the noun reads as a completed action"
```

**Stimulus:**
> "Review note — Leo: Thanks for the clear comments on the checkout component. Good catch on the currency bug. One thing to fix before the demo: the loading state. Also, please remove the TODO in line 42. I'll re-run the tests after lunch."

**Item:**
> What does Leo ask the developer to remove?

| Slot | Value |
|------|-------|
| A | "The loading state." |
| B | "The currency bug." |
| C | **"The TODO in line 42."** ✓ |
| D | "The test run." |

**Key:** C

**Feedback:**
> The direct instruction is **`please remove the TODO in line 42`**. **A** is the thing to fix, **B** is praised rather than removed, and **D** is a later action by the writer of the note.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_feedback_praise_chunks_001
skill: `vocab.feedback_praise_chunks`
type: `contextual_selection`
difficulty_b: 0.0
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Congratulations for your find."
    br_pt_form: "Parabéns pela sua descoberta."
    note: "calque of 'parabéns por'; congratulations marks a milestone, not a specific find in a code review"
  - option: "Very good you found it."
    br_pt_form: "Muito bom você ter achado."
    note: "word-for-word rendering of 'muito bom você...'; the English praise chunk needs a noun phrase"
  - option: "Good job of find the bug."
    br_pt_form: "Bom trabalho de achar o bug."
    note: "Portuguese 'de + infinitive' becomes 'of find'; the fixed chunk takes 'on + noun'"
```

**Item:**
> A colleague found a bug you missed in the checkout flow. Which phrase praises that specific find naturally?

| Slot | Value |
|------|-------|
| A | "Congratulations for your find." |
| B | "Very good you found it." |
| C | "Good job of find the bug." |
| D | **"Good catch on the bug."** ✓ |

**Key:** D

**Feedback:**
> The settled chunk for a specific find is **`Good catch on`**: **`Good catch on the bug.`** **A** uses a milestone celebration, **B** is a calque, and **C** mistranslates *de achar*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_feedback_apology_001
skill: `reading.feedback_apology_context`
type: `detail_identification`
difficulty_b: 0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "She pushed the branch after four."
    br_pt_form: "Ela empurrou o branch depois das quatro."
    note: "the late push is the thing she apologises for, not a remedy; the first past-sounding clause attracts Brazilian readers"
  - option: "She re-ran the tests."
    br_pt_form: "Ela rodou os testes de novo."
    note: "'I'll re-run' is still future; the Portuguese habit of dropping the future marker turns it into a done action"
  - option: "She closed the demo."
    br_pt_form: "Ela fechou a demonstração."
    note: "the demo is a deadline in the note, not an action; a salient noun gets over-read as a completed step"
```

**Stimulus:**
> "Channel note — Bia: I'm sorry for pushing the branch after four. I missed the loading state, and I left a TODO in line 42. I've removed it now and I'll re-run the tests before the demo. Thanks for owning the review, Leo."

**Item:**
> What has Bia already done when she writes the note?

| Slot | Value |
|------|-------|
| A | "She pushed the branch after four." |
| B | **"She removed the TODO."** ✓ |
| C | "She re-ran the tests." |
| D | "She closed the demo." |

**Key:** B

**Feedback:**
> The present-perfect line **`I've removed it now`** marks the completed action; *it* refers back to the TODO. **A** is the apology, **C** is still future, and **D** turns a deadline into a finished task.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_feedback_dental_001
skill: `pronunciation.feedback_dental_fricatives`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_feedback_dental_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *thanks* /θæŋks/ opens with the voiceless dental /θ/ — tongue between the teeth, no voice — which Brazilian Portuguese tends to turn into /s/. *the* /ðə/ uses the voiced dental /ð/, often replaced by /d/ in pt-BR. The contrast is the tongue position, not the vowel.
**Step 2 — produce (ASR-scored):** read aloud:

> "Thanks for the review, and I appreciate your help with the fix."

**Target phonemes:** /θ/ in *thanks* · /ð/ in *the* · /r/ in *review, appreciate* · /l/ in *help*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_feedback_review_habit_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "The reviewer is comment on every pull request."
    br_pt_form: "O revisor está comentando em todo pull request."
    note: "Portuguese 'está comentando' maps onto 'is comment'; a recurring habit takes the simple present"
  - option: "The reviewer comment on every pull request."
    br_pt_form: "O revisor comenta em todo pull request."
    note: "Portuguese has no third-person -s ending, so the English verb marker disappears"
  - option: "The reviewer commenting on every pull request."
    br_pt_form: "O revisor comentando em todo pull request."
    note: "the gerund 'comentando' maps onto -ing, but the -ing form alone is not a finite present"
```

**Item:**
> Reviewing the present simple before you describe a recurring review habit, which sentence is correct?

| Slot | Value |
|------|-------|
| A | **"The reviewer comments on every pull request."** ✓ |
| B | "The reviewer is comment on every pull request." |
| C | "The reviewer comment on every pull request." |
| D | "The reviewer commenting on every pull request." |

**Key:** A

**Feedback:**
> A recurring fact uses the present simple with the third-person **-s**: **`The reviewer comments on every pull request.`** **B** inserts *be* before the bare verb, **C** drops **-s** because Portuguese marks no such ending, and **D** leaves a gerund with no auxiliary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_email_verbs_001
skill: `vocab.email_verbs`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_email_basics`
distractors:
  - option: "Please reply the review note to the QA team."
    br_pt_form: "Por favor, responda a nota de revisão para o time de QA."
    note: "reply answers the original sender; it does not pass a received message to a new recipient"
  - option: "Please attach the review note to the QA team."
    br_pt_form: "Por favor, anexe a nota de revisão no time de QA."
    note: "attach adds a file to a message or ticket, not to a team of people"
  - option: "Please deliver back the review note to the QA team."
    br_pt_form: "Por favor, devolva a nota de revisão para o time de QA."
    note: "'devolver' maps onto 'give back'; returning a thing is not forwarding a message onward"
```

**Item:**
> Reviewing the email basics, you want to send a received review note to the QA team without editing it. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "Please reply the review note to the QA team." |
| B | "Please attach the review note to the QA team." |
| C | **"Please forward the review note to the QA team."** ✓ |
| D | "Please deliver back the review note to the QA team." |

**Key:** C

**Feedback:**
> Passing a received message to someone else is **`forward`**: **`Please forward the review note to the QA team.`** **A** answers the sender, **B** adds a file instead of sharing the message, and **D** means returning rather than forwarding.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `sorry_for_ing_apology` | Item 1 missed | **L2** | Rebuild *I'm sorry for pushing late* against the infinitive, *by* and the inserted *that*. |
| `feedback_praise_chunks` | Item 3 missed | **L2** | Contrast *Good catch on...* with the calques *congratulations for* and *very good you found it*. |
| `present_simple_regular_review` | Item 6 missed | **L2** | Drill the third-person **-s** in recurring review habits such as *the reviewer comments on every pull request*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_email_basics` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.
