# ITS Platform — Product Backlog

**Source:** `Curso-de-Ingles/PRD.md` §9 Milestones, `ITS-ARCHITECTURE.md` §10
**Format:** User Stories + Technical Tasks
**Prioritization:** MoSCoW (Must/Should/Could/Won't) + WSJF
**Tool:** GitHub Projects / Linear (sync from this file)

---

## Legend

| Prefix | Type | SLA |
|---|---|---|
| **M** | Milestone deliverable | Per PRD §9 |
| **E** | Epic (multi-sprint) | — |
| **S** | Story (1-3 days) | — |
| **T** | Technical task (hours) | — |
| **B** | Bug | P1: 24h, P2: 72h, P3: 1 sprint |

---

## M1: Content Pipeline (Foundation)

| ID | Title | Type | Priority | Est. | Dependencies | Acceptance Criteria |
|---|---|---|---|---|---|---|
| M1.1 | Content submodule + CI | E | Must | 3d | ADR-010 | `git submodule add`; CI runs `verify-integrity.py` + contract tests |
| M1.2 | Content loader (lessons) | S | Must | 2d | M1.1 | Loads FASE 1-4 + learner_model JSON; passes `check_json` |
| M1.3 | Content loader (packs) | S | Must | 2d | M1.1 | Parses both canonical + legacy schemas; unified `PackItem` model |
| M1.4 | Content loader (listening) | S | Must | 1d | M1.1 | Filters by Status=shipped; validates Q-L2 ≥ 45s |
| M1.5 | Contract tests: content → specs | S | Must | 2d | M1.2-1.4 | 100% spec coverage; CI fails on drift |

---

## M2: Curriculum Graph Service

| ID | Title | Type | Priority | Est. | Dependencies | Acceptance Criteria |
|---|---|---|---|---|---|---|
| M2.1 | DAG loader from curriculum-graph-spec.md | S | Must | 2d | M1.1 | Loads 18 modules, 123 lessons, prerequisites; validates acyclic |
| M2.2 | Mastery gate enforcement | S | Must | 2d | M2.1, M3.1 | BKT ≥ 0.85 required for prerequisite traversal |
| M2.3 | Next-activity selector (i+1) | S | Must | 3d | M2.1, M2.2, M3.1 | Returns valid lesson/pack/review; respects prereqs, spaced review |
| M2.4 | Start-node mapping (diagnostic → curriculum) | S | Must | 2d | M2.1, M4.1 | θ → lesson mapping per diagnostic-spec.md §4 |
| M2.5 | Graph admin API (CRUD modules/lessons) | S | Should | 2d | M2.1 | Author can add/edit modules/lessons via API |

---

## M3: Adaptive Engine (BKT/IRT/FSRS)

| ID | Title | Type | Priority | Est. | Dependencies | Acceptance Criteria |
|---|---|---|---|---|---|---|
| M3.1 | BKT engine (vectorized NumPy) | S | Must | 3d | ADR-002 | `update_mastery()` vectorized; 10k updates < 50ms p95 |
| M3.2 | IRT 2PL calibration (PyMC/EM) | S | Must | 5d | ADR-002 | CAT diagnostic; θ CI95 narrows with evidence |
| M3.3 | FSRS-4.5 scheduler | S | Must | 3d | ADR-002 | `next_interval()` monotonic; stability ≥ 0 |
| M3.4 | AdaptiveEngine orchestrator | S | Must | 2d | M3.1-3.3 | Coordinates BKT/IRT/FSRS; emits events |
| M3.5 | Celery tasks (priority queues) | S | Must | 2d | ADR-005 | `update_bkt_mastery` (priority), `schedule_fsrs` (standard) |
| M3.6 | Cold-start priors per skill | S | Should | 1d | M3.1 | Population priors from curriculum graph |
| M3.7 | Model versioning + A/B framework | T | Could | 3d | M3.4 | Can swap model versions per learner cohort |

---

## M4: Diagnostic Service

| ID | Title | Type | Priority | Est. | Dependencies | Acceptance Criteria |
|---|---|---|---|---|---|---|
| M4.1 | Diagnostic blueprint executor | S | Must | 3d | M3.2, M2.4 | Administers items per diagnostic-spec.md §2; stops at SE < 0.3 |
| M4.2 | IRT θ estimation endpoint | S | Must | 2d | M3.2, M4.1 | Returns θ, SE, CI95, start_node |
| M4.3 | Placement result persistence | S | Must | 1d | M4.2 | Stores in `diagnostic_results` + `diagnostic_responses` |
| M4.4 | CAT simulation + validation | S | Should | 3d | M4.1 | Simulated learners place at expected CEFR (r ≥ 0.7) |

---

## M5: Listening Service

| ID | Title | Type | Priority | Est. | Dependencies | Acceptance Criteria |
|---|---|---|---|---|---|---|
| M5.1 | Dialogue + slots API | S | Must | 2d | M1.4 | Returns only Status=shipped; Q-L2 ≥ 45s validated |
| M5.2 | Audio streaming (signed URLs) | S | Must | 2d | M5.1, ADR-005 | 5min TTL; KMS encryption; consent check |
| M5.3 | ASR integration (pronunciation) | S | Should | 5d | M5.2 | Celery task → ASR → BKT update |
| M5.4 | Shadow CAT mode | T | Could | 2d | M5.1 | `shadow-only` items excluded from scoring |

---

## M6: Authoring Guard + Security (M6)

| ID | Title | Type | Priority | Est. | Dependencies | Acceptance Criteria |
|---|---|---|---|---|---|---|
| M6.1 | Pre-publish license check | S | Must | 2d | ADR-001, ADR-006 | Blocks `adapt_*` on restricted sources; Kong plugin |
| M6.2 | JWT auth + PKCE + refresh rotation | S | Must | 3d | ADR-001, ADR-006 | 15m access, 30d refresh, device binding |
| M6.3 | Kong rate limiting (Redis) | S | Must | 2d | ADR-006 | Per-learner 100/min; per-IP 1000/min |
| M6.4 | PostgreSQL RLS policies | S | Must | 2d | ADR-003 | All learner-scoped tables; 403 on cross-learner access |
| M6.5 | Consent management (LGPD) | S | Must | 2d | ADR-001 | Granular consents; withdrawal = data deletion |
| M6.6 | Audit log (immutable) | S | Should | 2d | ADR-003 | Hash-chained; WORM; queryable |
| M6.7 | Data export / erasure (LGPD Art. 18) | S | Should | 3d | M6.5 | `GET /me/data-export`, `DELETE /me` in < 30 days |

---

## M7: MVP Release + Operations

| ID | Title | Type | Priority | Est. | Dependencies | Acceptance Criteria |
|---|---|---|---|---|---|---|
| M7.1 | Helm chart + ArgoCD (dev/staging/prod) | S | Must | 3d | ADR-008 | `helm install`; ArgoCD auto-sync dev, manual prod |
| M7.2 | pgBackRest + DR (cross-region) | S | Must | 3d | ADR-009 | RPO < 1min, RTO < 2h; weekly restore test |
| M7.3 | Observability stack (Prom/Grafana/Loki/Tempo) | S | Must | 3d | ADR-007 | Metrics, logs, traces; SLO dashboards |
| M7.4 | Load test (1k concurrent) | S | Must | 2d | All above | p95 < 200ms; error rate < 0.1% |
| M7.5 | Security audit (OWASP ASVS L2) | S | Must | 5d | M6.1-6.4 | Zero critical/high; documented medium |
| M7.6 | Runbook + on-call rotation | S | Must | 2d | M7.3 | Runbook covers P1-P4; 4-week rotation |
| M7.7 | Documentation (API, architecture, runbook) | S | Should | 3d | All | `docs/` complete; OpenAPI examples |

---

## Technical Debt / Refactoring (Ongoing)

| ID | Title | Type | Priority | Est. | Notes |
|---|---|---|---|---|---|
| TD-001 | Legacy pack migration (115 packs) | E | Should | 20d | Per post-lesson-practice-spec.md §12 |
| TD-002 | Content submodule workflow automation | E | Could | 5d | Bot PRs, auto-merge on green |
| TD-003 | OpenTelemetry full instrumentation | E | Should | 10d | Traces, metrics, logs unified |
| TD-004 | Mutation testing in CI (adaptive engine) | T | Could | 2d | Monthly on release branches |
| TD-005 | Chaos engineering (Litmus/Gremlin) | E | Could | 10d | Pod kill, network partition, latency injection |

---

## Bugs (Template)

| ID | Title | Severity | Status | Sprint |
|---|---|---|---|---|
| B-001 | [Description] | P1/P2/P3 | Open/In Progress/Done | — |

---

## Sprint Planning (Template)

| Sprint | Goal | Stories | Capacity | Velocity |
|---|---|---|---|---|
| 1 | M1: Content Pipeline | M1.1-M1.5 | 5 devs × 10d = 50d | — |
| 2 | M2: Curriculum Graph | M2.1-M2.3 | 5 devs × 10d = 50d | — |
| 3 | M3: Adaptive Engine (BKT/FSRS) | M3.1, M3.3, M3.4, M3.5 | 5 devs × 10d = 50d | — |
| 4 | M3: Adaptive Engine (IRT) | M3.2, M3.4 | 5 devs × 10d = 50d | — |
| 5 | M4: Diagnostic | M4.1-M4.3 | 5 devs × 10d = 50d | — |
| 6 | M5: Listening + M6: Security | M5.1, M6.1-M6.4 | 5 devs × 10d = 50d | — |
| 7 | M7: MVP Release | M7.1-M7.4 | 5 devs × 10d = 50d | — |
| 8 | Hardening + M7.5-M7.7 | M7.5-M7.7 | 5 devs × 10d = 50d | — |

---

## Definition of Ready (DoR)

- [ ] Story has clear acceptance criteria
- [ ] Dependencies identified and available
- [ ] UX/UI designs done (if applicable)
- [ ] Contract tests written (for new endpoints)
- [ ] Estimated by team

## Definition of Done (DoD)

- [ ] Code complete + self-reviewed
- [ ] Unit tests pass (≥ 90% coverage for new code)
- [ ] Integration tests pass
- [ ] Contract tests pass
- [ ] BDD scenarios pass (if applicable)
- [ ] Code reviewed + approved
- [ ] Deployed to staging + smoke tested
- [ ] Documentation updated
- [ ] No P1/P2 bugs open