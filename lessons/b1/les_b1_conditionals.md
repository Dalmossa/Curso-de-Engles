# Lesson: Conditionals 1 & 2

**Lesson ID:** `les_b1_conditionals`
**Module:** `mod_b1_grammar_consolidate`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: plano de contingência e hipóteses antes do deploy

> **Rafael (tech lead, São Paulo):** "Let's plan the release contingency before we freeze the branch. If the migration finishes before 16:00, we'll deploy tonight."
>
> **Luiza (backend developer, Recife):** "And if it slips? What's the fallback?"
>
> **Rafael:** "If the migration runs past 16:00, we'll roll back and keep the old schema. Unless the data check fails, we won't page the on-call."
>
> **Tomás (QA engineer, remote):** "I'd feel safer with a staging replica. If we had one, we could test the rollback end to end."
>
> **Luiza:** "We don't have one yet. If we had it, I would run the data check twice before the deploy."
>
> **Rafael:** "Take the runbook in case the on-call needs the rollback steps. As long as we log each step, the handover stays easy."
>
> **Tomás:** "Agreed. If we don't log it, the next person repeats our mistakes — and I don't want that."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **if clause** | oração com *if* | Traz a condição. Vem primeiro com vírgula ou depois sem vírgula: *If it fails, we roll back / We roll back if it fails*. |
| **result clause** | oração resultado | Fica com *will / would / could*; nunca coloque esse auxiliar dentro da cláusula *if*. |
| **first conditional** | primeiro condicional | *If + presente, will + base* — plano real e possível: *If the check passes, we'll deploy*. |
| **second conditional** | segundo condicional | *If + passado, would/could + base* — hipótese ou cenário improvável agora: *If we had a replica, we could test it*. |
| **unless** | a menos que | Já significa *if not*. Não diga *unless ... not*: isso cria dupla negação. |
| **if not** | se não | Negação explícita com oração completa: *If we don't log it, ...*. Não substitua *unless* por *if not* sem ajustar o verbo. |
| **as long as** | desde que / contanto que | Condição necessária. *Since* significa "desde que" no tempo ou "já que" na causa — não serve aqui. |
| **in case** | no caso de / para o caso de | Precaução: *in case + presente simples*. Para substantivo, use *in case of*: *in case of failure*. |
| **to roll back / rollback** | reverter / rollback | *Roll back* é o verbo (*we'll roll back*); *rollback* é o substantivo (*the rollback steps*). |
| **fallback** | plano B / alternativa | Já implica um plano; *fallback plan* é aceitável, mas *fallback* sozinho é mais natural em conversa de deploy. |
| **on-call** | plantão / quem está de plantão | *The on-call engineer*; *page the on-call* é acionar o plantão. |
| **hedging** | cautela linguística | *I'd feel safer*, *I would*, *we could* atenuam uma opinião — discordância profissional sem soar categórica. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Se chover, eu fico em casa." → "If it **will rain**, I stay home." | "If it **rains**, I'll stay home." | No *first conditional*, o presente vai depois do *if*; o futuro fica na oração resultado. |
| "Se eu tivesse tempo, eu iria." → "If I **would have** time, I **would go**." | "If I **had** time, I **would go**." | *Would* nunca entra na cláusula *if* do segundo condicional; o passado hipotético faz esse papel. |
| "Se eu fosse você..." → "If I **was** you..." | "If I **were** you, I'd move the deploy." | Em hipótese contrária à realidade, o B1 alvo usa *were* para todos os sujeitos. |
| "Eu iria / eu poderia" → "I would to go" / "I could to test" | "I'd go" / "we **could test** it" | Depois de *would / could / should*, vem o verbo base, sem *to*. |
| "A menos que você não venha." → "**Unless you don't** come, ..." | "**Unless you come**, we'll start without you." | *Unless* = *if not*; acrescentar *not* inverte o sentido pretendido. |
| "Se não chover, vamos." → "**If not rains**, we go." | "**If it doesn't rain**, we'll go." | *If not* pede oração completa com auxiliar; *unless* pede verbo afirmativo. |
| "A menos que o teste falhe, acionamos o plantão." → "Unless the test fails, we'll page the on-call." | "Unless the test fails, we **won't** page the on-call." | A cláusula com *unless* já é negativa: o resultado precisa da forma afirmativa coerente com a intenção. |
| "Desde que você tente, melhora." → "**Since** you try, you'll improve." | "**As long as** you try, you'll improve." | *Since* introduz tempo ou causa; a condição necessária é *as long as*. |
| "Leve o runbook, no caso de o plantão precisar." → "in case **of** the on-call needs it" | "in case the on-call **needs** it" | *In case of* pede substantivo (*in case of failure*); *in case* + sujeito + verbo. |
| "Eu acho que o plano está errado." → "You are wrong. We deploy Monday." | "**I'd feel safer** if we had the replica." | O *hedging* com *I'd / could* expressa cautela e mantém o profissionalismo na discordância. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (plano real ou hipótese?)

Qual linha apresenta um **plano real e possível** para o deploy de hoje?

| Opção | Frase |
|---|---|
| A | "If we had a staging replica, we could test the rollback." |
| B | **"If the migration finishes before 16:00, we'll deploy tonight."** |
| C | "If I were the lead, I'd move the deploy to Monday." |
| D | "If we would have more time, we would run the check twice." |

**Key:** B

A e C são segundos condicionais: descrevem hipóteses, não um plano concreto. D é agramatical (*would* dentro da cláusula *if*). B usa *if + presente, will + base* — exatamente o padrão do primeiro condicional.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural para o plano de contingência:

| Português (intenção) | Resposta esperada |
|---|---|
| "Se a migração atrasar, mantemos o esquema antigo." | "If the migration is late, we'll keep the old schema." |
| "Se eu tivesse uma réplica, testaria o rollback." | "If I had a replica, I would test the rollback." |
| "A menos que o teste falhe, não acionamos o plantão." | "Unless the test fails, we won't page the on-call." |
| "Se não registrarmos cada passo, a entrega fica confusa." | "If we don't log every step, the handover will be confusing." |

**Key:** ver tabela.

Nas duas primeiras linhas, compare o tempo da cláusula *if*: presente para o plano real, passado para a hipótese. Na terceira, *unless* já carrega a negação; na quarta, *if not* exige auxiliar (*don't*).

### Exercício 3 — Complete a nota de contingência

Preencha com **If**, **Unless**, **would**, **could**, **As long as** ou **In case**:

1. "______ the data check fails, we'll keep the old schema."
2. "______ we had a staging replica, we ______ run the check twice."
3. "______ the on-call needs the steps, the runbook is in the channel."
4. "We can deploy tonight ______ nobody changes the branch."
5. "______ you log each step, the next person repeats it."
6. "If I were the lead, I ______ move the deploy to Monday."

**Key:** 1) If; 2) If / could (ou *would*); 3) In case; 4) as long as; 5) Unless; 6) would — em 5, *unless you log* equivale a *if you don't log*; por isso o resultado permanece negativo em sentido, mas afirmativo na forma.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

If the migration finishes before 16:00, we'll deploy tonight.
Unless the data check fails, we won't page the on-call.
If we had a staging replica, we could test the rollback end to end.
Take the runbook in case the on-call needs the steps.
If I were the lead, I would move the deploy to Monday.

### Foco articulatório para falantes de pt-BR

- **/ɪ/ em *if* /ɪf/ vs. /iː/ em *we'll* /wiːl/**: o *if* é curto e frouxo; não diga "eef".
- **/w/ em *we'll* e *would***: lábios arredondados e soltos, sem encostar o dente no lábio como em /v/.
- **/ʊ/ em *would* /wʊd/ e *could* /kʊd/**: vogal curta e arredondada, não o /uː/ longo de *food*.
- **/d/ final em *would* e *could***: solte o /d/; o pt-BR tende a engoli-lo e a dizer "wou" / "cou".
- **/ə/ e /ˈles/ em *unless* /ənˈles/**: comece com schwa sem tônica e acentue a segunda sílaba.
- **/ð/ em *the***: ponta da língua entre os dentes, com voz; evite trocar por /d/ (*de*).
- **/ɔɪ/ em *deploy* /dɪˈplɔɪ/**: deslize de /ɔ/ para /ɪ/, sem transformar o final em /eɪ/.

### Prompt de produção (oral ou escrita)

Escreva ou diga um plano de contingência curto para um deploy que pode atrasar. Seu texto deve:

1. conter pelo menos **uma first conditional** (*If + presente, will + base*);
2. conter pelo menos **uma second conditional** com **would** ou **could** (*If + passado, would/could + base*);
3. usar **unless** com valor de *if not* e **sem** dupla negação;
4. incluir **in case** ou **as long as** com a precaução ou condição correta;
5. empregar **um recurso de hedging** (*I'd feel safer*, *I would*, *we could*) para atenuar uma opinião profissional;
6. terminar com um detalhe real do seu contexto (ticket, deploy, fila ou janela de manutenção).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Gramática (L1):** Qual linha está correta para uma hipótese?
   A) "If I would have a replica, I could test it."  B) **"If I had a replica, I could test it."**  C) "If I have a replica, I would test it."  D) "If I had a replica, I will test it."
   **Key:** B — *could* fica na oração resultado; a cláusula *if* usa o passado hipotético *had*. A coloca *would* no lugar errado, C mistura presente com resultado hipotético e D mistura passado com *will*.

2. **Vocabulário (L1):** "Unless the data check fails, we won't page the on-call." quer dizer:
   A) **Se o teste de dados não falhar, não acionaremos o plantão.**  B) Se o teste falhar, acionaremos o plantão.  C) A menos que o teste falhe, acionaremos o plantão.  D) Mesmo que o teste falhe, não acionaremos o plantão.
   **Key:** A — *unless* = *if not*; a oração principal permanece "we won't page". C repete a negação em português e inverte a leitura correta da frase.

3. **Registro / hedging (L1):** Qual formulação soa mais adequada para discordar do tech lead em uma reunião?
   A) "You are wrong. We deploy on Monday."  B) "I'd feel safer if we had the replica."  C) "The plan is definitely perfect."  D) "You must change the plan now."
   **Key:** B — *I'd feel safer* + segundo condicional atenua a discordância; A e D são categoricos, e C afirma certeza, o oposto de *hedging*.

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_b1_conditionals_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_conditionals",
  "cefr_level": "B1",
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
      "grammar.conditionals_1_2",
      "grammar.hedging_conditional",
      "grammar.modal_can_need"
    ],
    "vocab": [
      "vocab.conditionals.contingency",
      "vocab.conditionals.unless",
      "vocab.conditionals.in_case",
      "vocab.hedging.modals"
    ],
    "reading": [
      "reading.conditionals_contingency_plan",
      "reading.conditionals_unless_detail"
    ],
    "listening": [
      "listening.conditionals_contingency_dialogue"
    ],
    "pronunciation": [
      "pronunciation.conditionals_would_could"
    ],
    "speaking": [
      "speaking.conditionals_contingency_plan"
    ]
  },
  "prereq_lessons": [
    "les_a2_modals_can_need",
    "les_b1_modals",
    "les_a2_future_will",
    "les_a2_past_narrative",
    "les_b1_tenses_review"
  ],
  "estimated_time_min": 15
}
```
