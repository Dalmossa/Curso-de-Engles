# Lesson: PRs, Tickets & Code Comments

**Lesson ID:** `les_a2_it_pr_tickets`
**Module:** `mod_a2_it_communication`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: revisão de um PR antes do merge

> **Marina (backend developer, Belo Horizonte):** "I opened PR #318 for ticket SRCH-137 — pagination on the search endpoint. Can you review it before stand-up?"
>
> **Lucas (reviewer, remote):** "Sure. I'll read the description first, then the diff. Is the empty-page case covered?"
>
> **Marina:** "Yes — there's a test for it, and the acceptance criteria are in the ticket."
>
> **Lucas:** "One blocker: the error response returns 200. Please change it to 422. The rest looks good — just a nit on the variable name."
>
> **Marina:** "Fixed. I pushed the commit and left a reply on your comment. Ready for another look?"
>
> **Lucas:** "Approved. LGTM — you can merge when the checks are green."
>
> **Marina:** "Thanks. I'll squash the commits, merge the branch, and move the ticket to Done."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **open a PR** | abrir um PR | O verbo é *open*: *I opened a PR*, não "I made a PR". |
| **description** | descrição (do PR) | Conta **o que** mudou e **como testar**; não é o histórico de commits. |
| **acceptance criteria** | critérios de aceite | *Criteria* já é plural; nunca escreva *acceptance criterias*. |
| **assignee** | responsável pelo ticket | Quem executa a tarefa; diferente de *reviewer* (quem revisa). |
| **label / priority** | etiqueta / prioridade | Metadados do ticket; ajudam a ordenar a fila de trabalho. |
| **request a review** | pedir uma revisão | *Review* é contável aqui: *request a review from Lucas*. |
| **blocker** | bloqueio | Impedimento concreto, com causa e dono; diga o que trava o merge. |
| **nit** | detalhe menor | Sugestão não bloqueante; escreva *just a nit* para separá-la do bloqueio. |
| **request changes** | solicitar alterações | Decisão de revisão que impede o merge até a correção. |
| **approve** | aprovar | Decisão de revisão; *approved* também funciona como adjetivo curto. |
| **LGTM** | está bom para mim | *Looks Good To Me*; leia letra por letra em voz alta. |
| **WIP** | em andamento | *Work In Progress*; sinaliza no título que o PR não está pronto. |
| **merge / squash / rebase** | mesclar / agrupar commits / reaplicar commits | *Squash* junta commits; *rebase* reaplica a história sobre outra base. |
| **code comment** | comentário no código | Use *leave/add a comment on line 42*; não diga "comment the code". |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Fiz um PR" → "I made a PR" | "I **opened** a PR." | Na rotina de Git em inglês, o PR é *opened* e depois *closed* or *merged*. |
| "Pedir revisão para o time" → "request review for the team" | "Request **a review from** the team." | *Review* é contável e o pedido parte **de** quem revisa: *from*. |
| "Vou approvear / dar o LGTM" → "I will LGTM it" | "I'll **approve** the PR." / "**LGTM**." | *LGTM* é sigla curta de comentário, não verbo transitivo. |
| "Fiz um nitpick" → "I did a nitpick" | "I **left a nit** on line 42." | Comentários são *left* ou *added*; *nit* já significa detalhe menor. |
| "Está com bloqueio" → "It has blocking" | "There's a **blocker**: the response returns 200." | *Blocker* é substantivo contável; a frase nomeia o impedimento. |
| "Critérios de aceitação" → "acceptance criterias" | "**Acceptance criteria** are in the ticket." | *Criterion* / *criteria*: o plural não leva *-s* extra. |
| "Vou changear os commits" → "change the commits" | "I'll **squash** the commits." | *Squash* é o verbo específico para agrupar commits antes do merge. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (pedido de revisão)

Qual linha pede uma revisão de forma natural em inglês de trabalho?

| Opção | Frase |
|---|---|
| A | "Could you to review the PR before stand-up?" |
| B | **"Could you review the PR before stand-up?"** |
| C | "You review the PR before stand-up?" |
| D | "Reviewing the PR before stand-up?" |

**Key:** B — depois de *could* vem o verbo na forma base, sem *to*; em **A** o *to* é transferência do pt-BR "você pode revisar", em **C** a ordem é de afirmação com ponto de interrogação e em **D** o gerúndio forma um fragmento, sem pedido.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural de uma revisão de PR:

| Português (intenção) | Resposta esperada |
|---|---|
| "Abri o PR do ticket SRCH-137." | "I opened the PR for ticket SRCH-137." |
| "Tem um bloqueio: a resposta volta 200." | "There's a blocker: the response returns 200." |
| "Só um detalhe: renomeia a variável." | "Just a nit: rename the variable." |
| "Aprovado, pode mesclar." | "Approved — you can merge." |
| "Agrupei os commits." | "I squashed the commits." |

**Key:** ver tabela — cada linha troca a tradução literal por uma expressão fixa de revisão (*opened*, *blocker*, *nit*, *approved*, *squashed*); o bloqueio vem antes do detalhe menor, e a decisão de revisão vem explícita.

### Exercício 3 — Complete o fluxo de revisão

Preencha com **request changes**, **approve**, **LGTM**, **WIP** ou **squash**:

1. "The PR title says [___] — don't merge it yet."
2. "I found a real bug, so I'll ___ instead of approving."
3. "The fix is in: I'll ___ the PR now."
4. "After the checks pass, I'll ___ the three commits into one."
5. "Done — ___ from me; the review is complete."

**Key:** 1) WIP; 2) request changes; 3) approve; 4) squash; 5) LGTM — *WIP* avisa que o PR não está pronto, *request changes* barra o merge, *approve* é a decisão, *squash* agrupa commits e *LGTM* é o comentário curto de aprovação.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
I opened the PR for ticket SRCH-137 and requested a review from Lucas.
There's a blocker: the error response returns 200, not 422.
Just a nit: rename the variable on line 42 before we merge.
Could you approve the PR after the checks are green?
I'll squash the commits, merge the branch, and move the ticket to Done.

### Foco articulatório para falantes de pt-BR

- **/θ/ em *three, thanks***: ponta da língua entre os dentes, sem voz; não diga "tree" nem "sanks".
- **/ð/ em *the, the branch***: mesmo lugar de articulação de /θ/, mas com voz; distinga as duas séries.
- **/iː/ em *green, team***: vogal longa e tensa; não encurte como o *i* do pt-BR.
- **/dʒiː/ no G de *LGTM***: leia letra por letra — /el dʒiː tiː em/; o G soa como *gee*, não como o "gê" do português.
- **/ɑːr/ no R de *PR***: em en-US o /r/ é pronunciado; evite o *r* retroflexo do pt-BR e não acrescente vogal final.
- **/k/ final em *ticket, check***: solte o ar sem inserir "e" (*ticket-e*); a epêntese final é comum em pt-BR.
- **Entonação de pedido** em *Could you approve...?*: suba levemente o tom no final para soar educado.

### Prompt de produção (oral ou escrita)

Você precisa descrever uma revisão de PR para um colega em outro fuso. Escreva um comentário curto de PR (ou diga as mesmas informações em voz alta) com:

1. o número do PR e o ticket relacionado;
2. uma **description** de uma linha com o que mudou;
3. um **blocker** concreto, se houver;
4. um **nit** separado do bloqueio;
5. uma decisão explícita: **approve** ou **request changes**;
6. um pedido educado com **Could you...?**;
7. o próximo passo com **merge** ou **squash**.

Inclua um detalhe real do seu contexto (endpoint, fila, teste, ticket).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** No comentário "Just a nit: rename the variable.", *nit* significa:
   A) um bloqueio  B) **um detalhe menor, não bloqueante**  C) uma aprovação  D) um novo ticket  
   **Key:** B — *nit* é uma sugestão pequena; um bloqueio seria *blocker* e uma aprovação seria *approve* ou *LGTM*.

2. **Gramática (L1):** Qual linha pede a revisão corretamente?
   A) "Could you to review the PR?"  B) "You could reviewing the PR?"  C) **"Could you review the PR?"**  D) "Could you reviewed the PR?"  
   **Key:** C — *could* pede a forma base do verbo; **A** acrescenta *to*, **B** usa gerúndio e **D** usa particípio.

3. **Registro (L1):** Um título de PR começa com *[WIP]*. O que isso comunica?
   A) O PR já foi aprovado.  B) **O trabalho está em andamento; ainda não é para mesclar.**  C) O PR tem um bloqueio de produção.  D) O ticket foi fechado.  
   **Key:** B — *WIP* significa *Work In Progress*; bloqueio é *blocker*, e ticket fechado é *Done*.

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_pr_tickets_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_pr_tickets",
  "cefr_level": "A2",
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
      "grammar.pr_review_requests",
      "grammar.pr_commit_imperative"
    ],
    "vocabulary": [
      "vocab.pr_review_actions",
      "vocab.pr_ticket_fields",
      "vocab.email_vocab_review",
      "vocab.it_computer_terms"
    ],
    "listening": [
      "listening.pr_review_context"
    ],
    "pronunciation": [
      "pronunciation.pr_acronyms"
    ],
    "reading": [
      "reading.pr_description",
      "reading.pr_review_thread"
    ],
    "writing": [
      "writing.pr_description",
      "writing.pr_review_comment"
    ]
  },
  "prereq_lessons": [
    "les_a1_reading_skimming",
    "les_a2_reading_strategy",
    "les_a2_it_reading_strategy",
    "les_a2_it_terms_basics",
    "les_a2_imperatives"
  ],
  "estimated_time_min": 15
}
```
