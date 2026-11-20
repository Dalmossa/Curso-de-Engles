# Lição de 15 Minutos: "E-mail profissional — status, pedido e anexo"

**Lesson ID:** `les_a2_email_basics`
**Module:** `mod_a2_workplace_comm`
**CEFR:** A2
**Reuse basis:** authored_material
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min
**Input de listening:** `rendered_tts_static`
**Target:** Brasileiro, nível A2, perfil desenvolvedor/engenheiro de software
**Princípio ITS:** Input i+1 → Guided Practice → Output Task → Formative Check
**Foco SLA:** Comprehensible Input, Focus on Form, Written Corrective Feedback
**Mastery Gate:** P(mastery) ≥ 0.85 AND CI₉₅ lower bound > 0.70 (por skill)

> **Por que esta lição importa.** O e-mail é a única tarefa do curso em que o engenheiro tem tempo
> para revisar antes de enviar. Por isso os erros de registro se cristalizam: ninguém percebe um
> "Atenciosamente" enviado ao colega de squad, mas o colega americano percebe.
>
> **O ponto central é o par greeting ↔ closing.** A distância social se codifica nas **duas** pontas
> do e-mail. Escolher uma sem a outra produz uma mensagem gramaticalmente correta e socialmente
> torta — o tipo de erro que o aluno não consegue detectar sozinho.

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: status de uma correção no time de plataforma

> **Subject:** Status: login retry shipped; rollout tomorrow
>
> Hi Priya,
>
> The login retry fix is merged and the staging check passed at 14:00. I am still waiting on the flag configuration before the rollout.
>
> Could you check the flag name when you get a chance? I need a decision by 16:00 today.
>
> I'm attaching the staging log — could you confirm the retry count looks right?
>
> Thanks,
> Rafael

**Anatomia — os 4 blocos do e-mail de status:**

| # | Bloco | Trecho do modelo | Função |
|---|-------|------------------|--------|
| 1 | **Subject** | "Status: login retry shipped; rollout tomorrow" | ação + prazo. Não é saudação. |
| 2 | **Context** | "The login retry fix is merged and the staging check passed at 14:00." | fato primeiro; o problema vem depois. |
| 3 | **Ask + attachment** | "Could you check the flag name when you get a chance?" / "I'm attaching the staging log" | um pedido com prazo; um arquivo nomeado. |
| 4 | **Close** | "Thanks," | fecha no mesmo registro do greeting. |

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **Subject:** | Assunto: | O campo se chama *subject*; o conteúdo é a ação, não "Bom dia". |
| **Hi Priya,** | Oi, Priya, | Colega conhecido; combina com *Thanks,* ou *Cheers,*. |
| **Dear Ms. Rao,** | Prezada Sra. Rao, | Contato externo ou primeiro contato; combina com *Best regards,*. |
| **Best regards,** | Atenciosamente, | Closings em inglês nunca são a tradução literal do fecho de carta em pt-BR. |
| **I am writing to confirm…** | Escrevo para confirmar… | Enquadra o motivo do e-mail no presente contínuo; soa natural. |
| **I write to confirm…** | Eu escrevo para confirmar… | Soa hábito ou comunicado formal, não um e-mail comum. |
| **I'm attaching the log.** | Segue em anexo o log. | Forma padrão em e-mail americano; o verbo carrega a ação. |
| **attached** | em anexo | Participio/adjetivo: "The file is attached." Não se usa a palavra portuguesa dentro do inglês. |
| **Could you check…?** | Você poderia conferir…? | Pedido padrão; uma pergunta, com um único softening. |
| **when you get a chance** | quando você puder | Gentileza na subordinada; o prazo fica na principal. |
| **by 16:00 today** | até as 16h de hoje | *By* marca o limite; não troque por *until* num pedido com prazo. |
| **flag configuration** | configuração da feature flag | Termo do dia a dia de engenharia; mantenha *flag* no inglês. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Hi [name]" + "Atenciosamente," | "Hi [name]," + "Thanks," | O par greeting↔closing é lido como uma única afirmação sobre proximidade. |
| "Dear [name]," para colega de squad | "Hi [name]," | *Dear* + primeiro nome cria distância que o time não pratica. |
| "Best regards," depois de "Hey [name]," | "Thanks," / "Cheers," | *Best regards* é o fecho de um registro mais formal; não cola com *Hey*. |
| "I write to confirm the rollout." | "I am writing to confirm the rollout." | Presente simples soa rotina; o presente contínuo enquadra o e-mail que está sendo enviado agora. |
| "Please find attached the log." | "I'm attaching the log." | O calque do "segue em anexo" é entendido, mas não é o padrão de produção americano. |
| "The file is anexo." | "The file is attached." | O adjetivo em inglês é *attached*; a palavra portuguesa não entra na frase. |
| Subject: "Good morning!!!" | Subject: "Status: login retry shipped" | Subject é ação + prazo; saudação e exclamação pertencem ao corpo. |
| Pedido na quinta linha | Pedido na segunda ou terceira linha | Quem lê no celular vê duas linhas antes de truncar. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento do par greeting↔closing

Você trabalha com Priya há quatro meses. Qual par é coerente?

| Opção | Par |
|---|---|
| A | "Dear Priya," … "Atenciosamente," |
| B | "Dear Priya," … "Thanks," |
| C | **"Hi Priya," … "Thanks,"** |
| D | "Hey Priya," … "Best regards," |

**Key:** C
A e D mantêm um fecho de registro formal ou português ao lado de um greeting de colega; B é a armadilha mais traiçoeira, porque as duas linhas são inglês correto, mas a primeira cria uma distância que a segunda desfaz. O registro se escolhe pelo relacionamento e se aplica nas duas pontas.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural:

| Português (intenção) | Resposta esperada |
|---|---|
| "Segue em anexo o log de staging." | "I'm attaching the staging log." |
| "Escrevo para confirmar a janela de rollout." | "I am writing to confirm the rollout window." |
| "Você poderia conferir o nome da flag quando puder?" | "Could you check the flag name when you get a chance?" |
| "Atenciosamente," num e-mail para a Priya | "Thanks," |

**Key:** I'm attaching / I am writing / Could you check … when you get a chance / Thanks
A primeira linha troca o calque por um verbo com o arquivo nomeado; a segunda usa o presente contínuo para enquadrar o e-mail; a terceira mantém o prazo na oração principal e coloca a gentileza na subordinada; a quarta alinha o fecho ao greeting de colega.

### Exercício 3 — Subject line: ação ou tema?

Qual subject line resume a ação e o prazo deste e-mail?

| Opção | Subject line |
|---|---|
| A | "Good morning!" |
| B | **"Status: login retry shipped; decision needed by 16:00"** |
| C | "Meeting" |
| D | "Hello from Rafael" |

**Key:** B
A e D são saudações disfarçadas de subject; C informa o tema, mas não diz o que o leitor precisa fazer. B nomeia o estado da tarefa e o limite de decisão — é o que alguém precisa ver na caixa de entrada sem abrir a mensagem.

### Exercício 4 — Plano de parágrafos

Ordene o plano correto para um e-mail de status de 4 blocos:

| Opção | Plano |
|---|---|
| A | Close → Ask → Subject → Context |
| B | Context → Subject → Close → Ask |
| C | **Subject → Context → Ask + attachment → Close** |
| D | Ask → Close → Context → Subject |

**Key:** C
O subject vem antes do corpo, o contexto dá o fato antes do pedido, o pedido e o anexo ficam juntos porque são a ação solicitada, e o fecho repete o registro do greeting. Os outros planos separam o pedido do arquivo ou enterram a ação.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

I am writing to confirm the rollout window for the login retry fix.
Could you check the flag name when you get a chance today?
I'm attaching the staging log, and the retry count looks right to me.
The subject line says "Status: login retry shipped; rollout tomorrow."
Best regards fits a formal note, but Hi Priya fits this squad.

### Foco articulatório para falantes de pt-BR

- **/ð/ em *the* e *this***: língua entre os dentes, som voiced; não substitua por /d/ nem por /z/.
- **R inicial em *rollout* e *retry***: approximant [ɹ], sem a tap [ɾ] do pt-BR em *arroz*; comece com os lábios levemente arredondados.
- **Estresse em *CONfirm*, *ROLLout*, *STAtus***: a primeira sílaba leva o acento; evite acrescentar uma vogal final ("status-i").
- **-*ing* em *attaching* e *writing***: o /ŋ/ é nasal, sem um /g/ explícito no final.
- **Ritmo do pedido**: *could* fica fraco e *check* leva o acento; a pausa antes de *when you get a chance* marca a gentileza sem apagar o prazo.

### Prompt de produção (oral ou escrita)

Escreva um e-mail de **≤ 120 palavras** para um colega que você conhece há alguns meses. Você terminou uma tarefa, mas precisa de uma decisão até o fim do dia. Inclua: subject com ação e prazo; greeting de colega; contexto em uma frase; um pedido com **Could you…?** e **when you get a chance**; uma linha com **I'm attaching** e o nome do arquivo; fecho no mesmo registro do greeting. Depois leia o subject e o pedido em voz alta, marcando o acento nas palavras de duas sílabas.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Registro (L1):** você escreve para um colega de squad. Qual par está correto?
   A) "Dear Priya," … "Atenciosamente,"
   B) "Dear Priya," … "Thanks,"
   C) **"Hi Priya," … "Thanks,"**
   D) "Hey Priya," … "Best regards,"
   **Key:** C

2. **Anexo (L1):** qual linha é o padrão americano?
   A) "Please find attached the log."
   B) **"I'm attaching the log."**
   C) "Here attached the log."
   D) "I attach to you the log."
   **Key:** B

3. **Gramática (L1):** complete: "___ you check the flag name when you get a chance?"
   A) Should
   B) **Could**
   C) Would to
   D) Must
   **Key:** B

4. **Leitura (L1):** no e-mail do modelo, o que ainda falta antes do rollout?
   A) A checagem de staging.
   B) A correção do login retry.
   C) **A configuração da flag.**
   D) O log de staging.
   **Key:** C

### Autoverificação (30 s)

*"De 1 a 5: quão confiante você se sente para escrever um e-mail de status em inglês amanhã?"* 1–2 → revisar o par greeting↔closing; 3 → revisão em 3 dias; 4–5 → seguir para a próxima lição.

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_a2_email_basics_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_email_basics",
  "cefr_level": "A2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR to en-US); no external source text reproduced or adapted.",
  "estimated_time_min": 15,
  "listening_input": "rendered_tts_static",
  "listening_input_status": "rendered_tts_static - static TTS audio clips rendered for corpus listening and pending practice items",
  "skills_touched": ["grammar", "vocabulary", "reading", "pronunciation", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.email_basics_subject_action",
      "grammar.email_basics_could_request",
      "grammar.email_basics_present_continuous_framing"
    ],
    "vocabulary": [
      "vocab.email_basics_attachment_line",
      "vocab.email_basics_when_softener",
      "coherence.email_basics_register_pair"
    ],
    "reading": [
      "reading.email_basics_status_detail"
    ],
    "pronunciation": [
      "pronunciation.email_basics_word_stress"
    ]
  },
  "prereq_lessons": [
    "les_a2_meeting_participate"
  ],
  "error_predictions_br_pt": [
    "greeting de colega com fecho de carta em português",
    "calque de 'segue em anexo' no lugar de 'I'm attaching'",
    "subject line com saudação em vez de ação e prazo",
    "pedido enterrado abaixo da terceira linha",
    "presente simples em 'I write to confirm' onde o presente contínuo é o padrão"
  ],
  "mastery_gate": {
    "type": "probabilistic",
    "threshold": 0.85,
    "ci_lower_bound": 0.70,
    "required_skills": [
      "coherence.email_basics_register_pair",
      "vocab.email_basics_attachment_line",
      "grammar.email_basics_could_request"
    ]
  }
}
```
