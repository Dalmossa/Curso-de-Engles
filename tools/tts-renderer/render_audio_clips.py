#!/usr/bin/env python3
"""
Idempotent TTS renderer for ITS Platform.

- Dialogue jobs: derived from DB clips (catalog source of truth) joined with
  dialogue_speakers/voices context; manifest entries used as seed for
  tts_voice/duration/skip hints when available.
- Practice jobs: derived from existing clips/practice/*.mp3 filenames and item
  text (items.stem/key/id fallback). Renders only missing/invalid files unless
  --force.

Outputs:
  - clips/catalog/render/{clip_id}/take-1.opus
  - clips/practice/{item_id}.mp3 (when missing)
  - render-manifest.json (coherent summary/coverage; additive schema_version=2)

Safety:
  - No DB writes, no DROP/TRUNCATE/migrations.
  - Bounded concurrency via asyncio.Semaphore(4).
  - edge_tts.Communicate for synthesis; ffmpeg/ffprobe for opus conversion and duration.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

REPO_ROOT = Path(__file__).resolve().parents[2]
CLIPS_ROOT = REPO_ROOT / "clips"
CATALOG_RENDER_ROOT = CLIPS_ROOT / "catalog" / "render"
PRACTICE_ROOT = CLIPS_ROOT / "practice"
MANIFEST_PATH = Path(__file__).resolve().parent / "render-manifest.json"

SEMAPHORE_LIMIT = 4
RATE = 1.0
TAKE = 1

VOICE_FALLBACK = {
    "v_a": "en-US-AndrewNeural",
    "v_b": "en-US-AriaNeural",
    "v_c": "en-US-AriaNeural",
    "v_d": "en-US-AndrewNeural",
}


@dataclass
class DialogueJob:
    dialogue_id: str
    clip_id: str
    sort_index: int
    speaker: str
    corpus_voice_id: str
    text: str
    tts_voice: str
    out_path: Path
    shipped_l2: Optional[int] = None


@dataclass
class PracticeJob:
    item_id: str
    text: str
    tts_voice: str
    out_path: Path


def load_env() -> Dict[str, str]:
    env = os.environ.copy()
    env_path = REPO_ROOT / "its-platform" / ".env"
    if env_path.exists():
        for raw in env_path.read_text(encoding="utf-8", errors="ignore").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env.setdefault(k.strip(), v.strip())
    return env


def run_cmd(cmd: List[str], env: Optional[Dict[str, str]] = None, check: bool = True) -> subprocess.CompletedProcess:
    res = subprocess.run(cmd, env=env, capture_output=True, text=True)
    if check and res.returncode != 0:
        raise RuntimeError(f"command failed ({res.returncode}): {' '.join(cmd)}\n{res.stderr.strip()}")
    return res


def psql_query(sql: str, env: Dict[str, str]) -> str:
    host = env.get("DB_HOST", "127.0.0.1")
    port = env.get("DB_PORT", "5433")
    user = env.get("DB_USERNAME") or env.get("DB_USER") or "postgres"
    db = env.get("DB_NAME") or env.get("DATABASE") or "its_platform"
    run_env = env.copy()
    pw = env.get("DB_PASSWORD")
    if pw:
        run_env["PGPASSWORD"] = pw
    cmd = [
        "psql", "-h", host, "-p", str(port), "-U", user, "-d", db,
        "-v", "ON_ERROR_STOP=1", "-AtF", "\t", "-c", sql,
    ]
    return run_cmd(cmd, env=run_env, check=True).stdout


def ffprobe_duration(path: Path) -> Optional[float]:
    try:
        out = subprocess.check_output(
            [
                "ffprobe", "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                str(path),
            ],
            text=True,
            stderr=subprocess.STDOUT,
        ).strip()
        if not out:
            return None
        return round(float(out), 2)
    except Exception:
        return None


def is_valid_audio(path: Path) -> bool:
    try:
        return path.exists() and path.is_file() and path.stat().st_size > 0
    except Exception:
        return False


def load_manifest() -> Dict[str, Any]:
    if MANIFEST_PATH.exists():
        try:
            return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        except Exception:
            return {"rendered": [], "skipped_count": 0, "summary": {}}
    return {"rendered": [], "skipped_count": 0, "summary": {}}


def save_manifest_atomic(data: Dict[str, Any]) -> None:
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = MANIFEST_PATH.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(MANIFEST_PATH)


def build_tts_prefs(manifest: Dict[str, Any]) -> Tuple[Dict[Tuple[str, str], str], Dict[str, str], Dict[str, Dict[str, Any]]]:
    pair_counts: Dict[Tuple[str, str], Dict[str, int]] = {}
    global_counts: Dict[str, Dict[str, int]] = {}
    by_clip: Dict[str, Dict[str, Any]] = {}
    for e in (manifest.get("rendered") or []):
        if e.get("kind") != "dialogue":
            continue
        clip_id = e.get("clip_id")
        dlg = e.get("dialogue_id")
        cv = e.get("corpus_voice_id")
        tv = e.get("tts_voice")
        if clip_id:
            by_clip[clip_id] = e
        if dlg and cv and tv:
            pair_counts.setdefault((dlg, cv), {})
            pair_counts[(dlg, cv)][tv] = pair_counts[(dlg, cv)].get(tv, 0) + 1
        if cv and tv:
            global_counts.setdefault(cv, {})
            global_counts[cv][tv] = global_counts[cv].get(tv, 0) + 1

    def pick(d: Dict[str, int]) -> Optional[str]:
        if not d:
            return None
        return sorted(d.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]

    pair_pref = {k: v for k, c in pair_counts.items() for v in [pick(c)] if v}
    global_pref = {k: v for k, c in global_counts.items() for v in [pick(c)] if v}
    return pair_pref, global_pref, by_clip


def get_dialogue_jobs(env: Dict[str, str], manifest: Dict[str, Any]) -> List[DialogueJob]:
    pair_pref, global_pref, by_clip = build_tts_prefs(manifest)
    sql = r"""
    SELECT c.id,
           c.dialogue_id,
           c.sort_index,
           c.utterance_text,
           COALESCE(ds.voice_id, '') AS voice_id,
           COALESCE(NULLIF(s.display_name, ''), s.id, 'Speaker') AS speaker_name
    FROM clips c
    LEFT JOIN dialogue_speakers ds
      ON ds.dialogue_id = c.dialogue_id AND ds.speaker_id = c.speaker_id
    LEFT JOIN speakers s ON s.id = c.speaker_id
    ORDER BY c.dialogue_id, c.sort_index, c.id;
    """
    out = psql_query(sql, env)
    jobs: List[DialogueJob] = []
    for line in out.splitlines():
        if not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) < 6:
            continue
        clip_id, dialogue_id, sort_index_s, text, voice_id, speaker = parts[:6]
        prev = by_clip.get(clip_id, {})
        tts_voice = (
            prev.get("tts_voice")
            or pair_pref.get((dialogue_id, voice_id))
            or global_pref.get(voice_id)
            or VOICE_FALLBACK.get(voice_id)
            or "en-US-AriaNeural"
        )
        try:
            sort_index = int(sort_index_s)
        except Exception:
            sort_index = 0
        out_path = CATALOG_RENDER_ROOT / clip_id / "take-1.opus"
        shipped_l2 = prev.get("shipped_l2")
        jobs.append(
            DialogueJob(
                dialogue_id=dialogue_id,
                clip_id=clip_id,
                sort_index=sort_index,
                speaker=speaker,
                corpus_voice_id=voice_id or str(prev.get("corpus_voice_id") or ""),
                text=text,
                tts_voice=str(tts_voice),
                out_path=out_path,
                shipped_l2=shipped_l2 if isinstance(shipped_l2, int) or shipped_l2 is None else None,
            )
        )
    return jobs


def chunked(seq: List[str], n: int) -> List[List[str]]:
    return [seq[i:i + n] for i in range(0, len(seq), n)]


def get_practice_jobs(env: Dict[str, str], manifest: Dict[str, Any]) -> List[PracticeJob]:
    prev_by_id: Dict[str, Dict[str, Any]] = {}
    for e in (manifest.get("practice_rendered") or []):
        if e.get("kind") == "practice" and e.get("item_id"):
            prev_by_id[e["item_id"]] = e
    # Back-compat: some manifests may have stored practice in rendered
    for e in (manifest.get("rendered") or []):
        if e.get("kind") == "practice" and e.get("item_id") and e["item_id"] not in prev_by_id:
            prev_by_id[e["item_id"]] = e

    files = sorted(PRACTICE_ROOT.glob("*.mp3")) if PRACTICE_ROOT.exists() else []
    ids = [f.stem for f in files]
    texts: Dict[str, str] = {}
    if ids:
        for chunk in chunked(ids, 80):
            arr = "ARRAY[" + ",".join("'" + x.replace("'", "''") + "'" for x in chunk) + "]::varchar[]"
            sql = (
                "SELECT id, COALESCE(NULLIF(trim(stem),''), NULLIF(trim(key),''), id) AS text "
                f"FROM items WHERE id = ANY({arr});"
            )
            try:
                out = psql_query(sql, env)
            except Exception:
                out = ""
            for line in out.splitlines():
                if not line.strip() or "\t" not in line:
                    continue
                iid, text = line.split("\t", 1)
                texts[iid] = text

    jobs: List[PracticeJob] = []
    for f in files:
        item_id = f.stem
        prev = prev_by_id.get(item_id, {})
        text = texts.get(item_id) or str(prev.get("text") or item_id.replace("_", " "))
        tts_voice = str(prev.get("tts_voice") or "en-US-AriaNeural")
        jobs.append(PracticeJob(item_id=item_id, text=text, tts_voice=tts_voice, out_path=f))
    return jobs


async def synthesize_to_path(text: str, voice: str, out_path: Path, sem: asyncio.Semaphore) -> None:
    import edge_tts  # lazy import so script can still load for help/errors in other contexts

    out_path.parent.mkdir(parents=True, exist_ok=True)
    suffix = out_path.suffix.lower()
    async with sem:
        if suffix == ".opus":
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tf:
                tmp_mp3 = Path(tf.name)
            try:
                communicate = edge_tts.Communicate(text=text, voice=voice)
                await communicate.save(str(tmp_mp3))
                cmd = [
                    "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                    "-i", str(tmp_mp3),
                    "-c:a", "libopus", "-b:a", "24k",
                    str(out_path),
                ]
                subprocess.run(cmd, check=True)
            finally:
                try:
                    tmp_mp3.unlink(missing_ok=True)
                except Exception:
                    pass
        else:
            communicate = edge_tts.Communicate(text=text, voice=voice)
            await communicate.save(str(out_path))


def build_entry_dialogue(job: DialogueJob, out_path: Path, skipped_existing: bool) -> Dict[str, Any]:
    entry: Dict[str, Any] = {
        "kind": "dialogue",
        "dialogue_id": job.dialogue_id,
        "clip_id": job.clip_id,
        "sort_index": job.sort_index,
        "speaker": job.speaker,
        "corpus_voice_id": job.corpus_voice_id,
        "text": job.text,
        "tts_voice": job.tts_voice,
        "out_path": str(out_path),
        "duration_s": ffprobe_duration(out_path),
        "skipped_existing": skipped_existing,
    }
    if job.shipped_l2 is not None:
        entry["shipped_l2"] = job.shipped_l2
    return entry


def build_entry_practice(job: PracticeJob, out_path: Path, skipped_existing: bool) -> Dict[str, Any]:
    return {
        "kind": "practice",
        "item_id": job.item_id,
        "text": job.text,
        "tts_voice": job.tts_voice,
        "out_path": str(out_path),
        "duration_s": ffprobe_duration(out_path),
        "skipped_existing": skipped_existing,
    }


async def run(args: argparse.Namespace) -> int:
    env = load_env()
    manifest = load_manifest()

    dialogue_jobs = get_dialogue_jobs(env, manifest)
    practice_jobs = get_practice_jobs(env, manifest)

    sem = asyncio.Semaphore(SEMAPHORE_LIMIT)
    tasks = []
    immediate_results: List[Tuple[str, str, Dict[str, Any]]] = []

    rendered_dialogue_now = 0
    rendered_practice_now = 0
    skipped_dialogue_now = 0
    skipped_practice_now = 0

    for job in dialogue_jobs:
        if is_valid_audio(job.out_path) and not args.force:
            immediate_results.append(("dialogue", job.clip_id, build_entry_dialogue(job, job.out_path, True)))
            skipped_dialogue_now += 1
            continue

        async def _do_d(j: DialogueJob = job):
            await synthesize_to_path(j.text, j.tts_voice, j.out_path, sem)
            return ("dialogue", j.clip_id, build_entry_dialogue(j, j.out_path, False))

        tasks.append(_do_d())

    for job in practice_jobs:
        if is_valid_audio(job.out_path) and not args.force:
            immediate_results.append(("practice", job.item_id, build_entry_practice(job, job.out_path, True)))
            skipped_practice_now += 1
            continue

        async def _do_p(j: PracticeJob = job):
            await synthesize_to_path(j.text, j.tts_voice, j.out_path, sem)
            return ("practice", j.item_id, build_entry_practice(j, j.out_path, False))

        tasks.append(_do_p())

    results = list(immediate_results)
    if tasks:
        for coro in asyncio.as_completed(tasks):
            kind, key, entry = await coro
            results.append((kind, key, entry))
            if kind == "dialogue":
                rendered_dialogue_now += 1
            else:
                rendered_practice_now += 1

    # Merge preserving existing metadata
    merged_dialogue: Dict[str, Dict[str, Any]] = {}
    merged_practice: Dict[str, Dict[str, Any]] = {}

    for e in (manifest.get("rendered") or []):
        if e.get("kind") == "dialogue" and e.get("clip_id"):
            merged_dialogue[e["clip_id"]] = dict(e)
        elif e.get("kind") == "practice" and e.get("item_id"):
            merged_practice[e["item_id"]] = dict(e)
    for e in (manifest.get("practice_rendered") or []):
        if e.get("kind") == "practice" and e.get("item_id"):
            base = merged_practice.get(e["item_id"], {})
            base.update(e)
            merged_practice[e["item_id"]] = base

    for kind, key, entry in results:
        if kind == "dialogue":
            base = merged_dialogue.get(key, {})
            base.update({k: v for k, v in entry.items() if v is not None or k in ("duration_s", "shipped_l2")})
            merged_dialogue[key] = base
        else:
            base = merged_practice.get(key, {})
            base.update({k: v for k, v in entry.items() if v is not None or k in ("duration_s",)})
            merged_practice[key] = base

    dialogue_entries = sorted(
        merged_dialogue.values(),
        key=lambda e: (str(e.get("dialogue_id", "")), int(e.get("sort_index", 0) or 0), str(e.get("clip_id", ""))),
    )
    practice_entries = sorted(merged_practice.values(), key=lambda e: str(e.get("item_id", "")))

    all_entries = dialogue_entries + practice_entries
    total_skipped = sum(1 for e in all_entries if e.get("skipped_existing"))
    total_rendered = sum(1 for e in all_entries if not e.get("skipped_existing"))

    out_manifest: Dict[str, Any] = {
        "schema_version": 2,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "rendered": dialogue_entries,
        "practice_rendered": practice_entries,
        "skipped_count": total_skipped,
        "summary": {
            "dialogue_jobs": len(dialogue_jobs),
            "pack_jobs": len(practice_jobs),
            "rendered_count": total_rendered,
            "skipped_existing_count": total_skipped,
            "entries": len(all_entries),
            "dialogue_entries": len(dialogue_entries),
            "practice_entries": len(practice_entries),
        },
    }

    save_manifest_atomic(out_manifest)

    print(json.dumps({
        "status": "ok",
        "dialogue_jobs": len(dialogue_jobs),
        "practice_jobs": len(practice_jobs),
        "dialogue_rendered_now": rendered_dialogue_now,
        "dialogue_skipped_now": skipped_dialogue_now,
        "practice_rendered_now": rendered_practice_now,
        "practice_skipped_now": skipped_practice_now,
        "manifest_entries": len(all_entries),
        "dialogue_entries": len(dialogue_entries),
        "practice_entries": len(practice_entries),
    }, ensure_ascii=False))
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="Idempotent ITS TTS renderer")
    ap.add_argument("--force", action="store_true", help="Re-render even if target audio exists")
    args = ap.parse_args()
    try:
        return asyncio.run(run(args))
    except KeyboardInterrupt:
        return 130
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
