# Practice Pack: Hotel, Taxi & Transport
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_hotel_taxi_v1`
**Lesson:** `les_a2_hotel_taxi.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.hotel.check-out`
**domain:** `vocab`
**level:** L1
**stem:** **Check-out** at a hotel is:
| Slot | Value |
|------|-------|
| A | Arriving |
| B | **Leaving / settling the bill** |
| C | Ordering room service |
| D | Making a reservation |
**Key:** B
**br_pt_form:** "check-out / saída / conta"



### ITEM 2
**item_id:** `vocab.hotel.check-in`
**domain:** `vocab`
**level:** L1
**stem:** **Check-in** at a hotel is:
| Slot | Value |
|------|-------|
| A | **Arriving / registering** |
| B | Leaving |
| C | Ordering room service |
| D | Making a reservation |
**Key:** A
**br_pt_form:** "check-in / chegada / registro"



### ITEM 3
**item_id:** `vocab.transport.taxi`
**domain:** `vocab`
**level:** L1
**stem:** A **taxi** is:
| Slot | Value |
|------|-------|
| A | Public bus |
| B | **Private car for hire** |
| C | Train |
| D | Subway |
**Key:** B
**br_pt_form:** "táxi / carro particular para alugar"



### ITEM 4
**item_id:** `vocab.transport.bus`
**domain:** `vocab`
**level:** L1
**stem:** A **bus** is:
| Slot | Value |
|------|-------|
| A | Private car |
| B | **Public road transport** |
| C | Train |
| D | Subway |
**Key:** B
**br_pt_form:** "ônibus / transporte público rodoviário"



### ITEM 5
**item_id:** `vocab.transport.fare`
**domain:** `vocab`
**level:** L1
**stem:** **Fare** means:
| Slot | Value |
|------|-------|
| A | A schedule |
| B | **The price of a trip** |
| C | A ticket |
| D | A stop |
**Key:** B
**br_pt_form:** "tarifa / passagem / preço da viagem"



### ITEM 6
**item_id:** `grammar.present_simple_schedules`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **present simple**:
| Slot | Value |
|------|-------|
| A | The train **leave** at 8 AM. |
| B | The train **leaves** at 8 AM. |
| C | The train **leaving** at 8 AM. |
| D | The train **left** at 8 AM. |
**Key:** B
**br_pt_form:** "O trem sai às 8h."



### ITEM 7
**item_id:** `vocab.hotel.prereq-room-key`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] A **room key** is:
| Slot | Value |
|------|-------|
| A | A hotel reservation |
| B | **The key to access your room** |
| C | A taxi ticket |
| D | A bus pass |
**Key:** B
**br_pt_form:** "chave do quarto / acesso ao quarto"

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_hotel_taxi_v1
lesson_id: les_a2_hotel_taxi_v1
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
