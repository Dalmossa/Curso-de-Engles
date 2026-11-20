# Practice Pack — `les_a2_meeting_open`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_a2_meeting_open_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_meeting_open.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR to en-US). No external source text is reproduced or adapted.
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_meeting_open_v1
lesson_id: les_a2_meeting_open
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
| Grammar | 3 | 2–3 | ✅ |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred until render |
| Reading | 1 | 1–2 | ✅ absorbs the deferred slot |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_meeting_open_lets_contraction_001
skill: `grammar.lets_vs_let_us`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Let us get started, team."
    br_pt_form: "Vamos começar, equipe."
    note: "grammatical but formal in a daily stand-up; it reads like asking the group for permission"
  - option: "Let's gets started, team."
    br_pt_form: "Vamos começas, equipe."
    note: "the bare verb follows let's; a third person ending is never added after the contraction"
  - option: "Let's to get started, team."
    br_pt_form: "Vamos para começar, equipe."
    note: "the contraction takes the base form directly, not the infinitive with to"
```

**Item:**
> You open the daily meeting and invite the group to begin. Choose the natural sentence.

| Slot | Value |
|------|-------|
| A | "Let us get started, team." |
| B | **"Let's get started, team."** ✓ |
| C | "Let's gets started, team." |
| D | "Let's to get started, team." |

**Key:** B

**Feedback:**
> The neutral opener is **"Let's get started, team."** **A** is grammatical but sounds formal and distant for a stand-up, almost like asking permission. **C** adds a third person ending after *let's*, which takes the bare verb. **D** inserts *to*, which the construction does not take. In pt-BR all three ideas sound like "vamos começar"; in en-US only the contracted form is routine here.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: grm_meeting_open_turn_sequence_002
skill: `grammar.turn_allocation_sequence`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Before we begin, Rafael takes us through the deploy."
    br_pt_form: "Antes de começarmos, o Rafael nos conduz pelo deploy."
    note: "a statement of fact, not the invitation that allocates a turn to a named colleague"
  - option: "Before we begin, can Rafael takes us through the deploy?"
    br_pt_form: "Antes de começarmos, o Rafael pode nos conduzir pelo deploy?"
    note: "after the auxiliary can the main verb stays in the base form, without the third person ending"
  - option: "Before we begin, let Rafael takes us through the deploy."
    br_pt_form: "Antes de começarmos, deixe o Rafael nos conduzir pelo deploy."
    note: "let also takes the bare verb; the third person ending is a transfer from the Portuguese present"
```

**Item:**
> You chair the meeting. The first item belongs to Rafael. Which sentence allocates his turn correctly?

| Slot | Value |
|------|-------|
| A | "Before we begin, Rafael takes us through the deploy." |
| B | **"Before we begin, can Rafael take us through the deploy?"** ✓ |
| C | "Before we begin, can Rafael takes us through the deploy?" |
| D | "Before we begin, let Rafael takes us through the deploy." |

**Key:** B

**Feedback:**
> **B** names the owner and uses the base form after *can*: that is the turn allocation the lesson teaches. **A** only states a habit, so nobody is actually invited to speak. **C** and **D** both keep the third person ending after a construction that requires the bare verb. In pt-BR the name alone is often enough; in en-US the invitation has to be said out loud.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_meeting_open_agenda_pauta_003
skill: `vocab.agenda_vs_pauta`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "A ata da reunião com três decisões."
    br_pt_form: "A ata da reunião com três decisões."
    note: "the written record is minutes, not agenda; the two words sit on opposite sides of the meeting"
  - option: "Um resumo com três tópicos já decididos."
    br_pt_form: "Um resumo com três tópicos já decididos."
    note: "a summary reports what happened; an agenda lists what is still to be discussed"
  - option: "O quadro de tarefas da equipe."
    br_pt_form: "O quadro de tarefas da equipe."
    note: "a task board stores work in progress and is not the ordered list of meeting topics"
```

**Item:**
> A colega diz: "The agenda has three items." O que ela quer dizer?

| Slot | Value |
|------|-------|
| A | "A ata da reunião com três decisões." |
| B | "Um resumo com três tópicos já decididos." |
| C | **"A pauta com três assuntos a tratar."** ✓ |
| D | "O quadro de tarefas da equipe." |

**Key:** C

**Feedback:**
> **C** is right: *agenda* is the pauta, the ordered list of topics before they are discussed. **A** describes *minutes*, the record produced afterwards. **B** describes a summary, and **D** describes a task board. The pt-BR word "pauta" is the reliable anchor here because it carries the same pre-meeting sense.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, prerequisite review

```yaml
item_id: voc_meeting_open_opener_register_004
skill: `vocab.meeting_opener_register`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_small_talk`
distractors:
  - option: "Let's get started."
    br_pt_form: "Vamos começar."
    note: "opens the first item immediately, leaving no room for a note before the meeting starts"
  - option: "Shall we move on?"
    br_pt_form: "Podemos avançar?"
    note: "asks to advance past an item, so it belongs in the middle or at the end of the meeting"
  - option: "Noted, action item."
    br_pt_form: "Registrado, tarefa."
    note: "records a decision at the close of an item rather than reserving space before the first one"
```

**Item:**
> You have one quick housekeeping note before the first item. Which opener fits?

| Slot | Value |
|------|-------|
| A | "Let's get started." |
| B | "Shall we move on?" |
| C | "Noted, action item." |
| D | **"Before we begin, one quick note."** ✓ |

**Key:** D

**Feedback:**
> **D** reserves a slot before the first item, which is exactly what *before we begin* does. **A** starts the meeting and closes the door on the note. **B** moves forward from an item that has already been discussed. **C** is the chair's closing move. The three wrong options are all natural English in a meeting; what separates them is the position in the turn sequence.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Reading, current lesson (absorbs the deferred Listening slot)

```yaml
item_id: rdg_meeting_open_standup_notes_005
skill: `reading.standup_note_scanning`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Ana"
    br_pt_form: "Ana"
    note: "Ana opened the meeting and noted the action item, but she did not own the dashboard"
  - option: "Rafael"
    br_pt_form: "Rafael"
    note: "Rafael took the first turn on the deploy, not on the dashboard"
  - option: "The whole group"
    br_pt_form: "O grupo todo"
    note: "the group was asked to agree on the order; agreement is not ownership of an artefact"
```

**Stimulus:**
> Ana opened the stand-up at nine. She said the team had three items and would keep the meeting to ten minutes. Before we begin, she asked whether the group agreed on the order. Rafael took the first turn and walked everyone through the deploy. Bianca owns the dashboard and promised it by Thursday EOD. Ana noted the action item and moved to the next item.

**Item:**
> Who owned the dashboard after the stand-up?

| Slot | Value |
|------|-------|
| A | "Ana" |
| B | **"Bianca"** ✓ |
| C | "Rafael" |
| D | "The whole group" |

**Key:** B

**Feedback:**
> **B** is the owner: the note says *Bianca owns the dashboard* and she promises it *by Thursday EOD*. **A** is the chair who registered the item, **C** is the first speaker on the deploy, and **D** confuses agreeing on the order with owning an artefact. The trap is that three people act in the text and only one of them owns the object.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Grammar, current lesson (coherence of a suggestion)

```yaml
item_id: coh_meeting_open_shall_we_006
skill: `coherence.shall_we_suggestion`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Shall you start with the deploy?"
    br_pt_form: "Você pode começar pelo deploy?"
    note: "shall is not used with you to propose a joint action; the fixed suggestion pattern uses we"
  - option: "Shall we starting with the deploy?"
    br_pt_form: "Vamos começando pelo deploy?"
    note: "the -ing form follows a different set of verbs and cannot follow the modal in this pattern"
  - option: "Shall we started with the deploy?"
    br_pt_form: "Nós começamos pelo deploy?"
    note: "the base form is required after shall; a past form would report a decision already taken"
```

**Item:**
> The chair wants to propose starting with the deploy. Which question keeps the meeting moving?

| Slot | Value |
|------|-------|
| A | "Shall you start with the deploy?" |
| B | "Shall we starting with the deploy?" |
| C | **"Shall we start with the deploy?"** ✓ |
| D | "Shall we started with the deploy?" |

**Key:** C

**Feedback:**
> **C** is the suggestion pattern: *shall we* plus the bare verb, with **we** because the action belongs to the group. **A** switches to *you* and stops being a joint proposal. **B** uses an *-ing* form that this pattern rejects, and **D** uses a past form that would report a decision instead of proposing one. In pt-BR "podemos começar?" covers all four; only one of them is the English suggestion.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: prn_meeting_open_lets_reduction_007
skill: `pronunciation.lets_reduction`
type: `minimal_pair_production`
difficulty_b: -0.5
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_meeting_open_lets_reduction_007.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *let's* /lets/ is one short unit with a light /ts/ ending; *let us* /let ʌs/ is two units with a clear vowel in the middle.
**Step 2 — identify:** which one would you hear at the start of a stand-up? (Answer: the contracted one.)
**Step 3 — produce (ASR-scored):** read aloud:

> "Let's get started. Before we begin, shall we agree on the order?"

**Target phonemes:** short /ts/ in *let's* · no extra vowel after *lets* · connected *before we begin* · rising tone on *order?*

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `lets_vs_let_us` | Item 1 missed | **L2** | Rebuild the opener against the stand-up register; include the bare verb after the contraction. |
| `shall_we_suggestion` | Item 6 missed | **L2** | Drill *shall we* plus bare verb against the *you* and *-ing* variants. |
| `turn_allocation_sequence` | Item 2 or 4 missed | **L2** | Rebuild the order *before we begin* → *can you take us through* → *noted* as a single chain. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. All items target authored lesson content; no external source text is reproduced.
