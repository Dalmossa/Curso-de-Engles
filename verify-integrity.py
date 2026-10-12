#!/usr/bin/env python3
"""
Content-integrity checker for the Curso-de-Ingles spec repository.

This is NOT a build, test, or lint step: there is no code in this repository to build or test.
It checks the *internal consistency of the specification and content documents* — the class of
error that is invisible when reading one file at a time and that has actually occurred in this repo
(orphan IDs, non-existent registry entries, duplicate item IDs, declared-but-absent artifacts).

Run:  python3 verify-integrity.py
Exit: 0 = all checks pass, 1 = at least one FAIL.
"""

import collections
import pathlib
import re
import sys
from collections import Counter, defaultdict

ROOT = pathlib.Path(__file__).resolve().parent

FAILS: list[str] = []
WARNS: list[str] = []


def fail(check: str, detail: str) -> None:
    FAILS.append(f"[FAIL] {check}: {detail}")


def warn(check: str, detail: str) -> None:
    WARNS.append(f"[WARN] {check}: {detail}")


def ok(check: str, detail: str = "") -> None:
    print(f"  ok   {check}{(' — ' + detail) if detail else ''}")


def read(name: str) -> str:
    # Try root first, then specs/, corpus/, reviews/, lessons/, packs/, archive/
    for sub in ("", "specs", "corpus", "reviews", "lessons/a1", "lessons/a2", "lessons/b1", "lessons/b2", "lessons/remediation",
                "packs/a1", "packs/a2", "packs/b1", "packs/b2", "packs/remediation", "archive"):
        p = ROOT / sub / name if sub else ROOT / name
        if p.exists():
            return p.read_text()
    return ""


# Map: key used in code -> actual file path
SPEC_PATHS = {
    "AGENTS.md": "AGENTS.md",
    "assessment-item-spec.md": "specs/assessment-item-spec.md",
    "content-map.md": "content-map.md",
    "curriculum-graph-spec.md": "specs/curriculum-graph-spec.md",
    "diagnostic-spec.md": "specs/diagnostic-spec.md",
    "external-sources.md": "external-sources.md",
    "les_a2_meeting_open.md": "lessons/a2/les_a2_meeting_open.md",
    "les_a2_small_talk.md": "lessons/a2/les_a2_small_talk.md",
    "lesson-15min-workplace-greetings.md": "lessons/a2/lesson-15min-workplace-greetings.md",
    "listening-corpus-spec.md": "specs/listening-corpus-spec.md",
    "listening-corpus.md": "corpus/listening-corpus.md",
    "pack-les-a2-greetings-intro.md": "packs/a2/pack-les-a2-greetings-intro.md",
    "post-lesson-practice-spec.md": "specs/post-lesson-practice-spec.md",
    "SDD.md": "SDD.md",
    "stats-progress-evaluation-spec.md": "specs/stats-progress-evaluation-spec.md",
    "tier-b-review.md": "reviews/tier-b-review.md",
}
DOCS = {k: read(v) for k, v in SPEC_PATHS.items()}
SPECS = list(SPEC_PATHS.keys())  # for backward compat in checks
CORPUS_MD = sorted(p.name for p in (ROOT / "Ingles" / "output").glob("*.md"))
ALL = "\n".join(DOCS.values())


# ---------------------------------------------------------------- 1. registry closure
def check_registry() -> None:
    """Every les_/mod_/ms_/diag_ ID referenced anywhere must exist in the §4.3 registry."""
    print("\n[1] Registry closure (curriculum-graph-spec.md §4.3)")
    cg = DOCS["curriculum-graph-spec.md"]
    # registry entries are bolded blocks: **mod_xxx** then **les_...** lines
    # §4.3 is a markdown table: a row begins `| `les_foo` | ...`. Module rows and
    # lesson rows share the shape. Bolded module headers elsewhere are also accepted.
    reg = set(re.findall(r"^\|\s*`((?:les|mod|ms|diag)_[a-z0-9_]+)`\s*\|", cg, re.M))
    reg |= set(re.findall(r"\*\*`((?:les|mod|ms|diag)_[a-z0-9_]+)`\*\*", cg))
    reg |= set(re.findall(r"\*\*((?:les|mod|ms|diag)_[a-z0-9_]+)\*\*", cg))
    if not reg:
        fail("registry", "no registry IDs parsed from curriculum-graph-spec.md §4.3")
        return
    ok("registry parsed", f"{len(reg)} IDs")

    # references: outside backticks, inside backticks, and inside code comments.
    # A trailing `_` means a wildcard/abbreviation in prose (e.g. `les_b1_grammar_*`),
    # not an ID -- those are skipped, not reported as orphans.
    pat = re.compile(r"(?<![`a-z0-9_*])((?:les|mod|ms|diag)_[a-z0-9_]*[a-z0-9])(?![a-z0-9_*])")
    refs = defaultdict(set)
    for name, text in DOCS.items():
        for m in pat.finditer(text):
            refs[m.group(1)].add(name)
    orphans = {i: f for i, f in refs.items() if i not in reg}
    if orphans:
        for i, files in sorted(orphans.items()):
            fail("orphan ID", f"{i} referenced in {sorted(files)} but not in §4.3 registry")
    else:
        ok("orphan IDs", f"0 orphans across {len(SPECS)} docs, {len(refs)} distinct references")


# ---------------------------------------------------------------- 2. lesson count
def check_lesson_count() -> None:
    print("\n[2] Curriculum arithmetic (§4.3: 18 modules x 6 + 5 remediation + 10 IT expansions = 123)")
    cg = DOCS["curriculum-graph-spec.md"]
    mods = set(re.findall(r"^\|\s*`(mod_[a-z0-9_]+)`\s*\|", cg, re.M))
    les = set(re.findall(r"^\|\s*`(les_[a-z0-9_]+)`\s*\|", cg, re.M))
    ok("modules", f"{len(mods)}")
    ok("lessons", f"{len(les)}")
    if len(les) != 123:
        fail("lesson count", f"expected 123, found {len(les)}")

    # ----------------------------------------------------------------------------------------
    # Registry <-> filesystem closure. Found 2026-10-01: this check counted 123 ids in §4.3 and
    # reported the arithmetic sound, while 116 lesson files existed. The 7-id gap was invisible
    # because the count was taken from the registry and never compared against the disk — the same
    # class of error as the §4.1 example table duplicating 6 rows, one layer up. A registry is a
    # claim about what exists; a claim that is never checked against the thing it describes is a
    # to-do list wearing a table's clothing. Two distinct obligations, checked separately:
    #
    #   (a) every registry id resolves to an authored file (the 123-count means nothing otherwise);
    #   (b) every authored file appears in the registry (an orphan lesson is invisible to [2]
    #       entirely, since [2] only ever walks the spec).
    #
    # `blocked_*` ids are exempt from (a) and MUST say so, because "no file" and "we decided not to
    # write it" are different states and only the second is a decision. Found here: 5 `les_a2_it_*`
    # lessons sit at status `designed` with no file and no block reason.
    REGISTRY_STATUS: dict[str, str] = {}
    for line in cg.split("\n"):
        rm = re.match(r"^\|\s*`(les_[a-z0-9_]+)`\s*\|", line)
        if rm and len(line.split("|")) - 2 == 4:  # §4.3 rows only; §1.x/§5.x tables differ
            REGISTRY_STATUS.setdefault(rm.group(1), line.split("|")[4].strip())
    # Match on the DECLARED `**Lesson ID:**`, never the filename. `les_a2_greetings_intro` is
    # authored in `lesson-15min-workplace-greetings.md`, so a stem-based set reported a
    # well-documented lesson as missing AND its file as an orphan — two failures from one wrong
    # join key, which is why the key is the field the artefact states rather than the one the
    # filesystem happens to use.
    authored: dict[str, str] = {}
    # `lesson-15min-workplace-greetings.md` declares id `les_a2_greetings_intro` but its filename
    # starts `lesson-`, which `les_*.md` cannot match. Enumerated by declared id over an explicit
    # list rather than a glob, so a second such file cannot hide the way the first did.
    for p in sorted(ROOT.rglob("les_*.md")) + [ROOT / "lessons" / "a2" / "lesson-15min-workplace-greetings.md"]:
        if not p.exists():
            continue
        im = re.search(r"\*\*Lesson ID:\*\*\s*`(les_[a-z0-9_]+)`", p.read_text())
        if im is None:
            fail("registry closure", f"{p.name} declares no `**Lesson ID:**`, so it cannot be "
                                     f"matched against §4.3 at all")
            continue
        authored[im.group(1)] = p.name
    unresolved, blocked_ok = [], []
    for lid in sorted(les):
        if lid in authored:
            continue
        # Strip the markdown decoration around the status: the registry writes
        # `` `blocked_no_adequate_source` `` and `✅ **authored**`, so a bare `startswith` test
        # silently classified the one intentional block as an accident.
        st = re.sub(r"[*`]", "", REGISTRY_STATUS.get(lid, "")).strip()
        if st.startswith("blocked"):
            blocked_ok.append(lid)
        else:
            unresolved.append((lid, st or "<no §4.3 status row>"))
    if unresolved:
        for lid, st in unresolved:
            fail("registry closure",
                 f"§4.3 declares `{lid}` (status {st!r}) but no `{lid}.md` exists — the 123-count in "
                 f"this check is taken from the registry, so an unauthored lesson inflates it "
                 f"silently. Either author the file or mark the row `blocked_*` with a reason")
    else:
        ok("registry closure",
           f"all {len(les) - len(blocked_ok)} authored ids in §4.3 resolve to a file; "
           f"{len(blocked_ok)} carry an explicit `blocked_*` status ({', '.join(blocked_ok)})")
    orphans = sorted(k for k in authored if k not in les)
    if orphans:
        fail("registry closure",
             f"{len(orphans)} authored lesson file(s) are absent from §4.3: "
             f"{', '.join(f'`{k}` in {authored[k]}' for k in orphans)} — check [2] walks the spec, "
             f"not the disk, so an orphan lesson is counted nowhere")
    else:
        ok("no orphans",
           f"every one of the {len(authored)} authored lesson ids is registered in §4.3")

    # ----------------------------------------------------------------------------------------
    # (c) The §4.3 `Status` column must agree with the disk — the mirror of (a)/(b), one layer
    # down. Found 2026-10-01 while updating the numbers this session: 110 rows said `designed`,
    # which §4.3's own legend defines as *no file*, while the file existed and passed check [8];
    # 15 more carried a sourcing value or a remediation trigger where the authoring state belongs.
    # The registry was right about *which* ids exist and wrong about what it said they *were*.
    # A status column nobody recomputes is a count nobody checks — the same failure this registry
    # gave check [2] in the first place. Reconciliation: `/tmp` script + §4.3's legend.
    stale: list[tuple[str, str]] = []
    _a, _b = cg.find("### 4.3"), cg.find("### 4.4")
    registry_seg = cg[_a:_b] if _a >= 0 and _b > _a else ""
    for line in registry_seg.split("\n"):
        sm = re.match(r"^\|\s*`(les_[a-z0-9_]+)`\s*\|", line)
        if not sm or sm.group(1) not in authored:
            continue
        cells = line.strip().strip("|").split("|")
        if len(cells) not in (3, 4):          # §4.3 rows: 4 cols; remediation rows: 3
            continue
        st = cells[-1].strip()
        if "authored" not in st.lower():
            stale.append((sm.group(1), st))
    if stale:
        for lid, st in stale:
            fail("registry status",
                 f"§4.3 says `{lid}` is {st!r} but `{authored[lid]}` exists and declares the id — an "
                 f"authored lesson marked `designed`/`sourced_*` understates the repository. Mark it "
                 f"`✅ **authored**` and keep the displaced value as a `· …` suffix, never as the state")
    else:
        ok("registry status",
           f"every §4.3 row whose lesson file exists is marked `authored` ({len(authored)} rows)")

    # Every authored lesson also owes a practice pack — §2.1 makes the pack the immediate
    # post-lesson layer, so a lesson with no pack is a lesson whose 15 minutes end at Phase 4 with
    # nothing to retrieve from. `post-lesson-practice-spec.md` §11 records validation for 7 packs;
    # the other 110 use the older `pack_les_*_v1.md` schema and are named by their own Pack ID.
    # Extract EVERY `les_*` token on the `**Lesson:**` line rather than the first one: the two
    # schemas disagree about whether that field names the id or the file, and
    # `pack-les-a2-greetings-intro.md` names both on one line —
    # "`lesson-15min-workplace-greetings.md` (authored lesson `les_a2_greetings_intro`)".
    pack_for: dict[str, str] = {}
    for p in sorted(ROOT.rglob("pack-les-*.md")) + sorted(ROOT.rglob("pack_les_*_v1.md")):
        lm = re.search(r"^\*\*Lesson:\*\*.*$", p.read_text(), re.M)
        for lid in re.findall(r"les_[a-z0-9_]+", lm.group(0) if lm else ""):
            pack_for.setdefault(lid, p.name)
    nopack = sorted(k for k in authored if k not in pack_for)
    if nopack:
        for k in nopack:
            fail("pack coverage",
                 f"`{k}` is authored in `{authored[k]}` but no pack declares it as its `**Lesson:**` — "
                 f"§2.1 makes the pack the immediate post-lesson layer, so this lesson has nothing "
                 f"to retrieve from after Phase 4")
    else:
        ok("pack coverage", f"every one of the {len(authored)} authored lessons has a pack")
    n_extra = sorted(k for k in pack_for if k not in authored)
    if n_extra:
        fail("pack coverage",
             f"{len(n_extra)} pack(s) point at a lesson that does not exist: "
             f"{', '.join(n_extra)}")
    # module size check: 3 IT modules expanded beyond 6 lessons (by design)
    per = Counter()
    rem = Counter()
    current_mod = None
    for line in cg.split("\n"):
        mod_match = re.match(r"^\*\*`(mod_[a-z0-9_]+)`\*\*", line)
        if mod_match:
            current_mod = mod_match.group(1)
            per[current_mod] = 0
            rem[current_mod] = 0
        les_match = re.match(r"^\|\s*`(les_[a-z0-9_]+)`\s*\|", line)
        if les_match and current_mod:
            per[current_mod] += 1
            # The 5 remediation nodes (`les_rem_*`) are registered inside a module block, not
            # beside one, so `mod_b1_fluency_project` carries 6 + 5 = 11 rows. Counting them as
            # module lessons made this module look oversized for the life of the check. The base
            # size is still 6, so remediation rows are counted separately rather than by raising
            # the module's expectation to 11 — raising it would hide a future real drift.
            if les_match.group(1).startswith("les_rem_"):
                rem[current_mod] += 1
    # Expected sizes: 3 IT modules expanded, rest 6 — on the module's own rows, remediation
    # nodes excluded.
    expected = {m: 6 for m in mods}
    expected["mod_a2_it_fundamentals"] = 10
    expected["mod_b1_it_technical"] = 10
    expected["mod_b2_it_senior"] = 8
    base = {k: v - rem.get(k, 0) for k, v in per.items()}
    bad = {k: v for k, v in base.items() if v != expected.get(k, 6)}
    if bad:
        for k, v in sorted(bad.items()):
            warn("module size", f"{k} has {v} module lessons, expected {expected.get(k, 6)}")
    else:
        detail = ", ".join(f"{k} +{rem[k]} remediation" for k in sorted(rem) if rem[k])
        ok("module sizes",
           f"all {len(base)} modules have expected lesson counts"
           + (f"; remediation nodes counted separately ({detail})" if detail else ""))
    n_rem = sum(rem.values())
    if n_rem != 5:
        fail("module size", f"expected 5 remediation nodes (`les_rem_*`), found {n_rem} — the "
                            f"curriculum arithmetic in the spec header depends on it")
    else:
        ok("remediation", "5 remediation nodes, counted outside their host module's 6")
    # §4.4.5 retired `deferred_no_source`; the registry now grades external coverage instead.
    # Counts are row-scoped: §4.4.5's own prose quotes these status names, so a document-wide
    # count measures the explanation rather than the registry.
    # only §4.3 registry rows: first cell is a lesson id
    rows = [ln for ln in cg.split("\n") if re.match(r"^\|\s*`les_[a-z0-9_]+`", ln)]
    n_deferred = sum("deferred_no_source" in ln for ln in rows)
    if n_deferred:
        fail("sourcing status", f"{n_deferred} lesson row(s) still marked deferred_no_source — §4.4.5 retired it")
    else:
        ok("deferred retired", "0 lesson rows remain deferred_no_source")
    for status, expect in (("sourced_external", 9), ("sourced_external_thin", 3), ("blocked_no_adequate_source", 1)):
        got = sum(f"`{status}`" in ln for ln in rows)
        (ok if got == expect else fail)("sourcing status", f"{status} — {got} rows, §4.4.5 declares {expect}")

    # ----------------------------------------------------------------------------------------
    # Summary arithmetic: §2's CEFR table and §13's GRAPH STATE SUMMARY both restate counts that
    # §4.3 owns, and both were wrong for the life of the repository (108 lessons, 1 authored,
    # against 123 registry ids and 122 files) because nothing recomputed them. That is the exact
    # defect [2] was built for, one layer up — a registry that is checked but a summary of it that
    # is not. Both are recomputed here.
    n_lesson_rows, n_total = sum(base.values()), sum(base.values()) + n_rem

    # §2 — `| **A1** | … | 4 | 24 | 6.0h | 8 |` … `| **Total (full catalog)** | … | 18 | 118 |`
    lvl, tot = {}, None
    for ln in cg.split("\n"):
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        if len(cells) != 8 or not re.fullmatch(r"\*{0,2}(A1|A2|B1|B2|Total[^|]*)\*{0,2}", cells[0]):
            continue
        if not re.fullmatch(r"[\d.]+h", cells[6].strip("*")):   # pins this to the §2 CEFR table ("Est. Hours")
            continue
        try:
            val = int(cells[5].strip("*"))
        except ValueError:
            continue
        if cells[0].strip("*").startswith("Total"):
            tot = val
        else:
            lvl[cells[0].strip("*")] = val
    if len(lvl) == 4 and tot is not None and (sum(lvl.values()) != tot or tot != n_lesson_rows):
        fail("summary arithmetic",
             f"§2 CEFR table sums to {sum(lvl.values())} with a Total of {tot}, but §4.3 registers "
             f"{n_lesson_rows} module lessons ({'+'.join(f'{k}:{v}' for k, v in sorted(lvl.items()))}) "
             f"— a derived table that is not recomputed is a count nobody checks")
    elif len(lvl) == 4 and tot is not None:
        ok("summary arithmetic",
           f"§2 CEFR table sums to {tot} module lessons, matching §4.3 "
           f"({'+'.join(f'{k}:{v}' for k, v in sorted(lvl.items()))})")

    # §13 — GRAPH STATE SUMMARY
    def _metric(label: str):
        m = re.search(r"^\|\s*" + re.escape(label) + r"\s*\|([^|]*)\|", cg, re.M)
        return m.group(1) if m else None

    def _num(s: str):
        m = re.search(r"\d[\d,]*", re.sub(r"`[^`]*`", "", s or ""))
        return int(m.group(0).replace(",", "")) if m else None

    packs = len(list(ROOT.rglob("pack-les-*.md"))) + len(list(ROOT.rglob("pack_les_*_v1.md")))
    drift = []
    for label, want in [("Modules defined (§3)", len(base)),
                        ("Lessons registered (§4.3)", n_lesson_rows),
                        ("Remediation nodes (§4.3)", n_rem),
                        ("Total lesson IDs in system", n_total),
                        ("Lessons authored", len(authored)),
                        ("Lessons blocked", n_total - len(authored)),
                        ("Practice packs authored", packs)]:
        got = _num(_metric(label))
        if got != want:
            drift.append(f"{label}: table says {got!r}, registry/disk says {want}")
    if drift:
        for d in drift:
            fail("summary arithmetic", f"§13 — {d}")
    else:
        ok("summary arithmetic",
           f"§13 matches the registry and disk ({n_total} ids, {len(authored)} authored, {packs} packs)")


# ---------------------------------------------------------------- 3. source PDFs present
def check_sources() -> None:
    print("\n[3] Source corpus (Ingles/output/)")
    if not CORPUS_MD:
        fail("sources", "no markdown files found in Ingles/output/")
        return
    ok("source files", f"{len(CORPUS_MD)}")
    for f in CORPUS_MD:
        p = ROOT / "Ingles" / "output" / f
        n = p.read_text().count("\n")
        if n < 100:
            warn("thin source", f"{f} has only {n} lines")

    # 3b. Licence status of the local corpus (external-sources.md §0.5).
    #     Three files carry an explicit non-redistribution notice and four are silent; NOT ONE is
    #     permissively licensed. This check exists so that notice cannot be quietly deleted in a
    #     refactor, and so the "unverifiable = reserved" rule is not forgotten. The licence text is
    #     load-bearing for every downstream reuse decision in the repo.
    RESTRICTED = {
        "Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md": "LICENÇA DE USO",
        "leia-e-escreva-melhor-em-ingles.md": "LICENÇA DE USO",
        "frases-ingles-trabalho.md": "obter a devida permissão",
    }
    for f, marker in RESTRICTED.items():
        p = ROOT / "Ingles" / "output" / f
        if not p.exists():
            fail("local licence", f"{f} is missing — §0.5 restricts reuse of it")
        elif marker not in p.read_text():
            fail("local licence", f"{f} no longer contains {marker!r} — the restriction notice was removed")
    ok("local licence notices", f"{len(RESTRICTED)}/3 restricted sources still carry their notice")

    # every lesson row must be classifiable, and the class must match §0.5's declared split
    cg_rows = {}
    for m in re.finditer(r"^\|\s*`(les_[a-z0-9_]+)`\s*\|(.*)$", DOCS["curriculum-graph-spec.md"], re.M):
        cg_rows.setdefault(m.group(1), m.group(2).lower())  # first occurrence wins (§4.1 dupes)
    TOK = (
        ("A_restricted", r"dicion[aá]rio|frases|leia-e|leia |docs/"),
        ("B_copyright_only", r"it a\d|cetam"),
        ("C_no_copyright", r"apostila|viagens"),
        ("D_permissive_external", r"\bs\d\d\b"),
    )
    cls = collections.Counter()
    for lid, row in cg_rows.items():
        for k, pat in TOK:
            if re.search(pat, row):
                cls[k] += 1
                break
        else:
            cls["E_no_source"] += 1
    # §0.5's table, which the registry's own §8 claims to measure. The declared split is PARSED
    # from external-sources.md, never written as a literal here: a hardcoded declaration is the
    # same defect [2] exists to catch — a number that cannot drift when its source is edited, so
    # the check compares the registry against a copy of itself and always agrees.
    ext = DOCS.get("external-sources.md", "")
    CLASS_PAT = {
        "A_restricted": r"explicitly restricted|BaixeLivros",
        "B_copyright_only": r"©-only|CETAM",
        "C_no_copyright": r"no copyright statement",
        "D_permissive_external": r"permissive external",
        "E_no_source": r"no specific source",
    }
    DECLARED: dict[str, int] = {}
    for ln in ext.split("\n"):
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        # §0.5's table: Class | Lessons | Share | Verdict. Require the share column to be a
        # percentage so no other four-column table can match a class keyword.
        if len(cells) != 4 or not re.fullmatch(r"\*{0,2}\d+%\*{0,2}", cells[2]):
            continue
        for k, pat in CLASS_PAT.items():
            if re.search(pat, cells[0]):
                m = re.search(r"\d+", cells[1].strip("*"))
                if m:
                    DECLARED[k] = int(m.group(0))
    if len(DECLARED) != 5:
        fail("reuse basis", f"could not read all 5 classes from external-sources.md §0.5 "
                            f"(found {sorted(DECLARED)}) — the split must stay machine-readable")
    for k, expect in sorted(DECLARED.items()):
        got = cls[k]
        (ok if got == expect else fail)(
            "reuse basis", f"{k} — {got} lessons, external-sources.md §0.5 declares {expect}"
        )
    if cls["D_permissive_external"] == 0:
        fail("reuse basis", "no lesson has a permissively-licensed source — the project has no publishable base")


# ---------------------------------------------------------------- 4. JSON blocks valid
def check_json() -> None:
    print("\n[4] JSON blocks parse")
    import json

    total = 0
    frag = 0
    for name, text in DOCS.items():
        for i, block in enumerate(re.findall(r"```json\n(.*?)```", text, re.S)):
            total += 1
            body = block.strip()
            if not body.startswith(("{", "[")):
                # A declared fragment (e.g. a nested field shown on its own). Validate it
                # as a fragment rather than demanding a top-level document.
                frag += 1
                try:
                    json.loads("{" + body + "}")
                except Exception as e:
                    fail("json", f"{name} json fragment #{i + 1}: {e}")
                continue
            try:
                json.loads(body)
            except Exception as e:
                fail("json", f"{name} json block #{i + 1}: {e}")
    ok("json blocks", f"{total} parsed ({frag} declared fragments wrapped for validation)")


# ---------------------------------------------------------------- 5. listening corpus
def check_corpus() -> None:
    print("\n[5] Listening corpus integrity")
    t = DOCS["listening-corpus.md"]
    if not t:
        fail("corpus", "listening-corpus.md missing")
        return

    # 5a. declared dialogues must exist
    idx = re.search(r"\| Dialogue \| Level \|.*?\|\n\|[-| ]+\|\n(.*?)\n\n", t, re.S)
    declared = set(re.findall(r"`(dlg_[a-z0-9_]+)`", idx.group(1))) if idx else set()
    blocks = re.split(r"\n## `(dlg_[a-z0-9_]+)`\n", t)
    present = {blocks[i] for i in range(1, len(blocks), 2)}
    if declared - present:
        fail("corpus", f"declared in index but no section: {sorted(declared - present)}")
    else:
        ok("declared dialogues exist", f"{len(declared)} declared, {len(present)} present")
    if present - declared:
        warn("corpus", f"present but not in index: {sorted(present - declared)}")

    # 5b. item ids unique
    ids = re.findall(r"### L\d-\d+ — `(lst_\w+?_\d+)`", t)
    dupes = [i for i, c in Counter(ids).items() if c > 1]
    if dupes:
        fail("corpus", f"duplicate item IDs: {sorted(dupes)}")
    else:
        ok("item IDs unique", f"{len(ids)} slots")

    # 5c. the declared Status must agree with the §9 log, and an item that carries a §9
    # marker must not declare plain `shipped`.
    #
    # This check previously looked for the literal `§9 DEF-n: this item is not`, a string that
    # occurs once in the whole file and in no item body, so it could never fire. Worse, the
    # sibling check 5d decided withdrawal by substring over the item body, which meant an item
    # whose prose merely *reports* the withdrawal history was skipped. `lst_prn_th_012` cites
    # the three DEF-6 withdrawals in its design note and was therefore never key-validated.
    # Status is now a field the author writes, and both checks read it.
    n_status = n_repaired = 0
    for m in re.finditer(
            r"### (L\d-\d+) — `(lst_\w+?_\d+)`([^\n]*)\n"
            r"\*\*Status:\*\* ([^\n]*)\n(.*?)(?=\n### |\n---|\n# |$)", t, re.S):
        label, iid, _rest, status, body = m.groups()
        n_status += 1
        defs = set(re.findall(r"§9 (DEF-\d+)", body))
        withdrawn = "withdrawn" in status
        if defs and status.strip() == "shipped":
            fail("corpus", f"{label} {iid} carries {sorted(defs)} in its body but declares "
                           f"Status: shipped — a repaired item must say so")
        elif defs:
            n_repaired += 1
            for d in sorted(defs):
                if d not in status:
                    warn("corpus", f"{label} {iid} body cites {d} but Status line does not "
                                   f"name it: {status.strip()!r}")
        if withdrawn and "§9 DEF-" not in status:
            fail("corpus", f"{label} {iid} is withdrawn with no §9 reference in its Status line")
    # 5c-ii. The published inventory must equal the fields.
    #
    # This is the check the corpus needed and did not have. §8.2 published 68 admissible
    # items while the corpus held 74, and nothing noticed, because §8.2 was hand-maintained
    # and the only other source of truth - check 5d's substring test - was itself wrong.
    # Counting fields and comparing against the table needs no prose at all.
    #
    # Two earlier attempts to cross-validate the field against the item body both failed
    # and are recorded here so they are not retried: a prose test read the *history* of a
    # withdrawal as the item's *state* (firing on `lst_prn_scluster_007`, which documents
    # the withdrawn original and then ships a replacement), and a structural test required a
    # withdrawn item to carry no keyed option table (firing on 7 items, because the table is
    # the record of the defect, not a claim to ship). The field is the state; the body is
    # evidence; they are not the same kind of thing and must not be reconciled.
    parts_c = re.split(r"\n## `(dlg_[a-z0-9_]+)`\n", t)
    truth: Counter = Counter()
    ndlg: Counter = Counter()
    for j in range(1, len(parts_c), 2):
        did, dbody = parts_c[j], parts_c[j + 1]
        lvl = "A1" if "_a1_" in did else ("A2" if "_a2_" in did else "B1")
        ndlg[lvl] += 1
        for k in re.finditer(r"### (L\d)-\d+ — `lst_\w+?_\d+`([^\n]*)\n"
                             r"\*\*Status:\*\* ([^\n]*)\n", dbody):
            kind, status = k.group(1), k.group(3).strip()   # kind is already "L1"/"L2"
            truth[(lvl, f"{kind}_auth")] += 1
            if status.startswith("shipped"):
                truth[(lvl, f"{kind}_adm")] += 1
            elif status.startswith("shadow-only"):
                truth[(lvl, "shadow")] += 1
            else:
                truth[(lvl, f"{kind}_wd")] += 1
    LV = ("A1", "A2", "B1")
    inv = re.search(r"### 8\.2 Item inventory\n+(.*?)\n\n", t, re.S)
    if not inv:
        fail("corpus", "§8.2 item inventory table not found")
    else:
        cells = {}
        for row in inv.group(1).split("\n"):
            if not row.startswith("|") or set(row) <= set("|- "):
                continue
            f = [c.strip().replace("**", "") for c in row.strip("|").split("|")]
            cells[f[0]] = f[1:]
        want = {
            "Dialogues": [ndlg[lv] for lv in LV],
            "L1 authored": [truth[(lv, "L1_auth")] for lv in LV],
            "L2 slots authored": [truth[(lv, "L2_auth")] for lv in LV],
            "L2 admissible": [truth[(lv, "L2_adm")] for lv in LV],
            "L2 withdrawn (no replacement)": [truth[(lv, "L2_wd")] for lv in LV],
            "Admissible total": [truth[(lv, "L1_adm")] + truth[(lv, "L2_adm")]
                                 for lv in LV],
        }
        for label, exp in want.items():
            if label not in cells:
                fail("corpus", f"§8.2 inventory has no `{label}` row")
                continue
            got = cells[label][:3]
            exp_s = [str(e) for e in exp]
            if got != exp_s:
                fail("corpus", f"§8.2 `{label}` says A1/A2/B1 = {got} but the Status fields "
                               f"count {exp_s} — the inventory is hand-maintained and has "
                               f"drifted from the corpus")

    n_heads = len(re.findall(r"### L\d-\d+ — `lst_\w+?_\d+`", t))
    if n_status != n_heads:
        fail("corpus", f"{n_heads - n_status} item header(s) have no `**Status:**` line — "
                       f"status is a field, not a phrase the author may omit")
    else:
        ok("item status declared", f"{n_status} of {n_heads} items, {n_repaired} with a §9 trace")

    # 5d. every live item has exactly one marked key.
    #
    # Two exemptions, both earned by defects that actually occurred in this corpus:
    #   * Withdrawn items — a withdrawn item is not answerable, and its body records the
    #     option set that caused the withdrawal.
    #   * Superseded option tables — an item fixed in place (DEF-3, DEF-9) keeps the VOID
    #     original table visible so the defect stays auditable, then gives the shipped form.
    #     Only the LAST option table is live, so only that table is counted.
    for m in re.finditer(r"### (L\d-\d+) — `(lst_\w+?_\d+)`(.*?)(?=\n### |\n---|\n# )", t, re.S):
        label, iid, body = m.group(1), m.group(2), m.group(3)
        # Exemption keyed on the Status FIELD, never on the word "withdrawn" appearing
        # anywhere in the body. The old substring test was disarmable by prose: an item that
        # documents a past withdrawal escaped the key check entirely.
        st = re.search(r"^\*\*Status:\*\* ([^\n]*)", body, re.M)
        if not st:
            fail("corpus", f"{label} {iid} has no `**Status:**` line (see 5c)")
            continue
        if "withdrawn" in st.group(1):
            ok("item withdrawn", f"{iid} (key check exempt)")
            continue
        if "shadow-only" in st.group(1):
            ok("item shadow-only", f"{iid} (key check exempt — Shadow CAT free-response)")
            continue
        tables = re.findall(r"(?:^\|.*\n)+", body, re.M)
        if not tables:
            fail("corpus", f"{label} {iid} has no option table")
            continue
        n_keys = tables[-1].count("✓")
        if n_keys == 0:
            fail("corpus", f"{label} {iid} shipped option table has no key (✓)")
        elif n_keys > 1:
            fail("corpus", f"{label} {iid} shipped option table has {n_keys} keys — C-B violation")
        else:
            ok("item key", iid)

    # 5e. duration within Q-L2 at 150 wpm
    out, secs = [], []
    for i in range(1, len(blocks), 2):
        did = blocks[i]
        m2 = re.search(r"\*\*Transcript[^*]*:\*\*\n\n(.*?)\n\n---", blocks[i + 1], re.S)
        if not m2:
            fail("corpus", f"{did} has no transcript")
            continue
        lines = [l for l in m2.group(1).split("\n") if l.strip().startswith(">")]
        w = len(
            re.findall(
                r"[A-Za-z'’\-]+",
                " ".join(
                    re.sub(r"^>\s*\*\*[A-Za-z ]+:\*\*\s*", "", l.lstrip("> ")) for l in lines
                ),
            )
        )
        secs.append(round(w / 150 * 60))
        if not 45 <= round(w / 150 * 60) <= 120:
            out.append(f"{did}={round(w / 150 * 60)}s")
    if out:
        fail("corpus", f"Q-L2 duration breach at 150 wpm: {out}")
    else:
        # The count is derived, not written down. It read "all 12" while the corpus held
        # 13, which never fails and so is the cheapest kind of lie: it just stops
        # describing what was checked. Range is reported because when a clip is added what
        # matters is where it landed relative to the 45 s floor, not that everything passed.
        lo, hi = min(secs), max(secs)
        ok("Q-L2 durations", f"all {len(secs)} within 45-120 s @150 wpm "
                             f"(range {lo}-{hi} s, floor margin {lo - 45} s)")

    # 5f. panel voice coverage per level (DEF-13). Voice labels may be composite
    # ("v_a+v_b") for whole-clip items, so split on '+'.
    rows = defaultdict(list)
    for line in t.split("\n"):
        m3 = re.match(r"### (L[12])-\d+\s+\S+\s+`(lst_\w+?_\d+)`(.*)", line)
        if not m3:
            continue
        tier, iid, rest = m3.groups()
        v = re.search(r"voice\s+`([^`]+)`", rest)
        lv = re.search(r"· (A1|A2|B1) ·", rest)
        if v and lv:
            rows[lv.group(1)].extend(v.group(1).split("+"))
    for lvl in ("A1", "A2", "B1"):
        panel = {v for v in rows[lvl] if v in ("v_a", "v_b", "v_c", "v_d")}
        if not panel:
            fail("voice", f"{lvl} has NO panel voice — CAT-ineligible on voice grounds (DEF-13)")
        else:
            ok("panel voices", f"{lvl}: {sorted(panel)}")
    # 5g. voice must be pinned to a speaker: a dialogue may not use more distinct
    #     voices than it has speakers, or speaker identity is lost.
    for chunk in re.split(r"(?=\n## `dlg_)", t):
        dm = re.match(r"\n## `(dlg_[a-z0-9_]+)`", chunk)
        if not dm:
            continue
        # speaker labels may be all-caps role names (SRE, Lead, Agent, User)
        speakers = set(re.findall(r"^> \*\*([A-Z][A-Za-z]*):\*\*", chunk, re.M))
        voices = set()
        for v in re.findall(r"voice\s+`([^`]+)`", chunk):
            voices |= set(v.split("+"))
        if len(voices) > len(speakers):
            fail(
                "voice",
                f"{dm.group(1)}: {len(voices)} distinct voices for {len(speakers)} "
                f"speakers ({sorted(voices)} vs {sorted(speakers)}) — speaker identity lost",
            )


# ---------------------------------------------------------------- 6. external sources
#
# `external-sources.md` exists to enforce two things that the local corpus cannot:
#   1. a source is cleared for a lesson only when the licence permits the intended use, AND
#   2. a source card states what it CANNOT support.
# Rule 2 is the mechanical guard against the error class that actually occurred in this repo:
# a citation stretched to cover discourse the source does not contain (curriculum-graph §4.4.1,
# 4 of the 33 `IT A<n>` citations). A registry that can only record *permission* will reproduce
# that error, because permission is the easy half.
SPDX = r"CC-BY[\w.-]*|CC0[\w.-]*|MIT|Apache-2\.0|GFDL|IETF TLP"


def check_external() -> None:
    print("\n[6] External source registry")
    t = DOCS.get("external-sources.md", "")
    if not t:
        warn("external", "external-sources.md not present — 13 lessons remain deferred_no_source")
        return

    # 6a. every accepted source card is complete: url, licence, verbatim, cannot-support
    cards = re.findall(r"^### (S\d+) · (.+?)$", t, re.M)
    ok("accepted source cards", f"{len(cards)}")
    if not cards:
        fail("external", "no `### S<n> ·` source cards found — registry is empty")
    for sid, _title in cards:
        # card body runs until the next card, a `---`, or a `#` heading
        m = re.search(rf"^### {sid} · .*?(?=^### S\d+ |^---\s*$|^# )", t, re.S | re.M)
        if not m:
            fail("external", f"{sid} has no body")
            continue
        body = m.group(0)
        if "http" not in body:
            fail("external", f"{sid} has no url")
        if not re.search(rf"licence\s+.*{SPDX}", body):
            fail("external", f"{sid} has no SPDX licence verdict")
        if "verbatim" not in body:
            fail("external", f"{sid} quotes no verbatim sample — provenance unverifiable")
        # the field is a wrapped two-line label, so `cannot` sits at column 0 on its own line
        if not re.search(r"^cannot\s", body, re.M):
            fail("external", f"{sid} does not state what it cannot support")

    # 6b. every rejection carries an explicit verdict and cited evidence.
    #     Scoped to the §3 rejection table: the §1 licence-class table and the §5 coverage
    #     table also use ❌/⚠️ and are not claims about a specific source.
    sec3 = re.search(r"^## 3\. .*?(?=^## 4\.)", t, re.S | re.M)
    if not sec3:
        fail("external", "no §3 rejection section")
    else:
        verdicts = [ln for ln in sec3.group(0).split("\n") if re.search(r"❌|⚠️", ln) and ln.strip().startswith("|")]
        ok("rejected sources", f"{len(verdicts)} rows carry an explicit verdict")
        if len(verdicts) < 10:
            fail("external", f"only {len(verdicts)} rejection rows — the rejected set must be recorded too")
        for ln in verdicts:
            # the LAST cell is the evidence cell: a footer quote, a licence string, a
            # tested status, or a named policy. A one-word reason is not a justification.
            cells = [c.strip() for c in ln.strip().strip("|").split("|")]
            ev = cells[-1] if cells else ""
            if len(ev) < 25:
                fail("external", f"rejection without cited evidence: {cells[0][:40]} -> {ev[:40]!r}")

    # 6c. the 13 previously-deferred lessons must all be repointed
    sec5 = re.search(r"^## 5\. .*?(?=^## 6\.)", t, re.S | re.M)
    if not sec5:
        fail("external", "no §5 repointing section")
        return
    repointed = set(re.findall(r"`(les_[a-z0-9_]+)`", sec5.group(0)))
    # a lesson is externally sourced iff its own §4.3 registry row carries one of the
    # post-§4.4.5 statuses. The two sets must match exactly, in both directions — a lesson
    # sourced in the registry but undocumented here is the same defect as the reverse.
    EXTERNAL = ("sourced_external", "sourced_external_thin", "blocked_no_adequate_source")
    declared = {
        m.group(1)
        for m in re.finditer(r"^\|\s*`(les_[a-z0-9_]+)`.*$", DOCS["curriculum-graph-spec.md"], re.M)
        if any(s in m.group(0) for s in EXTERNAL)
    }
    ok("lessons repointed", f"{len(repointed)} in §5 vs {len(declared)} externally-sourced in §4.3")
    for i in sorted(declared - repointed):
        fail("external", f"{i} is externally sourced in §4.3 but absent from external-sources.md §5")
    for i in sorted(repointed - declared):
        fail("external", f"{i} appears in external-sources.md §5 but §4.3 does not mark it externally sourced")

    # 6d. licence obligations are declared, not implied
    for needle, what in (("Attribution", "attribution strings"), ("Share-alike", "share-alike")):
        if needle.lower() not in t.lower():
            fail("external", f"no {what} section")
    ok("obligation register", "attribution + share-alike + legal-opinion sections present")

    # 6e. dead-URL log present (so a 404 is never re-fetched or re-cited)
    n_dead = len(re.findall(r"\*\*404\*\*|\*\*301\*\*|\*\*obsoleted\*\*", t))
    if n_dead < 5:
        fail("external", f"dead/moved URL log has only {n_dead} entries")
    else:
        ok("dead-URL log", f"{n_dead} entries")


# ---------------------------------------------------------------- 7. cross-references
def check_xrefs() -> None:
    print("\n[7] Cross-references between specs")
    # Build a set of all valid referenced files (by basename) from known locations
    valid_refs = set(CORPUS_MD)
    valid_refs.update(LESSON_PATHS.keys())
    valid_refs.update(PACK_PATHS.keys())
    valid_refs.update(LEGACY_PACK_PATHS.keys())
    # Also include root-level md files that are commonly referenced
    for p in ROOT.glob("*.md"):
        valid_refs.add(p.name)
    # Add specs/ files
    for p in (ROOT / "specs").glob("*.md"):
        valid_refs.add(p.name)
    # Add corpus/ files
    for p in (ROOT / "corpus").glob("*.md"):
        valid_refs.add(p.name)
    # Add reviews/ files
    for p in (ROOT / "reviews").glob("*.md"):
        valid_refs.add(p.name)
    # Add archive/ files
    for p in (ROOT / "archive").glob("*.md"):
        valid_refs.add(p.name)
    for name, text in DOCS.items():
        for ref in set(re.findall(r"`([a-z0-9-]+\.md)`", text)):
            if ref not in valid_refs:
                fail("xref", f"{name} references missing file `{ref}`")


# ---------------------------------------------------------------- 8. authored lessons
# A lesson file is a *publishable artefact* and, since external-sources.md §0.5, the place where
# the reuse basis must be declared in the artefact itself. A lesson that silently cites a
# restricted source is the exact failure AGENTS.md forbids, and it is invisible unless checked.
LESSON_PATHS = {p.name: p for p in sorted(ROOT.rglob("les_*.md"))}
LESSON_PATHS["lesson-15min-workplace-greetings.md"] = ROOT / "lessons" / "a2" / "lesson-15min-workplace-greetings.md"
LESSON_FILES = list(LESSON_PATHS.keys())

# reuse bases, in the order of severity. `cite_only` requires no reproduction; the other two
# carry obligations that external-sources.md §7 must have recorded.
REUSE_BASES = ("cite_only", "adapt_with_attribution", "adapt_requires_permission")


def check_lessons() -> None:
    print("\n[8] Authored lesson files")
    # Only membership is ever needed (`lid not in reg_rows`), and the previous version also parsed
    # the row's LAST cell — which rejected a legitimate cell carrying two markers, as
    # `les_a2_it_terms_basics` now does (`authored` + `sourced_external`, which are different axes:
    # artefact state and sourcing state). Parsing a cell to answer a question about the id was the
    # bug.
    reg_rows = set(re.findall(r"^\|\s*`(les_[a-z0-9_]+)`", DOCS["curriculum-graph-spec.md"], re.M))
    for fn in LESSON_FILES:
        p = LESSON_PATHS.get(fn, ROOT / fn)
        if not p.exists():
            fail("lesson", f"{fn} is listed but does not exist")
            continue
        t = p.read_text()

        m = re.search(r"\*\*Lesson ID:\*\*\s*`(les_[a-z0-9_]+)`", t)
        if not m:
            fail("lesson", f"{fn} declares no `**Lesson ID:**`")
            continue
        lid = m.group(1)
        if lid not in reg_rows:
            fail("lesson", f"{fn} declares {lid}, which is not in the §4.3 registry")
        # filename must match the declared id, so a rename cannot desynchronise them
        if fn.startswith("les_") and fn != f"{lid}.md":
            fail("lesson", f"{fn} declares {lid} — filename and Lesson ID disagree")

        m = re.search(r"\*\*Reuse basis:\*\*\s*`?(\w+)", t)
        if not m:
            fail("lesson", f"{fn} declares no **Reuse basis:** — §0.5 requires it per artefact")
        elif m.group(1) not in REUSE_BASES:
            fail("lesson", f"{fn} reuse basis {m.group(1)!r} is not one of {REUSE_BASES}")
        else:
            basis = m.group(1)
            # a lesson built on a restricted local source MUST NOT be `adapt_*`
            if basis.startswith("adapt") and re.search(r"frases|dicionário|leia-e", t.split("**Reuse basis:**")[1][:400]):
                fail("lesson", f"{fn} claims {basis} but its header cites a restricted local source")
            # `adapt_*` needs a matching entry in external-sources.md §7
            if basis != "cite_only" and basis not in DOCS["external-sources.md"]:
                fail("lesson", f"{fn} claims {basis} but external-sources.md is absent")

        # A `cite_only` lesson must not reproduce source text. The tell-tale of a copy from the
        # restricted books is their space-separated PT-BR respelling, `[ráu iór dêi góin]`, in
        # square brackets. Two conditions, both derived from the corpus rather than guessed:
        #   - a space, so structural placeholders like `[tag]` and `[wɒz]` do not trip it;
        #   - at least one Portuguese/phonetic diacritic.
        # The second was added 2026-10-01 after a false positive on `les_a2_it_system_unit.md`,
        # whose task template contains the English placeholders `[preposition phrase]` and
        # `[one action]`. Measured over the three restricted books: 560 respellings in this format,
        # 239 multi-word, and **0 of the 239** without a diacritic — they encode /ʃ/ as `x`, /dʒ/
        # as `dj`, schwa as `â`, and mark every diphthong vowel. So the diacritic test costs no
        # real signal and removes the false positive. A single criterion was the wrong shape: any
        # one of them alone fires on legitimate English bracket text.
        if m and m.group(1) == "cite_only":
            gl = [g for g in re.findall(r"\[([a-záéíóúâêôãõçüñ ]{3,})\]", t)
                  if " " in g and re.search(r"[áéíóúâêôãõçüñ]", g)]
            if gl:
                fail("lesson", f"{fn} is cite_only but has a bracketed PT-BR respelling {gl[:3]} — possible source reproduction")

        if "```json" not in t:
            fail("lesson", f"{fn} has no learner-model JSON block")
        else:
            # Parsing the lesson's learner-model JSON was NOT checked until a lesson shipped with
            # Python-style implicit string concatenation ("... and " "helpdesk ..."), which is
            # valid Python and invalid JSON. check_json() only walks the specs, and check_lessons
            # only tested for the fence's presence — so the one block every engine reads first
            # was the one block nobody parsed.
            import json
            for i, block in enumerate(re.findall(r"```json\n(.*?)```", t, re.S)):
                try:
                    json.loads(block.strip())
                except Exception as e:
                    fail("lesson", f"{fn} learner-model JSON block #{i + 1}: {e}")
        for phase in ("FASE 1", "FASE 2", "FASE 3", "FASE 4"):
            if phase not in t:
                fail("lesson", f"{fn} is missing {phase} — the 15-min structure is mandatory")
        ok("lesson", f"{fn} — {lid}, {m.group(1) if m else '?'}")


# ---------------------------------------------------------------- 9. practice packs
# `post-lesson-practice-spec.md` §8.1 requires a manifest per pack and §6 sets the item gates.
# Two of those gates are mechanically checkable and are NOT checked by reading: duplicate
# options within an item, and duplicate item_ids across packs. The first is not hypothetical —
# PACK-DEF-01 in pack-les-a2-meeting-participate.md Item 6 shipped three identical options, which
# makes the item unscorable for any careful learner.
PACK_PATHS = {p.name: p for p in sorted(ROOT.rglob("pack-les-*.md"))}
PACK_FILES = list(PACK_PATHS.keys())
# ------------------------------------------------------------------------------------------
# A SECOND pack schema exists and is only partially covered. Found 2026-10-01 while migrating
# `br_pt_form`: the repository holds two pack families —
#     pack-les-<lesson>.md      (7 files)   YAML manifest + per-item YAML + prose feedback
#     pack_les_<lesson>_v1.md   (115 files) prose header + flat `**item_id:**` fields
# total 122 packs / 855 items. `PACK_FILES` globs only the first, so check [9]'s per-distractor
# rules — `br_pt_form`, prefix↔namespace, `listening_items:` — have run on 7 of 122 packs for their
# whole life. The schema-INDEPENDENT rules do run on both, and are the ones that matter most:
# [11c] item_id uniqueness, [11d] id present + key required when options exist, and [11e] no
# repeated option. Run across both globs, [11e] alone found 28 unscorable items (a distractor
# byte-identical to its own key) against the 2 that [9] had found in the 7 files it could see.
# The residual gap is narrow and named: `**Reuse basis:**` (110 packs lack it), dotted ids that do
# not satisfy §1.2, and `listening_items:`. Counted and warned rather than silently un-globbed,
# because failing ~770 items on a schema decision nobody has made would destroy the signal the
# check currently carries. Full analysis and the ordered migration: post-lesson-practice-spec.md §12.
LEGACY_PACK_PATHS = {p.name: p for p in sorted(ROOT.rglob("pack_les_*_v1.md"))}
LEGACY_PACKS = list(LEGACY_PACK_PATHS.keys())
# Baseline: number of legacy packs at rest. Stored in the script's global state via a
# _legacy_packs_baseline.txt file deposited alongside the repo; if absent, the first run
# sets the baseline and every subsequent run warns if the count exceeds it.
import json, pathlib
_BASELINE_PATH = pathlib.Path(__file__).resolve().parent / "_legacy_packs_baseline.json"
if not _BASELINE_PATH.exists():
    # First run: record the baseline
    _BASELINE = {"count": len(LEGACY_PACKS), "first_seen": pathlib.Path.cwd().resolve().name}
    _BASELINE_PATH.write_text(json.dumps(_BASELINE, ensure_ascii=False, indent=2))
else:
    baseline = json.loads(_BASELINE_PATH.read_text())
    _BASELINE = baseline
    if len(LEGACY_PACKS) > _BASELINE["count"]:
        # Baseline exceeded — more legacy packs appeared than recorded
        warn("pack legacy baseline",
             f"CATRACA: {len(LEGACY_PACKS)} legacy packs (baseline was {_BASELINE['count']}; "
             f"first seen in {_BASELINE['first_seen']}). Legados não devem aumentar.")
    elif len(LEGACY_PACKS) < _BASELINE["count"]:
        # Fewer legacy packs — reset baseline (someone cleaned up)
        _BASELINE = {"count": len(LEGACY_PACKS), "first_seen": pathlib.Path.cwd().resolve().name}
        _BASELINE_PATH.write_text(json.dumps(_BASELINE, ensure_ascii=False, indent=2))
    else:
        # Count unchanged — no warning needed beyond the normal one
        pass

if LEGACY_PACKS:
    n_items = sum(len(re.findall(r"^### ITEM ", LEGACY_PACK_PATHS[fn].read_text(), re.M)) for fn in LEGACY_PACKS)
    n_noreuse = sum(1 for fn in LEGACY_PACKS if "**Reuse basis:**" not in LEGACY_PACK_PATHS[fn].read_text())
    warn("pack schema", f"{len(LEGACY_PACKS)} of {len(LEGACY_PACKS) + len(PACK_FILES)} packs use the "
                        f"`pack_les_<lesson>_v1.md` schema ({n_items} items) and are outside check "
                        f"[9], which globs only `pack-les-*.md`. {n_noreuse} of them declare no "
                        f"`**Reuse basis:**` (§0.5) and their dotted ids do not satisfy §1.2's "
                        f"prefix↔namespace rule. [11c]/[11d]/[11e] DO cover them. The rest is "
                        f"outstanding migration — see post-lesson-practice-spec.md §12.")
# assessment-item-spec.md §1.2 — id prefix IS the primary skill namespace
PREFIX_NS = {"grm": "grammar", "voc": "vocab", "rdg": "reading",
             "prn": "pronunciation", "lst": "listening", "coh": "coherence"}
OPTION_ROW = re.compile(r"^\|\s*([A-Z])\s*\|\s*(.+?)\s*\|\s*$", re.M)
ITEM_HEAD = re.compile(r"^### ITEM (\d+)", re.M)


def check_packs() -> None:
    print("\n[9] Practice packs")
    seen_items: dict[str, str] = {}
    for fn in PACK_FILES:
        p = PACK_PATHS[fn]
        t = p.read_text()

        m = re.search(r"\*\*Pack ID:\*\*\s*`(\w+)`", t)
        if not m:
            fail("pack", f"{fn} declares no **Pack ID:**")
            continue
        pid = m.group(1)
        m = re.search(r"\*\*Lesson:\*\*\s*`([\w.-]+\.md)`", t)
        if not m:
            fail("pack", f"{fn} declares no **Lesson:** file")
        elif m.group(1) not in LESSON_PATHS:
            fail("pack", f"{fn} points at a lesson file that does not exist: {m.group(1)}")

        # split into items so an option table cannot leak across item boundaries
        heads = [(mm.start(), int(mm.group(1))) for mm in ITEM_HEAD.finditer(t)]
        for i, (start, n) in enumerate(heads):
            end = heads[i + 1][0] if i + 1 < len(heads) else len(t)
            body = t[start:end]
            # A multiple-choice item has a `| Slot | Value |` table; a production item
            # (pronunciation / minimal-pair) does not, and requires no key letter.
            if "| Slot | Value |" not in body:
                mi = re.search(r"item_id:\s*`(\w+)`", body)
                if mi and mi.group(1) in seen_items:
                    fail("pack", f"{fn} ITEM {n} reuses item_id {mi.group(1)} from {seen_items[mi.group(1)]}")
                elif mi:
                    seen_items[mi.group(1)] = f"{fn} ITEM {n}"
                continue
            keypos = body.find("**Key:**")
            if keypos < 0:
                fail("pack", f"{fn} ITEM {n} has no **Key:**")
                continue
            pre = body[:keypos]
            slots = pre[pre.rfind("| Slot | Value |"):] if "| Slot | Value |" in pre else ""
            opts = [v.strip() for _, v in OPTION_ROW.findall(slots)]
            letters = [l for l, _ in OPTION_ROW.findall(slots)]
            if len(opts) < 3:
                fail("pack", f"{fn} ITEM {n} has {len(opts)} options; §6 G-Q3 requires 3+")
                continue
            if letters != sorted(set(letters)) or len(set(letters)) != len(letters):
                fail("pack", f"{fn} ITEM {n} has repeated option letters {letters}")
            # G-Q3: options must be distinct strings. A duplicate makes the item unscorable.
            norm = [re.sub(r"[*✓⚠️❌]|_", "", o).strip().lower() for o in opts]
            dupes = {v for v in norm if norm.count(v) > 1}
            if dupes:
                fail("pack", f"{fn} ITEM {n} has duplicate options {sorted(dupes)} — unscorable")
            # exactly one key marker
            nkey = body.count("✓") + len(re.findall(r"\*\*Key:\*\*\s*[A-Z]\s*—", body))

            # --- prefix must be the item's PRIMARY SKILL NAMESPACE, not its pack slot
            # (assessment-item-spec.md §1.2, amended 2026-09-30). 3 of the first 42 authored
            # items violated this and nothing caught it, because the rule was inferable from a
            # prefix->domain table but never stated, and `skill_ids` and `domain` are separate
            # fields in the schema. The id is the key the learner model files the observation
            # under, so it has to name the skill the observation updates.
            mi = re.search(r"item_id:\s*`(\w+)`", body)
            ms = re.search(r"^skill:\s*`([a-z]+)\.([\w.]+)`", body, re.M)
            if mi and ms:
                pre = mi.group(1).split("_")[0]
                ns = ms.group(1)
                if PREFIX_NS.get(pre) != ns:
                    want = next((k for k, v in PREFIX_NS.items() if v == ns), "?")
                    fail("pack", f"{fn} ITEM {n}: item_id {mi.group(1)} has prefix '{pre}_' but its "
                                 f"skill namespace is '{ns}.' — expected '{want}_' (§1.2)")
            if ns_is_coherence := (ms and ms.group(1) == "coherence"):
                # a coherence item's skill is pair-level, so the bank cannot weight it from the
                # skill alone; the item must say which domain it contributes to.
                if not re.search(r"^domain:\s*\w+", body, re.M):
                    fail("pack", f"{fn} ITEM {n}: coherence item has no `domain:` — the pair-level "
                                 f"skill gives the bank nothing to weight (§1.2)")

            # --- §1.1: G-Q2 is unenforceable without the Portuguese form behind each distractor
            if mi and not mi:
                pass
            if not mi:
                fail("pack", f"{fn} ITEM {n} declares no `item_id`")
            elif mi.group(1) in seen_items:
                fail("pack", f"{fn} ITEM {n} reuses item_id {mi.group(1)} from {seen_items[mi.group(1)]}")
            else:
                seen_items[mi.group(1)] = f"{fn} ITEM {n}"

        # manifest conformance (§2.2)
        if "listening_items:" not in t:
            fail("pack", f"{fn} manifest does not record `listening_items:` — §2.2 requires the "
                         "deferral be auditable rather than silent")

        # §1.1 makes G-Q2 ("every distractor must be a form a BR-PT speaker would actually
        # produce") enforceable only through `distractors[].br_pt_form`. The packs authored before
        # pack-les-a2-it-terms-basics carry the Portuguese error in prose feedback, which a loader
        # cannot read. Counted and warned rather than failed: it is a migration, not a violation.
        # See post-lesson-practice-spec.md §10.12.
        #
        # Three states are counted separately, because collapsing them hides the interesting one:
        #   filled  — a real Portuguese source form (G-Q2 satisfied for that distractor)
        #   null    — deliberately no PT source, i.e. the distractor is phonological or
        #              reading-based rather than an L1 transfer. THIS IS A FINDING, not a gap.
        #   absent  — no field at all (the gap)
        # Every count below is anchored to a field line and NOT to prose. Each
        # `pack-les-*.md` header carries a `br_pt_form_coverage:` comment that *names* the fourth
        # state — "... these record br_pt_form_state: not_applicable_no_distractor_set" — so an
        # unanchored `re.findall` counted 10 where there are 5, five fields and five explanations
        # of them. The same trap has now appeared three times in this file (item status, distractor
        # notes, this), always as `field in body`, and the rule that keeps working is: anchor to
        # the line, because prose about a field outnumbers the field as soon as it is explained.
        n_filled = len(re.findall(r"^\s*br_pt_form:\s*[\"'(]", t, re.M))
        n_null = len(re.findall(r"^\s*br_pt_form:\s*null", t, re.M))
        # A FOURTH state, added 2026-10-01. A production / minimal-pair item has no distractor
        # set at all, so there is no Portuguese form to record — but it still has to say so, or
        # it is indistinguishable from an item whose transfer evidence was simply never written.
        # Both carry `br_pt_form: null`; only `br_pt_form_state` separates them, so the state is
        # counted separately here rather than being folded into n_null.
        n_na = len(re.findall(r"^\s*br_pt_form_state:\s*not_applicable_no_distractor_set", t, re.M))
        # per-ITEM, not per-distractor: an item with three distractors and no field at all is the
        # gap, and a per-distractor count would let one documented distractor mask five undocumented
        # ones. Item blocks are delimited by the `### ITEM n` headings the loop above collected.
        bounds = [s for s, _ in heads] + [len(t)]
        n_absent = sum(1 for a, b in zip(bounds, bounds[1:]) if "br_pt_form:" not in t[a:b])
        # Every distractor must carry a `note:`, filled or null. A filled `br_pt_form` says WHICH
        # Portuguese form, but not WHY it produces the English error — that reasoning is the part a
        # learner-facing loader has to replay. Proven by a negative control on 2026-10-01: a first
        # version of this check tested only `null` entries, and deleting a note from a FILLED
        # distractor passed silently. The reasoning applies identically to both states.
        n_no_note = 0
        for m in re.finditer(r"^(\s+)- option:", t, re.M):
            tail = t[m.end():m.end() + 600]
            nxt = re.search(r"^\s+- option:", tail, re.M)
            seg = tail[:nxt.start()] if nxt else tail
            if not re.search(r"^\s+note:", seg, re.M):
                iid = re.findall(r"item_id:\s*`?([\w]+)`?", t[:m.start()])
                n_no_note += 1
                last = iid[-1] if iid else "?"
        if n_no_note:
            warn("pack", f"{fn}: {n_no_note} distractor(s) carry no `note:` — the field says which "
                         f"Portuguese form, never why it produces the English error; last seen in "
                         f"`{last}`")
        if n_filled == 0:
            warn("pack", f"{fn}: 0 of {len(heads)} items carry a filled `br_pt_form` — the PT-BR "
                         f"source of each error is prose-only, so G-Q2 is unenforceable at load time")
        ok("pack", f"{fn} — {pid}, {len(heads)} items, br_pt_form {n_filled} filled / {n_null} null"
                   + (f" ({n_na} of them no-distractor-set)" if n_na else "")
                   + (f" / {n_absent} items with no field" if n_absent else ""))
        # Aggregate for §2.2.1 of `assessment-item-spec.md`, which publishes corpus-wide counts. A
        # count written by hand is a claim about the corpus with nothing keeping it true, and it
        # rots silently: the first new item makes it wrong and no other check can see it, because
        # every per-distractor rule is satisfied by the new item on its own. Accumulated here and
        # asserted against the spec text below, so the table is regenerated rather than edited.
        BRPT_TOTALS["filled"] += n_filled
        BRPT_TOTALS["null_note"] += n_null - n_na
        BRPT_TOTALS["null_na"] += n_na
        BRPT_TOTALS["absent"] += n_absent

    spec = DOCS["assessment-item-spec.md"]
    claim = (f"**{BRPT_TOTALS['filled']} filled / {BRPT_TOTALS['null_note']}\n"
             f"null-with-note / {BRPT_TOTALS['null_na']} null-not-applicable / "
             f"{BRPT_TOTALS['absent']} undocumented.**")
    if claim.replace("\n", " ") not in re.sub(r"\s+", " ", spec):
        fail("pack", f"§2.2.1 of assessment-item-spec.md publishes br_pt_form counts that no longer "
                     f"match the corpus. Recomputed from the packs: {BRPT_TOTALS['filled']} filled / "
                     f"{BRPT_TOTALS['null_note']} null-with-note / {BRPT_TOTALS['null_na']} "
                     f"null-not-applicable / {BRPT_TOTALS['absent']} undocumented")
    else:
        ok("br_pt_form census", f"§2.2.1's published census matches the packs — "
                                f"{BRPT_TOTALS['filled']} filled / {BRPT_TOTALS['null_note']} "
                                f"null-with-note / {BRPT_TOTALS['null_na']} null-not-applicable / "
                                f"{BRPT_TOTALS['absent']} undocumented")


BRPT_TOTALS = {"filled": 0, "null_note": 0, "null_na": 0, "absent": 0}


# ---------------------------------------------------------------- 10. internal §-references
# A "§7 sourcing note" that does not exist is worse than a missing one: it reads as if the claim
# were checked, and it was the exact mislabelling the licensing section exists to prevent
# (listening-corpus.md §7.2). Two dialogue headers carried it. Nothing caught it because the
# section headings and the references were never compared.
# The lookahead matters: AGENTS.md's "## 10-Book Core Pedagogical Corpus" is not section 10, and
# treating it as one made every §-reference in AGENTS.md look self-referential. A section number is
# followed by a dot, whitespace, or end of line — never by a hyphen.
SECT = re.compile(r"^#{2,4}\s+(?:§)?(\d+(?:\.\d+)*)(?=[.\s]|$)", re.M)
# the short names this repo actually uses to refer to another document mid-sentence
DOC_ALIAS = re.compile(
    r"assessment-item-spec|stats-progress|stats-progress-evaluation|\bstats\b|diagnostic-spec|"
    r"\bdiagnostic\b|content-map|curriculum-graph|external-sources|listening-corpus|"
    r"post-lesson-practice|\bpack-les|\bles_[a-z0-9_]+|lesson-15min|tier-b-review|\bAGENTS\b|"
    r"verify-integrity|Ingles/output|\bIT\b|\bleia\b|\bapostila\b|\bDicionario\b|"
    r"corpus-spec|\bBKT\b|\bFSRS\b|\bIRT\b|\bMVP\b|\bASR\b|\bTTS\b|\bMDN\b|\bRFC\b")
# authored artifacts are not in SPECS (they are artifacts, not specs) but they carry §-references
ARTIFACTS = {q.name: q.read_text() for q in sorted(ROOT.rglob("les_*.md")) + sorted(ROOT.rglob("pack-les-*.md"))}
GOVERNED = re.compile(r"^\*\*(Spec|Specs|Companion to):\*\*", re.M)


def check_sxrefs() -> None:
    print("\n[10] Internal section references resolve")
    total = 0
    for name, text in {**DOCS, **ARTIFACTS}.items():
        defined = {m.group(1) for m in SECT.finditer(text)}
        if not defined:
            continue  # unnumbered document (AGENTS.md): every §N in it names another file
        # a parent section counts as defined for its children (§8 satisfies §8.1 references)
        for d in list(defined):
            for child in list(defined):
                if child.startswith(d + "."):
                    defined.add(d)
        for m in re.finditer(r"§(\d+(?:\.\d+)*)", text):
            ref = m.group(1)
            # Cross-document references are resolved by check 7, not here. They appear in three
            # shapes, all of which put a backticked document name in the SAME clause before the §:
            #   `content-map.md` §11          `stats` §4.2          `foo.md` §2.3, §5.1
            # so the scan window runs back to the previous table cell, sentence or line and skips
            # the reference if a backticked token appears in it.
            #
            # KNOWN LIMITATION: a genuine self-reference that follows a backticked filename in the
            # same clause is skipped too. That under-reports rather than floods, and the check
            # found 4 real dangling references — including one in this very list of shapes — so it
            # earns its noise. Tighten only with evidence of a miss, not on principle.
            # Convention this repo actually uses: in an ARTIFACT that names its governing spec in
            # the header (`**Spec:** post-lesson-practice-spec.md §2, §8`), a bare `§N` means that
            # spec unless this file happens to define it itself. The packs and lessons are full of
            # `§2.2`/`§2.3`/`§4.1` that are all post-lesson, and 45 of them are not dangling.
            if GOVERNED.search(text):
                continue
            # Window is BIDIRECTIONAL: the repo also writes the document name *after* the section
            # ("§9 do `assessment-item-spec.md`"), which a backwards-only scan cannot see.
            win = text[max(0, m.start() - 400):m.start() + 90]
            if DOC_ALIAS.search(win):
                continue
            total += 1
            if ref not in defined:
                line = text.count("\n", 0, m.start()) + 1
                have = sorted(defined, key=lambda s: [int(x) for x in s.split(".")])
                fail("sxref", f"{name}:{line} references §{ref} but that section does not exist "
                              f"(this file defines: {', '.join(have[:16])})")
    if total:
        ok("sxref", f"{total} internal section references resolved")


# ---------------------------------------------------------------- 11. restricted reproduction
# The licence finding in external-sources.md §0.5 is only worth anything if it is applied to the
# repo's OWN documents, not just to the lessons. It was not. content-map.md §11.1 — the P0
# corporate-term deck that §4.3 sources and that external-sources.md line 746 planned to use as
# a lesson's vocabulary — was headed "Source-derived, zero authoring" and reproduced a restricted
# book's 40-row table *including its respelled pronunciation column*, plus an 8-sentence
# blockquote, under a claim of readiness for teaching. The three BaixeLivros notices forbid
# exactly that, and §0.5.1 of the registry says so 700 lines away.
#
# This check cannot detect reproduction in general. It detects the *claim*: a section that names a
# restricted source AND asserts that what it derived is publishable, without declaring a reuse
# basis. The claim is the thing that is checkable, and it is also the thing that has to be
# right, because every downstream licence assertion inherits from it.
RESTRICTED_TOKEN = re.compile(r"dicion[aá]rio|frases-ingles|leia-e-escreva", re.I)
PUBLISHABLE_CLAIM = re.compile(
    r"zero authoring|source-derived|ready for (?:item )?authoring|fsrs-anchored|"
    r"\bp0\b\s+(?:corporate|deck|priority)|deck supplies", re.I)
REUSE_MARKER = re.compile(r"reuse basis", re.I)


def check_restricted_reproduction() -> None:
    print("\n[11] Restricted sources are not declared publishable")
    n_bad = 0
    for name, text in {**DOCS, **ARTIFACTS}.items():
        for m in re.finditer(r"^#{2,4}\s+(.*)$", text, re.M):
            title, start = m.group(1), m.end()
            nxt = re.search(r"^#{2,4}\s+", text[start:], re.M)
            sec = text[start:start + nxt.start()] if nxt else text[start:]
            if not (RESTRICTED_TOKEN.search(sec) and PUBLISHABLE_CLAIM.search(sec)):
                continue
            if REUSE_MARKER.search(sec):
                continue
            n_bad += 1
            claim = PUBLISHABLE_CLAIM.search(sec).group(0)
            fail("restricted", f"{name} §{title.strip()[:60]!r} claims {claim!r} about material "
                               f"derived from a restricted source but declares no reuse basis "
                               f"(external-sources.md §0.5 / §7.0)")
    if not n_bad:
        ok("restricted", "no section asserts publishability of restricted-derived material")

    # ----------------------------------------------------------------------------------------
    # 11b. Packs are where derivation actually happens, and check [8] only covers lessons.
    # Found 2026-10-01: `pack-les-a2-greetings-intro.md` marked 6 items `provenance: source_derived`
    # from `frases-ingles-trabalho.md` Ch2 while its five sibling packs in the same module called
    # the same source *bibliography only*. The marker was ACCURATE — the restricted book does
    # contain `"This is Paula, our designer"` and `"Good morning, everyone."` / `Bom dia a todos.`
    # verbatim — so relabelling the items `authored` would have cured the symptom by committing
    # the exact mislabelling this repository exists to prevent. Three rules, each mechanical:
    #   1. every pack declares a reuse basis, like every lesson;
    #   2. a pack containing any `source_derived` item CANNOT be `cite_only` — deriving from a
    #      source is by definition not "reproduce nothing";
    #   3. of the restricted local PDFs, none is permissively licensed, so an `adapt_*` pack citing
    #      one must be `adapt_requires_permission`, never `adapt_with_attribution`.
    n_bad2 = 0
    for fn in sorted(PACK_PATHS.keys()):
        p = PACK_PATHS[fn]
        t = p.read_text()
        m = re.search(r"\*\*Reuse basis:\*\*\s*`?(\w+)", t)
        n_derived = len(re.findall(r"^\s*provenance:\s*source_derived", t, re.M))
        cites_restricted = bool(re.search(r"frases-ingles-trabalho|Dicionario-de-Siglas|"
                                         r"leia-e-escreva|apostila-ingles-para-iniciantes", t))
        if not m:
            n_bad2 += 1
            basis_msg = "declares no **Reuse basis:**"
            fail("restricted", f"{p.name} {basis_msg} — §0.5 requires it per artefact, and check [8] "
                               f"only enforces it on lessons, which is where this slipped through")
            continue
        basis = m.group(1)
        if basis not in REUSE_BASES:
            n_bad2 += 1
            fail("restricted", f"{p.name} reuse basis {basis!r} is not one of {REUSE_BASES}")
            continue
        if n_derived and basis == "cite_only":
            n_bad2 += 1
            fail("restricted", f"{p.name} has {n_derived} `provenance: source_derived` item(s) but "
                               f"claims `cite_only`, which means 'author original material, "
                               f"reproduce nothing' — the two cannot both be true")
        if n_derived and cites_restricted and basis == "adapt_with_attribution":
            n_bad2 += 1
            fail("restricted", f"{p.name} claims `adapt_with_attribution` over a restricted local "
                               f"source, but none of the 7 local PDFs grants redistribution "
                               f"(AGENTS.md, Licensing) — this must be `adapt_requires_permission`")
        if not n_derived and basis != "cite_only" and not re.search(
                r"adapt_with_attribution", t):
            n_bad2 += 1
            fail("restricted", f"{p.name} claims {basis} but no item in it is `source_derived` "
                               f"and it cites no permissive external source — the basis overstates "
                               f"what the pack did")
    if not n_bad2:
        ok("restricted", "every pack declares a reuse basis consistent with its item provenance")

    # 11c. `item_id` uniqueness across ALL packs, both schemas. Two items sharing an id are one
    # item to the model: `assessment-item-spec.md` §4 calibrates a and b per item, and BKT
    # transitions on a per-item evidence record, so a collision silently merges two estimation
    # units and the learner gets credit for whichever they saw first. Found 2026-10-01 while
    # authoring the 5 recovered IT lessons: `grammar.there_is_there_are` appeared in both
    # `pack_les_a2_it_computer_parts_v1.md` and `pack_les_a2_it_internet_history_v1.md` — the
    # dotted-id style shared by the `pack_les_*` schema makes this easy, because the id repeats
    # the skill name with nothing to disambiguate the two contexts.
    id_owner: dict[str, str] = {}
    dupes: list[tuple[str, str, str]] = []
    for p in sorted(ROOT.rglob("pack-les-*.md")) + sorted(ROOT.rglob("pack_les_*_v1.md")):
        # Anchored to the start of the line, with no list dash, and matching BOTH schemas' field
        # spellings: the YAML packs write `item_id: \`x\`` and the `pack_les_*` packs write
        # `**item_id:** \`x\``. The character class includes `-` because 151 of the ids in the
        # `pack_les_*` schema are hyphenated (`vocab.have.have-got`, `vocab.have.does-she-have`); a
        # class of `[A-Za-z0-9_.]` combined with the `\s*$` anchor silently skipped every one of
        # them, and it took a miscount — 704 ids reported against 806 item blocks — to notice.
        # An earlier version matched only the first schema and scanned 49 of 813 items, which is
        # why its own negative control did not fire. Both schemas also *mention* their own item ids
        # in prose: `pack-les-a2-greetings-intro.md` lists `prn_th_voiced_001` in a coverage table
        # and again as a `- item_id:` bullet, and a looser pattern read that one item as a
        # collision with itself.
        for iid in re.findall(r"^(?:- )?(?:\*\*item_id:\*\*|item_id:)\s*`?([A-Za-z0-9_.\-]+)`?\s*$",
                              p.read_text(), re.M):
            if iid in id_owner:
                dupes.append((iid, id_owner[iid], p.name))
            else:
                id_owner[iid] = p.name
    for iid, first, second in dupes:
        fail("item id", f"`{iid}` is used by both {first} and {second} — a and b are calibrated "
                        f"per item and BKT transitions on a per-item evidence record, so a shared "
                        f"id merges two estimation units into one")
    if not dupes:
        ok("item id", f"all {len(id_owner)} item ids are unique across every pack and both schemas")

    # 11d. Every `### ITEM` block carries a parseable `item_id` and a `**Key:**`. An item with no
    # id cannot be calibrated and never enters the evidence record; an item with no key cannot be
    # scored. Found 2026-10-01 the same way the uniqueness check was: `pack_les_a1_wh_questions_v1.md`
    # ITEM 6 wrote the field as `**item_id**:` — the two colons missing — so the id was present to
    # the eye and absent to every loader, and the uniqueness check had been counting 854 ids against
    # 855 item blocks without explaining the difference. The count mismatch was the only symptom.
    n_blocks = n_keyless = n_choice = n_nochoice = 0
    for p in sorted(ROOT.rglob("pack-les-*.md")) + sorted(ROOT.rglob("pack_les_*_v1.md")):
        for idx, b in enumerate(re.split(r"^### ITEM \d+", p.read_text(), flags=re.M)[1:], 1):
            n_blocks += 1
            head = b[:400]
            if not re.search(r"^(?:- )?(?:\*\*item_id:\*\*|item_id:)\s*`?[A-Za-z0-9_.\-]+`?\s*$",
                             head, re.M):
                bad_field = re.search(r"\*\*item_id\*\*\s*:?", head)
                fail("item id",
                     f"{p.name} ITEM {idx} has no parseable `**item_id:**` — an item with no id "
                     f"cannot be calibrated and never enters the evidence record"
                     + (f" (the field is written `{bad_field.group(0).strip()}` — the colons are "
                        f"missing)" if bad_field else ""))
            # A key exists to score a choice, so the obligation is conditional on there being a
            # choice — derived from the artefact, not from a list of item types. The first version
            # demanded a key unconditionally and failed all 6 `minimal_pair_*` items in the
            # `pack-les-*` packs, which are production/identification items with no distractor set
            # by construction; they carry `br_pt_form_state: not_applicable_no_distractor_set` and
            # an ASR scoring step instead of options. Reading the type field and exempting named
            # types would have been the second-order mistake: a new item type would then need a
            # code change to be exempted, and every new type would fail until someone remembered.
            if re.search(r"^\|\s*Slot\s*\|\s*Value\s*\|", b, re.M):
                n_choice += 1
                if not re.search(r"^\*\*Key:\*\*\s*\S", b, re.M):
                    n_keyless += 1
                    fail("item id", f"{p.name} ITEM {idx} has a distractor table but no "
                                    f"`**Key:**` — an item with options and no key cannot be scored")
            else:
                n_nochoice += 1
    if n_blocks:
        ok("item blocks", f"{n_blocks} `### ITEM` blocks parsed — every one declares an id, and "
                          f"all {n_choice} with a distractor table declare a key "
                          f"({n_nochoice} are distractor-free by construction: production and "
                          f"minimal-pair items scored by ASR)")

    # 11e. No item may offer the same option text twice. Found 2026-10-01, over BOTH schemas, in the
    # same pass that widened [11c] from 49 items to 855: **28 items** carried a distractor whose text
    # was byte-identical to its own key, the key merely bolded. Each had two correct answers and
    # could not be scored at all — the identical defect class [9] documents ("Found 2 unscorable
    # items in the first 4 packs (duplicate options)"), invisible here for the same reason as the
    # rest: the glob covered 7 of 122 packs. The repair is in the packs (option replaced with a
    # plausible wrong form); this is the guard that keeps them repaired.
    #
    # Bold is stripped because it MARKS the key rather than distinguishing the option: `**lived**`
    # and `lived` are one contribution to a score, not two. Case is NOT stripped, because it can be
    # the discrimination itself — `pack_les_a1_alphabet_sounds_v1.md` ITEM 3 is an uppercase-vs-
    # lowercase item whose options are `a, b, c` and `A, B, C`, and a case-insensitive comparator
    # would have "repaired" a correct item by destroying the only signal in it. That near-miss is
    # why the comparator is case-sensitive: a false positive here deletes content.
    n_dupopt = 0
    for p in sorted(ROOT.rglob("pack-les-*.md")) + sorted(ROOT.rglob("pack_les_*_v1.md")):
        for idx, b in enumerate(re.split(r"^### ITEM \d+", p.read_text(), flags=re.M)[1:], 1):
            vals = [re.sub(r"\*\*|\*", "", v).strip()
                    for v in re.findall(r"^\|\s*[A-D]\s*\|\s*(.*?)\s*\|\s*$", b, re.M)]
            if vals and len(vals) != len(set(vals)):
                dup = sorted({v for v in vals if vals.count(v) > 1})
                iid = re.search(r"item_id:?\*?\*?:?\s*`?([\w.\-]+)`?", b)
                fail("duplicate options",
                     f"{p.name} ITEM {idx} ({iid.group(1) if iid else '?'}) offers {dup!r} twice "
                     f"— each repeated option is a second correct answer if it is the key, and an "
                     f"unscorable item either way")
                n_dupopt += 1
    if not n_dupopt:
        ok("duplicate options", f"no item in either schema offers the same option text twice "
                                f"(case-sensitive; bold stripped, because bold marks the key)")


# ---------------------------------------------------------------- 12. table column consistency
# A destructive edit is the one class of error the other checks cannot see: they validate content,
# so a row that loses a cell is still a well-formed row. This one caught its own author — a regex
# that was meant to drop a respelled-phonetics column dropped the Portuguese gloss column instead,
# and content-map.md §11.1 lost all 40 glosses in one pass. Nothing else in the repository noticed,
# because every check that reads those cells reads them as "present".
#
# Rule: within a contiguous block of `|`-led lines, every row must have the same cell count as the
# header. Fenced code is skipped — pipes are ordinary characters there.
def _cells(line: str) -> int:
    # an escaped pipe is CONTENT, not a separator — "\\|Δ\\| ≥ 0.25" is one cell, and counting it
    # as three reported a false positive on the first run
    return len(re.split(r"(?<!\\)\|", line.strip().strip("|")))


def check_tables() -> None:
    print("\n[12] Markdown table column consistency")
    n_tbl = n_bad = 0
    for name, text in {**DOCS, **ARTIFACTS}.items():
        lines, in_fence = text.split("\n"), False
        i = 0
        while i < len(lines):
            ln = lines[i]
            if ln.lstrip().startswith("```"):
                in_fence = not in_fence
            if in_fence or not ln.startswith("|"):
                i += 1
                continue
            j = i
            while j < len(lines) and lines[j].startswith("|"):
                j += 1
            block = lines[i:j]
            if len(block) < 2 or not re.match(r"^\|[\s:|-]+\|$", block[1]):
                i = j
                continue
            n_tbl += 1
            want = _cells(block[0])
            for k, row in enumerate(block[2:], start=i + 3):  # i is 0-based; header=+1, sep=+2
                got = _cells(row)
                if got != want:
                    n_bad += 1
                    if n_bad <= 12:
                        fail("table", f"{name}:{k} has {got} cells, its header has {want} — "
                                      f"`{row.strip()[:70]}`")
            i = j
    if n_bad:
        fail("table", f"{n_bad} malformed table rows total")
    else:
        ok("table", f"{n_tbl} tables, all rows match their header width")


# ---------------------------------------------------------------- 13. examples honour their own disclosures
# A spec that defers a domain and then prints a confident number for it in an example is worse than
# one that never mentions the domain: the example is what an implementer copies, and a reader who
# trusts the number will build the screen. diagnostic-spec.md §3.6 did exactly this - it printed a
# listening theta while §2.1 had removed Listening from the blueprint and
# `domains_not_assessed` named it, and printed a pronunciation point estimate while
# `skill_theta_reportable` said false. Check [4] only asks whether the block parses, and a block
# that parses while contradicting itself is the common case.
#
# Rule, in one line: a domain that a block itself declares non-reportable may not carry a `theta`.
def check_examples() -> None:
    print("\n[13] Worked examples honour their own disclosures")
    import json as _json
    n_block = n_bad = 0
    for name, text in DOCS.items():
        for m in re.finditer(r"```json\n(.*?)\n```", text, re.S):
            body = m.group(1)
            if "\"skills\"" not in body:
                continue
            try:
                d = _json.loads(body)
            except Exception:
                continue          # [4] owns parse failures; not this check's business
            n_block += 1
            skills = d.get("skills") or {}
            not_assessed = set(
                (d.get("calibration_disclosure") or {}).get("domains_not_assessed") or [])
            reportable = d.get("skill_theta_reportable") or {}
            line = text[:m.start()].count("\n") + 2
            for dom, payload in skills.items():
                if not isinstance(payload, dict) or "theta" not in payload:
                    continue
                why = None
                if dom in not_assessed:
                    why = "it is listed in `domains_not_assessed`"
                elif reportable.get(dom) is False:
                    why = "`skill_theta_reportable` says false"
                elif "cefr_band" in payload and dom not in not_assessed:
                    why = "the same block reports a cefr_band, which means no point estimate"
                if why:
                    n_bad += 1
                    fail("example", f"{name}:{line} prints a theta for '{dom}' although {why}")
            for dom, flag in reportable.items():
                if flag is True and dom not in skills:
                    n_bad += 1
                    fail("example", f"{name}:{line} declares '{dom}' reportable but the example "
                                    f"carries no estimate for it")
    if not n_bad:
        ok("example", f"{n_block} worked example(s) — no estimate printed for a domain the "
                      f"example itself declares non-reportable")



# ---------------------------------------------------------------- main
def main() -> int:
    print("=" * 78)
    print("Curso-de-Ingles — content integrity")
    print("=" * 78)
    check_registry()
    check_lesson_count()
    check_sources()
    check_json()
    check_corpus()
    check_external()
    check_xrefs()          # [7]
    check_lessons()        # [8]
    check_packs()          # [9]
    check_sxrefs()         # [10]
    check_restricted_reproduction()  # [11]
    check_tables()         # [12]
    check_examples()       # [13]

    print("\n" + "=" * 78)
    for w in WARNS:
        print(w)
    for f in FAILS:
        print(f)
    print("=" * 78)
    if FAILS:
        print(f"RESULT: FAIL — {len(FAILS)} failure{'' if len(FAILS) == 1 else 's'}, "
              f"{len(WARNS)} warning{'' if len(WARNS) == 1 else 's'}")
        return 1
    print(f"RESULT: PASS — 0 failures, {len(WARNS)} warning{'' if len(WARNS) == 1 else 's'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
