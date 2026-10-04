# Lesson: Debugging & Error Reporting

**Lesson ID:** `les_b1_it_debugging`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `adapt_with_attribution`
**Source:** S09 (Google Cloud Debugging, CC-BY-4.0), S13 (MDN Console API, CC-BY-SA-2.5), S14 (MDN Error Handling, CC-BY-SA-2.5), S11 (Google Engineering Practices, CC-BY-3.0) — `sourced_external`
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **debug** | depurar / debugar | *encontrar e corrigir bugs* |
| **breakpoint** | ponto de parada | *pausa execução para inspecionar* |
| **stack trace** | stack trace / rastro de pilha | *sequência de chamadas no erro* |
| **root cause** | causa raiz | *origem fundamental do bug* |
| **reproduce** | reproduzir | *fazer o bug acontecer de novo* |
| **log** | log / registro | *saída de diagnóstico* |
| **console** | console | *ferramenta de debug no browser/terminal* |
| **exception** | exceção | *erro que interrompe fluxo normal* |
| **error handling** | tratamento de erro | *código que lida com falhas* |
| **try / catch** | tentar / capturar | *blocos para capturar exceções* |
| **assert** | assert / afirmar | *verifica condição, falha se falsa* |
| **hotfix** | hotfix | *correção urgente em produção* |

### Mini-texto (áudio: `deferred_render`)

> **Dev:** "Production **exception**: `NullPointerException` at `PaymentService:42`. **Stack trace** shows `user.getWallet()` returns null."
>
> **Lead:** "Can you **reproduce** locally? Add **log** before line 42. Use **breakpoint** to inspect `user` object."
>
> **Dev:** "Reproduced. **Root cause**: wallet not initialized for guest users. **Error handling** missing — no **try/catch**, no **assert**."
>
> **Lead:** "Fix: add **assert** `user.hasWallet()`. **Hotfix** deploy today. Add **test** for guest flow."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
A **stack trace** shows:
| Slot | Value |
|------|-------|
| A | Memory usage over time |
| B | **Sequence of function calls leading to error** |
| C | CPU percentage |
| D | Network latency |
**Key:** B
**br_pt_form:** "sequência de chamadas até o erro"

### Item 2 — Vocabulary (Matching)
Match the debugging action to the tool:
| Action | Tool |
|--------|------|
| **Pause execution** | a. **Breakpoint** |
| **Print variable value** | b. **Log / console.log** |
| **Inspect call stack** | c. **Stack trace** |
| **Verify assumption** | d. **Assert** |
**Key:** Pause→a, Print→b, Inspect→c, Verify→d
**br_pt_form:** "ponto de parada", "log", "stack trace", "assert"

### Item 3 — Grammar: Past perfect for debugging narrative (fill-in-blank)
Complete with **past perfect**:
"By the time we **found** the bug, the user **had already reported** it twice. The wallet **had not been initialized** for guests."
**Key:** had already reported / had not been initialized
**br_pt_form:** "já tinha reportado", "não tinha sido inicializada"

---

## FASE 3 — Output Task [4 min]

### Speaking: Debugging Session Roleplay (pares)
**Student A (Dev):** Describe the bug you're investigating. Use: *debug, breakpoint, stack trace, root cause, reproduce, log, console, exception, error handling, try/catch, assert, hotfix*.
**Student B (Lead):** Ask 3 diagnostic questions. Suggest next step.

**Bug scenarios:**
1. Intermittent 500 on `/checkout` — only for users with coupon
2. Memory leak in background worker — OOM after 6 hours
3. Race condition: double charge when user clicks "Pay" twice

**Example (Dev):** "Getting `TimeoutException` on `/checkout`. **Stack trace** points to `InventoryClient`. **Reproduced** with 50 concurrent requests. **Root cause**: no timeout configured. **Fix**: add 5s timeout + **try/catch** fallback."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Try / catch** is used for:
| Slot | Value |
|------|-------|
| A | Looping over arrays |
| B | **Error handling / catching exceptions** |
| C | Defining variables |
| D | Importing modules |
**Key:** B
**br_pt_form:** "tratamento de erro / capturar exceções"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **past perfect**:
| Slot | Value |
|------|-------|
| A | The bug **was fixed** before we **had deployed**. |
| B | The bug **had been fixed** before we **deployed**. |
| C | The bug **fixed** before we **had deployed**. |
| D | The bug **has fixed** before we **deployed**. |
**Key:** B
**br_pt_form:** "O bug tinha sido corrigido antes de implantarmos."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_debugging_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_debugging",
  "cefr_level": "B1",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S09",
        "title": "Google Cloud Debugging Documentation",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "debugging workflow terminology (breakpoint, stack trace, reproduce, root cause, log, hotfix); adapted for B1 level",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S13",
        "title": "MDN Web Docs - Console API",
        "licence": "CC-BY-SA-2.5",
        "what_was_adapted": "console.log, console.error, debugging in browser context; terminology only",
        "attribution_location": "section 'Fontes e Atribuição' below",
        "share_alike_note": "Lesson material authored, not quoted; source cited as background per external-sources.md §7.2"
      },
      {
        "id": "S14",
        "title": "MDN Web Docs - Error Handling (try/catch, throw)",
        "licence": "CC-BY-SA-2.5",
        "what_was_adapted": "exception, try/catch, throw, error handling patterns; terminology only",
        "attribution_location": "section 'Fontes e Atribuição' below",
        "share_alike_note": "Lesson material authored, not quoted; source cited as background per external-sources.md §7.2"
      },
      {
        "id": "S11",
        "title": "Google Engineering Practices - Debugging",
        "licence": "CC-BY-3.0",
        "what_was_adapted": "debugging methodology (reproduce, isolate, root cause, fix, verify); process framing",
        "attribution_location": "section 'Fontes e Atribuição' below"
      }
    ],
    "authored_material": "all exercises, the mini-text (Dev/Lead dialogue), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of debugging register"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - terminology adapted, not quoted; CC-BY-SA sources managed per external-sources.md §7.2"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.past_perfect_debugging"
    ],
    "vocabulary": [
      "vocab.debug.debug",
      "vocab.debug.breakpoint",
      "vocab.debug.stack_trace",
      "vocab.debug.root_cause",
      "vocab.debug.reproduce",
      "vocab.debug.log",
      "vocab.debug.console",
      "vocab.debug.exception",
      "vocab.debug.error_handling",
      "vocab.debug.try_catch",
      "vocab.debug.assert",
      "vocab.debug.hotfix"
    ],
    "listening": [
      "listening.debug_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
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

- **S09** Google Cloud Debugging Documentation, licensed under CC-BY-4.0. Adapted for debugging workflow vocabulary.
- **S13** MDN Web Docs - Console API, licensed under CC-BY-SA-2.5. Referenced for browser debugging terminology.
- **S14** MDN Web Docs - Error Handling, licensed under CC-BY-SA-2.5. Referenced for try/catch and exception terminology.
- **S11** Google Engineering Practices - Debugging, licensed under CC-BY-3.0. Adapted for debugging methodology.