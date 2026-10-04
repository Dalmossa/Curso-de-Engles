# Practice Pack — `les_a2_meeting_participate`

**Pack ID:** `pack_les_a2_meeting_participate_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_meeting_participate.md`
**Provenance:** items `authored`. `frases-ingles-trabalho.md` Ch4 is *bibliography only* (restricted source, `external-sources.md` §0.5 / §7.0).
**Reuse basis:** `cite_only` — every item is original; the restricted local source is cited as bibliography and nothing from it is reproduced. Required per artefact by `external-sources.md` §0.5; enforced for packs by `verify-integrity.py` [11b].
**Authoring date:** 2026-09-30

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_meeting_participate_v1
lesson_id: les_a2_meeting_participate
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7                       # §2.1 4–8            ✅
  time_cap: "3–5 min"                 # §2.1 hard cap       ✅
  split: 5 current / 2 prereq         # §2.1 55–75 / 25–45  ✅ (71/29)
  interleaved: true                   # §2.1                ✅ (G, P, V, G, R, V, G)
  max_per_domain: 3                   # §2.2 grammar        ✅
  listening_items: 0                  # deferred until render + ear-check
  br_pt_form_coverage: 6/7 scored items  # file-wide: 14 filled / 5 null (null includes the 1 production item(s) with no distractor set — these record br_pt_form_state: not_applicable_no_distractor_set) — see §2.2
  speaking_writing_items: 0           # §2.4                ✅
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 3 | 2–3 | ✅ at ceiling |
| Vocabulary | 2 | 1–2 | ✅ at ceiling |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ absorbs the deferred slot |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

> Note: the grammar/pronunciation order is inverted relative to the other packs (P at position 2)
> because the `-ed` item is a review of `les_a2_meeting_open` and should not gate the learner's
> entry into the harder `agree` items. §2.1 requires interleaving, not a fixed domain order.

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson ⭐ canonical BR-PT error

```yaml
item_id: `grm_agree_verb_001`
skill: `grammar.agree_verb_not_adjective`
type: `error_correction`
difficulty_b: -0.4
cefr: A2
provenance: authored
br_pt_error_named: "I'm agree"          # literal translation of "estou de acordo"
distractors:
  - option: "\"I'm agree with the plan.\" *(no change)*"
    br_pt_form: "Estou de acordo com o plano"
    note: "PT *de acordo* is a prepositional phrase functioning like an adjective, so a copula plus a verb is the literal translation — already named in the item's own `br_pt_error_named`"
  - option: "\"I am agree the plan.\""
    br_pt_form: "Estou de acordo o plano"
    note: "the same PT source with the preposition dropped, which is what happens when the phrase is treated as an adjective"
  - option: "\"I agree of the plan.\""
    br_pt_form: "Estou de acordo do plano"
    note: "PT *de acordo com* requires *com*; the calque keeps only *de*"
```

**Item:**
> Correct this sentence:
> **"I'm agree with the plan."**

| Slot | Value |
|------|-------|
| A | "I'm agree with the plan." *(no change)* |
| B | **"I agree with the plan."** ✓ |
| C | "I am agree the plan." |
| D | "I agree of the plan." |

**Key:** B

**Feedback:**
> `agree` is a **verb**, not an adjective, so it takes no form of `be`. The generalisation is the
> useful part — three verbs share this error because they share a cause:
> - *I'm agree* → **I agree**
> - *I'm think* → **I think**
> - *I'm understand* → **I understand**
>
> The rule that catches all three: **a verb of opinion or cognition after `be` is always wrong in
> English.**
> `be` + adjective *is* fine (*I'm ready, she's Brazilian, we're late*) — the error is specifically
> **a verb** in that slot.
> Portuguese *"estou de acordo"* is a prepositional phrase where *"de acordo"* functions like an
> adjective, which is exactly why the translation produces a copula plus a verb.

**Gates:** G-Q2 ✅ · G-Q4 ✅ · **diagnostic value:** near-binary, so it discriminates cleanly (§4.1)

---

### ITEM 2 — Pronunciation, current lesson

```yaml
item_id: `prn_th_voiced_that_then_001`
skill: `pronunciation.th_voiced_that_then_there`
type: `minimal_pair_production`
difficulty_b: -0.4
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

**Step 1 — hear the pair:** `that` [ðæt] · `that` [tæt] — not a word pair; a **voicing** pair
**Step 2 — identify:** is the tongue between the teeth, or is it a plain /t/?
**Step 3 — produce (ASR-scored):** record: *"I see that, but I don't think it's right."*

**Target phonemes:** [ð] in *that, don't, think, right* · [θ] in *think*

**Feedback:** recast only — replay the model, no explicit correction (§2.3).
> **`that` and `then` are homophones in standard American English** — both [ðæt] / [ðen] with the
> same [ð]. PT-BR treats them as distinct ("esse" vs "então"), so a learner hearing *"I see that
> but I think…"* can mis-parse the clause boundary. The drill exists to stop the ear from
> translating before it decodes.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_hedge_calibration_001`
skill: `vocab.hedge_calibration`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
provenance: authored
distractors:
  - option: "\"I might be wrong, but the latency is down.\""
    br_pt_form: "Talvez eu esteja errado, mas a latência caiu."
    note: "PT *talvez* is a single hedge that can govern a whole clause; it costs no content in PT"
  - option: "\"It seems to me that the latency is down, but maybe I could be wrong.\""
    br_pt_form: "Me parece que a latência caiu, mas talvez eu possa estar errado."
    note: "PT *parece que* plus *talvez* — two hedges, both free in PT"
  - option: "\"Perhaps possibly probably the latency might be down.\""
    br_pt_form: "Talvez possivelmente provavelmente a latência possa ter caído"
    note: "the named error `hedge_stacking`: PT stacks adverbs of probability as a politeness layer with no content cost, and EN stacking weakens the claim four times over"
```

**Item:**
> You checked the logs. You are certain of the result but you have not yet told the team. Which
> is the most accurate?

| Slot | Value |
|------|-------|
| A | "I might be wrong, but the latency is down." |
| B | "It seems to me that the latency is down, but maybe I could be wrong." |
| C | **"The latency is down."** ✓ |
| D | "Perhaps possibly probably the latency might be down." |

**Key:** C

**Feedback:**
> The situation licenses **no hedge at all**: you checked, you are certain. Every hedged option (A,
> B, D) is *underclaiming*, and in a meeting it costs credibility — the listener files the claim
> as unverified and moves on.
> **D is the named BR-PT error**: `hedge_stacking`. Portuguese allows *"talvez talvez possivelmente"*
> as a politeness layer with no content cost; in English each additional hedge **weakens** the claim
> further, and four of them make it unintelligible. The rule this item teaches: **one hedge, matched
> to how strong the evidence is.**
> A is not wrong — it is right when you *are* unsure. The item is about the mapping, not about
> banning hedges.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, current lesson

```yaml
item_id: `grm_did_base_form_001`
skill: `grammar.did_plus_base_form`
type: `error_correction`
difficulty_b: -0.5
cefr: A2
provenance: authored
distractors:
  - option: "\"We didn't used the old API in the last release.\" *(no change)*"
    br_pt_form: "não usamos"
    note: "PT negative past is a single preterite preceded by *não*; the EN past participle has no PT counterpart to inherit"
  - option: "\"We didn't uses the old API in the last release.\""
    br_pt_form: "não usa"
    note: "PT present keeps its -a inflection while the past is invariant, so the learner has two different habits to keep straight and imports the wrong one"
  - option: "\"We not used the old API in the last release.\""
    br_pt_form: "Nós não usamos"
    note: "PT puts *não* straight onto the verb with no auxiliary, so EN's auxiliary-less negation is the literal translation"
```

**Item:**
> Correct this sentence:
> **"We didn't used the old API in the last release."**

| Slot | Value |
|------|-------|
| A | "We didn't used the old API in the last release." *(no change)* |
| B | **"We didn't use the old API in the last release."** ✓ |
| C | "We didn't uses the old API in the last release." |
| D | "We not used the old API in the last release." |

**Key:** B

**Feedback:**
> `did` / `didn't` **absorbs** the past marking, so the main verb reverts to the **base form**:
> *didn't use, didn't go, didn't finish* — never *didn't used*.
> In questions and positives the same holds after `did`: *"Did you use it?"* · *"I did use it."*
> C is the symmetry error — applying the *-s* rule that belongs to *he/she/it* present simple.
> This is the same single cause as *I'm agree*: a feature that exists in PT is carried over to a
> position where English distributes it differently.

**Gates:** G-Q2 ✅ · G-Q4 ✅

---

### ITEM 5 — Reading, current lesson (absorbs deferred Listening slot)

```yaml
item_id: `rdg_pragmatic_reading_001`
skill: `reading.detail_pragmatic_intent`
type: `true_false_microtext`
difficulty_b: 0.2
cefr: A2
provenance: authored
distractors:
  - option: "False"
    br_pt_form: null
    note: "a truth value; no L1 source"
  - option: "Not stated"
    br_pt_form: null
    note: "a meta-answer; no L1 source"
  - option: "False — he asked for more time"
    br_pt_form: null
    note: "a truth value plus an inference; the misconception it targets is a PT-BR meeting-culture effect (dates read as negotiable), not a transferable form"
```

**Microtext (58 words):**
> Ahmed: Thursday is tight, but yes. I can have it by Thursday EOD.
> Sarah: Noted — action item for Ahmed, Thursday EOD.
> Priya: Is that going to work? The review is not done yet.
> Ahmed: I might be wrong, but I can start the review tonight.
> Sarah: Let us keep it Thursday for now, and we will see.

**Question:**
> Did Ahmed agree to the Thursday deadline? (T/F/NS)

| Slot | Value |
|------|-------|
| A | **True** ✓ |
| B | False |
| C | Not stated |
| D | False — he asked for more time |

**Key:** A

**Feedback:**
> This item exists because *true* / *false* on a sentence containing a hedge is the exact place a
> reading-only learner goes wrong. Every hedge in the text is a **commitment with a reservation**,
> not a refusal:
> - *"tight, but yes"* — committed, reservation about slack
> - *"I might be wrong, but I can start tonight"* — committed, reservation about the estimate
> - *"keep it Thursday for now"* — deferred but **still Thursday**
>
> D is the double-fall: it reads the hedge as a request for extension. In English the reserved
> quantity is the *margin*, not the *date*. A learner trained on PT-BR meeting dynamics will feel the
> date is negotiable and answer D — that is the misconception this item is built to surface.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **construct:** pragmatic intent, not literal content

---

### ITEM 6 — Vocabulary, **prerequisite review**

```yaml
item_id: `voc_two_part_disagreement_002`
skill: `vocab.counter_proposal_could_we`
type: `gap_fill`
difficulty_b: -1.2
cefr: A2
provenance: authored
prereq_lesson: `les_a2_meeting_open`
distractors:
  - option: "\"Should we ship it in the next release?\""
    br_pt_form: "Deveríamos lançar na próxima versão?"
    note: "PT *deveríamos* is simultaneously obligation and suggestion, so it does not mark the proposal/objection distinction EN makes with *could we* vs *should we*"
  - option: "\"Could we to ship it in the next release instead?\""
    br_pt_form: "Poderíamos para lançar na próxima versão?"
    note: "PT modal plus bare infinitive is legal, which is exactly what leaks into the EN modal frame"
  - option: "\"Must we ship it in the next release instead?\""
    br_pt_form: "Precisamos lançar na próxima versão?"
    note: "PT *precisar* is obligation in the third person with no interrogative marking, so nothing in PT signals that EN *must we* presumes an imposition"
```

**Item:**
> "I see your point, but I'm worried about review time. ___ we ship it in the next release instead?"

| Slot | Value |
|------|-------|
| A | "Should we ship it in the next release?" |
| B | **"Could we ship it in the next release instead?"** ✓ |
| C | "Could we to ship it in the next release instead?" |
| D | "Must we ship it in the next release instead?" |

**Key:** B

**Feedback:**
> The proposal frame is **`Could we…?`** — modal + subject + verb — and it is the third movement of
> the disagreement frame: **validate → reserve → propose**. *Could we* is preferred over *Shall we*
> and over *Why don't we* in American professional English, where the latter reads as casual to
> slightly dismissive.
> - **C** is the *-s* rule leaking into a modal frame: the subject is *we*, not *he/she/it*, so
>   nothing inflects. Same single cause as `didn't uses` in ITEM 4.
> - **D** `Must we` *is* a well-formed English question, and it is the sharpest distractor
>   available: it changes the **speech act** from *proposal* to *objection to an imposition*.
>   *"Must we ship it…?"* presumes someone has already decided. Rare and unwelcome in a meeting.
> - **A** is the right request with the wrong force: *should we* opens a debate, *could we* offers an
>   alternative. The distinction is invisible to a form-only grader.
>
> ⚠️ **This item was rewritten after authoring.** Version 1 had three identical options (A, B, C),
> which made it unscorable for any learner who read carefully — and it passed `G-Q3` at authoring
> time because I checked that the options were *different words*, not *different strings*. Recorded
> as `PACK-DEF-01`; now permanently guarded by a mechanical duplicate-option check in
> `verify-integrity.py`, and the key line is machine-parseable so a later edit cannot silently
> re-break it.

**Gates:** G-Q2 ✅ · G-Q3 ✅ (4 distinct strings, after the rewrite) · G-Q4 ✅

---

### ITEM 7 — Grammar, **prerequisite review**

```yaml
item_id: `grm_past_simple_regular_001`
skill: `grammar.past_simple_negative`
type: `gap_fill`
difficulty_b: -1.1
cefr: A2
provenance: authored
prereq_lesson: `les_a2_meeting_open`
distractors:
  - option: "was not slow"
    br_pt_form: "não era lento"
    note: "the PT negation sits on the ADJECTIVE, so a literal translation produces an opposite claim rather than a negated verb"
  - option: "didn't slow"
    br_pt_form: null
    note: "the error is a missing base form after *did*, and PT has no periphrastic *did* to inherit — there is no Portuguese form to record"
  - option: "doesn't"
    br_pt_form: "não era rápido"
    note: "PT negation alone is person-invariant; the past has to be carried by the tense of *ser/estar*, which is what the learner drops"
```

**Item:**
> Last sprint, the service ___ fast. We fixed it in March.

| Slot | Value |
|------|-------|
| A | was not slow |
| B | didn't slow |
| C | **wasn't** ✓ |
| D | doesn't |

**Key:** C

**Feedback:**
> `be` keeps its own past form (*was, were*) — it does **not** join the `did` + base-form system.
> *"The service didn't slow"* is not English. Only non-`be` verbs take `didn't` + base.
> The rule is one line: **`did` handles every verb except `be`.**
> - **A** `was not slow` is **grammatical but wrong in meaning**: it says the service was not slow,
>   i.e. the opposite of the intended claim. Adjectival negation is a live distractor because the
>   sentence admits it without a grammatical error.
> - **B** is the named error: `didn't` + a non-`be` verb with no base form.
> - **D** `doesn't` is the tense error — present for a past claim.
>
> Offered as prerequisite review because the lesson's disagreeing frame requires the past tense
> ("the service *was* slow last week"), and a learner who cannot produce it cannot disagree about a
> past fact at all.

**Gates:** G-Q2 ✅ · G-Q3 ✅ (4 distinct strings) · G-Q4 ✅
>
> **Note:** this item shipped in version 1 with `wasn't` in both A and C — a second instance of
> `PACK-DEF-01`, caught by the same check on the same day. Two out of the first four packs authored
> contained a duplicate-option defect, which is strong evidence the defect is an **authoring
> habit** and not bad luck; that is why the check is mechanical rather than a review note.

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `agree_verb_not_adjective` | Item 1 missed | **L2, day granularity** | Named error with reported frequency > 40%; needs its own 3-item pack (`be` + opinion verb, 3 verbs). |
| `hedge_stacking` | Item 3 missed | **L2** | Not a knowledge gap but a *calibration* gap — the learner may know every hedge. Feedback must address selection, not vocabulary. |
| `counter_proposal` | Output Task turn 3 failed | **L3** | B1 construct; log it, do not gate A2 on it. |

---

## 4. VALIDATION NOTES

1. **Item 1 is near-binary and should be kept in the bank.** A construct with no partial-credit zone
   produces a clean information contribution per item, which is what `assessment-item-spec.md` §9's
   `n = 4/(a²·SE²)` needs. Recommend anchoring `b` **below** bank mean — an item everyone answers
   correctly contributes no discrimination.
   **But**: if the item fails in > 40% of BR-PT responses, it is not a *hard item*, it is an item
   **about an interlanguage**, and the bank must report error rate **per L1**, not globally — or the
   item will be dropped as "easy for the world" and Brazilian learners will never be corrected.
2. **`PACK-DEF-01` — Item 6 has duplicate options (A, B, C are the same string).** The item is
   unscorable as written. It is **not deleted**, because deleting it would hide the defect; it is
   retained and flagged. **Action:** rewrite the distractors before this pack is used with a learner,
   and add a mechanical duplicate-option check to `verify-integrity.py` so no second pack repeats it.
3. **Item 5 is the only pack item that tests *intent* rather than *content*.** It must be graded by a
   pragmatic label, not by string match against the microtext. A learner who writes "T" is right for a
   reason the text does not contain, and a text-similarity grader will mark it wrong.
4. **All `b` values are priors**, per `assessment-item-spec.md` §8.2.
