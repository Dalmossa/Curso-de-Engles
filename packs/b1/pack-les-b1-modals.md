# Practice Pack — `les_b1_modals`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_modals_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_modals.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_modals_v1
lesson_id: les_b1_modals
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
item_id: grm_modals_hedging_001
skill: `grammar.modal_hedging`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "I suggest to wait for the rollback to finish."
    br_pt_form: "Eu sugiro esperar o rollback terminar."
    note: "'suggest' does not take a to-infinitive; use a that-clause or a gerund"
  - option: "I would suggest to wait for the rollback to finish."
    br_pt_form: "Eu sugeriria esperar o rollback terminar."
    note: "'would suggest' keeps the soft tone but still rejects the to-infinitive complement"
  - option: "I am suggest we wait for the rollback to finish."
    br_pt_form: "Eu estou sugerindo que esperemos o rollback terminar."
    note: "'suggest' does not take the progressive here; 'I'd suggest we wait' is the natural form"
```

**Item:**
> You are commenting on a release in a code review. Which line softens the recommendation without breaking its structure?

| Slot | Value |
|------|-------|
| A | "I suggest to wait for the rollback to finish." |
| B | **"I'd suggest we wait for the rollback to finish."** ✓ |
| C | "I would suggest to wait for the rollback to finish." |
| D | "I am suggest we wait for the rollback to finish." |

**Key:** B

**Feedback:**
> A hedge still needs a correct verb pattern: **`I'd suggest we wait for the rollback to finish.`** **A** uses the invalid *suggest to wait*, **C** keeps the same invalid complement after *would suggest*, and **D** adds a progressive that this verb does not take in the recommendation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_modals_request_email_001
skill: `reading.modals_request_email`
type: `detail_identification`
difficulty_b: -0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Reviewing the retry limit before Friday."
    br_pt_form: "Revisar o limite de retentativa antes de sexta."
    note: "'could you' makes this a polite request, not a rule"
  - option: "Adding a note to the RFC."
    br_pt_form: "Adicionar uma nota ao RFC."
    note: "'would you mind' is a softened request, not a hard requirement"
  - option: "Keeping the feature flag off until the error rate drops."
    br_pt_form: "Manter a flag de funcionalidade desligada até a taxa de erro cair."
    note: "'I'd suggest' frames this as a recommendation the team can discuss"
```

**Stimulus:**
> "Hi team — Could you review the retry limit before Friday? Would you mind adding a note to the RFC? We might need to roll back if the error rate stays above two percent. I'd suggest keeping the feature flag off until then. Please don't ship without the index — that one is a must."

**Item:**
> Which action is presented as a hard requirement rather than as a request or a suggestion?

| Slot | Value |
|------|-------|
| A | Reviewing the retry limit before Friday. |
| B | **Adding the index before shipping.** ✓ |
| C | Adding a note to the RFC. |
| D | Keeping the feature flag off until the error rate drops. |

**Key:** B

**Feedback:**
> The last line marks the non-negotiable action: **`Please don't ship without the index — that one is a must.`** **A** is a *could* request, **C** is a *would you mind* request, and **D** is an *I'd suggest* recommendation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_modals_hedging_001
skill: `vocab.modals_hedging`
type: `contextual_selection`
difficulty_b: 0.15
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "in my view, it is mandatory"
    br_pt_form: "na minha visão, é obrigatório"
    note: "a personal frame plus 'mandatory' strengthens the claim instead of softening it"
  - option: "it is obvious that"
    br_pt_form: "é óbvio que"
    note: "this asserts certainty and can sound dismissive in a technical review"
  - option: "you must immediately"
    br_pt_form: "você deve imediatamente"
    note: "'must' with 'immediately' is an order, the opposite of a hedge"
```

**Item:**
> Which phrase softens a recommendation in a code review without removing the action?

| Slot | Value |
|------|-------|
| A | in my view, it is mandatory |
| B | **I would suggest** ✓ |
| C | it is obvious that |
| D | you must immediately |

**Key:** B

**Feedback:**
> **`I would suggest`** is the hedge: it marks the statement as a recommendation while keeping the action clear. **A** combines opinion with a mandatory rule, **C** claims certainty, and **D** gives an order.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_modals_policy_note_001
skill: `reading.modals_policy_note`
type: `detail_identification`
difficulty_b: 0.05
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Acknowledging the page within five minutes."
    br_pt_form: "Confirmar o page em até cinco minutos."
    note: "'must' states a fixed duty, not a permission with a condition"
  - option: "Escalating when the dashboard is stale."
    br_pt_form: "Escalonar quando o painel estiver desatualizado."
    note: "'might need to' expresses a possibility, not permission granted by the note"
  - option: "Posting an update every fifteen minutes."
    br_pt_form: "Publicar uma atualização a cada quinze minutos."
    note: "'should' is a recommendation and carries no permission condition"
```

**Stimulus:**
> "On-call note: You must acknowledge a SEV-2 page within five minutes. You should post an update every fifteen minutes. You may hand off to the secondary if you are already in another incident — check with the commander first. You might need to escalate if the dashboard is stale."

**Item:**
> Which action is permitted, but only after checking with the commander?

| Slot | Value |
|------|-------|
| A | Acknowledging the page within five minutes. |
| B | Escalating when the dashboard is stale. |
| C | **Handing off to the secondary after checking.** ✓ |
| D | Posting an update every fifteen minutes. |

**Key:** C

**Feedback:**
> The permission line is **`You may hand off to the secondary... — check with the commander first.`** **A** is a *must* duty, **B** is a *might need to* possibility, and **D** is a *should* recommendation — none of them is conditional permission.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_modals_weak_forms_001
skill: `pronunciation.modals_weak_forms`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *could* /kʊd/, *would* /wʊd/ and *should* /ʃʊd/ share the short /ʊ/ — Brazilian learners often lengthen it to /uː/ or swap /w/ for /v/ in *would*. The final /d/ is a light tap, without the epenthetic vowel of "could-e". *might* /maɪt/ carries the full /aɪ/ diphthong and ends in /t/, while *need* /niːd/ has the long, tense /iː/.

**Step 2 — produce (ASR-scored):** read aloud:

> "Could you review the retry limit? I would suggest we wait; we might need to roll back."

**Target phonemes:** /k/ in *could* · /w/ in *would*, not /v/ · /ʃ/ in *should* · /ʊ/ in *could, would, should* · /aɪ/ in *might* · /iː/ in *need* · final /d/ and /t/ without epenthetic /ɪ/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_modals_can_need_bare_001
skill: `grammar.modal_can_need_bare_verb`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a2_modals_can_need
distractors:
  - option: "We can to review the log, and we need to add the index before Friday."
    br_pt_form: "Podemos para revisar o log, e precisamos adicionar o índice antes de sexta."
    note: "'can' is followed by the bare verb; 'to review' is L1 transfer"
  - option: "We can review the log, and we need add the index before Friday."
    br_pt_form: "Podemos revisar o log, e precisamos acrescentar o índice antes de sexta."
    note: "'need' as a main verb requires 'to' before the next verb"
  - option: "She can reviews the log, and we need to add the index before Friday."
    br_pt_form: "Ela pode revisa o log, e precisamos adicionar o índice antes de sexta."
    note: "a modal never takes the third-person -s ending"
```

**Item:**
> Reviewing modals and *need*: which line keeps both verb patterns correct?

| Slot | Value |
|------|-------|
| A | "We can to review the log, and we need to add the index before Friday." |
| B | **"We can review the log, and we need to add the index before Friday."** ✓ |
| C | "We can review the log, and we need add the index before Friday." |
| D | "She can reviews the log, and we need to add the index before Friday." |

**Key:** B

**Feedback:**
> The two patterns differ: **`We can review the log, and we need to add the index before Friday.`** **A** inserts *to* after *can*, **C** drops the *to* required by *need*, and **D** adds *-s* to the verb after a modal.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_modals_can_need_001
skill: `vocab.modals_can_need`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_modals_can_need
distractors:
  - option: "This could be a race condition."
    br_pt_form: "Isso pode ser uma condição de corrida."
    note: "'could' here hedges a guess; it is not the core ability sense"
  - option: "We might need a second reviewer."
    br_pt_form: "Podemos precisar de um segundo revisor."
    note: "'might need' is possibility plus soft obligation, not a plain ability statement"
  - option: "Can I have the ticket ID, please?"
    br_pt_form: "Posso ter o ID do ticket, por favor?"
    note: "this 'can' asks permission; the target is ability, not a request"
```

**Item:**
> Reviewing core modals: which sentence uses *can* in its ability sense, rather than as a hedge or a request?

| Slot | Value |
|------|-------|
| A | This could be a race condition. |
| B | **She can debug the payment service without help.** ✓ |
| C | We might need a second reviewer. |
| D | Can I have the ticket ID, please? |

**Key:** B

**Feedback:**
> **`She can debug the payment service without help.`** states ability. **A** uses *could* to hedge a diagnosis, **C** combines *might* with *need*, and **D** uses *can* to ask permission — three different functions of the same family.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `hedge_structure_drill` | Item 1 missed | **L2** | Contrast *suggest to wait / would suggest to wait / I'd suggest we wait* in short release comments with a named action. |
| `request_vs_rule_reading` | Items 2 and 4 missed | **L2** | Label each line of a team note as *could request / would you mind request / I'd suggest / must / may + condition*, then answer one detail question per label. |
| `modal_core_review` | Items 3, 6 and 7 missed | **L2** | Recycle *can / need to / could / might / must* in one on-call handoff, separating bare-verb modals from `need to` and from hedged guesses. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_modals_can_need` and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced. The modals named here are grammar terms, with all examples and explanations written for this pack.
