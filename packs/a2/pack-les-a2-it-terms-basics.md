# Practice Pack — `les_a2_it_terms_basics`
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_it_terms_basics_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_terms_basics.md`
**Provenance:** items `authored`. The lesson adapts **S16** and **S01** (both CC-BY-4.0); see the lesson's
**Reuse basis:** `adapt_with_attribution` — inherits the lesson's basis. Adapts **S01** (Google developer documentation style guide, CC-BY-4.0) and **S16** (Kubernetes docs, CC-BY-4.0); both are permissively licensed, which is the only reason `adapt_with_attribution` is legal here. Required per artefact by `external-sources.md` §0.5; enforced for packs by `verify-integrity.py` [11b].
"Fontes e Atribuição" section. No local PDF contributes text — `content-map.md` §11.1 was
**deliberately not used**, because it is a research scaffold derived from a restricted source
(`verify-integrity.py` [11]).
**Authoring date:** 2026-09-30

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_terms_basics_v1
lesson_id: les_a2_it_terms_basics
learner_profile: default
estimated_minutes: 5
spec_conformance:
  item_count: 7                       # §2.1 4–8            ✅
  time_cap: "3–5 min"                 # §2.1 hard cap       ✅
  split: 5 current / 2 prereq         # §2.1 55–75 / 25–45  ✅ (71/29)
  interleaved: true                   # §2.1                ✅ (G, V, P, G, R, V, G)
  max_per_domain: 3                   # §2.2 grammar        ✅
  listening_items: 0                  # deferred — render-blocked, see below
  speaking_writing_items: 0           # §2.4                ✅
  authored_illustrative_parameters: true
  br_pt_form_coverage: 7/7             # all items carry it — see post-lesson-practice-spec.md §10.2
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 3 | 2–3 | ✅ at ceiling |
| Vocabulary | 2 | 1–2 | ✅ at ceiling |
| Listening | 0 | 1 | ⚠️ **deferred — render-blocked.** The lesson's own input is `dlg_a2_04_bug_report`, which has no rendered audio, so no admissible `lst_*` item can be scored. This is the *lesser* of the two deferral causes — unlike GAP-L2 in `pack-les-a2-introducing-others.md`, the clip exists. |
| Reading | 1 | 1–2 | ✅ absorbs the deferred slot |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

> **Why the Reading slot absorbs it, here as in every other pack.** The deferred listening item would
> have tested `listening.noun_compound_identification` — counting compounds in a spoken clip. That
> skill has exactly one admissible source, the unrendered clip, so it cannot be replaced without
> pretending. ITEM 5 tests a *different* skill (`reading.gloss_pattern_comprehension`) on text that
> does exist. Absorbing the slot is honest here in a way it would not be if the two skills were
> confused.

### 2.2 `br_pt_form` coverage — this pack is the migration reference

`assessment-item-spec.md` §1.1 makes G-Q2 — *every distractor must be a form a BR-PT speaker would
actually produce* — enforceable only through `distractors[].br_pt_form`. The six packs authored
before this one carried that evidence in **prose feedback**, which a loader cannot read. This pack
carries it in machine-readable form on all 7 items, and records `null` where the distractor is not
a Portuguese transfer at all (the phonological and reading items), because **"no PT source" is a
finding and must be stated, not left blank**.

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson ⭐ central construct

```yaml
item_id: `grm_technical_noun_compound_001`
skill: `grammar.technical_noun_compound`
type: `multiple_choice`
difficulty_b: 0.1
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "review of the code"
    br_pt_form: "revisão de código"
    note: "literal translation of the PT noun phrase; also what machine translation emits"
  - option: "review from the code"
    br_pt_form: null
    note: "not a PT transfer — invented, kept as a shape distractor"
  - option: "code's review"
    br_pt_form: "o code review"
    note: "possessive; PT 'do código' transfers as a genitive"
```

> **The reason this is a grammar item and not a vocabulary one.** The learner already owns *review*,
> *code* and the meaning. What is missing is the fact that the three words form **one unit with no
> preposition inside** — which is morphosyntax, and which the Portuguese phrase cannot teach because
> the Portuguese phrase *has* the preposition. A vocabulary item would be satisfied by a student
> who can define the term and still writes *"the review of the code"*.

**Which expression is the standard fixed term in English technical writing for "revisão de código"?**

| Slot | Value |
|------|-------|
| A | code review |
| B | review of the code |
| C | review from the code |
| D | code's review |

**Key:** A
**Feedback:** **A and B are both grammatical English and mean the same thing** — which is why the
question asks for the *standard term*. In a technical document that term is the block **code
review**. B is the literal translation of *"revisão de código"*, it is what machine translation
produces, and it is the form a Brazilian learner writes. C is invented. D is possessive and means
something else: a review *belonging to* the code.

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_acronym_first_use_001`
skill: `vocab.acronym_expansion_register`
type: `contextual_selection`
difficulty_b: 0.3
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "The API is what our mobile app uses to talk to the backend."
    br_pt_form: "A API é o que nosso app usa"
    note: "no expansion; the PT gloss hides the gap because 'a API' is already known locally"
  - option: "The API stands for the interface our mobile app uses to talk to the backend."
    br_pt_form: "A API significa a interface que o nosso app usa"
    note: "calque of *significar* on *stand for*"
  - option: "The interface our mobile app uses to talk to the backend is the API."
    br_pt_form: null
    note: "inverted; valid English but a bad opening, not a PT transfer"
```

> **This item measures a two-state construct, not a boolean.** `acronym_expansion_register` records
> *expand for the reader who does not know* — and the stem is the only thing that makes the key
> decidable, because in a channel post to a team that already uses the acronym, **not** expanding
> would be correct. The lesson's FASE 1.2 asks this question in open form; this item is the
> closed version of it.

**You are writing the first paragraph of a design doc. A new joiner will read it tomorrow. Which
opening is correct?**

| Slot | Value |
|------|-------|
| A | The API is the interface our mobile app uses to talk to the backend. |
| B | The API is what our mobile app uses to talk to the backend. |
| C | The API stands for the interface our mobile app uses to talk to the backend. |
| D | The interface our mobile app uses to talk to the backend is the API. |

**Key:** A
**Feedback:** A gives the expansion and the sense in one sentence. B uses the acronym without
explaining it — fine in a team channel, wrong in a doc a newcomer will open cold. C uses *stand for*
for the wrong direction: in English *stand for* is what you **ask about** an acronym
(*"what does EOD stand for?"*), not what you **say** to define one; the Portuguese *significar* maps
onto it and produces the inversion. D is valid English and a poor opening — it makes the reader
hold an unknown acronym across a long clause.

---

### ITEM 3 — Pronunciation, prerequisite (greetings_intro)

```yaml
item_id: `prn_s_consonant_cluster_001`
skill: `pronunciation.s_consonant_cluster`
type: `perception_minimal_pair`
difficulty_b: 0.4
cefr: A2
domain: pronunciation
provenance: authored
render_status: blocked          # no clip rendered; item is admissible for a pack, not for the CAT
distractors:
  - option: "stuck"
    br_pt_form: null
    note: "phonological, not lexical — there is no Portuguese source form to record"
  - option: "stake"
    br_pt_form: null
    note: "phonological, not lexical — and a two-feature distance from /stæk/, kept so the item cannot be solved by ruling out the obvious pair alone"
  - option: "stick"
    br_pt_form: null
    note: "phonological, not lexical — [stɪk] vs [stʌk] is the vowel contrast the item scores; a segmental distractor has no Portuguese source form"
```

> **L2 seed, not new input.** `s_consonant_cluster` is declared in `les_a2_greetings_intro` and is
> exercised in `dlg_a1_03_day_time` (*schedule*). It is here because this lesson hands the learner
> a page of /st/ and /sk/ onsets — *stack*, *standup*, *support*, *docs* — and the page is a
> pronunciation opportunity that would otherwise go unused.

**Minimal pair, same voice and same rate (Q-L6):** *stack* [stæk] vs *stuck* [stʌk], in the carrier
"the server is ___".

| Slot | Value |
|------|-------|
| A | stack |
| B | stuck |
| C | stake |
| D | stick |

**Key:** A
**Feedback:** The distinction is the **vowel** — [æ] in *stack*, [ʌ] in *stuck*. Both begin with the
same /st/ cluster, so the cluster itself is not the difficulty. The BR-PT error is to reduce both to
[stɐk] or to insert a vowel: *"esták"*, *"stáque"*. A, C and D differ in the vowel too and are
therefore legitimate distractors; none of them is a homophone, so the item is keyable (**P-1**).

---

### ITEM 4 — Grammar, current lesson

```yaml
item_id: `grm_compound_head_agreement_001`
skill: `grammar.compound_head_agreement`
type: `multiple_choice`
difficulty_b: 0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "bugs report"
    br_pt_form: "bugs report"
    note: "the characteristic BR-PT error: the modifier is pluralised because in 'relatório de erro' the noun after 'de' carries the number"
  - option: "bug report"
    br_pt_form: null
    note: "singular; correct-looking but does not agree with 'two'"
  - option: "bugs reports"
    br_pt_form: null
    note: "the same error plus a plural head — a double mistake, kept because learners produce it"
```

**Two ____ were filed last week. Which is correct?**

| Slot | Value |
|------|-------|
| A | bug reports |
| B | bugs report |
| C | bug report |
| D | bugs reports |

**Key:** A
**Feedback:** In a compound noun, **only the head carries the number** — and the head of *bug report*
is *report*, not *bug*. B pluralises the modifier, which is what Portuguese does in *"dois
relatórios de erro"*, where the number sits on the noun **after** the preposition. The tell: a
learner who writes B has memorised *bug report* as a string, because a memorised string has no head.
Test it yourself — *two root cause analysis*? No: *two root cause analyses*. **This is the item that
separates memorised from understood**, and it is why the lesson spends a full minute on it.

---

### ITEM 5 — Reading, current lesson

```yaml
item_id: `rdg_doc_gloss_pattern_001`
skill: `reading.gloss_pattern_comprehension`
type: `multiple_choice`
difficulty_b: 0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "To correct a mistake in the previous sentence."
    br_pt_form: null
    note: "a reading inference, not an L1 transfer — the distractor is an alternative reading of the gloss symbol, and there is no Portuguese form behind it"
  - option: "To give a second, different example."
    br_pt_form: null
    note: "same: an alternative reading, not an L1 transfer"
  - option: "To say the two things are not equal."
    br_pt_form: null
    note: "same: an alternative reading of the symbol, not an L1 transfer — the item tests symbol semantics, which is why no distractor here is a Portuguese source"
```

> **Why a reading item is absorbing the deferred listening slot.** `post-lesson-practice-spec.md`
> §2.2's Listening row is deferred, and the obvious fix is to substitute a *related* skill. That would
> be a lie about coverage. This item instead tests a skill that **exists**, and it tests the one thing
> the lesson's 2.3 teaches that is genuinely a *reading* skill rather than a production one.

**Read:** *"A cluster is a group of machines, that is, a group of computers that work together."*
**Why does the writer write "that is" instead of stopping at "a group of machines"?**

| Slot | Value |
|------|-------|
| A | To say the same thing in simpler words, so the reader does not have to look up "cluster". |
| B | To correct a mistake in the previous sentence. |
| C | To give a second, different example. |
| D | To say that the two things are not equal. |

**Key:** A
**Feedback:** The pattern **X, that is, Y** in technical English is a *redefinition in plainer
words*, and it is the single most useful thing a documentation reader can learn to spot. A learner
who recognises it stops searching for a second fact. D is the trap that does real damage: *"that
is"* in casual English can mean *"in other words"*, and reading it as *"which is not the same as"*
turns every gloss into a contradiction.

---

### ITEM 6 — Vocabulary, current lesson

```yaml
item_id: `voc_false_cognate_eventually_001`
skill: `vocab.false_cognate_eventually`
type: `multiple_choice`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Eventually, the server does not crash."
    br_pt_form: "eventualmente o servidor não trava"
    note: "*eventualmente* used as certainty — the source reads as a guarantee, which English does not license"
  - option: "Eventually, the test passes."
    br_pt_form: "eventualmente o teste passa"
    note: "same error, shorter carrier; kept because it is the shape that appears in real writing"
  - option: "We will eventually the database."
    br_pt_form: null
    note: "not a sentence at all — *eventually* is an adverb; included to catch key-happy learners"
```

**Choose the sentence where *eventually* is correct English.**

| Slot | Value |
|------|-------|
| A | Eventually, we will migrate the database. |
| B | Eventually, the server does not crash. |
| C | Eventually, the test passes. |
| D | We will eventually the database. |

**Key:** A
**Feedback:** *Eventually* = *no fim das contas*, at some future point, with **no promise of when**.
B and C read *eventualmente* in the Portuguese sense of *certainly / without fail*, which in English
is **probably** or **likely**. D is not a sentence — *eventually* is an adverb and cannot take a
direct object. `content-map.md` §11.2 A2 records the asymmetry that makes this hard: Portuguese
*eventualmente* carries a certainty English *eventually* does not, so the error is not carelessness,
it is a genuine meaning difference read the wrong way round.

---

## 3. L2 / L3 ITEMS (spaced)

### ITEM 7 — Grammar, prerequisite (`les_a2_small_talk` → `tag_questions`)

```yaml
item_id: `grm_tag_questions_compound_001`
skill: `grammar.tag_questions`
type: `multiple_choice`
difficulty_b: 0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "doesn't it"
    br_pt_form: "não é ela?"
    note: "null-subject transfer; taught in les_a2_meeting_open, still live here"
  - option: "isn't it on Friday"
    br_pt_form: "é sexta, não é?"
    note: "the whole phrase calqued into the tag"
  - option: "will it be"
    br_pt_form: null
    note: "a future tag, valid but wrong aspect for a present statement"
```

> **Interleaved review with a new carrier, not a duplicate.** `tag_questions` is taught in
> `les_a2_small_talk` and practised in `pack-les-a2-small-talk.md` as `grm_tag_questions_00*`. This
> is the **same skill in a new frame**: the carrier is a technical compound, so the item also probes
> whether the learner can hold the compound intact inside the tag. It must not be collapsed into
> "duplicate item" by any future de-duplication pass — same skill, different construct interaction.

**You are confirming a plan in a call. Which completion is correct?**
*"The code review is on Friday, ____?"*

| Slot | Value |
|------|-------|
| A | isn't it |
| B | doesn't it |
| C | isn't it on Friday |
| D | will it be |

**Key:** A
**Feedback:** A repeats the subject (*it*) and inverts the auxiliary (*is* → *isn't*), with the
negative aligned to the positive. B transfers the null subject of *"não é sexta?"* into English, which
has no such thing. C calques the whole Portuguese phrase into the tag — and it also splits the
compound's complement out of its place. D is a future tag on a present statement.

---

## 4. WHAT THIS PACK DELIBERATELY DOES NOT DO

1. **No listening item**, though one is allowed. The only admissible source for
   `listening.noun_compound_identification` is the unrendered `dlg_a2_04_bug_report`. Writing a
   text-only substitute and calling it listening would be a coverage claim with nothing behind it.
2. **No `br_pt_form` is invented.** Three items record `null`, which is a finding: the distractors
   are phonological or reading-based and have no Portuguese source form. The other six packs in this
   repository carry that evidence in prose; this one carries it in the field a loader reads, and the
   count is 7/7. See `post-lesson-practice-spec.md` §10.2 for why the prose form was not enough.
3. **No item is calibrated.** Every `difficulty_b` above is an author prior, not a measurement. The
   pool for this pack is 0 calibrated items and these do not enter the bank until Stage 1 produces
   two-stage calibration (`assessment-item-spec.md` §9, X2).
4. **ITEM 1 has two defensible answers on the page** — *code review* and *review of the code* are
   both correct English. The stem says **"standard fixed term"**, which is what makes A keyable. If
   the bank ever migrates this item to `contextual_selection`, the stem must be rewritten to remove
   the ambiguity rather than left as a hidden convention.
