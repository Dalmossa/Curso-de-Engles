# Practice Pack — `les_a2_introducing_others`

**Pack ID:** `pack_les_a2_introducing_others_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_introducing_others.md`
**Provenance:** items `authored`. `frases-ingles-trabalho.md` Ch2 and `apostila-ingles-para-iniciantes-impresso.md` §2.2 are *bibliography only* (restricted / unlicensed sources, `external-sources.md` §0.5 / §7.0).
**Reuse basis:** `cite_only` — every item is original; both local sources are cited as bibliography and nothing from either is reproduced. Required per artefact by `external-sources.md` §0.5; enforced for packs by `verify-integrity.py` [11b].
**Authoring date:** 2026-09-30

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_introducing_others_v1
lesson_id: les_a2_introducing_others
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7                       # §2.1 4–8            ✅
  time_cap: "3–5 min"                 # §2.1 hard cap       ✅
  split: 5 current / 2 prereq         # §2.1 55–75 / 25–45  ✅ (71/29)
  interleaved: true                   # §2.1                ✅ (G, V, R, G, P, V, G)
  max_per_domain: 3                   # §2.2 grammar        ✅
  listening_items: 0                  # deferred — render only, GAP-L2 closed, see below
  br_pt_form_coverage: 6/7 scored items  # file-wide: 9 filled / 10 null (null includes the 1 production item(s) with no distractor set — these record br_pt_form_state: not_applicable_no_distractor_set) — see §2.2
  speaking_writing_items: 0           # §2.4                ✅
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 3 | 2–3 | ✅ at ceiling |
| Vocabulary | 2 | 1–2 | ✅ at ceiling |
| Listening | 0 | 1 | ✅ **clip now exists; deferred on render only.** `dlg_a2_06_intro_three_way` (3 speakers, 53 s) provides `lst_pragmatic_007`, which tests the reciprocal close — the fourth leg of the schema. GAP-L2 closed; what remains is a TTS render. |
| Reading | 1 | 1–2 | ✅ absorbs the deferred slot |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

> **Status change.** This pack used to be the only one deferring for a reason that was *not* "the
> clip has not been rendered": the dialogue had never been authored, and no amount of rendering
> would have fixed it. `dlg_a2_06_intro_three_way` was authored and GAP-L2 is closed, so the slot
> is now deferred for the ordinary reason and joins the other six packs. **The distinction is
> worth keeping in the record** — a content gap and a render gap look identical in the manifest
> (`listening_items: 0`) and have nothing in common in what they cost.

---

## 2. L1 ITEMS

---

### ITEM 1 — Coherence, current lesson ⭐ central construct

> Occupies the **Grammar** slot in the §2.2 budget. Its *skill* is pair-level (`coherence.*`) and it
> declares `domain: grammar` for weighting — see `assessment-item-spec.md` §1.2 and §10.1.

```yaml
item_id: `coh_reciprocal_intro_001`
skill: `coherence.reciprocal_introduction`
type: `checklist_completion`
difficulty_b: 0.3
cefr: A2
domain: grammar            # weights the item in the bank; the SKILL is pair-level
provenance: authored
distractors:
  - option: "\"Lucia, this is Carlos.\" → Carlos: \"Hi Lucia.\""
    br_pt_form: "Lucia, este é o Carlos."
    note: "PT *apresentar* is reciprocal by default, so one direction IS the complete act in Portuguese; the EN schema owes both directions"
  - option: "\"Lucia, meet Carlos.\" → Carlos: \"Hi Lucia, nice to meet you.\""
    br_pt_form: "Lucia, conheça o Carlos."
    note: "PT *conhecer* means *to know/meet*, not *to introduce*; *apresentar* is the introduction verb and has no bare-object EN equivalent"
  - option: "\"Lucia, this is Carlos, our new analyst.\" → Carlos: \"Hi Lucia.\""
    br_pt_form: "Lucia, este é o Carlos, nosso novo analista."
    note: "same one-shot PT introduction, with the appositive correctly built — the schema is still incomplete"
```

**Item:**
> You introduce Carlos to Lucia. Which sequence is **complete**?

| Slot | Value |
|------|-------|
| A | "Lucia, this is Carlos." → Carlos: "Hi Lucia." |
| B | "Lucia, this is Carlos." → Carlos: "Hi Lucia." → **"Carlos, this is Lucia."** ✓ |
| C | "Lucia, meet Carlos." → Carlos: "Hi Lucia, nice to meet you." |
| D | "Lucia, this is Carlos, our new analyst." → Carlos: "Hi Lucia." |

**Key:** B

**Feedback:**
> This item tests a **social schema**, not vocabulary. Every option is perfectly formed English.
> - **A** is the Brazilian usage: one introduction is enough, because in PT-BR *apresentar* is
>   naturally reciprocal. In American English the introducer owes the room **both** directions —
>   Carlos is introduced to Lucia *and* Lucia is introduced to Carlos — otherwise Lucia leaves
>   without learning the name of the person she was just introduced to.
> - **C** `meet` (without *to*) is a verb of *arrangement*, not introduction: *"let's meet at 3"*
>   means agree on a time. The introduction verb is **`introduce X to Y`**, or the fixed phrase
>   **`this is`**. *"Lucia, meet Carlos"* is a literal translation of *"Lucia, este é o Carlos"* and
>   is not English.
> - **D** adds a correct appositive and still omits the reciprocal step — which is the point. A
>   learner who fixes the syntax and not the schema still fails the situation.

**Gates:** G-Q2 ✅ (*meet* for *introduce* is the named BR-PT lexical error) · G-Q3 ✅ · G-Q4 ✅
**Skill note:** keyed as **`coherence.reciprocal_introduction`** — a pair-level construct, not a
feature of either `demonstrative_this` or `intro_reaction_gradation`. See `assessment-item-spec.md`
§10.1 for why it had to be given its own id.

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `grm_apposition_role_001`
skill: `grammar.appositive_job_title`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
provenance: authored
distractors:
  - option: "This is Marco is our backend developer."
    br_pt_form: "Este é o Marco é nosso desenvolvedor backend."
    note: "the PT relative clause pasted in with its own copula, which has no slot once the EN verb *is* is already there"
  - option: "This is Marco. He is our backend developer."
    br_pt_form: null
    note: "correct ENGLISH, excluded because the stem asks for the verb-less form — not an L1 transfer"
  - option: "This is Marco, and he is our backend developer."
    br_pt_form: null
    note: "correct English, excluded on the same stem constraint; it is additionally wordy for one fact"
```

**Item:**
> Which sentence introduces Marco and his role with **no verb**?

| Slot | Value |
|------|-------|
| A | This is Marco is our backend developer. |
| B | This is Marco. He is our backend developer. |
| C | **This is Marco, our backend developer.** ✓ |
| D | This is Marco, and he is our backend developer. |

**Key:** C

**Feedback:**
> C is an **appositive**: a noun phrase placed next to a noun to rename or describe it, set off by
> commas, with **no verb**. PT-BR learners hunt for a verb and find none, which is why A is the
> instinctive choice.
> - **B** and **D** are both correct English. They are distractors here because the item asks for
>   the verb-less form; D is additionally wordy for what should be one clause.
> - The pattern generalises: *This is Ana, our designer. That is Marco, the team lead. Ana is Marco's
>   manager and she is on the platform team.*
>
> Rule that makes it predictable: **appositive for one fact, two sentences for two facts.**
> *"This is Marco, our backend developer."* + *"He owns the payments API."*

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson (absorbs deferred Listening slot)

```yaml
item_id: `rdg_intro_attribution_001`
skill: `reading.detail_attribution_three_speakers`
type: `scanning`
difficulty_b: 0.0
cefr: A2
provenance: authored
distractors:
  - option: "Once"
    br_pt_form: null
    note: "a count; no L1 source — the error is miscounting introductions inside the text"
  - option: "Twice"
    br_pt_form: null
    note: "a count; the closing context line is what makes 2 look right, and that is a text-internal trap"
  - option: "Not stated"
    br_pt_form: null
    note: "a meta-answer (refusing the count), not a candidate count; no L1 source"
```

**Microtext (61 words):**
> Sarah stepped in with a visitor at her side. "Marco, Priya — this is Ana." Priya looked up and
> said hello. Sarah turned back to the visitor. "Ana, this is Marco, and he works on the API. And
> this is Priya, on the dashboard team." The visitor greeted both of them. Sarah finished by saying
> Ana was joining the platform team that Monday.

**Question:**
> How many times did Sarah introduce someone, counting the first line?

| Slot | Value |
|------|-------|
| A | Once |
| B | Twice |
| C | **Three times** ✓ |
| D | Not stated |

**Key:** C

**Feedback:**
> The count is the construct: **1** opening + **1** for Marco + **1** for Priya = **3**. The closing
> line ("Ana was joining the platform team that Monday") is *context*, not an introduction, and
> counting it is the trap — it is what makes B look right.
> D is the reflex when a learner treats a social-schema question as a comprehension question.
>
> This microtext is written to be **the printed version of the missing dialogue**. It is not a
> consolation prize — `attribution_three_speakers` is fully testable in text, which is why this pack's
> listening slot is redistributed rather than left empty. What is *not* recoverable in text is the
> auditory half: which speaker produced which line, and therefore whether the learner can track turn
> attribution in real time. **That is what the render costs, and it is still owed** —
> `dlg_a2_06_intro_three_way` supplies the words, so the text above is a temporary substitute
> for the *rendered* clip rather than for a missing one. When the render lands this item
> moves to the clip and the microtext retires.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, current lesson

```yaml
item_id: `grm_demonstrative_this_002`
skill: `grammar.demonstrative_this`
type: `gap_fill`
difficulty_b: -1.0
cefr: A2
provenance: authored
distractors:
  - option: "She"
    br_pt_form: "Ela é a Ana"
    note: "same PT collapse as ITEM 1 of pack-les-a2-greetings-intro.md — *é* introduces and describes alike"
  - option: "There"
    br_pt_form: "Está a Ana ali"
    note: "PT locative *está* again; the option locates rather than introduces"
  - option: "These"
    br_pt_form: null
    note: "a plural-selection error. PT *esta/estas* agrees in number exactly as EN *this/these* does, so the two systems are parallel and there is no Portuguese form being transferred"
```

**Item:**
> Sarah: "Marco, Priya — ___ is Ana. Ana is joining the platform team."

| Slot | Value |
|------|-------|
| A | This |
| B | She |
| C | There |
| D | These |

**Key:** A

**Feedback:**
> `This is` introduces; `He/She is` **describes** someone the room already knows.
> PT-BR collapses the two because *"ele é o Marco"* serves both functions in Portuguese, so the
> learner has no cue that English splits them.
> - **C** `There is` locates something, it does not introduce a person: *"There's Ana"* means Ana
>   is over there.
> - **D** `These` requires a plural referent; Ana is singular.
> - **B** `She is Ana` presupposes the listener already knows who Ana is, which is exactly the
>   situation the introduction is meant to fix.
>
> This is a **deliberate re-teach**: it was already ITEM 1 of `pack-les-a2-greetings-intro.md`
> (`grm_demonstrative_this_001`), and the lesson's prerequisite list names it. Repeating a
> construct across two packs with a new carrier sentence and new distractors is correct interleaved
> practice, not duplication. See §4.2.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: `prn_h_aspirated_hi_001`
skill: `pronunciation.h_aspirated`
type: `minimal_pair_production`
difficulty_b: -0.6
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

**Step 1 — hear the pair:** `hear` [hɪə] · `ear` [ɪə] — `ear` is not a standalone English word
**Step 2 — identify:** is there breath before the vowel?
**Step 3 — produce (ASR-scored):** record: *"Hi Ana, nice to meet you."*

**Target phonemes (checked against the carrier sentence):** [h] in *Hi* · [ɹ] initial in *ready* /
*really* — note the sentence contains no [ð] and no [ɹ]-initial word, so those are **not** listed.

**Feedback:** recast only — replay the model, no explicit correction (§2.3).
> The production target is deliberately narrower than the lesson's full `pronunciation_tags`. The
> lesson lists `th_voiced`, `h_aspirated`, `r_initial` and `linking_nice_to`; this item scores
> **one** of them. The other three are covered in `pack-les-a2-small-talk.md` ITEM 7 (`th_voiced`)
> and, for `r_initial`, **cannot be covered at all** — see §4.3.
>
> `[h]` before a vowel is load-bearing here: without it, *"Hi Ana"* reduces to a vowel-initial sound
> sequence that an American may not register as a greeting at all. This is the pair that
> `post-lesson-practice-spec.md` §2.3 lists as *have/how*, applied to the greeting that carries it.
>
> **Deliberate spacing.** `les_a2_greetings_intro` and `les_a2_introducing_others` both target
> `h_aspirated` days apart. That is `Make It Stick` retrieval spacing applied to one phoneme, and
> it is the item that requires the day-granularity L2 layer to work
> (`post-lesson-practice-spec.md` §3.2).

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Vocabulary, **prerequisite review**

```yaml
item_id: `voc_intro_reaction_002`
skill: `vocab.intro_reaction_gradation`
type: `contextual_selection`
difficulty_b: -1.3
cefr: A2
provenance: authored
prereq_lesson: `les_a2_greetings_intro`
distractors:
  - option: "\"I've heard a lot about you.\""
    br_pt_form: "Ouvi falar muito de você"
    note: "a standard PT-BR greeting that overclaims familiarity in exactly the same way, and transfers as idiom rather than as composition"
  - option: "\"We've already met.\""
    br_pt_form: "Já nos conhecemos"
    note: "PT *já* marks prior experience; the learner reaches for it to signal the familiarity the situation does not have"
  - option: "\"Welcome back.\""
    br_pt_form: "Bem-vindo de volta"
    note: "literal rendering of PT *de volta*, which presupposes a prior absence the English also presupposes"
```

**Item:**
> Ana started at the company **yesterday**. Someone introduces her. Which reaction is appropriate?

| Slot | Value |
|------|-------|
| A | "I've heard a lot about you." |
| B | **"Nice to meet you."** ✓ |
| C | "We've already met." |
| D | "Welcome back." |

**Key:** B

**Feedback:**
> Each option fails a different requirement:
> - **A** presupposes a shared reputation. It is natural for a long-tenured engineer and *wrong*
>   for someone who arrived yesterday — the same sentence overclaims, and an overclaim about
>   familiarity is socially expensive. Note the lesson's redirect: *"I've heard good things about
>   the project"* is about the work, not the person.
> - **C** asserts a shared prior meeting. It is an obligation, not an option: if you *have* met,
>   say so, because otherwise the other person believes you have forgotten.
> - **D** asserts a prior absence. Nobody is coming back.
> - **B** is the only statement that requires no background knowledge.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Grammar, **prerequisite review**

```yaml
item_id: `grm_pronoun_reference_001`
skill: `grammar.pronoun_reference_tracking`
type: `gap_fill`
difficulty_b: -1.1
cefr: A2
provenance: authored
prereq_lesson: `les_a2_meeting_open`
distractors:
  - option: "Priya"
    br_pt_form: null
    note: "a mis-attribution inside the English text; no L1 source"
  - option: "She"
    br_pt_form: null
    note: "the pull is EN gender agreement (both Ana and Priya are female). PT *ela* is likewise gender-marked, so the systems are parallel — the error is not a transfer"
  - option: "It"
    br_pt_form: null
    note: "same — no L1 source"
```

**Item:**
> Ana, Marco and Priya are in the room. Ana says to Marco: "___ , can you check with Priya? She has the numbers."

| Slot | Value |
|------|-------|
| A | Priya |
| B | She |
| C | It |
| D | **Marco** ✓ |

**Key:** D

**Feedback:**
> Two references, two different antecedents, and the item requires holding both: **`you` → Marco**
> (the addressee), **`She` → Priya** (the person just named).
> **B** is the plausible pull, because `She` refers to a female and both Ana and Priya are female.
> But the *addressee* cannot be `she`: English does not let a pronoun refer back to the person being
> addressed as a topic. If the speaker wanted to address Ana she would say *"Ana, can you…"* again,
> or drop the name entirely — *"Can you check with Priya?"*
> **A** and **C** are the remaining mis-attributions.
>
> This is a prerequisite review rather than new material because `les_a2_introducing_others`'
> Output Task requires three-way reference tracking, and the lesson's `appositive_job_title` work
> creates the antecedent chain (*"This is Marco, our backend developer. **He** owns the API"*).
> A learner who cannot resolve a two-sentence chain cannot complete the task.

**Gates:** G-Q2 ✅ (addressee-as-`she` is the documented error) · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `reciprocal_introduction` | Item 1 missed | **L2, day granularity** | Schema error, not a vocabulary gap. The review pack must present a **new** three-person set, not re-ask the same names — a learner who has memorised "Lucia/Carlos" has not learned the rule. |
| `introduce X to Y` vs `meet` | Item 1 option C chosen | **L2** | A separate lexical gap from the schema gap; must be diagnosed separately or the drill fixes the wrong one. |
| `h_aspirated` | Pronunciation item missed twice across packs | **L2 → L3** | Already trained in `les_a2_greetings_intro`; a second miss means the *rule* is not the problem — likely motor habit. Route to L3 (guided production), not more L2 (more recognition). |

---

## 4. VALIDATION NOTES

1. **Item 1 is keyed as `coherence.reciprocal_introduction` and occupies a Grammar slot.** The §2.2
   distribution table is a *slot* budget, not a taxonomy. Reciprocity is a social schema carried by
   vocabulary (`this is`, `meet`, `introduce`), and it needed a **first-class skill id** rather than
   being split across an existing `demonstrative_this` and an existing `intro_reaction` — without it,
   a learner can pass both of those and still fail the situation.
   **Status: closed in the artifact.** `assessment-item-spec.md` §10.1 now specifies the
   `coherence.` namespace and its scoring rules, §1.2 carries the `coh_` prefix, and this item
   declares `domain: grammar` so the bank can still weight it. The same applies to
   `coherence.email_register_pairing` in `pack-les-a2-email-basics.md`. Both items originally
   shipped with a `grm_` prefix over a `vocabulary.`/`pragmatics.` skill — see
   `post-lesson-practice-spec.md` §10.2 for the audit that found it.
2. **ITEM 4 deliberately re-teaches `grm_demonstrative_this_001`** from the greetings pack, with a new
   carrier sentence and a new distractor set. Same skill, new item id, same slot. This is legal
   interleaved review and **must not** be collapsed into "duplicate item" by any future
   de-duplication pass — the construct stays in rotation while the surface form changes.
3. **`r_initial` cannot be practised in any pack yet.** `listening-corpus.md` §8.3 records 2 items for
   `lst_prn_r`, below the `n ≥ 5` threshold in `diagnostic-spec.md` §3.3a, and `les_a2_introducing_others`
   targets `r_initial` in its `pronunciation_tags`. The lesson therefore declares a skill it cannot
   assess. This is recorded rather than papered over; the fix is to author ≥ 5 `prn_r_*` items, which
   is the same work that would make a per-domain θ reportable for `r_initial`.
4. **The listening slot was deferred for a worse reason than the other packs — and no longer is.** *(Recorded as it stood on 2026-09-30, before `dlg_a2_06_intro_three_way` existed; kept because the distinction is the finding.)* The other packs defer because a clip has not been rendered. This one deferred because the dialogue had not been **written**. `GAP-L2` in `listening-corpus.md` §10.2 names the fix (`dlg_a2_06_intro_three_way`,
   3 speakers, 45–60 s). Until it exists, this pack cannot claim coverage of
   `reciprocal_introduction` in the auditory modality — and the manifest says so.
5. **All `b` values are priors**, per `assessment-item-spec.md` §8.2.
