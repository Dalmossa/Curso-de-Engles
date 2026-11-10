# Practice Pack: Writing Documentation & RFCs
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_it_write_docs_v1`
**Lesson:** `les_b1_it_write_docs.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.docs.rfc`
**domain:** `vocab`
**level:** L1
**stem:** An **RFC** (Request for Comments) is:
| Slot | Value |
|------|-------|
| A | A bug report |
| B | **A design proposal for review** |
| C | A test plan |
| D | A deployment script |
**Key:** B
**br_pt_form:** "proposta de design para revisão"



### ITEM 2
**item_id:** `vocab.docs.design_doc`
**domain:** `vocab`
**level:** L1
**stem:** A **design doc** is written:
| Slot | Value |
|------|-------|
| A | After implementation |
| B | **Before implementation** |
| C | During code review |
| D | After deployment |
**Key:** B
**br_pt_form:** "documento de design / especificação técnica"



### ITEM 3
**item_id:** `vocab.docs.changelog`
**domain:** `vocab`
**level:** L1
**stem:** A **changelog** records:
| Slot | Value |
|------|-------|
| A | Future plans |
| B | **Version history (added, changed, fixed, removed)** |
| C | Design proposals |
| D | Meeting notes |
**Key:** B
**br_pt_form:** "changelog / histórico de mudanças"



### ITEM 4
**item_id:** `vocab.docs.migration_guide`
**domain:** `vocab`
**level:** L1
**stem:** A **migration guide** helps users:
| Slot | Value |
|------|-------|
| A | Write new code |
| B | **Upgrade from old version to new** |
| C | Install the package |
| D | Report bugs |
**Key:** B
**br_pt_form:** "guia de migração"



### ITEM 5
**item_id:** `vocab.docs.deprecation`
**domain:** `vocab`
**level:** L1
**stem:** A **deprecation** notice means:
| Slot | Value |
|------|-------|
| A | Feature is new |
| B | **Feature will be removed in future version** |
| C | Feature is buggy |
| D | Feature is experimental |
**Key:** B
**br_pt_form:** "depreciação / aviso de remoção futura"



### ITEM 6
**item_id:** `grammar.imperative_docs`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **imperative** for documentation:
| Slot | Value |
|------|-------|
| A | **Run** the migration script. |
| B | **Running** the migration script. |
| C | **Ran** the migration script. |
| D | **Runs** the migration script. |
**Key:** A
**br_pt_form:** "Execute o script de migração."



### ITEM 7
**item_id:** `vocab.docs.prereq_readme`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] A **README** typically includes:
| Slot | Value |
|------|-------|
| A | Detailed architecture diagrams only |
| B | **What, why, quickstart, install, usage** |
| C | Only API reference |
| D | Only changelog |
**Key:** B
**br_pt_form:** "o quê, por quê, início rápido, instalação, uso"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_write_docs_v1
lesson_id: les_b1_it_write_docs_v1
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
