# Practice Pack — `les_a2_it_roles_hierarchy`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_roles_hierarchy_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_roles_hierarchy.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_roles_hierarchy_v1
lesson_id: les_a2_it_roles_hierarchy
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
item_id: grm_roles_hierarchy_report_to_001
skill: `grammar.roles_report_to`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "I report for Priya."
    br_pt_form: "Eu reporto para a Priya (como se fizesse o trabalho por ela)."
    note: "'for' means doing something on someone's behalf, not being in someone's chain of command"
  - option: "I report with Priya."
    br_pt_form: "Eu reporto junto com a Priya."
    note: "'with' describes two people acting together; it cannot express who is above you"
  - option: "I report at Priya."
    br_pt_form: "Eu reporto na Priya."
    note: "'at' points to a place or target, and is the literal transfer of the Portuguese 'à/na'"
```

**Item:**
> A new teammate asks who her line manager is. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I report for Priya." |
| B | "I report with Priya." |
| C | **"I report to Priya."** ✓ |
| D | "I report at Priya." |

**Key:** C

**Feedback:**
> Hierarchy uses the fixed pair *report to*: **`I report to Priya.`** **A** says you report *on her behalf*, **B** makes you report *together with her*, and **D** turns the Portuguese *à/na* into a preposition of place. In pt-BR you "reporto para/à" someone; in en-US you always *report to* them.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_roles_hierarchy_chain_001
skill: `reading.roles_chain`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Bruno, the tech lead."
    br_pt_form: "Bruno, o lead técnico."
    note: "he reviews code and unblocks work; he does not sign leave requests"
  - option: "The VP of Engineering."
    br_pt_form: "O vice-presidente de engenharia."
    note: "the VP is two rungs above Priya, not Lia's direct line manager"
  - option: "The CTO."
    br_pt_form: "O CTO (diretor de tecnologia)."
    note: "the CTO owns technical direction for the whole company, not individual leave"
```

**Stimulus:**
> "Org note — Bruno is the tech lead. Lia reports to Priya, the engineering manager. Priya reports to the VP of Engineering, who reports to the CTO."

**Item:**
> Who approves Lia's leave?

| Slot | Value |
|------|-------|
| A | Bruno, the tech lead. |
| B | **Priya, the engineering manager.** ✓ |
| C | The VP of Engineering. |
| D | The CTO. |

**Key:** B

**Feedback:**
> The note says **`Lia reports to Priya, the engineering manager.`** — that is the person who approves leave. **A** confuses technical unblocking with people management, **C** jumps one rung too high, and **D** confuses company-wide technical direction with a day-to-day approval.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_roles_hierarchy_lead_manager_001
skill: `vocab.roles_tech_ic_vs_manager`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Your engineering manager."
    br_pt_form: "Sua gerente de engenharia."
    note: "the common L1 guess: in en-US this role manages people, not the code you ship today"
  - option: "The CTO."
    br_pt_form: "O CTO (diretor de tecnologia)."
    note: "too high in the ladder: the CTO sets direction, not your next code review"
  - option: "The VP of Engineering."
    br_pt_form: "O vice-presidente de engenharia."
    note: "above the manager and far from your pull request; the title does not fit the task"
```

**Item:**
> You need a code review and help with a blocked build before standup. Who is the usual first contact?

| Slot | Value |
|------|-------|
| A | Your engineering manager. |
| B | The CTO. |
| C | The VP of Engineering. |
| D | **Your tech lead.** ✓ |

**Key:** D

**Feedback:**
> The person who reviews your code and unblocks your work is **`your tech lead`**. **A** is the classic Brazilian transfer — the *gerente* is a people manager, not your daily technical partner. **B** and **C** are senior titles whose work is direction and oversight, not your blocked build.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_roles_hierarchy_rung_scan_001
skill: `reading.roles_rung_scan`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Lia."
    br_pt_form: "A Lia."
    note: "she only wrote the message; nothing says she signs the ticket"
  - option: "Rafael, the staff engineer."
    br_pt_form: "Rafael, o engenheiro staff."
    note: "he is reviewing the migration, which is a different task from signing the change"
  - option: "Priya, the engineering manager."
    br_pt_form: "Priya, a gerente de engenharia."
    note: "the note says she is on leave, so the signature passes to someone else"
```

**Stimulus:**
> "Hi Lia — I'm the SRE on call tonight. Our staff engineer, Rafael, is reviewing the migration. Priya is on leave, so the VP will sign the change ticket."

**Item:**
> Who signs the change ticket?

| Slot | Value |
|------|-------|
| A | Lia. |
| B | Rafael, the staff engineer. |
| C | **The VP.** ✓ |
| D | Priya, the engineering manager. |

**Key:** C

**Feedback:**
> Scan for the verb *sign*: **`the VP will sign the change ticket.`** **A** is the message author, **B** *reviews* the migration rather than signing it, and **D** is explicitly on leave — the reason the signature moved up one rung.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_roles_hierarchy_acronym_001
skill: `pronunciation.roles_acronym_stress`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_roles_hierarchy_acronym_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *CTO* /ˌsiː tiː ˈoʊ/ and *CEO* /ˌsiː iː ˈoʊ/ share the first letter but differ in the middle one — /tiː/ versus /iː/ — and both carry the stress on the final letter. *VP* /ˌviː ˈpiː/ starts with /v/, upper teeth on the lower lip, not the rounded /w/ of pt-BR.

**Step 2 — produce (ASR-scored):** read aloud:

> "Our CTO reports to the CEO, and our VP reports to the CTO."

**Target phonemes:** /tiː/ in *CTO* · /iː/ in *CEO* and *Chief* · /v/ in *VP* · final-letter stress in all three acronyms.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_roles_hierarchy_collective_001
skill: `grammar.roles_collective_subject`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_present_simple
distractors:
  - option: "Our team report to the VP."
    br_pt_form: "Nosso time reporta ao VP (com concordância plural britânica)."
    note: "British-style plural agreement; en-US treats a team as one unit in this context"
  - option: "Our team reporting to the VP."
    br_pt_form: "Nosso time reportando ao VP."
    note: "a participle leaves the sentence without a finite verb"
  - option: "Our team is report to the VP."
    br_pt_form: "Nosso time é reportar ao VP."
    note: "two verbs in a row; the auxiliary cannot sit beside the base form here"
```

**Item:**
> Reviewing present-simple subject agreement, which sentence is correct for an en-US workplace?

| Slot | Value |
|------|-------|
| A | **"Our team reports to the VP."** ✓ |
| B | "Our team report to the VP." |
| C | "Our team reporting to the VP." |
| D | "Our team is report to the VP." |

**Key:** A

**Feedback:**
> *Team* is a collective noun: in en-US it takes a singular verb here — **`Our team reports to the VP.`** **B** uses the BrE plural agreement, **C** drops the finite verb, and **D** stacks *is* on top of the base form. The same rule applies to *staff* and *company* in this register.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_roles_hierarchy_skim_title_001
skill: `vocab.roles_skim_title`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a1_reading_skimming
distractors:
  - option: "Rafael · staff engineer."
    br_pt_form: "Rafael · engenheiro staff."
    note: "a technical specialist; the title does not signal people management"
  - option: "Bruno · tech lead."
    br_pt_form: "Bruno · lead técnico."
    note: "he unblocks code, but does not manage careers or leave"
  - option: "Dana · SRE on call."
    br_pt_form: "Dana · SRE de plantão."
    note: "the on-call role is about service reliability, not about the squad's people"
```

**Stimulus:**
> "Directory — Platform squad: Rafael · staff engineer; Priya · engineering manager; Bruno · tech lead; Dana · SRE on call."

**Item:**
> Skim the directory. Which entry do you need if you want the person who manages people in the Platform squad?

| Slot | Value |
|------|-------|
| A | Rafael · staff engineer. |
| B | **Priya · engineering manager.** ✓ |
| C | Bruno · tech lead. |
| D | Dana · SRE on call. |

**Key:** B

**Feedback:**
> Scanning for the people-management title lands on **`Priya · engineering manager.`** **A** is a senior individual contributor, **C** is the technical unblocker, and **D** is the on-call reliability engineer. This is why skimming titles — not names — is the faster strategy in a directory.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `report_to_preposition` | Item 1 missed | **L2** | Contrast *report for / with / at / to* in short chain-of-command statements before reintroducing titles. |
| `ic_vs_people_manager` | Items 2 and 3 missed | **L2** | Sort *tech lead*, *staff engineer*, *engineering manager* by the verb each one owns: *review*, *design*, *approve*. |
| `collective_team_agreement` | Item 6 missed | **L2** | Recycle *team/staff/company* + singular verb from A1 present simple into org-chart sentences. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration; the listening slot stays explicitly deferred in the manifest.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a1_reading_skimming` and carry `prereq_lesson` for the interleaving rule.
4. All 6 scored items carry a `br_pt_form` on every distractor; the 7th item has no distractor set by design.
5. Titles and definitions are original authoring; no external list or gloss was reproduced or adapted.
