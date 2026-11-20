# Lesson: Technical Emails & Documentation

**Lesson ID:** `les_a2_it_email_technical`
**Module:** `mod_a2_it_communication`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: status update e escalonamento de um incidente de pagamento

> **Bruna (backend developer, São Paulo):** "Let's start with the subject line: `[PAY-218] Payment timeout — ETA and blocker`."
>
> **Diego (tech lead, Lisbon):** "Good. Keep the TL;DR to one line: the `/payments` endpoint times out in thirty seconds."
>
> **Bruna:** "Root cause is a missing index on `user_id`. I'm attaching the query plan so the team can check it."
>
> **Diego:** "Who owns the action item, and when?"
>
> **Bruna:** "I do. ETA is 16:00. If the fix misses the window, I'll escalate to the platform team."
>
> **Diego:** "Mark it FYI for the product owner, and ask for confirmation in words — not just an emoji."
>
> **Bruna:** "Understood. I'll send the update right after this call."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **subject line** | linha de assunto | Em e-mail técnico, traz o ID do ticket e a ação: não é saudação. |
| **TL;DR** | resumo em uma linha | Vem no topo; leia como *too long; didn't read*. |
| **blocker** | bloqueio | Impedimento concreto; diga o que trava e quem resolve. |
| **action item** | item de ação | Tarefa com dono e prazo; sem dono não é action item. |
| **ETA** | previsão de entrega | *Estimated Time of Arrival*; em TI, significa "quando a correção chega". |
| **escalate to** | escalar para | Use *escalate to the platform team*; *escalonar* não existe em inglês. |
| **FYI** | para seu conhecimento | *For Your Information*: informa, sem pedir ação. |
| **I'm attaching...** | estou anexando... | Padrão do e-mail americano; evite *Please find attached*. |
| **Please confirm receipt.** | Por favor, confirme o recebimento. | *Confirm* recebe a coisa confirmada, não a pessoa. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Assunto: Reunião." → "Subject: Meeting." | "Subject: [PAY-218] Payment timeout — ETA and blocker." | O subject resume a **ação** e o ticket; quem abre no celular decide ali se lê. |
| "Segue em anexo." → "Please find attached the log." | "I'm attaching the query plan — please check the index." | *Please find attached* é anglicismo formal; o padrão americano é *I'm attaching* + o que fazer com o arquivo. |
| "Previsão de entrega" → "delivery forecast" (para uma correção) | "ETA" | *Delivery forecast* soa como logística; em engenharia usa-se *ETA*. |
| "Item de ação para o time." → "Action item for the team." | "Action item: Bruna — add the index by 16:00." | Action item carrega dono **e** prazo; "para o time" não define responsável. |
| "Vou escalar o time." → "I will escalate the team." | "I'll escalate to the platform team." | *Escalate* é intransitivo aqui: vai **para** alguém, com *to*. |
| "Favor me confirmar." → "Please confirm me." | "Please confirm receipt." | *Confirm* pede o conteúdo confirmado (*receipt*, *the ETA*), não a pessoa. |
| "Atenciosamente," → "Attentiously," | "Thanks," / "Best regards," | *Attentiously* não existe; escolha o sign-off no mesmo registro do *Hi*. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (subject line de status update)

Qual subject line comunica ação, ticket e urgência sem soar como saudação?

| Opção | Subject line |
|---|---|
| A | "Good morning, team!!!" |
| B | **"[PAY-218] Payment timeout — action needed by 16:00"** |
| C | "About the payment problem we discussed" |
| D | "Status" |

**Key:** B — o padrão técnico é `[ID] problema — ação/prazo`; em **A** a linha é uma saudação com pontuação de chat, em **C** o assunto é vago e em **D** não há informação acionável.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural de um status update:

| Português (intenção) | Resposta esperada |
|---|---|
| "Temos um bloqueio: o endpoint expira em 30 segundos." | "We have a blocker: the endpoint times out in thirty seconds." |
| "Estou anexando o plano de consulta — verifiquem o índice." | "I'm attaching the query plan — please check the index." |
| "Item de ação: Bruna adiciona o índice até 16:00." | "Action item: Bruna will add the index by 16:00." |
| "Se perdermos a janela, escalo para a plataforma." | "If we miss the window, I'll escalate to the platform team." |

**Key:** ver tabela — em cada linha, o inglês troca a tradução literal por uma expressão fixa de e-mail técnico (*blocker*, *I'm attaching*, *action item*, *escalate to*), mantendo dono e prazo explícitos.

### Exercício 3 — Complete o status update

Preencha com **ETA**, **blocker**, **I'm attaching**, **escalate to** ou **Please confirm receipt**:

1. "The missing index is the ______ for tomorrow's release."
2. "______ the query plan — check the `user_id` filter."
3. "The fix is delayed; can you send a new ______?"
4. "If the window closes, I'll ______ the platform team."
5. "______ so we know the update reached everyone."

**Key:** 1) blocker; 2) I'm attaching; 3) ETA; 4) escalate to; 5) Please confirm receipt — note que *escalate* pede *to* antes do time e que *ETA* responde a "quando?", enquanto *FYI* apenas informa.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
The subject line is "[PAY-218] Payment timeout — action needed."
TL;DR: The payments endpoint times out in thirty seconds and blocks the release.
I'm attaching the query plan; please check the missing index.
Action item: Bruna will add the index by 16:00.
If the fix misses the window, I'll escalate to the platform team and send a new ETA.

### Foco articulatório para falantes de pt-BR

- **/θ/ em *thirty***: ponta da língua entre os dentes, sem voz; não diga "tirty" nem "sirty".
- **/ð/ em *the, the release***: o mesmo lugar, mas com voz; distinga de /θ/ em *thirty*.
- **/iː/ em *ETA, team, release***: vogal longa e tensa; não acrescente uma vogal extra no fim da sigla.
- **/eɪ/ na última letra de *ETA***: deslize de /e/ para /ɪ/; não pronuncie como "eta" do português.
- **/aɪ/ em *FYI***: cada letra é uma sílaba — /ef waɪ aɪ/; evite ler como uma palavra só.
- **/w/ em *window***: lábios arredondados e soltos, sem encostar o dente no lábio como em /v/.
- **/k/ final em *check***: solte o ar sem inserir "e" (*check-e*); o pt-BR tende a epêntese final.

### Prompt de produção (oral ou escrita)

Você precisa enviar um status update ao time de plataforma sobre um deploy que falhou no estágio de `lint`. Escreva um e-mail curto (ou diga as mesmas informações em voz alta) com:

1. um **subject line** com ID de ticket e ação;
2. um **TL;DR** de uma linha com o problema;
3. um **blocker** e um **ETA** explícitos;
4. um **action item** com dono e prazo;
5. uma linha de anexo com **I'm attaching** e o que o leitor deve fazer com o arquivo;
6. uma condição de **escalonamento** (*escalate to...*) e um **FYI** para quem só precisa saber;
7. um sign-off coerente com o greeting (**Thanks,** ou **Best regards,**) — sem "Attentiously".

Inclua um detalhe real do seu contexto (ticket, deploy, log, fila, incidente).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** No e-mail abaixo, "ETA" significa: "The index fix is delayed — please send an ETA."  
   A) o arquivo anexo  B) **a previsão de quando a correção chega**  C) o responsável pela tarefa  D) o resumo de uma linha  
   **Key:** B — *ETA* responde "quando?"; o arquivo é o *attachment*, o responsável é o *owner*, e o resumo é o *TL;DR*.

2. **Gramática (L1):** Qual linha apresenta o anexo no padrão de e-mail americano?  
   A) "Please find attached the query plan."  B) "Enclosed is the query plan."  C) **"I'm attaching the query plan."**  D) "I attach you the query plan."  
   **Key:** C — *I'm attaching* é a forma neutra e corrente; *please find attached* e *enclosed* soam como carta, e *attach you* inverte os argumentos do verbo.

3. **Registro (L1):** Você escreve para uma colega que conhece bem. Qual par está coerente?  
   A) "Dear Ana," … "Attentiously,"  B) "Dear Ana," … "Best regards,"  C) **"Hi Ana," … "Thanks,"**  D) "Hey Ana," … "Attentiously,"  
   **Key:** C — greeting e closing precisam estar no mesmo registro; *Attentiously* não existe em en-US.

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_a2_it_email_technical_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_email_technical",
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
      "grammar.status_update_imperative",
      "grammar.email_requests"
    ],
    "vocabulary": [
      "vocab.email_tech_status",
      "vocab.email_tech_action_item",
      "vocab.email_tech_attachment",
      "vocab.email_tech_register",
      "vocab.email_vocab_signoff"
    ],
    "listening": [
      "listening.email_tech_context"
    ],
    "pronunciation": [
      "pronunciation.email_tech_acronyms"
    ],
    "reading": [
      "reading.tech_email_status",
      "reading.tech_email_escalation"
    ],
    "writing": [
      "writing.technical_email_status"
    ]
  },
  "prereq_lessons": [
    "les_a2_email_basics",
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```
