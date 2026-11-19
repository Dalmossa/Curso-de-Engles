# Lesson: Advanced Acronyms & Jargon

**Lesson ID:** `les_b1_it_acronyms_deep`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: revisão pós-incidente com siglas demais

> **Luiza (SRE, São Paulo):** "The SLI dipped to 99.6% for nine minutes. The SLO still holds over the month, and the SLA gives us four hours to recover."
>
> **Diego (product manager, remoto):** "Hold on — SLI, SLO and SLA sound the same to me. Which one is the number we actually chart?"
>
> **Priya (platform engineer):** "The SLI. It is the signal we measure. The SLO is the target we set for that signal, and the SLA is the promise we make outside the team."
>
> **Diego:** "Got it. And the outage itself?"
>
> **Luiza:** "We finished the RCA this morning. The root cause was a config push, and the ADR with the fix is already in the repo."
>
> **Priya:** "Good. IaC owns the rollback path now, SSO with MFA is enforced for production, and I added the owners to the RACI so nobody guesses who is accountable."
>
> **Diego:** "One last thing: the OKR says we cut MTTR this quarter. Put the KPI and the TCO estimate in the same note, please — I need the ROI for Friday."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Expansão | Leitura em pt-BR | Nota de uso prático |
|---|---|---|---|
| **SLI** | Service Level Indicator | indicador de nível de serviço | É o sinal medido: "The SLI is 99.6% this week." Soletre S-L-I. |
| **SLO** | Service Level Objective | objetivo de nível de serviço | É a meta interna para o sinal: "Our SLO is 99.9% over 30 days." |
| **SLA** | Service Level Agreement | acordo de nível de serviço | É o compromisso externo, com prazo: "The SLA gives us four hours." |
| **MTTR** | Mean Time To Recovery | tempo médio de recuperação | Olha para trás, depois do incidente: "We cut MTTR to 20 minutes." |
| **RCA** | Root Cause Analysis | análise de causa raiz | Nome do processo e do documento: "We finished the RCA." |
| **ADR** | Architecture Decision Record | registro de decisão de arquitetura | Guarda o motivo de uma escolha: "The ADR is in the repo." No plural, **ADRs**. |
| **RFC** | Request for Comments | pedido de comentários | Proposta aberta a revisão: "The RFC is open until Friday." |
| **IaC** | Infrastructure as Code | infraestrutura como código | "IaC makes the rollback repeatable." Na fala, o time costuma dizer I-A-C. |
| **IaaS** | Infrastructure as a Service | infraestrutura como serviço | Diga como uma palavra, /ˈaɪɑːs/: "We rent virtual machines through IaaS." |
| **PaaS** | Platform as a Service | plataforma como serviço | Também é palavra, /ˈpɑːz/: "PaaS hides the servers from us." |
| **SaaS** | Software as a Service | software como serviço | /sæs/, uma sílaba: "Our ticketing tool is SaaS." |
| **SRE** | Site Reliability Engineering | engenharia de confiabilidade de sites | Área ou pessoa: "I work in SRE." / "She is an SRE." |
| **OKR** | Objectives and Key Results | objetivos e resultados-chave | Planejamento de trimestre: "Our OKR is to cut MTTR." |
| **KPI** | Key Performance Indicator | indicador-chave de desempenho | O número que você acompanha: "Cycle time is a KPI here." |
| **ROI** | Return on Investment | retorno sobre investimento | /ˈroʊi/: "The ROI of the cache change is clear." |
| **TCO** | Total Cost of Ownership | custo total de propriedade | Some licença e suporte: "Compare the TCO, not just the price." |
| **SSO** | Single Sign-On | login único | Escreva o termo longo com hífen: "SSO is on for every tool." |
| **MFA** | Multi-Factor Authentication | autenticação em múltiplos fatores | "Production access requires MFA." |
| **PII** | Personally Identifiable Information | informação pessoal identificável | "Never paste PII into a ticket." Não escreva *PIIs*. |
| **RACI** | Responsible, Accountable, Consulted, Informed | matriz de responsabilidades | /ˈreɪsi/: "The RACI names one accountable owner." |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Our uptime is 99,9%." | "Our uptime is **99.9%**." | Em en-US o separador decimal é o ponto; a vírgula muda a leitura do número. |
| "The ADR's are in the repo." | "The **ADRs** are in the repo." | Plural de sigla leva **-s** direto; apóstrofo marca posse ou contração. |
| "The team is responsible **by** the release." | "The team is responsible **for** the release." | O adjetivo *responsible* combina com **for**, não com *by*. |
| "I work **with** SRE." | "I work **in** SRE." / "I am **an** SRE." | *in* apresenta a área; *an* apresenta a pessoa. *With* soa como uso de uma ferramenta. |
| "Can you explain **me** the RCA?" | "Can you explain the RCA **to me**?" | *Explain* pede o objeto explicado antes e o destinatário com **to**. |
| "We stored PIIs in the log." | "We stored **PII** in the log." | *PII* já é massa/abstração; a sigla não ganha **-s** no uso corrente. |
| "We need an alignment about the OKR." | "Let's **align on** the OKR." | O calque de "alinhamento" vira o verbo **align on** em inglês de trabalho. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (L1)

Você escreve a primeira linha do glossário de uma ADR. Qual definição soa natural em en-US?

| Opção | Frase |
|---|---|
| A | "An ADR is a record what explains a choice the team made." |
| B | **"An ADR is a record which explains a choice the team made."** |
| C | "An ADR is a record explains a choice the team made." |
| D | "An ADR is a record who explains a choice the team made." |

**Key:** B
*Which* retoma *a record* e liga a oração de definição; *what* não funciona depois de um substantivo, *who* é para pessoas e sem pronome relativo a frase fica incompleta.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural, mantendo a sigla pedida:

| Português (intenção) | Resposta esperada |
|---|---|
| "Nós terminamos a análise de causa raiz." | "We finished the RCA." |
| "O time é responsável pelo release." | "The team is responsible for the release." |
| "Você pode me explicar o ADR?" | "Can you explain the ADR to me?" |
| "Compare o custo total, não só o preço." | "Compare the TCO, not just the price." |

**Key:** We finished the RCA / The team is responsible for the release / Can you explain the ADR to me? / Compare the TCO, not just the price.
*RCA* entra com artigo, *responsible* pede **for**, *explain* envia o destinatário para depois de **to**, e *TCO* aparece sem artigo porque a comparação fala do conceito.

### Exercício 3 — Forma, plural e registro

Complete cada lacuna com a forma adequada:

1. "Two ____ are in the repo — one for the database, one for the cache." (**ADR**)
2. "The SLA targets ____ met, so the client is fine." (**are / is**)
3. "In the first mention, write 'multi-factor authentication (MFA)' and then use ____." (**MFA / MFAs**)
4. "The SLI is the signal; the ____ is the target we set for it." (**SLO / SLA**)

**Key:** 1) ADRs; 2) are; 3) MFA; 4) SLO.
O plural de sigla é só **-s**; em *SLA targets*, o núcleo é *targets* e pede verbo no plural; a sigla não recebe **-s** na segunda menção; e a meta interna é o **SLO**, não o acordo externo.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

We chart the SLI every minute, but the SLO is measured over thirty days.
The SLA promises 99.9% uptime, so one long outage breaks the agreement.
After the incident we wrote an RCA and filed the ADR with the fix in the repo.
Platform engineering owns IaC, and SSO with MFA protects production access.
The RACI says Luiza is accountable for the OKR, while Diego is consulted on the KPI.

### Foco articulatório para falantes de pt-BR

- **Letras isoladas (S-L-I, S-L-O, S-L-A, M-T-T-R, R-C-A, A-D-R, R-F-C, I-A-C):** cada letra é curta. Evite acrescentar vogal depois de consoante: /tiː/ não "tê", /diː/ não "dê".
- **A letra R em SRE e MTTR:** use /ɑːr/ da variedade americana; não substitua pelo /ʁ/ do pt-BR.
- **IaaS, PaaS e SaaS como palavra:** /ˈaɪɑːs/, /ˈpɑːz/ e /sæs/. Não soletre I-A-A-S nem P-A-A-S.
- **ROI e RACI:** /ˈroʊi/ e /ˈreɪsi/ saem como uma unidade só; o ditongo /oʊ/ e a vogal /eɪ/ precisam fechar antes da próxima consoante.
- **PII letra a letra:** /piː/ · /aɪ/ · /aɪ/, sem a vogal final do "pê" português na primeira letra.

### Prompt de produção (oral ou escrita)

Escreva um **briefing de 6 a 8 falas** para o canal do time depois de um incidente. No briefing você deve: usar pelo menos **8** das 20 siglas do glossário; expandir por extenso pelo menos **duas** delas na primeira menção; incluir uma pergunta de esclarecimento natural ("Can you clarify what ____ means here?"); usar **responsible for** em uma frase; manter pelo menos uma sigla soletrada e uma dita como palavra; e fechar com o próximo passo ligado a um OKR ou KPI. Depois leia em voz alta preservando a diferença entre letra isolada e palavra.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Qual sigla nomeia o sinal medido, e não a meta?
   A) SLO.  B) SLA.  C) **SLI.**  D) ADR.
   **Key:** C
   O SLI é a medição; o SLO é o alvo dessa medição e o SLA é o acordo com o cliente.

2. **Gramática (L1):** Qual frase está correta?
   A) "We published two ADR's."  B) **"We published two ADRs."**  C) "We published two ADR."  D) "We published two ADRs'." 
   **Key:** B
   O plural de uma sigla recebe **-s** sem apóstrofo, e o numeral *two* exige a forma plural.

3. **Registro (L1):** Você ouviu "RCA" e quer pedir a versão simples. Qual pergunta soa natural?
   A) "Explain me the RCA."  B) **"Can you explain the RCA to me?"**  C) "Can you explain me about RCA?"  D) "Explain to me what means RCA."
   **Key:** B
   *Explain* pede o objeto antes de **to me**; as outras opções replicam a construção do pt-BR.

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_acronyms_deep_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_acronyms_deep",
  "cefr_level": "B1",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "speaking"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.acronym_definition_clauses",
      "grammar.acronym_prepositions"
    ],
    "vocabulary": [
      "vocab.acronyms_corporate",
      "vocab.acronyms_deep_reliability",
      "vocab.acronyms_deep_platform",
      "vocab.acronyms_deep_governance"
    ],
    "listening": [
      "listening.acronyms_deep_briefing"
    ],
    "pronunciation": [
      "pronunciation.acronyms_deep_letter_vs_word"
    ],
    "reading": [
      "reading.acronyms_deep_glossary_scan",
      "reading.acronyms_deep_status_inference"
    ],
    "speaking": [
      "speaking.acronyms_deep_clarification"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a1_reading_skimming",
    "les_a2_reading_strategy",
    "les_a2_it_reading_strategy"
  ],
  "estimated_time_min": 15
}
```
