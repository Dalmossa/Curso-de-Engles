# Practice Pack — `les_rem_pronunciation_th_vw`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_rem_pronunciation_th_vw_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_rem_pronunciation_th_vw.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_rem_pronunciation_th_vw_v1
lesson_id: les_rem_pronunciation_th_vw
learner_profile: pronunciation_remediation
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 6 current / 1 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 1
  br_pt_form_coverage: 5/5 scored items
  speaking_writing_items: 2
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 1 | 2–3 | ⚠️ remediation focus |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 1 | 1 | ✅ |
| Pronunciation | 3 | 1–3 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Pronunciation, current lesson

```yaml
item_id: prn_pronunciation_th_vw_th_voiceless_001
skill: `pronunciation.th_voiceless`
type: `contextual_selection`
difficulty_b: -0.5
cefr: B1
domain: pronunciation
provenance: authored
distractors:
  - option: "I sink the retry count is wrong."
    br_pt_form: "Eu acho que a contagem de retries está errada."
    note: "uses alveolar s instead of the interdental voiceless th"
  - option: "I fink the retry count is wrong."
    br_pt_form: "Eu acho que a contagem de retries está errada."
    note: "replaces the target th with f and changes the articulation point"
  - option: "I tink the retry count is wrong."
    br_pt_form: "Eu acho que a contagem de retries está errada."
    note: "stops the airflow before the teeth instead of letting it pass over the tongue"
```

**Item:**
> A colleague reports a bug in a stand-up. Choose the sentence that carries the intended voiceless TH.

| Slot | Value |
|------|-------|
| A | "I sink the retry count is wrong." |
| B | **"I think the retry count is wrong."** ✓ |
| C | "I fink the retry count is wrong." |
| D | "I tink the retry count is wrong." |

**Key:** B

**Feedback:**
> Only **think** places the tongue at the edge of the teeth with no vibration and no blocked air. **A** substitutes /s/, **C** substitutes /f/, and **D** substitutes /t/.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Pronunciation, current lesson

```yaml
item_id: prn_pronunciation_th_vw_th_voiced_002
skill: `pronunciation.th_voiced`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: pronunciation
provenance: authored
distractors:
  - option: "Dis confirmation came from the data team."
    br_pt_form: "Esta confirmação veio do time de dados."
    note: "uses the alveolar stop d instead of the voiced interdental th"
  - option: "Tis confirmation came from the data team."
    br_pt_form: "Esta confirmação veio do time de dados."
    note: "uses an unvoiced stop before the vowel instead of a voiced fricative"
  - option: "Zis confirmation came from the data team."
    br_pt_form: "Esta confirmação veio do time de dados."
    note: "uses alveolar z which keeps the tongue behind the teeth"
```

**Item:**
> Write a status note in en-US: "esta confirmação veio do time de dados". Choose the natural spelling.

| Slot | Value |
|------|-------|
| A | "Dis confirmation came from the data team." |
| B | **"This confirmation came from the data team."** ✓ |
| C | "Tis confirmation came from the data team." |
| D | "Zis confirmation came from the data team." |

**Key:** B

**Feedback:**
> **This** starts with the voiced interdental /ð/. **A** uses /d/, **C** uses /t/, and **D** uses /z/, all produced behind the teeth.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_pronunciation_th_vw_minimal_pair_003
skill: `vocab.pron.minimal_pair`
type: `minimal_pair_identification`
difficulty_b: -0.3
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "this / dis"
    br_pt_form: "this / dis (TH sonoro contra d)"
    note: "contrasts voiced th with d and belongs to a different drill"
  - option: "very / berry"
    br_pt_form: "very / berry (v contra b)"
    note: "contrasts v with b and does not involve the voiceless th"
  - option: "west / vest"
    br_pt_form: "west / vest (w contra v)"
    note: "contrasts w with v and does not involve the voiceless th"
```

**Item:**
> In which pair is the difference exclusively the voiceless TH against /s/?

| Slot | Value |
|------|-------|
| A | "this / dis" |
| B | **"think / sink"** ✓ |
| C | "very / berry" |
| D | "west / vest" |

**Key:** B

**Feedback:**
> **think / sink** differs only in /θ/ against /s/. **A** drills /ð/ against /d/, **C** drills /v/ against /b/, and **D** drills /w/ against /v/.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, prerequisite review

```yaml
item_id: grm_pronunciation_th_vw_articles_sounds_004
skill: `grammar.articles_sounds`
type: `contextual_selection`
difficulty_b: 0.0
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_a2_writing_svo`
distractors:
  - option: "An TH sound, a V sound, a W sound."
    br_pt_form: "Um som de TH, um som de V, um som de W."
    note: "an is wrong before the consonant sound that starts th"
  - option: "A TH sound, an V sound, a W sound."
    br_pt_form: "Um som de TH, um som de V, um som de W."
    note: "an is wrong before the consonant sound that starts v"
  - option: "A TH sound, a V sound, an W sound."
    br_pt_form: "Um som de TH, um som de V, um som de W."
    note: "an is wrong before the consonant sound that starts w"
```

**Item:**
> A teammate names three sounds in a checklist. Choose the sequence with the correct articles.

| Slot | Value |
|------|-------|
| A | "An TH sound, a V sound, a W sound." |
| B | **"A TH sound, a V sound, a W sound."** ✓ |
| C | "A TH sound, an V sound, a W sound." |
| D | "A TH sound, a V sound, an W sound." |

**Key:** B

**Feedback:**
> The article follows the sound, not the letter. **A** puts *an* before /θ/, **C** before /v/, and **D** before /w/; all three initial sounds are consonants, so *a* is correct.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Vocabulary, current lesson

```yaml
item_id: voc_pronunciation_th_vw_v_sound_005
skill: `vocab.pron.v_sound`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "west"
    br_pt_form: "oeste"
    note: "starts with w which rounds the lips without touching the teeth"
  - option: "berry"
    br_pt_form: "fruta vermelha"
    note: "starts with b which closes both lips instead of using the teeth"
  - option: "wine"
    br_pt_form: "vinho"
    note: "starts with w so it lacks the labiodental friction of v"
```

**Item:**
> Which word begins with the voiced labiodental /v/ rather than /w/ or /b/?

| Slot | Value |
|------|-------|
| A | "west" |
| B | **"very"** ✓ |
| C | "berry" |
| D | "wine" |

**Key:** B

**Feedback:**
> **very** begins with /v/, made with the lower lip against the upper teeth and with vibration. **A** and **D** begin with /w/, while **C** begins with /b/.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Pronunciation, current lesson

```yaml
item_id: prn_pronunciation_th_vw_w_sound_006
skill: `pronunciation.w_sound`
type: `minimal_pair_production`
difficulty_b: -0.3
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *west* /west/ rounds the lips without any contact, while *vest* /vest/ puts the lower lip against the upper teeth and vibrates.
**Step 2 — produce (ASR-scored):** read aloud:

> "We will review the west cluster before the very long voice test."

**Target phonemes:** /w/ in *we* and *west* · /v/ in *very* and *voice* · no /b/ closure on *west*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 7 — Listening, prerequisite review

```yaml
item_id: lst_pronunciation_th_vw_context_007
skill: `listening.pronunciation_context`
type: `discrimination_production`
difficulty_b: -0.1
cefr: B1
domain: listening
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
prereq_lesson: `les_a2_stress_timing`
```

**Step 1 — hear the contrast:** the model packs /θ/ into *think, third, thread* and /ð/ into *the*, while the content words carry the stress of the sentence.
**Step 2 — produce (ASR-scored):** read aloud:

> "I think the third thread is thin, but this vendor note is very clear."

**Target phonemes:** /θ/ in *think, third, thread, thin* · /ð/ in *the, this* · /v/ in *vendor, very* · stress on *THIRD, THREAD, VENDOR, CLEAR*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `th_voiceless_s_f_confusion` | Item 1 missed | **L2** | Rebuild *think/sink* and *three/free* with a mirror check of the tongue at the teeth. |
| `th_voiced_d_z_confusion` | Item 2 missed | **L2** | Rebuild *this/dis* and *that/dat* with voiced interdental hold. |
| `v_w_labiodental_confusion` | Item 5 or 6 missed | **L2** | Rebuild *very/berry* and *west/vest* separating lip contact from lip rounding. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Items 6 and 7 are ASR-scored production and do not substitute for listening-pool calibration while the clips are blocked on render.
3. Items target authored lesson content; no external source text is reproduced.
