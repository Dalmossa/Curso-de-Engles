# Lesson: PRs, Tickets & Code Comments

**Lesson ID:** `les_a2_it_pr_tickets`
**Module:** `mod_a2_it_communication`
**CEFR:** A2
**Reuse basis:** `cite_only`
**Source:** `docs/Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **pull request (PR)** | pull request / PR | *solicitação de merge de branch* |
| **ticket** | ticket / issue | *unidade de trabalho rastreável* |
| **code review** | code review / revisão de código | *análise de código por pares* |
| **comment** | comentário | *anotação no código ou PR* |
| **approve** | aprovar | *dar LGTM / aprovação* |
| **request changes** | solicitar alterações | *pedir ajustes antes de merge* |
| **nitpick** | detalhe menor | *pequena sugestão, não bloqueante* |
| **LGTM** | LGTM | *Looks Good To Me* |
| **WIP** | WIP | *Work In Progress — em andamento* |
| **merge** | merge / mesclar | *integrar branch* |
| **branch** | branch / ramificação | *linha de desenvolvimento separada* |
| **commit message** | mensagem de commit | *descrição da mudança* |

### Mini-texto (áudio: `deferred_render`)

> **PR #442:** "Add retry logic to payment client"
>
> **Reviewer:** "LGTM overall. **Nitpick**: line 23 — use `exponentialBackoff` instead of fixed delay. **Comment** added."
>
> **Author:** "Done. **Request changes** resolved."
>
> **Reviewer:** "**Approve**. Ready to **merge**."
>
> **Commit message:** `feat(payment): add exponential backoff retry (fixes #442)`
>
> **Ticket #442:** Status → **Done**. **Branch** deleted.

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
**LGTM** stands for:
| Slot | Value |
|------|-------|
| A | Let's Get This Merged |
| B | **Looks Good To Me** |
| C | Last Git Test Merge |
| D | Local Git Tag Master |
**Key:** B
**br_pt_form:** "Parece bom para mim"

### Item 2 — Vocabulary (Matching)
Match the PR action to its meaning:
| Action | Meaning |
|--------|---------|
| **Approve** | a. "Code is ready, merge it" |
| **Request changes** | b. "Fix these issues first" |
| **Comment** | c. "Question or suggestion" |
| **Nitpick** | d. "Minor, non-blocking" |
**Key:** Approve→a, Request changes→b, Comment→c, Nitpick→d
**br_pt_form:** "aprovar", "solicitar alterações", "comentar", "detalhe menor"

### Item 3 — Grammar: Imperative commit messages (fill-in-blank)
Write **imperative** commit messages:
"______ (add) retry logic. ______ (fix) timeout bug. ______ (remove) dead code. ______ (update) docs."
**Key:** Add / Fix / Remove / Update
**br_pt_form:** "Adicionar", "Corrigir", "Remover", "Atualizar"

---

## FASE 3 — Output Task [4 min]

### Writing: PR Description + Code Review (individual)
**Scenario:** You opened a PR. Write:
1. **PR title** (imperative, max 50 chars)
2. **Description** (what, why, how to test)
3. **Related ticket** (fixes #XXX)

Then **review a colleague's PR** (simulated):
- 1 **Approve** or **Request changes**
- 2 **Comments** (1 nitpick + 1 substantive)
- 1 **LGTM** or **Changes requested**

**PR Template:**
```
## Description
- What: ...
- Why: ...
- How to test: ...

## Related
Fixes #XXX

## Checklist
- [ ] Tests pass
- [ ] Docs updated
- [ ] No breaking changes
```

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**WIP** in a PR title means:
| Slot | Value |
|------|-------|
| A | Work Is Perfect |
| B | **Work In Progress** |
| C | Waiting In Pipeline |
| D | With Integrated Patches |
**Key:** B
**br_pt_form:** "Em andamento"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **imperative** commit message:
| Slot | Value |
|------|-------|
| A | **Add** user authentication |
| B | **Adding** user authentication |
| C | **Added** user authentication |
| D | **Adds** user authentication |
**Key:** A
**br_pt_form:** "Adicionar autenticação de usuário"

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_pr_tickets_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_pr_tickets",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (PR simulation), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task template",
    "bibliography_only": [
      "docs/Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md (BaixeLivros notice applies) - scoping of PR/ticket/code review vocabulary"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - all content authored; PR/ticket terminology are unprotectable professional conventions"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.imperative_commit_messages"
    ],
    "vocabulary": [
      "vocab.pr.pull_request",
      "vocab.pr.ticket",
      "vocab.pr.code_review",
      "vocab.pr.comment",
      "vocab.pr.approve",
      "vocab.pr.request_changes",
      "vocab.pr.nitpick",
      "vocab.pr.lgtm",
      "vocab.pr.wip",
      "vocab.pr.merge",
      "vocab.pr.branch",
      "vocab.pr.commit_message"
    ],
    "listening": [
      "listening.pr_context"
    ],
    "pronunciation": [
      "pronunciation.acronyms"
    ],
    "reading": [
      "reading.pr_description"
    ],
    "writing": [
      "writing.pr_description",
      "writing.code_review"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```