# Lesson: Architecture Discussions

**Lesson ID:** `les_b1_it_architecture_vocab`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `adapt_with_attribution`
**Source:** S16 (Kubernetes docs, CC-BY-4.0), S05 (Google Cloud Well-Architected, CC-BY-4.0), S01 (Google Style Guide, CC-BY-4.0) — `sourced_external`
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **architecture** | arquitetura | *estrutura de alto nível do sistema* |
| **component** | componente | *parte independente e substituível* |
| **service** | serviço | *unidade de funcionalidade de negócio* |
| **microservice** | microsserviço | *serviço pequeno, autonomamente implantável* |
| **monolith** | monolito | *aplicação única, tudo junto* |
| **coupling** | acoplamento | *grau de dependência entre partes* |
| **cohesion** | coesão | *o quão relacionadas são as responsabilidades* |
| **latency** | latência | *tempo de resposta* |
| **throughput** | vazão / throughput | *requisições por segundo* |
| **scalability** | escalabilidade | *capacidade de crescer sob carga* |
| **availability** | disponibilidade | *uptime, resiliência a falhas* |
| **trade-off** | troca / compensação | *ganha aqui, perde ali* |

### Mini-texto (áudio: `deferred_render`)

> **Architect:** "We're moving from **monolith** to **microservices**. **Coupling** between modules is too high — a change in billing breaks shipping."
>
> **Tech Lead:** "**Trade-off**: **latency** increases (network calls), but **scalability** and **availability** improve. Each **service** owns its data. **Cohesion** up — billing only does billing."
>
> **Architect:** "Define **component** boundaries by **business capability**. Use async messaging for **decoupling**. **SLA**: 99.9% **availability**, p99 **latency** < 200ms."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
**Coupling** refers to:
| Slot | Value |
|------|-------|
| A | How fast the system responds |
| B | **Degree of dependence between modules** |
| C | Number of servers |
| D | Code style consistency |
**Key:** B
**br_pt_form:** "acoplamento / grau de dependência"

### Item 2 — Vocabulary (Matching)
Match the architecture style to its trait:
| Style | Trait |
|-------|-------|
| **Monolith** | a. Single deploy, shared DB |
| **Microservices** | b. Independent deploys, own data |
| **Modular monolith** | c. Separate modules, single deploy |
**Key:** Monolith→a, Microservices→b, Modular monolith→c
**br_pt_form:** "monolito", "microsserviços", "monolito modular"

### Item 3 — Grammar: Passive voice for design decisions (fill-in-blank)
Complete with **passive voice**:
"The system ______ (design) for high availability. Services ______ (deploy) independently. Data ______ (own) by each service."
**Key:** is designed / are deployed / is owned
**br_pt_form:** "foi projetado", "são implantados", "é de propriedade"

---

## FASE 3 — Output Task [4 min]

### Speaking: Architecture Decision Defense (pares)
**Student A (Architect):** Propose a change. Use: *architecture, component, service, microservice, monolith, coupling, cohesion, latency, throughput, scalability, availability, trade-off*.
**Student B (Reviewer):** Challenge with 2 questions. Summarize the decision.

**Topics:**
- Split `UserService` into `AuthService` + `ProfileService`
- Introduce message queue for async order processing
- Move caching to dedicated `CacheService`

**Example (Architect):** "We should extract **AuthService** from the **monolith**. **Coupling** is high — auth changes break profile. **Trade-off**: added **latency** (network hop), but **cohesion** improves. **Availability**: auth can scale independently."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**High cohesion** means:
| Slot | Value |
|------|-------|
| A | Module does many unrelated things |
| B | **Module does one thing well** |
| C | Module has many dependencies |
| D | Module is tightly coupled |
**Key:** B
**br_pt_form:** "alta coesão / módulo faz uma coisa bem"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **passive** for a design decision:
| Slot | Value |
|------|-------|
| A | We **design** the API for scale. |
| B | The API **is designed** for scale. |
| C | The API **designing** for scale. |
| D | The API **designed** for scale. |
**Key:** B
**br_pt_form:** "A API é projetada para escala."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_architecture_vocab_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_architecture_vocab",
  "cefr_level": "B1",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S16",
        "title": "Kubernetes Documentation - Architecture Concepts",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "microservice vs monolith terminology, component boundaries, coupling/cohesion definitions; adapted for B1 level",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S05",
        "title": "Google Cloud Well-Architected Framework - Reliability & Performance",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "latency, throughput, availability, scalability as architecture quality attributes; trade-off framing",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S01",
        "title": "Google Developer Documentation Style Guide",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "technical vocabulary register for architecture discussions; tone and precision guidance",
        "attribution_location": "section 'Fontes e Atribuição' below"
      }
    ],
    "authored_material": "all exercises, the mini-text (Architect/Tech Lead dialogue), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of architecture discussion register"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - terminology adapted, not quoted; all sources CC-BY permissive"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.passive_design_decisions"
    ],
    "vocabulary": [
      "vocab.arch.architecture",
      "vocab.arch.component",
      "vocab.arch.service",
      "vocab.arch.microservice",
      "vocab.arch.monolith",
      "vocab.arch.coupling",
      "vocab.arch.cohesion",
      "vocab.arch.latency",
      "vocab.arch.throughput",
      "vocab.arch.scalability",
      "vocab.arch.availability",
      "vocab.arch.trade_off"
    ],
    "listening": [
      "listening.arch_context"
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

---

## Fontes e Atribuição

- **S16** Kubernetes Documentation, licensed under CC-BY-4.0. Adapted for microservice architecture terminology.
- **S05** Google Cloud Well-Architected Framework, licensed under CC-BY-4.0. Adapted for quality attributes and trade-offs.
- **S01** Google Developer Documentation Style Guide, licensed under CC-BY-4.0. Adapted for technical register.