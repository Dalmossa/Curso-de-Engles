---
adr: 004
title: Support two pack schemas (canonical + legacy)
status: Accepted
date: 2026-10-03
authors: [@content-lead]
deciders: [@content-lead, @platform-lead, @assessment-lead]
consulted: [@psychometrician]
informed: [@team]
tags: [content, assessment, schema, migration]
---

## Context

The repository contains **two practice pack schemas** coexisting:

| Schema | Files | Items | Status |
|---|---|---|---|
| **Canonical** (`pack-les-*.md`) | 7 | 49 | YAML manifest + per-item YAML + prose feedback |
| **Legacy** (`pack_les_*_v1.md`) | 115 | 806 | Prose header + flat `**item_id:**` fields |

Source: `post-lesson-practice-spec.md` §8, §12

**Constraints:**
- 115 legacy packs cannot be migrated all at once (806 items, psychometric calibration)
- Both schemas must be readable by Practice Engine
- Contract tests must run on both schemas
- Migration order defined in `post-lesson-practice-spec.md` §12

## Decision

**Support both schemas simultaneously in Practice Engine with schema detection at read time.**

### Schema Detection

```python
def detect_pack_schema(content: str) -> Literal["canonical", "legacy_v1"]:
    if re.search(r"^pack_id:\s*", content, re.M):
        return "canonical"
    elif re.search(r"^\*\*Pack ID:\*\*", content, re.M):
        return "legacy_v1"
    else:
        raise ValueError("Unknown pack schema")
```

### Unified Item Model

```python
class PackItem(BaseModel):
    item_id: str
    skill: Skill
    domain: Optional[str]
    prompt: str
    options: List[Option]  # Empty for production/minimal-pair items
    key: Optional[str]     # None for production items
    listening_items: List[ListeningSlot] = []
    br_pt_form: Optional[str]
    provenance: Literal["source_derived", "author_original"]
    # Schema-specific fields
    schema_version: Literal["canonical", "legacy_v1"]
```

### Parsers

```python
# Canonical parser (YAML front-matter + per-item YAML)
def parse_canonical_pack(content: str) -> Pack:
    ...

# Legacy parser (prose + **item_id:** fields)
def parse_legacy_pack(content: str) -> Pack:
    ...

# Unified interface
def parse_pack(content: str) -> Pack:
    schema = detect_pack_schema(content)
    if schema == "canonical":
        return parse_canonical_pack(content)
    return parse_legacy_pack(content)
```

## Consequences

### Positive
- **No big-bang migration** — migrate packs incrementally per `post-lesson-practice-spec.md` §12
- **Backward compatibility** — existing 115 packs continue working
- **Contract tests on both** — `verify-integrity.py` [11c][11d][11e] run on both schemas
- **Psychometric safety** — calibrated items keep their IDs during migration

### Negative
- **Parser complexity** — two parsing code paths to maintain
- **Schema drift risk** — legacy schema not validated as strictly
- **Duplicate logic** — some validation shared, some schema-specific

### Neutral
- **Migration timeline** — tracked as RF-001 in PRD §8
- **Deprecation** — legacy schema marked deprecated; no new packs in legacy format

## Alternatives Considered

1. **Big-bang migration** — rewrite all 115 packs at once; high risk, psychometric invalidation
2. **Legacy-only** — never adopt canonical schema; technical debt accumulates
3. **Separate engines** — two Practice Engine implementations; code duplication
4. **Runtime translation** — legacy → canonical at read time; loses original formatting

## Implementation Plan

- [x] `detect_pack_schema()` in `practice/parsers/__init__.py`
- [x] `parse_canonical_pack()` using `yaml.safe_load` + YAML front-matter
- [x] `parse_legacy_pack()` using regex for `**item_id:**` blocks
- [x] Unified `PackItem` Pydantic model (both schemas map to it)
- [x] `verify-integrity.py` [11c][11d][11e] run on both globs
- [ ] Migration script per `post-lesson-practice-spec.md` §12 order
- [ ] CI check: no new legacy packs added
- [ ] Deprecation notice in `post-lesson-practice-spec.md` §8

## Migration Order (from spec §12)

1. Packs with `**Reuse basis:**` declared (12 packs)
2. Packs with simple items (no listening_items)
3. Packs with listening_items
4. Packs with complex distractors
5. Final validation: all 122 packs canonical

## References

- `post-lesson-practice-spec.md` §8, §12 — Schema definitions, migration order
- `verify-integrity.py` [11c], [11d], [11e] — Schema-independent checks
- `assessment-item-spec.md` §1.2 — `item_id` prefix ↔ skill namespace