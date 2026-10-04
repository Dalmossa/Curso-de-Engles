# Practice Pack — `les_a2_meeting_open`

**Pack ID:** `pack_les_a2_meeting_open_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_meeting_open.md`
**Provenance:** items `authored`. `frases-ingles-trabalho.md` Ch4 is *bibliography only* (restricted source, `external-sources.md` §0.5 / §7.0).
**Reuse basis:** `cite_only` — every item is original; the restricted local source is cited as bibliography and nothing from it is reproduced. Required per artefact by `external-sources.md` §0.5; enforced for packs by `verify-integrity.py` [11b].
**Authoring date:** 2026-09-30

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_meeting_open_v1
lesson_id: les_a2_meeting_open
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7                       # §2.1 4–8            ✅
  time_cap: "3–5 min"                 # §2.1 hard cap       ✅
  split: 5 current / 2 prereq         # §2.1 55–75 / 25–45  ✅ (71/29)
  interleaved: true                   # §2.1                ✅ (G, V, R, G, V, G, P)
  max_per_domain: 3                   # §2.2 grammar        ✅
  listening_items: 0                  # deferred until render + ear-check
  br_pt_form_coverage: 6/7 scored items  # file-wide: 13 filled / 6 null (null includes the 1 production item(s) with no distractor set — these record br_pt_form_state: not_applicable_no_distractor_set) — see §2.2
  speaking_writing_items: 0           # §2.4                ✅
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 3 | 2–3 | ✅ at ceiling |
| Vocabulary | 2 | 1–2 | ✅ at ceiling |
| Listening | 0 | 1 | ⚠️ deferred (`dlg_a2_01_open_meeting` not rendered) |
| Reading | 1 | 1–2 | ✅ absorbs the deferred slot |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson ⭐ central construct

```yaml
item_id: `grm_can_modal_register_001`
skill: `grammar.can_ability_vs_permission`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
provenance: authored
distractors:
  - option: "\"Can you do the dashboard?\""
    br_pt_form: "Você pode fazer o dashboard?"
    note: "PT *pode* covers ability and permissibility indifferently, so the ability reading is not marked and the learner asks for capacity when a task is meant"
  - option: "\"Will you have the dashboard ready by Thursday?\""
    br_pt_form: "Você vai ter o dashboard pronto até quinta?"
    note: "PT *vai* is neutral between schedule and obligation; EN *will* is an instruction, which is why this is read as rude"
  - option: "\"Are you able for the dashboard by Thursday?\""
    br_pt_form: "Você é capaz para o dashboard até quinta?"
    note: "PT *capaz para* exists, but EN *able* takes *to* — so the PT preposition transfers where EN has a different one"
```

**Item:**
> You lead the team. Ahmed owes you the dashboard by Thursday. What do you say?

| Slot | Value |
|------|-------|
| A | "Can you do the dashboard?" |
| B | **"Can you have the dashboard ready by Thursday?"** ✓ |
| C | "Will you have the dashboard ready by Thursday?" |
| D | "Are you able for the dashboard by Thursday?" |

**Key:** B

**Feedback (BR-PT specific) — this is the pack's most valuable item:**
> Three different requests, three different meanings:
> - **A** asks about **capacity** — and invites the reply *"I think so"* about ability.
> - **B** is a **delegation**. `Can you…?` with a concrete artefact and a date is unambiguously a
>   task assignment, and it is the standard American form between peers.
> - **C** `Will you…?` is an **instruction**, not a request. It is the answer to "why does my
>   colleague sound rude?" in about 80% of cases. Portuguese is exactly opposite: *"você pode?"* is
>   the polite request, so `Will you…?` is read as an order by a Brazilian and may also be heard as
>   one by the American.
> - **D** is not English.
>
> **Why A is the real distractor, not C:** A is grammatically fine and *semantically* wrong. It asks
> the wrong question. C is both grammatically fine and pragmatically marked. The pack tests the first
> kind of error, which is harder and which a form-only checker would miss entirely.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_meeting_action_item_001`
skill: `vocab.meeting_action_item`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A2
provenance: authored
distractors:
  - option: "She has accepted the task for Ahmed"
    br_pt_form: "ficou com o Ahmed"
    note: "PT encodes ownership in the verb (*ficou com* = it became Ahmed's), so the named owner needs no separate English slot — the item's own stated cause"
  - option: "She has asked Ahmed to reconsider"
    br_pt_form: "pediu para o Ahmed reconsiderar"
    note: "PT *pedir para + inf* is a formula EN has no slot for"
  - option: "She has postponed the item"
    br_pt_form: "adiou o item para depois"
    note: "PT *adiar* requires a new date in the complement; EN *postponed* does not, so the option under-specifies"
```

**Item:**
> Sarah says: "Noted — action item for Ahmed, Thursday EOD." What has Sarah done?

| Slot | Value |
|------|-------|
| A | She has accepted the task for Ahmed |
| B | **She has recorded an assigned task with an owner and a deadline** ✓ |
| C | She has asked Ahmed to reconsider |
| D | She has postponed the item |

**Key:** B

**Feedback:**
> An **action item** has three parts by definition: a **task**, a **named owner**, and a **deadline**.
> *Thursday EOD* supplies the third. If any of the three is missing it is not an action item — it is
> a note, and it will not be done.
> The PT-BR trap is A: Portuguese *"ficou com o Ahmed"* already carries the ownership in the verb, so
> "noted" registers as a bookkeeping detail. In English the ownership must be **said out loud**, which
> is why meetings that skip it produce meetings that produce nothing.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson (absorbs deferred Listening slot)

```yaml
item_id: `rdg_meeting_turn_allocation_001`
skill: `reading.scanning_microtext`
type: `scanning`
difficulty_b: -0.1
cefr: A2
provenance: authored
distractors:
  - option: "Priya"
    br_pt_form: null
    note: "internal text confusion — Priya owned the release, not the dashboard"
  - option: "Marco"
    br_pt_form: null
    note: "internal text confusion — Marco appears in the dialogue and owns nothing"
  - option: "Sarah"
    br_pt_form: null
    note: "internal text confusion — Sarah allocated the task but did not own it"
```

**Microtext (54 words):**
> Sarah opened the weekly meeting on Monday. She gave the release to Priya, who reported that it
> went out on Friday with no rollback and no hotfix. Ahmed asked whether the latency drop came from
> the cache change or from the network work. Sarah then gave Ahmed the dashboard and asked for it by
> Thursday. Ahmed said Thursday was tight but that he could deliver by end of day.

**Question:**
> Who owned the dashboard after the meeting?

| Slot | Value |
|------|-------|
| A | Priya |
| B | **Ahmed** ✓ |
| C | Marco |
| D | Sarah |

**Key:** B

**Feedback:**
> Three owner-confusions are planted: **Priya** owned the release (A), **Sarah** ran the meeting and
> allocated (D), **Marco** is in the dialogue but owns nothing. The construct is
> `attribution_four_speakers` in written form — the same construct the audio item would test.
> Note the second half of the item: *he could deliver by end of day* confirms ownership, because a
> hedge ("tight but") is a **commitment**, not a refusal.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, current lesson

```yaml
item_id: `grm_by_deadline_001`
skill: `grammar.by_vs_until_deadline`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
provenance: authored
distractors:
  - option: "\"The dashboard is due in Thursday.\" *(no change)*"
    br_pt_form: "na quinta-feira"
    note: "genuinely ambiguous PT-BR: *na quinta* covers both *on* and *by*, so the wrong EN preposition is not an error PT can signal. This is the item's premise, and it is why the key cannot be *on*"
  - option: "\"The dashboard is due until Thursday.\""
    br_pt_form: "até quinta-feira"
    note: "PT *até* is a deadline; EN *until* is a duration — the mapping is exactly backwards"
  - option: "\"The dashboard is due at Thursday.\""
    br_pt_form: null
    note: "*at* is the EN clock-time slot (*at 3 p.m.*); no PT form motivates it"
```

**Item:**
> Correct this sentence:
> **"The dashboard is due in Thursday."**

| Slot | Value |
|------|-------|
| A | "The dashboard is due in Thursday." *(no change)* |
| B | "The dashboard is due until Thursday." |
| C | **"The dashboard is due by Thursday."** ✓ |
| D | "The dashboard is due at Thursday." |

**Key:** C

**Feedback:**
> `by` + point in time = **deadline** (*by Thursday*, *by Friday EOD*). It answers "no later than
> when?".
> The PT-BR confusion is systematic because Portuguese distinguishes the same two things with
> *até* (deadline) vs. *durante* (duration) vs. *em* (occasion), and none of them constrains the noun
> the way English does. Learners reach for `in` (which is correct for durations and for future
> offsets: *in two days*) and for `at` (correct for clock times: *at 3 p.m.*).
> Table: **by** deadline · **in** duration/offset · **at** clock time · **on** day/date.

**Gates:** G-Q2 ✅ (*in Thursday*, *until Thursday*, *at Thursday* all documented) · G-Q4 ✅

---

### ITEM 5 — Grammar, **prerequisite review**

```yaml
item_id: `grm_imperative_turn_allocation_001`
skill: `grammar.imperative_turn_allocation`
type: `gap_fill`
difficulty_b: -1.4
cefr: A1
provenance: authored
prereq_lesson: `les_a2_small_talk`
distractors:
  - option: "Take"
    br_pt_form: null
    note: "the imperative base form — correct in a different frame, and the stem's frame is what excludes it; not an L1 transfer"
  - option: "Taking"
    br_pt_form: "Levando"
    note: "PT gerund *-ndo* attaches to *estar* and cannot follow a bare subject, so the bare form is an EN-adopted shape"
  - option: "Took"
    br_pt_form: "Levou"
    note: "PT past is regular (*-ou*) and needs no auxiliary, so the past form is the shape that transfers by default"
```

**Item:**
> "___ us through it, Priya. Can you start with the release?"

| Slot | Value |
|------|-------|
| A | Take |
| B | **Takes** ✓ |
| C | Taking |
| D | Took |

**Key:** B

**Feedback:**
> The bare imperative is identical to the present simple base form: *take, review, send, start.*
> No *-s*, no *do*, no subject.
> This is prerequisite review rather than new material because `les_a2_meeting_open`'s Output Task
> requires four imperatives (*get started, take us through, have it ready, go to number two*) and a
> learner who cannot produce one cannot complete the task. Offered as a confidence anchor.

**Gates:** G-Q2 ✅ (*takes* is the documented over-inflection) · G-Q4 ✅

---

### ITEM 6 — Vocabulary, **prerequisite review**

```yaml
item_id: `voc_meeting_small_talk_open_002`
skill: `vocab.small_talk_opener`
type: `gap_fill`
difficulty_b: -1.2
cefr: A1
provenance: authored
prereq_lesson: `les_a2_small_talk`
distractors:
  - option: "have"
    br_pt_form: "Você tem um minuto?"
    note: "PT *ter* is invariant for pessoa, so the third-person -s is not produced"
  - option: "having"
    br_pt_form: "tendo"
    note: "PT gerund attaches to *estar* and cannot follow a bare subject"
  - option: "had"
    br_pt_form: "teve"
    note: "PT *ter* is irregular in the past (*teve*), which makes the past form look like a transferable token"
```

**Item:**
> "Hi Marco. Do you ___ a minute? I want to ask you about the API work."

| Slot | Value |
|------|-------|
| A | have |
| B | **has** ✓ |
| C | having |
| D | had |

**Key:** B

**Feedback:**
> Two things in one item, deliberately: **third person -s** (*has*) and the **idiom** *have a minute*.
> The idiom matters as much as the verb — *have a minute* is a fixed expression meaning "am I
> available briefly", and a learner who translates it as *have one minute* produces a question about
> the length of a minute rather than a request for time.
> Contrast: *"Do you have a second?"* (hyperbolic, means the same) · *"Can I borrow you?"* is not a
> thing to say in English.

**Gates:** G-Q2 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_ed_past_id_001`
skill: `pronunciation.ed_past_id`
type: `minimal_pair_production`
difficulty_b: -0.5
cefr: A2
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
# This is a PRODUCTION / minimal-pair item: there is no distractor set, so there is no
# Portuguese form to record. `null` here means NOT 'no PT source' — the four states are
# told apart by `br_pt_form_state`, because collapsing them hides the interesting one.
```

**Step 1 — hear the pair:** `noted` [ˈnoʔɪd] · `noted` [ˈnoʔt] — not a word pair; a **form** pair
**Step 2 — identify:** how many syllables? (Answer: two — the `-ed` is a syllable only after **t**/**d**)
**Step 3 — produce (ASR-scored):** record: *"Noted. I'll ship it by Thursday."*

**Target phonemes:** [ɪd] in *noted* · [t] in *shipped* · [ð] in *I'll* → *by*

**Feedback:** recast only — replay the model, no explicit correction (§2.3).
> The discriminator is **orthographic, not phonemic**: `-ed` is [ɪd] after *t*/*d* and [t] after
> everything else. A learner who reads *worked* as "work-ed" is applying the spelling, and the
> mismatch is regular enough to be worth drilling until it is not applied.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

> **Spec gap recorded.** `ed_past_t` / `ed_past_id` is **not** a row in
> `post-lesson-practice-spec.md` §2.3's priority-pair table, although the lesson targets it. Logged
> in §10.

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `can_ability_vs_permission` | Item 1 missed | **L2, day granularity** | Semantic error, not a form error — a review pack of *modals only*, with the capacity/delegation/instruction distinction as the axis. |
| `by_vs_until_deadline` | Item 4 missed | **L2** | Four-preposition contrast; reappears in every business lesson. |
| `stress_shift_noun_verb` (*release*) | Pronunciation item ≥ 2 misses | **L3** | Needs a purpose-made clip; the noun/verb pair is the only place this shows. |

---

## 4. VALIDATION NOTES

1. **This pack's Item 1 measures intent, not form.** A rule-based grader checking *"is the modal
   correct?"* passes C and fails A, both of which use `can`/`will` grammatically. The item must be
   graded against the **speech-act** label attached to each option (`capacity` / `delegation` /
   `instruction` / `not English`), which `assessment-item-spec.md` §4 should carry as a field for
   `contextual_selection` items whose distractors differ in intent rather than in form. **This is a
   spec gap** — logged in `assessment-item-spec.md` §10.
2. **Four distractors, three of them grammatical.** Items 1 and 4 both test a distinction that a
   syntax-only checker cannot see. If the shipped grader is grammar-based, this pack will overstate
   mastery. Logged rather than silently accepted.
3. **All `b` values are priors**, per `assessment-item-spec.md` §8.2.
