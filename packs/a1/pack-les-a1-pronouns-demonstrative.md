# Practice Pack — `les_a1_pronouns_demonstrative`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_pronouns_demonstrative_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_pronouns_demonstrative.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_pronouns_demonstrative_v1
lesson_id: les_a1_pronouns_demonstrative
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
| Vocabulary | 1 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 2 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: `grm_demonstr_number_001`
skill: `grammar.demonstratives_number_agreement`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "This are my pens."
    br_pt_form: "Esta são minhas canetas."
    note: "'this' is singular and marks near distance; two pens need the plural demonstrative 'these'"
  - option: "These is my pens."
    br_pt_form: "Estas é minhas canetas."
    note: "'these' always takes the plural verb 'are', never the singular 'is'"
  - option: "Those is my pens."
    br_pt_form: "Aquelas é minhas canetas."
    note: "'those' marks distance, but the pens are on the desk (near), and the verb must still be 'are'"
```

**Item:**
> Two pens are on the desk within your reach. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "This are my pens." |
| B | "These is my pens." |
| C | **"These are my pens."** ✓ |
| D | "Those is my pens." |

**Key:** C

**Feedback:**
> Two or more items **near** the speaker need the plural demonstrative **`These are my pens.`** **A** uses the singular form *this*, **B** breaks agreement with *is*, and **D** uses the distant form *those*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_demonstr_near_far_002`
skill: `grammar.demonstratives_near_far`
type: `error_correction`
difficulty_b: -0.1
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "This are the failing tests."
    br_pt_form: "Este são os testes falhando."
    note: "'this' is singular and marks near distance; the tests are on the colleague's screen (far)"
  - option: "Those is the failing tests."
    br_pt_form: "Aqueles é os testes falhando."
    note: "plural 'those' cannot take the singular verb 'is'"
  - option: "That are the failing test."
    br_pt_form: "Aquele são o teste falhando."
    note: "'that' is singular and would take 'is', not 'are'"
```

**Stimulus:**
> You are pairing with a colleague. Her screen shows a long list of red checks. A teammate says: "That are the failing tests."

**Item:**
> Choose the best correction of the sentence.

| Slot | Value |
|------|-------|
| A | "This are the failing tests." |
| B | "Those is the failing tests." |
| C | "That are the failing test." |
| D | **"Those are the failing tests."** ✓ |

**Key:** D

**Feedback:**
> The tests are **far** from the speaker (on another screen) and plural, so the correct form is **`Those are the failing tests.`** **A** mixes the singular near form with plural agreement, **B** keeps *is* with a plural subject, and **C** uses a singular demonstrative with a plural verb.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_demonstr_context_001`
skill: `reading.demonstrative_context`
type: `detail_identification`
difficulty_b: -0.3
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "On Ivan's monitor."
    br_pt_form: "No monitor do Ivan."
    note: "the monitor belongs to Ivan, but the text links the goals to the wall"
  - option: "Next to the coffee machine."
    br_pt_form: "Ao lado da cafeteira."
    note: "the coffee machine is mentioned, but no sentence connects it to the goals"
  - option: "On Ivan's desk."
    br_pt_form: "Na mesa do Ivan."
    note: "the desk is introduced first, but for the monitor and the chair, not the goals"
```

**Stimulus:**
> "Hi, Ivan. Welcome to the team. This is your desk, and this is your monitor. Those are the sprint goals on the wall. That is the coffee machine, behind you."

**Item:**
> Where are the sprint goals?

| Slot | Value |
|------|-------|
| A | On Ivan's monitor. |
| B | **On the wall.** ✓ |
| C | Next to the coffee machine. |
| D | On Ivan's desk. |

**Key:** B

**Feedback:**
> The line **`Those are the sprint goals on the wall.`** states the location directly: **the wall**. **A**, **C**, and **D** mention things from the same text, but the text never links them to the goals.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: `voc_demonstr_near_far_001`
skill: `vocab.demonstratives_near_far`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "near"
    br_pt_form: "perto"
    note: "opposite meaning; 'near' marks short distance"
  - option: "here"
    br_pt_form: "aqui"
    note: "names the place close to the speaker, not the general idea of distance"
  - option: "this"
    br_pt_form: "este"
    note: "a demonstrative word, not the adjective for distance"
```

**Item:**
> Which word means "longe de quem fala" (far from the speaker)?

| Slot | Value |
|------|-------|
| A | near |
| B | here |
| C | **far** ✓ |
| D | this |

**Key:** C

**Feedback:**
> **`far`** is the adjective for distance away from the speaker — it pairs with *that / those*. **A** is the opposite, and **B** and **D** name places or objects close to the speaker.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: `grm_possessive_review_001`
skill: `grammar.possessives_my_your`
type: `contextual_selection`
difficulty_b: -0.6
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_pronouns_possessive`
distractors:
  - option: "This is her notebook."
    br_pt_form: "Este é o caderno dela."
    note: "third-person possessive; the notebook belongs to the speaker, Ana"
  - option: "This is your notebook."
    br_pt_form: "Este é o seu caderno."
    note: "second person; the listener is not the owner"
  - option: "This is his notebook."
    br_pt_form: "Este é o caderno dele."
    note: "masculine third person; Ana is the owner and the speaker"
```

**Item:**
> Ana points at the notebook next to her hand. What does she say?

| Slot | Value |
|------|-------|
| A | "This is her notebook." |
| B | "This is your notebook." |
| C | "This is his notebook." |
| D | **"This is my notebook."** ✓ |

**Key:** D

**Feedback:**
> The notebook belongs to the speaker, so the first-person possessive **`This is my notebook.`** is correct. **A** and **C** talk about another person, and **B** points to the listener instead of the speaker.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Reading, prerequisite review

```yaml
item_id: `rdg_possessive_review_001`
skill: `reading.possessives_context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
prereq_lesson: `les_a1_pronouns_possessive`
distractors:
  - option: "This is Maria's chair."
    br_pt_form: "Esta é a cadeira da Maria."
    note: "'this' marks near distance; the text uses the far form for Maria's chair"
  - option: "These are Maria's chairs."
    br_pt_form: "Estas são as cadeiras da Maria."
    note: "plural form; the text talks about one chair only"
  - option: "Those is Maria's chair."
    br_pt_form: "Aquela é a cadeira da Maria."
    note: "'those' cannot take the singular verb 'is'"
```

**Stimulus:**
> "Marco shows his desk to a visitor: 'This is my chair. That is Maria's chair. These are our keyboards. Those are their monitors.'"

**Item:**
> Which sentence about Maria's chair appears in the text?

| Slot | Value |
|------|-------|
| A | "This is Maria's chair." |
| B | **"That is Maria's chair."** ✓ |
| C | "These are Maria's chairs." |
| D | "Those is Maria's chair." |

**Key:** B

**Feedback:**
> Marco sits at his desk and points across the room, so the far singular form is the one used: **`That is Maria's chair.`** **A** uses the near form, **C** changes the number, and **D** breaks verb agreement.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_demonstr_th_001`
skill: `pronunciation.th_dental_demonstratives`
type: `minimal_pair_production`
difficulty_b: -0.3
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_demonstr_th_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *this* /ðɪs/ starts with the voiced dental /ð/ — tongue between the teeth — not /d/ ("dis"). *these* /ðiːz/ keeps a long /iː/, and *those* /ðoʊz/ ends with /z/. The voiceless /θ/ in *think* never appears inside these four words.

**Step 2 — produce (ASR-scored):** read aloud:

> "These are the new tests, and those are the old ones."

**Target phonemes:** /ð/ in *these* and *those* · long /iː/ in *these* · final /z/ in *these* and *those*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `demonstratives_near_far_choice` | Items 1, 2, 4, 5 missed | **L2** | Re-drill the distance axis: near → *this / these*, far → *that / those*, with desk-street objects. |
| `demonstratives_number_agreement` | Items 1, 6 missed | **L2** | Contrast *is* vs *are* after each demonstrative; rewrite four wrong sentences with the right verb. |
| `demonstratives_workspace_tour` | Item 3 missed | **L2** | Walks the learner through the lesson scenario again, naming each object and its location with *here / there*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 5 and 6 review `les_a1_pronouns_possessive` inside a demonstrative frame, keeping the prereq link in the adaptive selector.
4. Items target authored lesson content; no external source text is reproduced.