# Practice Pack: Architecture Discussions
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_it_architecture_vocab_v1`
**Lesson:** `les_b1_it_architecture_vocab.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.arch.coupling`
**domain:** `vocab`
**level:** L1
**stem:** **Coupling** in software architecture measures:
| Slot | Value |
|------|-------|
| A | How fast the system responds |
| B | **Degree of dependence between modules** |
| C | Number of services deployed |
| D | Code test coverage |
**Key:** B
**br_pt_form:** "acoplamento / grau de dependência"



### ITEM 2
**item_id:** `vocab.arch.cohesion`
**domain:** `vocab`
**level:** L1
**stem:** **High cohesion** means a module:
| Slot | Value |
|------|-------|
| A | Does many unrelated things |
| B | **Does one thing well** |
| C | Has many dependencies |
| D | Is tightly coupled |
**Key:** B
**br_pt_form:** "alta coesão / faz uma coisa bem"



### ITEM 3
**item_id:** `vocab.arch.microservice_vs_monolith`
**domain:** `vocab`
**level:** L1
**stem:** A **microservice** differs from a **monolith** by:
| Slot | Value |
|------|-------|
| A | Single deploy, shared database |
| B | **Independent deploy, owns its data** |
| C | No network calls |
| D | No scaling needed |
**Key:** B
**br_pt_form:** "implantação independente, dados próprios"



### ITEM 4
**item_id:** `vocab.arch.latency_throughput`
**domain:** `vocab`
**level:** L1
**stem:** Match the metric to its meaning:
| Metric | Meaning |
|--------|---------|
| **Latency** | a. Requests per second |
| **Throughput** | b. Time per request |
**Key:** Latency→b, Throughput→a
**br_pt_form:** "latência", "vazão"



### ITEM 5
**item_id:** `vocab.arch.availability_scalability`
**domain:** `vocab`
**level:** L1
**stem:** **Availability** = uptime. **Scalability** =:
| Slot | Value |
|------|-------|
| A | **Ability to handle growth** |
| B | Number of servers |
| C | Response time |
| D | Error rate |
**Key:** A
**br_pt_form:** "escalabilidade / capacidade de crescer"



### ITEM 6
**item_id:** `grammar.passive_design`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **passive voice** for an architecture decision:
| Slot | Value |
|------|-------|
| A | The service **is deployed** independently. |
| B | The service **deploys** independently. |
| C | The service **deploying** independently. |
| D | The service **deployed** independently. |
**Key:** A
**br_pt_form:** "O serviço é implantado independentemente."



### ITEM 7
**item_id:** `vocab.arch.prereq_tradeoff`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] A **trade-off** in architecture means:
| Slot | Value |
|------|-------|
| A | Everyone wins |
| B | **You gain one quality, lose another** |
| C | No decision needed |
| D | The best option is free |
**Key:** B
**br_pt_form:** "troca / compensação"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_architecture_vocab_v1
lesson_id: les_b1_it_architecture_vocab_v1
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
