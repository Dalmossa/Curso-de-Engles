# Lesson: Imperatives: Instructions & Procedures

**Lesson ID:** `les_a2_imperatives`
**Module:** `mod_a2_workplace_tasks`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: passando o runbook de rollback durante um incidente

> **Ana (platform engineer, São Paulo):** "Bruno, the checkout deploy failed the health check. Open the runbook and follow the rollback steps."
>
> **Bruno (backend developer, Recife):** "I'm on the incident page now. What do I do first?"
>
> **Ana:** "First, check the last green release in the dashboard. Don't roll back past release 218."
>
> **Ana:** "Then copy the release tag, paste it into the deploy form and click 'Rollback'."
>
> **Bruno:** "Got it. Do I tell the client now?"
>
> **Ana:** "No. Wait for the health check, then post the status in the incident channel. Don't close the ticket before the login test passes."
>
> **Bruno:** "OK. I'll read every step back to you before I run it."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **Open the runbook.** | Abra o runbook. | Imperativo afirmativo: verbo base, sem sujeito e sem *to*. |
| **Don't roll back.** | Não reverta. | Imperativo negativo: **don't** + verbo base; não use *to* depois de *don't*. |
| **Check the dashboard.** | Confira o painel. | *Check* soa natural para verificar um estado; *verify* é mais formal. |
| **Click 'Rollback'.** | Clique em "Rollback". | Em interfaces, *click* leva o rótulo do botão entre aspas. |
| **Copy the tag and paste it.** | Copie a tag e cole. | Sequência de duas ações no mesmo imperativo, ligada por *and*. |
| **Wait for the health check.** | Aguarde o health check. | *Wait* pede algo com **for**; *wait the check* não existe. |
| **Make sure the test passes.** | Certifique-se de que o teste passa. | **Make sure** + oração é a forma corrente em runbooks. |
| **Be careful.** | Tenha cuidado. | O imperativo de *be* é **be**, não *have*. |
| **First / Then / Finally** | Primeiro / Depois / Por fim | Marcadores de sequência tornam o procedimento previsível. |
| **step** | etapa (de um procedimento) | Conte as etapas: *step 1, step 2* em documentação de deploy. |
| **runbook** | runbook (roteiro operacional) | Termo técnico em inglês; mantenha-o ao escrever com o time. |
| **roll back** | reverter (uma release) | *Roll back* é a ação; *rollback* é o substantivo ou o rótulo do botão. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "You have to click 'Rollback'." para descrever uma etapa | "**Click** 'Rollback'." | *Have to* exprime obrigação ("é necessário"), não o passo em si; num runbook, a ação vai no imperativo. |
| "**To open** the runbook, please." | "**Open** the runbook, please." | O infinitivo *to open* responde a "para quê?", não dá a instrução; o imperativo usa o verbo base. |
| "You **opens** the dashboard." | "**Open** the dashboard." | O imperativo não tem sujeito e não leva a marca de 3ª pessoa; *-s* só aparece em *he/she opens*. |
| "**Don't to touch** the button." / "**Not touch** the button." | "**Don't touch** the button." | A negativa é **don't** + verbo base: não há *to* depois de *don't*, e o sujeito fica implícito. |
| "**Have careful** with the deploy." | "**Be careful** with the deploy." | "Tenha cuidado" usa o imperativo de *be*; *have* não combina com o adjetivo *careful*. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (qual é o passo do runbook?)

Um colega dita o próximo passo de um rollback. Qual frase é um imperativo correto?

| Opção | Frase |
|---|---|
| A | "To check the health check, please." |
| B | "Checks the health check now." |
| C | "Checking the health check now." |
| D | **"Check the health check now."** |

**Key:** D
O imperativo afirmativo começa no verbo base: **check**, sem *to*, sem sujeito e sem *-ing*. As opções A, B e C são, respectivamente, infinitivo, 3ª pessoa e gerúndio.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções do runbook em inglês natural:

| Português (intenção) | Resposta esperada |
|---|---|
| "Abra o runbook e confira a release." | "Open the runbook and check the release." |
| "Não reverta para antes da release 218." | "Don't roll back past release 218." |
| "Aguarde o health check." | "Wait for the health check." |
| "Certifique-se de que o teste de login passa." | "Make sure the login test passes." |
| "Tenha cuidado com o botão de rollback." | "Be careful with the rollback button." |

**Key:** Open / Don't roll back / Wait for / Make sure / Be careful
Cada linha começa no verbo base. Na negativa, **don't** vem antes do verbo; em *wait for*, a preposição é obrigatória; *make sure* e *be* são as formas naturais para "certifique-se" e "tenha".

### Exercício 3 — Contraste de forma: base, to, -s, -ing

Complete cada lacuna com a forma adequada do verbo entre parênteses — lembre-se de que um passo de procedimento vai no imperativo:

1. "______ (restart) the worker after the deploy." → **Restart**
2. "______ (not / delete) the failed job yet." → **Don't delete**
3. "The worker ______ (restart) automatically at 3 a.m." → **restarts**
4. "The engineer ______ (paste) the tag into the form." → **pastes**

**Key:** 1) Restart; 2) Don't delete; 3) restarts; 4) pastes.
Nos passos 1 e 2, a ordem é imperativa (verbo base; negativa com **don't**). Nos passos 3 e 4 há sujeito explícito (*the worker*, *the engineer*), então a frase é present simple e o verbo leva **-s** na 3ª pessoa.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

Open the runbook and check the last green release in the dashboard.
Don't roll back past release 218.
Copy the release tag and paste it into the deploy form.
First, wait for the health check, then post the status in the incident channel.
Finally, make sure the login test passes before you close the ticket.

### Foco articulatório para falantes de pt-BR

- **/k/ final em *check***: feche o final da palavra com uma parada em /k/; não acrescente vogal ("check-i") nem troque por /ʒ/ como em "cheque".
- **Encontro /st/ em *paste, first***: língua na ponta /t/ colada ao /s/; evite a epêntese do pt-BR ("pásti", "firts-ti").
- **/h/ em *health***: solte ar antes da vogal; em carioca o /h/ some e a palavra vira "ealth" — recupere a aspiração.
- **/ð/ em *the, then***: ponta da língua entre os dentes com voz; não substitua por /d/ ("de", "den").
- **/t/ final em *don't***: bico leve em /t/ sem sílaba extra; *don't* é um tempo só, e o verbo que vem depois fica fraco.

### Prompt de produção (oral ou escrita)

Escreva ou diga um mini-runbook para uma tarefa do seu dia a dia de tecnologia (reiniciar um worker, redefinir uma senha, resolver um deploy travado). Seu texto deve: ter **5 a 6 falas ou passos**; começar com pelo menos **três imperativos afirmativos** (verbo base, sem sujeito); incluir **um imperativo negativo** com *don't*; usar **first / then / finally** para marcar a sequência; trazer **uma verificação com "Make sure..."**; e citar um detalhe real do seu contexto (release, incidente, fila, ticket). Depois leia em voz alta mantendo o imperativo com ênfase no verbo.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Gramática (L1):** Qual frase dá corretamente a instrução de reiniciar o serviço?  
   A) "To restart the service."  B) "Restarts the service."  C) **"Restart the service."**  D) "Restarting the service."  
   **Key:** C
   O passo vai no verbo base, sem *to*, sem sujeito e sem marca de 3ª pessoa.

2. **Gramática (L1):** Em "Don't close the ticket before the login test passes", o que **don't** faz?  
   A) Transforma a frase em uma pergunta.  B) **Proíbe a ação de fechar o ticket.**  C) Indica uma ação no passado.  D) Substitui o sujeito da frase.  
   **Key:** B
   *Don't* + verbo base é o imperativo negativo: uma proibição, não uma pergunta nem um tempo passado.

3. **Vocabulário (L1):** O que significa "Make sure the login test passes"?  
   A) "Pule o teste de login."  B) "Anote o teste de login."  C) **"Certifique-se de que o teste de login passa."**  D) "Repita o teste de login agora."  
   **Key:** C
   *Make sure* + oração corresponde a "certifique-se de que"; o runbook pede uma verificação, não uma repetição imediata.

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_a2_imperatives_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_imperatives",
  "cefr_level": "A2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "rendered_tts_static",
  "listening_input_status": "rendered_tts_static - static TTS audio clips rendered for corpus listening and pending practice items",
  "skills_touched": ["grammar", "vocabulary", "listening", "reading", "pronunciation", "speaking"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.imperatives_base_form",
      "grammar.present_simple_regular"
    ],
    "vocabulary": [
      "vocab.imperatives_procedure_verbs",
      "vocab.email_verbs"
    ],
    "listening": [
      "listening.imperatives_context"
    ],
    "reading": [
      "reading.imperatives_runbook",
      "reading.imperatives_sequence"
    ],
    "pronunciation": [
      "pronunciation.imperatives_final_stop"
    ],
    "speaking": [
      "speaking.imperatives_runbook_roleplay"
    ]
  },
  "prereq_lessons": [
    "les_a1_present_simple",
    "les_a1_have_has",
    "les_a2_greetings_intro",
    "les_a2_small_talk",
    "les_a2_introducing_others",
    "les_a2_meeting_open",
    "les_a2_meeting_participate",
    "les_a2_email_basics",
    "les_a2_phone_calls",
    "les_a2_ask_for_help",
    "les_a2_deadlines_tasks",
    "les_a2_feedback_praise",
    "les_a2_corporate_wrapup",
    "les_a2_corpus_intro",
    "les_a2_past_narrative",
    "les_a2_future_will",
    "les_a2_present_continuous",
    "les_a2_modals_can_need"
  ],
  "estimated_time_min": 15
}
```
