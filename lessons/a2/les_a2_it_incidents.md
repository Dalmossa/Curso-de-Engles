# Lesson: Incident Reports & Problem Statements

**Lesson ID:** `les_a2_it_incidents`
**Module:** `mod_a2_it_communication`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: um SEV-2 no plantão de checkout

> **Rafa (on-call engineer, São Paulo):** "SEV-2 at 14:02 — the checkout API is returning 504s."
>
> **Bia (incident commander, Recife):** "What's the impact? How many users are blocked?"
>
> **Rafa:** "About twenty percent of checkouts. The status page is updated and the escalation to payments is done."
>
> **Bia:** "Good. What mitigation did you apply?"
>
> **Rafa:** "I rolled back deploy 3.8.1 to 3.8.0. Errors are down, but the root cause is still under investigation."
>
> **Bia:** "Keep the timeline short: detection, mitigation, current status. Who writes the postmortem?"
>
> **Rafa:** "I do. Blameless, with three action items and one owner for each."
>
> **Bia:** "Then post the update in #incidents and ping me when the service is stable for fifteen minutes."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **outage** | indisponibilidade | Use para o serviço fora do ar; um endpoint lento não é um *outage*. |
| **severity** | severidade | Diga *a SEV-2 incident*; evite *severity level two* no canal de incidentes. |
| **impact** | impacto | Quantifique: *twenty percent of checkouts are failing* soa melhor que *many users*. |
| **timeline** | linha do tempo | No relatório: *detection → mitigation → resolution*, sempre com horários. |
| **mitigation** | mitigação | Ação temporária que reduz o impacto; não é a correção definitiva. |
| **root cause** | causa raiz | Se ainda não souber, escreva *root cause: under investigation*. |
| **status page** | página de status | O verbo é *update*: *we updated the status page*. |
| **escalation** | escalonamento | O verbo pede *to*: *escalate to the payments team*. |
| **on-call** | de plantão | Com hífen antes do substantivo: *the on-call engineer*. |
| **blameless** | sem culpa | *A blameless postmortem* foca no sistema, não em quem apertou o botão. |
| **action item** | item de ação | Tarefa com dono e prazo; sem dono, não é *action item*. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Estamos com outage." → "We are outage." | "We have an outage." / "We are in an outage." | *Outage* é substantivo; o estado se expressa com *have* ou *in an*. |
| "Severidade nível 2." → "severity level 2 incident" | "a SEV-2 incident" | Em resposta a incidentes, o rótulo curto *SEV-2* é o padrão. |
| "Impacto: muitos usuários." → "Impact: many users." | "Impact: twenty percent of checkouts are failing." | Um número e uma função afetada tornam o impacto verificável. |
| "Fizemos a mitigação." → "We did a mitigation." | "We applied a mitigation: we rolled back the deploy." | *Apply a mitigation* + a ação concreta soa como relatório técnico. |
| "Causa raiz: em investigação." → "root cause: in investigation" | "Root cause: under investigation." | A expressão fixa é *under investigation*. |
| "Escalei o time de pagamentos." → "I escalated the payments team." | "I escalated to the payments team." | *Escalate* pede *to* antes do destino do escalonamento. |
| "Postmortem sem culpa." → "no-blame postmortem" | "a blameless postmortem" | *Blameless* é o termo corrente em engenharia de confiabilidade. |
| "Estou em call." → "I am in call." | "I am on-call." | *On-call* descreve o plantão; *on a call* descreve a chamada em andamento. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (atualização de incidente)

Qual linha comunica severidade, impacto e ação sem soar como tradução literal?

| Opção | Atualização |
|---|---|
| A | "We are outage and many users." |
| B | **"SEV-2: twenty percent of checkouts are failing; we rolled back the deploy."** |
| C | "We are in call and doing mitigation now." |
| D | "The root cause is in investigation." |

**Key:** B — traz rótulo de severidade, impacto quantificado e ação em *past simple*; **A** erra *outage*, **C** usa *in call* e **D** troca *under* por *in*.

### Exercício 2 — Complete o relatório

Preencha com `outage`, `severity`, `timeline`, `mitigation`, `status page`, `escalation`, `root cause`, `action item`:

1. "The ______ starts at 14:02: the checkout API returns 504s."
2. "The ______ is SEV-2, so the incident commander joins."
3. "Keep the ______ short: detection at 14:02, rollback at 14:09."
4. "The ______ was the rollback to 3.8.0 — errors went down."
5. "We updated the ______ and completed the ______ to payments."
6. "The ______ is under investigation; the ______ is Rafa — add a rollback check by Friday."

**Key:** 1) outage; 2) severity; 3) timeline; 4) mitigation; 5) status page, escalation; 6) root cause, action item — note que *mitigation* é a ação temporária, enquanto *root cause* só aparece quando a origem é conhecida; *action item* exige dono e prazo.

### Exercício 3 — Transformação L1 → L2

Reescreva as notas do plantão em inglês natural de um relatório de incidente:

| Português (intenção) | Resposta esperada |
|---|---|
| "Detector às 14:02; SEV-2." | "Detection at 14:02: a SEV-2 incident." |
| "Impacto: 20% dos checkouts falharam." | "Impact: twenty percent of checkouts failed." |
| "Mitigação: fizemos rollback para 3.8.0 às 14:09." | "Mitigation: we rolled back to 3.8.0 at 14:09." |
| "Atualizamos a página de status e escalamos para pagamentos." | "We updated the status page and escalated to payments." |
| "Causa raiz em investigação; postmortem sem culpa na sexta." | "Root cause: under investigation. Blameless postmortem on Friday." |

**Key:** ver tabela — o relatório usa rótulos curtos (*SEV-2*, *Impact*, *Mitigation*, *Root cause*), verbos no *past simple* para a linha do tempo e *under investigation* para a causa ainda desconhecida.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
At 14:02, the on-call engineer declared a SEV-2 incident.
Impact: twenty percent of checkouts were failing.
We rolled back the deploy as mitigation and updated the status page.
The root cause is under investigation, so the timeline stays short.
The blameless postmortem has three action items with one owner for each.

### Foco articulatório para falantes de pt-BR

- **/aʊ/ em *outage***: comece em /a/ e deslize para /ʊ/; não reduza a um /o/ puro do pt-BR.
- **/iː/ em *SEV***: a letra *E* é longa e tensa — /es iː viː/; não leia como uma palavra só.
- **/eɪ/ em *page***: deslize de /e/ para /ɪ/; evite *pague* com vogal final do português.
- **/dʒ/ final em *page* e *outage***: som de *j* em *judge*, sem inserir uma vogal extra depois.
- **/aɪ/ em *timeline***: duas ocorrências — /ˈtaɪmlaɪn/; marque as duas, sem encurtar a segunda.
- **/æ/ em *action***: boca aberta como em *cat*, não /e/ de *teste*.
- **/t/ final em *percent***: solte o ar sem acrescentar *-e* (*percent-e*).

### Prompt de produção (oral ou escrita)

Você é o on-call e precisa publicar uma atualização curta no canal `#incidents` sobre um incidente no serviço de checkout. Escreva (ou diga em voz alta) um parágrafo com:

1. um rótulo de severidade no formato **SEV-1**, **SEV-2** ou **SEV-3**;
2. uma frase de **impacto** com número e função afetada;
3. uma **mitigação** no *past simple* (o que você fez);
4. menção à **status page** e à **escalation**;
5. o **status atual**: *investigating*, *monitoring* ou *resolved*;
6. a **root cause** ou *under investigation*;
7. um **action item** de *blameless postmortem* com dono e prazo.

Inclua um detalhe real do seu contexto: nome do serviço, horário, deploy ou time acionado.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em "The blameless postmortem focuses on the system, not the person", *blameless* significa:
   A) sem relatório  B) **sem culpar pessoas, focando no sistema**  C) sem action items  D) sem escalonamento  
   **Key:** B — *blameless* descreve a análise, não a ausência de documento, tarefas ou comunicação.

2. **Gramática (L1):** Qual linha registra corretamente um evento da linha do tempo?
   A) **"The alert fired at 14:02."**  B) "The alert fires at 14:02."  C) "The alert is fire at 14:02."  D) "The alert will firing at 14:02."  
   **Key:** A — eventos concluídos em relatório pedem *past simple*; **B** é presente, **C** e **D** quebram a estrutura verbal.

3. **Leitura (L1):** "Root cause: under investigation" quer dizer que:
   A) a correção já foi aplicada  B) o impacto foi zero  C) **a causa ainda está sendo investigada**  D) o postmortem foi cancelado  
   **Key:** C — a expressão fixa marca causa desconhecida; correção aplicada seria *resolved*, e impacto zero não seria incidente.

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_a2_it_incidents_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_incidents",
  "cefr_level": "A2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "rendered_tts_static",
  "listening_input_status": "rendered_tts_static - static TTS audio clips rendered for corpus listening and pending practice items",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.past_simple_timeline",
      "grammar.compound_head_agreement"
    ],
    "vocabulary": [
      "vocab.it_internet_terms",
      "vocab.incident_outage",
      "vocab.incident_severity",
      "vocab.incident_impact",
      "vocab.incident_timeline",
      "vocab.incident_mitigation",
      "vocab.incident_root_cause",
      "vocab.incident_status_page",
      "vocab.incident_escalation",
      "vocab.incident_on_call",
      "vocab.incident_blameless_postmortem",
      "vocab.incident_action_item",
      "vocab.buying_time_phrases"
    ],
    "listening": [
      "listening.incident_context"
    ],
    "pronunciation": [
      "pronunciation.incident_acronyms"
    ],
    "reading": [
      "reading.incident_report_timeline",
      "reading.incident_status_update"
    ],
    "writing": [
      "writing.incident_summary"
    ]
  },
  "prereq_lessons": [
    "les_a2_ask_for_help",
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```
