# Practice Pack — `les_a1_occupations`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_occupations_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_occupations.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_occupations_v1
lesson_id: les_a1_occupations
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
item_id: `voc_occupations_role_001`
skill: `vocab.occupations.what_do_you_do`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "What is your name?"
    br_pt_form: "Qual é o seu nome?"
    note: "asks for identity, not profession"
  - option: "How old are you?"
    br_pt_form: "Quantos anos você tem?"
    note: "asks for age; personal data unrelated to work small talk"
  - option: "Where is the meeting room?"
    br_pt_form: "Onde fica a sala de reunião?"
    note: "asks for a location; it does not learn anything about the person's job"
```

**Item:**
> You meet a new colleague at a technology event. What do you ask to learn the person's profession?

| Slot | Value |
|------|-------|
| A | "What is your name?" |
| B | **"What do you do?"** ✓ |
| C | "How old are you?" |
| D | "Where is the meeting room?" |

**Key:** B

**Feedback:**
> **`What do you do?`** is the natural question about profession in English. **A** asks for identity, **C** asks for age, and **D** asks for a location.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_occupations_a_an_001`
skill: `grammar.articles_a_an_occupations`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Ana is architect."
    br_pt_form: "Ana é arquiteta."
    note: "missing the indefinite article; a singular profession needs a or an"
  - option: "Ana is a architect."
    br_pt_form: "Ana é arquiteta."
    note: "wrong article for the vowel sound at the start of architect"
  - option: "Ana is the architect."
    br_pt_form: "Ana é a arquiteta (específica)."
    note: "the points to one specific already identified person; introducing a profession takes a/an"
```

**Item:**
> Choose the correct sentence to introduce Ana's profession.

| Slot | Value |
|------|-------|
| A | "Ana is architect." |
| B | "Ana is a architect." |
| C | **"Ana is an architect."** ✓ |
| D | "Ana is the architect." |

**Key:** C

**Feedback:**
> A singular profession takes **a/an**: **`Ana is an architect.`** **A** drops the article, **B** uses the wrong article, and **D** uses *the*, which only fits a specific, already identified person.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_occupations_intro_001`
skill: `reading.occupations_context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "He is a nurse."
    br_pt_form: "Ele é enfermeiro."
    note: "the nurse in the text is his sister, not Marcos"
  - option: "He is a support agent."
    br_pt_form: "Ele é agente de suporte."
    note: "he talks to the support team, but that is not his occupation"
  - option: "He is a doctor."
    br_pt_form: "Ele é médico."
    note: "another health profession with no support in the text"
```

**Stimulus:**
> "Hi, I'm Marcos. I work as a backend developer at a logistics company. Every morning I check the tickets and talk to the support team. My sister is a nurse, and she works at a big hospital in the city."

**Item:**
> What does Marcos do?

| Slot | Value |
|------|-------|
| A | "He is a nurse." |
| B | "He is a support agent." |
| C | "He is a doctor." |
| D | **"He is a backend developer."** ✓ |

**Key:** D

**Feedback:**
> The first sentence states it directly: **`I work as a backend developer`**. The nurse (**A**) is his sister, and the support team (**B**) is a group he talks to, not his profession. **C** never appears.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, prerequisite review

```yaml
item_id: `rdg_food_menu_001`
skill: `reading.food.menu_context`
type: `detail_identification`
difficulty_b: -0.4
cefr: A1
domain: reading
provenance: authored
prereq_lesson: `les_a1_food`
distractors:
  - option: "In a library."
    br_pt_form: "Em uma biblioteca."
    note: "a place with books and silence; no menu or food orders happen there"
  - option: "In a hospital."
    br_pt_form: "Em um hospital."
    note: "health care setting; it does not serve a daily menu to customers"
  - option: "In a gym."
    br_pt_form: "Em uma academia."
    note: "a place for exercise; it is not where a waiter takes a food order"
```

**Stimulus:**
> "Waiter: Good evening. Here is the menu. Today the special is grilled chicken with rice. Customer: Thank you. I also want a glass of water, please. Waiter: Of course. I will bring it right away."

**Item:**
> Where does this conversation most likely happen?

| Slot | Value |
|------|-------|
| A | "In a library." |
| B | **"In a restaurant."** ✓ |
| C | "In a hospital." |
| D | "In a gym." |

**Key:** B

**Feedback:**
> The words **menu**, **special**, **grilled chicken**, and **waiter** describe a restaurant order. None of the other places has a waiter taking a food order.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, current lesson

```yaml
item_id: `grm_occupations_a_vs_the_001`
skill: `grammar.articles_a_an_occupations`
type: `error_correction`
difficulty_b: 0.0
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "I am the developer."
    br_pt_form: "Eu sou o desenvolvedor (específico)."
    note: "the implies one specific already identified developer; a self-introduction of profession uses a"
  - option: "I am developer."
    br_pt_form: "Eu sou desenvolvedor."
    note: "drops the article; pt-BR does, but English requires a/an with a singular profession"
  - option: "I am an developer."
    br_pt_form: "Eu sou desenvolvedor."
    note: "wrong article for the consonant sound at the start of developer"
```

**Item:**
> A new colleague introduces himself at a stand-up meeting. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I am the developer." |
| B | "I am developer." |
| C | **"I am a developer."** ✓ |
| D | "I am an developer." |

**Key:** C

**Feedback:**
> When you state your own profession, use **a/an**: **`I am a developer.`** **A** points at a specific, already identified developer, **B** omits the required article, and **D** uses the article for vowel sounds with a consonant sound.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_food_restaurant_roles_001`
skill: `vocab.food.restaurant_roles`
type: `contextual_selection`
difficulty_b: -0.6
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_food`
distractors:
  - option: "The waiter."
    br_pt_form: "O garçom."
    note: "serves the food and takes the order; he does not cook it"
  - option: "The customer."
    br_pt_form: "O cliente."
    note: "the person who orders and eats; cooking is not this role"
  - option: "The cashier."
    br_pt_form: "O caixa."
    note: "handles the payment at the end, not the kitchen work"
```

**Item:**
> Review from Food & Drink: in a restaurant, who cooks the food?

| Slot | Value |
|------|-------|
| A | "The waiter." |
| B | "The customer." |
| C | "The cashier." |
| D | **"The cook."** ✓ |

**Key:** D

**Feedback:**
> **`The cook.`** works in the kitchen and prepares the food. The waiter serves it, the customer eats it, and the cashier handles the bill.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_occupations_v_er_001`
skill: `pronunciation.occupations_v_er`
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

**Step 1 — hear the contrast:** *developer* /dɪˈvɛləpər/ uses /v/: lower lip against the upper teeth, with voice — not the /w/ sound. The final *-er* is a soft, non-vibrating /ɚ/.
**Step 2 — produce (ASR-scored):** read aloud:

> "I work as a developer, and my manager is a very good engineer."

**Target phonemes:** /v/ in *developer* and *very* · soft final /ɚ/ in *developer, manager, engineer*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `articles_a_an_professions` | Item 2 or Item 5 missed | **L2** | Drill *a/an* with tech roles (*a backend developer*, *an analyst*, *a UX designer*) using the sound rule. |
| `occupations_self_introduction` | Item 1 missed | **L2** | Chain *What do you do?* → *I work as...* → *Where do you work?* in short work introductions. |
| `occupations_v_er_contrast` | Item 7 blocked or failed | **L2** | Contrast /v/ and /w/ in *developer / very / leave* until the ASR score stabilizes. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.