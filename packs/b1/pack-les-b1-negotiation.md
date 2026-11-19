# Practice Pack — `les_b1_negotiation`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_negotiation_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_negotiation.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_negotiation_v1
lesson_id: les_b1_negotiation
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
item_id: grm_negotiation_conditionals_001
skill: `grammar.negotiation_conditionals`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "If you will lower the rate, we sign by Friday."
    br_pt_form: "Se você vai baixar a taxa, nós assinamos na sexta-feira."
    note: "the if-clause takes the present tense, not a future auxiliary"
  - option: "If you lowered the rate, we will sign by Friday."
    br_pt_form: "Se você baixasse a taxa, nós assinaremos na sexta-feira."
    note: "mixes a remote hypothetical with a will-consequence instead of would"
  - option: "If you lower the rate, we signed by Friday."
    br_pt_form: "Se você baixar a taxa, nós já assinamos na sexta-feira."
    note: "puts the result of an open condition in the past"
```

**Item:**
> Camila wants a firm commitment. Which line is a correct first conditional for the deal?

| Slot | Value |
|------|-------|
| A | **"If you lower the rate, we'll sign by Friday."** ✓ |
| B | "If you will lower the rate, we sign by Friday." |
| C | "If you lowered the rate, we will sign by Friday." |
| D | "If you lower the rate, we signed by Friday." |

**Key:** A

**Feedback:**
> The open condition takes the present in the if-clause and **will** in the result: **`If you lower the rate, we'll sign by Friday.`** **B** puts *will* inside the condition, **C** mixes a past hypothetical with a future result, and **D** reports the result as already finished.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_negotiation_termsheet_001
skill: `reading.negotiation_termsheet`
type: `detail_identification`
difficulty_b: -0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "He will cut the reporting dashboard from the scope."
    br_pt_form: "Ele vai cortar o painel de relatórios do escopo."
    note: "Camila proposes the cut; Daniel does not volunteer it"
  - option: "He will lower the rate for six months."
    br_pt_form: "Ele vai baixar a taxa por seis meses."
    note: "the lower rate comes later, after the scope is agreed"
  - option: "He will move the deadline to the twentieth."
    br_pt_form: "Ele vai mover o prazo para o dia vinte."
    note: "the twentieth is his condition, not the outcome if the fifteenth is kept"
```

**Stimulus:**
> "Camila: We need to agree on scope and the deadline before we talk price. Daniel: Our proposal covers the migration and two weeks of support. Camila: Two weeks is more than we need — could you drop it to one? Daniel: I can do one week if the deadline moves to the twentieth. Otherwise I'd have to walk away from the support part. Camila: Let's keep the deadline on the fifteenth and cut the reporting dashboard from the scope instead."

**Item:**
> According to Daniel, what happens if the deadline stays on the fifteenth?

| Slot | Value |
|------|-------|
| A | He will cut the reporting dashboard from the scope. |
| B | He will lower the rate for six months. |
| C | **He will walk away from the support part.** ✓ |
| D | He will move the deadline to the twentieth. |

**Key:** C

**Feedback:**
> Daniel says **otherwise I'd have to walk away from the support part** — that is his consequence if the fifteenth stands. **A** is Camila's proposed cut, **B** belongs to the later counteroffer, and **D** is the condition he was asking for.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_negotiation_concession_001
skill: `vocab.negotiation_concession`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "counteroffer"
    br_pt_form: "contraproposta"
    note: "a counteroffer answers a proposal; it is not the act of giving something up"
  - option: "leverage"
    br_pt_form: "alavanca"
    note: "leverage is the strength behind a position, not a point surrendered"
  - option: "deadline"
    br_pt_form: "prazo final"
    note: "a deadline is a date, not a move in the negotiation"
```

**Item:**
> Camila gives up the dashboard so that one week of support can stay in the deal. Which word names that move? "That's a real ___."

| Slot | Value |
|------|-------|
| A | counteroffer |
| B | **concession** ✓ |
| C | leverage |
| D | deadline |

**Key:** B

**Feedback:**
> **Concession** is the point you give up: **`That's a real concession.`** **A** names the response to a proposal, **C** names the source of bargaining strength, and **D** names a date.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_negotiation_concession_001
skill: `reading.negotiation_concession`
type: `inference_from_context`
difficulty_b: 0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The support week is extended."
    br_pt_form: "A semana de suporte é estendida."
    note: "one week is the agreed scope; the email offers no extension"
  - option: "The dashboard returns to the scope."
    br_pt_form: "O painel volta a entrar no escopo."
    note: "the dashboard was cut and nothing in the email restores it"
  - option: "The deadline moves to the twentieth."
    br_pt_form: "O prazo passa para o dia vinte."
    note: "the twentieth was rejected earlier; this email talks about signing by Friday"
```

**Stimulus:**
> "Subject: Revised scope — one week of support. Hi Camila, as agreed, the dashboard is out and support runs for one week. I'll send the revised rate today; it holds for six months if we sign by Friday. If the date slips, the rate goes back to the original. — Daniel"

**Item:**
> According to the email, what happens if the signing date slips?

| Slot | Value |
|------|-------|
| A | The support week is extended. |
| B | The dashboard returns to the scope. |
| C | **The rate returns to the original.** ✓ |
| D | The deadline moves to the twentieth. |

**Key:** C

**Feedback:**
> The condition is explicit: **if the date slips, the rate goes back to the original**. **A** invents an extension, **B** reverses the agreed cut, and **D** revives a date that had already been rejected.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_negotiation_dentals_001
skill: `pronunciation.negotiation_dentals_diphthongs`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *we* starts with /w/ — rounded, relaxed lips — while *value* starts with /v/, lower lip against the upper teeth; Brazilian learners often swap the two. In *trade* and *rate*, /eɪ/ is a glide, not the short "ê" of Portuguese. *Twentieth* carries the voiceless /θ/ between the teeth, while *the* uses the voiced /ð/ in the same place. Release the final /t/ of *rate* without adding a vowel.

**Step 2 — produce (ASR-scored):** read aloud:

> "We need to agree on the trade-off. If you lower the rate, I'll sign by the twentieth."

**Target phonemes:** /w/ in *we* (not /v/) · /eɪ/ in *trade* and *rate* · /ð/ voiced in *the* · /θ/ voiceless in *twentieth* · /aɪ/ in *sign* · /t/ final in *rate*, with no epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_negotiation_question_forms_001
skill: `grammar.interrogative_pronouns`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_b1_question_forms
distractors:
  - option: "Could you tell me when is the deadline?"
    br_pt_form: "Você poderia me dizer quando é o prazo?"
    note: "an embedded question uses statement order, not inverted question order"
  - option: "Could you tell me when does the deadline start?"
    br_pt_form: "Você poderia me dizer quando o prazo começa, com 'does'?"
    note: "do-support belongs in a direct question, not after 'tell me'"
  - option: "Could you tell me when the deadline does start?"
    br_pt_form: "Você poderia me dizer quando o prazo faz começar?"
    note: "keeps the auxiliary after the subject inside the embedded question"
```

**Item:**
> Reviewing advanced question forms: which line asks about the deadline politely **inside** a statement?

| Slot | Value |
|------|-------|
| A | "Could you tell me when is the deadline?" |
| B | **"Could you tell me when the deadline is?"** ✓ |
| C | "Could you tell me when does the deadline start?" |
| D | "Could you tell me when the deadline does start?" |

**Key:** B

**Feedback:**
> An embedded question keeps statement order: **`Could you tell me when the deadline is?`** **A** inverts *is*, **C** keeps *do*-support from a direct question, and **D** places the auxiliary after the subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_negotiation_leverage_001
skill: `vocab.reported_time_shift`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_b1_reported_speech
distractors:
  - option: "He said he is available on the twentieth."
    br_pt_form: "Ele disse que está disponível no dia vinte."
    note: "keeps the present tense after a past reporting verb in a past handoff"
  - option: "He said he has been available on the twentieth."
    br_pt_form: "Ele disse que tem estado disponível no dia vinte."
    note: "the present perfect does not backshift and shifts the meaning of the availability"
  - option: "He said he would be available on the twentieth."
    br_pt_form: "Ele disse que estaria disponível no dia vinte."
    note: "turns a statement about availability into a future promise"
```

**Item:**
> Reviewing reported speech: Daniel said on the call, "I am available on the twentieth." Which line reports him correctly in a past handoff?

| Slot | Value |
|------|-------|
| A | "He said he is available on the twentieth." |
| B | **"He said he was available on the twentieth."** ✓ |
| C | "He said he has been available on the twentieth." |
| D | "He said he would be available on the twentieth." |

**Key:** B

**Feedback:**
> With a past reporting verb, **am** backshifts to **was**: **`He said he was available on the twentieth.`** **A** leaves the present untouched, **C** keeps a present perfect, and **D** changes availability into a promise.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `negotiation_first_conditional` | Item 1 missed | **L2** | Contrast *if you lower / if you will lower / if you lowered* in short deal-closing exchanges, keeping the present in the condition and *will* in the result. |
| `negotiation_termsheet_reading` | Items 2 and 4 missed | **L2** | Separate *his condition*, *her concession* and *the conditional penalty* in one revised-scope note; distinguish what was rejected from what was agreed. |
| `negotiation_move_vocabulary` | Items 3, 5 and 7 missed | **L2** | Drill *concession / counteroffer / leverage / walk away* in one rewrite, then rehearse *we / trade / rate / twentieth* aloud without /v/-for-/w/ or epenthetic vowels. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration, and its Gates stay marked accordingly.
3. Items 6 and 7 review `les_b1_question_forms` (`interrogative_pronouns`, `present_simple_do_does`) and `les_b1_reported_speech` (`tense_consistency`), both real ids in §4.3; each carries `prereq_lesson` for the interleaving rule.
4. Items 1–5 target authored lesson content; every stimulus, option, gloss and note is original, with no restricted source text reproduced or adapted.
5. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
6. Every `item_id` carries the distinctive `negotiation` token, is written without backticks, and appears once in the pack; `skill` and `type` keep the backticks required by the pack contract.
7. Within each MCQ, the four options and their glosses stay distinct after stripping `*✓⚠️❌_`, trimming and lowercasing — no pair differs by case alone.
8. Distractors follow the A–D table order with the keyed option removed, so the letter in `**Key:**` always matches the ✓ row.
