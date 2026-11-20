# Lesson: BDD Specifications: Given-When-Then, Acceptance Criteria, Scenario Writing

**Lesson ID:** `les_b1_it_bdd_specs`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: escrevendo critérios de aceite antes da entrega

> **Marina (product owner, São Paulo):** "Let's write the acceptance criteria for the password-reset story before we hand it to QA."
>
> **Caio (QA engineer, Recife):** "Good. What has to be true before the user clicks anything?"
>
> **Marina:** "The reset link must be valid and no older than thirty minutes."
>
> **Bia (backend developer, remote):** "Then we can write: **Given** a valid reset link, **When** the user submits a new password, **Then** the login page opens."
>
> **Caio:** "I would add a second scenario: the link has expired, so the page shows a clear error."
>
> **Marina:** "Let's put both scenarios in one **feature file** and agree on the words *valid link* and *expired link*."
>
> **Bia:** "Agreed. The feature file becomes our **living documentation**: QA and dev read the same examples."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **acceptance criteria** | critérios de aceite | Use sempre o plural quando a história tem várias condições; *an acceptance criterion* é uma condição só. |
| **scenario** | cenário | Um exemplo concreto de comportamento — não é uma descrição genérica do sistema. |
| **feature file** | arquivo de feature | O arquivo `.feature` guarda cenários; diga *feature file*, não *feature archive*. |
| **given / when / then** | dado / quando / então | As três palavras introduzem pré-condição, ação e resultado observável, nessa ordem. |
| **rule** | regra | A generalização que os exemplos ilustram; escreva *Rule:* antes dos cenários quando ajudar. |
| **step definition** | definição de passo | É o código que executa um passo; não confunda com o texto do cenário. |
| **example** | exemplo | Um caso específico com dados concretos, como "link com 15 minutos". |
| **edge case** | caso-limite | Situação fora do caminho normal, como um link expirado; BDD deve nomeá-la. |
| **living documentation** | documentação viva | Especificação executável que acompanha o código; não é um PDF parado. |
| **observable outcome** | resultado observável | O que dá para verificar na tela ou na resposta da API, sem abrir o código. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "The system **return** a receipt." | "The system **returns** a receipt." | *System* é sujeito de 3ª pessoa do singular; o presente simples leva *-s*. |
| "The customer **have** a valid token." | "The customer **has** a valid token." | Em um passo *Given*, o estado atual usa presente simples com *has*. |
| "We write the **acceptance criterion** for the whole story." | "We write the **acceptance criteria** for the whole story." | Várias condições pedem o plural; o singular serve para uma condição isolada. |
| "Let's discuss **about** the scenario." | "Let's discuss the scenario." | *Discuss* é transitório em inglês: não precisa de *about*. |
| "The **feature archive** has two scenarios." | "The **feature file** has two scenarios." | O termo do ferramental é *feature file*. |
| "A scenario describes **anything that might happen**." | "A scenario describes **one concrete example**." | Cenário útil é específico e verificável, não uma lista de possibilidades. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Gramática: presente simples nos passos

Complete com a forma correta dos verbos entre parênteses:

"**Given** the customer ______ (have) a valid order. **When** the customer ______ (send) the request. **Then** the system ______ (show) a receipt."

| Opção | Resposta |
|---|---|
| A | have / send / show |
| B | **has / sends / shows** |
| C | is having / is sending / is showing |
| D | has / send / showed |

**Key:** B

*The customer* e *the system* são sujeitos de 3ª pessoa do singular, então os três verbos recebem *-s* no presente simples. A opção A ignora a concordância, C troca um estado estável por ações temporárias e D mistura tempos.

### Exercício 2 — Vocabulário: qual é o artefato?

| Opção | Frase |
|---|---|
| A | A step definition. |
| B | **Acceptance criteria.** |
| C | A sprint review. |
| D | A database index. |

**Key:** B

A pergunta pedia "condições que definem quando a história está pronta" — isso é *acceptance criteria*. *Step definition* é código de execução, *sprint review* é reunião e *database index* é estrutura de consulta.

### Exercício 3 — Reescrita L1 → L2

| Português (intenção) | Resposta esperada |
|---|---|
| "Nós escrevemos os critérios de aceite antes do sprint." | "We write the acceptance criteria before the sprint." |
| "O cenário mostra um exemplo concreto de comportamento." | "The scenario shows a concrete example of behavior." |

**Key:** ver tabela.

Nas duas frases, o presente simples descreve uma prática habitual do time. Note também o plural *acceptance criteria* e o artigo em *a concrete example of behavior*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

We write acceptance criteria before the sprint starts.
Given a valid token, the request is accepted.
When the customer submits the form, the API returns 201.
Then the order appears in the dashboard.
A good scenario names one rule and one observable outcome.

### Foco articulatório para falantes de pt-BR

- **/ð/ em *then* e *the***: ponta da língua entre os dentes com voz; evite trocar por /d/ (*den*).
- **/ˈɡɪvən/ em *given***: a primeira vogal é /ɪ/, curta, e não /iː/; diga *GIV-en* com a tônica na primeira sílaba.
- **/tʃ/ em *feature* /ˈfiːtʃər/**: prepare *t* + *ʃ* sem virar /ʃ/ simples; a palavra tem duas sílabas, não três.
- **/rɪˈtɜːrn/ em *returns***: a tônica cai na segunda sílaba, ao contrário do pt-BR "RETorna".

### Prompt de produção (oral ou escrita)

Escreva ou diga um mini *feature file* para a história "user logs in with a wrong password". Seu texto deve:

1. Começar com `Feature:` e conter exatamente um `Scenario:`.
2. Usar um passo `Given`, um `When` e um `Then`, nessa ordem.
3. Empregar presente simples com *-s* em pelo menos dois passos.
4. Terminar com um resultado observável, por exemplo uma mensagem de erro na tela.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em um *feature file*, o que é um *scenario*?
   A) Um arquivo de deploy.  B) **Um exemplo concreto de comportamento.**  C) Uma migração de banco.  D) Um convite de reunião.
   **Key:** B

2. **Gramática (L1):** Qual passo *Given* está correto?
   A) "Given the user have a valid token."  B) "Given the user having a valid token."  C) "Given the user has a valid token."  D) "Given the user had a valid token."
   **Key:** C

---

**Listening input:** `rendered_tts_static` — o diálogo da FASE 1 é texto autoral, não um clipe renderizado.
**Pack ID:** `pack_les_b1_it_bdd_specs_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_bdd_specs",
  "cefr_level": "B1",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "rendered_tts_static",
  "listening_input_status": "rendered_tts_static - static TTS audio clips rendered for corpus listening and pending practice items",
  "skills_touched": ["grammar", "vocabulary", "listening", "reading", "pronunciation", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.bdd_given_when_then_tense",
      "grammar.bdd_present_simple_third_person"
    ],
    "vocab": [
      "vocab.it_computer_terms.bdd_specs",
      "vocab.it_computer_terms.feature_artifacts",
      "vocab.it_computer_terms.acceptance_criteria"
    ],
    "reading": [
      "reading.bdd_scenario_structure",
      "reading.bdd_criteria_detail"
    ],
    "listening": [
      "listening.bdd_spec_workshop"
    ],
    "pronunciation": [
      "pronunciation.bdd_given_when_then_stress"
    ],
    "writing": [
      "writing.bdd_feature_file",
      "writing.bdd_acceptance_criteria"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a1_reading_skimming",
    "les_a2_it_reading_strategy"
  ],
  "estimated_time_min": 15
}
```
