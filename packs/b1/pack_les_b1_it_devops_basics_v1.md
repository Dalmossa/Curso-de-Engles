# Practice Pack: DevOps Basics — CI/CD, Pipelines, Containers, Observability
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_it_devops_basics_v1`
**Lesson:** `les_b1_it_devops_basics.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.devops.ci_cd`
**domain:** `vocab`
**level:** L1
**stem:** **CI/CD** stands for:
| Slot | Value |
|------|-------|
| A | Code Integration / Code Deployment |
| B | **Continuous Integration / Continuous Deployment** |
| C | Container Image / Container Deploy |
| D | Code Inspection / Code Delivery |
**Key:** B
**br_pt_form:** "Integração Contínua / Deploy Contínuo"



### ITEM 2
**item_id:** `vocab.devops.pipeline`
**domain:** `vocab`
**level:** L1
**stem:** A **pipeline** in CI/CD is:
| Slot | Value |
|------|-------|
| A | A database connection |
| B | **Automated sequence: build → test → deploy** |
| C | A monitoring dashboard |
| D | A container image |
**Key:** B
**br_pt_form:** "pipeline / esteira de CI/CD"



### ITEM 3
**item_id:** `vocab.devops.container`
**domain:** `vocab`
**level:** L1
**stem:** A **container** provides:
| Slot | Value |
|------|-------|
| A | A virtual machine |
| B | **Isolated, portable runtime environment** |
| C | A database |
| D | A load balancer |
**Key:** B
**br_pt_form:** "container / ambiente isolado e portável"



### ITEM 4
**item_id:** `vocab.devops.observability`
**domain:** `vocab`
**level:** L1
**stem:** **Observability** consists of three pillars:
| Slot | Value |
|------|-------|
| A | Metrics, Alerts, Incidents |
| B | **Metrics, Logs, Traces** |
| C | CPU, RAM, Disk |
| D | Build, Test, Deploy |
**Key:** B
**br_pt_form:** "observabilidade / métricas, logs, traces"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own three pillars; *alerts* and *incidents* are outputs, not pillars). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 5
**item_id:** `vocab.devops.rollback`
**domain:** `vocab`
**level:** L1
**stem:** **Rollback** in CI/CD means:
| Slot | Value |
|------|-------|
| A | Deploy new version |
| B | **Revert to previous version** |
| C | Run tests again |
| D | Clear cache |
**Key:** B
**br_pt_form:** "rollback / voltar versão anterior"



### ITEM 6
**item_id:** `grammar.passive_pipeline`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **passive** for a pipeline step:
| Slot | Value |
|------|-------|
| A | The image **builds** in the pipeline. |
| B | The image **is built** in the pipeline. |
| C | The image **building** in the pipeline. |
| D | The image **built** in the pipeline. |
**Key:** B
**br_pt_form:** "A imagem é construída no pipeline."



### ITEM 7
**item_id:** `vocab.devops.prereq_canary`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Canary deploy** means:
| Slot | Value |
|------|-------|
| A | Deploy to all users at once |
| B | **Deploy to small % first, then expand** |
| C | Deploy only on Fridays |
| D | Deploy without tests |
**Key:** B
**br_pt_form:** "deploy canário / para pequena % primeiro"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_devops_basics_v1
lesson_id: les_b1_it_devops_basics_v1
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
