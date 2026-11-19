# Practice Pack — `les_a2_it_system_unit`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_system_unit_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_system_unit.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_system_unit_v1
lesson_id: les_a2_it_system_unit
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
item_id: grm_sysunit_surface_slot_at_001
skill: `grammar.prepositions_of_place_system_unit`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "The status LED is in the front panel."
    br_pt_form: "O LED de status fica dentro do painel frontal."
    note: "'in' requires a bounded compartment; a panel is a surface and cannot contain the LED"
  - option: "The status LED is at the front panel."
    br_pt_form: "O LED de status fica junto ao painel frontal."
    note: "'at' identifies a point in a layout, but a mounted component on a surface takes 'on'"
  - option: "The status LED is onto the front panel."
    br_pt_form: "O LED de status vai para cima do painel frontal."
    note: "'onto' expresses movement toward a surface; the sentence describes a static position"
```

**Item:**
> A technician is describing a tower to a colleague who is opening it. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The status LED is in the front panel." |
| B | "The status LED is at the front panel." |
| C | **"The status LED is on the front panel."** ✓ |
| D | "The status LED is onto the front panel." |

**Key:** C

**Feedback:**
> A component mounted on a surface takes **`on`**: **`The status LED is on the front panel.`** **A** treats the panel as a container, **B** reduces the panel to a point in a layout, and **D** uses a preposition of movement where the position is static.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_sysunit_bench_note_001
skill: `reading.hardware_position_note`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "In the lower drive bay."
    br_pt_form: "Na baia inferior de discos."
    note: "the note calls the lower bay empty; only the drive was described there in the lesson dialogue"
  - option: "At the back of the case."
    br_pt_form: "Na parte de trás do gabinete."
    note: "that position belongs to the power supply and the vents, not to the card"
  - option: "On the front panel."
    br_pt_form: "No painel frontal."
    note: "the front panel holds the status LED and the power button, not the card"
```

**Stimulus:**
> "Bench note: the lower drive bay is empty. The card that handles graphics sits in the top expansion slot. The power supply is at the back, under the vents, and the status LED is on the front panel."

**Item:**
> Where does the note place the card?

| Slot | Value |
|------|-------|
| A | In the lower drive bay. |
| B | **In the top expansion slot.** ✓ |
| C | At the back of the case. |
| D | On the front panel. |

**Key:** B

**Feedback:**
> The note names the position directly: **`The card ... sits in the top expansion slot.`** **A** contradicts the note, which calls the lower bay empty, **C** moves the card to the power supply's position, and **D** moves it to the panel reserved for the LED and button.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_sysunit_drive_bay_001
skill: `vocab.hardware_system_unit_bay`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "motherboard tray"
    br_pt_form: "bandeja da placa-mãe"
    note: "the tray is the surface the board mounts on; it is not the compartment that holds a drive"
  - option: "expansion slot"
    br_pt_form: "slot de expansão"
    note: "an expansion slot receives a card, not a storage drive"
  - option: "front panel"
    br_pt_form: "painel frontal"
    note: "the front panel carries controls and the LED; it is a surface, not a drive compartment"
```

**Item:**
> You are writing a self-service guide. Which phrase names the compartment that holds a storage drive?

| Slot | Value |
|------|-------|
| A | motherboard tray |
| B | expansion slot |
| C | front panel |
| D | **drive bay** ✓ |

**Key:** D

**Feedback:**
> The compartment with depth for a storage drive is the **`drive bay`**. **A** is a mounting surface, **B** receives expansion cards, and **C** holds controls and indicators on the outside of the case.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_sysunit_ticket_vent_check_001
skill: `reading.hardware_assembly_note`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Remove the front panel."
    br_pt_form: "Remover o painel frontal."
    note: "the ticket explicitly says not to remove the front panel"
  - option: "Replace the card in the top slot."
    br_pt_form: "Trocar a placa no slot superior."
    note: "the ticket asks for confirmation about the card, not for a replacement"
  - option: "Reset the power button."
    br_pt_form: "Redefinir o botão de energia."
    note: "the power button is not mentioned as an action in the ticket"
```

**Stimulus:**
> "Ticket 214 — The machine is silent but warm. Please check the vents at the back, then confirm the card in the top expansion slot. Do not remove the front panel."

**Item:**
> Which action does the ticket ask the technician to perform first?

| Slot | Value |
|------|-------|
| A | Remove the front panel. |
| B | Replace the card in the top slot. |
| C | **Check the vents at the back.** ✓ |
| D | Reset the power button. |

**Key:** C

**Feedback:**
> The order is explicit: **`check the vents at the back`**, then confirm the card. **A** is forbidden by the ticket, **B** turns a confirmation into a replacement, and **D** introduces an action the ticket never requests.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_sysunit_vents_001
skill: `pronunciation.hardware_vents_fricatives`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *vent* /vent/ and *went* /went/ differ only in the first sound. For /v/, the lower lip touches the upper teeth and the voice is on; for /w/, the lips round and there is no tooth contact. *Thermal* /ˈθɜːrməl/ starts with the voiceless /θ/, while *the* /ðə/ starts with its voiced partner /ð/.

**Step 2 — produce (ASR-scored):** read aloud:

> "We check the thermal vents at the back of the case."

**Target phonemes:** /w/ in *we* · /θ/ in *thermal* · /v/ in *vents* · /ð/ in *the* · /k/ in *back*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_sysunit_present_simple_checks_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "The technician check the vents at the back."
    br_pt_form: "O técnico verificar as aberturas atrás."
    note: "a singular subject in the present simple needs the -s ending on the verb"
  - option: "The technician checking the vents at the back."
    br_pt_form: "O técnico verificando as aberturas atrás."
    note: "the -ing form alone has no finite verb; the auxiliary 'is' is missing"
  - option: "The technician do checks the vents at the back."
    br_pt_form: "O técnico faz verificar as aberturas atrás."
    note: "'do' with a third-person singular subject would be 'does', and the main verb would return to its base form"
```

**Item:**
> Reviewing the present simple before a hardware briefing, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The technician check the vents at the back." |
| B | **"The technician checks the vents at the back."** ✓ |
| C | "The technician checking the vents at the back." |
| D | "The technician do checks the vents at the back." |

**Key:** B

**Feedback:**
> A singular subject takes the base verb with **-s** in the present simple: **`The technician checks the vents at the back.`** **A** drops the ending, **C** has no finite verb, and **D** combines the wrong auxiliary with a doubled verb ending.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_sysunit_part_category_001
skill: `vocab.it_part_categories`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_computer_parts`
distractors:
  - option: "It is in the lower bay."
    br_pt_form: "Fica na baia inferior."
    note: "this answers 'where?', the position question owned by the current lesson"
  - option: "It is at the back of the case."
    br_pt_form: "Fica na parte de trás do gabinete."
    note: "another position answer; it does not name what kind of part the drive is"
  - option: "It is on the motherboard tray."
    br_pt_form: "Fica sobre a bandeja da placa-mãe."
    note: "a surface location, not a category"
```

**Item:**
> Reviewing `les_a2_it_computer_parts`: a colleague asks **what kind of part** the SSD is. Which answer fits that question?

| Slot | Value |
|------|-------|
| A | It is in the lower bay. |
| B | It is at the back of the case. |
| C | It is on the motherboard tray. |
| D | **It is a storage device.** ✓ |

**Key:** D

**Feedback:**
> The category question is answered by a noun phrase: **`It is a storage device.`** **A**, **B** and **C** all answer the position question instead, which is exactly the distinction this lesson draws against `les_a2_it_computer_parts`.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `system_unit_position_prepositions` | Item 1 missed | **L2** | Contrast *on the panel*, *in the bay* and *at the back* with one labelled sketch of a case. |
| `system_unit_bench_note_reading` | Items 2 and 4 missed | **L2** | Skim short bench notes for where a part sits and which action comes first. |
| `system_unit_function_relatives` | Item 7 missed | **L3** | Recycle *the part that holds ...* to separate a part's category from its position. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration; listening stays deferred for this pack.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_it_computer_parts` and carry `prereq_lesson` for the interleaving rule.
4. Every item and every distractor is authored for this lesson; no external source text, list or definition is reproduced or adapted.
