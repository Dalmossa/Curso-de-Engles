# Lesson: Writing Documentation & RFCs

**Lesson ID:** `les_b1_it_write_docs`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `adapt_with_attribution`
**Source:** S01 (Google Style Guide, CC-BY-4.0), S10 (Google Testing, CC-BY-4.0), S16 (Kubernetes docs, CC-BY-4.0) — `sourced_external`
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **documentation** | documentação | *conjunto de documentos técnicos* |
| **RFC** | Request for Comments | *proposta de mudança/design* |
| **design doc** | documento de design | *especificação técnica antes de implementar* |
| **README** | README | *visão geral do projeto/repo* |
| **changelog** | changelog / histórico de mudanças | *registro de versões* |
| **migration guide** | guia de migração | *passos para atualizar versão* |
| **deprecation** | depreciação | *aviso de remoção futura* |
| **code sample** | exemplo de código | *trecho executável na doc* |
| **diagram** | diagrama | *representação visual (arquitetura, fluxo)* |
| **audience** | público-alvo | *quem vai ler (devs, ops, PMs)* |
| **tone** | tom | *voz da documentação (imperativo, neutro)* |
| **living document** | documento vivo | *atualizado continuamente* |

### Mini-texto (áudio: `deferred_render`)

> **Tech Writer:** "New **RFC** template: **Problem**, **Proposal**, **Alternatives**, **Trade-offs**, **Migration**, **Rollout**."
>
> **Dev:** "Our **design doc** for `AuthService` split: **audience** = backend devs. **Tone** = imperative. **Code samples** must compile."
>
> **Tech Writer:** "**README**: what, why, quickstart. **Changelog**: Keep a **living document**. **Deprecation** notice 2 versions before removal. **Migration guide** with before/after **code samples**."
>
> **Dev:** "Add **diagram** for auth flow. Link to **RFC** #442."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
An **RFC** (Request for Comments) is:
| Slot | Value |
|------|-------|
| A | A bug report |
| B | **A design proposal for review** |
| C | A test plan |
| D | A deployment script |
**Key:** B
**br_pt_form:** "proposta de design para revisão"

### Item 2 — Vocabulary (Matching)
Match the doc type to its purpose:
| Doc Type | Purpose |
|----------|---------|
| **README** | a. Project overview + quickstart |
| **Design doc** | b. Technical spec before coding |
| **Changelog** | c. Version history |
| **Migration guide** | d. Steps to upgrade |
**Key:** README→a, Design doc→b, Changelog→c, Migration guide→d
**br_pt_form:** "README", "documento de design", "changelog", "guia de migração"

### Item 3 — Grammar: Imperative for documentation (fill-in-blank)
Complete with **imperative verbs**:
"______ (install) the package. ______ (run) the tests. ______ (check) the logs. ______ (do not commit) secrets."
**Key:** Install / Run / Check / Do not commit
**br_pt_form:** "Instale", "Execute", "Verifique", "Não comite"

---

## FASE 3 — Output Task [4 min]

### Writing: RFC Sketch (individual)
**Scenario:** Write a **mini-RFC** (150 words) for: "Add idempotency keys to Payment API".

**Structure:**
```
# RFC: Add Idempotency Keys to Payment API

## Problem
Duplicate charges when user retries.

## Proposal
Add `Idempotency-Key` header. Store key + result for 24h.

## Alternatives
- Client-side dedup (rejected: unreliable)
- DB unique constraint (rejected: race condition)

## Trade-offs
+ Prevents double charge
- Extra storage, latency

## Migration
New header optional for 2 versions, then required.

## Rollout
Canary 5% → 100%.
```

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
A **changelog** records:
| Slot | Value |
|------|-------|
| A | Future plans |
| B | **Version history (added, changed, fixed, removed)** |
| C | Design proposals |
| C | Meeting notes |
**Key:** B
**br_pt_form:** "histórico de versões"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **imperative** for documentation:
| Slot | Value |
|------|-------|
| A | **Configure** the timeout in settings. |
| B | **Configuring** the timeout in settings. |
| C | **Configured** the timeout in settings. |
| D | **Configures** the timeout in settings. |
**Key:** A
**br_pt_form:** "Configure o timeout nas configurações."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_write_docs_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_write_docs",
  "cefr_level": "B1",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S01",
        "title": "Google Developer Documentation Style Guide",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "documentation tone (imperative, concise), structure (overview, prerequisites, steps), code sample requirements, audience awareness",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S10",
        "title": "Google Testing Documentation",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "documentation as living artifact, changelog practices, deprecation notices, migration guides",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S16",
        "title": "Kubernetes Documentation - Contributing",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "RFC/KEP process, design doc template, documentation structure for technical projects",
        "attribution_location": "section 'Fontes e Atribuição' below"
      }
    ],
    "authored_material": "all exercises, the mini-text (Tech Writer/Dev dialogue), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task template",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of technical documentation register"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - terminology adapted, not quoted; all sources CC-BY permissive"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.imperative_documentation"
    ],
    "vocabulary": [
      "vocab.docs.documentation",
      "vocab.docs.rfc",
      "vocab.docs.design_doc",
      "vocab.docs.readme",
      "vocab.docs.changelog",
      "vocab.docs.migration_guide",
      "vocab.docs.deprecation",
      "vocab.docs.code_sample",
      "vocab.docs.diagram",
      "vocab.docs.audience",
      "vocab.docs.tone",
      "vocab.docs.living_document"
    ],
    "listening": [
      "listening.docs_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ],
    "reading": [
      "reading.technical_documentation"
    ],
    "writing": [
      "writing.rfc",
      "writing.design_doc",
      "writing.documentation"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_communication"
  ],
  "estimated_time_min": 15
}
```

---

## Fontes e Atribuição

- **S01** Google Developer Documentation Style Guide, licensed under CC-BY-4.0. Adapted for documentation tone, structure, and code sample standards.
- **S10** Google Testing Documentation, licensed under CC-BY-4.0. Adapted for living document practices and migration guides.
- **S16** Kubernetes Documentation, licensed under CC-BY-4.0. Adapted for RFC/design doc process and technical documentation structure.