#!/usr/bin/env python3
"""
Validate consistency between audio files on disk, render-manifest.json and DB state.

Read-only checks:
- Dialogue: manifest entries exist on disk, readable (ffprobe), durations coherent,
  and match DB clip_renders (take=1, rate=1.00) for voice/uri/duration where present.
- DB: every clip_render file exists (except known clp_test_1 anomaly reported as warning),
  every clip has a render, and render/clip speaker voice mapping is consistent.
- Practice: all clips/practice/*.mp3 present, covered in manifest, readable with duration.
- Manifest coherence: no duplicate dialogue/practice keys, summary counts consistent.

Exits 0 on success (no errors; warnings allowed unless --strict).
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

REPO_ROOT = Path(__file__).resolve().parents[2]
CLIPS_ROOT = REPO_ROOT / "clips"
MANIFEST_PATH = Path(__file__).resolve().parent / "render-manifest.json"


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


def run_psql(sql: str, env: Dict[str, str]) -> subprocess.CompletedProcess:
    host = env.get("DB_HOST", "127.0.0.1")
    port = env.get("DB_PORT", "5433")
    user = env.get("DB_USERNAME") or env.get("DB_USER") or "postgres"
    db = env.get("DB_NAME") or env.get("DATABASE") or "its_platform"
    run_env = env.copy()
    pw = env.get("DB_PASSWORD")
    if pw:
        run_env["PGPASSWORD"] = pw
    args = ["psql", "-h", host, "-p", str(port), "-U", user, "-d", db, "-v", "ON_ERROR_STOP=1", "-AtF", "\t", "-c", sql]
    return subprocess.run(args, env=run_env, capture_output=True, text=True)


def q(sql: str, env: Dict[str, str]) -> List[str]:
    res = run_psql(sql, env)
    if res.returncode != 0:
        raise RuntimeError(res.stderr.strip())
    return [ln for ln in res.stdout.splitlines() if ln != ""]


def ffprobe_duration(path: Path) -> Optional[float]:
    try:
        out = subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
            text=True,
            stderr=subprocess.STDOUT,
        ).strip()
        if not out:
            return None
        return round(float(out), 2)
    except Exception:
        return None


def resolve_path(entry: Dict[str, Any]) -> Path:
    p = entry.get("out_path")
    if p:
        path = Path(p)
        if not path.is_absolute():
            path = REPO_ROOT / path
        return path
    if entry.get("kind") == "dialogue" and entry.get("clip_id"):
        return CLIPS_ROOT / "catalog" / "render" / str(entry["clip_id"]) / "take-1.opus"
    if entry.get("kind") == "practice" and entry.get("item_id"):
        return CLIPS_ROOT / "practice" / f"{entry['item_id']}.mp3"
    return Path()


def main() -> int:
    ap = argparse.ArgumentParser(description="Validate ITS audio state (disk/manifest/DB)")
    ap.add_argument("--strict", action="store_true")
    ap.add_argument("--tolerance", type=float, default=0.35)
    ap.add_argument("--no-db", action="store_true")
    args = ap.parse_args()
    errors: List[str] = []
    warnings: List[str] = []
    try:
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8")) if MANIFEST_PATH.exists() else {}
        dialogue_entries = manifest.get("rendered") or []
        practice_entries = manifest.get("practice_rendered") or []
        summary = manifest.get("summary") or {}

        opus_files = list((CLIPS_ROOT / "catalog" / "render").glob("*/take-1.opus")) if (CLIPS_ROOT / "catalog" / "render").exists() else []
        mp3_files = list((CLIPS_ROOT / "practice").glob("*.mp3")) if (CLIPS_ROOT / "practice").exists() else []

        db_available = False
        db_renders: Dict[str, Dict[str, str]] = {}
        db_clips: Set[str] = set()
        db_clip_voice: Dict[str, str] = {}
        if not args.no_db:
            try:
                env = load_env()
                for line in q("SELECT clip_id, take::text, voice_id, rate::text, duration_s::text, uri, (ear_checked_at IS NOT NULL AND ear_checked_by IS NOT NULL)::text FROM clip_renders;", env):
                    parts = line.split("\t")
                    if len(parts) >= 7:
                        db_renders[parts[0]] = {
                            "take": parts[1], "voice_id": parts[2], "rate": parts[3],
                            "duration_s": parts[4], "uri": parts[5], "ear_checked": parts[6],
                        }
                db_clips = set(q("SELECT id FROM clips;", env))
                for line in q("SELECT c.id, COALESCE(ds.voice_id,'') FROM clips c LEFT JOIN dialogue_speakers ds ON ds.dialogue_id=c.dialogue_id AND ds.speaker_id=c.speaker_id;", env):
                    parts = line.split("\t")
                    if parts:
                        db_clip_voice[parts[0]] = parts[1] if len(parts) > 1 else ""
                db_available = True
            except Exception as e:
                warnings.append(f"db_unavailable:{e}")

        # Dialogue entries
        seen_dialogue: Set[str] = set()
        for e in dialogue_entries:
            cid = str(e.get("clip_id") or "")
            if not cid:
                errors.append("dialogue_entry_missing_clip_id")
                continue
            if cid in seen_dialogue:
                errors.append(f"duplicate_dialogue_entry:{cid}")
            seen_dialogue.add(cid)
            path = resolve_path(e)
            if not path.exists() or path.stat().st_size == 0:
                if db_available and cid in db_renders:
                    errors.append(f"dialogue_file_missing_for_db_render:{cid}")
                else:
                    warnings.append(f"dialogue_file_missing:{cid}")
                continue
            actual = ffprobe_duration(path)
            if actual is None:
                errors.append(f"dialogue_unreadable:{cid}")
                continue
            mdur = e.get("duration_s")
            if mdur is not None:
                try:
                    if abs(float(mdur) - actual) > args.tolerance:
                        warnings.append(f"dialogue_duration_manifest_mismatch:{cid}")
                except Exception:
                    warnings.append(f"dialogue_duration_manifest_invalid:{cid}")
            if db_available and cid in db_renders:
                dbr = db_renders[cid]
                expected_uri = f"catalog/render/{cid}/take-1.opus"
                if dbr.get("uri") != expected_uri:
                    errors.append(f"dialogue_uri_mismatch:{cid}")
                expected_voice = db_clip_voice.get(cid)
                if expected_voice and dbr.get("voice_id") != expected_voice:
                    errors.append(f"dialogue_voice_mismatch:{cid}")
                try:
                    if abs(float(dbr.get("duration_s") or 0) - actual) > args.tolerance:
                        warnings.append(f"dialogue_duration_db_mismatch:{cid}")
                except Exception:
                    warnings.append(f"dialogue_duration_db_invalid:{cid}")
                if str(dbr.get("take")) != "1" or str(dbr.get("rate")) not in ("1.00", "1", "1.0"):
                    warnings.append(f"dialogue_take_rate_unexpected:{cid}")

        # DB coverage/consistency
        if db_available:
            for cid, dbr in db_renders.items():
                uri = dbr.get("uri") or ""
                fpath = CLIPS_ROOT / uri if uri else Path("")
                if not fpath.exists():
                    if cid == "clp_test_1":
                        warnings.append(f"db_render_file_missing_known_test_clip:{cid}")
                    else:
                        errors.append(f"db_render_file_missing:{cid}")
            for cid in sorted(db_clips - set(db_renders.keys())):
                errors.append(f"clip_missing_render:{cid}")

        # Practice
        disk_practice_ids = {p.stem for p in mp3_files}
        manifest_practice_ids: Set[str] = set()
        for e in practice_entries:
            iid = str(e.get("item_id") or "")
            if not iid:
                errors.append("practice_entry_missing_item_id")
                continue
            if iid in manifest_practice_ids:
                errors.append(f"duplicate_practice_entry:{iid}")
            manifest_practice_ids.add(iid)
            path = resolve_path(e)
            if not path.exists() or path.stat().st_size == 0:
                errors.append(f"practice_file_missing:{iid}")
                continue
            actual = ffprobe_duration(path)
            if actual is None:
                errors.append(f"practice_unreadable:{iid}")
                continue
            mdur = e.get("duration_s")
            if mdur is not None:
                try:
                    if abs(float(mdur) - actual) > args.tolerance:
                        warnings.append(f"practice_duration_manifest_mismatch:{iid}")
                except Exception:
                    warnings.append(f"practice_duration_manifest_invalid:{iid}")
        for iid in sorted(disk_practice_ids - manifest_practice_ids):
            warnings.append(f"practice_file_not_in_manifest:{iid}")

        # Summary coherence
        expected_entries = len(dialogue_entries) + len(practice_entries)
        if summary.get("entries") not in (None, expected_entries):
            warnings.append(f"summary_entries_mismatch:{summary.get('entries')}!={expected_entries}")
        if summary.get("dialogue_entries") not in (None, len(dialogue_entries)):
            warnings.append(f"summary_dialogue_entries_mismatch:{summary.get('dialogue_entries')}!={len(dialogue_entries)}")
        if summary.get("practice_entries") not in (None, len(practice_entries)):
            warnings.append(f"summary_practice_entries_mismatch:{summary.get('practice_entries')}!={len(practice_entries)}")

        ok = not errors and (not args.strict or not warnings)
        result = {
            "status": "ok" if ok else "error",
            "counts": {
                "dialogue_manifest_entries": len(dialogue_entries),
                "practice_manifest_entries": len(practice_entries),
                "opus_files": len(opus_files),
                "mp3_files": len(mp3_files),
                "db_clip_renders": len(db_renders) if db_available else None,
                "db_clips": len(db_clips) if db_available else None,
            },
            "errors": errors,
            "warnings": warnings,
        }
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0 if ok else 1
    except Exception as e:
        print(json.dumps({"status": "error", "error": str(e), "errors": [str(e)]}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
