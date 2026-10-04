---
adr: 002
title: Hybrid BKT/IRT/FSRS for adaptive engine
status: Accepted
date: 2026-10-03
authors: [@adaptive-lead]
deciders: [@adaptive-lead, @platform-lead, @backend-lead]
consulted: [@content-lead, @psychometrician]
informed: [@team]
tags: [adaptive, bkt, irt, fsrs, psychometrics]
---

## Context

The ITS Platform needs an adaptive learning engine that:
- **Tracks mastery per skill** — probabilistic, updates per response (BKT)
- **Estimates ability (θ) per skill** — IRT for CAT diagnostic and cross-skill comparison
- **Schedules spaced review** — FSRS for long-term retention
- **Feeds curriculum graph** — mastery gates prerequisite traversal
- **Supports 10k+ concurrent learners** — low-latency updates

Spec source: `Curso-de-Ingles/specs/stats-progress-evaluation-spec.md` §2–4

## Decision

**Implement a hybrid adaptive engine with three coordinated models:**

| Model | Purpose | Input | Output | Update Frequency |
|---|---|---|---|---|
| **BKT (Bayesian Knowledge Tracing)** | Per-skill mastery tracking | Binary correctness per item | `P(mastery) ∈ [0,1]` | Every practice item |
| **IRT (2PL/3PL)** | Ability estimation (θ) for CAT | Response patterns across items | `θ ∈ ℝ`, `SE(θ)`, `CI95` | Diagnostic + periodic recalibration |
| **FSRS (Free Spaced Repetition Scheduler)** | Review scheduling | History of (item, interval, grade) | Next review date, stability, difficulty | Every practice item |

**Integration:**
- BKT is the **source of truth for mastery gates** (≥ 0.85 unlocks prerequisites)
- IRT θ provides **diagnostic placement** and **cross-skill comparability**
- FSRS drives **spaced review queue** per learner per item

## Consequences

### Positive
- **Each model does what it's best at** — no single model solves all three problems
- **Spec-aligned** — directly implements `stats-progress-evaluation-spec.md`
- **Modular** — can swap/update one model without breaking others
- **Evidence-based** — BKT (Corbett & Anderson 1994), IRT (Lord & Novick 1968), FSRS (Open Spaced Repetition)

### Negative
- **Complexity** — three models to implement, test, monitor
- **Parameter estimation** — needs historical data for priors (cold start problem)
- **Consistency** — BKT mastery and IRT θ may disagree; need reconciliation policy
- **Compute** — IRT calibration (MCMC/EM) is CPU-intensive; must be async

### Neutral
- **Cold start** — new learners get population priors until evidence accumulates
- **Model versioning** — must track which model version produced each estimate

## Alternatives Considered

1. **BKT only** — Simple but no θ for CAT, no spacing algorithm
2. **IRT only** — Good for CAT but no real-time mastery updates, no spacing
3. **FSRS only** — Good for spacing but no skill-level mastery, no θ
4. **Deep Knowledge Tracing (DKT)** — Neural, but black-box; hard to debug/explain; overkill for 123 lessons
5. **Single unified model** — No published model does all three well

## Implementation Plan

- [x] Define Pydantic models for BKT/IRT/FSRS state per `stats-progress-evaluation-spec.md`
- [ ] Implement BKT update (vectorized NumPy) — `adaptive/engine/bkt.py`
- [ ] Implement IRT 2PL calibration (PyMC / custom EM) — `adaptive/engine/irt.py`
- [ ] Implement FSRS-4.5 (port from open-spaced-repetition) — `adaptive/engine/fsrs.py`
- [ ] Create `AdaptiveEngine` orchestrator — coordinates three models
- [ ] Add Celery tasks: `update_bkt`, `recalibrate_irt`, `schedule_fsrs`
- [ ] Contract tests: BKT bounds [0,1], IRT CI95 narrows, FSRS intervals monotonic
- [ ] Load test: 1000 concurrent BKT updates < 50ms p95
- [ ] Document cold-start priors per skill (from curriculum graph)

## Consequences for Curriculum Graph

- **Mastery gate** = `BKT.mastery >= 0.85` (per `curriculum-graph-spec.md` §1.1)
- **Diagnostic placement** = IRT θ → start node mapping (per `diagnostic-spec.md` §4)
- **Spaced review** = FSRS queue → `NextActivity` type `review` (per `api-spec.openapi.yaml`)

## References

- `stats-progress-evaluation-spec.md` §2–4 — Parameter specs, update formulas
- `curriculum-graph-spec.md` §1.1 — Mastery gate definition
- `diagnostic-spec.md` §3 — IRT-based CAT blueprint
- Corbett & Anderson (1994) — BKT original
- Lord & Novick (1968) — IRT foundation
- Open Spaced Repetition / FSRS — https://github.com/open-spaced-repetition