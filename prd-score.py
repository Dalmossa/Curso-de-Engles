#!/usr/bin/env python3
"""
Rubric scorer for PRD.md.

WHY THIS EXISTS
---------------
A rubric written after the artefact it grades cannot be trusted: the target moves and
the ruler moves with it. So the rubric below was fixed first, applied to the previous
PRD.md to confirm it actually fails something, and only then used to author the new
one. The previous PRD scores in the low 20s and the report names the reason per
criterion; if this script ever reports 100 for a document with no licensing section,
the script is broken, not the document.

The criteria are not generic "is it well written" checks. Each one exists because this
repository has already recorded a defect of that class, in the DEF log of
`listening-corpus.md` §9 or in the check table of `AGENTS.md`.

The rubric contains hardcoded pattern lists (KNOWN_FALSE, DECISIONS) that capture
defects previously recorded in the repository. Every numerical threshold derives from
the repository at run time; the rubric re-fails when the corpus grows or patterns change.

  C1  licence safety            — DEF-11: `content-map.md` §11.1 was headed
                                  "source-derived, zero authoring" while reproducing a
                                  restricted book's list; §0.5.1 of `external-sources.md`
                                  claimed the opposite 700 lines away.
  C2  numbers are derived       — the previous PRD asserted "18k-5k+ lines each" for
                                  files that top out at 5 361, and "~60-70%" readiness.
  C3  references resolve        — check [10] found four dangling internal references.
  C4  tables survive            — check [12] found a regex that deleted 40 glosses.
  C5  decisions acknowledged    — a spec that reopens a settled decision is not neutral;
                                  §2.5.1 and §0.5 are the records.
  C6  deliverable honesty       — check [2] exists because declared counts drifted.
  C7  blockers declared         — the whole "functional readiness: 60-70%" line was
                                  wrong precisely because nothing was blocked.
  C8  personas traceable        — a persona that names no lesson cannot be scheduled.
  C9  priority is a dependency  — the previous PRD called RF-006 Medium while RF-003 High
                                  with no dependency stated either way.
  C10 milestones executable     — "Prep 30-60 min, Build 4-6 weeks" with no entry/exit
                                  condition is a wish list.

Every number this script checks is derived from the repository at run time. Nothing is
hardcoded. If the corpus grows, the PRD's numbers go stale and this fails, which is the
intended direction of failure.

Run:  python3 prd-score.py [path-to-prd]      (default: ./PRD.md)
Exit: 0 = score >= 80, 1 = below threshold, 2 = PRD missing.
"""

from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
THRESHOLD = 80.0


# --------------------------------------------------------------------------- repo truth
def read(name: str) -> str:
    # Try root first, then specs/, corpus/, reviews/, lessons/, packs/
    for sub in ("", "specs", "corpus", "reviews", "lessons/a1", "lessons/a2", "lessons/b1", "lessons/b2", "lessons/remediation",
                "packs/a1", "packs/a2", "packs/b1", "packs/b2", "packs/remediation"):
        p = ROOT / sub / name if sub else ROOT / name
        if p.exists():
            return p.read_text()
    return ""


def repo_truth() -> dict:
    """Compute every load-bearing number from the repository. No literals."""
    cg = read("curriculum-graph-spec.md")
    lc = read("listening-corpus.md")
    # "authored" means: a file exists declaring `**Lesson ID:** <id>`. The stem==id requirement
    # applies only to `les_`-prefixed files, because that is exactly the exemption check [8]
    # grants — `lesson-15min-workplace-greetings.md` declares `les_a2_greetings_intro` under a
    # different filename and the checker accepts it. Mirroring the checker's rule here (rather
    # than hardcoding its filename list) is what stops the PRD's count from drifting from
    # verify-integrity.py's.
    authored: set[str] = set()
    for p in ROOT.rglob("*.md"):
        for lid in re.findall(r"\*\*Lesson ID:\*\*\s*`(les_[a-z0-9_]+)`", p.read_text()):
            if lid == p.stem or not p.name.startswith("les_"):
                authored.add(lid)
    return {
        "modules": len(set(re.findall(r"^\|\s*`(mod_[a-z0-9_]+)`\s*\|", cg, re.M))),
        "lessons": len(set(re.findall(r"^\|\s*`(les_[a-z0-9_]+)`\s*\|", cg, re.M))),
        "dialogues": len(set(re.findall(r"^## `(dlg_[a-z0-9_]+)`", lc, re.M))),
        "slots": len(re.findall(r"### L\d-\d+ — `(lst_\w+?_\d+)`", lc)),
        "admissible": len(re.findall(r"\*\*Status:\*\* shipped", lc)),
        "authored_lessons": len(authored),
        # BOTH pack schemas. This counted only `pack-les-*.md` (7 of 122) for the same reason
        # check [9] did: the glob was written before the second family existed. A rubric that
        # agrees with a stale glob is not checking anything — it scored `Practice packs authored
        # | 7` as honest against a repository holding 122. See post-lesson-practice-spec.md §12.
        "packs": (len(list(ROOT.rglob("pack-les-*.md")))
                  + len(list(ROOT.rglob("pack_les_*_v1.md")))),
        "practice_items": (sum(len(re.findall(r"^### ITEM \d+", p.read_text(), re.M))
                               for p in list(ROOT.rglob("pack-les-*.md"))
                               + list(ROOT.rglob("pack_les_*_v1.md")))),
    }


# canonical label -> (keywords that identify the row, truth key)
CANON = {
    "lessons": (("lesson", "licao", "lição", "aula"), "lessons"),
    "modules": (("module", "modulo", "módulo"), "modules"),
    "dialogues": (("dialog", "dialogo", "diálogo"), "dialogues"),
    "item slots": (("slot",), "slots"),
    "admissible": (("admiss", "public", "publicavel"), "admissible"),
    "authored lessons": (("authored", "autor"), "authored_lessons"),
    "packs": (("pack", "pratica", "prática"), "packs"),
    "practice items": (("pratica", "prática", "practice", "items"), "practice_items"),
}

# values the previous PRD asserted and the repository contradicts
KNOWN_FALSE = [
    (r"\b18k\b", "18k lines per file — the longest is 5 361"),
    (r"\b5k\+\b", "5k+ lines per file — only one file exceeds 3 000"),
    (r"\b60\s*[–-]\s*70\s*%", "~60-70% readiness, a number with no derivation"),
    (r"\b100\s*%\s*complete", "'content is 100% complete' while 106 of 113 lessons are unauthored"),
]


# --------------------------------------------------------------------------- md helpers
def cells(line: str) -> list[str]:
    # an escaped pipe is CONTENT, not a separator
    return [c.strip() for c in re.split(r"(?<!\\)\|", line.strip().strip("|"))]


def tables_after(text: str, heading_pat: str) -> list[list[str]]:
    """Every markdown table that appears after a heading matching heading_pat."""
    out: list[list[str]] = []
    m = re.search(heading_pat, text, re.M | re.I)
    if not m:
        return out
    lines = text[m.end():].split("\n")
    i = 0
    while i < len(lines):
        if lines[i].lstrip().startswith("|"):
            j = i
            while j < len(lines) and lines[j].lstrip().startswith("|"):
                j += 1
            block = [ln for ln in lines[i:j] if ln.strip()]
            if len(block) >= 2 and re.match(r"^\|[\s:|-]+\|$", block[1].strip()):
                out.append(block)
            i = j
        else:
            i += 1
    return out


def rows(block: list[str]) -> list[list[str]]:
    return [cells(r) for r in block[2:]]


def header_of(block: list[str]) -> list[str]:
    return [c.lower().strip("* ") for c in cells(block[0])]


def col(block: list[str], *names: str) -> int:
    h = header_of(block)
    for n in names:
        for k, c in enumerate(h):
            if n in c:
                return k
    return -1


# --------------------------------------------------------------------------- criterion plumbing
RESULTS: list[tuple[str, str, float, float, list[str]]] = []


def record(cid: str, title: str, got: float, mx: float, notes: list[str]) -> None:
    RESULTS.append((cid, title, got, mx, notes))


# --------------------------------------------------------------------------- C1 licence safety
LICENCE_CTX = re.compile(
    r"licen[cs]|restrict|redistrib|cite_only|permiss|permission|permiss[ãa]o|copyright|"
    r"\(c\)|©|BaixeLivros|sem licen|n[aã]o pode|not be published",
    re.I,
)


def c1(prd: str, corpus_names: list[str]) -> None:
    notes, got = [], 0.0

    # (a) a licensing section that states the denial outright
    m = re.search(r"^#{2,3}\s*(?:\d+(?:\.\d+)*\s*)?.*licen[cs].*$", prd, re.M | re.I)
    if not m:
        notes.append("(a) no licensing section at all — the document never asks whether the "
                     "sources may be reused")
    else:
        body = prd[m.end():m.end() + 1800]
        denial = re.search(r"(none|no|nenhum|nenhuma|sem|not a single)\b.{0,120}licen[cs]|"
                           r"licen[cs].{0,120}(none|no|nenhum|nenhuma|not granted|never granted|"
                           r"sem concess)", body, re.I | re.S)
        if denial:
            got += 5.0
            notes.append("(a) licensing section states that no local source is permissively "
                         "licensed")
        else:
            notes.append("(a) a licensing section exists but never states the denial — a reader "
                         "cannot tell whether reuse is permitted")

    # (b) every corpus basename that IS mentioned must sit in a licence context.
    #     A name the PRD never mentions earns nothing: silence is not framing.
    bad_b, seen_b = [], []
    for name in corpus_names:
        for mm in re.finditer(re.escape(name), prd):
            seen_b.append(name)
            win = prd[max(0, mm.start() - 300):mm.end() + 300]
            if not LICENCE_CTX.search(win):
                bad_b.append(name)
                break
    if not seen_b:
        notes.append("(b) the PRD never names a source file, so there is nothing to frame — it "
                     "does not treat the corpus as a corpus")
    elif not bad_b:
        got += 5.0
        notes.append(f"(b) all {len(set(seen_b))} source filenames that appear, appear only in a "
                     f"licence context")
    else:
        got += 5.0 * (len(set(seen_b)) - len(bad_b)) / len(set(seen_b))
        notes.append(f"(b) {len(set(seen_b)) - len(bad_b)}/{len(set(seen_b))} mentioned source "
                     f"filenames have licence context; unlicensed: {bad_b}")

    # (c) no requirement may ask for exercises built from or written into the corpus files
    req_lines = [ln for ln in prd.split("\n")
                 if re.match(r"^\s*(?:\|\s*)?(?:RF|RNF)-\d+", ln) or re.match(r"^\s*\d+\.\s", ln)]
    viol = [ln.strip()[:90] for ln in req_lines
            if re.search(r"exercise|item|p[áa]gina|quiz", ln, re.I)
            and re.search(r"Ingles/output|\.md`?\s*file|content file|source", ln, re.I)
            and not LICENCE_CTX.search(ln)]
    if not viol:
        got += 4.0
        notes.append("(c) no requirement line writes exercises into or out of the source corpus")
    elif not LICENCE_CTX.search(prd):
        got += 0.0
        notes.append(f"(c) {len(viol)} requirement line(s) write exercises into the corpus with "
                     f"no licence framing anywhere in the document: {viol[:2]}")
    else:
        got += 2.0
        notes.append(f"(c) {len(viol)} corpus-facing requirement line(s) lack local licence "
                     f"context: {viol[:2]}")

    if got == 0.0:
        notes.insert(0, "GATE: licence gate failed — this rubric will not score above 80 while "
                        "this is true, because a PRD that requires unlicensed reproduction is "
                        "not a PRD with a deficit")
    record("C1", "Licence safety", got, 14.0, notes)


# --------------------------------------------------------------------------- C2 numbers
def c2(prd: str, truth: dict) -> None:
    notes, got = [], 0.0
    tbls = tables_after(prd, r"^#+\s*(?:\d+(?:\.\d+)*\s*)?.*\bnumbers\b")
    if not tbls:
        notes.append("(a) no NUMBERS table — every count in the prose is therefore an "
                     "assertion with no provenance")
        record("C2", "Numbers are derived, not asserted", got, 12.0, notes)
        return
    block = tbls[0]
    got += 4.0
    notes.append("(a) NUMBERS table present")

    dcol = col(block, "derived", "source", "provenance", "como", "derived from")
    if dcol < 0:
        notes.append("(b) the table has no `Derived from` column — a value without a derivation "
                     "is the defect C2 exists to catch")
    else:
        good = bad = 0
        for r in rows(block):
            src = r[dcol] if dcol < len(r) else ""
            if not src:
                bad += 1
                continue
            if re.search(r"`[^`]*\.(?:md|py)`", src) or src.strip().startswith("`"):
                good += 1
            else:
                bad += 1
        got += 4.0 * good / max(1, good + bad)
        notes.append(f"(b) {good} of {good + bad} rows name a file or command that exists")
        if bad:
            notes.append(f"    unbacked rows: {[r[dcol] if dcol < len(r) else '' for r in rows(block) if not r[dcol] or not (re.search(r'`[^`]*\\.(?:md|py)`', r[dcol]) or r[dcol].strip().startswith('`'))][:4]}")

    # (c) load-bearing values must match what the repository computes
    matched = 0
    for label, (kws, tkey) in CANON.items():
        want = truth[tkey]
        hit = None
        for r in rows(block):
            head = r[0].lower() if r else ""
            if any(k in head for k in kws):
                nums = re.findall(r"\d+", " ".join(r))
                hit = (r, nums)
                break
        if hit is None:
            notes.append(f"(c) no NUMBERS row labelled like `{label}`")
            continue
        r, nums = hit
        if not nums:
            notes.append(f"(c) row `{r[0]}` has no number in it")
        elif int(nums[0]) == want:
            matched += 1
        else:
            notes.append(f"(c) row `{r[0]}` says {nums[0]} but the repository computes {want} "
                         f"for {label}")
    got += 4.0 * matched / len(CANON)
    notes.append(f"(c) {matched}/{len(CANON)} load-bearing values match the repository")

    # (d) known-false values must be gone
    present = [why for rx, why in KNOWN_FALSE if re.search(rx, prd)]
    if present:
        # retracteada(s) ainda presentes no PRD — cada uma vale ~1,0 ponto
        got -= min(3.0, len(present) * 1.0)
        notes.append(f"(d) retracted claims still present: {present}")
    else:
        got += 0.0   # already counted; recorded for the report only

    # (e) arithmetic: every declared partition must sum to the total
    # Check reuse basis: cite_only + adapt_with_attribution + adapt_requires_permission
    # should equal the total number of authored lessons
    import re as _re
    rb_match = _re.search(
        r'(cite_only).*?(\d+).*?(adapt_with_attribution).*?(\d+).*?(adapt_requires_permission).*?(\d+)',
        prd, _re.I)
    if rb_match:
        cite_only = int(rb_match.group(2))
        adapt_att = int(rb_match.group(4))
        adapt_req = int(rb_match.group(6))  # group 6 is adapt_requires_permission count
        total_lessons = truth.get("authored_lessons", 0)
        expected_sum = cite_only + adapt_att + adapt_req
        if expected_sum != total_lessons:
            got -= 3.0
            notes.append(f"(e) reuse basis partition drift: {cite_only} + {adapt_att} + {adapt_req} = "
                         f"{expected_sum}, but authored_lessons = {total_lessons}")
        else:
            notes.append(f"(e) reuse basis partition OK: {cite_only} + {adapt_att} + {adapt_req} = {total_lessons}")
    else:
        notes.append("(e) no reuse basis partition found — skipping arithmetic check")
    record("C2", "Numbers are derived, not asserted", got, 12.0, notes)


# --------------------------------------------------------------------------- C3 references
def _resolve(ref: str) -> pathlib.Path | None:
    """A `.md` reference resolves if it exists at the repo root, in Ingles/output/, specs/, corpus/, reviews/, lessons/, packs/, or — when the
    document writes an absolute path to a file kept outside the repo — at that absolute path."""
    cands = [
        ROOT / ref,
        ROOT / "Ingles" / "output" / ref,
        ROOT / "specs" / ref,
        ROOT / "corpus" / ref,
        ROOT / "reviews" / ref,
        ROOT / "lessons" / ref,
        ROOT / "packs" / ref,
        pathlib.Path(ref),
    ]
    # Also search recursively in specs/, corpus/, reviews/, lessons/, packs/
    for subdir in ("specs", "corpus", "reviews", "lessons", "packs"):
        for c in (ROOT / subdir).rglob(ref):
            return c
    for c in cands:
        try:
            if c.exists():
                return c
        except OSError:
            pass
    return None


def c3(prd: str) -> None:
    notes, got = [], 0.0
    # A filename may contain spaces (`Ingles para Viagens.md`) and may be an absolute path pointing
    # outside the repo. Backticked tokens are tried first, then bare ones. But template and glob
    # tokens are not file references and must not be graded as missing: `les_*.md` is a glob, and
    # `pack-les-<lesson>.md` is the SHAPE of a filename rather than one. Two mistakes hid here and
    # both produced phantom "missing file" reports — `_v1.md` (the bare pass re-matching the tail of
    # the already-matched glob `pack_les_*_v1.md`) and `para Viagens.md` (the same, on the space in
    # a filename). The bare pass now runs on the document with backticked spans REMOVED, so a
    # backticked reference is graded once, in full, by the pass that understands it.
    GLOB_CHARS = re.compile(r"[*?\[\]<>]")
    def is_glob(ref: str) -> bool:
        return bool(GLOB_CHARS.search(ref))

    refs = [m.group(1) for m in re.finditer(r"`([^`]+\.md)`", prd) if not is_glob(m.group(1))]
    bare = re.sub(r"`[^`]*`", "", prd)
    refs += [m.group(1) for m in
             re.finditer(r"(?<![`\w./-])([A-Za-z0-9_][A-Za-z0-9_./ -]*?\.md)(?![\w/])", bare)
             if not is_glob(m.group(1))]
    refs = sorted({r.strip() for r in refs})
    missing = [f for f in refs if _resolve(f) is None]
    got += 5.0 * (len(refs) - len(missing)) / max(1, len(refs))
    if missing:
        notes.append(f"(a) references to files that do not resolve: {missing}")
    else:
        notes.append(f"(a) all {len(refs)} referenced files resolve")

    refs = list(re.finditer(r"`?([A-Za-z0-9_.-]+\.md)`?\s*§(\d+(?:\.\d+)*)", prd))
    good, bad = [], []
    for m in refs:
        fn, ref = m.group(1), m.group(2)
        body = read(fn) if (ROOT / fn).exists() else ""
        if not body:
            bad.append(f"{fn} §{ref} (file unreadable)")
        elif re.search(r"^#{2,4}\s+(?:§)?" + re.escape(ref) + r"(?=[.\s]|$)", body, re.M):
            good.append(f"{fn} §{ref}")
        else:
            bad.append(f"{fn} §{ref}")
    got += 5.0 * len(good) / max(1, len(refs)) if refs else 2.5
    if bad:
        notes.append(f"(b) dangling section references: {bad}")
    else:
        notes.append(f"(b) all {len(good)} cross-document section references resolve")
    if not refs:
        notes.append("    (no cross-document § reference is made at all — the PRD does not "
                     "cite the specs it constrains)")
    record("C3", "References resolve", got, 10.0, notes)


# --------------------------------------------------------------------------- C4 tables
def c4(prd: str) -> None:
    notes, got = [], 0.0
    lines, in_fence, n_tbl, n_bad, bad_rows = prd.split("\n"), False, 0, 0, []
    i = 0
    while i < len(lines):
        ln = lines[i]
        if ln.lstrip().startswith("```"):
            in_fence = not in_fence
        if in_fence or not ln.lstrip().startswith("|"):
            i += 1
            continue
        j = i
        while j < len(lines) and lines[j].lstrip().startswith("|"):
            j += 1
        block = lines[i:j]
        if len(block) >= 2 and re.match(r"^\|[\s:|-]+\|$", block[1].strip()):
            n_tbl += 1
            want = len(cells(block[0]))
            for k, row in enumerate(block[2:], start=i + 3):
                got_n = len(cells(row))
                if got_n != want:
                    n_bad += 1
                    bad_rows.append(f"line {k}: {got_n} cells vs header {want}")
        i = j
    total = n_tbl + n_bad
    got = 6.0 * n_tbl / max(1, total)
    if n_bad:
        notes.append(f"{n_bad} malformed row(s): {bad_rows[:5]}")
    else:
        notes.append(f"all {n_tbl} tables have rows matching their header width")
    record("C4", "Tables survive", got, 6.0, notes)


# --------------------------------------------------------------------------- C5 decisions
DECISIONS = [
    ("pronunciation production is out of scope",
     r"(?:2\.5\.1|out of scope|fora de escopo|not in scope|n[aã]o pontua|exclu[ií]d)"),
    ("`cite_only` is the default reuse basis", r"cite_only"),
    ("list-shaped lessons cannot use `cite_only`",
     r"list-shaped|formato de lista|listas? (?:n[aã]o |cannot|cannot)|lista.{0,40}cite_only"),
    ("Listening is BKT-only until audio renders",
     r"BKT-only|s[oó] .{0,20}BKT|listening.{0,60}BKT|BKT.{0,60}listening|sem .{0,20}[aá]udio"),
    ("mastery is probabilistic (BKT + IRT + FSRS)", r"\bBKT\b[\s\S]{0,400}\bIRT\b[\s\S]{0,400}\bFSRS\b"),
    ("the dialogue corpus is authored, not source-derived",
     r"authored|autorad[oa]|written from scratch|n[aã]o derivad"),
]


def c5(prd: str) -> None:
    notes, got, miss = [], 0.0, []
    for label, rx in DECISIONS:
        m = re.search(rx, prd, re.I)
        if m:
            got += 2.0
            ctx = prd[max(0, m.start() - 90):m.end() + 90].replace("\n", " ")
            notes.append(f"acknowledged: {label}  →  ...{ctx.strip()[:130]}...")
        else:
            miss.append(label)
    if miss:
        notes.append(f"NOT acknowledged ({len(miss)}): {miss}")
    record("C5", "Recorded decisions acknowledged", got, 12.0, notes)


# --------------------------------------------------------------------------- C6 honesty
# The state vocabulary is closed, because a PRD that can always find a word for its own situation
# cannot be graded. `withdrawn` was added after the corpus proved the first four cannot express it:
# a listening item removed by a recorded defect is neither unauthored nor blocked, it is decided.
STATES = ("authored", "specified", "unauthored", "blocked", "withdrawn")


def c6(prd: str, truth: dict) -> None:
    notes, got = [], 0.0
    tbls = tables_after(prd, r"^#+\s*(?:\d+(?:\.\d+)*\s*)?.*\bdeliverables?\b")
    if not tbls:
        notes.append("(a) no DELIVERABLES table — the document has no artefact inventory to be "
                     "wrong about, which is itself the finding")
        record("C6", "Deliverable honesty", got, 12.0, notes)
        return
    block = tbls[0]
    got += 4.0
    notes.append("(a) DELIVERABLES table present")
    scol = col(block, "state", "status", "estado")
    if scol < 0:
        notes.append("(b) no `State` column — authored and specified cannot be told apart, and "
                     "that is the distinction the whole repository rests on")
    else:
        seen = [((r[scol] if scol < len(r) else "").strip().lower().strip("*` ")) for r in rows(block)]
        seen = [s for s in seen if s]
        legal = [s for s in seen if any(s.startswith(x) for x in STATES)]
        got += 4.0 * len(legal) / max(1, len(seen))
        bad = sorted({s for s in seen if s not in legal and not any(s.startswith(x) for x in STATES)})
        if bad:
            notes.append(f"(b) states outside {STATES}: {bad[:6]}")
        else:
            notes.append(f"(b) all {len(legal)} states are from {STATES}")
    # (c) the counts in that table must match the filesystem / registry.
    #     Each canonical quantity may be claimed by at most ONE row. Without that, "Authored
    #     lesson files | 7" and "Lessons awaiting authoring | 106" were both compared against the
    #     lessons total of 113 and both were reported as errors -- the row was not wrong, the
    #     matcher was comparing every lesson-ish row to the same number.
    nccol = col(block, "count", "n", "number", "total", "quantidade")
    if nccol < 0:
        notes.append("(c) no count column — the inventory cannot drift because it holds nothing")
    else:
        agree, total, claimed = 0, 0, set()
        for r in rows(block):
            head = r[0].lower() if r else ""
            for label, (kws, tkey) in CANON.items():
                if tkey in claimed:
                    continue
                if any(k in head for k in kws):
                    claimed.add(tkey)
                    nums = re.findall(r"\d+", " ".join(r))
                    if nums:
                        total += 1
                        if int(nums[0]) == truth[tkey]:
                            agree += 1
                        else:
                            notes.append(f"(c) row `{r[0]}` says {nums[0]}, repository says "
                                         f"{truth[tkey]}")
                    break
        if total:
            got += 4.0 * agree / total
            notes.append(f"(c) {agree}/{total} comparable counts agree with the repository")
        else:
            notes.append("(c) no row in the inventory carries a comparable count")
    record("C6", "Deliverable honesty", got, 12.0, notes)


# --------------------------------------------------------------------------- C7 blockers
BLOCKERS = [
    ("no rendered audio exists", r"(?:n[aã]o (?:foi |ainda )?(?:render|renderiz|produz)|"
                                r"0 (?:clips|audio)|no audio|sem [aá]udio|unrendered|"
                                r"audio (?:clip|track)s? (?:pending|outstanding|n[aã]o))"),
    ("no Stage-1 responses, so no IRT calibration and no CAT",
     r"(?:stage-?1|respostas de (?:alunos|estudantes)|calibrat\w*|sem (?:dados|dataset) de (?:respostas|itens))"),
    ("independent specialist review of the Tier B content is pending",
     r"(?:tier\s*-?\s*b|especialista|specialist|revis[aã]o independente|peer review)"),
    ("reuse permission for restricted-source lessons has not been granted",
     r"(?:adapt_requires_permission|permiss[aã]o|permission|§\s*7\.0)"),
]


def c7(prd: str) -> None:
    notes, got, miss = [], 0.0, []
    for label, rx in BLOCKERS:
        m = re.search(rx, prd, re.I)
        if m:
            got += 2.5
            notes.append(f"declared: {label}")
        else:
            miss.append(label)
    if miss:
        notes.append(f"NOT declared ({len(miss)}): {miss}")
    record("C7", "Blockers declared", got, 10.0, notes)


# --------------------------------------------------------------------------- C8 personas
def c8(prd: str) -> None:
    notes, got = [], 0.0
    reg = set(re.findall(r"^\|\s*`((?:les|mod)_[a-z0-9_]+)`\s*\|", read("curriculum-graph-spec.md"), re.M))
    m = re.search(r"^#+\s*(?:\d+(?:\.\d+)*\s*)?.*persona.*$", prd, re.M | re.I)
    if not m:
        notes.append("no PERSONAS section")
        record("C8", "Personas traceable", 0.0, 8.0, notes)
        return
    body = prd[m.end():]
    # stop at the NEXT heading of any level up to H2. Looking only for H1 let the personas
    # section swallow the stack and the prerequisite list, so a `- **Frontend**: React` bullet
    # was graded as a persona and every PRD failed C8 for the wrong reason.
    nxt = re.search(r"^#{1,2}\s+\S", body, re.M)
    if nxt:
        body = body[:nxt.start()]
    # A persona is a PARAGRAPH, not a source line. The bullets here are hard-wrapped at ~100
    # columns, so the id lands on a continuation line and a per-line test reports every persona
    # untraced. Join continuation lines before testing.
    people: list[str] = []
    for block in re.split(r"\n\s*\n", body):
        block = block.strip()
        if re.match(r"^(?:[-*]|\d+\.)\s+\S", block) and len(block.split()) > 4:
            people.append(" ".join(block.split()))
    if not people:
        notes.append("the PERSONAS section has no entries")
        record("C8", "Personas traceable", 0.0, 8.0, notes)
        return
    ok_n = 0
    for ln in people:
        ids = [i for i in re.findall(r"\b((?:les|mod)_[a-z0-9_]+)\b", ln) if i in reg]
        if ids:
            ok_n += 1
            notes.append(f"traced: {ln.strip()[:70]} → {ids}")
        else:
            bogus = re.findall(r"\b((?:les|mod)_[a-z0-9_]+)\b", ln)
            notes.append(f"UNTRACED: {ln.strip()[:70]}"
                         + (f" (cites {bogus}, not in the §4.3 registry)" if bogus else
                            " (names no lesson or module id)"))
    cap = min(len(people), 4)
    got = 8.0 * min(ok_n, cap) / max(1, cap)
    record("C8", "Personas traceable", got, 8.0, notes)


# --------------------------------------------------------------------------- C9 dependency
def c9(prd: str) -> None:
    notes, got = [], 0.0
    tbls = tables_after(prd, r"^#+\s*(?:\d+(?:\.\d+)*\s*)?.*functional requirements")
    if not tbls:
        notes.append("no functional-requirements table")
        record("C9", "Priority is a dependency", 0.0, 10.0, notes)
        return
    # `tbls[0]` is a block of raw LINES. Iterating it directly would index the first CHARACTER of
    # each line and find no `RF-` prefix, which is why the first run reported "no RF/RNF rows" on
    # a table full of them.
    reqs = [r for r in rows(tbls[0]) if r and r[0].strip().upper().startswith(("RF-", "RNF-"))]
    if not reqs:
        notes.append("the requirements table has no RF/RNF rows")
        record("C9", "Priority is a dependency", 0.0, 10.0, notes)
        return
    ucol = col(tbls[0], "unblock", "unlocks", "blocks", "depends", "gates", "desbloqueia")
    pcol = col(tbls[0], "priority", "prioridade")
    if ucol < 0:
        notes.append(f"(a) {len(reqs)} requirement rows and no `Unblocks` column — priority is "
                     f"asserted with no stated consequence")
        record("C9", "Priority is a dependency", 0.0, 10.0, notes)
        return
    got += 2.0
    notes.append("(a) requirements table has an `Unblocks` column")
    high = [r for r in reqs if pcol >= 0 and pcol < len(r)
            and r[pcol].strip().lower().startswith(("high", "crit", "p0"))]
    good = [r for r in high if ucol < len(r) and len(re.findall(r"[A-Za-zÀ-ÿ]{2,}", r[ucol])) >= 3]
    got += 8.0 * len(good) / max(1, len(high))
    if high:
        notes.append(f"(b) {len(good)}/{len(high)} High-priority rows name what they unblock")
        for r in high:
            if r not in good:
                notes.append(f"    empty justification: {r[0]}")
    else:
        notes.append("(b) no row is marked High — nothing is prioritised, so the order is not "
                     "a decision")
        got += 0.0
    record("C9", "Priority is a dependency", got, 10.0, notes)


# --------------------------------------------------------------------------- C10 milestones
def c10(prd: str) -> None:
    notes, got = [], 0.0
    tbls = tables_after(prd, r"^#+\s*(?:\d+(?:\.\d+)*\s*)?.*milestones?\b")
    if not tbls:
        notes.append("no MILESTONES table")
        record("C10", "Milestones executable", 0.0, 6.0, notes)
        return
    block = tbls[0]
    ecol = col(block, "entry", "entrada", "starts when", "precondition")
    xcol = col(block, "exit", "saida", "saída", "done when", "postcondition", "completion")
    if ecol < 0 or xcol < 0:
        notes.append("(a) milestones lack `Entry`/`Exit` columns — 'Build 4-6 weeks' has no "
                     "definition of done")
        record("C10", "Milestones executable", got, 6.0, notes)
        return
    got += 2.0
    notes.append("(a) milestones have Entry and Exit columns")
    filled = [r for r in rows(block)
              if ecol < len(r) and r[ecol].strip() and r[xcol].strip()]
    n = len(rows(block))
    got += 3.0 * len(filled) / max(1, n)
    notes.append(f"(b) {len(filled)}/{n} milestones have both conditions written")
    crit = re.search(r"critical path|caminho cr[íi]tico", prd, re.I)
    if crit:
        got += 1.0
        notes.append("(c) critical path named")
    else:
        notes.append("(c) no critical path named, so the order of the plan cannot be checked")
    record("C10", "Milestones executable", got, 6.0, notes)


# --------------------------------------------------------------------------- main
def main(argv: list[str]) -> int:
    path = pathlib.Path(argv[1]) if len(argv) > 1 else ROOT / "PRD.md"
    if not path.exists():
        print(f"prd-score: no PRD at {path}")
        return 2
    prd = path.read_text()
    truth = repo_truth()
    corpus_names = sorted(p.name for p in (ROOT / "Ingles" / "output").glob("*.md"))

    print("=" * 78)
    print(f"PRD rubric — {path.name}")
    print("=" * 78)
    print("repository truth, derived at run time:")
    for k, v in truth.items():
        print(f"  {k:20s} {v}")

    c1(prd, corpus_names)
    c2(prd, truth)
    c3(prd)
    c4(prd)
    c5(prd)
    c6(prd, truth)
    c7(prd)
    c8(prd)
    c9(prd)
    c10(prd)

    earned = mx = 0.0
    for cid, title, got, m, notes in RESULTS:
        earned += got
        mx += m
        pct = 100.0 * got / m
        flag = "  " if pct >= 99.5 else ("~ " if pct >= 60 else "! ")
        print(f"\n{flag}{cid} {title:38s} {got:5.1f}/{m:5.1f}  ({pct:5.1f}%)")
        for n in notes:
            print(f"      {n}")
    pct = 100.0 * earned / mx
    print("\n" + "=" * 78)
    print(f"TOTAL {earned:.1f}/{mx:.1f} = {pct:.1f}%   threshold {THRESHOLD}%")
    print("=" * 78)
    gate = RESULTS[0][2] == 0.0
    if gate:
        print("LICENCE GATE FAILED — a gated criterion scored zero; fix C1 before reading "
              "the percentage as meaningful.")
        return 1
    if pct >= THRESHOLD:
        print(f"PASS — {pct:.1f}% >= {THRESHOLD}%")
        return 0
    weakest = sorted(RESULTS, key=lambda r: (r[2] / r[3]))[:3]
    print(f"below threshold. cheapest points first: "
          f"{', '.join(f'{r[0]} (-{r[3] - r[2]:.1f})' for r in weakest)}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))