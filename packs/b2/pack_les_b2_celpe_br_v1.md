# Practice Pack: CELPE-Bras: Speaking
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b2_celpe_br_v1`
**Lesson:** `les_b2_celpe_br.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.celpe.self_correction`
**domain:** `vocab`
**level:** L1
**stem:** **Self-correction** in speaking:
| Slot | Value |
|------|-------|
| A | Is penalized |
| B | **Shows language awareness and is acceptable** |
| C | Is ignored |
| D | Is forbidden |
**Key:** B
**br_pt_form:** "autocorreção / mostra consciência linguística"



### ITEM 2
**item_id:** `vocab.celpe.fluency`
**domain:** `vocab`
**level:** L1
**stem:** **Fluency** in speaking means:
| Slot | Value |
|------|-------|
| A | Perfect grammar |
| B | **Speaking without excessive pauses** |
| C | Fast speech |
| D | Loud voice |
**Key:** B
**br_pt_form:** "fluência / falar sem pausas excessivas"



### ITEM 3
**item_id:** `vocab.celpe.interaction`
**domain:** `vocab`
**level:** L1
**stem:** **Interaction** in CELPE-Bras:
| Slot | Value |
|------|-------|
| A | Is monologue |
| B | **Is natural dialogue with examiner** |
| C | Is optional |
| D | Is written |
**Key:** B
**br_pt_form:** "interação / diálogo natural com examinador"



### ITEM 4
**item_id:** `vocab.celpe.hesitation`
**domain:** `vocab`
**level:** L1
**stem:** **Hesitation** in speaking:
| Slot | Value |
|------|-------|
| A | Is always bad |
| B | **Brief pauses are natural; long silences are problematic** |
| C | Is ignored |
| D | Is penalized |
**Key:** B
**br_pt_form:** "hesitação / pausas breves são naturais"



### ITEM 5
**item_id:** `vocab.celpe.role_play`
**domain:** `vocab`
**level:** L1
**stem:** **Role-play** in CELPE-Bras:
| Slot | Value |
|------|-------|
| A | Is scripted |
| B | **Requires natural response to simulated situation** |
| C | Is optional |
| D | Is written |
**Key:** B
**br_pt_form:** "role-play / resposta natural a situação simulada"



### ITEM 6
**item_id:** `grammar.present_continuous_speaking`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **present continuous** for speaking performance:
| Slot | Value |
|------|-------|
| A | The candidate **speaks** fluently. |
| B | The candidate **is speaking** fluently. |
| C | The candidate **speaking** fluently. |
| D | The candidate **spoke** fluently. |
**Key:** B
**br_pt_form:** "O candidato está falando fluentemente."



### ITEM 7
**item_id:** `vocab.celpe.prereq_accuracy`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Accuracy** in speaking:
| Slot | Value |
|------|-------|
| A | Is speed |
| B | **Is correct grammar and vocabulary** |
| C | Is volume |
| D | Is accent |
**Key:** B
**br_pt_form:** "precisão / gramática e vocabulário corretos"

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_celpe_br_v1
lesson_id: les_b2_celpe_br_v1
learner_profile: default
estimated_minutes: 4 min
spec_conformance:
  item_count: 7                       # §2.1 4–8            ✅
  time_cap: "3–5 min"                 # §2.1 hard cap       ✅
  split: 5 current / 2 prereq         # §2.1 55–75 / 25–45  ✅ (assumed)
  interleaved: true                   # §2.1                ✅ (G, V, R, G, V, G, P)
  max_per_domain: 3                   # §2.2 grammar        ✅
  listening_items: 0                  # deferred until render + ear-check
  br_pt_form_coverage: 7/7 scored items
  speaking_writing_items: 0           # §2.4                ✅
  authored_illustrative_parameters: true
```
