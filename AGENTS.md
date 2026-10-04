# AGENTS.md — Curso de Inglês

This repository contains an English course built from markdown content extracted from PDF source materials.

## Repository Structure

```
Curso-de-Ingles/
├── AGENTS.md                    # This file
└── Ingles/
    ├── *.pdf                    # Original source PDFs (7 files)
    └── output/
        └── *.md                 # Converted markdown content (7 files)
```

## Source Materials (in `Ingles/output/`)

| File | Description |
|------|-------------|
| `apostila-ingles-para-iniciantes-impresso.md` | Beginner module (alphabet, greetings, grammar basics, vocabulary) |
| `Ingles-basico.md` | Basic English course by Tiago Cabral Rodrigues |
| `Ingles para Viagens.md` | Travel English phrases and vocabulary |
| `frases-ingles-trabalho.md` | Workplace/professional English phrases |
| `Ingles-Tecnico-Para-Informatica.md` | Technical English for IT/computing |
| `leia-e-escreva-melhor-em-ingles.md` | Reading and writing improvement |
| `Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md` | Professional acronyms and terms dictionary |

## Working with This Repo

### Content Location
All course content is in `Ingles/output/*.md`. The PDFs in `Ingles/` are the original sources.

### Converting More PDFs
If adding new PDF sources, use a PDF-to-markdown tool (e.g., `pymupdf4llm`, `marker`, or `pdfplumber`) and place output in `Ingles/output/`.

### Course Organization Ideas
The content spans multiple levels/topics:
- **Beginner**: `apostila-ingles-para-iniciantes-impresso.md`, `Ingles-basico.md`
- **Situational**: `Ingles para Viagens.md`, `frases-ingles-trabalho.md`
- **Technical**: `Ingles-Tecnico-Para-Informatica.md`
- **Skills**: `leia-e-escreva-melhor-em-ingles.md`
- **Reference**: `Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md`

Consider organizing into a structured curriculum (modules → lessons → exercises) if building a course platform.

## No Build/Test Commands
This is a content-only repository. No build, test, lint, or typecheck steps exist.

There is one integrity check, and it is not a build:

```
python3 verify-integrity.py     # exits 1 on any FAIL
```

It runs **14 checks** covering the class of error that is invisible when reading one file at a time
and that has actually occurred in this repo:

| # | Check | What it exists because |
|---|-------|------------------------|
| 1–2 | Registry closure · curriculum arithmetic · **registry↔filesystem** | §4.3 had 119 lesson rows against 113 distinct ids (now 123/123); the example table in §4.1 duplicates 6. Counts alone are not enough: the drift was invisible because the registry was never compared to the disk. [2] now cross-checks every declared id against a real file (lessons matched by their declared `**Lesson ID:**`, because `les_a2_greetings_intro` lives in `lesson-15min-workplace-greetings.md`), exempts `blocked_*` only when the state is declared, and requires every pack to name a lesson that exists. Its third obligation, **registry status**, recomputes the §4.3 `Status` column against the disk: 110 rows said `designed` — which §4.3's own legend defines as *no file* — while the file existed and passed [8], and 15 more carried a sourcing value or a remediation trigger where the authoring state belonged. Its fourth obligation, **summary arithmetic**, recomputes §2's CEFR table and §13's GRAPH STATE SUMMARY against §4.3 and the disk — both still said 108 lessons / 1 authored / 1 pack long after 123 ids, 122 files and 122 packs existed |
| 3, 3b | Source corpus · **licence-warning retention** | The BaixeLivros no-redistribution notices must not be edited away. Check 3b also verifies the reuse-basis classification of all 123 lessons and **fails if zero lessons have a permissive source** |
| 4 | JSON blocks parse | A lesson shipped Python implicit string concatenation — valid Python, invalid JSON. `check_json` walked the specs; `check_lessons` only tested for the fence's presence, so the one block every engine reads first was the one nobody parsed |
| 5 | Listening corpus integrity | Q-L2 (45 s floor) is load-bearing: 4 dialogues were 30–44 s and 2 B1 ones appeared in the index with no transcript at all. **Item status is a field.** Withdrawal was decided by `"withdrawn" in body`, so an item whose prose merely *cites* the withdrawal history escaped the key check entirely — and §8.2 published 68 admissible items against a real 74, uncaught for the life of the table. Both halves now read `**Status:**`, and the inventory is recomputed against the fields |
| 6 | External source registry | 21 dead URLs and 15 rejections have to stay recorded, or the same sources get re-proposed |
| 7 | Cross-references (`check_xrefs`) | Every backtick-quoted `.md` filename must resolve to a real file or a file in `Ingles/output/`. Found 4 missing files that were cited but did not exist. |
| 8 | Authored lesson files | filename == lesson id, `**Reuse basis:**` present and valid, `adapt_*` barred against restricted sources, and a respelling scan for `cite_only` reproduction. The respelling rule requires a diacritic as well as a space: 239 of 560 respellings are multi-word and **none of the 239 lacks a diacritic**, so the diacritic costs no signal and removes the `[preposition phrase]` false positive |
| 9 | Practice packs | **Found 2 unscorable items in the first 4 packs** (duplicate options) plus 21 items with no machine-parseable key. It also checks id prefix ↔ skill namespace, requires a `note:` on every distractor, and asserts the `br_pt_form` census it publishes in `assessment-item-spec.md` §2.2.1. It globbed 7 of 122 packs — see [11c]/[11d]/[11e] for what now runs on both schemas |
| 10 | Internal `§` references resolve | Two dialogue headers cited a "§7 sourcing note" that did not exist — a dangling reference that also happened to be the exact licensing mislabelling the licence section exists to prevent. The check found 4 more real ones |
| 11 | **Restricted sources are not declared publishable** | `content-map.md` §11.1 — the **P0** term deck — was headed *"Source-derived, zero authoring"* and then reproduced a restricted book's 40-row list, its invented phonetic notation and 8 verbatim sentences, while §0.5.1 of the registry claimed the opposite 700 lines away. Found by the check, not by reading. **[11b]** every pack's `**Reuse basis:**` must match its items' provenance; **[11c]** `item_id` must be unique across **both** pack schemas (found 10 collisions); **[11d]** every item declares an id and every item **with a distractor table** declares a `**Key:**` — the obligation is conditional on there being a choice, so the 14 production/minimal-pair items scored by ASR are correctly exempt; **[11e]** no item may offer the same option twice (case-sensitive, bold stripped) — run across both schemas it found **28** items whose distractor was byte-identical to its own key |
| 12 | Markdown table column consistency | A regex meant to drop a respelling column dropped the Portuguese-gloss column instead and deleted all 40 glosses from §11.1. No other check can see that loss: every check that reads a cell reads it as "present" |
| 13 | Worked examples honour their own disclosures | `diagnostic-spec.md` §3.6 shipped a JSON example printing a `listening` θ while §2.1 had removed Listening from the blueprint, and a `pronunciation` θ while its own `skill_theta_reportable` said false. Check [4] only asks whether the block parses, and a block that parses while contradicting itself is the common case |

**Run it after editing any spec or authoring any artifact.** Most defects in this repository were
found by it, not by reading.

---

## Licensing — READ THIS BEFORE ADAPTING ANY SOURCE

**None of the 7 local PDFs is permissively licensed. This constrains everything below.**

Three of them carry an explicit licence notice in their own front matter
(`Dicionario...md`, `leia-e-escreva...md`, `frases-ingles-trabalho.md`):

> "Disponibilização gratuita e integral por meio da plataforma BaixeLivros. Caso deseje
> compartilhar-lo fora deste ambiente, é necessário obter a devida permissão. Além disso, a licença
> gratuita concedida para este material poderá ser alterada futuramente a critério do autor."

The other four (`Ingles-basico.md` ©2012 Tiago Rodrigues; `Ingles-Tecnico-Para-Informatica.md` ©CETAM;
`apostila-ingles-para-iniciantes-impresso.md`; `Ingles para Viagens.md`) carry no licence grant at all.

**Consequences, in order of how often they apply:**

1. **The local PDFs are the reasoning substrate, not the publishable substrate.** Use them to decide
   *what* to teach and *where* a learner will struggle. Do not reproduce or adapt their text.
2. **Every lesson citation needs a reuse basis**, not just a source: `cite_only` (default — author
   original material, cite as bibliography, reproduce nothing), `adapt_with_attribution` (only for
   permissively-licensed sources), or `adapt_requires_permission`.
3. **List-shaped lessons cannot use `cite_only`.** A list of 250 jargon terms *is* the source.
   `les_b2_it_jargon_mastery`, `les_b1_it_acronyms_deep`, `les_a1_false_cognates` and
   `les_a2_travel_vocab_core` need either a rebuilt permissive source or written, perpetual,
   redistribution-granting permission.
4. **Only 13 of 123 lessons currently have a reusable source.** Full analysis, evidence and the
   permission-request template: **`external-sources.md` §0.5 and §7.0.**

**Do not treat availability as permission.** The `external-sources.md` registry exists because the
most natural source for the incident material — the Google SRE Book — is CC-BY-**NC-ND** and cannot
be adapted at all, and because the local corpus turned out to be no cleaner. Read the licence before
you cite, not after.

---

## Pedagogical Architecture (Version 3.0 — ITS Specification)

This repository is the content foundation for an **Intelligent Tutoring System (ITS)** for teaching English to Brazilian Portuguese speakers, with emphasis on technology professionals. The system design incorporates the following evidence-based principles:

### Core Learning Theories & Frameworks
- **SLA (Second Language Acquisition)**: Krashen's Comprehensible Input (i+1), Acquisition vs. Learning, Affective Filter, Monitor Hypothesis
- **Mastery Learning** (Bloom): ≥80% mastery threshold before progression
- **CEFR Alignment**: A1–C2 structured progression with can-do descriptors
- **Bloom's Taxonomy**: Remember → Understand → Apply → Analyze → Evaluate → Create
- **Formative Assessment**: Continuous low-stakes checks, not just summative tests
- **Adaptive Personalization**: Diagnose → Prescribe → Practice → Assess → Adapt loop
- **Spaced Repetition & Retrieval Practice** (Make It Stick): Durable retention via scheduled review

### Pedagogical Pillars (from Foundational Literature)

| Domain | Key Sources | System Impact |
|--------|-------------|---------------|
| **SLA Foundations** | Krashen (Principles and Practice); Lightbown & Spada (How Languages are Learned); Cook (Second Language Learning and Language Teaching) | Input-first, comprehension-before-production, errors as interlanguage evidence |
| **Communicative Teaching** | Richards (Communicative Language Teaching Today) | Authentic tasks, real situations, less isolated grammar |
| **Grammar** | Murphy (English Grammar in Use) | Gradual structural syllabus, clear examples, tiered exercises |
| **Vocabulary** | McCarthy/O'Dell (English Vocabulary in Use) | Contextualized, frequency-based, systematic building |
| **Pronunciation** | Hancock (English Pronunciation in Use); Baker (Ship or Sheep?) | Connected speech, intonation, minimal pairs for BR-PT interference (TH, V/W, I/EE) |
| **Fluency/Methodology** | Harmer (The Practice of English Language Teaching) | Task design for speaking/listening, classroom management patterns |
| **Immediate Recast + Uptake (opt-in meta)** | Long (1996), Mackey & Goo (2007) | Micro-ciclo 30–60 s no Guided Practice: aprendiz responde → tutor recasta → aprendiz repete recast. Metalinguística **só via botão "Por que?"** (nunca automática). Output Task opt-in para A1–A2; transição B1+ (θ ≥ 0) para 6/4/4/1. |
| **Assessment** | Brown & Abeywickrama (Language Assessment) | Formative CEFR-aligned rubrics, diagnostic placement |
| **Retention Science** | Brown/Roediger/McDaniel (Make It Stick) | Retrieval practice, spaced repetition, interleaving |
| **English for IT** | Glendinning & McEwan (Oxford English for ICT); Professional English in Use ICT | Technical vocabulary, documentation, dev communication |

### 10-Book Core Pedagogical Corpus (Embedded Knowledge Base)
1. *Principles and Practice in Second Language Acquisition* — Krashen
2. *How Languages are Learned* — Lightbown & Spada
3. *Second Language Learning and Language Teaching* — Cook
4. *Communicative Language Teaching Today* — Richards
5. *English Grammar in Use* — Murphy
6. *English Vocabulary in Use* — McCarthy & O'Dell
7. *English Pronunciation in Use* — Hancock
8. *Language Assessment: Principles and Classroom Practices* — Brown & Abeywickrama
9. *Make It Stick* — Brown, Roediger, McDaniel
10. *Oxford English for Information Technology* — Glendinning & McEwan

### System Components (to be built atop this content)
1. **Diagnostic Engine** — CEFR placement via adaptive test
2. **Curriculum Graph** — Prerequisite-aware lesson DAG mapped to CEFR
3. **Mastery Tracker** — Per-skill ≥80% gate with spaced review scheduling
4. **Adaptive Content Selector** — i+1 input selection based on learner model
5. **Formative Assessment Loop** — Micro-checks every 5–10 min; corrective feedback
6. **Spaced Repetition Scheduler** — SM-2 or FSRS for vocabulary/grammar items
7. **Pronunciation Coach** — Minimal-pair drills targeting BR-PT phonological gaps
8. **IT English Track** — Specialized pathway using technical corpus
9. **Pedagogical Memory** — Persistent learner profile: errors, strengths, preferences, mastery history
10. **Gamification Layer** — Streaks, XP, badges tied to mastery (not time-on-task)

### Content Organization Target
Transform the 7 raw markdown sources into:
- **Structured Modules** (CEFR-levelled, prerequisite-ordered)
- **Lessons** with: Input (i+1) → Guided Practice → Output Task → Formative Check
- **Exercise Banks** per skill (grammar, vocab, pronunciation, listening, speaking, reading, writing)
- **Assessment Items** calibrated to CEFR descriptors
- **Spaced Review Packs** auto-generated from learner history

### Brazilian Portuguese-Specific Adaptations
- Contrastive analysis: BR-PT vs. EN phonology, syntax, false cognates
- Cultural contextualization: Brazilian workplace, travel, tech scenarios
- Error prediction: Preempt common L1 interference patterns

---

*This architecture guides how the raw content in `Ingles/output/` should be processed, structured, and delivered by the ITS. Agents working on this repo should treat the markdown files as source material for curriculum engineering, not as final lesson delivery format.*