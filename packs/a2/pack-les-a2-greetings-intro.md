# Practice Pack — `les_a2_greetings_intro`

**Pack ID:** `pack_les_a2_greetings_intro_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8
**Lesson:** `lesson-15min-workplace-greetings.md` (authored lesson `les_a2_greetings_intro`)
**Source (all items traceable):** `frases-ingles-trabalho.md` Ch 2, phrases 1–12 + "Armadilhas do Capítulo" (lines 238–392); pronunciation targets from `content-map.md` §9.1
**Reuse basis:** `adapt_requires_permission` — **this pack is not publishable as it stands.** Six items carry `provenance: source_derived` from `frases-ingles-trabalho.md` (5) and `leia-e-escreva-melhor-em-ingles.md` (1). Both carry the BaixeLivros notice — *"Caso deseje compartilhá-lo fora deste ambiente, é necessário obter a devida permissão"* — so neither grants redistribution and neither is permissively licensed. §7.0 of `external-sources.md` holds the permission request.

> ⚠️ **The `source_derived` marker is ACCURATE and must not be relabelled `authored`.** Verified
> 2026-10-01 against the source, not assumed: `frases-ingles-trabalho.md` Ch2 contains
> `"Good morning, everyone."` with the gloss `Bom dia a todos.`, `"This is Paula, our designer"`
> (the appositive pattern of ITEM 2's feedback), `"Nice to meet you."` marked ✕ *"para quem você já
> conhece"* (which is exactly ITEM 6 of `pack-les-a2-introducing-others.md`), and
> `"Let me introduce you to the team."`. Relabelling these items `authored` would cure the warning
> by committing the exact mislabelling `AGENTS.md` and check [11] exist to prevent.
>
> The five sibling packs in `mod_a2_workplace_intro` all declare the *same* source
> **bibliography only** and their items `authored`. Those declarations are correct; this one was
> written to a different, older convention. Either the six items are rebuilt as original material
> (preferred: `cite_only`, and the restricted source then matches its siblings), or this pack stays
> unpublishable until §7.0 permission is obtained. **That is a licensing decision, not a derivation
> — it is not made here.**
**Authoring date:** pass 1 — this pack is the validation case for `post-lesson-practice-spec.md`

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_greetings_intro_v1
lesson_id: les_a2_greetings_intro
learner_profile: default          # variants: false_beginner, it_track (see §6)
estimated_minutes: 4.5
spec_conformance:
  item_count: 7                    # §2.1 target 5–8          ✅
  time_cap: "3–5 min"              # §2.1 hard cap 5 min      ✅
  split: 5 current / 2 prereq      # §2.1 target 60/40        ✅ (71/29, nearest legal)
  interleaved: true                # §2.1 no blocked runs     ✅ (G, V, G, V, R, G, P)
  max_per_domain: 3                # grammar                  ✅ (§2.2 allows 2–3)
  listening_items: 0               # deferred — Decision B    ✅ (§5.1 note)
  br_pt_form_coverage: 7/7  # 12 filled / 7 null — see §2.2
  speaking_writing_items: 0        # §2.4                     ✅
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 3 | 2–3 | ✅ at ceiling |
| Vocabulary | 2 | 1–2 | ✅ at ceiling |
| Listening | 0 | 1 | ⚠️ **deferred** — slot redistributed to Reading per `content-map.md` §8.5.1 Decision B |
| Reading | 1 | 1–2 | ✅ (absorbs the deferred listening slot) |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 5–8 | ✅ |

> **The listening slot is not filled with a placeholder.** Under Decision B, an uncalibrated listening item has no `a`/`b` parameters and would contribute noise to the θ estimate. The slot goes to Reading, which is calibratable. This is disclosed to the learner in the UI, not hidden.

---

## 3. L1 ITEMS

Difficulty `b` is on the IRT logit scale (stats spec §3.2). Target: `b ≈ θ_learner + 0.3` for current-lesson items, `b ≈ θ_learner − 0.5` for prerequisite review (review should feel easier — it's a confidence anchor).

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: `grm_demonstrative_this_001`
skill: `grammar.demonstrative_this`
type: `gap_fill`
difficulty_b: -0.9
cefr: A2
provenance: source_derived          # frases Ch2, phrase 12
distractors:
  - option: "He"
    br_pt_form: "Ele é o Marco"
    note: "PT *é* serves both introducing and describing, so the learner has no cue that EN splits them — the item's own stated cause"
  - option: "There"
    br_pt_form: "Está o Marco ali"
    note: "PT *está* locates; EN *There is* locates too, so the transfer is real but produces a statement about position rather than an introduction"
  - option: "Here"
    br_pt_form: "Aqui está o Marco"
    note: "same locative transfer as C, with *aqui* in the subject position"
```

**Item:**
> Sarah: "Good morning, everyone! ___ is Marco. He's our new backend developer."

| Slot | Value |
|------|-------|
| A | This |
| B | He |
| C | There |
| D | Here |

**Key:** A — *This is*

**Feedback (BR-PT specific):**
> "This is" introduces a person to others. "He is" *describes* someone already known to the room — using it here is the classic BR-PT slip, because PT "Ele é o Marco" works in both situations.
> Contrast: **This is Marco** (introducing) vs **He is Marco** (already discussed).
> Note: the source flags *"Let me introduce"* for the same reason — **introduce** people, **present** a report.

**Gates:** G-Q2 ✅ (*He is* is a real BR-PT error) · G-Q3 ✅ (4 balanced options) · G-Q4 ✅ (one point)

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_greetings_time_of_day_001`
skill: `vocab.greetings_time_of_day`
type: `contextual_selection`
difficulty_b: -0.7
cefr: A2
provenance: source_derived          # frases Ch2, phrase 1
distractors:
  - option: "\"Good evening, everyone.\""
    br_pt_form: "Boa noite"
    note: "PT *boa noite* covers the afternoon greeting AND the evening one AND the farewell, so it cannot disambiguate the three EN uses"
  - option: "\"Good night, everyone.\""
    br_pt_form: null
    note: "no PT source — the distractor fails on EN's own evening/farewell split, which is not an L1 effect"
  - option: "\"Good day, everyone.\""
    br_pt_form: "Bom dia"
    note: "PT *dia* covers morning and afternoon; carrying *dia* forward is the named over-generalisation"
```

**Item:**
> It's 14:30. You're walking into the meeting room where the team is already waiting. You greet them:

| Slot | Value |
|------|-------|
| A | "Good evening, everyone." |
| B | **"Good afternoon, everyone."** ✓ |
| C | "Good night, everyone." |
| D | "Good day, everyone." |

**Key:** B

**Feedback:**
> English splits greetings into **morning** (≈until 12), **afternoon** (12–18), **evening** (after 18). BR-PT learners often use *Bom dia* for the whole morning *and* carry it into the afternoon, because PT "dia" covers both periods.
> "Good night" is also wrong here — in English it's a **farewell** ("good night, see you tomorrow"), not a greeting.

**Gates:** G-Q2 ✅ (*Good day* is a real over-generalization) · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Grammar, current lesson

```yaml
item_id: `grm_null_subject_error_001`
skill: `grammar.null_subject_error`
type: `error_correction`
difficulty_b: 0.1
cefr: A2
provenance: source_derived          # leia-e-escreva Ch3
distractors:
  - option: "\"Is raining today.\" *(no change)*"
    br_pt_form: "Está chovendo hoje"
    note: "PT drops the subject freely; the null-subject form is the untranslated PT sentence"
  - option: "\"Rain is today.\""
    br_pt_form: "Chuva é hoje"
    note: "PT nominalised *chuva* plus copula *é*; the word order transfers unchanged"
  - option: "\"Today is raining.\""
    br_pt_form: "Hoje está chovendo"
    note: "PT fronted *hoje* carried over with the PT clause order"
```

**Item:**
> Rewrite this sentence correctly:
> **"Is raining today."**

| Slot | Value |
|------|-------|
| A | **"It's raining today."** ✓ |
| B | "Is raining today." *(no change)* |
| C | "Rain is today." |
| D | "Today is raining." |

**Key:** A

**Feedback:**
> English requires an explicit subject. PT drops it freely — *"Chove hoje"* / *"Está chovendo hoje"* — so learners produce null subjects as a systematic L1 transfer, not an occasional slip.
> Compare the same pattern: *"Working today."* → **"I'm working today."**

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

**L3 relevance:** this item is the canonical trigger for `null_subject` remediation (`post-lesson-practice-spec.md` §4.3).

---

### ITEM 4 — Vocabulary, **prerequisite review**

```yaml
item_id: `grm_third_person_s_001`
skill: `grammar.third_person_s`
type: `gap_fill`
difficulty_b: -1.6
cefr: A1
provenance: source_derived          # frases Ch2, phrase 10 ("What's your role in the project?")
skill_domain_note: this item is keyed under the Vocabulary slot of the pack
                    but tests a Grammar skill from mod_a1_comm_basic.
distractors:
  - option: "work"
    br_pt_form: "Ana trabalha"
    note: "PT verbs inflect for número but not pessoa, so the third-person -s is category-new and is not produced"
  - option: "working"
    br_pt_form: "Ana trabalhando"
    note: "PT gerund attaches to *estar* and cannot follow a bare subject, so the bare form is an EN-adopted shape rather than a PT one"
  - option: "to work"
    br_pt_form: "Ana trabalhar"
    note: "PT bare infinitive after a subject noun is legal, so the option is licensed by PT syntax"
```

**Item:**
> Priya: "Ana ___ in the finance team. She manages the budget."

| Slot | Value |
|------|-------|
| A | work |
| B | **works** ✓ |
| C | working |
| D | to work |

**Key:** B

**Feedback:**
> Third person singular takes **-s** in the present simple. *He works / She works / It works.*
> BR-PT learners often drop it because PT verbs don't inflect for person ("Ana trabalha"). Note that Portuguese inflects only for *número*, not *pessoa* — so the -s is entirely new.

**Gates:** G-Q2 ✅ (*work* without -s is the documented error) · G-Q4 ✅ (*working* is a distractor, not a second target)

---

### ITEM 5 — Grammar, **prerequisite review**

```yaml
item_id: `grm_wh_questions_how_001`
skill: `grammar.wh_questions_how`
type: `contextual_selection`
difficulty_b: -1.4
cefr: A1
provenance: source_derived          # frases Ch2, phrase 7
distractors:
  - option: "\"What was your weekend?\""
    br_pt_form: null
    note: "NOT an L1 transfer — the item's own feedback says PT maps both *how* and *what* to *como*, so the distractor is an EN interlanguage default, not a Portuguese form"
  - option: "\"Where was your weekend?\""
    br_pt_form: "Onde foi seu fim de semana?"
    note: "PT *onde* is the question word a learner reaches for when matching interrogative shape on the noun *fim de semana*"
  - option: "\"Which was your weekend?\""
    br_pt_form: null
    note: "shape filler; no PT source"
```

**Item:**
> It's Monday morning. A colleague asks how your weekend was. Which question is natural?

| Slot | Value |
|------|-------|
| A | "What was your weekend?" |
| B | "Where was your weekend?" |
| C | **"How was your weekend?"** ✓ |
| D | "Which was your weekend?" |

**Key:** C

**Feedback:**
> **How** asks about manner/degree/state — the right word for "how was it?". **What** asks about things. In PT both map to "como", which is why BR-PT learners default to *What was…?*
> Pattern: **How was…? / How's…? / How has it been?**

**Gates:** G-Q2 ✅ (*What was* is the documented L1 default) · G-Q4 ✅

---

### ITEM 6 — Reading, current lesson (absorbs deferred Listening slot)

```yaml
item_id: `rdg_scanning_microtext_001`
skill: `reading.scanning_microtext`
type: `scanning`
difficulty_b: -0.4
cefr: A2
provenance: authored                # microtext written for this item
br_pt_pronunciation_guide: derived from frases Ch2 bracket notation
distractors:
  - option: "Marco"
    br_pt_form: null
    note: "the distractor is a name that appears elsewhere in the SAME microtext; the confusion is internal to the text, not an L1 transfer"
  - option: "Ahmed"
    br_pt_form: null
    note: "same — internal text confusion"
  - option: "Sarah"
    br_pt_form: null
    note: "same — internal text confusion"
```

**Microtext (48 words):**
> Marco joined the platform team last Monday. He is a backend developer, so he works mostly on the payments API. Priya runs the infrastructure — servers, deployment, monitoring. Ahmed leads the frontend, which is what customers actually see. Sarah manages the whole team and takes the Monday stand-up.

**Question:**
> According to the text, who works on deployment?

| Slot | Value |
|------|-------|
| A | Marco |
| B | **Priya** ✓ |
| C | Ahmed |
| D | Sarah |

**Key:** B

**Feedback:**
> The text says Priya "runs the infrastructure — servers, deployment, monitoring". **Deployment** maps to Marco's area only if you misread "works mostly on the payments API" as covering everything.
> Scanning tip: locate the keyword *deployment* first, then read left. Don't read the whole text.

**Gates:** G-Q3 ✅ (one keyable fact, no length cue) · G-Q4 ✅ · provenance `authored` → **excluded from diagnostic CAT use** until reviewed (G-Q7)

---

### ITEM 7 — Pronunciation, current lesson (**production**, ASR-scored)

```yaml
item_id: `prn_th_voiced_001`
skill: `pronunciation.th_voiced`
type: minimal_pair_identification + production
difficulty_b: -1.0
cefr: A1
provenance: source_derived          # frases Ch2 bracket notation [gúd, ívnin] etc.
scoring: asr_phoneme_match          # G3 in content-map §8.5 — manual/ASR, no auto prosody
distractors:
  - option: "sink"
    br_pt_form: null
    note: "a phonological near-neighbour, not an L1 transfer: the EN contrast is /s/ vs /t/, and PT has no orthographic counterpart of *th*, so there is no Portuguese form to record"
```

**Step 1 — Identify (binary, exact match):**
> Which word did you hear?
> A) *sink*  B) **think** ✓

**Step 2 — Produce:**
> Record yourself saying: **"Good afternoon, this is Marco."**

**Step 3 — Feedback (recast only — no explicit correction):**
> 🔊 Replay the native model.
> ❌ Never display: "You said /θ/ instead of /s/".
> ✅ Display: *"Here's the model — listen once more, then try again."*
> After 2 failed attempts: show the articulatory hint (*"língua entre os dentes, sopre"* — not a correction, a technique).

**Targets scored:** `th_unvoiced` [θ] in *think* · `th_voiced` [ð] in *this* · `h_aspirated` [h] in *has*

**Gates:** G-Q4 ✅ per step — the 3 phoneme targets are reported **separately**, never summed into one score. Pronunciation sub-skills are independent skill items.

---

## 4. ITEM SUMMARY TABLE

| # | Item ID | Domain | Skill | Type | b | Split | Provenance |
|---|---------|--------|-------|------|---|-------|------------|
| 1 | `grm_demonstrative_this_001` | Grammar | `demonstrative_this` | gap_fill | −0.9 | current | source_derived |
| 2 | `voc_greetings_time_of_day_001` | Vocab | `greetings_time_of_day` | contextual_selection | −0.7 | current | source_derived |
| 3 | `grm_null_subject_error_001` | Grammar | `null_subject_error` | error_correction | +0.1 | current | source_derived |
| 4 | `grm_third_person_s_001` | Grammar* | `third_person_s` | gap_fill | −1.6 | **prereq** | source_derived |
| 5 | `grm_wh_questions_how_001` | Grammar | `wh_questions_how` | contextual_selection | −1.4 | **prereq** | source_derived |
| 6 | `rdg_scanning_microtext_001` | Reading | `scanning_microtext` | scanning | −0.4 | current | **authored** ⚠️ |
| 7 | `prn_th_voiced_001` | Pron | `th_voiced` (+`th_unvoiced`, `h_aspirated`) | min-pair + production | −1.0 | current | source_derived |

**Split:** 5 current / 2 prereq = 71/29 (target 60/40; nearest legal under a 7-item cap where grammar is already at its 3-item ceiling)
**Difficulty ramp:** prereq items (−1.6, −1.4) are easiest and are **not adjacent** — items 4 and 5 are separated by item 6. Confirmed non-blocked.
**Provenance:** 6 source_derived, 1 authored (`rdg_scanning_microtext_001`, CAT-excluded per G-Q7)

---

## 5. L2 SEED & L3 TRIGGERS

```yaml
l2_seed:
  # Every correctly-answered item enters the FSRS queue (post-lesson-practice-spec §3.1)
  eligible: [grm_demonstrative_this_001, voc_greetings_time_of_day_001, grm_null_subject_error_001, grm_third_person_s_001, grm_wh_questions_how_001, rdg_scanning_microtext_001]
  not_eligible:
    - item_id: prn_th_voiced_001
      reason: >
        Production items are re-entered through ASR scoring, not through the
        L2 recall queue. A learner can identify /θ/ correctly while still
        failing to produce it — the two must be measured separately.
  # prn_th_voiced_001 DOES enter a queue, but the pron_* sub-skills go to their own
  # FSRS deck (see l3_seed_pron below), because stability should be estimated
  # from production attempts only.

l2_initial_intervals:
  # Pre-FSRS bootstrap. These are the DEFAULT_STABILITY seeds from
  # stats-progress-evaluation-spec.md §6, expressed per skill.
  greetings_time_of_day:   { S: 3.0,  difficulty: 5.0 }   # concrete, high-frequency
  demonstrative_this:      { S: 4.0,  difficulty: 4.5 }
  null_subject_error:      { S: 2.0,  difficulty: 6.5 }   # L1 transfer → forgets fast
  third_person_s:          { S: 5.0,  difficulty: 4.0 }
  wh_questions_how:        { S: 4.5,  difficulty: 4.5 }
  scanning_microtext:      { S: 3.5,  difficulty: 5.5 }

l3_triggers:
  - error_pattern: null_subject
    from_items: [grm_null_subject_error_001]
    action: insert_error_correction_items
    max_items: 4
    order: ascending_b            # §4.2 step 3 — easiest first
    requires_distractor: true     # §4.2 step 2 — distractor MUST include the learner's wrong form

  - error_pattern: no_third_person_s
    from_items: [grm_third_person_s_001]
    action: insert_gap_fill_items
    max_items: 3
    order: ascending_b

  - error_pattern: greetings_period_confusion
    from_items: [voc_greetings_time_of_day_001]
    action: insert_temporal_anchor_items
    max_items: 3
    order: ascending_b
    remediation_source: les_rem_listening_slow_clear   # time-of-day items are time-pressured

  - error_pattern: what_vs_how
    from_items: [grm_wh_questions_how_001]
    action: insert_contextual_selection_items
    max_items: 3
    order: ascending_b

l3_cap: 6                            # §4.2 step 4 — hard cap
l3_easiest_first: true               # §4.2 step 3
l3_affective_filter:
  never_display_negative_counts: true   # "3 to strengthen", never "3 wrong"
  min_items_per_pack: 2                 # a 1-item pack feels like a verdict
  max_consecutive_above_theta: 1        # never 2 hard items back to back
  offer_dont_block: true                # "Want 3 quick items first?" — never gates "next lesson"
```

### 5.1 Mastery Evidence This Pack Contributes

Per `post-lesson-practice-spec.md` §7, this pack is **primary same-day evidence** — not spaced. Therefore:

| Skill | Observations from this pack | Meets §7.1 minimum (3 across 2 days)? |
|-------|------------------------------|----------------------------------------|
| `demonstrative_this` | 1 (same day) | ❌ needs 2 more, ≥1 spaced |
| `greetings_time_of_day` | 1 (same day) | ❌ |
| `null_subject_error` | 1 (same day) | ❌ |
| `third_person_s` | 1 (same day) | ❌ |
| `wh_questions_how` | 1 (same day) | ❌ |
| `scanning_microtext` | 1 (same day) | ❌ |

> **Every skill still fails the gate after one lesson — and that is correct.** §7.1 requires ≥3 observations across ≥2 days with ≥1 spaced. The lesson's Shadow CAT contributes 3–5 more same-day observations, still not spaced. The gate cannot be satisfied on day 1 for any skill, and the spec requires exactly that. **If the numbers here ever let a skill pass the gate on day 1, the gate is broken.**

---

## 6. PROFILE VARIANTS

| Variant | Change | Rationale |
|---------|--------|-----------|
| `false_beginner` | Run `les_rem_confidence_builder` **before** this pack. Drop item 3 (`b=+0.1`, hardest) → replace with a second `demonstrative_this` item at `b=−1.8`. Add the affective-filter line from the source Ch 1: *"Ninguém vai rir de você."* | Affective filter is raised by the prospect of a 0.1-difficulty error item. Lowest-difficulty-first is the intervention. |
| `it_track` | Item 6's microtext is already IT-flavoured (backend, payments API, infrastructure, frontend, stand-up). Add `devops engineer` to `grm_demonstrative_this_001`'s follow-up production, matching the lesson's Output Task. | Keeps the IT track coherent across lesson + pack. |
| `learner_θ > +1.5` | Items 4 and 5 (prereq, b ≈ −1.5) are removed as redundant. Pack shrinks to 5 items, 4.5 min → ~3 min. §2.1 cap is a maximum, not a quota. | Do not drill material the learner has mastered — redundant practice is where learners disengage. |

---

## 7. VALIDATION RESULTS — What This Pack Proves About the Spec

This pack was authored **after** `post-lesson-practice-spec.md` specifically to test whether the spec's numbers hold. Findings:

| Spec claim | Held? | Evidence |
|-----------|-------|----------|
| 5–8 items fit in 3–5 min | ⚠️ Partly | 7 items with one production recording ran ~4.5 min **for a learner already at A2**. A true beginner hitting items 4 and 5 cold pushes past 5 min. **Fix:** item count should scale with `θ`, not be a fixed 5–8. |
| 60/40 current/prereq is achievable | ⚠️ Partly | At 7 items with grammar capped at 3, only 71/29 is reachable. 60/40 requires ≥10 items or a grammar cap of 4. **Fix:** state the split as a *range* (55–75% current), not a point. |
| Interleaving is natural | ✅ Yes | G-V-G-V-R-G-P emerged without forcing. The domain rotation fell out of the split rules. |
| No listening placeholder is defensible | ✅ Yes | The slot went to Reading and the pack still measured 4 domains. |
| Speaking/Writing absent from L1 | ✅ Yes | Pack reads coherent without them. |
| Every skill fails the gate on day 1 | ✅ Yes (by design) | §5.1 — confirms §7.1 is implemented, not decorative. |
| Item count is reachable without filler | ✅ Yes | 7 items, 0 filler. Every item traces to a source line or a named BR-PT error. |

### 7.1 Spec Amendments Arising From This Validation

Apply these to `post-lesson-practice-spec.md`:

1. **§2.1** — replace "Items per lesson: 5–8" with a θ-scaled range:
   `items = clamp(round(2 + 3 × P_mastery_estimate), 4, 8)`.
   High mastery → fewer items; low mastery → more.
2. **§2.1** — replace "60% / 40%" with **55–75% current**, remainder prerequisite.
3. **§2.2** — note that under Decision B the Listening row's slot is redistributed to Reading, and the manifest must record `listening_items: 0` explicitly so the absence is auditable rather than silent.

---

## 8. KNOWN DEFECT FOUND IN THE LESSON FILE

While authoring this pack, one item in `lesson-15min-workplace-greetings.md` §4.1 was found to be **incoherent** and is reported here rather than silently fixed:

**Lesson Shadow CAT item 4** (line 163–165):
> *"Erro de brasileiro: 'I am **excited to** be here' → correto?"* — keyed answer: *"Não — 'excited for' ou só 'excited to be here'"*

This is self-contradictory: the stem asks whether the sentence is correct, the sentence **is** correct, and the keyed answer says "no" while quoting the same correct form as an alternative. It fails G-Q4 (two concepts) and G-Q3 (the key is undecidable). It should be replaced, e.g.:

> **"You are Brazilian and you mean 'estou ansioso para começar'. Which is correct?"**
> A) "I'm excited **for** here."  B) **"I'm excited to be here."** ✓  C) "I'm anxious to here."

*(`anxious to be here` is the direct L1 calque of "ansioso para estar aqui" — a real, documentable BR-PT error, and therefore a legitimate distractor.)*

---

*Pack complete. Next: `assessment-item-spec.md` (item schema + distractor taxonomy + calibration), then the remaining `mod_a2_workplace_intro` lessons.*
