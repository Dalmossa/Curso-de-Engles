import type { CefrLevel } from '@/core/value-objects/cefr-level';

/**
 * Curriculum modules, from `specs/curriculum-graph-spec.md`: the module catalog in §3 and the
 * **canonical lesson registry** in §4.3. §4.3 is the authority for lesson IDs — §3 publishes only
 * per-module counts — so each module's lesson list is the §4.3 rows under that module's
 * `**`mod_…`**` header, in registry order.
 *
 * Every ID here is a lesson the content loader persists, declares in its authoring file and the
 * API serves. That equality is the point: a card on the dashboard links straight to
 * `/lessons/{id}`, so an ID that exists only in a spec becomes a 404 the learner can reach.
 * `les_b1_it_presentations` is the one registry row deliberately absent — §4.3 marks it
 * `blocked_no_adequate_source`, no lesson file exists, and a card for it could only fail.
 *
 * When §3/§4.3 change, regenerate this list from the registry; never hand-add an ID.
 */

export interface CurriculumLesson {
  readonly id: string;
  readonly title: string;
  readonly durationMinutes: number;
}

export interface CurriculumModule {
  readonly id: string;
  readonly index: number;
  readonly title: string;
  readonly description: string;
  readonly cefrLevel: CefrLevel;
  readonly track: 'General' | 'IT Track' | 'Both';
  readonly sourceMarkdowns: readonly string[];
  readonly lessons: readonly CurriculumLesson[];
}

export const CURRICULUM_MODULES: readonly CurriculumModule[] = [
  // A1 — General Track
  {
    id: 'mod_a1_foundation',
    index: 1,
    title: 'Foundations: Alphabet, Sounds, Basics',
    description: 'Alfabeto, sons e fundamentos para começar.',
    cefrLevel: 'A1',
    track: 'General',
    sourceMarkdowns: ['apostila-ingles-para-iniciantes-impresso.md (Ch 1-2)'],
    lessons: [
      { id: 'les_a1_alphabet_sounds', title: 'Alphabet, Sounds, Letter Names', durationMinutes: 15 },
      { id: 'les_a1_greetings', title: 'Greetings & Basic Phrases', durationMinutes: 15 },
      { id: 'les_a1_intro_dialogue', title: 'Introducing Yourself: 3-Step Dialogue', durationMinutes: 15 },
      { id: 'les_a1_daily_basics', title: 'Everyday Survival Phrases', durationMinutes: 15 },
      { id: 'les_a1_pronunciation_intro', title: 'TH / H / R / S+C Minimal Pairs', durationMinutes: 15 },
      { id: 'les_a1_en_us_en_gb', title: 'American vs. British English', durationMinutes: 15 },
    ],
  },
  {
    id: 'mod_a1_grammar_start',
    index: 2,
    title: 'Grammar Starter: Be, Pronouns, Articles',
    description: 'Verbo to be, pronomes e artigos.',
    cefrLevel: 'A1',
    track: 'General',
    sourceMarkdowns: ['apostila-ingles-para-iniciantes-impresso.md (Ch 3-4)'],
    lessons: [
      { id: 'les_a1_to_be_forms', title: 'Verb To Be: Affirmative/Negative/Interrogative', durationMinutes: 15 },
      { id: 'les_a1_pronouns_subject_object', title: 'Personal Pronouns: Subject & Object', durationMinutes: 15 },
      { id: 'les_a1_pronouns_possessive', title: 'Possessive Pronouns', durationMinutes: 15 },
      { id: 'les_a1_pronouns_demonstrative', title: 'Demonstratives: This/That/These/Those', durationMinutes: 15 },
      { id: 'les_a1_wh_questions', title: 'Interrogatives: WH-words + How+Adverb', durationMinutes: 15 },
      { id: 'les_a1_articles_nouns', title: 'Articles, Nouns, Adjectives', durationMinutes: 15 },
    ],
  },
  {
    id: 'mod_a1_vocab_core',
    index: 3,
    title: 'Core Vocab: Numbers, Colors, Days, Food',
    description: 'Vocabulário essencial do dia a dia.',
    cefrLevel: 'A1',
    track: 'General',
    sourceMarkdowns: ['apostila-ingles-para-iniciantes-impresso.md (Ch 5)'],
    lessons: [
      { id: 'les_a1_numbers_colors', title: 'Numbers & Colors', durationMinutes: 15 },
      { id: 'les_a1_days_months', title: 'Days of Week & Months', durationMinutes: 15 },
      { id: 'les_a1_time_dates', title: 'Hours & Dates', durationMinutes: 15 },
      { id: 'les_a1_food', title: 'Food & Drink', durationMinutes: 15 },
      { id: 'les_a1_occupations', title: 'Occupations & Roles', durationMinutes: 15 },
      { id: 'les_a1_regular_verbs_past', title: 'Regular Verbs Past: ED Rules', durationMinutes: 15 },
    ],
  },
  {
    id: 'mod_a1_comm_basic',
    index: 4,
    title: 'Basic Communication: Greetings, Intro, Needs',
    description: 'Comunicação básica: saudações, apresentações, necessidades.',
    cefrLevel: 'A1',
    track: 'General',
    sourceMarkdowns: ['Ingles-basico.md (Ch 1-3)'],
    lessons: [
      { id: 'les_a1_present_simple', title: 'Present Simple Affirmative', durationMinutes: 15 },
      { id: 'les_a1_present_simple_questions', title: 'Do/Does Questions', durationMinutes: 15 },
      { id: 'les_a1_have_has', title: 'Verb To Have', durationMinutes: 15 },
      { id: 'les_a1_there_is_are', title: 'There Is / There Are', durationMinutes: 15 },
      { id: 'les_a1_reading_skimming', title: 'Skimming & Scanning', durationMinutes: 15 },
      { id: 'les_a1_false_cognates', title: 'False Cognates: The Top Traps', durationMinutes: 15 },
    ],
  },

  // A2 — General Track
  {
    id: 'mod_a2_workplace_intro',
    index: 5,
    title: 'Workplace Basics: Greetings, Intros, Small Talk',
    description: 'Fundamentos do inglês no ambiente de trabalho.',
    cefrLevel: 'A2',
    track: 'General',
    sourceMarkdowns: ['frases-ingles-trabalho.md (Ch 2-3)'],
    lessons: [
      { id: 'les_a2_greetings_intro', title: 'Workplace Greetings & Introductions', durationMinutes: 15 },
      { id: 'les_a2_small_talk', title: 'Small Talk: Weekend, Weather, Coffee', durationMinutes: 15 },
      { id: 'les_a2_introducing_others', title: 'Introducing Others: Reciprocity, Roles, Reactions', durationMinutes: 15 },
      { id: 'les_a2_meeting_open', title: 'Opening a Meeting: Agenda, Objectives, Roles', durationMinutes: 15 },
      { id: 'les_a2_meeting_participate', title: 'Participating: Agreeing, Disagreeing, Hedging', durationMinutes: 15 },
      { id: 'les_a2_email_basics', title: 'Professional Emails: Structure, Attachments, Follow-up', durationMinutes: 15 },
    ],
  },
  {
    id: 'mod_a2_workplace_comm',
    index: 6,
    title: 'Workplace Comm: Meetings, Email, Calls',
    description: 'Reuniões, e-mails e chamadas profissionais.',
    cefrLevel: 'A2',
    track: 'General',
    sourceMarkdowns: ['frases-ingles-trabalho.md (Ch 4-6)'],
    lessons: [
      { id: 'les_a2_phone_calls', title: 'Phone & Video Calls', durationMinutes: 15 },
      { id: 'les_a2_ask_for_help', title: 'Asking for Help & Buying Time', durationMinutes: 15 },
      { id: 'les_a2_deadlines_tasks', title: 'Deadlines, Tasks & Follow-up', durationMinutes: 15 },
      { id: 'les_a2_feedback_praise', title: 'Feedback, Praise & Apologies', durationMinutes: 15 },
      { id: 'les_a2_corporate_wrapup', title: 'Closing Conversations & Sign-offs', durationMinutes: 15 },
      { id: 'les_a2_corpus_intro', title: 'Corporate Speak: Acronyms & Jargon', durationMinutes: 15 },
    ],
  },
  {
    id: 'mod_a2_workplace_tasks',
    index: 7,
    title: 'Tasks & Deadlines: Follow-up, Help, Feedback',
    description: 'Tarefas, prazos e follow-up.',
    cefrLevel: 'A2',
    track: 'General',
    sourceMarkdowns: ['frases-ingles-trabalho.md (Ch 7-10)'],
    lessons: [
      { id: 'les_a2_past_narrative', title: 'Narrating the Past (Work Context)', durationMinutes: 15 },
      { id: 'les_a2_future_will', title: 'Future: Will & Going To', durationMinutes: 15 },
      { id: 'les_a2_present_continuous', title: 'Present Continuous in Workflows', durationMinutes: 15 },
      { id: 'les_a2_modals_can_need', title: 'Modals: Can, Need, Should', durationMinutes: 15 },
      { id: 'les_a2_imperatives', title: 'Imperatives: Instructions & Procedures', durationMinutes: 15 },
      { id: 'les_a2_prepositions_basic', title: 'Prepositions of Place & Time', durationMinutes: 15 },
    ],
  },
  {
    id: 'mod_a2_travel',
    index: 8,
    title: 'Travel English: Transport, Hotel, Food, Help',
    description: 'Inglês para viagens: transporte, hotel, comida, ajuda.',
    cefrLevel: 'A2',
    track: 'General',
    sourceMarkdowns: ['Ingles para Viagens.md'],
    lessons: [
      { id: 'les_a2_travel_vocab_core', title: 'Core Travel Vocabulary (20 items)', durationMinutes: 15 },
      { id: 'les_a2_collocations', title: 'Collocations: Word Partners', durationMinutes: 15 },
      { id: 'les_a2_stress_timing', title: 'Stress-Timing & Word Stress', durationMinutes: 15 },
      { id: 'les_a2_airport', title: 'Airport & Immigration', durationMinutes: 15 },
      { id: 'les_a2_hotel_taxi', title: 'Hotel, Taxi & Transport', durationMinutes: 15 },
      { id: 'les_a2_restaurant_shopping', title: 'Restaurant, Shopping & Emergencies', durationMinutes: 15 },
    ],
  },
  {
    id: 'mod_a2_skills_rw',
    index: 9,
    title: 'Reading & Writing Improvement',
    description: 'Melhoria de leitura e escrita.',
    cefrLevel: 'A2',
    track: 'General',
    sourceMarkdowns: ['leia-e-escreva-melhor-em-ingles.md'],
    lessons: [
      { id: 'les_a2_reading_strategy', title: 'Reader\'s Toolkit: Skim, Scan, Context, Cognates', durationMinutes: 15 },
      { id: 'les_a2_writing_svo', title: 'Writer\'s Toolkit: SVO Order, Explicit Subject, Tense Consistency', durationMinutes: 15 },
      { id: 'les_a2_writing_bio', title: 'Writing: Bio & Profile', durationMinutes: 15 },
      { id: 'les_a2_writing_messages', title: 'Writing: Everyday Messages', durationMinutes: 15 },
      { id: 'les_a2_writing_past', title: 'Writing: Narrating the Past', durationMinutes: 15 },
      { id: 'les_a2_writing_selfcheck', title: 'Writer\'s Revision Checklist', durationMinutes: 15 },
    ],
  },

  // A2 — IT Track
  {
    id: 'mod_a2_it_fundamentals',
    index: 10,
    title: 'IT English: Terms, Docs, Stand-ups, Clean Code, Testing, TypeScript, Algorithms',
    description: 'Termos técnicos, documentação, stand-ups, clean code, testes, TypeScript, algoritmos.',
    cefrLevel: 'A2',
    track: 'IT Track',
    sourceMarkdowns: [
      'Ingles-Tecnico-Para-Informatica.md',
      'Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md',
      'docs/codigolimpo.md',
      'docs/tdd.md',
      'docs/typescript-guia-pratico.md',
      'docs/algoritmos.md',
    ],
    lessons: [
      { id: 'les_a2_it_terms_basics', title: 'IT English: Core Terms, Docs, Stand-ups', durationMinutes: 15 },
      { id: 'les_a2_it_roles_hierarchy', title: 'Roles & Hierarchy in Tech', durationMinutes: 15 },
      { id: 'les_a2_it_reading_strategy', title: 'Reading Technical Texts', durationMinutes: 15 },
      { id: 'les_a2_it_computer_parts', title: 'Parts of Computers', durationMinutes: 15 },
      { id: 'les_a2_it_system_unit', title: 'System Unit & Hardware Vocabulary', durationMinutes: 15 },
      { id: 'les_a2_it_internet_history', title: 'Internet History & Relative Clauses', durationMinutes: 15 },
      { id: 'les_a2_it_clean_code_basics', title: 'Clean Code Practices: Refactoring, Code Smells, SOLID', durationMinutes: 15 },
      { id: 'les_a2_it_testing_fundamentals', title: 'Testing Fundamentals: Unit Tests, Mocks, TDD Cycle', durationMinutes: 15 },
      { id: 'les_a2_it_typescript_basics', title: 'TypeScript Basics: Types, Interfaces, Generics, Async', durationMinutes: 15 },
      { id: 'les_a2_it_algorithms_basics', title: 'Algorithms & Data Structures Basics: Big O, Arrays, Hash Maps', durationMinutes: 15 },
    ],
  },
  {
    id: 'mod_a2_it_communication',
    index: 11,
    title: 'IT Comm: PRs, Tickets, Incidents, Docs',
    description: 'Pull requests, tickets, incident reports, documentação técnica.',
    cefrLevel: 'A2',
    track: 'IT Track',
    sourceMarkdowns: ['Ingles-Tecnico-Para-Informatica.md', 'frases-ingles-trabalho.md (tech)'],
    lessons: [
      { id: 'les_a2_it_email_technical', title: 'Technical Emails & Documentation', durationMinutes: 15 },
      { id: 'les_a2_it_meeting_standup', title: 'Stand-ups & Technical Meetings', durationMinutes: 15 },
      { id: 'les_a2_it_incidents', title: 'Incident Reports & Problem Statements', durationMinutes: 15 },
      { id: 'les_a2_it_nontech_tech', title: 'Tech for Non-Technical Colleagues', durationMinutes: 15 },
      { id: 'les_a2_it_word_formation', title: 'Prefix, Suffix & Deceptive Cognates', durationMinutes: 15 },
      { id: 'les_a2_it_pr_tickets', title: 'PRs, Tickets & Code Comments', durationMinutes: 15 },
    ],
  },

  // B1 — General Track
  {
    id: 'mod_b1_grammar_consolidate',
    index: 12,
    title: 'Grammar Consolidation: Tenses, Modals, Conditionals',
    description: 'Consolidação gramatical: tempos, modais, condicionais.',
    cefrLevel: 'B1',
    track: 'General',
    sourceMarkdowns: ['apostila-ingles-para-iniciantes-impresso.md (review)', 'Ingles-basico.md (adv)'],
    lessons: [
      { id: 'les_b1_tenses_review', title: 'Tenses Consolidation: Present/Past/Future', durationMinutes: 15 },
      { id: 'les_b1_modals', title: 'Modal Verbs Deep Dive', durationMinutes: 15 },
      { id: 'les_b1_conditionals', title: 'Conditionals 1 & 2', durationMinutes: 15 },
      { id: 'les_b1_passive', title: 'Passive Voice', durationMinutes: 15 },
      { id: 'les_b1_reported_speech', title: 'Reported Speech', durationMinutes: 15 },
      { id: 'les_b1_question_forms', title: 'Advanced Question Forms', durationMinutes: 15 },
    ],
  },
  {
    id: 'mod_b1_workplace_adv',
    index: 13,
    title: 'Advanced Workplace: Negotiation, Presentation, Leadership',
    description: 'Negociação, apresentação e liderança.',
    cefrLevel: 'B1',
    track: 'General',
    sourceMarkdowns: ['frases-ingles-trabalho.md (advanced)', 'leia-e-escreva-melhor-em-ingles.md'],
    lessons: [
      { id: 'les_b1_negotiation', title: 'Negotiation Language', durationMinutes: 15 },
      { id: 'les_b1_presentation_skills', title: 'Presentation & Pitching', durationMinutes: 15 },
      { id: 'les_b1_leadership_feedback', title: 'Leadership & Feedback Loops', durationMinutes: 15 },
      { id: 'les_b1_finance_business', title: 'Finance & Business Vocabulary', durationMinutes: 15 },
      { id: 'les_b1_hr_career', title: 'HR & Career Vocabulary', durationMinutes: 15 },
      { id: 'les_b1_sales_marketing', title: 'Sales & Marketing Vocabulary', durationMinutes: 15 },
    ],
  },

  // B1 — IT Track
  {
    id: 'mod_b1_it_technical',
    index: 14,
    title: 'Technical Discussions: Architecture, Debugging, Code Review, DDD, BDD, UX, DevOps',
    description: 'Discussões técnicas: arquitetura, debugging, code review, DDD, BDD, UX, DevOps.',
    cefrLevel: 'B1',
    track: 'IT Track',
    sourceMarkdowns: [
      'Ingles-Tecnico-Para-Informatica.md (advanced)',
      'docs/ddd-rapido.md',
      'docs/bdd-in-action.md',
      'docs/ux-design.md',
    ],
    lessons: [
      { id: 'les_b1_it_architecture_vocab', title: 'Architecture Discussions', durationMinutes: 15 },
      { id: 'les_b1_it_debugging', title: 'Debugging & Error Reporting', durationMinutes: 15 },
      { id: 'les_b1_it_code_review', title: 'Code Review Comments', durationMinutes: 15 },
      { id: 'les_b1_it_acronyms_deep', title: 'Advanced Acronyms & Jargon', durationMinutes: 15 },
      { id: 'les_b1_it_write_docs', title: 'Writing Documentation & RFCs', durationMinutes: 15 },
      { id: 'les_b1_it_ddd_modeling', title: 'Domain-Driven Design: Aggregates, Entities, Value Objects, Repositories', durationMinutes: 15 },
      { id: 'les_b1_it_bdd_specs', title: 'BDD Specifications: Given-When-Then, Acceptance Criteria, Scenario Writing', durationMinutes: 15 },
      { id: 'les_b1_it_ux_collab', title: 'UX Collaboration: Wireframes, Prototypes, Personas, Accessibility', durationMinutes: 15 },
      { id: 'les_b1_it_devops_basics', title: 'DevOps Basics: CI/CD, Pipelines, Containers, Observability', durationMinutes: 15 },
    ],
  },

  // B1 — Both Tracks
  {
    id: 'mod_b1_fluency_project',
    index: 15,
    title: 'Project-based Fluency: Case Studies, Simulations',
    description: 'Fluência baseada em projetos: casos de estudo, simulações.',
    cefrLevel: 'B1',
    track: 'Both',
    sourceMarkdowns: ['All sources (integrated)'],
    lessons: [
      { id: 'les_b1_project_case_study', title: 'Case Study Presentation', durationMinutes: 15 },
      { id: 'les_b1_project_retrospective', title: 'Retrospective & Post-mortem Talk', durationMinutes: 15 },
      { id: 'les_b1_project_client_sim', title: 'Client Simulation Scenario', durationMinutes: 15 },
      { id: 'les_b1_project_negotiation_roleplay', title: 'Negotiation Role-play', durationMinutes: 15 },
      { id: 'les_b1_project_integrated_review', title: 'Integrated Skills Review', durationMinutes: 15 },
      { id: 'les_b1_project_presentation_final', title: 'Final Project Presentation', durationMinutes: 15 },
      { id: 'les_rem_pronunciation_th_vw', title: 'TH, V/W minimal pairs', durationMinutes: 15 },
      { id: 'les_rem_listening_slow_clear', title: 'Listening at reduced speed', durationMinutes: 15 },
      { id: 'les_rem_grammar_be_pronouns', title: 'To Be + Pronouns', durationMinutes: 15 },
      { id: 'les_rem_confidence_builder', title: 'Affective filter / false beginner', durationMinutes: 15 },
      { id: 'les_rem_writing_svo', title: 'SVO order + explicit subject', durationMinutes: 15 },
    ],
  },

  // B2 — General Track
  {
    id: 'mod_b2_professional',
    index: 16,
    title: 'Professional Mastery: Nuance, Register, Culture',
    description: 'Domínio profissional: nuances, registro, cultura.',
    cefrLevel: 'B2',
    track: 'General',
    sourceMarkdowns: ['leia-e-escreva-melhor-em-ingles.md', 'frases-ingles-trabalho.md (B2)'],
    lessons: [
      { id: 'les_b2_register_nuance', title: 'Register & Nuance', durationMinutes: 15 },
      { id: 'les_b2_professional_email_advanced', title: 'Advanced Professional Correspondence', durationMinutes: 15 },
      { id: 'les_b2_professional_review', title: 'Writing: Review & Evaluation', durationMinutes: 15 },
      { id: 'les_b2_professional_argument', title: 'Writing: Argumentative Essay', durationMinutes: 15 },
      { id: 'les_b2_professional_summary', title: 'Writing: Summarizing', durationMinutes: 15 },
      { id: 'les_b2_culture_brazil_vs_usa', title: 'BR vs. US Business Culture', durationMinutes: 15 },
    ],
  },

  // B2 — IT Track
  {
    id: 'mod_b2_it_senior',
    index: 17,
    title: 'Senior IT: Mentoring, Architecture Decisions, Strategy, Advanced Patterns, Technical Leadership',
    description: 'Mentoria, decisões de arquitetura, estratégia, padrões avançados, liderança técnica.',
    cefrLevel: 'B2',
    track: 'IT Track',
    sourceMarkdowns: [
      'Ingles-Tecnico-Para-Informatica.md (senior)',
      'Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md',
      'docs/codigolimpo.md',
      'docs/arquitetura-limpa.md',
      'docs/bdd-in-action.md',
      'docs/agile.md',
    ],
    lessons: [
      { id: 'les_b2_it_mentoring', title: 'Mentoring & Knowledge Transfer', durationMinutes: 15 },
      { id: 'les_b2_it_architecture_decisions', title: 'Architecture Decision Records', durationMinutes: 15 },
      { id: 'les_b2_it_strategy', title: 'Technical Strategy Communication', durationMinutes: 15 },
      { id: 'les_b2_it_incident_postmortem', title: 'Incident Postmortems', durationMinutes: 15 },
      { id: 'les_b2_it_jargon_mastery', title: 'Full Jargon Fluency', durationMinutes: 15 },
      { id: 'les_b2_it_rfc_writing', title: 'Writing RFCs & Design Docs', durationMinutes: 15 },
      { id: 'les_b2_it_advanced_patterns', title: 'Advanced Patterns & Anti-Patterns: Legacy Code, Refactoring Strategies', durationMinutes: 15 },
      { id: 'les_b2_it_technical_leadership', title: 'Technical Leadership: Architecture Reviews, Trade-off Communication, Mentoring at Scale', durationMinutes: 15 },
    ],
  },

  // B2 — Both Tracks
  {
    id: 'mod_b2_cert_prep',
    index: 18,
    title: 'Certification Prep: TOEIC/IELTS/CELPE-Bras',
    description: 'Preparação para certificações: TOEIC, IELTS, CELPE-Bras.',
    cefrLevel: 'B2',
    track: 'Both',
    sourceMarkdowns: ['All (exam-focused)'],
    lessons: [
      { id: 'les_b2_toeic_reading', title: 'TOEIC: Reading & Listening', durationMinutes: 15 },
      { id: 'les_b2_toeic_writing', title: 'TOEIC: Writing', durationMinutes: 15 },
      { id: 'les_b2_ielts_writing', title: 'IELTS: Academic Writing', durationMinutes: 15 },
      { id: 'les_b2_celpe_br', title: 'CELPE-Bras: Speaking', durationMinutes: 15 },
      { id: 'les_b2_exam_vocab', title: 'Exam High-Frequency Vocabulary', durationMinutes: 15 },
      { id: 'les_b2_exam_simulations', title: 'Full Exam Simulations', durationMinutes: 15 },
    ],
  },
];

/**
 * Returns modules filtered by track (General, IT Track, or Both).
 * 'Both' modules appear in both tracks.
 */
export function getModulesByTrack(track: 'General' | 'IT Track'): readonly CurriculumModule[] {
  return CURRICULUM_MODULES.filter((m) => m.track === track || m.track === 'Both');
}

/**
 * Returns all lessons across all modules, for progress calculation.
 */
export function getAllLessons(): readonly CurriculumLesson[] {
  return CURRICULUM_MODULES.flatMap((m) => m.lessons);
}

/**
 * Returns the total number of lessons in a track.
 */
export function getTotalLessonsInTrack(track: 'General' | 'IT Track'): number {
  return getModulesByTrack(track).reduce((acc, m) => acc + m.lessons.length, 0);
}

/**
 * Finds a module by its ID.
 */
export function findModuleById(moduleId: string): CurriculumModule | undefined {
  return CURRICULUM_MODULES.find((m) => m.id === moduleId);
}

/**
 * Finds a lesson by its ID across all modules.
 */
export function findLessonById(lessonId: string): { module: CurriculumModule; lesson: CurriculumLesson } | undefined {
  for (const mod of CURRICULUM_MODULES) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return { module: mod, lesson };
  }
  return undefined;
}