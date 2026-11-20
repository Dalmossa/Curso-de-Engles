/**
 * A minimal, canonical slice of the content graph for integration specs.
 *
 * `createTestDb()` builds an **empty** schema: it applies the DDL and nothing else. That is the
 * right starting point for a spec about the schema, but learner-scoped and content routes need
 * catalogue rows to have anything to read. This helper seeds real, loader-compatible content:
 * `pack_les_a2_airport_v1` (canonical schema, as in `packs/a2/pack-les-a2-airport.md`) and the
 * catalogue rows it depends on, plus the active FSRS parameter row the `fsrs_states.w_version` FK
 * requires.
 *
 * Item ids, stems, options, keys and skill ids are transcribed from the pack file, not invented:
 * grading and serving are measured against content the loader would actually write.
 *
 * Every statement is `ON CONFLICT … DO NOTHING` / `DO UPDATE` where needed for idempotence, so
 * seeding twice is the same as seeding once and a spec can call it from `beforeAll` without
 * thinking about order.
 */

import type { DataSource } from 'typeorm';

/** `pack_les_a2_airport_v1` — canonical schema (`schema_version = 'canonical'`). */
export const AIRPORT_PACK_ID = 'pack_les_a2_airport_v1';
export const AIRPORT_LESSON_ID = 'les_a2_airport';
export const AIRPORT_MODULE_ID = 'mod_a2_airport';

/** Every item of the pack, in the order `item_ids` declares them (matches pack). */
export const AIRPORT_ITEM_IDS = [
  'grm_airport_immigration_questions_001',
  'rdg_airport_arrivals_notice_001',
  'voc_airport_carry_on_001',
  'rdg_airport_gate_change_001',
  'prn_airport_customs_th_001',
  'grm_psq_airport_prepositions_001',
  'voc_psq_airport_gate_word_001',
] as const;

/** A scored choice item of the pack, used by specs that submit a single answer. */
export const AIRPORT_ITEM_ID = 'grm_airport_immigration_questions_001';
/** Correct key for AIRPORT_ITEM_ID. */
export const AIRPORT_ITEM_KEY = 'B';

/** A second scored choice item (different domain/skill) for multi-submission cases. */
export const AIRPORT_ITEM_ID_2 = 'voc_airport_carry_on_001';
export const AIRPORT_ITEM_KEY_2 = 'D';

/** ASR-scored production item (no key/options choice grading). */
export const AIRPORT_ASR_ITEM_ID = 'prn_airport_customs_th_001';

/** The 21 FSRS-4.5 weights (`src/domain/services/fsrs-scheduler.service.ts` defaults). */
export const FSRS_45_W = [
  0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835,
  0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542,
];
export const FSRS_VERSION = '4.5.0';

interface OptionSeed {
  position: number;
  text: string;
  isKey: boolean;
  distractorType: string | null;
  brPtForm: string | null;
  note: string | null;
}

interface ItemSeed {
  id: string;
  skillIds: string[];
  domainId: string;
  itemType: string;
  scoring: string;
  stem: string;
  key: string | null;
  options: OptionSeed[];
}

const ITEMS: ItemSeed[] = [
  {
    id: 'grm_airport_immigration_questions_001',
    skillIds: ['grammar.present_simple_airport'],
    domainId: 'grammar',
    itemType: 'contextual_selection',
    scoring: 'choice',
    stem:
      'At the transit desk you hear the officer\'s routine questions and the boarding time. Choose the correct sentence.',
    key: 'B',
    options: [
      {
        position: 1,
        text: 'The immigration officer ask about your purpose of visit and the gate close at 5:30.',
        isKey: false,
        distractorType: 'overgeneralization',
        brPtForm: 'O agente de imigração pergunta sobre o motivo da visita e o portão fecha às 17h30.',
        note: 'third-person singular subjects need -s in both verbs; the Brazilian habit of leaving the verb bare transfers to English',
      },
      {
        position: 2,
        text: 'The immigration officer asks about your purpose of visit and the gate closes at 5:30.',
        isKey: true,
        distractorType: null,
        brPtForm: null,
        note: null,
      },
      {
        position: 3,
        text: 'The immigration officer asking about your purpose of visit and the gate closing at 5:30.',
        isKey: false,
        distractorType: 'form_alternative',
        brPtForm: 'O agente de imigração perguntando sobre o motivo da visita e o portão fechando às 17h30.',
        note: 'the Portuguese gerund maps onto -ing, but neither clause has an auxiliary here',
      },
      {
        position: 4,
        text: 'The immigration officer asked about your purpose of visit and the gate close at 5:30.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'O agente de imigração perguntou sobre o motivo da visita e o portão fecha às 17h30.',
        note: 'mixing a past event with a scheduled present makes the gate\'s fixed time inconsistent',
      },
    ],
  },
  {
    id: 'rdg_airport_arrivals_notice_001',
    skillIds: ['reading.airport_notice'],
    domainId: 'reading',
    itemType: 'contextual_selection',
    scoring: 'choice',
    stem:
      'Airport notice — Gate C7: boarding for the connecting flight to Portland starts at 5:30. The arrivals board shows the flight from São Paulo landed on time. After you get off the plane, follow the signs to immigration, then go through security again. Please keep your declaration form ready for customs.\n\nWhat should the traveller do right after getting off the plane?',
    key: 'C',
    options: [
      {
        position: 1,
        text: 'Go straight to gate C7 for boarding.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'Ir direto ao portão C7 para embarcar.',
        note: 'boarding is at 5:30, but the notice puts immigration and security before the gate',
      },
      {
        position: 2,
        text: 'Hand the declaration form to the officer at the gate.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'Entregar o formulário de declaração ao agente no portão.',
        note: 'the notice keeps the declaration form for customs, not for the gate agent',
      },
      {
        position: 3,
        text: 'Follow the signs to immigration.',
        isKey: true,
        distractorType: null,
        brPtForm: null,
        note: null,
      },
      {
        position: 4,
        text: 'Check the departures board for the São Paulo flight.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'Consultar o painel de partidas para o voo de São Paulo.',
        note: 'the arrivals board, not the departures board, shows the São Paulo flight',
      },
    ],
  },
  {
    id: 'voc_airport_carry_on_001',
    skillIds: ['vocab.travel_airport_documents'],
    domainId: 'vocabulary',
    itemType: 'contextual_selection',
    scoring: 'choice',
    stem: 'You are packing for a flight to a conference. Which item is the bag you take with you into the cabin?',
    key: 'D',
    options: [
      {
        position: 1,
        text: 'The baggage claim.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'A retirada de bagagem.',
        note: 'baggage claim is where you collect a checked bag after landing, not a bag you carry',
      },
      {
        position: 2,
        text: 'The overhead bin.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'O compartimento superior.',
        note: 'the overhead bin is the storage space above the seat, not the bag itself',
      },
      {
        position: 3,
        text: 'The transit desk.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'O balcão de trânsito.',
        note: 'the transit desk is a service counter for connecting passengers',
      },
      {
        position: 4,
        text: 'The carry-on.',
        isKey: true,
        distractorType: null,
        brPtForm: null,
        note: null,
      },
    ],
  },
  {
    id: 'rdg_airport_gate_change_001',
    skillIds: ['reading.airport_gate_notice'],
    domainId: 'reading',
    itemType: 'contextual_selection',
    scoring: 'choice',
    stem:
      'Message from the gate agent — Your connecting flight to Portland now boards at gate C9, not C7. Boarding starts at 5:30. Keep your boarding pass and passport ready. After immigration, go through security and follow the signs to the transit desk if you need help.\n\nWhat changed in the agent\'s message?',
    key: 'B',
    options: [
      {
        position: 1,
        text: 'The boarding time, now 5:30.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'O horário de embarque, agora 17h30.',
        note: '5:30 is stated as the boarding time, but the word \'now\' attaches to the gate, not to the time',
      },
      {
        position: 2,
        text: 'The gate, now C9.',
        isKey: true,
        distractorType: null,
        brPtForm: null,
        note: null,
      },
      {
        position: 3,
        text: 'The purpose of the visit, now business.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'O motivo da visita, agora trabalho.',
        note: 'the message never mentions the purpose of visit; it only asks for documents',
      },
      {
        position: 4,
        text: 'The security check, which was removed.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'O controle de segurança, que foi removido.',
        note: 'the message still says to go through security after immigration',
      },
    ],
  },
  {
    id: 'prn_airport_customs_th_001',
    skillIds: ['pronunciation.airport_customs_th'],
    domainId: 'pronunciation',
    itemType: 'minimal_pair',
    scoring: 'asr_phoneme_match',
    stem: 'I go through customs with my declaration form.',
    key: null,
    options: [],
  },
  {
    id: 'grm_psq_airport_prepositions_001',
    skillIds: ['grammar.prepositions_basic'],
    domainId: 'grammar',
    itemType: 'error_correction',
    scoring: 'choice',
    stem: 'Reviewing place prepositions before your connection, which sentence is correct?',
    key: 'B',
    options: [
      {
        position: 1,
        text: 'I waited in the airport and went in immigration.',
        isKey: false,
        distractorType: 'l1_transfer',
        brPtForm: 'Eu esperei no aeroporto e fui na imigração.',
        note: '\'no aeroporto\' maps onto in, but English uses at for a point like an airport; controls take through',
      },
      {
        position: 2,
        text: 'I waited at the airport and went through immigration.',
        isKey: true,
        distractorType: null,
        brPtForm: null,
        note: null,
      },
      {
        position: 3,
        text: 'I waited to the airport and went through security.',
        isKey: false,
        distractorType: 'l1_transfer',
        brPtForm: 'Eu esperei para o aeroporto e passei pela segurança.',
        note: 'to marks motion toward a place; waiting happens at a place',
      },
      {
        position: 4,
        text: 'I waited at the airport and went to security.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'Eu esperei no aeroporto e fui para a segurança.',
        note: 'with go through, the check is a process you pass through, not just a destination',
      },
    ],
  },
  {
    id: 'voc_psq_airport_gate_word_001',
    skillIds: ['vocab.travel_airport_stage'],
    domainId: 'vocabulary',
    itemType: 'contextual_selection',
    scoring: 'choice',
    stem: 'Reviewing core travel words from the previous lesson, which word names the place where you board the plane?',
    key: 'D',
    options: [
      {
        position: 1,
        text: 'The platform.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'A plataforma.',
        note: 'platform is the train or metro word; the airport boarding point is the gate',
      },
      {
        position: 2,
        text: 'The ticket office.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'A bilheteria.',
        note: 'the ticket office sells or changes tickets; boarding happens at the gate',
      },
      {
        position: 3,
        text: 'Baggage claim.',
        isKey: false,
        distractorType: 'semantic_plausible',
        brPtForm: 'A retirada de bagagem.',
        note: 'baggage claim is for collecting a checked bag after landing',
      },
      {
        position: 4,
        text: 'The gate.',
        isKey: true,
        distractorType: null,
        brPtForm: null,
        note: null,
      },
    ],
  },
];

const PACK_MANIFEST = {
  lesson_id: AIRPORT_LESSON_ID,
  pack_id: AIRPORT_PACK_ID,
  authored: {
    reused_items: [],
    new_items: [...AIRPORT_ITEM_IDS],
  },
  inventory: {
    current_lesson: AIRPORT_ITEM_IDS.slice(0, 5),
    prereq_review: AIRPORT_ITEM_IDS.slice(5),
  },
};

/**
 * Seed the catalogue, the airport pack and its items (with options), and the canonical FSRS
 * parameter row. Idempotent: safe to call multiple times in the same schema.
 */
export async function seedContentFixture(ds: DataSource): Promise<void> {
  const query = (sql: string, params: unknown[] = []) => ds.query(sql, params);

  // --- cefr_levels --------------------------------------------------------------------------
  await query(
    `INSERT INTO cefr_levels (code, label, sort_order) VALUES
       ('A1', 'Beginner', 1),
       ('A2', 'Elementary', 2),
       ('B1', 'Intermediate', 3),
       ('B2', 'Upper intermediate', 4),
       ('C1', 'Advanced', 5),
       ('C2', 'Proficient', 6)
     ON CONFLICT (code) DO NOTHING`,
  );

  // --- domains ------------------------------------------------------------------------------
  await query(
    `INSERT INTO domains (id, label) VALUES
       ('grammar', 'Grammar'),
       ('vocabulary', 'Vocabulary'),
       ('listening', 'Listening'),
       ('pronunciation', 'Pronunciation'),
       ('reading', 'Reading'),
       ('speaking', 'Speaking'),
       ('writing', 'Writing'),
       ('vocab', 'Vocabulary')
     ON CONFLICT (id) DO NOTHING`,
  );

  // --- skills referenced by this pack -------------------------------------------------------
  await query(
    `INSERT INTO skills (id, domain_id, label) VALUES
       ('grammar.present_simple_airport', 'grammar', 'Present simple in airport contexts'),
       ('reading.airport_notice', 'reading', 'Reading airport notices'),
       ('vocab.travel_airport_documents', 'vocabulary', 'Airport documents and items'),
       ('reading.airport_gate_notice', 'reading', 'Reading gate messages'),
       ('pronunciation.airport_customs_th', 'pronunciation', 'Airport /θ/ and endings'),
       ('grammar.prepositions_basic', 'grammar', 'Basic prepositions'),
       ('vocab.travel_airport_stage', 'vocabulary', 'Airport places'),
       ('grammar', 'grammar', 'Grammar'),
       ('vocab', 'vocabulary', 'Vocabulary'),
       ('vocabulary', 'vocabulary', 'Vocabulary'),
       ('reading', 'reading', 'Reading'),
       ('pronunciation', 'pronunciation', 'Pronunciation'),
       ('listening', 'listening', 'Listening'),
       ('speaking', 'speaking', 'Speaking'),
       ('writing', 'writing', 'Writing')
     ON CONFLICT (id) DO NOTHING`,
  );

  // --- module + lesson ----------------------------------------------------------------------
  await query(
    `INSERT INTO modules (id, title, cefr_level, track, source_markdowns, sort_order, expected_lessons)
     VALUES ($1, 'Airport & Immigration', 'A2', 'General', '{}'::text[], 900, 1)
     ON CONFLICT (id) DO NOTHING`,
    [AIRPORT_MODULE_ID],
  );
  await query(
    `INSERT INTO lessons (id, module_id, title, cefr_level, reuse_basis, authoring_state, publication_state, permission_state)
     VALUES ($1, $2, 'Airport & Immigration', 'A2', 'authored_material', 'authored', 'publishable', 'not_required')
     ON CONFLICT (id) DO NOTHING`,
    [AIRPORT_LESSON_ID, AIRPORT_MODULE_ID],
  );

  // --- the pack -----------------------------------------------------------------------------
  await query(
    `INSERT INTO packs (id, lesson_id, schema_version, reuse_basis, manifest, item_ids)
     VALUES ($1, $2, 'canonical', 'authored_material', $3::jsonb, $4::text[])
     ON CONFLICT (id) DO UPDATE SET
       lesson_id = EXCLUDED.lesson_id,
       schema_version = EXCLUDED.schema_version,
       reuse_basis = EXCLUDED.reuse_basis,
       manifest = EXCLUDED.manifest,
       item_ids = EXCLUDED.item_ids`,
    [AIRPORT_PACK_ID, AIRPORT_LESSON_ID, JSON.stringify(PACK_MANIFEST), [...AIRPORT_ITEM_IDS]],
  );

  // --- items and options --------------------------------------------------------------------
  for (const item of ITEMS) {
    await query(
      `INSERT INTO items
         (id, skill_ids, lesson_id, cefr_level, domain_id, item_type, modality, scoring, stem, key, p_random, provenance_kind)
       VALUES ($1, $2::text[], $3, 'A2', $4, $5, 'text', $6, $7, $8, 0.2500, 'authored')
       ON CONFLICT (id) DO UPDATE SET
         skill_ids = EXCLUDED.skill_ids,
         lesson_id = EXCLUDED.lesson_id,
         domain_id = EXCLUDED.domain_id,
         item_type = EXCLUDED.item_type,
         scoring = EXCLUDED.scoring,
         stem = EXCLUDED.stem,
         key = EXCLUDED.key`,
      [
        item.id,
        item.skillIds,
        AIRPORT_LESSON_ID,
        item.domainId,
        item.itemType,
        item.scoring,
        item.stem,
        item.key,
      ],
    );

    if (item.options.length > 0) {
      for (const opt of item.options) {
        await query(
          `INSERT INTO item_options (item_id, position, option_text, is_key, distractor_type, br_pt_form, note)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (item_id, position) DO UPDATE SET
             option_text = EXCLUDED.option_text,
             is_key = EXCLUDED.is_key,
             distractor_type = EXCLUDED.distractor_type,
             br_pt_form = EXCLUDED.br_pt_form,
             note = EXCLUDED.note`,
          [item.id, opt.position, opt.text, opt.isKey, opt.distractorType, opt.brPtForm, opt.note],
        );
      }
    }
  }

  // --- canonical FSRS parameter row (FK target for fsrs_states.w_version) -------------------
  await query(
    `INSERT INTO fsrs_parameters (w_version, w, decay, factor, is_active)
     VALUES ($1, $2::jsonb, 0.1542, 0.9803, true)
     ON CONFLICT (w_version) DO UPDATE SET is_active = true`,
    [FSRS_VERSION, JSON.stringify(FSRS_45_W)],
  );
}
