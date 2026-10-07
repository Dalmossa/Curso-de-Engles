import type { DataSource, QueryRunner } from 'typeorm';
import type { LoadReport } from './content-types.js';
import { parseLesson } from './lesson-parser.js';
import { parsePack } from './pack-parser.js';
import { parseListeningCorpus } from './listening-parser.js';
import { parseCurriculum } from './curriculum-parser.js';
import * as fs from 'fs';
import * as path from 'path';

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
    await seedLookups(qr);
    const curriculum = parseCurriculum(contentRoot);
    for (const mod of curriculum.modules) {
      await qr.query(
        `INSERT INTO modules (module_id, title, cefr_level, track, source_markdowns, sort_order, expected_lessons) 
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (module_id) DO UPDATE SET
         title=$2, cefr_level=$3, track=$4, source_markdowns=$5, sort_order=$6, expected_lessons=$7`,
        [mod.module_id, mod.title, mod.cefr_level, mod.track, JSON.stringify(mod.source_markdowns), mod.sort_order, mod.expected_lessons]
      );
    }
    const lessonsDir = path.join(contentRoot, 'lessons');
    const cefrDirs = ['a1','a2','b1','b2','remediation'];
    for (const cefr of cefrDirs) {
      const dir = path.join(lessonsDir, cefr);
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const filePath = path.join(dir, file);
        const md = fs.readFileSync(filePath, 'utf-8');
        try {
          const lesson = parseLesson(md, file);
          await qr.query(
            `INSERT INTO lessons (lesson_id, title, cefr_level, source_markdown, reuse_basis, module_id, prereq_lessons, skill_items) 
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             ON CONFLICT (lesson_id) DO UPDATE SET
             title=$2, cefr_level=$3, source_markdown=$4, reuse_basis=$5, module_id=$6, prereq_lessons=$7, skill_items=$8`,
            [lesson.id, lesson.title, lesson.cefr_level, lesson.source_markdown, lesson.reuse_basis,
             lesson.module_id || null, JSON.stringify(lesson.prereq_lessons), JSON.stringify(lesson.skill_items)]
          );
          const pubState = lesson.reuse_basis === 'adapt_with_attribution' || lesson.reuse_basis === 'cite_only' ? 'publishable' : 'restricted_pending_permission';
          const permState = lesson.reuse_basis === 'adapt_requires_permission' ? 'requested' : 'not_required';
          await qr.query(`UPDATE lessons SET publication_state=$2, permission_state=$3 WHERE lesson_id=$1`,
            [lesson.id, pubState, permState]);
          report.lessons++;
        } catch (e) {
          report.errors.push(`${file}: ${(e as Error).message}`);
        }
      }
    }
    const packsRoot = path.join(contentRoot, 'packs');
    if (fs.existsSync(packsRoot)) {
      const packFiles: string[] = [];
      function walk(dir: string) {
        if (!fs.existsSync(dir)) return;
        for (const entry of fs.readdirSync(dir)) {
          const full = path.join(dir, entry);
          const stat = fs.statSync(full);
          if (stat.isDirectory()) walk(full);
          else if (entry.endsWith('.md')) packFiles.push(full);
        }
      }
      walk(packsRoot);
      for (const filePath of packFiles) {
        const file = path.basename(filePath);
        const md = fs.readFileSync(filePath, 'utf-8');
        try {
          const pack = parsePack(md, file);
          await qr.query(
            `INSERT INTO packs (pack_id, lesson_id, title, cefr_level, time_cap, split, interleaved, reuse_basis, schema_version) 
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
             ON CONFLICT (pack_id) DO UPDATE SET
             lesson_id=$2, title=$3, cefr_level=$4, time_cap=$5, split=$6, interleaved=$7, reuse_basis=$8, schema_version=$9`,
            [pack.pack_id, pack.lesson_id, pack.title, pack.cefr_level, pack.time_cap, pack.split, pack.interleaved, pack.reuse_basis, pack.schema]
          );
          const pubState = pack.reuse_basis === 'adapt_with_attribution' || pack.reuse_basis === 'cite_only' ? 'publishable' : 'restricted_pending_permission';
          const permState = pack.reuse_basis === 'adapt_requires_permission' ? 'requested' : 'not_required';
          await qr.query(`UPDATE packs SET publication_state=$2, permission_state=$3 WHERE pack_id=$1`,
            [pack.pack_id, pubState, permState]);
          report.packs++;
          for (const item of pack.items) {
            await qr.query(
              `INSERT INTO items (item_id, pack_id, type, type_mapped, question, instructions, scoring, difficulty, p_random, stem_from_table, source_provenance, is_scannable, asr_target, words_target, clear_response, confidence, max_words, accept_punct, accept_case, require_exact_match)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
               ON CONFLICT (item_id) DO UPDATE SET
               pack_id=$2,type=$3,type_mapped=$4,question=$5,instructions=$6,scoring=$7,difficulty=$8,p_random=$9,stem_from_table=$10,source_provenance=$11,is_scannable=$12,asr_target=$13,words_target=$14,clear_response=$15,confidence=$16,max_words=$17,accept_punct=$18,accept_case=$19,require_exact_match=$20`,
              [item.item_id, pack.pack_id, item.type, item.type_mapped || null, item.question || null, item.instructions || null, item.scoring || null,
               item.difficulty || 0, item.p_random || 1.0, false, 'authored',
               false, null, null, false, false, null, false, true, true]
            );
            report.items++;
            await qr.query('DELETE FROM item_options WHERE item_id=$1', [item.item_id]);
            for (let i = 0; i < item.options.length; i++) {
              const opt = item.options[i];
              if (!opt) continue;
              await qr.query(
                `INSERT INTO item_options (item_id, slot, value, note, is_key, br_pt_form, br_pt_form_state, distractor_type)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                [item.item_id, opt.slot, opt.value, opt.note || null, opt.is_key, opt.br_pt_form || null, opt.br_pt_form_state || 'applicable', opt.distractor_type || null]
              );
              report.options++;
            }
          }
          for (const s of pack.skips) {
            report.skips.push({ type: 'item', ref_id: s.item_id, reason: s.reason });
          }
        } catch (e) {
          report.errors.push(`${file}: ${(e as Error).message}`);
        }
      }
    }
    const corpusPath = path.join(contentRoot, 'corpus', 'listening-corpus.md');
    if (fs.existsSync(corpusPath)) {
      const md = fs.readFileSync(corpusPath, 'utf-8');
      try {
        const corpus = parseListeningCorpus(md);
        for (const dlg of corpus.dialogues) {
          await qr.query(
            `INSERT INTO dialogues (dialogue_id, title, cefr_level, kind, duration_seconds, status, setting, register, turns)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
             ON CONFLICT (dialogue_id) DO UPDATE SET
             title=$2, cefr_level=$3, kind=$4, duration_seconds=$5, status=$6, setting=$7, register=$8, turns=$9`,
            [dlg.dialogue_id, dlg.title, dlg.cefr_level, dlg.kind, dlg.duration_seconds, dlg.status, dlg.setting || null, dlg.register || null, dlg.turns]
          );
          report.dialogues++;
          for (const sp of dlg.speakers) {
            await qr.query(
              `INSERT INTO speakers (speaker_id, voice_label, display_name)
               VALUES ($1,$2,$3)
               ON CONFLICT (speaker_id) DO UPDATE SET voice_label=$2, display_name=$3`,
              [sp.speaker_id, sp.voice_id, null]
            );
            await qr.query(
              `INSERT INTO dialogue_speakers (dialogue_id, speaker_id, voice_id)
               VALUES ($1,$2,$3)
               ON CONFLICT DO NOTHING`,
              [dlg.dialogue_id, sp.speaker_id, sp.voice_id]
            );
          }
          for (const slot of dlg.slots) {
            await qr.query(
              `INSERT INTO listening_slots (slot_id, dialogue_id, sequence, speaker_id, status, clip_ids)
               VALUES ($1,$2,$3,$4,$5,$6)
               ON CONFLICT (slot_id) DO UPDATE SET
               dialogue_id=$2, sequence=$3, speaker_id=$4, status=$5, clip_ids=$6`,
              [slot.slot_id, dlg.dialogue_id, slot.sequence, slot.speaker_id, slot.status, JSON.stringify(slot.clip_ids)]
            );
            report.slots++;
          }
        }
        for (const v of corpus.voices) {
          await qr.query(
            `INSERT INTO voices (voice_id, gender, description)
             VALUES ($1,$2,$3)
             ON CONFLICT (voice_id) DO UPDATE SET gender=$2, description=$3`,
            [v.voice_id, v.gender, v.description || null]
          );
        }
      } catch (e) {
        report.errors.push(`listening-corpus.md: ${(e as Error).message}`);
      }
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
async function seedLookups(qr: any) {
  const cefrs = ['A1','A2','B1','B2','C1','C2'];
  for (const c of cefrs) {
    await qr.query(`INSERT INTO cefr_levels (cefr_level, description) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [c, c]);
  }
  const domains = ['grammar','vocab','reading','pronunciation','listening','coherence','speaking','writing'];
  for (const d of domains) {
    await qr.query(`INSERT INTO domains (domain_id, name) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [d, d]);
  }
}
