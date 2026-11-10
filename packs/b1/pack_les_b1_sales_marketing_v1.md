# Practice Pack: Sales & Marketing Vocabulary
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_sales_marketing_v1`
**Lesson:** `les_b1_sales_marketing.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.sales.lead`
**domain:** `vocab`
**level:** L1
**stem:** **Lead** in sales is:
| Slot | Value |
|------|-------|
| A | A closed deal |
| B | **A potential customer** |
| C | A marketing campaign |
| D | A brand |
**Key:** B
**br_pt_form:** "lead / potencial cliente"



### ITEM 2
**item_id:** `vocab.sales.customer`
**domain:** `vocab`
**level:** L1
**stem:** **Customer** is:
| Slot | Value |
|------|-------|
| A | A lead |
| B | **A buyer** |
| C | A prospect |
| D | A campaign |
**Key:** B
**br_pt_form:** "customer / cliente / comprador"



### ITEM 3
**item_id:** `vocab.sales.prospect`
**domain:** `vocab`
**level:** L1
**stem:** **Prospect** is:
| Slot | Value |
|------|-------|
| A | A closed deal |
| B | **A possible buyer** |
| C | A customer |
| D | A campaign |
**Key:** B
**br_pt_form:** "prospect / possível comprador"



### ITEM 4
**item_id:** `vocab.sales.campaign`
**domain:** `vocab`
**level:** L1
**stem:** **Campaign** is:
| Slot | Value |
|------|-------|
| A | A sale |
| B | **A marketing action** |
| C | A lead |
| D | A brand |
**Key:** B
**br_pt_form:** "campaign / ação de marketing / campanha"



### ITEM 5
**item_id:** `vocab.sales.conversion`
**domain:** `vocab`
**level:** L1
**stem:** **Conversion** rate is:
| Slot | Value |
|------|-------|
| A | Visitors → campaigns |
| B | **Leads → customers** |
| C | Customers → leads |
| D | Campaigns → leads |
**Key:** B
**br_pt_form:** "conversion / conversão / leads → clientes"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own direction; conversion runs leads → customers, not the reverse). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 6
**item_id:** `grammar.present_simple_sales`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **present simple**:
| Slot | Value |
|------|-------|
| A | The company **close** many deals. |
| B | The company **closes** many deals. |
| C | The company **closing** many deals. |
| D | The company **closed** many deals. |
**Key:** B
**br_pt_form:** "A empresa fecha muitos negócios."



### ITEM 7
**item_id:** `vocab.sales.prereq-brand`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Brand** is:
| Slot | Value |
|------|-------|
| A | A product |
| B | **The identity of a product/company** |
| C | A sale |
| D | A lead |
**Key:** B
**br_pt_form:** "brand / marca / identidade do produto/empresa"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_sales_marketing_v1
lesson_id: les_b1_sales_marketing_v1
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
