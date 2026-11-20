# Practice Pack — `les_b1_it_debugging`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_it_debugging_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_it_debugging.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_debugging_v1
lesson_id: les_b1_it_debugging
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
item_id: grm_debugging_relative_that_001
skill: `grammar.debugging_relative_clause_that`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "The commit what introduced the regression was reverted."
    br_pt_form: "O commit que introduziu a regressão foi revertido."
    note: "'what' already contains its antecedent and cannot follow the noun 'commit'"
  - option: "The commit who introduced the regression was reverted."
    br_pt_form: "O commit quem introduziu a regressão foi revertido."
    note: "'who' refers to people; a commit is a thing and takes 'that'"
  - option: "The commit introduced the regression was reverted."
    br_pt_form: "O commit introduziu a regressão foi revertido."
    note: "without a relative pronoun the sentence has two verbs competing for one subject"
```

**Item:**
> You are writing the incident note. Which sentence uses a defining relative clause correctly?

| Slot | Value |
|------|-------|
| A | "The commit what introduced the regression was reverted." |
| B | **"The commit that introduced the regression was reverted."** ✓ |
| C | "The commit who introduced the regression was reverted." |
| D | "The commit introduced the regression was reverted." |

**Key:** B

**Feedback:**
> **`The commit that introduced the regression was reverted.`** In **A**, *what* already carries its own antecedent and cannot follow *the commit*; **C** uses *who* for a thing; **D** leaves the noun and the verb *introduced* without a linking pronoun.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_debugging_incident_report_001
skill: `reading.debugging_incident_report_scan`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Enabled a workaround at 14:20."
    br_pt_form: "Habilitou uma solução temporária às 14:20."
    note: "the workaround is the response to the failure, not the first diagnostic action"
  - option: "Deployed the hotfix at 15:10."
    br_pt_form: "Implantou a correção urgente às 15:10."
    note: "the hotfix comes last in the note, well after the failure was reproduced"
  - option: "Closed the incident note."
    br_pt_form: "Fechou o registro do incidente."
    note: "closing the note is never mentioned in the stimulus"
```

**Stimulus:**
> "Incident note — Checkout 500s. The engineer reproduced the failure with a coupon code. The first failing log line appeared at 14:07. The stack trace pointed to the coupon service. A workaround was enabled at 14:20; the hotfix was deployed at 15:10."

**Item:**
> What did the engineer do **first**, according to the note?

| Slot | Value |
|------|-------|
| A | "Enabled a workaround at 14:20." |
| B | **"Reproduced the failure with a coupon code."** ✓ |
| C | "Deployed the hotfix at 15:10." |
| D | "Closed the incident note." |

**Key:** B

**Feedback:**
> The note opens with **`reproduced the failure with a coupon code`**, before the 14:07 log line. **A** and **C** are later remediation steps; **D** is not in the note at all.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_debugging_stack_trace_001
skill: `vocab.it_computer_terms.debugging_report`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "The list of commits in the release."
    br_pt_form: "A lista de commits da release."
    note: "that is the release history, not the record of the failing calls"
  - option: "The number of requests per second."
    br_pt_form: "O número de requisições por segundo."
    note: "a request rate is a metric, not a sequence of calls leading to an error"
  - option: "The file where logs are stored."
    br_pt_form: "O arquivo onde os logs ficam salvos."
    note: "that describes a log destination, not the call chain printed at the error"
```

**Item:**
> A teammate says: "The **stack trace** points to the coupon service." What does *stack trace* mean here?

| Slot | Value |
|------|-------|
| A | "The list of commits in the release." |
| B | **"The sequence of calls that led to the error."** ✓ |
| C | "The number of requests per second." |
| D | "The file where logs are stored." |

**Key:** B

**Feedback:**
> A **`stack trace`** is the sequence of calls that led to the error, which is why it *points to* a service. **A** is release history, **C** is a throughput metric, and **D** is where a log file lives.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_debugging_log_detail_001
skill: `reading.debugging_log_detail`
type: `detail_identification`
difficulty_b: 0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "14:07:01 INFO checkout request accepted."
    br_pt_form: "Às 14:07:01 INFO requisição de checkout aceita."
    note: "an accepted request is normal traffic, not a sign of trouble"
  - option: "14:07:03 ERROR NullReferenceException in CouponService.GetDiscount."
    br_pt_form: "Às 14:07:03 ERROR NullReferenceException em CouponService.GetDiscount."
    note: "this is the error itself, but the first sign of trouble is the earlier warning"
  - option: "14:07:05 DEBUG cache hit."
    br_pt_form: "Às 14:07:05 DEBUG cache acertado."
    note: "this line is not present in the stimulus at all"
```

**Stimulus:**
> "14:07:01 INFO checkout request accepted  
> 14:07:02 WARN coupon lookup returned empty  
> 14:07:03 ERROR NullReferenceException in CouponService.GetDiscount"

**Item:**
> Which log line is the **first sign of trouble**?

| Slot | Value |
|------|-------|
| A | "14:07:01 INFO checkout request accepted." |
| B | **"14:07:02 WARN coupon lookup returned empty."** ✓ |
| C | "14:07:03 ERROR NullReferenceException in CouponService.GetDiscount." |
| D | "14:07:05 DEBUG cache hit." |

**Key:** B

**Feedback:**
> **`14:07:02 WARN coupon lookup returned empty`** is the earliest abnormal line. **A** is normal traffic, **C** is the later error that follows the warning, and **D** does not exist in the log excerpt.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_debugging_term_stress_001
skill: `pronunciation.debugging_term_stress`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_debugging_term_stress_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *reproduce* /ˌriːprəˈduːs/ carries the stress on the last syllable, while *reproduction* /ˌriːprəˈdʌkʃən/ shifts it to the third. *Stack trace* /ˈstæk treɪs/ is two words with a final /s/ in each; *workaround* /ˈwɜːrkəraʊnd/ starts stressed and *hotfix* /ˌhɑːtˈfɪks/ ends stressed.

**Step 2 — produce (ASR-scored):** read aloud:

> "I can reproduce the bug; the stack trace points to the hotfix."

**Target phonemes:** /ˌriːprəˈduːs/ in *reproduce* · /ˈstæk treɪs/ in *stack trace* · /ˈwɜːrkəraʊnd/ in *workaround* · /ˌhɑːtˈfɪks/ in *hotfix*, releasing the final /ks/ cluster without adding a vowel.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_debugging_trace_head_001
skill: `grammar.compound_head_agreement`
type: `error_correction`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "The stack trace show the failing call."
    br_pt_form: "O stack trace mostrar a chamada que falhou."
    note: "a singular head noun cannot take the base verb in present simple"
  - option: "The stack traces shows the failing call."
    br_pt_form: "Os stack traces mostra a chamada que falhou."
    note: "the -s ending belongs to a singular head, not to a plural one"
  - option: "The stack trace are showing the failing call."
    br_pt_form: "O stack trace estão mostrando a chamada que falhou."
    note: "the progressive with 'are' disagrees with the singular subject and changes the aspect"
```

**Item:**
> Reviewing noun compounds before an incident call, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The stack trace show the failing call." |
| B | "The stack traces shows the failing call." |
| C | **"The stack trace shows the failing call."** ✓ |
| D | "The stack trace are showing the failing call." |

**Key:** C

**Feedback:**
> The head noun is the singular **`trace`**, so the verb takes *-s*: **`The stack trace shows the failing call.`** **A** drops *-s* from a singular head, **B** adds *-s* to a plural head, and **D** pairs a singular subject with *are*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_debugging_gloss_pattern_001
skill: `vocab.gloss_pattern_that_is`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "A breakpoint is a marker what pauses execution."
    br_pt_form: "Um breakpoint é um marcador o qual pausa a execução."
    note: "'what' cannot introduce a relative clause after the noun 'marker'"
  - option: "A breakpoint is pauses execution."
    br_pt_form: "Um breakpoint é pausa a execução."
    note: "the gloss needs a noun phrase after 'is', not a bare verb"
  - option: "A breakpoint means pause execution."
    br_pt_form: "Um breakpoint significa pausar a execução."
    note: "'means' changes the definition into a translation and drops the 'that' gloss pattern"
```

**Item:**
> Which gloss defines **breakpoint** with the *is a … that …* pattern from the IT basics lesson?

| Slot | Value |
|------|-------|
| A | "A breakpoint is a marker what pauses execution." |
| B | **"A breakpoint is a marker that pauses execution."** ✓ |
| C | "A breakpoint is pauses execution." |
| D | "A breakpoint means pause execution." |

**Key:** B

**Feedback:**
> **`A breakpoint is a marker that pauses execution.`** follows the taught gloss pattern: *is a* + noun + *that* + verb. **A** uses *what* after a noun, **C** has no noun phrase after *is*, and **D** abandons the pattern for a loose paraphrase.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `debugging_relative_that` | Item 1 or 6 missed | **L2** | Contrast *the commit that introduced the bug* with *what*, *who* and the missing pronoun in short incident sentences. |
| `incident_detail_scan` | Items 2 or 4 missed | **L2** | Skim the incident note for the first action and scan the log excerpt for the first WARN before the ERROR. |
| `debugging_term_mapping` | Item 3 or 7 missed | **L2** | Recycle *stack trace*, *root cause*, *workaround* and *hotfix* inside *X is a … that …* glosses. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_it_terms_basics` and carry `prereq_lesson` for the interleaving rule.
4. Items 2 and 4 use distinct detail targets (order of actions in the incident note versus the first warning in the log), so neither can be answered from the other's stimulus.
5. Item 1 tests the defining relative clause taught in the lesson, while item 7 recycles the earlier gloss pattern; both use *that*, but they score different skills.
6. All debugging terms, definitions, dialogues and distractors were authored for this pack; no external source text is reproduced or adapted.
