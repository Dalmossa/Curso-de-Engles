---
adr: 010
title: Curso-de-Ingles as Git submodule
status: Accepted
date: 2026-10-03
authors: [@platform-lead, @content-lead]
deciders: [@platform-lead, @content-lead, @sre-lead]
consulted: [@backend-lead]
informed: [@team]
tags: [git, submodule, content, contracts]
---

## Context

The ITS Platform consumes content and specs from the `Curso-de-Ingles` repository:
- 123 lesson files (`lessons/`)
- 122 practice packs (`packs/`)
- 13 listening dialogues (`corpus/`)
- 7 specs (`specs/`)
- Verifier scripts (`verify-integrity.py`, `prd-score.py`)

The content repo and platform repo have **different lifecycles**:
- Content: authored by linguists, pedagogical review cycles
- Platform: engineered by developers, sprint cycles

Requirements:
- **Version pinning** — platform builds against specific content version
- **Contract enforcement** — CI fails if content breaks platform expectations
- **Independent releases** — content can update without platform deploy (if contracts hold)
- **Local development** — developers need content files for tests

## Decision

**Add `Curso-de-Ingles` as a Git submodule in `its-platform/content/`**

### Structure

```
its-platform/
├── .gitmodules
├── content/                    # Submodule mount point
│   ├── lessons/
│   ├── packs/
│   ├── corpus/
│   ├── specs/
│   ├── verify-integrity.py
│   └── prd-score.py
├── src/
├── tests/
│   ├── contract/               # Tests that validate content against specs
│   └── bdd/
└── ...
```

### .gitmodules

```ini
[submodule "content"]
    path = content
    url = https://github.com/its-org/Curso-de-Ingles.git
    branch = main
```

### CI Integration

```yaml
# .github/workflows/ci.yml
jobs:
  contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      - name: Verify content integrity
        run: |
          cd content
          python3 verify-integrity.py
      - name: Run contract tests
        run: |
          pytest tests/contract/ -v
      - name: Run BDD scenarios
        run: |
          pytest tests/bdd/ -v
```

### Version Pinning

```bash
# Pin to specific commit for reproducible builds
git submodule set-branch --branch main content
git -C content checkout <commit-sha>
git add content
git commit -m "chore: pin Curso-de-Ingles to <commit-sha>"
```

### Local Development

```bash
# Clone with submodule
git clone --recurse-submodules https://github.com/its-platform/its-platform.git

# Or add later
git submodule update --init --recursive

# Work on content locally
cd content
# ... edit files ...
git commit -am "content: add new lesson"
cd ..
git add content
git commit -m "chore: update content submodule"
```

## Consequences

### Positive
- **Explicit versioning** — platform build = content commit SHA
- **Contract enforcement** — CI runs `verify-integrity.py` on content submodule
- **Independent workflows** — content team works in their repo; platform team pins when ready
- **Local dev** — `git submodule update --init` gets all content
- **Rollback** — `git revert` on submodule pin = instant content rollback

### Negative
- **Submodule friction** — `git submodule update` often forgotten; `git pull` doesn't update submodules
- **Shallow clone issues** — CI needs full history for `verify-integrity.py` (uses git log)
- **Merge conflicts** — submodule pointer conflicts on parallel branches
- **Two repos** — PRs may need coordination (content PR + platform PR)

### Neutral
- **Branch strategy** — content `main` → platform `dev` auto; content `release/*` → platform `staging`/`prod` manual
- **Alternative: mono-repo** — rejected (different teams, lifecycles, access control)

## Alternatives Considered

1. **Mono-repo** — Single repo for content + platform; rejected: different teams, review processes, release cadences
2. **Artifact registry (npm/PyPI)** — Publish content as package; rejected: content is markdown, not code; versioning semantics differ
3. **Git subtree** — Merges history; harder to split later; submodule cleaner for separation
4. **API-based content delivery** — Content service serves markdown; rejected: overkill, adds latency, platform needs files for contract tests
5. **No version pinning (always latest)** — Rejected: breaking content changes would break platform unexpectedly

## Implementation Plan

- [x] Add submodule: `git submodule add -b main https://github.com/its-org/Curso-de-Ingles.git content`
- [x] Configure CI: `submodules: recursive` in checkout action
- [x] Add contract tests: `tests/contract/` validates content → spec mapping
- [x] Add BDD tests: `tests/bdd/` runs PRD scenarios against content
- [ ] Document submodule workflow in `CONTRIBUTING.md`
- [ ] Add pre-commit hook: `git submodule update --init --recursive`
- [ ] Automate content pinning on `release/*` branches via GitHub Actions

## Submodule Workflow

```bash
# Platform developer daily workflow
git pull
git submodule update --init --recursive  # Get latest pinned content

# Content team releases new version
# 1. Content team merges to Curso-de-Ingles/main
# 2. Platform bot creates PR: "chore: update content submodule to <sha>"
# 3. CI runs: verify-integrity.py + contract tests + BDD
# 4. Platform team reviews & merges
# 5. ArgoCD deploys to dev (auto-sync)

# Emergency content fix
# 1. Platform team: git -C content checkout <hotfix-sha>
# 2. git add content && git commit -m "chore: pin content hotfix"
# 3. Deploy
```

## References

- `ITS-ARCHITECTURE.md` §4 — Repository relationship
- `verify-integrity.py` — Content integrity checks (run in CI)
- `prd-score.py` — PRD conformance (run in CI)
- `CONSTITUTION.md` §5 — Amendment procedure (mirrors content SDD)
- Git submodules: https://git-scm.com/book/en/v2/Git-Tools-Submodules