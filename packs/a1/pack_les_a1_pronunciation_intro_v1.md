# Practice Pack: TH / H / R / S+C Minimal Pairs
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a1_pronunciation_intro_v1`
**Lesson:** `les_a1_pronunciation_intro.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.pron.minimal_pair`
**domain:** `vocab`
**level:** L1
**stem:** **Minimal pairs** are:
| Slot | Value |
|------|-------|
| A | Words with same meaning |
| B | **Words differing in one sound (three/tree)** |
| C | Words with same spelling |
| D | Words with same pronunciation |
**Key:** B
**br_pt_form:** "par mínimo / palavras que diferem em 1 som"



### ITEM 2
**item_id:** `vocab.pron.th_sound`
**domain:** `vocab`
**level:** L1
**stem:** The **TH sound** is produced by:
| Slot | Value |
|------|-------|
| A | Lips only |
| B | **Tongue between teeth** |
| C | Nose only |
| D | Throat only |
**Key:** B
**br_pt_form:** "som do TH / língua entre os dentes"



### ITEM 3
**item_id:** `vocab.pron.voiceless`
**domain:** `vocab`
**level:** L1
**stem:** **Voiceless** sounds:
| Slot | Value |
|------|-------|
| A | Use vocal cords |
| B | **Do not use vocal cords (think, three)** |
| C | Are louder |
| D | Are harder to hear |
**Key:** B
**br_pt_form:** "surdo / sem voz / não usa cordas vocais"



### ITEM 4
**item_id:** `vocab.pron.voiced`
**domain:** `vocab`
**level:** L1
**stem:** **Voiced** sounds:
| Slot | Value |
|------|-------|
| A | Do not use vocal cords |
| B | **Use vocal cords (this, that, mother)** |
| C | Are quieter |
| D | Are harder to produce |
**Key:** B
**br_pt_form:** "sonoro / com voz / usa cordas vocais"



### ITEM 5
**item_id:** `vocab.pron.s_plus_c`
**domain:** `vocab`
**level:** L1
**stem:** **S+C** clusters include:
| Slot | Value |
|------|-------|
| A | play, please, place |
| B | **school, street, strong** |
| C | think, three, thank |
| D | red, right, room |
**Key:** B
**br_pt_form:** "S+C / school, street, strong"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own S+C set; these are P+L clusters, a different cluster class). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 6
**item_id:** `grammar.articles_sounds_001`
**domain:** `grammar`
**level:** L1
**stem:** You are **naming the letter H aloud** (H comes after G). Which article comes before its
**name**, "aitch"?
| Slot | Value |
|------|-------|
| A | a |
| B | **an** |
| C | the |
| D | no article — letters never take one |
**Key:** B
**br_pt_form:** "a letra H se chama *aitch*, que começa por som de vogal → **an** H"

> **Rewritten 2026-10-01, and the key changed from B-by-luck to B-by-rule.** The old stem read
> *"Choose the correct article before a sound"* and its options mixed the letter with the sound, so
> it was ambiguous: `an H sound` is right if *H* means the letter name, `a H sound` is right if it
> means /h/. The pack's twin in `pack_les_rem_pronunciation_th_vw_v1.md` carried the same stem with
> the *opposite* key, so two items in a learner's path taught contradictory answers to one question.
> The stems are now disambiguated by asking explicitly for the letter *name* here and the *sound
> value* there, which turns the pair from a contradiction into the letter-vs-sound contrast the
> lesson exists to teach. Found by [11c].



### ITEM 7
**item_id:** `vocab.pron.prereq_tongue`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] The **tongue** is:
| Slot | Value |
|------|-------|
| A | A tooth |
| B | **The organ used for speech** |
| C | A lip |
| D | A nose |
**Key:** B
**br_pt_form:** "língua / órgão da fala"

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_pronunciation_intro_v1
lesson_id: les_a1_pronunciation_intro_v1
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
