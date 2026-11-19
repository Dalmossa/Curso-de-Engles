# Lesson: Incident Postmortems

**Lesson ID:** `les_b2_it_incident_postmortem`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: uma reunião de postmortem sem blame

> **Marina (incident commander, São Paulo):** "Let's keep this blameless — we're here to understand the system, not to point fingers."
>
> **Rafael (on-call engineer):** "The alert fired at 14:02. I acknowledged it two minutes later and rolled back the deploy at 14:07."
>
> **Priya (service owner):** "The timeline shows the config change had landed at 13:58, four minutes before the error rate climbed."
>
> **Marina:** "So the root cause is the missing timeout in the new config. What made the impact worse?"
>
> **Rafael:** "Two contributing factors — the retry policy amplified the load, and the dashboard didn't show queue depth."
>
> **Priya:** "Mitigation was the rollback; resolution came when we added the timeout at 14:19. Let's agree on three action items with owners and dates."
>
> **Marina:** "Agreed. Follow-up in two weeks — we'll check whether each item actually shipped."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **incident** | incidente | Evento que degradou o serviço; não chame todo bug de *incident* se não houve impacto real. |
| **timeline** | linha do tempo / cronologia | Sequência de eventos com horários; escreva *timeline* junto, sem espaço. |
| **root cause** | causa raiz | A origem que, removida, impede a recorrência; não é o mesmo que *contributing factor*. |
| **contributing factor** | fator contribuinte | Condição que aumentou o impacto, mas não é a causa principal. |
| **detection** | detecção | Como o incidente foi descoberto; *the alert fired* é uma forma natural de dizer. |
| **mitigation** | mitigação | Ação que reduz o impacto agora, como um rollback; nem sempre corrige a origem. |
| **resolution** | resolução | Ação que remove o problema de fato, como adicionar o timeout ausente. |
| **action item** | item de ação | Tarefa com dono **e** prazo; sem esses dois campos não é action item. |
| **follow-up** | acompanhamento | Verificação posterior; como substantivo, escreva com hífen (*a follow-up*). |
| **blameless** | sem culpar | *A blameless postmortem* pergunta o que no sistema falhou, não quem errou. |
| **severity** | severidade | Nível de impacto (*SEV-1* a *SEV-4*); acompanha o título do documento. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "A culpa foi do deploy." → "The deploy was guilty." | "The config change triggered the error rate spike." | Em postmortem blameless, descreva o mecanismo, não atribua culpa a pessoas ou times. |
| "Quem é o responsável pelo erro?" → "Who is to blame for the error?" | "What in the system allowed this error?" | A pergunta muda de caça ao culpado para análise do sistema. |
| "A causa raiz foi falta de timeout." → "The root reason was no timeout." | "The root cause was a missing timeout." | O termo fixo é *root cause*; *root reason* não é colocação natural. |
| "Corrigimos o impacto com um rollback." → "We corrected the impact with a rollback." | "We **mitigated** the impact with a rollback." | *Mitigate* reduz impacto; *resolve* remove a causa. Escolha conforme o momento. |
| "A resolução foi o rollback." → "The resolution was the rollback." | "Mitigation was the rollback; resolution came when we added the timeout." | O rollback restaura o serviço; a correção definitiva remove a origem. |
| ".linha do tempo" → "time line" | "timeline" | Em inglês, *timeline* é uma palavra só. |
| "Item de ação para o time." → "Action item for the team." | "Action item: Priya — add the timeout by Friday." | Action item carrega dono e prazo explícitos. |
| "Vamos fazer follow up." → "We will do a follow up next week." | "We will do a **follow-up** next week." / "We will **follow up** next week." | Substantivo com hífen; verbo separado. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (postura blameless)

Qual linha poderia abrir um postmortem blameless?

| Opção | Frase |
|---|---|
| A | "The engineer who deployed the config should be replaced." |
| B | **"The config change exposed a missing timeout; we'll fix the system."** |
| C | "We need to find who approved the change and punish them." |
| D | "The incident was too small to document." |

**Key:** B — a frase nomeia o mecanismo e a melhoria do sistema; **A** e **C** caçam culpados, e **D** descarta o registro de um evento com impacto real.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural de um postmortem:

| Português (intenção) | Resposta esperada |
|---|---|
| "A política de retry piorou o impacto." | "The retry policy amplified the impact." |
| "Mitigamos em cinco minutos com um rollback." | "We mitigated the impact in five minutes with a rollback." |
| "A causa raiz foi a ausência de timeout na nova config." | "The root cause was a missing timeout in the new config." |
| "Item de ação: Priya adiciona o timeout até sexta." | "Action item: Priya will add the timeout by Friday." |

**Key:** ver tabela — cada linha troca a tradução literal por termos fixos (*root cause*, *mitigate*, *contributing factor*, *action item*), mantendo dono e prazo quando há uma tarefa.

### Exercício 3 — Past perfect e estágios da resposta

Complete com **had landed**, **had not noticed**, **mitigation** ou **resolution**:

1. "By the time the alert fired, the config change ______ at 13:58."
2. "The team ______ the queue depth before the rollback."
3. "The rollback was the ______; adding the timeout was the ______."
4. "Every ______ needs an owner and a due date."

**Key:** 1) had landed; 2) had not noticed; 3) mitigation; resolution; 4) action item — o past perfect marca o que aconteceu **antes** do alerta, e *mitigation* vem antes de *resolution* na cronologia.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
The alert fired at 14:02, and the on-call engineer acknowledged it two minutes later.
The config change had landed before the error rate climbed, which explains the timeline.
The root cause was a missing timeout, and the retry policy was a contributing factor.
We mitigated the impact with a rollback and resolved the issue by adding the timeout at 14:19.
Every action item has an owner and a due date, and we will review the follow-up in two weeks.

### Foco articulatório para falantes de pt-BR

- **/ð/ em *the, the timeline***: som voiced — ponta da língua entre os dentes com vibração; não substitua por /d/.
- **/θ/ em *thirty***: mesmo lugar da língua, sem voz;é o som de durações como *thirty minutes* — não diga "tirty" nem "sirty".
- **/eɪ/ em *mitigation***: vogal longa e deslizante na sílaba *-ga-*, diferente do /e/ fechado do pt-BR.
- **/ʃ/ em *mitigation* e *resolution***: mantenha o som de "sh" até o fim da sílaba; não reduza a /s/.
- **/kt/ em *impact***: grupo consonantal sem vogal inserida; evite "impact-e" (epêntese típica do pt-BR).
- **/t/ final em *alert***: solte o ar sem acrescentar vogal; a marca de passado em *landed* termina em /ɪd/.

### Prompt de produção (oral ou escrita)

Escreva um mini-postmortem (8–12 linhas) para um incidente fictício — por exemplo, erros 500 em `/checkout` por doze minutos. Inclua:

1. um **título** com severidade, serviço e data (*SEV-2 — Checkout API — 19 Nov*);
2. um **summary** de uma frase com o impacto em linguagem blameless;
3. uma **timeline** com pelo menos cinco horários e um uso de **past perfect**;
4. uma **root cause** e dois **contributing factors** distintos;
5. **detection**, **mitigation** e **resolution** em uma frase cada, sem confundir as duas últimas;
6. três **action items** com dono e prazo, mais uma data de **follow-up**;
7. pelo menos seis termos do glossário acima, sem frases como "who is to blame".

Se possível, inclua um detalhe real do seu contexto (fila, deploy, dashboard, ticket).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em um postmortem, *mitigation* é:  
   A) a origem fundamental do problema  B) **a ação que reduziu o impacto enquanto a correção era preparada**  C) a data da revisão  D) a pessoa que assinou a liberação  
   **Key:** B

2. **Gramática (L1):** "By the time the alert fired, the config change ______."  
   A) lands  B) has landed  C) **had landed**  D) landing  
   **Key:** C

3. **Registro (L1):** Qual frase mantém o tom blameless?  
   A) "Ana caused the outage."  B) "Who approved the bad config?"  C) **"The missing timeout let the retry policy amplify the load."**  D) "The deploy guy messed up."  
   **Key:** C

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_it_incident_postmortem_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_incident_postmortem",
  "cefr_level": "B2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.past_perfect_timeline",
      "grammar.tense_consistency"
    ],
    "vocabulary": [
      "vocab.it_incident_postmortem_glossary",
      "vocab.it_incident_reporting"
    ],
    "listening": [
      "listening.postmortem_context"
    ],
    "pronunciation": [
      "pronunciation.postmortem_dental_fricatives"
    ],
    "reading": [
      "reading.blameless_postmortem"
    ],
    "writing": [
      "writing.postmortem_action_items"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_internet_history",
    "les_a2_it_incidents",
    "les_a2_deadlines_tasks",
    "les_a2_it_email_technical",
    "les_b1_tenses_review"
  ],
  "estimated_time_min": 15
}
```
