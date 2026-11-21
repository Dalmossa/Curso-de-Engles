#!/usr/bin/env python3
"""
Update audio metadata in render-manifest.json and reconcile clip_renders durations in DB.

- Idempotent and non-destructive (no DROP/TRUNCATE/migrations).
- Refreshes duration_s and out_path in manifest entries based on actual files (ffprobe).
- Optionally reconciles DB clip_renders.duration_s for take=1/rate=1.00 when file-backed
  and different; preserves ear_checked_at/ear_checked_by (never modified).
- SQL values are strictly derived/sanitized from known IDs and numeric durations.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

REPO_ROOT = Path(__file__).resolve().parents[2]
CLIPS_ROOT = REPO_ROOT / "clips"
MANIFEST_PATH = Path(__file__).resolve().parent / "render-manifest.json"
CLIP_ID_RE = re.compile(r"^[A-Za-z0-9_]+$")


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


def resolve_path(entry: Dict[str, Any]) -> Optional[Path]:
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
    return None


def update_manifest_entries(manifest: Dict[str, Any]) -> Tuple[int, int]:
    updated = 0
    missing = 0

    def process(entries: List[Dict[str, Any]]):
        nonlocal updated, missing
        for e in entries:
            path = resolve_path(e)
            if path is None:
                continue
            if not path.exists():
                missing += 1
                continue
            dur = ffprobe_duration(path)
            if dur is not None and e.get("duration_s") != dur:
                e["duration_s"] = dur
                updated += 1
            elif dur is None and e.get("duration_s") is not None:
                pass
            try:
                e["out_path"] = str(path.resolve())
            except Exception:
                e["out_path"] = str(path)

    process(manifest.get("rendered") or [])
    if isinstance(manifest.get("practice_rendered"), list):
        process(manifest.get("practice_rendered") or [])

    dialogue_entries = manifest.get("rendered") or []
    practice_entries = manifest.get("practice_rendered") or []
    all_entries = dialogue_entries + practice_entries
    skipped = sum(1 for e in all_entries if e.get("skipped_existing"))
    rendered_count = sum(1 for e in all_entries if not e.get("skipped_existing"))
    summary = manifest.get("summary") or {}
    # Keep previously recorded job totals when >= entry counts, else align to reality
    d_jobs = summary.get("dialogue_jobs")
    p_jobs = summary.get("pack_jobs")
    if not isinstance(d_jobs, int) or d_jobs < len(dialogue_entries):
        d_jobs = len(dialogue_entries)
    if not isinstance(p_jobs, int) or p_jobs < len(practice_entries):
        p_jobs = len(practice_entries)
    summary.update({
        "dialogue_jobs": d_jobs,
        "pack_jobs": p_jobs,
        "rendered_count": rendered_count,
        "skipped_existing_count": skipped,
        "entries": len(all_entries),
        "dialogue_entries": len(dialogue_entries),
        "practice_entries": len(practice_entries),
    })
    manifest["summary"] = summary
    manifest["skipped_count"] = skipped
    manifest["schema_version"] = manifest.get("schema_version") or 2
    manifest["metadata_updated_at"] = datetime.now(timezone.utc).isoformat()
    return updated, missing


def reconcile_db(env: Dict[str, str], manifest: Dict[str, Any], dry_run: bool) -> Dict[str, Any]:
    stats: Dict[str, Any] = {"checked": 0, "updated": 0, "skipped_missing_file": 0, "skipped_not_found": 0, "errors": 0}
    dialogue_entries = manifest.get("rendered") or []
    durations: Dict[str, float] = {}
    paths: Dict[str, Path] = {}
    for e in dialogue_entries:
        cid = e.get("clip_id")
        if not cid or not CLIP_ID_RE.match(str(cid)):
            continue
        path = resolve_path(e)
        dur = e.get("duration_s")
        if dur is None and path and path.exists():
            dur = ffprobe_duration(path)
        if path:
            paths[str(cid)] = path
        if dur is None:
            continue
        try:
            durations[str(cid)] = round(float(dur), 2)
        except Exception:
            continue
    if not durations:
        return stats

    q = run_psql("SELECT clip_id, duration_s::text, uri FROM clip_renders WHERE take=1 AND rate=1.00;", env, tuples_only=True)
    if q.returncode != 0:
        raise RuntimeError(q.stderr.strip())
    for line in q.stdout.splitlines():
        if not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) < 3:
            continue
        cid, db_dur_s, uri = parts[0], parts[1], parts[2]
        if cid not in durations or not CLIP_ID_RE.match(cid):
            continue
        stats["checked"] += 1
        target = durations[cid]
        try:
            db_val = round(float(db_dur_s), 2)
        except Exception:
            db_val = None
        if db_val is not None and abs(db_val - target) < 0.01:
            continue
        fpath = CLIPS_ROOT / uri if uri else paths.get(cid)
        if fpath and not Path(fpath).exists():
            stats["skipped_missing_file"] += 1
            continue
        sql = (
            f"UPDATE clip_renders SET duration_s = {target:.2f}::numeric "
            f"WHERE clip_id = '{cid}' AND take = 1 AND rate = 1.00 "
            f"AND (duration_s IS DISTINCT FROM {target:.2f}::numeric);"
        )
        if dry_run:
            stats["updated"] += 1
            continue
        res = run_psql(sql, env, tuples_only=False)
        if res.returncode != 0:
            stats["errors"] += 1
            continue
        out = (res.stdout or "") + (res.stderr or "")
        if "UPDATE 1" in out:
            stats["updated"] += 1
        else:
            stats["skipped_not_found"] += 1
    return stats


def main() -> int:
    ap = argparse.ArgumentParser(description="Update TTS audio metadata (manifest and DB durations)")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--no-db", action="store_true")
    args = ap.parse_args()
    try:
        if not MANIFEST_PATH.exists():
            print(json.dumps({"status": "error", "reason": "manifest_missing"}))
            return 1
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        updated, missing = update_manifest_entries(manifest)
        db_stats: Dict[str, Any] = {"checked": 0, "updated": 0, "skipped_missing_file": 0, "skipped_not_found": 0, "errors": 0}
        if not args.no_db:
            try:
                env = load_env()
                db_stats = reconcile_db(env, manifest, args.dry_run)
            except Exception as e:
                db_stats["errors"] = int(db_stats.get("errors", 0)) + 1
                db_stats["error"] = str(e)
        if not args.dry_run:
            tmp = MANIFEST_PATH.with_suffix(".json.tmp")
            tmp.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            tmp.replace(MANIFEST_PATH)
        ok = int(db_stats.get("errors", 0)) == 0
        print(json.dumps({
            "status": "ok" if ok else "error",
            "manifest_duration_fields_updated": updated,
            "manifest_missing_files_seen": missing,
            "db": db_stats,
            "dry_run": bool(args.dry_run),
        }, ensure_ascii=False))
        return 0 if ok else 1
    except Exception as e:
        print(json.dumps({"status": "error", "error": str(e)}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
