---
name: Mutation Testing
description: mutmut configuration, mutation score targets, adaptive engine focus for ITS Platform
---

# Mutation Testing Skill — ITS Platform

## When to Use
- Measuring test suite effectiveness
- Finding gaps in test coverage
- Ensuring adaptive engine (BKT/IRT/FSRS) tests are robust
- Quality gate for releases

## mutmut Configuration

```toml
# pyproject.toml
[tool.mutmut]
paths_to_mutate = "its_platform/adaptive/engine/"
backup = false
runner = "pytest tests/unit/test_{module}.py -x -q"
tests_dir = "tests/unit/"
dict_synonyms = ["str", "bytes", "dict", "list", "tuple", "set"]
```

## Running Mutation Tests

```bash
# Install
pip install mutmut

# Run on adaptive engine
mutmut run --paths-to-mutate=its_platform/adaptive/engine/

# Results
mutmut results

# HTML report
mutmut html

# Show specific mutant
mutmut show 1
```

## Target Scores

| Module | Target Score | Rationale |
|--------|--------------|-----------|
| `bkt.py` | ≥ 90% | Core mastery algorithm |
| `irt.py` | ≥ 85% | Complex statistical model |
| `fsrs.py` | ≥ 85% | Spaced repetition scheduler |
| `adaptive_engine.py` | ≥ 80% | Orchestrator |

## Interpreting Results

```bash
$ mutmut results
   1. its_platform/adaptive/engine/bkt.py:  92% (killed 46/50)
   2. its_platform/adaptive/engine/irt.py:  87% (killed 61/70)
   3. its_platform/adaptive/engine/fsrs.py:  85% (killed 34/40)
```

### Status Codes
- **Killed** ✅ — Test caught the mutation
- **Survived** ❌ — Test missed the mutation (gap!)
- **Timeout** ⏱️ — Test took too long
- **Suspicious** ⚠️ — Test runtime increased significantly
- **Skipped** ⏭️ — Not applicable

## Fixing Surviving Mutants

```python
# Example: Survived mutant in bkt.py
# Original: posterior = prior + (1 - prior) * (1 - slip)
# Mutant: posterior = prior + (1 - prior) * slip  # sign flipped

# Fix: Add test that catches this
def test_bkt_slip_reduces_learning():
    prior = 0.5
    slip_high = 0.3
    slip_low = 0.1
    
    post_high = update_mastery(prior, True, slip_high, 0.2)
    post_low = update_mastery(prior, True, slip_low, 0.2)
    
    # Higher slip should result in LOWER learning
    assert post_high < post_low
```

## CI Integration

```yaml
# .github/workflows/mutation.yml
name: Mutation Testing
on:
  schedule:
    - cron: '0 2 * * 1'  # Weekly Monday 2am
  workflow_dispatch:
  pull_request:
    branches: [release/*]

jobs:
  mutation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }
      - run: pip install -e ".[test]" mutmut
      - run: mutmut run --paths-to-mutate=its_platform/adaptive/engine/
      - run: mutmut results
      - name: Check mutation score
        run: |
          SCORE=$(mutmut results | grep -E "its_platform/adaptive/engine" | awk '{print $3}' | sed 's/%//' | awk '{sum+=$1} END {print sum/NR}')
          echo "Mutation score: $SCORE%"
          if (( $(echo "$SCORE < 85" | bc -l) )); then
            echo "Mutation score below 85% threshold"
            exit 1
          fi
```

## Validation Checklist
- [ ] mutmut runs on adaptive engine modules
- [ ] BKT ≥ 90%, IRT ≥ 85%, FSRS ≥ 85%
- [ ] Surviving mutants investigated and fixed
- [ ] CI runs weekly + on release branches
- [ ] HTML report generated for review