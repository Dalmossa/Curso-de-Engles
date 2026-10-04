# Lesson: Advanced Acronyms & Jargon

**Lesson ID:** `les_b1_it_acronyms_deep`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `cite_only`
**Source:** `docs/Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md` (Bônus1) (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| Acronym | Full Form | PT-BR | Contexto |
|---------|-----------|-------|----------|
| **API** | Application Programming Interface | API | *interface de programação* |
| **SDK** | Software Development Kit | SDK | *kit de desenvolvimento* |
| **CI/CD** | Continuous Integration / Continuous Deployment | CI/CD | *integração e deploy contínuos* |
| **SLA** | Service Level Agreement | SLA / acordo de nível de serviço | *contrato de disponibilidade* |
| **SLO** | Service Level Objective | SLO / objetivo de nível de serviço | *meta interna de confiabilidade* |
| **SLI** | Service Level Indicator | SLI / indicador de nível de serviço | *métrica medida (latência, erro)* |
| **RTO** | Recovery Time Objective | RTO / objetivo de tempo de recuperação | *tempo máx. para restaurar* |
| **RPO** | Recovery Point Objective | RPO / objetivo de ponto de recuperação | *perda de dados aceitável* |
| **MTTR** | Mean Time To Recovery | MTTR / tempo médio de recuperação | *tempo médio para corrigir* |
| **MTBF** | Mean Time Between Failures | MTBF / tempo médio entre falhas | *intervalo médio entre incidentes* |
| **TTL** | Time To Live | TTL / tempo de vida | *expiração de cache/DNS* |
| **QPS** | Queries Per Second | QPS / consultas por segundo | *taxa de requisições* |
| **OOM** | Out Of Memory | OOM / sem memória | *erro de memória esgotada* |
| **NPE** | Null Pointer Exception | NPE / exceção de ponteiro nulo | *erro de referência nula* |
| **DTO** | Data Transfer Object | DTO / objeto de transferência | *objeto simples para transporte* |
| **ORM** | Object-Relational Mapping | ORM / mapeamento objeto-relacional | *camada de persistência* |

### Mini-texto (áudio: `deferred_render`)

> **Dev:** "Our **SLA** is 99.9% uptime. Current **SLI**: p99 latency 180ms, error rate 0.05%. **SLO** target: p99 < 200ms, error < 0.1%."
>
> **Lead:** "**RTO** 30 min, **RPO** 5 min. **MTTR** last incident: 45 min — above target. **MTBF**: 14 days."
>
> **Dev:** "**CI/CD** pipeline: build → test → staging → prod. **TTL** for cache: 5 min. **QPS** peak: 12k."
>
> **Lead:** "Watch **OOM** on worker — **NPE** in `OrderDTO` mapping. **ORM** lazy loading causing extra queries."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
**SLA** vs **SLO** vs **SLI** — which is the **measured metric**?
| Slot | Value |
|------|-------|
| A | SLA |
| B | SLO |
| C | **SLI** |
| D | RTO |
**Key:** C
**br_pt_form:** "SLI / indicador de nível de serviço"

### Item 2 — Vocabulary (Matching)
Match the acronym to its meaning:
| Acronym | Meaning |
|---------|---------|
| **RTO** | a. Time to restore service |
| **RPO** | b. Acceptable data loss |
| **MTTR** | c. Average time to fix |
| **MTBF** | d. Average time between failures |
**Key:** RTO→a, RPO→b, MTTR→c, MTBF→d
**br_pt_form:** "objetivo de tempo de recuperação", "objetivo de ponto de recuperação", "tempo médio de recuperação", "tempo médio entre falhas"

### Item 3 — Grammar: Relative clauses for definitions (fill-in-blank)
Complete with **who / which / that / whose**:
"A **DTO** is an object ______ carries data between layers. **ORM** is a tool ______ maps objects to tables. An **SLA** is a contract ______ defines uptime."
**Key:** that / which / that
**br_pt_form:** "que", "que", "que"

---

## FASE 3 — Output Task [4 min]

### Speaking: Incident Briefing (pares)
**Student A (On-call):** Brief the team on current system health. Use at least **8 acronyms**: *API, SDK, CI/CD, SLA, SLO, SLI, RTO, RPO, MTTR, MTBF, TTL, QPS, OOM, NPE, DTO, ORM*.
**Student B (Lead):** Ask 2 clarifying questions. Repeat back the key metrics.

**Template:**
> "Current **SLI**: p99 latency 180ms, error rate 0.05%. **SLO** target met. **SLA** 99.9% — on track. **RTO** 30min, **RPO** 5min. Last incident **MTTR** 45min (target 30). **MTBF** 14 days. **CI/CD** green. **QPS** peak 12k. **TTL** cache 5min. No **OOM** / **NPE** today."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**MTTR** stands for:
| Slot | Value |
|------|-------|
| A | Mean Time To Release |
| B | **Mean Time To Recovery** |
| C | Maximum Time To Repair |
| D | Minimum Time To Respond |
**Key:** B
**br_pt_form:** "tempo médio de recuperação"

### Item 2 — Grammar (L1, adaptive)
Choose the correct relative pronoun:
| Slot | Value |
|------|-------|
| A | An API **who** connects services. |
| B | An API **which** connects services. |
| C | An API **whose** connects services. |
| D | An API **whom** connects services. |
**Key:** B
**br_pt_form:** "Uma API que conecta serviços."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_acronyms_deep_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_acronyms_deep",
  "cefr_level": "B1",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (Dev/Lead briefing), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md (BaixeLivros notice applies) - Bônus1: acronym list; used for frequency and selection only, not content reproduction"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - acronyms are unprotectable abbreviations; expansions authored"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.relative_clauses_definitions"
    ],
    "vocabulary": [
      "vocab.acronym.api",
      "vocab.acronym.sdk",
      "vocab.acronym.ci_cd",
      "vocab.acronym.sla",
      "vocab.acronym.slo",
      "vocab.acronym.sli",
      "vocab.acronym.rto",
      "vocab.acronym.rpo",
      "vocab.acronym.mttr",
      "vocab.acronym.mtbf",
      "vocab.acronym.ttl",
      "vocab.acronym.qps",
      "vocab.acronym.oom",
      "vocab.acronym.npe",
      "vocab.acronym.dto",
      "vocab.acronym.orm"
    ],
    "listening": [
      "listening.acronym_context"
    ],
    "pronunciation": [
      "pronunciation.acronyms"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_communication"
  ],
  "estimated_time_min": 15
}
```