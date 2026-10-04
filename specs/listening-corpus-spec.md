# Listening Corpus — Design, Authored Dialogues, and the TTS Problem

**Purpose:** define and build the listening material the corpus did not contain, and solve the
measurement problem that authoring it creates.

**Status of the recommendation this overrides:** `content-map.md` §11.0 **Decision A** deferred Listening
on the grounds that synthetic audio is an uncontrolled nuisance variable. The user directed that the
corpus be authored. That decision stands, and this document is how it is made to work — the nuisance
variable is handled by design below, not waved away.

---

## 1. THE PROBLEM, STATED PRECISELY

`assessment-item-spec.md` §1 estimates an item's `b` from the population that answers it. A listening
item's score depends on at least four things:

| Factor | Should be | Danger |
|--------|-----------|--------|
| The learner's English | the target | — |
| The lexical content of the target word | fixed by design | fixable |
| The acoustic realisation (voice, rate, prosody) | **random, balanced** | not controlled by default |
| The learner's familiarity with that voice | uniform | **confounds with L1 in DIF** |

The failure mode: if every item uses one voice, a DIF run comparing BR-PT to other-L1 learners measures
**voice familiarity**, not language. The flagged item is uninterpretable, because no threshold can
separate the two. And a learner who fails an item may have misperceived a synthetic artefact rather
than the English.

Neither is a reason not to build the corpus. Both are design requirements.

---

## 2. THREE CONTROLS THAT MAKE SYNTHETIC AUDIO MEASURABLE

### 2.1 Control 1 — Voice as a randomised blocking variable, never a constant

**Rule.** The corpus is voiced by a **panel of ≥ 4 distinct voices**. For any given learner, voices are
assigned so that:

1. no learner hears the **same voice on more than 25% of their listening items**, and
2. **voice and target skill are not correlated** — each skill (e.g. `lst_corporate_terms`) is spread
   across all voices.

```
Forbidden:  all 40 items on voice A
Required:   voice × skill matrix is as close to balanced as the item count allows
```

This makes voice a **blocking variable**. Its effect averages out within each learner, so the `b`
estimate describes the words rather than the synth. It also means a learner who dislikes one voice
cannot systematically fail all their listening.

> **Amendment 2026-09-30 — Control 1 is BETWEEN-dialogue, not within-dialogue.** Authoring
> `listening-corpus.md` exposed a conflict between Control 1 and the two-speaker gate Q-L5. A
> dialogue's coherence requires a speaker to sound like the same person in all of its items, so
> **within a dialogue voice is pinned to speaker identity and is confounded with it by design.**
> That confound is not merely tolerated — it is what makes attribution-tracking items solvable
> (`lst_lexical_007`: which of two phrases *this speaker* used, where both are in the audio). The
> rules are therefore restated as:
>
> | Was | Now |
> |-----|-----|
> | no voice on > 25% of a learner's items | **no single dialogue supplies > 30% of a learner's listening items** |
> | voice and target skill uncorrelated | panel voices (`v_a`–`v_d`) appear across **≥ 2 levels and ≥ 3 dialogues**, and each panel voice spans ≥ 2 item types |
>
> **A level with no panel voice has no DIF defence at all.** If a level's items are all spoken by
> the two speaker voices, voice familiarity is perfectly confounded with speaker gender and cannot
> be separated with a small item count. Such a level is **CAT-ineligible on voice grounds** — not
> because the items are bad, but because the measurement cannot support the claim. This condition
> currently holds for the A1 level of `listening-corpus.md` (recorded there as **DEF-13**), and the
> remedy is a second render on panel voices, not a relabelling.

Record `voice_id` and `dialogue_id` on every response so the analysis can verify balance:

```json
{ "item_id": "lst_corp_041", "voice_id": "v_take_03", "skill_id": "lst.corporate_terms",
  "correct": true, "response_ms": 3400, "replays": 1 }
```

Rule 2 is the one that defends DIF. If a `Δ` appears on a specific skill, it cannot be attributed to
one voice, because that skill was heard on every voice.

### 2.2 Control 2 — Rate as a learner-controlled accommodation, not an item property

`content-map.md` §11 Decision #3 already fixed a dual-voice model: 1.0× canonical, 0.75× on demand,
never auto-played. One technical addition:

- The **1.0× clip is the only one that contributes to scoring.** The 0.75× clip is an accommodation
  and is logged as such (`assist_used: true`) but is **not** re-scored.
- Replays at 1.0× **are** scored. Replays are a legitimate part of listening assessment.
- A learner using the 0.75× clip is recorded as having been given an accommodation, so a
  "low listening performance" signal can be distinguished from "listening is weak."

Without this, an accommodation silently inflates the learner's listening estimate — the same class of
error as the FSRS interval multiplier corrected in `stats-progress-evaluation-spec.md` §6.2: the
mechanism helps the learner and corrupts the measurement, and nothing in the output flags it.

### 2.3 Control 3 — The pronunciation gate, and the honest admission about minimal pairs

The `lst_pron_*` minimal-pair items are the ones where TTS is genuinely risky: the item's correctness
depends on the clip containing the target phoneme, and if the engine substitutes or under-articulates
it, the keyed answer is wrong.

They are therefore split from the rest, and gated differently.

| Corpus tier | Items | TTS risk | Admission |
|-------------|-------|----------|-----------|
| **L1** — lexical target in connected speech | gist, detail, inference, lexical, pragmatic | **low** — the target is a *word choice*, and mis-rendering it makes the item *easier*, not wrong | ships with the corpus |
| **L2** — the contrast is not recoverable from the transcript alone | minimal-pair identification (`sink`/`think`, `stale`/`stele`); declarative-vs-imperative; null subject | **high** — correctness *depends* on the audio realisation | **gated**; see below |

> **Correction 2026-09-30: the L2 tier is not a phonetic tier.** It was originally defined as
> "phoneme target", and `listening-corpus.md` produced a legitimate non-phonetic member
> (`lst_prn_nullsubject_002`: *I'll look at it* vs *Look at it* — a **grammatical** contrast, where the
> distinction is the speech act). The tier's real property is narrower and better: **the contrast
> between the options is not available from the written transcript.** Pronunciation is the common
> case, not the definition. The definition matters because it is what the ear check actually
> verifies.

**The L2 gate, and why it cannot be automated today.** Verifying that a clip contains [θ] rather than
[s] requires either a phoneme-level recogniser or a human ear. The ASR phoneme-scoring engine is
unspecified (a gap recorded in `AGENTS.md` and `assessment-item-spec.md` §4.4), and a general ASR
transcriber does **not** reliably distinguish `sink` from `think` — that is exactly the problem.

So the L2 gate is:

1. **Per-clip human-ear check** by a speaker who has the target phoneme natively, against an explicit
   checklist (`[θ]` present, not [s]/[t]; [ð] present, not [d]/[z]).
2. **Phonetic transcription** of the target word recorded with the clip, so a later dispute is settled
   from the record rather than from memory.
3. **A single-voice-per-phone floor:** for any minimal pair, the two clips must be rendered by the
   **same voice at the same rate**, or the contrast is confounded with the voice and the item is
   void. This is non-negotiable and overrides Control 1 for L2 items.

> **Honest position.** L2 items are authored and specified, but **not admitted to the CAT** until the
> per-clip ear check is done by a qualified listener. L1 items are the corpus's substance, and they are
> admitted on the standard route. Shipping L2 as "ready" would be a claim this project cannot support.

### 2.4 Control 4 — Provenance, and why a reviewed corpus differs from an authored item

Every dialogue in `listening-corpus.md` is `provenance: authored`. Under
`assessment-item-spec.md` §1.1 / §5.1 Q3, an authored item is **excluded from the diagnostic CAT**
until reviewed — the rule that keeps the six surviving Tier B items out.

A corpus is different from a single authored item in one specific way: **the corpus is auditable as a
whole.** Its properties — register, length, phoneme coverage, interference density — are measurable,
whereas an individual authored item's difficulty is not. That asymmetry justifies a distinct
provenance value rather than a loophole:

| `provenance.kind` | Means | CAT-eligible when |
|-------------------|-------|-------------------|
| `source_derived` | traces to a line in one of the 7 markdowns | Stage-1 anchor passes (Q5) |
| `authored` | an individual item written to fill a gap | **never**, pending n ≥ 200 |
| `authored_reviewed_corpus` | item belongs to a corpus that passed the §3 QA gate | Stage-1 anchor passes (Q5) |

The gate is **stronger** than item review, not weaker: it audits every clip in the corpus, not one
sentence. An individual item's `b` still needs response data; a corpus's *artefacts* can be validated
directly.

---

## 3. CORPUS QA GATE (admission requirement for `authored_reviewed_corpus`)

A corpus is admitted only if **all** of the following hold. This is the checklist the ear-check
performer and the corpus author run.

| # | Gate | Threshold | Why |
|---|------|-----------|-----|
| **Q-L1** | Every clip renders its target word unambiguously | 100% | A wrong clip makes the keyed answer wrong |
| **Q-L2** | Clip duration | 45–120 s | Below 45 s gives no context; above 120 s breaks the lesson slot |
| **Q-L3** | Speech rate | 130–165 wpm | Faster and the item measures TTS speed, not English |
| **Q-L4** | Target BR-PT interference present and **labelled** | ≥ 1 per L1 dialogue | An unlabelled dialogue teaches nothing diagnostic |
| **Q-L5** | Two speakers where the register is conversational | 100% of dialogue-tier items | Single-voice prose is a reading task in disguise |
| **Q-L6** | Same voice, same rate, both members of a minimal pair | 100% of L2 items | Overrides Control 1 — see §2.3 |
| **Q-L7** | Per-clip ear check | 100% of L2 clips; 20% sample of L1 | L1 items fail *toward easiness*, so sampling is adequate |
| **Q-L8** | Voice × skill matrix balanced within 1 clip per cell | required for L1 | See §2.1 |
| **Q-L9** | Transcript matches the audio word-for-word | 100% | Transcript is the `source_derived` anchor for the item |
| **Q-L10** | No clip shorter than its transcript's word count / 2.2 wpm | 100% | Catches truncated renders |

**Q-L9 is the load-bearing gate.** Because the transcript is written first and is fixed, an item is
`source_derived` *with respect to its own transcript*. The authoring question becomes "is this
transcript well-formed?", which is reviewable — unlike "how hard is this sentence?", which is not.
This is the mechanism that makes Decision A's objection answerable rather than merely overridden.

---

## 4. ITEM TYPES

| Type | Asks | Skill id | Target | TTS tier |
|------|------|----------|--------|----------|
| `lst_gist` | What was this mainly about? | `lst.gist` | overall topic | L1 |
| `lst_detail` | Who / what / when / how many? | `lst.detail` | one fact | L1 |
| `lst_inference` | Why did the speaker say that? | `lst.inference` | pragmatic intent | L1 |
| `lst_lexical` | Which term was mentioned? | `lst.corporate_terms` | the 40-term deck | L1 |
| `lst_pragmatic` | Was the request accepted, refused, or deferred? | `lst.workplace_register` | speech act | L1 |
| `lst_pron_minpair` | Which word did you hear? | `prn.th_unvoiced` etc. | the phoneme | **L2 — gated** |

Item count per dialogue, targeting the diagnostic's `a ≥ 1.2` (`assessment-item-spec.md` §3.5):
**4 L1 items + 2 L2 items per dialogue.** Six items per dialogue is also exactly the Shadow-CAT size
from `curriculum-graph-spec.md` §4, so a dialogue can be reused as a lesson comprehension check.

> **Amendment 2026-09-30: 4–5 L1, and the L2 quota is a coverage target, not a per-dialogue count.**
> Authoring `listening-corpus.md` showed two things the original shape got wrong. (a) B1 items test
> discourse functions that need two-turn context, and 4 items could not cover the
> *concession / deferral / frame-reset* patterns; B1 dialogues run 5. (b) A fixed "2 L2 per dialogue"
> quota **forced two weak pronunciation items into two dialogues** rather than letting the corpus
> declare a phoneme gap — and both of those weak items were later withdrawn, leaving those dialogues
> with zero L2 items. A quota that produces void items is worse than no quota. **The L2 requirement is
> now a coverage requirement over the corpus as a whole** (≥ 5 admissible items per BR-PT target
> before any per-domain θ is reported, per `diagnostic-spec.md` §3.3a), not a per-dialogue count.

**Distractor rule for `lst_lexical`:** options are **other real acronyms from the 40-term deck**
(`content-map.md` §11.1), not invented strings. This is `assessment-item-spec.md` §4.3 and it holds for
audio exactly as it does for text.

### 4.1 Four pre-authoring checks (mandatory) — added 2026-09-30

Authoring the first corpus produced 12 defects, of which **9 were caught by four mechanical checks**
rather than by reading. These are now mandatory, and the defect log that motivated them is
`listening-corpus.md` §9.1.

| # | Check | Test | On failure |
|---|-------|------|------------|
| **C-A** | Every option is a real English word | each option is in the corpus vocabulary list (`content-map.md` §11.1, §11.2, + the IT register) | **reject the item** |
| **C-B** | Exactly one key | exactly one option occurs in the carrier sentence, or is uniquely licensed by the two-turn window | **reject the item** |
| **C-C** | The contrast survives in the audio channel | the key is **not a homophone** of any distractor, and the contrast is not orthographic | **reject the item** |
| **C-D** | Sub-bank by contrast type | `lst_prn_*` is assigned by the phoneme or speech contrast under test, never by authoring order | **relabel** |

**Two standing prohibitions, both derived from defects that actually occurred:**

> **P-1 — Homophones cannot be minimal-pair distractors.** *site/sight/cite*, *hair/hare*,
> *here/hear* are orthographic contrasts that English renders identically in speech. A listener who
> hears the clip correctly still cannot choose. (Defects DEF-1, DEF-12.)

> **P-2 — Word-boundary items are not listening items.** *dashboard/dash board*,
> *stakeholder/stake holder*, *somewhere/some where*, *a while/awhile* are contrasts in **English
> orthography**, not in English speech. The speaker does not pause; the listener cannot hear the
> boundary. Any `lst_*` item built on one is void by construction. (Defects DEF-7 ×2.)

**A corollary worth stating, because it is the positive form of C-C:** a [θ] item whose options are
*three / tree / free / street* is sound because the distinction is **lexical** — *three* is the only
option that fits the frame. A [θ] item whose options are *three / tree / treat* is not sound, because
the distinction is **phonological and the distractors are homophonous to the key**. The test is not
"are the words different?" but "is the difference audible?"

---

## 5. BR-PT INTERFERENCE TARGETED BY THE CORPUS

Drawn from `content-map.md` §9.1 and §11.2, ranked by diagnostic value:

| Target | Example in corpus | Item type that exploits it |
|--------|------------------|---------------------------|
| `th_unvoiced` [θ] | *think*, *three*, *thing* in "I think we should…" | `lst_pron_minpair` (L2) |
| `th_voiced` [ð] | *the*, *this*, *that* throughout | `lst_pron_minpair` (L2) |
| `null_subject` | EN drops the subject; PT requires it | `lst_pron_minpair` on "Is working." vs "He's working." |
| `r_initial` [ɹ] | *right*, *ready*, *release* — "the release is right" | `lst_detail` (the L1 trap: BR hears "l") |
| `s_cluster` | *stand-up*, *stakeholder*, *schedule* | `lst_lexical` (L1) |
| `h_aspirated` [h] | *here*, *hold on*, *hours* | `lst_pron_minpair` (L2) |
| **False cognates** | *actually*, *eventually*, *pretend*, *library* | `lst_detail` / `lst_inference` (L1) |
| `register_mismatch` | request softened vs. direct | `lst_pragmatic` (L1) |

> **Design note.** The false cognates and register items are **L1** and therefore admitted now. They
> carry most of the corpus's diagnostic value precisely because they do not depend on phoneme
> realisation — which is the technical reason the corpus is viable before the ASR engine exists.

---

## 6. WHAT THE CORPUS STILL CANNOT DO

Stated so the product does not overclaim:

| Limitation | Consequence |
|------------|-------------|
| L2 items ungated | Pronunciation scored by **identification only**, and not at all until the ear check |
| Synthetic prosody | Intonation-based inference items are authored **conservatively** — items never turn on subtle stress or intonation, only on explicit speech acts |
| No regional variety | One panel, one register (BR-leaning international English). Learners exposed to heavily accented English get no practice with it — a real gap, not a solved one |
| No connected-speech transcription | Learners get gist/detail practice, not transcription practice |
| Vocabulary ceiling | 40 corporate terms + 16 false cognates + the IT book's hardware register. Beyond that the corpus has no words |

The last row matters most for the diagnostic: `diagnostic-spec.md` §2.1 gives Listening 17% of the
blueprint once reinstated, and this corpus supports the **A2 band well and B1 thinly**. The blueprint
should be re-weighted toward A2 until the B1 material exists — this is recorded as an amendment to
`diagnostic-spec.md` §2.1 rather than left implicit.

---

## 7. VALIDATION CRITERIA FOR THE LISTENING LAYER

As with `assessment-item-spec.md` §9: a spec that has produced no artifact is a hypothesis. This spec
is validated by the corpus it produced, and by the following once responses exist.

| Claim | Test | Target |
|-------|------|--------|
| L1 items discriminate | point-biserial after n ≥ 50 | ≥ 0.20 |
| The false-cognate `lst_*` items discriminate better than average | compare their r_pb to the bank median | above median |
| Voice does not drive the score | compare accuracy by `voice_id` within learner | Δ < 0.10 |
| The 0.75× accommodation does not inflate the estimate | compare `assist_used` true vs false | reported separately, never pooled |
| L2 items are discriminable at all | eye-check 2 of 6 minimal pairs with 20 learners | ≥ 15% choose the distractor |
| Corpus reaches the listening blueprint | count admissible items by level | A2 ≥ 20, B1 ≥ 8 |

Until the corpus has 50 responses per item, `calibration.status` is `expert_anchored` and the
`SE_parameter ≈ 0.30` inflation in `assessment-item-spec.md` §3.3 applies to listening too.

---

*Companion artefact: `listening-corpus.md` (the authored dialogues and their items).
Upstream: `content-map.md` §11.0 Decision A (overridden), §11.1–11.2, §9.1.
Governed by: `assessment-item-spec.md` §1.1, §2.4, §4, §5.1.*
