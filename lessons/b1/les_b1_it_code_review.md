# Lesson: Code Review Comments

**Lesson ID:** `les_b1_it_code_review`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US).
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: comentários em um pull request

> **Bianca (reviewer):** "Overall, this refactor looks solid. I have one blocking issue: the input is not validated before the database call, so this must be fixed before merge."
>
> **Thiago (author):** "Good catch. I can add validation and update the tests."
>
> **Bianca:** "Great. I also have a suggestion: this helper could be extracted to improve readability. And a small nitpick: the variable name could be more descriptive."
>
> **Thiago:** "I'll address the blocking issue now, apply the suggestion, and rename the variable. After that, I think it should be ready for approval."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso em TI |
|---|---|---|
| **code review** | revisão de código | Avaliação de mudanças antes do merge. |
| **pull request (PR)** | solicitação de mesclagem | Proposta de alteração em um repositório. |
| **blocking issue** | problema bloqueante | Impede aprovação/merge até ser corrigido. |
| **suggestion** | sugestão | Melhoria recomendada, às vezes não obrigatória. |
| **nitpick** | detalhe menor | Comentário de estilo/clareza, baixo impacto. |
| **LGTM (Looks Good To Me)** | "para mim está ok" | Sinal de aprovação (quando não há bloqueios). |
| **to refactor** | refatorar | Reorganizar código sem mudar comportamento esperado. |
| **edge case** | caso extremo/borda | Situação incomum que pode quebrar a lógica. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "You **must to** fix this." | "You **must fix** this." | Modal (*must/should/could*) é seguido de verbo base, sem *to*. |
| "I **suggest you to** rename this." | "I **suggest renaming** this." / "I **suggest that you rename** this." | *Suggest* não usa *to + infinitivo* diretamente com pessoa. |
| "This is **more easy** to read." | "This is **easier** to read." | Comparativo curto: *easy → easier*. |
| "Do a **revision** of my code." (calco) | "Do a **review** of my code." / "Review my code." | Em PRs o termo padrão é *code review*, não *revision*. |
| Tom direto demais: "This is wrong." | "This **might** cause an issue because…" / "Could we handle this case?" | Modais suavizam feedback e mantêm tom colaborativo. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Classificação de comentários

Classifique cada comentário como **blocking**, **suggestion** ou **nitpick**:

| Comentário | Tipo |
|---|---|
| "This null check is missing and can crash in production." | **blocking** |
| "We could extract this block into a helper for clarity." | **suggestion** |
| "Consider renaming `x` to `retryCount`." | **nitpick** (ou suggestion leve) |

### Exercício 2 — Gramática (modais para feedback)

Complete com **must**, **should** ou **could**:

1. "You ____ add input validation before merging." (obrigatório) → **must**
2. "We ____ add a test for this edge case." (recomendação forte) → **should**
3. "You ____ simplify this condition to improve readability." (opção) → **could**

### Exercício 3 — Reescrita L1 → L2 (tom colaborativo)

| Intenção em pt-BR | Resposta esperada |
|---|---|
| "Isso está errado, arruma." | "This might break when the input is empty. Could you add a check here?" |
| "Sugiro você mudar o nome." | "I suggest renaming this variable for clarity." / "Could we rename this variable?" |
| "Você tem que cobrir esse caso." | "We must cover this edge case before merge." |

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

This change looks good overall, but the missing validation must be fixed before merge. We should add a test to cover this edge case in the payment flow. You could extract this helper function to make the code easier to read. I suggest renaming this variable so its purpose is clearer. Once these points are addressed, the pull request should be ready for approval.

### Foco articulatório para falantes de pt-BR

- **/ʃ/ em *should, suggestion*** e **/tʃ/ em *change***: diferencie os sons ("sh" vs "tch").
- **/v/ em *validation, variable, improve***: evite trocar por /w/.
- **Redução em *could/should*** em fala natural: /kʊd/, /ʃʊd/ (sem vogal cheia).
- **Grupos finais em *fixed, addressed, tests***: evite vogal epentética.

### Prompt de produção (oral ou escrita)

Escreva (ou fale) **4 comentários de code review** para um PR fictício: 1 bloqueante, 1 sugestão, 1 nitpick e 1 mensagem de aprovação condicional. Use pelo menos **três modais** diferentes (*must/should/could*) e justifique cada comentário.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Gramática (L1):** Escolha a opção correta: "You ___ fix this null pointer before merge."  
   A) must to  B) **must**  C) musting  D) to must  
   **Key:** B
   **Chave:** B

2. **Vocabulário (L1):** Um comentário *nitpick* é:  
   A) um bug crítico  B) uma exigência de segurança  C) **um detalhe menor de estilo ou clareza**  D) uma aprovação formal  
   **Key:** C
   **Chave:** C

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_code_review_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_code_review",
  "cefr_level": "B1",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material; no external source text reproduced or adapted.",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.modals_feedback_must_should_could",
      "grammar.suggest_patterns"
    ],
    "vocabulary": [
      "vocab.codereview.blocking_issue",
      "vocab.codereview.suggestion",
      "vocab.codereview.nitpick",
      "vocab.codereview.lgtm",
      "vocab.codereview.edge_case"
    ],
    "listening": [
      "listening.code_review_context"
    ],
    "pronunciation": [
      "pronunciation.sh_ch_contrast",
      "pronunciation.v_sound"
    ],
    "writing": [
      "writing.code_review_comment"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_b1_it_architecture_vocab"
  ],
  "estimated_time_min": 15
}
```
