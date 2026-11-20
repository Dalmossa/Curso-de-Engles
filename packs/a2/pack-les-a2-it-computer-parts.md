# Practice Pack — `les_a2_it_computer_parts`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_computer_parts_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_computer_parts.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_computer_parts_v1
lesson_id: les_a2_it_computer_parts
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
item_id: grm_parts_has_gpu_001
skill: `grammar.hardware_present_simple_has`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "The new laptop have a dedicated GPU."
    br_pt_form: "O notebook novo tem uma GPU dedicada."
    note: "'have' is the base form; a singular subject requires the -s ending in present simple"
  - option: "The new laptop is having a dedicated GPU."
    br_pt_form: "O notebook novo está tendo uma GPU dedicada."
    note: "the progressive suggests a temporary action and does not describe a built-in part"
  - option: "The new laptop haves a dedicated GPU."
    br_pt_form: "O notebook novo haves uma GPU dedicada."
    note: "'haves' is not a word; the third-person singular of 'have' is 'has'"
```

**Item:**
> You are confirming the configuration of a new laptop. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The new laptop have a dedicated GPU." |
| B | **"The new laptop has a dedicated GPU."** ✓ |
| C | "The new laptop is having a dedicated GPU." |
| D | "The new laptop haves a dedicated GPU." |

**Key:** B

**Feedback:**
> A singular subject takes **has** in the present simple: **`The new laptop has a dedicated GPU.`** **A** uses the base form *have*, **C** turns a permanent part into a temporary action, and **D** invents the form *haves*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_parts_ssd_upgrade_001
skill: `reading.hardware_spec_skim`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The RAM."
    br_pt_form: "A memória RAM."
    note: "the note says the RAM is fine for now, so it is not the planned upgrade"
  - option: "The GPU."
    br_pt_form: "A GPU."
    note: "the GPU is described as integrated, but no upgrade is planned for it"
  - option: "The battery."
    br_pt_form: "A bateria."
    note: "the battery is mentioned only as lasting eight hours, not as an upgrade"
```

**Stimulus:**
> "Our new laptop has 16 GB of RAM, a 512 GB SSD and an integrated GPU. The RAM is fine for now. Ana will replace the SSD next month because the build needs more space. The battery lasts about eight hours."

**Item:**
> Which part will Ana replace next month?

| Slot | Value |
|------|-------|
| A | The RAM. |
| B | **The SSD.** ✓ |
| C | The GPU. |
| D | The battery. |

**Key:** B

**Feedback:**
> The note states **`Ana will replace the SSD next month`** because the build needs more space. **A** is explicitly fine for now, **C** is only described as integrated, and **D** is mentioned for its duration, not for a replacement.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_parts_motherboard_001
skill: `vocab.hardware.core_parts`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "The cooling fan."
    br_pt_form: "A ventoinha de resfriamento."
    note: "the fan removes heat; it does not connect the components"
  - option: "The power supply."
    br_pt_form: "A fonte de alimentação."
    note: "the power supply distributes energy; it is not the board that holds the parts"
  - option: "The Wi-Fi card."
    br_pt_form: "A placa de rede Wi-Fi."
    note: "the Wi-Fi card handles one function only, not the connection of all parts"
```

**Item:**
> A colleague asks which part connects the CPU, the RAM, the SSD and the ports inside the laptop. Which answer is correct?

| Slot | Value |
|------|-------|
| A | "The cooling fan." |
| B | "The power supply." |
| C | "The Wi-Fi card." |
| D | **"The motherboard."** ✓ |

**Key:** D

**Feedback:**
> **`The motherboard`** is the board that receives the CPU, the RAM, the SSD and the ports. **A** cools the machine, **B** distributes power, and **C** only provides network access.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_parts_warranty_battery_001
skill: `reading.hardware_warranty_detail`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The fan."
    br_pt_form: "A ventoinha."
    note: "the fan is covered for twelve months with no charge condition attached"
  - option: "The keyboard."
    br_pt_form: "O teclado."
    note: "the keyboard is excluded for liquid damage, which is an exclusion, not a charge condition"
  - option: "The trackpad."
    br_pt_form: "O trackpad."
    note: "the trackpad is not mentioned in the warranty note at all"
```

**Stimulus:**
> "Warranty note: the fan is covered for twelve months. The battery is covered only if it holds more than 80% of its original charge. The keyboard is not covered for liquid damage."

**Item:**
> Which part has a warranty that depends on a charge condition?

| Slot | Value |
|------|-------|
| A | The fan. |
| B | The keyboard. |
| C | The trackpad. |
| D | **The battery.** ✓ |

**Key:** D

**Feedback:**
> Only the battery has a conditional warranty: **`covered only if it holds more than 80% of its original charge`**. **A** has a plain twelve-month cover, **B** has an exclusion for liquid damage, and **C** is absent from the note.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_parts_word_stress_001
skill: `pronunciation.hardware_word_stress`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_parts_word_stress_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *MOTHERboard* /ˈmʌðərˌbɔːrd/ puts the stress on the first part, while *motherBOARD* shifts it to the end. *POWER supply* /ˈpaʊər/ behaves the same way, and *GPU* /ˌdʒiː piː ˈjuː/ is three letters with the stress on the last one — never one flat syllable.

**Step 2 — produce (ASR-scored):** read aloud:

> "The motherboard, the power supply and the GPU are on the bench."

**Target phonemes:** /ð/ in *motherboard* · /ˈpaʊər/ in *power* · /ˌdʒiː piː ˈjuː/ in *GPU* · /tʃ/ final in *bench* (release the cluster; do not add a final vowel).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_parts_regular_s_001
skill: `grammar.hardware_regular_verbs_s`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_present_simple
distractors:
  - option: "The cooling fans runs quietly."
    br_pt_form: "As ventoinhas roda silenciosamente."
    note: "a plural subject takes the base verb; -s belongs to the third-person singular"
  - option: "The cooling fan run quietly."
    br_pt_form: "A ventoinha rodam silenciosamente."
    note: "a singular subject needs -s on the present simple verb"
  - option: "The cooling fans are run quietly."
    br_pt_form: "As ventoinhas são rodadas silenciosamente."
    note: "the passive changes the meaning; the fans run by themselves"
```

**Item:**
> Reviewing the present simple before a hardware call, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The cooling fans runs quietly." |
| B | "The cooling fan run quietly." |
| C | "The cooling fans are run quietly." |
| D | **"The cooling fans run quietly."** ✓ |

**Key:** D

**Feedback:**
> A plural subject uses the base verb: **`The cooling fans run quietly.`** **A** adds *-s* to a plural, **B** omits *-s* from a singular subject, and **C** turns an intransitive action into a passive one.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_parts_label_skim_001
skill: `vocab.hardware.part_label_scan`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a1_reading_skimming
distractors:
  - option: "4 GB DDR4"
    br_pt_form: "Memória DDR4 de 4 GB"
    note: "DDR4 names the memory, not the storage device"
  - option: "2 USB-C"
    br_pt_form: "Duas portas USB-C"
    note: "USB-C names the ports used to connect devices, not storage"
  - option: "DDR4 slot"
    br_pt_form: "Slot de DDR4"
    note: "a slot is a connector on the board; it is not the part that stores files"
```

**Item:**
> Skim this inventory label: "4 GB DDR4 • 256 GB M.2 • 2 USB-C". Which label names the storage part?

| Slot | Value |
|------|-------|
| A | "4 GB DDR4" |
| B | **"256 GB M.2"** ✓ |
| C | "2 USB-C" |
| D | "DDR4 slot" |

**Key:** B

**Feedback:**
> **`256 GB M.2`** is the storage entry; the capacity in GB is the clue you skim for. **A** is memory, **C** is a pair of ports, and **D** is a connector, not a storage device.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `hardware_has_agreement` | Item 1 or item 6 missed | **L2** | Contrast *the laptop has* with *the fans run* in short spec sentences, so the -s rule is tied to the subject. |
| `part_function_mapping` | Item 3 missed | **L2** | Recycle *motherboard*, *power supply*, *cooling fan* and *Wi-Fi card* as function questions instead of bare translations. |
| `spec_detail_skimming` | Items 2, 4 or 7 missed | **L2** | Skim a spec sheet for the upgrade, the conditional warranty line and the storage label before answering detail questions. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a1_reading_skimming` and carry `prereq_lesson` for the interleaving rule.
4. Item 2's stimulus and item 4's warranty note use distinct detail targets (upgrade vs. conditional cover), so neither can be answered by the other's sentence.
5. All part names, definitions, dialogues and distractors were authored for this pack; no external source text is reproduced or adapted.
