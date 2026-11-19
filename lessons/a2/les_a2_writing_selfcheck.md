# Lesson: Writer's Revision Checklist

**Lesson ID:** `les_a2_writing_selfcheck`
**Module:** `mod_a2_skills_rw`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: revisando a descrição de um PR antes de publicar a doc

> **Bianca (backend developer, São Paulo):** "The PR description is ready, but I want to proofread it before I publish the doc."
>
> **Lucas (tech writer, remote):** "Good. Start with the subject. Portuguese often hides it. Does every sentence say who does what?"
>
> **Bianca:** "Mostly. However, two lines have no article, and I used the present tense for a test I ran yesterday."
>
> **Lucas:** "Fix the tense first. Therefore, the reader knows what happened and what is still open."
>
> **Bianca:** "I also wrote *besides* where I needed *therefore*. As a result, the reason sounded like an extra idea."
>
> **Lucas:** "Run the checklist, read the draft aloud, and only then publish. A draft is not a final version."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **however** | no entanto, contudo | Marca contraste; no início da frase, use vírgula depois: *However, the test failed.* |
| **therefore** | portanto, por isso | Introduz uma conclusão lógica; não é sinônimo de "além disso". |
| **besides** | além disso | Acrescenta uma ideia; não use para dar a causa de algo. |
| **in addition** | adicionalmente, além disso | Versão um pouco mais formal de *besides*; também pede vírgula no início. |
| **as a result** | como resultado | Aponta o efeito observável de uma ação anterior. |
| **proofread** | revisar, conferir (lendo para corrigir) | *Proofread* é ler em busca de erros; não confunda com *prove* (provar). |
| **draft** | rascunho | Versão inicial, ainda não publicada. |
| **checklist** | lista de verificação, checklist | Use como substantivo: *run the checklist*. |
| **subject** | sujeito | Em inglês, toda oração finita precisa de um sujeito explícito. |
| **article** | artigo (a / an / the) | Substantivo contável singular raramente aparece sozinho. |
| **tense** | tempo verbal | *Tense consistency* = manter o tempo coerente ao longo do texto. |
| **final version** | versão final | O texto depois da revisão. |

### Tabela de armadilhas do BR-PT (o que a revisão precisa checar)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | O que checar |
|---|---|---|
| "É necessário atualizar o config." → "Is necessary update the config." | "We need to update the config." | Sujeito explícito antes do verbo. |
| "Importante este bug." → "Important this bug." | "This bug is important." | Sujeito + verbo; não basta o adjetivo. |
| "O service drop events." → "The service drop events." | "The service drops events." | Terceira pessoa do singular com *-s*. |
| "Eles was late." → "They was late." | "They were late." | Concordância do verbo *be* no passado. |
| "Eu tenho 3 ticket." → "I have 3 ticket." | "I have three tickets." | Plural nos substantivos contáveis. |
| "Eu anexei log ao ticket." → "I attached log to the ticket." | "I attached the log to the ticket." | Artigo antes de singular contável conhecido. |
| "Eu trabalho aqui desde 2020." → "I work here since 2020." | "I have worked here since 2020." | *Since* pede o tempo composto, não o presente simples. |
| "Ontem eu atualizei o config." → "I update the config yesterday." | "I updated the config yesterday." | *Yesterday* pede o passado simples. |
| "Amanhã eu atualizei o config." → "Tomorrow I updated the config." | "Tomorrow I will update the config." | *Tomorrow* pede futuro com *will*. |
| "Discutimos sobre a correção." → "We discussed about the fix." | "We discussed the fix." | *Discuss* leva objeto direto, sem *about*. |
| "Eu dependo do log." → "I depend of the log." | "I depend on the log." | A preposição correta é *on*. |
| "No entanto, o teste passou, portanto fazemos merge." → "However, the test passed, therefore we merge." | "However, the test passed; therefore, we merged." | Não junte dois conectores com vírgula apenas. |
| "Além disso, o build falhou." (querendo dizer "portanto") → "Besides, the build failed." | "Therefore, the build failed." | Escolha o conector pela relação lógica. |
| "Além disso o cliente ligou." → "In addition the client called." | "In addition, the client called." | Vírgula depois do conector no início. |
| "Eu mais gosto desta versão." → "I more like this version." | "I prefer this version." / "I like this version more." | Advérbio de quantidade depois do verbo ou use *prefer*. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Escolha do conector

Você quer mostrar a consequência lógica de um build que falhou em uma descrição de PR. Qual frase está correta?

| Opção | Frase |
|---|---|
| A | "However, the build failed." |
| B | **"The build failed. Therefore, we stopped the deploy."** |
| C | "Besides, we stopped the deploy." |
| D | "The build failed. In addition, we stopped the deploy." |

**Key:** B
`Therefore` liga a causa ao efeito: o build falhou e, por isso, o deploy foi interrompido. *However* marca contraste (A), enquanto *besides* (C) e *in addition* (D) apenas acrescentam informações.

### Exercício 2 — Correção guiada (sujeito, artigo e tempo)

Revise as três linhas do rascunho:

1. "Is necessary to update the config."
2. "I attached log to the ticket yesterday."
3. "Tomorrow I updated the config."

**Key:** 1) We need to update the config. 2) I attached the log to the ticket yesterday. 3) Tomorrow I will update the config.
Na frase 1, o português oculta o sujeito; em inglês, *We need to* resolve. Na frase 2, *log* é singular contável e conhecido de quem lê o ticket, então recebe *the*. Na frase 3, *Tomorrow* exige futuro com *will*.

### Exercício 3 — Reescrita L1 → L2 com conector

Reescreva as intenções em inglês natural para o seu resumo de revisão:

| Português (intenção) | Resposta esperada |
|---|---|
| "No entanto, faltava o sujeito em duas linhas." | "However, two lines had no subject." |
| "Portanto, corrigi o tempo verbal." | "Therefore, I corrected the tense." |
| "Além disso, anexei o log ao ticket." | "In addition, I attached the log to the ticket." |

**Key:** However, two lines had no subject. / Therefore, I corrected the tense. / In addition, I attached the log to the ticket.
Os três conectores têm funções diferentes: contraste, conclusão e acréscimo. Depois de *However* e *In addition*, use vírgula.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

I proofread the draft before I publish the doc.
The config had an error; therefore, I updated it yesterday.
However, the reviewer asked for one more detail.
Besides the log, I attached the stack trace to the ticket.
As a result, the team closed the incident before the standup.

### Foco articulatório para falantes de pt-BR

- **/h/ em *however* e *happy***: solte ar antes da vogal; não omita o /h/ inicial como acontece em "e-mail" pronunciado à brasileira.
- **/ð/ em *the, this, therefore***: ponta da língua entre os dentes, som voiced; evite trocar por /d/ (*dis*, *derefore*).
- **/v/ em *review, version, final***: dente superior encostado no lábio inferior; não arredonde os lábios como em /w/.
- **/d/ e /t/ em *updated, attached***: a terminação *-ed* soa /d/ depois de som voiced e /t/ depois de som voiceless, sem virar uma sílaba extra.

### Prompt de produção

Escreva uma **nota de revisão** de 4 a 6 frases sobre um texto seu (PR description, doc de deploy ou relatório de incidente). Cumpra todos os requisitos:

1. Use pelo menos **dois conectores** da lista (*however, therefore, besides, in addition, as a result*).
2. Comece cada oração com **sujeito explícito** (*I, we, the service, the reviewer*).
3. Inclua pelo menos um **artigo** (*a, an, the*) e um **plural** corretos.
4. Mantenha **consistência de tempo**: use passado para o que já aconteceu e presente para o que ainda vale.
5. Termine com uma linha de checagem: *Checklist: subject, article, plural, tense, connector.*

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Conector (L1):** Qual opção marca um contraste?
   A) Therefore  B) However  C) As a result  D) In addition
   **Key:** B

2. **Revisão (L1):** Qual frase está pronta para publicar?
   A) "However the log was attached."  B) "We discussed about the fix yesterday."  C) "However, we attached the log yesterday."  D) "Tomorrow we updated the config."
   **Key:** C

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_writing_selfcheck_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_writing_selfcheck",
  "cefr_level": "A2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing"],
  "skill_items": {
    "grammar": [
      "grammar.writing_connectors_contrast",
      "grammar.selfcheck_svo_articles"
    ],
    "vocab": [
      "vocab.selfcheck_connectors",
      "vocab.selfcheck_time_expressions"
    ],
    "listening": [
      "listening.selfcheck_context"
    ],
    "pronunciation": [
      "pronunciation.selfcheck_review_v_w"
    ],
    "reading": [
      "reading.selfcheck_revision_note",
      "reading.selfcheck_connector_function"
    ],
    "writing": [
      "writing.connectors_writing",
      "writing.error_br_writing_15",
      "writing.selfcheck_routine"
    ]
  },
  "prereq_lessons": [
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
    "les_a2_modals_can_need",
    "les_a2_imperatives",
    "les_a2_prepositions_basic",
    "les_a2_travel_vocab_core",
    "les_a2_collocations",
    "les_a2_stress_timing",
    "les_a2_airport",
    "les_a2_hotel_taxi",
    "les_a2_restaurant_shopping",
    "les_a2_reading_strategy",
    "les_a2_writing_svo",
    "les_a2_writing_bio",
    "les_a2_writing_messages",
    "les_a2_writing_past"
  ],
  "estimated_time_min": 15
}
```
