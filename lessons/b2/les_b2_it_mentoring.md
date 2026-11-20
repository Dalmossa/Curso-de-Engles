# Lesson: Mentoring & Knowledge Transfer

**Lesson ID:** `les_b2_it_mentoring`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US).
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: sessão de mentoria com uma pessoa desenvolvedora júnior

> **Camila (senior engineer):** "Welcome to the team. During your first weeks, you should focus on understanding the service boundaries before changing core logic."
>
> **João (junior engineer):** "I noticed the deployment process is complex. How should I approach it?"
>
> **Camila:** "You could start by shadowing a release, and then we can pair on the next one. I would recommend documenting each step you find unclear, so we can improve our onboarding guide."
>
> **João:** "What if I get stuck while debugging on my own?"
>
> **Camila:** "You might try reproducing the issue locally first, but you should ask for help early if it blocks you. Sharing context clearly helps everyone transfer knowledge faster."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso em TI |
|---|---|---|
| **mentoring** | mentoria | Apoio contínuo ao desenvolvimento de outra pessoa. |
| **knowledge transfer** | transferência de conhecimento | Compartilhar contexto, decisões e práticas do time. |
| **onboarding** | integração de novos membros | Período/processo de entrada no time ou projeto. |
| **shadowing** | acompanhamento observacional | Observar alguém executando uma tarefa para aprender. |
| **pair programming** | programação em par | Duas pessoas trabalhando juntas no mesmo problema/código. |
| **actionable feedback** | feedback acionável | Feedback específico que indica o que fazer a seguir. |
| **to unblock** | destravar/desbloquear | Remover impedimento técnico ou de processo. |
| **growth area** | ponto de desenvolvimento | Habilidade/comportamento a melhorar com prática. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "I **advise you to** read the docs." (tom impositivo) | "I **would recommend** reading the docs." / "You **could** start with the docs." | Modais e formas suaves tornam o conselho colaborativo, não autoritário. |
| "You **should to** ask questions." | "You **should ask** questions." | Modal + verbo base, sem *to*. |
| "Do a **mentoring** with me." (calco verbal) | "**Mentor** me." / "Can we have a **mentoring session**?" | *Mentoring* é processo/gerúndio; como ação use *mentor* ou *session*. |
| "Explain me this service." | "Explain **this service to me**." / "Walk me through this service." | *Explain* não leva pessoa como objeto direto. |
| Feedback vago: "You need to improve." | "You **could** improve test coverage by adding cases for failure paths." | Feedback eficaz é específico e acionável. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Escolha de modal (conselho e recomendação)

Escolha o modal mais adequado: **should**, **could**, **might**, **would recommend**

1. Recomendação educada e explícita: "I ____ reviewing the incident timeline together." → **would recommend**
2. Conselho claro: "You ____ write down the steps before running the migration." → **should**
3. Sugestão opcional: "You ____ try debugging with smaller inputs first." → **could**
4. Possibilidade/estratégia tentativa: "You ____ find useful hints in the service logs." → **might**

### Exercício 2 — Transformação L1 → L2

| Português (intenção) | Resposta esperada |
|---|---|
| "Eu aconselho você ler o guia de onboarding." | "I would recommend reading the onboarding guide." |
| "Você deveria pedir ajuda cedo." | "You should ask for help early." |
| "Você poderia acompanhar o próximo deploy." | "You could shadow the next deployment." |

### Exercício 3 — Tornando o feedback acionável

Reescreva com linguagem específica:

- Vago: "Your PR descriptions need work."  
  **Melhor:** "You could make your PR descriptions clearer by adding the problem, the approach, and the test plan."

- Vago: "Learn the system."  
  **Melhor:** "I would recommend starting with the architecture diagram and then tracing one request end to end."

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

You should start by understanding the system context before making large changes. You could shadow the next release to learn how the deployment process works. I would recommend documenting unclear steps so the whole team can benefit. You might reproduce the issue locally first, but you should ask for help if you get stuck. Clear and actionable feedback can help new engineers grow with confidence.

### Foco articulatório para falantes de pt-BR

- **/ʃ/ em *should, shadow*** e **/dʒ/ em *knowledge, engineers***: atenção aos sons fricativo/africado.
- **Formas reduzidas**: *should/could/would* em fala natural (/ʃʊd/, /kʊd/, /wʊd/).
- **Ligação e ritmo** em *ask for help, start by*: evite pausas excessivas entre palavras funcionais.
- **/θ/ ou /t/ em *growth*?** (aproximação): mantenha o /θ/ final leve sem adicionar vogal.

### Prompt de produção (oral ou escrita)

Simule uma conversa de mentoria (2–3 minutos). Dê **3 recomendações** a uma pessoa júnior sobre como aprender um serviço novo: inclua uma ação inicial, uma estratégia de prática (shadowing/pairing) e uma orientação sobre pedir ajuda. Use **should, could, might** e **would recommend**.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Gramática (L1):** Qual opção expressa recomendação educada?  
   A) "You must reading this."  B) **"I would recommend reading this guide."**  C) "You should to read this."  D) "Read this now."  
   **Key:** B
   **Chave:** B

2. **Vocabulário/pragmática (L1):** Feedback mais acionável:  
   A) "Improve your code."  B) "Be better next time."  C) **"You could add tests for the failure path to make this change safer."**  D) "This is not good."  
   **Key:** C
   **Chave:** C

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_b2_it_mentoring_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_mentoring",
  "cefr_level": "B2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material; no external source text reproduced or adapted.",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking", "writing"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.modals_advice_should_could_might",
      "grammar.recommendation_would_recommend"
    ],
    "vocabulary": [
      "vocab.mentoring.mentoring",
      "vocab.mentoring.knowledge_transfer",
      "vocab.mentoring.onboarding",
      "vocab.mentoring.shadowing",
      "vocab.mentoring.actionable_feedback"
    ],
    "listening": [
      "listening.mentoring_context"
    ],
    "pronunciation": [
      "pronunciation.modal_reduction",
      "pronunciation.sh_dzh_contrast"
    ],
    "speaking": [
      "speaking.mentoring_conversation"
    ]
  },
  "prereq_lessons": [
    "les_b1_it_code_review",
    "les_b2_professional_argument"
  ],
  "estimated_time_min": 15
}
```
