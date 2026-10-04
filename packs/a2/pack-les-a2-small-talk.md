# Practice Pack — `les_a2_small_talk`

**Pack ID:** `pack_les_a2_small_talk_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_small_talk.md`
**Provenance:** items `authored` — no verbatim source text. `frases-ingles-trabalho.md` Ch3 is *bibliography only* (restricted source, `external-sources.md` §0.5 / §7.0).
**Reuse basis:** `cite_only` — every item is original and no source text is reproduced. Required per artefact by `external-sources.md` §0.5; enforced for packs by `verify-integrity.py` [11b].
**Authoring date:** 2026-09-30

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_small_talk_v1
lesson_id: les_a2_small_talk
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7                       # §2.1 4–8            ✅
  time_cap: "3–5 min"                 # §2.1 hard cap       ✅
  split: 5 current / 2 prereq         # §2.1 55–75 / 25–45  ✅ (71/29)
  interleaved: true                   # §2.1 no blocked runs ✅ (G, V, R, G, V, G, P)
  max_per_domain: 3                   # §2.2 grammar        ✅
  listening_items: 0                  # deferred until render + ear-check
  br_pt_form_coverage: 6/7 scored items  # file-wide: 11 filled / 8 null (null includes the 1 production item(s) with no distractor set — these record br_pt_form_state: not_applicable_no_distractor_set) — see §2.2
  speaking_writing_items: 0           # §2.4                ✅
  authored_illustrative_parameters: true   # no `a`/`b` from calibration yet
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 3 | 2–3 | ✅ at ceiling |
| Vocabulary | 2 | 1–2 | ✅ at ceiling |
| Listening | 0 | 1 | ⚠️ **deferred** — `dlg_a2_05_touch_base` not yet rendered (`listening-corpus.md` §10.3) |
| Reading | 1 | 1–2 | ✅ absorbs the deferred listening slot |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

Difficulty `b` is **provisional** on the IRT logit scale (§ stats spec §3.2). Target `b ≈ θ + 0.3`
current, `b ≈ θ − 0.5` prerequisite. These values are *authoring priors*, not calibrated parameters;
`assessment-item-spec.md` §8.2 requires two-stage calibration before they may be reported.

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: `grm_tag_question_001`
skill: `grammar.tag_questions`
type: `gap_fill`
difficulty_b: -0.2
cefr: A2
provenance: authored
distractors:
  - option: "is it"
    br_pt_form: null
    note: "a tag-polarity error. PT has no tag question, so there is no PT form that licenses a positive tag after a positive statement"
  - option: "doesn't it"
    br_pt_form: null
    note: "imports a support the statement does not have; EN *do*-support has no PT counterpart"
  - option: "isn't this"
    br_pt_form: "não é isso?"
    note: "the more common failure per the item's own feedback: PT *isso* is available and has no equivalent in the EN tag slot, so the demonstrative is reached for"
```

**Item:**
> The release is on Friday, ___?

| Slot | Value |
|------|-------|
| A | isn't it |
| B | is it |
| C | doesn't it |
| D | isn't this |

**Key:** A — *isn't it*

**Feedback (BR-PT specific):**
> A positive statement takes a **negative** tag; a negative statement takes a positive one.
> PT has no tag question, so learners build one by translating the word order of a question
> ("não é?" → *"isn't it"*) — which is right half the time and wrong the other half.
> ⚠️ **D is the more common failure than A.** `isn't this` is what you get when the learner
> reaches for the demonstrative instead of the pronoun, because PT *"isso"* is available and
> English has no equivalent in this slot.

**Gates:** G-Q2 ✅ (*isn't this*, *doesn't it* are real errors) · G-Q3 ✅ (4 balanced options, all function words) · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_small_talk_turn_001`
skill: `vocab.small_talk_turn_taking`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
provenance: authored
distractors:
  - option: "\"Good.\""
    br_pt_form: "Bom."
    note: "PT *bom* alone is a complete-sounding answer to *como foi seu fim de semana?*, because the question is treated as a formality to acknowledge"
  - option: "\"Fine.\""
    br_pt_form: "Tudo bem."
    note: "same dead-end; PT *tudo bem* is also a greeting, so it carries no content obligation at all"
  - option: "\"It was fine, nothing special.\""
    br_pt_form: "Foi bem, nada de especial."
    note: "PT *nada de especial* is a set phrase with the same no-content effect, so the option is safe rather than contentful"
```

**Item:**
> Ana asks "How was your weekend?" Which reply keeps the conversation going?

| Slot | Value |
|------|-------|
| A | "Good." |
| B | "Fine." |
| C | "It was fine, nothing special." |
| D | **"Good, thanks — I went to the beach. And you?"** ✓ |

**Key:** D

**Feedback:**
> **C** is acceptable and safe. **D** is the item that teaches something: it answers *and* returns
> the turn, and a returned turn is the precondition for the conversation continuing at all.
> The PT-BR trap is A: a one-word answer to *"como foi seu fim de semana?"* feels complete in
> Portuguese, because the question is treated as a formality to be acknowledged. In English it is a
> request for content, and "Good" closes a door the listener is trying to open.

**Gates:** G-Q2 ✅ (*Good* as a dead-end is the documented BR-PT error) · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson (absorbs deferred Listening slot)

```yaml
item_id: `rdg_small_talk_microtext_001`
skill: `reading.scanning_microtext`
type: `scanning`
difficulty_b: -0.4
cefr: A2
provenance: authored
distractors:
  - option: "a decision"
    br_pt_form: null
    note: "internal text confusion — a DECISION is what Nadia needs, not what Marco brings"
  - option: "ten minutes"
    br_pt_form: null
    note: "internal text confusion — the opening move, not an artefact"
  - option: "the API work"
    br_pt_form: null
    note: "internal text confusion — the topic, not an artefact"
```

**Microtext (52 words):**
> Nadia caught Marco in the corridor on Tuesday. She wanted ten minutes about the API work, and
> she got them. They agreed to split the second part into two phases. Nadia needs a decision by
> Friday; Marco will send the estimate and the risk list before their next conversation.

**Question:**
> According to the text, what does Marco need to bring?

| Slot | Value |
|------|-------|
| A | a decision |
| B | the risk list and the estimate |
| C | ten minutes |
| D | the API work |

**Key:** B

**Feedback:**
> Two roles are easy to swap here and the microtext is built so they are: **Nadia** needs the
> decision (A), **Marco** supplies the estimate and the risk list (B). C is the opening move, D is
> the topic. This is the same `attribution_two_speakers` skill the listening item would have tested
> — it is recoverable in text, which is why the slot is legal to redistribute.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, current lesson

```yaml
item_id: `grm_than_object_pronoun_001`
skill: `grammar.than_with_object_pronoun`
type: `error_correction`
difficulty_b: 0.0
cefr: A2
provenance: authored
distractors:
  - option: "\"The second part is bigger than us.\" *(no change)*"
    br_pt_form: "maior do que nós"
    note: "PT requires the object form after *mais que / do que*, which makes the PT form look like the deep structure and the EN subject form like a quirk"
  - option: "\"The second part is bigger than we are.\""
    br_pt_form: null
    note: "translates to grammatical PT (*maior do que nós somos*) and is wrong only in EN — an EN-specific morphosyntactic rule, not a transfer"
  - option: "\"The second part is bigger than our.\""
    br_pt_form: "maior do que nosso"
    note: "PT possessive determiners have no bare form after *do que*"
```

**Item:**
> Correct this sentence:
> **"The second part is bigger than us."**

| Slot | Value |
|------|-------|
| A | "The second part is bigger than us." *(no change)* |
| B | **"The second part is bigger than we thought."** ✓ |
| C | "The second part is bigger than we are." |
| D | "The second part is bigger than our." |

**Key:** B

**Feedback:**
> After **than**, English requires the **subject case** (*we, they, I, he*), because the clause is
> still a subject of the comparison. PT-BR produces the object form because Portuguese also requires
> it after *mais que / do que*: *"maior **do que nós**"* — which makes the PT form look like the
> deep structure and the English form like a quirk.
> The same rule: *"Ana is taller than she used to be"* → ❌ *than her*. Also *"better than I
> thought"* — the lesson's own `dlg_a2_05_touch_base` line.

**Gates:** G-Q2 ✅ (PT-BR subject/object asymmetry after *que* is the named error) · G-Q4 ✅ (*our* is a distractor, not a second target)

---

### ITEM 5 — Grammar, **prerequisite review**

```yaml
item_id: `grm_present_simple_be_001`
skill: `grammar.present_simple_be`
type: `gap_fill`
difficulty_b: -1.5
cefr: A1
provenance: authored
prereq_lesson: `les_a2_greetings_intro`
distractors:
  - option: "work"
    br_pt_form: "Marco trabalha"
    note: "PT verbs inflect for número but not pessoa, so the third-person -s is dropped under time pressure"
  - option: "working"
    br_pt_form: "Marco trabalhando"
    note: "PT gerund attaches to *estar* and cannot follow a bare subject"
  - option: "is work"
    br_pt_form: "Marco é trabalha"
    note: "PT *é* + an invariant verb is legal, so the copula transfers with the verb unchanged"
```

**Item:**
> Marco ___ in design. He has been there three years.

| Slot | Value |
|------|-------|
| A | work |
| B | **works** ✓ |
| C | working |
| D | is work |

**Key:** B

**Feedback:**
> Present simple, third person singular takes **-s**. PT verbs inflect for *number* but not *pessoa*,
> so the -s is a category-new feature for a BR-PT learner and is dropped under time pressure.
> Offered again here rather than introduced: the pack's prerequisite items are *confidence anchors*,
> and this is the single most frequent slip in the A2 register.

**Gates:** G-Q2 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, **prerequisite review**

```yaml
item_id: `voc_role_tech_002`
skill: `vocab.roles_tech`
type: `contextual_selection`
difficulty_b: -1.3
cefr: A1
provenance: authored
prereq_lesson: `les_a2_greetings_intro`
distractors:
  - option: "\"Ahmed has the dashboard.\""
    br_pt_form: "Ahmed tem o dashboard"
    note: "PT *ter* = *have*, and this course's own mapping of *own* is *ser o responsável por*; the artefact and the role are different nouns in PT too"
  - option: "\"Ahmed is our dashboard.\""
    br_pt_form: null
    note: "a nonsense option rather than an L1 transfer — included to catch key-happy learners"
  - option: "\"Ahmed works to the dashboard.\""
    br_pt_form: "Ahmed trabalha para o dashboard"
    note: "PT *trabalhar para* = *work for*, and *para o* is a calque-shaped PT prepositional phrase with no EN counterpart"
```

**Item:**
> Ahmed owns the dashboard. Which sentence describes that correctly?

| Slot | Value |
|------|-------|
| A | "Ahmed has the dashboard." |
| B | "Ahmed is our dashboard." |
| C | **"Ahmed is our frontend developer."** ✓ |
| D | "Ahmed works to the dashboard." |

**Key:** C

**Feedback:**
> `own` in this course's job-title apposition pattern is **"ser o responsável por"**, and the noun
> after it is the **person's role**, not the artefact: *our frontend developer*, *our team lead*.
> A is the confusion that matters — "I have the dashboard" is true in the sense of "I have access
> to it", which is not what "you own it" means in a team.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_th_voiced_smalltalk_001`
skill: `pronunciation.th_voiced`
type: `minimal_pair_production`
difficulty_b: -0.6
cefr: A2
provenance: authored
asr_scored: true
clip: TTS_render_pending            # §9.3 — no audio asset exists yet
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
# This is a PRODUCTION / minimal-pair item: there is no distractor set, so there is no
# Portuguese form to record. `null` here means NOT 'no PT source' — the four states are
# told apart by `br_pt_form_state`, because collapsing them hides the interesting one.
```

**Step 1 — hear the pair:** `this` [ðɪs] · `dis` [dɪs] *(non-word)*
**Step 2 — identify:** which one did you hear?
**Step 3 — produce (ASR-scored):** record: *"This is Marco. He's our frontend developer."*

**Target phonemes:** [ð] in *this, the* · [h] in *He's* · [ɹ] initial in *Marco* · [d] final in *developer*

**Feedback:** recast only — replay the native model, no explicit correction mid-flow (§2.3).
> Do **not** display "you said /dis/". Replay and re-attempt. The Monitor Hypothesis says the
> explicit correction interrupts acquisition; the recast lets the learner self-correct.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render** (`listening-corpus.md` §10.3)

> **Spec gap recorded.** This pack targets `w_initial_glide` and `ed_past_t` from the lesson, but
> **neither has a minimal pair in `post-lesson-practice-spec.md` §2.3's priority-pair table**, which
> lists only *sink/think, the/this, have/how, room/red, start/station, PHOtograph/phoTOgrapher*.
> The pair table needs two new rows before those two tags are assessable. Logged in
> `post-lesson-practice-spec.md` §10.

---

## 3. L2/L3 SEEDS (handed to `post-lesson-practice-spec.md` §3, §4 — not delivered here)

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `tag_questions` with preposition (*aren't you*) | any tag-question item missed | **L2, day granularity** | Highest occurrence rate of the set; needs its own pack, not one item. |
| `hedge` / one-word-answer reflex | Item 2 missed | **L3** | Generated from the error log with the three exit patterns (amplify / evaluate / return). |
| `w_initial_glide` | Pronunciation item 2+ misses | **L3** | Blocked by the §2.3 pair-table gap above. |

---

## 4. VALIDATION NOTES

1. **Item 1's distractor D is the finding.** `isn't this` was expected to be the *key* pull for BR-PT
   learners. It is offered as a distractor here, which is correct for `tag_questions` but means the
   pack **cannot distinguish** a learner who knows the polarity rule from one who is pattern-matching
   on *"isn't + demonstrative"*. If calibration shows D attracting ≥ 25% of incorrect responses, it
   should be promoted to its own item testing *this* as a subject.
2. **All 7 `b` values are priors.** Per `assessment-item-spec.md` §8.2, no item enters the bank
   without two-stage calibration. The manifest records this rather than implying calibrated
   parameters exist.
3. **The listening slot is deferred, not filled.** `dlg_a2_05_touch_base` carries an item
   (`lst_gist_009`) that would fit this pack exactly. It is blocked on render + ear-check
   (`listening-corpus.md` §10.3). The slot goes to Reading, where the same construct
   (`attribution_two_speakers`) is testable in text. **Auditable, not silent** — the manifest
   records `listening_items: 0`.
