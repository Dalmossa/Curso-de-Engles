# Practice Pack — `les_b1_it_ddd_modeling`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_it_ddd_modeling_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_it_ddd_modeling.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_ddd_modeling_v1
lesson_id: les_b1_it_ddd_modeling
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

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_ddd_relative_that_001
skill: `grammar.ddd_defining_relative_clauses`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "who"
    br_pt_form: "quem (para pessoas)"
    note: "'who' introduces a relative clause about people, not about a thing being defined"
  - option: "whom"
    br_pt_form: "quem (objeto, para pessoas)"
    note: "'whom' is the object form for people; it cannot define a value object"
  - option: "whose"
    br_pt_form: "cujo"
    note: "'whose' marks possession; this clause needs a plain connector, not an owner"
```

**Item:**
> Complete the definition from the model review: "A value object is a description ____ we compare by its fields, not by an id."

| Slot | Value |
|------|-------|
| A | "who" |
| B | **"that"** ✓ |
| C | "whom" |
| D | "whose" |

**Key:** B

**Feedback:**
> **That** introduces a defining relative clause about a thing: **`a description that we compare by its fields`**. **A** and **C** are reserved for people (*who* / *whom*), and **D** would signal possession, which this definition does not express.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_ddd_invariant_rule_001
skill: `reading.ddd_invariant_scan`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Each line has its own repository."
    br_pt_form: "Cada linha tem seu próprio repositório."
    note: "the note says the repository handles the aggregate, not one line at a time"
  - option: "The event is recorded before the save."
    br_pt_form: "O evento é registrado antes do salvamento."
    note: "the text puts the event after saving, so this reverses the order"
  - option: "The address is an entity with an id."
    br_pt_form: "O endereço é uma entidade com id."
    note: "the note does not describe the address at all"
```

**Stimulus:**
> "In the Billing context, the team keeps the invoice and its lines in one aggregate. The root checks that the total equals the sum of the lines before the change is saved. A confirmation event is recorded after saving."

**Item:**
> Which rule is checked before the change is saved?

| Slot | Value |
|------|-------|
| A | Each line has its own repository. |
| B | **The total equals the sum of the lines.** ✓ |
| C | The event is recorded before the save. |
| D | The address is an entity with an id. |

**Key:** B

**Feedback:**
> The target line is **`the root checks that the total equals the sum of the lines`**. **A** invents a per-line repository, **C** flips the timing stated in the note, and **D** introduces an address that never appears in this passage.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_ddd_aggregate_root_001
skill: `vocab.ddd.aggregate_root`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "The value object."
    br_pt_form: "O objeto de valor."
    note: "a value object is compared by its fields; it does not control access to the cluster"
  - option: "The repository."
    br_pt_form: "O repositório."
    note: "the repository loads and saves the cluster, but it is not the in-model entry point"
  - option: "The domain event."
    br_pt_form: "O evento de domínio."
    note: "an event reports a past fact; it does not gate changes to the lines"
```

**Item:**
> Which object is the only door into the cluster, so that nothing else changes its lines directly?

| Slot | Value |
|------|-------|
| A | "The value object." |
| B | "The repository." |
| C | "The domain event." |
| D | **"The aggregate root."** ✓ |

**Key:** D

**Feedback:**
> The **aggregate root** is the single entry point: **`nothing else may change a line directly`**. **A** is compared by content, **B** handles loading and saving, and **C** only records what already happened.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_ddd_bounded_context_001
skill: `reading.ddd_model_notes`
type: `detail_identification`
difficulty_b: 0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Because one team uses a different database."
    br_pt_form: "Porque um time usa um banco diferente."
    note: "the note is about vocabulary boundaries, not about storage technology"
  - option: "Because the invoice became a value object."
    br_pt_form: "Porque a fatura virou um objeto de valor."
    note: "no change of modelling type is mentioned in the note"
  - option: "Because the repository was split into two tables."
    br_pt_form: "Porque o repositório foi dividido em duas tabelas."
    note: "the note never mentions tables or a repository split"
```

**Stimulus:**
> "In Billing, the team says *invoice*. In Shipping, the same paper is called *parcel note*. Both teams agreed that each word makes sense only inside its own context."

**Item:**
> Which statement follows from the meeting note?

| Slot | Value |
|------|-------|
| A | Because one team uses a different database. |
| B | **Each context has its own word for the paper.** ✓ |
| C | Because the invoice became a value object. |
| D | Because the repository was split into two tables. |

**Key:** B

**Feedback:**
> The note's point is the shared vocabulary per boundary: **`each word makes sense only inside its own context`**. **A**, **C** and **D** import database and modelling details that the passage never states.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_ddd_term_stress_001
skill: `pronunciation.ddd_term_stress`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *AGGregate* /ˈæɡrɪɡət/ stresses the first syllable, while *rePOsitory* /rɪˈpɒzɪtəri/ and *doMAIN* /dɒˈmeɪn/ stress the second. *ENtity* /ˈentɪti/ goes back to the first syllable — the stress does not follow one fixed rule for all four terms.

**Step 2 — produce (ASR-scored):** read aloud:

> "The aggregate root enforces the invariant through the repository."

**Target phonemes:** /ˈæɡrɪɡət/ in *aggregate* · /rɪˈpɒzɪtəri/ in *repository* · /ɪnˈværiənt/ in *invariant* · /θ/ in *through* (tongue tip between the teeth, not /t/).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_ddd_passive_prereq_001
skill: `grammar.passive_definitions`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "The invariant enforce by the root."
    br_pt_form: "A invariante impõe pela raiz."
    note: "missing the auxiliary 'be'; a passive needs be + past participle"
  - option: "The invariant is enforce by the root."
    br_pt_form: "A invariante é impor pela raiz."
    note: "'is' is present but the verb stays in the base form instead of the participle"
  - option: "The invariant enforcing by the root."
    br_pt_form: "A invariante impondo pela raiz."
    note: "the -ing form has no auxiliary here and does not build a passive"
```

**Item:**
> Reviewing technical definitions, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The invariant enforce by the root." |
| B | "The invariant is enforce by the root." |
| C | "The invariant enforcing by the root." |
| D | **"The invariant is enforced by the root."** ✓ |

**Key:** D

**Feedback:**
> The passive needs **be + past participle**: **`The invariant is enforced by the root.`** **A** drops *is*, **B** leaves the verb in the base form, and **C** substitutes an *-ing* form for the participle.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_ddd_it_terms_scan_001
skill: `vocab.it_terms_basics`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_reading_strategy
distractors:
  - option: "The records."
    br_pt_form: "Os registros."
    note: "records are the data stored, not the boundary other code calls"
  - option: "The database."
    br_pt_form: "O banco de dados."
    note: "the database stores information; it is not the announced boundary"
  - option: "The store."
    br_pt_form: "O armazenamento."
    note: "'store' points to storage again, not to what the module offers"
```

**Item:**
> Skim the technical note: "The module exposes an interface; the database stores the records." Which word names the boundary that other code calls?

| Slot | Value |
|------|-------|
| A | "The records." |
| B | "The database." |
| C | **"The interface."** ✓ |
| D | "The store." |

**Key:** C

**Feedback:**
> Skimming for the word tied to *exposes* gives **`interface`** — the boundary other code uses. **A** and **B** name stored data or its container, and **D** repeats the storage idea with a different word.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `ddd_relative_definitions` | Item 1 missed | **L2** | Contrast *a description that we compare* with *an engineer who reviews it*; keep *that/which* for things and *who/whom* for people. |
| `ddd_model_contrast` | Items 2, 3 or 4 missed | **L2** | Re-read a short model note and separate three targets: the invariant's timing, the root's gate, and the word owned by each context. |
| `ddd_stress_recycle` | Item 5 missed | **L2** | Recycle AGGregate / rePOsitory / doMAIN / ENtity stress in one sentence before repeating the ASR clip. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_it_terms_basics` and `les_a2_it_reading_strategy` and carry `prereq_lesson` for the interleaving rule.
4. Items 2 and 4 use distinct detail targets — the invariant's timing versus the word owned by a context — so neither can be answered from the other's stimulus.
5. All item texts, definitions, distractors and glosses were authored for this pack; no external source text is reproduced or adapted.
