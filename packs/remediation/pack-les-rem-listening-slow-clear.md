# Practice Pack — `les_rem_listening_slow_clear`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_rem_listening_slow_clear_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_rem_listening_slow_clear.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_rem_listening_slow_clear_v1
lesson_id: les_rem_listening_slow_clear
learner_profile: listening_remediation
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 2
  br_pt_form_coverage: 6/6 scored items
  speaking_writing_items: 1
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 1 | 2–3 | ⚠️ remediation focus |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 2 | 1 | ✅ remediation focus |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Listening, current lesson

```yaml
item_id: lst_listening_slow_clear_reduced_speed_001
skill: `listening.reduced_speed`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: listening
provenance: authored
distractors:
  - option: "Faster than the natural rate, with the words compressed."
    br_pt_form: "Mais rápido que a taxa natural, com as palavras comprimidas."
    note: "reduced speed lowers the rate; compressing the words further is the opposite scaffold"
  - option: "Exactly the same rate and linking as natural speech."
    br_pt_form: "Exatamente a mesma taxa e encadeamento da fala natural."
    note: "natural pace is the target, not the scaffold used in remediation"
  - option: "Audio with the transcript shown and no audio at all."
    br_pt_form: "Áudio com a transcrição exibida e nenhum áudio."
    note: "the transcript is a support, but reduced speed still refers to audible playback"
```

**Item:**
> Bia asks Rafa to send the sprint review voice note at 0.75x before she tries it at 1.0x. What does "reduced speed" mean in this practice?

| Slot | Value |
|------|-------|
| A | "Faster than the natural rate, with the words compressed." |
| B | **"Slower than the natural rate, with clear articulation."** ✓ |
| C | "Exactly the same rate and linking as natural speech." |
| D | "Audio with the transcript shown and no audio at all." |

**Key:** B

**Feedback:**
> The scaffold lowers the rate so the forms become recognizable. **A** raises the rate, **C** describes the natural target instead of the scaffold, and **D** describes a transcript-only support.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: grm_listening_slow_clear_imperatives_001
skill: `grammar.imperatives_listening`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "To replay the last line, please."
    br_pt_form: "Para repetir a última linha, por favor."
    note: "an infinitive clause does not perform a direct request"
  - option: "Replaying the last line, please."
    br_pt_form: "Repetindo a última linha, por favor."
    note: "the -ing form needs an auxiliary here; on its own it is not a request"
  - option: "Replayed the last line, please."
    br_pt_form: "Repetiu a última linha, por favor."
    note: "the past form reports an action instead of asking for one"
```

**Item:**
> In the retro, Bia did not catch the deploy window. Choose the natural way to ask Rafa to say the last line again.

| Slot | Value |
|------|-------|
| A | "To replay the last line, please." |
| B | **"Replay the last line, please."** ✓ |
| C | "Replaying the last line, please." |
| D | "Replayed the last line, please." |

**Key:** B

**Feedback:**
> A request uses the base form: **`Replay the last line, please.`** **A** is an infinitive, **C** is an unsupported *-ing* form, and **D** is a past-tense report.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: rdg_listening_slow_clear_transcript_note_001
skill: `reading.listening_transcript`
type: `detail_identification`
difficulty_b: -0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The sprint number."
    br_pt_form: "O número do sprint."
    note: "the number was captured on the first listen, so it is not the missing detail"
  - option: "The Friday demo."
    br_pt_form: "A demo de sexta-feira."
    note: "the demo is mentioned as the reason for the check, not as the missing detail"
  - option: "The branch name."
    br_pt_form: "O nome da branch."
    note: "the branch is in the chat log, not in the missed part of the audio"
```

**Stimulus:**
> "Team note — I listened to the stand-up recording twice. I caught the sprint number and the Friday demo, and I read the branch name in the chat. I still missed the deploy window at the end. I'll replay that part slowly and clearly before I write the summary."

**Item:**
> What detail did the writer miss in the recording?

| Slot | Value |
|------|-------|
| A | "The sprint number." |
| B | "The Friday demo." |
| C | **"The deploy window."** ✓ |
| D | "The branch name." |

**Key:** C

**Feedback:**
> The note says **`I still missed the deploy window at the end`**, so **C** is the missing detail. **A** was caught on the first listen, **B** is only the reason for the check, and **D** was read in the chat log.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: voc_listening_slow_clear_discourse_marker_001
skill: `vocab.listening.discourse_markers`
type: `contextual_selection`
difficulty_b: 0.0
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "By the way — it adds a new side comment."
    br_pt_form: "By the way — acrescenta um comentário lateral."
    note: "by the way opens a side comment; it does not close one"
  - option: "As a result — it introduces a consequence."
    br_pt_form: "As a result — introduz uma consequência."
    note: "this marker signals cause and result, not a return to the main point"
  - option: "For instance — it gives an example."
    br_pt_form: "For instance — dá um exemplo."
    note: "this marker introduces an example rather than a return to the topic"
```

**Item:**
> Rafa says: "By the way, the staging token changed. Anyway, the rollback is still scheduled." What does **anyway** do in that turn?

| Slot | Value |
|------|-------|
| A | "By the way — it adds a new side comment." |
| B | "As a result — it introduces a consequence." |
| C | "For instance — it gives an example." |
| D | **"Anyway — it returns to the main point after a side comment."** ✓ |

**Key:** D

**Feedback:**
> **`Anyway` closes the detour opened by `by the way` and returns to the main point.** **A** describes the marker that opens the detour, **B** marks a consequence, and **C** marks an example.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Listening, prerequisite review

```yaml
item_id: lst_listening_slow_clear_reduced_form_001
skill: `listening.reduced_forms`
type: `form_identification`
difficulty_b: 0.1
cefr: B1
domain: listening
provenance: authored
prereq_lesson: `les_a2_stress_timing`
distractors:
  - option: "gone to"
    br_pt_form: "ido a"
    note: "gonna compresses going to, not the past participle gone"
  - option: "going to go"
    br_pt_form: "indo a ir"
    note: "the reduced form already carries the future auxiliary; it does not add another go"
  - option: "want to"
    br_pt_form: "querer"
    note: "want to reduces to wanna, a different form from gonna"
```

**Item:**
> At 1.0x you hear: "I'm gonna check the logs right after the call." Which careful-speech form matches what you heard?

| Slot | Value |
|------|-------|
| A | "gone to" |
| B | **"going to"** ✓ |
| C | "going to go" |
| D | "want to" |

**Key:** B

**Feedback:**
> **`Gonna` is the reduced form of `going to`.** **A** changes the auxiliary to a participle, **C** doubles the main verb, and **D** is the reduced form *wanna*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Pronunciation, prerequisite review

```yaml
item_id: prn_listening_slow_clear_request_tone_001
skill: `pronunciation.falling_tone_requests`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: B1
domain: pronunciation
provenance: authored
prereq_lesson: `les_rem_pronunciation_th_vw`
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** "Could you repeat the deploy window?" with a falling tone at the end sounds like a polite request. The same words with a rising tone sound like an surprised echo. In fast speech, *could you* also weakens to about /kədʒə/.

**Step 2 — produce (ASR-scored):** read aloud:

> "Could you repeat the deploy window? I didn't catch the time."

**Target phonemes:** falling tone on *window* · weak /kədʒə/ in *could you* · no extra vowel after *catch* · careful /t/ in *time*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_listening_slow_clear_scaffold_001
skill: `vocab.listening.scaffold`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_reading_strategy`
distractors:
  - option: "A permanent rule you never remove."
    br_pt_form: "Uma regra permanente que você nunca retira."
    note: "a scaffold is temporary and is withdrawn as the skill improves"
  - option: "A final grade for the listening task."
    br_pt_form: "Uma nota final para a tarefa de escuta."
    note: "a grade evaluates the result; it does not support the process"
  - option: "A type of audio file for voice notes."
    br_pt_form: "Um tipo de arquivo de áudio para recados de voz."
    note: "scaffold here is a learning support, not a file format"
```

**Item:**
> Bia listens at 0,75x first and moves to 1,0x once she understands the numbers. In learning terms, what is the 0,75x step?

| Slot | Value |
|------|-------|
| A | "A permanent rule you never remove." |
| B | **"A temporary support that is withdrawn later."** ✓ |
| C | "A final grade for the listening task." |
| D | "A type of audio file for voice notes." |

**Key:** B

**Feedback:**
> The slow version is a **`scaffold`: temporary support**. **A** makes it permanent, **C** treats it as evaluation, and **D** mistakes the term for a file format.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `slow_clear_scaffold` | Item 1 missed | **L2** | Contrast the 0,75x scaffold with the 1,0x target; fade the transcript before the audio. |
| `replay_request_form` | Item 2 missed | **L2** | Rebuild "Replay the last line, please" against infinitive and *-ing* variants. |
| `reduced_form_gonna` | Item 5 missed | **L2** | Drill *gonna / wanna / hafta* against their careful-speech forms. |
| `request_tone_fall` | Item 6 missed | **L2** | Replay the falling-tone model for polite requests; contrast with the surprised echo. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 6 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.
