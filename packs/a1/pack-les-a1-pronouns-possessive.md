# Practice Pack — `les_a1_pronouns_possessive`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_pronouns_possessive_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_pronouns_possessive.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_pronouns_possessive_v1
lesson_id: les_a1_pronouns_possessive
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
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: `grm_poss_adjective_vs_pronoun_001`
skill: `grammar.possessives.adjective_form`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Mine laptop is new, but that charger is your."
    br_pt_form: "Meu notebook é novo, mas aquele carregador é seu."
    note: "swaps both forms: 'mine' cannot precede a noun, and 'your' cannot stand alone at the end"
  - option: "My laptop is new, but that charger is your."
    br_pt_form: "Meu notebook é novo, mas aquele carregador é seu."
    note: "'your' needs a noun after it; alone at the end the pronoun 'yours' is required"
  - option: "Mine laptop is new, but that charger is yours."
    br_pt_form: "Meu notebook é novo, mas aquele carregador é seu."
    note: "'mine' is the pronoun form and cannot take a noun; 'my' is the adjective that goes before 'laptop'"
```

**Item:**
> Choose the sentence that uses the possessive adjective and the possessive pronoun correctly.

| Slot | Value |
|------|-------|
| A | "Mine laptop is new, but that charger is your." |
| B | **"My laptop is new, but that charger is yours."** ✓ |
| C | "My laptop is new, but that charger is your." |
| D | "Mine laptop is new, but that charger is yours." |

**Key:** B

**Feedback:**
> **`My laptop is new, but that charger is yours.`** uses both forms in the right place: **my** stands before the noun *laptop*, and **yours** stands alone after *is*. **A** and **D** put *mine* before a noun, and **A** and **C** leave *your* without a noun after it.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_poss_pronoun_forms_001`
skill: `vocab.possessives.pronoun_forms`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "her / their"
    br_pt_form: "dela / deles"
    note: "'her' and 'their' are adjectives and need a noun after them; alone at the end the pronouns 'hers' and 'theirs' are required"
  - option: "hers / their"
    br_pt_form: "dela / deles"
    note: "mixed pair: 'hers' is correct, but 'their' cannot stand alone here"
  - option: "her / theirs"
    br_pt_form: "dela / deles"
    note: "mixed pair: 'her' needs a noun after it, while 'theirs' is correct"
```

**Item:**
> Marina is leaving the equipment in the room. Complete with the correct possessive pronouns: "That badge is ____ , and these keys are ____ ."

| Slot | Value |
|------|-------|
| A | "her / their" |
| B | **"hers / theirs"** ✓ |
| C | "hers / their" |
| D | "her / theirs" |

**Key:** B

**Feedback:**
> At the end of the sentence both possessives stand alone, so the plural pronoun forms are needed: **`hers`** and **`theirs`**. **A**, **C**, and **D** each keep at least one adjective form (*her*, *their*) with no noun after it.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_poss_standup_001`
skill: `reading.possessives_context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "My room."
    br_pt_form: "A minha sala."
    note: "'my' in the text refers to the speaker's badge, not to the room on the second floor"
  - option: "Her room."
    br_pt_form: "A sala dela."
    note: "'her' in the text refers to the script that is still running"
  - option: "Our room."
    br_pt_form: "A nossa sala."
    note: "'our' in the text refers to the standup, not to the room"
```

**Stimulus:**
> "Hi, this is my build badge and that one is yours. Our standup starts at nine. Her script is still running, and their room is on the second floor."

**Item:**
> According to the message, whose room is on the second floor?

| Slot | Value |
|------|-------|
| A | My room. |
| B | **Their room.** ✓ |
| C | Her room. |
| D | Our room. |

**Key:** B

**Feedback:**
> The sentence **`their room is on the second floor`** links the possessive *their* directly to the room. The other possessives refer to different things: *my* to the badge, *her* to the script, and *our* to the standup.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, current lesson

```yaml
item_id: `grm_poss_of_vs_apostrophe_001`
skill: `grammar.possessives.of_vs_s`
type: `error_correction`
difficulty_b: -0.1
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "The script of Marina is ready for review."
    br_pt_form: "O script de Marina está pronto para revisão."
    note: "grammatical but rare; with a person, English normally uses the possessive apostrophe"
  - option: "Marina script is ready for review."
    br_pt_form: "Script Marina está pronto para revisão."
    note: "missing the apostrophe, so the sentence loses the possession marker"
  - option: "The Marina's script is ready for review."
    br_pt_form: "O script da Marina está pronto para revisão."
    note: "an article cannot precede a proper name plus the possessive 's"
```

**Item:**
> Choose the most natural way to say that the script belongs to Marina.

| Slot | Value |
|------|-------|
| A | "The script of Marina is ready for review." |
| B | **"Marina's script is ready for review."** ✓ |
| C | "Marina script is ready for review." |
| D | "The Marina's script is ready for review." |

**Key:** B

**Feedback:**
> With people, English marks possession with the apostrophe: **`Marina's script`**. **A** uses the *of*-structure, which is possible but unusual with a person; **C** omits the apostrophe; **D** wrongly adds *the* before a proper name.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: `prn_poss_s_endings_001`
skill: `pronunciation.possessive_s_endings`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_poss_s_endings_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *Kate's badge* ends in the voiceless /s/ after the /t/. *Tom's laptop* ends in the voiced /z/ after the /m/. *Chris's machine* ends in /ɪz/ because the name already ends in an /s/ sound.
**Step 2 — produce (ASR-scored):** read aloud:

> "Kate's badge is mine, and Tom's laptop is theirs."

**Target phonemes:** /s/ in *Kate's* · /z/ in *Tom's* · /ɪz/ in *Chris's* · clear /ð/ in *theirs*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: `grm_prn_subject_review_001`
skill: `grammar.pronouns.subject_forms`
type: `contextual_selection`
difficulty_b: -0.6
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_pronouns_subject_object`
distractors:
  - option: "Him / us"
    br_pt_form: "Ele / nós"
    note: "object pronouns cannot act as the subject of a sentence"
  - option: "He / us"
    br_pt_form: "Ele / nós"
    note: "'he' is correct as a subject, but 'us' is an object pronoun and cannot be the subject"
  - option: "Him / we"
    br_pt_form: "Ele / nós"
    note: "'him' is an object pronoun, though 'we' is correct as a subject"
```

**Item:**
> Rafael is a platform engineer. ____ is on call today, and Marina and I are on call tomorrow, so ____ are both busy. Choose the correct subject pronouns.

| Slot | Value |
|------|-------|
| A | "Him / us" |
| B | **"He / we"** ✓ |
| C | "He / us" |
| D | "Him / we" |

**Key:** B

**Feedback:**
> A subject pronoun does the action, so the sentence needs **`He`** and **`we`**. **A**, **C**, and **D** each place an object pronoun (*him*, *us*) in the subject slot.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: `voc_prn_object_review_001`
skill: `vocab.pronouns.object_forms`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_pronouns_subject_object`
distractors:
  - option: "she / we"
    br_pt_form: "ela / nós"
    note: "subject pronouns cannot follow a preposition as its object"
  - option: "her / we"
    br_pt_form: "ela / nós"
    note: "'her' is correct after the preposition, but 'we' is a subject pronoun and cannot follow 'to'"
  - option: "hers / us"
    br_pt_form: "dela / nós"
    note: "'hers' is a possessive pronoun, not the object form needed after the preposition"
```

**Item:**
> The badge belongs to Marina and me. Please give it back: "Give it to ____ and ____ ." Choose the correct object pronouns.

| Slot | Value |
|------|-------|
| A | "she / we" |
| B | **"her / us"** ✓ |
| C | "her / we" |
| D | "hers / us" |

**Key:** B

**Feedback:**
> After the preposition *to*, the object forms are required: **`her`** and **`us`**. **A** and **C** use the subject pronoun *we*, and **D** uses the possessive *hers* where an object pronoun belongs.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `possessive_adjective_vs_pronoun` | Item 1 missed | **L2** | Contrast *my book* / *the book is mine* in short pairs. |
| `of_vs_apostrophe_possession` | Item 4 missed | **L2** | Practice `'s` with people versus *of* with things, including the plural apostrophe (*my brothers' room*). |
| `possessive_s_endings` | Item 5 missed | **L2** | Drill the /s/, /z/, /ɪz/ endings of `'s` in names. |
| `subject_object_pronoun_review` | Item 6 or 7 missed | **L2** | Recycle subject and object pronouns from `les_a1_pronouns_subject_object` before the possessive forms. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.
4. Grammar rules were grounded through `tools/grammar-rag` (possessive adjectives before nouns, `'s` with people, plural apostrophe, possessive pronouns).
