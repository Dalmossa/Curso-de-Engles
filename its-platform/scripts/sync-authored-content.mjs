#!/usr/bin/env node
/**
 * Sync idempotente das lições/packs `authored_material` (Lotes 1–15, 123 lições)
 * no PostgreSQL bare-metal. NÃO usa Docker/Helm, NÃO apaga dados de usuários/sessões,
 * NÃO lê `Ingles/` nem `archive/`.
 *
 * Privilégio: o usuário de conexão precisa ser owner das tabelas `lessons` e `packs`
 * para executar o `ALTER TABLE ... DROP CONSTRAINT / ADD CONSTRAINT` do widening
 * idempotente dos CHECK constraints.
 * SSL: `rejectUnauthorized: false` é adequado apenas para `localhost` em bare-metal.
 * Em rede não confiável, configure CA e `rejectUnauthorized: true`.
 *
 * Uso (a partir de `its-platform/`):
 *   node scripts/sync-authored-content.mjs
 *   npm run content:sync
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

import { parseLesson } from '../dist/infrastructure/content/lesson-parser.js';
import { parsePack } from '../dist/infrastructure/content/pack-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const itsPlatformDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(itsPlatformDir, '..');

const require = createRequire(path.join(itsPlatformDir, 'package.json'));
const pg = require('pg');
const { Client } = pg;

const LESSON_IDS = [
  'les_b1_it_presentations',
  'les_b1_it_architecture_vocab',
  'les_b1_it_code_review',
  'les_b2_it_mentoring',
  'les_b2_it_rfc_writing',
  'les_a1_greetings',
  'les_a1_intro_dialogue',
  'les_a1_daily_basics',
  'les_a1_pronunciation_intro',
  'les_a2_it_meeting_standup',
  'les_a1_alphabet_sounds',
  'les_a1_en_us_en_gb',
  'les_a1_to_be_forms',
  'les_a1_pronouns_subject_object',
  'les_a1_pronouns_possessive',
  'les_a1_pronouns_demonstrative',
  'les_a1_wh_questions',
  'les_a1_numbers_colors',
  'les_a1_days_months',
  'les_a1_time_dates',
  'les_a1_food',
  'les_a1_occupations',
  'les_a1_regular_verbs_past',
  'les_a1_present_simple',
  'les_a1_present_simple_questions',
  'les_a1_have_has',
  'les_a1_there_is_are',
  'les_a1_reading_skimming',
  'les_a1_false_cognates',
  'les_a2_phone_calls',
  'les_a1_articles_nouns',
  'les_a2_ask_for_help',
  'les_a2_deadlines_tasks',
  'les_a2_feedback_praise',
  'les_a2_corporate_wrapup',
  'les_a2_corpus_intro',
  'les_a2_past_narrative',
  'les_a2_future_will',
  'les_a2_present_continuous',
  'les_a2_modals_can_need',
  'les_a2_imperatives',
  'les_a2_prepositions_basic',
  'les_a2_travel_vocab_core',
  'les_a2_collocations',
  'les_a2_stress_timing',
  'les_a2_airport',
  'les_a2_hotel_taxi',
  'les_a2_restaurant_shopping',
  'les_a2_reading_strategy',
  'les_a2_writing_svo',
  'les_a2_writing_bio',
  'les_a2_writing_messages',
  'les_a2_writing_past',
  'les_a2_writing_selfcheck',
  'les_a2_it_roles_hierarchy',
  'les_a2_it_reading_strategy',
  'les_a2_it_computer_parts',
  'les_a2_it_system_unit',
  'les_a2_it_internet_history',
  'les_a2_it_clean_code_basics',
  'les_a2_it_testing_fundamentals',
  'les_a2_it_typescript_basics',
  'les_a2_it_algorithms_basics',
  'les_a2_it_email_technical',
  'les_a2_it_nontech_tech',
  'les_a2_it_word_formation',
  'les_a2_it_pr_tickets',
  'les_b1_it_acronyms_deep',
  'les_b1_it_ddd_modeling',
  'les_b1_it_bdd_specs',
  'les_a2_it_incidents',
  'les_b1_it_debugging',
  'les_b1_it_write_docs',
  'les_b1_it_ux_collab',
  'les_b1_it_devops_basics',
  'les_b1_tenses_review',
  'les_b1_modals',
  'les_b1_conditionals',
  'les_b1_passive',
  'les_b1_reported_speech',
  'les_b1_question_forms',
  'les_b1_negotiation',
  'les_b1_presentation_skills',
  'les_b1_leadership_feedback',
  'les_b1_finance_business',
  'les_b1_hr_career',
  'les_b1_sales_marketing',
  'les_b2_register_nuance',
  'les_b2_professional_email_advanced',
  'les_b2_professional_review',
  'les_b2_professional_argument',
  'les_b2_professional_summary',
  'les_b2_culture_brazil_vs_usa',
  'les_b2_it_architecture_decisions',
  'les_b2_it_strategy',
  'les_b2_it_incident_postmortem',
  'les_b2_it_jargon_mastery',
  'les_b2_it_advanced_patterns',
  'les_b2_it_technical_leadership',
  'les_b2_toeic_reading',
  'les_b2_toeic_writing',
  'les_b2_ielts_writing',
  'les_b2_celpe_br',
  'les_b2_exam_vocab',
  'les_b2_exam_simulations',
  'les_b1_project_case_study',
  'les_b1_project_retrospective',
  'les_b1_project_client_sim',
  'les_b1_project_negotiation_roleplay',
  'les_b1_project_integrated_review',
  'les_b1_project_presentation_final',
  'les_rem_pronunciation_th_vw',
  'les_rem_listening_slow_clear',
  'les_rem_grammar_be_pronouns',
  'les_rem_confidence_builder',
  'les_rem_writing_svo',
  // Onda 2 — Lote 15 (fechamento, 116→123)
  'les_a2_greetings_intro',
  'les_a2_small_talk',
  'les_a2_introducing_others',
  'les_a2_meeting_open',
  'les_a2_meeting_participate',
  'les_a2_email_basics',
  'les_a2_it_terms_basics',
];

const LESSON_PATHS = {
  les_b1_it_presentations: 'lessons/b1/les_b1_it_presentations.md',
  les_b1_it_architecture_vocab: 'lessons/b1/les_b1_it_architecture_vocab.md',
  les_b1_it_code_review: 'lessons/b1/les_b1_it_code_review.md',
  les_b2_it_mentoring: 'lessons/b2/les_b2_it_mentoring.md',
  les_b2_it_rfc_writing: 'lessons/b2/les_b2_it_rfc_writing.md',
  les_a1_greetings: 'lessons/a1/les_a1_greetings.md',
  les_a1_intro_dialogue: 'lessons/a1/les_a1_intro_dialogue.md',
  les_a1_daily_basics: 'lessons/a1/les_a1_daily_basics.md',
  les_a1_pronunciation_intro: 'lessons/a1/les_a1_pronunciation_intro.md',
  les_a2_it_meeting_standup: 'lessons/a2/les_a2_it_meeting_standup.md',
  les_a1_alphabet_sounds: 'lessons/a1/les_a1_alphabet_sounds.md',
  les_a1_en_us_en_gb: 'lessons/a1/les_a1_en_us_en_gb.md',
  les_a1_to_be_forms: 'lessons/a1/les_a1_to_be_forms.md',
  les_a1_pronouns_subject_object: 'lessons/a1/les_a1_pronouns_subject_object.md',
  les_a1_pronouns_possessive: 'lessons/a1/les_a1_pronouns_possessive.md',
  les_a1_pronouns_demonstrative: 'lessons/a1/les_a1_pronouns_demonstrative.md',
  les_a1_wh_questions: 'lessons/a1/les_a1_wh_questions.md',
  les_a1_numbers_colors: 'lessons/a1/les_a1_numbers_colors.md',
  les_a1_days_months: 'lessons/a1/les_a1_days_months.md',
  les_a1_time_dates: 'lessons/a1/les_a1_time_dates.md',
  les_a1_food: 'lessons/a1/les_a1_food.md',
  les_a1_occupations: 'lessons/a1/les_a1_occupations.md',
  les_a1_regular_verbs_past: 'lessons/a1/les_a1_regular_verbs_past.md',
  les_a1_present_simple: 'lessons/a1/les_a1_present_simple.md',
  les_a1_present_simple_questions: 'lessons/a1/les_a1_present_simple_questions.md',
  les_a1_have_has: 'lessons/a1/les_a1_have_has.md',
  les_a1_there_is_are: 'lessons/a1/les_a1_there_is_are.md',
  les_a1_reading_skimming: 'lessons/a1/les_a1_reading_skimming.md',
  les_a1_false_cognates: 'lessons/a1/les_a1_false_cognates.md',
  les_a2_phone_calls: 'lessons/a2/les_a2_phone_calls.md',
  les_a1_articles_nouns: 'lessons/a1/les_a1_articles_nouns.md',
  les_a2_ask_for_help: 'lessons/a2/les_a2_ask_for_help.md',
  les_a2_deadlines_tasks: 'lessons/a2/les_a2_deadlines_tasks.md',
  les_a2_feedback_praise: 'lessons/a2/les_a2_feedback_praise.md',
  les_a2_corporate_wrapup: 'lessons/a2/les_a2_corporate_wrapup.md',
  les_a2_corpus_intro: 'lessons/a2/les_a2_corpus_intro.md',
  les_a2_past_narrative: 'lessons/a2/les_a2_past_narrative.md',
  les_a2_future_will: 'lessons/a2/les_a2_future_will.md',
  les_a2_present_continuous: 'lessons/a2/les_a2_present_continuous.md',
  les_a2_modals_can_need: 'lessons/a2/les_a2_modals_can_need.md',
  les_a2_imperatives: 'lessons/a2/les_a2_imperatives.md',
  les_a2_prepositions_basic: 'lessons/a2/les_a2_prepositions_basic.md',
  les_a2_travel_vocab_core: 'lessons/a2/les_a2_travel_vocab_core.md',
  les_a2_collocations: 'lessons/a2/les_a2_collocations.md',
  les_a2_stress_timing: 'lessons/a2/les_a2_stress_timing.md',
  les_a2_airport: 'lessons/a2/les_a2_airport.md',
  les_a2_hotel_taxi: 'lessons/a2/les_a2_hotel_taxi.md',
  les_a2_restaurant_shopping: 'lessons/a2/les_a2_restaurant_shopping.md',
  les_a2_reading_strategy: 'lessons/a2/les_a2_reading_strategy.md',
  les_a2_writing_svo: 'lessons/a2/les_a2_writing_svo.md',
  les_a2_writing_bio: 'lessons/a2/les_a2_writing_bio.md',
  les_a2_writing_messages: 'lessons/a2/les_a2_writing_messages.md',
  les_a2_writing_past: 'lessons/a2/les_a2_writing_past.md',
  les_a2_writing_selfcheck: 'lessons/a2/les_a2_writing_selfcheck.md',
  les_a2_it_roles_hierarchy: 'lessons/a2/les_a2_it_roles_hierarchy.md',
  les_a2_it_reading_strategy: 'lessons/a2/les_a2_it_reading_strategy.md',
  les_a2_it_computer_parts: 'lessons/a2/les_a2_it_computer_parts.md',
  les_a2_it_system_unit: 'lessons/a2/les_a2_it_system_unit.md',
  les_a2_it_internet_history: 'lessons/a2/les_a2_it_internet_history.md',
  les_a2_it_clean_code_basics: 'lessons/a2/les_a2_it_clean_code_basics.md',
  les_a2_it_testing_fundamentals: 'lessons/a2/les_a2_it_testing_fundamentals.md',
  les_a2_it_typescript_basics: 'lessons/a2/les_a2_it_typescript_basics.md',
  les_a2_it_algorithms_basics: 'lessons/a2/les_a2_it_algorithms_basics.md',
  les_a2_it_email_technical: 'lessons/a2/les_a2_it_email_technical.md',
  les_a2_it_nontech_tech: 'lessons/a2/les_a2_it_nontech_tech.md',
  les_a2_it_word_formation: 'lessons/a2/les_a2_it_word_formation.md',
  les_a2_it_pr_tickets: 'lessons/a2/les_a2_it_pr_tickets.md',
  les_b1_it_acronyms_deep: 'lessons/b1/les_b1_it_acronyms_deep.md',
  les_b1_it_ddd_modeling: 'lessons/b1/les_b1_it_ddd_modeling.md',
  les_b1_it_bdd_specs: 'lessons/b1/les_b1_it_bdd_specs.md',
  les_a2_it_incidents: 'lessons/a2/les_a2_it_incidents.md',
  les_b1_it_debugging: 'lessons/b1/les_b1_it_debugging.md',
  les_b1_it_write_docs: 'lessons/b1/les_b1_it_write_docs.md',
  les_b1_it_ux_collab: 'lessons/b1/les_b1_it_ux_collab.md',
  les_b1_it_devops_basics: 'lessons/b1/les_b1_it_devops_basics.md',
  les_b1_tenses_review: 'lessons/b1/les_b1_tenses_review.md',
  les_b1_modals: 'lessons/b1/les_b1_modals.md',
  les_b1_conditionals: 'lessons/b1/les_b1_conditionals.md',
  les_b1_passive: 'lessons/b1/les_b1_passive.md',
  les_b1_reported_speech: 'lessons/b1/les_b1_reported_speech.md',
  les_b1_question_forms: 'lessons/b1/les_b1_question_forms.md',
  les_b1_negotiation: 'lessons/b1/les_b1_negotiation.md',
  les_b1_presentation_skills: 'lessons/b1/les_b1_presentation_skills.md',
  les_b1_leadership_feedback: 'lessons/b1/les_b1_leadership_feedback.md',
  les_b1_finance_business: 'lessons/b1/les_b1_finance_business.md',
  les_b1_hr_career: 'lessons/b1/les_b1_hr_career.md',
  les_b1_sales_marketing: 'lessons/b1/les_b1_sales_marketing.md',
  les_b2_register_nuance: 'lessons/b2/les_b2_register_nuance.md',
  les_b2_professional_email_advanced: 'lessons/b2/les_b2_professional_email_advanced.md',
  les_b2_professional_review: 'lessons/b2/les_b2_professional_review.md',
  les_b2_professional_argument: 'lessons/b2/les_b2_professional_argument.md',
  les_b2_professional_summary: 'lessons/b2/les_b2_professional_summary.md',
  les_b2_culture_brazil_vs_usa: 'lessons/b2/les_b2_culture_brazil_vs_usa.md',
  les_b2_it_architecture_decisions: 'lessons/b2/les_b2_it_architecture_decisions.md',
  les_b2_it_strategy: 'lessons/b2/les_b2_it_strategy.md',
  les_b2_it_incident_postmortem: 'lessons/b2/les_b2_it_incident_postmortem.md',
  les_b2_it_jargon_mastery: 'lessons/b2/les_b2_it_jargon_mastery.md',
  les_b2_it_advanced_patterns: 'lessons/b2/les_b2_it_advanced_patterns.md',
  les_b2_it_technical_leadership: 'lessons/b2/les_b2_it_technical_leadership.md',
  les_b2_toeic_reading: 'lessons/b2/les_b2_toeic_reading.md',
  les_b2_toeic_writing: 'lessons/b2/les_b2_toeic_writing.md',
  les_b2_ielts_writing: 'lessons/b2/les_b2_ielts_writing.md',
  les_b2_celpe_br: 'lessons/b2/les_b2_celpe_br.md',
  les_b2_exam_vocab: 'lessons/b2/les_b2_exam_vocab.md',
  les_b2_exam_simulations: 'lessons/b2/les_b2_exam_simulations.md',
  les_b1_project_case_study: 'lessons/b1/les_b1_project_case_study.md',
  les_b1_project_retrospective: 'lessons/b1/les_b1_project_retrospective.md',
  les_b1_project_client_sim: 'lessons/b1/les_b1_project_client_sim.md',
  les_b1_project_negotiation_roleplay: 'lessons/b1/les_b1_project_negotiation_roleplay.md',
  les_b1_project_integrated_review: 'lessons/b1/les_b1_project_integrated_review.md',
  les_b1_project_presentation_final: 'lessons/b1/les_b1_project_presentation_final.md',
  les_rem_pronunciation_th_vw: 'lessons/remediation/les_rem_pronunciation_th_vw.md',
  les_rem_listening_slow_clear: 'lessons/remediation/les_rem_listening_slow_clear.md',
  les_rem_grammar_be_pronouns: 'lessons/remediation/les_rem_grammar_be_pronouns.md',
  les_rem_confidence_builder: 'lessons/remediation/les_rem_confidence_builder.md',
  les_rem_writing_svo: 'lessons/remediation/les_rem_writing_svo.md',
  les_a2_greetings_intro: 'lessons/a2/lesson-15min-workplace-greetings.md',
  les_a2_small_talk: 'lessons/a2/les_a2_small_talk.md',
  les_a2_introducing_others: 'lessons/a2/les_a2_introducing_others.md',
  les_a2_meeting_open: 'lessons/a2/les_a2_meeting_open.md',
  les_a2_meeting_participate: 'lessons/a2/les_a2_meeting_participate.md',
  les_a2_email_basics: 'lessons/a2/les_a2_email_basics.md',
  les_a2_it_terms_basics: 'lessons/a2/les_a2_it_terms_basics.md',
};

const PACK_PATHS = {
  les_b1_it_presentations: 'packs/b1/pack-les-b1-it-presentations.md',
  les_b1_it_architecture_vocab: 'packs/b1/pack-les-b1-it-architecture-vocab.md',
  les_b1_it_code_review: 'packs/b1/pack-les-b1-it-code-review.md',
  les_b2_it_mentoring: 'packs/b2/pack-les-b2-it-mentoring.md',
  les_b2_it_rfc_writing: 'packs/b2/pack-les-b2-it-rfc-writing.md',
  les_a1_greetings: 'packs/a1/pack-les-a1-greetings.md',
  les_a1_intro_dialogue: 'packs/a1/pack-les-a1-intro-dialogue.md',
  les_a1_daily_basics: 'packs/a1/pack-les-a1-daily-basics.md',
  les_a1_pronunciation_intro: 'packs/a1/pack-les-a1-pronunciation-intro.md',
  les_a2_it_meeting_standup: 'packs/a2/pack-les-a2-it-meeting-standup.md',
  les_a1_alphabet_sounds: 'packs/a1/pack-les-a1-alphabet-sounds.md',
  les_a1_en_us_en_gb: 'packs/a1/pack-les-a1-en-us-en-gb.md',
  les_a1_to_be_forms: 'packs/a1/pack-les-a1-to-be-forms.md',
  les_a1_pronouns_subject_object: 'packs/a1/pack-les-a1-pronouns-subject-object.md',
  les_a1_pronouns_possessive: 'packs/a1/pack-les-a1-pronouns-possessive.md',
  les_a1_pronouns_demonstrative: 'packs/a1/pack-les-a1-pronouns-demonstrative.md',
  les_a1_wh_questions: 'packs/a1/pack-les-a1-wh-questions.md',
  les_a1_numbers_colors: 'packs/a1/pack-les-a1-numbers-colors.md',
  les_a1_days_months: 'packs/a1/pack-les-a1-days-months.md',
  les_a1_time_dates: 'packs/a1/pack-les-a1-time-dates.md',
  les_a1_food: 'packs/a1/pack-les-a1-food.md',
  les_a1_occupations: 'packs/a1/pack-les-a1-occupations.md',
  les_a1_regular_verbs_past: 'packs/a1/pack-les-a1-regular-verbs-past.md',
  les_a1_present_simple: 'packs/a1/pack-les-a1-present-simple.md',
  les_a1_present_simple_questions: 'packs/a1/pack-les-a1-present-simple-questions.md',
  les_a1_have_has: 'packs/a1/pack-les-a1-have-has.md',
  les_a1_there_is_are: 'packs/a1/pack-les-a1-there-is-are.md',
  les_a1_reading_skimming: 'packs/a1/pack-les-a1-reading-skimming.md',
  les_a1_false_cognates: 'packs/a1/pack-les-a1-false-cognates.md',
  les_a2_phone_calls: 'packs/a2/pack-les-a2-phone-calls.md',
  les_a1_articles_nouns: 'packs/a1/pack-les-a1-articles-nouns.md',
  les_a2_ask_for_help: 'packs/a2/pack-les-a2-ask-for-help.md',
  les_a2_deadlines_tasks: 'packs/a2/pack-les-a2-deadlines-tasks.md',
  les_a2_feedback_praise: 'packs/a2/pack-les-a2-feedback-praise.md',
  les_a2_corporate_wrapup: 'packs/a2/pack-les-a2-corporate-wrapup.md',
  les_a2_corpus_intro: 'packs/a2/pack-les-a2-corpus-intro.md',
  les_a2_past_narrative: 'packs/a2/pack-les-a2-past-narrative.md',
  les_a2_future_will: 'packs/a2/pack-les-a2-future-will.md',
  les_a2_present_continuous: 'packs/a2/pack-les-a2-present-continuous.md',
  les_a2_modals_can_need: 'packs/a2/pack-les-a2-modals-can-need.md',
  les_a2_imperatives: 'packs/a2/pack-les-a2-imperatives.md',
  les_a2_prepositions_basic: 'packs/a2/pack-les-a2-prepositions-basic.md',
  les_a2_travel_vocab_core: 'packs/a2/pack-les-a2-travel-vocab-core.md',
  les_a2_collocations: 'packs/a2/pack-les-a2-collocations.md',
  les_a2_stress_timing: 'packs/a2/pack-les-a2-stress-timing.md',
  les_a2_airport: 'packs/a2/pack-les-a2-airport.md',
  les_a2_hotel_taxi: 'packs/a2/pack-les-a2-hotel-taxi.md',
  les_a2_restaurant_shopping: 'packs/a2/pack-les-a2-restaurant-shopping.md',
  les_a2_reading_strategy: 'packs/a2/pack-les-a2-reading-strategy.md',
  les_a2_writing_svo: 'packs/a2/pack-les-a2-writing-svo.md',
  les_a2_writing_bio: 'packs/a2/pack-les-a2-writing-bio.md',
  les_a2_writing_messages: 'packs/a2/pack-les-a2-writing-messages.md',
  les_a2_writing_past: 'packs/a2/pack-les-a2-writing-past.md',
  les_a2_writing_selfcheck: 'packs/a2/pack-les-a2-writing-selfcheck.md',
  les_a2_it_roles_hierarchy: 'packs/a2/pack-les-a2-it-roles-hierarchy.md',
  les_a2_it_reading_strategy: 'packs/a2/pack-les-a2-it-reading-strategy.md',
  les_a2_it_computer_parts: 'packs/a2/pack-les-a2-it-computer-parts.md',
  les_a2_it_system_unit: 'packs/a2/pack-les-a2-it-system-unit.md',
  les_a2_it_internet_history: 'packs/a2/pack-les-a2-it-internet-history.md',
  les_a2_it_clean_code_basics: 'packs/a2/pack-les-a2-it-clean-code-basics.md',
  les_a2_it_testing_fundamentals: 'packs/a2/pack-les-a2-it-testing-fundamentals.md',
  les_a2_it_typescript_basics: 'packs/a2/pack-les-a2-it-typescript-basics.md',
  les_a2_it_algorithms_basics: 'packs/a2/pack-les-a2-it-algorithms-basics.md',
  les_a2_it_email_technical: 'packs/a2/pack-les-a2-it-email-technical.md',
  les_a2_it_nontech_tech: 'packs/a2/pack-les-a2-it-nontech-tech.md',
  les_a2_it_word_formation: 'packs/a2/pack-les-a2-it-word-formation.md',
  les_a2_it_pr_tickets: 'packs/a2/pack-les-a2-it-pr-tickets.md',
  les_b1_it_acronyms_deep: 'packs/b1/pack-les-b1-it-acronyms-deep.md',
  les_b1_it_ddd_modeling: 'packs/b1/pack-les-b1-it-ddd-modeling.md',
  les_b1_it_bdd_specs: 'packs/b1/pack-les-b1-it-bdd-specs.md',
  les_a2_it_incidents: 'packs/a2/pack-les-a2-it-incidents.md',
  les_b1_it_debugging: 'packs/b1/pack-les-b1-it-debugging.md',
  les_b1_it_write_docs: 'packs/b1/pack-les-b1-it-write-docs.md',
  les_b1_it_ux_collab: 'packs/b1/pack-les-b1-it-ux-collab.md',
  les_b1_it_devops_basics: 'packs/b1/pack-les-b1-it-devops-basics.md',
  les_b1_tenses_review: 'packs/b1/pack-les-b1-tenses-review.md',
  les_b1_modals: 'packs/b1/pack-les-b1-modals.md',
  les_b1_conditionals: 'packs/b1/pack-les-b1-conditionals.md',
  les_b1_passive: 'packs/b1/pack-les-b1-passive.md',
  les_b1_reported_speech: 'packs/b1/pack-les-b1-reported-speech.md',
  les_b1_question_forms: 'packs/b1/pack-les-b1-question-forms.md',
  les_b1_negotiation: 'packs/b1/pack-les-b1-negotiation.md',
  les_b1_presentation_skills: 'packs/b1/pack-les-b1-presentation-skills.md',
  les_b1_leadership_feedback: 'packs/b1/pack-les-b1-leadership-feedback.md',
  les_b1_finance_business: 'packs/b1/pack-les-b1-finance-business.md',
  les_b1_hr_career: 'packs/b1/pack-les-b1-hr-career.md',
  les_b1_sales_marketing: 'packs/b1/pack-les-b1-sales-marketing.md',
  les_b2_register_nuance: 'packs/b2/pack-les-b2-register-nuance.md',
  les_b2_professional_email_advanced: 'packs/b2/pack-les-b2-professional-email-advanced.md',
  les_b2_professional_review: 'packs/b2/pack-les-b2-professional-review.md',
  les_b2_professional_argument: 'packs/b2/pack-les-b2-professional-argument.md',
  les_b2_professional_summary: 'packs/b2/pack-les-b2-professional-summary.md',
  les_b2_culture_brazil_vs_usa: 'packs/b2/pack-les-b2-culture-brazil-vs-usa.md',
  les_b2_it_architecture_decisions: 'packs/b2/pack-les-b2-it-architecture-decisions.md',
  les_b2_it_strategy: 'packs/b2/pack-les-b2-it-strategy.md',
  les_b2_it_incident_postmortem: 'packs/b2/pack-les-b2-it-incident-postmortem.md',
  les_b2_it_jargon_mastery: 'packs/b2/pack-les-b2-it-jargon-mastery.md',
  les_b2_it_advanced_patterns: 'packs/b2/pack-les-b2-it-advanced-patterns.md',
  les_b2_it_technical_leadership: 'packs/b2/pack-les-b2-it-technical-leadership.md',
  les_b2_toeic_reading: 'packs/b2/pack-les-b2-toeic-reading.md',
  les_b2_toeic_writing: 'packs/b2/pack-les-b2-toeic-writing.md',
  les_b2_ielts_writing: 'packs/b2/pack-les-b2-ielts-writing.md',
  les_b2_celpe_br: 'packs/b2/pack-les-b2-celpe-br.md',
  les_b2_exam_vocab: 'packs/b2/pack-les-b2-exam-vocab.md',
  les_b2_exam_simulations: 'packs/b2/pack-les-b2-exam-simulations.md',
  les_b1_project_case_study: 'packs/b1/pack-les-b1-project-case-study.md',
  les_b1_project_retrospective: 'packs/b1/pack-les-b1-project-retrospective.md',
  les_b1_project_client_sim: 'packs/b1/pack-les-b1-project-client-sim.md',
  les_b1_project_negotiation_roleplay: 'packs/b1/pack-les-b1-project-negotiation-roleplay.md',
  les_b1_project_integrated_review: 'packs/b1/pack-les-b1-project-integrated-review.md',
  les_b1_project_presentation_final: 'packs/b1/pack-les-b1-project-presentation-final.md',
  les_rem_pronunciation_th_vw: 'packs/remediation/pack-les-rem-pronunciation-th-vw.md',
  les_rem_listening_slow_clear: 'packs/remediation/pack-les-rem-listening-slow-clear.md',
  les_rem_grammar_be_pronouns: 'packs/remediation/pack-les-rem-grammar-be-pronouns.md',
  les_rem_confidence_builder: 'packs/remediation/pack-les-rem-confidence-builder.md',
  les_rem_writing_svo: 'packs/remediation/pack-les-rem-writing-svo.md',
  les_a2_greetings_intro: 'packs/a2/pack-les-a2-greetings-intro.md',
  les_a2_small_talk: 'packs/a2/pack-les-a2-small-talk.md',
  les_a2_introducing_others: 'packs/a2/pack-les-a2-introducing-others.md',
  les_a2_meeting_open: 'packs/a2/pack-les-a2-meeting-open.md',
  les_a2_meeting_participate: 'packs/a2/pack-les-a2-meeting-participate.md',
  les_a2_email_basics: 'packs/a2/pack-les-a2-email-basics.md',
  les_a2_it_terms_basics: 'packs/a2/pack-les-a2-it-terms-basics.md',
};

// Valores aceitos pelos CHECKs do schema (ERD §6.5 / domain-model.md).
// `authored_material` foi adicionado via widening idempotente (ver abaixo).
const ALLOWED_REUSE = new Set([
  'cite_only',
  'adapt_with_attribution',
  'adapt_requires_permission',
  'authored_material',
]);

const DIST_LESSON_PARSER = path.join(
  itsPlatformDir,
  'dist/infrastructure/content/lesson-parser.js',
);
const DIST_PACK_PARSER = path.join(
  itsPlatformDir,
  'dist/infrastructure/content/pack-parser.js',
);
const SRC_LESSON_PARSER = path.join(
  itsPlatformDir,
  'src/infrastructure/content/lesson-parser.ts',
);
const SRC_PACK_PARSER = path.join(
  itsPlatformDir,
  'src/infrastructure/content/pack-parser.ts',
);

function loadEnv(filePath) {
  const txt = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of txt.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[m[1]] = v;
  }
  return env;
}

function dbConfig(env) {
  if (env.DATABASE_URL) {
    const cfg = { connectionString: env.DATABASE_URL };
    if (String(env.DB_SSL || '').toLowerCase() === 'true' || env.DB_SSL === '1') {
      cfg.ssl = { rejectUnauthorized: false };
    }
    return cfg;
  }
  const cfg = {
    host: env.DB_HOST || env.PGHOST || 'localhost',
    port: Number(env.DB_PORT || env.PGPORT || 5433),
    user: env.DB_USERNAME || env.DB_USER || env.PGUSER || 'postgres',
    password: env.DB_PASSWORD || env.PGPASSWORD || '',
    database: env.DB_NAME || env.PGDATABASE || 'its_platform',
  };
  if (String(env.DB_SSL || '').toLowerCase() === 'true' || env.DB_SSL === '1') {
    cfg.ssl = { rejectUnauthorized: false };
  }
  return cfg;
}

function dirCefrFromPath(relPath) {
  const m = /lessons\/(a1|a2|b1|b2|c1|c2|remediation)\//i.exec(relPath);
  if (!m?.[1]) return null;
  const d = m[1].toLowerCase();
  return /^[abc][12]$/.test(d) ? d.toUpperCase() : null;
}

/**
 * Extrai `reuse_basis` do markdown bruto com regex permissiva (aceita com ou sem
 * crases). O pack-parser do TS exige crases (`` `authored_material` ``), mas 8 de
 * 10 packs declaram `**Reuse basis:** authored_material` sem cras — o parser
 * então defaulta para `cite_only`. Esta função garante que o valor verdadeiro
 * do markdown seja usado.
 */
function extractReuseBasisFromMarkdown(markdown) {
  const m = /\*\*Reuse basis:\*\*\s*`?([A-Za-z_]+)`?/i.exec(markdown);
  if (!m) return null;
  return m[1].trim();
}

/**
 * Valida que `reuse_basis` é um valor permitido pelo CHECK (após o widening).
 * Não mapeia `authored_material` para `cite_only`: o valor verdadeiro deve ser
 * gravado literalmente nas colunas `lessons.reuse_basis` e `packs.reuse_basis`.
 */
function normalizeReuseForDb(reuseBasis) {
  if (ALLOWED_REUSE.has(reuseBasis)) return reuseBasis;
  throw new Error(`reuse_basis não suportado para sync: ${reuseBasis}`);
}

function publicationFields(reuseBasisDb) {
  if (reuseBasisDb === 'adapt_requires_permission') {
    return { publication_state: 'restricted_pending_permission', permission_state: 'requested' };
  }
  return { publication_state: 'publishable', permission_state: 'not_required' };
}

function assertAuthoredMaterialLesson(parsed, sourcePath) {
  const src = fs.readFileSync(sourcePath, 'utf8');
  if (!/\*\*Reuse basis:\*\*\s*`?authored_material`?/i.test(src)) {
    throw new Error(`Lição alvo sem authored_material: ${sourcePath}`);
  }
  // sanity: 4 fases
  if (!parsed.body || !Array.isArray(parsed.body.phases) || parsed.body.phases.length !== 4) {
    throw new Error(`Lição sem 4 fases parseadas: ${parsed.id} (${sourcePath})`);
  }
}

function assertAuthoredMaterialPack(pack, sourcePath) {
  const src = fs.readFileSync(sourcePath, 'utf8');
  if (!/\*\*Reuse basis:\*\*\s*`?authored_material`?/i.test(src)) {
    throw new Error(`Pack alvo sem authored_material: ${sourcePath}`);
  }
  if (!pack || !pack.id || !pack.lesson_id) {
    throw new Error(`Pack inválido: ${sourcePath}`);
  }
}

/* ── Preflight: dist atualizado em relação a src ───────────────────────── */

function mtimeMs(filePath) {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return -1;
  }
}

function ensureDistUpserted() {
  let missing = [];
  if (!fs.existsSync(DIST_LESSON_PARSER)) missing.push(DIST_LESSON_PARSER);
  if (!fs.existsSync(DIST_PACK_PARSER)) missing.push(DIST_PACK_PARSER);
  if (missing.length) {
    throw new Error(
      `Arquivos de build ausentes: ${missing.join(', ')}. Execute "npm run build" em its-platform/ primeiro.`,
    );
  }
  const distLesson = mtimeMs(DIST_LESSON_PARSER);
  const distPack = mtimeMs(DIST_PACK_PARSER);
  const srcLesson = mtimeMs(SRC_LESSON_PARSER);
  const srcPack = mtimeMs(SRC_PACK_PARSER);
  if (distLesson < srcLesson || distPack < srcPack) {
    throw new Error(
      `dist/ está desatualizado em relação a src/ (lesson-parser ou pack-parser). ` +
        `Execute "npm --prefix its-platform run build" antes de rodar este script.`,
    );
  }
}

/* ── Widening idempotente dos CHECK constraints ───────────────────────── */

async function ensureAuthoredMaterialCheck(client, tableName, constraintName) {
  const idRe = /^[a-z_]+$/;
  if (!idRe.test(tableName)) {
    throw new Error(`tableName inválido (allow-list): ${tableName}`);
  }
  if (!idRe.test(constraintName)) {
    throw new Error(`constraintName inválido (allow-list): ${constraintName}`);
  }
  const res = await client.query(
    `SELECT pg_get_constraintdef(oid) AS definition
     FROM pg_constraint
     WHERE contype = 'c' AND conname = $1 AND conrelid = $2::regclass`,
    [constraintName, tableName],
  );
  if (res.rowCount === 0) {
    throw new Error(
      `CHECK constraint "${constraintName}" não encontrado na tabela "${tableName}".`,
    );
  }
  const def = res.rows[0].definition;
  const alreadyHas = def.includes("'authored_material'");
  if (alreadyHas) {
    console.log(
      `[check] ${constraintName} (${tableName}) já aceita 'authored_material' — sem alteração.`,
    );
    return false;
  }
  console.log(
    `[check] ${constraintName} (${tableName}) NÃO aceita 'authored_material' — aplicando widening...`,
  );
  await client.query(
    `ALTER TABLE ${tableName}
     DROP CONSTRAINT ${constraintName},
     ADD CONSTRAINT ${constraintName}
     CHECK (reuse_basis IN ('cite_only','adapt_with_attribution','adapt_requires_permission','authored_material'))`,
  );
  console.log(
    `[check] ${constraintName} (${tableName}) widened com 'authored_material'.`,
  );
  return true;
}

/* ── Pré-validação de FKs antes do BEGIN ──────────────────────────────── */

async function prevalidateFks(client, lessonEntries) {
  // Coleta todos os module_id, cefr_level, domain_id referenciados.
  const moduleIds = new Set();
  const cefrLevels = new Set();
  const domainIds = new Set();
  for (const { parsed } of lessonEntries) {
    if (parsed.module_id) moduleIds.add(parsed.module_id);
    if (parsed.cefr_level) cefrLevels.add(parsed.cefr_level);
  }
  // domain_ids vêm dos itens dos packs.
  for (const lessonId of LESSON_IDS) {
    const { pack } = parsedPacks.get(lessonId);
    for (const item of pack.items) {
      if (item.domain_id) domainIds.add(item.domain_id);
    }
  }

  const errors = [];

  if (moduleIds.size) {
    const rows = await client.query(
      'SELECT id FROM modules WHERE id = ANY($1::text[])',
      [[...moduleIds]],
    );
    const found = new Set(rows.rows.map((r) => r.id));
    for (const mid of moduleIds) {
      if (!found.has(mid)) errors.push(`module_id ausente: ${mid}`);
    }
  }
  if (cefrLevels.size) {
    const rows = await client.query(
      'SELECT code FROM cefr_levels WHERE code = ANY($1::text[])',
      [[...cefrLevels]],
    );
    const found = new Set(rows.rows.map((r) => r.code));
    for (const cl of cefrLevels) {
      if (!found.has(cl)) errors.push(`cefr_level ausente: ${cl}`);
    }
  }
  if (domainIds.size) {
    const rows = await client.query(
      'SELECT id FROM domains WHERE id = ANY($1::text[])',
      [[...domainIds]],
    );
    const found = new Set(rows.rows.map((r) => r.id));
    for (const did of domainIds) {
      if (!found.has(did)) errors.push(`domain_id ausente: ${did}`);
    }
  }

  if (errors.length) {
    throw new Error(`Pré-validação de FK falhou:\n  ${errors.join('\n  ')}`);
  }
}

const parsedLessons = new Map();
const parsedPacks = new Map();

async function main() {
  const envPath = path.join(itsPlatformDir, '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error(`Arquivo .env não encontrado em: ${envPath}`);
  }
  const env = loadEnv(envPath);
  const cfg = dbConfig(env);

  /* ── Preflight: dist ──────────────────────────────────────────────── */
  ensureDistUpserted();

  /* ── Parse e validação dos arquivos-alvo ──────────────────────────── */
  for (const lessonId of LESSON_IDS) {
    const rel = LESSON_PATHS[lessonId];
    const abs = path.join(repoRoot, rel);
    if (!fs.existsSync(abs)) throw new Error(`Lição alvo não encontrada: ${rel}`);
    const md = fs.readFileSync(abs, 'utf8');
    const parsed = parseLesson(md, path.basename(abs), {
      dirCefr: dirCefrFromPath(rel),
      lessonModules: {},
    });
    if (parsed.id !== lessonId) {
      throw new Error(`Lesson ID divergente: esperado ${lessonId}, obtido ${parsed.id} (${rel})`);
    }
    assertAuthoredMaterialLesson(parsed, abs);
    parsedLessons.set(lessonId, { parsed, rel, abs });
  }

  for (const lessonId of LESSON_IDS) {
    const rel = PACK_PATHS[lessonId];
    const abs = path.join(repoRoot, rel);
    if (!fs.existsSync(abs)) throw new Error(`Pack alvo não encontrado: ${rel}`);
    const md = fs.readFileSync(abs, 'utf8');
    const pack = parsePack(md, path.basename(abs));
    if (pack.lesson_id !== lessonId) {
      throw new Error(`Pack ${pack.id} não referencia a lição esperada ${lessonId} (${rel})`);
    }
    assertAuthoredMaterialPack(pack, abs);
    parsedPacks.set(lessonId, { pack, rel, abs });
  }

  const client = new Client(cfg);
  await client.connect();
  const summary = {
    lessonsUpserted: 0,
    packsUpserted: 0,
    itemsUpserted: 0,
    optionsInserted: 0,
    prereqEdgesInserted: 0,
    checkWidened: { lessons: false, packs: false },
  };

  try {
    /* ── Pré-validação de FKs (fora da transação) ───────────────────── */
    const lessonEntries = Array.from(parsedLessons.values());
    await prevalidateFks(client, lessonEntries);

    /* ── Widening dos CHECK constraints (fora da transação, autocommit) ── */
    // O widening roda FORA do BEGIN/COMMIT explícito: cada ALTER TABLE é
    // executado em autocommit e commitado de forma independente, de propósito,
    // porque a correção de schema (ampliação aditiva do CHECK) deve persistir
    // mesmo se a transação de dados falhar depois. No PostgreSQL o DDL é
    // transacional, mas aqui escolhemos não incluí-lo na transação principal
    // justamente para que o widening sobreviva a um rollback de dados.
    // A função é idempotente (consulta pg_constraint antes), então reexecutar
    // é no-op e seguro.
    summary.checkWidened.lessons = await ensureAuthoredMaterialCheck(
      client,
      'lessons',
      'lessons_reuse_basis_check',
    );
    summary.checkWidened.packs = await ensureAuthoredMaterialCheck(
      client,
      'packs',
      'packs_reuse_basis_check',
    );

    await client.query('BEGIN');

    // Pré-validações de referências (modules/domains/cefr já checadas acima;
    // skills via constraint existente na inserção de items).
    const existingLessonRows = await client.query(
      'SELECT id FROM lessons WHERE id = ANY($1::text[])',
      [LESSON_IDS],
    );
    const existingLessonIds = new Set(existingLessonRows.rows.map((r) => r.id));

    for (const lessonId of LESSON_IDS) {
      const { parsed } = parsedLessons.get(lessonId);
      // `authored_material` gravado literalmente — sem mapeamento para cite_only.
      const reuseBasisDb = normalizeReuseForDb(parsed.reuse_basis);
      const { publication_state, permission_state } = publicationFields(reuseBasisDb);
      const authoring_state = parsed.authoring_state || 'authored';
      if (!parsed.module_id) throw new Error(`Módulo ausente para lição ${lessonId}`);
      if (!parsed.cefr_level) throw new Error(`CEFR ausente para lição ${lessonId}`);

      await client.query(
        `INSERT INTO lessons (id, module_id, title, cefr_level, reuse_basis,
                              authoring_state, publication_state, permission_state,
                              source_ref, body)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE SET
         module_id = EXCLUDED.module_id,
         title = EXCLUDED.title,
         cefr_level = EXCLUDED.cefr_level,
         reuse_basis = EXCLUDED.reuse_basis,
         authoring_state = EXCLUDED.authoring_state,
         publication_state = EXCLUDED.publication_state,
         permission_state = EXCLUDED.permission_state,
         source_ref = EXCLUDED.source_ref,
         body = EXCLUDED.body,
         updated_at = now()`,
        [
          parsed.id,
          parsed.module_id,
          parsed.title,
          parsed.cefr_level,
          reuseBasisDb,
          authoring_state,
          publication_state,
          permission_state,
          parsed.source_ref ?? null,
          JSON.stringify(parsed.body),
        ],
      );
      summary.lessonsUpserted += 1;
      existingLessonIds.add(parsed.id);
    }

    // Pré-requisitos: escopo restrito às 20 lições.
    for (const lessonId of LESSON_IDS) {
      const { parsed } = parsedLessons.get(lessonId);
      const prereqs = Array.isArray(parsed.prereq_lessons) ? parsed.prereq_lessons : [];
      const existingPrereqsRes = prereqs.length
        ? await client.query('SELECT id FROM lessons WHERE id = ANY($1::text[])', [prereqs])
        : { rows: [] };
      const known = new Set(existingPrereqsRes.rows.map((r) => r.id));
      const valid = prereqs.filter((p) => known.has(p) && p !== lessonId);

      await client.query('DELETE FROM lesson_prerequisites WHERE lesson_id = $1', [lessonId]);
      for (const prereq of valid) {
        await client.query(
          `INSERT INTO lesson_prerequisites (lesson_id, prereq_id, edge_type)
           VALUES ($1, $2, 'prerequisite')
           ON CONFLICT (lesson_id, prereq_id) DO NOTHING`,
          [lessonId, prereq],
        );
        summary.prereqEdgesInserted += 1;
      }
    }

    for (const lessonId of LESSON_IDS) {
      const { pack, abs: packAbs } = parsedPacks.get(lessonId);
      // Extrai reuse_basis do markdown bruto (regex permissiva) para cobrir packs
      // que declaram sem cras — o pack-parser do TS exige cras e defaulta para cite_only.
      const packMarkdown = fs.readFileSync(packAbs, 'utf8');
      const reuseBasisFromMd = extractReuseBasisFromMarkdown(packMarkdown);
      const reuseBasisDb = normalizeReuseForDb(
        reuseBasisFromMd ?? pack.reuse_basis,
      );
      const insertedItemIds = pack.items.map((i) => i.item_id);

      await client.query(
        `INSERT INTO packs (id, lesson_id, schema_version, reuse_basis, manifest, item_ids)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           lesson_id = EXCLUDED.lesson_id,
           schema_version = EXCLUDED.schema_version,
           reuse_basis = EXCLUDED.reuse_basis,
           manifest = EXCLUDED.manifest,
           item_ids = EXCLUDED.item_ids`,
        [
          pack.id,
          pack.lesson_id,
          pack.schema_version,
          reuseBasisDb,
          JSON.stringify({
            title: pack.title,
            cefr_level: parsedLessons.get(lessonId).parsed.cefr_level ?? null,
            time_cap: pack.time_cap,
            split: pack.split,
            interleaved: pack.interleaved,
          }),
          insertedItemIds,
        ],
      );
      summary.packsUpserted += 1;

      for (const item of pack.items) {
        await client.query(
          `INSERT INTO items (id, schema_version, skill_ids, lesson_id, dialogue_id, slot_number,
                              clip_ids, cefr_level, domain_id, item_type, listening_kind,
                              listening_tier, modality, scoring, stem, key, p_random,
                              br_pt_form_state, provenance_kind)
           VALUES ($1, '2.0', $2, $3, NULL, NULL, NULL,
                   (SELECT cefr_level FROM lessons WHERE id = $4),
                   $5, $6, NULL, NULL, 'text', $7, $8, $9, $10, $11, 'authored')
           ON CONFLICT (id) DO UPDATE SET
             skill_ids = EXCLUDED.skill_ids,
             lesson_id = EXCLUDED.lesson_id,
             cefr_level = (SELECT cefr_level FROM lessons WHERE id = $4),
             domain_id = EXCLUDED.domain_id,
             item_type = EXCLUDED.item_type,
             scoring = EXCLUDED.scoring,
             modality = 'text',
             stem = EXCLUDED.stem,
             key = EXCLUDED.key,
             p_random = EXCLUDED.p_random,
             br_pt_form_state = EXCLUDED.br_pt_form_state,
             provenance_kind = 'authored',
             updated_at = now()`,
          [
            item.item_id,
            item.skill_ids,
            lessonId,
            lessonId,
            item.domain_id,
            item.item_type,
            item.scoring,
            item.stem,
            item.key,
            item.p_random,
            item.br_pt_form_state,
          ],
        );
        summary.itemsUpserted += 1;

        // Segurança: no máximo 1 chave por item (índice parcial uq_item_options_one_key).
        const chaves = item.options.filter((o) => o.is_key === true);
        if (chaves.length > 1) {
          throw new Error(
            `Item ${item.item_id} viola "no máximo 1 is_key por item": ${chaves.length} chaves declaradas.`,
          );
        }
        await client.query('DELETE FROM item_options WHERE item_id = $1', [item.item_id]);
        for (const opt of item.options) {
          await client.query(
            `INSERT INTO item_options (item_id, position, option_text, is_key,
                                        distractor_type, br_pt_form, note, expected_share)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NULL)`,
            [
              item.item_id,
              opt.position,
              opt.option_text,
              opt.is_key,
              opt.distractor_type,
              opt.br_pt_form,
              opt.note,
            ],
          );
          summary.optionsInserted += 1;
        }
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // ignore rollback errors
    }
    throw err;
  } finally {
    await client.end();
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        scope: { lessons: LESSON_IDS.length, packs: LESSON_IDS.length },
        checkWidened: summary.checkWidened,
        summary,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error('[content:sync] failed:', err.message);
  process.exit(1);
});
