import type { CefrLevel } from '@/core/value-objects/cefr-level';

/**
 * Curriculum modules sourced from `specs/curriculum-graph-spec.md` §3.
 * This is the authoritative module catalog used by the backend's CurriculumService.
 * Kept in sync with the spec — when the spec changes, update this file.
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
      { id: 'les_a2_reading_comprehension', title: 'Reading Comprehension Strategies', durationMinutes: 15 },
      { id: 'les_a2_writing_basics', title: 'Writing Basics: Sentences & Paragraphs', durationMinutes: 15 },
      { id: 'les_a2_punctuation', title: 'Punctuation & Capitalization', durationMinutes: 15 },
      { id: 'les_a2_paragraph_structure', title: 'Paragraph Structure & Coherence', durationMinutes: 15 },
      { id: 'les_a2_summarizing', title: 'Summarizing & Paraphrasing', durationMinutes: 15 },
      { id: 'les_a2_vocabulary_expansion', title: 'Vocabulary Expansion Through Reading', durationMinutes: 15 },
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
      { id: 'les_a2_it_terms_basics', title: 'IT Terms Basics: Hardware, Software, Network', durationMinutes: 15 },
      { id: 'les_a2_it_acronyms', title: 'Common IT Acronyms & Abbreviations', durationMinutes: 15 },
      { id: 'les_a2_it_documentation', title: 'Technical Documentation: README, API Docs, Comments', durationMinutes: 15 },
      { id: 'les_a2_it_standups', title: 'Daily Stand-ups: Vocabulary & Patterns', durationMinutes: 15 },
      { id: 'les_a2_it_clean_code', title: 'Clean Code Principles in English', durationMinutes: 15 },
      { id: 'les_a2_it_testing', title: 'Testing Vocabulary: Unit, Integration, E2E', durationMinutes: 15 },
      { id: 'les_a2_it_typescript', title: 'TypeScript: Types, Interfaces, Generics', durationMinutes: 15 },
      { id: 'les_a2_it_algorithms', title: 'Algorithms & Data Structures Vocabulary', durationMinutes: 15 },
      { id: 'les_a2_it_version_control', title: 'Git & Version Control Vocabulary', durationMinutes: 15 },
      { id: 'les_a2_it_debugging', title: 'Debugging & Troubleshooting Language', durationMinutes: 15 },
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
      { id: 'les_a2_it_pr_reviews', title: 'Code Review Comments in English', durationMinutes: 15 },
      { id: 'les_a2_it_ticket_writing', title: 'Writing Effective Tickets & Bug Reports', durationMinutes: 15 },
      { id: 'les_a2_it_incident_reports', title: 'Incident Reports & Postmortems', durationMinutes: 15 },
      { id: 'les_a2_it_meetings', title: 'Technical Meetings: Planning, Retro, Sync', durationMinutes: 15 },
      { id: 'les_a2_it_documentation_writing', title: 'Technical Writing for Developers', durationMinutes: 15 },
      { id: 'les_a2_it_async_comm', title: 'Async Communication: Slack, Email, Comments', durationMinutes: 15 },
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
      { id: 'les_b1_tenses_review', title: 'Tense Review: Present, Past, Future', durationMinutes: 15 },
      { id: 'les_b1_modals', title: 'Modals: Could, Should, Would, Might', durationMinutes: 15 },
      { id: 'les_b1_conditionals', title: 'Conditionals: Zero, First, Second, Third', durationMinutes: 15 },
      { id: 'les_b1_passive_voice', title: 'Passive Voice in Professional Contexts', durationMinutes: 15 },
      { id: 'les_b1_reported_speech', title: 'Reported Speech & Indirect Questions', durationMinutes: 15 },
      { id: 'les_b1_relative_clauses', title: 'Relative Clauses: Defining & Non-defining', durationMinutes: 15 },
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
      { id: 'les_b1_negotiation', title: 'Business Negotiation Language', durationMinutes: 15 },
      { id: 'les_b1_presentations', title: 'Effective Presentations in English', durationMinutes: 15 },
      { id: 'les_b1_leadership', title: 'Leadership & Management Vocabulary', durationMinutes: 15 },
      { id: 'les_b1_meetings_adv', title: 'Advanced Meeting Participation', durationMinutes: 15 },
      { id: 'les_b1_email_adv', title: 'Advanced Professional Emails', durationMinutes: 15 },
      { id: 'les_b1_feedback_coaching', title: 'Giving Feedback & Coaching', durationMinutes: 15 },
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
      { id: 'les_b1_it_architecture', title: 'Software Architecture Discussions', durationMinutes: 15 },
      { id: 'les_b1_it_debugging_adv', title: 'Advanced Debugging & Root Cause Analysis', durationMinutes: 15 },
      { id: 'les_b1_it_code_review', title: 'Advanced Code Review Practices', durationMinutes: 15 },
      { id: 'les_b1_it_ddd', title: 'Domain-Driven Design Vocabulary', durationMinutes: 15 },
      { id: 'les_b1_it_bdd', title: 'Behavior-Driven Development Language', durationMinutes: 15 },
      { id: 'les_b1_it_ux', title: 'UX & Product Design Discussions', durationMinutes: 15 },
      { id: 'les_b1_it_devops', title: 'DevOps & CI/CD Vocabulary', durationMinutes: 15 },
      { id: 'les_b1_it_security', title: 'Application Security Basics', durationMinutes: 15 },
      { id: 'les_b1_it_performance', title: 'Performance & Optimization Talk', durationMinutes: 15 },
      { id: 'les_b1_it_scalability', title: 'Scalability & System Design', durationMinutes: 15 },
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
      { id: 'les_b1_case_study_1', title: 'Case Study: E-commerce Platform', durationMinutes: 15 },
      { id: 'les_b1_case_study_2', title: 'Case Study: SaaS Product Launch', durationMinutes: 15 },
      { id: 'les_b1_simulation_1', title: 'Simulation: Sprint Planning Meeting', durationMinutes: 15 },
      { id: 'les_b1_simulation_2', title: 'Simulation: Production Incident Response', durationMinutes: 15 },
      { id: 'les_b1_project_1', title: 'Project: Technical Proposal Writing', durationMinutes: 15 },
      { id: 'les_b1_project_2', title: 'Project: Architecture Decision Record', durationMinutes: 15 },
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
      { id: 'les_b2_nuance_register', title: 'Nuance & Register in Professional English', durationMinutes: 15 },
      { id: 'les_b2_cultural_awareness', title: 'Cultural Awareness in Global Teams', durationMinutes: 15 },
      { id: 'les_b2_advanced_writing', title: 'Advanced Writing: Reports, Proposals, White Papers', durationMinutes: 15 },
      { id: 'les_b2_speaking_fluency', title: 'Speaking Fluency: Debates, Panels, Interviews', durationMinutes: 15 },
      { id: 'les_b2_listening_adv', title: 'Advanced Listening: Accents, Speed, Implicit Meaning', durationMinutes: 15 },
      { id: 'les_b2_vocabulary_precision', title: 'Vocabulary Precision: Collocations, Idioms, Phrasal Verbs', durationMinutes: 15 },
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
      { id: 'les_b2_it_mentoring', title: 'Mentoring & Coaching Developers', durationMinutes: 15 },
      { id: 'les_b2_it_arch_decisions', title: 'Architecture Decision Records (ADRs)', durationMinutes: 15 },
      { id: 'les_b2_it_strategy', title: 'Technical Strategy & Roadmap Communication', durationMinutes: 15 },
      { id: 'les_b2_it_patterns', title: 'Advanced Patterns: Event Sourcing, CQRS, Microservices', durationMinutes: 15 },
      { id: 'les_b2_it_tech_lead', title: 'Technical Leadership & Team Building', durationMinutes: 15 },
      { id: 'les_b2_it_rfc_writing', title: 'RFC & Design Doc Writing', durationMinutes: 15 },
      { id: 'les_b2_it_technical_leadership', title: 'Technical Leadership in Practice', durationMinutes: 15 },
      { id: 'les_b2_it_organizational', title: 'Organizational Design & Team Topologies', durationMinutes: 15 },
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
      { id: 'les_b2_toeic_listening', title: 'TOEIC Listening Strategies', durationMinutes: 15 },
      { id: 'les_b2_toeic_reading', title: 'TOEIC Reading Strategies', durationMinutes: 15 },
      { id: 'les_b2_ielts_writing', title: 'IELTS Writing Task 1 & 2', durationMinutes: 15 },
      { id: 'les_b2_ielts_speaking', title: 'IELTS Speaking Parts 1-3', durationMinutes: 15 },
      { id: 'les_b2_celpebras', title: 'CELPE-Bras Preparation', durationMinutes: 15 },
      { id: 'les_b2_mock_exam', title: 'Full Mock Exam & Review', durationMinutes: 15 },
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