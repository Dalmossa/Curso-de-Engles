# Practice Pack — `les_b2_culture_brazil_vs_usa`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_culture_brazil_vs_usa_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_culture_brazil_vs_usa.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_culture_brazil_vs_usa_v1
lesson_id: les_b2_culture_brazil_vs_usa
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
item_id: grm_culture_brazil_vs_usa_comparative_001
skill: `grammar.cultural_comparatives`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "Brazilian meetings tend to be more long than US ones."
    br_pt_form: "As reuniões brasileiras tendem a ser mais longas que as americanas."
    note: "the comparative of 'long' is 'longer', not 'more long'"
  - option: "US meetings are most structured than Brazilian ones."
    br_pt_form: "As reuniões nos EUA são mais estruturadas que as brasileiras."
    note: "'most' belongs to superlatives; a comparison of two groups takes 'more'"
  - option: "Building trust takes more longer in Brazil than in the US."
    br_pt_form: "Construir confiança leva mais tempo no Brasil do que nos EUA."
    note: "'more longer' doubles the comparative marker"
```

**Item:**
> You are comparing two teams in a recap. Which comparison is grammatical?

| Slot | Value |
|------|-------|
| A | "Brazilian meetings tend to be more long than US ones." |
| B | **"US feedback is often more direct than Brazilian feedback."** ✓ |
| C | "US meetings are most structured than Brazilian ones." |
| D | "Building trust takes more longer in Brazil than in the US." |

**Key:** B

**Feedback:**
> **`US feedback is often more direct than Brazilian feedback.`** is the only form with a single comparative marker and a clear *than*. **A** needs *longer*, **C** uses the superlative *most* for a two-way comparison, and **D** stacks *more* on top of *longer*. These are communication tendencies, not claims about every person on either team.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_culture_brazil_vs_usa_expectation_001
skill: `reading.culture_dialogue`
type: `detail_identification`
difficulty_b: -0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The work is already scheduled for tomorrow."
    br_pt_form: "O trabalho já está agendado para amanhã."
    note: "Ana says the opposite, the work is not scheduled yet"
  - option: "The problem was escalated to HR."
    br_pt_form: "O problema foi escalado para o RH."
    note: "HR appears only in the PTO aside, never in the incident"
  - option: "She wants Mike to revisit the SLA."
    br_pt_form: "Ela quer que Mike revise o SLA."
    note: "Mike states the SLA; Ana does not ask for a revision"
```

**Stimulus:**
> "Ana: In my team, 'vamos ver' often means we need to check with the lead first — not that the work is already scheduled. I should say that out loud. Mike: That helps. Our SLA for a P1 incident is thirty minutes, and I need a status by EOD."

**Item:**
> What does Ana mean by "vamos ver" in her team?

| Slot | Value |
|------|-------|
| A | The work is already scheduled for tomorrow. |
| B | **She needs to check with the lead before confirming.** ✓ |
| C | The problem was escalated to HR. |
| D | She wants Mike to revisit the SLA. |

**Key:** B

**Feedback:**
> Ana makes the expectation explicit: **`we need to check with the lead first`**. **A** is the reading she rejects, **C** imports an HR escalation that never happens, and **D** turns Mike's SLA statement into a request.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_culture_brazil_vs_usa_acronym_001
skill: `vocab.acronyms_corporate`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "ETA"
    br_pt_form: "previsão de chegada"
    note: "an ETA says when the fix arrives, not what the response-time commitment is"
  - option: "WIP"
    br_pt_form: "trabalho em andamento"
    note: "WIP counts started tasks; it does not set a response deadline"
  - option: "PTO"
    br_pt_form: "ausência remunerada"
    note: "PTO is an HR term for time off, not a service commitment"
```

**Item:**
> The incident needs a response within thirty minutes. Which acronym names that commitment?

| Slot | Value |
|------|-------|
| A | ETA |
| B | WIP |
| C | **SLA** ✓ |
| D | PTO |

**Key:** C

**Feedback:**
> **`SLA`** (*service level agreement*) is the agreed response-time commitment. **A** (*ETA*) answers "when?", **B** (*WIP*) is a count of started work, and **D** (*PTO*) is time off. The definitions are authored, not copied from a source list.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_culture_brazil_vs_usa_followup_001
skill: `reading.culture_followup`
type: `inference`
difficulty_b: 0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "Escalate the incident to HR."
    br_pt_form: "Escalar o incidente para o RH."
    note: "the update explicitly says there is no need to escalate to HR"
  - option: "Cancel the recap until Monday."
    br_pt_form: "Cancelar o resumo até segunda-feira."
    note: "the sender moves the ETA, not the recap, which is still due"
  - option: "Take PTO starting today."
    br_pt_form: "Começar as férias remuneradas hoje."
    note: "PTO starts Monday and belongs to the sender, not to the reader"
```

**Stimulus:**
> "Update 16:10 — The fix missed the window. I'll send a new ETA by 17:00. I'm on PTO Monday, so CC the product owner on the recap. No need to escalate to HR."

**Item:**
> What action does the sender ask for?

| Slot | Value |
|------|-------|
| A | Escalate the incident to HR. |
| B | Cancel the recap until Monday. |
| C | **CC the product owner on the recap.** ✓ |
| D | Take PTO starting today. |

**Key:** C

**Feedback:**
> The request is explicit: **`CC the product owner on the recap`**. **A** contradicts *no need to escalate to HR*, **B** invents a cancellation, and **D** mixes the sender's Monday PTO with a reader action.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_culture_brazil_vs_usa_acronym_vowels_001
skill: `pronunciation.acronym_vowels`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *SLA* is read letter by letter, /es el eɪ/ — the last letter is the glide /eɪ/, not the pt-BR /e/ of *eta*. *ETA* is /iː tiː eɪ/, with a long first /iː/. *PTO* ends in /oʊ/: /piː tiː oʊ/. In *thirty*, /θ/ is voiceless; in *the*, /ð/ is voiced at the same place of articulation.

**Step 2 — produce (ASR-scored):** read aloud:

> "The SLA is thirty minutes; I'll send the ETA by EOD. I'm on PTO Monday."

**Target phonemes:** /eɪ/ in *SLA* and *ETA* · /iː/ in *ETA* · /oʊ/ in *PTO* · /θ/ in *thirty* · /ð/ in *the* · /k/ final in *block* without epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_culture_brazil_vs_usa_hedging_001
skill: `grammar.hedged_directness`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: les_b2_register_nuance
distractors:
  - option: "This is wrong. Fix it."
    br_pt_form: "Isso está errado. Conserte."
    note: "an imperative with no hedge attacks the deliverable and the person"
  - option: "Maybe we could possibly revisit it sometime?"
    br_pt_form: "Talvez a gente pudesse possivelmente rever isso qualquer hora?"
    note: "three hedges remove the request and the deadline"
  - option: "I give you a feedback about your deliverable."
    br_pt_form: "Eu te dou um feedback sobre seu entregável."
    note: "'feedback' is uncountable in en-US, so 'a feedback' is ungrammatical"
```

**Item:**
> Reviewing register: which line is direct without being blunt?

| Slot | Value |
|------|-------|
| A | "This is wrong. Fix it." |
| B | "Maybe we could possibly revisit it sometime?" |
| C | **"I'd like to share some feedback on the deliverable; two things to adjust."** ✓ |
| D | "I give you a feedback about your deliverable." |

**Key:** C

**Feedback:**
> The line keeps a hedge (*I'd like to*) and still names the deliverable and the next step: **`I'd like to share some feedback on the deliverable; two things to adjust.`** **A** is blunt, **B** hides the request behind stacked hedges, and **D** uses the uncountable noun with an article.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_culture_brazil_vs_usa_facesaving_001
skill: `vocab.culture_face_saving`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: les_b2_register_nuance
distractors:
  - option: "You failed the review."
    br_pt_form: "Você falhou na revisão."
    note: "a personal verdict exposes the person instead of the handoff gap"
  - option: "We will see."
    br_pt_form: "Nós veremos."
    note: "an empty future leaves the problem unnamed"
  - option: "It's nothing, don't worry about it."
    br_pt_form: "Não é nada, não se preocupe."
    note: "minimizing hides the gap the client will notice"
```

**Item:**
> Reviewing register: which phrase names the problem and still preserves rapport?

| Slot | Value |
|------|-------|
| A | "You failed the review." |
| B | **"There's a gap in the handoff; let's fix it together before the client sees it."** ✓ |
| C | "We will see." |
| D | "It's nothing, don't worry about it." |

**Key:** B

**Feedback:**
> **`There's a gap in the handoff; let's fix it together before the client sees it.`** names the issue, assigns a shared next step and avoids a personal verdict. **A** blames the person, **C** says nothing actionable, and **D** minimizes a real gap.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `cultural_comparative_forms` | Item 1 missed | **L2** | Contrast *more direct / longer / more structured*; drill the single comparative marker in short cross-team updates, with a caveat that tendencies vary by person and team. |
| `acronym_response_time` | Items 3 and 4 missed | **L2** | Recycle *SLA / ETA / EOD / ASAP / PTO / CC* in a five-line follow-up; separate the response-time promise from the delivery time. |
| `directness_register` | Items 2, 5, 6 and 7 missed | **L3** | Rework one meeting recap twice — a blunt version and a hedged version — then choose the one that names the gap and keeps rapport. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b2_register_nuance` (`email_register`, `hedging`) and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room. The acronyms are unprotected abbreviations with original definitions and examples; cultural differences are framed as communication trends with explicit caveats, never as national character judgements.
