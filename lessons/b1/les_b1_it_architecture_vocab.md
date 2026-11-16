# Lesson: Architecture Discussions

**Lesson ID:** `les_b1_it_architecture_vocab`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US).
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: discutindo uma mudança de arquitetura

> **Lívia (architect):** "Our checkout module is tightly coupled to billing, so every change becomes risky. I suggest that the payment logic be extracted into a separate service."
>
> **Diego (tech lead):** "I agree. If responsibilities are clearly separated, the system can be scaled more safely. But we should remember that network calls will be introduced, so latency may increase."
>
> **Lívia:** "That's the trade-off. Availability can be improved if each service is deployed independently, but observability must be planned from the start."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso em TI |
|---|---|---|
| **architecture** | arquitetura | Estrutura de alto nível de componentes e decisões. |
| **component** | componente | Parte com responsabilidade definida dentro do sistema. |
| **service** | serviço | Unidade que oferece uma capacidade (ex.: pagamento, autenticação). |
| **monolith** | monolito | Aplicação implantada como uma unidade única. |
| **microservice** | microsserviço | Serviço pequeno, implantado de forma independente. |
| **coupling** | acoplamento | Grau de dependência entre módulos; alto acoplamento dificulta mudanças. |
| **cohesion** | coesão | Quanto as responsabilidades de um módulo pertencem ao mesmo propósito. |
| **scalability** | escalabilidade | Capacidade de lidar com aumento de carga. |
| **availability** | disponibilidade | Capacidade de permanecer acessível/operante. |
| **trade-off** | compensação/troca | Ganho em um aspecto com custo em outro. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "The system **was projected** for high availability." | "The system **was designed** for high availability." | Falso cognato: *projetar* (desenhar/planejar) → *design*, não *project* nesse sentido. |
| "We will **implant** the new service tomorrow." | "We will **deploy** the new service tomorrow." | *Implantar* em TI geralmente corresponde a *deploy/roll out*. |
| "This service is **more performatic**." | "This service **performs better**." / "This service has **better performance**." | *Performatic* não é usado em inglês; use *performance/perform*. |
| "The modules are very **acoplated**." | "The modules are **tightly coupled**." | Adjetivo correto: *coupled*; advérbio comum: *tightly/loosely*. |
| Omitir agente/voz: "Decided to split the monolith." (sem sujeito) | "**It was decided** to split the monolith." / "**We decided** to split the monolith." | Em decisões formais, voz passiva ou sujeito explícito evita ambiguidade. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Vocabulário (associação)

Associe o termo à ideia correta:

| Termo | Ideia |
|---|---|
| **Monolith** | a. Single deployable application |
| **Microservice** | b. Independently deployable service |
| **Coupling** | c. Degree of dependency between modules |
| **Cohesion** | d. How focused a module's responsibilities are |

**Chave:** Monolith→a, Microservice→b, Coupling→c, Cohesion→d

### Exercício 2 — Gramática (voz passiva para decisões de design)

Transforme para a voz passiva, mantendo o foco na decisão/artefato:

| Ativa | Passiva esperada |
|---|---|
| "We designed the service for high availability." | "The service **was designed** for high availability." |
| "The team deploys each component independently." | "Each component **is deployed** independently." |
| "Engineers must monitor the new API carefully." | "The new API **must be monitored** carefully." |

### Exercício 3 — Escolha contextual

Complete com **scalability**, **latency**, **trade-off**:

1. "Moving to microservices can improve ____ because each service can grow independently." → **scalability**
2. "Adding network hops may increase ____." → **latency**
3. "Better isolation is a benefit, but more complexity is the ____." → **trade-off**

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

The checkout module was redesigned to reduce tight coupling between services. Each component is deployed independently to improve availability and scalability. The payment logic was extracted into a separate service with clear responsibilities. Higher network latency was accepted as a trade-off for better resilience. The new architecture must be monitored carefully during the rollout.

### Foco articulatório para falantes de pt-BR

- **/t/ e /d/ em final de palavra** (*designed, extracted, accepted*): evite vogal epentética ("designedi").
- **/ð/ em *the***: fricativa dental sonora, sem virar /d/.
- **/sk/ em *scalability***: ataque consonantal limpo, sem "escala-".
- **Ênfase em termos-chave**: *COUpling*, *coHEsion*, *scalabiLIty*, *availaBIliTy*.

### Prompt de produção (oral ou escrita)

Em 60–90 segundos, defenda uma decisão de arquitetura (ex.: separar um módulo, introduzir cache, adotar fila). Use pelo menos **3 formas passivas** (ex.: *was designed, is deployed, must be monitored*) e mencione **um trade-off** explícito.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Gramática (L1):** Escolha a forma passiva correta: "The service ___ independently."  
   A) deploys  B) **is deployed**  C) deploying  D) deployed  
   **Chave:** B

2. **Vocabulário (L1):** *High cohesion* significa:  
   A) muitas dependências externas  B) **responsabilidades focadas em um propósito**  C) alta latência  D) implantação única  
   **Chave:** B

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_architecture_vocab_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_architecture_vocab",
  "cefr_level": "B1",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material; no external source text reproduced or adapted.",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.passive_design_decisions"
    ],
    "vocabulary": [
      "vocab.architecture.architecture",
      "vocab.architecture.component",
      "vocab.architecture.service",
      "vocab.architecture.monolith",
      "vocab.architecture.microservice",
      "vocab.architecture.coupling",
      "vocab.architecture.cohesion",
      "vocab.architecture.scalability",
      "vocab.architecture.availability",
      "vocab.architecture.trade_off"
    ],
    "listening": [
      "listening.architecture_context"
    ],
    "pronunciation": [
      "pronunciation.consonant_clusters",
      "pronunciation.th_voiced"
    ],
    "speaking": [
      "speaking.architecture_decision"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_reading_strategy"
  ],
  "estimated_time_min": 15
}
```
