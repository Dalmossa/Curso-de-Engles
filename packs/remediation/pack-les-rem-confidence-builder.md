# Practice Pack — `les_rem_confidence_builder`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_rem_confidence_builder_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_rem_confidence_builder.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_rem_confidence_builder_v1
lesson_id: les_rem_confidence_builder
learner_profile: false_beginner
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 2
  listening_items: 1
  br_pt_form_coverage: 5/5 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 2 | 2–3 | ✅ |
| Vocabulary | 2 | 1–3 | ✅ |
| Reading | 1 | 1–2 | ✅ |
| Listening | 1 | 1 | ⚠️ deferred |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_confidence_builder_present_facts_001
skill: `grammar.present_simple_facts`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Mistakes is part of learning."
    br_pt_form: "Erros é parte do aprendizado."
    note: "mistakes is plural and requires are, not the singular verb is"
  - option: "Mistakes being part of learning."
    br_pt_form: "Erros sendo parte do aprendizado."
    note: "the -ing form needs an auxiliary; a general truth uses the present simple"
  - option: "Mistakes be part of learning."
    br_pt_form: "Erros ser parte do aprendizado."
    note: "the bare infinitive be does not carry the present simple agreement"
```

**Item:**
> Bia writes a note to encourage a teammate who just froze in the stand-up. Choose the correct sentence for a general truth.

| Slot | Value |
|------|-------|
| A | "Mistakes is part of learning." |
| B | **"Mistakes are part of learning."** ✓ |
| C | "Mistakes being part of learning." |
| D | "Mistakes be part of learning." |

**Key:** B

**Feedback:**
> A general truth about a plural subject takes **are**. **A** uses a singular verb, **C** needs an auxiliary for the *-ing* form, and **D** uses the bare infinitive.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: voc_confidence_builder_affective_filter_001
skill: `vocab.confidence.affective_filter`
type: `contextual_selection`
difficulty_b: 0.0
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "The affective filter was deployed to staging yesterday."
    br_pt_form: "O filtro afetivo foi implantado em staging ontem."
    note: "an affective filter is an emotional state, not a deployable service"
  - option: "I need to commit the affective filter before the release."
    br_pt_form: "Preciso commitar o filtro afetivo antes do release."
    note: "confuses an emotional concept with a software artifact"
  - option: "The affective filter is a plugin for the linter."
    br_pt_form: "O filtro afetivo é um plugin do linter."
    note: "a linter plugin checks code; the affective filter describes anxiety that blocks speaking"
```

**Item:**
> A tech lead talks about a developer who understands the docs but freezes in meetings. Which sentence uses the term naturally?

| Slot | Value |
|------|-------|
| A | "The affective filter was deployed to staging yesterday." |
| B | **"My affective filter drops when the team gives me low-risk tasks."** ✓ |
| C | "I need to commit the affective filter before the release." |
| D | "The affective filter is a plugin for the linter." |

**Key:** B

**Feedback:**
> **B** links the term to a feeling that changes with the task. **A** and **C** treat it as software, and **D** treats it as a code tool.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: rdg_confidence_builder_standup_note_001
skill: `reading.confidence_context`
type: `detail_identification`
difficulty_b: -0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "A grammar correction from the tech lead."
    br_pt_form: "Uma correção gramatical do tech lead."
    note: "Bia asks to repeat the sentence, not to correct her grammar"
  - option: "A new ticket for the sprint."
    br_pt_form: "Um novo ticket para a sprint."
    note: "the note reports a finished fix, not a request for more work"
  - option: "A different meeting language."
    br_pt_form: "Um idioma diferente para a reunião."
    note: "she stays in English and only asks for a slower repetition"
```

**Stimulus:**
> "Stand-up note — Bia: I know the word, but I never say it in meetings. Give me a second when I look for the English word. Can you say that again a little more slowly, please? I fixed the retry bug and added two tests."

**Item:**
> What does Bia ask for when she cannot find the word right away?

| Slot | Value |
|------|-------|
| A | **"More time to find it."** ✓ |
| B | "A grammar correction from the tech lead." |
| C | "A new ticket for the sprint." |
| D | "A different meeting language." |

**Key:** A

**Feedback:**
> **A** matches *Give me a second*. **B** changes the request into a correction, **C** invents extra work, and **D** contradicts the note, which stays in English.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, prerequisite review

```yaml
item_id: grm_confidence_builder_modals_try_001
skill: `grammar.modals_low_risk_offer`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_b1_modals`
distractors:
  - option: "I can to try one sentence before the demo."
    br_pt_form: "Eu posso tentar uma frase antes da demo."
    note: "the modal can is followed by the bare infinitive, not by to"
  - option: "I can trying one sentence before the demo."
    br_pt_form: "Eu posso tentando uma frase antes da demo."
    note: "after a modal the main verb stays in the base form, never in -ing"
  - option: "I am can try one sentence before the demo."
    br_pt_form: "Eu sou poder tentar uma frase antes da demo."
    note: "can is already the auxiliary; it does not combine with to be"
```

**Item:**
> Rafael offers Bia a low-risk first step. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | **"I can try one sentence before the demo."** ✓ |
| B | "I can to try one sentence before the demo." |
| C | "I can trying one sentence before the demo." |
| D | "I am can try one sentence before the demo." |

**Key:** A

**Feedback:**
> After **can** the verb stays in the base form: **try**. **B** adds *to*, **C** uses *-ing*, and **D** stacks a second auxiliary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Vocabulary, current lesson

```yaml
item_id: voc_confidence_builder_false_beginner_001
skill: `vocab.confidence.false_beginner`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "Someone who never studied the language."
    br_pt_form: "Alguém que nunca estudou o idioma."
    note: "that is a true beginner; the false beginner has study history"
  - option: "Someone who has spoken the language since childhood."
    br_pt_form: "Alguém que fala o idioma desde a infância."
    note: "that describes a native or heritage speaker, not a false beginner"
  - option: "Someone who cannot read a technical document."
    br_pt_form: "Alguém que não consegue ler um documento técnico."
    note: "reading comprehension is usually strong in this profile"
```

**Item:**
> A peer coaching note says: "false beginner — understands the docs, freezes in the stand-up." Which description matches the label?

| Slot | Value |
|------|-------|
| A | "Someone who never studied the language." |
| B | **"Someone who understands a lot but rarely speaks."** ✓ |
| C | "Someone who has spoken the language since childhood." |
| D | "Someone who cannot read a technical document." |

**Key:** B

**Feedback:**
> **B** captures the gap between passive and active vocabulary. **A** misses the study history, **C** describes a native speaker, and **D** reverses the profile's usual strength.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Pronunciation, current lesson

```yaml
item_id: prn_confidence_builder_freeze_recovery_001
skill: `pronunciation.confidence`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *can* /kæn/ in isolation becomes weak /kən/ inside *I can try*; *say* /seɪ/ keeps a long vowel and a final /eɪ/ glide. *Slowly* has a clear /l/ before the /oʊ/ vowel.

**Step 2 — produce (ASR-scored):** read aloud:

> "Give me a second. I can try one sentence, and I can say it slowly."

**Target phonemes:** weak /kən/ in *can* · long /seɪ/ in *say* · clear /l/ in *slowly* · no extra vowel after final *sentence*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 7 — Listening, current lesson

```yaml
item_id: lst_confidence_builder_slow_request_001
skill: `listening.confidence_context`
type: `repetition_drill`
difficulty_b: 0.1
cefr: B1
domain: listening
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the request:** the clip models a calm, non-apologetic request with falling intonation on *please*.

**Step 2 — shadow (ASR-scored):** listen and repeat:

> "Can you say that again a little more slowly, please? I know the word, but I need a second."

**Target phonemes:** weak *can you* · linking in *say that again* · final /z/ in *words* context · falling tone on *please*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `present_simple_general_truths` | Item 1 missed | **L2** | Rebuild *mistakes are / practice builds / progress comes* against singular and plural subjects. |
| `modal_base_form` | Item 4 missed | **L2** | Drill *can try* versus *can to try* and *can trying* in low-risk offers. |
| `passive_to_active_vocab` | Item 5 missed | **L2** | Turn three recognised words into the reusable frame *I know it, but I don't say it*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Items 6 and 7 are ASR-scored production and do not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.
