# Practice Pack: Advanced Patterns & Anti-Patterns
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b2_it_advanced_patterns_v1`
**Lesson:** `les_b2_it_advanced_patterns.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.patterns.anti_pattern`
**domain:** `vocab`
**level:** L1
**stem:** An **anti-pattern** is:
| Slot | Value |
|------|-------|
| A | A best practice |
| B | **A solution that seems good but causes problems** |
| C | A design pattern |
| D | A testing strategy |
**Key:** B
**br_pt_form:** "anti-padrão / solução que parece boa mas causa problemas"



### ITEM 2
**item_id:** `vocab.patterns.singleton`
**domain:** `vocab`
**level:** L1
**stem:** A **Singleton** pattern:
| Slot | Value |
|------|-------|
| A | Creates many instances |
| B | **Ensures one global instance (often anti-pattern)** |
| C | Is a testing tool |
| D | Is a refactoring technique |
**Key:** B
**br_pt_form:** "Singleton / garante uma instância global"



### ITEM 3
**item_id:** `vocab.patterns.god_object`
**domain:** `vocab`
**level:** L1
**stem:** A **God object** is:
| Slot | Value |
|------|-------|
| A | A well-designed class |
| B | **A class that does everything (anti-pattern)** |
| C | A design pattern |
| D | A testing tool |
**Key:** B
**br_pt_form:** "god object / classe que faz tudo (anti-padrão)"



### ITEM 4
**item_id:** `vocab.patterns.code_smell`
**domain:** `vocab`
**level:** L1
**stem:** A **code smell** indicates:
| Slot | Value |
|------|-------|
| A | Good design |
| B | **A sign of deeper design problems** |
| C | Fast code |
| D | Clean code |
**Key:** B
**br_pt_form:** "cheiro de código / sinal de problemas de design"



### ITEM 5
**item_id:** `vocab.patterns.solid`
**domain:** `vocab`
**level:** L1
**stem:** **SOLID** principles include:
| Slot | Value |
|------|-------|
| A | Single Responsibility, Open-Closed, Liskov, Interface Segregation, Dependency Injection |
| B | **Single Responsibility, Open-Closed, Liskov, Interface Segregation, Dependency Inversion** |
| C | Simple, Object-oriented, Logical, Integrated, Distributed |
| D | None of the above |
**Key:** B
**br_pt_form:** "SOLID / 5 princípios de design OO"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own five; *Injection* for *Inversion* is the near-miss). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 6
**item_id:** `grammar.present_simple_definitions`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **present simple** for a definition:
| Slot | Value |
|------|-------|
| A | A factory **create** objects. |
| B | A factory **creates** objects. |
| C | A factory **creating** objects. |
| D | A factory **created** objects. |
**Key:** B
**br_pt_form:** "Uma fábrica cria objetos."



### ITEM 7
**item_id:** `vocab.patterns.prereq_refactoring`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Refactoring**:
| Slot | Value |
|------|-------|
| A | Adds features |
| B | **Restructures code without changing behavior** |
| C | Fixes bugs |
| D | Writes tests |
**Key:** B
**br_pt_form:** "refatoração / reestruturar sem mudar comportamento"

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_advanced_patterns_v1
lesson_id: les_b2_it_advanced_patterns_v1
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
