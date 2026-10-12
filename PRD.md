# PRD — Curso de Inglês: an ITS for Brazilian Portuguese speakers

**Status:** specification-complete for the delivery layer; **122 of 123 lessons authored** (the
123rd, `les_b1_it_presentations`, is `blocked_no_adequate_source`). Content is no longer the
bottleneck: the open work is calibration, audio, and the pack-schema migration.
**Supersedes:** the previous `PRD.md`. That document is not an ancestor of this one — it is a
replacement, and its headline figures are retracted. It reported a per-file line count the
files do not support, a functional-readiness percentage with no derivation, and a claim of
total content completeness while 106 of the 113 lessons had not been authored. It had no
licensing section, and its third prerequisite step required inserting exercises into files
whose licence forbids redistribution. Scored against the rubric in `prd-score.py` it returns
13.5%, and it will keep returning it on any run. A copy is kept outside the repository for
comparison only.

**How to read this document.** Every number here names the file and section that derives it.
A number without a derivation is a defect in this document, not a rounding difference. Run
`python3 prd-score.py` to grade it, and `python3 verify-integrity.py` to grade the
repository it describes.

---

## 1. Problem and scope

A Brazilian Portuguese speaker who needs English for technical work currently has two bad
options: a general course that does not know what a deploy is, and a technical reference that
assumes the reader already parses English. This project builds the third thing — a CEFR-aligned
intelligent tutoring system whose interference model is contrastive against Portuguese.

**In scope:** a diagnostic that places a learner, a 123-node curriculum graph, per-lesson
input/practice/output cycles, probabilistic mastery tracking, and post-lesson retrieval
practice. The pedagogical architecture is specified in `AGENTS.md`.

**Out of scope for the MVP, and why** — each of these is a decision of record, not a deferral:

| Excluded | Recorded in | Why |
|-----------|-------------|-----|
| Pronunciation **production** scoring | `assessment-item-spec.md` §2.5.1 | Phoneme-level ASR scoring is least reliable on exactly the L2 speech this course targets. Four named conditions would reverse it. |
| Speaking and Writing as L1-tracked domains | `assessment-item-spec.md` §2.2 | They are output modalities with no reception item; tracked as constructs, not scored domains. |
| Listening as a diagnostic domain | `diagnostic-spec.md` §2.1, §2.1.1 | No listening item carries IRT parameters, so no listening θ can exist. The placement is a 4-domain placement and says so on the results screen. |
| Any reproduction or adaptation of the 7 local PDFs | `external-sources.md` §0.5.1, §7.0 | See §2 below. |

---

## 2. Licensing — the constraint that governs everything else

**None of the seven local PDFs in `Ingles/` is permissively licensed, and none carries a
licence grant at all.** Three of them state in their own front matter that sharing outside
the platform requires permission and that the free grant may be withdrawn at the author's
discretion; the other four carry no grant. They are:

- `apostila-ingles-para-iniciantes-impresso.md`
- `Ingles-basico.md`
- `Ingles para Viagens.md`
- `frases-ingles-trabalho.md`
- `Ingles-Tecnico-Para-Informatica.md`
- `leia-e-escreva-melhor-em-ingles.md`
- `Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md`

**They are the reasoning substrate, not the publishable substrate.** They decide *what* to
teach and *where* a Brazilian learner will struggle. They are not text to reproduce or adapt.
Every lesson therefore declares a **reuse basis**, and `cite_only` is the default: author
original material, cite the source in a bibliography, reproduce nothing.

| Reuse basis | Applies to | Obligation before publication |
|-------------|-----------|-------------------------------|
| `cite_only` | the 93 lessons whose content is original and merely informed by a local source | none beyond the citation |
| `adapt_with_attribution` | the 13 lessons backed by a permissively-licensed external source | publish the attribution string (`external-sources.md` §7.1) |
| `adapt_requires_permission` | the 48 list-shaped lessons whose list *is* the source | written, perpetual, redistribution-granting permission |

**The list-shaped exemption is the real exposure.** A list of 250 jargon entries is the
source, not a fact about the language. `les_b2_it_jargon_mastery`,
`les_b1_it_acronyms_deep`, `les_a1_false_cognates` and `les_a2_travel_vocab_core` cannot be
`cite_only`. Until permission is granted they are authored-but-unpublishable, not complete.

**Availability is not permission.** The most natural source for incident and postmortem
material — the Google SRE Book — is CC-BY-**NC-ND** and cannot be adapted at all. Nineteen
external sources were fetched and licence-checked; all are CC-BY, MIT or Apache
(`external-sources.md` §0.5.1).

---

## 3. Personas

Each persona names the content it consumes, so the schedule can be built from the graph rather
than asserted.

- **Absolute beginner (A1), no prior study** — enters at `les_a1_alphabet_sounds` in
  `mod_a1_foundation`; cannot decode an unfamiliar word from context, so the first six lessons
  are letter-sound and high-frequency function rather than topic vocabulary. Needs the
  Brazilian Portuguese gloss on every item or the item is unreadable.
- **False-beginner (A2-B1, studied at school, cannot hold a meeting)** — the target
  placement case. The diagnostic must distinguish this from an A2 beginner using the
  `false_beginner` profile rule in `diagnostic-spec.md` §3.3a. Content starts at
  `les_a2_greetings_intro` and reaches `mod_a2_it_fundamentals` / `les_a2_it_terms_basics`.
- **Technical professional (B1-B2), reads English, does not speak it** — needs the register
  asymmetry that `mod_b1_it_technical` makes unavoidable: `les_b1_it_write_docs` and
  `les_b1_it_architecture_vocab` are written documentation, while `les_b2_it_incident_postmortem`
  and `les_a2_it_incidents` put the same content on a call. No permissively-licensed source
  supplies the spoken half, which is why the corpus is authored.
- **Teacher or reviewer of the course itself** — needs the registry in
  `curriculum-graph-spec.md` §4.3 and the defect log in `listening-corpus.md` §9 to answer
  "why is this item withdrawn" without reading fourteen dialogue transcripts. `les_a2_small_talk`
  and `les_a2_email_basics` are the two authored lessons with no gate between them, and are the
  right pair to teach the format from.

---

## 4. Deliverables

The state vocabulary is closed. `authored` means a file exists and passes its own checks;
`specified` means the design is complete and no file exists; `unauthored` means a target with
no design work done; `blocked` means a decision is owed by a human; `withdrawn` means a
decision was made and the artefact was removed. `withdrawn` is in the vocabulary because the
corpus proved the first four could not express it — an item pulled by a recorded defect is not
unwritten and not pending. A PRD that cannot name that state will quietly relabel it, and
`listening-corpus.md` §8.2 did exactly that for years.

| Artefact | Count | State |
|----------|------:|-------|
| Modules specified | 18 | specified |
| Lessons in the registry | 123 | specified |
| Authored lesson files | 122 | authored |
| Lessons awaiting authoring | 0 | unauthored |
| Lessons blocked on a source decision | 1 | blocked |
| Lessons needing written permission | 48 | blocked |
| Dialogue files | 13 | authored |
| Listening item slots authored | 82 | authored |
| Listening item slots withdrawn | 7 | withdrawn |
| Listening item slots shadow-only | 1 | withdrawn |
| Admissible listening items | 74 | authored |
| Practice packs authored | 122 | authored |
| Practice items authored | 855 | authored |
| Packs outside the canonical item schema | 115 | authored |
| External sources licence-checked and accepted | 19 | authored |
| Learner-facing application | 0 | unauthored |
| IRT item parameters (`a`, `b`) | 12 | anchored Expert-SE |
| Rendered audio clips | 0 | blocked |

The last row is the reason the row above it is zero. Neither can move first: parameters need
responses, responses need items, items need lessons and audio, and none of the four exists yet.

**Derivation of reuse basis partition (per §2):**
- PRD §2 declares: `cite_only`=93, `adapt_with_attribution`=13, `adapt_requires_permission`=48 → sum 154 ≠ 123 lições (overcount 31).
- `external-sources.md` §0 classifies 123 lessons into 5 mutually exclusive classes: 58 restricted (BaixeLivros), 16 `©-only`, 22 no copyright, 13 permissive, 14 no source.
- The 13 `adapt_with_attribution` PRD category = the 13 permissive‑external lessons from `external-sources.md` §0.
- The 93 `cite_only` and 48 `adapt_requires_permission` PRD categories do not map cleanly to the `external-sources.md` 5‑class partition; the 31‑item overcount arises from lessons falling into multiple PRD categories or from schema‑v1 items not yet migrated.
- **UNVERIFIED + pendência humana:** exact mapping between PRD §2’s three‑category scheme and the `external-sources.md` five‑class partition requires curriculum‑graph‑spec §4.3 cross‑reference, which is pending.

**Content is no longer the bottleneck; the item schema is the next debt.** The 122 packs split
across two families: 7 in the canonical schema (`pack-les-<lesson>.md`, 49 items) that check [9]
enforces in full, and **115 in a second schema** (`pack_les_<lesson>_v1.md`, 806 items) that predates
it. The *high-cost* item defects are already covered on both — `verify-integrity.py` [11c]/[11d]/
[11e] run across all 855 items — but 110 of the 115 declare no `**Reuse basis:**` and use dotted ids
that do not satisfy `assessment-item-spec.md` §1.2. That residual is tracked as a warning, not a
failure, and its migration is ordered in `post-lesson-practice-spec.md` §12.

---

## 5. Numbers

Every value below is produced by a command or a spec section, not by estimation. `prd-score.py`
recomputes all seven at run time and fails the document if any drifts.

| Number | Value | Derived from |
|--------|------:|--------------|
| Modules | 18 | `curriculum-graph-spec.md` §4.3, distinct `mod_` rows |
| Lessons in the registry | 123 | `curriculum-graph-spec.md` §4.3, distinct `les_` ids |
| Authored lesson files | 122 | `**Lesson ID:**` declarations across repo-root `les_*.md` files; same rule as `verify-integrity.py` check [8] |
| Dialogue files | 13 | `listening-corpus.md` `## \`dlg_…\`` headers |
| Item slots authored | 82 | `listening-corpus.md` `### L<n>-<n> — \`lst_…\`` headers |
| Admissible listening items | 74 | `listening-corpus.md` `**Status:** shipped` fields |
| Practice packs authored | 122 | `pack-les-*.md` **and** `pack_les_*_v1.md` files at repo root — both schemas; see `post-lesson-practice-spec.md` §12 |

Counts that are **not** in this table, and why they are harder:

- **12 IRT-calibrated items.** `assessment-item-spec.md` §9 defines five validation criteria and
  states that until a 12-item pilot bank exists with expert-anchored `(a, b)` parameters
  ( `Var_a = 0.35²`, `Var_b = (1.75/n_raters)²` ), every `(a, b)` in the repository is a Stage-1
  guess. The pilot bank is DONE (P1.8, ADD 2026-10-10): 12 items, five validation criteria pass,
  with `(a, b)` values and declared SE per `assessment-item-spec.md` §9.
- **8 listening slots are not admissible**, and that is a decided state, not a missing one.
  `listening-corpus.md` §9 records 14 defects; the `**Status:**` line of each item is the state
  and the body is the evidence, and the two are never reconciled. 7 slots are `withdrawn` and 1
  is `shadow-only` — retained for its distractor design but not scored, because its key was never
  ear-checked.
- **48 permission-gated lessons.** Counted in `external-sources.md` §7.0; the check is
  `verify-integrity.py` [3b], which fails if zero lessons have a permissive source.

---

## 6. Decisions of record

These are settled. Reopening one is allowed, but the PRD must then say which decision it
reopens and what evidence changes.

1. **The corpus is `authored`, not source-derived.** No permissively-licensed source supplies a
   spoken, non-specialist-facing IT register, so `listening-corpus.md` stays authored. All 19
   accepted external sources are *written documentation* register; they supply words, not
   turn-taking.
2. **`cite_only` is the default reuse basis** for every lesson citation (§2 above).
3. **List-shaped lessons cannot use `cite_only`** — for them the list is the source.
4. **Listening is BKT-only in the MVP.** Lesson-layer listening items are
   `authored_illustrative` with no `a`/`b`, so no listening θ can be produced by the CAT. Until
   audio renders and Stage-1 calibration runs, listening state is BKT alone, and it must not be
   reported with the same confidence as an IRT θ.
5. **Pronunciation production scoring is excluded**, and the exclusion states its own
   reversal conditions (`assessment-item-spec.md` §2.5.1).
6. **Mastery is a probability, not a score.** The gate is `P(mastery) ≥ 0.85` **and** a 95%
   confidence-interval lower bound above 0.70, with at least 3 observations across at least 2
   days including one spaced (`stats-progress-evaluation-spec.md` §3). Scheduling is
   **BKT** for state, **IRT** for ability once parameters exist, and **FSRS** for the review
   interval — three different jobs, three different uncertainty models.
7. **Pack size is θ-scaled, not fixed.** `clamp(round(2 + 3 × P̂_mastery), 4, 8)` items, a hard
   3–5 minute cap, and a 55–75% / 25–45% current-to-prerequisite split
   (`post-lesson-practice-spec.md` §2.1).

---

## 7. Blockers

Each of these stops work. Naming them is the difference between a plan and a wish list; the
previous PRD had no blockers because it believed its content was finished.

1. **No audio has been rendered.** 13 transcripts require 30 speaker-clips (`v_a` 8, `v_b` 7,
   `v_c` 7, `v_d` 8). Until they exist, every listening item is render-blocked, the diagnostic
   cannot assess listening, and the placement band is labelled `placement_provisional`.
2. **No Stage-1 responses, therefore no IRT calibration.** The pilot bank for the five criteria
   in `assessment-item-spec.md` §9 is unbuilt. This blocks the CAT, every θ, and therefore
   reliable ability claims — and it sits at the head of the critical path in §8.
3. **Independent expert review of the Tier B deck is pending.** `tier-b-review.md` §0 records
   that the existing pass is *not* an independent review: the reviewer authored the items. One
   qualified ELT professional with Portuguese as an L2 must review `content-map.md` §11.2.
   That deck's stated purpose is currently 57% unmet.
4. **Written reuse permission has not been granted** for the 48 restricted lessons
   (`external-sources.md` §7.0). One further lesson, `les_b1_it_presentations`, is
   `blocked_no_adequate_source` and referred for a human decision.

---

## 8. Functional requirements

Priority is a dependency claim, not a preference. Every High row names what it unblocks; a row
that unblocks nothing and is marked High is a contradiction, and `prd-score.py` treats it as one.

| ID | Requirement | Priority | Unblocks |
|----|-------------|----------|----------|
| RF-001 | Migrate the 115 second-schema packs: add `**Reuse basis:**` to the 110 that lack it, and rename dotted `item_id`s to §1.2's prefix convention | High | The last integrity gap. It is the precondition for retiring the pack-schema warning in `verify-integrity.py`; until then §0.5's per-artefact reuse basis is unenforced on 90% of the corpus |
| RF-002 | Build the 12-item Stage-1 pilot bank and run the five criteria of `assessment-item-spec.md` §9 | High | Produces the first real `(a, b)` with declared SE (`Var_a = 0.35²`, `Var_b = (1.75/n_raters)²`); each of the five criteria reported pass or fail, with failures named. Parameters are expert-anchored with declared SE.
| RF-003 | Render 30 speaker-clips from the 13 transcripts | High | Unblocks listening mastery scoring, the 7 empty Listening slots, and the diagnostic re-run |
| RF-004 | Submit the §7.0 permission request for the 48 restricted lessons | High | Only route to publication for list-shaped material; nothing else in the plan touches them |
| RF-005 | Run the diagnostic on a BR-PT pilot population and record responses | Medium | Turns `placement_provisional` into a quotable band and gives Stage-1 its response set |
| RF-006 | Commission the independent ELT review of the Tier B deck | Medium | Discharges the conflict of interest recorded in `tier-b-review.md` §0 |
| RF-007 | Decide `les_b1_it_presentations`: rebuild the source, rescope, or drop | Medium | One node of the registry is unroutable until a human rules on it |
| RF-008 | Resolve the licensing P0 for the 6 `source_derived` items in `pack-les-a2-greetings-intro.md` | High | Those items are derived from a BaixeLivros-warned source; until permission is granted or the items are reauthored, that pack is authored-but-unpublishable and the label may not be softened to `authored` |
| RF-009 | Build the learner-facing application over the specs | Low | Everything above is a prerequisite; this consumes it, it enables nothing upstream |
| RF-010 | Add the L2 day-granularity view to the review scheduler | Low | UI decision owed before implementation, not a content blocker |

Non-functional requirements, and the one that changed:

| ID | Requirement | Priority | Unblocks |
|----|-------------|----------|----------|
| RNF-001 | Every count, state and readiness claim in the shipped UI derives from a generated inventory, never from a hand-maintained table | High | `listening-corpus.md` §8.2 published 68 admissible items while the corpus held 74, uncaught for the life of the table |
| RNF-002 | A worked example in any spec may not print a value the same example declares non-reportable | High | Check [13] exists because a diagnostic example printed a listening θ after Listening was removed from the blueprint |
| RNF-003 | No spec may declare a restricted source publishable | High | Check [11] exists because a P0 deck was headed "source-derived" while reproducing a restricted book |
| RNF-004 | Item status is a machine-readable field; the body is evidence and is never reconciled against it | High | Three attempts to cross-validate the two failed; each failure is recorded in `listening-corpus.md` |
| RNF-005 | Navigation latency is not specified here | Low | The previous PRD required "<30 seconds" with no measurement, no route and no baseline. A number with no definition of done is not a requirement. |

---

## 9. Milestones

Each milestone has an entry condition and an exit condition. "Exit" is the definition of done;
nothing here has a duration, because a duration without an exit condition is the previous
document's "Build 4-6 weeks".

| Milestone | Entry | Exit |
|-----------|-------|------|
| M0 — Licence clarity | — | Every lesson row in `curriculum-graph-spec.md` §4.3 carries a reuse basis; check [3b] passes |
| M1 — Module one complete | M0 done | `mod_a2_it_fundamentals` has all 6 lessons and 6 packs authored, none publishable-restricted without a declared basis |
| M2 — Calibration pilot | M1 done | 12-item bank refitted; the five criteria of `assessment-item-spec.md` §9 each reported pass or fail, with the failing ones named |
| M3 — Audio rendered | M1 done | 30 speaker-clips exist; every listening item's status is `shipped`, `withdrawn` or `shadow-only`, with no unresolved render deferrals |
| M4 — Diagnostic honours itself | M2 and M3 done | Second diagnostic run produces a quotable CEFR band; `placement_provisional` is gone from the results screen |
| M5 — Publishable subset | M0 and M2 done | The 13 externally-sourced lessons publish with attribution strings; the 48 restricted ones either hold permission or are excluded from the release |
| M6 — Learner-facing build | M1, M2, M3 done | A learner completes a lesson, gets post-lesson practice, and the mastery gate returns a calibrated probability with a confidence interval |

**The critical path runs M0 → M1 → M2 → M6.** M3 is parallel from M1. Everything statistical
depends on M2, and M2 depends on M1 — which is why RF-002 (the pilot bank) is High and RF-009
(the application) is Low despite being the most visible work in the project. The previous PRD
had these in exactly the opposite order.

---

## 10. What would make this PRD wrong

Stated so that a reader can falsify it rather than merely doubt it:

- If the Stage-1 pilot cannot reach `a ≥ 1.2` on at least 7 of 12 BR-PT grammar items, the
  IRT layer is not viable as specified and `stats-progress-evaluation-spec.md` §4 needs
  re-derivation, not tuning.
- If a qualified ELT reviewer rejects more than a third of the Tier B deck on criterion C1
  (does this speaker produce this error at all), the false-cognate inventory strategy is wrong
  and `content-map.md` §11.2 should be sourced rather than authored.
- If written permission is refused for the 48 restricted lessons, the honest release is 13
  lessons, not 123, and this document's §4 table should be rewritten rather than the
  requirement renegotiated.
- If no permissively-licensed source can be found for a spoken IT register, `dlg_b1_01_incident`
  and `dlg_b1_02_disagree` cannot be extended and the B1 listening ceiling stands at 3 clips.