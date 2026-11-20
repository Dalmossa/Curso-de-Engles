# Lesson: Full Jargon Fluency

**Lesson ID:** `les_b2_it_jargon_mastery`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: uma revisão de incidente com siglas explicadas no momento

> **Marina (staff engineer):** "Before the review, let's align on the numbers. Our **SLA** promises 99.9% availability, but the **SLI** we track is successful requests over total requests."
>
> **Rafael (backend engineer):** "So the **SLO** is our internal target, and the **SLA** is the promise to the customer?"
>
> **Marina:** "Exactly. When the error budget burns too fast, we freeze feature work. Last week our **P95** latency doubled, and our **MTTR** reached forty minutes."
>
> **Rafael:** "Forty minutes? I thought the runbook set an **RTO** of fifteen minutes and an **RPO** of five minutes of data."
>
> **Marina:** "Those are the targets. The real recovery was slower because the backup restore was manual. We also hit the gateway's **QPS** limit during the campaign."
>
> **Rafael:** "Understood. In the write-up I'll spell out **CI/CD** and **SSO** on first use, so the product manager can follow it."
>
> **Marina:** "Good. Give the acronym once, then use the short name — and never assume everyone reads the same meaning into it."
>
> **Rafael:** "Agreed. I'll add a one-line glossary under the summary and keep the rest in plain language."

### Glossário contrastivo (pt-BR ↔ en-US) — siglas escolhidas e definidas nesta lição

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático (definição autoral) |
|---|---|---|
| **SLA** (Service Level Agreement) | acordo de nível de serviço | O compromisso formal com o cliente; é externo e negociado, não é uma meta do time. |
| **SLO** (Service Level Objective) | objetivo de nível de serviço | A meta interna que o time escolhe para ficar abaixo do SLA e preservar margem. |
| **SLI** (Service Level Indicator) | indicador de nível de serviço | A medida observada — aqui, requisições bem-sucedidas divididas pelo total. |
| **RTO** (Recovery Time Objective) | objetivo de tempo de recuperação | Quanto tempo o sistema pode ficar fora antes de violar o plano; é um alvo, não um relato. |
| **RPO** (Recovery Point Objective) | objetivo de ponto de recuperação | Quanto dados a empresa aceita perder ao restaurar; responde a "de quando é o backup?". |
| **MTTR** (Mean Time to Recovery) | tempo médio de recuperação | A média observada entre o início da falha e o serviço de volta; descreve o que aconteceu. |
| **P95** (95th percentile) | percentil 95 | O valor abaixo do qual 95% das observações ficam; em latência, ignora os 5% mais lentos. |
| **QPS** (Queries Per Second) | consultas por segundo | A taxa de requisições recebidas por segundo; ajuda a explicar a carga no gateway. |
| **CI/CD** (Continuous Integration / Continuous Delivery) | integração e entrega contínuas | A prática de integrar mudanças com frequência e preparar cada versão para entrega segura. |
| **SSO** (Single Sign-On) | login único / autenticação única | Uma credencial corporativa que abre vários sistemas, sem senha nova para cada um. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Tempo de resposta" → "response time" para qualquer número | "P95 latency" quando você fala do percentil; "response time" quando fala da média | *Latency* é o atraso medido; *response time* é o rótulo geral. A sigla diz **qual** número foi olhado. |
| "Disponibilidade" → "availability" como se fosse a meta | "Our SLA promises 99.9% availability; our SLO is 99.95%" | *Availability* é o que se observa; o compromisso é o **SLA**, a meta interna é o **SLO**. |
| "Meta de serviço" → "service goal" | "SLO" | Em revisão de incidente, *service goal* soa vago; o time espera o termo curto com expansão na primeira menção. |
| "Índice de serviço" → "service index" | "SLI" | *Service index* sugere um catálogo; o **SLI** é a razão que você mede. |
| "Tempo médio de conserto" → "mean repair time" | "MTTR" | *Repair* foca no conserto; a sigla usada em revisão cobre a recuperação completa do serviço. |
| "Consultas por segundo" → "consults per second" | "QPS" / "queries per second" | *Consults* não é a palavra técnica para carga de gateway; *queries* é o termo corrente. |
| "Login único" → "unique login" | "SSO (single sign-on)" | *Unique login* soa como "senha só sua"; **SSO** descreve uma credencial reaproveitada. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (medida x meta x promessa)

Em "Our SLA promises 99.9%, but the SLI we track is successful requests over total requests", qual termo é a **medida observada**?

| Opção | Termo |
|---|---|
| A | SLO — a meta interna do time |
| B | **SLI — a razão que o time mede** |
| C | SLA — o compromisso com o cliente |
| D | RTO — o alvo de tempo de recuperação |

**Key:** B

### Exercício 2 — Complete com as siglas do glossário

Preencha com **SLA, SLO, SLI, RTO, RPO, MTTR, P95** ou **QPS**:

1. "Our ______ promises 99.9% availability to the customer."
2. "We measure the ______ as successful requests divided by total requests."
3. "We hold the ______ at 99.95% so the error budget lasts the quarter."
4. "The runbook sets an ______ of fifteen minutes and an ______ of five minutes of data."
5. "After the incident, the ______ latency doubled and our ______ reached forty minutes."

**Key:** 1) SLA; 2) SLI; 3) SLO; 4) RTO, RPO; 5) P95, MTTR — *promise* pede SLA, *measure* pede SLI, *hold* indica meta interna (SLO), e *runbook* traz os alvos de recuperação.

### Exercício 3 — Transformação L1 → L2 (dizer o número e a sigla)

| Português (intenção) | Resposta esperada |
|---|---|
| "Nosso tempo de resposta no percentil 95 dobrou depois do deploy." | "Our P95 latency doubled after the deploy." |
| "O gateway recebeu oitocentas consultas por segundo na campanha." | "The gateway handled eight hundred QPS during the campaign." |
| "O tempo médio de recuperação foi de vinte minutos." | "Our MTTR was twenty minutes." |
| "Podemos perder até cinco minutos de dados." | "Our RPO is five minutes." |

**Key:** ver tabela — o número entra com a sigla que o interpreta: *P95* para o percentil, *QPS* para a taxa, *MTTR* para a média observada e *RPO* para a perda de dados aceita.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
Our SLA promises 99.9% availability, but the SLI we track is successful requests over total requests.
We keep the SLO at 99.95% so the error budget lasts to the end of the quarter.
After the incident, the P95 latency doubled and our MTTR reached forty minutes.
The runbook sets an RTO of fifteen minutes and an RPO of five minutes of lost data.
At peak traffic the gateway handled eight hundred QPS before the CI/CD and SSO changes rolled out.

### Foco articulatório para falantes de pt-BR

- **SLA /es el eɪ/ · SLO /es el oʊ/ · SLI /es el aɪ/**: letra por letra, nunca como palavra; a última vogal desliza (/eɪ/, /oʊ/, /aɪ/) — não diga "sla" nem "sli" com /i/ curto.
- **RTO /ɑːr tiː oʊ/ · RPO /ɑːr piː oʊ/**: o /ɑːr/ inicial tem a ponta da língua recolhida, sem o "r" vibrado do pt-BR; mantenha /tiː/ e /piː/ longos.
- **MTTR /em tiː tiː ɑːr/**: quatro letras, com dois /tiː/ distintos; não funda os dois "t" nem leia como /mɪtər/.
- **P95 /piː naɪntiː faɪv/**: leia *ninety*, não "noventa"; /naɪntiː/ termina em /iː/ e /faɪv/ termina em /v/.
- **QPS /kjuː piː es/**: comece com /kjuː/ (com o deslize /j/), não com /kiː/; a última letra é /es/.
- **CI/CD /siː aɪ siː diː/**: letra por letra; evite /tʃiː/ ("chi"), porque C em inglês é /siː/.
- **SSO /es es oʊ/**: letra por letra na leitura em voz alta; alguns times dizem /soʊ/ como palavra, mas aqui use as três letras.
- **/v/ em *availability* e *five***: lábio inferior encostado nos dentes de cima; não arredonde como /w/.
- **/ð/ em *the* e *other***: ponta da língua entre os dentes com voz; evite /d/ ("de").

### Prompt de produção (oral ou escrita)

Você apresenta um resumo de incidente para um gerente de produto que não é técnico. Escreva 6–8 linhas (ou diga as mesmas informações em voz alta) e inclua:

1. pelo menos **seis siglas** do glossário desta lição;
2. a **expansão** de cada sigla na primeira vez que aparece;
3. uma frase que separe claramente **promessa (SLA)**, **meta interna (SLO)** e **medida (SLI)**;
4. um número de **P95 latency** e um número de **QPS**;
5. os valores de **RTO** e **RPO** com as unidades corretas (minutos de tempo e minutos de dados);
6. um **MTTR** observado e a diferença entre ele e o RTO do runbook;
7. uma explicação em **plain language** do que **SSO** faz pelo usuário;
8. uma última frase sem nenhuma sigla, dizendo apenas o impacto para o cliente.

Inclua um detalhe real do seu contexto (serviço, deploy, fila, gateway ou janela de manutenção).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em "The SLI is 99.95%, so our SLO is safe", o SLI é:
   A) a meta interna  B) **a medida observada**  C) o contrato com o cliente  D) o tempo de recuperação
   **Key:** B

2. **Vocabulário (L1):** Qual é a expansão correta de **RPO**?
   A) **Recovery Point Objective — quanto dado podemos perder**  B) Recovery Process Objective — quanto tempo leva o processo  C) Requests Per Operator — quantas consultas cada operador abre  D) Risk Priority Order — a ordem de risco do incidente
   **Key:** A

3. **Pronúncia (L1):** Como você lê **MTTR** em voz alta numa revisão?
   A) **/em tiː tiː ɑːr/**  B) /mɪtər/  C) /maɪtr/  D) /em tiː tiː iː/
   **Key:** A

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_b2_it_jargon_mastery_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_jargon_mastery",
  "cefr_level": "B2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "rendered_tts_static",
  "listening_input_status": "rendered_tts_static - static TTS audio clips rendered for corpus listening and pending practice items",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.acronym_expansion_appositives",
      "grammar.technical_comparisons"
    ],
    "vocabulary": [
      "acronyms_corporate",
      "vocab.it_jargon.sla_slo_sli",
      "vocab.it_jargon.recovery_targets",
      "vocab.it_jargon.performance_metrics",
      "vocab.it_jargon.delivery_access"
    ],
    "listening": [
      "listening.jargon_review_context"
    ],
    "pronunciation": [
      "pronunciation.initialisms_letter_by_letter"
    ],
    "reading": [
      "reading.jargon_status_note"
    ],
    "writing": [
      "writing.jargon_plain_language_summary"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_corpus_intro",
    "les_a2_it_reading_strategy",
    "les_a2_it_typescript_basics",
    "les_a2_it_algorithms_basics",
    "les_b1_it_acronyms_deep"
  ],
  "estimated_time_min": 15
}
```
