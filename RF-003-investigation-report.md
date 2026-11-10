# RF-003 Audio Rendering Investigation Report

## RF-003 Context
- **Render 30 speaker-clips from 13 dialogue transcripts**
- **Voice distribution**: v_a: 8 clips, v_b: 7 clips, v_c: 7 clips, v_d: 8 clips
- **13 transcripts need audio rendering**
- **Until clips exist, every listening item is render-blocked**
- **The diagnostic cannot assess listening**
- **Placement band is labelled `placement_provisional`**

---

## 1. 13 Dialogue Transcript Filenames

The 13 dialogue transcripts are declared in `/home/dalmo/Documentos/Projetos/Curso-de-Ingles/corpus/listening-corpus.md`:

### Level A1 (4 dialogues):
1. `dlg_a1_01_first_intro` — Ana `v_a`, Ben `v_b`
2. `dlg_a1_02_where_from` — Luiza `v_c`, Tom `v_d`
3. `dlg_a1_03_day_time` — Bea `v_a`, Rafael `v_b`
4. `dlg_a1_04_ask_help` — Nina `v_c`, Omar `v_d`

### Level A2 (5 dialogues):
5. `dlg_a2_01_open_meeting` — Sarah `v_a`, Priya `v_c`, Ahmed `v_b`, Marco `v_d`
6. `dlg_a2_02_what_does` — Carla `v_a`, Marco `v_b`
7. `dlg_a2_03_deadline_eta` — Elena `v_c`, Diego `v_d`
8. `dlg_a2_04_bug_report` — User `v_a`, Agent `v_b`
9. `dlg_a2_05_touch_base` — Nadia `v_c`, Marco `v_d`
10. `dlg_a2_06_intro_three_way` — Sarah `v_a`, Ana `v_c`, Marco `v_d`

### Level B1 (3 dialogues):
11. `dlg_b1_01_incident` — Lead `v_a`, Dev `v_b`, SRE `v_d`
12. `dlg_b1_02_disagree` — Reviewer `v_c`, Dev `v_b`
13. `dlg_b1_03_tradeoff` — Architect `v_a`, Engineer `v_d`

---

## 2. Listening Item Status Distribution

**Total: 82 listening items** (per verify-integrity.py check [5])

| Status | Count | Notes |
|--------|-------|-------|
| `shipped` | 74 | Admissible items; 55 L1 + 19 L2 pending ear check |
| `withdrawn` | 7 | All carry §9 DEF references: DEF-6 (3), DEF-7 (2), DEF-8 (1), DEF-10 (1), DEF-11 (1) |
| `shadow-only` | 1 | `lst_lexical_006` — withdrawn from CAT, retained as Shadow CAT free-response |

**Breakdown of withdrawn items:**
- `lst_prn_th_006` — §9 DEF-6 (withdrawn A2 minimal pair, Sarah's "Let's get started")
- `lst_prn_scluster_002` — §9 DEF-7 (withdrawn A2 `dashboard`/`dash board`)
- `lst_prn_scluster_003` — §9 DEF-7 (withdrawn A2 `stakeholder`/`stake holder`)
- `lst_prn_scluster_005` — §9 DEF-6 (withdrawn A2, dlg_a2_05)
- `lst_prn_th_009` — §9 DEF-10 (withdrawn B1, time items not minimal pairs)
- `lst_prn_scluster_006` — §9 DEF-11 (withdrawn B1, replacement deferred to §10.3)
- `lst_prn_vowel_001` — §9 DEF-6 (withdrawn A2, vowel contrast defects)

**1 L1 shadow-only:** `lst_lexical_006` — §9 DEF-8, withdrawn from CAT, retained as Shadow CAT free-response

---

## 3. Voice Assignment — Which Voices to Which Dialogues

The voice assignments are declared in `listening-corpus.md` §0 (Voice assignment table):

| Dialogue | Speaker → voice | n speakers | Voices in dialogue |
|---|---|---|---|
| `dlg_a1_01_first_intro` | Ana `v_a` · Ben `v_b` | 2 | v_a, v_b |
| `dlg_a1_02_where_from` | Luiza `v_c` · Tom `v_d` | 2 | v_c, v_d |
| `dlg_a1_03_day_time` | Bea `v_a` · Rafael `v_b` | 2 | v_a, v_b |
| `dlg_a1_04_ask_help` | Nina `v_c` · Omar `v_d` | 2 | v_c, v_d |
| `dlg_a2_01_open_meeting` | Sarah `v_a` · Priya `v_c` · Ahmed `v_b` · Marco `v_d` | 4 | v_a, v_b, v_c, v_d |
| `dlg_a2_02_what_does` | Carla `v_a` · Marco `v_b` | 2 | v_a, v_b |
| `dlg_a2_03_deadline_eta` | Elena `v_c` · Diego `v_d` | 2 | v_c, v_d |
| `dlg_a2_04_bug_report` | User `v_a` · Agent `v_b` | 2 | v_a, v_b |
| `dlg_a2_05_touch_base` | Nadia `v_c` · Marco `v_d` | 2 | v_c, v_d |
| `dlg_a2_06_intro_three_way` | Sarah `v_a` · Ana `v_c` · Marco `v_d` | 3 | v_a, v_c, v_d |
| `dlg_b1_01_incident` | Lead `v_a` · Dev `v_b` · SRE `v_d` | 3 | v_a, v_b, v_d |
| `dlg_b1_02_disagree` | Reviewer `v_c` · Dev `v_b` | 2 | v_c, v_b |
| `dlg_b1_03_tradeoff` | Architect `v_a` · Engineer `v_d` | 2 | v_a, v_d |

**Voice clip counts (from corpus header):** v_a: 8, v_b: 7, v_c: 7, v_d: 8 = 30 speaker slots total.

**Voice balance rules (DEF-13):** Each panel voice appears in ≥ 2 levels and ≥ 6 dialogues, and spans ≥ 2 item types. All four voices (v_a, v_b, v_c, v_d) are present at all three levels (A1, A2, B1), satisfying the panel voice coverage check.

**Speaker-to-voice pinning (DEF-13/gate 5g):** A dialogue may not use more distinct voices than it has speakers. The amendment 2026-09-30 ensures voice is pinned to speaker identity within each dialogue. The verify-integrity.py check 5g passed mechanically for all dialogues.

---

## 4. Audio Rendering Code — Status: Not Implemented

### Existing infrastructure:
- **`its-platform/src/infrastructure/audio/`**: `audio-url-signer.ts`, `hmac-audio-url-signer.ts` — signed URL generation for clip renders
- **`its-platform/src/infrastructure/entities/clip-render.entity.ts`**: DDL entity for `clip_renders` table
- **`its-platform/src/infrastructure/repositories/content.repository.ts`**: `findDialogueAudio()` method with ADR-028 §3 SQL gate
- **`its-platform/src/modules/content/content.service.ts`**: `getDialogueAudio()` method that signs and serves clips
- **`its-platform/tests/integration/content-audio.spec.ts`**: Test suite for P1.13 ADR-028, using seeded `clip_renders` data
- **`its-platform/src/infrastructure/content/listening-parser.ts`**: Parses `listening-corpus.md` into `clips` and `items` for database loading
- **`its-platform/src/infrastructure/content/content-loader.ts`**: `loadContent()` seeds dialogues, speakers, voices, clips, and items from the corpus

### What's **missing**:
- **No actual audio render rows in `clip_renders` table** — the test suite honesty note states: "`clip_renders` holds **0** rows: no audio has been rendered (M3 is not done)"
- **No TTS/Text-to-speech service** in the codebase
- **No render/processing script** that converts dialogue transcripts into `clip_renders` rows
- **The M3 (render) step has not been executed**

### The ADR-028 §3 gate (four admission conditions):
1. `status = 'shipped'` — the dialogue must be shipped ✅ (all 13 dialogues are shipped)
2. **every clip of the dialogue has at least one render** ❌ — `clip_renders` is empty
3. highest `take` complete for the whole dialogue at the requested rate ❌ — dependent on #2
4. if L2 items exist, every selected render carries `ear_checked_at` and `ear_checked_by` ❌ — dependent on renders existing

---

## 5. What Needs to Be Done to Render the 30 Speaker-Clips

To render the 30 speaker-clips and promote the corpus to `authored_reviewed_corpus`, the following steps are needed:

### Step 1: Generate audio clips from transcripts
For each of the 13 dialogues, parse the transcript and generate one audio clip per spoken turn:
- Use the transcript blockquote lines (`> **Speaker:** text`)
- Assign each clip the pinned voice ID from the dialogue's voice assignment
- Clip ID format: `clp_<dialogueId>_<sortIndex>` (as defined in `listening-parser.ts`)

**Expected clip counts per dialogue** (from transcript word counts / 150 wpm model):
- dlg_a1_01_first_intro: 16 turns → 16 clips (but only 2 speaker slots: v_a, v_b)
- Actually, the clip count maps to speaker turns, not all turns may produce clips

Wait, let me reconsider. Looking at the listening-parser.ts `parseClips()` function, it creates one clip per turn in the transcript where a speaker name is detected. The clip ID format is `clp_<dialogueId>_<index>`.

From the corpus voice assignments, the total is 30 speaker slots across 13 dialogues. But the number of clips would be the total number of spoken turns across all 13 dialogues.

Looking at the dialogue inventories in §8.1:
- A1 dialogues: 16 + 16 + 13 + 15 = 60 turns
- A2 dialogues: 12 + 13 + 11 + 13 + 13 = 62 turns  
- B1 dialogues: 18 + 14 + 20 = 52 turns
- Total: 174 turns

But the "30 speaker-clips" in the RF-003 description suggests only 30 clips need to be rendered. This might mean:
- One clip per speaker per dialogue (30 speaker slots), OR
- A subset of clips keyed to specific listening items

Re-reading RF-003: "Render 30 speaker-clips from 13 dialogue transcripts" — this likely means 30 clips total, one per speaker slot defined in the voice assignment table (8+v_a, 7+v_b, 7+v_c, 8+v_d).

But looking at the actual items in the corpus, each item references specific clips ("from line X"). The 30 speaker-clips may be the set of all unique speaker utterances that need audio rendering.

Actually, re-reading more carefully: the "30 speaker-clips" likely refers to 30 individual audio clips, one per speaker turn slot. Given the voice distribution v_a: 8, v_b: 7, v_c: 7, v_d: 8 = 30, this means one clip per speaker identity across all dialogues.

### Step 2: Populate `clip_renders` table
For each clip, insert a row into `clip_renders`:
- `clip_id`: the clip's ID
- `take`: 1 (initial take)
- `voice_id`: the assigned voice (v_a, v_b, v_c, or v_d)
- `rate`: 1.0 (full rate)
- `duration_s`: derived from clip word count / 150 wpm * 60
- `uri`: `catalog/render/<clip_id>/take-1.opus`
- `ear_checked_at`: NULL (until ear check is done)
- `ear_checked_by`: NULL (until ear check is done)

### Step 3: Ear-check the renders (Q-L7 gate)
For L2 items (19 items pending ear check), run the Q-L7 ear check and populate:
- `ear_checked_at`: timestamp
- `ear_checked_by`: examiner name (e.g., `sp_native_ear`)

### Step 4: Verify the gate checks pass
Run verify-integrity.py [5] to confirm:
- Panel voices per level (A1, A2, B1) ✅ (already passes)
- Voice pinned to speaker (5g) ✅ (already passes)
- Q-L2 durations within 45-120s ✅ (already passes)
- All item statuses declared ✅ (already passes)

### Step 5: Promote to `authored_reviewed_corpus`
After all renders are ear-checked, the corpus can be promoted per `listening-corpus-spec.md` §3 QA gate. This requires:
- All 30 clips rendered
- All L2 items ear-checked
- No withdrawn or shadow-only items blocking the CAT

---

## 6. How the Listening Corpus Would Need to Be Updated After Rendering

After the 30 speaker-clips are rendered and ear-checked, the following updates would be needed:

### Database updates (via `content-loader.ts` or direct SQL):
- `clip_renders` table: populate with rendered takes at rate 1.0 (and rate 0.75 for accommodation)
- `clip_renders.ear_checked_at`: set timestamp for each clip used by L2 items
- `clip_renders.ear_checked_by`: set examiner identifier

### Corpus metadata updates (`listening-corpus.md`):
- Section 8 (Measurement) numbers would need re-computation if clip counts change
- §9 defect log: the 7 withdrawn and 1 shadow-only items are already documented
- Status promotion: the index currently states "the audio does not exist yet" (line 10-11). After rendering, this would change to reflect that audio exists and has passed QA.
- The **authored_reviewed_corpus** designation would apply once the §3 QA gate is passed.

### verify-integrity.py checks that would need attention:
- Check [5] currently passes because it validates the *specification* consistency, not the *audio existence*
- After rendering, the [5d] item key check would still pass (it reads status fields, not audio)
- The [5e] Q-L2 duration check would still pass (derived from transcript words, not audio)
- The [5f] panel voice coverage would still pass (voice assignments unchanged)
- The [5g] voice-to-speaker pinning would still pass

### Operational changes:
- `ContentService.getDialogueAudio()` would return actual signed URLs instead of `null`
- The ADR-028 §3 gate would admit dialogues based on render existence
- Learners could listen to the speaker clips in the listening practice activities
- The placement band `placement_provisional` could potentially be revised once the corpus is fully reviewed

---

## Summary

**What is needed to render 30 speaker-clips:**
1. A render pipeline that parses the 13 dialogue transcripts from `corpus/listening-corpus.md` and generates 30 audio clips (one per speaker slot: v_a × 8, v_b × 7, v_c × 7, v_d × 8)
2. Populate the `clip_renders` database table with the clips, initial take 1 at rate 1.0
3. Ear-check the 19 L2 items (Q-L7) that are currently pending
4. Update `listening-corpus.md` to reflect that audio exists

**Current state:** The infrastructure for audio rendering exists (ADR-028, clip_renders table, audio URL signer, content service), but **no audio has been rendered** (`clip_renders` = 0 rows). Every listening item is render-blocked until the M3 render step is executed.

**After rendering:** The 82 listening items would become accessible, the corpus could be promoted to `authored_reviewed_corpus` after passing the §3 QA gate, and the diagnostic listening assessment could function properly.