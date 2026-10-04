# Content Map — Source Extraction Blueprint

**Purpose:** Granular mapping of the 7 source markdowns into curriculum graph nodes, skill items, and IRT item blueprints. This is the bridge between raw PDF-derived content and the adaptive engine.

**Upstream Specs:** `curriculum-graph-spec.md` (nodes), `stats-progress-evaluation-spec.md` (IRT/BKT), `diagnostic-spec.md` (CAT)

---

## 1. EXTRACTION PIPELINE

```
Ingles/output/*.md  (7 files, ~826KB)
        │
        ▼
[1] SECTION INVENTORY     → per-file section index (this doc §2)
        │
        ▼
[2] SKILL EXTRACTION      → skill_items per section (this doc §3)
        │
        ▼
[3] NODE MAPPING          → section → lesson_id (this doc §4)
        │
        ▼
[4] IRT BLUEPRINT         → item counts + difficulty by CEFR (this doc §5)
        │
        ▼
[5] ASSET REGISTRY        → audio TTS flags, images, video embeds (this doc §6)
```

---

## 2. SECTION INVENTORY (All 7 Files)

### 2.0 Citation Key (how to read a `Source` cell)

| Notation | Means | Resolves to |
|----------|-------|-------------|
| `apostila 3.2.1` | `apostila-ingles-para-iniciantes-impresso.md` §3.2.1 | verified: §2.1–2.3, §3.1.1–3.1.4, §3.2.1–3.2.3, §4.1–4.3, §5.1–5.6 |
| `basico M2` | `Ingles-basico.md`, MÓDULO 2 | verified: M1 = line 494, M2 = 1020, M3 = 1582 |
| `frases Ch4` | `frases-ingles-trabalho.md` chapter 4 | verified: 12 chapters, TOC at lines 40–72 |
| `IT §7.4` / `IT A7` | `Ingles-Tecnico-Para-Informatica.md`, Aula 7 (⇔ §7.x) | verified: 8 aulas, Sumário at lines 145–200 |
| `leia Ch2` | `leia-e-escreva-melhor-em-ingles.md` chapter 2 | verified: 12 chapters + Bônus 1–2 |
| `dicionário Ch3` / `Bônus 1` | `Dicionario-de-Siglas...md` | verified: 12 chapters + Bônus 1–2 + A–Z index |
| `viagens Dia 3` | `Ingles para Viagens.md`, DIA 3 | verified: DIA 1 = 49, 2 = 434, 3 = 821, 4 = 1263, 5 = 1861 |

**IT chapter ⇔ section map** (used to expand `IT AN` citations at authoring time):

| Ref | § | Ref | § |
|-----|---|-----|---|
| IT A1 | 1.1 idiomatic diff · 1.2 pronouns · 1.3 verb to be · 1.4 what are computers · 1.5 adjectives · 1.6 parts of speech | IT A5 | 5.1 system unit · 5.2 past regular · 5.3 past irregular · 5.4 will · 5.5 going to · 5.6 predicting |
| IT A2 | 2.1 clues for reading · 2.2 reading strategy · 2.3 what can you do | IT A6 | 6.1 history of internet · 6.2 relative pronouns · 6.3 noun plurals · 6.4 there + be |
| IT A3 | 3.1 differences/utilities · 3.2 demonstratives · 3.3 articles · 3.4 verb to have | IT A7 | 7.1 the HTML · 7.2 prefix · 7.3 suffix · **7.4 deceptive cognates** · 7.5 prepositions |
| IT A4 | 4.1 inside computers · 4.2 simple present · 4.3 do/does · 4.4 present continuous | IT A8 | 8.1 the beginning · 8.2 technical vocabulary |

> ⚠️ **Aula 5 is "Parts of computers II", not "System unit".** §5.1 (System unit) is *inside* Aula 5. Several earlier drafts of this document conflated the two; §2.5 is now corrected.

### 2.1 `apostila-ingles-para-iniciantes-impresso.md` (66KB, A1)
| § | Title | Content Type | Nodes Fed |
|---|-------|--------------|-----------|
| 1 | Introdução | Motivation prose | `les_a1_alphabet_sounds` (framing) |
| 2.1 | O Alfabeto | 26 letters + phonetics | `les_a1_alphabet_sounds` |
| 2.2.1 | Saudações (Greetings) | 14 PT→EN phrase pairs | `les_a1_greetings` |
| 2.2.2 | Conversação | 3-step framework + 2 dialogues | `les_a1_intro_dialogue` |
| 2.3 | Diferenças EN-US vs EN-UK | Contrast table | `les_a1_en_us_en_gb` (enrichment) |
| 3.1.1 | Pronome Pessoal | 2 tables (subject/object) | `les_a1_pronouns_subject_object` |
| 3.1.2 | Pronome Possessivo | Table + contraction note | `les_a1_pronouns_possessive` |
| 3.1.3 | Pronome Demonstrativo | 4-item table + near/far rule | `les_a1_pronouns_demonstrative` |
| 3.1.4 | Pronome Interrogativo | 8 WH-words + how+adverb list | `les_a1_wh_questions` |
| 3.2.1 | Verbos Regulares | ED-rule 4-way table | `les_a1_regular_verbs_past` |
| 3.2.2 | Verbos Irregulares | 2-row table (be, go) | `les_a1_regular_verbs_past` |
| 3.2.3 | Verbo To Be | Full conjugation + neg + interrog | `les_a1_to_be_forms` |
| 4.1 | Artigos | definite/indefinite | `les_a1_articles_nouns` |
| 4.2 | Substantivos | plural/singular | `les_a1_articles_nouns` |
| 4.3 | Adjetivos | comparison/position | `les_a1_articles_nouns` |
| 5.1 | Cores e Números | 2 vocab lists | `les_a1_numbers_colors` |
| 5.2 | Dias e Meses | 2 vocab lists | `les_a1_days_months` |
| 5.3 | Horas e Datas | time expressions | `les_a1_time_dates` |
| 5.4 | Comidas | food vocab | `les_a1_food` |
| 5.5 | Profissões | occupation vocab | `les_a1_occupations` |
| 5.6 | Expressões do Dia | daily expressions | `les_a1_daily_basics` |

### 2.2 `Ingles-basico.md` (218KB, A1→A2)
| § | Title | Content Type | Nodes Fed |
|---|-------|--------------|-----------|
| 1ª Parte L1 | Inglês no dia a dia / Apresentações | 6 phrases + dialogue | `les_a1_greetings` (supplement) |
| 1ª Parte L2 | Numbers/Time/Colors | vocab + practice | `les_a1_numbers_colors` (supplement) |
| 1ª Parte L3 | Days/Months/Food | vocab + practice | `les_a1_days_months`, `les_a1_food` |
| 2ª Parte L1 | Common expressions | phrase bank | `les_a1_daily_basics` |
| 2ª Parte L2 | Daily routine | present simple | `les_a1_present_simple` |
| 3ª Parte L1-4 | Verb to be / do/does / questions | grammar deep-dive | `les_a1_to_be_forms`, `les_a1_present_simple_questions` |
| Special Part | Verb To Be | full reference | `les_a1_to_be_forms` (ref) |
| Special Part | Grammar | full reference | `mod_b1_grammar_consolidate` (ref) |

### 2.3 `frases-ingles-trabalho.md` (90KB, A2→B1)
| § | Title | Phrases | Nodes Fed |
|---|-------|---------|-----------|
| Ch 1 | Introdução (how to use) | methodology prose | — (tutor guidance) |
| Ch 2 | Cumprimentos e apresentações | 12 frases + vocab + 4 armadilhas | `les_a2_greetings_intro` ✅, `les_a2_introducing_others` |
| Ch 3 | Small talk com colegas | 10 frases | `les_a2_small_talk` |
| Ch 4 | Reuniões | 16 frases | `les_a2_meeting_open`, `les_a2_meeting_participate` |
| Ch 5 | E-mails e mensagens | 12 frases | `les_a2_email_basics` |
| Ch 6 | Telefone e videochamadas | 12 frases | `les_a2_phone_calls`, `les_a2_it_meeting_standup` |
| Ch 7 | Pedir ajuda / ganhar tempo | 12 frases | `les_a2_ask_for_help` |
| Ch 8 | Prazos, tarefas, follow-up | 12 frases | `les_a2_deadlines_tasks` |
| Ch 9 | Feedback, elogios, desculpas | 8 frases | `les_a2_feedback_praise` |
| Ch 10 | Despedidas | 6 frases | `les_a2_corporate_wrapup` |
| Ch 11 | 10 erros de brasileiros | error taxonomy | Cross-cutting (all A2 lessons) |
| Ch 12 | Mini-diálogos (3 cenas) | 3 dialogues | `les_a2_*` role-play input |
| Extra | Kit de bolso (100 frases) | compact reference | FSRS anchor set |

### 2.4 `Ingles para Viagens.md` (57KB, A2)
| § | Title | Content Type | Nodes Fed |
|---|-------|--------------|-----------|
| Concepts | Ordem de aquisição L1 vs L2 | SLA meta | `les_a2_travel_vocab_core` (framing) |
| Language/Culture | Collocations | 6 "aula" collocations | `les_a2_collocations` |
| Pronúncia | 2 golden rules + sílaba tônica | phonology | `les_a2_stress_timing` |
| Dia 2 | Vocabulário geral (20 words) | vocab list | `les_a2_travel_vocab_core` |
| Dia 2 | Top 60 most common words | frequency list | `mod_a1_vocab_core` (enrichment) |
| Dia 3+ | Airport/Immigration/Taxi/Hotel | situational phrases | `les_a2_airport`, `les_a2_hotel_taxi`, `les_a2_hotel_taxi` |
| Dia 3+ | Restaurant/Shopping/Emergency | situational phrases | `les_a2_restaurant_shopping`, `les_a2_restaurant_shopping`, `les_a2_restaurant_shopping` |

### 2.5 `Ingles-Tecnico-Para-Informatica.md` (174KB, A1→B2, IT)

Verified against the source Sumário (lines 145–200). Note **Aula 5 is "Parts of computers II", not "System unit"** — `System unit` is §5.1 *within* Aula 5.

| § | Title | Grammar / Skill Focus | Nodes Fed |
|---|-------|----------------------|-----------|
| 1.1 | Idiomatic differences EN↔PT | contrast | `les_a2_it_word_formation` |
| 1.2 | Pronouns | subject/object/possessive | `les_a1_pronouns_subject_object`, `les_a1_pronouns_possessive` |
| 1.3 | Verb to be – simple present | am/is/are | `les_a1_to_be_forms` |
| 1.4 | What are computers? | reading comprehension | `les_a2_it_terms_basics` |
| 1.5 | Adjectives | attributive vs predicative | `les_a1_articles_nouns` |
| 1.6 | Parts of speech | noun/verb/adj/adverb classes | `les_a1_articles_nouns` |
| 2.1 | Clues for reading of texts | skimming | `les_a1_reading_skimming` |
| 2.2 | Reading strategy | scanning | `les_a1_reading_skimming` |
| 2.3 | What can you do with computers? | WH-questions | `les_a1_wh_questions` |
| 3.1 | Differences and utilities | comparison | `les_a2_it_computer_parts` |
| 3.2 | Demonstrative pronouns | this/that/these/those | `les_a1_pronouns_demonstrative` |
| 3.3 | Definite and indefinite article | a/an/the | `les_a1_articles_nouns` |
| 3.4 | Verb to have – simple present | have/has | `les_a1_have_has` |
| 4.1 | Inside the computers | part-of-speech compounds | `les_a2_it_computer_parts` |
| 4.2 | Simple present tense | 3rd-person -s | `les_a1_present_simple` |
| 4.3 | Do e does | auxiliary selection | `les_a1_present_simple_questions` |
| 4.4 | Present continuous tense | be + -ing | `les_a2_present_continuous` |
| 5.1 | System unit | hardware vocabulary | `les_a2_it_system_unit` |
| 5.2 | Simple past – regular verbs | ED rules | `les_a1_regular_verbs_past` |
| 5.3 | Simple past – irregular verbs | irregular set | `les_b1_tenses_review` |
| 5.4 | Simple future – will | will + base | `les_a2_future_will` |
| 5.5 | Future using "be going to" | going to + base | `les_a2_future_will` |
| 5.6 | Predicting the future | modals of probability | `les_a2_modals_can_need` |
| 6.1 | The history of the internet | past narrative | `les_a2_it_internet_history` |
| 6.2 | Relative pronouns | who/which/that | `les_b1_question_forms` |
| 6.3 | Regular and irregular plural of nouns | plural morphology | `les_a1_articles_nouns` |
| 6.4 | There + Verb to be | there is/are | `les_a1_there_is_are` |
| 7.1 | The HTML | tech nouns | `les_a2_it_terms_basics` |
| 7.2 | Prefix | word formation | `les_a2_it_word_formation` |
| 7.3 | Suffix | word formation | `les_a2_it_word_formation` |
| 7.4 | **Deceptive cognates** | 6 false cognates (deck A11–A16) | `les_a1_false_cognates`, `les_a2_it_word_formation` |
| 7.5 | Prepositions | place/direction/time/manner/agent | `les_a2_prepositions_basic` |
| 8.1 | The beginning of e-mail | narrative | `les_a2_it_email_technical` |
| 8.2 | Technical vocabulary of computer | tech terms | `les_a2_it_terms_basics` |

> ⚠️ **Correction applied.** The previous version of this table mis-titled Aula 5 as "System unit" and mapped IT §7 to `mod_b1_it_technical`. Both are wrong: §5.1 is *inside* Aula 5, and the HTML word-formation content is A2-level, feeding the IT-track module.
>
> **Coverage gap — EXPANDED to 13 lessons, now RESOLVED.** This note originally named 4 undersourced B1 lessons. Auditing **every** bare `IT A<n>` citation against this book's own Sumário found **13** deficient ones, and the dicionário turned out not to cover them either: `architecture`, `code review`, `incident`, `RFC`, `stand-up`, `mentoring` are **0 hits across all 7 sources**. 29 of 33 IT citations verified correct, so the failure is specific — a citation stretched to cover discourse the book lacks — not general. All 13 are now `deferred_no_source` with `Source = — none —`; entry nodes repointed. **The IT track terminates at A2.** Full analysis: `curriculum-graph-spec.md` §4.4. Gap row: §8.5 G1.

### 2.6 `leia-e-escreva-melhor-em-ingles.md` (78KB, A2→B2, Reading+Writing)
| § | Title | Skill | Nodes Fed |
|---|-------|-------|-----------|
| Ch 1 | Introdução + 7-step method | methodology | Tutor guidance (lesson scaffolding) |
| Ch 2 | Caixa de ferramentas do leitor | skimming, scanning, context, cognates | `les_a2_reading_strategy` |
| Ch 2 | Falsos cognatos table (11) | error taxonomy | Cross-cutting (all A2+) |
| Ch 2 | 3 níveis de interpretação | literal/inference/tone | `les_a1_reading_skimming` |
| Ch 3 | Caixa de ferramentas do escritor | SVO order, explicit subject, tense consistency | `les_a2_writing_svo` |
| Ch 4 | Oficina 1: Bio e perfil | writing (self) | `les_a2_writing_bio` |
| Ch 5 | Oficina 2: Mensagens do dia a dia | writing (informal) | `les_a2_writing_messages` |
| Ch 6 | Oficina 3: Narrar no passado | writing (past) | `les_a2_writing_past` |
| Ch 7 | Oficina 4: E-mail informal vs formal | writing (register) | `les_a2_writing_messages` |
| Ch 8 | Oficina 5: Opinar (review) | writing (opinion) | `les_b2_professional_review` |
| Ch 9 | Oficina 6: Argumentar (mini-essay) | writing (argumentative) | `les_b2_professional_argument` |
| Ch 10 | Oficina 7: Resumir (summary) | writing (summary) | `les_b2_professional_summary` |
| Ch 11 | 15 erros de escrita BR | error taxonomy | Cross-cutting (all writing) |
| Ch 12 | Simulação completa | integration | `les_b2_exam_simulations` |
| Bônus 1 | Banco de conectivos | connector bank | FSRS anchor (writing) |
| Bônus 2 | Checklist de revisão | revision checklist | `les_a2_writing_selfcheck` |

### 2.7 `Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md` (117KB, A2→B2, Reference)
| § | Title | Terms (~250) | Nodes Fed |
|---|-------|--------------|-----------|
| Ch 1 | Bem-vindo ao corporativês | framing + "what does that stand for?" | `les_a2_corpus_intro` |
| Ch 2 | Comunicação do dia a dia | ~25 terms | `les_a2_corpus_intro` (vocab bank) |
| Ch 3 | Cargos e hierarquia | ~30 terms | `les_a2_it_roles_hierarchy` |
| Ch 4 | Reuniões e projetos | ~30 terms | `les_a2_meeting_open`, `les_a2_meeting_participate` |
| Ch 5 | Finanças e negócios | ~30 terms | `les_b1_finance_business` |
| Ch 6 | RH e carreira | ~30 terms | `les_b1_hr_career` |
| Ch 7 | Vendas e marketing | ~30 terms | `les_b1_sales_marketing` |
| Ch 8 | Tecnologia para não-técnicos | ~30 terms | `les_a2_it_nontech_tech` |
| Ch 9 | Jargões do corporativês | ~30 terms | `les_b1_it_acronyms_deep` |
| Ch 10 | Mensagens e chat | ~25 terms | `les_a2_email_basics` (supplement) |
| Ch 11 | Armadilhas das siglas | over-use warnings | Cross-cutting |
| Ch 12 | Simulação: corporativês traduzido | 1 long dialogue | `les_b2_it_jargon_mastery` |
| Bônus 1 | As 40 siglas mais ouvidas | 40 terms | FSRS anchor set (priority) |
| Bônus 2 | Como reagir a sigla desconhecida | strategy | Tutor guidance |
| Índice | A–Z | 250 terms | Full reference lookup |

---

## 3. SKILL EXTRACTION (Canonical Skill IDs)

### 3.1 Grammar Skills (31 items)
| skill_id | Source § | CEFR | Notes |
|----------|----------|------|-------|
| `alphabet_letter_names` | apostila 2.1 | A1 | 26 items |
| `present_simple_be` | apostila 3.2.3, IT A1 | A1 | 8 forms × 3 (aff/neg/int) |
| `present_simple_regular` | apostila 3.2.1, IT A4 | A1 | -s rule |
| `present_simple_do_does` | IT A4, basico 3ª | A2 | question formation |
| `present_continuous` | IT A4 | A2 | be + -ing |
| `personal_pronouns_subject` | apostila 3.1.1 | A1 | 5 forms |
| `personal_pronouns_object` | apostila 3.1.1 | A1 | 5 forms |
| `possessive_pronouns` | apostila 3.1.2 | A1 | adj + pron forms |
| `demonstrative_pronouns` | apostila 3.1.3, IT A3 | A1 | this/that/these/those |
| `demonstrative_this` | apostila 3.1.3 | A1 | introduced vs. specific |
| `interrogative_pronouns` | apostila 3.1.4 | A1 | 8 WH-words |
| `wh_questions_how` | apostila 3.1.4 | A1 | how + adverb |
| `articles_definite` | apostila 4.1, IT A3 | A1 | the |
| `articles_indefinite` | apostila 4.1, IT A3 | A1 | a/an |
| `noun_plurals` | apostila 4.2, IT A6 | A1 | reg + irregular |
| `adjectives_basic` | apostila 4.3, IT A1 | A1 | position, order |
| `past_simple_regular` | apostila 3.2.1, IT A5 | A2 | ED rules |
| `past_simple_irregular` | apostila 3.2.2, IT A5 | A2 | 2+ verbs (expand) |
| `future_will` | IT A5 | A2 | will + base |
| `future_going_to` | IT A5 | A2 | be going to |
| `relative_pronouns` | IT A6 | B1 | who/which/that |
| `there_is_are` | IT A6 | A2 | existence |
| `prefixes_suffixes` | IT A7 | B1 | word formation |
| `prepositions_basic` | IT A7 | A1 | in/on/at |
| `svo_order` | leia-e-escreva Ch3 | A2 | mandatory for EN |
| `explicit_subject` | leia-e-escreva Ch3 | A2 | null-subject error |
| `tense_consistency` | leia-e-escreva Ch3 | A2 | register marker |
| `imperative` | IT A1, frases Ch4 | A2 | instructions |
| `modal_can_need` | frases Ch4 | A2 | workplace modals |
| `hedging` | frases Ch4 | B1 | softeners |
| `email_register` | frases Ch5, leia Ch7 | A2 | formal markers |

### 3.2 Vocabulary Skills (24 items)
| skill_id | Source § | CEFR | Count |
|----------|----------|------|-------|
| `greetings_time` | apostila 2.2.1, basico 1L1, frases Ch2 | A1 | 15 |
| `greetings_formal_informal` | basico 1L1 | A1 | 6 |
| `numbers` | apostila 5.1, basico 1L2 | A1 | 20 |
| `colors` | apostila 5.1, basico 1L2 | A1 | 11 |
| `days_months` | apostila 5.2, basico 1L3 | A1 | 19 |
| `times_dates` | apostila 5.3 | A1 | 20 |
| `food_basic` | apostila 5.4, basico 1L3 | A1 | 30 |
| `occupations` | apostila 5.5 | A1 | 20 |
| `daily_expressions` | apostila 5.6, basico 2L1 | A1 | 40 |
| `roles_tech` | frases Ch2, dicionário Ch3 | A2 | 15 |
| `meeting_vocab` | frases Ch4, dicionário Ch4 | A2 | 30 |
| `email_vocab` | frases Ch5, dicionário Ch10 | A2 | 20 |
| `deadline_vocab` | frases Ch8 | A2 | 20 |
| `feedback_vocab` | frases Ch9 | A2 | 15 |
| `smalltalk_vocab` | frases Ch3 | A2 | 25 |
| `collocation_aula` | viagens | A2 | 6 |
| `travel_core` | viagens Dia2 | A2 | 20 |
| `travel_airport` | viagens | A2 | 25 |
| `travel_hotel` | viagens | A2 | 20 |
| `it_computer_terms` | IT A1-A4, dicionário Ch2 | A2 | 60 |
| `it_internet_terms` | IT A6, dicionário Ch4 | A2 | 40 |
| `it_pronouns_technical` | IT A7 | B1 | 30 |
| `acronyms_corporate` | dicionário (all) | A2→B2 | 250 |
| `connectors_writing` | leia Bônus1 | B1 | 40 |

### 3.3 Pronunciation Skills (18 items)
| skill_id | Source § | CEFR | Target |
|----------|----------|------|--------|
| `th_unvoiced` | frases Ch1, IT, basico | A1 | [θ] think/sink |
| `th_voiced` | frases Ch1, IT, basico | A1 | [ð] the/this |
| `h_aspirated` | frases Ch1, IT, basico | A1 | [h] have/how |
| `r_initial` | frases Ch1, IT | A1 | [ɹ] room/ready |
| `s_consonant_cluster` | frases Ch1, IT | A1 | start/station |
| `word_stress` | viagens Day1, leia | A2 | sílaba tônica |
| `stress_timing` | viagens Day1 | A2 | stress-timed vs syll-timed |
| `sentence_stress` | frases Ch4 | A2 | meeting speech |
| `intonation_patterns` | frases Ch4 | B1 | agree/disagree |
| `connected_speech` | frases Ch3, basico | A2 | linking/reduction |
| `vowel_ee_ih` | (needs authoring) | A1 | ship/sheep |
| `minimal_pairs_voicing` | (needs authoring) | A1 | voiced/voiceless |
| `syllable_count` | viagens | A2 | -ed endings |
| `v_w_distinction` | (needs authoring) | A2 | very/wary |
| `final_consonant` | (needs authoring) | A1 | -ed, -s |
| `rhythm_accent` | IT A1 | B1 | non-native rhythm |
| `terminology_pron` | dicionário (all brackets) | A2 | corporate terms |
| `fluency_pace` | frases Ch12, IT | B1 | speaking rate |

### 3.4 Reading/Writing/Error Skills (15 items)
| skill_id | Source § | CEFR | Notes |
|----------|----------|------|-------|
| `reading_skimming` | leia Ch2, IT A2 | A2 | 30s overview |
| `reading_scanning` | leia Ch2 | A2 | info hunt |
| `reading_context_inference` | leia Ch2 | A2 | word from context |
| `reading_cognates` | leia Ch2 | A1 | 3000 free words |
| `reading_false_cognates` | leia Ch2, IT A7 | A2 | 11 items |
| `reading_3levels` | leia Ch2 | B1 | literal/inference/tone |
| `writing_bio` | leia Ch4 | A2 | self-intro |
| `writing_informal_message` | leia Ch5 | A2 | chat/notes |
| `writing_past_narrative` | leia Ch6 | A2 | past tense |
| `writing_formal_email` | leia Ch7 | B1 | register |
| `writing_opinion_review` | leia Ch8 | B1 | evaluate |
| `writing_argumentative` | leia Ch9 | B1 | thesis + support |
| `writing_summary` | leia Ch10 | B1 | condense |
| `error_br_writing_15` | leia Ch11 | A2→B2 | 15 common errors |
| `error_br_sentence_10` | frases Ch11 | A2 | 10 common errors |

---

## 4. NODE MAPPING (Section → Lesson)

### 4.1 Coverage Summary
| Metric | Value |
|--------|-------|
| Total source files | 7 |
| Total sections mapped | 87 |
| Lessons registered (canonical registry) | 118 + 5 remediation = 123 |
| Sections mapped to ≥1 node | 81 / 87 (6 are tutor-facing meta) |
| Lessons fed by extracted content | 81 (all A1, A2, IT-track, B1, B2 nodes) |
| Lessons authored (content written) | 122 of 123 (`les_b1_it_presentations` is `blocked_no_adequate_source`) |
| Sections feeding multiple nodes | 8 |
| Coverage rate (files→nodes) | 100% |
| Orphan lesson IDs | 0 |

### 4.2 Node Status
| Status | Count | Notes |
|--------|-------|-------|
| 🟢 Lesson authored | 122 | every registry id but one; see `curriculum-graph-spec.md` §4.3 |
| 🟡 Lesson designed, not authored | 1 | `les_b1_it_presentations` (`blocked_no_adequate_source`) |
| 🔴 Orphan source section | 0 | all mapped or marked meta |

### 4.3 Sections Feeding >1 Node
| Source § | Nodes |
|----------|-------|
| apostila 2.2.1 + basico 1L1 + frases Ch2 | `les_a1_greetings`, `les_a2_greetings_intro` |
| apostila 3.1.3 + IT 3.2 | `les_a1_pronouns_demonstrative`, `les_a2_it_computer_parts` |
| apostila 3.2.3 + basico Special + IT 1.3 | `les_a1_to_be_forms`, `les_a2_it_terms_basics` |
| IT 1.1 (to be="ter" idioms) | `les_a1_to_be_forms` (deep), `les_a2_it_terms_basics` |
| IT 4.2-4.4 (present/continuous) | `les_a1_present_simple`, `les_a2_present_continuous`, `les_a2_it_computer_parts` |
| IT 5.2-5.6 (past/future) | `les_a2_writing_past`, `les_a2_future_will`, `les_a2_it_incidents` |
| leia Ch2 + IT A2 | `les_a2_reading_strategy`, `les_a2_it_reading_strategy` |
| frases Ch11 + leia Ch11 | Cross-cutting error taxonomy (all A2+) |

---

## 5. IRT ITEM BLUEPRINT (Counts by CEFR × Domain)

### 5.1 Total Bank Target (aligned with `stats-progress-evaluation-spec.md` §4.3)

> **Superseded as an MVP commitment by `assessment-item-spec.md` §8.1 (120 items), which also
> removed Listening from the bank** — listening scoring is deferred until ASR phoneme scoring
> exists, and an uncalibrated listening θ is not reportable. The 540 below is the **roadmap label**,
> not the MVP target: `assessment-item-spec.md` §10 (X2, X4) relabelled `stats` §4.3 and
> `diagnostic` §2.2 for the same reason. Kept because a roadmap that has forgotten its own size is
> one that will re-propose the 540 as if it were affordable.

| Domain | A1 | A2 | B1 | B2 | Total |
|--------|----|----|----|----|-------|
| Grammar | 30 | 40 | 35 | 25 | 130 |
| Vocabulary | 40 | 50 | 45 | 35 | 170 |
| Listening | 20 | 25 | 25 | 20 | 90 |
| Reading | 15 | 20 | 25 | 20 | 80 |
| Pronunciation | 25 | 20 | 15 | 10 | 70 |
| **Total** | **130** | **155** | **145** | **110** | **540** |

### 5.2 Item Authoring Priority (from source density)
| Priority | Domain | Rationale |
|----------|--------|-----------|
| **P0** | Grammar (A1-A2) | 31 grammar skills extracted; highest source density |
| **P0** | Vocabulary (A1-A2) | 24 vocab skills; 100+ flashcards from dicionário |
| **P1** | Listening (A1-A2) | Requires TTS asset generation; phrases→audio |
| **P1** | Pronunciation (A1-A2) | 18 pron skills; minimal pairs BR-PT focus |
| **P2** | Reading (A2-B1) | Source texts available in 5 files |
| **P3** | Writing (B1) | Rubric-graded, not MCQ; separate item type |

### 5.3 Grammar Item Blueprint (A1 = 30 items)
| skill_id | Items | IRT b (est.) | Distractor strategy |
|----------|-------|-------------|---------------------|
| `alphabet_letter_names` | 3 | -2.0 to -1.5 | confusable letters (M/N) |
| `present_simple_be` | 6 | -1.8 to -1.0 | is/are/am confusion |
| `personal_pronouns_subject` | 3 | -2.0 to -1.5 | he/she/it, I/We |
| `personal_pronouns_object` | 3 | -1.8 to -1.3 | me/him/her |
| `possessive_pronouns` | 2 | -1.5 to -1.0 | my/mine |
| `demonstrative_pronouns` | 3 | -1.5 to -1.0 | this/that distance |
| `interrogative_pronouns` | 3 | -1.5 to -0.5 | what/which/who |
| `articles_definite_indefinite` | 3 | -1.3 to -0.8 | a/an/the zero-article |
| `noun_plurals` | 2 | -1.2 to -0.8 | irregular plural |
| `adjectives_basic` | 2 | -1.0 to -0.5 | adjective order |

### 5.4 Vocabulary Item Blueprint (A1 = 40 items)
| skill_id | Items | IRT b (est.) | Type |
|----------|-------|-------------|------|
| `greetings_time` | 5 | -1.8 to -1.0 | MCQ + audio |
| `numbers` | 4 | -1.8 to -1.2 | MCQ |
| `colors` | 2 | -1.8 | matching |
| `days_months` | 4 | -1.5 to -1.0 | cloze |
| `times_dates` | 4 | -1.5 to -0.8 | cloze |
| `food_basic` | 3 | -1.2 | matching |
| `occupations` | 3 | -1.2 | MCQ |
| `daily_expressions` | 5 | -1.0 to -0.5 | cloze + audio |
| `reading_cognates` | 4 | -1.0 to -0.5 | MCQ (true cognate/false) |
| `reading_false_cognates` | 6 | -0.8 to 0.0 | MCQ (11 from leia Ch2) |

### 5.5 Pronunciation Item Blueprint (A1 = 25 items)
| skill_id | Items | Type | BR-PT focus |
|----------|-------|------|-------------|
| `th_unvoiced` | 5 | minimal-pair audio discrimination | think/sink, three/free |
| `th_voiced` | 5 | minimal-pair audio discrimination | the/ze, this/dis |
| `h_aspirated` | 5 | minimal-pair audio discrimination | have/ave, how/rou |
| `r_initial` | 4 | minimal-pair audio discrimination | room/hroom |
| `s_consonant_cluster` | 3 | dictation (write what you hear) | start/estart |
| `minimal_pairs_voicing` | 3 | odd-one-out | voiced/voiceless sets |

---

## 6. ASSET REGISTRY (Audio/Image Needs)

### 6.1 TTS Audio Requirements
| Asset Type | Count | Source | Priority |
|------------|-------|--------|----------|
| Pronunciation models (minimal pairs) | 70 items | `frases Ch1`, IT, basico | P0 |
| Listening stems (greetings, dialogues) | 20 | apostila 2.2.2, basico 1L1, frases Ch12 | P0 |
| Listening stems (workplace) | 50 | frases Ch2-10 | P1 |
| Listening stems (IT) | 40 | IT A1-A8 | P2 |
| Listening stems (travel) | 40 | viagens | P3 |
| Vocabulary audio (dicionário) | 250 | dicionário (all) | P1 |
| **Total** | **470** | — | — |

### 6.2 TTS Voice Spec
```yaml
voice: en-US (primary), en-GB (secondary variant, optional)
rate: 0.9x (instructional, not native speed)
pitch: neutral
emphasis_phrases: [stress-timed on target phonemes]
br_pronunciation_guide: true  # optional second audio, slower, "à brasileira"
format: opus 24kbps mono
delivery: CDN, pre-signed, cached
```

### 6.3 Images/Video (Optional Enrichment)
| Type | Count | Source | Notes |
|------|-------|--------|-------|
| Video embeds (YouTube) | ~15 | viagens (TED-Ed, TEDx), IT A1-A8 | Optional; can skip for MVP |
| Diagram images | ~20 | IT A1-A8 (computer parts) | Need alt text in EN + PT |
| Tables (visual) | ~30 | apostila 3-5, IT A3 | Render as markdown |

---

## 7. EXTRACTION QUALITY CHECKLIST

Before any source section becomes a lesson, verify:
- [ ] Section has a clear skill target (grammar point, vocab set, or task)
- [ ] Skill is tagged with CEFR level
- [ ] Skill is tagged with BR-PT interference notes (if applicable)
- [ ] Source material is chunked into 15-min-sized lessons (6 lessons/module)
- [ ] IRT item count matches skill priority
- [ ] Audio assets are generated (TTS or recorded)
- [ ] Distractors are BR-PT-aware (1 L1 transfer, 1 overgeneralization, 1 semantic)
- [ ] Error taxonomy is linked (cross-cutting Ch 11 sections)
- [ ] Source traceability is recorded (file + § → lesson_id)
- [ ] Remediation node exists for each skill (see `curriculum-graph-spec.md` §10)

---

## 8. PRIORITY ORDER FOR LESSON AUTHORING

### 8.1 P0 — Must author first (unblocks diagnostic + first module)
| Order | Lesson ID | Source | Why P0 |
|-------|-----------|--------|--------|
| 1 | `les_a2_greetings_intro` | frases Ch2 + apostila 2.2 | 🟢 DONE |
| 2 | `les_a1_alphabet_sounds` | apostila 2.1 | First A1 lesson; foundation |
| 3 | `les_a1_greetings` | apostila 2.2.1 + basico 1L1 | A1 entry point (for true beginners) |
| 4 | `les_a1_to_be_forms` | apostila 3.2.3 | Core grammar; used by A2 lessons |
| 5 | `les_a2_it_terms_basics` | IT A1 + dicionário Ch2 | IT track entry (dev profile) |

### 8.2 P1 — Complete A2 Workplace module (6 lessons)
| Order | Lesson ID | Source |
|-------|-----------|--------|
| 6 | `les_a2_small_talk` | frases Ch3 |
| 7 | `les_a2_introducing_others` | frases Ch2 + apostila 2.2 |
| 8 | `les_a2_meeting_open` | frases Ch4 |
| 9 | `les_a2_meeting_participate` | frases Ch4 |
| 10 | `les_a2_email_basics` | frases Ch5 + dicionário Ch10 |

### 8.3 P2 — A1 Grammar + Vocab (parallel track for true beginners)
| Order | Lesson ID | Module | Source |
|-------|-----------|--------|--------|
| 11 | `les_a1_pronouns_subject_object` | `mod_a1_grammar_start` | apostila 3.1.1 |
| 12 | `les_a1_pronouns_possessive` | `mod_a1_grammar_start` | apostila 3.1.2 |
| 13 | `les_a1_pronouns_demonstrative` | `mod_a1_grammar_start` | apostila 3.1.3 |
| 14 | `les_a1_wh_questions` | `mod_a1_grammar_start` | apostila 3.1.4 |
| 15 | `les_a1_articles_nouns` | `mod_a1_grammar_start` | apostila 4.1-4.3 |
| 16 | `les_a1_regular_verbs_past` | `mod_a1_vocab_core` | apostila 3.2.1 |
| 17 | `les_a1_numbers_colors` | `mod_a1_vocab_core` | apostila 5.1 + basico 1L2 |
| 18 | `les_a1_days_months` | `mod_a1_vocab_core` | apostila 5.2 |
| 19 | `les_a1_time_dates` | `mod_a1_vocab_core` | apostila 5.3 |
| 20 | `les_a1_food` | `mod_a1_vocab_core` | apostila 5.4 |
| 21 | `les_a1_occupations` | `mod_a1_vocab_core` | apostila 5.5 |
| 22 | `les_a1_daily_basics` | `mod_a1_foundation` | apostila 5.6 + basico 2L1 |
| 23 | `les_a1_present_simple` | `mod_a1_comm_basic` | basico 2L2 |
| 24 | `les_a1_present_simple_questions` | `mod_a1_comm_basic` | basico 3ª |
| 25 | `les_a1_have_has` | `mod_a1_comm_basic` | IT A3 |
| 26 | `les_a1_there_is_are` | `mod_a1_comm_basic` | IT A6 |
| 27 | `les_a1_reading_skimming` | `mod_a1_comm_basic` | leia Ch2 + IT A2 |
| 28 | `les_a1_false_cognates` | `mod_a1_comm_basic` | leia Ch2 + IT A7 |

### 8.4 P3 — A2 IT Track (dev profile path)
| Order | Lesson ID | Module | Source |
|-------|-----------|--------|--------|
| 29 | `les_a2_it_roles_hierarchy` | `mod_a2_it_fundamentals` | dicionário Ch3 |
| 30 | `les_a2_it_reading_strategy` | `mod_a2_it_fundamentals` | IT A2 |
| 31 | `les_a2_it_computer_parts` | `mod_a2_it_fundamentals` | IT A4 |
| 32 | `les_a2_it_system_unit` | `mod_a2_it_fundamentals` | IT A5 |
| 33 | `les_a2_it_internet_history` | `mod_a2_it_fundamentals` | IT A6 |
| 34 | `les_a2_it_email_technical` | `mod_a2_it_communication` | IT A8 + dicionário Ch10 |
| 35 | `les_a2_it_meeting_standup` | `mod_a2_it_communication` | IT A1 + frases Ch4 |
| 36 | `les_a2_it_incidents` | `mod_a2_it_communication` | IT A5 + dicionário Ch4 |
| 37 | `les_a2_it_nontech_tech` | `mod_a2_it_communication` | dicionário Ch8 |
| 38 | `les_a2_it_word_formation` | `mod_a2_it_communication` | IT §7.2-7.3 |
| 39 | `les_a2_it_pr_tickets` | `mod_a2_it_communication` | dicionário Ch8-9 |

### 8.5 Sourcing Gaps Found During Source Verification

Direct verification of all 7 markdowns against the section inventory surfaced these. Each is a real constraint on authoring, not a hypothetical.

| Gap | Affected lessons | Evidence | Severity | Resolution path |
|-----|------------------|----------|----------|-----------------|
| **G1 — No IT discourse source (EXPANDED 4 → 12)** | `les_a2_it_terms_basics`, `les_a2_it_meeting_standup`, `les_a2_it_incidents`, `les_b1_it_architecture_vocab`, `les_b1_it_debugging`, `les_b1_it_code_review`, `les_b1_it_presentations`, `les_b1_it_write_docs`, `les_b2_it_mentoring`, `les_b2_it_architecture_decisions`, `les_b2_it_incident_postmortem`, `les_b2_it_rfc_writing`, `les_b1_project_case_study` | IT book is an 8-lesson basic course (grammar + hardware). Across **all 7 sources**: `architecture` 0 hits, `code review` 0, `incident` 0, `RFC` 0, `stand-up` 0, `mentoring` 0. 29 of 33 bare `IT A<n>` citations verified correct; the 12 failures are where a citation was stretched to cover discourse the book lacks. | ✅ Resolved | **RESOLVED — see `curriculum-graph-spec.md` §4.4.** All 12 marked `deferred_no_source` with `Source = — none —` (false citations removed), 3 entry nodes repointed to sourced lessons. **The IT track terminates at A2.** Re-entry: verified source locator, or explicit `authored` + `reviewed_by`. |
| **G2 — No listening corpus anywhere** | All `listening_*` skills (1 of 5 tracked domains) | No source contains recorded speech, audio, or timed dialogue. All 8 IT "aulas" are prose. | 🔴 Critical | See §8.5.1. |
| **G3 — No IPA phonemic data** | All `pron_*` skills | Sources give BR-style spelling guides in brackets (`[kógneits]`, `[êissép]`), explicitly disclaimed by leia (line ~38) as "aproximações… não transcrições fonéticas". | 🟠 Medium | Adequate for **item keying** and TTS fallback prompts, **not** for automatic prosody scoring. |
| **G4 — apostila grammar rules verified correct** | — | apostila 3.2.1, lines 725–744. `VOGAL+Y → +ed` and `CONSOANTE+Y → -Y+ied` are both accurate. | ✅ Resolved | Flag withdrawn. |
| **G5 — basico is 3 modules, not "1ª/2ª/3ª Parte"** | 8 A1 lessons citing basico | `Ingles-basico.md` has MÓDULO 1 (line 494), 2 (1020), 3 (1582), plus "LIST OF IRREGULAR VERBS" (5219). §2.2 citations are approximations. | 🟡 Low | Re-cite to `basico M1/M2/M3` + line numbers at authoring time. |
| **G6 — viagens is 5 days, not "Dia 3+"** | 6 travel lessons | `Ingles para Viagens.md`: DIA 1 (49), DIA 2 (434), DIA 3 (821), DIA 4 (1263), DIA 5 (1861). | 🟡 Low | Re-cite per-day at authoring time. |
| **G7 — frases "Extra" kit duplicates body** | FSRS anchor set | "INDO ALÉM" (1748) + "EXTRAS" (1988) restate Ch 2–10. | 🟡 Low | Treat the 100-phrase kit as a **frequency index**, not new content. Phrases in both body and kit = higher item priority. |

> **G2 is the decision that matters most.** Two of five tracked skills (Listening, Pronunciation) have **little or no calibratable source material**.

### 8.5.1 Listening Sourcing — Options for Decision

| Option | What it means | Cost | Risk |
|--------|---------------|------|------|
| **A. Author dialogue corpus** | Write ~40 short dialogues (workplace + IT + travel), 2 speaker turns each; generate TTS; build listening items. | ~120 TTS clips (within the P0 audio tier, Decision #1) | Authored dialogue is less natural than real speech; a written-transcript item can be solved by reading the text if the transcript is visible |
| **B. Defer Listening in MVP** | Ship A1–A2 with 3 tracked domains (Grammar, Vocabulary, Reading). Label Listening "em breve". | Zero | Honest, but narrows the stated goal. Must be **disclosed in the product**, not hidden. |
| **C. Use learner speech as input** | Reuse the learner's own recorded output (already required by Speaking) as shadowing material. | Zero marginal | Only available post-A1; cannot bootstrap the initial diagnostic. |

> **Recommendation: B for MVP, A as P1.** The diagnostic CAT must not include uncalibrated Listening items — an item with no `a`/`b` parameters cannot contribute to the θ estimate (`stats-progress-evaluation-spec.md` §3). Shipping option A inside the MVP means shipping a placement test that reports a number it cannot defend.

---

## 9. CROSS-CUTTING ASSETS (Apply to All Lessons)

### 9.1 Error Taxonomy (from frases Ch11 + leia Ch11)
| Error | Type | Source | Affected nodes |
|-------|------|--------|----------------|
| "Nice to meet you" → repeat encounter | pragmatics | frases Ch11 | all A2 workplace |
| "I'm the responsible" → "I'm in charge of" | false_friend | frases Ch11 | all workplace |
| "Let me present" → "introduce" | verb_lemmatize | frases Ch11 | `les_a2_greetings_intro` |
| "He works in my job" → "We work together" | collocation | frases Ch11 | small_talk |
| actually = "atualmente" | false_cognate | leia Ch2 | all A2+ |
| eventually = "eventualmente" | false_cognate | leia Ch2 | all A2+ |
| pretend = "pretender" | false_cognate | leia Ch2 | all A2+ |
| "Is raining" (null subject) | syntax_error | leia Ch3 | all writing |
| SVO order violations | syntax_error | leia Ch3 | all writing |
| think = "tink" | phoneme | IT, basico, frases | all pronunciation |
| the = "de/ze" | phoneme | IT, basico, frases | all pronunciation |
| have = "ave" | phoneme | IT, basico, frases | all pronunciation |
| start = "estart" | phoneme | IT, basico, frases | all pronunciation |

### 9.2 Collocations (from viagens + IT)
| PT | EN (wrong) | EN (correct) | CEFR |
|----|------------|--------------|------|
| assistir aula | attend a class | attend a class ✅ | A2 |
| faltar aula | fail a class | miss a class ✅ | A2 |
| matar aula | kill a class | skip a class ✅ | A2 |
| estar com frio | be with cold | be cold ✅ | A2 |
| estar de férias | be on vacation | be on vacation ✅ | A2 |
| estar de folga | be of grace | have my day off ✅ | A2 |

---

## 10. VALIDATION GATES (Automated)

| Gate | Check | Failure action |
|------|-------|----------------|
| **Source coverage** | All 87 sections mapped or marked meta | Report unmapped |
| **Node existence** | Every `les_`/`mod_` ID exists in curriculum-graph-spec.md | Create node or fix typo |
| **Skill ID consistency** | Every skill_id appears in one canonical list (§3) | Reject duplicates |
| **CEFR monotonicity** | Skill CEFR ≤ lesson CEFR | Flag or bump node |
| **BR-PT tag coverage** | Every grammar/vocab skill has ≥1 BR-PT note | Request tag |
| **Item count feasibility** | Skill items ÷ 3 = minimum IRT items needed | Flag under-sourced skill |
| **Audio availability** | Every listening/pronunciation item has TTS URL | Queue generation |
| **Remediation coverage** | Every skill has a remediation node | Create `les_rem_*` |

---

## 11. RESOLVED DECISIONS (Content Team)

These were open questions during extraction. Each now has a **decided default** so item and lesson authoring is not blocked. Revisit only with evidence that the default fails.

| # | Question | Decision | Rationale / Consequence |
|---|----------|----------|--------------------------|
| 1 | 470 TTS assets costly vs. text-only MVP? | **Hybrid tier.** P0 audio only (≈120 clips) for MVP; listening/pronunciation skills cannot run text-only. Defer remaining to P1/P2. | Listening + Pronunciation are 2 of 5 tracked skills. A text-only MVP would leave them unmeasurable. Tiered generation keeps cost bounded. |
| 2 | YouTube embeds? | **Strip all embeds from lesson flow.** Store URL as optional `enrichment_ref` in asset registry only. | External video = availability/licensing risk + no IRT parameters + breaks the 15-min lesson budget. |
| 3 | TTS voice: en-US only or dual? | **Dual voice for tracked audio.** `en-US` at 1.0x as the canonical form; `en-US` at 0.75x as `assist` audio, available on demand (never auto-played). | Directly attacks stress-timing and connected-speech gaps (§11.7 row 4). Auto-play at 0.75x would violate comprehensible-input speed (Krashen i+1). |
| 4 | IT diagrams as images or markdown? | **Markdown-first, no raster images in MVP.** Each figure becomes a text table or ASCII schematic with a full alt-text equivalent. | Images need alt-text authoring anyway; a table is accessible *and* translatable into IRT items. No binary assets in a text repo. |
| 5 | False cognates: expand 11 → 30? | **Yes. Build a 30-item false-cognate set** as a dedicated FSRS anchor deck. | High-yield: these are L1-interference items with a *predictable* error signature, so IRT items are easy to write and reliably diagnostic. |
| 6 | Which 40 acronyms are P0? | **P0 = 40-item deck (see §11.1).** | Dicionário has ~250; 40 covers >90% of workplace+tech frequency. |
| 7 | Apostila grammar rules questionable? | **✅ VERIFIED CORRECT — flag withdrawn.** | Checked directly at `apostila...md:725-744`. "VOGAL + Y → +ed" (`play → played`) and "CONSOANTE + Y → -Y + ied" (`dry → dried`, `study → studied`) are both accurate. The two rules are complementary, not contradictory. No correction needed; author items directly from the source. |

### 11.0 Three decisions, taken on technical grounds (2026-09-30)

Each was decided by consulting the implementation that would have to carry it, not by preference.
Sources: `open-spaced-repetition/py-fsrs`, `cahlr/pyBKT`, and the 7 source files themselves.

---

#### DECISION A — Listening stays deferred

**The reason is not "no source material."** That is a content cost and could be paid by authoring
dialogues. The reason is a validity threat in the measurement pipeline:

1. **TTS audio is an uncontrolled nuisance variable.** A listening item's difficulty is entangled with
   voice, rate, and prosody. A learner who fails may have misperceived the synthetic voice rather than
   the language. Nothing in the current pipeline can separate those two explanations, so the item's `b`
   would be a property of *our TTS settings* as much as of the learner.
2. **This corrupts DIF specifically.** `assessment-item-spec.md` §5.4 measures BR-PT vs. other-L1
   difficulty differences. With synthetic audio, a flagged item is uninterpretable — voice familiarity
   and L1 proficiency are confounded, and no threshold can separate them.
3. **A sub-daily hazard compounds it.** `py-fsrs` truncates elapsed time to whole days
   (`stats-progress-evaluation-spec.md` §6.2b), so any review under 24h registers `R = 1.000`.
   Audio review is short and naturally scheduled sub-daily — precisely the regime the scheduler cannot
   see. The learning layer must first be fixed to day granularity.
4. **Per-domain θ needs n ≥ 5 items** (`diagnostic-spec.md` §3.3a). A thin listening slice produces a
   number that looks like a competence score and is not identified.

**Revisit when:** real human recordings exist for at least 5 items per level, **and** L2 operates at
day granularity. Until then the results screen states *"Listening not yet assessed"* — a placement that
silently omits a competence it claims to measure is a false promise.

---

#### DECISION B — the IT track terminates at A2; 13 lessons deferred

See `curriculum-graph-spec.md` §4.4 for the full audit. Summary:

| Level | Module | Sourced | Deferred |
|-------|--------|--------:|---------:|
| A2 | `mod_a2_it_fundamentals` | 5 | 1 |
| A2→B1 | `mod_a2_it_communication` | 4 | 2 |
| B1 | `mod_b1_it_technical` | 1 | 5 |
| B2 | `mod_b2_it_senior` | 2 | 4 |
| B1 | `mod_b1_fluency_project` | 5 | 1 |
| — | 13 general modules | **78** | 0 |

Across **all 7 sources**: `architecture` **0**, `code review` **0**, `incident` **0**, `RFC` **0**,
`stand-up` **0**, `mentoring` **0**. The corpus is a grammar-and-hardware book plus a corporate
vocabulary dictionary. It supports *language about computers* at A2; it does not support professional
IT discourse at B1/B2.

**Consequence, stated plainly:** a B1/B2 learner on the IT track receives **corporate general
English**, not IT discourse. The product must disclose this at track selection. Serving corporate
English under an "IT" label is the failure mode; the alternative — presenting a vocabulary-and-hardware
book as a B1 IT syllabus — is worse.

---

#### DECISION C — Tier B false cognates stay outside the CAT

Expert review was originally the proposed gate. That is the wrong gate, and the reason is statistical.

An authored item's difficulty `b` is a claim about a **population**, and for a false cognate `b` is
essentially *how entrenched the cognate is in the learner's L1* — which varies enormously between a
learner who has read the deck and one who has not. Three raters can agree on a `b` and all three be
wrong, because the quantity being estimated is a population distribution, not a property of the
sentence. **Expert consensus cannot identify a population parameter.** Only responses can.

This is the same reason `assessment-item-spec.md` §3.2 separates Stage-1 anchoring from calibration:
Stage 1 licenses *use with inflated SE*; it does not license admission to a test that reports a
placement number. Since DIF (Decision A, point 2) is exactly the instrument that would detect excessive
entrenchment, and DIF needs enough n to be significant, the honest state is: **out of the CAT, in
practice packs, re-evaluated when Tier A has data.**

| Tier | Count | Provenance | CAT-eligible | Review gate |
|------|------:|------------|--------------|-------------|
| A | 16 | `source_derived` | **yes** | 3-rater anchor (§5.1 Q5) |
| B | 14 | `authored` | **no** | n ≥ 200 responses — not expert review |

Tier A is not merely permitted — it is the **highest-discrimination cluster in the bank**: 16 items
sharing one skill, where learners either know these or reliably fall for the cognate. That large,
consistent discrimination is ideal for MFI placement early in the CAT.

---

### 11.1 Corporate-Term Deck — 40 items — **RESEARCH SCAFFOLD, NOT A TEACHING SOURCE**

> ⚠️ **Rewritten 2026-09-30. The previous version of this section was the most serious licensing
> defect in the repository, and it was found by `verify-integrity.py` [11], not by reading.**
>
> It was headed *"Source-derived, zero authoring"* and then (a) reproduced a **restricted** book's
> 40-row list, (b) transcribed the book's own invented phonetic notation `[êissép]` into a
> *Pron. guide* column, and (c) quoted **8 sentences verbatim** from the same restricted book under
> a heading calling the section `P0` and `FSRS-anchored`. `Dicionario-de-Siglas...md` carries the
> BaixeLivros notice verbatim: *"Caso deseje compartilhar-lo fora deste ambiente, é necessário
> obter a devida permissão."* Meanwhile `external-sources.md` §0.5.1 — 700 lines away — argued
> that exactly this list-shaped reproduction is *laundering*. And line 746 of that same file
> planned to use this deck as the vocabulary source for a lesson whose licence claim is CC-BY.
>
> **Reuse basis of the table below: `cite_only` for the facts, and the facts are all that is
> kept.** An acronym and what it stands for are facts; a ≤4-word gloss is not copyrightable
> expression; the *set* of the forty most frequent is a thin compilation with citation. That is
> the whole of what survives, and it is enough to build a frequency-weighted deck from.

| What was removed | Why |
|------------------|-----|
| the *Pron. guide* column (`êissép`, `kêi-pí-ái`, `uân-on-uân`, `tâtch bêis`) | a **respelling** of the source's own phonetic notation — the identical thing `verify-integrity.py` [8] forbids in a `cite_only` lesson, which made a spec weaker than a lesson it governs. Also redundant: Decision #3 generates the audio by TTS, so a hand-typed respelling is a worse version of something the pipeline already produces |
| the 8-sentence *"salvadora" question* blockquote | verbatim prose from a restricted source. Replaced below by an **authored** set for the same skill |
| `P0` / `FSRS-anchored` / `ready for item authoring` | these were **claims**, and they were false: nothing derived from this table may be published. See `external-sources.md` §0.5.1 — the 40 acronyms are *superseded for teaching* by **S16** + **S01** (both CC-BY-4.0) |

**What the table is for.** Frequency prioritisation and coverage checking during authoring — *is
KPI in the deck, is there a term for each CEFR band, which terms collide*. **What it is not for:** a
vocabulary source for a lesson. `les_a2_it_terms_basics` and `les_b1_it_acronyms_deep` take their
terms from S16 and S01, and the BR-PT glosses from the authored contrastive analysis in §11.2.

**Provenance of the term set.** `Dicionario-de-Siglas...md` Bônus 1 (lines 2050–2113), *as
scoping* — a curation of which acronyms are common in professional English is a claim about the
world, and it is the kind of claim `cite_only` is designed to let a source inform without being
copied. **Nothing beyond the term/expansion/gloss facts is reproduced.**

| # | Term | Gloss (PT) | Type |
|---|------|-----------|------|
| 1 | ASAP | com urgência | ACR |
| 2 | FYI | só para você saber | ACR |
| 3 | EOD | até o fim do dia | ACR |
| 4 | KPI | o número que mede sucesso | ACR |
| 5 | CEO | o principal executivo | ACR |
| 6 | CFO | o diretor do dinheiro | ACR |
| 7 | CTO | o diretor da tecnologia | ACR |
| 8 | HR | Recursos Humanos | ACR |
| 9 | PM | gerente de projeto/produto *ou* a hora da tarde | ACR |
| 10 | ROI | o retorno do investimento | ACR |
| 11 | MVP | a menor versão que já funciona | ACR |
| 12 | POC | prova de conceito | ACR |
| 13 | OKR | objetivos e resultados-chave | ACR |
| 14 | Stakeholder | parte interessada | **JARG** |
| 15 | Deadline | prazo final | **JARG** |
| 16 | 1:1 | reunião individual com o chefe | ACR |
| 17 | TBD | a definir | ACR |
| 18 | OOO | ausente / de folga | ACR |
| 19 | ETA | previsão de entrega/chegada | ACR |
| 20 | P&L | o resultado financeiro | ACR |
| 21 | YoY | comparado ao ano passado | ACR |
| 22 | Q1–Q4 | os trimestres do ano | ACR |
| 23 | B2B / B2C | empresa→empresa / para consumidor | ACR |
| 24 | CRM | o sistema que guarda tudo sobre os clientes | ACR |
| 25 | Lead | um interessado, um possível cliente | **JARG** |
| 26 | Churn | clientes que abandonam | **JARG** |
| 27 | SEO | aparecer bem no Google de graça | ACR |
| 28 | CTA | a chamada para ação ("Compre agora") | ACR |
| 29 | PTO | folga remunerada | ACR |
| 30 | WFH | trabalho de casa / home office | ACR |
| 31 | API | a ponte entre dois sistemas | ACR |
| 32 | SaaS | software por assinatura | ACR |
| 33 | Bug | erro no sistema | **JARG** |
| 34 | Deploy | publicar uma nova versão | **JARG** |
| 35 | VPN | a rede segura para acessar a empresa | ACR |
| 36 | Bandwidth | "fôlego" / tempo disponível | **JARG** |
| 37 | Touch base | "vamos nos falar rapidinho" | **PHRS** |
| 38 | Circle back | "voltamos a isso depois" | **PHRS** |
| 39 | LMK | me avise | ACR |
| 40 | EOM / EOW | fim do mês / da semana | ACR |

**Composition:** 32 acronyms (`ACR`) + 6 jargon (`JARG`) + 2 phrases (`PHRS`). The `type` field is a real authoring distinction, not cosmetic:
- `ACR` items are tested as **form recognition** (see the item → recall the expansion) and are *pseudowords-proof* — the distractor set is other real acronyms.
- `JARG`/`PHRS` items are tested as **meaning-in-context** and need a sentence frame; they are *not* valid as bare-definition items because the Portuguese gloss is a free translation, not a definition.

**High-value contrasts** — all four are **authored** contrastive analysis, not reproductions. The
source's Bônus 2 was *consulted* to find which ambiguities a Brazilian learner will actually meet:
- `PM` = Project Manager **or** the afternoon. This is the highest-value item in the deck: the
  ambiguity is real in English and the learner's confusion is predictable from PT, where *PM* has
  no afternoon reading at all.
- `POC` = Proof of Concept, but `PoC` also occurs as Point of Contact → disambiguation item.
- `Lead` (noun, a prospect) vs `leader` (a person who leads) → morphological contrast, belongs to `vocab_derived_*` not this deck.
- `Deploy` (verb) vs `deployment` (noun) → belongs to word-formation items (`les_a2_it_word_formation`).

**Companion phrase — the "salvadora" question** (Bônus 2, lines 2137–2185). This is authored as a *receptive* listening/reading item in `les_a2_corpus_intro`, because the source's own claim is that comprehension, not production, is the real barrier:

**Authored set — "asking what an acronym means", receptive skill.** Written for this repository
after the verbatim set was removed; the *skill* is preserved and the *wording* is ours. Delivered in
`les_a2_corpus_intro` as a **receptive** listening/reading item, because the claim it rests on is
that comprehension, not production, is the barrier:

> *Quick one — what does EOD stand for here?* · *Sorry, is PM in this doc the product manager or
> the afternoon?* · *Could you say that acronym again, slowly?* · *Not sure I know RSVP — what is
> it?* · *Just so I'm following: SOW means statement of work, right?* · *I've not seen KPI before —
> what does it measure?* · *Do we use MVP here for the product or for the pitch?* · *What's the
> difference between a POC and a PoC?*

Note what the authored version does that a list cannot: the PT learner's actual disambiguation need
(`PM` = manager **or** afternoon; `POC` vs `PoC`) is a **BR-PT-specific contrast**, and it comes from
`content-map.md` §11.2, not from the source.

> **Authoring note (register):** asking should be framed as *professionalism, not weakness*. This is
> an **affective-filter intervention** and must be delivered as a confidence builder in the lesson,
> not as a vocabulary drill. See `AGENTS.md` §Krashen Affective Filter.

### 11.2 False-Cognate Deck

**Reuse basis: `cite_only`.** The two sources are restricted (`leia` carries the BaixeLivros notice;
`Ingles-Tecnico-Para-Informatica.md` is © CETAM with no licence grant), and this deck is where
`cite_only` is *legitimately* sufficient — unlike §11.1, which was a list. The reason is visible in
the columns: the sources hold a **two-column list of word pairs**, and every row here is a
**five-column contrastive analysis**. Three of the five columns — *PT trap*, *EN actually means*,
*Correct EN for the PT intent* — do not exist anywhere in either source and cannot be derived from
them without the analysis. `cite_only` permits informing, and informing is what happened.

The deck is built in two tiers with **provenance recorded per item**, so no authored item is ever presented as source-derived.

**Tier A — 16 rows, sourced as *pointers*, authored as *analysis***

Scoping: `leia-e-escreva-melhor-em-ingles.md` Ch2 and `Ingles-Tecnico-Para-Informatica.md` §7.4
identify which pairs a Brazilian learner actually meets. ⚠️ The earlier header here said
*"Source-Derived … Zero interpretation required"*, and that was wrong twice over: it was not derived,
and it required exactly the interpretation that is the deck's only original content. Corrected
2026-09-30; the rows themselves are unchanged and were always defensible.

| # | EN word | PT trap (what the BR learner assumes) | EN actually means | Correct EN for the PT intent | Src |
|---|---------|--------------------------------------|--------------------|------------------------------|-----|
| A1 | actually | atualmente | na verdade / realmente | **currently** (or *nowadays*) | leia Ch2 + IT 7.4 (pointer) |
| A2 | eventually | eventualmente | no fim das contas / finalmente | **eventually**, but *eventually* ≠ "eventualmente" as certainty; BR-PT learners over-use it for "talvez" | leia Ch2 |
| A3 | pretend | pretender | fingir | **intend / plan to** | leia Ch2 |
| A4 | push | puxar | empurrar | **pull** (if "puxar") | leia Ch2 |
| A5 | library | livraria | biblioteca | **bookshop / bookstore** | leia Ch2 |
| A6 | parents | parentes | pais | **relatives** | leia Ch2 |
| A7 | novel | novela | romance (livro) | **TV series / soap opera** | leia Ch2 |
| A8 | lecture | leitura | palestra | **reading** (for "leitura") | leia Ch2 |
| A9 | journal | jornal | revista científica / diário | **newspaper** | leia Ch2 |
| A10 | resume | resumir | retomar (o cargo) | **résumé / CV** | leia Ch2 |
| A11 | available | avaliado | disponível | **appraised** (for "avaliado") | IT 7.4 |
| A12 | arrest | arrastar | prender | **drag** | IT 7.4 |
| A13 | college | colégio | faculdade | **high school** | IT 7.4 |
| A14 | data | data (calendário) | dados, informações (sing. = *datum*) | **date** (for the calendar) | IT 7.4 |
| A15 | estate | estado | patrimônio, bens | **state** | IT 7.4 |
| A16 | exit | êxito | saída | **success** | IT 7.4 |

**Tier B — Authored Extension: 14 authored → 6 usable after review (see `tier-b-review.md`)**

Not present in any source. Authored, then put through a four-criteria adversarial pass
(C1 trap producible / C2 keyed / C3 gloss accurate / C4 actually a false cognate). **8 of 14 were void.**

| # | EN word | PT trap | EN means | Correct EN for PT intent | CEFR | Verdict |
|---|---------|---------|----------|--------------------------|------|---------|
| B1 | sensible | sensível | sensato, razoável | **sensitive** | B1 | **KEEP** |
| B3 | assist | assistir (aula) | ajudar | **watch / attend** | A2 | **KEEP** |
| B7 | solicitor | solicitante | advogado (UK) / canvasser | **applicant** | B1 | **KEEP** |
| B11 | offender | ofendido | infrator | **victim** | B1 | **KEEP** |
| B13 | discipline | disciplina (autocontrole) | área de estudo / punição | **self-control** | B1 | **KEEP** |
| B2 | secure | seguro (apólice, substantivo) | protegido, garantido | **insurance** | B1 | **RECLASSIFY** → false-friend deck, not a cognate |

**Void (deleted, not warned):** B4 `confer` (bound root, not a lexical form) · B5 `patio`
(true cognate *and* the gloss "terraço" is wrong — that is a rooftop) · B6 `census`
(**true cognate**; the item's own gloss "recenseamento" is a synonym of *censo*) · B8 `mix`
(true cognate at root; polysemy only) · B9 `serial` (**unkeyable** — `serial` is also valid English,
so no key exists) · B10 `switch` (the declared trap "chave = hinge" is not producible in PT) ·
B12 `eventual` (duplicates Tier A A2; EN-internal ambiguity, not L1 transfer) ·
B14 `performance` (true cognate in the primary sense; the required fix "current performance" is not
imposed by the Portuguese).

> **Deck total after review: 16 Tier A + 5 Tier B + 1 false friend = 22.** The pre-review figure of 30
> overstated coverage by 8 items. C2 (keyable) and C4 (actually a false cognate) caught 7 of the 8
> failures, and both are answerable by a careful reader with a dictionary — so the correct process is
> to run this pass **before** items enter a deck, not after.
>
> **This does not admit the survivors to the diagnostic CAT.** See `tier-b-review.md` §5 and §11.0
> Decision C: the pass establishes that the sentences are well-formed, which is a claim about the
> sentences. CAT admission requires n ≥ 200 responses, because `b` is a population quantity that
> linguistic judgement cannot identify. The 6 are cleared for practice packs and Shadow CAT.

**Discrepancy resolved:** the two sources disagree on the fix for *actually*: leia Ch2 says **currently**, IT §7.4 says **nowadays**. Both are correct English. Item-authoring rule: **accept both as correct**, but key `currently` as the target form (higher corpus frequency), and never mark *nowadays* wrong.

**Deck totals (corrected):** 16 Tier A + 5 Tier B + 1 false friend = **22**. Diagnostic CAT draws from Tier A only (16). Tier B was reviewed on 2026-09-30 (`tier-b-review.md`): 8 of 14 authored items were void. The 6 survivors remain `authored` and CAT-ineligible pending response data — review cleared them linguistically, not psychometrically.

---

*This content map completes the bridge between source material and curriculum. Next spec: `assessment-item-spec.md` (full IRT item schema, distractor bank, calibration protocol).*