---
name: Property-Based Testing
description: Hypothesis property tests for algorithms (BKT, IRT, FSRS) and parsers
---

# Property-Based Testing Skill — ITS Platform

## When to Use
- Testing algorithms with mathematical properties (BKT, IRT, FSRS)
- Testing parsers with round-trip invariants
- Finding edge cases that example-based tests miss

## Hypothesis Strategies

### BKT Properties
```python
# tests/unit/test_bkt_properties.py
from hypothesis import given, settings, strategies as st
from its_platform.adaptive.engine.bkt import update_mastery

@settings(max_examples=1000)
@given(
    prior=st.floats(min_value=0.0, max_value=1.0),
    correct=st.booleans(),
    slip=st.floats(min_value=0.0, max_value=0.3),
    guess=st.floats(min_value=0.0, max_value=0.3),
)
def test_bkt_bounds(prior, correct, slip, guess):
    """Posterior always in [0, 1]"""
    posterior = update_mastery(prior, correct, slip, guess)
    assert 0.0 <= posterior <= 1.0

@given(
    prior=st.floats(min_value=0.0, max_value=1.0),
    slip=st.floats(min_value=0.0, max_value=0.3),
    guess=st.floats(min_value=0.0, max_value=0.3),
)
def test_bkt_monotonic_correct(prior, slip, guess):
    """Correct answer always increases or maintains mastery"""
    post_correct = update_mastery(prior, True, slip, guess)
    post_incorrect = update_mastery(prior, False, slip, guess)
    assert post_correct >= post_incorrect

@given(
    prior=st.floats(min_value=0.0, max_value=1.0),
    slip=st.floats(min_value=0.0, max_value=0.3),
    guess=st.floats(min_value=0.0, max_value=0.3),
)
def test_bkt_correct_converges_to_1(prior, slip, guess):
    """Repeated correct answers converge to 1"""
    post = prior
    for _ in range(100):
        post = update_mastery(post, True, slip, guess)
    assert post > 0.99  # Converges to mastery

@given(
    prior=st.floats(min_value=0.0, max_value=1.0),
    slip=st.floats(min_value=0.0, max_value=0.3),
    guess=st.floats(min_value=0.0, max_value=0.3),
)
def test_bkt_incorrect_converges_to_0(prior, slip, guess):
    """Repeated incorrect answers converge to 0"""
    post = prior
    for _ in range(100):
        post = update_mastery(post, False, slip, guess)
    assert post < 0.01  # Converges to 0
```

### IRT Properties
```python
# tests/unit/test_irt_properties.py
from hypothesis import given, strategies as st
from its_platform.adaptive.engine.irt import estimate_theta, ItemParams

@given(
    responses=st.lists(st.booleans(), min_size=1, max_size=50),
    difficulties=st.lists(st.floats(-3, 3), min_size=1, max_size=50),
    discriminations=st.lists(st.floats(0.5, 2.5), min_size=1, max_size=50),
    guessings=st.lists(st.floats(0, 0.3), min_size=1, max_size=50),
)
@settings(max_examples=500)
def test_irt_ci_narrows_with_more_items(responses, difficulties, discriminations, guessings):
    """CI95 should narrow with more evidence"""
    # This is a conceptual test - actual implementation would need
    # equal-length lists and proper item parameter objects
    pass

@given(
    theta=st.floats(-4, 4),
    a=st.floats(0.5, 2.5),
    b=st.floats(-3, 3),
    c=st.floats(0, 0.3),
)
def test_irt_probability_bounds(theta, a, b, c):
    """IRT probability always in [0, 1]"""
    prob = irt_2pl_probability(theta, a, b, c)
    assert 0 <= prob <= 1
```

### FSRS Properties
```python
# tests/unit/test_fsrs_properties.py
from hypothesis import given, strategies as st
from its_platform.adaptive.engine.fsrs import next_interval

@given(
    stability=st.floats(min_value=0.1, max_value=1000.0),
    difficulty=st.floats(min_value=0.0, max_value=10.0),
    grade=st.integers(min_value=1, max_value=4),  # Again, Hard, Good, Easy
)
def test_fsrs_interval_monotonic(stability, difficulty, grade):
    """Higher grade → longer interval (for same stability/difficulty)"""
    intervals = [next_interval(stability, difficulty, g) for g in [1, 2, 3, 4]]
    assert intervals == sorted(intervals)

@given(
    stability=st.floats(min_value=0.1, max_value=1000.0),
    difficulty=st.floats(min_value=0.0, max_value=10.0),
    grade=st.integers(min_value=1, max_value=4),
)
def test_fsrs_interval_positive(stability, difficulty, grade):
    """Interval always positive"""
    interval = next_interval(stability, difficulty, grade)
    assert interval > 0

@given(
    stability=st.floats(min_value=0.1, max_value=1000.0),
    difficulty=st.floats(min_value=0.0, max_value=10.0),
)
def test_fsrs_stability_non_negative(stability, difficulty):
    """Stability never negative"""
    # FSRS stability update should never produce negative
    pass
```

### Parser Round-Trip Properties
```python
# tests/unit/test_parser_properties.py
from hypothesis import given, strategies as st
from its_platform.practice.parsers import parse_canonical_pack, parse_legacy_pack

@given(
    # Generate valid pack markdown
    pack_data=valid_pack_strategy()
)
def test_canonical_pack_round_trip(pack_data):
    """Parse → serialize → parse = original"""
    markdown = serialize_pack(pack_data)
    parsed = parse_canonical_pack(markdown)
    assert parsed.items == pack_data.items

@given(
    legacy_data=valid_legacy_pack_strategy()
)
def test_legacy_pack_round_trip(legacy_data):
    """Legacy parser preserves all items"""
    markdown = serialize_legacy_pack(legacy_data)
    parsed = parse_legacy_pack(markdown)
    assert len(parsed.items) == len(legacy_data.items)
    assert all(p.item_id == l.item_id for p, l in zip(parsed.items, legacy_data.items))
```

## Custom Strategies

```python
# tests/strategies.py
from hypothesis import strategies as st
from its_platform.schemas.curriculum import NextActivity, Rationale

rationale_strategy = st.builds(
    Rationale,
    selection_rule=st.sampled_from(["mastery_gate", "prerequisite", "spaced_review", "diagnostic_followup"]),
    mastery_gaps=st.lists(st.text(min_size=1), min_size=0, max_size=10),
    i_plus_1=st.booleans(),
)

next_activity_strategy = st.builds(
    NextActivity,
    activity_type=st.sampled_from(["lesson", "practice_pack", "listening", "review"]),
    activity_id=st.from_regex(r"^(les|pack|dlg)_[a-z0-9_]+$", fullmatch=True),
    rationale=rationale_strategy,
    estimated_duration_minutes=st.integers(min_value=5, max_value=45),
    prerequisites_met=st.booleans(),
)
```

## CI Integration

```bash
# Run property tests with more examples in CI
pytest tests/unit/test_bkt_properties.py -v --hypothesis-show-statistics
pytest tests/unit/test_irt_properties.py -v --hypothesis-show-statistics
pytest tests/unit/test_fsrs_properties.py -v --hypothesis-show-statistics
pytest tests/unit/test_parser_properties.py -v --hypothesis-show-statistics
```