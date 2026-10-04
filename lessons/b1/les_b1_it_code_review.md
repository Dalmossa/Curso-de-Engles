# Lesson: Code Review Comments

**Lesson ID:** `les_b1_it_code_review`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `adapt_with_attribution`
**Source:** S07 (Google Code Review Guide, CC-BY-4.0), S06 (Google Engineering Practices, CC-BY-3.0), S08 (Google Style Guide, CC-BY-4.0), S10 (Google Testing, CC-BY-4.0), S18 (opensource.guide, CC-BY-4.0) — `sourced_external`
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **code review** | revisão de código | *análise de código por pares antes do merge* |
| **comment** | comentário | *anotação no diff do PR* |
| **suggestion** | sugestão | *proposta de alteração (pode ser aplicada com 1 clique)* |
| **nitpick** | detalhe menor | *questão de estilo, não bloqueante* |
| **blocking** | bloqueante | *precisa ser corrigido antes do merge* |
| **non-blocking** | não bloqueante | *opcional, pode seguir depois* |
| **LGTM** | LGTM | *Looks Good To Me — aprovação* |
| **refactor** | refatorar | *reestruturar sem mudar comportamento* |
| **extract method** | extrair método | *mover código para nova função* |
| **magic number** | número mágico | *literal numérico sem explicação* |
| **edge case** | caso de borda | *cenário raro mas possível* |
| **test coverage** | cobertura de testes | *% de código exercitado por testes* |

### Mini-texto (áudio: `deferred_render`)

> **Reviewer:** "LGTM overall. **Blocking**: line 45 — SQL injection risk. Use parameterized query. **Suggestion** added."
>
> **Reviewer:** "**Non-blocking**: line 12 — **magic number** `300`. Extract to constant `DEFAULT_TIMEOUT_MS`."
>
> **Reviewer:** "**Nitpick**: line 8 — trailing whitespace. **Refactor**: lines 20-35 — **extract method** `calculateTotal()`."
>
> **Author:** "Fixed blocking. Applied suggestions. Added **test coverage** for **edge case** (empty cart)."
>
> **Reviewer:** "LGTM. Ready to merge."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
A **blocking** comment means:
| Slot | Value |
|------|-------|
| A | Optional, can merge anyway |
| B | **Must fix before merge** |
| C | Style only |
| D | Compliment |
**Key:** B
**br_pt_form:** "bloqueante / deve corrigir antes do merge"

### Item 2 — Vocabulary (Matching)
Match the review action to its severity:
| Action | Severity |
|--------|----------|
| **LGTM** | a. Approval |
| **Blocking** | b. Must fix |
| **Suggestion** | c. One-click fix |
| **Nitpick** | d. Minor style |
**Key:** LGTM→a, Blocking→b, Suggestion→c, Nitpick→d
**br_pt_form:** "aprovação", "bloqueante", "sugestão", "detalhe menor"

### Item 3 — Grammar: Modal verbs for review feedback (fill-in-blank)
Complete with **must / should / could / mustn't**:
"You ______ fix the SQL injection (blocking). You ______ extract the magic number (suggestion). You ______ remove trailing whitespace (nitpick). You ______ merge without fixing blocking."
**Key:** must / should / could / mustn't
**br_pt_form:** "deve", "deveria", "poderia", "não deve"

---

## FASE 3 — Output Task [4 min]

### Writing: Code Review Simulation (individual)
**Scenario:** Review this diff. Write **4 comments** (1 blocking, 1 suggestion, 1 nitpick, 1 LGTM summary).

```python
# Before
def process_payment(user, amount):
    query = f"UPDATE accounts SET balance = balance - {amount} WHERE id = {user.id}"
    db.execute(query)
    return True
```

**Your comments:**
1. **Blocking:** line 2 — SQL injection. Use parameterized query.
2. **Suggestion:** line 2 — extract `amount` validation to `validate_amount()`.
3. **Nitpick:** line 1 — missing type hints.
4. **LGTM summary:** "Blocking fixed → LGTM."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**LGTM** in a code review means:
| Slot | Value |
|------|-------|
| A | Let's Get This Merged |
| B | **Looks Good To Me** |
| C | Last Git Test Merge |
| D | Local Git Tag Master |
**Key:** B
**br_pt_form:** "Parece bom para mim"

### Item 2 — Grammar (L1, adaptive)
Choose the correct modal for a **blocking** issue:
| Slot | Value |
|------|-------|
| A | You **could** fix this before merge. |
| B | You **should** fix this before merge. |
| C | You **must** fix this before merge. |
| D | You **might** fix this before merge. |
**Key:** C
**br_pt_form:** "Você deve corrigir antes do merge."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_code_review_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_code_review",
  "cefr_level": "B1",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S07",
        "title": "Google Code Review Guide",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "code review comment taxonomy (blocking, non-blocking, suggestion, nitpick, LGTM); feedback style guidance",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S06",
        "title": "Google Engineering Practices - Code Review",
        "licence": "CC-BY-3.0",
        "what_was_adapted": "review process, blocking vs non-blocking, suggestion feature, reviewer/author roles",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S08",
        "title": "Google Developer Documentation Style Guide",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "technical writing style for review comments; clarity, tone, actionable feedback",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S10",
        "title": "Google Testing Blog - Code Review",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "test coverage expectations in review, edge case checking",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S18",
        "title": "opensource.guide - Code Review",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "open source review conventions, welcoming tone, constructive feedback",
        "attribution_location": "section 'Fontes e Atribuição' below"
      }
    ],
    "authored_material": "all exercises, the mini-text (review simulation), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of code review register"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - terminology adapted, not quoted; all sources CC-BY permissive"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.modals_review_feedback"
    ],
    "vocabulary": [
      "vocab.codereview.code_review",
      "vocab.codereview.comment",
      "vocab.codereview.suggestion",
      "vocab.codereview.nitpick",
      "vocab.codereview.blocking",
      "vocab.codereview.non_blocking",
      "vocab.codereview.lgtm",
      "vocab.codereview.refactor",
      "vocab.codereview.extract_method",
      "vocab.codereview.magic_number",
      "vocab.codereview.edge_case",
      "vocab.codereview.test_coverage"
    ],
    "listening": [
      "listening.codereview_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ],
    "reading": [
      "reading.code_diff"
    ],
    "writing": [
      "writing.code_review"
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

- **S07** Google Code Review Guide, licensed under CC-BY-4.0. Adapted for comment taxonomy and feedback style.
- **S06** Google Engineering Practices - Code Review, licensed under CC-BY-3.0. Adapted for review process and roles.
- **S08** Google Developer Documentation Style Guide, licensed under CC-BY-4.0. Adapted for technical writing style in reviews.
- **S10** Google Testing Blog, licensed under CC-BY-4.0. Adapted for test coverage and edge case expectations.
- **S18** opensource.guide - Code Review, licensed under CC-BY-4.0. Adapted for open source conventions.