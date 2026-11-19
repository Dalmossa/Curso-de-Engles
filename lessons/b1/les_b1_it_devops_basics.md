# Lesson: DevOps Basics: CI/CD, Pipelines, Containers, Observability

**Lesson ID:** `les_b1_it_devops_basics`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: acompanhando um deploy canário depois do almoço

> **Bia (backend developer, Recife):** "I pushed the change at nine. Is the pipeline green yet?"
>
> **Rafael (release engineer, remote):** "Build passed and the image was pushed to the registry. It is in staging now."
>
> **Bia:** "Can we promote it to production before the stand-up?"
>
> **Rafael:** "Not yet. The canary is running at five percent, and the error rate is still above our target."
>
> **Caio (SRE, São Paulo):** "The alert fired on p99 latency. I checked the traces: the slow span is the database call."
>
> **Rafael:** "Then we roll back. The previous image is still in the registry, so the rollback is one command."
>
> **Bia:** "Agreed. I will write the rollback step in the runbook before the next attempt."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **pipeline** | pipeline / esteira de release | *Pipeline* é a sequência automática de etapas; não traduza como *chain*. |
| **build** | build / compilação | Funciona como substantivo e verbo: *the build passed*, *we build the image*. |
| **artifact** | artefato | Em en-US escreva *artifact* (não *artefact*); é o resultado do build. |
| **image** | imagem | A *image* é o modelo imutável; o *container* é a instância em execução. |
| **container** | container | Diga *the service runs in a container*; não tente um cognato em português. |
| **deploy** | deploy / implantação | *Deploy* é verbo e substantivo: *we deploy*, *the deploy finished*. |
| **promote** | promover para o próximo ambiente | Use *promote to staging/production*; *advance* soa vago em reunião de release. |
| **rollback** | rollback / reversão | Substantivo junto (*a rollback*); verbo separado (*we roll back*). |
| **canary** | release gradual / canário | *Canary* já basta: *we started a canary at five percent*. |
| **orchestrator** | orquestrador | O *orchestrator* agenda containers; *orchestration* é o conceito, não a ferramenta. |
| **metrics** | métricas | Números ao longo do tempo; um evento individual é *log*, não *metric*. |
| **logs** | logs / registros | *Log* também é verbo: *we logged the error*. |
| **traces** | traces / rastreamento de requisição | Um *trace* segue uma requisição entre serviços; não confunda com *tracking*. |
| **alert** | alerta | Diga *the alert fired*; *alarm* soa mais forte do que o sinal operacional. |
| **SLO** | objetivo de nível de serviço | *SLO* é a meta interna; *SLA* é o compromisso formal com o cliente. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "We **made** the deploy yesterday." | "We **deployed** yesterday." / "The **deploy** finished yesterday." | *Deploy* é verbo natural; *make a deploy* soa como tradução direta. |
| "The image was **deployed to the registry**." | "The image was **pushed to the registry**." | Imagem vai para o registry com *push*; código vai para um ambiente com *deploy*. |
| "We need to **rollback** the change." | "We need to **roll back** the change." / "We need a **rollback**." | O verbo é separado; o substantivo é junto. |
| "The alert **was fired** on p99." | "The alert **fired** on p99 latency." | *Fire* é intransitivo nesse uso; quem dispara é o monitoramento. |
| "**In** the dashboard we saw the spike." | "**On** the dashboard we saw the spike." | Painel e gráfico são superfícies: use *on*. |
| "The pipeline is **in green**." | "The pipeline is **green**." | Cor é adjetivo direto depois de *be*: sem *in*. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Passiva nas etapas do pipeline

Complete com a forma correta (passiva ou ativa, conforme o sujeito):

"The image ______ (build) after the tests ______ (run). If the canary ______ (pass), the release ______ (promote) to staging. If latency ______ (rise), the deploy ______ (roll back)."

**Key:** is built / are run / passes / is promoted / rises / is rolled back

A imagem e o release sofrem as ações, então pedem passiva; *canary* e *latency* praticam as ações e ficam na ativa. Note que *roll back* é verbo separado, mesmo na passiva: *is rolled back*.

### Exercício 2 — Vocabulário: função de cada termo

Relacione o termo à sua função em um pipeline:

| Termo | Função |
|---|---|
| **artifact** | a. resultado do build que seguirá para o registry |
| **image** | b. modelo imutável usado para criar containers |
| **registry** | c. serviço que guarda versões de imagens |
| **alert** | d. sinal disparado quando um limiar é passado |

**Key:** artifact→a, image→b, registry→c, alert→d

O *artifact* sai do build, a *image* é o modelo que origin containers, o *registry* armazena as versões e o *alert* avisa o time quando algo passa do limite.

### Exercício 3 — Transformação L1 → L2

Reescreva as intenções em inglês natural:

| Português (intenção) | Resposta esperada |
|---|---|
| "O build passou e a imagem foi enviada para o registro." | "The build passed and the image was pushed to the registry." |
| "O alerta disparou por latência p99." | "The alert fired on p99 latency." |
| "Vamos fazer rollback se a taxa de erro subir." | "We will roll back if the error rate goes up." |

**Key:** ver tabela.

*Pushed to the registry* é a combinação natural para imagens; *fired* vai com *alert* sem *was*; e *roll back* é o verbo, com *will* para a decisão tomada agora.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

The pipeline builds the image and pushes it to the registry.
The tests are run before the release is promoted to staging.
We watch the metrics on the dashboard during the canary.
The alert fired on p99 latency, so we rolled back the deploy.
Please check the traces and keep the previous image in the registry.

### Foco articulatório para falantes de pt-BR

- **/ˈpaɪpˌlaɪn/ em *pipeline***: a tônica está na primeira sílaba; evite *pi-PELINE*.
- **/ˈɑːrtɪfækt/ em *artifact* (en-US)**: a vogal do meio é /ɪ/ e a final é /æ/; não diga *artefact*.
- **/ˈiːmeɪdʒ/ em *image***: termine com /dʒ/, sem acrescentar a vogal final de *imagem*.
- **/ˈkænəri/ em *canary***: comece com /k/ e mantenha a tônica na primeira sílaba.
- **/piː ˈnaɪnti/ em *p99***: em reunião de operação, diga *p ninety-nine*.

### Prompt de produção (oral ou escrita)

Imagine que você está nos primeiros dez minutos de um deploy canário e precisa atualizar o canal do time em inglês. Escreva ou diga de **4 a 6 frases** em que você:

1. Nomeia pelo menos três termos do glossário (*build, image, registry, deploy*).
2. Usa **uma passiva** (*is built, was pushed, is promoted*).
3. Cita uma métrica e um sinal de observabilidade (*metrics, traces, dashboard, alert*).
4. Usa uma oração com **if** para dizer o que acontece se o limiar for passado (*we roll back*).
5. Termina com uma ação concreta para o *on-call engineer*.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** O colega diz "The image was pushed to the registry." O que aconteceu?
   A) O código foi implantado em produção.  B) A imagem foi enviada para o registro.  C) O alerta disparou por latência.  D) A release foi revertida.
   **Key:** B

2. **Gramática (L1):** Qual frase está na passiva correta para uma etapa do pipeline?
   A) "The tests run automatically in the pipeline."  B) "The tests are run automatically in the pipeline."  C) "The tests is run automatically in the pipeline."  D) "The tests running automatically in the pipeline."
   **Key:** B

3. **Vocabulário (L1):** Qual frase usa o verbo *roll back* corretamente?
   A) "We made a rollback."  B) "We roll back the deploy if the error rate goes up."  C) "We rollbacked the deploy."  D) "We did a roll back manually."
   **Key:** B

---

**Listening input:** `deferred_render` — o diálogo da FASE 1 é texto autoral, não um clipe renderizado.
**Pack ID:** `pack_les_b1_it_devops_basics_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_devops_basics",
  "cefr_level": "B1",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "reading", "pronunciation", "speaking"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.devops_passive_pipeline"
    ],
    "vocab": [
      "vocab.devops.release_pipeline",
      "vocab.devops.observability_signals"
    ],
    "reading": [
      "reading.devops_pipeline_skim",
      "reading.devops_incident_detail"
    ],
    "pronunciation": [
      "pronunciation.devops_tech_stress"
    ]
  },
  "prereq_lessons": [
    "les_a1_reading_skimming",
    "les_a2_it_reading_strategy",
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```
