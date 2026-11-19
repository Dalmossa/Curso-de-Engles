# Plano de Reautoria Jurídica — ITS Platform

**Gerado em:** 2026-11-16  
**Atualizado (Lote 1, Onda 1):** 2026-11-16 — reautoria clean-room de 5 lições/packs IT B1/B2 para `authored_material` (100% original).  
**Atualizado (Lote 1, Onda 2, Fundação A1/A2):** 2026-11-16 — reautoria clean-room de 5 lições/packs A1/A2 para `authored_material` (100% original).  
**Atualizado (Onda 2 — Lote 2 (batch 2), Fundação A1/A2):** 2026-11-16 — reautoria clean-room de 5 lições/packs A1 para `authored_material` (100% original).  
**Atualizado (Onda 2 — Lote 3 (batch 3) — Fase A, Fundação A1/A2):** 2026-11-16 — reautoria clean-room de 5 lições/packs A1 para `authored_material` (100% original).  
**Atualizado (Onda 2 — Lote 4 (batch 4) — Fase B, Fundação A1/A2):** 2026-11-16 — reautoria clean-room de 5 lições/packs A1 para `authored_material` (100% original).  
**Atualizado (Onda 2 — Lote 5 (batch 5) — Fase C, Fundação A1/A2):** 2026-11-16 — reautoria clean-room de 4 lições A1 + 1 lição A2 para `authored_material` (100% original).  
**Atualizado (Onda 2 — Lote 6 (batch 6), Fundação A1/A2):** 2026-11-18 — reautoria clean-room de 1 lição A1 + 9 lições A2 para `authored_material` (100% original).  
**Atualizado (Onda 2 — Lote 7 (batch 7), Fundação A2):** 2026-11-18 — reautoria clean-room de 10 lições A2 para `authored_material` (100% original).  
**Atualizado (Onda 2 — Lote 8 (batch 8), Fundação A2 + B1-IT):** 2026-11-18 — reautoria clean-room de 10 lições (4 writing + 6 IT) para `authored_material` (100% original).  
**Escopo:** inventário original em modo leitura + atualizações dos Lotes 1 e 2 e das Onda 2 — Lote 2 (batch 2), Lote 3 (batch 3) — Fase A, Lote 4 (batch 4) — Fase B e Lote 5 (batch 5) — Fase C, Lote 6 (batch 6), Lote 7 (batch 7) e Lote 8 (batch 8) registradas abaixo.  
**Fontes normativas lidas:** `AGENTS.md` (Licensing/Provenance), `PRD.md` (§2, §4, §7, RF-004, RF-008), `specs/curriculum-graph-spec.md` (§4.3–§4.4).  
**Gate:** `python3 verify-integrity.py` deve permanecer `PASS 14/14`.

---

## 1. Critérios de publicabilidade e valores válidos (extraídos das specs)

### 1.1 Bases de reuso/licenciamento (AGENTS, PRD §2, §7, RF-004/RF-008)
| Valor | Significado | Publicabilidade (estado atual) | Obrigação |
|---|---|---|---|
| `cite_only` | Material original do autor; fonte citada como bibliografia, sem reprodução/adaptação de texto | **Pendente de reautoria** para a meta “100% `authored_material`” (não depende de permissão da fonte restrita, mas não é declarado `authored_material`) | Citação; nenhuma reprodução |
| `adapt_with_attribution` | Adaptação de fonte externa permissiva (CC-BY/MIT/Apache etc.) | **Pendente de reautoria** para a meta “100% `authored_material`” (publicável com atribuição, mas não 100% autoral) | Publicar string de atribuição (`external-sources.md` §7.1) |
| `adapt_requires_permission` | Conteúdo “list-shaped” cuja lista é a fonte (ou derivado de fonte restrita) | **Não publicável** sem permissão escrita, perpétua e com direito de redistribuição | Obter permissão; até lá, authored-but-unpublishable |
| `authored_material` | Conteúdo 100% autoral, sem dependência de adaptação/reprodução de fonte externa restrita | **Liberado/publicável** (meta final) | Declaração de proveniência autoral conforme contrato do artefato |

### 1.2 Status/sourcing relevantes no currículo (PRD §4, `curriculum-graph-spec.md` §4.3–§4.4)
- **Vocabulário de estado (PRD §4):** `authored` (arquivo existe e passa checks), `specified`, `unauthored`, `blocked`, `withdrawn`.
- **Registro §4.3:** coluna `Status` = estado de autoria no filesystem; sufixos nomeados preservam informação (ex.: `· cite_only`, `· sourcing: sourced_external`, `· trigger`). Nó bloqueado explícito: ``blocked_no_adequate_source`` (`les_b1_it_presentations`, 1).
- **Sourcing IT pós-§4.4.5:** `sourced_external` (7), `sourced_external_thin` (0), `blocked_no_adequate_source` (0), `deferred_no_source` aposentado (0). `les_a2_it_meeting_standup`, `les_b2_it_mentoring` e `les_b2_it_rfc_writing` foram reautoradas como `authored_material` (Lotes 1 e 2).
- **Packs:** schema **canônico** `pack-les-*.md` (enforcement completo do check [9]) vs **legado v1** `pack_les_*_v1.md` (dívida de migração registrada em `post-lesson-practice-spec.md` §12 / PRD RF-001).

---

## 2. Resumo Executivo — Placar Jurídico

### 2.1 Inventário auditado (somente leitura)
- Lições em `lessons/` (`.md`): **123** arquivos. Total do registro: **123** lições, todas com arquivo.
- Packs em `packs/` (`.md`): **123** arquivos — **67 canônicos** (`pack-les-*.md`) + **56 legados v1** (`pack_les_*_v1.md`).
- Nó do registro sem arquivo de lição: **0**.
- Lições por nível/trilha: `A1|General`=24, `A2|General`=30, `A2|IT`=16, `B1|General`=18, `B1|IT`=9, `B1|Remediation`=5, `B2|General`=12, `B2|IT`=8.

### 2.2 Placar de proveniência das lições (estado atual × meta `authored_material`)
| Categoria | Qtde (lições) | Situação frente à meta 100% `authored_material` |
|---|---:|---|
| **Já `authored_material` (liberadas)** | **60** | Lote 1: `les_b1_it_presentations`, `les_b1_it_architecture_vocab`, `les_b1_it_code_review`, `les_b2_it_mentoring`, `les_b2_it_rfc_writing`; Lote 2 (Onda 2): `les_a1_greetings`, `les_a1_intro_dialogue`, `les_a1_daily_basics`, `les_a1_pronunciation_intro`, `les_a2_it_meeting_standup`; Onda 2 — Lote 2 (batch 2): `les_a1_alphabet_sounds`, `les_a1_en_us_en_gb`, `les_a1_to_be_forms`, `les_a1_pronouns_subject_object`, `les_a1_pronouns_possessive`; Onda 2 — Lote 3 (batch 3) — Fase A: `les_a1_pronouns_demonstrative`, `les_a1_wh_questions`, `les_a1_numbers_colors`, `les_a1_days_months`, `les_a1_time_dates`; Onda 2 — Lote 4 (batch 4) — Fase B: `les_a1_food`, `les_a1_occupations`, `les_a1_regular_verbs_past`, `les_a1_present_simple`, `les_a1_present_simple_questions`; Onda 2 — Lote 5 (batch 5) — Fase C: `les_a1_have_has`, `les_a1_there_is_are`, `les_a1_reading_skimming`, `les_a1_false_cognates`, `les_a2_phone_calls`; Onda 2 — Lote 6 (batch 6): `les_a1_articles_nouns`, `les_a2_ask_for_help`, `les_a2_deadlines_tasks`, `les_a2_feedback_praise`, `les_a2_corporate_wrapup`, `les_a2_corpus_intro`, `les_a2_past_narrative`, `les_a2_future_will`, `les_a2_present_continuous`, `les_a2_modals_can_need`; Onda 2 — Lote 7 (batch 7): `les_a2_imperatives`, `les_a2_prepositions_basic`, `les_a2_travel_vocab_core`, `les_a2_collocations`, `les_a2_stress_timing`, `les_a2_airport`, `les_a2_hotel_taxi`, `les_a2_restaurant_shopping`, `les_a2_reading_strategy`, `les_a2_writing_svo`; Onda 2 — Lote 8 (batch 8): `les_a2_writing_bio`, `les_a2_writing_messages`, `les_a2_writing_past`, `les_a2_writing_selfcheck`, `les_a2_it_roles_hierarchy`, `les_a2_it_reading_strategy`, `les_a2_it_computer_parts`, `les_a2_it_system_unit`, `les_a2_it_internet_history`, `les_a2_it_clean_code_basics` |
| **`cite_only` (pendentes de reautoria)** | **56** | Material original/citado por base, mas **não declarado `authored_material`**; requer revisão e reclassificação/reautoria conforme checklist |
| **`adapt_with_attribution` (pendentes de reautoria)** | **7** | Adaptação de fonte permissiva com atribuição; **não 100% autoral** — requer reautoria integral para atingir `authored_material` |
| **`adapt_requires_permission` (pendentes)** | **0** | Não publicável sem permissão; requer permissão ou reautoria integral |
| **`blocked` / `blocked_no_adequate_source` (pendentes)** | **0** | — |
| **Total (registro)** | **123** | 123 arquivos auditados (todos com arquivo, 0 bloqueados no registro) |

> **`sourced_external_thin` (sinalização de sourcing no registro):** **0** lições. `les_a2_it_meeting_standup`, `les_b2_it_mentoring` e `les_b2_it_rfc_writing` foram reautoradas para `authored_material` (Lotes 1 e 2).

### 2.3 Placar dos packs
| Dimensão | Valor |
|---|---|
| Total de packs `.md` | **123** |
| Schema canônico (`pack-les-*.md`) | **67** |
| Schema legado v1 (`pack_les_*_v1.md`) | **56** |
| Packs com `reuse_basis` = `authored_material` | **60** |
| Packs com `reuse_basis` = `cite_only` | **62** |
| Packs com `reuse_basis` = `adapt_with_attribution` | **0** |
| Packs com `reuse_basis` = `adapt_requires_permission` | **1** |
| Packs sem `reuse_basis` explícito | **0** |

> **Observação:** PRD RF-001 e `post-lesson-practice-spec.md` §12 registram a dívida de migração dos packs legados (adição de `**Reuse basis:**` onde ausente no contrato v1 e renomeação de `item_id` para convenção §1.2). Para a meta 100% `authored_material`, cada pack deve ser reavaliado/reautorado junto da lição correspondente e migrado ao schema canônico.

---

## 3. Inventário detalhado — Lições (`lessons/`)

| Lesson ID | CEFR | Trilha | Módulo | Status | Reuse basis / Proveniência declarada | Provenance (campo) | Arquivo |
|---|---|---|---|---|---|---|---|
| `les_a1_alphabet_sounds` | A1 | General | `mod_a1_foundation` | — | `authored_material` | — | `lessons/a1/les_a1_alphabet_sounds.md` |
| `les_a1_articles_nouns` | A1 | General | `mod_a1_grammar_start` | — | `authored_material` | — | `lessons/a1/les_a1_articles_nouns.md` |
| `les_a1_daily_basics` | A1 | General | `mod_a1_foundation` | — | `authored_material` | — | `lessons/a1/les_a1_daily_basics.md` |
| `les_a1_days_months` | A1 | General | `mod_a1_vocab_core` | — | `authored_material` | — | `lessons/a1/les_a1_days_months.md` |
| `les_a1_en_us_en_gb` | A1 | General | `mod_a1_foundation` | — | `authored_material` | — | `lessons/a1/les_a1_en_us_en_gb.md` |
| `les_a1_false_cognates` | A1 | General | `mod_a1_comm_basic` | — | `authored_material` | — | `lessons/a1/les_a1_false_cognates.md` |
| `les_a1_food` | A1 | General | `mod_a1_vocab_core` | — | `authored_material` | — | `lessons/a1/les_a1_food.md` |
| `les_a1_greetings` | A1 | General | `mod_a1_foundation` | — | `authored_material` | — | `lessons/a1/les_a1_greetings.md` |
| `les_a1_have_has` | A1 | General | `mod_a1_comm_basic` | — | `authored_material` | — | `lessons/a1/les_a1_have_has.md` |
| `les_a1_intro_dialogue` | A1 | General | `mod_a1_foundation` | — | `authored_material` | — | `lessons/a1/les_a1_intro_dialogue.md` |
| `les_a1_numbers_colors` | A1 | General | `mod_a1_vocab_core` | — | `authored_material` | — | `lessons/a1/les_a1_numbers_colors.md` |
| `les_a1_occupations` | A1 | General | `mod_a1_vocab_core` | — | `authored_material` | — | `lessons/a1/les_a1_occupations.md` |
| `les_a1_present_simple` | A1 | General | `mod_a1_comm_basic` | — | `authored_material` | — | `lessons/a1/les_a1_present_simple.md` |
| `les_a1_present_simple_questions` | A1 | General | `mod_a1_comm_basic` | — | `authored_material` | — | `lessons/a1/les_a1_present_simple_questions.md` |
| `les_a1_pronouns_demonstrative` | A1 | General | `mod_a1_grammar_start` | — | `authored_material` | — | `lessons/a1/les_a1_pronouns_demonstrative.md` |
| `les_a1_pronouns_possessive` | A1 | General | `mod_a1_grammar_start` | — | `authored_material` | — | `lessons/a1/les_a1_pronouns_possessive.md` |
| `les_a1_pronouns_subject_object` | A1 | General | `mod_a1_grammar_start` | — | `authored_material` | — | `lessons/a1/les_a1_pronouns_subject_object.md` |
| `les_a1_pronunciation_intro` | A1 | General | `mod_a1_foundation` | — | `authored_material` | — | `lessons/a1/les_a1_pronunciation_intro.md` |
| `les_a1_reading_skimming` | A1 | General | `mod_a1_comm_basic` | — | `authored_material` | — | `lessons/a1/les_a1_reading_skimming.md` |
| `les_a1_regular_verbs_past` | A1 | General | `mod_a1_vocab_core` | — | `authored_material` | — | `lessons/a1/les_a1_regular_verbs_past.md` |
| `les_a1_there_is_are` | A1 | General | `mod_a1_comm_basic` | — | `authored_material` | — | `lessons/a1/les_a1_there_is_are.md` |
| `les_a1_time_dates` | A1 | General | `mod_a1_vocab_core` | — | `authored_material` | — | `lessons/a1/les_a1_time_dates.md` |
| `les_a1_to_be_forms` | A1 | General | `mod_a1_grammar_start` | — | `authored_material` | — | `lessons/a1/les_a1_to_be_forms.md` |
| `les_a1_wh_questions` | A1 | General | `mod_a1_grammar_start` | — | `authored_material` | — | `lessons/a1/les_a1_wh_questions.md` |
| `les_a2_airport` | A2 | General | `mod_a2_travel` | — | `authored_material` | — | `lessons/a2/les_a2_airport.md` |
| `les_a2_ask_for_help` | A2 | General | `mod_a2_workplace_comm` | — | `authored_material` | — | `lessons/a2/les_a2_ask_for_help.md` |
| `les_a2_collocations` | A2 | General | `mod_a2_travel` | — | `authored_material` | — | `lessons/a2/les_a2_collocations.md` |
| `les_a2_corporate_wrapup` | A2 | General | `mod_a2_workplace_comm` | — | `authored_material` | — | `lessons/a2/les_a2_corporate_wrapup.md` |
| `les_a2_corpus_intro` | A2 | General | `mod_a2_workplace_comm` | — | `authored_material` | — | `lessons/a2/les_a2_corpus_intro.md` |
| `les_a2_deadlines_tasks` | A2 | General | `mod_a2_workplace_comm` | — | `authored_material` | — | `lessons/a2/les_a2_deadlines_tasks.md` |
| `les_a2_email_basics` | A2 | General | `—` | — | `cite_only` — material original; `frases-ingles-trabalho.md` Ch5 e `Dicionario...md` Ch10 são *bibliografia* (`external-sources.md` §7.0) | — | `lessons/a2/les_a2_email_basics.md` |
| `les_a2_feedback_praise` | A2 | General | `mod_a2_workplace_comm` | — | `authored_material` | — | `lessons/a2/les_a2_feedback_praise.md` |
| `les_a2_future_will` | A2 | General | `mod_a2_workplace_tasks` | — | `authored_material` | — | `lessons/a2/les_a2_future_will.md` |
| `les_a2_greetings_intro` | A2 | General | `—` | — | `cite_only` — material original; `frases-ingles-trabalho.md` Ch2 e `apostila-ingles-para-iniciantes-impresso.md` §2.2 são *bibliografia*, não texto adaptado (ver `external-sources.md` §7.0) | — | `lessons/a2/lesson-15min-workplace-greetings.md` |
| `les_a2_hotel_taxi` | A2 | General | `mod_a2_travel` | — | `authored_material` | — | `lessons/a2/les_a2_hotel_taxi.md` |
| `les_a2_imperatives` | A2 | General | `mod_a2_workplace_tasks` | — | `authored_material` | — | `lessons/a2/les_a2_imperatives.md` |
| `les_a2_introducing_others` | A2 | General | `—` | — | `cite_only` — material original; `frases-ingles-trabalho.md` Ch2 e `apostila-ingles-para-iniciantes-impresso.md` §2.2 são *bibliografia* (`external-sources.md` §7.0) | — | `lessons/a2/les_a2_introducing_others.md` |
| `les_a2_meeting_open` | A2 | General | `—` | — | `cite_only` — material original; `frases-ingles-trabalho.md` Ch4 é *bibliografia* (`external-sources.md` §7.0) | — | `lessons/a2/les_a2_meeting_open.md` |
| `les_a2_meeting_participate` | A2 | General | `—` | — | `cite_only` — material original; `frases-ingles-trabalho.md` Ch4 é *bibliografia* (`external-sources.md` §7.0) | — | `lessons/a2/les_a2_meeting_participate.md` |
| `les_a2_modals_can_need` | A2 | General | `mod_a2_workplace_tasks` | — | `authored_material` | — | `lessons/a2/les_a2_modals_can_need.md` |
| `les_a2_past_narrative` | A2 | General | `mod_a2_workplace_tasks` | — | `authored_material` | — | `lessons/a2/les_a2_past_narrative.md` |
| `les_a2_phone_calls` | A2 | General | `mod_a2_workplace_comm` | — | `authored_material` | — | `lessons/a2/les_a2_phone_calls.md` |
| `les_a2_prepositions_basic` | A2 | General | `mod_a2_workplace_tasks` | — | `authored_material` | — | `lessons/a2/les_a2_prepositions_basic.md` |
| `les_a2_present_continuous` | A2 | General | `mod_a2_workplace_tasks` | — | `authored_material` | — | `lessons/a2/les_a2_present_continuous.md` |
| `les_a2_reading_strategy` | A2 | General | `mod_a2_skills_rw` | — | `authored_material` | — | `lessons/a2/les_a2_reading_strategy.md` |
| `les_a2_restaurant_shopping` | A2 | General | `mod_a2_travel` | — | `authored_material` | — | `lessons/a2/les_a2_restaurant_shopping.md` |
| `les_a2_small_talk` | A2 | General | `—` | — | `cite_only` — material original; `frases-ingles-trabalho.md` Ch3 é *bibliografia*, não texto adaptado (ver `external-sources.md` §7.0) | — | `lessons/a2/les_a2_small_talk.md` |
| `les_a2_stress_timing` | A2 | General | `mod_a2_travel` | — | `authored_material` | — | `lessons/a2/les_a2_stress_timing.md` |
| `les_a2_travel_vocab_core` | A2 | General | `mod_a2_travel` | — | `authored_material` | — | `lessons/a2/les_a2_travel_vocab_core.md` |
| `les_a2_writing_bio` | A2 | General | `mod_a2_skills_rw` | — | `authored_material` | — | `lessons/a2/les_a2_writing_bio.md` |
| `les_a2_writing_messages` | A2 | General | `mod_a2_skills_rw` | — | `authored_material` | — | `lessons/a2/les_a2_writing_messages.md` |
| `les_a2_writing_past` | A2 | General | `mod_a2_skills_rw` | — | `authored_material` | — | `lessons/a2/les_a2_writing_past.md` |
| `les_a2_writing_selfcheck` | A2 | General | `mod_a2_skills_rw` | — | `authored_material` | — | `lessons/a2/les_a2_writing_selfcheck.md` |
| `les_a2_writing_svo` | A2 | General | `mod_a2_skills_rw` | — | `authored_material` | — | `lessons/a2/les_a2_writing_svo.md` |
| `les_a2_it_algorithms_basics` | A2 | IT | `mod_a2_it_fundamentals` | — | `cite_only` | — | `lessons/a2/les_a2_it_algorithms_basics.md` |
| `les_a2_it_clean_code_basics` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_clean_code_basics.md` |
| `les_a2_it_computer_parts` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_computer_parts.md` |
| `les_a2_it_email_technical` | A2 | IT | `mod_a2_it_communication` | — | `cite_only` | — | `lessons/a2/les_a2_it_email_technical.md` |
| `les_a2_it_incidents` | A2 | IT | `mod_a2_it_communication` | — | `adapt_with_attribution` | — | `lessons/a2/les_a2_it_incidents.md` |
| `les_a2_it_internet_history` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_internet_history.md` |
| `les_a2_it_meeting_standup` | A2 | IT | `mod_a2_it_communication` | — | `authored_material` | — | `lessons/a2/les_a2_it_meeting_standup.md` |
| `les_a2_it_nontech_tech` | A2 | IT | `mod_a2_it_communication` | — | `cite_only` | — | `lessons/a2/les_a2_it_nontech_tech.md` |
| `les_a2_it_pr_tickets` | A2 | IT | `mod_a2_it_communication` | — | `cite_only` | — | `lessons/a2/les_a2_it_pr_tickets.md` |
| `les_a2_it_reading_strategy` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_reading_strategy.md` |
| `les_a2_it_roles_hierarchy` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_roles_hierarchy.md` |
| `les_a2_it_system_unit` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_system_unit.md` |
| `les_a2_it_terms_basics` | A2 | IT | `—` | — | `adapt_with_attribution` — **primeira lição do repositório com esta base.** Adapta, com atribuição, **S01** (Google developer documentation style guide, CC-BY-4.0) e **S16** (Kubernetes docs, CC-BY-4.0). Todo o restante é original. Ver `external-sources.md` §7.0 e "Fontes e Atribuição" no fim. | — | `lessons/a2/les_a2_it_terms_basics.md` |
| `les_a2_it_testing_fundamentals` | A2 | IT | `mod_a2_it_fundamentals` | — | `cite_only` | — | `lessons/a2/les_a2_it_testing_fundamentals.md` |
| `les_a2_it_typescript_basics` | A2 | IT | `mod_a2_it_fundamentals` | — | `cite_only` | — | `lessons/a2/les_a2_it_typescript_basics.md` |
| `les_a2_it_word_formation` | A2 | IT | `mod_a2_it_communication` | — | `cite_only` | — | `lessons/a2/les_a2_it_word_formation.md` |
| `les_b1_conditionals` | B1 | General | `mod_b1_grammar_consolidate` | — | `cite_only` | — | `lessons/b1/les_b1_conditionals.md` |
| `les_b1_finance_business` | B1 | General | `mod_b1_workplace_adv` | — | `cite_only` | — | `lessons/b1/les_b1_finance_business.md` |
| `les_b1_hr_career` | B1 | General | `mod_b1_workplace_adv` | — | `cite_only` | — | `lessons/b1/les_b1_hr_career.md` |
| `les_b1_leadership_feedback` | B1 | General | `mod_b1_workplace_adv` | — | `cite_only` | — | `lessons/b1/les_b1_leadership_feedback.md` |
| `les_b1_modals` | B1 | General | `mod_b1_grammar_consolidate` | — | `cite_only` | — | `lessons/b1/les_b1_modals.md` |
| `les_b1_negotiation` | B1 | General | `mod_b1_workplace_adv` | — | `cite_only` | — | `lessons/b1/les_b1_negotiation.md` |
| `les_b1_passive` | B1 | General | `mod_b1_grammar_consolidate` | — | `cite_only` | — | `lessons/b1/les_b1_passive.md` |
| `les_b1_presentation_skills` | B1 | General | `mod_b1_workplace_adv` | — | `cite_only` | — | `lessons/b1/les_b1_presentation_skills.md` |
| `les_b1_project_case_study` | B1 | General | `mod_b1_fluency_project` | — | `adapt_with_attribution` | — | `lessons/b1/les_b1_project_case_study.md` |
| `les_b1_project_client_sim` | B1 | General | `mod_b1_fluency_project` | — | `cite_only` | — | `lessons/b1/les_b1_project_client_sim.md` |
| `les_b1_project_integrated_review` | B1 | General | `mod_b1_fluency_project` | — | `cite_only` | — | `lessons/b1/les_b1_project_integrated_review.md` |
| `les_b1_project_negotiation_roleplay` | B1 | General | `mod_b1_fluency_project` | — | `cite_only` | — | `lessons/b1/les_b1_project_negotiation_roleplay.md` |
| `les_b1_project_presentation_final` | B1 | General | `mod_b1_fluency_project` | — | `cite_only` | — | `lessons/b1/les_b1_project_presentation_final.md` |
| `les_b1_project_retrospective` | B1 | General | `mod_b1_fluency_project` | — | `cite_only` | — | `lessons/b1/les_b1_project_retrospective.md` |
| `les_b1_question_forms` | B1 | General | `mod_b1_grammar_consolidate` | — | `cite_only` | — | `lessons/b1/les_b1_question_forms.md` |
| `les_b1_reported_speech` | B1 | General | `mod_b1_grammar_consolidate` | — | `cite_only` | — | `lessons/b1/les_b1_reported_speech.md` |
| `les_b1_sales_marketing` | B1 | General | `mod_b1_workplace_adv` | — | `cite_only` | — | `lessons/b1/les_b1_sales_marketing.md` |
| `les_b1_tenses_review` | B1 | General | `mod_b1_grammar_consolidate` | — | `cite_only` | — | `lessons/b1/les_b1_tenses_review.md` |
| `les_b1_it_acronyms_deep` | B1 | IT | `mod_b1_it_technical` | — | `cite_only` | — | `lessons/b1/les_b1_it_acronyms_deep.md` |
| `les_b1_it_architecture_vocab` | B1 | IT | `mod_b1_it_technical` | — | `authored_material` | — | `lessons/b1/les_b1_it_architecture_vocab.md` |
| `les_b1_it_bdd_specs` | B1 | IT | `mod_b1_it_technical` | — | `cite_only` | — | `lessons/b1/les_b1_it_bdd_specs.md` |
| `les_b1_it_code_review` | B1 | IT | `mod_b1_it_technical` | — | `authored_material` | — | `lessons/b1/les_b1_it_code_review.md` |
| `les_b1_it_ddd_modeling` | B1 | IT | `mod_b1_it_technical` | — | `cite_only` | — | `lessons/b1/les_b1_it_ddd_modeling.md` |
| `les_b1_it_debugging` | B1 | IT | `mod_b1_it_technical` | — | `adapt_with_attribution` | — | `lessons/b1/les_b1_it_debugging.md` |
| `les_b1_it_devops_basics` | B1 | IT | `mod_b1_it_technical` | — | `cite_only` | — | `lessons/b1/les_b1_it_devops_basics.md` |
| `les_b1_it_ux_collab` | B1 | IT | `mod_b1_it_technical` | — | `cite_only` | — | `lessons/b1/les_b1_it_ux_collab.md` |
| `les_b1_it_write_docs` | B1 | IT | `mod_b1_it_technical` | — | `adapt_with_attribution` | — | `lessons/b1/les_b1_it_write_docs.md` |
| `les_rem_confidence_builder` | B1 | Remediation | `mod_b1_fluency_project` | — | `cite_only` | — | `lessons/remediation/les_rem_confidence_builder.md` |
| `les_rem_grammar_be_pronouns` | B1 | Remediation | `mod_b1_fluency_project` | — | `cite_only` | — | `lessons/remediation/les_rem_grammar_be_pronouns.md` |
| `les_rem_listening_slow_clear` | B1 | Remediation | `mod_b1_fluency_project` | — | `cite_only` | — | `lessons/remediation/les_rem_listening_slow_clear.md` |
| `les_rem_pronunciation_th_vw` | B1 | Remediation | `mod_b1_fluency_project` | — | `cite_only` | — | `lessons/remediation/les_rem_pronunciation_th_vw.md` |
| `les_rem_writing_svo` | B1 | Remediation | `mod_b1_fluency_project` | — | `cite_only` | — | `lessons/remediation/les_rem_writing_svo.md` |
| `les_b2_celpe_br` | B2 | General | `mod_b2_cert_prep` | — | `cite_only` | — | `lessons/b2/les_b2_celpe_br.md` |
| `les_b2_culture_brazil_vs_usa` | B2 | General | `mod_b2_professional` | — | `cite_only` | — | `lessons/b2/les_b2_culture_brazil_vs_usa.md` |
| `les_b2_exam_simulations` | B2 | General | `mod_b2_cert_prep` | — | `cite_only` | — | `lessons/b2/les_b2_exam_simulations.md` |
| `les_b2_exam_vocab` | B2 | General | `mod_b2_cert_prep` | — | `cite_only` | — | `lessons/b2/les_b2_exam_vocab.md` |
| `les_b2_ielts_writing` | B2 | General | `mod_b2_cert_prep` | — | `cite_only` | — | `lessons/b2/les_b2_ielts_writing.md` |
| `les_b2_professional_argument` | B2 | General | `mod_b2_professional` | — | `cite_only` | — | `lessons/b2/les_b2_professional_argument.md` |
| `les_b2_professional_email_advanced` | B2 | General | `mod_b2_professional` | — | `cite_only` | — | `lessons/b2/les_b2_professional_email_advanced.md` |
| `les_b2_professional_review` | B2 | General | `mod_b2_professional` | — | `cite_only` | — | `lessons/b2/les_b2_professional_review.md` |
| `les_b2_professional_summary` | B2 | General | `mod_b2_professional` | — | `cite_only` | — | `lessons/b2/les_b2_professional_summary.md` |
| `les_b2_register_nuance` | B2 | General | `mod_b2_professional` | — | `cite_only` | — | `lessons/b2/les_b2_register_nuance.md` |
| `les_b2_toeic_reading` | B2 | General | `mod_b2_cert_prep` | — | `cite_only` | — | `lessons/b2/les_b2_toeic_reading.md` |
| `les_b2_toeic_writing` | B2 | General | `mod_b2_cert_prep` | — | `cite_only` | — | `lessons/b2/les_b2_toeic_writing.md` |
| `les_b2_it_advanced_patterns` | B2 | IT | `mod_b2_it_senior` | — | `cite_only` | — | `lessons/b2/les_b2_it_advanced_patterns.md` |
| `les_b2_it_architecture_decisions` | B2 | IT | `mod_b2_it_senior` | — | `adapt_with_attribution` | — | `lessons/b2/les_b2_it_architecture_decisions.md` |
| `les_b2_it_incident_postmortem` | B2 | IT | `mod_b2_it_senior` | — | `adapt_with_attribution` | — | `lessons/b2/les_b2_it_incident_postmortem.md` |
| `les_b2_it_jargon_mastery` | B2 | IT | `mod_b2_it_senior` | — | `cite_only` | — | `lessons/b2/les_b2_it_jargon_mastery.md` |
| `les_b2_it_mentoring` | B2 | IT | `mod_b2_it_senior` | — | `authored_material` | — | `lessons/b2/les_b2_it_mentoring.md` |
| `les_b2_it_rfc_writing` | B2 | IT | `mod_b2_it_senior` | — | `authored_material` | — | `lessons/b2/les_b2_it_rfc_writing.md` |
| `les_b2_it_strategy` | B2 | IT | `mod_b2_it_senior` | — | `cite_only` | — | `lessons/b2/les_b2_it_strategy.md` |
| `les_b2_it_technical_leadership` | B2 | IT | `mod_b2_it_senior` | — | `cite_only` | — | `lessons/b2/les_b2_it_technical_leadership.md` |
| `les_b1_it_presentations` | B1 | IT | `mod_b1_it_technical` | `blocked_no_adequate_source` | `blocked_no_adequate_source` | — | (sem arquivo em lessons/ — nó bloqueado no registro §4.3) |

## 4. Inventário detalhado — Packs (`packs/`)

| Pack / arquivo | Lesson ref | CEFR | Trilha | Schema | Reuse basis | Provenance | Arquivo |
|---|---|---|---|---|---|---|---|
| `pack_les_a1_alphabet_sounds_v1` | `les_a1_alphabet_sounds` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 2 (batch 2) | `packs/a1/pack-les-a1-alphabet-sounds.md` |
| `pack_les_a1_articles_nouns_v1` | `les_a1_articles_nouns` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 6 (batch 6) | `packs/a1/pack-les-a1-articles-nouns.md` |
| `pack_les_a1_daily_basics_v1` | `les_a1_daily_basics` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 2 (Onda 2) | `packs/a1/pack-les-a1-daily-basics.md` |
| `pack_les_a1_days_months_v1` | `les_a1_days_months` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 3 (batch 3) — Fase A | `packs/a1/pack-les-a1-days-months.md` |
| `pack_les_a1_en_us_en_gb_v1` | `les_a1_en_us_en_gb` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 2 (batch 2) | `packs/a1/pack-les-a1-en-us-en-gb.md` |
| `pack_les_a1_false_cognates_v1` | `les_a1_false_cognates` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 5 (batch 5) — Fase C | `packs/a1/pack-les-a1-false-cognates.md` |
| `pack_les_a1_food_v1` | `les_a1_food` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 4 (batch 4) — Fase B | `packs/a1/pack-les-a1-food.md` |
| `pack_les_a1_greetings_v1` | `les_a1_greetings` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 2 (Onda 2) | `packs/a1/pack-les-a1-greetings.md` |
| `pack_les_a1_have_has_v1` | `les_a1_have_has` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 5 (batch 5) — Fase C | `packs/a1/pack-les-a1-have-has.md` |
| `pack_les_a1_intro_dialogue_v1` | `les_a1_intro_dialogue` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 2 (Onda 2) | `packs/a1/pack-les-a1-intro-dialogue.md` |
| `pack_les_a1_numbers_colors_v1` | `les_a1_numbers_colors` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 3 (batch 3) — Fase A | `packs/a1/pack-les-a1-numbers-colors.md` |
| `pack_les_a1_occupations_v1` | `les_a1_occupations` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 4 (batch 4) — Fase B | `packs/a1/pack-les-a1-occupations.md` |
| `pack_les_a1_present_simple_v1` | `les_a1_present_simple` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 4 (batch 4) — Fase B | `packs/a1/pack-les-a1-present-simple.md` |
| `pack_les_a1_present_simple_questions_v1` | `les_a1_present_simple_questions` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 4 (batch 4) — Fase B | `packs/a1/pack-les-a1-present-simple-questions.md` |
| `pack_les_a1_pronouns_demonstrative_v1` | `les_a1_pronouns_demonstrative` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 3 (batch 3) — Fase A | `packs/a1/pack-les-a1-pronouns-demonstrative.md` |
| `pack_les_a1_pronouns_possessive_v1` | `les_a1_pronouns_possessive` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 2 (batch 2) | `packs/a1/pack-les-a1-pronouns-possessive.md` |
| `pack_les_a1_pronouns_subject_object_v1` | `les_a1_pronouns_subject_object` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 2 (batch 2) | `packs/a1/pack-les-a1-pronouns-subject-object.md` |
| `pack_les_a1_pronunciation_intro_v1` | `les_a1_pronunciation_intro` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 2 (Onda 2) | `packs/a1/pack-les-a1-pronunciation-intro.md` |
| `pack_les_a1_reading_skimming_v1` | `les_a1_reading_skimming` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 5 (batch 5) — Fase C | `packs/a1/pack-les-a1-reading-skimming.md` |
| `pack_les_a1_regular_verbs_past_v1` | `les_a1_regular_verbs_past` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 4 (batch 4) — Fase B | `packs/a1/pack-les-a1-regular-verbs-past.md` |
| `pack_les_a1_there_is_are_v1` | `les_a1_there_is_are` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 5 (batch 5) — Fase C | `packs/a1/pack-les-a1-there-is-are.md` |
| `pack_les_a1_time_dates_v1` | `les_a1_time_dates` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 3 (batch 3) — Fase A | `packs/a1/pack-les-a1-time-dates.md` |
| `pack_les_a1_to_be_forms_v1` | `les_a1_to_be_forms` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 2 (batch 2) | `packs/a1/pack-les-a1-to-be-forms.md` |
| `pack_les_a1_wh_questions_v1` | `les_a1_wh_questions` | A1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 3 (batch 3) — Fase A | `packs/a1/pack-les-a1-wh-questions.md` |
| `pack_les_a2_airport_v1` | `les_a2_airport` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 7 (batch 7) | `packs/a2/pack-les-a2-airport.md` |
| `pack_les_a2_ask_for_help_v1` | `les_a2_ask_for_help` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 6 (batch 6) | `packs/a2/pack-les-a2-ask-for-help.md` |
| `pack_les_a2_collocations_v1` | `les_a2_collocations` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 7 (batch 7) | `packs/a2/pack-les-a2-collocations.md` |
| `pack_les_a2_corporate_wrapup_v1` | `les_a2_corporate_wrapup` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 6 (batch 6) | `packs/a2/pack-les-a2-corporate-wrapup.md` |
| `pack_les_a2_corpus_intro_v1` | `les_a2_corpus_intro` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 6 (batch 6) | `packs/a2/pack-les-a2-corpus-intro.md` |
| `pack_les_a2_deadlines_tasks_v1` | `les_a2_deadlines_tasks` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 6 (batch 6) | `packs/a2/pack-les-a2-deadlines-tasks.md` |
| `pack_les_a2_email_basics_v1` | `les_a2_email_basics` | A2 | General | canonical | cite_only | items `authored`. `frases-ingles-trabalho.md` Ch5 and `Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md` Ch10 are *bibliography only* (both **restricted**, `external-sources.md` §0.5 / §7.0). | `packs/a2/pack-les-a2-email-basics.md` |
| `pack_les_a2_feedback_praise_v1` | `les_a2_feedback_praise` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 6 (batch 6) | `packs/a2/pack-les-a2-feedback-praise.md` |
| `pack_les_a2_future_will_v1` | `les_a2_future_will` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 6 (batch 6) | `packs/a2/pack-les-a2-future-will.md` |
| `pack_les_a2_hotel_taxi_v1` | `les_a2_hotel_taxi` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 7 (batch 7) | `packs/a2/pack-les-a2-hotel-taxi.md` |
| `pack_les_a2_imperatives_v1` | `les_a2_imperatives` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 7 (batch 7) | `packs/a2/pack-les-a2-imperatives.md` |
| `pack_les_a2_introducing_others_v1` | `les_a2_introducing_others` | A2 | General | canonical | cite_only | items `authored`. `frases-ingles-trabalho.md` Ch2 and `apostila-ingles-para-iniciantes-impresso.md` §2.2 are *bibliography only* (restricted / unlicensed sources, `external-sources.md` §0.5 / §7.0). | `packs/a2/pack-les-a2-introducing-others.md` |
| `pack_les_a2_meeting_open_v1` | `les_a2_meeting_open` | A2 | General | canonical | cite_only | items `authored`. `frases-ingles-trabalho.md` Ch4 is *bibliography only* (restricted source, `external-sources.md` §0.5 / §7.0). | `packs/a2/pack-les-a2-meeting-open.md` |
| `pack_les_a2_meeting_participate_v1` | `les_a2_meeting_participate` | A2 | General | canonical | cite_only | items `authored`. `frases-ingles-trabalho.md` Ch4 is *bibliography only* (restricted source, `external-sources.md` §0.5 / §7.0). | `packs/a2/pack-les-a2-meeting-participate.md` |
| `pack_les_a2_modals_can_need_v1` | `les_a2_modals_can_need` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 6 (batch 6) | `packs/a2/pack-les-a2-modals-can-need.md` |
| `pack_les_a2_past_narrative_v1` | `les_a2_past_narrative` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 6 (batch 6) | `packs/a2/pack-les-a2-past-narrative.md` |
| `pack_les_a2_phone_calls_v1` | `les_a2_phone_calls` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 5 (batch 5) — Fase C | `packs/a2/pack-les-a2-phone-calls.md` |
| `pack_les_a2_prepositions_basic_v1` | `les_a2_prepositions_basic` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 7 (batch 7) | `packs/a2/pack-les-a2-prepositions-basic.md` |
| `pack_les_a2_present_continuous_v1` | `les_a2_present_continuous` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 6 (batch 6) | `packs/a2/pack-les-a2-present-continuous.md` |
| `pack_les_a2_reading_strategy_v1` | `les_a2_reading_strategy` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 7 (batch 7) | `packs/a2/pack-les-a2-reading-strategy.md` |
| `pack_les_a2_restaurant_shopping_v1` | `les_a2_restaurant_shopping` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 7 (batch 7) | `packs/a2/pack-les-a2-restaurant-shopping.md` |
| `pack_les_a2_small_talk_v1` | `les_a2_small_talk` | A2 | General | canonical | cite_only | items `authored` — no verbatim source text. `frases-ingles-trabalho.md` Ch3 is *bibliography only* (restricted source, `external-sources.md` §0.5 / §7.0). | `packs/a2/pack-les-a2-small-talk.md` |
| `pack_les_a2_stress_timing_v1` | `les_a2_stress_timing` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 7 (batch 7) | `packs/a2/pack-les-a2-stress-timing.md` |
| `pack_les_a2_travel_vocab_core_v1` | `les_a2_travel_vocab_core` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 7 (batch 7) | `packs/a2/pack-les-a2-travel-vocab-core.md` |
| `pack_les_a2_writing_bio_v1` | `les_a2_writing_bio` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-writing-bio.md` |
| `pack_les_a2_writing_messages_v1` | `les_a2_writing_messages` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-writing-messages.md` |
| `pack_les_a2_writing_past_v1` | `les_a2_writing_past` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-writing-past.md` |
| `pack_les_a2_writing_selfcheck_v1` | `les_a2_writing_selfcheck` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-writing-selfcheck.md` |
| `pack_les_a2_writing_svo_v1` | `les_a2_writing_svo` | A2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 7 (batch 7) | `packs/a2/pack-les-a2-writing-svo.md` |
| `pack_les_a2_it_algorithms_basics_v1` | `les_a2_it_algorithms_basics` | A2 | IT | legacy_v1 | cite_only | — | `packs/a2/pack_les_a2_it_algorithms_basics_v1.md` |
| `pack_les_a2_it_clean_code_basics_v1` | `les_a2_it_clean_code_basics` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-clean-code-basics.md` |
| `pack_les_a2_it_computer_parts_v1` | `les_a2_it_computer_parts` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-computer-parts.md` |
| `pack_les_a2_it_email_technical_v1` | `les_a2_it_email_technical` | A2 | IT | legacy_v1 | cite_only | — | `packs/a2/pack_les_a2_it_email_technical_v1.md` |
| `pack_les_a2_it_incidents_v1` | `les_a2_it_incidents` | A2 | IT | legacy_v1 | cite_only | — | `packs/a2/pack_les_a2_it_incidents_v1.md` |
| `pack_les_a2_it_internet_history_v1` | `les_a2_it_internet_history` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-internet-history.md` |
| `pack_les_a2_it_meeting_standup_v1` | `les_a2_it_meeting_standup` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 2 (Onda 2) | `packs/a2/pack-les-a2-it-meeting-standup.md` |
| `pack_les_a2_it_nontech_tech_v1` | `les_a2_it_nontech_tech` | A2 | IT | legacy_v1 | cite_only | — | `packs/a2/pack_les_a2_it_nontech_tech_v1.md` |
| `pack_les_a2_it_pr_tickets_v1` | `les_a2_it_pr_tickets` | A2 | IT | legacy_v1 | cite_only | — | `packs/a2/pack_les_a2_it_pr_tickets_v1.md` |
| `pack_les_a2_it_reading_strategy_v1` | `les_a2_it_reading_strategy` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-reading-strategy.md` |
| `pack_les_a2_it_roles_hierarchy_v1` | `les_a2_it_roles_hierarchy` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-roles-hierarchy.md` |
| `pack_les_a2_it_system_unit_v1` | `les_a2_it_system_unit` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-system-unit.md` |
| `pack_les_a2_it_terms_basics_v1` | `les_a2_it_terms_basics` | A2 | IT | canonical | cite_only | items `authored`. The lesson adapts **S16** and **S01** (both CC-BY-4.0); see the lesson's | `packs/a2/pack-les-a2-it-terms-basics.md` |
| `pack_les_a2_it_testing_fundamentals_v1` | `les_a2_it_testing_fundamentals` | A2 | IT | legacy_v1 | cite_only | — | `packs/a2/pack_les_a2_it_testing_fundamentals_v1.md` |
| `pack_les_a2_it_typescript_basics_v1` | `les_a2_it_typescript_basics` | A2 | IT | legacy_v1 | cite_only | — | `packs/a2/pack_les_a2_it_typescript_basics_v1.md` |
| `pack_les_a2_it_word_formation_v1` | `les_a2_it_word_formation` | A2 | IT | legacy_v1 | cite_only | — | `packs/a2/pack_les_a2_it_word_formation_v1.md` |
| `pack_les_b1_conditionals_v1` | `les_b1_conditionals` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_conditionals_v1.md` |
| `pack_les_b1_finance_business_v1` | `les_b1_finance_business` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_finance_business_v1.md` |
| `pack_les_b1_hr_career_v1` | `les_b1_hr_career` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_hr_career_v1.md` |
| `pack_les_b1_leadership_feedback_v1` | `les_b1_leadership_feedback` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_leadership_feedback_v1.md` |
| `pack_les_b1_modals_v1` | `les_b1_modals` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_modals_v1.md` |
| `pack_les_b1_negotiation_v1` | `les_b1_negotiation` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_negotiation_v1.md` |
| `pack_les_b1_passive_v1` | `les_b1_passive` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_passive_v1.md` |
| `pack_les_b1_presentation_skills_v1` | `les_b1_presentation_skills` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_presentation_skills_v1.md` |
| `pack_les_b1_project_case_study_v1` | `les_b1_project_case_study` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_project_case_study_v1.md` |
| `pack_les_b1_project_client_sim_v1` | `les_b1_project_client_sim` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_project_client_sim_v1.md` |
| `pack_les_b1_project_integrated_review_v1` | `les_b1_project_integrated_review` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_project_integrated_review_v1.md` |
| `pack_les_b1_project_negotiation_roleplay_v1` | `les_b1_project_negotiation_roleplay` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_project_negotiation_roleplay_v1.md` |
| `pack_les_b1_project_presentation_final_v1` | `les_b1_project_presentation_final` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_project_presentation_final_v1.md` |
| `pack_les_b1_project_retrospective_v1` | `les_b1_project_retrospective` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_project_retrospective_v1.md` |
| `pack_les_b1_question_forms_v1` | `les_b1_question_forms` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_question_forms_v1.md` |
| `pack_les_b1_reported_speech_v1` | `les_b1_reported_speech` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_reported_speech_v1.md` |
| `pack_les_b1_sales_marketing_v1` | `les_b1_sales_marketing` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_sales_marketing_v1.md` |
| `pack_les_b1_tenses_review_v1` | `les_b1_tenses_review` | B1 | General | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_tenses_review_v1.md` |
| `pack_les_b1_it_acronyms_deep_v1` | `les_b1_it_acronyms_deep` | B1 | IT | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_it_acronyms_deep_v1.md` |
| `pack_les_b1_it_architecture_vocab_v1` | `les_b1_it_architecture_vocab` | B1 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 1 | `packs/b1/pack-les-b1-it-architecture-vocab.md` |
| `pack_les_b1_it_bdd_specs_v1` | `les_b1_it_bdd_specs` | B1 | IT | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_it_bdd_specs_v1.md` |
| `pack_les_b1_it_code_review_v1` | `les_b1_it_code_review` | B1 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 1 | `packs/b1/pack-les-b1-it-code-review.md` |
| `pack_les_b1_it_ddd_modeling_v1` | `les_b1_it_ddd_modeling` | B1 | IT | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_it_ddd_modeling_v1.md` |
| `pack_les_b1_it_debugging_v1` | `les_b1_it_debugging` | B1 | IT | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_it_debugging_v1.md` |
| `pack_les_b1_it_devops_basics_v1` | `les_b1_it_devops_basics` | B1 | IT | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_it_devops_basics_v1.md` |
| `pack_les_b1_it_ux_collab_v1` | `les_b1_it_ux_collab` | B1 | IT | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_it_ux_collab_v1.md` |
| `pack_les_b1_it_write_docs_v1` | `les_b1_it_write_docs` | B1 | IT | legacy_v1 | cite_only | — | `packs/b1/pack_les_b1_it_write_docs_v1.md` |
| `pack_les_b2_celpe_br_v1` | `les_b2_celpe_br` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_celpe_br_v1.md` |
| `pack_les_b2_culture_brazil_vs_usa_v1` | `les_b2_culture_brazil_vs_usa` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_culture_brazil_vs_usa_v1.md` |
| `pack_les_b2_exam_simulations_v1` | `les_b2_exam_simulations` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_exam_simulations_v1.md` |
| `pack_les_b2_exam_vocab_v1` | `les_b2_exam_vocab` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_exam_vocab_v1.md` |
| `pack_les_b2_ielts_writing_v1` | `les_b2_ielts_writing` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_ielts_writing_v1.md` |
| `pack_les_b2_professional_argument_v1` | `les_b2_professional_argument` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_professional_argument_v1.md` |
| `pack_les_b2_professional_email_advanced_v1` | `les_b2_professional_email_advanced` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_professional_email_advanced_v1.md` |
| `pack_les_b2_professional_review_v1` | `les_b2_professional_review` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_professional_review_v1.md` |
| `pack_les_b2_professional_summary_v1` | `les_b2_professional_summary` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_professional_summary_v1.md` |
| `pack_les_b2_register_nuance_v1` | `les_b2_register_nuance` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_register_nuance_v1.md` |
| `pack_les_b2_toeic_reading_v1` | `les_b2_toeic_reading` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_toeic_reading_v1.md` |
| `pack_les_b2_toeic_writing_v1` | `les_b2_toeic_writing` | B2 | General | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_toeic_writing_v1.md` |
| `pack_les_b2_it_advanced_patterns_v1` | `les_b2_it_advanced_patterns` | B2 | IT | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_it_advanced_patterns_v1.md` |
| `pack_les_b2_it_architecture_decisions_v1` | `les_b2_it_architecture_decisions` | B2 | IT | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_it_architecture_decisions_v1.md` |
| `pack_les_b2_it_incident_postmortem_v1` | `les_b2_it_incident_postmortem` | B2 | IT | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_it_incident_postmortem_v1.md` |
| `pack_les_b2_it_jargon_mastery_v1` | `les_b2_it_jargon_mastery` | B2 | IT | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_it_jargon_mastery_v1.md` |
| `pack_les_b2_it_mentoring_v1` | `les_b2_it_mentoring` | B2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 1 | `packs/b2/pack-les-b2-it-mentoring.md` |
| `pack_les_b2_it_rfc_writing_v1` | `les_b2_it_rfc_writing` | B2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 1 | `packs/b2/pack-les-b2-it-rfc-writing.md` |
| `pack_les_b2_it_strategy_v1` | `les_b2_it_strategy` | B2 | IT | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_it_strategy_v1.md` |
| `pack_les_b2_it_technical_leadership_v1` | `les_b2_it_technical_leadership` | B2 | IT | legacy_v1 | cite_only | — | `packs/b2/pack_les_b2_it_technical_leadership_v1.md` |
| `pack_les_a2_greetings_intro_v1` | `lesson-15min-workplace-greetings` | None | General | canonical | adapt_requires_permission | 6 source_derived, 1 authored (`rdg_scanning_microtext_001`, CAT-excluded per G-Q7) | `packs/a2/pack-les-a2-greetings-intro.md` |
| `pack_les_rem_confidence_builder_v1` | `les_rem_confidence_builder` | None | Remediation | legacy_v1 | cite_only | — | `packs/remediation/pack_les_rem_confidence_builder_v1.md` |
| `pack_les_rem_grammar_be_pronouns_v1` | `les_rem_grammar_be_pronouns` | None | Remediation | legacy_v1 | cite_only | — | `packs/remediation/pack_les_rem_grammar_be_pronouns_v1.md` |
| `pack_les_rem_listening_slow_clear_v1` | `les_rem_listening_slow_clear` | None | Remediation | legacy_v1 | cite_only | — | `packs/remediation/pack_les_rem_listening_slow_clear_v1.md` |
| `pack_les_rem_pronunciation_th_vw_v1` | `les_rem_pronunciation_th_vw` | None | Remediation | legacy_v1 | cite_only | — | `packs/remediation/pack_les_rem_pronunciation_th_vw_v1.md` |
| `pack_les_rem_writing_svo_v1` | `les_rem_writing_svo` | None | Remediation | legacy_v1 | cite_only | — | `packs/remediation/pack_les_rem_writing_svo_v1.md` |

---

## 5. Fila Priorizada em Ondas (Waves) de Reautoria

Objetivo de cada onda: reescrever integralmente o conteúdo didático/itens para **`authored_material`** (autoria própria, sem reprodução/adaptação de fontes restritas ou dependência de `cite_only`/`adapt_with_attribution`/cobertura `thin`), atualizar metadados de proveniência, e migrar o pack associado ao schema canônico conforme aplicável.

### Onda 1 — Crítica (Trilha TI B1/B2 e nós bloqueados)

**Escopo:** 18 lições (toda a trilha IT B1/B2 + `les_b1_it_presentations` bloqueada). Inclui itens com `sourced_external_thin` e o nó sem fonte adequada.

| Lesson ID | CEFR | Trilha | Base/estado atual | Habilidades/objetivo-alvo (reautoria) | Arquivo |
|---|---|---|---|---|---|
| `les_b1_it_acronyms_deep` | B1 | IT | `cite_only` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_acronyms_deep.md` |
| `les_b1_it_architecture_vocab` | B1 | IT | ~~`adapt_with_attribution`~~ → `authored_material` ✅ Lote 1 | Inglês técnico TI — reautoria integral concluída | `lessons/b1/les_b1_it_architecture_vocab.md` |
| `les_b1_it_bdd_specs` | B1 | IT | `cite_only` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_bdd_specs.md` |
| `les_b1_it_code_review` | B1 | IT | ~~`adapt_with_attribution`~~ → `authored_material` ✅ Lote 1 | Inglês técnico TI — reautoria integral concluída | `lessons/b1/les_b1_it_code_review.md` |
| `les_b1_it_ddd_modeling` | B1 | IT | `cite_only` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_ddd_modeling.md` |
| `les_b1_it_debugging` | B1 | IT | `adapt_with_attribution` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_debugging.md` |
| `les_b1_it_devops_basics` | B1 | IT | `cite_only` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_devops_basics.md` |
| `les_b1_it_presentations` | B1 | IT | `blocked_no_adequate_source` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks · **BLOQUEADA (criar arquivo e definir fonte/escopo autoral)** | `(sem arquivo em lessons/ — nó bloqueado no registro §4.3)` |
| `les_b1_it_ux_collab` | B1 | IT | `cite_only` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_ux_collab.md` |
| `les_b1_it_write_docs` | B1 | IT | `adapt_with_attribution` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_write_docs.md` |
| `les_b2_it_advanced_patterns` | B2 | IT | `cite_only` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_advanced_patterns.md` |
| `les_b2_it_architecture_decisions` | B2 | IT | `adapt_with_attribution` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_architecture_decisions.md` |
| `les_b2_it_incident_postmortem` | B2 | IT | `adapt_with_attribution` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_incident_postmortem.md` |
| `les_b2_it_jargon_mastery` | B2 | IT | `cite_only` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_jargon_mastery.md` |
| `les_b2_it_mentoring` | B2 | IT | `adapt_with_attribution` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks · **thin** | `lessons/b2/les_b2_it_mentoring.md` |
| `les_b2_it_rfc_writing` | B2 | IT | `adapt_with_attribution` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks · **thin** | `lessons/b2/les_b2_it_rfc_writing.md` |
| `les_b2_it_strategy` | B2 | IT | `cite_only` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_strategy.md` |
| `les_b2_it_technical_leadership` | B2 | IT | `cite_only` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_technical_leadership.md` |

**Packs associados (Onda 1):** migrar os packs dos mesmos `lesson_id` para schema canônico, declarar `**Reuse basis:** authored_material` coerente com os itens, e garantir conformidade de `item_id`/chaves/distratores.
- `packs/b1/pack_les_b1_it_acronyms_deep_v1.md` (lesson `les_b1_it_acronyms_deep`, schema legacy_v1, base atual `cite_only`)
- ~~`packs/b1/pack_les_b1_it_architecture_vocab_v1.md`~~ → `packs/b1/pack-les-b1-it-architecture-vocab.md` (lesson `les_b1_it_architecture_vocab`, canônico, `authored_material`, ✅ Lote 1)
- `packs/b1/pack_les_b1_it_bdd_specs_v1.md` (lesson `les_b1_it_bdd_specs`, schema legacy_v1, base atual `cite_only`)
- ~~`packs/b1/pack_les_b1_it_code_review_v1.md`~~ → `packs/b1/pack-les-b1-it-code-review.md` (lesson `les_b1_it_code_review`, canônico, `authored_material`, ✅ Lote 1)
- `packs/b1/pack_les_b1_it_ddd_modeling_v1.md` (lesson `les_b1_it_ddd_modeling`, schema legacy_v1, base atual `cite_only`)
- `packs/b1/pack_les_b1_it_debugging_v1.md` (lesson `les_b1_it_debugging`, schema legacy_v1, base atual `cite_only`)
- `packs/b1/pack_les_b1_it_devops_basics_v1.md` (lesson `les_b1_it_devops_basics`, schema legacy_v1, base atual `cite_only`)
- `packs/b1/pack_les_b1_it_ux_collab_v1.md` (lesson `les_b1_it_ux_collab`, schema legacy_v1, base atual `cite_only`)
- `packs/b1/pack_les_b1_it_write_docs_v1.md` (lesson `les_b1_it_write_docs`, schema legacy_v1, base atual `cite_only`)
- `packs/b2/pack_les_b2_it_advanced_patterns_v1.md` (lesson `les_b2_it_advanced_patterns`, schema legacy_v1, base atual `cite_only`)
- `packs/b2/pack_les_b2_it_architecture_decisions_v1.md` (lesson `les_b2_it_architecture_decisions`, schema legacy_v1, base atual `cite_only`)
- `packs/b2/pack_les_b2_it_incident_postmortem_v1.md` (lesson `les_b2_it_incident_postmortem`, schema legacy_v1, base atual `cite_only`)
- `packs/b2/pack_les_b2_it_jargon_mastery_v1.md` (lesson `les_b2_it_jargon_mastery`, schema legacy_v1, base atual `cite_only`)
- ~~`packs/b2/pack_les_b2_it_mentoring_v1.md`~~ → `packs/b2/pack-les-b2-it-mentoring.md` (lesson `les_b2_it_mentoring`, canônico, `authored_material`, ✅ Lote 1)
- ~~`packs/b2/pack_les_b2_it_rfc_writing_v1.md`~~ → `packs/b2/pack-les-b2-it-rfc-writing.md` (lesson `les_b2_it_rfc_writing`, canônico, `authored_material`, ✅ Lote 1)
- `packs/b2/pack_les_b2_it_strategy_v1.md` (lesson `les_b2_it_strategy`, schema legacy_v1, base atual `cite_only`)
- `packs/b2/pack_les_b2_it_technical_leadership_v1.md` (lesson `les_b2_it_technical_leadership`, schema legacy_v1, base atual `cite_only`)

### Onda 2 — Fundação A1/A2 (Onboarding do aluno)

**Escopo:** 70 lições (todos os níveis A1 e A2, trilhas General e IT). Prioridade: estabelecer base 100% autoral antes da progressão para B1/B2.

| Lesson ID | CEFR | Trilha | Base atual | Habilidades/objetivo-alvo (reautoria) | Arquivo |
|---|---|---|---|---|---|
| `les_a1_alphabet_sounds` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 2 (batch 2) | Alfabeto, sons e nomes das letras — reautoria integral concluída | `lessons/a1/les_a1_alphabet_sounds.md` |
| `les_a1_articles_nouns` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 6 (batch 6) | Artigos, substantivos e adjetivos — regras gramaticais são fatos não protegidos; apresentação 100% autoral. — reautoria integral concluída. | `lessons/a1/les_a1_articles_nouns.md` |
| `les_a1_daily_basics` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Lote 2 (Onda 2) | Fundação comunicativa/gramatical/vocabulário A1–A2 — reautoria integral concluída | `lessons/a1/les_a1_daily_basics.md` |
| `les_a1_days_months` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 3 (batch 3) — Fase A | Dias da semana e meses — reautoria integral concluída | `lessons/a1/les_a1_days_months.md` |
| `les_a1_en_us_en_gb` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 2 (batch 2) | Inglês americano vs. britânico — reautoria integral concluída | `lessons/a1/les_a1_en_us_en_gb.md` |
| `les_a1_false_cognates` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 5 (batch 5) — Fase C | Falsos cognatos: armadilhas de transferência BR-PT → inglês — reautoria integral concluída. | `lessons/a1/les_a1_false_cognates.md` |
| `les_a1_food` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 4 (batch 4) — Fase B | Comida e bebida — vocabulário e expressões de refeição; reautoria integral concluída. | `lessons/a1/les_a1_food.md` |
| `les_a1_greetings` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Lote 2 (Onda 2) | Cumprimentos, apresentações e interação social básica — reautoria integral concluída | `lessons/a1/les_a1_greetings.md` |
| `les_a1_have_has` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 5 (batch 5) — Fase C | Verbo to have: possessão, have got e contraste com there is/are — reautoria integral concluída. | `lessons/a1/les_a1_have_has.md` |
| `les_a1_intro_dialogue` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Lote 2 (Onda 2) | Cumprimentos, apresentações e interação social básica — reautoria integral concluída | `lessons/a1/les_a1_intro_dialogue.md` |
| `les_a1_numbers_colors` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 3 (batch 3) — Fase A | Números e cores — reautoria integral concluída | `lessons/a1/les_a1_numbers_colors.md` |
| `les_a1_occupations` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 4 (batch 4) — Fase B | Profissões e papéis — vocabulário de ocupações e descrição de rotina; reautoria integral concluída. | `lessons/a1/les_a1_occupations.md` |
| `les_a1_present_simple` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 4 (batch 4) — Fase B | Presente simples na forma afirmativa — rotina e fatos habituais; reautoria integral concluída. | `lessons/a1/les_a1_present_simple.md` |
| `les_a1_present_simple_questions` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 4 (batch 4) — Fase B | Perguntas com do/does — formação e prática no presente simples; reautoria integral concluída. | `lessons/a1/les_a1_present_simple_questions.md` |
| `les_a1_pronouns_demonstrative` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 3 (batch 3) — Fase A | Demonstrativos: this/that/these/those — reautoria integral concluída | `lessons/a1/les_a1_pronouns_demonstrative.md` |
| `les_a1_pronouns_possessive` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 2 (batch 2) | Pronomes possessivos — reautoria integral concluída | `lessons/a1/les_a1_pronouns_possessive.md` |
| `les_a1_pronouns_subject_object` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 2 (batch 2) | Pronomes pessoais: sujeito e objeto — reautoria integral concluída | `lessons/a1/les_a1_pronouns_subject_object.md` |
| `les_a1_pronunciation_intro` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Lote 2 (Onda 2) | Pronúncia e consciência fonológica A1 — reautoria integral concluída | `lessons/a1/les_a1_pronunciation_intro.md` |
| `les_a1_reading_skimming` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 5 (batch 5) — Fase C | Skimming e scanning: leitura rápida para ideia geral e informação específica — reautoria integral concluída. | `lessons/a1/les_a1_reading_skimming.md` |
| `les_a1_regular_verbs_past` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 4 (batch 4) — Fase B | Passado simples com verbos regulares — regras de formação em '-ed' e prática; reautoria integral concluída. | `lessons/a1/les_a1_regular_verbs_past.md` |
| `les_a1_there_is_are` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 5 (batch 5) — Fase C | There is / there are: existência e localização no singular e plural — reautoria integral concluída. | `lessons/a1/les_a1_there_is_are.md` |
| `les_a1_time_dates` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 3 (batch 3) — Fase A | Horas e datas — reautoria integral concluída | `lessons/a1/les_a1_time_dates.md` |
| `les_a1_to_be_forms` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 2 (batch 2) | Verbo To Be: afirmativa/negativa/interrogativa — reautoria integral concluída | `lessons/a1/les_a1_to_be_forms.md` |
| `les_a1_wh_questions` | A1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 3 (batch 3) — Fase A | Interrogativas: WH-words + How+Advérbio — reautoria integral concluída | `lessons/a1/les_a1_wh_questions.md` |
| `les_a2_airport` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 7 (batch 7) | Aeroporto e imigração — trocas 100% autorais. — reautoria integral concluída. | `lessons/a2/les_a2_airport.md` |
| `les_a2_ask_for_help` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 6 (batch 6) | Pedir ajuda e ganhar tempo no trabalho — apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_ask_for_help.md` |
| `les_a2_collocations` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 7 (batch 7) | Colocações em contexto de viagem — apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_collocations.md` |
| `les_a2_corporate_wrapup` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 6 (batch 6) | Encerramento de conversas e assinaturas — apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_corporate_wrapup.md` |
| `les_a2_corpus_intro` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 6 (batch 6) | Siglas e jargão corporativo — listas reconstruídas como análise contrastiva original; apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_corpus_intro.md` |
| `les_a2_deadlines_tasks` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 6 (batch 6) | Prazos, tarefas e follow-up — apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_deadlines_tasks.md` |
| `les_a2_email_basics` | A2 | General | `cite_only` | Leitura/escrita funcional A2 — reautoria integral | `lessons/a2/les_a2_email_basics.md` |
| `les_a2_feedback_praise` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 6 (batch 6) | Feedback, elogios e desculpas — apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_feedback_praise.md` |
| `les_a2_future_will` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 6 (batch 6) | Futuro com will e going to — regras gramaticais são fatos não protegidos; apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_future_will.md` |
| `les_a2_greetings_intro` | A2 | General | `cite_only` | Cumprimentos, apresentações e interação social básica — reautoria integral | `lessons/a2/lesson-15min-workplace-greetings.md` |
| `les_a2_hotel_taxi` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 7 (batch 7) | Hotel e transporte — trocas 100% autorais. — reautoria integral concluída. | `lessons/a2/les_a2_hotel_taxi.md` |
| `les_a2_imperatives` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 7 (batch 7) | Imperativos para instruções e procedimentos — regras gramaticais são fatos não protegidos; apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_imperatives.md` |
| `les_a2_introducing_others` | A2 | General | `cite_only` | Cumprimentos, apresentações e interação social básica — reautoria integral | `lessons/a2/les_a2_introducing_others.md` |
| `les_a2_meeting_open` | A2 | General | `cite_only` | Fundação comunicativa/gramatical/vocabulário A1–A2 (contexto geral ou TI conforme trilha) — reautoria integral | `lessons/a2/les_a2_meeting_open.md` |
| `les_a2_meeting_participate` | A2 | General | `cite_only` | Fundação comunicativa/gramatical/vocabulário A1–A2 (contexto geral ou TI conforme trilha) — reautoria integral | `lessons/a2/les_a2_meeting_participate.md` |
| `les_a2_modals_can_need` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 6 (batch 6) | Modais can, need e should — regras gramaticais são fatos não protegidos; apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_modals_can_need.md` |
| `les_a2_past_narrative` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 6 (batch 6) | Narração no passado em contexto profissional — apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_past_narrative.md` |
| `les_a2_phone_calls` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 5 (batch 5) — Fase C | Chamadas de telefone e vídeo: abrir, conduzir e encerrar ligações de trabalho — reautoria integral concluída. | `lessons/a2/les_a2_phone_calls.md` |
| `les_a2_prepositions_basic` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 7 (batch 7) | Preposições de lugar e tempo — regras gramaticais são fatos não protegidos; apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_prepositions_basic.md` |
| `les_a2_present_continuous` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 6 (batch 6) | Present continuous em fluxos de trabalho — regras gramaticais são fatos não protegidos; apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_present_continuous.md` |
| `les_a2_reading_strategy` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 7 (batch 7) | Estratégias de leitura (skim, scan, contexto, cognatos) — apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_reading_strategy.md` |
| `les_a2_restaurant_shopping` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 7 (batch 7) | Restaurante, compras e emergências — trocas 100% autorais. — reautoria integral concluída. | `lessons/a2/les_a2_restaurant_shopping.md` |
| `les_a2_small_talk` | A2 | General | `cite_only` | Cumprimentos, apresentações e interação social básica — reautoria integral | `lessons/a2/les_a2_small_talk.md` |
| `les_a2_stress_timing` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 7 (batch 7) | Stress-timing e word stress — modelo e exemplos de drill 100% autorais. — reautoria integral concluída. | `lessons/a2/les_a2_stress_timing.md` |
| `les_a2_travel_vocab_core` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 7 (batch 7) | Vocabulário central de viagem — lista reconstruída como análise contrastiva original; apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_travel_vocab_core.md` |
| `les_a2_writing_bio` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the writing model and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_writing_bio.md` |
| `les_a2_writing_messages` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the writing model and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_writing_messages.md` |
| `les_a2_writing_past` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the writing model and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_writing_past.md` |
| `les_a2_writing_selfcheck` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the writing model and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_writing_selfcheck.md` |
| `les_a2_writing_svo` | A2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 7 (batch 7) | Ordem SVO, sujeito explícito e consistência de tempo verbal — apresentação 100% autoral. — reautoria integral concluída. | `lessons/a2/les_a2_writing_svo.md` |
| `les_a2_it_algorithms_basics` | A2 | IT | `cite_only` | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_algorithms_basics.md` |
| `les_a2_it_clean_code_basics` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_clean_code_basics.md` |
| `les_a2_it_computer_parts` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_computer_parts.md` |
| `les_a2_it_email_technical` | A2 | IT | `cite_only` | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_email_technical.md` |
| `les_a2_it_incidents` | A2 | IT | `adapt_with_attribution` | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_incidents.md` |
| `les_a2_it_internet_history` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_internet_history.md` |
| `les_a2_it_meeting_standup` | A2 | IT | ~~`adapt_with_attribution` · **thin**~~ → `authored_material` ✅ Lote 2 (Onda 2) | Inglês instrumental para TI A2 (stand-up) — reautoria integral concluída | `lessons/a2/les_a2_it_meeting_standup.md` |
| `les_a2_it_nontech_tech` | A2 | IT | `cite_only` | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_nontech_tech.md` |
| `les_a2_it_pr_tickets` | A2 | IT | `cite_only` | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_pr_tickets.md` |
| `les_a2_it_reading_strategy` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_reading_strategy.md` |
| `les_a2_it_roles_hierarchy` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_roles_hierarchy.md` |
| `les_a2_it_system_unit` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_system_unit.md` |
| `les_a2_it_terms_basics` | A2 | IT | `adapt_with_attribution` | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_terms_basics.md` |
| `les_a2_it_testing_fundamentals` | A2 | IT | `cite_only` | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_testing_fundamentals.md` |
| `les_a2_it_typescript_basics` | A2 | IT | `cite_only` | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_typescript_basics.md` |
| `les_a2_it_word_formation` | A2 | IT | `cite_only` | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_word_formation.md` |

**Packs associados (Onda 2):** reautoria e migração dos packs A1/A2 (canônicos e legados) alinhados aos novos textos autorais.

- **Lote 2 (Onda 2, 2026-11-16):** migrados para canônico `authored_material` os packs de `les_a1_greetings`, `les_a1_intro_dialogue`, `les_a1_daily_basics`, `les_a1_pronunciation_intro`, `les_a2_it_meeting_standup`; legados v1 correspondentes removidos (catraca 106).
- **Onda 2 — Lote 2 (batch 2, 2026-11-16):** migrados para canônico `authored_material` os packs de `les_a1_alphabet_sounds`, `les_a1_en_us_en_gb`, `les_a1_to_be_forms`, `les_a1_pronouns_subject_object`, `les_a1_pronouns_possessive`; legados v1 correspondentes removidos (catraca `_legacy_packs_baseline.json` = 101).
- **Onda 2 — Lote 4 (batch 4) — Fase B, Fundação A1/A2 (2026-11-16):** migrados para canônico `authored_material` os packs de `les_a1_food`, `les_a1_occupations`, `les_a1_regular_verbs_past`, `les_a1_present_simple`, `les_a1_present_simple_questions` (`packs/a1/pack-les-a1-food.md`, `packs/a1/pack-les-a1-occupations.md`, `packs/a1/pack-les-a1-regular-verbs-past.md`, `packs/a1/pack-les-a1-present-simple.md`, `packs/a1/pack-les-a1-present-simple-questions.md`); legados v1 correspondentes removidos do disco (catraca `_legacy_packs_baseline.json` 96→**91**).

- **Onda 2 — Lote 5 (batch 5) — Fase C, Fundação A1/A2 (2026-11-16):** migrados para canônico `authored_material` os packs de `les_a1_have_has`, `les_a1_there_is_are`, `les_a1_reading_skimming`, `les_a1_false_cognates`, `les_a2_phone_calls` (`packs/a1/pack-les-a1-have-has.md`, `packs/a1/pack-les-a1-there-is-are.md`, `packs/a1/pack-les-a1-reading-skimming.md`, `packs/a1/pack-les-a1-false-cognates.md`, `packs/a2/pack-les-a2-phone-calls.md`); legados v1 correspondentes removidos do disco (catraca `_legacy_packs_baseline.json` 91→**86**).
- **Onda 2 — Lote 6 (batch 6), Fundação A1/A2 (2026-11-18):** migrados para canônico `authored_material` os packs de `les_a1_articles_nouns`, `les_a2_ask_for_help`, `les_a2_deadlines_tasks`, `les_a2_feedback_praise`, `les_a2_corporate_wrapup`, `les_a2_corpus_intro`, `les_a2_past_narrative`, `les_a2_future_will`, `les_a2_present_continuous`, `les_a2_modals_can_need` (`packs/a1/pack-les-a1-articles-nouns.md`, `packs/a2/pack-les-a2-ask-for-help.md`, `packs/a2/pack-les-a2-deadlines-tasks.md`, `packs/a2/pack-les-a2-feedback-praise.md`, `packs/a2/pack-les-a2-corporate-wrapup.md`, `packs/a2/pack-les-a2-corpus-intro.md`, `packs/a2/pack-les-a2-past-narrative.md`, `packs/a2/pack-les-a2-future-will.md`, `packs/a2/pack-les-a2-present-continuous.md`, `packs/a2/pack-les-a2-modals-can-need.md`); legados v1 correspondentes removidos do disco (catraca `_legacy_packs_baseline.json` 86→**76**).
- **Onda 2 — Lote 7 (batch 7), Fundação A2 (2026-11-18):** migrados para canônico `authored_material` os packs de `les_a2_imperatives`, `les_a2_prepositions_basic`, `les_a2_travel_vocab_core`, `les_a2_collocations`, `les_a2_stress_timing`, `les_a2_airport`, `les_a2_hotel_taxi`, `les_a2_restaurant_shopping`, `les_a2_reading_strategy`, `les_a2_writing_svo` (`packs/a2/pack-les-a2-imperatives.md`, `packs/a2/pack-les-a2-prepositions-basic.md`, `packs/a2/pack-les-a2-travel-vocab-core.md`, `packs/a2/pack-les-a2-collocations.md`, `packs/a2/pack-les-a2-stress-timing.md`, `packs/a2/pack-les-a2-airport.md`, `packs/a2/pack-les-a2-hotel-taxi.md`, `packs/a2/pack-les-a2-restaurant-shopping.md`, `packs/a2/pack-les-a2-reading-strategy.md`, `packs/a2/pack-les-a2-writing-svo.md`); legados v1 correspondentes removidos do disco (catraca `_legacy_packs_baseline.json` 76→**66**).

### Onda 3 — Consolidação B1/B2 General + Remediação + Migração de Packs Legados

**Escopo lições:** 35 lições B1/B2 General e remediação (não-IT). **Escopo packs:** migração integral dos **56 packs legados v1** remanescentes para schema canônico, com reautoria para `authored_material`.

| Lesson ID | CEFR | Trilha | Base atual | Habilidades/objetivo-alvo (reautoria) | Arquivo |
|---|---|---|---|---|---|
| `les_b1_conditionals` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_conditionals.md` |
| `les_b1_finance_business` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_finance_business.md` |
| `les_b1_hr_career` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_hr_career.md` |
| `les_b1_leadership_feedback` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_leadership_feedback.md` |
| `les_b1_modals` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_modals.md` |
| `les_b1_negotiation` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_negotiation.md` |
| `les_b1_passive` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_passive.md` |
| `les_b1_presentation_skills` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_presentation_skills.md` |
| `les_b1_project_case_study` | B1 | General | `adapt_with_attribution` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_case_study.md` |
| `les_b1_project_client_sim` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_client_sim.md` |
| `les_b1_project_integrated_review` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_integrated_review.md` |
| `les_b1_project_negotiation_roleplay` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_negotiation_roleplay.md` |
| `les_b1_project_presentation_final` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_presentation_final.md` |
| `les_b1_project_retrospective` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_retrospective.md` |
| `les_b1_question_forms` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_question_forms.md` |
| `les_b1_reported_speech` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_reported_speech.md` |
| `les_b1_sales_marketing` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_sales_marketing.md` |
| `les_b1_tenses_review` | B1 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_tenses_review.md` |
| `les_rem_confidence_builder` | B1 | Remediation | `cite_only` | Remediação dirigida (lacunas diagnósticas) — reautoria integral e alinhamento ao gatilho | `lessons/remediation/les_rem_confidence_builder.md` |
| `les_rem_grammar_be_pronouns` | B1 | Remediation | `cite_only` | Remediação dirigida (lacunas diagnósticas) — reautoria integral e alinhamento ao gatilho | `lessons/remediation/les_rem_grammar_be_pronouns.md` |
| `les_rem_listening_slow_clear` | B1 | Remediation | `cite_only` | Remediação dirigida (lacunas diagnósticas) — reautoria integral e alinhamento ao gatilho | `lessons/remediation/les_rem_listening_slow_clear.md` |
| `les_rem_pronunciation_th_vw` | B1 | Remediation | `cite_only` | Remediação dirigida (lacunas diagnósticas) — reautoria integral e alinhamento ao gatilho | `lessons/remediation/les_rem_pronunciation_th_vw.md` |
| `les_rem_writing_svo` | B1 | Remediation | `cite_only` | Remediação dirigida (lacunas diagnósticas) — reautoria integral e alinhamento ao gatilho | `lessons/remediation/les_rem_writing_svo.md` |
| `les_b2_celpe_br` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_celpe_br.md` |
| `les_b2_culture_brazil_vs_usa` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_culture_brazil_vs_usa.md` |
| `les_b2_exam_simulations` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_exam_simulations.md` |
| `les_b2_exam_vocab` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_exam_vocab.md` |
| `les_b2_ielts_writing` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_ielts_writing.md` |
| `les_b2_professional_argument` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_professional_argument.md` |
| `les_b2_professional_email_advanced` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_professional_email_advanced.md` |
| `les_b2_professional_review` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_professional_review.md` |
| `les_b2_professional_summary` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_professional_summary.md` |
| `les_b2_register_nuance` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_register_nuance.md` |
| `les_b2_toeic_reading` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_toeic_reading.md` |
| `les_b2_toeic_writing` | B2 | General | `cite_only` | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_toeic_writing.md` |

**Backlog de migração de packs legados (todos os schemas `legacy_v1`):**
- ~~`packs/a1/pack_les_a1_alphabet_sounds_v1.md`~~ → `packs/a1/pack-les-a1-alphabet-sounds.md` (lesson `les_a1_alphabet_sounds`, canônico, `authored_material`, ✅ Onda 2 — Lote 2 (batch 2))
- ~~~`packs/a1/pack_les_a1_articles_nouns_v1.md`~~ → `packs/a1/pack-les-a1-articles-nouns.md` (lesson `les_a1_articles_nouns`, canônico, `authored_material`, ✅ Onda 2 — Lote 6 (batch 6))
- ~~`packs/a1/pack_les_a1_daily_basics_v1.md`~~ → `packs/a1/pack-les-a1-daily-basics.md` (lesson `les_a1_daily_basics`, canônico, `authored_material`, ✅ Lote 2 Onda 2)
- ~~`packs/a1/pack_les_a1_days_months_v1.md`~~ → `packs/a1/pack-les-a1-days-months.md` (lesson `les_a1_days_months`, canônico, `authored_material`, ✅ Onda 2 — Lote 3 (batch 3) — Fase A)
- ~~`packs/a1/pack_les_a1_en_us_en_gb_v1.md`~~ → `packs/a1/pack-les-a1-en-us-en-gb.md` (lesson `les_a1_en_us_en_gb`, canônico, `authored_material`, ✅ Onda 2 — Lote 2 (batch 2))
- ~~`packs/a1/pack_les_a1_false_cognates_v1.md`~~ → `packs/a1/pack-les-a1-false-cognates.md` (lesson `les_a1_false_cognates`, canônico, `authored_material`, ✅ Onda 2 — Lote 5 (batch 5) — Fase C)
- ~~`packs/a1/pack_les_a1_food_v1.md`~~ → `packs/a1/pack-les-a1-food.md` (lesson `les_a1_food`, canônico, `authored_material`, ✅ Onda 2 — Lote 4 (batch 4) — Fase B)
- ~~`packs/a1/pack_les_a1_greetings_v1.md`~~ → `packs/a1/pack-les-a1-greetings.md` (lesson `les_a1_greetings`, canônico, `authored_material`, ✅ Lote 2 Onda 2)
- ~~`packs/a1/pack_les_a1_have_has_v1.md`~~ → `packs/a1/pack-les-a1-have-has.md` (lesson `les_a1_have_has`, canônico, `authored_material`, ✅ Onda 2 — Lote 5 (batch 5) — Fase C)
- ~~`packs/a1/pack_les_a1_intro_dialogue_v1.md`~~ → `packs/a1/pack-les-a1-intro-dialogue.md` (lesson `les_a1_intro_dialogue`, canônico, `authored_material`, ✅ Lote 2 Onda 2)
- ~~`packs/a1/pack_les_a1_numbers_colors_v1.md`~~ → `packs/a1/pack-les-a1-numbers-colors.md` (lesson `les_a1_numbers_colors`, canônico, `authored_material`, ✅ Onda 2 — Lote 3 (batch 3) — Fase A)
- ~~`packs/a1/pack_les_a1_occupations_v1.md`~~ → `packs/a1/pack-les-a1-occupations.md` (lesson `les_a1_occupations`, canônico, `authored_material`, ✅ Onda 2 — Lote 4 (batch 4) — Fase B)
- ~~`packs/a1/pack_les_a1_present_simple_questions_v1.md`~~ → `packs/a1/pack-les-a1-present-simple-questions.md` (lesson `les_a1_present_simple_questions`, canônico, `authored_material`, ✅ Onda 2 — Lote 4 (batch 4) — Fase B)
- ~~`packs/a1/pack_les_a1_present_simple_v1.md`~~ → `packs/a1/pack-les-a1-present-simple.md` (lesson `les_a1_present_simple`, canônico, `authored_material`, ✅ Onda 2 — Lote 4 (batch 4) — Fase B)
- ~~`packs/a1/pack_les_a1_pronouns_demonstrative_v1.md`~~ → `packs/a1/pack-les-a1-pronouns-demonstrative.md` (lesson `les_a1_pronouns_demonstrative`, canônico, `authored_material`, ✅ Onda 2 — Lote 3 (batch 3) — Fase A)
- ~~`packs/a1/pack_les_a1_pronouns_possessive_v1.md`~~ → `packs/a1/pack-les-a1-pronouns-possessive.md` (lesson `les_a1_pronouns_possessive`, canônico, `authored_material`, ✅ Onda 2 — Lote 2 (batch 2))
- ~~`packs/a1/pack_les_a1_pronouns_subject_object_v1.md`~~ → `packs/a1/pack-les-a1-pronouns-subject-object.md` (lesson `les_a1_pronouns_subject_object`, canônico, `authored_material`, ✅ Onda 2 — Lote 2 (batch 2))
- ~~`packs/a1/pack_les_a1_pronunciation_intro_v1.md`~~ → `packs/a1/pack-les-a1-pronunciation-intro.md` (lesson `les_a1_pronunciation_intro`, canônico, `authored_material`, ✅ Lote 2 Onda 2)
- ~~`packs/a1/pack_les_a1_reading_skimming_v1.md`~~ → `packs/a1/pack-les-a1-reading-skimming.md` (lesson `les_a1_reading_skimming`, canônico, `authored_material`, ✅ Onda 2 — Lote 5 (batch 5) — Fase C)
- ~~`packs/a1/pack_les_a1_regular_verbs_past_v1.md`~~ → `packs/a1/pack-les-a1-regular-verbs-past.md` (lesson `les_a1_regular_verbs_past`, canônico, `authored_material`, ✅ Onda 2 — Lote 4 (batch 4) — Fase B)
- ~~`packs/a1/pack_les_a1_there_is_are_v1.md`~~ → `packs/a1/pack-les-a1-there-is-are.md` (lesson `les_a1_there_is_are`, canônico, `authored_material`, ✅ Onda 2 — Lote 5 (batch 5) — Fase C)
- ~~`packs/a1/pack_les_a1_time_dates_v1.md`~~ → `packs/a1/pack-les-a1-time-dates.md` (lesson `les_a1_time_dates`, canônico, `authored_material`, ✅ Onda 2 — Lote 3 (batch 3) — Fase A)
- `packs/a1/pack_les_a1_to_be_forms_v1.md` → migrar para schema canônico; lesson `les_a1_to_be_forms`, base atual `cite_only`
- ~~`packs/a1/pack_les_a1_wh_questions_v1.md`~~ → `packs/a1/pack-les-a1-wh-questions.md` (lesson `les_a1_wh_questions`, canônico, `authored_material`, ✅ Onda 2 — Lote 3 (batch 3) — Fase A)
- ~~~`packs/a2/pack_les_a2_airport_v1.md`~~ → `packs/a2/pack-les-a2-airport.md` (lesson `les_a2_airport`, canônico, `authored_material`, ✅ Onda 2 — Lote 7 (batch 7))
- ~~~`packs/a2/pack_les_a2_ask_for_help_v1.md`~~ → `packs/a2/pack-les-a2-ask-for-help.md` (lesson `les_a2_ask_for_help`, canônico, `authored_material`, ✅ Onda 2 — Lote 6 (batch 6))
- ~~~`packs/a2/pack_les_a2_collocations_v1.md`~~ → `packs/a2/pack-les-a2-collocations.md` (lesson `les_a2_collocations`, canônico, `authored_material`, ✅ Onda 2 — Lote 7 (batch 7))
- ~~~`packs/a2/pack_les_a2_corporate_wrapup_v1.md`~~ → `packs/a2/pack-les-a2-corporate-wrapup.md` (lesson `les_a2_corporate_wrapup`, canônico, `authored_material`, ✅ Onda 2 — Lote 6 (batch 6))
- ~~~`packs/a2/pack_les_a2_corpus_intro_v1.md`~~ → `packs/a2/pack-les-a2-corpus-intro.md` (lesson `les_a2_corpus_intro`, canônico, `authored_material`, ✅ Onda 2 — Lote 6 (batch 6))
- ~~~`packs/a2/pack_les_a2_deadlines_tasks_v1.md`~~ → `packs/a2/pack-les-a2-deadlines-tasks.md` (lesson `les_a2_deadlines_tasks`, canônico, `authored_material`, ✅ Onda 2 — Lote 6 (batch 6))
- ~~~`packs/a2/pack_les_a2_feedback_praise_v1.md`~~ → `packs/a2/pack-les-a2-feedback-praise.md` (lesson `les_a2_feedback_praise`, canônico, `authored_material`, ✅ Onda 2 — Lote 6 (batch 6))
- ~~~`packs/a2/pack_les_a2_future_will_v1.md`~~ → `packs/a2/pack-les-a2-future-will.md` (lesson `les_a2_future_will`, canônico, `authored_material`, ✅ Onda 2 — Lote 6 (batch 6))
- ~~~`packs/a2/pack_les_a2_hotel_taxi_v1.md`~~ → `packs/a2/pack-les-a2-hotel-taxi.md` (lesson `les_a2_hotel_taxi`, canônico, `authored_material`, ✅ Onda 2 — Lote 7 (batch 7))
- ~~~`packs/a2/pack_les_a2_imperatives_v1.md`~~ → `packs/a2/pack-les-a2-imperatives.md` (lesson `les_a2_imperatives`, canônico, `authored_material`, ✅ Onda 2 — Lote 7 (batch 7))
- `packs/a2/pack_les_a2_it_algorithms_basics_v1.md` → migrar para schema canônico; lesson `les_a2_it_algorithms_basics`, base atual `cite_only`
- ~~~`packs/a2/pack_les_a2_it_clean_code_basics_v1.md`~~ → `packs/a2/pack-les-a2-it-clean-code-basics.md` (lesson `les_a2_it_clean_code_basics`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_it_computer_parts_v1.md`~~ → `packs/a2/pack-les-a2-it-computer-parts.md` (lesson `les_a2_it_computer_parts`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- `packs/a2/pack_les_a2_it_email_technical_v1.md` → migrar para schema canônico; lesson `les_a2_it_email_technical`, base atual `cite_only`
- `packs/a2/pack_les_a2_it_incidents_v1.md` → migrar para schema canônico; lesson `les_a2_it_incidents`, base atual `cite_only`
- ~~~`packs/a2/pack_les_a2_it_internet_history_v1.md`~~ → `packs/a2/pack-les-a2-it-internet-history.md` (lesson `les_a2_it_internet_history`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~`packs/a2/pack_les_a2_it_meeting_standup_v1.md`~~ → `packs/a2/pack-les-a2-it-meeting-standup.md` (lesson `les_a2_it_meeting_standup`, canônico, `authored_material`, ✅ Lote 2 Onda 2)
- `packs/a2/pack_les_a2_it_nontech_tech_v1.md` → migrar para schema canônico; lesson `les_a2_it_nontech_tech`, base atual `cite_only`
- `packs/a2/pack_les_a2_it_pr_tickets_v1.md` → migrar para schema canônico; lesson `les_a2_it_pr_tickets`, base atual `cite_only`
- ~~~`packs/a2/pack_les_a2_it_reading_strategy_v1.md`~~ → `packs/a2/pack-les-a2-it-reading-strategy.md` (lesson `les_a2_it_reading_strategy`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_it_roles_hierarchy_v1.md`~~ → `packs/a2/pack-les-a2-it-roles-hierarchy.md` (lesson `les_a2_it_roles_hierarchy`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_it_system_unit_v1.md`~~ → `packs/a2/pack-les-a2-it-system-unit.md` (lesson `les_a2_it_system_unit`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- `packs/a2/pack_les_a2_it_testing_fundamentals_v1.md` → migrar para schema canônico; lesson `les_a2_it_testing_fundamentals`, base atual `cite_only`
- `packs/a2/pack_les_a2_it_typescript_basics_v1.md` → migrar para schema canônico; lesson `les_a2_it_typescript_basics`, base atual `cite_only`
- `packs/a2/pack_les_a2_it_word_formation_v1.md` → migrar para schema canônico; lesson `les_a2_it_word_formation`, base atual `cite_only`
- ~~~`packs/a2/pack_les_a2_modals_can_need_v1.md`~~ → `packs/a2/pack-les-a2-modals-can-need.md` (lesson `les_a2_modals_can_need`, canônico, `authored_material`, ✅ Onda 2 — Lote 6 (batch 6))
- ~~~`packs/a2/pack_les_a2_past_narrative_v1.md`~~ → `packs/a2/pack-les-a2-past-narrative.md` (lesson `les_a2_past_narrative`, canônico, `authored_material`, ✅ Onda 2 — Lote 6 (batch 6))
- ~~`packs/a2/pack_les_a2_phone_calls_v1.md`~~ → `packs/a2/pack-les-a2-phone-calls.md` (lesson `les_a2_phone_calls`, canônico, `authored_material`, ✅ Onda 2 — Lote 5 (batch 5) — Fase C)
- ~~~`packs/a2/pack_les_a2_prepositions_basic_v1.md`~~ → `packs/a2/pack-les-a2-prepositions-basic.md` (lesson `les_a2_prepositions_basic`, canônico, `authored_material`, ✅ Onda 2 — Lote 7 (batch 7))
- ~~~`packs/a2/pack_les_a2_present_continuous_v1.md`~~ → `packs/a2/pack-les-a2-present-continuous.md` (lesson `les_a2_present_continuous`, canônico, `authored_material`, ✅ Onda 2 — Lote 6 (batch 6))
- ~~~`packs/a2/pack_les_a2_reading_strategy_v1.md`~~ → `packs/a2/pack-les-a2-reading-strategy.md` (lesson `les_a2_reading_strategy`, canônico, `authored_material`, ✅ Onda 2 — Lote 7 (batch 7))
- ~~~`packs/a2/pack_les_a2_restaurant_shopping_v1.md`~~ → `packs/a2/pack-les-a2-restaurant-shopping.md` (lesson `les_a2_restaurant_shopping`, canônico, `authored_material`, ✅ Onda 2 — Lote 7 (batch 7))
- ~~~`packs/a2/pack_les_a2_stress_timing_v1.md`~~ → `packs/a2/pack-les-a2-stress-timing.md` (lesson `les_a2_stress_timing`, canônico, `authored_material`, ✅ Onda 2 — Lote 7 (batch 7))
- ~~~`packs/a2/pack_les_a2_travel_vocab_core_v1.md`~~ → `packs/a2/pack-les-a2-travel-vocab-core.md` (lesson `les_a2_travel_vocab_core`, canônico, `authored_material`, ✅ Onda 2 — Lote 7 (batch 7))
- ~~~`packs/a2/pack_les_a2_writing_bio_v1.md`~~ → `packs/a2/pack-les-a2-writing-bio.md` (lesson `les_a2_writing_bio`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_writing_messages_v1.md`~~ → `packs/a2/pack-les-a2-writing-messages.md` (lesson `les_a2_writing_messages`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_writing_past_v1.md`~~ → `packs/a2/pack-les-a2-writing-past.md` (lesson `les_a2_writing_past`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_writing_selfcheck_v1.md`~~ → `packs/a2/pack-les-a2-writing-selfcheck.md` (lesson `les_a2_writing_selfcheck`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_writing_svo_v1.md`~~ → `packs/a2/pack-les-a2-writing-svo.md` (lesson `les_a2_writing_svo`, canônico, `authored_material`, ✅ Onda 2 — Lote 7 (batch 7))
- `packs/b1/pack_les_b1_conditionals_v1.md` → migrar para schema canônico; lesson `les_b1_conditionals`, base atual `cite_only`
- `packs/b1/pack_les_b1_finance_business_v1.md` → migrar para schema canônico; lesson `les_b1_finance_business`, base atual `cite_only`
- `packs/b1/pack_les_b1_hr_career_v1.md` → migrar para schema canônico; lesson `les_b1_hr_career`, base atual `cite_only`
- `packs/b1/pack_les_b1_it_acronyms_deep_v1.md` → migrar para schema canônico; lesson `les_b1_it_acronyms_deep`, base atual `cite_only`
- `packs/b1/pack_les_b1_it_architecture_vocab_v1.md` → migrar para schema canônico; lesson `les_b1_it_architecture_vocab`, base atual `cite_only`
- `packs/b1/pack_les_b1_it_bdd_specs_v1.md` → migrar para schema canônico; lesson `les_b1_it_bdd_specs`, base atual `cite_only`
- `packs/b1/pack_les_b1_it_code_review_v1.md` → migrar para schema canônico; lesson `les_b1_it_code_review`, base atual `cite_only`
- `packs/b1/pack_les_b1_it_ddd_modeling_v1.md` → migrar para schema canônico; lesson `les_b1_it_ddd_modeling`, base atual `cite_only`
- `packs/b1/pack_les_b1_it_debugging_v1.md` → migrar para schema canônico; lesson `les_b1_it_debugging`, base atual `cite_only`
- `packs/b1/pack_les_b1_it_devops_basics_v1.md` → migrar para schema canônico; lesson `les_b1_it_devops_basics`, base atual `cite_only`
- `packs/b1/pack_les_b1_it_ux_collab_v1.md` → migrar para schema canônico; lesson `les_b1_it_ux_collab`, base atual `cite_only`
- `packs/b1/pack_les_b1_it_write_docs_v1.md` → migrar para schema canônico; lesson `les_b1_it_write_docs`, base atual `cite_only`
- `packs/b1/pack_les_b1_leadership_feedback_v1.md` → migrar para schema canônico; lesson `les_b1_leadership_feedback`, base atual `cite_only`
- `packs/b1/pack_les_b1_modals_v1.md` → migrar para schema canônico; lesson `les_b1_modals`, base atual `cite_only`
- `packs/b1/pack_les_b1_negotiation_v1.md` → migrar para schema canônico; lesson `les_b1_negotiation`, base atual `cite_only`
- `packs/b1/pack_les_b1_passive_v1.md` → migrar para schema canônico; lesson `les_b1_passive`, base atual `cite_only`
- `packs/b1/pack_les_b1_presentation_skills_v1.md` → migrar para schema canônico; lesson `les_b1_presentation_skills`, base atual `cite_only`
- `packs/b1/pack_les_b1_project_case_study_v1.md` → migrar para schema canônico; lesson `les_b1_project_case_study`, base atual `cite_only`
- `packs/b1/pack_les_b1_project_client_sim_v1.md` → migrar para schema canônico; lesson `les_b1_project_client_sim`, base atual `cite_only`
- `packs/b1/pack_les_b1_project_integrated_review_v1.md` → migrar para schema canônico; lesson `les_b1_project_integrated_review`, base atual `cite_only`
- `packs/b1/pack_les_b1_project_negotiation_roleplay_v1.md` → migrar para schema canônico; lesson `les_b1_project_negotiation_roleplay`, base atual `cite_only`
- `packs/b1/pack_les_b1_project_presentation_final_v1.md` → migrar para schema canônico; lesson `les_b1_project_presentation_final`, base atual `cite_only`
- `packs/b1/pack_les_b1_project_retrospective_v1.md` → migrar para schema canônico; lesson `les_b1_project_retrospective`, base atual `cite_only`
- `packs/b1/pack_les_b1_question_forms_v1.md` → migrar para schema canônico; lesson `les_b1_question_forms`, base atual `cite_only`
- `packs/b1/pack_les_b1_reported_speech_v1.md` → migrar para schema canônico; lesson `les_b1_reported_speech`, base atual `cite_only`
- `packs/b1/pack_les_b1_sales_marketing_v1.md` → migrar para schema canônico; lesson `les_b1_sales_marketing`, base atual `cite_only`
- `packs/b1/pack_les_b1_tenses_review_v1.md` → migrar para schema canônico; lesson `les_b1_tenses_review`, base atual `cite_only`
- `packs/b2/pack_les_b2_celpe_br_v1.md` → migrar para schema canônico; lesson `les_b2_celpe_br`, base atual `cite_only`
- `packs/b2/pack_les_b2_culture_brazil_vs_usa_v1.md` → migrar para schema canônico; lesson `les_b2_culture_brazil_vs_usa`, base atual `cite_only`
- `packs/b2/pack_les_b2_exam_simulations_v1.md` → migrar para schema canônico; lesson `les_b2_exam_simulations`, base atual `cite_only`
- `packs/b2/pack_les_b2_exam_vocab_v1.md` → migrar para schema canônico; lesson `les_b2_exam_vocab`, base atual `cite_only`
- `packs/b2/pack_les_b2_ielts_writing_v1.md` → migrar para schema canônico; lesson `les_b2_ielts_writing`, base atual `cite_only`
- `packs/b2/pack_les_b2_it_advanced_patterns_v1.md` → migrar para schema canônico; lesson `les_b2_it_advanced_patterns`, base atual `cite_only`
- `packs/b2/pack_les_b2_it_architecture_decisions_v1.md` → migrar para schema canônico; lesson `les_b2_it_architecture_decisions`, base atual `cite_only`
- `packs/b2/pack_les_b2_it_incident_postmortem_v1.md` → migrar para schema canônico; lesson `les_b2_it_incident_postmortem`, base atual `cite_only`
- `packs/b2/pack_les_b2_it_jargon_mastery_v1.md` → migrar para schema canônico; lesson `les_b2_it_jargon_mastery`, base atual `cite_only`
- `packs/b2/pack_les_b2_it_mentoring_v1.md` → migrar para schema canônico; lesson `les_b2_it_mentoring`, base atual `cite_only`
- `packs/b2/pack_les_b2_it_rfc_writing_v1.md` → migrar para schema canônico; lesson `les_b2_it_rfc_writing`, base atual `cite_only`
- `packs/b2/pack_les_b2_it_strategy_v1.md` → migrar para schema canônico; lesson `les_b2_it_strategy`, base atual `cite_only`
- `packs/b2/pack_les_b2_it_technical_leadership_v1.md` → migrar para schema canônico; lesson `les_b2_it_technical_leadership`, base atual `cite_only`
- `packs/b2/pack_les_b2_professional_argument_v1.md` → migrar para schema canônico; lesson `les_b2_professional_argument`, base atual `cite_only`
- `packs/b2/pack_les_b2_professional_email_advanced_v1.md` → migrar para schema canônico; lesson `les_b2_professional_email_advanced`, base atual `cite_only`
- `packs/b2/pack_les_b2_professional_review_v1.md` → migrar para schema canônico; lesson `les_b2_professional_review`, base atual `cite_only`
- `packs/b2/pack_les_b2_professional_summary_v1.md` → migrar para schema canônico; lesson `les_b2_professional_summary`, base atual `cite_only`
- `packs/b2/pack_les_b2_register_nuance_v1.md` → migrar para schema canônico; lesson `les_b2_register_nuance`, base atual `cite_only`
- `packs/b2/pack_les_b2_toeic_reading_v1.md` → migrar para schema canônico; lesson `les_b2_toeic_reading`, base atual `cite_only`
- `packs/b2/pack_les_b2_toeic_writing_v1.md` → migrar para schema canônico; lesson `les_b2_toeic_writing`, base atual `cite_only`
- `packs/remediation/pack_les_rem_confidence_builder_v1.md` → migrar para schema canônico; lesson `les_rem_confidence_builder`, base atual `cite_only`
- `packs/remediation/pack_les_rem_grammar_be_pronouns_v1.md` → migrar para schema canônico; lesson `les_rem_grammar_be_pronouns`, base atual `cite_only`
- `packs/remediation/pack_les_rem_listening_slow_clear_v1.md` → migrar para schema canônico; lesson `les_rem_listening_slow_clear`, base atual `cite_only`
- `packs/remediation/pack_les_rem_pronunciation_th_vw_v1.md` → migrar para schema canônico; lesson `les_rem_pronunciation_th_vw`, base atual `cite_only`
- `packs/remediation/pack_les_rem_writing_svo_v1.md` → migrar para schema canônico; lesson `les_rem_writing_svo`, base atual `cite_only`

---

## 6. Checklist de Conformidade por Lição Reautorada

Aplicar a **cada lição** (e ao pack correspondente) ao concluir a reautoria, garantindo aprovação em `python3 verify-integrity.py` (checks relevantes: [2] registro↔filesystem/status, [3b] bases de reuso, [4] JSON, [7] xrefs, [8] lições, [9]/[11b–e] packs, [10]/[12]/[13] conforme conteúdo).

### 6.1 Metadados e proveniência (arquivo da lição)
- [ ] `**Lesson ID:** \`les_...\`` presente, igual ao identificador canônico do registro §4.3 e consistente com o arquivo.
- [ ] `**Reuse basis:** \`authored_material\`` (ou valor válido exigido pelo contrato) declarado no topo/metadados, refletindo autoria 100% original (sem reprodução/adaptação de fonte restrita).
- [ ] `**Status:**` coerente com o estado real (ex.: lição com arquivo válido não pode permanecer como `designed`; nó bloqueado tratado conforme registro). Remover sufixos de sourcing externo (`cite_only`/`adapt_with_attribution`/`sourced_external_thin`) quando a reautoria for integral para `authored_material`.
- [ ] `**Source/Provenance:**` atualizado para refletir autoria própria (sem alegar adaptação de fonte restrita; sem depender de `Ingles/`/`archive/`).
- [ ] CEFR, `**Module:**`/trilha e objetivos alinhados ao nó do currículo; pré-requisitos/desbloqueios preservados conforme grafo.

### 6.2 Estrutura pedagógica e JSON da lição (contrato consumido pelos engines)
- [ ] Estrutura da lição preservada: Input (i+1) → Guided Practice → Output Task → Formative Check (conforme arquitetura ITS).
- [ ] Blocos JSON embutidos **válidos** (parseáveis) e aderentes ao schema esperado pelo repositório (check [4]): campos, tipos e chaves obrigatórias do template de lição vigente.
- [ ] Campos pedagógicos/operacionais do JSON da lição atualizados de forma consistente: identificadores (`lesson_id`/refs), `cefr`, habilidades/domínios-alvo, objetivos/can-do, itens/exercícios, gabaritos/rubricas, metadados de proveniência quando presentes no schema, e links/referências internos válidos.
- [ ] Vocabulário, exemplos e contextos 100% autorais; sem texto/estrutura copiada das fontes restritas listadas em `AGENTS.md`/`external-sources.md` §0.5.1.

### 6.3 Pack associado (migração e conformidade)
- [ ] Pack migrado para **schema canônico** `pack-les-*.md` (quando aplicável), com manifesto/estrutura conforme `post-lesson-practice-spec.md`.
- [ ] `**Reuse basis:**` do pack compatível com a proveniência dos itens (check [11b]) e alinhado a `authored_material` após reautoria.
- [ ] `item_id` único e no padrão/namespace exigido (`assessment-item-spec.md` §1.2; checks [9]/[11c]); cada item com chave/gabarito quando houver conjunto de alternativas (check [11d]) e sem opções duplicadas (check [11e]).
- [ ] `br_pt_form`/glossário e notas de distratores presentes conforme o schema canônico; proveniência dos itens declarada e coerente.

### 6.4 Gates finais por lote de reautoria
- [ ] `python3 verify-integrity.py` → **PASS 14/14**.
- [ ] `python3 prd-score.py` executado quando aplicável a mudanças de estado documental cobertas pelo score (recomendado para auditoria de consistência).
- [ ] Atualização do registro `specs/curriculum-graph-spec.md` §4.3 (status/sufixos) consistente com o filesystem, se a reautoria alterar estado declarado.

---

## 7. Notas de conformidade desta auditoria
- Auditoria **não destrutiva**: nenhum arquivo em `lessons/`, `packs/`, `specs/` ou código de `its-platform/` foi modificado.
- Diretórios `Ingles/` e `archive/` **não** foram lidos, abertos, listados nem transcritos.
- O placar reflete o estado observado nos arquivos `.md` auditados e no nó bloqueado registrado em `curriculum-graph-spec.md` §4.3; divergências históricas entre contagens resumidas em specs/PRD devem ser tratadas pelas verificações de integridade existentes.


---

## 6. Registro de Execução — Lote 1 (2026-11-16)

- **Escopo entregue:** `les_b1_it_presentations` (criada/desbloqueada), `les_b1_it_architecture_vocab`, `les_b1_it_code_review`, `les_b2_it_mentoring`, `les_b2_it_rfc_writing` — lições e packs 100% `authored_material` (clean-room, pt-BR → en-US, TI).
- **Packs migrados para schema canônico:** `pack-les-b1-it-presentations.md`, `pack-les-b1-it-architecture-vocab.md`, `pack-les-b1-it-code-review.md`, `pack-les-b2-it-mentoring.md`, `pack-les-b2-it-rfc-writing.md`. Legados v1 correspondentes removidos; catraca `_legacy_packs_baseline.json` = 111.
- **Registros/gates atualizados:** `specs/curriculum-graph-spec.md`, `specs/assessment-item-spec.md` (censo), `external-sources.md` (§0.5), `verify-integrity.py`, `TASK_PROGRESS.md`.
- **Validação:** `python3 verify-integrity.py` → `PASS 14/14` (0 falhas, 0 warnings).
- **Seed/carga DB (:5433):** não identificado script dedicado de seed/sincronização de lições/packs em `its-platform/src`; nenhuma alteração em dados de usuários/tentativas de pronúncia.
- **Placar pós-Lote 1:** 5/123 `authored_material`, 0 bloqueadas, 118 pendentes; packs 12 canônicos / 111 legados.


---

## 6. Registro de Execução — Lote 1 Onda 2 (Fundação A1/A2, 2026-11-16)

- **Escopo entregue:** `les_a1_greetings`, `les_a1_intro_dialogue`, `les_a1_daily_basics`, `les_a1_pronunciation_intro`, `les_a2_it_meeting_standup` — lições e packs 100% `authored_material` (clean-room).
- **Packs migrados para schema canônico:** `packs/a1/pack-les-a1-greetings.md`, `packs/a1/pack-les-a1-intro-dialogue.md`, `packs/a1/pack-les-a1-daily-basics.md`, `packs/a1/pack-les-a1-pronunciation-intro.md`, `packs/a2/pack-les-a2-it-meeting-standup.md`. Legados v1 correspondentes removidos; catraca `_legacy_packs_baseline.json` = **106**.
- **Registros/gates atualizados:** `specs/curriculum-graph-spec.md` (linhas §4.3 das 5 lições, §4.4.5/§4.4.6/§13 e sumários: `sourced_external_thin` 0, `reauthored_authored_material` 10, `sourced_external` 7, `blocked_no_adequate_source` 0, packs 17/106), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado), `external-sources.md` (§0.5/§5, placar 17/123, `cite_only` 104), `verify-integrity.py` (expectativa `sourced_external_thin` 0, 14 checks mantidos).
- **Validação:** `python3 verify-integrity.py` → **PASS 14/14** (0 falhas, 0 warnings).
- **Seed/carga DB (:5433):** não identificado script dedicado de seed/sincronização de lições/packs em `its-platform/src`; nenhuma alteração em dados de usuários/tentativas de pronúncia.
- **Placar pós-Lote 2 (Onda 2) (histórico do lote anterior):** **10/123** lições `authored_material`, 0 bloqueadas, `cite_only` 104, `adapt_with_attribution` 7, `sourced_external_thin` 0; packs **17 canônicos / 106 legados**.


---

## 6. Registro de Execução — Onda 2 — Lote 2 (batch 2), Fundação A1/A2 (2026-11-16)

- **Escopo entregue:** `les_a1_alphabet_sounds`, `les_a1_en_us_en_gb`, `les_a1_to_be_forms`, `les_a1_pronouns_subject_object`, `les_a1_pronouns_possessive` — lições e packs 100% `authored_material` (clean-room, A1 General).
- **Packs migrados para schema canônico:** `packs/a1/pack-les-a1-alphabet-sounds.md`, `packs/a1/pack-les-a1-en-us-en-gb.md`, `packs/a1/pack-les-a1-to-be-forms.md`, `packs/a1/pack-les-a1-pronouns-subject-object.md`, `packs/a1/pack-les-a1-pronouns-possessive.md`. Legados v1 correspondentes removidos; catraca `_legacy_packs_baseline.json` = **101**.
- **Registros/gates atualizados:** `specs/curriculum-graph-spec.md` (§4.3 das 5 lições, §4.4.5 `reauthored_authored_material` 10→15, §13 packs 22 canônicos / 101 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **327 filled / 76 null-with-note / 19 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A57/B16/C14/D11/E25; placar 22/123), `_legacy_packs_baseline.json` (106→101).
- **Validação:** `python3 verify-integrity.py` → **PASS 14/14** (0 falhas, 0 warnings).
- **Seed/carga DB (:5433):** não identificado script dedicado de seed/sincronização de lições/packs em `its-platform/src`; nenhuma alteração em dados de usuários/tentativas de pronúncia.
- **NOTA DE NOMENCLATURA:** o plano usa "Lote 2 (Onda 2)" para o lote anterior (`les_a1_greetings`…`les_a2_it_meeting_standup`), cujo bloco da §6 se chama "Lote 1 Onda 2"; a entrega atual é padronizada como **"Onda 2 — Lote 2 (batch 2)"**. As entradas antigas **não** foram renomeadas: o histórico acima permanece como estava.
- **Placar pós-Lote 2 — Onda 2 (batch 2):** **15/123** lições `authored_material`, 0 bloqueadas, `cite_only` 101, `adapt_with_attribution` 7, `sourced_external_thin` 0; packs **22 canônicos / 101 legados**. Registro desta entrega = este bloco da §6.


---

## 6. Registro de Execução — Onda 2 — Lote 3 (batch 3) — Fase A, Fundação A1/A2 (2026-11-16)

- **Escopo entregue:** `les_a1_pronouns_demonstrative`, `les_a1_wh_questions`, `les_a1_numbers_colors`, `les_a1_days_months`, `les_a1_time_dates` — lições e packs 100% `authored_material` (clean-room, A1 General).
- **Packs migrados para schema canônico:** `packs/a1/pack-les-a1-pronouns-demonstrative.md`, `packs/a1/pack-les-a1-wh-questions.md`, `packs/a1/pack-les-a1-numbers-colors.md`, `packs/a1/pack-les-a1-days-months.md`, `packs/a1/pack-les-a1-time-dates.md`. Legados v1 correspondentes removidos do disco; catraca `_legacy_packs_baseline.json` = **96**.
- **Registros/gates atualizados:** `specs/curriculum-graph-spec.md` (§4.3 das 5 lições, §4.4.5 `reauthored_authored_material` 15→20, §13 packs 27 canônicos / 96 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **417 filled / 76 null-with-note / 24 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A57/B15/C10/D11/E30; placar 27/123; §5 lições 23–27), `_legacy_packs_baseline.json` (101→96).
- **Validação:** ✅ `python3 verify-integrity.py` PASS — 14/14 (0 falhas, 0 warnings), reexecutado nesta unidade de banco/gates. Demais gates executados: typecheck, lint, build, contract:gate (3 pins re-derivados), domain:check, prd-score e npm test — resultados registrados no `TASK_PROGRESS.md`.
- **Seed/carga DB (:5433):** sincronização realizada via `npm --prefix its-platform run content:sync` com backup prévio em `/tmp/opencode/backup_pre_fase_a.sql`; 20 lições e 20 packs `authored_material` sincronizados, 27 packs canônicos / 96 legados no disco; 2ª execução idempotente. Nenhuma alteração em dados de usuários/tentativas de pronúncia.
- **Placar pós-Onda 2 — Lote 3 (batch 3) — Fase A:** **20/123** lições `authored_material`, 0 bloqueadas, `cite_only` 96, `adapt_with_attribution` 7, `sourced_external_thin` 0; packs **27 canônicos / 96 legados**. Registro desta entrega = este bloco da §6.

## 6. Registro de Execução — Onda 2 — Lote 4 (batch 4) — Fase B, Fundação A1/A2 (2026-11-16)

- **Escopo entregue:** `les_a1_food`, `les_a1_occupations`, `les_a1_regular_verbs_past`, `les_a1_present_simple`, `les_a1_present_simple_questions` — lições e packs 100% `authored_material` (clean-room, A1 General).
- **Packs migrados para schema canônico:** `packs/a1/pack-les-a1-food.md`, `packs/a1/pack-les-a1-occupations.md`, `packs/a1/pack-les-a1-regular-verbs-past.md`, `packs/a1/pack-les-a1-present-simple.md`, `packs/a1/pack-les-a1-present-simple-questions.md`. Legados v1 correspondentes (`pack_les_a1_food_v1.md`, `pack_les_a1_occupations_v1.md`, `pack_les_a1_regular_verbs_past_v1.md`, `pack_les_a1_present_simple_v1.md`, `pack_les_a1_present_simple_questions_v1.md`) removidos do disco; catraca `_legacy_packs_baseline.json` 96→**91** (a catraca só pode cair).
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3 das 5 lições: `Source` → `Original (clean-room, Onda 2 — Lote 4 (batch 4) — Fase B)`, `Status` → `✅ **authored** · reauthored_authored_material`; §4.4.5 `reauthored_authored_material` 20→25; §13 packs 32 canônicos / 91 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **507 filled / 76 null-with-note / 29 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A57/B15/C7/D11/E33; placar 32/123; §5 lições 28–32), `_legacy_packs_baseline.json` (96→91), `docs/copyright-reauthoring-plan.md` (este bloco, §2.1–§2.3, §3, §4, §5 e backlog de migração).
- **Validação:** ✅ `python3 verify-integrity.py` PASS — 14/14 (0 falhas, 0 warnings), reexecutado nesta unidade. Nenhum outro gate foi executado nesta unidade.
- **Seed/carga DB (:5433):** sincronização realizada via `npm --prefix its-platform run content:sync` com backup prévio em `/tmp/opencode/backup_pre_fase_b.sql`; 25 lições e 25 packs `authored_material` sincronizados, 32 packs canônicos / 91 legados no disco; 2ª execução idempotente. Nenhuma alteração em dados de usuários/tentativas de pronúncia.
- **Placar pós-Onda 2 — Lote 4 (batch 4) — Fase B (estado atual):** **25/123** lições `authored_material`, 0 bloqueadas, `cite_only` **91**, `adapt_with_attribution` **7**, `sourced_external_thin` 0; packs **32 canônicos / 91 legados** (123 no total). Registro desta entrega = este bloco da §6.

> **NOTA DE NOMENCLATURA (padronização, sem reescrever o histórico):** este plano usa "Lote 2 (Onda 2)" para o lote anterior e "Onda 2 — Lote 2 (batch 2)" para o Lote 2; esta entrega é registrada como "**Onda 2 — Lote 4 (batch 4) — Fase B**". Entradas antigas permanecem com sua nomenclatura original; a padronização vale apenas para novos registros.


---

## 6. Registro de Execução — Onda 2 — Lote 5 (batch 5) — Fase C, Fundação A1/A2 (2026-11-16)

- **Escopo entregue:** `les_a1_have_has`, `les_a1_there_is_are`, `les_a1_reading_skimming`, `les_a1_false_cognates` (A1 General) e `les_a2_phone_calls` (A2 General) — 4 lições A1 + 1 lição A2, todas lições e packs 100% `authored_material` (clean-room).
- **Packs migrados para schema canônico:** `packs/a1/pack-les-a1-have-has.md`, `packs/a1/pack-les-a1-there-is-are.md`, `packs/a1/pack-les-a1-reading-skimming.md`, `packs/a1/pack-les-a1-false-cognates.md`, `packs/a2/pack-les-a2-phone-calls.md`. Legados v1 correspondentes (`pack_les_a1_have_has_v1.md`, `pack_les_a1_there_is_are_v1.md`, `pack_les_a1_reading_skimming_v1.md`, `pack_les_a1_false_cognates_v1.md`, `pack_les_a2_phone_calls_v1.md`) removidos do disco; catraca `_legacy_packs_baseline.json` 91→**86** (a catraca só pode cair).
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3 das 5 lições: `Source` → `Original (clean-room, Onda 2 — Lote 5 (batch 5) — Fase C)`, `Status` → `✅ **authored** · reauthored_authored_material`; §4.4.5 `reauthored_authored_material` 25→30; §13 packs 37 canônicos / 86 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **597 filled / 76 null-with-note / 34 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A54/B13/C7/D11/E38; placar 37/123; §5 lições 33–37), `_legacy_packs_baseline.json` (91→86), `docs/copyright-reauthoring-plan.md` (este bloco, §2.1–§2.3, §3, §4, §5 e backlog de migração).
- **Validação:** ✅ `python3 verify-integrity.py` PASS — 14/14 (0 falhas, 0 warnings), reexecutado nesta unidade. Nenhum outro gate foi executado nesta unidade.
- **Seed/carga DB (:5433):** sincronização realizada via `npm --prefix its-platform run content:sync` com backup prévio em `/tmp/opencode/backup_pre_fase_c.sql`; 30 lições e 30 packs `authored_material` sincronizados, 37 packs canônicos / 86 legados no disco; 2ª execução idempotente. Nenhuma alteração em dados de usuários/tentativas de pronúncia.
- **Placar pós-Onda 2 — Lote 5 (batch 5) — Fase C (estado atual):** **30/123** lições `authored_material`, 0 bloqueadas, `cite_only` **86**, `adapt_with_attribution` **7**, `sourced_external_thin` 0; packs **37 canônicos / 86 legados** (123 no total). Registro desta entrega = este bloco da §6.

> **NOTA DE NOMENCLATURA (padronização, sem reescrever o histórico):** o plano usa "Lote 2 (Onda 2)" para o lote anterior e "Onda 2 — Lote 2 (batch 2)" para o Lote 2; esta entrega é registrada como "**Onda 2 — Lote 5 (batch 5) — Fase C**". Entradas antigas permanecem com sua nomenclatura original; a padronização vale apenas para novos registros.


---

## 6. Registro de Execução — Onda 2 — Lote 6 (batch 6), Fundação A1/A2 (2026-11-18)

- **Escopo entregue:** `les_a1_articles_nouns` (A1 General) e `les_a2_ask_for_help`, `les_a2_deadlines_tasks`, `les_a2_feedback_praise`, `les_a2_corporate_wrapup`, `les_a2_corpus_intro`, `les_a2_past_narrative`, `les_a2_future_will`, `les_a2_present_continuous`, `les_a2_modals_can_need` (A2 General) — 1 lição A1 + 9 lições A2, todas lições e packs 100% `authored_material` (clean-room).
- **Packs migrados para schema canônico:** `packs/a1/pack-les-a1-articles-nouns.md`, `packs/a2/pack-les-a2-ask-for-help.md`, `packs/a2/pack-les-a2-deadlines-tasks.md`, `packs/a2/pack-les-a2-feedback-praise.md`, `packs/a2/pack-les-a2-corporate-wrapup.md`, `packs/a2/pack-les-a2-corpus-intro.md`, `packs/a2/pack-les-a2-past-narrative.md`, `packs/a2/pack-les-a2-future-will.md`, `packs/a2/pack-les-a2-present-continuous.md`, `packs/a2/pack-les-a2-modals-can-need.md`. Legados v1 correspondentes (pack_les_a1_articles_nouns_v1.md, pack_les_a2_ask_for_help_v1.md, pack_les_a2_deadlines_tasks_v1.md, pack_les_a2_feedback_praise_v1.md, pack_les_a2_corporate_wrapup_v1.md, pack_les_a2_corpus_intro_v1.md, pack_les_a2_past_narrative_v1.md, pack_les_a2_future_will_v1.md, pack_les_a2_present_continuous_v1.md, pack_les_a2_modals_can_need_v1.md) removidos do disco; catraca `_legacy_packs_baseline.json` 86→**76** (a catraca só pode cair).
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3 das 10 lições: `Source` → `Original (clean-room, Onda 2 — Lote 6 (batch 6))`, `Status` → `✅ **authored** · reauthored_authored_material`; §4.4.5 `reauthored_authored_material` 30→40; §13 packs 47 canônicos / 76 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **777 filled / 76 null-with-note / 44 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A47/B11/C6/D11/E48; placar 47/123; §5 lições 38–47), `_legacy_packs_baseline.json` (86→76), `docs/copyright-reauthoring-plan.md` (este bloco, §2.1–§2.3, §3, §4, §5 e backlog de migração).
- **Validação:** ✅ `python3 verify-integrity.py` PASS — 14/14 (0 falhas, 0 warnings), reexecutado nesta unidade. `python3 prd-score.py` ≥ 80%. Nenhum outro gate foi executado nesta unidade.
- **Seed/carga DB (:5433):** fora do escopo desta unidade de registros — sincronização de conteúdo e re-derivação dos pins ficam a cargo da unidade de banco/gates.
- **Placar pós-Onda 2 — Lote 6 (batch 6) (estado atual):** **40/123** lições `authored_material`, 0 bloqueadas, `cite_only` **76**, `adapt_with_attribution` **7**, `sourced_external_thin` 0; packs **47 canônicos / 76 legados** (123 no total). Registro desta entrega = este bloco da §6.

> **NOTA DE NOMENCLATURA (padronização, sem reescrever o histórico):** o plano usa "Lote 2 (Onda 2)" para o lote anterior e "Onda 2 — Lote 2 (batch 2)" para o Lote 2; esta entrega é registrada como "**Onda 2 — Lote 6 (batch 6)**". Entradas antigas permanecem com sua nomenclatura original; a padronização vale apenas para novos registros.


---

## 6. Registro de Execução — Onda 2 — Lote 7 (batch 7), Fundação A2 (2026-11-18)

- **Escopo entregue:** `les_a2_imperatives`, `les_a2_prepositions_basic`, `les_a2_travel_vocab_core`, `les_a2_collocations`, `les_a2_stress_timing`, `les_a2_airport`, `les_a2_hotel_taxi`, `les_a2_restaurant_shopping`, `les_a2_reading_strategy`, `les_a2_writing_svo` — 10 lições A2 (General), todas lições e packs 100% `authored_material` (clean-room). `les_a2_reading_strategy` (General) ≠ `les_a2_it_reading_strategy` (trilha IT, não incluído).
- **Packs migrados para schema canônico:** `packs/a2/pack-les-a2-imperatives.md`, `packs/a2/pack-les-a2-prepositions-basic.md`, `packs/a2/pack-les-a2-travel-vocab-core.md`, `packs/a2/pack-les-a2-collocations.md`, `packs/a2/pack-les-a2-stress-timing.md`, `packs/a2/pack-les-a2-airport.md`, `packs/a2/pack-les-a2-hotel-taxi.md`, `packs/a2/pack-les-a2-restaurant-shopping.md`, `packs/a2/pack-les-a2-reading-strategy.md`, `packs/a2/pack-les-a2-writing-svo.md`. Legados v1 correspondentes (pack_les_a2_imperatives_v1.md, pack_les_a2_prepositions_basic_v1.md, pack_les_a2_travel_vocab_core_v1.md, pack_les_a2_collocations_v1.md, pack_les_a2_stress_timing_v1.md, pack_les_a2_airport_v1.md, pack_les_a2_hotel_taxi_v1.md, pack_les_a2_restaurant_shopping_v1.md, pack_les_a2_reading_strategy_v1.md, pack_les_a2_writing_svo_v1.md) removidos do disco; catraca `_legacy_packs_baseline.json` 76→**66** (a catraca só pode cair).
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3 das 10 lições: `Source` → `Original (clean-room, Onda 2 — Lote 7 (batch 7))`, `Status` → `✅ **authored** · reauthored_authored_material`; §4.4.5 `reauthored_authored_material` 40→50; §13 packs 57 canônicos / 66 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **957 filled / 76 null-with-note / 54 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A45/B9/C0/D11/E58; placar 67/123; §5 lições 48–57), `_legacy_packs_baseline.json` (76→66), `docs/copyright-reauthoring-plan.md` (este bloco, §2.1–§2.3, §3, §4, §5 e backlog de migração).
- **Validação:** ⚠️ `python3 verify-integrity.py` — 13/14 checks passam, **1 falha pré-existente e fora do escopo desta unidade de registros**: `[FAIL] pack: pack-les-a2-stress-timing.md ITEM 1 has duplicate options ['"we need a record of the deploy; please record it."'] — unscorable` (check [9], conteúdo do pack — não editado nesta unidade, por limite explícito de escopo). Todos os checks de registro passam, 0 warnings. `python3 prd-score.py` PASS — 90,4% ≥ 80%. Nenhum outro gate foi executado nesta unidade.
- **Seed/carga DB (:5433):** fora do escopo desta unidade de registros — sincronização de conteúdo e re-derivação dos pins ficam a cargo da unidade de banco/gates.
- **Placar pós-Onda 2 — Lote 7 (batch 7) (estado atual):** **50/123** lições `authored_material`, 0 bloqueadas, `cite_only` **66**, `adapt_with_attribution` **7**, `sourced_external_thin` 0; packs **57 canônicos / 66 legados** (123 no total). Registro desta entrega = este bloco da §6.

> **NOTA DE NOMENCLATURA (padronização, sem reescrever o histórico):** esta entrega é registrada como "**Onda 2 — Lote 7 (batch 7)**"; entradas antigas permanecem com sua nomenclatura original.


---

## 6. Registro de Execução — Onda 2 — Lote 8 (batch 8), Fundação A2 + B1-IT (2026-11-18)

- **Escopo entregue:** `les_a2_writing_bio`, `les_a2_writing_messages`, `les_a2_writing_past`, `les_a2_writing_selfcheck`, `les_a2_it_roles_hierarchy`, `les_a2_it_reading_strategy`, `les_a2_it_computer_parts`, `les_a2_it_system_unit`, `les_a2_it_internet_history`, `les_a2_it_clean_code_basics` — 4 lições A2 (General, writing) + 6 lições A2 (IT), todas lições e packs 100% `authored_material` (clean-room).
- **Packs migrados para schema canônico:** `packs/a2/pack-les-a2-writing-bio.md`, `packs/a2/pack-les-a2-writing-messages.md`, `packs/a2/pack-les-a2-writing-past.md`, `packs/a2/pack-les-a2-writing-selfcheck.md`, `packs/a2/pack-les-a2-it-roles-hierarchy.md`, `packs/a2/pack-les-a2-it-reading-strategy.md`, `packs/a2/pack-les-a2-it-computer-parts.md`, `packs/a2/pack-les-a2-it-system-unit.md`, `packs/a2/pack-les-a2-it-internet-history.md`, `packs/a2/pack-les-a2-it-clean-code-basics.md`. Legados v1 correspondentes (pack_les_a2_writing_bio_v1.md, pack_les_a2_writing_messages_v1.md, pack_les_a2_writing_past_v1.md, pack_les_a2_writing_selfcheck_v1.md, pack_les_a2_it_roles_hierarchy_v1.md, pack_les_a2_it_reading_strategy_v1.md, pack_les_a2_it_computer_parts_v1.md, pack_les_a2_it_system_unit_v1.md, pack_les_a2_it_internet_history_v1.md, pack_les_a2_it_clean_code_basics_v1.md) removidos do disco; catraca `_legacy_packs_baseline.json` 66→**56** (a catraca só pode cair).
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3 das 10 lições: `Source` → `Original (clean-room, Onda 2 — Lote 8 (batch 8))`, `Status` → `✅ **authored** · reauthored_authored_material`; §4.4.5 `reauthored_authored_material` 50→60; §13 packs 67 canônicos / 56 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **1137 filled / 76 null-with-note / 64 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A39/B5/C0/D11/E68; placar 67/123; §5 lições 58–67), `_legacy_packs_baseline.json` (66→56), `docs/copyright-reauthoring-plan.md` (este bloco, §2.1–§2.3, §3, §4, §5 e backlog de migração).
- **Validação:** ✅ `python3 verify-integrity.py` PASS — 14/14 (0 falhas, 0 warnings), reexecutado nesta unidade. `python3 prd-score.py` PASS — 90,4% ≥ 80%. Nenhum outro gate foi executado nesta unidade.
- **Seed/carga DB (:5433):** fora do escopo desta unidade de registros — sincronização de conteúdo e re-derivação dos pins ficam a cargo da unidade de banco/gates.
- **Placar pós-Onda 2 — Lote 8 (batch 8) (estado atual):** **60/123** lições `authored_material`, 0 bloqueadas, `cite_only` **56**, `adapt_with_attribution` **7**, `sourced_external_thin` 0; packs **67 canônicos / 56 legados** (123 no total). Registro desta entrega = este bloco da §6.

> **NOTA DE NOMENCLATURA (padronização, sem reescrever o histórico):** esta entrega é registrada como "**Onda 2 — Lote 8 (batch 8)**"; entradas antigas permanecem com sua nomenclatura original.
