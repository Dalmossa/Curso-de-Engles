#!/usr/bin/env node
/**
 * Sync idempotente das 10 lições/packs `authored_material` (commits 41da186 e 120729d)
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

    // Pré-requisitos: escopo restrito às 10 lições.
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
