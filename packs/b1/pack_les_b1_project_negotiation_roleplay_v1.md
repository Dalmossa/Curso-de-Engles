# Practice Pack: Negotiation Role-play
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_project_negotiation_roleplay_v1`
**Lesson:** `les_b1_project_negotiation_roleplay.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.negotiation.batna`
**domain:** `vocab`
**level:** L1
**stem:** **BATNA** stands for:
| Slot | Value |
|------|-------|
| A | Best Alternative To Negotiation Agreement |
| B | **Best Alternative To Negotiated Agreement** |
| C | Basic Agreement To Negotiate Always |
| D | Best Approach To New Agreement |
**Key:** B
**br_pt_form:** "Melhor Alternativa a um Acordo Negociado"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own expansion; *Negotiation* for *Negotiated* is the near-miss). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 2
**item_id:** `vocab.negotiation.counteroffer_002`
**domain:** `vocab`
**level:** L1
**stem:** A **counteroffer** is:
| Slot | Value |
|------|-------|
| A | Accepting the offer |
| B | **Response with different terms** |
| C | Walking away |
| D | Asking for time |
**Key:** B
**br_pt_form:** "contraproposta"



### ITEM 3
**item_id:** `vocab.negotiation.concession`
**domain:** `vocab`
**level:** L1
**stem:** A **concession** in negotiation is:
| Slot | Value |
|------|-------|
| A | Demanding more |
| B | **Giving up something to reach agreement** |
| C | Walking away |
| D | Making a threat |
**Key:** B
**br_pt_form:** "concessão / ceder em um ponto"



### ITEM 4
**item_id:** `vocab.negotiation.deadlock`
**domain:** `vocab`
**level:** L1
**stem:** **Deadlock** means:
| Slot | Value |
|------|-------|
| A | Agreement reached |
| B | **Neither side will move / impasse** |
| C | One side wins |
| D | Quick agreement |
**Key:** B
**br_pt_form:** "impasse / ponto morto"



### ITEM 5
**item_id:** `vocab.negotiation.win_win`
**domain:** `vocab`
**level:** L1
**stem:** **Win-win** outcome means:
| Slot | Value |
|------|-------|
| A | One side wins big |
| B | **Both sides benefit** |
| C | No agreement |
| D | Compromise where both lose |
**Key:** B
**br_pt_form:** "ganha-ganha / ambos ganham"



### ITEM 6
**item_id:** `grammar.second_conditional`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **second conditional** for hypothetical negotiation:
| Slot | Value |
|------|-------|
| A | If they **offered** $90k, we **would accept**. |
| B | If they **offer** $90k, we **would accept**. |
| C | If they **offered** $90k, we **will accept**. |
| D | If they **offer** $90k, we **will accept**. |
**Key:** A
**br_pt_form:** "Se oferecessem $90k, aceitaríamos."



### ITEM 7
**item_id:** `vocab.negotiation.prereq_rapport`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Rapport** in negotiation means:
| Slot | Value |
|------|-------|
| A | Legal contract |
| B | **Trust and positive connection** |
| C | Written offer |
| D | Final price |
**Key:** B
**br_pt_form:** "rapport / empatia / conexão"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_project_negotiation_roleplay_v1
lesson_id: les_b1_project_negotiation_roleplay_v1
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
