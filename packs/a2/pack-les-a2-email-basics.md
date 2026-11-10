# Practice Pack — `les_a2_email_basics`
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_email_basics_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_email_basics.md`
**Provenance:** items `authored`. `frases-ingles-trabalho.md` Ch5 and `Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md` Ch10 are *bibliography only* (both **restricted**, `external-sources.md` §0.5 / §7.0).
**Reuse basis:** `cite_only` — every item is original; both local sources are cited as bibliography and nothing from either is reproduced. Required per artefact by `external-sources.md` §0.5; enforced for packs by `verify-integrity.py` [11b].
**Authoring date:** 2026-09-30

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_email_basics_v1
lesson_id: les_a2_email_basics
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
  speaking_writing_items: 0           # §2.4                ✅ — see the note below
  authored_illustrative_parameters: true
```

> **§2.4 is not being violated by a writing lesson.** §2.4 bars a *"write one sentence"* item
> because it converts a 3-minute pack into an 8-minute one and produces text too weak to score.
> Every item here is a **selection / correction / collocation** task on language the learner will
> need to write — the same 3–5 min, the same scoring cost. The pack trains the *ingredients*; the
> Output Task trains the composition, and composition is scored by the WCF loop, not here.

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 3 | 2–3 | ✅ at ceiling |
| Vocabulary | 2 | 1–2 | ✅ at ceiling |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ absorbs the deferred slot |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Coherence, current lesson ⭐ central construct

> Occupies the **Grammar** slot in the §2.2 budget. Its *skill* is pair-level (`coherence.*`) and it
> declares `domain: grammar` for weighting — see `assessment-item-spec.md` §1.2 and §10.1.

```yaml
item_id: `coh_email_register_pairing_001`
skill: `coherence.email_register_pairing`
type: `contextual_selection`
difficulty_b: 0.3
cefr: A2
domain: grammar            # weights the item in the bank; the SKILL is pair-level
provenance: authored
distractors:
  - option: "\"Dear Ana,\" … \"Atenciosamente,\""
    br_pt_form: "Atenciosamente,"
    note: "the PT close was left in the template; the leaked token IS the PT source form"
  - option: "\"Dear Ana,\" … \"Thanks,\""
    br_pt_form: "Querida Ana, … Valeu,"
    note: "PT has a single familiarity field, so one word governs both ends and the two ends can drift apart; EN reads them as one claim about closeness"
  - option: "\"Hey Ana,\" … \"Atenciosamente,\""
    br_pt_form: "Oi Ana, … Atenciosamente,"
    note: "colloquial PT open against bureaucratic PT close — the mismatch is coherent in PT and incoherent in EN"
```

**Item:**
> You have worked with a colleague for four months. Which opening/closing pair is appropriate?

| Slot | Value |
|------|-------|
| A | "Dear Ana," … "Atenciosamente," |
| B | "Dear Ana," … "Thanks," |
| C | **"Hi Ana," … "Thanks,"** ✓ |
| D | "Hey Ana," … "Atenciosamente," |

**Key:** C

**Feedback:**
> This is a **coherence** item. All four options are internally consistent *within* each line, and
> three of the four pairs are individually well-formed English — which is the point: the error is not
> a bad word, it is a **mismatched pair**.
> - **A** and **D** pair a register that is not English (*Atenciosamente* is Portuguese) with either
>   end of the English scale. A Brazilian reader sees a formality that matches the perceived age of
>   the relationship; an American reader sees a register that was either mistranslated or copied from
>   a template.
> - **B** is the interesting failure. `Dear Ana,` + `Thanks,` is *grammatical* and is what many
>   Brazilian learners produce when they half-correct a template. It reads as **mildly cold** — the
>   greeting sets a distance the closing then denies. Inconsistent pairs are harder to diagnose than
>   wrong ones, because nothing is wrong with either half.
>
> **The rule:** choose the register from the **relationship**, then apply it to *both* ends. Portuguese
> has one closed formality field; English has a scale, and the two ends of an email are read as a
> single claim about how close you are.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅
**Construct note:** needs its own skill id, not two — see §4.1.

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_attachment_verb_001`
skill: `vocab.attachment_verb`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A2
provenance: authored
distractors:
  - option: "\"Please find attached the report.\""
    br_pt_form: "Segue em anexo o relatório."
    note: "word-for-word calque of the standard PT formula; the phrase has no English idiomatic equivalent"
  - option: "\"Here attached the report.\""
    br_pt_form: "Aqui está em anexo o relatório."
    note: "PT *está* has no slot once *aqui* is the locative, so the copula is dropped in translation"
  - option: "\"I attach to you the report.\""
    br_pt_form: "Anexo para você o relatório."
    note: "PT marks the recipient overtly (*para você*); EN has no dative slot, so it is calqued"
```

**Item:**
> Which is the standard American way to introduce an attached file?

| Slot | Value |
|------|-------|
| A | "Please find attached the report." |
| B | **"I'm attaching the report."** ✓ |
| C | "Here attached the report." |
| D | "I attach to you the report." |

**Key:** B

**Feedback:**
> **`Please find attached`** is the single most common emailing tic among Brazilian professional
> English. It is not ungrammatical, and it is widely used — but it is an **Indian-English and
> legacy-corporate** form, and many American professionals read it as a slightly stiff template
> artifact. They will understand it; they will not produce it.
> The natural forms are:
> - **"I'm attaching…"** — the default in American business email
> - **"Attached is…"** — formal, works well with a named file
> - **"I've attached…"** — common in British English
> - **"Here's…"** — casual, fine with a colleague
>
> **The rule that matters more than the verb:** name the file, say what it is, and say what the reader
> is meant to do with it. *"I'm attaching the estimate — could you check the numbers?"* An e-mail
> with a file and no verb is an e-mail that comes back.

**Gates:** G-Q2 ✅ (*Please find attached* is the named error) · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson (absorbs deferred Listening slot)

```yaml
item_id: `rdg_email_defect_count_001`
skill: `reading.detail_defect_count`
type: `defect_counting`
difficulty_b: 0.1
cefr: A2
provenance: authored
distractors:
  - option: "Defective subject line, and four stacked hedges"
    br_pt_form: null
    note: "an under-count, not an L1 form; the four PT sources of the hedges live in the STIMULUS, not in the option — the option is an analytic claim about them"
  - option: "Only the register problem — the hedges are merely verbose"
    br_pt_form: null
    note: "same: an analytic claim, and the claim is the wrong one"
  - option: "The email is acceptable American business English"
    br_pt_form: null
    note: "same: an analytic claim"
```

**Email (authored, deliberately defective):**
> Subject: Good morning!!!
>
> Dear Mr. Silva,
>
> I would like to kindly request you, if possible, to be so kind as to review the attached document,
> and I would be very grateful if you could send me your decision by Friday, as the window will
> close after that.
>
> Please find attached the estimate and the risk list.
>
> Atenciosamente,
> Nadia

**Question:**
> Which set of defects does this email contain?

| Slot | Value |
|------|-------|
| A | Defective subject line, and four stacked hedges |
| B | **Defective subject line, four stacked hedges, mismatched register pair, and an anglicised attachment verb** ✓ |
| C | Only the register problem — the hedges are merely verbose |
| D | The email is acceptable American business English |

**Key:** B

**Feedback:**
> **C is the trap**, and it is the reason this item exists. *"I would like to kindly request you, if
> possible, to be so kind"* contains four hedges, and a learner who has internalised "be polite in
> writing" reads that as *correct English* rather than as four separate defects. Treating verbosity
> as a style preference instead of an error is the reason it survives in real emails.
> The four stacks, in order: **`would like`** · **`kindly`** · **`if possible`** · **`be so kind as
> to`**. Each one alone is acceptable; stacked, they **cancel** the urgency the email needs, and a
> reader can no longer tell whether Friday is a deadline or a suggestion.
> **D** is wrong for the reasons already covered: subject, register pair and attachment verb.
>
> This is a **dense observation**: one item yields signals on four skills. That is valuable and it is
> also a hazard — a learner may answer correctly by spotting one defect and pattern-matching. See §4.2.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **construct:** counting / set membership, not single-fact retrieval

---

### ITEM 4 — Grammar, current lesson

```yaml
item_id: `grm_could_request_softener_001`
skill: `grammar.could_request_polite`
type: `gap_fill`
difficulty_b: -0.5
cefr: A2
provenance: authored
distractors:
  - option: "Should"
    br_pt_form: "Você deveria enviar…"
    note: "PT *deveria* is obligation-leaning and carries no request illocution; EN *should* is advice, so the learner reaches for it when a request is meant"
  - option: "Would to"
    br_pt_form: null
    note: "not an L1 transfer — the stray *to* is not motivated by any PT form and appears in EN interlanguage independently"
  - option: "Must"
    br_pt_form: "Você deve enviar…"
    note: "PT *deve* covers both obligation and softened requirement; EN *must* is obligation only, so the softer PT reading is lost"
```

**Item:**
> "___ you send me a decision by Friday, when you get a chance?"

| Slot | Value |
|------|-------|
| A | Could |
| B | Should |
| C | Would to |
| D | Must |

**Key:** A

**Feedback:**
> `Could you…?` is the default polite request in American business email. The full ladder, in
> increasing pressure: *Could you possibly…?* (weakest) · *Could you…?* (default) · *Can you…?*
> (firmer) · *Will you…?* (**an instruction, not a request** — the trap from
> `pack-les-a2-meeting-open.md` ITEM 1, recurring here in writing).
>
> **The `when`-clause is the part worth keeping.** `when you get a chance` · `when you have a
> minute` move the politeness into a subordinate clause and leave the **deadline in the main
> clause**, which is exactly where it should be. English learners often stack the politeness
> modifiers instead (*could you possibly when you possibly find the time…*) and in doing so bury
> the ask. One hedge, placed deliberately.
> **B** `Should you…?` is not a request form at all; **D** `Must you…?` presumes an imposition.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, **prerequisite review**

```yaml
item_id: `voc_have_a_look_002`
skill: `vocab.fixed_phrase_have_a_look`
type: `contextual_selection`
difficulty_b: -1.2
cefr: A2
provenance: authored
prereq_lesson: `les_a2_meeting_participate`
distractors:
  - option: "Glance at them briefly, without reading"
    br_pt_form: "dar uma olhada"
    note: "genuine false friend: the PT counterpart of *have a look* really does mean a quick glance, so the EN reading of *review* has to be taught against it"
  - option: "Search them for a specific value"
    br_pt_form: "olhar por eles"
    note: "PT *olhar por* = *look for*, sharing the stem with *olhar*; the learner transfers the sense of the bare verb to the EN fixed phrase"
  - option: "Ignore them"
    br_pt_form: null
    note: "no PT source — a shape filler, and the reason G-Q3 is satisfied by 4 options rather than 4 documented errors"
```

**Item:**
> In "Could you have a look at the numbers?", what does **`have a look`** mean?

| Slot | Value |
|------|-------|
| A | Glance at them briefly, without reading |
| B | **Review them with attention** ✓ |
| C | Search them for a specific value |
| D | Ignore them |

**Key:** B

**Feedback:**
> `have a look` / `take a look` / `have a look at` / `give it a look` are **fixed phrases**, and the
> whole phrase means *review*, not *see*. There is no way to get "glance" out of it and no way to
> take the noun out: *have a look **at** the numbers* needs *at*.
> ⚠️ **Correction to the note that was here.** This item's YAML said `grm_have_a_look_002` with
> skill `vocab.fixed_phrase_have_a_look`, and the feedback justified the `grm_` prefix by arguing
> "the error is structural, not lexical". That was me rationalising a prefix to fit the pack slot.
> The skill is **vocabulary** — the item asks what a fixed phrase *means* — so the id is now
> `voc_have_a_look_002`. Caught by the prefix↔namespace check in `verify-integrity.py` [9].
>
> The structural point is real but belongs somewhere else: learners produce *"Could you have a look
> **the** numbers?"* by dropping the *at*, and that is a separate error this item does **not**
> measure. One item, one skill — see `assessment-item-spec.md` §10.1 for why a pair-level construct
> needs its own id rather than being split across two.
> Contrast: *scrutinise* is too strong for a colleague; *check* is close but narrower (*check the
> numbers* = verify the arithmetic; *have a look* = read and form an opinion).

**Gates:** G-Q2 ✅ (dropping *at* is the documented error) · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, **prerequisite review**

```yaml
item_id: `voc_email_tone_marker_001`
skill: `vocab.email_tone_markers`
type: `error_correction`
difficulty_b: -0.8
cefr: A2
provenance: authored
prereq_lesson: `les_a2_meeting_participate`
distractors:
  - option: "\"kkk, thanks!!!\""
    br_pt_form: "kkk, obrigado!!!"
    note: "PT chat laughter (*kkk*, *hehehe*) used as written-email humour; untranslatable into EN, which is why the marker is costly rather than merely informal"
  - option: "\"Thanks for the update ;)\""
    br_pt_form: "Obrigado pela atualização ;)"
    note: "the wink is a live PT-BR email punctuation tic and survives into EN mail"
  - option: "\"Thank you very much for the update, and please do not hesitate to contact me should you require any further assistance.\""
    br_pt_form: "coloco-me à disposição para qualquer esclarecimento que se faça necessário"
    note: "PT bureaucratic formula rendered literally; EN *do not hesitate to contact me* signals that a problem is expected, so a routine closing reads as a warning"
```

**Item:**
> Which line is appropriate in an email to a colleague?

| Slot | Value |
|------|-------|
| A | "kkk, thanks!!!" |
| B | "Thanks for the update ;)" |
| C | **"Thanks for the update."** ✓ |
| D | "Thank you very much for the update, and please do not hesitate to contact me should you require any further assistance." |

**Key:** C

**Feedback:**
> Four different registers, and the item is about choosing, not about being grammatical.
> - **A** `kkk` is **Portuguese chat laughter** (`hehehe`) with no English equivalent. An American
>   reader does not find it funny; they find it incomprehensible. This is the single most costly
>   marker in the set, because it is not merely informal — it is **untranslatable**.
> - **B** `;)` is 1990s e-mail. It survives in some startups and is unfashionable nearly everywhere
>   else; in a professional context it reads as either unserious or as a different generation.
> - **D** is *correct English* and worse than A. It is Portuguese bureaucratic register
>   (*"coloco-me à disposição"*) rendered literally: in American English **"please do not hesitate to
>   contact me" is a signal that something has gone wrong** — you only say it when you expect a
>   problem. Used as a routine closing it sounds like a passive-aggressive warning.
> - **C** is neutral, and neutrality is the default target.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_r_initial_email_001`
skill: `pronunciation.r_initial`
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

**Step 1 — hear the pair:** `read` [ɹiːd] *(verb)* · `reed` [ɹiːd] *(noun, a plant)* · `ready` [ɹɛdi]
**Step 2 — identify:** for each, is the R a **tapped** [ɾ] (as in PT-BR *arroz*) or a **frictionless approximant** [ɹ]?
**Step 3 — produce (ASR-scored):** read the subject line aloud:
> "Review requested: read the attached release notes."

**Target phonemes (checked against this carrier sentence):** [ɹ] initial in *review, requested, read*
· [ə] unstressed in *requested* · [tʃ] in *attached* · [ɪd] in *requested*

**Feedback:** recast only — replay the model, no explicit correction (§2.3).
> `read` is a **minimal pair by stress**, not by sound: `REED` the plant / `reed` to read something.
> Both are [ɹiːd]. The lesson's email lesson targets reading aloud precisely because the subject line
> is the part of an email that is spoken (in a stand-up, in a call) and because PT-BR's tapped or
> uvular [r] in initial position is the substitution ASR will report.
>
> **Disclosure:** the pool for `r_initial` is thin — `listening-corpus.md` §8.3 records 2 items, below
> the `n ≥ 5` threshold for a reportable per-domain θ. This production item is **not** part of that
> pool and cannot substitute for it. See §4.3.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `email_register_pairing` | Item 1 missed | **L2, day granularity** | Coherence error. The review pack must show a **new** pair, and must grade the *pair*, not either end. |
| `hedge_stacking` | Item 3 answered C or D | **L2** | Same seed as `pack-les-a2-meeting-participate.md` — the construct recurs across modalities and should be **one** skill with one queue, not two. |
| `kkk` / `;)` / PT-BR bureaucratic register | Item 6 missed | **L2** | Cultural substitution, not grammar. Feedback must name the *PT source* so the learner sees the mapping, per §9.1. |
| `please do not hesitate to…` | Item 6 chose D | **L3** | High-cost register error that survives to C1. Worth an explicit contrast drill even for a learner who "passed" the lesson. |

---

## 4. VALIDATION NOTES

1. **`email_register_pairing` needs a first-class skill id** for the reason given in ITEM 1: the error
   is in the *pairing*, and two independent features (`email_greeting`, `email_closing`) will both
   report mastery while the learner keeps producing mismatched pairs. Same requirement as
   `reciprocal_introduction` in `pack-les-a2-introducing-others.md`. **Neither skill id exists in
   `assessment-item-spec.md` §2's list.** This is now the third coherence construct to be blocked by
   that same omission, which makes it a spec-level defect rather than three item-level ones —
   logged in `assessment-item-spec.md` §10.
2. **ITEM 3 measures set membership, and that has a known failure mode.** A learner who has absorbed
   only *"subject lines should say the action"* can guess B without detecting the hedges. The item is
   worth keeping — it is one of the few that yields four skill signals from one response — but
   **its score must not be decomposed into the four sub-skills**, or the learner model will acquire
   four pieces of evidence from one guess. Record it as a single observation against
   `reading.detail_defect_count`, and let the WCF loop in the Output Task produce the per-skill
   evidence.
3. **`r_initial` remains under-powered.** `listening-corpus.md` §8.3 records 2 `lst_prn_r` items
   against the `n ≥ 5` threshold in `diagnostic-spec.md` §3.3a, so no reportable θ exists for the
   skill. This item is ASR-scored production and is a *different* measurement from the recognition
   pool; it helps the learner but does not help the model. Recorded, not counted.
4. **`hedge_calibration` appears in two packs** (`les_a2_meeting_participate` ITEM 3,
   `les_a2_email_basics` ITEM 3) with different carriers and different item ids. Correct: same
   construct, two modalities, two items. The skill id must be shared so the learner model sees one
   estimate rather than two.
5. **All `b` values are priors**, per `assessment-item-spec.md` §8.2.
