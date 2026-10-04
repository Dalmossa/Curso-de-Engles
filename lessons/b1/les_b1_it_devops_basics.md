# Lesson: DevOps Basics — CI/CD, Pipelines, Containers, Observability

**Lesson ID:** `les_b1_it_devops_basics`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `cite_only`
**Source:** `docs/arquitetura-limpa.md` + `docs/agile.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **CI/CD** | CI/CD | *Continuous Integration / Continuous Deployment* |
| **pipeline** | pipeline / esteira | *sequência automatizada: build → test → deploy* |
| **build** | build / compilação | *transforma código em artefato executável* |
| **deploy** | deploy / implantação | *coloca artefato em ambiente* |
| **container** | container | *ambiente isolado e portável (Docker)* |
| **image** | imagem | *template imutável do container* |
| **orchestration** | orquestração | *gerencia containers em escala (Kubernetes)* |
| **monitoring** | monitoramento | *coleta métricas de saúde do sistema* |
| **logging** | logging / logs | *registro de eventos para diagnóstico* |
| **tracing** | tracing / rastreamento | *segue requisição entre serviços* |
| **alerting** | alerting / alertas | *notifica quando métrica passa threshold* |
| **rollback** | rollback | *volta versão anterior em falha* |

### Mini-texto (áudio: `deferred_render`)

> **DevOps:** "**CI/CD pipeline**: push → **build** → unit tests → **container image** → **deploy** to staging → integration tests → **deploy** to prod."
>
> **Dev:** "**Rollback** strategy: blue/green or canary. If error rate > 1%, auto-rollback."
>
> **DevOps:** "**Observability**: **metrics** (latency, error rate, QPS), **logs** (structured JSON), **traces** (request flow). **Alerting**: p99 latency > 500ms → page on-call."
>
> **Dev:** "**Container** runs same image everywhere. **Orchestration**: K8s handles scaling, self-healing."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
**CI/CD** stands for:
| Slot | Value |
|------|-------|
| A | Code Integration / Code Deployment |
| B | **Continuous Integration / Continuous Deployment** |
| C | Container Image / Container Deploy |
| D | Code Inspection / Code Delivery |
**Key:** B
**br_pt_form:** "Integração Contínua / Deploy Contínuo"

### Item 2 — Vocabulary (Matching)
Match the DevOps practice to its purpose:
| Practice | Purpose |
|----------|---------|
| **CI** | a. Automate build + test on every push |
| **CD** | b. Automate deploy to environments |
| **Container** | c. Consistent runtime everywhere |
| **Observability** | d. See inside running system |
**Key:** CI→a, CD→b, Container→c, Observability→d
**br_pt_form:** "CI", "CD", "container", "observabilidade"

### Item 3 — Grammar: Passive for pipeline steps (fill-in-blank)
Complete with **passive voice**:
"The code ______ (push) to main. The image ______ (build) and ______ (push) to registry. Tests ______ (run) in pipeline. If pass, ______ (deploy) to staging."
**Key:** is pushed / is built / is pushed / are run / is deployed
**br_pt_form:** "é enviado", "é construída", "é enviada", "são executados", "é implantado"

---

## FASE 3 — Output Task [4 min]

### Speaking: Incident Response with DevOps (pares)
**Student A (On-call):** Describe the failure and response. Use: *CI/CD, pipeline, build, deploy, container, image, orchestration, monitoring, logging, tracing, alerting, rollback*.
**Student B (Lead):** Ask: "What was the pipeline stage?" "Was rollback automatic?"

**Script:**
> "**Pipeline** failed at **deploy** to prod. **Monitoring** alerted: error rate 5%. **Tracing** showed `PaymentService` timeout. **Logging** revealed DB connection pool exhausted. **Rollback** triggered automatically — **container** v2.3.0 → v2.2.1. **Alerting** paged on-call. **Postmortem** scheduled."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Canary deploy** means:
| Slot | Value |
|------|-------|
| A | Deploy to all users at once |
| B | **Deploy to small % first, then expand** |
| C | Deploy only on Fridays |
| D | Deploy without tests |
**Key:** B
**br_pt_form:** "deploy canário / para pequena % primeiro"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **passive** for a pipeline step:
| Slot | Value |
|------|-------|
| A | The tests **run** automatically. |
| B | The tests **are run** automatically. |
| C | The tests **running** automatically. |
| D | The tests **ran** automatically. |
**Key:** B
**br_pt_form:** "Os testes são executados automaticamente."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_devops_basics_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_devops_basics",
  "cefr_level": "B1",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (DevOps/Dev dialogue), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/arquitetura-limpa.md (Alta Books, all rights reserved) - used for CI/CD and container terminology",
      "docs/agile.md (Casa do Código, all rights reserved) - used for DevOps culture and pipeline concepts"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - DevOps terms are unprotectable industry concepts; definitions authored"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.passive_pipeline"
    ],
    "vocabulary": [
      "vocab.devops.ci_cd",
      "vocab.devops.pipeline",
      "vocab.devops.build",
      "vocab.devops.deploy",
      "vocab.devops.container",
      "vocab.devops.image",
      "vocab.devops.orchestration",
      "vocab.devops.monitoring",
      "vocab.devops.logging",
      "vocab.devops.tracing",
      "vocab.devops.alerting",
      "vocab.devops.rollback"
    ],
    "listening": [
      "listening.devops_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_communication"
  ],
  "estimated_time_min": 15
}
```