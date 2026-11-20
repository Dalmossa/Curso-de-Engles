# Lesson: Clean Code Practices: Refactoring, Code Smells, SOLID

**Lesson ID:** `les_a2_it_clean_code_basics`
**Module:** `mod_a2_it_fundamentals`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: revisão de código no time de pagamentos

> **Bruna (senior developer, Recife):** "Caio, look at `sendInvoiceReminder`. It builds the address, sends the email, and writes the audit row. That is a code smell."
>
> **Caio (junior developer, remoto):** "It works in staging. Why change it now?"
>
> **Bruna:** "Because it is hard to test. Let's refactor it: same behavior, smaller functions."
>
> **Caio:** "So every function gets one job?"
>
> **Bruna:** "Yes — that is the single responsibility idea. The address format is copied in two places too, and that breaks DRY."
>
> **Caio:** "Got it. I will name each piece after its job and add a test before I move the code."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **refactor / refactoring** | refatorar / refatoração | *Refactor* é o verbo: "Let's refactor it." *Refactoring* é o processo: "The refactoring is small." |
| **a code smell** | um sinal de problema no código | *Smell* é contável aqui: use o artigo *a*; no plural, *code smells*. |
| **technical debt** | dívida técnica | Incontável: *too much technical debt*, nunca *many technical debts*. |
| **behavior** | comportamento do código | Em en-US, sem *u*: *same behavior*. Não escreva *same behaviour* neste curso. |
| **single responsibility** | responsabilidade única | Na conversa, diga *one job*: "This function has one job." |
| **DRY** | não repetir a mesma lógica | Diga "That breaks DRY." A sigla funciona como nome do princípio; não traduza para "seco". |
| **split the function** | dividir a função | Use *split X into Y*: "Split it into three small functions." |
| **name it after its job** | dar o nome conforme a tarefa | *After* aqui quer dizer "baseado em", não "depois de". |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Refatorei para ficar diferente." | "I **refactored** the code." | *Refactor* já diz que a estrutura mudou; *different* não diz qual foi a melhoria. |
| "Esse código tem cheiro." | "This code has **a code smell**." | O artigo *a* é obrigatório: *smell* é contável nesse sentido. |
| "Tem muito dívida técnica." | "There is **too much technical debt**." | *Debt* é incontável; não diga *many technical debts*. |
| "A função faz três coisas." | "This function does **three jobs at once**." | *Job* descreve a responsabilidade da função melhor que *thing*. |
| "Vou renomear depois da tarefa." (intenção: "baseado na tarefa") | "I will **name it after the job**." | *Name X after Y* = batizar X com base em Y; *after* não indica tempo aqui. |
| "Nós repetimos a lógica em dois lugares." | "We **duplicated** the logic in two places." | *Duplicate* soa técnico; *repeat* soa como repetir uma frase. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Vocabulário e artigos (escolha contextual)

Um colega aponta um trecho longo que faz três trabalhos. Qual frase está correta?

| Opção | Frase |
|---|---|
| A | "This function has much code smell." |
| B | "This function has a code smell." |
| C | "This function is a code smelling." |
| D | "This function has many technical debt." |

**Key:** B
Aqui *smell* é contável: *a code smell* (plural: *code smells*). Já *debt* é incontável, então o certo é *too much technical debt*.

### Exercício 2 — Leitura (detalhe em nota de revisão)

Leia a nota de revisão e responda: o que o revisor propõe fazer?

> "Review note — `sendInvoiceReminder` builds the address, sends the email, and writes the audit row. The address format appears in `buildLabel` too. Proposal: split the jobs and add a test before moving the code."

**Key:** Split the jobs and add a test before moving the code.
A proposta está depois de *Proposal:*; o resto da nota só descreve o que a função já faz.

### Exercício 3 — Gramática (rotina no present simple + passivo)

Complete com as formas corretas de *run* e *replace*:

1. "The cleanup job ______ (run) every night."
2. "The old name ______ (replace) last week."

**Key:** 1) runs; 2) was replaced.
*Runs* marca a rotina no present simple com sujeito singular; *was replaced* coloca o nome antigo como paciente da ação na semana passada.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
This function has a code smell: it does three jobs at once.
We will refactor it without changing the behavior.
The address format is duplicated in two places, so that breaks DRY.
Each small function is named after the job it does.
The cleanup job runs every night, and the old name was replaced last week.

### Foco articulatório para falantes de pt-BR

- **/θ/ em *three, thing***: ponta da língua entre os dentes; não troque por /t/ (*tree*).
- **/v/ em *behavior, review***: dentes de cima encostando no lábio inferior; evite /w/.
- **/dʒ/ em *job, change***: comece com /d/ e termine com /ʒ/; não use apenas /ʒ/.
- **/ð/ em *the, without***: versão sonora de /θ/; língua entre os dentes, não /d/.
- **Entonação**: em "Why change it now?" suba o tom no final; em "That is a code smell." deixe o tom cair.

### Prompt de produção (oral ou escrita)

Você está em uma revisão de código com um colega em São Paulo. Escreva 5–7 falas em inglês, ou grave o áudio, cumprindo estes requisitos:

1. aponte um *code smell* usando o artigo correto;
2. use *refactor* e diga que o comportamento continua o mesmo;
3. mencione *one job* ou *DRY*;
4. use uma oração no passivo (*is duplicated*, *is named*) e uma rotina no present simple (*runs every night*);
5. proponha um teste antes da mudança e feche com um nome de função baseado na tarefa.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Um trecho longo que faz três trabalhos tem o quê?  
   A) a refactor  B) a code smell  C) many technical debts  D) a DRY  
   **Key:** B  
   *Smell* é contável (*a code smell*); *refactor* é a mudança, não o sinal do problema.

2. **Gramática (L1):** Qual frase está correta?  
   A) "The cleanup job run every night."  
   B) "The cleanup job runs every night, and the old name was replaced last week."  
   C) "The cleanup job is run every night, and the old name replaced last week."  
   D) "The cleanup job runs every night, and the old name is replace last week."  
   **Key:** B  
   Rotina no present simple (*runs*) e passivo com tempo passado (*was replaced*).

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_a2_it_clean_code_basics_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_clean_code_basics",
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
      "grammar.passive_cleanup_routine",
      "grammar.skim_subject_verb"
    ],
    "vocabulary": [
      "vocab.clean_code_smell_debt",
      "vocab.clean_code_refactor",
      "vocab.clean_code_srp_dry",
      "vocab.clean_code_naming",
      "vocab.it_terms_basics"
    ],
    "listening": [
      "listening.clean_code_review"
    ],
    "reading": [
      "reading.clean_code_review_note",
      "reading.clean_code_snippet"
    ],
    "pronunciation": [
      "pronunciation.clean_code_th_v"
    ],
    "speaking": [
      "speaking.clean_code_review"
    ]
  },
  "prereq_lessons": [
    "les_a1_reading_skimming",
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```
