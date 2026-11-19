# Lesson: Writing: Argumentative Essay

**Lesson ID:** `les_b2_professional_argument`
**Module:** `mod_b2_professional`
**CEFR:** B2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: a equipe planeja um texto argumentativo sobre dívida técnica

> **Ana (tech lead, São Paulo):** "We need one clear thesis: a monthly debt budget is warranted. Not three opinions in one paragraph."
>
> **Rafael (staff engineer, remote):** "Agreed. My first claim is that deferred refactoring raised rollback time. The evidence is in the last two incident reviews."
>
> **Priya (product manager, New York):** "I hear the claim. What is the counterargument? A fixed budget will slow one feature every quarter."
>
> **Ana:** "Good. We concede that in one sentence — 'Admittedly, a fixed budget may delay one feature per quarter' — and then answer it."
>
> **Rafael:** "The rebuttal: fewer rollbacks give us more time to ship, not less. That is warranted by the p95 data."
>
> **Lucas (backend developer, São Paulo):** "So our stance stays visible in every paragraph, and the hedging stays honest: the data suggests, not proves."
>
> **Priya:** "Exactly. If we cannot warrant a claim with a number or a source, we cut it or soften it."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **thesis statement** | tese / declaração de tese | Uma frase que resume a posição central; não é título nem pergunta. |
| **claim** | afirmação / ponto defendido | Cada parágrafo defende uma claim; escreva *I argue that ...*, não *I think about ...*. |
| **evidence** | evidência | Número, log, ticket ou fonte nomeada; "eu acho" não é evidence. |
| **counterargument** | contra-argumento | A objeção real da outra lado, formulada com fair play — não um espantalho. |
| **rebuttal** | refutação | A resposta ao contra-argumento com raciocínio, não a repetição da tese. |
| **concession** | concessão | Reconhecer um ponto válido: *Admittedly, ...* / *While that concern is valid, ...*. |
| **stance** | postura / posicionamento | A direção que o leitor percebe em toda a argumentação; fique explícito na tese. |
| **warranted** | justificado / respaldado | Uma claim é *warranted* quando há evidência suficiente para o grau de certeza usado. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Em minha opinião..." → "In my opinion, ..." em toda frase | "I argue that a monthly debt budget is warranted." / "The evidence suggests a smaller budget lowers p95." | *In my opinion* soa como gosto pessoal; um ensaio argumentativo pede uma posição defendível. |
| "Eu acho que..." → "I think ..." repetido cinco vezes | "The data suggests ..." / "This evidence indicates ..." | Variar o sujeito da oração desloca o peso da opinião para a evidência. |
| "Isso prova 100% que..." → "This proves 100% that ..." | "This suggests that ..." / "This is consistent with ..." | *Proves* exige evidência decisiva; *suggests* mantém a claim **warranted**. |
| "Embora eu discorde..." → "Although I disagree, ..." e pronto | "Admittedly, a fixed budget may delay a feature. However, fewer rollbacks free time to ship." | Concessão sem rebuttal parece desistência; nomeie a objeção e responda. |
| "Do outro lado, as pessoas dizem..." → "On the other side, people say ..." | "A common counterargument is that a fixed budget slows delivery." | O contra-argumento precisa de autor e conteúdo, não de um "povo" genérico. |
| "De fato, é verdade..." → "In fact, it is true ..." antes de cada número | "The last two incident reviews show a thirty percent rise in rollback time." | Deixe o número falar; *in fact* perde força quando vira tic verbal. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (thesis statement)

Qual linha é uma thesis statement clara e defendível?

| Opção | Frase |
|---|---|
| A | "I think technical debt is something we should maybe discuss." |
| B | **"I argue that a monthly debt budget is warranted because deferred fixes raise rollback time."** |
| C | "Technical debt is a topic in software engineering." |
| D | "Many teams have problems with legacy code." |

**Key:** B — há posição (*is warranted*), escopo (*a monthly debt budget*) e razão (*deferred fixes raise rollback time*); em **A** os hedges anulam a posição, em **C** há só um tema e em **D** uma generalização sem tese.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês argumentativo natural:

| Português (intenção) | Resposta esperada |
|---|---|
| "Na minha opinião, dívida técnica é ruim." | "I argue that unchecked technical debt harms delivery." |
| "Eu acho que os dados mostram uma melhora." | "The data suggests an improvement in p95 latency." |
| "É verdade que isso pode atrasar uma entrega." | "Admittedly, this may delay one feature per quarter." |
| "Mas a resposta é que menos rollbacks dão mais tempo." | "However, fewer rollbacks give the team more time to ship." |

**Key:** ver tabela — cada linha troca o sujeito "eu" por uma posição (*I argue*), uma evidência (*the data suggests*), uma concessão (*admittedly*) ou uma rebuttal (*however*).

### Exercício 3 — Complete os conectores de argumentação

Preencha com **Furthermore**, **Admittedly**, **However** ou **Consequently**:

1. "Debt work reduces rollback time. ______, it lowers on-call stress."
2. "______, a fixed budget may delay one feature per quarter."
3. "______, the extra refactoring time pays back in fewer incidents."
4. "Rollback time rose by thirty percent. ______, we need a debt budget."

**Key:** 1) Furthermore; 2) Admittedly; 3) However; 4) Consequently — *furthermore* acrescenta evidência, *admittedly* abre a concessão, *however* inaugura a rebuttal e *consequently* fecha a inferência.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
I argue that a monthly debt budget is warranted because unrepaired defects slow every release.
The last two incidents show a thirty percent rise in rollback time after we deferred refactoring.
A phased pilot also cut p95 latency by eighteen percent in the checkout service.
Admittedly, a fixed budget may delay one feature per quarter.
However, that concession is warranted: fewer rollbacks give the team more time to ship, not less.

### Foco articulatório para falantes de pt-BR

- **/θ/ em *thesis, monthly***: ponta da língua entre os dentes, sem voz; não diga "tesis" nem "montly".
- **/ð/ em *the, that***: /ð/ é a versão sonora do /θ/; não troque por /d/ ("da", "dat").
- **/eɪ/ em *claim, stance, phased***: ditongo de /e/ para /ɪ/; não reduza a um /e/ puro como em "clen".
- **/iː/ em *release, feature***: vogal longa e tensa; não a encurte como o /i/ de "this".
- **/dʒ/ em *budget, suggests***: não diga "bud_jet" com /ʒ/ nem "sugests" sem a africada; *warranted* tem /ɜː/ na primeira sílaba.
- **/ɜː/ em *warranted, deferred***: vogal central longa, sem o /r/ vibrante do pt-BR.
- **/aɪ/ em *pilot***: ditongo completo /aɪ/; não pronuncie "pilót" com vogal final.

### Prompt de produção (oral ou escrita)

Escreva um mini-ensaio de 120–150 palavras (ou diga as mesmas ideias em voz alta) sobre: **"Technical debt should be prioritized over new features."** Inclua:

1. uma **thesis** de uma frase com sua **stance** explícita;
2. duas **claims**, cada uma com uma **evidence** concreta (número, log, ticket ou fonte nomeada);
3. um **counterargument** realista — não um espantalho — precedido de **concession** (*Admittedly*, *While that concern is valid*);
4. uma **rebuttal** que responda ao contra-argumento com raciocínio, explicando por que sua tese continua **warranted**;
5. uma linha final que retome a stance sem copiar a tese palavra por palavra;
6. pelo menos duas formas de hedge (*suggests*, *may*, *is likely to*) e no máximo um *I think*.

Inclua um detalhe real do seu contexto (ticket, incidente, deploy, fila ou métrica).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em "Admittedly, a fixed budget may delay a feature. However, fewer rollbacks free time to ship", a segunda frase é:
   A) a concession  B) a counterargument  C) **a rebuttal**  D) a thesis statement
   **Key:** C

2. **Gramática (L1):** Qual linha mantém a claim **warranted**?
   A) "This proves 100% that the pilot worked."  B) **"The p95 data suggests the pilot reduced incidents."**  C) "I think maybe the pilot kind of helped."  D) "In my opinion, the pilot is true."
   **Key:** B

3. **Coerência (L1):** Qual conector abre uma concession antes da rebuttal?
   A) Furthermore  B) Consequently  C) **Admittedly**  D) Moreover
   **Key:** C

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_professional_argument_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_professional_argument",
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
      "grammar.argumentative_thesis",
      "grammar.transitions_argumentation",
      "grammar.hedging_claim"
    ],
    "vocabulary": [
      "vocab.argument.thesis_statement",
      "vocab.argument.claim",
      "vocab.argument.evidence",
      "vocab.argument.counterargument",
      "vocab.argument.rebuttal",
      "vocab.argument.concession",
      "vocab.argument.stance",
      "vocab.argument.warranted"
    ],
    "listening": [
      "listening.argument_planning"
    ],
    "pronunciation": [
      "pronunciation.argument_dental_diphthongs"
    ],
    "reading": [
      "reading.argument_stance",
      "reading.argument_evidence"
    ],
    "writing": [
      "writing_argumentative"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_b2_register_nuance",
    "les_b2_toeic_writing",
    "les_b2_ielts_writing",
    "les_b2_exam_simulations"
  ],
  "estimated_time_min": 15
}
```

Nota de rastreabilidade: §4.3 registra `writing_argumentative` como skill nova **e** como skill de pré-requisito desta lição; o auto-loop foi removido. As lições reais de §4.3 que registram `writing_argumentative` entre as skills novas são `les_b2_toeic_writing`, `les_b2_ielts_writing` e `les_b2_exam_simulations` — todas incluídas, nenhuma delas é a própria lição. `les_a2_it_terms_basics` e `les_b2_register_nuance` já estavam no JSON original e foram verificados em §4.3; os três demais ids do JSON original (`les_a2_it_communication`, `les_b1_it_technical`, `les_b1_fluency_project`) são nomes de módulo e não constam como lição em §4.3, portanto foram removidos.
