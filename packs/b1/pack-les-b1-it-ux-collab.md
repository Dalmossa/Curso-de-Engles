# Practice Pack — `les_b1_it_ux_collab`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_it_ux_collab_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_it_ux_collab.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_ux_collab_v1
lesson_id: les_b1_it_ux_collab
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
item_id: grm_ux_collab_modals_001
skill: `grammar.ux_accessibility_modals`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Buttons should have at least 4.5:1 contrast."
    br_pt_form: "Os botões deveriam ter pelo menos 4.5:1 de contraste."
    note: "'should' is a recommendation, while this is a WCAG AA requirement that needs 'must'"
  - option: "Buttons must not have at least 4.5:1 contrast."
    br_pt_form: "Os botões não devem ter pelo menos 4.5:1 de contraste."
    note: "the negative modal reverses the requirement instead of enforcing it"
  - option: "Buttons must has at least 4.5:1 contrast."
    br_pt_form: "Os botões deve ter pelo menos 4.5:1 de contraste."
    note: "a modal is followed by the base form 'have', never 'has'"
```

**Item:**
> You are writing a requirement for a custom button. Which sentence states the contrast rule correctly?

| Slot | Value |
|------|-------|
| A | "Buttons should have at least 4.5:1 contrast." |
| B | **"Buttons must have at least 4.5:1 contrast."** ✓ |
| C | "Buttons must not have at least 4.5:1 contrast." |
| D | "Buttons must has at least 4.5:1 contrast." |

**Key:** B

**Feedback:**
> A requirement uses **must + base form**: **`Buttons must have at least 4.5:1 contrast.`** **A** weakens it to a recommendation, **C** turns the rule into a prohibition, and **D** breaks the modal with *has*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_ux_collab_handoff_note_001
skill: `reading.ux_collab_handoff_scan`
type: `detail_identification`
difficulty_b: -0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The success rate."
    br_pt_form: "A taxa de sucesso."
    note: "88% is reported as a result, not as a blocked item"
  - option: "The user flow."
    br_pt_form: "O fluxo do usuário."
    note: "the flow is listed as covered by the prototype, so it is not blocked"
  - option: "The persona profile."
    br_pt_form: "O perfil da persona."
    note: "Ana is context for the test, not an open item in the note"
```

**Stimulus:**
> "Handoff note: The clickable prototype covers login → dashboard → export. The persona is Ana, a keyboard-only accountant. Usability test: 5 users, success rate 88%. Blocked item: the custom select still needs an accessible name; the primary button contrast is 3:1."

**Item:**
> Which part of the handoff note is blocked for the next iteration?

| Slot | Value |
|------|-------|
| A | The success rate. |
| B | The user flow. |
| C | **The accessible name and the button contrast.** ✓ |
| D | The persona profile. |

**Key:** C

**Feedback:**
> The note says **`Blocked item: the custom select still needs an accessible name; the primary button contrast is 3:1`**. **A** is a measured result, **B** is already covered, and **D** only describes the persona.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_ux_collab_persona_001
skill: `vocab.ux_collab_people`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "The wireframe."
    br_pt_form: "O wireframe."
    note: "a wireframe is a low-fidelity structure sketch, not a profile of a user"
  - option: "The mockup."
    br_pt_form: "O mockup."
    note: "a mockup shows the visual design, not who the typical user is"
  - option: "The handoff note."
    br_pt_form: "A nota de handoff."
    note: "the note records decisions; it does not represent the user"
```

**Item:**
> Which artifact is a fictional profile of the typical user that guides design decisions?

| Slot | Value |
|------|-------|
| A | "The wireframe." |
| B | **"The persona."** ✓ |
| C | "The mockup." |
| D | "The handoff note." |

**Key:** B

**Feedback:**
> **`The persona`** is the fictional user profile the team designs for. **A** is structure, **C** is visual appearance, and **D** is the record passed to development.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_ux_collab_a11y_check_001
skill: `reading.ux_collab_checklist_detail`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The focus order."
    br_pt_form: "A ordem de foco."
    note: "the checklist says the focus order already follows the visual order"
  - option: "The error message."
    br_pt_form: "A mensagem de erro."
    note: "the error uses an icon plus text, so it passes the color-alone check"
  - option: "The button contrast."
    br_pt_form: "O contraste do botão."
    note: "the primary button is confirmed at 4.5:1, so this check passes"
```

**Stimulus:**
> "Accessibility checklist: The focus order follows the visual order. The error message uses an icon plus text, not color alone. The primary button has 4.5:1 contrast. The custom select has no ARIA name yet."

**Item:**
> Which accessibility check is still failing?

| Slot | Value |
|------|-------|
| A | The focus order. |
| B | The error message. |
| C | The button contrast. |
| D | **The custom select name.** ✓ |

**Key:** D

**Feedback:**
> Only one line is still open: **`The custom select has no ARIA name yet`**. **A**, **B** and **C** are all described as already satisfied, so none of them is the failing check.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_ux_collab_stress_001
skill: `pronunciation.ux_collab_tech_stress`
type: `minimal_pair_production`
difficulty_b: 0.2
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_ux_collab_stress_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *PROTotype* /ˈproʊtətaɪp/ carries the stress on the first syllable, while the pt-BR rhythm *pro-TÓ-tipo* moves it to the middle. *PERsona* /ˈpɜːrsənə/ and *CONtrast* /ˈkɑːntræst/ also start strong; *accessible* /əkˈsesəbəl/ is the one that stresses the second syllable.

**Step 2 — produce (ASR-scored):** read aloud:

> "The prototype, the persona and the contrast check are in the handoff note."

**Target phonemes:** /ˈproʊtətaɪp/ in *prototype* · /ˈpɜːrsənə/ in *persona* · /ˈkɑːntræst/ with final /æ/ in *contrast* · /s/ in *accessible*, never /ks/ → /aks/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_ux_collab_requirement_must_001
skill: `grammar.ux_requirement_modals_review`
type: `error_correction`
difficulty_b: -0.2
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a2_modals_can_need
distractors:
  - option: "A keyboard-only user can finishes the flow."
    br_pt_form: "Um usuário que usa só o teclado termina o fluxo."
    note: "after 'can' the verb stays in the base form, without -s"
  - option: "A keyboard-only user can to finish the flow."
    br_pt_form: "Um usuário que usa só o teclado pode a terminar o fluxo."
    note: "modals are followed directly by the bare infinitive, with no 'to'"
  - option: "A keyboard-only user cans finish the flow."
    br_pt_form: "Um usuário que usa só o teclado cans termina o fluxo."
    note: "'can' has no third-person -s form; 'cans' is not a word"
```

**Item:**
> Reviewing modals before a UX review, which sentence correctly says that a keyboard-only user is able to finish the flow?

| Slot | Value |
|------|-------|
| A | "A keyboard-only user can finishes the flow." |
| B | **"A keyboard-only user can finish the flow."** ✓ |
| C | "A keyboard-only user can to finish the flow." |
| D | "A keyboard-only user cans finish the flow." |

**Key:** B

**Feedback:**
> *Can* takes the bare infinitive: **`A keyboard-only user can finish the flow.`** **A** adds *-s* after the modal, **C** inserts *to*, and **D** invents the form *cans*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_ux_collab_prereq_terms_001
skill: `vocab.it_terms_core_review`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "The wireframe."
    br_pt_form: "O wireframe."
    note: "a wireframe is a design artifact, not a screen in the product flow"
  - option: "The prototype."
    br_pt_form: "O protótipo."
    note: "the prototype is the testable model, not the screen reached after login"
  - option: "The feedback."
    br_pt_form: "O feedback."
    note: "feedback is the comment collected from users, not a destination in the flow"
```

**Item:**
> Skim this flow label: "login → dashboard → export report". Which term names the screen a user reaches right after login?

| Slot | Value |
|------|-------|
| A | **"The dashboard."** ✓ |
| B | "The wireframe." |
| C | "The prototype." |
| D | "The feedback." |

**Key:** A

**Feedback:**
> In the label, **`dashboard`** comes immediately after *login*. **B** and **C** name design artifacts rather than product screens, and **D** is user input, not a destination.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `ux_requirement_modals` | Item 1 or item 6 missed | **L2** | Contrast *must have* with *should have* and *must not be* in short requirement lines, then recycle *can + base form* from the prereq review. |
| `ux_artifact_mapping` | Item 3 missed | **L2** | Sort *wireframe*, *mockup*, *prototype*, *persona* and *handoff note* by function instead of by translation. |
| `ux_checklist_scan` | Items 2, 4 or 7 missed | **L2** | Scan a handoff note and an accessibility checklist for the one blocked item and the one failing check before answering detail questions. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_modals_can_need` and `les_a2_it_terms_basics` and carry `prereq_lesson` for the interleaving rule.
4. Item 2 asks for the blocked handoff item, while item 4 asks for the failing accessibility check; their stimuli carry different detail targets, so neither answer can be copied from the other.
5. Every item_id carries the distinctive `ux_collab` token, so no option or id collides with another lesson's pack.
6. All dialogues, definitions, stimuli, distractors and feedback texts were authored for this pack; no external source text is reproduced or adapted.
