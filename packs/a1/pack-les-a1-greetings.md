# Practice Pack — `les_a1_greetings`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_a1_greetings_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_greetings.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_greetings_v1
lesson_id: les_a1_greetings
learner_profile: default
estimated_minutes: 4.0
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 0
  br_pt_form_coverage: 7/7 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 2 | 2–3 | ✅ |
| Vocabulary | 3 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Vocabulary, current lesson

```yaml
item_id: `voc_greetings_morning_meeting_001`
skill: `vocab.greetings.good_morning`
type: `contextual_selection`
difficulty_b: -0.7
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "Good night"
    br_pt_form: "boa noite (despedida)"
    note: "common L1 confusion; learners use 'good night' as a greeting at night instead of 'good evening'"
  - option: "Good afternoon"
    br_pt_form: "boa tarde"
    note: "wrong time-of-day greeting for a morning meeting"
  - option: "Goodbye"
    br_pt_form: "tchau/adeus"
    note: "farewell form used where a greeting is required"
```

**Item:**
> You join the team's daily meeting at 9 a.m. What is the best greeting?

| Slot | Value |
|------|-------|
| A | "Good night, everyone." |
| B | **"Good morning, everyone."** ✓ |
| C | "Good afternoon, everyone." |
| D | "Goodbye, everyone." |

**Key:** B

**Feedback:**
> Use **`Good morning`** for greetings in the morning. **A** (*Good night*) is usually a farewell at night, not a greeting when you arrive. **C** is for the afternoon, and **D** is used when leaving.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_be_introduction_001`
skill: `grammar.be_present_introductions`
type: `contextual_selection`
difficulty_b: -0.6
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "is"
    br_pt_form: "é/está"
    note: "learners overgeneralize 'is' for all subjects"
  - option: "are"
    br_pt_form: "são/estão"
    note: "confusion with plural/you form when speaking about oneself"
  - option: "be"
    br_pt_form: "ser/estar"
    note: "use of base form without present-tense agreement"
```

**Item:**
> Complete the introduction: "Good morning. I ____ the new frontend developer."

| Slot | Value |
|------|-------|
| A | "Good morning. I is the new frontend developer." |
| B | **"Good morning. I am the new frontend developer."** ✓ |
| C | "Good morning. I are the new frontend developer." |
| D | "Good morning. I be the new frontend developer." |

**Key:** B

**Feedback:**
> With **`I`**, use **`am`** in the present: *I am the new frontend developer*. In natural speech, this often becomes **`I'm`**. *Is* is used with *he/she/it*, and *are* with *we/you/they*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_greetings_sequence_001`
skill: `reading.greeting_intro_sequence`
type: `detail_identification`
difficulty_b: -0.4
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "He asks for help, says goodbye, and then introduces himself."
    br_pt_form: null
    note: "reverses the logical order of a first meeting"
  - option: "He says goodbye first and asks about the meeting later."
    br_pt_form: null
    note: "places farewell before the main interaction"
  - option: "He only talks about the coffee area."
    br_pt_form: null
    note: "focuses on a minor detail and ignores greeting and introduction"
```

**Stimulus:**
> "Good morning, everyone. I'm Bruno, the new frontend developer. Nice to meet you. Excuse me, where is the meeting room?"

**Item:**
> What does Bruno do in this short introduction?

| Slot | Value |
|------|-------|
| A | **He greets the team, introduces himself, and asks a polite question.** ✓ |
| B | He asks for help, says goodbye, and then introduces himself. |
| C | He says goodbye first and asks about the meeting later. |
| D | He only talks about the coffee area. |

**Key:** A

**Feedback:**
> Bruno starts with a greeting (*Good morning*), introduces himself (*I'm Bruno...*), shows politeness (*Nice to meet you*), and asks for information with *Excuse me*. This is a clear and natural sequence for a first contact at work.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: `voc_greetings_nice_to_meet_001`
skill: `vocab.greetings.nice_to_meet_you`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "I'm fine, thank you."
    br_pt_form: "estou bem, obrigado"
    note: "answer to 'How are you?' used incorrectly as reply to an introduction"
  - option: "You're welcome."
    br_pt_form: "de nada"
    note: "response to thanks, not to a first-meeting greeting"
  - option: "Good evening."
    br_pt_form: "boa noite (saudação)"
    note: "time-of-day greeting that does not answer 'Nice to meet you'"
```

**Item:**
> A teammate says, "Nice to meet you." What is the most natural reply?

| Slot | Value |
|------|-------|
| A | "I'm fine, thank you." |
| B | **"Nice to meet you, too."** ✓ |
| C | "You're welcome." |
| D | "Good evening." |

**Key:** B

**Feedback:**
> When someone says **`Nice to meet you`**, a natural reply is **`Nice to meet you, too`**. **A** answers *How are you?*, and **C** answers *Thank you*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, prerequisite review

```yaml
item_id: `prn_alphabet_h_hello_001`
skill: `pronunciation.h_initial`
type: `contextual_selection`
difficulty_b: -0.8
cefr: A1
domain: pronunciation
provenance: authored
prereq_lesson: `les_a1_alphabet_sounds`
distractors:
  - option: "the word starts with a strong 'r' sound, like in Portuguese 'rato'"
    br_pt_form: "som de 'r' inicial"
    note: "Brazilian learners may transfer the Portuguese 'r' sound to English initial 'h'"
  - option: "the first letter is silent, so it sounds like 'ello'"
    br_pt_form: "h mudo"
    note: "overgeneralization from Portuguese where 'h' is silent at word start"
  - option: "the word starts with a /d/ sound"
    br_pt_form: "som de /d/"
    note: "confusion with other consonant onsets; not the target sound"
```

**Item:**
> When you say **"Hello"** in English, what happens to the initial **h**?

| Slot | Value |
|------|-------|
| A | **It is pronounced with a light breath sound: /həˈloʊ/.** ✓ |
| B | It starts with a strong "r" sound, like in Portuguese "rato". |
| C | The first letter is silent, so it sounds like "ello". |
| D | It starts with a /d/ sound. |

**Key:** A

**Feedback:**
> In **`Hello`**, the letter **h** is pronounced as a light aspiration /h/. Do not replace it with a Portuguese "r" sound and do not drop it. This sound awareness supports clear greetings like *Hello* and *Hi*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_greetings_excuse_me_001`
skill: `vocab.greetings.excuse_me`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_alphabet_sounds`
distractors:
  - option: "Thank you"
    br_pt_form: "obrigado"
    note: "gratitude expression confused with asking for attention politely"
  - option: "You're welcome"
    br_pt_form: "de nada"
    note: "response to thanks, not a polite way to interrupt or ask to pass"
  - option: "See you later"
    br_pt_form: "até mais"
    note: "farewell used instead of getting someone's attention"
```

**Item:**
> You need to ask a colleague where the meeting room is. Which phrase is most polite to start?

| Slot | Value |
|------|-------|
| A | "Thank you, where is the meeting room?" |
| B | **"Excuse me, where is the meeting room?"** ✓ |
| C | "You're welcome, where is the meeting room?" |
| D | "See you later, where is the meeting room?" |

**Key:** B

**Feedback:**
> **`Excuse me`** is used to get attention politely or to ask to pass. **A** expresses gratitude, **C** answers thanks, and **D** is a farewell.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_greetings_target_sentence_001`
skill: `pronunciation.th_thank`
type: `minimal_pair_production`
difficulty_b: -0.3
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *thank* /θæŋk/ (voiceless dental fricative) vs *tank* /tæŋk/ (stop). Keep the /h/ in *hello* and avoid adding an extra vowel at the end of *good*.
**Step 2 — produce (ASR-scored):** read aloud:

> "Good morning, thank you. Nice to meet you."

**Target phonemes:** /θ/ in *thank* · /h/ in none here but keep clear aspiration if you add *hello* in practice · smooth rhythm in *Nice to meet you*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `greeting_time_of_day` | Item 1 missed | **L2** | Review morning/afternoon/evening greetings and the farewell use of *good night*. |
| `be_present_introductions` | Item 2 missed | **L2** | Practice *I am / I'm* in short self-introductions in work contexts. |
| `nice_to_meet_you_response` | Item 4 missed | **L2** | Contrast replies to *Nice to meet you*, *How are you?*, and *Thank you*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced or adapted.
