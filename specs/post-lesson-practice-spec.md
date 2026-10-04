# Post-Lesson Practice Spec — Fixação e Revisão espaçada

**Purpose:** Define the exercise layer that runs **after** every lesson. This is the layer the user explicitly required ("o tutor deve gerar exercícios de fixação após cada aula") and it was the largest gap in the spec set.

**Upstream Specs:** `curriculum-graph-spec.md` (lesson IDs), `stats-progress-evaluation-spec.md` (BKT/IRT/FSRS), `content-map.md` (skill IDs, source provenance), `diagnostic-spec.md` (CAT).

**Downstream:** `assessment-item-spec.md` (item schema). This spec defines **which exercises run, in what order, under what scheduling rules**; that spec defines **what an individual item looks like**.

---

## 0. THE GAP THIS SPEC CLOSES

The existing spec set had:
- ✅ A diagnostic that measures where you are
- ✅ A curriculum graph that says what comes next
- ✅ Statistics that say whether you learned it
- ❌ **Nothing that said what you do between lesson 4 and lesson 5**

Without this layer, three things break:

1. **Forgetting.** Spaced repetition has no scheduler to schedule. FSRS (§6 of stats spec) computes intervals but needs a *queue of items to review* — that queue is built here.
2. **The mastery gate is never satisfied.** `P(mastery) ≥ 0.85 ∧ CI₉₅_lower > 0.70` (stats spec §4.2) requires *multiple* independent observations per skill. One Shadow CAT inside a lesson gives one. The practice layer supplies the rest.
3. **Errors have no consequence.** The BR-PT error taxonomy in `content-map.md` §9.1 predicts what the learner *will* get wrong. Without targeted remediation, that prediction goes unused.

---

## 1. THREE LAYERS OF FIXAÇÃO (not one)

"Fixação" is a single word for three different mechanisms. Conflating them is the most common ITS design error.

| Layer | Name | When | Duration | Blocked by mastery gate? | Purpose |
|-------|------|------|----------|-------------------------|---------|
| **L1** | Practice Pack (fixação imediata) | Immediately after each lesson, same session | 3–5 min | ❌ No — runs unconditionally | Retrieval of what was just taught. Builds the BKT evidence base. |
| **L2** | Spaced Review Pack (revisão espaçada) | On the learner's *next* session, days later | 5–10 min | ❌ No — runs unconditionally | Retention. FSRS-driven. This is Make It Stick's core. |
| **L3** | Remediation Set (remediação dirigida) | Inserted before the next lesson | 3–8 min | ❌ No — runs on failure | Targets the learner's *specific* observed error. Generated from error logs, not from the lesson. |

**Critical design constraint:** none of L1/L2/L3 is gated on mastery. A learner who failed the Shadow CAT does **not** get skipped forward — they get more practice. Gating *upstream* (i.e. refusing to let a learner enter a lesson) is handled by `curriculum-graph-spec.md` §6, not here.

---

## 2. LAYER 1 — PRACTICE PACK (Pós-Aula Imediata)

### 2.1 Sizing

| Parameter | Value | Why |
|-----------|-------|-----|
| Items per lesson | **4–8, θ-scaled** (formula below) | Below ~4, retrieval practice is too thin to move BKT. Above ~8, the 15-min lesson budget (Adquirir 8 / Praticar 4 / Produzir 2 / Ajustar 1) is blown and the learner stops concentrating. |
| Scaling formula | `items = clamp(round(2 + 3 × P̂_mastery), 4, 8)` | ⚠️ **Amended by pack validation** (`pack-les-a2-greetings-intro.md` §7). A fixed 5–8 over-drills high-θ learners and under-drills beginners. `P̂_mastery` = the learner's current posterior for the pack's dominant skill. |
| Time cap | **3–5 min** | Hard cap. If the learner is slower, the pack yields. Never extends the session. |
| Composition | **55–75% current lesson / 25–45% prerequisite** | ⚠️ **Amended.** A 60/40 point target is unreachable at 7 items with grammar capped at 3 — only ~71/29 is legal. Range, not point. Pure review is boring; pure new material violates i+1 by being *i+2*. |
| Delivery | Interleaved, never blocked-by-type | Interleaving beats blocked practice for retention (Rohrer & Taylor, 2006). Do not give 5 grammar items in a row. |

### 2.2 Item Distribution Across Tracked Skills

The 5 tracked domains get **different** item types, because they measure different things. Speaking/Writing are output modalities and get **no L1 items** — see §2.4.

| Domain | Items (of 5–8) | Item types permitted | Rationale |
|--------|---------------|----------------------|-----------|
| **Grammar** | 2–3 | Gap-fill cloze, error-correction, form-selection | Recognition-level. Grammar knowledge that isn't automatic is not usable in production. |
| **Vocabulary** | 1–2 | Definition-match, gap-fill collocation, register-selection | Must be *contextual* (McCarthy/O'Dell) — never bare translation both ways, which trains translation instead of meaning. |
| **Listening** | 1 | Minimal-pair discrimination, short-clip gist | ⚠️ Blocked in MVP — see `content-map.md` §8.5.1 Decision B. **When deferred, the slot is redistributed to Reading, and the manifest MUST record `listening_items: 0` explicitly** so the absence is auditable rather than silent. |
| **Reading** | 1–2 | Scanning task (find X), T/F on a 40-word microtext | Reading is the fallback destination for unmeasurable listening slots. |
| **Pronunciation** | 1 | Minimal-pair identification + production (ASR-scored) | Production-based, not self-report. See §2.3. |

### 2.3 Pronunciation Items — the ASR Scored One

Pronunciation is the one domain where **the learner must produce**, because self-report is worthless and recognition is already trained by listening.

| Step | Task | Scoring |
|------|------|---------|
| 1 | Hear the pair (`ship` / `sheep`) | — |
| 2 | Identify which one you heard | binary, exact |
| 3 | Record yourself saying the target word | ASR phoneme match |
| 4 | Feedback | **Implicit recast only** — replay the native model, do not correct explicitly mid-flow (Krashen, Monitor Hypothesis) |

> **Do not** display "❌ you said /ʃip/ instead of /siːp/". Replay the correct model and re-attempt. The explicit correction interrupts acquisition; the recast lets the learner self-correct. See `AGENTS.md`.

**Brazilian-PT priority pairs** (from `content-map.md` §9.1, highest-frequency interference):

| Skill | Pair | BR-PT trap | Cues |
|-------|------|-----------|------|
| `pron_th_unvoiced` | sink / think | both → "sique" | tongue between teeth, no voice |
| `pron_th_voiced` | the / this | "de" / "desse" | same position, voice ON |
| `pron_h_aspirated` | have / how | "ave" / "aú" | breath before vowel; carioca speakers delete h |
| `pron_r_initial` | room / red | "rruim" — uses PT uvular or tapped r | tongue bunched, no uvular friction |
| `pron_s_cluster` | start / station | "estart" / "estação" epenthesis | no vowel between s and t |
| `pron_word_stress` | PHOtograph / phoTOgrapher | flat stress | 2+ syllable content words |

### 2.4 Why Speaking and Writing Get No L1 Items

| Modality | L1 role | Reason |
|----------|---------|--------|
| **Speaking** | Already performed in the lesson's Output Task (4 min) | A second production attempt 3 minutes later is not fixação — it's repetition without retrieval. Better used in L3 with the error logged from the Output Task. |
| **Writing** | Same | Same reasoning. Also: writing is slow to score, and 3–5 min is not enough for meaningful written production. Writing self-checks belong in L3. |

> **Do not** invent a "write one sentence" item for L1. It converts a 3-minute pack into an 8-minute one and produces text too weak to score.

---

## 3. LAYER 2 — SPACED REVIEW PACK (Revisão espaçada)

### 3.1 What Enters the Review Queue

An item enters the queue when **all three** conditions hold:

1. It has been **seen** by the learner (answered at least once), and
2. It maps to a skill in the learner's **active learning frontier** (θ within ±1.0 of current), and
3. Its **last response was correct**, OR it was incorrect **more than 2 sessions ago**.

Condition 3 is subtle and matters: an item answered wrong *just now* is not ready for review. It goes to **L3 remediation** first. Sending a just-failed item back into the review queue produces error-reinforcement — the learner retrieves the wrong answer more fluently than the right one.

### 3.2 Scheduling — FSRS, mastery-modulated

From `stats-progress-evaluation-spec.md` §6. The review queue uses FSRS-4.5 per item, but the **difficulty and stability parameters are modulated by the learner's mastery of that skill**.

```
FSRS inputs:
  R        = 1 (correct, fast) | 2 (correct, slow) | 3 (incorrect)
           → "incorrect" is never a separate grade; see §3.3
  elapsed  = days since last review
  State    = (New | Learning | Review | Relearning)

Modulation (this is the "mastery-modulated" part):
  stability ← stability × (1 + 0.8 × P_mastery(skill))
  difficulty ← difficulty × (1 − 0.5 × P_mastery(skill))

  → High mastery = longer intervals = less redundant review.
  → Low mastery  = shorter intervals = more drilling.
```

Rationale: a learner with `P_mastery(grammar_th) = 0.95` does not need the `th` item re-surfaced every 3 days. The same item for a learner at `P_mastery = 0.40` should return in 1 day. Identical FSRS parameters for both is a waste of the learner's time.

### 3.3 Grading — Incorrect Is Not a Binary

Recording `R = 0` for every wrong answer makes FSRS's grade scale useless (it has 4 grades for a reason).

| Situation | Grade |
|-----------|-------|
| Correct, immediately | 1 |
| Correct, after hesitation (> target latency) | 2 |
| Correct, **after a hint** (recast/reveal) | 2 — and the item is **re-queued for the same session** |
| Incorrect, no hint | 3 |
| Incorrect, but learner self-corrects after feedback | 2 |

> **Self-correction is the success signal.** It means the knowledge is present but the retrieval path is weak. Grading it as 3 punishes a learner for being honest, and the item gets hammered.

### 3.4 Pack Composition

| Parameter | Value |
|-----------|-------|
| Items per session | 5–12 |
| Cap | 12 — hard. A 20-item backlog must be **resampled**, not dumped. |
| Resampling rule | If queue > 12: take the 12 with the **lowest stability** (most overdue relative to their interval), then over-sample across the 5 domains so the pack is not all-grammar. |
| New-item ratio | **0 new items** in a review pack. Mixing new material into review destroys the retention measurement. |
| Domain balance | Max 4 items from any single domain per pack. |

### 3.5 The Interleaving Constraint

Because the queue is resampled across domains and the pack caps per-domain items at 4, consecutive review items are almost always from **different domains**. This is intentional — it is the interleaving that makes the schedule work.

Do not add a "group the grammar ones together" affordance. That affordance feels helpful and measurably reduces retention.

---

## 4. LAYER 3 — REMEDIATION SET (Remediação Dirigida)

### 4.1 Trigger Conditions

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Skill θ below floor | `θ(skill) < -1.5` | Route to the matching `les_rem_*` node **before** the next lesson. |
| Same error 3× in one session | count ≥ 3 | Insert 3 targeted items on that exact error pattern. |
| Shadow CAT failure | `P(mastery) < 0.85` after 2 CAT instances | L1 pack for the next 2 lessons gets +2 items on the weak skills. |
| Catastrophic item miss | 3 consecutive wrong on one item type | Retire the item, flag for review — **this may be a bad item, not a weak learner.** See §6. |

### 4.2 Remediation Is Generated From Error Logs, Not From the Lesson

A remediation set is **not** "the same pack again, easier". It is built by querying the error log:

```
remediation_set(learner, skill) =
    1. Rank error_log entries for `skill` by (frequency × severity × recency)
    2. For each top error pattern, select the IRT item with:
         - b closest to learner's current θ(skill)   (challenge ≈ +0.3 logit)
         - distractor set that contains the *specific wrong form* the learner produced
    3. Order by ascending b (easiest first) — a learner who just failed three
       items must not open with a fourth failure
    4. Cap at 6 items
```

**Step 2's distractor condition is the important one.** A remediation item whose distractors don't include the learner's actual error teaches nothing about their error — it's just another item.

### 4.3 Error Taxonomy Drives Generation

`content-map.md` §9.1 lists the predicted BR-PT errors. Each has a **distinctive wrong form**, which makes it a natural distractor:

| Error | Learner's likely wrong form | Remediation item shape |
|-------|----------------------------|------------------------|
| null subject | "~~Is raining~~ today" | Error-correction: supply the subject |
| `eventually` false cognate | "~~Eventually I'll travel~~" (= "talvez") | Choice between *eventually* / *probably* / *maybe* |
| `actually` false cognate | "~~Actually I work at~~" (= "atualmente") | Gap-fill forcing *currently* |
| responsible of | "~~I'm the responsible of~~" | Rewrite item → *I'm in charge of* |
| Nice to meet you (reencounter) | "~~Nice to meet you~~" (2nd time) | Pragmatics item with a stated scenario |

### 4.4 Psychological Safety in Remediation

Remediation is the highest-risk moment for the **Affective Filter** (Krashen). Design rules:

| Rule | Implementation |
|------|----------------|
| No error shaming | Never display "You got 3 wrong". Display "3 to strengthen". |
| Never fewer than 2 items in a pack | A 1-item pack feels like a verdict. |
| Easiest item first | §4.2 step 3. The learner must succeed before they fail. |
| Cap consecutive difficulty | No 2 consecutive items above the learner's current θ. |
| Remediation is optional-seeming | Never block the "next lesson" button behind remediation. Offer it: "Want to practice 3 quick items first?" |
| Explicit invitation on false-beginner profiles | `les_rem_confidence_builder` runs *proactively*, before any failure is observed |

> The `les_rem_confidence_builder` node exists specifically for the affective filter. The `frases-ingles-trabalho.md` source (Ch 1) opens by lowering the filter explicitly ("ninguém vai rir de você"). That framing is a pedagogical asset, not filler — carry it into the node.

---

## 5. HOW LAYERS COMPOSE IN A SESSION

```
Session opens
    │
    ├─→ [L2] Spaced Review Pack        5–12 items, 5–10 min
    │        drawn from FSRS queue across all 5 domains
    │
    ├─→ [L1] Practice Pack             5–8 items, 3–5 min   ← only if a NEW lesson today
    │        60% current lesson / 40% prerequisite
    │
    ├─→ Lesson (15 min)
    │        Adquirir — Input Flood + Structured Input (8min)
    │        Praticar — Guided Practice + Recast+Uptake (4min)
    │        Produzir — Output Task (2min, **opt-in**, botão "Pular" visível)
    │        Ajustar — Shadow CAT (1min)
    │
    ├─→ [L1] Practice Pack             4–8 items, 3–5 min   ← post-lesson fixação
    │        new items on the lesson's skills
    │
    └─→ [L3] Remediation (if triggered)
             ≤6 items, easiest first, optional
```

**Budget for a full day (lesson day):** 10 + 5 + 15 + 5 = **~35 min**.
**Budget for a non-lesson day:** 10 + optional 8 = **~15 min**.

This is the number that decides course length. `curriculum-graph-spec.md` §2 claims 36–52 weeks; that estimate only holds if the non-lesson day is genuinely 15 minutes, which is why the L2 cap of 12 is hard rather than advisory.

---

## 6. QUALITY GATES FOR PRACTICE ITEMS

Practice items are **not** diagnostic items and the bar is different. A diagnostic item must be maximally discriminating; a practice item must be maximally *useful*.

| Gate | Rule | Rationale |
|------|------|-----------|
| **G-Q1 No reuse across levels** | An item's difficulty `b` must match the CEFR band of the lesson it ships in, ±0.5 logit. | A B1 item inside an A1 pack produces frustration and a θ estimate that is really measuring guessing. |
| **G-Q2 Distractor plausibility** | Every distractor must be a form a **BR-PT speaker would actually produce**. Reject distractors that are merely wrong. | Distractors a learner would never choose waste the diagnostic signal and inflate difficulty artificially. |
| **G-Q3 No guessing-above-chance** | For a 4-option item, p(random) = 0.25. If the keyed answer is guessable from item length or a giveaway stem, rewrite. | Length-cue and "longest option is right" artifacts are the most common item defect. |
| **G-Q4 One concept per item** | Never test two grammar points in one item. | A double-barrelled item's θ contribution is uninterpretable. |
| **G-Q5 Feedback is actionable** | Every item must carry a specific BR-PT note, not a generic definition. | "Wrong" teaches nothing. "You chose *gente*, but English needs an explicit subject here" teaches the contrast. |
| **G-Q6 Progressive item failure → retire** | 3 consecutive misses by ≥5 distinct learners ⇒ retire and review. | Distinguishes a bad item from a hard item. Checked at calibration (§7), not per-learner. |
| **G-Q7 Provenance recorded** | Every item records `provenance: source_derived \| authored`. | Source-derived items are traceable to a lesson; authored items need expert review before entering a diagnostic CAT. |

### 6.1 G-Q2 in Practice — Distractor Design

This is where BR-PT specificity earns its keep. A grammar item on the third person singular:

| Distractor | Verdict |
|-----------|---------|
| He work | ❌ Rejected — no BR-PT speaker produces this. Nobody learns English expecting zero inflection. |
| He works | ✅ Keyed — the target. |
| He working | ⚠️ Weak — common enough, but overlaps with the present continuous; acceptable only if the stem forces the tense. |
| He work's | ✅ Strong — the apostrophe-s error is documented in BR learner corpora. |
| He do work | ⚠️ Borderline — keep only in lower-`b` variants. |
| He working today | ❌ Rejected — two errors in one distractor, breaks G-Q4. |

The reject/keep decisions are the item bank. See `assessment-item-spec.md` §4 for the full distractor taxonomy.

---

## 7. HOW PRACTICE FEEDS BACK INTO THE STATISTICS

Practice responses are the **primary evidence base** for BKT. The Shadow CAT inside a lesson is deliberately kept small (3–5 items) precisely so the practice layer can carry the statistical weight.

```
Evidence sources per skill:
  diagnostic CAT    15–30 items   → prior on θ, placement only, not mastery
  Shadow CAT         3–5 items     → weak signal; embedded in lesson context
  L1 Practice Pack   5–8 items     → PRIMARY evidence, same-day
  L2 Review Pack     5–12 items    → PRIMARY evidence, spaced (this is the retention signal)
  L3 Remediation      ≤6 items     → PRIMARY evidence, targeted
```

### 7.1 Mastery Gate Application

Per `stats-progress-evaluation-spec.md` §4.2:

```
P(mastery | skill) ≥ 0.85   AND   CI₉₅_lower > 0.70
```

**Required minimum evidence before the gate can even be evaluated:**

| Requirement | Value | Reason |
|-------------|-------|--------|
| ≥3 independent observations | Across ≥2 distinct days | Three tries in one session is one observation with noise, not three observations. |
| ≥1 spaced observation (L2) | Any L2 review | Same-day practice tests availability, not retention. The gate measures mastery = retention. |
| Confidence interval computable | Requires ≥3 | A CI from 2 points is meaningless. |

> **This is why L2 is non-negotiable.** Without spaced review, no skill can ever satisfy the mastery gate, and the learner can never progress. The mastery gate and the spaced review layer are the same mechanism viewed from two ends.

### 7.2 What Happens When the Gate Fails

| Step | Action |
|------|--------|
| 1 | Continue in the current lesson sequence. **Do not** halt — the gate gates *module progression decisions*, not the next lesson. |
| 2 | Next module entry runs the readiness check: re-present 3 items on the weakest blocking skill. |
| 3 | If `P(mastery)` still < 0.85 after 2 more sessions, route to `les_rem_*`. |
| 4 | If still failing after remediation, flag for human review — this may be a prerequisite gap the diagnostic mis-scored. |

---

## 8. AUTHORING WORKFLOW FOR A PRACTICE PACK

For each lesson, the author produces **three** artifacts. The lesson file holds them.

### 8.1 Pack Manifest

```yaml
pack_id: pack_les_a2_greetings_intro_v1
lesson_id: les_a2_greetings_intro
learner_profile: default        # or: false_beginner, it_track
estimated_minutes: 4
p_hat_mastery: 0.55             # drives the §2.1 scaling formula
item_count: 7                   # = clamp(round(2 + 3 × 0.55), 4, 8) = 7
current_split: "5/7 = 71%"      # legal range 55–75% (§2.1)
listening_items: 0              # ⚠️ explicit under Decision B — a recorded
                                 #    omission, never a silent one (§2.2)

l1_items:
  - item_id: it_greetings_001
    skill: grammar.be_affirmative
    type: gap_fill
    difficulty_b: -1.8
    feedback: |
      EN needs a subject; PT often omits "estou" here.
      BR-PT: "Eu sou engenheiro" → "I'm an engineer".
    br_pt_note: null             # no specific interference for this item
    provenance: source_derived   # frases-ingles-trabalho.md Ch2
  - item_id: it_greetings_004
    skill: vocab.workplace_greeting_register
    type: register_selection
    difficulty_b: -1.2
    distractors: [hi, hello, hey there, good evening to you all]
    feedback: |
      "Hi" and "hello" are neutral; "hey there" is too casual for
      a first client meeting. Target: "Good morning."
    br_pt_note: BR learners default to "Oi" / "Olá" register-neutrality assumptions.
    provenance: authored          # ⚠️ requires expert review before CAT use

l2_seed:
  # Items that enter the FSRS queue *after* this pack is answered
  - [it_greetings_001, it_greetings_004, it_greetings_007]
  # Everything answered correctly enters; anything answered wrong routes to L3.

l3_triggers:
  - error_pattern: null_subject
    from_skill: grammar.be_affirmative
    action: insert_error_correction_items
```

### 8.2 Authoring Checklist

- [ ] Item count within 4–8 **and** equals `clamp(round(2 + 3 × P̂_mastery), 4, 8)`
- [ ] Current/prerequisite split inside 55–75% / 25–45%
- [ ] `listening_items` recorded explicitly in the manifest (0 is a valid value, silence is not)
- [ ] Domain distribution within §2.2 bounds
- [ ] Every item passes G-Q1 through G-Q7
- [ ] Every item has a **specific** BR-PT feedback note, not a dictionary gloss
- [ ] `provenance` set on every item
- [ ] `l2_seed` lists the items eligible for spaced review
- [ ] `l3_triggers` name concrete error patterns, not "if the learner struggles"
- [ ] Lesson JSON references the pack by `pack_id`

---

## 9. MANDATORY CONTENT FOR THE PACKS

Some content is required by the pedagogy and must exist in every pack that touches those skills. These are not optional enrichment.

### 9.1 Every Vocabulary Item Needs a BR-PT Contrast

Per `AGENTS.md` §Brazilian Portuguese-Specific Adaptations (contrastive analysis). A vocabulary item with no contrast teaches an English word; with a contrast it teaches the *specific confusion* that will otherwise appear in production.

| Skill | Required contrast |
|-------|-------------------|
| `vocab_false_cognate` | PT assumed meaning → EN actual meaning → correct EN for the PT intent. The **22-item reviewed deck** (`content-map.md` §11.2: 16 Tier A + 6 Tier B survivors; the 30 authored figure was pre-review — `tier-b-review.md` §4) supplies these. |
| `vocab_collocation` | PT collocation → EN collocation, e.g. *assistir aula* → **attend** a class (not assist). Source: viagens Language/Culture. |
| `vocab_corporate_term` | Term → PT gloss → a real sentence containing it. The 40-term deck (`content-map.md` §11.1) supplies these. |
| `vocab_register` | Form → which social situation it fits (first meeting / colleague / client / manager). |

### 9.2 Every Grammar Item Naming a BR-PT Error Must Name the Error

Not "wrong answer". Specifically:

```
❌ "Incorrect. The correct answer is 'has worked'."
✅ "You chose 'has work'. English needs the past participle after 'has' —
    BR-PT speakers often carry the infinitive across. Compare: 'has worked', 'has finished'."
```

### 9.3 Every Listening/Pronunciation Item Needs an Audio Asset

Gate in `content-map.md` §10: "Every listening/pronunciation item has TTS URL". Under Decision B (MVP defers Listening), this gate is satisfied by **absence of listening items**, not by placeholder items.

---

## 10. OPEN ITEMS

| # | Item | Status | Blocking? |
|---|------|--------|-----------|
| 1 | Listening deferral (Decision B) | ⏳ Needs user decision | Blocks `mod_a1_comm_basic` listening items and `les_a1_listening_*` |
| 2 | G1 disposition — cut or author the 4 undersourced B1 IT lessons | ⏳ Needs user decision | Blocks `mod_b1_it_technical` authoring |
| 3 | Expert review of Tier-B false-cognate items (`content-map.md` §11.2) | ⏳ Pending | Blocks CAT use of those 14 items |
| 4 | ASR phoneme scoring engine | Not specced | Blocks automated pronunciation scoring |
| 5 | First practice pack authored end-to-end | ✅ **Done** — 6 packs, 42 items, all `mod_a2_workplace_intro` | Closed 2026-09-30. `pack_les_a2_greetings_intro_v1` validated the numbers; 5 more followed |
| 6 | **Minimal-pair table has no row for 3 targets the lessons declare** | ⬜ **New gap, found by authoring** | Blocks ASR scoring of `w_initial_glide` (small_talk), `ed_past_t`/`ed_past_id` (meeting_open), `r_initial` (introducing_others) |
| 7 | **`r_initial` has no reportable θ** | ⬜ **New gap** | 2 items vs `n ≥ 5` (`listening-corpus.md` §8.3, `diagnostic-spec.md` §3.3a). The lesson can teach it; the model cannot measure it |
| 8 | **Coherence constructs have no skill ids** | ⬜ **New gap** | `reciprocal_introduction`, `email_register_pairing`, `two_part_disagreement_frame` are pair-level constructs. Independent features report mastery while the construct fails |
| 9 | **No `speech_act` label on `contextual_selection` items** | ⬜ **New gap** | Items whose distractors differ in *intent* not form (capacity vs delegation vs instruction) cannot be graded by a syntax checker |
| 10 | **Day-granularity L2 UI** | ⏳ Needs user decision | Blocks the spacing claim in `les_a2_introducing_others` and `les_a2_email_basics`, both of which schedule the *same* skill across two packs days apart |
| 12 | **No `br_pt_form` on any distractor** | ⚠️ **Open, reference shape exists** | 0 of **42** MCQ items across the 6 earlier packs carry the Portuguese form behind each distractor; `pack_les_a2_it_terms_basics_v1` carries 9 filled and 12 explicitly `null`. `assessment-item-spec.md` §1.1 says this is what makes G-Q2 enforceable; without it the PT-BR source of the error is prose a loader cannot read |
| 11 | Listening deferral — was split into two causes, now collapsed back to one | ✅ **Closed as a taxonomy** | **7 of 7** L1 listening slots are empty (one per pack) and **all 7 are now render-blocked** — the clip exists and is not rendered. The split mattered: 6 were render-blocked and 1 (`pack-les-a2_introducing_others`) was **content-blocked**, the dialogue never having been written. `dlg_a2_06_intro_three_way` closed that one, and the distinction it created is kept because it is the reason a *content* gap and a *render* gap must never share a manifest field: they look identical (`listening_items: 0`) and one is done and one is an ops ticket. |

### 10.1 On gap 6 — the pair table is narrower than the syllabus

§2.3 lists six priority pairs. The authored lessons declare **nine** `pronunciation_tags`, and three
have no pair:

| Tag | Declared by | Nearest existing pair | Status |
|-----|-----------|----------------------|--------|
| `w_initial_glide` | `les_a2_small_talk` | — | **no row** |
| `ed_past_t`, `ed_past_id` | `les_a2_meeting_open` | — | **no row** |
| `r_initial` | `les_a2_introducing_others`, `les_a2_email_basics` | *room / red* | row exists; **pool is 2 items** (gap 7) |

`ed_past_t` / `ed_past_id` is worth a row on its own terms because it is **not phonemic but
orthographic**: `-ed` is [ɪd] after *t*/*d* and [t] everywhere else. The table's other rows are all
phonemic contrasts, so the lesson would otherwise be teaching a rule with no kind of row to sit in.

**Required additions:**

| Skill | Pair | BR-PT trap | Cue |
|-------|------|-----------|------|
| `pron_w_initial` | `weekend` / `week end` | initial /w/→[u], *"uiquend"* | round the lips before the vowel; do not add a vowel |
| `pron_ed_past_t` | `walked` [wɔːkt] / `walk-ed` *(2 syllables)* | reads `-ed` as a syllable | the -ed is [t]; no second syllable |

### 10.2 On gaps 8 and 12 — the audit that closed one and quantified the other

Auditing the 6 packs against `assessment-item-spec.md` §1.2 found **4** prefix↔namespace violations
in 42 items, three of which my own read-through had missed:

| Item | Skill namespace | Prefix found | What the prefix should have been |
|------|-----------------|--------------|----------------------------------|
| `grm_reciprocal_intro_001` | `vocabulary.` | `grm_` | `coh_` |
| `grm_email_register_pairing_001` | `pragmatics.` | `grm_` | `coh_` — and `pragmatics.` is not a namespace at all |
| `voc_apposition_role_001` | `grammar.` | `voc_` | `grm_` |
| `grm_have_a_look_002` | `vocab.` | `grm_` | `voc_` |

**All four had the same cause, and it was a spec defect rather than four authoring slips.**
`assessment-item-spec.md` §1.2's table mapped prefix → *domain*, while the schema separately declares `skill_ids` and `domain`, and
nothing said which one owns the `item_id`. The rule was inferable and I inferred it correctly — and
still got it wrong 4 times in 42 items, because the pack **slot** is the thing an author is looking
at while writing, and the slot is not the skill. `assessment-item-spec.md` §1.2 has been amended to
state the rule (prefix =
*primary skill namespace*), the `coh_` row has been added, and `verify-integrity.py` [9] now checks
it. Gap 8 is therefore **closed in the artifact, not just logged**: the two coherence items carry
`coherence.*` skills and an explicit `domain:` for weighting.

The fourth case is the instructive one. `grm_have_a_look_002` carried a feedback note arguing
*"the reason this is a grammar item and not a vocabulary item: the error is structural."* That
sentence was me **rationalising a prefix to fit the pack slot** — the item asks what a fixed phrase
*means*, which is vocabulary, and the "structural" observation is about a *different* error (dropping
the *at*) that this item does not measure. Both the id and the note were corrected. Recorded because
the failure mode generalises: when a naming rule is violated, the first thing an author reaches for
is a justification, and a good-sounding justification is more dangerous than a silent mistake.

**Gap 12 is the same class of error, and it is still open — but it is no longer a gap with no
reference shape.** `assessment-item-spec.md` §1.1 says `br_pt_form` is what makes G-Q2 enforceable
— every distractor must be a form a BR-PT speaker would actually produce, and the Portuguese form
is the evidence. The 42 items of the first six packs carry that evidence and **none of it is
machine-readable**: it is in the prose feedback. A loader can grade the item and cannot say *which
Portuguese rule misfired*, which is the diagnostic signal §2.1 calls "the highest-value distractor
in the whole bank".

**`pack-les-a2-it-terms-basics.md` is the reference implementation** — 7 items, 21 distractors,
9 with a filled `br_pt_form` and 12 with `null`. The detail that settles the question is that
**`null` is a finding, not a hole.** Three of the seven items are phonological or reading items and
their distractors have no Portuguese source form: there is no L1 transfer to record. Writing
`null` asserts that the search was made and came up empty; omitting the field asserts that nobody
looked. Check [9] now counts the three states separately — `br_pt_form 9 filled / 12 null` against
`0 filled / 0 null / 7 items with no field` on the other six packs — because summing them would
hide exactly the state worth seeing.

Still open for the earlier 42: ~120 entries of migration of prose feedback into machine-readable
`br_pt_form`. The *"106 lessons that have no content at all"* this line used to name is **closed** —
122 of 123 lessons now have a pack and the 123rd is `blocked_no_adequate_source` — but the **115
legacy-schema packs** (`pack_les_*_v1.md`) remain outside [9]'s canonical schema and 110 of them
declare no `**Reuse basis:**`. Both debts are raised as WARNs so they cannot quietly get worse; the
migration order is §12.

### 10.3 On gap 8 — why coherence constructs need their own skill id

Three authored lessons independently hit the same wall: a construct that is **true of a pair of
features** rather than of either one.

| Construct | Features that exist | What the model would report |
|-----------|---------------------|----------------------------|
| `reciprocal_introduction` | `demonstrative_this`, `intro_reaction_gradation` | "mastery" while the learner omits the second introduction |
| `email_register_pairing` | `email_greeting`, `email_closing` | "mastery" while the pair is mismatched |
| `two_part_disagreement_frame` | `agree_verb`, `hedge_calibration` | "mastery" while the learner validates then agrees anyway |

In all three the learner holds **every** component and fails the combination. Retrieval practice over
the parts will never surface it, because every part is correct. This is the same argument as
`assessment-item-spec.md` §3's case for two-stage calibration: **a test whose parts all pass is not
evidence that the whole passed.** The fix is additive — a pair-level skill id scored by the
checklist items, not a change to the existing features.

---

## 11. VALIDATION RECORD

This spec has been validated against **seven** real authored packs: six covering all of
`mod_a2_workplace_intro`, and one — `pack_les_a2_it_terms_basics_v1` — covering the first lesson
of `mod_a2_it_fundamentals`. Pack 1 full results: `pack-les-a2-greetings-intro.md` §7.

| # | Pack | Items | Result |
|---|------|------:|--------|
| 1 | `pack_les_a2_greetings_intro_v1` | 7 | Amendments applied — see table below |
| 2 | `pack_les_a2_small_talk_v1` | 7 | ✅ held; **3 new gaps** found (§10.6, 7, 8) |
| 3 | `pack_les_a2_meeting_open_v1` | 7 | ✅ held; **1 new gap** found (9); wrote PACK-DEF-01 |
| 4 | `pack_les_a2_meeting_participate_v1` | 7 | ✅ held; **PACK-DEF-01**, second instance |
| 5 | `pack_les_a2_introducing_others_v1` | 7 | ✅ held; first **content-blocked** listening slot |
| 6 | `pack_les_a2_email_basics_v1` | 7 | ✅ held; confirms 8 and 9 from a second instance |
| 7 | `pack_les_a2_it_terms_basics_v1` | 7 | ✅ held on a **second module**; supplies the gap-12 reference shape |

**48 items across 6 packs of §2.2's distribution held without amendment.** That is the convergence
criterion this section asks for: the distribution, the split, the interleaving and the domain budget
were all satisfiable under the rules as written. Pack 7 matters for a second reason: it is the
first pack outside `mod_a2_workplace_intro`, so §2.2's domain bands are no longer validated on a
single module's constructs — and they still held, with Grammar at its 3-item ceiling.

| Spec claim | Verdict | Amendment applied |
|-----------|---------|-------------------|
| Fixed 5–8 items per pack | ❌ Failed | §2.1 — replaced with θ-scaled `clamp(round(2+3×P̂), 4, 8)` |
| 60/40 split is reachable | ❌ Failed | §2.1 — replaced with 55–75% / 25–45% range |
| Listening slot can be left unfilled | ✅ Held | §2.2 — manifest must record `listening_items: 0` |
| Interleaving emerges naturally | ✅ Held | none needed |
| No Speaking/Writing in L1 | ✅ Held | none needed |
| Day-1 mastery gate must fail | ✅ Held (by design) | §7.1 of the pack documents it |

### 11.1 PACK-DEF-01 — two unscorable items in the first four packs, both caught mechanically

**What happened.** `pack-les-a2-meeting-participate.md` ITEM 6 shipped with three options reading
`Could`, `Could`, `Could we…`. **ITEM 7 of the same pack** shipped `wasn't` in both option A and
option C. Both items passed my authoring self-check, because the check I was applying was *"are the
distractors different words?"* — and they were.

**Why that check was wrong.** `G-Q3` in §6 is about the learner being able to **choose**, and a
duplicate option destroys the choice. "Different words" is not the requirement; "different strings
in the option column" is.

**What changed.** Three things, and only the first is about the item:

1. **Both items were rewritten**, with the rewrite rationale left in the file. The replacement
   distractors are *better* than the originals: `Must we…?` is a well-formed English question that
   changes the speech act from proposal to objection, and `was not slow` is grammatical but says the
   opposite. Neither defect improved the item.
2. **`verify-integrity.py` [9] now checks duplicate options mechanically.** It also parses the
   `**Key:**` letter, checks for ≥ 3 options, repeated option letters, duplicate `item_id` across
   packs, and that every manifest records `listening_items:`.
3. **The `**Key:**` line had to be added to 21 items** across all four packs. I had been marking the
   key only with `✓` inside the option cell. That is human-readable and not machine-parseable, which
   meant no automated check could tell a key from a decorated distractor — which is precisely the
   condition that let both defects through.

**The transferable lesson, and the reason this entry exists rather than a one-line fix:** the
duplicate-option defect appeared in **two of the first four packs**, including twice in a single
pack. That is not bad luck, it is an authoring habit. The correct response to a habit is a check,
not a reminder — and the check then paid for itself immediately by finding the second instance and
the 21 missing key lines on the same run.

---

## 12. THE TWO PACK SCHEMAS — what is covered, what is not, and the migration

This section exists because it is the answer to a `[WARN]` that `verify-integrity.py` emits on every
run, and because the reason the warning fired is that **check [9] had validated 7 of 122 packs for
its entire life.** Everything in §11 — the duplicate-option defect, the missing keys, the
prefix↔namespace rule, the `br_pt_form` census — was enforced on the 7 files matching
`pack-les-*.md` and on none of the 115 matching `pack_les_*_v1.md`.

### 12.1 The fork is real, and it was never a decision

| | **Family A** | **Family B** |
|---|---|---|
| Filename | `pack-les-<lesson>.md` | `pack_les_<lesson>_v1.md` |
| Files | **7** | **115** |
| Items | **49** | **806** |
| Shape | YAML manifest + per-item YAML block + prose feedback | prose header + flat `**item_id:**` fields + `\| Slot \| Value \|` table + `**Key:**` |
| Distractor form | `- option:` list, each with `br_pt_form:` / `note:` | anonymous table row; no per-distractor metadata |
| `**Reuse basis:**` | present | **absent in 110 of 115** |
| `item_id` style | `grm_…` / `voc_…` / `rdg_…` / `prn_…` / `lst_…` / `coh_…` | dotted, e.g. `vocab.alphabet.vowels` |
| Globbed by `PACK_FILES` | yes | no |

**Total: 122 packs, 855 items.** Both families are in active use; neither was deprecated in writing.
The fork was a drift, not an architecture. It was found when the `br_pt_form` migration touched a
Family B pack and the per-distractor rules did not run on it.

### 12.2 What now runs on both families

The migration did **not** change the glob — that would have converted the fork into 700+ failures
for a schema decision nobody has taken. Instead the schema-independent rules were extracted and made
to run over both globs, and the residual differences are what the warning reports:

| Rule | Applies to | Where |
|------|-----------|-------|
| `item_id` **unique** across every pack, both schemas | **both** (855 ids) | [11c] |
| Every `### ITEM` declares a parseable `item_id`; every item **with a distractor table** declares a `**Key:**` | **both** (841 keyed / 14 distractor-free) | [11d] |
| **No option repeated** within an item (bold stripped, case kept) | **both** | [11e] |
| `br_pt_form` census published in `assessment-item-spec.md` §2.2.1 | Family A only (the field exists only there) | [9] |
| Prefix ↔ skill namespace (§1.2) | **Family A only** — reserved to the migration | [9] |

[11e] is the check that found §11.1's second instance at scale: run across all 855 items it found
**28 unscorable items** — a distractor byte-identical to its own key, the key merely bolded. §11.1
had found 2, in the 7 files the glob could see. The other 26 were in Family B, where nothing had ever
looked. The comparator is case-sensitive on purpose: `pack_les_a1_alphabet_sounds_v1.md` ITEM 3 is an
uppercase-versus-lowercase item whose options are `a, b, c` and `A, B, C`, and a case-insensitive
comparator would have "repaired" a correct item by deleting the only signal in it. See
`verify-integrity.py` [11e].

### 12.3 What is still uncovered, and why it is a warning

Three §-rules remain enforced on Family A only:

1. **`**Reuse basis:**` — absent from 110 Family B packs.** AGENTS.md's licensing section requires a
   reuse basis *per artefact*; `ARTIFACTS` globs `les_*.md` + `pack-les-*.md`, so the requirement has
   never been checked against Family B. The 5 newly authored Family B packs carry it, so the count is
   **5 of 115**.
2. **`item_id` prefix ↔ namespace** — 110 Family B packs use dotted ids that do not satisfy §1.2.
   This is a *migration*, not a defect: the ids are stable identifiers, and renaming 770 of them is a
   coordinated change, not a drive-by edit.
3. **`listening_items:` in the manifest** — Family B has no manifest to carry it.

The warning is the correct output for these. A `FAIL` would say the repository is broken; it is not —
it is carrying a documented, bounded piece of unfinished work. The failure mode a `FAIL` would
introduce is worse than the gap: three permanent red lines that everyone learns to scroll past, and
that would bury the real failure the next time one appears.

### 12.4 The migration, when it is taken

Ordered so each step is independently verifiable and none requires the others:

1. **Add `**Reuse basis:**` to the 110 Family B packs.** Mechanical; the basis is `cite_only` unless
   the pack's items are annotated `source_derived`, in which case the licensing P0 applies first
   (`external-sources.md` §7.0).
2. **Rename dotted `item_id`s to the prefixed convention**, pack by pack, keeping a mapping table so
   learner history survives the rename. This is the only step with a data-migration cost and is why
   it is last.
3. **Retire `PACK_FILES`, point `PACK_FILES = LEGACY + FAMILY_A`, and delete the warning.** The two
   schemas may remain; only the *coverage* needs to be unified.

Until step 3, this section is the record that the warning is intentional, and `[11c]`, `[11d]` and
`[11e]` are the assurance that the highest-cost defects — unscorable items, invisible ids — are
already covered on both families regardless.
