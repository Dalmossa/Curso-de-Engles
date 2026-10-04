# Lesson: Technical Emails & Documentation

**Lesson ID:** `les_a2_it_email_technical`
**Module:** `mod_a2_it_communication`
**CEFR:** A2
**Reuse basis:** `cite_only`
**Source:** `docs/Ingles-Tecnico-Para-Informatica.md` + `docs/Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **subject line** | assunto | *linha de assunto do e-mail* |
| **attachment** | anexo | *arquivo anexado* |
| **follow up** | acompanhar / dar follow-up | *retomar conversa pendente* |
| **action item** | item de ação | *tarefa atribuída com dono e prazo* |
| **ETA** | previsão de entrega | *Estimated Time of Arrival* |
| **blocker** | bloqueio | *impedimento que trava progresso* |
| **stakeholder** | parte interessada | *quem tem interesse no resultado* |
| **FYI** | para seu conhecimento | *For Your Information* |
| **ASAP** | o mais rápido possível | *As Soon As Possible* |
| **TL;DR** | resumo | *Too Long; Didn't Read* |

### Mini-texto (áudio: `deferred_render`)

> **Subject:** `[FEAT-123] API timeout on payment endpoint — action needed`
>
> **Hi team,**
>
> **TL;DR:** Payment API times out at 30s. Root cause: missing DB index. **Blocker** for release.
>
> **Details:** The `/payments` endpoint exceeds our 30s SLA. Logs show full table scan on `transactions`. **Action item:** @backend-dev add index on `user_id + created_at`. **ETA:** today EOD.
>
> **Attachment:** `query-plan.pdf` (explain analyze output).
>
> **Please confirm** receipt. FYI @product-owner.
>
> **Thanks,**
> Dev Team

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
What does **ETA** stand for?
| Slot | Value |
|------|-------|
| A | Exact Time of Arrival |
| B | **Estimated Time of Arrival** |
| C | Early Task Assignment |
| D | Error Tracking Alert |
**Key:** B
**br_pt_form:** "previsão de entrega"

### Item 2 — Vocabulary (Matching)
Match the term to its use in a technical email:
| Term | Use |
|------|-----|
| **action item** | a. Task with owner and deadline |
| **blocker** | b. Something stopping progress |
| **FYI** | c. Information only, no action needed |
| **ASAP** | d. Urgent priority |
**Key:** action item→a, blocker→b, FYI→c, ASAP→d
**br_pt_form:** "item de ação", "bloqueio", "para seu conhecimento", "o mais rápido possível"

### Item 3 — Grammar: Imperative for requests (fill-in-blank)
Complete with **imperative** verbs:
"______ (review) the attachment. ______ (confirm) you received this. ______ (let me know) if you need clarification."
**Key:** Review / Confirm / Let me know
**br_pt_form:** "Revise", "Confirme", "Me avise"

---

## FASE 3 — Output Task [4 min]

### Writing: Technical Email (individual)
**Scenario:** Your team's CI pipeline is failing on the `lint` stage. You need the frontend lead to fix it. Write a **short technical email** with:
- Clear **subject line** (include ticket ID)
- **TL;DR** (one line)
- **Blocker** explanation
- **Action item** with owner
- **ETA** request
- **Attachment** mention (log file)

**Template:**
```
Subject: [TICKET-ID] Brief description — action needed

TL;DR: One-line summary.

Details: ...

Action item: @owner — what / by when

ETA: ...

Attachment: ...

FYI @stakeholder
```

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**FYI** means:
| Slot | Value |
|------|-------|
| A | Fix Your Issue |
| B | **For Your Information** |
| C | Follow Your Instinct |
| D | Forward Your Inquiry |
**Key:** B
**br_pt_form:** "para seu conhecimento"

### Item 2 — Grammar (L1, adaptive)
Choose the correct imperative for a polite request:
| Slot | Value |
|------|-------|
| A | **Please review** the attached log. |
| B | **Reviewing** the attached log. |
| C | **To review** the attached log. |
| D | **Reviewed** the attached log. |
**Key:** A
**br_pt_form:** "Por favor, revise o log anexo."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_email_technical_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_email_technical",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (email example), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of technical email register",
      "docs/Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md (BaixeLivros notice applies) - acronyms: ETA, FYI, ASAP, TL;DR"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - all content authored; acronyms are unprotectable abbreviations"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.imperative_requests"
    ],
    "vocabulary": [
      "vocab.email.subject_line",
      "vocab.email.attachment",
      "vocab.email.follow_up",
      "vocab.email.action_item",
      "vocab.email.eta",
      "vocab.email.blocker",
      "vocab.email.stakeholder",
      "vocab.email.fyi",
      "vocab.email.asap",
      "vocab.email.tldr"
    ],
    "listening": [
      "listening.email_context"
    ],
    "pronunciation": [
      "pronunciation.acronyms"
    ],
    "reading": [
      "reading.technical_email"
    ],
    "writing": [
      "writing.technical_email"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```