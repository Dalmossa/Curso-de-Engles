# Practice Pack — `les_a1_false_cognates`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_false_cognates_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_false_cognates.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_false_cognates_v1
lesson_id: les_a1_false_cognates
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

### ITEM 1 — Vocabulary, current lesson

```yaml
item_id: `voc_cognate_traps_001`
skill: `vocab.cognate_traps.meaning_contrast`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "I pretend to review the PR this afternoon."
    br_pt_form: "Eu finjo revisar o PR esta tarde."
    note: "translates 'pretender' literally, but 'pretend' means to fake an action; for a real plan use 'intend'"
  - option: "I pretend that I review the PR."
    br_pt_form: "Eu finjo que eu reviso o PR."
    note: "'pretend that' also describes faking a situation, not having a real intention"
  - option: "I intend that I can review the PR."
    br_pt_form: "Eu pretendo que eu possa revisar o PR."
    note: "'intend' takes a to-infinitive ('intend to review'), not a 'that' clause in this structure"
```

**Item:**
> You have a real plan to review a pull request this afternoon. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I pretend to review the PR this afternoon." |
| B | **"I intend to review the PR this afternoon."** ✓ |
| C | "I pretend that I review the PR." |
| D | "I intend that I can review the PR." |

**Key:** B

**Feedback:**
> **`I intend to review the PR.`** states a real plan with *intend to* + base verb. **A** and **C** use *pretend*, which means to fake an action or a situation, and **D** uses a *that* clause instead of the to-infinitive.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_cognate_traps_002`
skill: `vocab.cognate_traps.lexical_contrast`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "To the bookstore."
    br_pt_form: "À livraria."
    note: "a bookstore sells books; you borrow them for free at a library"
  - option: "To the newsstand."
    br_pt_form: "À banca de jornais."
    note: "a newsstand sells newspapers and magazines, not a place to borrow books"
  - option: "To the factory."
    br_pt_form: "À fábrica."
    note: "a factory makes products and is not a place to borrow books"
```

**Item:**
> Where do you go to borrow books for free?

| Slot | Value |
|------|-------|
| A | "To the bookstore." |
| B | "To the newsstand." |
| C | **"To the library."** ✓ |
| D | "To the factory." |

**Key:** C

**Feedback:**
> **`To the library.`** is where you borrow books for free. **A** (*bookstore*) is where books are sold, **B** sells newspapers and magazines, and **D** manufactures products.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Grammar, current lesson

```yaml
item_id: `grm_cognate_traps_001`
skill: `grammar.cognate_traps.word_choice`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "I will assist the stand-up meeting at 9."
    br_pt_form: "Eu vou ajudar a reunião de stand-up às 9."
    note: "'assist' means to help someone; to be present at a meeting you 'attend' it"
  - option: "I will assist to the stand-up meeting."
    br_pt_form: "Eu vou ajudar para a reunião de stand-up."
    note: "'assist to' is not a valid combination; 'assist' takes a person or 'assist someone with something'"
  - option: "I will attend to the stand-up meeting."
    br_pt_form: "Eu vou cuidar da reunião de stand-up."
    note: "'attend to' means to deal with or take care of something, not to be present at a meeting"
```

**Item:**
> Choose the sentence with the correct verb for being present at a meeting.

| Slot | Value |
|------|-------|
| A | "I will assist the stand-up meeting at 9." |
| B | **"I will attend the stand-up meeting at 9."** ✓ |
| C | "I will assist to the stand-up meeting." |
| D | "I will attend to the stand-up meeting." |

**Key:** B

**Feedback:**
> **`I will attend the stand-up meeting.`** uses *attend* for being present. **A** misuses *assist* (to help), **C** adds an invalid *to* after *assist*, and **D** changes the meaning because *attend to* means to deal with something.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, current lesson

```yaml
item_id: `grm_cognate_traps_002`
skill: `grammar.cognate_traps.word_choice`
type: `error_correction`
difficulty_b: 0.0
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Actually, I work remotely."
    br_pt_form: "Na verdade, eu trabalho remoto."
    note: "'actually' corrects or surprises; to say 'atualmente' use 'currently', not 'actually'"
  - option: "I work actually remotely."
    br_pt_form: "Eu trabalho na verdade remoto."
    note: "unnatural placement; 'actually' cannot sit between the verb and 'remotely' like a frequency adverb here"
  - option: "I actually work in remote."
    br_pt_form: "Eu na verdade trabalho em remoto."
    note: "uses 'actually' again for a time meaning, and 'in remote' instead of the adverb 'remotely'"
```

**Item:**
> You want to say 'atualmente eu trabalho remoto'. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "Actually, I work remotely." |
| B | "I work actually remotely." |
| C | **"Currently, I work remotely."** ✓ |
| D | "I actually work in remote." |

**Key:** C

**Feedback:**
> **`Currently, I work remotely.`** uses *currently* for 'atualmente'. **A** and **D** misuse *actually* (na verdade), and **B** places *actually* unnaturally between the verb and the adverb.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: `prn_cognate_traps_001`
skill: `pronunciation.cognate_traps.stress`
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

**Step 1 — hear the contrast:** *eventually* is stressed on the second syllable (e-VEN-tu-al-ly, /ɪˈvɛntʃuəli/), not flat like the Portuguese habit; *actually* is stressed on the first (AC-tu-al-ly, /ˈæktʃuəli/). A flatter stress makes both words hard to recognize.

**Step 2 — produce (ASR-scored):** read aloud:

> "Eventually, I will actually finish the report."

**Target phonemes:** word stress on the second syllable of *eventually* · word stress on the first syllable of *actually* · clear /ʧ/ in *-tually* (not a hard /t/).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Reading, prerequisite review

```yaml
item_id: `rdg_cognate_traps_001`
skill: `reading.skimming_gist`
type: `detail_identification`
difficulty_b: -0.1
cefr: A1
domain: reading
provenance: authored
prereq_lesson: `les_a1_reading_skimming`
distractors:
  - option: "The team writes long slide decks every week."
    br_pt_form: "O time escreve decks de slides longos toda semana."
    note: "opposite of the short-slides format the text describes"
  - option: "The manager cancels the Friday demos."
    br_pt_form: "O gerente cancela as demos de sexta."
    note: "the text praises the demo, so cancelling is not supported"
  - option: "The team stopped shipping features."
    br_pt_form: "O time parou de entregar funcionalidades."
    note: "the demo shows what was shipped, so stopping is contradicted by the text"
```

**Stimulus:**
> "Every Friday, our team runs a short demo. We show what we shipped, what broke, and what we learned. Last Friday, the demo took twelve minutes because we kept the slides short and talked about the code. The manager said it was the clearest demo of the month. Next Friday we will do the same format."

**Item:**
> What is the main idea?

| Slot | Value |
|------|-------|
| A | "The team writes long slide decks every week." |
| B | **"A short, discussion-focused weekly demo works well."** ✓ |
| C | "The manager cancels the Friday demos." |
| D | "The team stopped shipping features." |

**Key:** B

**Feedback:**
> Skimming the whole note, the through-line is that a short, discussion-driven Friday demo gets good results. **A** inverts the short-slides detail, and **C** and **D** contradict the text that praises the demo and shows shipped work.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Reading, prerequisite review

```yaml
item_id: `rdg_cognate_traps_002`
skill: `reading.skimming_detail`
type: `detail_identification`
difficulty_b: 0.1
cefr: A1
domain: reading
provenance: authored
prereq_lesson: `les_a1_reading_skimming`
distractors:
  - option: "At 9:00, because the manager prefers mornings."
    br_pt_form: "Às 9:00, porque o gerente prefere manhãs."
    note: "wrong time and a reason the text never gives"
  - option: "After the tickets are closed, because the team is late."
    br_pt_form: "Depois que os tickets são fechados, porque o time está atrasado."
    note: "the text gives a fixed clock time, not an event-based start"
  - option: "It has no fixed time because each person talks for ten minutes."
    br_pt_form: "Não tem horário fixo porque cada pessoa fala dez minutos."
    note: "the text sets a fixed start and a two-minute limit per person, so both claims are wrong"
```

**Stimulus:**
> "Our stand-up starts at 9:15, not at 9:00, because part of the team joins from São Paulo. Each person has two minutes: one blocker and one plan. If the blocker is big, we open a ticket after the meeting. We keep the whole stand-up under fifteen minutes."

**Item:**
> When does the stand-up start, and why?

| Slot | Value |
|------|-------|
| A | "At 9:00, because the manager prefers mornings." |
| B | "After the tickets are closed, because the team is late." |
| C | **"At 9:15, because part of the team joins from São Paulo."** ✓ |
| D | "It has no fixed time because each person talks for ten minutes." |

**Key:** C

**Feedback:**
> The opening sentence states **`at 9:15, not at 9:00`** and gives the reason: part of the team joins from São Paulo. **A** has the wrong clock time and a reason the text never mentions, **B** invents an event-based start, and **D** gets both the fixed time and the per-person limit wrong.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `actually_vs_currently` | Item 4 missed | **L2** | Contrast *actually* (na verdade) and *currently* (atualmente) in short status updates. |
| `intend_vs_pretend` | Item 1 missed | **L2** | Practice *intend to* for real plans and *pretend* for faking in team stand-ups. |
| `attend_vs_assist` | Item 3 missed | **L2** | Drill *attend a meeting* (be there) versus *assist someone* (help). |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_reading_skimming` (prerequisite review split).
4. Items target authored lesson content; no external source text is reproduced.