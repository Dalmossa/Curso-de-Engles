# Curriculum Graph Specification — Prerequisite-Aware Lesson DAG

**Purpose:** Define the structured curriculum as a Directed Acyclic Graph (DAG) mapping CEFR levels, skills, and content sources to enable adaptive navigation, mastery-gated progression, and diagnostic placement.

---

## 1. GRAPH ARCHITECTURE

### 1.1 Node Types
| Node Type | Prefix | Description | Mastery Gate |
|-----------|--------|-------------|--------------|
| **Lesson** | `les_` | 15-min instructional unit (i+1 → Practice → Output → Check) | P(all prereq skills) ≥ 0.85 |
| **Module** | `mod_` | Thematic cluster (5-8 lessons) | Mean P(mastery) ≥ 0.85, no skill < 0.60 |
| **Milestone** | `ms_` | CEFR level transition (A1→A2, A2→B1, B1→B2) | IRT θ CI₉₅ fully above threshold |
| **Diagnostic Entry** | `diag_` | Placement test → start node mapping | N/A (entry point) |

### 1.2 Edge Types
| Edge Type | Meaning | Traversal Condition |
|-----------|---------|---------------------|
| **Prerequisite** | `les_A → les_B` | B requires mastery of A's skills |
| **Alternative Path** | `les_A ⇢ les_B` | Parallel tracks (e.g., General vs. IT English) |
| **Remediation** | `les_A ↻ les_B` | B is review/scaffolding for A's weak skills |
| **Enrichment** | `les_A ⤷ les_B` | Optional deep-dive (no gate) |
| **Module Sequence** | `mod_X → mod_Y` | Complete module X before Y |

### 1.3 Graph Properties
- **DAG**: No cycles (remediation edges point to earlier/review nodes only)
- **Multi-root**: Multiple entry points per CEFR level (diagnostic maps to one)
- **Weighted**: Edges carry `skill_transfer` matrix (which skills from A feed B)

---

## 2. CEFR LEVEL STRUCTURE

**All 18 modules are defined in §3.** Fifteen carry exactly 6 lessons in the §4.3 registry; the IT track was expanded with lessons sourced from the `docs/*.md` technical books, so `mod_a2_it_fundamentals` and `mod_b1_it_technical` carry **10** and `mod_b2_it_senior` carries **8**. The counts below are therefore not estimates — they are the registry, summed.

| CEFR | General Track | IT Track | Both | Modules | Lessons | Est. Hours | Target Weeks (3×/wk) |
|------|---------------|----------|------|---------|---------|------------|----------------------|
| **A1** | `a1_foundation`, `a1_grammar_start`, `a1_vocab_core`, `a1_comm_basic` | — | — | 4 | 24 | 6.0h | 8 |
| **A2** | `a2_workplace_intro`, `a2_workplace_comm`, `a2_workplace_tasks`, `a2_travel`, `a2_skills_rw` | `a2_it_fundamentals`, `a2_it_communication` | — | 7 | 46 | 11.5h | 15 |
| **B1** | `b1_grammar_consolidate`, `b1_workplace_adv` | `b1_it_technical` | `b1_fluency_project` | 4 | 28 | 7.0h | 9 |
| **B2** | `b2_professional` | `b2_it_senior` | `b2_cert_prep` | 3 | 20 | 5.0h | 7 |
| **Total (full catalog)** | | | | **18** | **118** | **29.5h** | **39 weeks** |

### 2.1 What a Learner Actually Completes

The catalog is **both tracks**. No learner walks all 118 lessons. The IT track *substitutes* modules; it does not add to them.

| Learner path | Modules traversed | Lessons | Weeks |
|--------------|-------------------|---------|-------|
| **General track** | A1 (4) → A2 general (5) → B1 general (2) + `b1_fluency_project` → B2 `b2_professional` + `b2_cert_prep` | 84 (14 modules × 6) | 28 |
| **IT track** | A1 (4) → A2 general (5) **replaced by** A2 IT (2) → B1 `b1_it_technical` + `b1_fluency_project` → B2 `b2_it_senior` + `b2_cert_prep` | 70 (24 + 16 + 10 + 6 + 8 + 6) | 23 |
| **Diagnostic-placed A2 learner** | Skips all A1, enters `mod_a2_workplace_intro`; completes the A2 level | ~46 (the A2 row) | 15 |

> ⚠️ **Correction applied.** An earlier draft of this table claimed 25 modules / 156 lessons / 39h / 52 weeks. The registry contains **18 modules / 118 lessons / 29.5h**. The inflated figure was produced by counting IT-track modules *in addition to* their general-track replacements, which double-counts. **§4.3 is the authority; this table is a summary of it.**
>
> **Canonical lesson IDs:** §4.3 registers every lesson node. Lesson files are the repo-root `les_*.md` files (plus `lesson-15min-workplace-greetings.md`); practice packs are `pack-les-*.md` and `pack_les_*_v1.md`.

---

## 3. MODULE CATALOG (Source-Mapped)

| Module ID | Title | CEFR | Source Markdown(s) | Track | Lessons |
|-----------|-------|------|-------------------|-------|---------|
| `mod_a1_foundation` | Foundations: Alphabet, Sounds, Basics | A1 | `apostila-ingles-para-iniciantes-impresso.md` (Ch 1-2) | General | 6 |
| `mod_a1_grammar_start` | Grammar Starter: Be, Pronouns, Articles | A1 | `apostila-ingles-para-iniciantes-impresso.md` (Ch 3-4) | General | 6 |
| `mod_a1_vocab_core` | Core Vocab: Numbers, Colors, Days, Food | A1 | `apostila-ingles-para-iniciantes-impresso.md` (Ch 5) | General | 6 |
| `mod_a1_comm_basic` | Basic Communication: Greetings, Intro, Needs | A1 | `Ingles-basico.md` (Ch 1-3) | General | 6 |
| `mod_a2_workplace_intro` | Workplace Basics: Greetings, Intros, Small Talk | A2 | `frases-ingles-trabalho.md` (Ch 2-3) | General | 6 |
| `mod_a2_workplace_comm` | Workplace Comm: Meetings, Email, Calls | A2 | `frases-ingles-trabalho.md` (Ch 4-6) | General | 6 |
| `mod_a2_workplace_tasks` | Tasks & Deadlines: Follow-up, Help, Feedback | A2 | `frases-ingles-trabalho.md` (Ch 7-10) | General | 6 |
| `mod_a2_travel` | Travel English: Transport, Hotel, Food, Help | A2 | `Ingles para Viagens.md` | General | 6 |
| `mod_a2_skills_rw` | Reading & Writing Improvement | A2 | `leia-e-escreva-melhor-em-ingles.md` | General | 6 |
| **`mod_a2_it_fundamentals`** | **IT English: Terms, Docs, Stand-ups, Clean Code, Testing, TypeScript, Algorithms** | **A2** | **`Ingles-Tecnico-Para-Informatica.md` + `Dicionario-de-Siglas...md` + `docs/codigolimpo.md` + `docs/tdd.md` + `docs/typescript-guia-pratico.md` + `docs/algoritmos.md`** | **IT Track** | **10** |
| **`mod_a2_it_communication`** | **IT Comm: PRs, Tickets, Incidents, Docs** | **A2** | **`Ingles-Tecnico-Para-Informatica.md` + `frases-ingles-trabalho.md` (tech)** | **IT Track** | **6** |
| `mod_b1_grammar_consolidate` | Grammar Consolidation: Tenses, Modals, Conditionals | B1 | `apostila-ingles-para-iniciantes-impresso.md` (review) + `Ingles-basico.md` (adv) | General | 6 |
| `mod_b1_workplace_adv` | Advanced Workplace: Negotiation, Presentation, Leadership | B1 | `frases-ingles-trabalho.md` (advanced) + `leia-e-escreva-melhor-em-ingles.md` | General | 6 |
| `mod_b1_it_technical` | Technical Discussions: Architecture, Debugging, Code Review, DDD, BDD, UX, DevOps | B1 | `Ingles-Tecnico-Para-Informatica.md` (advanced) + `docs/ddd-rapido.md` + `docs/bdd-in-action.md` + `docs/ux-design.md` | IT Track | 10 |
| `mod_b1_fluency_project` | Project-based Fluency: Case Studies, Simulations | B1 | All sources (integrated) | Both | 6 |
| `mod_b2_professional` | Professional Mastery: Nuance, Register, Culture | B2 | `leia-e-escreva-melhor-em-ingles.md` + `frases-ingles-trabalho.md` (B2) | General | 6 |
| `mod_b2_it_senior` | Senior IT: Mentoring, Architecture Decisions, Strategy, Advanced Patterns, Technical Leadership | B2 | `Ingles-Tecnico-Para-Informatica.md` (senior) + `Dicionario...md` + `docs/codigolimpo.md` + `docs/arquitetura-limpa.md` + `docs/bdd-in-action.md` + `docs/agile.md` | IT Track | 8 |
| `mod_b2_cert_prep` | Certification Prep: TOEIC/IELTS/CELPE-Bras | B2 | All (exam-focused) | Both | 6 |

---

## 4. LESSON GRANULARITY (A2 Workplace Example)

### 4.1 Module: `mod_a2_workplace_intro` (6 Lessons)
| Lesson ID | Title | Skills (Tracking) | Output Modalities | Prereq Lessons | Source | Est. Skills Touched |
|-----------|-------|-------------------|-------------------|----------------|--------|---------------------|
| `les_a2_greetings_intro` | Cumprimentos e Apresentações | Grammar, Vocab, Listening, Pronunciation | Speaking | `mod_a1_comm_basic` (or diag) | `frases-ingles-trabalho.md` Ch 2 + `apostila...` 2.2 | present_simple_be, demonstrative_this, wh_questions_how, greetings_vocab, th_voiced, th_unvoiced, h_aspirated |
| `les_a2_small_talk` | Small Talk: Weekend, Weather, Coffee | Grammar, Vocab, Listening | Speaking | `les_a2_greetings_intro` | `frases-ingles-trabalho.md` Ch 3 (`adapt_with_attribution`) | present_simple, past_simple, weekend_vocab, connected_speech |
| `les_a2_introducing_others` | Apresentando Colegas e Stakeholders | Grammar, Vocab | Speaking | `les_a2_greetings_intro` | `frases-ingles-trabalho.md` Ch 2 + `apostila...` 2.2 | possessive_pronouns, relative_clauses_basic, roles_vocab |
| `les_a2_meeting_open` | Abrindo Reunião: Pauta, Objetivos, Papéis | Grammar, Vocab, Listening, Reading | Speaking | `les_a2_small_talk` | `frases-ingles-trabalho.md` Ch 4 | imperative, modal_verbs_can_need, meeting_vocab |
| `les_a2_meeting_participate` | Participando: Opinar, Concordar, Discordar | Grammar, Vocab, Listening | Speaking | `les_a2_meeting_open` | `frases-ingles-trabalho.md` Ch 4 | agreement_phrases, hedging, turn_taking |
| `les_a2_email_basics` | E-mails Profissionais: Estrutura, Anexos, Follow-up | Vocab, Reading, Writing* | Writing | `les_a2_meeting_participate` | `frases-ingles-trabalho.md` Ch 5 | email_register, fixed_phrases, polite_requests |

> *Writing is a tracking skill only for lessons with explicit writing practice (email, chat). Most lessons: 4 tracking skills (Grammar, Vocab, Listening, Pronunciation/Reading).

### 4.2 Skill Coverage Matrix (A2 Workplace Module)
| Skill (Tracking) | les_a2_greetings_intro | les_a2_small_talk | les_a2_introducing_others | les_a2_meeting_open | les_a2_meeting_participate | les_a2_email_basics |
|------------------|---------------|----------------|------------------|------------------|------------------|-----------|
| **Grammar** | be, this, wh-Q | past simple | possessives, rel clauses | imperatives, modals | hedging, conditionals | register, passives |
| **Vocabulary** | greetings, roles | weekend, weather | roles, departments | agenda, objectives | opinions, agreement | email phrases, attachments |
| **Listening** | dialog comprehension | natural speed | multi-speaker | meeting opening | discussion flow | — |
| **Reading** | — | chat messages | org chart bios | agenda doc | — | email samples |
| **Pronunciation** | TH, H, R, S+C | connected speech | names, titles | sentence stress | intonation patterns | — |

| Output Modality | les_a2_greetings_intro | les_a2_small_talk | les_a2_introducing_others | les_a2_meeting_open | les_a2_meeting_participate | les_a2_email_basics |
|-----------------|---------------|----------------|------------------|------------------|------------------|-----------|
| **Speaking** | role-play intro | role-play chat | role-play intro 3rd | role-play meeting | role-play discussion | — |
| **Writing** | — | Slack reply | — | agenda bullet | — | full email |

### 4.3 Canonical Lesson Registry (All Node IDs Referenced Across Specs)

This is the authoritative list of lesson IDs. Any spec (`content-map.md`, `diagnostic-spec.md`, lesson files) referencing an ID must find it here. Lesson files are the repo-root `les_*.md` files (one exception: `les_a2_greetings_intro` lives in `lesson-15min-workplace-greetings.md`, a filename that predates the `les_<id>.md` convention — check [2] matches a lesson to its file by the declared `**Lesson ID:**`, never by the filename).

**The `Status` column is the lesson's authoring state, and it must agree with the filesystem.** The vocabulary is the one `PRD.md` §4 uses: `✅ **authored**` — a file exists that declares this ID (the case for **123** of 123); none are currently blocked. Anything a row needs to say *besides* the authoring state is a named suffix, never a substitute: `· cite_only` / `· sourcing: sourced_external` / `· trigger: …`.

**This column was reconciled on 2026-10-01, and the defect is worth recording.** 110 rows said `designed` — which §4.3's own note defines as *no file* — while the file existed and passed check [8]; 15 more carried a sourcing value or a remediation trigger where the state belonged. Nothing was deleted: each displaced value was preserved as the suffix above. The lesson is the one `AGENTS.md` states, restated: **a status column nobody recomputes is a count nobody checks** — the same failure this registry gave check [2] in the first place. Check [2] now recomputes this column and fails on drift.

**`mod_a1_foundation`** (A1, General)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_a1_alphabet_sounds` | Alphabet, Sounds, Letter Names | Original (clean-room, Onda 2 — Lote 2 (batch 2)) | alphabet_letter_names |  | ✅ **authored** · reauthored_authored_material |
| `les_a1_greetings` | Greetings & Basic Phrases | Original (clean-room, Lote 2 Onda 2) | greetings_time,present_simple_be |  | ✅ **authored** · reauthored_authored_material |
| `les_a1_intro_dialogue` | Introducing Yourself: 3-Step Dialogue | Original (clean-room, Lote 2 Onda 2) | present_simple_be,wh_questions_how,greetings_time |  | ✅ **authored** · reauthored_authored_material |
| `les_a1_daily_basics` | Everyday Survival Phrases | Original (clean-room, Lote 2 Onda 2) | daily_expressions | present_simple_be,greetings_time | ✅ **authored** · reauthored_authored_material |
| `les_a1_pronunciation_intro` | TH / H / R / S+C Minimal Pairs | Original (clean-room, Lote 2 Onda 2) | th_voiced,th_unvoiced,h_aspirated |  | ✅ **authored** · reauthored_authored_material |
| `les_a1_en_us_en_gb` | American vs. British English | Original (clean-room, Onda 2 — Lote 2 (batch 2)) | greetings_formal_informal |  | ✅ **authored** · reauthored_authored_material |

**`mod_a1_grammar_start`** (A1, General)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_a1_to_be_forms` | Verb To Be: Affirmative/Negative/Interrogative | Original (clean-room, Onda 2 — Lote 2 (batch 2)) | present_simple_be | present_simple_be | ✅ **authored** · reauthored_authored_material |
| `les_a1_pronouns_subject_object` | Personal Pronouns: Subject & Object | Original (clean-room, Onda 2 — Lote 2 (batch 2)) | personal_pronouns_subject,personal_pronouns_object | present_simple_be | ✅ **authored** · reauthored_authored_material |
| `les_a1_pronouns_possessive` | Possessive Pronouns | Original (clean-room, Onda 2 — Lote 2 (batch 2)) | possessive_pronouns | personal_pronouns_subject,personal_pronouns_object | ✅ **authored** · reauthored_authored_material |
| `les_a1_pronouns_demonstrative` | Demonstratives: This/That/These/Those | Original (clean-room, Onda 2 — Lote 3 (batch 3) — Fase A) | demonstrative_pronouns | possessive_pronouns | ✅ **authored** · reauthored_authored_material |
| `les_a1_wh_questions` | Interrogatives: WH-words + How+Adverb | Original (clean-room, Onda 2 — Lote 3 (batch 3) — Fase A) | interrogative_pronouns | present_simple_be | ✅ **authored** · reauthored_authored_material |
| `les_a1_articles_nouns` | Articles, Nouns, Adjectives | apostila 4.1-4.3 | articles_definite,articles_indefinite,noun_plurals,adjectives_basic | demonstrative_pronouns | ✅ **authored** |

**`mod_a1_vocab_core`** (A1, General)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_a1_numbers_colors` | Numbers & Colors | Original (clean-room, Onda 2 — Lote 3 (batch 3) — Fase A) | numbers,colors |  | ✅ **authored** · reauthored_authored_material |
| `les_a1_days_months` | Days of Week & Months | Original (clean-room, Onda 2 — Lote 3 (batch 3) — Fase A) | days_months |  | ✅ **authored** · reauthored_authored_material |
| `les_a1_time_dates` | Hours & Dates | Original (clean-room, Onda 2 — Lote 3 (batch 3) — Fase A) | times_dates |  | ✅ **authored** · reauthored_authored_material |
| `les_a1_food` | Food & Drink | Original (clean-room, Onda 2 — Lote 4 (batch 4) — Fase B) | food_basic |  | ✅ **authored** · reauthored_authored_material |
| `les_a1_occupations` | Occupations & Roles | Original (clean-room, Onda 2 — Lote 4 (batch 4) — Fase B) | occupations |  | ✅ **authored** · reauthored_authored_material |
| `les_a1_regular_verbs_past` | Regular Verbs Past: ED Rules | Original (clean-room, Onda 2 — Lote 4 (batch 4) — Fase B) | past_simple_regular | present_simple_regular | ✅ **authored** · reauthored_authored_material |

**`mod_a1_comm_basic`** (A1, General) — entry node for A1 track
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_a1_present_simple` | Present Simple Affirmative | Original (clean-room, Onda 2 — Lote 4 (batch 4) — Fase B) | present_simple_regular | present_simple_be,articles_definite,articles_indefinite,noun_plurals,adjectives_basic | ✅ **authored** · reauthored_authored_material |
| `les_a1_present_simple_questions` | Do/Does Questions | Original (clean-room, Onda 2 — Lote 4 (batch 4) — Fase B) | present_simple_do_does | present_simple_regular | ✅ **authored** · reauthored_authored_material |
| `les_a1_have_has` | Verb To Have | Original (clean-room, Onda 2 — Lote 5 (batch 5) — Fase C) | present_simple_regular | present_simple_regular | ✅ **authored** · reauthored_authored_material |
| `les_a1_there_is_are` | There Is / There Are | Original (clean-room, Onda 2 — Lote 5 (batch 5) — Fase C) | there_is_are | present_simple_regular | ✅ **authored** · reauthored_authored_material |
| `les_a1_reading_skimming` | Skimming & Scanning | Original (clean-room, Onda 2 — Lote 5 (batch 5) — Fase C) | reading_skimming | articles_definite,articles_indefinite,noun_plurals,adjectives_basic | ✅ **authored** · reauthored_authored_material |
| `les_a1_false_cognates` | False Cognates: The Top Traps | Original (clean-room, Onda 2 — Lote 5 (batch 5) — Fase C) | reading_false_cognates | reading_skimming | ✅ **authored** · reauthored_authored_material |

**`mod_a2_workplace_intro`** (A2, General) — entry node for A2 track
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_a2_greetings_intro` | Workplace Greetings & Introductions | frases Ch2 + apostila 2.2 | greetings_time,greetings_formal_informal,imperative | present_simple_regular,interrogative_pronouns | ✅ **authored** |
| `les_a2_small_talk` | Small Talk: Weekend, Weather, Coffee | frases Ch3 (`adapt_with_attribution`) | smalltalk_vocab | present_simple_regular,greetings_time,greetings_formal_informal | ✅ **authored** |
| `les_a2_introducing_others` | Introducing Others: Reciprocity, Roles, Reactions | frases Ch2 + apostila 2.2 (`adapt_with_attribution`) | roles_tech,relative_pronouns | roles_tech | ✅ **authored** |
| `les_a2_meeting_open` | Opening a Meeting: Agenda, Objectives, Roles | frases Ch4 (`adapt_with_attribution`) | meeting_vocab,imperative,modal_can_need | roles_tech | ✅ **authored** |
| `les_a2_meeting_participate` | Participating: Agreeing, Disagreeing, Hedging | frases Ch4 (`adapt_with_attribution`) | meeting_vocab,hedging | meeting_vocab | ✅ **authored** |
| `les_a2_email_basics` | Professional Emails: Structure, Attachments, Follow-up | frases Ch5 + dicionário Ch10 (`adapt_with_attribution`) | email_vocab,email_register | meeting_vocab | ✅ **authored** |

**`mod_a2_workplace_comm`** (A2, General)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_a2_phone_calls` | Phone & Video Calls | Original (clean-room, Onda 2 — Lote 5 (batch 5) — Fase C) | meeting_vocab | present_simple_regular,past_simple_irregular | ✅ **authored** · reauthored_authored_material |
| `les_a2_ask_for_help` | Asking for Help & Buying Time | frases Ch7 | meeting_vocab | present_simple_regular | ✅ **authored** |
| `les_a2_deadlines_tasks` | Deadlines, Tasks & Follow-up | frases Ch8 | deadline_vocab | present_simple_regular,past_simple_irregular | ✅ **authored** |
| `les_a2_feedback_praise` | Feedback, Praise & Apologies | frases Ch9 | feedback_vocab | present_simple_regular | ✅ **authored** |
| `les_a2_corporate_wrapup` | Closing Conversations & Sign-offs | frases Ch10 | email_vocab | present_simple_regular | ✅ **authored** |
| `les_a2_corpus_intro` | Corporate Speak: Acronyms & Jargon | dicionário Ch1, Bônus1 | acronyms_corporate | present_simple_regular | ✅ **authored** |

**`mod_a2_workplace_tasks`** (A2, General)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_a2_past_narrative` | Narrating the Past (Work Context) | frases Ch8 + leia Ch6 | writing_past_narrative | past_simple_irregular,reading_skimming | ✅ **authored** |
| `les_a2_future_will` | Future: Will & Going To | IT A5 | future_will,future_going_to | present_simple_regular | ✅ **authored** |
| `les_a2_present_continuous` | Present Continuous in Workflows | IT A4 | present_continuous | present_simple_regular | ✅ **authored** |
| `les_a2_modals_can_need` | Modals: Can, Need, Should | IT A5 + frases Ch4 | modal_can_need | present_simple_regular | ✅ **authored** |
| `les_a2_imperatives` | Imperatives: Instructions & Procedures | IT A4 | imperative | present_simple_regular | ✅ **authored** |
| `les_a2_prepositions_basic` | Prepositions of Place & Time | IT A7 | prepositions_basic | present_simple_regular | ✅ **authored** |

**`mod_a2_travel`** (A2, General)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_a2_travel_vocab_core` | Core Travel Vocabulary (20 items) | viagens Dia2 | travel_core |  | ✅ **authored** |
| `les_a2_collocations` | Collocations: Word Partners | viagens Language/Culture | collocation_aula | present_simple_regular | ✅ **authored** |
| `les_a2_stress_timing` | Stress-Timing & Word Stress | viagens Pronúncia | stress_timing |  | ✅ **authored** |
| `les_a2_airport` | Airport & Immigration | viagens | travel_airport | travel_core | ✅ **authored** |
| `les_a2_hotel_taxi` | Hotel, Taxi & Transport | viagens | travel_hotel | travel_core | ✅ **authored** |
| `les_a2_restaurant_shopping` | Restaurant, Shopping & Emergencies | viagens | travel_core | travel_core | ✅ **authored** |

**`mod_a2_skills_rw`** (A2→B1, General)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_a2_reading_strategy` | Reader's Toolkit: Skim, Scan, Context, Cognates | leia Ch2 | reading_skimming,reading_scanning,reading_context_inference,reading_cognates | present_simple_regular,reading_skimming | ✅ **authored** |
| `les_a2_writing_svo` | Writer's Toolkit: SVO Order, Explicit Subject, Tense Consistency | leia Ch3 | svo_order,explicit_subject,tense_consistency | present_simple_regular,articles_definite,articles_indefinite,noun_plurals,adjectives_basic | ✅ **authored** |
| `les_a2_writing_bio` | Writing: Bio & Profile | leia Ch4 | writing_bio | svo_order,explicit_subject,tense_consistency | ✅ **authored** |
| `les_a2_writing_messages` | Writing: Everyday Messages | leia Ch5 | writing_informal_message | svo_order,explicit_subject,tense_consistency | ✅ **authored** |
| `les_a2_writing_past` | Writing: Narrating the Past | leia Ch6 | writing_past_narrative | past_simple_irregular,svo_order,explicit_subject,tense_consistency | ✅ **authored** |
| `les_a2_writing_selfcheck` | Writer's Revision Checklist | leia Bônus2 | connectors_writing,error_br_writing_15 | svo_order,explicit_subject,tense_consistency,writing_past_narrative,writing_informal_message,writing_bio | ✅ **authored** |

**`mod_a2_it_fundamentals`** (A2, IT Track) — entry node for IT track
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_a2_it_terms_basics` | IT English: Core Terms, Docs, Stand-ups | S16, S01 (`adapt_with_attribution`) | it_computer_terms | present_simple_regular,reading_skimming | ✅ **authored** · `sourced_external` |
| ↳ *note* | *S18 was assessed `adequate` here and is **not** used* | *The lesson needed a glossing pattern and a reader-first frame; S16 supplied the first and S01 the second, and nothing in the lesson draws on opensource.guide. `external-sources.md` §7.1 rated the lesson on S18's strength, which was a judgement about the topic, not about the lesson. **Registry rows must name the sources the artefact actually adapted**, which is why the row changed when the lesson was written.* |  |  | *2026-09-30* |
| ↳ *note* | *The 5 rows that sat at `designed` with no file were authored 2026-10-01* | *`verify-integrity.py` [2] now cross-checks §4.3 against the filesystem, and found the gap: 123 ids were declared and 116 files existed, with nothing failing because the count was taken from the registry and never compared to the disk. All five carry `adapt_with_attribution` — the dicionário and the CETAM book are restricted, so they were read for scope (which grammar point each lesson turns on) and nothing was reproduced. Two carry an explicit non-overlap note: `les_a2_it_computer_parts` owns the category question, `les_a2_it_system_unit` owns the position question.* |  |  | *2026-10-01* |
| `les_a2_it_roles_hierarchy` | Roles & Hierarchy in Tech | dicionário Ch3 | roles_tech | present_simple_regular,reading_skimming | ✅ **authored** · `adapt_with_attribution` |
| `les_a2_it_reading_strategy` | Reading Technical Texts | IT A2 | reading_skimming,reading_scanning | present_simple_regular,reading_skimming | ✅ **authored** · `adapt_with_attribution` |
| `les_a2_it_computer_parts` | Parts of Computers | IT A4 | it_computer_terms | present_simple_regular,reading_skimming | ✅ **authored** · `adapt_with_attribution` |
| `les_a2_it_system_unit` | System Unit & Hardware Vocabulary | IT A5 | it_computer_terms | present_simple_regular,reading_skimming | ✅ **authored** · `adapt_with_attribution` |
| `les_a2_it_internet_history` | Internet History & Relative Clauses | IT A6 | it_internet_terms,relative_pronouns | present_simple_regular,reading_skimming | ✅ **authored** · `adapt_with_attribution` |
| `les_a2_it_clean_code_basics` | Clean Code Practices: Refactoring, Code Smells, SOLID | `docs/codigolimpo.md` + `docs/arquitetura-limpa.md` (`adapt_with_attribution`) | it_computer_terms | reading_skimming | ✅ **authored** |
| `les_a2_it_testing_fundamentals` | Testing Fundamentals: Unit Tests, Mocks, TDD Cycle | `docs/tdd.md` (`adapt_with_attribution`) | it_computer_terms | reading_skimming | ✅ **authored** |
| `les_a2_it_typescript_basics` | TypeScript Basics: Types, Interfaces, Generics, Async | `docs/typescript-guia-pratico.md` (`adapt_with_attribution`) | it_computer_terms | reading_skimming | ✅ **authored** |
| `les_a2_it_algorithms_basics` | Algorithms & Data Structures Basics: Big O, Arrays, Hash Maps | `docs/algoritmos.md` (`adapt_with_attribution`) | it_computer_terms | reading_skimming | ✅ **authored** |

**`mod_a2_it_communication`** (A2→B1, IT Track)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_a2_it_email_technical` | Technical Emails & Documentation | IT A8 + dicionário Ch10 | email_vocab,it_computer_terms | email_vocab,email_register | ✅ **authored** |
| `les_a2_it_meeting_standup` | Stand-ups & Technical Meetings | Original (clean-room, Lote 2 Onda 2) | meeting_vocab | meeting_vocab | ✅ **authored** · reauthored_authored_material |
| `les_a2_it_incidents` | Incident Reports & Problem Statements | S02, S15 | it_internet_terms | meeting_vocab | ✅ **authored** · sourcing: `sourced_external` |
| `les_a2_it_nontech_tech` | Tech for Non-Technical Colleagues | dicionário Ch8 | it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** |
| `les_a2_it_word_formation` | Prefix, Suffix & Deceptive Cognates | IT A7 | prefixes_suffixes | reading_skimming,reading_scanning | ✅ **authored** |
| `les_a2_it_pr_tickets` | PRs, Tickets & Code Comments | dicionário Ch10 — "pull request" is in Ch10 (Mensagens e chat), not Ch8-9 | email_vocab,it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** |

**`mod_b1_it_technical`** (B1, IT Track)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_b1_it_architecture_vocab` | Architecture Discussions | S16, S05, S01 | it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** · reauthored_authored_material |
| `les_b1_it_debugging` | Debugging & Error Reporting | S09, S13, S14, S11 | it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** · sourcing: `sourced_external` |
| `les_b1_it_code_review` | Code Review Comments | S07, S06, S08, S10, S18 | it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** · reauthored_authored_material |
| `les_b1_it_presentations` | Technical Presentations | Original (clean-room, Lote 1) | meeting_vocab | meeting_vocab,it_computer_terms | ✅ **authored** · reauthored_authored_material |
| `les_b1_it_acronyms_deep` | Advanced Acronyms & Jargon | dicionário Bônus1 | acronyms_corporate | reading_skimming,reading_scanning | ✅ **authored** |
| `les_b1_it_write_docs` | Writing Documentation & RFCs | S01, S10, S16 | writing_formal_email,writing_summary | svo_order,explicit_subject,tense_consistency,reading_skimming,reading_scanning | ✅ **authored** · sourcing: `sourced_external` |
| `les_b1_it_ddd_modeling` | Domain-Driven Design: Aggregates, Entities, Value Objects, Repositories | `docs/ddd-rapido.md` (`adapt_with_attribution`) | it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** |
| `les_b1_it_bdd_specs` | BDD Specifications: Given-When-Then, Acceptance Criteria, Scenario Writing | `docs/bdd-in-action.md` (`adapt_with_attribution`) | it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** |
| `les_b1_it_ux_collab` | UX Collaboration: Wireframes, Prototypes, Personas, Accessibility | `docs/ux-design.md` (`adapt_with_attribution`) | it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** |
| `les_b1_it_devops_basics` | DevOps Basics: CI/CD, Pipelines, Containers, Observability | `docs/arquitetura-limpa.md` + `docs/agile.md` (`adapt_with_attribution`) | it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** |

**`mod_b1_grammar_consolidate`** (B1, General)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_b1_tenses_review` | Tenses Consolidation: Present/Past/Future | apostila 3.2 + IT A4-A5 | present_simple_regular,past_simple_regular,future_will,future_going_to,present_continuous | present_simple_regular,past_simple_regular,future_will,future_going_to,present_continuous | ✅ **authored** |
| `les_b1_modals` | Modal Verbs Deep Dive | IT A5 + frases Ch4 | modal_can_need,hedging | modal_can_need | ✅ **authored** |
| `les_b1_conditionals` | Conditionals 1 & 2 | IT A5 | hedging | modal_can_need,hedging | ✅ **authored** |
| `les_b1_passive` | Passive Voice | IT A6 | present_simple_regular | present_simple_regular,past_simple_regular,future_will,future_going_to,present_continuous | ✅ **authored** |
| `les_b1_reported_speech` | Reported Speech | frases Ch4 | tense_consistency | hedging | ✅ **authored** |
| `les_b1_question_forms` | Advanced Question Forms | apostila 3.1.4 + IT A4 | interrogative_pronouns,present_simple_do_does | hedging | ✅ **authored** |

**`mod_b1_workplace_adv`** (B1, General)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_b1_negotiation` | Negotiation Language | frases + dicionário Ch4 | meeting_vocab | tense_consistency,interrogative_pronouns,present_simple_do_does | ✅ **authored** |
| `les_b1_presentation_skills` | Presentation & Pitching | dicionário Ch4-5 | meeting_vocab,fluency_pace | tense_consistency,interrogative_pronouns,present_simple_do_does | ✅ **authored** |
| `les_b1_leadership_feedback` | Leadership & Feedback Loops | dicionário Ch6 | meeting_vocab | tense_consistency,interrogative_pronouns,present_simple_do_does,meeting_vocab | ✅ **authored** |
| `les_b1_finance_business` | Finance & Business Vocabulary | dicionário Ch5 | acronyms_corporate | acronyms_corporate | ✅ **authored** |
| `les_b1_hr_career` | HR & Career Vocabulary | dicionário Ch6 | acronyms_corporate | acronyms_corporate | ✅ **authored** |
| `les_b1_sales_marketing` | Sales & Marketing Vocabulary | dicionário Ch7 | acronyms_corporate | acronyms_corporate | ✅ **authored** |

**`mod_b2_professional`** (B2, General)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_b2_register_nuance` | Register & Nuance | leia Ch7 + frases | email_register,hedging | email_register,hedging | ✅ **authored** |
| `les_b2_professional_email_advanced` | Advanced Professional Correspondence | leia Ch7 | email_register,writing_formal_email | email_register,writing_formal_email | ✅ **authored** |
| `les_b2_professional_review` | Writing: Review & Evaluation | leia Ch8 | writing_opinion_review | writing_opinion_review | ✅ **authored** |
| `les_b2_professional_argument` | Writing: Argumentative Essay | leia Ch9 | writing_argumentative | writing_argumentative | ✅ **authored** |
| `les_b2_professional_summary` | Writing: Summarizing | leia Ch10 | writing_summary | writing_summary | ✅ **authored** |
| `les_b2_culture_brazil_vs_usa` | BR vs. US Business Culture | dicionário Ch12 | acronyms_corporate | acronyms_corporate | ✅ **authored** |

**`mod_b2_it_senior`** (B2, IT Track)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_b2_it_mentoring` | Mentoring & Knowledge Transfer | S18, S07 | meeting_vocab | reading_skimming,reading_scanning | ✅ **authored** · reauthored_authored_material |
| `les_b2_it_architecture_decisions` | Architecture Decision Records | S03, S04, S05 | it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** · sourcing: `sourced_external` |
| `les_b2_it_strategy` | Technical Strategy Communication | dicionário Ch4-5 | acronyms_corporate | reading_skimming,reading_scanning | ✅ **authored** |
| `les_b2_it_incident_postmortem` | Incident Postmortems | S02 | it_internet_terms | it_internet_terms | ✅ **authored** · sourcing: `sourced_external` |
| `les_b2_it_jargon_mastery` | Full Jargon Fluency | dicionário (all 250) | acronyms_corporate | reading_skimming,reading_scanning | ✅ **authored** |
| `les_b2_it_rfc_writing` | Writing RFCs & Design Docs | S17, S01 + RFC 2119 (⚠️) | writing_formal_email,writing_summary | reading_skimming,reading_scanning | ✅ **authored** · reauthored_authored_material |
| `les_b2_it_advanced_patterns` | Advanced Patterns & Anti-Patterns: Legacy Code, Refactoring Strategies | `docs/codigolimpo.md` + `docs/arquitetura-limpa.md` (`adapt_with_attribution`) | it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** |
| `les_b2_it_technical_leadership` | Technical Leadership: Architecture Reviews, Trade-off Communication, Mentoring at Scale | `docs/bdd-in-action.md` + `docs/agile.md` (`adapt_with_attribution`) | meeting_vocab,it_computer_terms | reading_skimming,reading_scanning | ✅ **authored** |

**`mod_b2_cert_prep`** (B2, Both Tracks)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_b2_toeic_reading` | TOEIC: Reading & Listening | exam-focused | reading_3levels | reading_skimming,reading_scanning | ✅ **authored** |
| `les_b2_toeic_writing` | TOEIC: Writing | exam-focused | writing_formal_email,writing_argumentative | writing_formal_email,writing_argumentative | ✅ **authored** |
| `les_b2_ielts_writing` | IELTS: Academic Writing | exam-focused | writing_formal_email,writing_argumentative | writing_formal_email,writing_argumentative | ✅ **authored** |
| `les_b2_celpe_br` | CELPE-Bras: Speaking | exam-focused | fluency_pace | fluency_pace | ✅ **authored** |
| `les_b2_exam_vocab` | Exam High-Frequency Vocabulary | all sources | acronyms_corporate | acronyms_corporate | ✅ **authored** |
| `les_b2_exam_simulations` | Full Exam Simulations | all sources | reading_3levels,writing_formal_email,writing_argumentative | reading_3levels,writing_formal_email,writing_argumentative | ✅ **authored** |

**`mod_b1_fluency_project`** (B1, Both Tracks)
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
|-----------|-------|--------|------------|---------------------|--------|
| `les_b1_project_case_study` | Case Study Presentation | S01, S05, S10 | writing_formal_email,fluency_pace | writing_formal_email,writing_summary,reading_skimming,reading_scanning | ✅ **authored** · sourcing: `sourced_external` |
| `les_b1_project_retrospective` | Retrospective & Post-mortem Talk | frases Ch9 | meeting_vocab,hedging | tense_consistency,interrogative_pronouns,present_simple_do_does,meeting_vocab | ✅ **authored** |
| `les_b1_project_client_sim` | Client Simulation Scenario | frases Ch4-5 | meeting_vocab | meeting_vocab,meeting_vocab,fluency_pace | ✅ **authored** |
| `les_b1_project_negotiation_roleplay` | Negotiation Role-play | dicionário Ch4 | meeting_vocab,hedging | meeting_vocab,meeting_vocab,fluency_pace | ✅ **authored** |
| `les_b1_project_integrated_review` | Integrated Skills Review | all sources | all_skills | all_skills | ✅ **authored** |
| `les_b1_project_presentation_final` | Final Project Presentation | leia Ch8 | fluency_pace,meeting_vocab | fluency_pace,meeting_vocab,writing_formal_email,writing_summary | ✅ **authored** |

**Remediation Nodes** (created on demand by §6.4 trigger)
| Lesson ID | Target Skill | Trigger |
|-----------|--------------|---------|
| `les_rem_pronunciation_th_vw` | TH, V/W minimal pairs | ✅ **authored** · trigger: pronunciation θ < -1.5 |
| `les_rem_listening_slow_clear` | Listening at reduced speed | ✅ **authored** · trigger: listening θ < -1.5 |
| `les_rem_grammar_be_pronouns` | To Be + Pronouns | ✅ **authored** · trigger: grammar θ < -1.5 |
| `les_rem_confidence_builder` | Affective filter / false beginner | ✅ **authored** · trigger: profile = false_beginner |
| `les_rem_writing_svo` | SVO order + explicit subject | ✅ **authored** · trigger: writing mastery < 0.60 |

---

## 4.4 SOURCING INTEGRITY — WHAT THE CORPUS ACTUALLY SUPPORTS (added)

> **This section was written because a registry citation was checked against its source and found
> false.** The original `content-map.md` §8.5 G1 named **4** undersourced lessons. Verifying every
> bare `IT A<n>` citation against the IT book's own Sumário (lines 145–200) found **13**.

### 4.4.1 The finding

The IT book (`Ingles-Tecnico-Para-Informatica.md`) is an **8-lesson basic course**: What are
computers / What can you do / Types of computers / Parts of computers / Parts of computers II /
History of the internet / History of HTML / History of e-mail. It is a **grammar-and-hardware** book.

**29 of the 33 bare `IT A<n>` citations in the registry are correct** and were verified against the
Sumário — e.g. `les_a1_there_is_are` → A6.4 "There + Verb to be"; `les_a1_false_cognates` → A7.4
"Deceptive cognates"; `les_a2_it_system_unit` → A5.1 "System unit". The error class is narrow and
specific: it appears where a citation was stretched to cover **discourse** the book does not contain.

Keyword counts across **all 7 source files**:

| Term | Hits | Term | Hits |
|------|------|------|------|
| `architecture` | **0** | `incident` | **0** |
| `code review` | **0** | `RFC` | **0** |
| `debug` | 2 (1 usable: IT L3399 `bug = erro, falha`) | `mentoring` / `mentoria` | **0** |
| `meeting` | 16 (real) | `stand-up` / `standup` | **0** |

### 4.4.2 Scope of the gap, by module

| Module | Lessons | Sourced | `deferred_no_source` |
|--------|--------:|--------:|---------------------:|
| `mod_a1_foundation` … `mod_b1_grammar_consolidate` (13 general modules) | 78 | **78** | 0 |
| `mod_a2_it_fundamentals` | 6 | 5 | 1 |
| `mod_a2_it_communication` | 6 | 4 | 2 |
| `mod_b1_it_technical` | 6 | **1** | 5 |
| `mod_b2_it_senior` | 6 | **2** | 4 |
| `mod_b1_fluency_project` | 6 | 5 | 1 |
| **Total** | **108** | **95** | **13** |

> **Snapshot, not current state — read the sizes here with the date.** This table is the finding as it
> stood on 2026-09-30, when every module held 6 lessons and the IT track was **18** lessons across
> three modules. Those three have since been expanded to **10 + 10 + 8** by adding lessons sourced
> from the `docs/*.md` Portuguese technical books (Clean Code, TDD, TypeScript, algorithms, DDD, BDD,
> UX, clean architecture), taking the module count to **118**. `curriculum-graph-spec.md` §4.3 is
> authoritative and `verify-integrity.py` [2] enforces the sizes. The `deferred_no_source` column is
> **retired** — §4.4.5 repointed all 13 — so only the `Lessons` column is a size that can drift, and
> it is the one this note fixes.

**The pattern is not random.** All 14 general-track modules are 100% sourced. Every unsourced lesson
is in an IT-track or project module. The corpus supports *language about computers* and *corporate
vocabulary* at every level; it does not support **professional IT discourse** — architecture,
debugging, code review, incidents, stand-ups, mentoring, RFCs, technical presentations.

### 4.4.3 Decision — the IT track terminates at A2

1. **Correctness (not a scope choice).** The 13 false or inadequate `Source` cells are replaced with
   `**— none —**`. A registry row claiming `IT A5` for debugging, when A5 is *Parts of computers II*,
   would propagate a fabricated `provenance.source_locator` into every pack authored from it. That is
   exactly the failure `AGENTS.md` forbids.
2. **Status.** All 13 are `deferred_no_source`. IDs are **kept** so the registry, the diagnostic
   start-node table, and the IRT skill map stay stable — deleting them would orphan references and
   silently shrink the published curriculum.
3. **Entry points repointed** — the original three pointed into the unsourced set, which would have
   routed learners to lessons that cannot be authored:

   | Placement | Was (unsourced) | Now (verified source) |
   |-----------|-----------------|----------------------|
   | A2 / IT | `les_a2_it_terms_basics` | `les_a2_it_computer_parts` (IT A4.1) |
   | B1 / IT | `les_b1_it_architecture_vocab` | `les_b1_it_acronyms_deep` (dicionário Bônus 1, 40 terms) |
   | B2 / IT | `les_b2_it_mentoring` | `les_b2_it_jargon_mastery` (dicionário full index) |
   | B1 / General | a `les_b1_grammar_*` id that never existed in the registry | `les_b1_tenses_review` |

4. **Consequence to disclose, not to hide.** A B1/B2 learner on the IT track receives **corporate
   general English**, not IT discourse. This is a limitation of the corpus, not a design preference.
   The product must say so at track selection; silently serving corporate English under an "IT" label
   is the failure mode to avoid.

### 4.4.4 Re-entry criterion

A `deferred_no_source` lesson returns to `designed` when it has **either** (a) a verified source
locator whose section content matches the lesson title, **or** (b) an explicit
`provenance: authored` + `reviewed_by` decision recorded in `content-map.md` §11.

### 4.4.5 RESOLUTION — all 13 repointed to external sources (2026-09-30)

Criterion (a) was met for all 13, via `external-sources.md`, which fetches and licence-checks 19
external sources. **§4.4.1–4.4.4 above are left standing**: the finding is the evidence for the
registry design, and a registry that has forgotten why it was built is one that will drift back.

**The plan of record for this was wrong in a way that mattered.** The intended primary source for
incident and postmortem material was the **Google SRE Book**, assumed to be CC-BY. It is
**CC-BY-NC-ND-4.0**: `NC` forbids commercial use and `ND` forbids derivatives, so it could not have
been adapted into a lesson at all. The substitute — Google Cloud Well-Architected, genuine
CC-BY-4.0 — carries the same blameless-postmortem framing in framework prose that suits a non-native
reader better than the original's narrative. Three other "obviously canonical" sources were
discarded on the same test: AWS Well-Architected (all rights reserved), Microsoft Writing Style
Guide (all rights reserved), Diátaxis (no licence at all). Full evidence in
`external-sources.md` §0 and §3.

**New status values.** `deferred_no_source` is retired. Coverage is now graded, because "sourced"
was hiding the distinction that caused the original error:

| Status | Count | Meaning |
|--------|------:|---------|
| `sourced_external` | **7** | licence permits adaptation **and** the source's discourse matches the lesson title (still pending full reautoria) |
| `sourced_external_thin` | **0** | licence permits, but coverage is partial — none remain |
| `reauthored_authored_material` | **30** | fully reauthored in clean-room as 100% original `authored_material` (Lote 1: `les_b1_it_presentations`, `les_b1_it_architecture_vocab`, `les_b1_it_code_review`, `les_b2_it_mentoring`, `les_b2_it_rfc_writing`; Lote 2 Onda 2: `les_a1_greetings`, `les_a1_intro_dialogue`, `les_a1_daily_basics`, `les_a1_pronunciation_intro`, `les_a2_it_meeting_standup`; Onda 2 — Lote 2 (batch 2): `les_a1_alphabet_sounds`, `les_a1_en_us_en_gb`, `les_a1_to_be_forms`, `les_a1_pronouns_subject_object`, `les_a1_pronouns_possessive`; Onda 2 — Lote 3 (batch 3) — Fase A: `les_a1_pronouns_demonstrative`, `les_a1_wh_questions`, `les_a1_numbers_colors`, `les_a1_days_months`, `les_a1_time_dates`; Onda 2 — Lote 4 (batch 4) — Fase B: `les_a1_food`, `les_a1_occupations`, `les_a1_regular_verbs_past`, `les_a1_present_simple`, `les_a1_present_simple_questions`; Onda 2 — Lote 5 (batch 5) — Fase C: `les_a1_have_has`, `les_a1_there_is_are`, `les_a1_reading_skimming`, `les_a1_false_cognates`, `les_a2_phone_calls`) |
| `blocked_no_adequate_source` | **0** | none |
| `deferred_no_source` | **0** | retired |

There are no remaining `sourced_external_thin` lessons: `les_a2_it_meeting_standup` (previously thin — no source supplied *spoken* stand-up register, only normative prose) was reautored as 100% `authored_material` in Lote 2 Onda 2 (clean-room). `les_b2_it_mentoring` and `les_b2_it_rfc_writing` were reautored as 100% `authored_material` in Lote 1 (clean-room). `les_b1_it_presentations`, previously `blocked_no_adequate_source`, was also reautored and unlocked as `authored_material` in Lote 1.

**Two structural gaps the external search could not close**, and which are stated rather than
papered over:

1. **No permissively-licensed source gives a spoken, non-specialist-facing IT register.** Every one
   of the 19 accepted sources is *written documentation* register. Sources supply the words; they do
   not supply turn-taking. `listening-corpus.md` is therefore `authored`, and stays authored.
2. **Technical presentations is a real hole**, not a licensing problem: the best permitted source is
   a ~1-page promotion guide.

**Curriculum coverage was 108/108 sourced on the resolution date, but that number is not the point.**
Coverage went from 95/108 to 108/108 while one lesson became *unauthorable* as specified and three
became partially-authored. The honest count was **104 fully source-supported, 3 thin, 1 blocked** —
which is a worse-looking and more accurate number than 108/108. (The registry has since grown to
**118** module lessons — see the §4.4.2 snapshot note; the 13 externally-sourced lessons are unchanged,
and the former thin/blocked subset has since been fully reauthored as `authored_material`, so today's
honest breakdown is **118 fully supported, 0 thin, 0 blocked**.)

### 4.4.6 Entry points: restore the original

§4.4.3(3) repointed three entry points away from the unsourced lessons. Now that those lessons are
sourced or reauthored, the original routing is restored (including `les_b1_it_presentations`, now
reauthored and unlocked in Lote 1):

| Placement | Repointed in §4.4.3 | Now | Why |
|-----------|---------------------|-----|-----|
| A2 / IT | `les_a2_it_computer_parts` | `les_a2_it_terms_basics` | sourced (S16, S01) |
| B1 / IT | `les_b1_it_acronyms_deep` | `les_b1_it_architecture_vocab` | reauthored as 100% `authored_material` (Lote 1) — previously sourced (S16, S05, S01) |
| B2 / IT | `les_b2_it_jargon_mastery` | `les_b2_it_mentoring` | reauthored as 100% `authored_material` (Lote 1) — previously sourced but thin, now fully original |
| B1 / General | `les_b1_tenses_review` | unchanged | was never an IT-track dependency |

## 5. DIAGNOSTIC → START NODE MAPPING

### 5.1 Mapping Algorithm
```python
def map_diagnostic_to_start_node(diagnostic_output):
    """
    Input: diagnostic_output from diagnostic-spec.md §3.6
    Output: (start_node_id, remediation_nodes[])
    """
    overall = diagnostic_output["overall"]["theta"]
    skills = diagnostic_output["skills"]
    profile = diagnostic_output.get("profile", "")
    
    # CEFR band from overall θ
    if overall < -1.0: cefr_band = "A1"
    elif overall < 0.5: cefr_band = "A2"
    elif overall < 1.5: cefr_band = "B1"
    else: cefr_band = "B2"
    
    # Track: IT if dev role + vocab θ > grammar θ
    track = "IT" if diagnostic_output.get("role") == "dev" and skills["vocabulary"]["theta"] > skills["grammar"]["theta"] else "General"
    
    # Weak skills needing remediation
    weak_skills = [s for s, v in skills.items() if v["theta"] < -1.0]
    
    # Base start node per CEFR + Track
    start_nodes = {
        ("A1", "General"): "les_a1_alphabet_sounds",
        ("A1", "IT"): "les_a1_alphabet_sounds",  # Same foundation
        ("A2", "General"): "les_a2_greetings_intro",
        # restored 2026-09-30 (§4.4.6): the three IT entry points were repointed in §4.4.3(3)
        # only because those lessons had no source. All three are now sourced or reauthored, so the
        # original routing is correct again.
        ("A2", "IT"): "les_a2_it_terms_basics",        # S16, S01 — sourced_external
        ("B1", "General"): "les_b1_tenses_review",      # was a les_b1_grammar_* id, absent from the registry
        ("B1", "IT"): "les_b1_it_architecture_vocab",   # reauthored as authored_material (Lote 1); previously S16, S05, S01
        ("B2", "General"): "les_b2_register_nuance",
        ("B2", "IT"): "les_b2_it_mentoring",           # reauthored as authored_material (Lote 1); previously thin (S18, S07)
    }
    
    start_node = start_nodes[(cefr_band, track)]
    
    # Remediation micro-lessons (2-3 max)
    remediation = []
    if "pronunciation" in weak_skills:
        remediation.append("les_rem_pronunciation_th_vw")
    if "listening" in weak_skills:
        remediation.append("les_rem_listening_slow_clear")
    if profile == "false_beginner_suspected":
        remediation.append("les_rem_confidence_builder")
    
    return start_node, remediation
```

### 5.2 Example Mappings
| Diagnostic Profile | Overall θ | Weak Skills | Track | Start Node | Remediation |
|-------------------|-----------|-------------|-------|------------|-------------|
| True A1 beginner | -1.8 | All | General | `les_a1_alphabet_sounds` | — |
| False beginner (grammar ok) | -0.2 | Pronunciation, Listening | General | `les_a2_greetings_intro` | `les_rem_pronunciation_th_vw`, `les_rem_listening_slow_clear` |
| Dev, A2 vocab, A1 grammar | 0.1 | Grammar, Pronunciation | IT | `les_a2_it_terms_basics` | `les_rem_grammar_be_pronouns`, `les_rem_pronunciation_th_vw` |
| B1 strong, targeting IT | 1.2 | — | IT | `les_b1_it_architecture_vocab` | — |

---

## 6. MASTERY-GATED PROGRESSION RULES

### 6.1 Lesson → Lesson (Within Module)
```
Can enter les_B iff:
  ∀ skill ∈ prereq_skills(les_B): P(mastery_skill | history) ≥ 0.85
  AND CI_95_lower(P(mastery_skill)) > 0.70
```

### 6.2 Module → Module
```
Can enter mod_Y iff:
  Mean_{skills in mod_X} P(mastery) ≥ 0.85
  AND min_{skills in mod_X} P(mastery) ≥ 0.60
  AND all lessons in mod_X completed OR mastered via acceleration
```

### 6.3 Acceleration (Skip) Rules
```
Can skip les_B iff:
  P(mastery_skills(les_B)) ≥ 0.95
  AND CI_95_lower > 0.85
  AND time_on_les_B < 0.5 * median_time(les_B)
  AND diagnostic θ for those skills > les_B target θ
```

### 6.4 Remediation Trigger
```
If P(mastery_skill) declining 3+ consecutive sessions:
  Insert remediation node targeting that skill
  Remediation node = highest-weighted les with that skill as primary
  After remediation: re-evaluate original lesson gate
```

---

## 7. SKILL TRANSFER MATRIX (Edge Weights)

### 7.1 Example: `les_a2_greetings_intro` → `les_a2_small_talk`
```json
{
  "from": "les_a2_greetings_intro",
  "to": "les_a2_small_talk",
  "skill_transfer": {
    "present_simple_be": 0.9,
    "wh_questions_how": 0.7,
    "greetings_vocab": 0.8,
    "th_voiced": 0.5,
    "th_unvoiced": 0.5,
    "h_aspirated": 0.4,
    "connected_speech": 0.3
  },
  "new_skills_introduced": ["past_simple", "weekend_vocab", "connected_speech"]
}
```

### 7.2 Transfer Decay
- Skills not practiced decay: `P(know)_t = P(know)_0 * exp(-λ * days)`
- λ calibrated per skill (vocab: 0.02, grammar: 0.005, pronunciation: 0.03)
- FSRS handles scheduling; graph defines *what* transfers

---

## 8. IT ENGLISH TRACK (Parallel Path)

### 8.1 Track Switching Rules
- **Entry**: At diagnostic (role=dev) OR after `mod_a2_workplace_intro` (opt-in)
- **Merge Points**: `mod_b1_fluency_project`, `mod_b2_cert_prep` (both tracks converge)
- **Swap**: General ↔ IT at module boundaries only (no mid-module switch)

### 8.2 IT Track Module Substitutions
| General Module | IT Track Replacement | Overlap Skills |
|----------------|---------------------|----------------|
| `mod_a2_travel` | `mod_a2_it_fundamentals` | Basic vocab, present simple |
| `mod_a2_skills_rw` | `mod_a2_it_communication` | Reading, writing, workplace register |
| `mod_b1_workplace_adv` | `mod_b1_it_technical` | Modals, conditionals, hedging |
| `mod_b2_professional` | `mod_b2_it_senior` | Register, nuance, culture |

---

## 9. CONTENT SOURCE TRACEABILITY

### 9.1 Markdown → Module → Lesson Mapping
| Markdown File | Modules Fed | Extraction Method |
|---------------|-------------|-------------------|
| `apostila-ingles-para-iniciantes-impresso.md` | `mod_a1_foundation`, `mod_a1_grammar_start`, `mod_a1_vocab_core`, `mod_b1_grammar_consolidate` | Chapter/section → lesson; exercises → practice items |
| `Ingles-basico.md` | `mod_a1_comm_basic`, `mod_b1_grammar_consolidate` | Chapter → lesson; dialogues → input texts |
| `frases-ingles-trabalho.md` | `mod_a2_workplace_intro`, `mod_a2_workplace_comm`, `mod_a2_workplace_tasks`, `mod_b1_workplace_adv` | Chapter (100 frases) → 3 modules; mini-dialogs → role-plays |
| `Ingles para Viagens.md` | `mod_a2_travel` | Section → lesson; phrases → vocab + dialogs |
| `Ingles-Tecnico-Para-Informatica.md` | `mod_a2_it_fundamentals`, `mod_a2_it_communication`, `mod_b1_it_technical`, `mod_b2_it_senior` | Chapter → module; glossaries → vocab banks |
| `leia-e-escreva-melhor-em-ingles.md` | `mod_a2_skills_rw`, `mod_b1_workplace_adv`, `mod_b2_professional` | Strategy chapters → lessons; exercises → practice |
| `Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md` | `mod_a2_it_fundamentals`, `mod_b2_it_senior` | Entries → flashcards; categories → themed lessons |

---

## 10. GRAPH VALIDATION RULES (Automated Checks)

| Rule | Check | Failure Action |
|------|-------|----------------|
| **Acyclic** | Topological sort succeeds | Block deploy |
| **Reachable** | All nodes reachable from at least one diagnostic entry | Flag orphan nodes |
| **Prereq Consistency** | Skill coverage of prereqs ⊇ skills required by lesson | Auto-suggest missing prereqs |
| **CEFR Monotonicity** | θ target strictly increases along any path | Flag violations |
| **Source Coverage** | Every markdown section mapped to ≥1 lesson | Report gaps |
| **Skill Balance** | Each skill domain ≥15% of lessons per CEFR | Rebalance |
| **Remediation Coverage** | Every skill has ≥1 remediation node | Create missing remediation |

---

## 11. INTEGRATION POINTS

| Component | Graph Provides | Graph Consumes |
|-----------|----------------|----------------|
| **Diagnostic** | Start node + remediation map | Diagnostic θ + skill profile |
| **Stats Engine** | Skill IDs, prereq sets, CEFR targets | P(mastery), θ estimates, CI |
| **Content Selector** | Available next nodes (unlocked) | Learner model, affective state |
| **Spaced Repetition** | Skill → review items mapping | Due items, mastery probs |
| **Pedagogical Memory** | Node completion history, path taken | Full traversal log |
| **Gamification** | Milestone nodes = badge triggers | Progress % per module/CEFR |

---

## 12. MVP SCOPE (First 3 Modules)

| Module | Lessons | Status | Source Ready |
|--------|---------|--------|--------------|
| `mod_a1_foundation` | 6 | Design | `apostila...` Ch 1-2 ✅ |
| `mod_a1_grammar_start` | 6 | Design | `apostila...` Ch 3-4 ✅ |
| `mod_a2_workplace_intro` | 6 | **Lesson 1 done** (`les_a2_greetings_intro`) | `frases...` Ch 2 ✅ |

---

## 13. GRAPH STATE SUMMARY (Verified)

| Metric | Value |
|--------|-------|
| Modules defined (§3) | **18** |
| Lessons registered (§4.3) | **118** |
| Remediation nodes (§4.3) | 5 |
| Total lesson IDs in system | **123** |
| Lessons per module | 6, except `mod_a2_it_fundamentals` and `mod_b1_it_technical` (10 each) and `mod_b2_it_senior` (8) |
| Lessons authored | **123** — every registry ID has a file declaring it |
| Lessons blocked | **0** |
| Practice packs authored | **123** — 37 in the `pack-les-*.md` schema, 86 in `pack_les_*_v1.md`; see `post-lesson-practice-spec.md` §12 |
| Source files mapped | 7 / 7 (100%) |
| Source sections mapped | 87 / 87 (100%, 6 marked meta) |
| Orphan lesson IDs across all specs | **0** |

> All figures above are **counted from §4.3**, not estimated. If a number here disagrees with the registry, the registry wins and this table is wrong. `verify-integrity.py` check [2] recomputes §4.3 against the disk on every run, so this table has no way to drift silently again — which is how it came to say `Lessons authored | 1` against 122 files.

**Spec Dependency Order:**
```
stats-progress-evaluation-spec.md  (BKT/IRT/FSRS — no deps)
  ↓
diagnostic-spec.md                 (CAT — needs IRT item bank)
  ↓
curriculum-graph-spec.md           (DAG — needs diagnostic mapping)
  ↓
content-map.md                     (extraction — needs graph nodes)
  ↓
assessment-item-spec.md            (item schema + calibration)
  ↓
post-lesson-practice-spec.md       (L1/L2/L3 fixação layers)
  ↓
lesson-*.md                        (lesson authoring — needs all above)
  ↓
pack-*.md                          (pack authoring — validates the specs)
```

**Repo Inventory (verified):**
| File | Role | Status |
|------|------|--------|
| `AGENTS.md` | Pedagogical architecture v3.0 | ✅ source of truth |
| `stats-progress-evaluation-spec.md` | BKT + IRT 2PL + FSRS | ✅ |
| `diagnostic-spec.md` | CAT placement | ✅ |
| `curriculum-graph-spec.md` | 18 modules, 123 lesson IDs | ✅ |
| `content-map.md` | Source extraction, 7 files verified | ✅ |
| `post-lesson-practice-spec.md` | L1/L2/L3 fixação | ✅ validated ×1 |
| `assessment-item-spec.md` | Item schema, calibration, distractors, DIF, lifecycle | ✅ |
| `lesson-15min-workplace-greetings.md` | 1 lesson authored | ✅ |
| `pack-les-a2-greetings-intro.md` | 1 pack, 7 items | ✅ |

---

*This graph specification closes the loop between diagnostic placement, lesson templates, statistical modeling, and content sources. Next: `content-map.md` (granular markdown → skill → item mapping) and `assessment-item-spec.md` (IRT item authoring schema).*