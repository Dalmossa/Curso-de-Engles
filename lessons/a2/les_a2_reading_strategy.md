# Lesson: Reader's Toolkit: Skim, Scan, Context, Cognates

**Lesson ID:** `les_a2_reading_strategy`
**Module:** `mod_a2_skills_rw`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: triagem de release notes antes de um deploy

> **Marina (backend developer, São Paulo):** "The deploy window opens at 18:00. I have ten minutes — I'll skim the release notes first."
>
> **Tom (release manager, Austin):** "Good. Scan for the breaking changes and the rollback step. Don't read every line."
>
> **Marina:** "The header says 'faster login'. That's the main idea. The rest is detail."
>
> **Tom:** "Look at 'deprecated' in the auth section. The next sentence explains it — infer from context."
>
> **Marina:** "So the old endpoint still works, but we should move to /v2. Got it. And 'currently' means 'atualmente', not 'actually'."
>
> **Tom:** "Exactly. *Actually* means 'de fato'. One wrong word in a ticket can confuse the whole team."
>
> **Marina:** "I'll summarize: faster login, one breaking change, rollback ready. Let's deploy."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **skim** | dar uma lida rápida / skimming | Olhar títulos e o primeiro parágrafo para a ideia geral; não é "ler tudo depressa". |
| **scan** | procurar especificamente / scanning | Correr os olhos atrás de um dado (data, código, nome); use *scan for*. |
| **main idea** | ideia principal | Em release notes, costuma aparecer no título ou no primeiro parágrafo. |
| **detail** | detalhe | Número, data ou nome que responde a uma pergunta específica. |
| **infer from context** | inferir pelo contexto | Usar a frase seguinte para deduzir uma palavra desconhecida; não diga *deduce of*. |
| **cognate** | cognato | Palavra parecida com o mesmo sentido: *support* / "suporte". |
| **false cognate** | falso cognato | Palavra parecida com sentido diferente: *actually* ≠ "atualmente". |
| **currently** | atualmente | Forma natural em status updates; *actually* significa "de fato". |
| **release notes** | notas de lançamento | Texto curto que acompanha uma versão; não confunda com *release* (lançamento). |
| **breaking change** | mudança incompatível | Mudança que exige ação de quem consome a API; comum em changelogs. |
| **deprecated** | obsoleto, em desuso | Ainda funciona, mas será removido; confirme o sentido pelo contexto. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Vou ler tudo rapidinho." → "I will read everything fast." | "I'll **skim** the release notes." | *Skimming* é uma estratégia com objetivo definido, não só velocidade de leitura. |
| "Vou procurar a data." → "I will look for the date quickly." | "I'll **scan for** the deploy date." | *Scan for* é a coligação natural para busca dirigida de um dado. |
| "Eu deduzi do contexto." → "I deduced of the context." | "I **inferred it from context**." | O verbo é *infer from*; *deduce of* não existe em inglês. |
| "Atualmente o endpoint está ativo." → "Actually the endpoint is active." | "**Currently** the endpoint is active." | *Actually* quer dizer "de fato": falso cognato clássico em status updates. |
| "Eventualmente vai cair." → "Eventually it will fall" (com sentido de "talvez") | "**Maybe** it will fail." / "It will **eventually** fail." | *Eventually* significa "com o tempo"; para "talvez" use *maybe*. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Skim ou scan? (reconhecimento)

> "Release 2.4.0 — Login is now faster and password reset is simpler. We removed the old password rules and added single sign-on. A few charts load slowly during the data migration. No action is needed before Friday."

Você tem dez segundos antes do deploy. Qual instrução combina com um objetivo de **skimming** (ideia geral)?

| Opção | Frase |
|---|---|
| A | "Scan for the deploy date." |
| B | "**Skim the release notes for the main idea.**" |
| C | "Check every chart load time." |
| D | "Infer the old password rules." |

**Key:** B

Explicação: *skimming* busca a ideia geral — aqui, login mais rápido e reset mais simples. A é *scanning* (um dado específico), C é leitura detalhada e D é inferência, não skimming.

### Exercício 2 — Inferência por contexto

A nota diz: "The legacy endpoint is **deprecated**. It still answers requests, but new clients should use /v2/orders. We will remove it after the migration." O que **deprecated** significa nessa nota?

| Opção | Frase |
|---|---|
| A | "New and much faster." |
| B | "**Still available, but planned for removal.**" |
| C | "Removed from service this morning." |
| D | "Written in another programming language." |

**Key:** B

Explicação: a frase seguinte diz que o endpoint *still answers requests* e será removido *after the migration*. O contexto resolve a palavra: disponível agora, mas em desuso. C contradiz "still answers requests".

### Exercício 3 — Cognatos verdadeiros e falsos (correção)

Corrija o status update escrito por um desenvolvedor brasileiro: "Actually the API is stable; eventually we will add the new endpoint." A intenção em pt-BR é: "Atualmente a API está estável; talvez a gente adicione o novo endpoint."

| Intenção em pt-BR | Palavra correta em en-US |
|---|---|
| "atualmente" | **currently** |
| "talvez" | **maybe** |
| "com o tempo" | eventually |
| "de fato" | actually |

**Key:** "Currently the API is stable; maybe we will add the new endpoint."

Explicação: *actually* não traduz "atualmente" e *eventually* não traduz "talvez". *Currently* e *maybe* preservam as duas intenções do status update; *support* / "suporte" é exemplo de cognato verdadeiro, enquanto *actually* / "atualmente" é falso cognato.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
I skim the release notes before every deploy.
I scan the changelog for the breaking change.
The next sentence helps me infer the word from context.
"Currently" means "atualmente"; "actually" means "de fato".
Our docs say "support", a true cognate, but "eventually" is not "maybe".

### Foco articulatório para falantes de pt-BR

- **/sk/ em *skim, scan***: mantenha /s/ e /k/ colados, sem vogal inicial; o pt-BR tende a dizer "esquim" e "escã".
- **/s/ em *status, sentence***: comece com /s/ limpo, sem acréscimo de /e/ diante de consoante.
- **/ð/ em *the, this, the next***: ponta da língua entre os dentes, com voz; evite substituir por /d/.
- **/æ/ em *scan, actually***: abra a boca mais do que em /a/ do pt-BR; não realize como "scanne".

### Prompt de produção (oral ou escrita)

Você tem 60 segundos antes de um deploy. Escreva um parágrafo curto (4–6 sentenças) em en-US sobre a leitura de um changelog. No seu texto:
1. Use **skim** com um objetivo de ideia geral.
2. Use **scan for** com um dado específico (data, código ou nome).
3. Use **infer from context** para explicar uma palavra desconhecida.
4. Use **currently** ou **actually** com o sentido correto e explique a escolha em pt-BR ao final.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** O que significa *false cognate*?  
   A) Uma palavra idêntica nas duas línguas. B) Uma palavra parecida, com sentido diferente. C) Um termo técnico sem tradução. D) Um erro de digitação no changelog.  
   **Key:** B  
   Explicação: *actually* / "atualmente" é o exemplo clássico: forma parecida, sentido diferente.

2. **Leitura (L1):** Em "The endpoint is deprecated. New clients should use /v2/orders.", qual frase mostra o sentido de *deprecated*?  
   A) O endpoint foi removido ontem. B) O endpoint é mais rápido que /v2. C) O endpoint ainda funciona, mas será substituído. D) O endpoint aceita apenas novos clientes.  
   **Key:** C  
   Explicação: *should use /v2* indica substituição; a inferência vem da recomendação, não de uma palavra isolada.

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_reading_strategy_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_reading_strategy",
  "cefr_level": "A2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.reading_imperatives",
      "grammar.present_simple_regular"
    ],
    "vocabulary": [
      "vocab.reading_strategy_terms",
      "vocab.reading_false_cognates",
      "vocab.release_notes_terms",
      "vocab.email_verbs"
    ],
    "listening": [
      "listening.reading_strategy_briefing"
    ],
    "pronunciation": [
      "pronunciation.reading_s_cluster"
    ],
    "reading": [
      "reading.reading_skimming",
      "reading.reading_scanning",
      "reading.reading_context_inference",
      "reading.reading_cognates"
    ]
  },
  "prereq_lessons": [
    "les_a1_regular_verbs_past",
    "les_a1_present_simple",
    "les_a1_have_has",
    "les_a1_reading_skimming",
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
    "les_a2_restaurant_shopping"
  ],
  "estimated_time_min": 15
}
```
