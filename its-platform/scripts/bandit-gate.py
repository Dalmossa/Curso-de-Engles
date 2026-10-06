#!/usr/bin/env python3
"""
Bandit result gate: turn a bandit JSON report into a pass/fail decision.

Extracted so the threshold exists in exactly one place. The CI job
(`.github/workflows/ci.yml`, job `security-scan`) and the `make security-scan`
target both call this, because a security threshold duplicated across two files
is a threshold that will drift — and a drifted security threshold is one nobody
re-reads.

Usage:
    bandit -r src/ -f json -o bandit-results.json
    python3 its-platform/scripts/bandit-gate.py bandit-results.json

Exit: 0 = no blocking finding, 1 = at least one.

Why this threshold and not "fail on any finding":
    Bandit severities are LOW / MEDIUM / HIGH — there is no CRITICAL. Failing on
    every finding makes the gate noise, and a noisy gate gets disabled within a
    release. That is how `|| true` came to be in the first place: the honest
    finding was that the threshold was unusable, not that checking was pointless.

    Blocking = HIGH severity, plus MEDIUM severity at HIGH confidence. Everything
    else is reported and left visible. Tighten the constant below, not the CI.
"""

import json
import pathlib
import sys

#: Severities that block on their own, regardless of confidence.
BLOCKING_SEVERITIES = {"HIGH"}
#: Severities that block only when confidence is this high.
BLOCKING_AT_HIGH_CONFIDENCE = {"MEDIUM"}
CONFIDENCE = "HIGH"


def blocking(results: list[dict]) -> list[dict]:
    out = []
    for r in results:
        sev = r.get("issue_severity", "")
        conf = r.get("issue_confidence", "")
        if sev in BLOCKING_SEVERITIES or (
            sev in BLOCKING_AT_HIGH_CONFIDENCE and conf == CONFIDENCE
        ):
            out.append(r)
    return out


def describe(r: dict) -> str:
    return (f"  {r.get('issue_severity','?')}/{r.get('issue_confidence','?')}  "
            f"{r.get('filename','?')}:{r.get('line_number','?')}  "
            f"{r.get('test_id','?')}  {r.get('issue_text','').strip()}")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        sys.stderr.write("usage: bandit-gate.py <bandit-results.json>\n")
        return 2

    path = pathlib.Path(argv[1])
    if not path.is_file():
        # A missing report is not a clean report. Treating "no file" as "no findings"
        # is how a security gate reports success without ever having run a scanner.
        print(f"[FAIL] bandit-gate: {path} does not exist. "
              "A missing report is not a clean report — the scanner did not run, or its "
              "output was discarded.")
        return 1

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        print(f"[FAIL] bandit-gate: cannot read {path}: {exc}")
        return 1

    results = data.get("results", [])
    hits = blocking(results)
    for r in hits:
        print(describe(r))

    if hits:
        counts = data.get("metrics", {}).get("_totals", {})
        print(f"\n[FAIL] bandit: {len(hits)} blocking finding(s) of {len(results)} total"
              f"{'' if not counts else ''}.")
        print("       Threshold: HIGH severity, or MEDIUM at HIGH confidence.")
        return 1

    print(f"  ok   bandit — {len(results)} finding(s), none blocking")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))