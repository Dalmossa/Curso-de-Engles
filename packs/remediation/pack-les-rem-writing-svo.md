# Practice Pack — `les_rem_writing_svo`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_rem_writing_svo_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_rem_writing_svo.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_rem_writing_svo_v1
lesson_id: les_rem_writing_svo
learner_profile: writing_remediation
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 7 current / 0 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 1
  br_pt_form_coverage: 5/5 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 3 | 2–3 | ✅ |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 1 | 1 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_writing_svo_canonical_order_001
skill: `grammar.svo_order`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Coffee she reviews before the demo."
    br_pt_form: "O café ela revisa antes da demo."
    note: "in neutral English the object does not move before the subject and verb"
  - option: "Reviews she the coffee before the demo."
    br_pt_form: "Revisa ela o café antes da demo."
    note: "the verb cannot precede the subject in a declarative sentence"
  - option: "She the coffee reviews before the demo."
    br_pt_form: "Ela o café revisa antes da demo."
    note: "the object cannot sit between the subject and the verb"
```

**Item:**
> A teammate summarizes a release note during a call. Choose the sentence in canonical SVO order.

| Slot | Value |
|------|-------|
| A | "Coffee she reviews before the demo." |
| B | **"She reviews the coffee before the demo."** ✓ |
| C | "Reviews she the coffee before the demo." |
| D | "She the coffee reviews before the demo." |

**Key:** B

**Feedback:**
> **B** keeps the subject, then the verb, then the object. **A** fronts the object as Portuguese sometimes allows, **C** puts the verb before the subject, and **D** splits the subject from its verb.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: grm_writing_svo_explicit_subject_001
skill: `grammar.svo_order`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Works here on the integration branch."
    br_pt_form: "Trabalha aqui na branch de integração."
    note: "Portuguese can drop the subject, but English needs an explicit one"
  - option: "On the integration branch works here."
    br_pt_form: "Na branch de integração trabalha aqui."
    note: "a fronted place phrase cannot replace the subject in this pattern"
  - option: "Works on the integration branch here."
    br_pt_form: "Trabalha na branch de integração aqui."
    note: "moving the adverbial does not supply the missing subject"
```

**Item:**
> You describe your own routine in a stand-up note. Which sentence has the required explicit subject?

| Slot | Value |
|------|-------|
| A | "Works here on the integration branch." |
| B | "On the integration branch works here." |
| C | "Works on the integration branch here." |
| D | **"I work here on the integration branch."** ✓ |

**Key:** D

**Feedback:**
> **D** names the subject **I** before the verb. **A** and **C** omit the subject because Portuguese allows it, and **B** promotes the place phrase but still leaves no subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Grammar, current lesson

```yaml
item_id: grm_writing_svo_adverb_position_001
skill: `grammar.svo_order`
type: `contextual_selection`
difficulty_b: -0.1
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "We ship usually the fix on Friday."
    br_pt_form: "A gente envia geralmente a correção na sexta."
    note: "with a single main verb the frequency adverb goes before that verb"
  - option: "Usually we the fix ship on Friday."
    br_pt_form: "Geralmente a gente a correção envia na sexta."
    note: "the object still has to follow the verb even after a fronted adverb"
  - option: "We ship the fix usually on Friday."
    br_pt_form: "A gente envia a correção geralmente na sexta."
    note: "the adverb does not belong after the object in this pattern"
```

**Item:**
> A QA engineer writes the deployment note. Choose the natural placement of the frequency adverb.

| Slot | Value |
|------|-------|
| A | "We ship usually the fix on Friday." |
| B | **"We usually ship the fix on Friday."** ✓ |
| C | "Usually we the fix ship on Friday." |
| D | "We ship the fix usually on Friday." |

**Key:** B

**Feedback:**
> **B** puts *usually* before the main verb *ship* and keeps SVO intact. **A** and **D** misplace the adverb, while **C** breaks the subject–verb–object sequence after the fronted adverb.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: voc_writing_svo_explicit_subject_001
skill: `vocab.writing.explicit_subject`
type: `term_meaning_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "Leaving the subject out when the context is clear."
    br_pt_form: "Deixar o sujeito de fora quando o contexto está claro."
    note: "that is the Portuguese habit this remediation corrects"
  - option: "Using only proper nouns as the subject."
    br_pt_form: "Usar apenas nomes próprios como sujeito."
    note: "pronouns such as I, we and they are subjects too"
  - option: "Replacing the subject with an adverb."
    br_pt_form: "Substituir o sujeito por um advérbio."
    note: "an adverb modifies the verb and cannot fill the subject slot"
```

**Item:**
> In the remediation notes, what does **explicit subject** mean?

| Slot | Value |
|------|-------|
| A | "Leaving the subject out when the context is clear." |
| B | "Using only proper nouns as the subject." |
| C | **"Naming the subject in every finite clause."** ✓ |
| D | "Replacing the subject with an adverb." |

**Key:** C

**Feedback:**
> **C** is the definition used here: the writer names who acts. **A** describes the L1 interference, **B** wrongly excludes pronouns, and **D** confuses an adverb with a subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Vocabulary, current lesson

```yaml
item_id: voc_writing_svo_word_order_001
skill: `vocab.writing.word_order`
type: `term_meaning_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "VOS order with a fronted object."
    br_pt_form: "Ordem VOS com objeto deslocado para o início."
    note: "that label does not describe She reviews the copy"
  - option: "A fragment with no main verb."
    br_pt_form: "Um fragmento sem verbo principal."
    note: "reviews is the main verb, so the clause is complete"
  - option: "A run-on with two subjects."
    br_pt_form: "Uma frase corrida com dois sujeitos."
    note: "there is one subject and no second clause glued on"
```

**Item:**
> Which label matches the sentence **She reviews the copy**?

| Slot | Value |
|------|-------|
| A | "VOS order with a fronted object." |
| B | **"SVO order with a subject before the verb."** ✓ |
| C | "A fragment with no main verb." |
| D | "A run-on with two subjects." |

**Key:** B

**Feedback:**
> **B** is correct: *She* is the subject, *reviews* the verb and *the copy* the object. **A** invents a fronted object, **C** ignores the verb that is present, and **D** mistakes one clause for two.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Pronunciation, current lesson

```yaml
item_id: prn_writing_svo_chunking_001
skill: `pronunciation.writing`
type: `shadow_reading`
difficulty_b: -0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_writing_svo_chunking_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the chunking:** *I review the pull request* is one breath group. The function words *I* and *the* are weak; the content words *review*, *pull* and *request* carry the beats.

**Step 2 — produce (ASR-scored):** read aloud:

> "I review the pull request before the stand-up and I usually leave a short comment."

**Target phonemes:** weak /aɪ/ in *I* · linked *review the* · reduced *usually* before *leave* · falling tone on *comment*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 7 — Listening, current lesson

```yaml
item_id: lst_writing_svo_note_gist_001
skill: `listening.writing_context`
type: `audio_gist_production`
difficulty_b: 0.0
cefr: B1
domain: listening
provenance: authored
asr_scored: true
clip: clips/practice/lst_writing_svo_note_gist_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the note:** a short recorded stand-up update says who checks the copy, when the fix ships and how many issues remain in the summary.

**Step 2 — produce (ASR-scored):** give a one-sentence gist beginning with an explicit subject and following SVO.

> Target shape: "She checks the copy, we ship the fix and there are two issues in the summary."

**Target phonemes:** weak opening subject · linked subject–verb boundary · falling tone at the end of the gist.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `svo_canonical_order` | Item 1 missed | **L2** | Rebuild subject–verb–object with release-note vocabulary. |
| `explicit_subject_drill` | Item 2 missed | **L2** | Contrast Portuguese subject drop with English *I work here*. |
| `frequency_adverb_slot` | Item 3 missed | **L2** | Drill *usually ship* against *ship usually* with a single main verb. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Items 6 and 7 are ASR-scored production and do not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.
