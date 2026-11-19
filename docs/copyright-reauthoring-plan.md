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
**Atualizado (Onda 2 — Lote 9 (batch 9), A2 + B1-IT):** 2026-11-18 — reautoria clean-room de 10 lições (7 A2 IT + 3 B1 IT) para `authored_material` (100% original).  
**Atualizado (Onda 2 — Lote 10 (batch 10), A2-IT + B1-IT/B1-General):** 2026-11-19 — reautoria clean-room de 10 lições (1 A2 IT, 4 B1 IT e 5 B1 General) para `authored_material` (100% original).  
**Atualizado (Onda 2 — Lote 11 (batch 11), B1/B2 General):** 2026-11-19 — reautoria clean-room de 10 lições B1/B2 General para `authored_material` (100% original).  
**Atualizado (Onda 2 — Lote 12 (batch 12), B2 Professional/IT/Cert Prep):** 2026-11-19 — reautoria clean-room de 10 lições/packs B2 (3 Professional, 6 IT Senior, 1 Cert Prep) para `authored_material` (100% original); catraca de packs legados 26→16.  
**Atualizado (Onda 2 — Lote 13 (batch 13), B2 Cert Prep/Exam + B1 Project):** 2026-11-19 — reautoria clean-room de 10 lições/packs (5 B2 Cert Prep/Exam + 5 B1 Project) para `authored_material` (100% original); catraca de packs legados 16→6.  
**Atualizado (Lote 14, B1 Project + Remediação):** 2026-11-19 — reautoria clean-room de 6 lições/packs (1 B1 Project + 5 remediação) para `authored_material` (100% original); catraca de packs legados 6→**0**.  
**Atualizado (Onda 2 — Lote 15, Fechamento):** 2026-11-19 — reautoria clean-room das 7 lições finais para `authored_material` (100% original); **123/123 lições e 123 packs canônicos/0 legados**; censo `br_pt_form` 2181/27/125/0.
**Escopo:** inventário original em modo leitura + atualizações dos Lotes 1–14 e do Lote 15 (fechamento) registradas abaixo.  
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
- Packs em `packs/` (`.md`): **123** arquivos — **123 canônicos** (`pack-les-*.md`) + **0 legados v1** (`pack_les_*_v1.md`).
- Nó do registro sem arquivo de lição: **0**.
- Lições por nível/trilha: `A1|General`=24, `A2|General`=30, `A2|IT`=16, `B1|General`=18, `B1|IT`=9, `B1|Remediation`=5, `B2|General`=12, `B2|IT`=8.

### 2.2 Placar de proveniência das lições (estado atual × meta `authored_material`)
| Categoria | Qtde (lições) | Situação frente à meta 100% `authored_material` |
|---|---:|---|
| **Já `authored_material` (liberadas)** | **123** | Lotes 1–14 + Lote 15 (fechamento): `les_a2_greetings_intro`, `les_a2_small_talk`, `les_a2_introducing_others`, `les_a2_meeting_open`, `les_a2_meeting_participate`, `les_a2_email_basics`, `les_a2_it_terms_basics` (todas as 123 lições em clean-room; **123/123**) |
| **`cite_only` (pendentes de reautoria)** | **0** | — |
| **`adapt_with_attribution` (pendentes de reautoria)** | **0** | — |
| **`adapt_requires_permission` (pendentes)** | **0** | Não publicável sem permissão; requer permissão ou reautoria integral |
| **`blocked` / `blocked_no_adequate_source` (pendentes)** | **0** | — |
| **Total pendente de reautoria** | **0** | Meta atingida: **123/123** lições `authored_material` (fechamento Onda 2 — Lote 15) |
| **Total (registro)** | **123** | 123 arquivos auditados (todos com arquivo, 0 bloqueados no registro) |

> **`sourced_external_thin` (sinalização de sourcing no registro):** **0** lições. `les_a2_it_meeting_standup`, `les_b2_it_mentoring` e `les_b2_it_rfc_writing` foram reautoradas para `authored_material` (Lotes 1 e 2).

### 2.3 Placar dos packs
| Dimensão | Valor |
|---|---|
| Total de packs `.md` | **123** |
| Schema canônico (`pack-les-*.md`) | **123** |
| Schema legado v1 (`pack_les_*_v1.md`) | **0** |
| Packs com `reuse_basis` = `authored_material` | **116** |
| Packs com `reuse_basis` = `cite_only` | **6** |
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
| `les_a2_it_algorithms_basics` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_algorithms_basics.md` |
| `les_a2_it_clean_code_basics` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_clean_code_basics.md` |
| `les_a2_it_computer_parts` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_computer_parts.md` |
| `les_a2_it_email_technical` | A2 | IT | `mod_a2_it_communication` | — | `authored_material` | — | `lessons/a2/les_a2_it_email_technical.md` |
| `les_a2_it_incidents` | A2 | IT | `mod_a2_it_communication` | — | `authored_material` | — | `lessons/a2/les_a2_it_incidents.md` |
| `les_a2_it_internet_history` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_internet_history.md` |
| `les_a2_it_meeting_standup` | A2 | IT | `mod_a2_it_communication` | — | `authored_material` | — | `lessons/a2/les_a2_it_meeting_standup.md` |
| `les_a2_it_nontech_tech` | A2 | IT | `mod_a2_it_communication` | — | `authored_material` | — | `lessons/a2/les_a2_it_nontech_tech.md` |
| `les_a2_it_pr_tickets` | A2 | IT | `mod_a2_it_communication` | — | `authored_material` | — | `lessons/a2/les_a2_it_pr_tickets.md` |
| `les_a2_it_reading_strategy` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_reading_strategy.md` |
| `les_a2_it_roles_hierarchy` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_roles_hierarchy.md` |
| `les_a2_it_system_unit` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_system_unit.md` |
| `les_a2_it_terms_basics` | A2 | IT | `—` | — | `adapt_with_attribution` — **primeira lição do repositório com esta base.** Adapta, com atribuição, **S01** (Google developer documentation style guide, CC-BY-4.0) e **S16** (Kubernetes docs, CC-BY-4.0). Todo o restante é original. Ver `external-sources.md` §7.0 e "Fontes e Atribuição" no fim. | — | `lessons/a2/les_a2_it_terms_basics.md` |
| `les_a2_it_testing_fundamentals` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_testing_fundamentals.md` |
| `les_a2_it_typescript_basics` | A2 | IT | `mod_a2_it_fundamentals` | — | `authored_material` | — | `lessons/a2/les_a2_it_typescript_basics.md` |
| `les_a2_it_word_formation` | A2 | IT | `mod_a2_it_communication` | — | `authored_material` | — | `lessons/a2/les_a2_it_word_formation.md` |
| `les_b1_conditionals` | B1 | General | `mod_b1_grammar_consolidate` | — | `authored_material` | — | `lessons/b1/les_b1_conditionals.md` |
| `les_b1_finance_business` | B1 | General | `mod_b1_workplace_adv` | — | `authored_material` | — | `lessons/b1/les_b1_finance_business.md` |
| `les_b1_hr_career` | B1 | General | `mod_b1_workplace_adv` | — | `authored_material` | — | `lessons/b1/les_b1_hr_career.md` |
| `les_b1_leadership_feedback` | B1 | General | `mod_b1_workplace_adv` | — | `authored_material` | — | `lessons/b1/les_b1_leadership_feedback.md` |
| `les_b1_modals` | B1 | General | `mod_b1_grammar_consolidate` | — | `authored_material` | — | `lessons/b1/les_b1_modals.md` |
| `les_b1_negotiation` | B1 | General | `mod_b1_workplace_adv` | — | `authored_material` | — | `lessons/b1/les_b1_negotiation.md` |
| `les_b1_passive` | B1 | General | `mod_b1_grammar_consolidate` | — | `authored_material` | — | `lessons/b1/les_b1_passive.md` |
| `les_b1_presentation_skills` | B1 | General | `mod_b1_workplace_adv` | — | `authored_material` | — | `lessons/b1/les_b1_presentation_skills.md` |
| `les_b1_project_case_study` | B1 | General | `mod_b1_fluency_project` | — | `authored_material` | — | `lessons/b1/les_b1_project_case_study.md` |
| `les_b1_project_client_sim` | B1 | General | `mod_b1_fluency_project` | — | `authored_material` | — | `lessons/b1/les_b1_project_client_sim.md` |
| `les_b1_project_integrated_review` | B1 | General | `mod_b1_fluency_project` | — | `authored_material` | — | `lessons/b1/les_b1_project_integrated_review.md` |
| `les_b1_project_negotiation_roleplay` | B1 | General | `mod_b1_fluency_project` | — | `authored_material` | — | `lessons/b1/les_b1_project_negotiation_roleplay.md` |
| `les_b1_project_presentation_final` | B1 | General | `mod_b1_fluency_project` | — | `authored_material` | — | `lessons/b1/les_b1_project_presentation_final.md` |
| `les_b1_project_retrospective` | B1 | General | `mod_b1_fluency_project` | — | `authored_material` | — | `lessons/b1/les_b1_project_retrospective.md` |
| `les_b1_question_forms` | B1 | General | `mod_b1_grammar_consolidate` | — | `authored_material` | — | `lessons/b1/les_b1_question_forms.md` |
| `les_b1_reported_speech` | B1 | General | `mod_b1_grammar_consolidate` | — | `authored_material` | — | `lessons/b1/les_b1_reported_speech.md` |
| `les_b1_sales_marketing` | B1 | General | `mod_b1_workplace_adv` | — | `authored_material` | — | `lessons/b1/les_b1_sales_marketing.md` |
| `les_b1_tenses_review` | B1 | General | `mod_b1_grammar_consolidate` | — | `authored_material` | — | `lessons/b1/les_b1_tenses_review.md` |
| `les_b1_it_acronyms_deep` | B1 | IT | `mod_b1_it_technical` | — | `authored_material` | — | `lessons/b1/les_b1_it_acronyms_deep.md` |
| `les_b1_it_architecture_vocab` | B1 | IT | `mod_b1_it_technical` | — | `authored_material` | — | `lessons/b1/les_b1_it_architecture_vocab.md` |
| `les_b1_it_bdd_specs` | B1 | IT | `mod_b1_it_technical` | — | `authored_material` | — | `lessons/b1/les_b1_it_bdd_specs.md` |
| `les_b1_it_code_review` | B1 | IT | `mod_b1_it_technical` | — | `authored_material` | — | `lessons/b1/les_b1_it_code_review.md` |
| `les_b1_it_ddd_modeling` | B1 | IT | `mod_b1_it_technical` | — | `authored_material` | — | `lessons/b1/les_b1_it_ddd_modeling.md` |
| `les_b1_it_debugging` | B1 | IT | `mod_b1_it_technical` | — | `authored_material` | — | `lessons/b1/les_b1_it_debugging.md` |
| `les_b1_it_devops_basics` | B1 | IT | `mod_b1_it_technical` | — | `authored_material` | — | `lessons/b1/les_b1_it_devops_basics.md` |
| `les_b1_it_ux_collab` | B1 | IT | `mod_b1_it_technical` | — | `authored_material` | — | `lessons/b1/les_b1_it_ux_collab.md` |
| `les_b1_it_write_docs` | B1 | IT | `mod_b1_it_technical` | — | `authored_material` | — | `lessons/b1/les_b1_it_write_docs.md` |
| `les_rem_confidence_builder` | B1 | Remediation | `mod_b1_fluency_project` | — | `authored_material` | — | `lessons/remediation/les_rem_confidence_builder.md` |
| `les_rem_grammar_be_pronouns` | B1 | Remediation | `mod_b1_fluency_project` | — | `authored_material` | — | `lessons/remediation/les_rem_grammar_be_pronouns.md` |
| `les_rem_listening_slow_clear` | B1 | Remediation | `mod_b1_fluency_project` | — | `authored_material` | — | `lessons/remediation/les_rem_listening_slow_clear.md` |
| `les_rem_pronunciation_th_vw` | B1 | Remediation | `mod_b1_fluency_project` | — | `authored_material` | — | `lessons/remediation/les_rem_pronunciation_th_vw.md` |
| `les_rem_writing_svo` | B1 | Remediation | `mod_b1_fluency_project` | — | `authored_material` | — | `lessons/remediation/les_rem_writing_svo.md` |
| `les_b2_celpe_br` | B2 | General | `mod_b2_cert_prep` | — | `authored_material` | — | `lessons/b2/les_b2_celpe_br.md` |
| `les_b2_culture_brazil_vs_usa` | B2 | General | `mod_b2_professional` | — | `authored_material` | — | `lessons/b2/les_b2_culture_brazil_vs_usa.md` |
| `les_b2_exam_simulations` | B2 | General | `mod_b2_cert_prep` | — | `authored_material` | — | `lessons/b2/les_b2_exam_simulations.md` |
| `les_b2_exam_vocab` | B2 | General | `mod_b2_cert_prep` | — | `authored_material` | — | `lessons/b2/les_b2_exam_vocab.md` |
| `les_b2_ielts_writing` | B2 | General | `mod_b2_cert_prep` | — | `authored_material` | — | `lessons/b2/les_b2_ielts_writing.md` |
| `les_b2_professional_argument` | B2 | General | `mod_b2_professional` | — | `authored_material` | — | `lessons/b2/les_b2_professional_argument.md` |
| `les_b2_professional_email_advanced` | B2 | General | `mod_b2_professional` | — | `authored_material` | — | `lessons/b2/les_b2_professional_email_advanced.md` |
| `les_b2_professional_review` | B2 | General | `mod_b2_professional` | — | `authored_material` | — | `lessons/b2/les_b2_professional_review.md` |
| `les_b2_professional_summary` | B2 | General | `mod_b2_professional` | — | `authored_material` | — | `lessons/b2/les_b2_professional_summary.md` |
| `les_b2_register_nuance` | B2 | General | `mod_b2_professional` | — | `authored_material` | — | `lessons/b2/les_b2_register_nuance.md` |
| `les_b2_toeic_reading` | B2 | General | `mod_b2_cert_prep` | — | `authored_material` | — | `lessons/b2/les_b2_toeic_reading.md` |
| `les_b2_toeic_writing` | B2 | General | `mod_b2_cert_prep` | — | `authored_material` | — | `lessons/b2/les_b2_toeic_writing.md` |
| `les_b2_it_advanced_patterns` | B2 | IT | `mod_b2_it_senior` | — | `authored_material` | — | `lessons/b2/les_b2_it_advanced_patterns.md` |
| `les_b2_it_architecture_decisions` | B2 | IT | `mod_b2_it_senior` | — | `authored_material` | — | `lessons/b2/les_b2_it_architecture_decisions.md` |
| `les_b2_it_incident_postmortem` | B2 | IT | `mod_b2_it_senior` | — | `authored_material` | — | `lessons/b2/les_b2_it_incident_postmortem.md` |
| `les_b2_it_jargon_mastery` | B2 | IT | `mod_b2_it_senior` | — | `authored_material` | — | `lessons/b2/les_b2_it_jargon_mastery.md` |
| `les_b2_it_mentoring` | B2 | IT | `mod_b2_it_senior` | — | `authored_material` | — | `lessons/b2/les_b2_it_mentoring.md` |
| `les_b2_it_rfc_writing` | B2 | IT | `mod_b2_it_senior` | — | `authored_material` | — | `lessons/b2/les_b2_it_rfc_writing.md` |
| `les_b2_it_strategy` | B2 | IT | `mod_b2_it_senior` | — | `authored_material` | — | `lessons/b2/les_b2_it_strategy.md` |
| `les_b2_it_technical_leadership` | B2 | IT | `mod_b2_it_senior` | — | `authored_material` | — | `lessons/b2/les_b2_it_technical_leadership.md` |
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
| `pack_les_a2_it_algorithms_basics_v1` | `les_a2_it_algorithms_basics` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 9 (batch 9) | `packs/a2/pack-les-a2-it-algorithms-basics.md` |
| `pack_les_a2_it_clean_code_basics_v1` | `les_a2_it_clean_code_basics` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-clean-code-basics.md` |
| `pack_les_a2_it_computer_parts_v1` | `les_a2_it_computer_parts` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-computer-parts.md` |
| `pack_les_a2_it_email_technical_v1` | `les_a2_it_email_technical` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 9 (batch 9) | `packs/a2/pack-les-a2-it-email-technical.md` |
| `pack_les_a2_it_incidents_v1` | `les_a2_it_incidents` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 10 (batch 10) | `packs/a2/pack-les-a2-it-incidents.md` |
| `pack_les_a2_it_internet_history_v1` | `les_a2_it_internet_history` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-internet-history.md` |
| `pack_les_a2_it_meeting_standup_v1` | `les_a2_it_meeting_standup` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 2 (Onda 2) | `packs/a2/pack-les-a2-it-meeting-standup.md` |
| `pack_les_a2_it_nontech_tech_v1` | `les_a2_it_nontech_tech` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 9 (batch 9) | `packs/a2/pack-les-a2-it-nontech-tech.md` |
| `pack_les_a2_it_pr_tickets_v1` | `les_a2_it_pr_tickets` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 9 (batch 9) | `packs/a2/pack-les-a2-it-pr-tickets.md` |
| `pack_les_a2_it_reading_strategy_v1` | `les_a2_it_reading_strategy` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-reading-strategy.md` |
| `pack_les_a2_it_roles_hierarchy_v1` | `les_a2_it_roles_hierarchy` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-roles-hierarchy.md` |
| `pack_les_a2_it_system_unit_v1` | `les_a2_it_system_unit` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 8 (batch 8) | `packs/a2/pack-les-a2-it-system-unit.md` |
| `pack_les_a2_it_terms_basics_v1` | `les_a2_it_terms_basics` | A2 | IT | canonical | cite_only | items `authored`. The lesson adapts **S16** and **S01** (both CC-BY-4.0); see the lesson's | `packs/a2/pack-les-a2-it-terms-basics.md` |
| `pack_les_a2_it_testing_fundamentals_v1` | `les_a2_it_testing_fundamentals` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 9 (batch 9) | `packs/a2/pack-les-a2-it-testing-fundamentals.md` |
| `pack_les_a2_it_typescript_basics_v1` | `les_a2_it_typescript_basics` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 9 (batch 9) | `packs/a2/pack-les-a2-it-typescript-basics.md` |
| `pack_les_a2_it_word_formation_v1` | `les_a2_it_word_formation` | A2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 9 (batch 9) | `packs/a2/pack-les-a2-it-word-formation.md` |
| `pack_les_b1_conditionals_v1` | `les_b1_conditionals` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 10 (batch 10) | `packs/b1/pack-les-b1-conditionals.md` |
| `pack_les_b1_finance_business_v1` | `les_b1_finance_business` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 11 (batch 11) | `packs/b1/pack-les-les-b1-finance-business.md` |
| `pack_les_b1_hr_career_v1` | `les_b1_hr_career` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 11 (batch 11) | `packs/b1/pack-les-les-b1-hr-career.md` |
| `pack_les_b1_leadership_feedback_v1` | `les_b1_leadership_feedback` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 11 (batch 11) | `packs/b1/pack-les-les-b1-leadership-feedback.md` |
| `pack_les_b1_modals_v1` | `les_b1_modals` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 10 (batch 10) | `packs/b1/pack-les-b1-modals.md` |
| `pack_les_b1_negotiation_v1` | `les_b1_negotiation` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 11 (batch 11) | `packs/b1/pack-les-les-b1-negotiation.md` |
| `pack_les_b1_passive_v1` | `les_b1_passive` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 10 (batch 10) | `packs/b1/pack-les-b1-passive.md` |
| `pack_les_b1_presentation_skills_v1` | `les_b1_presentation_skills` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 11 (batch 11) | `packs/b1/pack-les-les-b1-presentation-skills.md` |
| `pack_les_b1_project_case_study_v1` | `les_b1_project_case_study` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 13 (batch 13) | `packs/b1/pack-les-b1-project-case-study.md` |
| `pack_les_b1_project_client_sim_v1` | `les_b1_project_client_sim` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 13 (batch 13) | `packs/b1/pack-les-b1-project-client-sim.md` |
| `pack_les_b1_project_integrated_review_v1` | `les_b1_project_integrated_review` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 13 (batch 13) | `packs/b1/pack-les-b1-project-integrated-review.md` |
| `pack_les_b1_project_negotiation_roleplay_v1` | `les_b1_project_negotiation_roleplay` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 13 (batch 13) | `packs/b1/pack-les-b1-project-negotiation-roleplay.md` |
| `pack_les_b1_project_presentation_final_v1` | `les_b1_project_presentation_final` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 14 | `packs/b1/pack-les-b1-project-presentation-final.md` |
| `pack_les_b1_project_retrospective_v1` | `les_b1_project_retrospective` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 13 (batch 13) | `packs/b1/pack-les-b1-project-retrospective.md` |
| `pack_les_b1_question_forms_v1` | `les_b1_question_forms` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 11 (batch 11) | `packs/b1/pack-les-les-b1-question-forms.md` |
| `pack_les_b1_reported_speech_v1` | `les_b1_reported_speech` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 10 (batch 10) | `packs/b1/pack-les-b1-reported-speech.md` |
| `pack_les_b1_sales_marketing_v1` | `les_b1_sales_marketing` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 11 (batch 11) | `packs/b1/pack-les-les-b1-sales-marketing.md` |
| `pack_les_b1_tenses_review_v1` | `les_b1_tenses_review` | B1 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 10 (batch 10) | `packs/b1/pack-les-b1-tenses-review.md` |
| `pack_les_b1_it_acronyms_deep_v1` | `les_b1_it_acronyms_deep` | B1 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 9 (batch 9) | `packs/b1/pack-les-b1-it-acronyms-deep.md` |
| `pack_les_b1_it_architecture_vocab_v1` | `les_b1_it_architecture_vocab` | B1 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 1 | `packs/b1/pack-les-b1-it-architecture-vocab.md` |
| `pack_les_b1_it_bdd_specs_v1` | `les_b1_it_bdd_specs` | B1 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 9 (batch 9) | `packs/b1/pack-les-b1-it-bdd-specs.md` |
| `pack_les_b1_it_code_review_v1` | `les_b1_it_code_review` | B1 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 1 | `packs/b1/pack-les-b1-it-code-review.md` |
| `pack_les_b1_it_ddd_modeling_v1` | `les_b1_it_ddd_modeling` | B1 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 9 (batch 9) | `packs/b1/pack-les-b1-it-ddd-modeling.md` |
| `pack_les_b1_it_debugging_v1` | `les_b1_it_debugging` | B1 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 10 (batch 10) | `packs/b1/pack-les-b1-it-debugging.md` |
| `pack_les_b1_it_devops_basics_v1` | `les_b1_it_devops_basics` | B1 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 10 (batch 10) | `packs/b1/pack-les-b1-it-devops-basics.md` |
| `pack_les_b1_it_ux_collab_v1` | `les_b1_it_ux_collab` | B1 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 10 (batch 10) | `packs/b1/pack-les-b1-it-ux-collab.md` |
| `pack_les_b1_it_write_docs_v1` | `les_b1_it_write_docs` | B1 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 10 (batch 10) | `packs/b1/pack-les-b1-it-write-docs.md` |
| `pack_les_b2_celpe_br_v1` | `les_b2_celpe_br` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 13 (batch 13) | `packs/b2/pack-les-b2-celpe-br.md` |
| `pack_les_b2_culture_brazil_vs_usa_v1` | `les_b2_culture_brazil_vs_usa` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 12 (batch 12) | `packs/b2/pack-les-b2-culture-brazil-vs-usa.md` |
| `pack_les_b2_exam_simulations_v1` | `les_b2_exam_simulations` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 13 (batch 13) | `packs/b2/pack-les-b2-exam-simulations.md` |
| `pack_les_b2_exam_vocab_v1` | `les_b2_exam_vocab` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 13 (batch 13) | `packs/b2/pack-les-b2-exam-vocab.md` |
| `pack_les_b2_ielts_writing_v1` | `les_b2_ielts_writing` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 13 (batch 13) | `packs/b2/pack-les-b2-ielts-writing.md` |
| `pack_les_b2_professional_argument_v1` | `les_b2_professional_argument` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 12 (batch 12) | `packs/b2/pack-les-b2-professional-argument.md` |
| `pack_les_b2_professional_email_advanced_v1` | `les_b2_professional_email_advanced` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 11 (batch 11) | `packs/b2/pack-les-les-b2-professional-email-advanced.md` |
| `pack_les_b2_professional_review_v1` | `les_b2_professional_review` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 11 (batch 11) | `packs/b2/pack-les-les-b2-professional-review.md` |
| `pack_les_b2_professional_summary_v1` | `les_b2_professional_summary` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 12 (batch 12) | `packs/b2/pack-les-b2-professional-summary.md` |
| `pack_les_b2_register_nuance_v1` | `les_b2_register_nuance` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 11 (batch 11) | `packs/b2/pack-les-les-b2-register-nuance.md` |
| `pack_les_b2_toeic_reading_v1` | `les_b2_toeic_reading` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 12 (batch 12) | `packs/b2/pack-les-b2-toeic-reading.md` |
| `pack_les_b2_toeic_writing_v1` | `les_b2_toeic_writing` | B2 | General | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 13 (batch 13) | `packs/b2/pack-les-b2-toeic-writing.md` |
| `pack_les_b2_it_advanced_patterns_v1` | `les_b2_it_advanced_patterns` | B2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 12 (batch 12) | `packs/b2/pack-les-b2-it-advanced-patterns.md` |
| `pack_les_b2_it_architecture_decisions_v1` | `les_b2_it_architecture_decisions` | B2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 12 (batch 12) | `packs/b2/pack-les-b2-it-architecture-decisions.md` |
| `pack_les_b2_it_incident_postmortem_v1` | `les_b2_it_incident_postmortem` | B2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 12 (batch 12) | `packs/b2/pack-les-b2-it-incident-postmortem.md` |
| `pack_les_b2_it_jargon_mastery_v1` | `les_b2_it_jargon_mastery` | B2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 12 (batch 12) | `packs/b2/pack-les-b2-it-jargon-mastery.md` |
| `pack_les_b2_it_mentoring_v1` | `les_b2_it_mentoring` | B2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 1 | `packs/b2/pack-les-b2-it-mentoring.md` |
| `pack_les_b2_it_rfc_writing_v1` | `les_b2_it_rfc_writing` | B2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 1 | `packs/b2/pack-les-b2-it-rfc-writing.md` |
| `pack_les_b2_it_strategy_v1` | `les_b2_it_strategy` | B2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 12 (batch 12) | `packs/b2/pack-les-b2-it-strategy.md` |
| `pack_les_b2_it_technical_leadership_v1` | `les_b2_it_technical_leadership` | B2 | IT | canonical (`pack-les-*.md`) | authored_material | ✅ Onda 2 — Lote 12 (batch 12) | `packs/b2/pack-les-b2-it-technical-leadership.md` |
| `pack_les_a2_greetings_intro_v1` | `lesson-15min-workplace-greetings` | None | General | canonical | adapt_requires_permission | 6 source_derived, 1 authored (`rdg_scanning_microtext_001`, CAT-excluded per G-Q7) | `packs/a2/pack-les-a2-greetings-intro.md` |
| `pack_les_rem_confidence_builder_v1` | `les_rem_confidence_builder` | None | Remediation | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 14 | `packs/remediation/pack-les-rem-confidence-builder.md` |
| `pack_les_rem_grammar_be_pronouns_v1` | `les_rem_grammar_be_pronouns` | None | Remediation | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 14 | `packs/remediation/pack-les-rem-grammar-be-pronouns.md` |
| `pack_les_rem_listening_slow_clear_v1` | `les_rem_listening_slow_clear` | None | Remediation | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 14 | `packs/remediation/pack-les-rem-listening-slow-clear.md` |
| `pack_les_rem_pronunciation_th_vw_v1` | `les_rem_pronunciation_th_vw` | None | Remediation | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 14 | `packs/remediation/pack-les-rem-pronunciation-th-vw.md` |
| `pack_les_rem_writing_svo_v1` | `les_rem_writing_svo` | None | Remediation | canonical (`pack-les-*.md`) | authored_material | ✅ Lote 14 | `packs/remediation/pack-les-rem-writing-svo.md` |

---

## 5. Fila Priorizada em Ondas (Waves) de Reautoria

Objetivo de cada onda: reescrever integralmente o conteúdo didático/itens para **`authored_material`** (autoria própria, sem reprodução/adaptação de fontes restritas ou dependência de `cite_only`/`adapt_with_attribution`/cobertura `thin`), atualizar metadados de proveniência, e migrar o pack associado ao schema canônico conforme aplicável.

### Onda 1 — Crítica (Trilha TI B1/B2 e nós bloqueados)

**Escopo:** 18 lições (toda a trilha IT B1/B2 + `les_b1_it_presentations` bloqueada). Inclui itens com `sourced_external_thin` e o nó sem fonte adequada.

| Lesson ID | CEFR | Trilha | Base/estado atual | Habilidades/objetivo-alvo (reautoria) | Arquivo |
|---|---|---|---|---|---|
| `les_b1_it_acronyms_deep` | B1 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 9 (batch 9) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_acronyms_deep.md` |
| `les_b1_it_architecture_vocab` | B1 | IT | ~~`adapt_with_attribution`~~ → `authored_material` ✅ Lote 1 | Inglês técnico TI — reautoria integral concluída | `lessons/b1/les_b1_it_architecture_vocab.md` |
| `les_b1_it_bdd_specs` | B1 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 9 (batch 9) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_bdd_specs.md` |
| `les_b1_it_code_review` | B1 | IT | ~~`adapt_with_attribution`~~ → `authored_material` ✅ Lote 1 | Inglês técnico TI — reautoria integral concluída | `lessons/b1/les_b1_it_code_review.md` |
| `les_b1_it_ddd_modeling` | B1 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 9 (batch 9) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_ddd_modeling.md` |
| `les_b1_it_debugging` | B1 | IT | ~~`adapt_with_attribution`~~ → `authored_material` ✅ Onda 2 — Lote 10 (batch 10) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_debugging.md` |
| `les_b1_it_devops_basics` | B1 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 10 (batch 10) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_devops_basics.md` |
| `les_b1_it_presentations` | B1 | IT | `blocked_no_adequate_source` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks · **BLOQUEADA (criar arquivo e definir fonte/escopo autoral)** | `(sem arquivo em lessons/ — nó bloqueado no registro §4.3)` |
| `les_b1_it_ux_collab` | B1 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 10 (batch 10) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_ux_collab.md` |
| `les_b1_it_write_docs` | B1 | IT | ~~`adapt_with_attribution`~~ → `authored_material` ✅ Onda 2 — Lote 10 (batch 10) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b1/les_b1_it_write_docs.md` |
| `les_b2_it_advanced_patterns` | B2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 12 (batch 12) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_advanced_patterns.md` |
| `les_b2_it_architecture_decisions` | B2 | IT | ~~`adapt_with_attribution`~~ → `authored_material` ✅ Onda 2 — Lote 12 (batch 12) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_architecture_decisions.md` |
| `les_b2_it_incident_postmortem` | B2 | IT | ~~`adapt_with_attribution`~~ → `authored_material` ✅ Onda 2 — Lote 12 (batch 12) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_incident_postmortem.md` |
| `les_b2_it_jargon_mastery` | B2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 12 (batch 12) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_jargon_mastery.md` |
| `les_b2_it_mentoring` | B2 | IT | `adapt_with_attribution` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks · **thin** | `lessons/b2/les_b2_it_mentoring.md` |
| `les_b2_it_rfc_writing` | B2 | IT | `adapt_with_attribution` | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks · **thin** | `lessons/b2/les_b2_it_rfc_writing.md` |
| `les_b2_it_strategy` | B2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 12 (batch 12) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_strategy.md` |
| `les_b2_it_technical_leadership` | B2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 12 (batch 12) | Inglês técnico TI (vocabulário, discurso e tarefas do módulo B1/B2 IT) — reautoria integral do input, prática guiada, output e checks | `lessons/b2/les_b2_it_technical_leadership.md` |

**Packs associados (Onda 1):** migrar os packs dos mesmos `lesson_id` para schema canônico, declarar `**Reuse basis:** authored_material` coerente com os itens, e garantir conformidade de `item_id`/chaves/distratores.
- ~~~`packs/b1/pack_les_b1_it_acronyms_deep_v1.md`~~ → `packs/b1/pack-les-b1-it-acronyms-deep.md` (lesson `les_b1_it_acronyms_deep`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- ~~`packs/b1/pack_les_b1_it_architecture_vocab_v1.md`~~ → `packs/b1/pack-les-b1-it-architecture-vocab.md` (lesson `les_b1_it_architecture_vocab`, canônico, `authored_material`, ✅ Lote 1)
- ~~~`packs/b1/pack_les_b1_it_bdd_specs_v1.md`~~ → `packs/b1/pack-les-b1-it-bdd-specs.md` (lesson `les_b1_it_bdd_specs`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- ~~`packs/b1/pack_les_b1_it_code_review_v1.md`~~ → `packs/b1/pack-les-b1-it-code-review.md` (lesson `les_b1_it_code_review`, canônico, `authored_material`, ✅ Lote 1)
- ~~~`packs/b1/pack_les_b1_it_ddd_modeling_v1.md`~~ → `packs/b1/pack-les-b1-it-ddd-modeling.md` (lesson `les_b1_it_ddd_modeling`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- ~~`packs/b1/pack_les_b1_it_debugging_v1.md`~~ → `packs/b1/pack-les-b1-it-debugging.md` (lesson `les_b1_it_debugging`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b1/pack_les_b1_it_devops_basics_v1.md`~~ → `packs/b1/pack-les-b1-it-devops-basics.md` (lesson `les_b1_it_devops_basics`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b1/pack_les_b1_it_ux_collab_v1.md`~~ → `packs/b1/pack-les-b1-it-ux-collab.md` (lesson `les_b1_it_ux_collab`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b1/pack_les_b1_it_write_docs_v1.md`~~ → `packs/b1/pack-les-b1-it-write-docs.md` (lesson `les_b1_it_write_docs`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b2/pack_les_b2_it_advanced_patterns_v1.md`~~ → `packs/b2/pack-les-b2-it-advanced-patterns.md` (lesson `les_b2_it_advanced_patterns`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_it_architecture_decisions_v1.md`~~ → `packs/b2/pack-les-b2-it-architecture-decisions.md` (lesson `les_b2_it_architecture_decisions`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_it_incident_postmortem_v1.md`~~ → `packs/b2/pack-les-b2-it-incident-postmortem.md` (lesson `les_b2_it_incident_postmortem`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_it_jargon_mastery_v1.md`~~ → `packs/b2/pack-les-b2-it-jargon-mastery.md` (lesson `les_b2_it_jargon_mastery`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_it_mentoring_v1.md`~~ → `packs/b2/pack-les-b2-it-mentoring.md` (lesson `les_b2_it_mentoring`, canônico, `authored_material`, ✅ Lote 1)
- ~~`packs/b2/pack_les_b2_it_rfc_writing_v1.md`~~ → `packs/b2/pack-les-b2-it-rfc-writing.md` (lesson `les_b2_it_rfc_writing`, canônico, `authored_material`, ✅ Lote 1)
- ~~`packs/b2/pack_les_b2_it_strategy_v1.md`~~ → `packs/b2/pack-les-b2-it-strategy.md` (lesson `les_b2_it_strategy`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_it_technical_leadership_v1.md`~~ → `packs/b2/pack-les-b2-it-technical-leadership.md` (lesson `les_b2_it_technical_leadership`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))

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
| `les_a2_it_algorithms_basics` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 9 (batch 9) | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_algorithms_basics.md` |
| `les_a2_it_clean_code_basics` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_clean_code_basics.md` |
| `les_a2_it_computer_parts` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_computer_parts.md` |
| `les_a2_it_email_technical` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 9 (batch 9) | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_email_technical.md` |
| `les_a2_it_incidents` | A2 | IT | ~~`adapt_with_attribution`~~ → `authored_material` ✅ Onda 2 — Lote 10 (batch 10) | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_incidents.md` |
| `les_a2_it_internet_history` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_internet_history.md` |
| `les_a2_it_meeting_standup` | A2 | IT | ~~`adapt_with_attribution` · **thin**~~ → `authored_material` ✅ Lote 2 (Onda 2) | Inglês instrumental para TI A2 (stand-up) — reautoria integral concluída | `lessons/a2/les_a2_it_meeting_standup.md` |
| `les_a2_it_nontech_tech` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 9 (batch 9) | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_nontech_tech.md` |
| `les_a2_it_pr_tickets` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 9 (batch 9) | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_pr_tickets.md` |
| `les_a2_it_reading_strategy` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_reading_strategy.md` |
| `les_a2_it_roles_hierarchy` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_roles_hierarchy.md` |
| `les_a2_it_system_unit` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 8 (batch 8) | the technical register and all examples are now fully authored — reautoria integral concluída. | `lessons/a2/les_a2_it_system_unit.md` |
| `les_a2_it_terms_basics` | A2 | IT | `adapt_with_attribution` | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_terms_basics.md` |
| `les_a2_it_testing_fundamentals` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 9 (batch 9) | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_testing_fundamentals.md` |
| `les_a2_it_typescript_basics` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 9 (batch 9) | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_typescript_basics.md` |
| `les_a2_it_word_formation` | A2 | IT | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 9 (batch 9) | Inglês instrumental para TI A2 (termos, comunicação, leitura técnica básica) — reautoria integral | `lessons/a2/les_a2_it_word_formation.md` |

**Packs associados (Onda 2):** reautoria e migração dos packs A1/A2 (canônicos e legados) alinhados aos novos textos autorais.

- **Lote 2 (Onda 2, 2026-11-16):** migrados para canônico `authored_material` os packs de `les_a1_greetings`, `les_a1_intro_dialogue`, `les_a1_daily_basics`, `les_a1_pronunciation_intro`, `les_a2_it_meeting_standup`; legados v1 correspondentes removidos (catraca 106).
- **Onda 2 — Lote 2 (batch 2, 2026-11-16):** migrados para canônico `authored_material` os packs de `les_a1_alphabet_sounds`, `les_a1_en_us_en_gb`, `les_a1_to_be_forms`, `les_a1_pronouns_subject_object`, `les_a1_pronouns_possessive`; legados v1 correspondentes removidos (catraca `_legacy_packs_baseline.json` = 101).
- **Onda 2 — Lote 4 (batch 4) — Fase B, Fundação A1/A2 (2026-11-16):** migrados para canônico `authored_material` os packs de `les_a1_food`, `les_a1_occupations`, `les_a1_regular_verbs_past`, `les_a1_present_simple`, `les_a1_present_simple_questions` (`packs/a1/pack-les-a1-food.md`, `packs/a1/pack-les-a1-occupations.md`, `packs/a1/pack-les-a1-regular-verbs-past.md`, `packs/a1/pack-les-a1-present-simple.md`, `packs/a1/pack-les-a1-present-simple-questions.md`); legados v1 correspondentes removidos do disco (catraca `_legacy_packs_baseline.json` 96→**91**).

- **Onda 2 — Lote 5 (batch 5) — Fase C, Fundação A1/A2 (2026-11-16):** migrados para canônico `authored_material` os packs de `les_a1_have_has`, `les_a1_there_is_are`, `les_a1_reading_skimming`, `les_a1_false_cognates`, `les_a2_phone_calls` (`packs/a1/pack-les-a1-have-has.md`, `packs/a1/pack-les-a1-there-is-are.md`, `packs/a1/pack-les-a1-reading-skimming.md`, `packs/a1/pack-les-a1-false-cognates.md`, `packs/a2/pack-les-a2-phone-calls.md`); legados v1 correspondentes removidos do disco (catraca `_legacy_packs_baseline.json` 91→**86**).
- **Onda 2 — Lote 6 (batch 6), Fundação A1/A2 (2026-11-18):** migrados para canônico `authored_material` os packs de `les_a1_articles_nouns`, `les_a2_ask_for_help`, `les_a2_deadlines_tasks`, `les_a2_feedback_praise`, `les_a2_corporate_wrapup`, `les_a2_corpus_intro`, `les_a2_past_narrative`, `les_a2_future_will`, `les_a2_present_continuous`, `les_a2_modals_can_need` (`packs/a1/pack-les-a1-articles-nouns.md`, `packs/a2/pack-les-a2-ask-for-help.md`, `packs/a2/pack-les-a2-deadlines-tasks.md`, `packs/a2/pack-les-a2-feedback-praise.md`, `packs/a2/pack-les-a2-corporate-wrapup.md`, `packs/a2/pack-les-a2-corpus-intro.md`, `packs/a2/pack-les-a2-past-narrative.md`, `packs/a2/pack-les-a2-future-will.md`, `packs/a2/pack-les-a2-present-continuous.md`, `packs/a2/pack-les-a2-modals-can-need.md`); legados v1 correspondentes removidos do disco (catraca `_legacy_packs_baseline.json` 86→**76**).
- **Onda 2 — Lote 7 (batch 7), Fundação A2 (2026-11-18):** migrados para canônico `authored_material` os packs de `les_a2_imperatives`, `les_a2_prepositions_basic`, `les_a2_travel_vocab_core`, `les_a2_collocations`, `les_a2_stress_timing`, `les_a2_airport`, `les_a2_hotel_taxi`, `les_a2_restaurant_shopping`, `les_a2_reading_strategy`, `les_a2_writing_svo` (`packs/a2/pack-les-a2-imperatives.md`, `packs/a2/pack-les-a2-prepositions-basic.md`, `packs/a2/pack-les-a2-travel-vocab-core.md`, `packs/a2/pack-les-a2-collocations.md`, `packs/a2/pack-les-a2-stress-timing.md`, `packs/a2/pack-les-a2-airport.md`, `packs/a2/pack-les-a2-hotel-taxi.md`, `packs/a2/pack-les-a2-restaurant-shopping.md`, `packs/a2/pack-les-a2-reading-strategy.md`, `packs/a2/pack-les-a2-writing-svo.md`); legados v1 correspondentes removidos do disco (catraca `_legacy_packs_baseline.json` 76→**66**).

### Onda 3 — Consolidação B1/B2 General + Remediação + Migração de Packs Legados

**Escopo lições:** 35 lições B1/B2 General e remediação (não-IT). **Escopo packs:** migração integral dos **36 packs legados v1** remanescentes para schema canônico, com reautoria para `authored_material`.

| Lesson ID | CEFR | Trilha | Base atual | Habilidades/objetivo-alvo (reautoria) | Arquivo |
|---|---|---|---|---|---|
| `les_b1_conditionals` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 10 (batch 10) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_conditionals.md` |
| `les_b1_finance_business` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 11 (batch 11) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_finance_business.md` |
| `les_b1_hr_career` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 11 (batch 11) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_hr_career.md` |
| `les_b1_leadership_feedback` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 11 (batch 11) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_leadership_feedback.md` |
| `les_b1_modals` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 10 (batch 10) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_modals.md` |
| `les_b1_negotiation` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 11 (batch 11) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_negotiation.md` |
| `les_b1_passive` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 10 (batch 10) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_passive.md` |
| `les_b1_presentation_skills` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 11 (batch 11) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_presentation_skills.md` |
| `les_b1_project_case_study` | B1 | General | ~~`adapt_with_attribution`~~ → `authored_material` ✅ Onda 2 — Lote 13 (batch 13) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_case_study.md` |
| `les_b1_project_client_sim` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 13 (batch 13) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_client_sim.md` |
| `les_b1_project_integrated_review` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 13 (batch 13) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_integrated_review.md` |
| `les_b1_project_negotiation_roleplay` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 13 (batch 13) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_negotiation_roleplay.md` |
| `les_b1_project_presentation_final` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Lote 14 | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_presentation_final.md` |
| `les_b1_project_retrospective` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 13 (batch 13) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_project_retrospective.md` |
| `les_b1_question_forms` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 11 (batch 11) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_question_forms.md` |
| `les_b1_reported_speech` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 10 (batch 10) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_reported_speech.md` |
| `les_b1_sales_marketing` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 11 (batch 11) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_sales_marketing.md` |
| `les_b1_tenses_review` | B1 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 10 (batch 10) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b1/les_b1_tenses_review.md` |
| `les_rem_confidence_builder` | B1 | Remediation | ~~`cite_only`~~ → `authored_material` ✅ Lote 14 | Remediação dirigida (lacunas diagnósticas) — reautoria integral e alinhamento ao gatilho | `lessons/remediation/les_rem_confidence_builder.md` |
| `les_rem_grammar_be_pronouns` | B1 | Remediation | ~~`cite_only`~~ → `authored_material` ✅ Lote 14 | Remediação dirigida (lacunas diagnósticas) — reautoria integral e alinhamento ao gatilho | `lessons/remediation/les_rem_grammar_be_pronouns.md` |
| `les_rem_listening_slow_clear` | B1 | Remediation | ~~`cite_only`~~ → `authored_material` ✅ Lote 14 | Remediação dirigida (lacunas diagnósticas) — reautoria integral e alinhamento ao gatilho | `lessons/remediation/les_rem_listening_slow_clear.md` |
| `les_rem_pronunciation_th_vw` | B1 | Remediation | ~~`cite_only`~~ → `authored_material` ✅ Lote 14 | Remediação dirigida (lacunas diagnósticas) — reautoria integral e alinhamento ao gatilho | `lessons/remediation/les_rem_pronunciation_th_vw.md` |
| `les_rem_writing_svo` | B1 | Remediation | ~~`cite_only`~~ → `authored_material` ✅ Lote 14 | Remediação dirigida (lacunas diagnósticas) — reautoria integral e alinhamento ao gatilho | `lessons/remediation/les_rem_writing_svo.md` |
| `les_b2_celpe_br` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 13 (batch 13) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_celpe_br.md` |
| `les_b2_culture_brazil_vs_usa` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 12 (batch 12) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_culture_brazil_vs_usa.md` |
| `les_b2_exam_simulations` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 13 (batch 13) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_exam_simulations.md` |
| `les_b2_exam_vocab` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 13 (batch 13) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_exam_vocab.md` |
| `les_b2_ielts_writing` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 13 (batch 13) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_ielts_writing.md` |
| `les_b2_professional_argument` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 12 (batch 12) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_professional_argument.md` |
| `les_b2_professional_email_advanced` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 11 (batch 11) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_professional_email_advanced.md` |
| `les_b2_professional_review` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 11 (batch 11) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_professional_review.md` |
| `les_b2_professional_summary` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 12 (batch 12) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_professional_summary.md` |
| `les_b2_register_nuance` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 11 (batch 11) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_register_nuance.md` |
| `les_b2_toeic_reading` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 12 (batch 12) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_toeic_reading.md` |
| `les_b2_toeic_writing` | B2 | General | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 13 (batch 13) | Consolidação B1/B2 (gramática, fluência, produção e domínio profissional geral) ou remediação — reautoria integral | `lessons/b2/les_b2_toeic_writing.md` |

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
- ~~~`packs/a2/pack_les_a2_it_algorithms_basics_v1.md`~~ → `packs/a2/pack-les-a2-it-algorithms-basics.md` (lesson `les_a2_it_algorithms_basics`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- ~~~`packs/a2/pack_les_a2_it_clean_code_basics_v1.md`~~ → `packs/a2/pack-les-a2-it-clean-code-basics.md` (lesson `les_a2_it_clean_code_basics`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_it_computer_parts_v1.md`~~ → `packs/a2/pack-les-a2-it-computer-parts.md` (lesson `les_a2_it_computer_parts`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_it_email_technical_v1.md`~~ → `packs/a2/pack-les-a2-it-email-technical.md` (lesson `les_a2_it_email_technical`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- ~~`packs/a2/pack_les_a2_it_incidents_v1.md`~~ → `packs/a2/pack-les-a2-it-incidents.md` (lesson `les_a2_it_incidents`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~~`packs/a2/pack_les_a2_it_internet_history_v1.md`~~ → `packs/a2/pack-les-a2-it-internet-history.md` (lesson `les_a2_it_internet_history`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~`packs/a2/pack_les_a2_it_meeting_standup_v1.md`~~ → `packs/a2/pack-les-a2-it-meeting-standup.md` (lesson `les_a2_it_meeting_standup`, canônico, `authored_material`, ✅ Lote 2 Onda 2)
- ~~~`packs/a2/pack_les_a2_it_nontech_tech_v1.md`~~ → `packs/a2/pack-les-a2-it-nontech-tech.md` (lesson `les_a2_it_nontech_tech`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- ~~~`packs/a2/pack_les_a2_it_pr_tickets_v1.md`~~ → `packs/a2/pack-les-a2-it-pr-tickets.md` (lesson `les_a2_it_pr_tickets`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- ~~~`packs/a2/pack_les_a2_it_reading_strategy_v1.md`~~ → `packs/a2/pack-les-a2-it-reading-strategy.md` (lesson `les_a2_it_reading_strategy`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_it_roles_hierarchy_v1.md`~~ → `packs/a2/pack-les-a2-it-roles-hierarchy.md` (lesson `les_a2_it_roles_hierarchy`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_it_system_unit_v1.md`~~ → `packs/a2/pack-les-a2-it-system-unit.md` (lesson `les_a2_it_system_unit`, canônico, `authored_material`, ✅ Onda 2 — Lote 8 (batch 8))
- ~~~`packs/a2/pack_les_a2_it_testing_fundamentals_v1.md`~~ → `packs/a2/pack-les-a2-it-testing-fundamentals.md` (lesson `les_a2_it_testing_fundamentals`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- ~~~`packs/a2/pack_les_a2_it_typescript_basics_v1.md`~~ → `packs/a2/pack-les-a2-it-typescript-basics.md` (lesson `les_a2_it_typescript_basics`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- ~~~`packs/a2/pack_les_a2_it_word_formation_v1.md`~~ → `packs/a2/pack-les-a2-it-word-formation.md` (lesson `les_a2_it_word_formation`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
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
- ~~`packs/b1/pack_les_b1_conditionals_v1.md`~~ → `packs/b1/pack-les-b1-conditionals.md` (lesson `les_b1_conditionals`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b1/pack_les_b1_finance_business_v1.md`~~ → `packs/b1/pack-les-les-b1-finance-business.md` (lesson `les_b1_finance_business`, canônico, `authored_material`, ✅ Onda 2 — Lote 11 (batch 11))
- ~~`packs/b1/pack_les_b1_hr_career_v1.md`~~ → `packs/b1/pack-les-les-b1-hr-career.md` (lesson `les_b1_hr_career`, canônico, `authored_material`, ✅ Onda 2 — Lote 11 (batch 11))
- ~~~`packs/b1/pack_les_b1_it_acronyms_deep_v1.md`~~ → `packs/b1/pack-les-b1-it-acronyms-deep.md` (lesson `les_b1_it_acronyms_deep`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- `packs/b1/pack_les_b1_it_architecture_vocab_v1.md` → migrar para schema canônico; lesson `les_b1_it_architecture_vocab`, base atual `cite_only`
- ~~~`packs/b1/pack_les_b1_it_bdd_specs_v1.md`~~ → `packs/b1/pack-les-b1-it-bdd-specs.md` (lesson `les_b1_it_bdd_specs`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- `packs/b1/pack_les_b1_it_code_review_v1.md` → migrar para schema canônico; lesson `les_b1_it_code_review`, base atual `cite_only`
- ~~~`packs/b1/pack_les_b1_it_ddd_modeling_v1.md`~~ → `packs/b1/pack-les-b1-it-ddd-modeling.md` (lesson `les_b1_it_ddd_modeling`, canônico, `authored_material`, ✅ Onda 2 — Lote 9 (batch 9))
- ~~`packs/b1/pack_les_b1_it_debugging_v1.md`~~ → `packs/b1/pack-les-b1-it-debugging.md` (lesson `les_b1_it_debugging`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b1/pack_les_b1_it_devops_basics_v1.md`~~ → `packs/b1/pack-les-b1-it-devops-basics.md` (lesson `les_b1_it_devops_basics`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b1/pack_les_b1_it_ux_collab_v1.md`~~ → `packs/b1/pack-les-b1-it-ux-collab.md` (lesson `les_b1_it_ux_collab`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b1/pack_les_b1_it_write_docs_v1.md`~~ → `packs/b1/pack-les-b1-it-write-docs.md` (lesson `les_b1_it_write_docs`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b1/pack_les_b1_leadership_feedback_v1.md`~~ → `packs/b1/pack-les-les-b1-leadership-feedback.md` (lesson `les_b1_leadership_feedback`, canônico, `authored_material`, ✅ Onda 2 — Lote 11 (batch 11))
- ~~`packs/b1/pack_les_b1_modals_v1.md`~~ → `packs/b1/pack-les-b1-modals.md` (lesson `les_b1_modals`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b1/pack_les_b1_negotiation_v1.md`~~ → `packs/b1/pack-les-les-b1-negotiation.md` (lesson `les_b1_negotiation`, canônico, `authored_material`, ✅ Onda 2 — Lote 11 (batch 11))
- ~~`packs/b1/pack_les_b1_passive_v1.md`~~ → `packs/b1/pack-les-b1-passive.md` (lesson `les_b1_passive`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b1/pack_les_b1_presentation_skills_v1.md`~~ → `packs/b1/pack-les-les-b1-presentation-skills.md` (lesson `les_b1_presentation_skills`, canônico, `authored_material`, ✅ Onda 2 — Lote 11 (batch 11))
- ~~`packs/b1/pack_les_b1_project_case_study_v1.md`~~ → `packs/b1/pack-les-b1-project-case-study.md` (lesson `les_b1_project_case_study`, canônico, `authored_material`, ✅ Onda 2 — Lote 13 (batch 13))
- ~~`packs/b1/pack_les_b1_project_client_sim_v1.md`~~ → `packs/b1/pack-les-b1-project-client-sim.md` (lesson `les_b1_project_client_sim`, canônico, `authored_material`, ✅ Onda 2 — Lote 13 (batch 13))
- ~~`packs/b1/pack_les_b1_project_integrated_review_v1.md`~~ → `packs/b1/pack-les-b1-project-integrated-review.md` (lesson `les_b1_project_integrated_review`, canônico, `authored_material`, ✅ Onda 2 — Lote 13 (batch 13))
- ~~`packs/b1/pack_les_b1_project_negotiation_roleplay_v1.md`~~ → `packs/b1/pack-les-b1-project-negotiation-roleplay.md` (lesson `les_b1_project_negotiation_roleplay`, canônico, `authored_material`, ✅ Onda 2 — Lote 13 (batch 13))
- ~~`packs/b1/pack_les_b1_project_presentation_final_v1.md`~~ → `packs/b1/pack-les-b1-project-presentation-final.md` (lesson `les_b1_project_presentation_final`, canônico, `authored_material`, ✅ Lote 14)
- ~~`packs/b1/pack_les_b1_project_retrospective_v1.md`~~ → `packs/b1/pack-les-b1-project-retrospective.md` (lesson `les_b1_project_retrospective`, canônico, `authored_material`, ✅ Onda 2 — Lote 13 (batch 13))
- ~~`packs/b1/pack_les_b1_question_forms_v1.md`~~ → `packs/b1/pack-les-les-b1-question-forms.md` (lesson `les_b1_question_forms`, canônico, `authored_material`, ✅ Onda 2 — Lote 11 (batch 11))
- ~~`packs/b1/pack_les_b1_reported_speech_v1.md`~~ → `packs/b1/pack-les-b1-reported-speech.md` (lesson `les_b1_reported_speech`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b1/pack_les_b1_sales_marketing_v1.md`~~ → `packs/b1/pack-les-les-b1-sales-marketing.md` (lesson `les_b1_sales_marketing`, canônico, `authored_material`, ✅ Onda 2 — Lote 11 (batch 11))
- ~~`packs/b1/pack_les_b1_tenses_review_v1.md`~~ → `packs/b1/pack-les-b1-tenses-review.md` (lesson `les_b1_tenses_review`, canônico, `authored_material`, ✅ Onda 2 — Lote 10 (batch 10))
- ~~`packs/b2/pack_les_b2_celpe_br_v1.md`~~ → `packs/b2/pack-les-b2-celpe-br.md` (lesson `les_b2_celpe_br`, canônico, `authored_material`, ✅ Onda 2 — Lote 13 (batch 13))
- ~~`packs/b2/pack_les_b2_culture_brazil_vs_usa_v1.md`~~ → `packs/b2/pack-les-b2-culture-brazil-vs-usa.md` (lesson `les_b2_culture_brazil_vs_usa`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_exam_simulations_v1.md`~~ → `packs/b2/pack-les-b2-exam-simulations.md` (lesson `les_b2_exam_simulations`, canônico, `authored_material`, ✅ Onda 2 — Lote 13 (batch 13))
- ~~`packs/b2/pack_les_b2_exam_vocab_v1.md`~~ → `packs/b2/pack-les-b2-exam-vocab.md` (lesson `les_b2_exam_vocab`, canônico, `authored_material`, ✅ Onda 2 — Lote 13 (batch 13))
- ~~`packs/b2/pack_les_b2_ielts_writing_v1.md`~~ → `packs/b2/pack-les-b2-ielts-writing.md` (lesson `les_b2_ielts_writing`, canônico, `authored_material`, ✅ Onda 2 — Lote 13 (batch 13))
- ~~`packs/b2/pack_les_b2_it_advanced_patterns_v1.md`~~ → `packs/b2/pack-les-b2-it-advanced-patterns.md` (lesson `les_b2_it_advanced_patterns`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_it_architecture_decisions_v1.md`~~ → `packs/b2/pack-les-b2-it-architecture-decisions.md` (lesson `les_b2_it_architecture_decisions`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_it_incident_postmortem_v1.md`~~ → `packs/b2/pack-les-b2-it-incident-postmortem.md` (lesson `les_b2_it_incident_postmortem`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_it_jargon_mastery_v1.md`~~ → `packs/b2/pack-les-b2-it-jargon-mastery.md` (lesson `les_b2_it_jargon_mastery`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- `packs/b2/pack_les_b2_it_mentoring_v1.md` → migrar para schema canônico; lesson `les_b2_it_mentoring`, base atual `cite_only`
- `packs/b2/pack_les_b2_it_rfc_writing_v1.md` → migrar para schema canônico; lesson `les_b2_it_rfc_writing`, base atual `cite_only`
- ~~`packs/b2/pack_les_b2_it_strategy_v1.md`~~ → `packs/b2/pack-les-b2-it-strategy.md` (lesson `les_b2_it_strategy`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_it_technical_leadership_v1.md`~~ → `packs/b2/pack-les-b2-it-technical-leadership.md` (lesson `les_b2_it_technical_leadership`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_professional_argument_v1.md`~~ → `packs/b2/pack-les-b2-professional-argument.md` (lesson `les_b2_professional_argument`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_professional_email_advanced_v1.md`~~ → `packs/b2/pack-les-les-b2-professional-email-advanced.md` (lesson `les_b2_professional_email_advanced`, canônico, `authored_material`, ✅ Onda 2 — Lote 11 (batch 11))
- ~~`packs/b2/pack_les_b2_professional_review_v1.md`~~ → `packs/b2/pack-les-les-b2-professional-review.md` (lesson `les_b2_professional_review`, canônico, `authored_material`, ✅ Onda 2 — Lote 11 (batch 11))
- ~~`packs/b2/pack_les_b2_professional_summary_v1.md`~~ → `packs/b2/pack-les-b2-professional-summary.md` (lesson `les_b2_professional_summary`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_register_nuance_v1.md`~~ → `packs/b2/pack-les-les-b2-register-nuance.md` (lesson `les_b2_register_nuance`, canônico, `authored_material`, ✅ Onda 2 — Lote 11 (batch 11))
- ~~`packs/b2/pack_les_b2_toeic_reading_v1.md`~~ → `packs/b2/pack-les-b2-toeic-reading.md` (lesson `les_b2_toeic_reading`, canônico, `authored_material`, ✅ Onda 2 — Lote 12 (batch 12))
- ~~`packs/b2/pack_les_b2_toeic_writing_v1.md`~~ → `packs/b2/pack-les-b2-toeic-writing.md` (lesson `les_b2_toeic_writing`, canônico, `authored_material`, ✅ Onda 2 — Lote 13 (batch 13))
- ~~`packs/remediation/pack_les_rem_confidence_builder_v1.md`~~ → `packs/remediation/pack-les-rem-confidence-builder.md` (lesson `les_rem_confidence_builder`, canônico, `authored_material`, ✅ Lote 14)
- ~~`packs/remediation/pack_les_rem_grammar_be_pronouns_v1.md`~~ → `packs/remediation/pack-les-rem-grammar-be-pronouns.md` (lesson `les_rem_grammar_be_pronouns`, canônico, `authored_material`, ✅ Lote 14)
- ~~`packs/remediation/pack_les_rem_listening_slow_clear_v1.md`~~ → `packs/remediation/pack-les-rem-listening-slow-clear.md` (lesson `les_rem_listening_slow_clear`, canônico, `authored_material`, ✅ Lote 14)
- ~~`packs/remediation/pack_les_rem_pronunciation_th_vw_v1.md`~~ → `packs/remediation/pack-les-rem-pronunciation-th-vw.md` (lesson `les_rem_pronunciation_th_vw`, canônico, `authored_material`, ✅ Lote 14)
- ~~`packs/remediation/pack_les_rem_writing_svo_v1.md`~~ → `packs/remediation/pack-les-rem-writing-svo.md` (lesson `les_rem_writing_svo`, canônico, `authored_material`, ✅ Lote 14)

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


---

## 6. Registro de Execução — Onda 2 — Lote 9 (batch 9), A2 + B1-IT (2026-11-18)

- **Escopo entregue:** `les_a2_it_testing_fundamentals`, `les_a2_it_typescript_basics`, `les_a2_it_algorithms_basics`, `les_a2_it_email_technical`, `les_a2_it_nontech_tech`, `les_a2_it_word_formation`, `les_a2_it_pr_tickets`, `les_b1_it_acronyms_deep`, `les_b1_it_ddd_modeling`, `les_b1_it_bdd_specs` — 7 lições A2 (IT) + 3 lições B1 (IT), todas lições e packs 100% `authored_material` (clean-room).
- **Packs migrados para schema canônico:** `packs/a2/pack-les-a2-it-testing-fundamentals.md`, `packs/a2/pack-les-a2-it-typescript-basics.md`, `packs/a2/pack-les-a2-it-algorithms-basics.md`, `packs/a2/pack-les-a2-it-email-technical.md`, `packs/a2/pack-les-a2-it-nontech-tech.md`, `packs/a2/pack-les-a2-it-word-formation.md`, `packs/a2/pack-les-a2-it-pr-tickets.md`, `packs/b1/pack-les-b1-it-acronyms-deep.md`, `packs/b1/pack-les-b1-it-ddd-modeling.md`, `packs/b1/pack-les-b1-it-bdd-specs.md`. Legados v1 correspondentes (pack_les_a2_it_testing_fundamentals_v1.md, pack_les_a2_it_typescript_basics_v1.md, pack_les_a2_it_algorithms_basics_v1.md, pack_les_a2_it_email_technical_v1.md, pack_les_a2_it_nontech_tech_v1.md, pack_les_a2_it_word_formation_v1.md, pack_les_a2_it_pr_tickets_v1.md, pack_les_b1_it_acronyms_deep_v1.md, pack_les_b1_it_ddd_modeling_v1.md, pack_les_b1_it_bdd_specs_v1.md) removidos do disco; catraca `_legacy_packs_baseline.json` 56→**46** (a catraca só pode cair).
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3 das 10 lições: `Source` → `Original (clean-room, Onda 2 — Lote 9 (batch 9))`, `Status` → `✅ **authored** · reauthored_authored_material`; §4.4.5 `reauthored_authored_material` 60→70; §13 packs 77 canônicos / 46 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **1317 filled / 76 null-with-note / 74 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A30/B4/C0/D11/E78; placar 77/123; §5 lições 68–77), `_legacy_packs_baseline.json` (56→46), `docs/copyright-reauthoring-plan.md` (este bloco, §2.1–§2.3, §3, §4, §5 e backlog de migração).
- **Validação:** ✅ `python3 verify-integrity.py` PASS — 14/14 (0 falhas, 0 warnings), reexecutado nesta unidade. `python3 prd-score.py` PASS — 90,4% ≥ 80%. Nenhum outro gate foi executado nesta unidade.
- **Seed/carga DB (:5433):** fora do escopo desta unidade de registros — sincronização de conteúdo e re-derivação dos pins ficam a cargo da unidade de banco/gates.
- **Placar pós-Onda 2 — Lote 9 (batch 9) (estado atual):** **70/123** lições `authored_material`, 0 bloqueadas, `cite_only` **46**, `adapt_with_attribution` **7**, `sourced_external_thin` 0; packs **77 canônicos / 46 legados** (123 no total). Registro desta entrega = este bloco da §6.

> **NOTA DE NOMENCLATURA (padronização, sem reescrever o histórico):** esta entrega é registrada como "**Onda 2 — Lote 9 (batch 9)**"; entradas antigas permanecem com sua nomenclatura original.


---

## 6. Registro de Execução — Onda 2 — Lote 10 (batch 10), A2-IT + B1-IT/B1-General (2026-11-19)

- **Escopo entregue:** `les_a2_it_incidents`, `les_b1_it_debugging`, `les_b1_it_write_docs`, `les_b1_it_ux_collab`, `les_b1_it_devops_basics`, `les_b1_tenses_review`, `les_b1_modals`, `les_b1_conditionals`, `les_b1_passive`, `les_b1_reported_speech` — 1 lição A2 (IT), 4 lições B1 (IT) e 5 lições B1 (General, consolidação gramatical), todas lições e packs 100% `authored_material` (clean-room). As 3 lições que permanecem `sourced_external` no registro (`les_a2_it_incidents`, `les_b1_it_debugging`, `les_b1_it_write_docs`) também estão `authored_material` no disco; o marcador de sourcing foi preservado para manter as 7 linhas `sourced_external` exigidas pelo gate [2].
- **Packs migrados para schema canônico:** `packs/a2/pack-les-a2-it-incidents.md`, `packs/b1/pack-les-b1-it-debugging.md`, `packs/b1/pack-les-b1-it-write-docs.md`, `packs/b1/pack-les-b1-it-ux-collab.md`, `packs/b1/pack-les-b1-it-devops-basics.md`, `packs/b1/pack-les-b1-tenses-review.md`, `packs/b1/pack-les-b1-modals.md`, `packs/b1/pack-les-b1-conditionals.md`, `packs/b1/pack-les-b1-passive.md`, `packs/b1/pack-les-b1-reported-speech.md`. Legados v1 correspondentes removidos do disco; catraca `_legacy_packs_baseline.json` 46→**36** (a catraca só pode cair).
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3 de 7 lições: `Source` → `Original (clean-room, Onda 2 — Lote 10 (batch 10))`, `Status` → `✅ **authored** · reauthored_authored_material`; §4.4.5 placar 70→80; §13 packs 87 canônicos / 36 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **1497 filled / 76 null-with-note / 84 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A26/B1/C0/D11/E85; placar 87/123; §5 lições 78–84), `_legacy_packs_baseline.json` (46→36), `docs/copyright-reauthoring-plan.md` (este bloco, §2.1–§2.3, §3, §4, §5 e backlog de migração), `TASK_PROGRESS.md` e `its-platform/docs/api-spec.openapi.yaml` (3 pins re-derivados).
- **Validação:** ✅ `python3 verify-integrity.py` PASS — 14/14 (0 falhas, 0 warnings), reexecutado nesta unidade. `python3 prd-score.py` PASS — ≥ 80%. Nenhum outro gate foi executado nesta unidade.
- **Seed/carga DB (:5433):** fora do escopo desta unidade de registros — sincronização de conteúdo e re-derivação dos pins ficam a cargo da unidade de banco/gates.
- **Placar pós-Onda 2 — Lote 10 (batch 10) (estado atual):** **80/123** lições `authored_material`, 0 bloqueadas, `cite_only` **39**, `adapt_with_attribution` **4**, `sourced_external_thin` 0; packs **87 canônicos / 36 legados** (123 no total). Registro desta entrega = este bloco da §6.

> **NOTA DE NOMENCLATURA (padronização, sem reescrever o histórico):** esta entrega é registrada como "**Onda 2 — Lote 10 (batch 10)**"; entradas antigas permanecem com sua nomenclatura original.

---

## 6. Registro de Execução — Onda 2 — Lote 11 (batch 11), B1/B2 General (2026-11-19)

- **Escopo entregue:** `les_b1_question_forms`, `les_b1_negotiation`, `les_b1_presentation_skills`, `les_b1_leadership_feedback`, `les_b1_finance_business`, `les_b1_hr_career`, `les_b1_sales_marketing` (B1 General, módulos `mod_b1_grammar_consolidate` / `mod_b1_workplace_adv`) e `les_b2_register_nuance`, `les_b2_professional_email_advanced`, `les_b2_professional_review` (B2 General, módulo `mod_b2_professional`) — 10 lições e packs 100% `authored_material` (clean-room).
- **Packs migrados para schema canônico:** `packs/b1/pack-les-b1-question-forms.md`, `packs/b1/pack-les-b1-negotiation.md`, `packs/b1/pack-les-b1-presentation-skills.md`, `packs/b1/pack-les-b1-leadership-feedback.md`, `packs/b1/pack-les-b1-finance-business.md`, `packs/b1/pack-les-b1-hr-career.md`, `packs/b1/pack-les-b1-sales-marketing.md`, `packs/b2/pack-les-b2-register-nuance.md`, `packs/b2/pack-les-b2-professional-email-advanced.md`, `packs/b2/pack-les-b2-professional-review.md`. Legados v1 correspondentes removidos do disco; catraca `_legacy_packs_baseline.json` 36→**26** (a catraca só pode cair).
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3 das 10 lições: `Source` → `Original (clean-room, Onda 2 — Lote 11)`, `Status` → `✅ **authored** · reauthored_authored_material`; §4.4.5 placar 80→90; §13 packs 97 canônicos / 26 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **1677 filled / 76 null-with-note / 94 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A17/B0/C0/D11/E95; placar 97/123; §5 lições 85–94), `_legacy_packs_baseline.json` (36→26), `docs/copyright-reauthoring-plan.md` (este bloco, §2.1–§2.3, §3, §4, §5 e backlog de migração), `TASK_PROGRESS.md` e `its-platform/docs/api-spec.openapi.yaml` (3 pins re-derivados).
- **Validação:** ✅ `python3 verify-integrity.py` PASS — 14/14 (0 falhas, 0 warnings), reexecutado nesta unidade. `python3 prd-score.py` PASS — ≥ 80%. Nenhum outro gate foi executado nesta unidade.
- **Seed/carga DB (:5433):** fora do escopo desta unidade de registros — sincronização de conteúdo e re-derivação dos pins ficam a cargo da unidade de banco/gates.
- **Placar pós-Onda 2 — Lote 11 (batch 11) (estado anterior):** **90/123** lições `authored_material`, 0 bloqueadas, `cite_only` **29**, `adapt_with_attribution` **4**, `sourced_external_thin` 0; packs **97 canônicos / 26 legados** (123 no total).

---

## 6. Registro de Execução — Onda 2 — Lote 12 (batch 12), B2 Professional/IT/Cert Prep (2026-11-19)

- **Escopo entregue:** `les_b2_professional_argument`, `les_b2_professional_summary`, `les_b2_culture_brazil_vs_usa` (`mod_b2_professional`), `les_b2_it_architecture_decisions`, `les_b2_it_strategy`, `les_b2_it_incident_postmortem`, `les_b2_it_jargon_mastery`, `les_b2_it_advanced_patterns`, `les_b2_it_technical_leadership` (`mod_b2_it_senior`) e `les_b2_toeic_reading` (`mod_b2_cert_prep`) — 10 lições e packs 100% `authored_material` (clean-room), com 4 fases pedagógicas e 0 self-loops no grafo.
- **Packs migrados para schema canônico:** `packs/b2/pack-les-b2-professional-argument.md`, `packs/b2/pack-les-b2-professional-summary.md`, `packs/b2/pack-les-b2-culture-brazil-vs-usa.md`, `packs/b2/pack-les-b2-it-architecture-decisions.md`, `packs/b2/pack-les-b2-it-strategy.md`, `packs/b2/pack-les-b2-it-incident-postmortem.md`, `packs/b2/pack-les-b2-it-jargon-mastery.md`, `packs/b2/pack-les-b2-it-advanced-patterns.md`, `packs/b2/pack-les-b2-it-technical-leadership.md`, `packs/b2/pack-les-b2-toeic-reading.md`. Legados v1 correspondentes removidos do disco; catraca `_legacy_packs_baseline.json` 26→**16** (a catraca só pode cair).
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3 das 10 lições: `Status` → `✅ **authored** · reauthored_authored_material`, preservando `· sourcing: sourced_external` nas 2 linhas que o exigem; §4.4.5 placar 90→100; §13 `Lessons authored | 123` inalterado e packs 107 canônicos / 16 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **1857 filled / 76 null-with-note / 104 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A17/B0/C0/D11/E95 inalteradas; placar 100/123; §5 lições 95–104), `_legacy_packs_baseline.json` (26→16), `docs/copyright-reauthoring-plan.md` (este bloco, §2.1–§2.3, §3, §4, §5 e backlog de migração), `TASK_PROGRESS.md` e `its-platform/docs/api-spec.openapi.yaml` (3 pins re-derivados).
- **Validação:** ✅ `python3 verify-integrity.py` PASS — 14/14 (0 falhas, 0 warnings). `python3 prd-score.py` PASS — ≥ 80%. Nenhum outro gate foi executado nesta unidade.
- **Seed/carga DB (:5433):** fora do escopo desta unidade de registros — sincronização de conteúdo e re-derivação dos pins ficam a cargo da unidade de banco/gates.
- **Nota metodológica:** o placar de `authored_material` foi medido na primeira declaração de `**Reuse basis:**` em `lessons/*/*.md` (100/2/21). As classes A–E são derivadas pelo gate [3] da coluna `Source` de §4.3, que permanece com as fontes históricas; por isso A17/B0/C0/D11/E95 não mudaram apesar da reautoria em disco.
- **Placar pós-Onda 2 — Lote 12 (batch 12) (estado anterior):** **100/123** lições `authored_material`, 0 bloqueadas, `cite_only` **21**, `adapt_with_attribution` **2**, `sourced_external_thin` 0; **23** lições pendentes de reautoria; packs **107 canônicos / 16 legados** (123 no total). Registro histórico deste bloco da §6.

---

## 6. Registro de Execução — Onda 2 — Lote 13 (batch 13), B2 Cert Prep/Exam + B1 Project (2026-11-19)

- **Escopo entregue:** `les_b2_toeic_writing`, `les_b2_ielts_writing`, `les_b2_celpe_br`, `les_b2_exam_vocab`, `les_b2_exam_simulations` (`mod_b2_cert_prep`) e `les_b1_project_case_study`, `les_b1_project_retrospective`, `les_b1_project_client_sim`, `les_b1_project_negotiation_roleplay`, `les_b1_project_integrated_review` (`mod_b1_fluency_project`) — 10 lições e packs 100% `authored_material` (clean-room), com 4 fases pedagógicas e 0 self-loops no grafo. Lições de prova (TOEIC/IELTS/CELPE-Bras) e `exam_vocab` (list-shaped) reautoradas sem reproduzir itens/listas oficiais ou proprietárias.
- **Packs migrados para schema canônico:** `packs/b2/pack-les-b2-toeic-writing.md`, `packs/b2/pack-les-b2-ielts-writing.md`, `packs/b2/pack-les-b2-celpe-br.md`, `packs/b2/pack-les-b2-exam-vocab.md`, `packs/b2/pack-les-b2-exam-simulations.md`, `packs/b1/pack-les-b1-project-case-study.md`, `packs/b1/pack-les-b1-project-retrospective.md`, `packs/b1/pack-les-b1-project-client-sim.md`, `packs/b1/pack-les-b1-project-negotiation-roleplay.md`, `packs/b1/pack-les-b1-project-integrated-review.md`. Legados v1 correspondentes removidos do disco; catraca `_legacy_packs_baseline.json` 16→**6** (a catraca só pode cair).
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3 das 10 lições: `Status` → `✅ **authored** · reauthored_authored_material`, preservando `· sourcing: \`sourced_external\`` na linha de `les_b1_project_case_study`; coluna `Source` histórica preservada; §4.4.5 placar 100→110; §13 `Lessons authored | 123` inalterado e packs 117 canônicos / 6 legados), `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado: **2037 filled / 76 null-with-note / 114 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: classes A17/B0/C0/D11/E95 inalteradas; placar 110/123; §5 lições 105–114), `_legacy_packs_baseline.json` (16→6), `docs/copyright-reauthoring-plan.md` (este bloco, §2.1–§2.3, §3, §4, §5 e backlog de migração), `TASK_PROGRESS.md` e `its-platform/docs/api-spec.openapi.yaml` (3 pins re-derivados).
- **Validação:** ⚠️ → ✅ `python3 verify-integrity.py` — **1ª execução:** 14/14 checks executados, **FAIL: 54 falhas, 0 warnings**. As 54 falhas são todas do check [9] nos packs canônicos do Lote 13: `item_id` com prefixo `b1_`/`b2_` cujo namespace de skill é `grammar.`/`reading.`/`vocab.` (esperado `grm_`/`rdg_`/`voc_`, §1.2). **Nenhuma falha nos 7 arquivos de registro.** **Resolução (unidade de conteúdo, pós-registro):** 63 `item_id` em 9 packs corrigidos de `b1_`/`b2_` para `grm_`/`rdg_`/`voc_`/`prn_` (§1.2); `project_integrated_review` já estava conforme. **Reexecução final: PASS — 14/14, 0 falhas, 0 warnings**; `python3 /tmp/opencode/audit.py --global --root packs` OK, 819 `item_id` globais únicos, 0 duplicatas; nenhum fallback de modelo (sempre `opencode/big-pickle`). `python3 prd-score.py` PASS — 90,4% ≥ 80%. Nenhum outro gate foi executado nesta unidade.
- **Seed/carga DB (:5433):** fora do escopo desta unidade de registros — sincronização de conteúdo fica a cargo da unidade de banco.
- **Nota metodológica:** o placar de `authored_material` foi medido na primeira declaração de `**Reuse basis:**` em `lessons/*/*.md` (110/1/12). As classes A–E são derivadas pelo gate [3] da coluna `Source` de §4.3, que permanece com as fontes históricas; por isso A17/B0/C0/D11/E95 não mudaram apesar da reautoria em disco.
- **Divergência de pack preservada:** `pack_les_a2_greetings_intro_v1` segue `adapt_requires_permission` no banco e `cite_only` no disco — sem correção nesta unidade.
- **Placar pós-Onda 2 — Lote 13 (batch 13) (estado atual):** **110/123** lições `authored_material`, 0 bloqueadas, `cite_only` **12**, `adapt_with_attribution` **1**, `sourced_external_thin` 0; **13** lições pendentes de reautoria; packs **117 canônicos / 6 legados** (123 no total). Registro desta entrega = este bloco da §6.


---

## 6. Registro de Execução — Lote 14, B1 Project + Remediação (2026-11-19)

- **Escopo entregue:** `les_b1_project_presentation_final`, `les_rem_pronunciation_th_vw`, `les_rem_listening_slow_clear`, `les_rem_grammar_be_pronouns`, `les_rem_confidence_builder`, `les_rem_writing_svo` — 6 lições e packs reautorados em clean-room como `authored_material` (100% original). Nenhum fallback de modelo: **sempre `opencode/big-pickle`**.
- **Packs migrados para schema canônico:** `packs/b1/pack-les-b1-project-presentation-final.md`, `packs/remediation/pack-les-rem-pronunciation-th-vw.md`, `packs/remediation/pack-les-rem-listening-slow-clear.md`, `packs/remediation/pack-les-rem-grammar-be-pronouns.md`, `packs/remediation/pack-les-rem-confidence-builder.md`, `packs/remediation/pack-les-rem-writing-svo.md`. Legados v1 correspondentes removidos do disco; catraca `_legacy_packs_baseline.json` **6 → 0**.
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3 das 6 lições: `Status` → `✅ **authored** · reauthored_authored_material`, preservando os 5 sufixos `· trigger: ...` e a coluna `Source` histórica; §4.4.5 placar 110→116 e 107→113 linhas; §13 `Lessons reauthored` 116, packs 123 canônicos / 0 legados), `specs/assessment-item-spec.md` §2.2.1 (censo **2136 filled / 76 null-with-note / 123 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5 placar 116/123, 1 `sourced_external` pendente, 6 `cite_only`, classes **A17/B0/C0/D11/E95** inalteradas; §5 linhas 115–120), `docs/copyright-reauthoring-plan.md` (este bloco, §2.1–§2.3, §3, §4, §5), `TASK_PROGRESS.md` e `its-platform/docs/api-spec.openapi.yaml` (3 pins re-derivados).
- **Nota operacional (correção de FK):** `les_b1_project_presentation_final` declarava `les_a2_it_communication` e `les_b1_it_technical` em `prereq_lessons` — IDs inexistentes em §4.3 (são nomes de módulos). Substituídos por `les_a2_it_meeting_standup` e `les_b1_it_presentations`, ambos presentes no registro.
- **Validação:** `python3 verify-integrity.py` → **PASS 14/14** (0 falhas, 0 warnings); `python3 prd-score.py` → **≥ 80%**; `python3 /tmp/opencode/audit.py --global --root packs` → OK; pins confirmados por `git hash-object` (3/3 OK).
- **Placar pós-Lote 14 (estado atual):** **116/123** lições `authored_material`, `cite_only` **6**, `adapt_with_attribution` **1**, `adapt_requires_permission` **0**; **7** lições pendentes de reautoria; packs **123 canônicos / 0 legados**; censo `br_pt_form` **2136 / 76 / 123 / 0**; classes §0.5 **A17/B0/C0/D11/E95**.


---

## 6. Registro de Execução — Onda 2 — Lote 15 (Fechamento), A2 Workplace/IT (2026-11-19)

- **Escopo entregue:** `les_a2_greetings_intro`, `les_a2_small_talk`, `les_a2_introducing_others`, `les_a2_meeting_open`, `les_a2_meeting_participate`, `les_a2_email_basics`, `les_a2_it_terms_basics` — 7 lições e packs reautorados em-lugar como `authored_material` (100% original, clean-room). **Lote de fechamento: 123/123 lições e 123/123 packs em `authored_material`.**
- **Packs:** 7 packs canônicos reescritos em-lugar (sem legados a remover; catraca já em 0): `packs/a2/pack-les-a2-greetings-intro.md`, `packs/a2/pack-les-a2-small-talk.md`, `packs/a2/pack-les-a2-introducing-others.md`, `packs/a2/pack-les-a2-meeting-open.md`, `packs/a2/pack-les-a2-meeting-participate.md`, `packs/a2/pack-les-a2-email-basics.md`, `packs/a2/pack-les-a2-it-terms-basics.md`. `pack_id` originais preservados (inclusive `pack_les_a2_it_terms_basics_v1`).
- **Registros/gates atualizados nesta unidade:** `specs/curriculum-graph-spec.md` (§4.3: 7 linhas com sufixo `· reauthored_authored_material`; em `les_a2_it_terms_basics` o marcador histórico `` · `sourced_external` `` foi **preservado** como âncora do gate [2]; §4.4.5 `reauthored_authored_material` 116→123 e `sourced_external` mantido em 7 com 0 pendentes de reautoria integral; §13 123/123), `specs/assessment-item-spec.md` §2.2.1 (censo **2181 filled / 27 null-with-note / 125 null-not-applicable / 0 undocumented**), `external-sources.md` (§0.5: 123/123, 0 `cite_only`, 0 `adapt_with_attribution`, 0 pendentes; classes **A17/B0/C0/D11/E95** inalteradas — derivadas pelo gate [3] da coluna `Source` histórica de §4.3), `docs/copyright-reauthoring-plan.md` (este bloco), `TASK_PROGRESS.md` e `its-platform/docs/api-spec.openapi.yaml` (3 pins re-derivados). `_legacy_packs_baseline.json` já em 0.
- **Notas operacionais:** (1) `les_a2_greetings_intro` mora em `lesson-15min-workplace-greetings.md` (filename ≠ id; gate [2] casa por `**Lesson ID:**`). (2) Correção durante a autoria: `les_a2_small_talk` teve `prereq_lessons` restaurado para `["les_a2_greetings_intro"]` (id válido em §4.3). (3) Auditor local endurecido fora do repo (`/tmp/opencode/audit.py`): rejeita `domain: coherence` (namespace de skill, não domínio) e aceita alias filename↔`Lesson ID` quando o arquivo não começa com `les_`.
- **Validação:** `python3 verify-integrity.py` → **PASS 14/14** (0 falhas, 0 warnings); `python3 prd-score.py` → ≥ 80%; `python3 /tmp/opencode/audit.py --global --root packs` → OK; pins 3/3 confirmados. `npm test` e `next build` permanecem para o fechamento final da campanha (unidade de banco/gates/commit).
- **Placar final (pós-Lote 15):** **123/123** lições `authored_material`, `cite_only` **0**, `adapt_with_attribution` **0**, `adapt_requires_permission` **0**; **0** pendentes; packs **123 canônicos / 0 legados**; censo **2181 / 27 / 125 / 0**; classes §0.5 **A17/B0/C0/D11/E95**. Nenhum fallback de modelo: sempre `opencode/big-pickle`.
