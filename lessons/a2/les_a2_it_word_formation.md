# Lesson: Prefix, Suffix & Deceptive Cognates

**Lesson ID:** `les_a2_it_word_formation`
**Module:** `mod_a2_it_communication`
**CEFR:** A2
**Reuse basis:** `cite_only`
**Source:** `docs/Ingles-Tecnico-Para-Informatica.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **prefix** | prefixo | *início da palavra: `pre-`, `re-`, `un-`, `de-`, `mis-`, `over-`, `under-`, `sub-`, `inter-`, `trans-`* |
| **suffix** | sufixo | *fim da palavra: `-tion`, `-ment`, `-able`, `-ible`, `-ity`, `-ness`, `-ize`, `-ify`, `-er`, `-or`* |
| **root** | raiz | *parte central: `compute`, `script`, `struct`, `port`, `form`* |
| **deceptive cognate** | falso cognato | *parece igual, mas significa outro: `actually` ≠ atualmente, `pretend` ≠ pretender* |
| **derive** | derivar | *criar palavra nova a partir da raiz* |
| **inflection** | flexão | *mudança gramatical: `compute → computes → computing → computed`* |
| **compound** | composto | *duas raízes: `software`, `hardware`, `network`, `database`* |
| **false friend** | falso amigo | *sinônimo de deceptive cognate* |

### Mini-texto (áudio: `deferred_render`)

> **Dev:** "This function **recomputes** the cache. **Prefix** `re-` = again. **Root** `compute`. **Suffix** `-s` = 3rd person singular."
>
> **Reviewer:** "Watch **false friends**: `actually` = *na verdade* (not *atualmente*). `pretend` = *fingir* (not *pretender*). `library` = *biblioteca* (not *livraria*). `parent` = *pai/mãe* (not *parente* — that's *relative*)."
>
> **Dev:** "Good catch. **Compound**: `software` = soft + ware. **Derivation**: `deploy → deployment → deployable`. **Inflection**: `deploy, deploys, deploying, deployed`."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
`un-` in **undo**, **unzip**, **uninstall** means:
| Slot | Value |
|------|-------|
| A | Do again |
| B | **Reverse / remove** |
| C | Do too much |
| D | Do together |
**Key:** B
**br_pt_form:** "reverso / remover"

### Item 2 — Vocabulary (Matching)
Match the **false cognate** to its real meaning:
| Word | Real meaning |
|------|--------------|
| **actually** | a. *na verdade* |
| **pretend** | b. *fingir* |
| **library** | c. *biblioteca* |
| **parent** | d. *pai / mãe* |
**Key:** actually→a, pretend→b, library→c, parent→d
**br_pt_form:** "na verdade", "fingir", "biblioteca", "pai/mãe"

### Item 3 — Grammar: Word formation (fill-in-blank)
Complete with the correct **derived form**:
"Please **deployment** → **deploy** the app. The **configuration** → **configure** is done. It is **deployable** → **deploy**."
**Key:** deploy / configure / deployable
**br_pt_form:** "implantar", "configurar", "implantável"

---

## FASE 3 — Output Task [4 min]

### Speaking: Word Building Game (pares)
**Student A:** Gives a **root** (ex: `script`, `port`, `form`, `struct`, `compute`).
**Student B:** Builds 3 words using **prefixes/suffixes** and explains each.
**Swap roles.**

**Example:**
> A: "Root: `port`"
> B: "**Import** (bring in), **export** (send out), **transport** (move across). Prefixes: `im-`, `ex-`, `trans-`."

**Roots to use:** `script`, `port`, `form`, `struct`, `compute`, `ject`, `duct`, `fer`, `mit`, `tain`

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Actually** means:
| Slot | Value |
|------|-------|
| A | Atualmente |
| B | **Na verdade** |
| C | Atualmente mesmo |
| D | Atual |
**Key:** B
**br_pt_form:** "na verdade"

### Item 2 — Grammar (L1, adaptive)
Choose the correct derived noun from **configure**:
| Slot | Value |
|------|-------|
| A | Configurate |
| B | **Configuration** |
| C | Configuring |
| D | Configurator |
**Key:** B
**br_pt_form:** "configuração"

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_word_formation_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_word_formation",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (Dev/Reviewer dialogue), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of IT word formation patterns and false cognates"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - all content authored; morphological patterns and false cognates are unprotectable linguistic facts"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.word_formation"
    ],
    "vocabulary": [
      "vocab.word_formation.prefix",
      "vocab.word_formation.suffix",
      "vocab.word_formation.root",
      "vocab.word_formation.deceptive_cognate",
      "vocab.word_formation.derive",
      "vocab.word_formation.inflection",
      "vocab.word_formation.compound",
      "vocab.word_formation.false_friend"
    ],
    "listening": [
      "listening.word_formation_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ],
    "reading": [
      "reading.technical_vocabulary"
    ],
    "writing": [
      "writing.technical_vocabulary"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```