# Practice Pack: Advanced Acronyms & Jargon
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_it_acronyms_deep_v1`
**Lesson:** `les_b1_it_acronyms_deep.md`
**Items:** 8
**Time cap:** 4 min
**Split:** 50% current / 50% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.acronym.sli`
**domain:** `vocab`
**level:** L1
**stem:** **SLI** (Service Level Indicator) is:
| Slot | Value |
|------|-------|
| A | The contract with customers |
| B | The internal target |
| C | **The measured metric (latency, error rate, etc.)** |
| D | The recovery time |
**Key:** C
**br_pt_form:** "SLI / indicador de nível de serviço"



### ITEM 2
**item_id:** `vocab.acronym.sla_slo_sli`
**domain:** `vocab`
**level:** L1
**stem:** Match each term to its role:
| Term | Role |
|------|------|
| **SLA** | a. Measured metric |
| **SLO** | b. Contract with customer |
| **SLI** | c. Internal target |
**Key:** SLA→b, SLO→c, SLI→a
**br_pt_form:** "SLA / contrato", "SLO / meta interna", "SLI / métrica medida"



### ITEM 3
**item_id:** `vocab.acronym.rto_rpo`
**domain:** `vocab`
**level:** L1
**stem:** **RTO** = Recovery Time Objective. **RPO** =:
| Slot | Value |
|------|-------|
| A | Recovery Point Option |
| B | **Recovery Point Objective** |
| C | Recovery Process Objective |
| D | Recovery Performance Objective |
**Key:** B
**br_pt_form:** "objetivo de ponto de recuperação"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own expansion; *Option* for *Objective* is the near-miss). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 4
**item_id:** `vocab.acronym.mttr_mtbf`
**domain:** `vocab`
**level:** L1
**stem:** **MTTR** = Mean Time To Recovery. **MTBF** =:
| Slot | Value |
|------|-------|
| A | Mean Time Before Failure |
| B | **Mean Time Between Failures** |
| C | Maximum Time Before Failure |
| D | Minimum Time Between Fixes |
**Key:** B
**br_pt_form:** "tempo médio entre falhas"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own expansion; *Before* for *Between* is the near-miss). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 5
**item_id:** `vocab.acronym.ttl_qps`
**domain:** `vocab`
**level:** L1
**stem:** **TTL** controls cache expiration. **QPS** measures:
| Slot | Value |
|------|-------|
| A | Queries Per Session |
| B | **Queries Per Second** |
| C | Quality Per Second |
| D | Queue Per Second |
**Key:** B
**br_pt_form:** "consultas por segundo"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own expansion; *Session* for *Second* is the near-miss). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 6
**item_id:** `vocab.acronym.oom_npe`
**domain:** `vocab`
**level:** L1
**stem:** **OOM** = Out Of Memory. **NPE** =:
| Slot | Value |
|------|-------|
| A | Null Pointer Error |
| B | **Null Pointer Exception** |
| C | New Pointer Error |
| D | Network Protocol Error |
**Key:** B
**br_pt_form:** "exceção de ponteiro nulo"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own expansion; *Error* for *Exception* is the near-miss). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 7
**item_id:** `grammar.relative_clauses`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct relative clause:
| Slot | Value |
|------|-------|
| A | A DTO **who** transfers data. |
| B | A DTO **which** transfers data. |
| C | A DTO **whose** transfers data. |
| D | A DTO **whom** transfers data. |
**Key:** B
**br_pt_form:** "Um DTO que transfere dados."



### ITEM 8
**item_id:** `vocab.acronym.prereq_orm`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **ORM** stands for:
| Slot | Value |
|------|-------|
| A | Object Request Mapping |
| B | **Object-Relational Mapping** |
| C | Operational Resource Management |
| D | Open Runtime Module |
**Key:** B
**br_pt_form:** "mapeamento objeto-relacional"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_acronyms_deep_v1
lesson_id: les_b1_it_acronyms_deep_v1
learner_profile: default
estimated_minutes: 4 min
spec_conformance:
  item_count: 8                       # §2.1 4–8            ✅
  time_cap: "3–5 min"                 # §2.1 hard cap       ✅
  split: 5 current / 2 prereq         # §2.1 55–75 / 25–45  ✅ (assumed)
  interleaved: true                   # §2.1                ✅ (G, V, R, G, V, G, P)
  max_per_domain: 3                   # §2.2 grammar        ✅
  listening_items: 0                  # deferred until render + ear-check
  br_pt_form_coverage: 8/7 scored items
  speaking_writing_items: 0           # §2.4                ✅
  authored_illustrative_parameters: true
```
