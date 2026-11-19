# Lesson: Reading Technical Texts

**Lesson ID:** `les_a2_it_reading_strategy`
**Module:** `mod_a2_it_fundamentals`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: triar documentação antes de um deploy

> **Bia (backend developer, Recife):** "The release is at 18:00. I have the API docs, one issue and the changelog open. Where do I start?"
>
> **Rafael (tech lead, São Paulo):** "Skim each one first. Read the title, the headings and the first line. Do not read every word."
>
> **Bia:** "The docs have a section called 'Rate limits'. That gives me the structure. The changelog says 'deprecated'."
>
> **Rafael:** "Good. Now scan for the datum you need: the new limit, the effective date and the rollback step. Scan for, not read."
>
> **Bia:** "It says the legacy endpoint still answers requests until 30 June. I can infer 'legacy' from the next sentence: old, but still live."
>
> **Rafael:** "Right. And 'currently' means 'atualmente' — not 'actually'. One false cognate in an issue can change the whole decision."
>
> **Bia:** "So: skim for structure, scan for the number, infer from context, check cognates. I'll post a three-line summary in the issue."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **skim** | dar uma lida para capturing a ideia geral | Observe títulos, cabeçalhos e a primeira linha. Não é "ler tudo depressa". |
| **scan for** | procurar um dado específico | Use *scan for the date / the command / the limit*; a preposição *for* é parte da expressão. |
| **heading** | título de seção | Em docs e READMEs, os headings mostram a estrutura antes de qualquer leitura detalhada. |
| **issue** | issue / tarefa registrada | Em inglês técnico, *issue* é o registro no rastreador; não traduza por "problema" por padrão. |
| **changelog** | registro de mudanças | Texto curto por versão; *release notes* é o nome comum quando acompanha um deploy. |
| **deprecated** | obsoleto, em desuso | Ainda funciona, mas será removido. Confirme sempre pela frase seguinte. |
| **legacy** | legado, antigo | Descreve o sistema antigo que ainda está em uso; não quer dizer "desligado". |
| **currently** | atualmente | Palavra natural em status updates: *Currently the endpoint is stable.* |
| **actually** | de fato, na verdade | Falso cognato de "atualmente": usá-lo para tempo presente troca o sentido do texto. |
| **support** | suporte / dar suporte | Cognato verdadeiro: *Our docs say support.* Vale checar pelo contexto, como sempre. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Vou ler tudo rapidinho." → "I will read everything fast." | "I'll **skim** the API docs." | *Skimming* é uma estratégia com objetivo definido, não só velocidade. |
| "Vou procurar o comando." → "I will look the command quickly." | "I'll **scan for** the rollback command." | *Scan for* é a coligação natural para busca dirigida de um dado. |
| "Atualmente o endpoint está ativo." → "Actually the endpoint is active." | "**Currently** the endpoint is active." | *Actually* significa "de fato": falso cognato clássico em status updates. |
| "Eu deduzi do contexto." → "I deduced of the context." | "I **inferred it from context**." | O verbo é *infer from*; *deduce of* não existe em inglês. |
| "Eventualmente vai cair." → "Eventually it will fall" (com sentido de "talvez") | "**Maybe** it will fail." / "It will **eventually** fail." | *Eventually* quer dizer "com o tempo"; para "talvez", use *maybe*. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Skim ou scan? (reconhecimento)

> "Release 2.4.0 — Login is faster. Password reset is simpler. The old /v1/session endpoint is deprecated. New clients must use /v2/session from 30 June. Rollback: deploy --rollback 2.3.9."

Você tem dez segundos antes do deploy. Qual instrução pede a **ideia geral** do changelog?

| Opção | Frase |
|---|---|
| A | "Scan the changelog for the rollback command." |
| B | "**Skim the changelog for the main change.**" |
| C | "Check every word of the changelog." |
| D | "Infer the meaning of deprecated." |

**Key:** B

Explicação: *skimming* busca a ideia geral — login mais rápido e reset mais simples. A é *scanning* (um dado específico), C é leitura integral e D é inferência, não skimming.

### Exercício 2 — Inferência por contexto

A documentação diz: "The legacy endpoint is **deprecated**. It still answers requests, but new clients should use /v2/orders. We will remove it after the migration." O que **deprecated** significa nesse trecho?

| Opção | Frase |
|---|---|
| A | "Fast and newly released." |
| B | "**Still available, but planned for removal.**" |
| C | "Removed from service this morning." |
| D | "Written in another programming language." |

**Key:** B

Explicação: *still answers requests* + *we will remove it after the migration* resolvem a palavra: disponível agora, mas em desuso. C contradiz o texto; A e D inventam informação que o trecho não dá.

### Exercício 3 — Cognatos em um status update (correção)

Corrija a frase escrita por um desenvolvedor brasileiro: "Actually the API is stable; eventually we will add the new endpoint." A intenção em pt-BR é: "Atualmente a API está estável; talvez a gente adicione o novo endpoint."

| Intenção em pt-BR | Palavra correta em en-US |
|---|---|
| "atualmente" | **currently** |
| "talvez" | **maybe** |
| "com o tempo" | eventually |
| "de fato" | actually |

**Key:** "Currently the API is stable; maybe we will add the new endpoint."

Explicação: *actually* não traduz "atualmente" e *eventually* não traduz "talvez". *Support* / "suporte" é cognato verdadeiro; *actually* / "atualmente" é falso cognato — a escolha errada muda o status que o time lê.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
I skim the API docs for the main sections before a release.
I scan the changelog for the breaking change and the date.
The next sentence helps me infer what "deprecated" means.
"Currently" means "atualmente"; "actually" means "de fato".
Our README says "support", a true cognate, but "eventually" is not "maybe".

### Foco articulatório para falantes de pt-BR

- **/sk/ em *skim, scan***: mantenha /s/ e /k/ colados, sem vogal inicial. O pt-BR tende a produzir "esquim" e "escã".
- **/s/ em *scan, section***: comece com /s/ limpo, sem acréscimo de /e/ diante de consoante.
- **/ð/ em *the, the next***: ponta da língua entre os dentes, com voz; evite substituir por /d/.
- **/æ/ em *scan, actually***: abra a boca mais do que no /a/ do pt-BR; não realize como "scanne".

### Prompt de produção (oral ou escrita)

Você tem 60 segundos antes de um deploy. Escreva um parágrafo curto (4–6 sentenças) em en-US sobre a leitura da documentação de uma API. No seu texto:

1. Use **skim** com um objetivo de estrutura (seções, título, ideia geral).
2. Use **scan for** com um dado específico (data, limite ou comando).
3. Use **infer from context** para explicar uma palavra desconhecida, como *deprecated* ou *legacy*.
4. Use **currently** ou **actually** com o sentido correto e explique a escolha em pt-BR ao final.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

### Verificação 1 — Leitura (L1)

Em "The endpoint is deprecated. New clients should use /v2/orders.", qual frase mostra o sentido de *deprecated*?  
A) O endpoint foi removido ontem. B) O endpoint é mais rápido que /v2. C) O endpoint ainda funciona, mas será substituído. D) O endpoint aceita apenas novos clientes.  
**Key:** C  
Explicação: *should use /v2* indica substituição; a inferência vem da recomendação, não de uma palavra isolada.

### Verificação 2 — Vocabulário (L1)

Em um relatório de deploy, *legacy endpoint* significa:  
A) Um endpoint recém-criado. B) Um endpoint sem autenticação. C) Um endpoint antigo ainda em uso. D) Um endpoint que só aceita testes.  
**Key:** C  
Explicação: *legacy* descreve o sistema antigo que continua ativo; o próprio trecho diz que ele *still answers requests*.

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_reading_strategy_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_reading_strategy",
  "cefr_level": "A2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocab", "reading", "pronunciation", "listening"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.it_reading_imperatives",
      "grammar.present_simple_regular"
    ],
    "vocab": [
      "vocab.it_reading_cognates",
      "vocab.it_core_terms"
    ],
    "reading": [
      "reading.it_skimming_structure",
      "reading.it_scan_datum"
    ],
    "pronunciation": [
      "pronunciation.it_reading_s_cluster"
    ],
    "listening": [
      "listening.it_reading_briefing"
    ]
  },
  "prereq_lessons": [
    "les_a1_present_simple",
    "les_a1_have_has",
    "les_a1_reading_skimming",
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```
