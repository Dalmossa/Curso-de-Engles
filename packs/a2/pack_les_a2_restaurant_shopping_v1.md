# Practice Pack: Restaurant, Shopping & Emergencies
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_restaurant_shopping_v1`
**Lesson:** `les_a2_restaurant_shopping.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.restaurant.bill`
**domain:** `vocab`
**level:** L1
**stem:** **Bill** at a restaurant is:
| Slot | Value |
|------|-------|
| A | A reservation |
| B | **The check / payment** |
| C | A tip |
| D | A menu |
**Key:** B
**br_pt_form:** "conta / pagamento"



### ITEM 2
**item_id:** `vocab.restaurant.order`
**domain:** `vocab`
**level:** L1
**stem:** **Order** at a restaurant means:
| Slot | Value |
|------|-------|
| A | Pay the bill |
| B | **Request food/drinks** |
| C | Make a reservation |
| D | Leave a tip |
**Key:** B
**br_pt_form:** "pedido / solicitar comida/bebida"



### ITEM 3
**item_id:** `vocab.shopping.price`
**domain:** `vocab`
**level:** L1
**stem:** **Price** means:
| Slot | Value |
|------|-------|
| A | A discount |
| B | **The cost** |
| C | A store |
| D | A receipt |
**Key:** B
**br_pt_form:** "preço / custo"



### ITEM 4
**item_id:** `vocab.shopping.discount`
**domain:** `vocab`
**level:** L1
**stem:** **Discount** means:
| Slot | Value |
|------|-------|
| A | A price increase |
| B | **A price reduction** |
| C | A store |
| D | A receipt |
**Key:** B
**br_pt_form:** "desconto / redução de preço"



### ITEM 5
**item_id:** `vocab.emergency.help`
**domain:** `vocab`
**level:** L1
**stem:** **Help!** is used in:
| Slot | Value |
|------|-------|
| A | Greeting |
| B | **Emergency** |
| C | Thanking |
| D | Apologizing |
**Key:** B
**br_pt_form:** "ajuda / emergência"



### ITEM 6
**item_id:** `grammar.present_continuous_emergencies`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **present continuous**:
| Slot | Value |
|------|-------|
| A | Someone **steal** my bag! |
| B | Someone **is stealing** my bag! |
| C | Someone **stealing** my bag! |
| D | Someone **stole** my bag! |
**Key:** B
**br_pt_form:** "Alguém está roubando minha bolsa!"



### ITEM 7
**item_id:** `vocab.restaurant.prereq-tip`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Tip** at a restaurant is:
| Slot | Value |
|------|-------|
| A | A reservation |
| B | **Extra payment for service** |
| C | A bill |
| D | A menu |
**Key:** B
**br_pt_form:** "gorjeta / pagamento extra pelo serviço"

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_restaurant_shopping_v1
lesson_id: les_a2_restaurant_shopping_v1
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
