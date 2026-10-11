# Diagnostic Module Specification — Adaptive CEFR Placement

**Purpose:** Place new learners at correct CEFR level + skill profile in 10-15 min using Computerized Adaptive Testing (CAT) with IRT backbone.

---

## 1. DESIGN PRINCIPLES

| Principle | Implementation |
|-----------|----------------|
| **Adaptive** | CAT selects max-information items at current θ estimate |
| **Low-stakes** | No "test" framing — "quick check to personalize your path" |
| **Multidimensional** | Outputs: overall θ + **4 assessed** skill θs (Grammar, Vocab, Reading, Pronunciation). Listening deferred — see §2.1. Per-domain θ reported only when identified (§3.3a). |
| **BR-PT Aware** | Items tagged for L1 interference; false-beginner detection |
| **Tech-context** | 30% items in IT/workplace context for dev profile |

---

## 2. TEST BLUEPRINT (Test Specification)

### 2.1 Target Constructs
> ⚠️ **AMENDED by `assessment-item-spec.md` §2.5 (corrections X3 + X4).** **Listening is removed
> from the blueprint.** No source file contains listening material (`content-map.md` §8.5 G2), so a
> listening item has no `a`/`b` parameters, cannot contribute to the θ estimate, and would make the
> placement number undefendable. Its 20% is redistributed to Reading (+6) and Pronunciation (+7).
>
> Pronunciation rises to 17% and is **minimal-pair identification only** — production scoring needs
> an ASR phoneme-scoring engine, which the MVP does not have. That is now a **recorded decision**,
> not an omission: `assessment-item-spec.md` §2.5.1 states the reasoning, what the ITS does
> instead, and the condition that would reverse it. It is not claimed as production ability.

| Domain | CEFR Levels | Weight | Min Items | Max Items | Status |
|--------|-------------|--------|-----------|-----------|--------|
| **Grammar** | A1–B2 | 34% | 6 | 9 | ✅ buildable |
| **Vocabulary** | A1–B2 | 28% | 5 | 8 | ✅ buildable (text-only) |
| **Reading** | A1–B2 | 21% | 4 | 6 | ✅ buildable |
| **Pronunciation** | A1–A2 | 17% | 3 | 5 | ⚠️ identification only |
| ~~**Listening**~~ | — | ~~20%~~ | — | — | ⛔ **deferred** — no source |
| **Total** | | **100%** | **18** | **28** | |

> **Disclosure obligation:** the results screen must state *"Listening not yet assessed"*. A placement
> that silently omits a competence it claims to measure is a false promise.

### 2.1.1 The question §2.1 deferred: what the selector does with a 0% domain

§2.1 sets Listening to 0% and the decision was correct. It was never reconciled with a fact that
became true afterwards: **the lesson layer admits Listening before the diagnostic ever does.**
`les_a2_it_terms_basics` FASE 1.3 is a listening task, and it is the *first* listening evidence a
learner will produce in this system. So Listening is simultaneously the least-assessed domain at
placement and the earliest-assessed domain in delivery, and nothing in the spec said how those two
facts combine. Four consequences, all of which had to be decided rather than discovered:

**1. The placement is a 4-domain placement, and must be labelled as one.**
`recommended_start_node` is chosen on Grammar, Vocabulary, Reading and Pronunciation. It is *not*
a claim about the learner's listening, in either direction — not "their listening is fine" and not
"their listening is poor". `listening` is absent from the profile, and the results screen must
show its absence (already required by §2.1's disclosure obligation).

**2. The selector's fallback for Listening is CEFR band, not need.**
Every other domain is selected by "the weakest identified skill". With no listening θ there is no
weakest listening skill, so **the first listening-bearing lesson is selected by the learner's CEFR
band from Grammar/Vocabulary/Reading** — the only information available. From the second listening
lesson onward, BKT state takes over. This fallback is coarse and it is stated rather than hidden:
a learner placed A2 by reading may be given an A2 listening clip whose actual difficulty is
untested. The mitigation is the same as everywhere else in this repository — the clip's construct
set is declared in `listening-corpus.md` §9 and reviewed by a human before render.

**3. Listening skill state is BKT-only, and can never be IRT.**
Lesson-layer items are `authored_illustrative`; none has `a`/`b` parameters, so no listening θ can
ever be produced by the CAT. A listening θ becomes available exactly when the audio corpus renders
**and** Stage-1 calibration runs on it (`assessment-item-spec.md` §9, X2). Until both, listening
mastery is tracked by BKT alone, which is adequate for a per-skill ≥ 0.85 gate and is not adequate
for a θ — the two must not be reported with the same confidence, and §3.3a's band rule covers
exactly this case by excluding it from the profile.

**4. A re-diagnostic is required, and it is a scheduled event, not a user action.**
Because placement carries no listening evidence, the diagnostic must be **re-run once the audio
corpus renders**, and the second run is the one whose CEFR band may be quoted. The first run's band
is labelled `placement_provisional` until then. This is a real product obligation — it is the
mechanism by which a promise made on the results screen is kept.

> **What this amendment does not do.** It does not restore Listening's 20%. Doing so is the
> original error: a placement number that rests on a domain with no parameters is not a
> measurement, it is a rounding. The honest move was always to shrink the claim, and the missing
> part was never the weight — it was the operational consequence of having shrunk it.

### 2.2 Item Pool Requirements (Pre-Calibrated)
> ⚠️ **AMENDED (X4).** These are **roadmap** figures, not MVP commitments — see
> `assessment-item-spec.md` §8. The **Listening row is retained only to show the size of the gap; it
> contributes 0 buildable items.**

| Domain | A1 | A2 | B1 | B2 | Total | MVP commitment |
|--------|----|----|----|----|-------|-----------------|
| Grammar | 20 | 25 | 20 | 15 | 80 | **40** |
| Vocabulary | 25 | 30 | 25 | 20 | 100 | **38** |
| ~~Listening~~ | ~~15~~ | ~~20~~ | ~~15~~ | ~~10~~ | ~~60~~ | **0 — deferred** |
| Reading | 10 | 15 | 15 | 10 | 50 | **22** |
| Pronunciation | 15 | 10 | 8 | 5 | 38 | **20** |
| **Total** | **85** | **100** | **83** | **60** | **328** | **120** |

> **Full bank (540 items)** is a long-run target from `stats-progress-evaluation-spec.md` §4.3.
> At the pilot scale in §7.2 (200 users × 22 items = 4,400 responses) only **22 items** reach full
> empirical calibration — hence the 120-item Stage-1-anchored MVP pool.

### 2.3 Item Types by Domain
| Domain | Types | Modality |
|--------|-------|----------|
| Grammar | MCQ (4-opt), Cloze, Error detection | Text |
| Vocabulary | MCQ, Matching, Cloze, Collocation select | **Text only** — audio deferred with Listening |
| ~~Listening~~ | ~~MCQ (audio), T/F, Gap-fill~~ | ⛔ **deferred — no audio corpus exists.** Spec retained so the corpus has a target when authored. |
| Reading | MCQ, Matching headings, Gap-fill | Text |
| Pronunciation | Minimal-pair discrimination, Odd-one-out | Audio → Button. **Identification only** — production needs the ASR engine, which is not specced. |

---

## 3. CAT ALGORITHM SPECIFICATION

### 3.1 Initial θ Estimate
```
θ₀ = -1.0  (slightly below A2, accounts for false beginners)
SE₀ = 1.0  (high uncertainty)
```
Alternative: Quick 3-item router (A1/A2/B1) → set θ₀ per router result.

### 3.2 Item Selection: Maximum Fisher Information (MFI)
```
I(θ) = a² * P(θ) * Q(θ)  where P(θ) = 1 / (1 + exp(-a(θ - b)))
Select item maximizing I(θ_current) from available pool
```

### 3.3 Constraints (Applied at Selection Time)
| Constraint | Rule |
|------------|------|
| **Content balancing** | Max 2 items per domain per 5 items administered |
| **Exposure control** | Sympson-Hetter: P(administer) = min(1, r / expected_exposure), r=0.8 |
| **Enemy items** | Block pairs with shared distractor/misconception within 3 items |
| **Modality balance** | Max 60% same modality consecutively |
| **BR-PT relevance** | Prioritize items tagged `br_pt_interference=true` when θ near threshold |

### 3.3a Dimensionality — Why Skill θ Is Under-Identified (correction X5)

This is the deepest unresolved issue in the original design and it is **not fully solved**; it is
bounded and disclosed instead.

**The problem.** §1 promises "overall θ + 5 skill θs". §3.2 selects items by **unidimensional** 2PL
Fisher information. A unidimensional model has **one** latent trait. Estimating five skill-specific
θs from a one-dimensional item pool is under-identified: below roughly **5 items in a domain**, the
domain θ is numerically computable but **not identified** — the estimate is determined by the overall
θ plus noise.

**Full MIRT** (multidimensional IRT) would resolve this properly, but it needs a calibration
population an order of magnitude larger than the MVP pilot provides. Recommending it now would
reproduce the `stats` §4.3 bank-sizing mistake.

**Resolution — estimate one θ, report domain θ only when identified:**

```
1. CAT runs unidimensional 2PL  →  a single identified θ̂ with SE
2. Per-domain: report θ_domain ONLY IF  n_items_in_domain ≥ 5
3. Otherwise: report the domain as "insufficient evidence" with the interval,
   never a point estimate
```

| Domain θ items administered | Reported as |
|---------------------------|-------------|
| ≥ 5 | Point estimate + SE |
| 3–4 | Band only ("A1–A2"), no point estimate |
| 0–2 | `insufficient_evidence: true`, excluded from the profile |

**This is why the min/max item counts in §2.1 matter operationally.** The Min Items column (6/5/4/3)
is not a coverage preference — it is the threshold that makes a domain θ reportable. A domain that
misses its minimum is *absent from the profile*, and the results screen must say so rather than
displaying a number derived from 2 items.

> **Honest framing for the results screen:** *"Você é A2. Gramática e vocabulário foram avaliados
> com boa precisão; pronúncia recebeu itens insuficientes para um resultado confiável."*
> Showing five confident numbers, two of which are noise, is worse than showing three numbers and two gaps.

### 3.4 θ Update (After Each Response)
```
EAP (Expected A Posteriori):
θ_new = argmax_θ [ P(θ) * Π P(response_i | θ, a_i, b_i) ]

SE(θ) = 1 / √(Σ I_i(θ))
```
Implementation: Numerical quadrature (Gauss-Hermite, 31 points) or Metropolis-Hastings.

> ⚠️ **AMENDED (ADR-025, 2026-10-11).** Two defects in the block above, both of them invisible to
> a reader who trusts one half of it.
>
> 1. **The label and the formula disagree.** It says `EAP (Expected A Posteriori)` — the posterior
>    **mean** — and writes `argmax_θ [...]`, the posterior **mode**. The operator is the executable
>    text; the abbreviation is a name for a different functional. (ADR-023 resolved the same class
>    of conflict in ADR-017 §3 by the same rule.)
> 2. **`P(θ)` was never defined anywhere.** Without it the expression is unbounded: for an
>    all-correct response set the likelihood is strictly increasing in θ, so its argmax is `+∞`. A
>    fixed-form estimator therefore **cannot exist** without a stated prior, and the implementation
>    that omitted one drifted `+0.1·Σa` per iteration.
>
> **Binding reading — implemented in `computeThetaEstimate`, `src/domain/services/diagnostic-placement.service.ts`:**
>
> ```
> θ₀ = initialTheta,  P(θ) = N(θ₀, 1)
> logPosterior(θ) = −(θ − θ₀)²/2σ² + Σ_i log p_i(x_i | θ; a_i, b_i)   # stable log1p log-sigmoid
> θ̂ = argmax over { θ₀ + k·0.01 : k ∈ [−600, +600] }     # 1201 points, ties → smallest θ
>                                         # bounded: |θ̂ − θ₀| ≤ 6
> se = 1/√(Σ_i I_i(θ̂))                    # as the second line already wrote; Infinity if ΣI = 0
> ```
>
> `θ₀ = initialTheta` (default `0`) gives the existing parameter a real meaning: the run's *overall*
> estimate uses `θ₀ = 0`, and each response's estimate uses the running θ — a documented
> **sequential** update, not 12 independent estimates. `se = Infinity` for an empty response vector
> is the formula's own `ΣI = 0` limit; a substituted finite fallback (the previous `: 1.0` branch)
> fabricates precision at the one point where there is none. **Metropolis-Hastings is not
> admissible here** — ADR-024 D4 makes the executor a pure function of its inputs, and a sampler's
> output is a function of a seed nobody passes.
>
> **Retained alternative, not chosen:** the Gauss-Hermite 31-point *posterior mean* is the reading
> the abbreviation names. Adopting it would report a marginally different number; it is now an
> explicit, nameable change instead of a silent re-reading. Full comparison, rejected options and
> measured consequences (`cefr = B2` unreachable on the current 12-item form) → **ADR-025**.

### 3.5 Stopping Rules (ANY triggers stop)
> ⚠️ **AMENDED (X4 + correction X12).** Two problems in the original table.
>
> 1. **"All 5 domains touched at least once"** is unsatisfiable under the amended blueprint — there
>    are **4 domains**, and "touched once" is below the §3.3a identification floor of 5, so it would
>    not produce a reportable θ anyway.
> 2. **`SE(θ) < 0.35` was unreachable.** With a Stage-1-only pool, parameter uncertainty alone
>    contributes `SE_parameter ≈ 0.30` (`assessment-item-spec.md` §3.3). The rule is therefore
>    evaluated on **`SE_statistical`** — test-length control — while the results screen reports
>    **`SE_effective`** — placement precision. Both are shown to the learner.

| Rule | Threshold | Type |
|------|-----------|------|
| **Precision** | `SE_statistical(θ_overall)` < 0.35 | test-length control |
| **Max items** | 28 items (§2.1 revised max) | hard |
| **Min items** | 18 items (§2.1 revised min) | hard — even if precise |
| **Time cap** | 15 minutes wall-clock | hard |
| **Domain coverage** | Each of the **4 active** domains reaches its §2.1 Min Items | reportability |
| **Diminishing returns** | Marginal Δ`SE_statistical` < 0.01 over 3 consecutive items | efficiency |

> **Min 18 / max 28, not 15/30.** The information requirement for `a ≈ 1.2` items predicts ~23
> administrations (`assessment-item-spec.md` §3.5). A 15-item minimum at `a=1.0` reaches only
> SE ≈ 0.41 — below the target — and a 30-item maximum invites a length the 15-minute cap will cut
> off mid-test anyway.

### 3.6 Output
```json
{
  "overall": {"theta": -0.3, "se": 0.28, "cefr": "A2", "ci_95": [-0.85, 0.25]},
  "skills": {
    "grammar": {"theta": 0.1, "se": 0.32, "cefr": "A2"},
    "vocabulary": {"theta": -0.5, "se": 0.35, "cefr": "A1"},
    "listening": {"insufficient_evidence": true, "items_administered": 0, "reason": "domain removed from the blueprint (§2.1); no listening item has a/b parameters"},
    "reading": {"theta": 0.3, "se": 0.38, "cefr": "A2"},
    "pronunciation": {"cefr_band": "A1–A2", "items_administered": 3, "note": "§3.3a: 3–4 items gives a band, never a point estimate"}
  },
  "profile": "false_beginner_suspected",
  "recommended_start_node": "les_a2_greetings_intro",
  "calibration_disclosure": {
    "pool_status": "expert_anchored",
    "se_statistical": 0.31,
    "se_parameter": 0.30,
    "se_effective": 0.43,
    "precision_label": "provisional",
    "domains_not_assessed": ["listening"],
    "disclosure_text": "Listening not yet assessed — coming soon."
  },
  "skill_theta_reportable": {
    "grammar": true, "vocabulary": true, "reading": true,
    "pronunciation": false, "listening": false
  },
  "bkt_priors_override": {
    "present_simple_be": 0.35,
    "th_voiced": 0.10,
    "tech_vocab_basic": 0.40,
    "listening.noun_compound_identification": 0.05,
    "pronunciation.s_consonant_cluster": 0.10
  }
}
```

---

## 4. FALSE BEGINNER DETECTION

### 4.1 Signals
| Signal | Threshold | Interpretation |
|--------|-----------|----------------|
| **Grammar θ >> Vocab θ** | Δ > 1.0 | Studied grammar, no exposure |
| **Reading θ >> Listening θ** | Δ > 1.0 | ⚠️ **UNUSABLE — Listening is not assessed** (§2.1). The signal is retained in the spec but must be inert until the corpus exists. Replace in MVP with: Pronunciation θ < −1.5 while Reading θ > 0.0 → passive-receptive profile. |
| **High guess rate** | P(G) > 0.35 on new items | Test-wise, not knowledgeable |
| **Pronunciation θ very low** | θ < -1.5 | Never practiced speaking |
| **Self-report vs. θ mismatch** | Self: "intermediate", θ: A1 | Dunning-Kruger / false beginner |

### 4.2 Action
- Override BKT priors: inflate P(L₀) for grammar/vocab, deflate for speaking/pronunciation
- Insert "confidence builder" micro-lessons (2-3) before main curriculum
- Flag for affective filter monitoring

---

## 5. ONBOARDING FLOW (UX)

```
┌─────────────────┐
│ Welcome Screen  │  "Vamos personalizar seu inglês em 10 min"
│ + Consent       │  (LGPD, analytics opt-in)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Profile Quick   │  Role (dev/non-dev), Study time/week,
│ Questionnaire   │  Goal (work/travel/general), Self-estimate CEFR
└────────┬────────┘
         ▼
┌─────────────────┐
│ Audio Check     │  Mic permission, volume test, "Repita: 'three'"
└────────┬────────┘
         ▼
┌─────────────────┐
│ CAT Session     │  18-28 items, progress bar "Personalizando..."
│ (Adaptive)      │  No back button, no skip (except accessibility)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Results Screen  │  "Seu nível: A2 (quase B1)"
│ + Path Preview  │  Strong: Reading | Focus: Pronunciation + Speaking
└────────┬────────┘
         ▼
┌─────────────────┐
│ First Lesson    │  Auto-starts recommended node
└─────────────────┘
```

---

## 6. ITEM AUTHORING GUIDELINES (for Content Team)

### 6.1 CEFR Alignment Rules
| Level | Grammar Scope | Vocab Scope | Listening/Reading |
|-------|---------------|-------------|-------------------|
| **A1** | Present simple (be, have), imperatives, basic Qs | 500 most freq + tech cognates | Slow, clear, 30s max |
| **A2** | Past simple, present perfect intro, modals (can/should) | 1500 freq + workplace | Normal speed, 60s |
| **B1** | Conditionals 1/2, passive, reported speech | 3000 freq + idioms | Natural speed, 90s |
| **B2** | Perfect modals, subjunctive, cleft sentences | 5000 freq + abstract | Fast, accented, 2min |

### 6.2 BR-PT Interference Tags (Required per Item)

Fragment — this field is nested inside the item object (`assessment-item-spec.md` §1).

```json
"br_pt_tags": [
  "false_cognate:excited/ansioso",
  "phoneme:th_voiced",
  "syntax:null_subject_drop",
  "spelling:no_epenthetic_vowel"
]
```

### 6.3 Distractor Design (MCQ)

> ⚠️ **EXTENDED by `assessment-item-spec.md` §2.1.** Four slots were specified here; the item spec
> defines **six** types. The four original types remain valid and required; two were added because
> the original "Plausible Semantic" bucket conflated distinct errors.

- **1 Key** (correct) — required
- **1 `l1_transfer`** — a form a BR-PT speaker would actually produce. **Mandatory whenever a
  documented BR-PT form exists**; the Portuguese form must be recorded as `br_pt_form`
- **1 `overgeneralization`** — a known rule applied one step too far
- **1 `semantic_plausible`** — right part of speech, wrong meaning
- **1 `form_alternative`** *(added)* — real English, wrong only in this context
- **1 `register_mismatch`** *(added)* — grammatically fine, socially wrong here
- **`negative_control`** *(added, ≤1 per item)* — detects satisficing; never the only non-key option

Non-MCQ types (free-text cloze, matching, ordering) need no distractors but require an explicit
`p_random` chance level and **enumerated answer variants** — see `assessment-item-spec.md` §2.3.

---

## 7. SIMULATION & VALIDATION (Pre-Launch)

### 7.1 Monte Carlo Simulation (10,000 Simulees)
| Metric | Target |
|--------|--------|
| **Recovery RMSE (θ)** | < 0.30 |
| **CEFR Classification Accuracy** | > 85% |
| **Skill θ Correlation (true vs est)** | > 0.70 |
| **Test Length (mean)** | 23 ± 4 items |
| **Floor/Ceiling Effect** | < 5% at A1/B2 |

### 7.2 Live Pilot (First 200 Users)
- Compare CAT θ vs. a **40-item fixed form** on the same learners
- Track: time, completion rate, self-report alignment
- Recalibrate items with **>50 responses** (MML, shrunk toward the Stage-1 anchor)
- **Budget reality:** 200 users × 23 items ≈ **4,600 responses** → only **~23 items** reach
  n=200. This is the constraint behind the 120-item MVP pool
  (`assessment-item-spec.md` §3.4). Do not promise more.

> ⚠️ **Circularity warning (X13).** The original text proposed comparing CAT θ against a "50-item
> fixed form (**gold standard**)". A fixed form is only a gold standard if it is calibrated on an
> *independent* sample — otherwise it shares the CAT pool's Stage-1 assumptions and the comparison
> measures self-agreement, not accuracy. Fix: split the pilot. Items used in the CAT and items used
> in the fixed form must be **disjoint**, and the fixed form is calibrated on its own responses.

---

## 8. INTEGRATION WITH STATS SPEC

| Stats Spec Component | Diagnostic Usage |
|---------------------|------------------|
| **IRT 2PL Item Bank** | Source of (a,b) for CAT selection |
| **BKT Priors** | Override P(L₀) per skill from diagnostic profile |
| **FSRS** | Initialize stability/difficulty from diagnostic θ |
| **Pedagogical Memory** | Store full diagnostic output as `diagnostic_v1` event |
| **Curriculum Graph** | Map θ profile → start node (see §3.6) |

---

## 9. TECHNICAL REQUIREMENTS

| Component | Spec |
|-----------|------|
| **CAT Engine** | Stateless function: `select_next_item(history, pool, constraints) → item_id` |
| **θ Estimator** | EAP via quadrature; cache posterior grid per user |
| **Item Pool Service** | Filter by constraints in <50ms (pre-indexed by domain, b-range, tags) |
| **Audio Delivery** | CDN, pre-signed URLs, opus 24kbps, <200ms TTFB |
| **Event Logging** | Append `diagnostic_item_response` + `diagnostic_complete` to stats pipeline |

---

## 10. MVP SCOPE (Week 1-2)

> ⚠️ **AMENDED (X3).** The original MVP scope listed "3 domains (Grammar, Vocab, **Listening**)" —
naming the one domain with no source material. Replaced with the four buildable domains.

| In Scope | Out of Scope |
|----------|--------------|
| CAT over a **120-item** pool (`assessment-item-spec.md` §8.1), Stage-1 anchored | Full 328-item bank; any item with n≥50 |
| **4 domains: Grammar, Vocabulary, Reading, Pronunciation (identification)** | **Listening** (no source) |
| EAP θ with `SE_statistical` stopping rule | Production pronunciation scoring (no ASR engine) |
| Skill-level θ **only where n ≥ 5 items in that domain** | Skill-level θ below that floor (§3.6) |
| `SE_effective` reported alongside `SE_statistical` | Placement claims at Stage-1 precision without disclosure |
| Basic false-beginner heuristic | Full profile detection |
| Results → start-node mapping | Path preview UI |

---

*This spec operationalizes the CAT/IRT approach from `stats-progress-evaluation-spec.md` for the diagnostic entry point. Next: `curriculum-graph-spec.md` to define where diagnostic θ maps.*