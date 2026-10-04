# Lesson: TOEIC: Reading & Listening

**Lesson ID:** `les_b2_toeic_reading`
**Module:** `mod_b2_cert_prep`
**CEFR:** B2
**Reuse basis:** `cite_only`
**Source:** `docs/leia-e-escreva-melhor-em-ingles.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **TOEIC** | TOEIC | *Test of English for International Communication* |
| **reading comprehension** | compreensão de leitura | *entender textos escritos* |
| **listening comprehension** | compreensão auditiva | *entender áudio* |
| **inference** | inferência | *concluir além do explícito* |
| **main idea** | ideia principal | *ponto central do texto* |
| **supporting detail** | detalhe de apoio | *evidência que sustenta* |
| **tone** | tom | *atitude do autor* |
| **purpose** | propósito | *intenção do texto* |
| **context clue** | pista de contexto | *informação que ajuda a inferir* |
| **skimming** | skimming / leitura rápida | *ler para ideia geral* |
| **scanning** | scanning / leitura direcionada | *ler para informação específica* |
| **distrator** | distrator | *opção incorreta em múltipla escolha* |

### Mini-texto (áudio: `deferred_render`)

> **Instructor:** "**TOEIC Reading**: **skimming** for **main idea**, **scanning** for details. **Inference**: read between lines."
>
> "**Listening**: **context clues** help. **Tone** and **purpose** matter. **Distractors**: eliminate wrong answers."
>
> "Example: *'The meeting was postponed.'* **Inference**: something urgent happened. **Main idea**: schedule change. **Supporting detail**: new date."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
**Skimming** a text means:
| Slot | Value |
|------|-------|
| A | Reading every word |
| B | **Reading quickly for main idea** |
| C | Translating |
| D | Memorizing |
**Key:** B
**br_pt_form:** "skimming / leitura rápida para ideia geral"

### Item 2 — Vocabulary (Matching)
Match the TOEIC skill to its purpose:
| Skill | Purpose |
|-------|---------|
| **Skimming** | a. Main idea |
| **Scanning** | b. Specific information |
| **Inference** | c. Read between lines |
| **Context clue** | d. Help infer meaning |
**Key:** Skimming→a, Scanning→b, Inference→c, Context clue→d
**br_pt_form:** "skimming", "scanning", "inferência", "pista de contexto"

### Item 3 — Grammar: Present perfect for exam experience (fill-in-blank)
Complete with **present perfect**:
"I ______ (take) the TOEIC twice. She ______ (improve) her score. They ______ (not receive) results yet."
**Key:** have taken / has improved / have not received
**br_pt_form:** "fiz", "melhorou", "não receberam"

---

## FASE 3 — Output Task [4 min]

### Reading: TOEIC-Style Passage (individual)
**Read and answer:**

> "Due to unforeseen circumstances, the product launch scheduled for March 15th will be postponed. Customers who pre-ordered will receive a 10% discount. The new date will be announced within two weeks."

**Questions:**
1. **Main idea**: What happened?
2. **Inference**: Why might it be postponed?
3. **Supporting detail**: What do pre-order customers get?
4. **Tone**: Formal / Informal / Neutral?

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
A **distractor** in TOEIC is:
| Slot | Value |
|------|-------|
| A | The correct answer |
| B | **A wrong option designed to mislead** |
| C | A hint |
| D | A question |
**Key:** B
**br_pt_form:** "distrator / opção incorreta que confunde"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **present perfect** for exam experience:
| Slot | Value |
|------|-------|
| A | I **take** the TOEIC last year. |
| B | I **have taken** the TOEIC twice. |
| C | I **am taking** the TOEIC twice. |
| D | I **took** the TOEIC twice. |
**Key:** B
**br_pt_form:** "Eu fiz o TOEIC duas vezes."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_toeic_reading_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_toeic_reading",
  "cefr_level": "B2",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (Instructor explanation), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/leia-e-escreva-melhor-em-ingles.md (BaixeLivros notice applies) - scoping of reading comprehension and test-taking strategies"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - TOEIC terms are unprotectable test concepts; definitions authored"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading"],
  "output_modalities": ["reading", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.present_perfect_exam"
    ],
    "vocabulary": [
      "vocab.toeic.toeic",
      "vocab.toeic.reading_comprehension",
      "vocab.toeic.listening_comprehension",
      "vocab.toeic.inference",
      "vocab.toeic.main_idea",
      "vocab.toeic.supporting_detail",
      "vocab.toeic.tone",
      "vocab.toeic.purpose",
      "vocab.toeic.context_clue",
      "vocab.toeic.skimming",
      "vocab.toeic.scanning",
      "vocab.toeic.distractor"
    ],
    "listening": [
      "listening.toeic_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ],
    "reading": [
      "reading.toeic_passage"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_communication",
    "les_b1_it_technical",
    "les_b1_fluency_project",
    "les_b2_professional"
  ],
  "estimated_time_min": 15
}
```