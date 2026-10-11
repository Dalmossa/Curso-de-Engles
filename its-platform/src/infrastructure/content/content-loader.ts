import type { DataSource, QueryRunner } from 'typeorm';
import type { LessonRecord, LoadReport, PackRecord } from './content-types.js';
import { parseLesson } from './lesson-parser.js';
import { parsePack } from './pack-parser.js';
import { parseListeningCorpus } from './listening-parser.js';
import { parseCurriculum } from './curriculum-parser.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Seeds the content graph into the P0.4 schema (ADR-019 DDL) per ADR-022.
 *
 * The loader is a *writer*, not a model: the whole load runs in one transaction
 * (ADR-022 §6), upserts with `ON CONFLICT (id) DO UPDATE` on the business keys,
 * and `delete + re-insert`s the tables that have no business key
 * (`item_options`, `lesson_prerequisites`, `skill_prerequisite`,
 * `dialogue_speakers`).
 *
 * Every statement names a real ADR-019 table and column. Where a per-file error
 * would abort a plain transaction, the work is wrapped in a `SAVEPOINT` so one
 * bad file is reported in `report.errors` instead of aborting the load — but a
 * non-empty `errors[]` still fails the content gate, so the loudness is preserved.
 */

const CEFR_SEED: Array<{ code: string; sort_order: number }> = [
  { code: 'A1', sort_order: 1 },
  { code: 'A2', sort_order: 2 },
  { code: 'B1', sort_order: 3 },
  { code: 'B2', sort_order: 4 },
  { code: 'C1', sort_order: 5 },
  { code: 'C2', sort_order: 6 },
];

// The seven domains the content refers to. `vocab` (not `vocabulary`), and no
// `coherence` — the DDL CHECK forbids `items.domain_id = 'coherence'` (ADR-022 §3).
const DOMAIN_SEED = ['vocab', 'grammar', 'reading', 'listening', 'pronunciation', 'speaking', 'writing'];

let savepointCounter = 0;

/**
 * Run `fn` inside a savepoint so that an error rolls back only this unit of work
 * and the surrounding (single) transaction can continue to report it.
 */
async function guarded(
  qr: QueryRunner,
  report: LoadReport,
  label: string,
  fn: () => Promise<void>,
): Promise<void> {
  savepointCounter += 1;
  const sp = `its_sp_${savepointCounter}`;
  await qr.query(`SAVEPOINT ${sp}`);
  try {
    await fn();
    await qr.query(`RELEASE SAVEPOINT ${sp}`);
  } catch (e) {
    await qr.query(`ROLLBACK TO SAVEPOINT ${sp}`);
    report.errors.push(`${label}: ${(e as Error).message}`);
  }
}

function readDirSorted(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).sort();
}

function walkMarkdown(root: string, out: string[]): void {
  if (!fs.existsSync(root)) return;
  for (const entry of fs.readdirSync(root).sort()) {
    const full = path.join(root, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkMarkdown(full, out);
    else if (entry.endsWith('.md')) out.push(full);
  }
}

/** The lesson's directory (`a1…`) → CEFR, `remediation` → null (declared in-file). */
function dirCefr(cefrDir: string): string | null {
  const m = cefrDir.match(/^([ab][12])$/i);
  return m && m[1] ? m[1].toUpperCase() : null;
}

export async function loadContent(dataSource: DataSource, contentRoot: string): Promise<LoadReport> {
  const report: LoadReport = {
    lessons: 0,
    packs: 0,
    dialogues: 0,
    slots: 0,
    items: 0,
    options: 0,
    clips: 0,
    skips: [],
    errors: [],
  };

  const qr: QueryRunner = dataSource.createQueryRunner();
  await qr.connect();
  try {
    // One transaction for the whole load (ADR-022 §6); `connect()` alone leaves
    // explicit transaction statements un-startable (TransactionNotStartedError).
    await qr.startTransaction();

    // --- 1. seeds ---------------------------------------------------------
    for (const c of CEFR_SEED) {
      await qr.query(
        `INSERT INTO cefr_levels (code, label, sort_order, theta_threshold)
         VALUES ($1, $2, $3, NULL)
         ON CONFLICT (code) DO UPDATE SET label = $2, sort_order = $3`,
        [c.code, c.code, c.sort_order],
      );
    }
    for (const d of DOMAIN_SEED) {
      await qr.query(
        `INSERT INTO domains (id, label, tracked)
         VALUES ($1, $2, true)
         ON CONFLICT (id) DO UPDATE SET label = $2, tracked = true`,
        [d, d],
      );
    }

    // --- 2. curriculum ----------------------------------------------------
    const curriculum = parseCurriculum(contentRoot);
    const moduleIds = new Set(curriculum.modules.map(m => m.id));

    for (const mod of curriculum.modules) {
      await qr.query(
        `INSERT INTO modules (id, title, cefr_level, track, source_markdowns, sort_order, expected_lessons)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           title = $2, cefr_level = $3, track = $4, source_markdowns = $5,
           sort_order = $6, expected_lessons = $7`,
        [
          mod.id,
          mod.title,
          mod.cefr_level,
          mod.track,
          mod.source_markdowns,
          mod.sort_order,
          mod.expected_lessons,
        ],
      );
    }

    // --- 3. lessons -------------------------------------------------------
    const lessonIds = new Set<string>();
    const lessonById = new Map<string, LessonRecord>();
    const prereqEdges: Array<{ lesson_id: string; prereqs: string[] }> = [];
    const lessonsDir = path.join(contentRoot, 'lessons');
    for (const cefrDir of readDirSorted(lessonsDir)) {
      const dir = path.join(lessonsDir, cefrDir);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const file of readDirSorted(dir)) {
        if (!file.endsWith('.md')) continue;
        const filePath = path.join(dir, file);
        const cefrFromDir = dirCefr(cefrDir);
        await guarded(qr, report, `lessons/${cefrDir}/${file}`, async () => {
          const md = fs.readFileSync(filePath, 'utf-8');
          const lesson = parseLesson(md, file, {
            dirCefr: cefrFromDir,
            lessonModules: curriculum.lesson_modules,
          });
          if (!lesson.module_id) {
            throw new Error(`unresolved module for lesson ${lesson.id}`);
          }
          if (!moduleIds.has(lesson.module_id)) {
            throw new Error(`lesson ${lesson.id} references unknown module ${lesson.module_id}`);
          }
          if (!lesson.cefr_level) {
            throw new Error(`unresolved CEFR for lesson ${lesson.id}`);
          }
          await qr.query(
            `INSERT INTO lessons (id, module_id, title, cefr_level, reuse_basis,
                                  authoring_state, publication_state, permission_state,
                                  source_ref, body)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (id) DO UPDATE SET
               module_id = $2, title = $3, cefr_level = $4, reuse_basis = $5,
               authoring_state = $6, publication_state = $7, permission_state = $8,
               source_ref = $9, body = $10, updated_at = now()`,
            [
              lesson.id,
              lesson.module_id,
              lesson.title,
              lesson.cefr_level,
              lesson.reuse_basis,
              lesson.authoring_state,
              lesson.publication_state,
              lesson.permission_state,
              lesson.source_ref,
              JSON.stringify(lesson.body),
            ],
          );
          lessonIds.add(lesson.id);
          lessonById.set(lesson.id, lesson);
          prereqEdges.push({ lesson_id: lesson.id, prereqs: lesson.prereq_lessons });
          report.lessons += 1;
        });
      }
    }

    // --- 4. lesson prerequisites (§1: JSON column → edge table) -----------
    for (const edge of prereqEdges) {
      const targets = edge.prereqs.filter(p => lessonIds.has(p) && p !== edge.lesson_id);
      await qr.query(`DELETE FROM lesson_prerequisites WHERE lesson_id = $1`, [edge.lesson_id]);
      for (const prereq of targets) {
        await qr.query(
          `INSERT INTO lesson_prerequisites (lesson_id, prereq_id, edge_type)
           VALUES ($1, $2, 'prerequisite')
           ON CONFLICT (lesson_id, prereq_id) DO NOTHING`,
          [edge.lesson_id, prereq],
        );
      }
    }
    // `skill_prerequisite` is intentionally not populated (ADR-022 §4): the loaded
    // lessons declare no `skill_items`, and `skills` is seeded by ADR-021.

    // --- 5. packs and their items ----------------------------------------
    const packsRoot = path.join(contentRoot, 'packs');
    const packFiles: string[] = [];
    walkMarkdown(packsRoot, packFiles);
    for (const filePath of packFiles) {
      const file = path.basename(filePath);
      const rel = path.relative(contentRoot, filePath);
      await guarded(qr, report, `packs/${rel}`, async () => {
        const md = fs.readFileSync(filePath, 'utf-8');
        const pack = parsePack(md, file);
        if (!pack.lesson_id || !lessonIds.has(pack.lesson_id)) {
          throw new Error(`pack ${pack.id} references unknown lesson ${pack.lesson_id || '<none>'}`);
        }

        // `packs.item_ids` records only what was actually inserted (ADR-022 §3),
        // so it is computed here, from the same list that is inserted below.
        const insertedItemIds = pack.items.map(i => i.item_id);

        await qr.query(
          `INSERT INTO packs (id, lesson_id, schema_version, reuse_basis, manifest, item_ids)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET
             lesson_id = $2, schema_version = $3, reuse_basis = $4,
             manifest = $5, item_ids = $6`,
          [
            pack.id,
            pack.lesson_id,
            pack.schema_version,
            pack.reuse_basis,
            JSON.stringify({
              title: pack.title,
              // legacy_v1 packs declare no CEFR; the manifest carries the lesson's
              // (ADR-022 §3). The lesson is guaranteed present by the check above.
              cefr_level: lessonById.get(pack.lesson_id)?.cefr_level ?? null,
              time_cap: pack.time_cap,
              split: pack.split,
              interleaved: pack.interleaved,
            }),
            insertedItemIds,
          ],
        );
        report.packs += 1;

        for (const s of pack.skips) {
          report.skips.push({ type: 'item', ref_id: s.item_id, reason: s.reason });
        }

        await insertPackItems(qr, report, pack.items, pack.lesson_id);
      });
    }

    // --- 5b. corpus items come from the same `items` table ----------------
    const corpusPath = path.join(contentRoot, 'corpus', 'listening-corpus.md');
    if (fs.existsSync(corpusPath)) {
      await guarded(qr, report, 'corpus/listening-corpus.md', async () => {
        const md = fs.readFileSync(corpusPath, 'utf-8');
        const corpus = parseListeningCorpus(md);

        for (const v of corpus.voices) {
          await qr.query(
            `INSERT INTO voices (id, label, accent, gender, active)
             VALUES ($1, $2, $3, $4, true)
             ON CONFLICT (id) DO UPDATE SET label = $2, accent = $3, gender = $4, active = true`,
            [v.id, v.label, v.accent, v.gender],
          );
        }
        for (const sp of corpus.speakers) {
          await qr.query(
            `INSERT INTO speakers (id, display_name, gender)
             VALUES ($1, $2, $3)
             ON CONFLICT (id) DO UPDATE SET display_name = $2, gender = $3`,
            [sp.id, sp.display_name, sp.gender],
          );
        }

        for (const dlg of corpus.dialogues) {
          await qr.query(
            `INSERT INTO dialogues (id, title, cefr_level, status, duration_seconds, transcript)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO UPDATE SET
               title = $2, cefr_level = $3, status = $4, duration_seconds = $5,
               transcript = $6`,
            [dlg.id, dlg.title, dlg.cefr_level, dlg.status, dlg.duration_seconds, dlg.transcript],
          );
          report.dialogues += 1;

          // No business key on (dialogue, speaker) beyond the pairs themselves.
          await qr.query(`DELETE FROM dialogue_speakers WHERE dialogue_id = $1`, [dlg.id]);
          for (const ds of dlg.speakers) {
            await qr.query(
              `INSERT INTO dialogue_speakers (dialogue_id, speaker_id, voice_id)
               VALUES ($1, $2, $3)
               ON CONFLICT (dialogue_id, speaker_id) DO NOTHING`,
              [dlg.id, ds.speaker_id, ds.voice_id],
            );
          }

          for (const clip of dlg.clips) {
            await qr.query(
              `INSERT INTO clips (id, dialogue_id, speaker_id, sort_index, utterance_text)
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (id) DO UPDATE SET
                 dialogue_id = $2, speaker_id = $3, sort_index = $4, utterance_text = $5`,
              [
                clip.id,
                clip.dialogue_id,
                clip.speaker_id,
                clip.sort_index,
                clip.utterance_text,
              ],
            );
            report.clips += 1;
          }

          for (const item of dlg.items) {
            await qr.query(
              `INSERT INTO items (id, schema_version, skill_ids, lesson_id, dialogue_id,
                                  slot_number, clip_ids, cefr_level, domain_id, item_type,
                                  listening_kind, listening_tier, modality, scoring, stem,
                                  key, p_random, br_pt_form_state, provenance_kind)
               VALUES ($1, '2.0', $2, NULL, $3, $4, NULL, $5, 'listening',
                       'contextual_selection', $6, $7, 'listening', 'choice', $8, $9, $10,
                       'applicable', 'authored')
               ON CONFLICT (id) DO UPDATE SET
                 skill_ids = $2, dialogue_id = $3, slot_number = $4, cefr_level = $5,
                 listening_kind = $6, listening_tier = $7, stem = $8, key = $9,
                 p_random = $10, updated_at = now()`,
              [
                item.item_id,
                ['listening'],
                dlg.id,
                item.slot_number,
                dlg.cefr_level,
                item.listening_kind,
                item.listening_tier,
                item.stem,
                item.key,
                item.p_random,
              ],
            );
            report.items += 1;
            report.slots += 1;
            await insertOptions(qr, report, item.item_id, item.options);
          }
        }

        for (const s of corpus.skips) {
          report.skips.push({ type: 'slot', ref_id: s.ref_id, reason: s.reason });
        }
      });
    }

    await qr.commitTransaction();
  } catch (e) {
    await qr.rollbackTransaction();
    throw e;
  } finally {
    await qr.release();
  }
  return report;
}

/** `items` rows for one pack, then delete + re-insert their options. */
async function insertPackItems(
  qr: QueryRunner,
  report: LoadReport,
  items: PackRecord['items'],
  lessonId: string,
): Promise<void> {
  for (const item of items) {
    await qr.query(
      `INSERT INTO items (id, schema_version, skill_ids, lesson_id, dialogue_id, slot_number,
                          clip_ids, cefr_level, domain_id, item_type, listening_kind,
                          listening_tier, modality, scoring, stem, key, p_random,
                          br_pt_form_state, provenance_kind)
       VALUES ($1, '2.0', $2, $3, NULL, NULL, NULL, (
                 SELECT cefr_level FROM lessons WHERE id = $4
               ), $5, $6, NULL, NULL, 'text', $7, $8, $9, $10, $11, 'authored')
       ON CONFLICT (id) DO UPDATE SET
         skill_ids = $2, lesson_id = $3, cefr_level = (
           SELECT cefr_level FROM lessons WHERE id = $4),
         domain_id = $5, item_type = $6, scoring = $7, stem = $8, key = $9,
         p_random = $10, br_pt_form_state = $11, updated_at = now()`,
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
    report.items += 1;
    await insertOptions(qr, report, item.item_id, item.options);
  }
}

/** `item_options` has no business key: delete by item, then insert. */
async function insertOptions(
  qr: QueryRunner,
  report: LoadReport,
  itemId: string,
  options: PackRecord['items'][number]['options'],
): Promise<void> {
  await qr.query(`DELETE FROM item_options WHERE item_id = $1`, [itemId]);
  for (const opt of options) {
    await qr.query(
      `INSERT INTO item_options (item_id, position, option_text, is_key,
                                 distractor_type, br_pt_form, note, expected_share)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NULL)`,
      [
        itemId,
        opt.position,
        opt.option_text,
        opt.is_key,
        opt.distractor_type,
        opt.br_pt_form,
        opt.note,
      ],
    );
    report.options += 1;
  }
}
