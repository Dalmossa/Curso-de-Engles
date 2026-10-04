# Statistical & Probabilistic Student Progress Evaluation — Spec

**Purpose:** Replace hard thresholds (e.g., "≥80%") with probabilistic mastery estimates, predictive modeling, and statistically grounded adaptive decisions.

---

## 1. CORE MODEL: Bayesian Knowledge Tracing (BKT) + IRT Hybrid

### 1.1 Why BKT?
- Models **latent knowledge state** (knows/doesn't know) per skill
- Handles **noisy observations** (slip/guess parameters)
- Updates in **real-time** after each interaction
- Interpretable: `P(knows | history)`

### 1.2 Why IRT (2PL)?
- Calibrates **item difficulty (b)** and **discrimination (a)**
- Enables **adaptive test** (select items maximizing information)
- Links BKT skills to **CEFR scale** via item bank

### 1.3 Hybrid Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   IRT Item Bank │────►│  Adaptive Test  │────►│   BKT Engine    │
│  (a, b params)  │     │  (CAT/Shadow)   │     │  (per skill)    │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                              ┌──────────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │ Mastery Posterior│
                    │ P(θ_s > θ* | D)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌───────────┐  ┌───────────┐  ┌───────────┐
       │Curriculum │  │  Spaced   │  │  Content  │
       │  Graph    │  │Repetition │  │ Selector  │
       │ Navigator │  │ Scheduler │  │  (i+1)    │
       └───────────┘  └───────────┘  └───────────┘
```

---

## 2. BKT PARAMETERIZATION (Per Skill)

### 2.1 Standard BKT Parameters
| Param | Symbol | Meaning | Prior (BR-PT Tech Learner) | Source |
|-------|--------|---------|----------------------------|--------|
| Initial knowledge | P(L₀) | Prob knows skill before any obs | 0.15 (false beginner bias) | judgement anchor |
| Learn rate | P(T) | Prob learns on practice opportunity | 0.25 | judgement anchor |
| Slip | P(S) | Prob errors despite knowing | 0.10 | judgement anchor |
| Guess | P(G) | Prob correct despite not knowing | **per item** = `p_random` | derived - see below |

> **Correction (X7), two stages.**
>
> **Stage 1 - the value.** The original was **0.20**, which is *below* uniform chance. On a 4-option
> item random guessing gives exactly **0.25**, so `P(G) < 0.25` is impossible for a learner in the
> not-knowing state: reaching it would require partial knowledge, which contradicts the definition of
> that state. Consequence of the error: BKT under-credited correct answers from weak learners,
> inflating estimated mastery on guess-heavy item sets.
>
> **Stage 2 - the granularity, verified against `pyBKT`.** Setting `P(G) = 0.25` globally is still
> wrong, because the chance level is a property of **the item**, not of the model. `pyBKT`
> implements this directly: it supports *individual item guess and slip parameters*, and its
> `multigs` option takes a **column name** to assign per-item guess classes. A single global `P(G)`
> is the limitation of the original BKT formulation, not of the estimator.
>
> **Therefore:**
> ```python
> P(G)_item = item.metadata.p_random      # 1/n_options for MCQ; 1/n! for matching/ordering
> ```
> `assessment-item-spec.md` §1.1 already required `p_random`; this makes it load-bearing rather than
> decorative. Items whose `p_random` is unknown are **excluded from the CAT** - an item whose chance
> level is unknown cannot contribute a P(correct) that BKT can condition on.
>
> `P(L₀) = 0.15`, `P(T) = 0.25`, `P(S) = 0.10` remain **judgement anchors, to be fitted**, not
> measurements. `pyBKT` exposes them as `model.coef_` and fits all four by EM; the values above
> initialise `coef_` and must be relabelled as *refitted* once n is sufficient. The alert thresholds
> in §11 (e.g. "P(S) > 0.20") are only meaningful against fitted values.


### 2.2 Skill-Granularity Decision
**Option A: Coarse** (1 BKT node per CEFR can-do) — ~200 nodes
**Option B: Fine** (1 BKT node per grammar point/vocab item/phoneme) — ~2000 nodes

**Recommendation:** **Hierarchical BKT**
- **Leaf nodes**: Fine-grained (grammar: `present_simple_be`, vocab: `backend_developer`, phoneme: `th_voiced`)
- **Parent nodes**: CEFR can-do descriptors (aggregated via IRT)
- **Transfer**: `P(T_parent) = mean(P(T_children))` with decay

---

## 3. MASTERY DECISION RULES (Probabilistic)

### 3.1 Mastery Definition
```
Mastery(s) = P(θ_s > θ*_CEFR | D) ≥ τ
```
Where:
- `θ_s` = student ability on skill s (IRT θ scale)
- `θ*_CEFR` = CEFR threshold (e.g., A2 = -0.5, B1 = 0.5, B2 = 1.5)
- `τ` = decision threshold (default 0.85, not 0.80)

### 3.2 Confidence Intervals for Decisions
| Decision | Rule | Rationale |
|----------|------|-----------|
| **Unlock next lesson** | P(mastery) ≥ 0.85 AND CI₉₅ lower bound > 0.70 | Avoid false positives |
| **Recommend review** | P(mastery) < 0.60 OR CI₉₅ upper bound < 0.75 | High uncertainty → more data |
| **Flag struggle** | P(mastery) declining 3+ consecutive sessions | Early intervention |
| **Accelerate** | P(mastery) ≥ 0.95 AND CI₉₅ lower > 0.85 AND time < 50% median | Gifted/fast learner path |

### 3.3 Per-Skill vs. Aggregate Mastery
- **Lesson gate**: ALL prerequisite skills ≥ τ (conservative)
- **Module gate**: MEAN(P(mastery)) ≥ τ AND no skill < 0.60
- **CEFR level gate**: IRT θ estimate with CI₉₅ fully above threshold

---

## 4. IRT ITEM BANK SPECIFICATION

### 4.1 Item Schema
> ⚠️ **SUPERSEDED by `assessment-item-spec.md` §1.** The schema below is the original minimal form.
> The authoritative schema adds `calibration.status`, per-distractor `type` + `br_pt_form` +
> `expected_share`, `br_pt_tags`, `quality` fit statistics, `provenance`, and `assets`.
> Fields here are a subset and remain valid.

```json
{
  "item_id": "gram_present_simple_be_001",
  "skill_ids": ["present_simple_be", "subject_pronouns"],
  "cefr_level": "A1",
  "irt_model": "2PL",
  "a": 1.2,
  "b": -1.0,
  "type": "cloze",
  "stem": "She ____ a developer.",
  "options": ["is", "are", "am", "be"],
  "key": "is",
  "distractor_analysis": {
    "are": "L1 transfer: PT 'ela sao'",
    "am": "overgeneralization",
    "be": "infinitive form"
  },
  "metadata": {
    "source": "frases-ingles-trabalho.md",
    "context": "workplace_intro",
    "estimated_time_sec": 15
  }
}
```

### 4.2 Calibration Pipeline
> ⚠️ **AMENDED by `assessment-item-spec.md` §3.** The original step 2 read "Minimum 200 responses
> per item (**simulate if needed**)" — a fatal methodological error, struck below. The
> authoritative protocol is two-stage; this summary is a pointer, not the source of truth.

1. **Expert anchoring (Stage 1)**: 3 raters assign provisional (a,b) from CEFR descriptors.
   Status = `expert_anchored`. Usable in CAT **with inflated SE** (§4.4).
2. **Pilot data (Stage 2)**: activates at **n ≥ 50**, full empirical status at **n ≥ 200**.
   Bayesian MML with a JML prior centred on the Stage-1 anchor.
3. **Estimation**: MML with shrinkage toward the anchor. **Simulated responses are forbidden**
   as a source of calibration data.
4. **Fit statistics**: Infit/Outfit MNSQ ∈ [0.7, 1.3]; point-biserial ≥ 0.20.
5. **DIF analysis**: Mantel-Haensson by L1 and tech background. **A-class** flags → remove or
   rewrite. **B-class** flags → keep and label, because genuine L1 interference is the point
   of the item.

> **Why simulation is banned.** An item generated with (a=1.25, b=−0.90) yields simulated responses
> drawn *from those same parameters*. MML on them recovers 1.25 and −0.90 up to sampling noise,
> and the result passes the Infit check. It is the author's assumption restated in the clothing
> of a measurement — and the CAT would then report a precision it cannot defend.
> See `assessment-item-spec.md` §3.1.

### 4.3 Target Item Bank Size (ROADMAP — not an MVP commitment)
| Skill Domain | Items (A1) | Items (A2) | Items (B1) | Items (B2) | Total |
|--------------|------------|------------|------------|------------|-------|
| Grammar      | 30         | 40         | 35         | 25         | 130   |
| Vocabulary   | 40         | 50         | 45         | 35         | 170   |
| Listening    | 20         | 25         | 25         | 20         | 90    |
| Reading      | 15         | 20         | 25         | 20         | 80    |
| Pronunciation| 25 (min pairs) | 20 | 15 | 10 | 70 |
| **Total**    | **130**    | **155**    | **145**    | **110**    | **540** |

> ⚠️ **AMENDED by `assessment-item-spec.md` §8 — these figures are long-run aspirations, not MVP
> commitments.** They are arithmetically unreachable at the pilot scale in `diagnostic-spec.md` §7.2:
> 200 users × 22 items = **4,400 responses**, which at 200/item fully calibrates **22 items**.
>
> | Horizon | Pool | Basis |
> |---------|------|-------|
> | **MVP** | **120** | 6.7× an 18-item CAT; all Stage-1 anchored |
> | V1 (~1,500 users) | 400 | 30,000 responses → 150 items at n=200 |
> | V2 (~10,000 users) | 900 | `diagnostic-spec.md` §2.2's 328 becomes reachable |
>
> **The Listening row contributes 0 items until a dialogue corpus exists** — no source file contains
> listening material (`content-map.md` §8.5 G2, `assessment-item-spec.md` §2.4).

### 4.4 Precision Under Different Calibration Status (added)

An `expert_anchored` item's parameters carry real uncertainty. Reporting a Stage-1-only CAT at the
precision its statistics imply would overstate what is known.

```
SE_effective(θ) = sqrt( SE_statistical(θ)² + SE_parameter(θ)² )
```

| Status | SE_parameter | Realistic SE_effective @ 23 items |
|--------|--------------|------------------------------------|
| `expert_anchored` | ~0.30 | ~0.46 |
| `partially_calibrated` (n≥50) | ~0.12 | ~0.35 |
| `empirically_calibrated` (n≥200) | ~0.06 | ~0.31 |

The CAT stopping rule (§5.1) uses `SE_statistical` (test-length control). The **results screen
reports `SE_effective`** (placement precision). Both are shown. Formula:
`assessment-item-spec.md` §3.3.

### 4.5 Test Length Is Determined by Discrimination (added)

Stated nowhere in the original specs, and it governs all pool sizing:

```
2PL at θ=b:  I = a²/4    SE = 1/√(n·a²/4)    n = 4/(a²·SE²)
```

| `a` | Items needed for SE_statistical < 0.35 |
|-----|----------------------------------------|
| 0.8 | 52 |
| 1.0 | 33 |
| **1.2** | **23** ← authoring target |
| 1.5 | 15 |
| 2.0 | 9 |

**Authoring rule: CAT-pool items target `a ≥ 1.2`.** A pool of `a≈0.8` items needs 52
administrations and breaks the 15-minute cap before the stopping rule fires.
This is also why `diagnostic-spec.md` §7.1's "22 ± 4 items" is correct — it is what `a≈1.2`
predicts; nobody had recorded why.

---

## 5. ADAPTIVE TESTING (CAT / SHADOW CAT)

### 5.1 Diagnostic Placement Test (Initial)
- **Target**: 20-30 items, 10-15 min
- **Algorithm**: Maximum Fisher Information (MFI) at current θ estimate
- **Stopping rule**: SE(θ) < 0.35 OR max items reached
- **Output**: θ̂ with 95% CE → CEFR level + skill profile

### 5.2 Shadow CAT (Continuous, Low-Stakes)
- Embedded in every lesson's formative check
- 3-5 items selected via MFI at current θ
- Updates BKT + IRT θ simultaneously
- No "test anxiety" — part of learning flow

### 5.3 Item Selection Constraints
> ⚠️ **Corrected (X6).** The original line read "max 2 items **per skill** per session". At 88
> tracked skills that caps a session at 176 items and makes a 30-item test impossible — it also
> conflicted with `diagnostic-spec.md` §3.3, which defines the constraint at *domain* granularity.
> **Granularity is domain, not skill.** Authoritative definition: `diagnostic-spec.md` §3.3.

- Content balancing: **max 2 items per domain per 5 administered** (see `diagnostic-spec.md` §3.3)
- Exposure control: Sympson-Hetter, r=0.8
- Enemy items: block pairs sharing a distractor or misconception within 3 items
- Per-skill repetition cap: **max 2 items per skill per session** — this is a *ceiling to prevent
  over-sampling one skill*, not a global cap that bounds the test length

---

## 6. SPACED REPETITION: FSRS-4.5 WITH MASTERY-AWARE SCHEDULING

> **AMENDED - the FSRS parameter vector in the original 6.1 was fabricated and is struck.**
> Verified against the `open-spaced-repetition/py-fsrs` implementation. See 6.1a for the four
> defects found and the numbers behind each.

### 6.1 FSRS Parameters

```python
# FSRS-4.5 DEFAULT_PARAMETERS - py-fsrs, open-spaced-repetition
# Verified 2026-09-30. Exactly 21 weights; order is load-bearing.
w = (0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666,
     0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542)

# Derived (must be recomputed whenever w changes)
DECAY  = -w[20]                        # 0.1542
FACTOR = 0.9 ** (1 / DECAY) - 1        # 0.9803
# Retrievability:  R(t) = (1 + FACTOR * t / S) ** DECAY
```

Configuration: `desired_retention=0.9`, `learning_steps=(1min, 10min)`,
`relearning_steps=(10min,)`, `maximum_interval=36500`, `enable_fuzzing=True`.

### 6.1a Defects found in the original vector

The struck vector was `[0.4, 0.6, 2.4, 5.8, 4.9, 0.9, ...]`. Four consequences, all verified numerically:

| # | Defect | Spec (struck) | Real FSRS-4.5 | Consequence |
|---|--------|---------------|---------------|-------------|
| **1** | `w[20]` sets `DECAY` | 1.0 gives `DECAY=-1.0` | 0.1542 gives `DECAY=-0.1542` | Forget curve is a **hyperbola, not a power law**. At `t=10S`: R=0.474 vs 0.693. Error passes 10 points beyond `t=2S` and reaches **37.6 points at t=365d**. L2 items routinely sit at 3-10x their stability, so this is the operating range, not the tail. |
| **2** | `w[0..3]` = initial stability `S0(rating)` | 0.4 / 0.6 / 2.4 / 5.8 | 0.212 / 1.293 / 2.307 / 8.296 | `S0(Hard)` off by **2.2x**, `S0(Easy)` off by **1.4x**. The Again->Hard->Good->Easy spacing is distorted, so ratings map to the wrong intervals. |
| **3** | `w[4], w[5]` = initial difficulty | `D0(Good) = 4.9 - e^1.8 + 1 = -0.150`, **clamped to 0.010** | `6.4133 - e^1.6668 + 1 = 2.118` | **`Good` and `Easy` become indistinguishable at card creation** - both clamp to the difficulty floor. A learner rating an item `Good` is recorded as having found it as easy as one rated `Easy`. |
| **4** | The vector was not FSRS-4.5 at all | 21 plausible-looking numbers | - | The count was right, which is why the error survived a visual check. **Parameter count is not evidence of correctness.** |

> **Process correction.** This vector was written from memory and never verified against an
> implementation. It had the right *arity* and plausible magnitudes, and it would have shipped.
> Every numeric constant in these specs is now sourced - see 6.1b.

### 6.1b Sourcing rule for numeric constants

| Constant | Source of truth | Rule |
|----------|-----------------|------|
| `w` vector, `DECAY`, `FACTOR` | `py-fsrs` `fsrs/scheduler.py` | copy, never recall |
| BKT `guess` / `slip` / `learn` | `pyBKT` - **`guess` is per-item**, not a global constant (see 2.1) | fit, don't assert |
| IRT `(a, b)` | `assessment-item-spec.md` 3 | Stage-1 anchored, never simulated |
| 2PL test length | derived: `n = 4 / (a^2 * SE^2)` | recompute if `a` target changes |

### 6.2 Mastery Modulation - Corrected: Modulate the Stability Prior, Not the Interval

> **AMENDED.** The original applied a post-hoc multiplier to the *interval*. That is wrong,
> and the error is directional, not just imprecise.

**The identity that makes the fix obvious.** With `desired_retention = 0.9`,

```
I = S * (0.9^(1/DECAY) - 1) / FACTOR
```

and by definition `FACTOR = 0.9^(1/DECAY) - 1`, so **`I = S` identically, for any stability** -
verified across S in {1, 3, 10, 30, 120, 365} days. The interval *is* the stability.

Therefore: **modulating S is exactly equivalent to modulating I, but internally consistent** -
because the next retrievability computation reads the same S. **Modulating I alone desynchronises
the two**, and the damage is not symmetric:

| Applied | Actual R at that interval | Target | Effect |
|---------|---------------------------|--------|--------|
| `I` (unmodulated) | 0.900 | 0.900 | correct |
| `I x 1.5` (mastery >= 0.95) | **0.870** | 0.900 | item reviewed *later* than intended |
| `I x 0.5` (mastery < 0.70) | **0.940** | 0.900 | **backwards** - a fragile item is scheduled at 94% retrievability, i.e. *less* review pressure than a mastered one |

The compress branch is the damaging one. The original rule intended to review fragile items *sooner*;
it actually reviews them *later*. The error is silent - nothing in the output flags it.

**Corrected formulation - modulate the initial-stability prior:**

```python
def stability_prior(S0: float, p_mastery: float, p_prior: float = 0.15,
                    lam: float = 0.25) -> float:
    """Modulate initial stability by the mastery posterior (log-odds shift from the prior)."""
    lp  = math.log(p_mastery / (1 - p_mastery))
    lp0 = math.log(p_prior / (1 - p_prior))
    factor = 1.0 + lam * (lp - lp0)
    return S0 * min(2.0, max(0.5, factor))
```

| P(mastery) | factor | S0(Good)=2.3065 | interval `I = S` (days) | Struck rule would give |
|-------------|--------|-----------------|------------------------|-----------------------|
| 0.05 | 0.70 | 1.61 | 1.6 | 5 (x0.5) |
| 0.15 (prior) | 1.00 | 2.31 | 2.3 | 5 (x0.5) |
| 0.40 | 1.33 | 3.07 | 3.1 | 5 (x0.5) |
| 0.70 | 1.65 | 3.80 | 3.8 | 10 (x1.0) |
| 0.85 | 1.87 | 4.31 | 4.3 | 10 (x1.0) |
| 0.95 | 2.00 (capped) | 4.61 | 4.6 | 15 (x1.5) |
| 0.99 | 2.00 (capped) | 4.61 | 4.6 | 15 (x1.5) |

Properties: smooth and monotone in `P(mastery)` (no cliffs at the old 0.70 / 0.95 thresholds);
bounded to [0.5x, 2.0x]; and because `I = S` after modulation, **the retrievability invariant holds
at every point** - R = 0.900 at the scheduled interval, so the curve stays a valid power law.

The 2.0x cap binds at P >= 0.95, making 0.95 and 0.99 indistinguishable. That is intentional, not an
oversight: once `P(mastery) >= 0.95` **and** the CI gate is met, the item is graduated out of L2 by
`post-lesson-practice-spec.md` rather than scheduled ever further out.

### 6.2a Training Threshold and Weight Sharing

`compute_optimal_parameters` returns `DEFAULT_PARAMETERS` **unchanged below 512 Review-state
reviews**. This is a hard implementation threshold, not guidance.

| Scope | Reviews needed | Reachable at the 200-user pilot? |
|-------|----------------|---------------------------------|
| Pooled, single global `w` | 512 | **Yes** - after ~23 users x 23 items |
| Per-skill `w` across 88 skills | 88 x 512 = **45,056** | **No** - 10x the entire pilot budget of ~4,600 |

**Decision: one global `w` vector, refit once when the pooled 512 threshold is crossed.** Per-skill
FSRS is arithmetically out of reach at MVP. This resolves the 6.1 comment "to be optimized per
population", which implied per-skill fitting and so was unachievable as written.

### 6.2b Sub-Daily Spacing Is Invisible to FSRS - Design Constraint

`py-fsrs` computes `elapsed_days = (now - last_review).days` - **integer truncation to whole days**.
Consequence, verified:

| Elapsed | `elapsed_days` | R(S=10) |
|---------|----------------|---------|
| 2h, 6h, 11h, 20h, 23h | 0 | **1.000** |
| 24h, 30h | 1 | 0.986 |

**Any review scheduled less than 24h after the previous one registers R = 1.000 regardless of the
schedule.** Intra-day spacing is not merely imprecise - it is unobservable to the model, so the
scheduler receives no signal that the interval was short.

**Design constraint (binding on all layers):**

- **L2 spaced review operates at day granularity only.** Minimum interval 1 day.
- **Intra-day spacing is handled outside FSRS**, by the lesson engine: the 15-minute lesson already
  contains Input -> Practice -> Output -> Shadow CAT with embedded MFI, which is where sub-hour
  review of a just-taught item belongs.
- The `learning_steps = (1min, 10min)` default is retained for same-session repeats inside a lesson,
  where `R = 1.0` is the *correct* answer because nothing has been forgotten yet.
- Do **not** schedule a 4-hour "same-day L2 review". Under this implementation it is a no-op that
  the model cannot see, and it will surface as a mysterious recall failure the scheduler never
  predicted.

### 6.3 Retrieval Practice Design
| Review Type | Probability Trigger | Activity |
|-------------|---------------------|----------|
| **Recognition** | P(forget) > 0.15 | MCQ / matching |
| **Recall** | P(forget) > 0.10 | Cloze / spoken production |
| **Transfer** | P(mastery) > 0.85 | Novel context application |
| **Interleaving** | Always 20% of review | Mix 2-3 skills |

---

## 7. PREDICTIVE ANALYTICS (Learner-Facing)

### 7.1 Time-to-Mastery Estimate
```
E[T_mastery | current_state] = Σ_s (1 - P(mastery_s)) * median_time_per_skill_s
```
Survival analysis (Kaplan-Meier) on historical cohorts for calibration.

### 7.2 CEFR Progression Forecast
```
P(reach B1 by week 12 | current θ, study_pattern) = 
    Φ((θ_B1 - θ_current - μ_vel * 12) / (σ_vel * √12))
```
Where μ_vel, σ_vel = population velocity params (θ/week).

### 7.3 Risk Indicators (Dashboard)
| Metric | Threshold | Action |
|--------|-----------|--------|
| **Stagnation** | Δθ/week < 0.05 for 3 weeks | Content difficulty audit, motivation check |
| **High Slip Rate** | P(S) > 0.20 on known skills | Fatigue? Anxiety? Change modality |
| **Guessing Spike** | P(G) > 0.35 on new items | Reduce cognitive load, more scaffolding |
| **Avoidance** | Skip rate > 30% on speaking | Affective filter intervention |

---

## 8. A/B TESTING FRAMEWORK (Pedagogical Experiments)

### 8.1 Experiment Schema
```json
{
  "experiment_id": "exp_pronunciation_feedback_timing",
  "hypothesis": "Immediate ASR feedback improves TH mastery vs. delayed summary",
  "variants": [
    {"name": "immediate", "weight": 0.5, "config": {"feedback_delay_ms": 0}},
    {"name": "delayed", "weight": 0.5, "config": {"feedback_delay_ms": 30000}}
  ],
  "primary_metric": "P(mastery_th_voiced ≥ 0.85 at day 7)",
  "secondary_metrics": ["engagement", "affective_self_report", "time_on_task"],
  "min_sample_per_variant": 200,
  "max_duration_days": 21,
  "stopping_rule": "Bayesian posterior P(δ > 0) > 0.95 OR futility P(δ > 0.02) < 0.1"
}
```

### 8.2 Assignment
- **Stratified randomization**: by CEFR level, tech background, study time
- **Consistent assignment**: user → variant via hash(user_id + exp_id)
- **Opt-out**: always available, logged

---

## 9. DATA PIPELINE FOR STATISTICAL VALIDATION

### 9.1 Event Log Schema (Append-Only)
```json
{
  "event_id": "uuid",
  "timestamp": "ISO8601",
  "user_id": "hash",
  "session_id": "uuid",
  "lesson_id": "les_a2_greetings_intro",
  "event_type": "item_response",
  "item_id": "gram_present_simple_be_001",
  "skill_ids": ["present_simple_be"],
  "response": "is",
  "correct": true,
  "response_time_ms": 3400,
  "modality": "text",
  "bkt_state_before": {"p_know": 0.32, "p_learn": 0.25, "p_slip": 0.10, "p_guess": 0.20},
  "bkt_state_after": {"p_know": 0.48, "p_learn": 0.25, "p_slip": 0.10, "p_guess": 0.20},
  "irt_theta_before": -0.8,
  "irt_theta_after": -0.65,
  "fsrs_state": {"stability": 2.1, "difficulty": 4.3, "due_date": "2026-10-05"}
}
```

### 9.2 Nightly Batch Jobs
| Job | Output |
|-----|--------|
| **BKT Refit** | Updated P(L₀), P(T), P(S), P(G) per skill (hierarchical Bayes) |
| **IRT Recalibration** | Updated (a,b) for items with >50 new responses |
| **FSRS Optimization** | Gradient descent on w params (minimize log-loss) |
| **Velocity Estimation** | μ_vel, σ_vel per CEFR band per cohort |
| **Model Drift Alert** | KL divergence > threshold on mastery distributions |

---

## 10. IMPLEMENTATION PRIORITY (MVP → Full)

| Phase | Components | Effort | Dependencies |
|-------|------------|--------|--------------|
| **MVP (Week 1-2)** | BKT per skill (fixed params), hard τ=0.85, FSRS default w | 2 dev-weeks | Item bank (**120 items, Stage-1 anchored**), lesson events |
| **V1 (Week 3-4)** | IRT 2PL calibration (offline), Shadow CAT, CI-based gates | 3 dev-weeks | 120 items with n≥50 responses; ~150 reach n≥200 |
| **V2 (Week 5-8)** | Hierarchical BKT, predictive forecasts, A/B framework | 4 dev-weeks | 500+ items, 1000+ users |
| **V3 (Ongoing)** | DIF analysis, non-parametric IRT, deep learning KT (DKT/SAKT) | Research | Large scale data |

---

## 11. INTEGRATION POINTS WITH EXISTING SPECS

| Existing Spec | Statistical Layer Addition |
|---------------|---------------------------|
| `diagnostic-spec.md` | CAT algorithm, IRT θ̂ output, SE stopping rule |
| `curriculum-graph-spec.md` | Probabilistic prerequisite satisfaction (P(all pre-reqs) ≥ τ) |
| `post-lesson-practice-spec.md` | FSRS + mastery modulation, retrieval practice types |
| `assessment-item-spec.md` | **Authoritative** for: item schema, calibration protocol, distractor taxonomy, DIF, lifecycle, bank sizing |
| `lesson-15min-workplace-greetings.md` | Replace "5.5/7.5" with P(mastery\|D) ≥ 0.85 + CI |

---

## 12. VALIDATION METRICS (Model Quality)

| Metric | Target | Method |
|--------|--------|--------|
| **BKT AUC (next response)** | > 0.75 | Temporal cross-validation |
| **IRT θ reliability (EAP)** | > 0.85 | Marginal reliability |
| **FSRS log-loss** | < 0.45 | Next-review prediction |
| **Mastery calibration** | abs(P(mastery) − empirical) < 0.05 | Binned calibration plot |
| **Forecast MAE (weeks to B1)** | < 2.0 weeks | Rolling origin evaluation |

---

*This spec transforms "≥80% correct" into a statistically principled, adaptive, and auditable progress engine. All components feed the Pedagogical Memory (AGENTS.md #9) for coherent learner modeling.*