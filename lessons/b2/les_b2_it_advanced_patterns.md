# Lesson: Advanced Patterns & Anti-Patterns: Legacy Code, Refactoring Strategies

**Lesson ID:** `les_b2_it_advanced_patterns`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: pair programming no módulo de checkout

> **Marina (staff engineer, São Paulo):** "Let's pair on the checkout module. Before we touch it, find a **seam** — a place where we can change behaviour without rewriting everything."
>
> **Túlio (backend engineer, remote):** "There isn't one. The `processOrder` function validates the cart, charges the card, writes the audit log and sends the receipt. That's a **code smell**: too many responsibilities in one place."
>
> **Marina:** "So this is **legacy code** — not old code, just code without a safety net. What would you call it when the charge logic is hard-wired into the function?"
>
> **Túlio:** "**Tight coupling**. If we swap the payment provider, I have to edit `processOrder` itself. I'd rather introduce **dependency injection** and pass the gateway in."
>
> **Marina:** "Good. That gives us a seam. Keep **cohesion** in mind: a module should do one job well. And watch for an **anti-pattern** — a quick fix that feels right but costs us later."
>
> **Túlio:** "Agreed. First I add a characterization test to lock the current behaviour, then we **refactor** in small steps. Every green run is a guard against a **regression**."
>
> **Marina:** "Exactly. We change the structure, not the behaviour. If the tests stay green, the refactor is safe to merge."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **legacy code** | código legado | Não quer dizer "código antigo": em en-US significa código sem testes que protejam uma mudança. |
| **refactoring** | refatoração | Mudança de estrutura sem mudança de comportamento; o nome do processo é *refactoring*, a ação é *refactor*. |
| **code smell** | cheiro de código | Sinal de um problema de design, não uma falha de compilação; diga *This is a code smell*. |
| **anti-pattern** | anti-padrão | Solução recorrente que parece razoável e cria problemas; distinto de *code smell*, que é o sinal. |
| **seam** | costura / ponto de extensão | Lugar onde você muda uma dependência sem reescrever o módulo; termo técnico, mantido em inglês. |
| **dependency injection** | injeção de dependência | Passar a dependência como parâmetro em vez de criá-la dentro da função. |
| **coupling** | acoplamento | Grau de dependência entre módulos; *tight coupling* é o problema, *loose coupling* é o objetivo. |
| **cohesion** | coesão | Quanto as responsabilidades de um módulo pertencem juntas; alta coesão é o que se busca. |
| **regression** | regressão | Comportamento que funcionava e voltou a falhar; *guard against a regression* é coloquial em revisão de código. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Código legado" → "old code" | "**legacy code**" | *Old code* só fala da idade; *legacy code* fala da ausência de rede de segurança. |
| "Refatorar" → "refactorar" | "**refactor**" / "**refactoring**" | O verbete em pt-BR não vira verbo em inglês; use *refactor the function*. |
| "Acoplamento" → "coupling" (sem adjetivo, quando há problema) | "**tight coupling**" | *Coupling* é neutro; o problema é o grau, por isso o adjetivo importa. |
| "Cheiro de código" → "code smell" (como sinônimo de bug) | "**code smell** — a signal, not a failure" | O cheiro aponta para um problema de design; o bug é a falha em si. |
| "Anti-padrão" → "anti pattern" (sem hífen) | "**anti-pattern**" | O composto é hifenizado em en-US. |
| "Injeção de dependência" → "dependency injection" (como verbo) | "**inject the gateway**" | *Injection* é o nome do padrão; a ação do desenvolvedor é *inject*. |
| "Coesão" → "cohesion" (como elogio vago) | "**high cohesion**" | Coesão é uma propriedade mensurável pelo escopo de responsabilidades; diga *high* ou *low*. |
| "Regressão" → "regression" (como sinônimo de atraso) | "**regression** — a behaviour that broke again" | Em TI, *regression* é comportamento que voltou a falhar, não atraso de cronograma. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (criando um seam)

Qual mudança cria um **seam** útil no `processOrder`?

| Opção | Frase |
|---|---|
| A | Hard-code a second payment provider inside `processOrder`. |
| B | **Pass the payment gateway as a parameter to `processOrder`.** ✓ |
| C | Delete the audit log to make the function faster. |
| D | Rename `processOrder` to `handleCheckout`. |

**Key:** B
Passar o gateway como parâmetro cria um ponto de troca sem editar a função; **A** aumenta o acoplamento, **C** remove comportamento e **D** só troca o nome.

### Exercício 2 — Vocabulário (termo → definição)

Associe cada termo à sua definição:

| Termo | Definição |
|---|---|
| **legacy code** | a. Comportamento que funcionava e voltou a falhar. |
| **code smell** | b. Código sem testes que protejam uma mudança. |
| **anti-pattern** | c. Sinal de um problema de design. |
| **regression** | d. Solução que parece boa e cria problemas depois. |

**Key:** legacy code → b, code smell → c, anti-pattern → d, regression → a
A distinção que importa: o *code smell* é o sinal, o *anti-pattern* é a solução problemática, e a *regression* é o dano que aparece depois.

### Exercício 3 — Gramática (orações relativas em definições)

Complete com **where**, **which**, **who** ou **what**:

1. "A seam is a place ______ we can change behaviour without rewriting the module."
2. "A code smell is a signal ______ suggests a deeper design problem."
3. "A refactor is a change ______ keeps the behaviour intact."

**Key:** 1) where; 2) which; 3) which
Use *where* para um lugar (*a place where...*) e *which* para coisas ou sinais (*a signal which...*); *who* é para pessoas e *what* não introduz essa oração relativa.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
Legacy code is not old code; it is code without a safety net.
A seam is a place where we can change behaviour without rewriting the module.
We inject the payment gateway so checkout no longer depends on one provider.
The refactor must keep the behaviour intact and guard against a regression.
This anti-pattern couples validation to charging, and it lowers cohesion.

### Foco articulatório para falantes de pt-BR

- **/dʒ/ em *inject, injection***: como em "dge"; não troque por /ʒ/ nem por /gi/.
- **/v/ em *behaviour, validation, provider***: lábio inferior nos dentes de cima; não arredonde os lábios como em /w/.
- **/iː/ em *seam, keep***: vogal longa e tensa; não reduza a /ɪ/ curto do pt-BR.
- **/t/ final em *checkout, inject***: solte o ar sem inserir "e" no fim (*checkout-e*).
- **/ə/ em *anti-pattern, provider, behaviour***: vogal átona e curta; não transforme cada sílaba em vogal plena.
- **/ŋ/ em *charging, logging***: velar nasal, sem /g/ extra; evite *charg-in-gue*.

### Prompt de produção (oral ou escrita)

Você está em uma sessão de pair programming com um colega em outro fuso. Escreva um parágrafo curto (ou diga as mesmas ideias em voz alta) sobre um módulo real ou fictício do seu trabalho, com:

1. uma definição de **legacy code** que não use a expressão "código antigo";
2. um **code smell** concreto (por exemplo, uma função que valida, cobra e registra);
3. um **seam** que você criaria com **dependency injection**;
4. uma frase explicando como você reduz **coupling** e aumenta **cohesion**;
5. uma **regression** que seu teste de caracterização deve impedir;
6. um **anti-pattern** que você evitou e o motivo.

Use pelo menos uma oração relativa com *where* ou *which*.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** No trecho "There isn't one. The `processOrder` function validates the cart, charges the card, writes the audit log and sends the receipt. That's a code smell", o que é um **code smell**?
   A) Outro nome para um bug de compilação.  B) **Um sinal de que várias responsabilidades foram concentradas.**  C) Um padrão de projeto recomendado.  D) Um teste que falhou.
   **Key:** B

2. **Gramática (L1):** Qual definição usa a oração relativa corretamente?
   A) "A seam is a place which we change behaviour."  B) **"A seam is a place where we can change behaviour."**  C) "A seam is a place what we can change behaviour."  D) "A seam is a place where can we change behaviour."
   **Key:** B

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_it_advanced_patterns_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_advanced_patterns",
  "cefr_level": "B2",
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
      "grammar.definitions_relative_clauses",
      "grammar.present_simple_definitions"
    ],
    "vocabulary": [
      "vocab.refactoring_legacy_code",
      "vocab.refactoring_seam",
      "vocab.refactoring_coupling_cohesion",
      "vocab.it_algorithms_core"
    ],
    "listening": [
      "listening.refactoring_pair_programming"
    ],
    "pronunciation": [
      "pronunciation.technical_clusters_dental"
    ],
    "reading": [
      "reading.legacy_code_dialogue",
      "reading.refactor_regression"
    ],
    "speaking": [
      "speaking.pair_programming_refactor"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_typescript_basics",
    "les_a2_it_algorithms_basics"
  ],
  "estimated_time_min": 15
}
```
