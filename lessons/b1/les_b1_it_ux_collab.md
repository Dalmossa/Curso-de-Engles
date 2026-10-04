# Lesson: UX Collaboration — Wireframes, Prototypes, Personas, Accessibility

**Lesson ID:** `les_b1_it_ux_collab`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `cite_only`
**Source:** `docs/ux-design.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **user experience (UX)** | experiência do usuário | *como o usuário interage e sente o produto* |
| **user interface (UI)** | interface do usuário | *elementos visuais e interativos* |
| **wireframe** | wireframe / esboço | *estrutura de baixa fidelidade* |
| **prototype** | protótipo | *modelo interativo de média/alta fidelidade* |
| **persona** | persona | *perfil fictício de usuário típico* |
| **user journey** | jornada do usuário | *passos do usuário para atingir objetivo* |
| **usability** | usabilidade | *facilidade de uso* |
| **accessibility** | acessibilidade | *uso por pessoas com deficiência (WCAG)* |
| **user research** | pesquisa com usuários | *entrevistas, testes, observação* |
| **heuristic evaluation** | avaliação heurística | *inspeção por especialistas* |
| **A/B testing** | teste A/B | *comparar duas versões* |
| **design system** | design system | *componentes, tokens, padrões reutilizáveis* |

### Mini-texto (áudio: `deferred_render`)

> **UX Designer:** "New feature: **wireframe** first — low fidelity, focus on flow. Then **prototype** — clickable, test with 5 users."
>
> **Dev:** "**Persona**: *Maria, 34, accountant, uses keyboard only*. **Accessibility**: WCAG AA — contrast, focus order, ARIA labels."
>
> **UX Designer:** "**User journey**: login → dashboard → export report. **Usability** test: task success > 90%, time < 2 min."
>
> **Dev:** "**Design system** tokens: colors, spacing, typography. **A/B test**: button position — variant B +12% conversion."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
A **wireframe** is:
| Slot | Value |
|------|-------|
| A | High-fidelity visual design |
| B | **Low-fidelity structure sketch** |
| C | Working code |
| D | User research report |
**Key:** B
**br_pt_form:** "wireframe / esboço de baixa fidelidade"

### Item 2 — Vocabulary (Matching)
Match the UX artifact to its fidelity:
| Artifact | Fidelity |
|----------|----------|
| **Wireframe** | a. Low |
| **Prototype** | b. Medium/High |
| **Design system** | c. Implementation-ready |
| **Persona** | d. Research artifact |
**Key:** Wireframe→a, Prototype→b, Design system→c, Persona→d
**br_pt_form:** "wireframe", "protótipo", "design system", "persona"

### Item 3 — Grammar: Modal verbs for accessibility requirements (fill-in-blank)
Complete with **must / should / must not**:
"Buttons ______ have 4.5:1 contrast (WCAG AA). Focus order ______ be logical. Color ______ be the only way to convey meaning."
**Key:** must / should / must not
**br_pt_form:** "devem", "devem", "não devem"

---

## FASE 3 — Output Task [4 min]

### Speaking: Design Handoff (pares)
**Student A (UX Designer):** Hand off a feature to dev. Use: *UX, UI, wireframe, prototype, persona, user journey, usability, accessibility, user research, heuristic evaluation, A/B testing, design system*.
**Student B (Dev):** Ask 3 clarifying questions. Confirm tokens and accessibility requirements.

**Handoff script:**
> "**Wireframe**: [link] — flow: login → dashboard. **Prototype**: [Figma link] — test with *Persona: João, 45, motor impairment*. **Accessibility**: WCAG AA — focus visible, ARIA on custom select. **Design system**: use `Button.Primary`, `Input.Standard`. **A/B test**: variant B if metric > baseline."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Accessibility** (WCAG) requires:
| Slot | Value |
|------|-------|
| A | Color-only indicators |
| B | **Keyboard navigation + screen reader support** |
| C | Mouse-only interactions |
| D | No alt text on images |
**Key:** B
**br_pt_form:** "acessibilidade / navegação por teclado + leitor de tela"

### Item 2 — Grammar (L1, adaptive)
Choose the correct modal for a **must** requirement:
| Slot | Value |
|------|-------|
| A | The button **could** have focus style. |
| B | The button **should** have focus style. |
| C | The button **must** have focus style. |
| D | The button **might** have focus style. |
**Key:** C
**br_pt_form:** "O botão deve ter estilo de foco."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_ux_collab_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_ux_collab",
  "cefr_level": "B1",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (UX Designer/Dev dialogue), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/ux-design.md (Casa do Código, all rights reserved) - used for term selection and UX process; all definitions and examples authored"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - UX terms are unprotectable industry concepts; definitions authored"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.modals_accessibility"
    ],
    "vocabulary": [
      "vocab.ux.user_experience",
      "vocab.ux.user_interface",
      "vocab.ux.wireframe",
      "vocab.ux.prototype",
      "vocab.ux.persona",
      "vocab.ux.user_journey",
      "vocab.ux.usability",
      "vocab.ux.accessibility",
      "vocab.ux.user_research",
      "vocab.ux.heuristic_evaluation",
      "vocab.ux.ab_testing",
      "vocab.ux.design_system"
    ],
    "listening": [
      "listening.ux_context"
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