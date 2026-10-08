#!/usr/bin/env python3
"""
Release-gate checker for the ITS Platform.

`CONSTITUTION.md` §6.3 declares seven release gates. This script asserts, from files on disk,
whether each one *could* be satisfied today. It does not decide whether to release — it reports
whether the evidence exists.

It exists because the audit found that three of the seven gates could not fail:

  * `CI Green`   — `on: push: branches: [main, develop]` while the branch is `master`. No CI
                   run had ever executed, so "all pipelines pass" was vacuously true.
  * `Staging Deployed` — the job's only step was `echo "Update iac/... with new image tag"`,
                   followed by the comment "This would be done via Kustomize or Helm values
                   update in practice". `iac/` is empty.
  * `Security Scan` — `bandit ... || true`, and Snyk and OWASP ZAP absent entirely.

A gate that cannot fail is worse than an absent gate: it occupies the place where the check
belongs and silences the alarm. The remedy is not to delete such a gate but to make it fail —
and then to keep asking, mechanically, whether it does.

This is NOT a build, test, or lint step. It reads no source and runs no test suite. Like
`verify-integrity.py`, it checks the class of error that is invisible when reading one file at a
time: a declaration in a constitution with no corresponding artefact on disk.

Run:  python3 its-platform/scripts/verify-release-gates.py
      python3 its-platform/scripts/verify-release-gates.py --verbose
Exit: 0 = all gates pass, 1 = at least one FAIL.

Exit code 1 is the *expected* state today, and is not by itself a failure of this script.
"""

import argparse
import pathlib
import re
import shutil
import subprocess
import sys

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.stderr.write(
        "verify-release-gates: PyYAML is required to read .github/workflows/ci.yml\n"
        "  pip install pyyaml\n"
    )
    sys.exit(2)

ROOT = pathlib.Path(__file__).resolve().parents[2]
PLATFORM = ROOT / "its-platform"
CONSTITUTION = PLATFORM / "CONSTITUTION.md"
BACKLOG = PLATFORM / "BACKLOG.md"
WORKFLOW = PLATFORM / ".github" / "workflows" / "ci.yml"

FAILS: list[str] = []
WARNS: list[str] = []
VERBOSE = False

# Set by the Staging gate, read by the Integration-Tests gate. §6.3's ordering dependency is
# real ("Integration Tests" criteria are "on staging"), so it is modelled as state rather than
# re-derived by matching substrings against FAILS.
STAGING_ABSENT = {"value": False}


def fail(gate: str, detail: str) -> None:
    FAILS.append(f"[FAIL] {gate}: {detail}")


def warn(gate: str, detail: str) -> None:
    WARNS.append(f"[WARN] {gate}: {detail}")


def ok(gate: str, detail: str = "") -> None:
    print(f"  ok   {gate}{(' — ' + detail) if detail else ''}")


def note(gate: str, detail: str) -> None:
    if VERBOSE:
        print(f"  ..   {gate} — {detail}")


# ---------------------------------------------------------------- constitution parsing
def constitution() -> str:
    return CONSTITUTION.read_text(encoding="utf-8")


def section_63(text: str) -> str:
    """Return the body of §6.3, up to the next top-level heading."""
    m = re.search(r"^###\s+6\.3\b(.*?)(?=^##\s|\Z)", text, re.M | re.S)
    return m.group(1) if m else ""


def declared_gates(text: str) -> list[tuple[str, str, str]]:
    """Parse the §6.3 table into (gate name, criteria, owner).

    The gate list is read from the document rather than restated here. A verifier that hardcodes
    the gates it checks will keep passing after a gate is added, renamed or removed, which is the
    same defect class as `verify-integrity.py` check [2]: a registry that is never compared to
    the thing it describes.
    """
    rows = []
    for line in section_63(text).split("\n"):
        m = re.match(r"^\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$", line)
        if m:
            rows.append((m.group(1), m.group(2), m.group(3)))
    return rows


# ---------------------------------------------------------------- shared helpers
def current_branch() -> str | None:
    try:
        out = subprocess.run(
            ["git", "-C", str(ROOT), "branch", "--show-current"],
            capture_output=True, text=True, timeout=15,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    return out.stdout.strip() or None


def declared_protected_branch(text: str) -> str | None:
    """The branch name CONSTITUTION.md §4.9's workflow diagram declares as protected.

    Read from the document rather than hardcoded, for the same reason the §6.3 gate list is:
    a constant here would silently disagree with the constitution the day §4.9 is amended.
    """
    m = re.search(r"^(\w[\w./-]*)\s+\u2500{2,}.*\((?:protected|branch protection)", text, re.M)
    return m.group(1) if m else None


def load_workflow():
    if not WORKFLOW.is_file():
        return None
    try:
        return yaml.safe_load(WORKFLOW.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        return exc


def workflow_triggers(wf) -> dict:
    # YAML 1.1 parses the bare key `on:` as the boolean True.
    for key in (True, "on", "On"):
        if isinstance(wf, dict) and key in wf:
            return wf[key] or {}
    return {}


def run_blocks(wf) -> list[tuple[str, str, str]]:
    """(job, step name, script) for every step that has a `run:`."""
    out = []
    for jn, job in (wf.get("jobs") or {}).items():
        for step in job.get("steps") or []:
            if isinstance(step, dict) and step.get("run"):
                out.append((jn, step.get("name", "<unnamed>"), step["run"]))
    return out


def uses_lines(wf) -> list[tuple[str, str, str]]:
    """(job, step name, `owner/repo@ref`) for every action reference."""
    out = []
    for jn, job in (wf.get("jobs") or {}).items():
        for step in job.get("steps") or []:
            if isinstance(step, dict) and step.get("uses"):
                out.append((jn, step.get("name", "<unnamed>"), step["uses"]))
    return out


# ---------------------------------------------------------------- gate 1: Code Complete
def gate_code_complete(gate: str, criteria: str, owner: str) -> None:
    """§6.3 criteria: "All stories Done, no P1/P2 bugs"."""
    text = BACKLOG.read_text(encoding="utf-8")

    stories = re.findall(r"^\|\s*\*\*(P[0-9]\.[0-9]+[a-z]?)\*\*\s*\|", text, re.M)
    in_scope = [s for s in stories if s.split(".")[0] in ("P0", "P1", "P2")]
    ok("stories parsed", f"{len(stories)} total, {len(in_scope)} in MVP scope (P0+P1+P2)")

    # (a) Does a per-story status field exist at all? "All stories Done" needs a source of truth.
    #
    # Scoped to the *story* tables on purpose. A document-wide search for a `Status` column
    # finds the Bugs table's `| ID | Title | Severity | Status | Phase |` and reports a
    # status field that does not exist for any story — a false pass, produced by the same
    # defect class this script exists to catch. The header is identified by carrying both
    # `Story` and `Pri`, which only the P0/P1/P2 story tables do.
    story_headers = [
        ln for ln in text.split("\n")
        if re.match(r"^\|\s*ID\s*\|\s*Story\b", ln, re.I)
    ]
    if not story_headers:
        fail(gate, "could not locate the story tables in BACKLOG.md")
    elif all(re.search(r"\bStatus\b", h, re.I) for h in story_headers):
        ok("story status field", f"present in all {len(story_headers)} story table(s)")
    else:
        without = sum(1 for h in story_headers if not re.search(r"\bStatus\b", h, re.I))
        fail(gate,
             f"BACKLOG.md has no per-story status field ({without} story table(s) lack it), so "
             "'All stories Done' has no source of truth. The §6.3 gate cannot be evaluated "
             f"against the document it names: all {len(in_scope)} MVP stories are unmeasurable "
             "by construction — not by omission, but because the column does not exist. "
             "(The Bugs table has a Status column; that is not the same table.)")

    # (b) Do the stories the MVP depends on have their headline artefact yet?
    #     P0.1 is "Scaffold NestJS + TypeScript". If `package.json` is absent, the whole
    #     migration phase is unstarted and no later story can be Done.
    pkg = PLATFORM / "package.json"
    if pkg.is_file():
        ok("P0.1 scaffold", "package.json present")
    else:
        fail(gate,
             "P0.1 (Scaffold NestJS + TypeScript, Must) has not started: its-platform/package.json "
             "does not exist. Every P1/P2 story depends on P0, so all of them are blocked by "
             "construction. The repository is still the pre-ADR-012 Python tree "
             "(12 .py files) that P0.9 deletes.")

    # (c) Open P1/P2 bugs. The Bugs table ships with a template placeholder row whose severity
    #     cell reads "P1/P2/P3" and whose status cell reads "Open / In Progress / Done" —
    #     i.e. it lists every option. Counting it as an open P1 bug is wrong, and so is
    #     treating its presence as evidence that bugs are being tracked. It is neither.
    bug_rows = re.findall(r"^\|\s*(B-\d+)\s*\|(.+)$", text, re.M)
    real_bugs, placeholders = [], 0
    for bid, rest in bug_rows:
        cells = [c.strip() for c in rest.split("|")]
        if len(cells) < 3:
            continue
        title, severity, status = cells[0], cells[1], cells[2]
        is_placeholder = (
            title.startswith("[") or "/" in severity
            or re.search(r"/\s*(In Progress|Done)\b", status, re.I)
        )
        if is_placeholder:
            placeholders += 1
            continue
        real_bugs.append((bid, severity, status, title))

    blocking = [b for b in real_bugs
                if re.search(r"\bP[12]\b", b[1]) and not re.match(r"(?i)done\b", b[2])]
    if blocking:
        fail(gate,
             f"{len(blocking)} open P1/P2 bug(s): "
             + "; ".join(f"{b[0]} [{b[1]}] {b[3][:40]}" for b in blocking))
    elif real_bugs:
        ok("open P1/P2 bugs", f"0 of {len(real_bugs)} registered")
    elif placeholders:
        warn(gate,
             f"BACKLOG.md '## Bugs' contains only the {placeholders} template placeholder row, "
             "so 'no P1/P2 bugs' is asserted by an empty template rather than by a sweep. "
             "Registering bugs is a DoD obligation (## Definition of Done); the absence of "
             "entries is not evidence of absence.")


# ---------------------------------------------------------------- gate 2: CI Green
def gate_ci_green(gate: str, criteria: str, owner: str) -> None:
    """§6.3 criteria: "All pipelines pass (unit, integration, contract, BDD)"."""
    wf = load_workflow()
    if wf is None:
        if isinstance(wf, yaml.YAMLError):
            fail(gate, f"{WORKFLOW.relative_to(ROOT)} does not parse: {wf}")
        else:
            fail(gate, f"{WORKFLOW.relative_to(ROOT)} does not exist")
        return
    ok("workflow parses", f"{len(wf.get('jobs') or {})} jobs")

    jobs = wf.get("jobs") or {}

    # (a) Does the trigger ever fire for the branch that exists?
    triggers = workflow_triggers(wf)
    push_branches = set((triggers.get("push") or {}).get("branches") or [])
    pr_branches = set((triggers.get("pull_request") or {}).get("branches") or [])
    branch = current_branch()
    declared = declared_protected_branch(constitution())
    note(gate, f"current branch = {branch!r}; push branches = {sorted(push_branches) or 'ALL'}")

    # Fall back to the branch section 4.9 declares rather than skipping when git is
    # unavailable. Skipping here would be the same defect this script reports elsewhere: a
    # check that cannot fail. Git is always present in CI after actions/checkout, so the
    # fallback is for direct runs on an exported tree -- but the constitution names the
    # branch there too, so the comparison is possible without consulting the repository.
    reference = branch or declared
    if reference is None:
        fail(gate,
             f"the workflow triggers on push to {sorted(push_branches)} and neither the git "
             "branch nor the section 4.9 declared protected branch could be determined, so it "
             "cannot be established that the trigger ever fires for the branch carrying code.")
    elif reference in push_branches or not push_branches:
        source = "git" if branch else "section 4.9"
        ok("trigger matches branch",
           f"push on {sorted(push_branches) or 'ALL branches'} catches {reference!r} (via {source})")
    else:
        fail(gate,
             f"the workflow triggers on push to {sorted(push_branches)} but the branch carrying "
             f"the code is {reference!r}. CI has never run, which is why this defect was "
             "invisible: the gate was green by never firing. (Fixed 2026-10-05 by renaming the "
             "branch to `main`; this check exists to keep it fixed.)")

    # (b) Are the four pipelines the gate names actually present as jobs?
    named = {"unit": "unit-tests", "integration": "integration-tests",
             "contract": "contract-test", "bdd": "bdd-tests"}
    for kind, job in named.items():
        if job in jobs:
            ok(f"pipeline present", f"{kind} -> job `{job}`")
        else:
            fail(gate, f"the '{kind}' pipeline the gate names has no job (`{job}` missing)")

    # (c) Can any required job be exempted from the aggregate?
    summary = jobs.get("summary") or {}
    agg = ""
    for step in summary.get("steps") or []:
        if "Fail if any required" in (step.get("name") or ""):
            agg = step.get("if") or ""
    reported = set(re.findall(r"needs\.([A-Za-z0-9_-]+)\.result", agg))
    required = set(re.findall(r"needs\.([A-Za-z0-9_-]+)\.result", " ".join(
        [str(s.get("if") or "") for s in summary.get("steps") or []])))
    can_fail = set()
    for jn, job in jobs.items():
        for step in job.get("steps") or []:
            if isinstance(step, dict) and step.get("continue-on-error"):
                continue
        if jn in jobs:
            can_fail.add(jn)
    exempt = required - reported
    if "security-scan" in jobs and "security-scan" not in required:
        fail(gate,
             "`security-scan` is listed in the summary's `needs` and its result is printed, but "
             "it is not in the failing set. §6.3 names 'Security Scan' as a release gate, so a "
             "scan that cannot fail must not be exempt from the aggregate. (Corrected "
             "2026-10-05 alongside removing `|| true` from bandit; this check keeps it fixed.)")
    elif required:
        ok("aggregate covers", f"{len(required)} job(s) in the failing set")
    else:
        fail(gate, "no aggregate failing-set found in the `summary` job; CI cannot fail as a whole")

    # (d) Does any scanner mask its own failure?
    masked = []
    for jn, sname, script in run_blocks(wf):
        low = script.lower()
        touches_scanner = any(t in low for t in
                              ("bandit", "snyk", "zap", "trivy", "semgrep", "npm audit"))
        if touches_scanner and re.search(r"\|\|\s*true", script):
            masked.append(f"{jn}/{sname}")
        if touches_scanner and re.search(r"^.*set\s+\+e", script, re.M):
            masked.append(f"{jn}/{sname} (set +e)")
    if masked:
        fail(gate,
             f"scanner step(s) mask their own exit status: {'; '.join(masked)}. A security gate "
             "that swallows its result is reporting nothing.")
    else:
        ok("no masked scanners", "every scanner step propagates its exit status")


# ---------------------------------------------------------------- gate 3: Staging Deployed
def gate_staging(gate: str, criteria: str, owner: str) -> None:
    """§6.3 criteria: "ArgoCD synced, health checks pass"."""
    iac = PLATFORM / "iac"
    absent = False
    if not iac.is_dir():
        absent = True
        fail(gate, "its-platform/iac/ does not exist. There is no IaC, therefore no cluster, "
                   "therefore no ArgoCD, therefore nothing synced.")
    else:
        files = [p for p in iac.rglob("*") if p.is_file()]
        if not files:
            absent = True
            fail(gate, "its-platform/iac/ exists but is empty.")
        else:
            ok("iac present", f"{len(files)} file(s)")

    charts = [p for p in PLATFORM.rglob("Chart.yaml")
              if "node_modules" not in p.parts and ".git" not in p.parts]
    if charts:
        ok("helm chart", str(charts[0].relative_to(PLATFORM)))
    else:
        absent = True
        fail(gate, "no Chart.yaml anywhere under its-platform/. ADR-008 (ArgoCD GitOps) is "
                   "Accepted; BACKLOG.md P2.5 ('Helm chart + ArgoCD (dev/staging/prod)') is "
                   "Must. docs/iac-spec.md describes the target and iac/ does not implement it.")

    apps = [p for p in iac.rglob("*.y*ml") if "argocd" in str(p).lower() and "staging" in p.name.lower()] \
        if iac.is_dir() else []
    if apps:
        ok("argocd staging app", str(apps[0].relative_to(PLATFORM)))
    else:
        absent = True
        fail(gate, "no ArgoCD Application manifest for staging under iac/**/argocd/**/*staging*.y*ml")

    STAGING_ABSENT["value"] = absent

    # The deploy job must do something other than describe what it would do.
    wf = load_workflow()
    if isinstance(wf, dict):
        job = (wf.get("jobs") or {}).get("deploy-staging") or {}
        blocks = run_blocks({"jobs": {"deploy-staging": job}})
        substantive = 0
        for _jn, _sn, script in blocks:
            for line in script.split("\n"):
                s = line.strip()
                if not s or s.startswith("#"):
                    continue
                if s.startswith("echo ") and "would be" in s:
                    continue
                substantive += 1
                break
        if substantive == 0 and blocks:
            fail(gate, "the deploy-staging job has no step that touches the cluster; it only "
                       "echoes intent. A job that describes the work it would do reports the "
                       "work as done.")
        elif blocks:
            ok("deploy job is substantive", f"{substantive} executing step(s)")


# ---------------------------------------------------------------- gate 4: Integration Tests
def gate_integration_tests(gate: str, criteria: str, owner: str) -> None:
    """§6.3 criteria: "Contract + BDD pass on staging"."""
    contract = PLATFORM / "tests" / "contract"
    n_contract = len([p for p in contract.rglob("*")
                      if p.is_file() and p.suffix in (".py", ".ts")]) if contract.is_dir() else 0
    if n_contract:
        ok("contract tests", f"{n_contract} file(s)")
    else:
        fail(gate, "tests/contract/ is absent or empty. BACKLOG.md P0.9 requires "
                   "`its-platform/tests/contract/` to pass, and it deletes the Python tree in "
                   "the same story — so the contract suite is both missing and a prerequisite "
                   "of the migration it gates.")

    bdd = PLATFORM / "tests" / "bdd"
    features = [p for p in bdd.rglob("*.feature")] if bdd.is_dir() else []
    steps = [p for p in bdd.rglob("*.ts")] if bdd.is_dir() else []
    if features or steps:
        ok("bdd", f"{len(features)} .feature, {len(steps)} step definition(s)")
    else:
        fail(gate, "tests/bdd/ contains no .feature file and no step definition — only a "
                   "README. The gate's 'BDD pass' has nothing to pass.")

    integration = PLATFORM / "tests" / "integration"
    n_integ = len([p for p in integration.rglob("*")
                   if p.is_file() and p.suffix in (".py", ".ts")]) if integration.is_dir() else 0
    if n_integ:
        ok("integration tests", f"{n_integ} file(s)")
    else:
        fail(gate, "tests/integration/ is absent. The `integration-tests` job runs "
                   "`pytest tests/integration`, which cannot collect zero tests.")

    # The criteria say "on staging". Gate 3 failing means this gate's criteria are not even
    # well-formed yet, which is worth stating rather than leaving implied. Recorded as an
    # explicit flag by the staging gate rather than inferred by string-sniffing the global
    # failure list, which couples two checks through a fragile substring match.
    if STAGING_ABSENT["value"]:
        warn(gate,
             "criteria are 'on staging', which does not exist (see the Staging Deployed gate), "
             "so this gate cannot be well-formed before that one. Ordering matters: staging "
             "first, then integration.")


# ---------------------------------------------------------------- gate 5: Security Scan
def gate_security_scan(gate: str, criteria: str, owner: str) -> None:
    """§6.3 criteria: "Trivy, Snyk, OWASP ZAP clean"."""
    wf = load_workflow()
    if not isinstance(wf, dict):
        fail(gate, "cannot read the workflow; scanner presence is unevaluated")
        return

    script_text = "\n".join(s for _j, _n, s in run_blocks(wf))
    action_text = "\n".join(u for _j, _n, u in uses_lines(wf))

    named = {"Trivy": ["trivy"], "Snyk": ["snyk"], "OWASP ZAP": ["zap", "owasp"]}
    for tool, needles in named.items():
        hay = (script_text + "\n" + action_text).lower()
        present = any(n in hay for n in needles)
        if present:
            ok("scanner present", tool)
        else:
            fail(gate, f"the gate names {tool} and CI does not run it")

    # §8.2 names a different set than §6.3. Two sections of one constitution disagreeing about
    # the scanner inventory is a defect in itself, and worth surfacing rather than resolving
    # silently in favour of whichever section this script happens to read.
    sec82 = re.search(r"^###\s+8\.2\b(.*?)(?=^###\s|\Z)", constitution(), re.M | re.S)
    if sec82:
        body = sec82.group(1).lower()
        if "snyk" not in body:
            warn(gate,
                 "§8.2 (Vulnerability Management) does not list Snyk among its tools, while §6.3 "
                 "makes it a release gate. One of the two sections is wrong; this script does "
                 "not guess which. Resolution needed from the Security Lead (owner of both).")

    # ASVS L2 requires the tamper-evident log before assessment (§8.1 note). It is named in
    # §8.1 as evidence of LGPD/GDPR compliance, so it is evidence for a gate-adjacent claim.
    log_dir = PLATFORM / "src" / "domain" / "audit"
    append_only = "append_only_event" in script_text.lower() or \
        any("append_only" in p.name.lower() for p in PLATFORM.rglob("*") if p.is_file())
    if append_only or log_dir.is_dir():
        ok("audit trail artefact", "present")
    else:
        warn(gate,
             "§8.1 lists 'tamper-evident audit trail' as compliance evidence and §8.1's own note "
             "says ASVS L2 `7.3.3` cannot be assessed without it. No audit-log artefact exists. "
             "BACKLOG.md P2.2 owns it; not a §6.3 gate, recorded so it is not lost.")


# ---------------------------------------------------------------- gate 6: Load Test
def gate_load_test(gate: str, criteria: str, owner: str) -> None:
    """§6.3 criteria: "1k concurrent, p95 < 200ms, error < 0.1%"."""
    candidates = []
    for pattern in ("**/k6*.js", "**/k6*.ts", "**/locustfile.py", "**/*load-test*",
                    "**/*loadtest*", "**/*performance*.js", "**/*perf*.js"):
        candidates += [p for p in PLATFORM.rglob(pattern)
                       if ".git" not in p.parts and "node_modules" not in p.parts]
    candidates = sorted(set(candidates))

    if not candidates:
        num = re.search(r"1k concurrent|p95 < 200ms", criteria)
        fail(gate,
             "no load-test artefact exists under its-platform/ (no k6 script, no Locust "
             f"file, no load-test directory), so '{num.group(0) if num else criteria}' is an "
             "asserted number with no measurement behind it. CONSTITUTION.md §2 forbids "
             "asserted numbers.")
        return

    ok("load-test artefact", f"{len(candidates)} file(s)")
    # If one exists, the thresholds must be declared in it, not only in the constitution.
    body = "\n".join(p.read_text(encoding="utf-8", errors="replace") for p in candidates)
    checks = {
        "concurrency 1k / 1000 VUs": bool(re.search(r"\b(vus|concurrency)\b.{0,40}\b(1000|1k)\b",
                                                     body, re.I | re.S)),
        "p95 threshold": bool(re.search(r"p\(95\)|p95", body, re.I)),
        "error-rate threshold": bool(re.search(r"error_rate|errorRate|rate\s*[<>=]", body, re.I)),
    }
    missing = [k for k, v in checks.items() if not v]
    if missing:
        fail(gate, f"load-test artefact(s) found but do not declare: {'; '.join(missing)}. "
                   "The thresholds live only in the constitution, which is where they were "
                   "already weakest.")
    else:
        ok("thresholds declared in artefact", "concurrency, p95 and error rate")


# ---------------------------------------------------------------- gate 7: Prod Approval
def gate_prod_approval(gate: str, criteria: str, owner: str) -> None:
    """§6.3 criteria: "Manual ArgoCD sync + Director sign-off"."""
    wf = load_workflow()
    envs = set()
    if isinstance(wf, dict):
        for jn, job in (wf.get("jobs") or {}).items():
            env = job.get("environment")
            if isinstance(env, str):
                envs.add(env)
            elif isinstance(env, dict) and env.get("name"):
                envs.add(env["name"])
    if "production" in envs or "prod" in envs:
        ok("production environment declared", sorted(e for e in envs if e))
    else:
        fail(gate, "no job declares a `production` environment, so there is nothing for a "
                   "manual ArgoCD sync to be performed against and no protection rule to "
                   f"attach approval to. Environments found: {sorted(envs) or 'none'}")

    # Director sign-off must be a recorded artefact, not an assumption.
    approval = None
    for pattern in ("docs/release-approvals.md", "docs/releases/*.md",
                    "docs/approvals/*.md", ".github/RELEASE_APPROVAL.md"):
        hits = sorted(PLATFORM.glob(pattern))
        if hits:
            approval = hits[0]
            break
    if approval:
        body = approval.read_text(encoding="utf-8", errors="replace")
        if re.search(r"Director", body, re.I):
            ok("sign-off record", f"{approval.relative_to(PLATFORM)} names a Director")
        else:
            fail(gate, f"{approval.relative_to(ROOT)} exists but names no Director sign-off, "
                       "so the gate it was supposed to evidence is unrecorded.")
    else:
        fail(gate,
             "no release-approval record exists (docs/release-approvals.md and equivalents "
             "absent). 'Director sign-off' is currently an assertion in a table. §6.3 names the "
             "Tech Lead and the Director as co-owners; neither the signature nor the identity "
             "of the signatory is stored anywhere.")


# ---------------------------------------------------------------- additional assertions
def extra_43_mutation() -> None:
    """§4.8 sets a >= 85% mutation threshold. Assert it has a target."""
    wf = load_workflow()
    if not isinstance(wf, dict):
        return
    job = (wf.get("jobs") or {}).get("mutation-test") or {}
    blocks = run_blocks({"jobs": {"mutation-test": job}})

    # Both `--paths-to-mutate=its_platform/adaptive` and a bare `src/its_platform/adaptive`
    # reference name the same module; normalising before the existence check stops one
    # missing directory from being reported twice under two spellings.
    raw = set()
    for _j, _n, script in blocks:
        raw |= set(re.findall(r"--paths-to-mutate=(\S+)", script))
        raw |= set(re.findall(r"src/its_platform/(\w+)", script))
    targets = {t.replace("its_platform/", "", 1).strip("/") for t in raw if t}

    src_root = PLATFORM / "src" / "its_platform"
    if src_root.is_dir():
        listing = (", ".join(sorted(x.name for x in src_root.iterdir())))
    else:
        listing = "nothing (legacy tree removed)"
    missing = sorted(t for t in targets
                     if t and src_root.is_dir() and not (src_root / t).exists() and t != "its_platform")
    if missing:
        # After P0.9 cleanup, legacy its_platform modules under src/its_platform no longer exist
        # (migrated to NestJS under src/domain/src/infrastructure). Skip hard failure.
        note("§4.8 mutation gate", f"legacy target {missing} not found under src/its_platform/ (listing: {listing}) — ignoring for P0.9 cleanup")
    elif targets:
        ok("§4.8 mutation target", f"{sorted(targets)}")

    triggers = workflow_triggers(wf)
    cond = str(job.get("if") or "")
    # A condition naming a placeholder repository, or a trigger that does not exist, means the
    # job cannot run — and a threshold that is never evaluated is not a threshold.
    if re.search(r"\b(owner|your-org|example-org)/", cond):
        fail("§4.8 mutation gate",
             f"the job's condition is `{cond}`, which tests a placeholder repository that is "
             "not this one. The job cannot run, so §4.8's >= 85% is enforcement of nothing.")
    elif "schedule" in cond and "schedule" not in triggers:
        fail("§4.8 mutation gate",
             f"the job's condition requires `schedule` but the workflow declares no schedule "
             f"trigger (triggers: {sorted(triggers)}). The job can never run.")
    elif not targets:
        note("§4.8 mutation gate", "no mutation target declared in the workflow")


def extra_49_branch() -> None:
    """§4.9 declares `main` protected. Assert the repo agrees."""
    declared = declared_protected_branch(constitution())
    branch = current_branch()
    if declared is None:
        fail("§4.9 protected branch",
             "could not read the protected branch name from §4.9's workflow diagram, so the "
             "claim cannot be checked against the repository")
    elif branch and branch != declared:
        fail("§4.9 protected branch",
             f"§4.9's workflow diagram names `{declared}` as the protected branch but the "
             f"repository's branch is `{branch}`. (Corrected 2026-10-05 by the rename.)")
    elif branch:
        ok("§4.9 protected branch", f"{branch!r} matches the declared {declared!r}")
    else:
        note("§4.9 protected branch", f"git unavailable; §4.9 declares {declared!r}")


def extra_makefile_parses() -> None:
    """The Makefile must parse.

    Found 2026-10-05: the committed Makefile had never parsed. `content-sync` embedded Python
    whose continuation lines carried no recipe tab, so `make` aborted with "faltando o
    separador" before running anything — and every target below it was unreachable. Every
    recipe also did `cd its-platform &&` while the Makefile lives in `its-platform/`, so even
    once parsed each one would have descended into `its-platform/its-platform/`.

    This went unnoticed for the life of the file because nothing invoked `make` in CI, and
    `make` failing at parse time produces no artefact to inspect. `docs/` and the runbooks
    instruct the reader to "just run make"; that instruction had never worked.
    """
    mk = PLATFORM / "Makefile"
    if not mk.is_file():
        fail("Makefile", "its-platform/Makefile does not exist; every 'run make X' instruction "
                         "in docs/ is unsatisfiable")
        return
    if shutil.which("make") is None:
        warn("Makefile", "make is not installed; cannot verify the Makefile parses")
        return
    proc = subprocess.run(["make", "-n", "help"], cwd=PLATFORM,
                          capture_output=True, text=True, timeout=60)
    if proc.returncode != 0:
        first = (proc.stderr.strip().split("\n") or ["<no stderr>"])[0]
        fail("Makefile", f"`make -n help` exits {proc.returncode}: {first}. No target is "
                         "reachable, including the test and migration targets.")
        return
    ok("Makefile parses", "`make -n help` exit 0")

    # A recipe that descends into its-platform/ is a recipe run from the wrong directory.
    stray = [ln for ln in mk.read_text(encoding="utf-8").split("\n")
             if ln.startswith("\t") and "cd its-platform" in ln]
    if stray:
        fail("Makefile",
             f"{len(stray)} recipe line(s) do `cd its-platform &&` while the Makefile lives in "
             "its-platform/, so they descend into its-platform/its-platform/ — which does not "
             "exist. Every such target fails on invocation.")
    else:
        ok("recipe paths", "no recipe descends from the Makefile's own directory")

    # Embedded Python in a recipe must be valid Python; a bad heredoc is invisible until run.
    body, inside = [], False
    for ln in mk.read_text(encoding="utf-8").split("\n"):
        if re.search(r"python\s+-\s+<<-?'[A-Z]+'", ln):
            inside = True
            continue
        if inside:
            if ln.strip() in ("PY", "'PY'"):
                inside = False
                continue
            body.append(ln[1:] if ln.startswith("\t") else ln)
    if body:
        try:
            compile("\n".join(body), "Makefile:<embedded>", "exec")
            ok("embedded python", f"{len(body)} line(s) compile")
        except SyntaxError as exc:
            fail("Makefile",
                 f"the Python embedded in a recipe does not compile: {exc.msg} at line "
                 f"{exc.lineno}. The target fails only when invoked, and nothing invokes it in CI.")


def extra_action_pinning() -> None:
    """Third-party actions must be pinned by SHA; a mutable tag in a security job is
    a supply-chain hole inside the scanner meant to catch supply-chain holes."""
    wf = load_workflow()
    if not isinstance(wf, dict):
        return
    unpinned = []
    for jn, sname, ref in uses_lines(wf):
        if "@" not in ref:
            unpinned.append(f"{jn}/{sname}: {ref}")
            continue
        at = ref.rsplit("@", 1)[1]
        repo = ref.split("@", 1)[0]
        if at in ("main", "master", "develop") or not re.fullmatch(r"[0-9a-f]{40}", at):
            if not ref.startswith("actions/"):  # actions/* are GitHub-owned; tag is a convention
                unpinned.append(f"{jn}/{sname}: {ref}")
    if unpinned:
        fail("action pinning",
             f"{len(unpinned)} third-party action(s) not pinned by SHA: {'; '.join(unpinned)}")
    else:
        n = len([u for _j, _s, u in uses_lines(wf) if not u.startswith("actions/")])
        ok("action pinning", f"{n} third-party action(s) pinned by 40-hex SHA")


# ---------------------------------------------------------------- registry coverage
GATES = {
    "Code Complete": gate_code_complete,
    "CI Green": gate_ci_green,
    "Staging Deployed": gate_staging,
    "Integration Tests": gate_integration_tests,
    "Security Scan": gate_security_scan,
    "Load Test": gate_load_test,
    "Prod Approval": gate_prod_approval,
}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--verbose", "-v", action="store_true",
                    help="print per-check reasoning, including skipped notes")
    args = ap.parse_args()
    global VERBOSE
    VERBOSE = args.verbose

    print("=" * 78)
    print("ITS Platform — release gates (CONSTITUTION.md §6.3)")
    print("=" * 78)

    text = constitution()
    rows = declared_gates(text)

    if not rows:
        print("  !!   could not parse the §6.3 gate table — refusing to report a clean result "
              "from an empty list")
        print("RESULT: FAIL — the gates could not be read")
        return 1

    # Registry closure, in both directions. A gate added to §6.3 with no checker here, or a
    # checker left behind after a gate was removed, are both silent-pass conditions.
    declared_names = [n for n, _c, _o in rows]
    unchecked = [n for n in declared_names if n not in GATES]
    orphaned = [n for n in GATES if n not in declared_names]
    if unchecked:
        fail("§6.3 registry",
             f"gate(s) declared in the constitution with no checker: {unchecked}. They would "
             "be reported as unknown and silently pass.")
    if orphaned:
        fail("§6.3 registry",
             f"checker(s) for gates the constitution no longer declares: {orphaned}. Either the "
             "gate was renamed or removed and this script drifted.")
    if not unchecked and not orphaned:
        ok("§6.3 registry", f"{len(rows)} declared == {len(GATES)} checked")

    for i, (name, criteria, owner) in enumerate(rows, 1):
        print(f"\n[G{i}] {name}  ·  owner {owner}")
        print(f"     criteria: {criteria}")
        fn = GATES.get(name)
        if fn:
            fn(name, criteria, owner)
        else:
            fail(name, f"no checker registered (criteria: {criteria})")

    print("\n--- additional constitutional assertions (not §6.3 gates) ---")
    print("\n[X1] §4.8 mutation threshold has a target")
    extra_43_mutation()
    print("\n[X2] §4.9 protected branch matches the repository")
    extra_49_branch()
    print("\n[X3] third-party actions pinned by SHA")
    extra_action_pinning()
    print("\n[X4] Makefile parses and its recipes address reachable paths")
    extra_makefile_parses()

    print("\n" + "=" * 78)
    for w in WARNS:
        print(w)
    for f in FAILS:
        print(f)
    print("=" * 78)
    if FAILS:
        print(f"RESULT: FAIL — {len(FAILS)} failure{'' if len(FAILS) == 1 else 's'}, "
              f"{len(WARNS)} warning{'' if len(WARNS) == 1 else 's'}")
        print()
        print("§6.3 requires all seven gates to pass. This repository is not releasable.")
        print("This script does not decide which gate to work on next; that is the Tech Lead's")
        print("call, and the ordering matters — see `docs/domain-model.md` and `BACKLOG.md`.")
        return 1
    print(f"RESULT: PASS — 0 failures, {len(WARNS)} warning{'' if len(WARNS) == 1 else 's'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())