import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * P0.4 — Create schema v1.0.0 (ERD §6, table-for-table).
 *
 * Single source of truth: this file's `SCHEMA_STATEMENTS` exports the exact DDL that
 * `scripts/migration-check.mjs` runs against PGlite (local) and PostgreSQL 16 (CI).
 * The migration class only replays the same statements through the QueryRunner.
 *
 * Decisions (ADR-019):
 *  - Four named enum types materialise four §7 vocabularies:
 *      its_event_type           <- append_only_events.event_type (closed; CONSTITUTION §4.6)
 *      its_item_lifecycle_state <- items.lifecycle_state        (assessment §7)
 *      its_fsrs_review_state    <- fsrs_states.state            (stats §6.1)
 *      its_pack_layer           <- practice_attempts.pack_layer (post-lesson §1)
 *    Entities keep `varchar` metadata: TypeORM round-trips enum labels as text and does
 *    not diff column types when `synchronize: false` (ADR-014).
 *  - Triggers: I-3 option-distinctness (normalized bold/case), D-5 ≥2 speakers (deferred),
 *    G-8 skill_theta.state discriminator, and the CONSTITUTION §4.6 hash chain with a
 *    pg_advisory_xact_lock serializing concurrent appends.
 *  - RLS §9: 15 learner-scoped tables, one DO block looping the (table, predicate) pairs —
 *    ADR-003's learner_isolation / admin_bypass / worker_access on every row. The predicate
 *    uses `current_setting('app.current_learner_id', true)` (missing_ok) wrapped in
 *    `nullif(…, '')`. The GUC's real lifecycle has two unset-valued states, not one: it is
 *    `NULL` on a session that never set it, and `''` on every connection after the first
 *    transaction that did — COMMIT and ROLLBACK alike (measured, ADR-026 §4). `nullif`
 *    collapses both to NULL, so a context-less statement is refused the same way everywhere:
 *    fail-closed (SELECT sees nothing, INSERT is rejected). Without it the bare `::uuid` cast
 *    on the post-transaction `''` raises `invalid input syntax for type uuid: ""`, a failure
 *    mode that depends on how many transactions preceded it. The strict two-arg form would
 *    raise a hard error and break tooling. Deviation recorded in ADR-019 §Implementation notes.
 *  - Grants: app = DML minus WORM tables; worker = DML minus WORM; admin = ALL.
 */

export const SCHEMA_STATEMENTS: string[] = [
  // ------------------------------------------------------------------
  // 0. Named enum types (ADR-019)
  // ------------------------------------------------------------------
  `CREATE TYPE its_event_type AS ENUM (
    'item_response','diagnostic_run','session_start','session_end',
    'auth_success','auth_failure','access_denied',
    'validation_failure','consent_granted','consent_withdrawn',
    'data_export','data_erasure'
  )`,

  `CREATE TYPE its_item_lifecycle_state AS ENUM (
    'authored','drafted','peer_reviewed','expert_anchored',
    'partially_calibrated','empirically_calibrated','serving',
    'rejected','revision','retired'
  )`,

  `CREATE TYPE its_fsrs_review_state AS ENUM ('new','learning','review','relearning')`,

  `CREATE TYPE its_pack_layer AS ENUM ('L1','L2','L3')`,

  // ------------------------------------------------------------------
  // 1. Reference & Curriculum Catalog (ERD §6.1)
  // ------------------------------------------------------------------
  `CREATE TABLE cefr_levels (
    code            VARCHAR(3) PRIMARY KEY CHECK (code ~ '^(A|B|C)[12]$'),
    label           VARCHAR(50) NOT NULL,
    sort_order      INT NOT NULL UNIQUE,
    theta_threshold NUMERIC(4,2)
  )`,

  `CREATE TABLE domains (
    id      VARCHAR(20) PRIMARY KEY,
    label   VARCHAR(50) NOT NULL,
    tracked BOOLEAN NOT NULL DEFAULT true
  )`,

  `CREATE TABLE skills (
    id          VARCHAR(50) PRIMARY KEY,
    domain_id   VARCHAR(20) NOT NULL REFERENCES domains(id),
    label       VARCHAR(100) NOT NULL,
    description TEXT
  )`,

  `CREATE TABLE modules (
    id               VARCHAR(50) PRIMARY KEY,
    title            VARCHAR(200) NOT NULL,
    cefr_level       VARCHAR(3) NOT NULL REFERENCES cefr_levels(code),
    track            VARCHAR(10) NOT NULL CHECK (track IN ('General','IT','Both')),
    source_markdowns TEXT[] NOT NULL,
    sort_order       INT NOT NULL,
    expected_lessons INT NOT NULL,
    UNIQUE (track, cefr_level, sort_order)
  )`,

  `CREATE TABLE lessons (
    id                VARCHAR(50) PRIMARY KEY,
    module_id         VARCHAR(50) NOT NULL REFERENCES modules(id),
    title             VARCHAR(200) NOT NULL,
    cefr_level        VARCHAR(3) NOT NULL REFERENCES cefr_levels(code),
    reuse_basis       VARCHAR(30) NOT NULL
      CHECK (reuse_basis IN ('cite_only','adapt_with_attribution','adapt_requires_permission')),
    authoring_state   VARCHAR(20) NOT NULL
      CHECK (authoring_state IN ('authored','specified','unauthored','blocked','withdrawn')),
    publication_state VARCHAR(32) NOT NULL
      CHECK (publication_state IN ('publishable','restricted_pending_permission','not_publishable')),
    permission_state  VARCHAR(20) NOT NULL
      CHECK (permission_state IN ('not_required','requested','granted','refused')),
    source_ref        TEXT,
    body              JSONB NOT NULL DEFAULT '{"phases":[],"learner_model":null}',  -- ADR-027 §5: the lesson's four authored phases + learner model
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE lesson_prerequisites (
    lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    prereq_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    edge_type VARCHAR(20) NOT NULL DEFAULT 'prerequisite'
      CHECK (edge_type IN ('prerequisite','alternative_path','remediation','enrichment')),
    PRIMARY KEY (lesson_id, prereq_id),
    CHECK (lesson_id <> prereq_id)
  )`,

  `CREATE TABLE skill_prerequisite (
    lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    skill_id  VARCHAR(50) NOT NULL REFERENCES skills(id),
    weight    NUMERIC(4,3) NOT NULL DEFAULT 1.000,
    PRIMARY KEY (lesson_id, skill_id)
  )`,

  `CREATE TABLE packs (
    id             VARCHAR(100) PRIMARY KEY,
    lesson_id      VARCHAR(50) NOT NULL REFERENCES lessons(id),
    schema_version VARCHAR(20) NOT NULL CHECK (schema_version IN ('canonical','legacy_v1')),
    reuse_basis    VARCHAR(30) NOT NULL
      CHECK (reuse_basis IN ('cite_only','adapt_with_attribution','adapt_requires_permission')),
    manifest       JSONB NOT NULL,
    item_ids       TEXT[] NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  // ------------------------------------------------------------------
  // 2. Listening Corpus (ERD §6.2)
  // ------------------------------------------------------------------
  `CREATE TABLE voices (
    id      VARCHAR(20) PRIMARY KEY,
    label   VARCHAR(50) NOT NULL,
    accent  VARCHAR(50) NOT NULL,
    gender  VARCHAR(10),
    active  BOOLEAN NOT NULL DEFAULT true
  )`,

  `CREATE TABLE speakers (
    id           VARCHAR(50) PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    gender       VARCHAR(10)
  )`,

  `CREATE TABLE dialogues (
    id               VARCHAR(50) PRIMARY KEY,
    title            VARCHAR(200) NOT NULL,
    cefr_level       VARCHAR(3) NOT NULL REFERENCES cefr_levels(code),
    status           VARCHAR(20) NOT NULL CHECK (status IN ('shipped','shadow_only')),
    duration_seconds INT NOT NULL CHECK (duration_seconds BETWEEN 45 AND 120),
    transcript       TEXT NOT NULL,  -- ADR-027 §3b: the authored transcript block; clips are derived from it
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE dialogue_speakers (
    dialogue_id VARCHAR(50) NOT NULL REFERENCES dialogues(id) ON DELETE CASCADE,
    speaker_id  VARCHAR(50) NOT NULL REFERENCES speakers(id),
    voice_id    VARCHAR(20) NOT NULL REFERENCES voices(id),
    PRIMARY KEY (dialogue_id, speaker_id),
    UNIQUE (dialogue_id, voice_id)
  )`,

  `CREATE TABLE clips (
    id              VARCHAR(60) PRIMARY KEY,
    dialogue_id     VARCHAR(50) NOT NULL REFERENCES dialogues(id) ON DELETE CASCADE,
    speaker_id      VARCHAR(50) NOT NULL REFERENCES speakers(id),
    sort_index      SMALLINT NOT NULL,
    utterance_text  TEXT NOT NULL,
    phonetic_target TEXT,
    UNIQUE (dialogue_id, sort_index)
  )`,

  `CREATE TABLE clip_renders (
    id             BIGSERIAL PRIMARY KEY,
    clip_id        VARCHAR(60) NOT NULL REFERENCES clips(id) ON DELETE CASCADE,
    take           SMALLINT NOT NULL,
    voice_id       VARCHAR(20) NOT NULL REFERENCES voices(id),
    rate           NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (rate IN (1.00, 0.75)),
    duration_s     NUMERIC(5,2) NOT NULL,
    uri            TEXT NOT NULL,
    ear_checked_at TIMESTAMPTZ,
    ear_checked_by TEXT,
    UNIQUE (clip_id, take),
    -- ADR-028 §6: catalogue renders live under 'catalog/', never 'audio/' (the prefix
    -- iac-spec.md §2.4 expires in 30 days) and never 'temp/' (1 day). The consequence of
    -- getting this wrong is silent deletion with nothing to see at the time, so the database —
    -- the one place the application cannot bypass — refuses it at insert.
    CONSTRAINT clip_renders_uri_catalog_only
      CHECK (uri NOT LIKE 'audio/%' AND uri NOT LIKE 'temp/%')
  )`,

  // ------------------------------------------------------------------
  // 3. Item Bank (ERD §6.3)
  // ------------------------------------------------------------------
  `CREATE TABLE items (
    id             VARCHAR(100) PRIMARY KEY,
    schema_version VARCHAR(10) NOT NULL DEFAULT '2.0',
    skill_ids      TEXT[] NOT NULL,
    lesson_id      VARCHAR(50) REFERENCES lessons(id),
    dialogue_id    VARCHAR(50) REFERENCES dialogues(id),
    slot_number    SMALLINT,
    clip_ids       TEXT[],
    cefr_level     VARCHAR(3) NOT NULL REFERENCES cefr_levels(code),
    domain_id      VARCHAR(20) NOT NULL REFERENCES domains(id),
    CHECK (domain_id <> 'coherence'),
    item_type      VARCHAR(25) NOT NULL
      CHECK (item_type IN ('gap_fill','error_correction','form_selection','definition_match',
                           'register_selection','scanning','cloze','matching','ordering',
                           'contextual_selection','minimal_pair','production')),
    listening_kind VARCHAR(20)
      CHECK (listening_kind IN ('lst_gist','lst_detail','lst_inference','lst_lexical',
                                'lst_pragmatic','lst_pron_minpair')),
    listening_tier CHAR(2) CHECK (listening_tier IN ('L1','L2')),
    modality       VARCHAR(10) NOT NULL CHECK (modality IN ('text','listening','speaking')),
    scoring        VARCHAR(25) NOT NULL DEFAULT 'choice'
      CHECK (scoring IN ('choice','free_text','asr_phoneme_match')),
    stem           TEXT NOT NULL,
    key            TEXT,
    answer_variants TEXT[],
    p_random       NUMERIC(5,4) NOT NULL CHECK (p_random > 0 AND p_random <= 1),
    br_pt_tags     TEXT[],
    br_pt_form_state VARCHAR(40) NOT NULL DEFAULT 'applicable'
      CHECK (br_pt_form_state IN ('applicable','not_applicable_no_distractor_set')),
    irt_model      VARCHAR(5) NOT NULL DEFAULT '2PL',
    a              NUMERIC(6,4),
    b              NUMERIC(7,4),
    c              NUMERIC(5,4) NOT NULL DEFAULT 0.0000,
    a_se           NUMERIC(6,4),
    b_se           NUMERIC(6,4),
    n_responses    INT NOT NULL DEFAULT 0,
    calibration_status VARCHAR(25)
      CHECK (calibration_status IN ('expert_anchored','partially_calibrated','empirically_calibrated')),
    anchored_by    TEXT[],
    last_refit     TIMESTAMPTZ,
    infit_mnsq     NUMERIC(5,3),
    outfit_mnsq    NUMERIC(5,3),
    point_biserial NUMERIC(5,3),
    difficulty_p   NUMERIC(5,3),
    dif_flags      JSONB NOT NULL DEFAULT '[]',
    retired        BOOLEAN NOT NULL DEFAULT false,
    retired_reason TEXT,
    lifecycle_state its_item_lifecycle_state NOT NULL DEFAULT 'authored',
    provenance_kind VARCHAR(30) NOT NULL
      CHECK (provenance_kind IN ('source_derived','authored','authored_reviewed_corpus')),
    provenance_source_file    TEXT,
    provenance_source_locator TEXT,
    reviewed_by   TEXT,
    review_due    DATE,
    tts_required  BOOLEAN NOT NULL DEFAULT false,
    tts_refs      TEXT[] NOT NULL DEFAULT '{}',
    assist_tts_refs TEXT[] NOT NULL DEFAULT '{}',
    estimated_time_sec INT,
    authored_at   TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (listening_kind IS NULL OR modality = 'listening'),
    CHECK (listening_tier IS NULL OR modality = 'listening')
  )`,

  `CREATE TABLE item_options (
    id             BIGSERIAL PRIMARY KEY,
    item_id        VARCHAR(100) NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    position       SMALLINT NOT NULL CHECK (position BETWEEN 1 AND 6),
    option_text    TEXT NOT NULL,
    is_key         BOOLEAN NOT NULL DEFAULT false,
    distractor_type VARCHAR(25)
      CHECK (distractor_type IN ('l1_transfer','overgeneralization','semantic_plausible',
                                 'form_alternative','register_mismatch','negative_control')),
    br_pt_form     TEXT,
    note           TEXT,
    CHECK (is_key OR note IS NOT NULL),
    expected_share NUMERIC(4,3),
    UNIQUE (item_id, position)
  )`,

  // ------------------------------------------------------------------
  // 4. Statistics & refit targets (ERD §6.4)
  // ------------------------------------------------------------------
  `CREATE TABLE fsrs_parameters (
    w_version VARCHAR(40) PRIMARY KEY,
    w         JSONB NOT NULL CHECK (jsonb_array_length(w) = 21),
    decay     NUMERIC(6,4) NOT NULL,
    factor    NUMERIC(6,4) NOT NULL,
    n_reviews INT NOT NULL DEFAULT 0,
    fitted_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT false
  )`,

  `CREATE TABLE bkt_skill_params (
    skill_id      VARCHAR(50) PRIMARY KEY REFERENCES skills(id),
    p_l0          NUMERIC(4,3) NOT NULL DEFAULT 0.15,
    p_t           NUMERIC(4,3) NOT NULL DEFAULT 0.25,
    p_s           NUMERIC(4,3) NOT NULL DEFAULT 0.10,
    source        VARCHAR(20) NOT NULL CHECK (source IN ('judgement_anchor','fitted')),
    fitted_at     TIMESTAMPTZ,
    model_version VARCHAR(30)
  )`,

  // ------------------------------------------------------------------
  // 5. Learner Model & Compliance (ERD §6.5)
  // ------------------------------------------------------------------
  `CREATE TABLE learners (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_active_at TIMESTAMPTZ,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE consent_records (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id   UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    purpose      VARCHAR(60) NOT NULL,
    version      VARCHAR(20) NOT NULL,
    granted_at   TIMESTAMPTZ,
    withdrawn_at TIMESTAMPTZ,
    legal_basis  VARCHAR(40) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (granted_at IS NOT NULL OR withdrawn_at IS NOT NULL)
  )`,

  `CREATE TABLE learner_mastery (
    learner_id     UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    skill_id       VARCHAR(50) NOT NULL REFERENCES skills(id),
    p_know         NUMERIC(4,3) NOT NULL CHECK (p_know BETWEEN 0 AND 1),
    n_obs          INT NOT NULL DEFAULT 0,
    distinct_days  INT NOT NULL DEFAULT 0,
    spaced_obs     INT NOT NULL DEFAULT 0,
    last_practice_at TIMESTAMPTZ,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (learner_id, skill_id)
  )`,

  `CREATE TABLE theta_estimates (
    learner_id     UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    skill_id       VARCHAR(50) NOT NULL REFERENCES skills(id),
    theta          NUMERIC(6,3) NOT NULL,
    se             NUMERIC(6,3) NOT NULL,
    ci95_lower     NUMERIC(6,3) NOT NULL,
    ci95_upper     NUMERIC(6,3) NOT NULL,
    evidence_count INT NOT NULL DEFAULT 0,
    last_updated   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (learner_id, skill_id)
  )`,

  `CREATE TABLE fsrs_states (
    learner_id UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    item_id    VARCHAR(100) NOT NULL REFERENCES items(id),
    stability  NUMERIC(10,3) NOT NULL CHECK (stability >= 0),
    difficulty NUMERIC(4,3) NOT NULL CHECK (difficulty BETWEEN 0 AND 10),
    state      its_fsrs_review_state NOT NULL,
    grade      SMALLINT CHECK (grade BETWEEN 1 AND 4),
    hint_used  BOOLEAN NOT NULL DEFAULT false,
    last_review TIMESTAMPTZ NOT NULL DEFAULT now(),
    due_date   DATE NOT NULL,
    w_version  VARCHAR(40) NOT NULL REFERENCES fsrs_parameters(w_version),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (learner_id, item_id)
  )`,

  `CREATE TABLE error_log (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id   UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    skill_id     VARCHAR(50) NOT NULL REFERENCES skills(id),
    pattern      VARCHAR(60) NOT NULL
      CHECK (pattern IN ('null_subject','eventually','responsible_of','th_stopped',
                         'w_v_interference','false_cognate_activated',
                         'spelling_no_epenthetic_vowel','article_omission')),
    produced_form TEXT NOT NULL,
    frequency    INT NOT NULL DEFAULT 1,
    severity     NUMERIC(3,2) NOT NULL CHECK (severity BETWEEN 0 AND 1),
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE affective_signals (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id  UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    kind        VARCHAR(30) NOT NULL
      CHECK (kind IN ('skip_streak','hint_seeking','session_abandon',
                      'time_on_task_spike','rapid_guessing')),
    observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    strength    NUMERIC(3,2) NOT NULL CHECK (strength BETWEEN 0 AND 1)
  )`,

  // ------------------------------------------------------------------
  // 6. Delivery (ERD §6.6)
  // ------------------------------------------------------------------
  `CREATE TABLE sessions (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at   TIMESTAMPTZ
  )`,

  `CREATE TABLE practice_attempts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id   UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    learner_id   UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    pack_layer   its_pack_layer NOT NULL,
    pack_id      VARCHAR(100) REFERENCES packs(id),
    CHECK ((pack_layer = 'L1') = (pack_id IS NOT NULL)),
    started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    total_items  INT NOT NULL,
    correct_count INT NOT NULL
  )`,

  `CREATE TABLE item_responses (
    id           BIGSERIAL PRIMARY KEY,
    attempt_id   UUID NOT NULL REFERENCES practice_attempts(id) ON DELETE CASCADE,
    learner_id   UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    item_id      VARCHAR(100) NOT NULL REFERENCES items(id),
    response     TEXT,
    correct      BOOLEAN,
    response_time_ms INT NOT NULL,
    confidence   NUMERIC(3,2),
    bkt_prior    NUMERIC(4,3) NOT NULL,
    bkt_posterior NUMERIC(4,3) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE listening_attempts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id   UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    learner_id   UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    dialogue_id  VARCHAR(50) NOT NULL REFERENCES dialogues(id),
    started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    total_slots  INT NOT NULL,
    correct_count INT NOT NULL
  )`,

  `CREATE TABLE slot_responses (
    id             BIGSERIAL PRIMARY KEY,
    attempt_id     UUID NOT NULL REFERENCES listening_attempts(id) ON DELETE CASCADE,
    learner_id     UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    item_id        VARCHAR(100) NOT NULL REFERENCES items(id),
    response_letter CHAR(1) CHECK (response_letter IN ('A','B','C','D')),
    correct        BOOLEAN NOT NULL,
    response_time_ms INT NOT NULL,
    voice_id       VARCHAR(20) NOT NULL REFERENCES voices(id),
    clip_id        VARCHAR(60) NOT NULL REFERENCES clips(id),
    assist_used    BOOLEAN NOT NULL DEFAULT false,
    replays        SMALLINT NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  // ------------------------------------------------------------------
  // 7. Diagnostic / Placement (ERD §6.7)
  // ------------------------------------------------------------------
  `CREATE TABLE diagnostic_results (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id     UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    form_version   VARCHAR(30) NOT NULL DEFAULT 'diagnostic_form_v1',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    theta          NUMERIC(6,3) NOT NULL,
    se_statistical NUMERIC(6,3) NOT NULL,
    se_parameter   NUMERIC(6,3) NOT NULL,
    se_effective   NUMERIC(6,3) NOT NULL,
    precision_label VARCHAR(20) NOT NULL,
    ci95_lower     NUMERIC(6,3) NOT NULL,
    ci95_upper     NUMERIC(6,3) NOT NULL,
    cefr           VARCHAR(3) NOT NULL REFERENCES cefr_levels(code),
    start_cefr     VARCHAR(3) NOT NULL REFERENCES cefr_levels(code),
    below_scale    BOOLEAN NOT NULL DEFAULT false,
    start_node     VARCHAR(50) NOT NULL REFERENCES lessons(id),
    remediation_nodes TEXT[] NOT NULL DEFAULT '{}',
    CHECK (cardinality(remediation_nodes) <= 3),
    profile        VARCHAR(40),
    stopping_rule  VARCHAR(50) NOT NULL,
    bkt_priors_override JSONB,
    skill_theta    JSONB NOT NULL
  )`,

  `CREATE TABLE diagnostic_responses (
    id             BIGSERIAL PRIMARY KEY,
    diagnostic_id  UUID NOT NULL REFERENCES diagnostic_results(id) ON DELETE CASCADE,
    learner_id     UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    item_id        VARCHAR(100) NOT NULL REFERENCES items(id),
    skill_id       VARCHAR(50) NOT NULL REFERENCES skills(id),
    correct        BOOLEAN NOT NULL,
    response_time_ms INT NOT NULL,
    theta_after    NUMERIC(6,3) NOT NULL,
    se_after       NUMERIC(6,3) NOT NULL
  )`,

  // ------------------------------------------------------------------
  // 8. Append-only event log (ERD §6.8) — created last (FK targets exist)
  // ------------------------------------------------------------------
  `CREATE TABLE append_only_events (
    seq         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id    UUID NOT NULL DEFAULT gen_random_uuid(),
    learner_id  UUID REFERENCES learners(id) ON DELETE SET NULL,
    session_id  UUID REFERENCES sessions(id) ON DELETE SET NULL,
    lesson_id   VARCHAR(50),
    item_id     VARCHAR(100),
    skill_ids   TEXT[],
    event_type  its_event_type NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    payload     JSONB NOT NULL,
    prev_hash   BYTEA,
    row_hash    BYTEA NOT NULL
  )`,

  // ------------------------------------------------------------------
  // 9. Indexes (ERD §6.9 — every FK leads with the RLS predicate column)
  // ------------------------------------------------------------------
  `CREATE UNIQUE INDEX uq_append_only_events_event_id ON append_only_events(event_id)`,
  `CREATE UNIQUE INDEX uq_item_options_one_key ON item_options(item_id) WHERE is_key`,
  `CREATE INDEX idx_items_skill_ids    ON items USING GIN (skill_ids)`,
  `CREATE INDEX idx_packs_item_ids     ON packs USING GIN (item_ids)`,
  `CREATE INDEX idx_fsrs_due_queue     ON fsrs_states (due_date)`,
  `CREATE INDEX idx_fsrs_learner_item  ON fsrs_states (learner_id, item_id)`,
  `CREATE INDEX idx_sessions_learner   ON sessions (learner_id, started_at DESC)`,
  `CREATE INDEX idx_attempts_learner   ON practice_attempts (learner_id, started_at DESC)`,
  `CREATE INDEX idx_item_resp_learner  ON item_responses (learner_id, created_at DESC)`,
  `CREATE INDEX idx_item_resp_attempt  ON item_responses (attempt_id)`,
  `CREATE INDEX idx_listen_att_learner ON listening_attempts (learner_id, started_at DESC)`,
  `CREATE INDEX idx_slot_resp_attempt  ON slot_responses (attempt_id)`,
  `CREATE INDEX idx_slot_resp_learner  ON slot_responses (learner_id, created_at DESC)`,
  `CREATE INDEX idx_diag_resp_run      ON diagnostic_responses (diagnostic_id)`,
  `CREATE INDEX idx_diag_resp_learner  ON diagnostic_responses (learner_id)`,
  `CREATE INDEX idx_diag_learner       ON diagnostic_results (learner_id, created_at DESC)`,
  `CREATE INDEX idx_error_log_learner  ON error_log (learner_id, skill_id, last_seen_at DESC)`,
  `CREATE INDEX idx_events_learner     ON append_only_events (learner_id, occurred_at DESC)`,
  `CREATE INDEX idx_events_type        ON append_only_events (event_type, occurred_at DESC)`,
  `CREATE INDEX idx_items_lesson       ON items (lesson_id)`,
  `CREATE INDEX idx_items_dialogue     ON items (dialogue_id, slot_number)`,
  `CREATE INDEX idx_item_options_item  ON item_options (item_id)`,
  `CREATE INDEX idx_clips_dialogue     ON clips (dialogue_id)`,
  `CREATE INDEX idx_renders_clip       ON clip_renders (clip_id)`,
  `CREATE INDEX idx_dspeakers_speaker  ON dialogue_speakers (speaker_id)`,
  `CREATE INDEX idx_lesson_prereq_prq  ON lesson_prerequisites (prereq_id)`,
  `CREATE INDEX idx_skill_prereq_skill ON skill_prerequisite (skill_id)`,

  // ------------------------------------------------------------------
  // 10. Triggers [db] (domain-model I-3, D-5, G-8; ERD §10)
  // ------------------------------------------------------------------
  // I-3 [db]: option texts distinct after bold stripping (case-sensitive; §2.2 G-Q3).
  // Bold stripping = normalize '*' runs to a single marker, then compare per I-3.
  `CREATE FUNCTION fn_item_options_distinct() RETURNS trigger AS $$
  DECLARE
    norm TEXT;
  BEGIN
    norm := regexp_replace(NEW.option_text, '[*]+', '*', 'g');
    IF EXISTS (
      SELECT 1 FROM item_options o
      WHERE o.item_id = NEW.item_id
        AND o.id <> NEW.id
        AND regexp_replace(o.option_text, '[*]+', '*', 'g') = norm
    ) THEN
      RAISE EXCEPTION 'I-3 [db]: duplicate normalized option_text for item %', NEW.item_id;
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql`,

  `CREATE TRIGGER trg_item_options_distinct
    BEFORE INSERT OR UPDATE OF option_text ON item_options
    FOR EACH ROW EXECUTE FUNCTION fn_item_options_distinct()`,

  // D-5 [db]: conversational register needs >= 2 distinct speakers — cross-row, so it is
  // a DEFERRED constraint trigger: both speakers may be inserted in one transaction.
  `CREATE FUNCTION fn_dialogue_min_two_speakers() RETURNS trigger AS $$
  DECLARE
    dlg VARCHAR(50);
  BEGIN
    IF TG_OP = 'DELETE' THEN
      dlg := OLD.dialogue_id;
    ELSE
      dlg := NEW.dialogue_id;
    END IF;
    IF (SELECT count(DISTINCT speaker_id) FROM dialogue_speakers WHERE dialogue_id = dlg) < 2 THEN
      RAISE EXCEPTION 'D-5 [db]: dialogue % requires >= 2 distinct speakers', dlg;
    END IF;
    RETURN NULL;
  END;
  $$ LANGUAGE plpgsql`,

  `CREATE CONSTRAINT TRIGGER trg_dialogue_min_two_speakers
    AFTER INSERT OR UPDATE OR DELETE ON dialogue_speakers
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION fn_dialogue_min_two_speakers()`,

  // G-8 [db]: skill_theta entries must carry the explicit three-state discriminator.
  `CREATE FUNCTION fn_diagnostic_skill_theta_state() RETURNS trigger AS $$
  DECLARE
    entry RECORD;
  BEGIN
    FOR entry IN SELECT * FROM jsonb_each(NEW.skill_theta) LOOP
      IF NOT (entry.value ->> 'state')::text IN ('point_estimate','band','insufficient_evidence') THEN
        RAISE EXCEPTION 'G-8 [db]: invalid skill_theta.state for skill %', entry.key;
      END IF;
    END LOOP;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql`,

  `CREATE TRIGGER trg_diagnostic_skill_theta_state
    BEFORE INSERT OR UPDATE OF skill_theta ON diagnostic_results
    FOR EACH ROW EXECUTE FUNCTION fn_diagnostic_skill_theta_state()`,

  // CONSTITUTION §4.6 hash chain: row N+1.prev_hash = row N.row_hash; sha256 over the
  // serialized row. pg_advisory_xact_lock serializes concurrent appends so the chain
  // cannot fork under load (P2.2 proves it under concurrency; the mechanism is here).
  `CREATE FUNCTION fn_append_only_hash_chain() RETURNS trigger AS $$
  DECLARE
    last_hash BYTEA;
  BEGIN
    PERFORM pg_advisory_xact_lock(hashtext('its_platform_append_only_chain'));
    SELECT row_hash INTO last_hash FROM append_only_events ORDER BY seq DESC LIMIT 1;
    NEW.prev_hash := last_hash;
    NEW.row_hash := sha256(convert_to(
      coalesce(encode(NEW.prev_hash, 'hex'), '') || '|' ||
      NEW.event_id::text || '|' || coalesce(NEW.learner_id::text, '') || '|' ||
      coalesce(NEW.session_id::text, '') || '|' || coalesce(NEW.lesson_id, '') || '|' ||
      coalesce(NEW.item_id, '') || '|' || coalesce(array_to_string(NEW.skill_ids, ','), '') || '|' ||
      NEW.event_type::text || '|' || NEW.occurred_at::text || '|' || NEW.payload::text,
      'UTF8'));
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql`,

  `CREATE TRIGGER trg_append_only_hash_chain
    BEFORE INSERT ON append_only_events
    FOR EACH ROW EXECUTE FUNCTION fn_append_only_hash_chain()`,

  // ------------------------------------------------------------------
  // 11. Roles (ADR-003)
  // ------------------------------------------------------------------
  `CREATE ROLE its_platform_app NOLOGIN`,
  `CREATE ROLE its_platform_admin NOLOGIN`,
  `CREATE ROLE its_platform_worker NOLOGIN`,

  // ------------------------------------------------------------------
  // 12. RLS (§9) — 15 learner-scoped tables, ADR-003 template
  // ------------------------------------------------------------------
  // X-3 first: immutability is a grant, not a policy — WORM before the policies exist.
  `REVOKE UPDATE, DELETE ON append_only_events FROM its_platform_app, its_platform_worker`,
  `REVOKE UPDATE, DELETE ON consent_records FROM its_platform_app, its_platform_worker`,
  // I-2: identifiers immutable — no UPDATE on items.id (column-level), no DELETE on items.
  `REVOKE DELETE ON items FROM its_platform_app, its_platform_worker`,
  `REVOKE UPDATE (id) ON items FROM its_platform_app, its_platform_worker`,

  `DO $$
  DECLARE
    t TEXT;
    pred TEXT;
  BEGIN
    FOREACH t IN ARRAY ARRAY[
      'learners','sessions','learner_mastery','theta_estimates','fsrs_states',
      'practice_attempts','item_responses','listening_attempts','slot_responses',
      'diagnostic_results','diagnostic_responses','error_log','affective_signals',
      'consent_records','append_only_events'
    ] LOOP
      pred := CASE WHEN t = 'learners' THEN 'id' ELSE 'learner_id' END;
      EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format(
        'CREATE POLICY learner_isolation ON %I FOR ALL TO its_platform_app
         USING (%I = nullif(current_setting(''app.current_learner_id'', true), '''')::uuid)
         WITH CHECK (%I = nullif(current_setting(''app.current_learner_id'', true), '''')::uuid)',
        t, pred, pred);
      EXECUTE format(
        'CREATE POLICY admin_bypass ON %I FOR ALL TO its_platform_admin USING (true) WITH CHECK (true)',
        t);
      EXECUTE format(
        'CREATE POLICY worker_access ON %I FOR ALL TO its_platform_worker USING (true) WITH CHECK (true)',
        t);
    END LOOP;
  END $$`,

  // ------------------------------------------------------------------
  // 13. Grants
  // ------------------------------------------------------------------
  `GRANT USAGE ON SCHEMA public TO its_platform_app, its_platform_admin, its_platform_worker`,
  `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO its_platform_app`,
  // re-apply the revoked set after blanket grants (non-idempotence guard below keeps this sane)
  `REVOKE UPDATE, DELETE ON append_only_events FROM its_platform_app, its_platform_worker`,
  `REVOKE UPDATE, DELETE ON consent_records FROM its_platform_app, its_platform_worker`,
  `REVOKE DELETE ON items FROM its_platform_app, its_platform_worker`,
  `REVOKE UPDATE (id) ON items FROM its_platform_app, its_platform_worker`,
  `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO its_platform_worker`,
  `GRANT ALL ON ALL TABLES IN SCHEMA public TO its_platform_admin`,
  `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO its_platform_app, its_platform_worker`,
  `GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO its_platform_admin`,
];

export class CreateSchema1791331200000 implements MigrationInterface {
  name = 'CreateSchema1791331200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const statement of SCHEMA_STATEMENTS) {
      await queryRunner.query(statement);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse: policies -> triggers/functions -> tables (CASCADE) -> types -> roles.
    await queryRunner.query(
      `DO $$
      DECLARE t TEXT;
      BEGIN
        FOREACH t IN ARRAY ARRAY[
          'learners','sessions','learner_mastery','theta_estimates','fsrs_states',
          'practice_attempts','item_responses','listening_attempts','slot_responses',
          'diagnostic_results','diagnostic_responses','error_log','affective_signals',
          'consent_records','append_only_events'
        ] LOOP
          EXECUTE format('DROP POLICY IF EXISTS learner_isolation ON %I', t);
          EXECUTE format('DROP POLICY IF EXISTS admin_bypass ON %I', t);
          EXECUTE format('DROP POLICY IF EXISTS worker_access ON %I', t);
          EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
        END LOOP;
      END $$`,
    );
    const tables = [
      'append_only_events','diagnostic_responses','diagnostic_results','slot_responses',
      'listening_attempts','item_responses','practice_attempts','sessions',
      'affective_signals','error_log','fsrs_states','theta_estimates','learner_mastery',
      'consent_records','learners','bkt_skill_params','fsrs_parameters','item_options',
      'items','clip_renders','clips','dialogue_speakers','dialogues','speakers','voices',
      'packs','skill_prerequisite','lesson_prerequisites','lessons','modules','skills',
      'domains','cefr_levels',
    ];
    for (const table of tables) {
      await queryRunner.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    }
    await queryRunner.query(`DROP TYPE IF EXISTS its_event_type CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS its_item_lifecycle_state CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS its_fsrs_review_state CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS its_pack_layer CASCADE`);
    await queryRunner.query(`DROP ROLE IF EXISTS its_platform_app`);
    await queryRunner.query(`DROP ROLE IF EXISTS its_platform_admin`);
    await queryRunner.query(`DROP ROLE IF EXISTS its_platform_worker`);
  }
}