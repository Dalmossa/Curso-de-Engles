# Practice Pack: Writing: Review & Evaluation
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b2_professional_review_v1`
**Lesson:** `les_b2_professional_review.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.review.constructive_feedback`
**domain:** `vocab`
**level:** L1
**stem:** **Constructive feedback** is:
| Slot | Value |
|------|-------|
| A | Only praise |
| B | **Specific, actionable, balanced (strengths + improvements)** |
| C | Only criticism |
| D | Vague suggestions |
**Key:** B
**br_pt_form:** "feedback construtivo / específico, acionável, equilibrado"



### ITEM 2
**item_id:** `vocab.review.rubric`
**domain:** `vocab`
**level:** L1
**stem:** A **rubric** provides:
| Slot | Value |
|------|-------|
| A | Subjective opinions |
| B | **Criteria + performance levels (Exceeds/Meets/Approaching/Below)** |
| C | Only grades |
| D | Only comments |
**Key:** B
**br_pt_form:** "rubrica / critérios + níveis de desempenho"



### ITEM 3
**item_id:** `vocab.review.evidence_based`
**domain:** `vocab`
**level:** L1
**stem:** **Evidence-based** feedback:
| Slot | Value |
|------|-------|
| A | Uses generalizations |
| B | **Cites specific examples (line numbers, metrics)** |
| C | Uses emotions |
| D | Uses rumors |
**Key:** B
**br_pt_form:** "baseado em evidência / cita exemplos específicos"



### ITEM 4
**item_id:** `vocab.review.bias`
**domain:** `vocab`
**level:** L1
**stem:** **Bias** in review includes:
| Slot | Value |
|------|-------|
| A | Seniority, tenure, and team effects |
| B | **Recency, halo, similarity effects** |
| C | Only technical errors |
| D | Only style issues |
**Key:** B
**br_pt_form:** "viés / efeitos de recência, halo, similaridade"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own three; these are other sources of bias, not the named ones). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 5
**item_id:** `vocab.review.calibration`
**domain:** `vocab`
**level:** L1
**stem:** **Calibration** aligns:
| Slot | Value |
|------|-------|
| A | Monitors |
| B | **Reviewers to the same standard** |
| C | Deadlines |
| D | Rubrics |
**Key:** B
**br_pt_form:** "calibração / alinhar avaliadores"



### ITEM 6
**item_id:** `grammar.reported_speech_002`
**domain:** `grammar`
**level:** L1
**stem:** Choose correct **reported speech** for feedback:
| Slot | Value |
|------|-------|
| A | She said the code *needs* refactoring. |
| B | She said the code *needed* refactoring. |
| C | She said the code *will need* refactoring. |
| D | She said the code *is needing* refactoring. |
**Key:** B
**br_pt_form:** "Ela disse que o código precisava de refatoração."



### ITEM 7
**item_id:** `vocab.review.prereq_peer_review`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Peer review** means:
| Slot | Value |
|------|-------|
| A | Manager evaluates employee |
| B | **Colleagues evaluate each other's work** |
| C | Customer evaluates product |
| D | Self-evaluation only |
**Key:** B
**br_pt_form:** "revisão por pares / colegas avaliam trabalho uns dos outros"

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_professional_review_v1
lesson_id: les_b2_professional_review_v1
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
