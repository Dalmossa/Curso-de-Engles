#!/usr/bin/env python3
"""
Register dialogue clip renders in clip_renders (idempotent, safe).

- Reads dialogue entries from render-manifest.json.
- Verifies referenced audio files exist and are non-empty.
- Inserts or updates clip_renders for take=1, rate=1.00 using parameterized-safe
  SQL built from validated identifiers and numeric durations only.
- Preserves ear_checked_at/ear_checked_by (never modified/cleared).
- Skips clips missing from clips table or missing files; never drops/truncates/migrates.

Practice renders are not registered in clip_renders because the schema is catalog-only
(FK to clips, URI constrained to catalog/render/*). Their presence is covered by
manifest/disk validation.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

REPO_ROOT = Path(__file__).resolve().parents[2]
CLIPS_ROOT = REPO_ROOT / "clips"
MANIFEST_PATH = Path(__file__).resolve().parent / "render-manifest.json"
TAKE = 1
RATE = "1.00"
ID_RE = re.compile(r"^[A-Za-z0-9_]+$")


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


def run_psql(sql: str, env: Dict[str, str], tuples_only: bool = False) -> subprocess.CompletedProcess:
    host = env.get("DB_HOST", "127.0.0.1")
    port = env.get("DB_PORT", "5433")
    user = env.get("DB_USERNAME") or env.get("DB_USER") or "postgres"
    db = env.get("DB_NAME") or env.get("DATABASE") or "its_platform"
    run_env = env.copy()
    pw = env.get("DB_PASSWORD")
    if pw:
        run_env["PGPASSWORD"] = pw
    args = ["psql", "-h", host, "-p", str(port), "-U", user, "-d", db, "-v", "ON_ERROR_STOP=1"]
    if tuples_only:
        args += ["-AtF", "\t"]
    args += ["-c", sql]
    return subprocess.run(args, env=run_env, capture_output=True, text=True)


def q(sql: str, env: Dict[str, str]) -> List[str]:
    res = run_psql(sql, env, tuples_only=True)
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


def main() -> int:
    ap = argparse.ArgumentParser(description="Register dialogue clip renders in DB (idempotent)")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    try:
        if not MANIFEST_PATH.exists():
            print(json.dumps({"status": "error", "reason": "manifest_missing"}))
            return 1
        env = load_env()
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        entries = manifest.get("rendered") or []

        known_clips = set(q("SELECT id FROM clips;", env))
        existing: Dict[str, Dict[str, str]] = {}
        for line in q("SELECT clip_id, voice_id, duration_s::text, uri FROM clip_renders WHERE take=1 AND rate=1.00;", env):
            parts = line.split("\t")
            if len(parts) >= 4:
                existing[parts[0]] = {"voice_id": parts[1], "duration_s": parts[2], "uri": parts[3]}

        # clip->expected voice fallback from DB mapping
        clip_voice: Dict[str, str] = {}
        for line in q("SELECT c.id, COALESCE(ds.voice_id,'') FROM clips c LEFT JOIN dialogue_speakers ds ON ds.dialogue_id=c.dialogue_id AND ds.speaker_id=c.speaker_id;", env):
            parts = line.split("\t")
            if parts:
                clip_voice[parts[0]] = parts[1] if len(parts) > 1 else ""

        stats = {
            "candidates": 0,
            "inserted_or_updated": 0,
            "skipped_no_change": 0,
            "skipped_missing_clip": 0,
            "skipped_missing_file": 0,
            "skipped_invalid": 0,
            "errors": 0,
            "dry_run": bool(args.dry_run),
        }

        for e in entries:
            clip_id = str(e.get("clip_id") or "")
            if not clip_id:
                continue
            stats["candidates"] += 1
            if not ID_RE.match(clip_id):
                stats["skipped_invalid"] += 1
                continue
            if clip_id not in known_clips:
                stats["skipped_missing_clip"] += 1
                continue

            out_path = e.get("out_path")
            if out_path:
                path = Path(out_path)
                if not path.is_absolute():
                    path = REPO_ROOT / path
            else:
                path = CLIPS_ROOT / "catalog" / "render" / clip_id / "take-1.opus"
            if not path.exists() or path.stat().st_size == 0:
                stats["skipped_missing_file"] += 1
                continue

            voice_id = str(e.get("corpus_voice_id") or clip_voice.get(clip_id) or "")
            if not ID_RE.match(voice_id):
                stats["skipped_invalid"] += 1
                continue

            dur = e.get("duration_s")
            if dur is None:
                dur = ffprobe_duration(path)
            try:
                dur_f = round(float(dur), 2)
            except Exception:
                stats["errors"] += 1
                continue

            uri = f"catalog/render/{clip_id}/take-1.opus"
            ex = existing.get(clip_id)
            if ex:
                try:
                    same_dur = abs(round(float(ex.get("duration_s") or 0), 2) - dur_f) < 0.01
                except Exception:
                    same_dur = False
                if ex.get("voice_id") == voice_id and ex.get("uri") == uri and same_dur:
                    stats["skipped_no_change"] += 1
                    continue

            sql = (
                "INSERT INTO clip_renders (clip_id, take, voice_id, rate, duration_s, uri) "
                f"VALUES ('{clip_id}', {TAKE}, '{voice_id}', {RATE}::numeric, {dur_f:.2f}::numeric, '{uri}') "
                "ON CONFLICT (clip_id, take) DO UPDATE SET "
                "voice_id = EXCLUDED.voice_id, "
                "rate = EXCLUDED.rate, "
                "duration_s = EXCLUDED.duration_s, "
                "uri = EXCLUDED.uri "
                "WHERE clip_renders.voice_id IS DISTINCT FROM EXCLUDED.voice_id "
                "   OR clip_renders.rate IS DISTINCT FROM EXCLUDED.rate "
                "   OR clip_renders.duration_s IS DISTINCT FROM EXCLUDED.duration_s "
                "   OR clip_renders.uri IS DISTINCT FROM EXCLUDED.uri;"
            )
            if args.dry_run:
                stats["inserted_or_updated"] += 1
                continue
            res = run_psql(sql, env, tuples_only=False)
            if res.returncode != 0:
                stats["errors"] += 1
                continue
            out = (res.stdout or "") + (res.stderr or "")
            if "INSERT 0 1" in out or "UPDATE 1" in out:
                stats["inserted_or_updated"] += 1
            else:
                stats["skipped_no_change"] += 1

        print(json.dumps({"status": "ok" if stats["errors"] == 0 else "error", **stats}, ensure_ascii=False))
        return 0 if stats["errors"] == 0 else 1
    except Exception as e:
        print(json.dumps({"status": "error", "error": str(e)}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
