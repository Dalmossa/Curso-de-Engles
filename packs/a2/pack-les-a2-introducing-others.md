# Practice Pack — `les_a2_introducing_others`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_introducing_others_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_introducing_others.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_introducing_others_v1
lesson_id: les_a2_introducing_others
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
| Vocabulary | 2 | 1–2 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred render |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Coherence, current lesson

> Occupies the **Grammar** slot in the §2.2 budget. Its *skill* is pair-level (`coherence.*`) and it
> declares `domain: grammar` for weighting, because reciprocity is a two-turn construct.

```yaml
item_id: coh_introducing_others_reciprocity_001
skill: `coherence.reciprocal_introduction`
type: `checklist_completion`
difficulty_b: 0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Lucia, this is Carlos. Carlos: Hi Lucia."
    br_pt_form: "Lucia, este é o Carlos."
    note: "in Portuguese one introduction is already reciprocal, so the learner stops after the first direction"
  - option: "Lucia, meet Carlos. Carlos: Hi Lucia."
    br_pt_form: "Lucia, conheça o Carlos."
    note: "meet without to arranges a meeting; it is not the verb used to introduce somebody"
  - option: "Lucia, this is Carlos, our new analyst. Carlos: Hi Lucia."
    br_pt_form: "Lucia, este é o Carlos, nosso novo analista."
    note: "the appositive is correct, but the reverse introduction is still missing"
```

**Item:**
> You introduce Carlos to Lucia on a team call. Which sequence is **complete**?

| Slot | Value |
|------|-------|
| A | "Lucia, this is Carlos. Carlos: Hi Lucia." |
| B | **"Lucia, this is Carlos. Carlos: Hi Lucia. Carlos, this is Lucia."** ✓ |
| C | "Lucia, meet Carlos. Carlos: Hi Lucia." |
| D | "Lucia, this is Carlos, our new analyst. Carlos: Hi Lucia." |

**Key:** B

**Feedback:**
> This item tests a social schema, not a vocabulary set.
> **A** is the Brazilian pattern: in pt-BR *apresentar* is reciprocal by default, and one direction counts as the whole act. In American English the introducer owes both directions, or Lucia never learns the name of the person just introduced to her.
> **C** uses *meet* as if it meant *introduce*; the natural forms are *this is* and *I'd like you to meet*.
> **D** gets the appositive right and still omits the reverse step, which is exactly the case where correct syntax does not save the situation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: voc_introducing_others_register_001
skill: `vocab.introduction_register_title`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Hey, this is my boss, Carla."
    br_pt_form: "Ei, essa é minha chefe, a Carla."
    note: "too casual for a manager in an American workplace; the title and a polite frame are expected"
  - option: "Marco, I'd like you to meet Costa."
    br_pt_form: "Marco, eu gostaria que você conhecesse a Costa."
    note: "a surname alone sounds abrupt; add a title or a role when the person outranks the group"
  - option: "Marco, this is our manager, the Ms. Costa."
    br_pt_form: "Marco, este é nosso gerente, a Sra. Costa."
    note: "a title already determines the noun phrase; the extra article before the title is not English"
```

**Item:**
> You introduce Ms. Costa, the engineering manager, to Marco, a peer on your team. Choose the natural introduction.

| Slot | Value |
|------|-------|
| A | "Hey, this is my boss, Carla." |
| B | "Marco, I'd like you to meet Costa." |
| C | **"Marco, I'd like you to meet Ms. Costa, our engineering manager."** ✓ |
| D | "Marco, this is our manager, the Ms. Costa." |

**Key:** C

**Feedback:**
> **C** carries the register the situation needs: *I'd like you to meet* plus title and role. **A** is too casual for a manager, even among engineers. **B** drops the title and sounds abrupt. **D** adds an article before a title that already determines the phrase. With a peer, *This is Ana* is perfectly fine; the polite frame is what changes when you present someone senior.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Grammar, current lesson

```yaml
item_id: grm_introducing_others_appositive_001
skill: `grammar.appositive_job_title`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "This is Marco is our backend developer."
    br_pt_form: "Este é o Marco é nosso desenvolvedor backend."
    note: "the Portuguese relative structure is pasted in with a second copula, which English does not allow here"
  - option: "This is Marco, a our backend developer."
    br_pt_form: "Este é o Marco, um nosso desenvolvedor backend."
    note: "a possessive and an article cannot occupy the same slot before a role noun"
  - option: "This is Marco. He is our backend developer."
    br_pt_form: "Este é o Marco. Ele é nosso desenvolvedor backend."
    note: "correct English, excluded because the stem asks for the verb-less appositive form"
```

**Item:**
> Which sentence introduces Marco and his role with **no verb and no wrong article**?

| Slot | Value |
|------|-------|
| A | "This is Marco is our backend developer." |
| B | "This is Marco, a our backend developer." |
| C | **"This is Marco, our backend developer."** ✓ |
| D | "This is Marco. He is our backend developer." |

**Key:** C

**Feedback:**
> **C** is an appositive: a noun phrase set off by a comma, renaming Marco with no verb at all. **A** adds a second copula, the instinctive Brazilian move when looking for the verb. **B** combines *a* with *our*, which English does not do. **D** is correct English but uses two clauses, so it fails the stem constraint; keep it for the case where you have two facts, not one.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_introducing_others_turns_001
skill: `reading.turn_attribution_three_speakers`
type: `scanning`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Bruno"
    br_pt_form: "O Bruno."
    note: "Bruno only greets the visitor; he does not introduce anybody"
  - option: "Ms. Costa"
    br_pt_form: "A Sra. Costa."
    note: "she reacts to the introduction and never performs one"
  - option: "Ana"
    br_pt_form: "A Ana."
    note: "the visitor is the person introduced, not the person introducing"
```

**Stimulus:**
> Rafa opened the stand-up: "I'd like you to meet Ana. Ana joins the platform team today." Bruno said, "Hi Ana, nice to meet you. I'm Bruno, I work on payments." Rafa then turned to the visitor: "Ana, this is Ms. Costa, our engineering manager." Ms. Costa answered, "Nice to meet you, Ana." Rafa finished with, "And Ms. Costa, this is Ana, our new backend developer."

**Item:**
> Who introduced Ana to Ms. Costa?

| Slot | Value |
|------|-------|
| A | "Bruno" |
| B | "Ms. Costa" |
| C | "Ana" |
| D | **"Rafa"** ✓ |

**Key:** D

**Feedback:**
> **D** is right: Rafa says *"Ana, this is Ms. Costa"* and then closes with *"Ms. Costa, this is Ana"*. **A** only greets Ana, **B** only answers the greeting, and **C** is the person being introduced. Tracking who speaks each line is the skill being tested here.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: grm_introducing_others_this_is_001
skill: `grammar.demonstrative_this`
type: `gap_fill`
difficulty_b: -1.0
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_greetings_intro`
distractors:
  - option: "She"
    br_pt_form: "Ela é a Ana."
    note: "Portuguese uses the same verb for identifying and describing, so the learner transfers the pattern"
  - option: "There"
    br_pt_form: "Está a Ana ali."
    note: "there locates somebody; it does not introduce the person to the room"
  - option: "These"
    br_pt_form: "Estas são as Anas."
    note: "plural demonstrative with a singular referent; Portuguese agrees in number here too"
```

**Item:**
> Rafa: "Bruno, ___ is Ana, our new backend developer."

| Slot | Value |
|------|-------|
| A | **"This"** ✓ |
| B | "She" |
| C | "There" |
| D | "These" |

**Key:** A

**Feedback:**
> **A** is the introduction form: *this is* presents a new person. **B** would describe somebody the room already knows, which defeats the purpose of the introduction. **C** points to a location, and **D** needs a plural referent. This is a deliberate re-teach from the greetings lesson with a new carrier sentence.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: voc_introducing_others_reaction_001
skill: `vocab.intro_reaction_gradation`
type: `contextual_selection`
difficulty_b: -1.3
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_greetings_intro`
distractors:
  - option: "I've heard a lot about you."
    br_pt_form: "Ouvi falar muito de você."
    note: "a natural Portuguese phrase that overclaims familiarity for somebody who arrived yesterday"
  - option: "Nice to see you again."
    br_pt_form: "Que bom te ver de novo."
    note: "presupposes a previous meeting, which this situation does not provide"
  - option: "Welcome back."
    br_pt_form: "Bem-vindo de volta."
    note: "presupposes an absence; the person is arriving for the first time"
```

**Item:**
> Ana started at the company **yesterday**. Someone introduces her to the team. Which reaction fits?

| Slot | Value |
|------|-------|
| A | "I've heard a lot about you." |
| B | "Nice to see you again." |
| C | **"Nice to meet you."** ✓ |
| D | "Welcome back." |

**Key:** C

**Feedback:**
> **C** is the only option that needs no background story. **A** claims a shared reputation that a one-day-old colleague cannot have; if you want to be warm, talk about *the project* instead. **B** asserts a prior meeting, and **D** asserts a prior absence. Both would make the newcomer correct you.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: prn_introducing_others_h_aspirated_001
skill: `pronunciation.h_aspirated`
type: `minimal_pair_production`
difficulty_b: -0.6
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *Hi* /haɪ/ starts with breath; *I* /aɪ/ does not. In Portuguese, *oi* begins with a vowel, so the /h/ has to be built from scratch.
**Step 2 — identify:** is there audible breath before the vowel?
**Step 3 — produce (ASR-scored):** read aloud:

> "Hi Ana, nice to meet you. I'd like you to meet Ms. Costa, our engineering manager."

**Target phonemes:** /h/ in *Hi* · weak /tə/ in *nice to* · voiced /ð/ in *this* sequence when repeated by the model.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `coherence.reciprocal_introduction` | Item 1 missed | **L2, day granularity** | Schema error, not a vocabulary gap. The review must use a new three-person set. |
| `vocab.introduction_register_title` | Item 2 missed | **L2** | Rebuild the peer versus manager contrast with new names and roles. |
| `pronunciation.h_aspirated` | Pronunciation item missed twice across packs | **L2 → L3** | The rule is known by then; route to guided production, not more recognition. |

---

## 4. VALIDATION NOTES

1. The coherence item keeps a `coherence.*` skill and declares `domain: grammar`; `coherence` is a skill namespace, not a sixth tracking domain.
2. The article point is assessed through the possessive *our* and through *a backend developer*; both are taught in the lesson's trap table.
3. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
4. All `b` values are priors, per `assessment-item-spec.md` §8.2.
5. All items are original authored material; no external source text is reproduced or adapted.
