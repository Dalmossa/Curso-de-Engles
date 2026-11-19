# Lesson: Prefix, Suffix & Deceptive Cognates

**Lesson ID:** `les_a2_it_word_formation`
**Module:** `mod_a2_it_communication`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: relendo o ticket do incidente antes do stand-up

> **Bia (backend developer, Curitiba):** "I re-read the ticket: `re-` means again, so **retry** is try again. The `un-` in **uninstall** reverses the action."
>
> **Rui (tech lead, remote):** "Good. Now check the ending: **configure → configuration**, and the step is **deployable** because of `-able`."
>
> **Bia:** "The note says '**actually**, the timeout is in the worker.' Don't read *actually* as *atualmente*: here it means *na verdade*."
>
> **Rui:** "Right. *Currently* is *no momento*. And if the fix lands **eventually**, that is *com o tempo*, not *eventualmente*."
>
> **Bia:** "I also saw 'please **support** the old endpoint'. That is *apoiar*, not *suportar*."
>
> **Rui:** "Add it to the glossary: **pretend** means *fingir*, never *pretender*. Then scan the ticket again for `pre-` and `mis-`."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **re-** | de novo, outra vez | Em *retry* e *recompute*, o prefixo marca repetição; escreva junto à raiz. |
| **un-** | reverso, remoção | Em *uninstall*, *undo* e *unlock*, a ação é desfeita; não é negação de frase. |
| **pre-** | antes de | Em *pre-check* e *preview*, a ação acontece antes; não confunda com *prejuízo*. |
| **mis-** | de forma errada | Em *misread* e *misconfig*, o erro está na ação, não na pessoa. |
| **-tion** | ação/processo (substantivo) | *configure → configuration*, *migrate → migration*; termina em /ʃən/. |
| **-ment** | resultado/estado | *deploy → deployment*, *agree → agreement*; nomeia o resultado da ação. |
| **-able** | que pode ser | *deployable*, *reusable*, *readable*; forma adjetivo a partir do verbo. |
| **actually** | na verdade | Introduz uma correção ou surpresa; **não** é *atualmente*. |
| **currently** | no momento | Fala do agora: *Currently, the worker is down.* |
| **eventually** | com o tempo, no fim | Diz que algo acontece depois: *The retry eventually succeeds.* |
| **pretend** | fingir | *The mock pretends to be the real service*; *pretender* em pt-BR é *intend*. |
| **support** | apoiar, dar suporte | *We support the legacy API*; *suportar* (tolerar) é *bear/stand*. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "**Atualmente** o deploy falha." | "**Currently**, the deploy fails." | *Actually* significa *na verdade*; o tempo presente é *currently*. |
| "O worker vai **eventualmente** voltar." (no sentido de *talvez*) | "The worker will **eventually** come back." | *Eventually* afirma que vai acontecer no fim; para *talvez*, use *maybe*. |
| "Nós **suportamos** a API antiga." | "We **support** the legacy API." | *Support* é apoiar/dar suporte; *suportar* no sentido de tolerar é *bear* ou *stand*. |
| "Ele **pretende** ser o cliente." | "He **pretends** to be the client." | *Pretend* é fingir; *pretender* como intenção é *intend to*. |
| "A **configurate** está pronta." | "The **configuration** is ready." | O substantivo de *configure* termina em *-tion*, não em *-ate*. |
| "O passo é **deploymentable**." | "The step is **deployable**." | O adjetivo de *deploy* usa *-able*; *deployment* já é o substantivo. |
| "O `uninstall` **repete** a instalação." | "The uninstall **reverses** the installation." | `un-` desfaz; `re-` é que repete (*reinstall*). |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Prefixos: qual é a função?

Em "Please **uninstall** the old agent before the retry", o prefixo `un-` significa:

| Opção | Sentido |
|---|---|
| A | Do again |
| B | **Reverse / remove** |
| C | Do before |
| D | Do incorrectly |

**Key:** B

`un-` desfaz a ação: *uninstall* remove o agente. *Do again* é `re-` (*retry*), *do before* é `pre-` (*pre-check*) e *do incorrectly* é `mis-` (*misread*).

### Exercício 2 — Cognatos enganosos: sentido real

Ligue cada palavra ao seu significado em pt-BR:

| Palavra | Sentido correto |
|---|---|
| **actually** | a. *na verdade* |
| **currently** | b. *no momento* |
| **eventually** | c. *com o tempo / no fim* |
| **pretend** | d. *fingir* |
| **support** | e. *apoiar / dar suporte* |

**Key:** actually→a, currently→b, eventually→c, pretend→d, support→e

*Actually* corrige uma expectativa, *currently* marca o agora e *eventually* marca o desfecho. *Pretend* é fingir e *support* é apoiar — nenhum dos dois é o falso amigo que a forma portuguesa sugere.

### Exercício 3 — Derivações em uma nota de release

Complete com a forma derivada correta a partir da raiz dada:

1. `configure` → "The ______ is in the repo."
2. `deploy` → "The ______ finished in two minutes."
3. `reuse` → "This helper is ______ across the tests."

**Key:** 1) configuration; 2) deployment; 3) reusable

`-tion` forma o substantivo de ação de *configure*, `-ment` nomeia o resultado de *deploy* e `-able` transforma *reuse* no adjetivo *reusable*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

Please retry the job after the pre-check finishes.
The uninstall step removes the old package from the test box.
Actually, the misread flag is in the configuration file.
Currently, the worker is down, but it will recover eventually.
We support the legacy endpoint, and the mock pretends to be the real service.

### Foco articulatório para falantes de pt-BR

- **/riː/ em *retry* e *re-***: vogal longa no prefixo; *RE-try*, não *ri-try* com vogal curta.
- **/ʌn/ em *uninstall* e /priː/ em *pre-check***: /ʌn/ é curto e aberto; em *pre-*, não acrescente uma vogal depois de /p/.
- **/ʃən/ na terminação *-tion***: *configuration* /kənˌfɪɡjəˈreɪʃən/ termina em /ʃən/, não em *-cion* com /s/.
- **/ˈæktʃuəli/ e /ɪˈventʃuəli/**: *actually* começa com /æ/ e tem /tʃ/; *eventually* tem a sequência /tʃu/ — marque a sílaba tônica de cada um.
- **/səˈpɔːrt/ em *support* e /prɪˈtend/ em *pretend***: a tônica está na segunda sílaba; evite *SU-port* e *PRE-tend*.

### Prompt de produção (oral ou escrita)

Imagine que você está explicando ao time o estado de um incidente em um ticket curto. Escreva ou diga **4 a 6 falas** em que você:

1. Usa **pelo menos dois prefixos** entre `re-`, `un-`, `pre-` e `mis-`, cada um com a função correta.
2. Usa **pelo menos dois sufixos** entre `-tion`, `-ment` e `-able`.
3. Emprega **actually**, **currently** e **eventually** com os sentidos de *na verdade*, *no momento* e *com o tempo*.
4. Inclui **support** no sentido de *apoiar* e **pretend** no sentido de *fingir*.
5. Termina com uma ação concreta (*I will retry…* / *Please check…*).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** O colega escreve "Actually, the flag is in the config file." O que ele quer dizer?
   A) Atualmente, a flag está no arquivo.  B) Na verdade, a flag está no arquivo.  C) No momento, a flag está no arquivo.  D) Eventualmente, a flag estará no arquivo.
   **Key:** B

2. **Gramática (L1):** Qual é o substantivo correto a partir de *configure*?
   A) "The configurate is ready."  B) "The configuration is ready."  C) "The configuring is ready."  D) "The configurator is ready."
   **Key:** B

---

**Listening input:** `deferred_render` — o diálogo da FASE 1 é texto autoral, não um clipe renderizado.
**Pack ID:** `pack_les_a2_it_word_formation_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_word_formation",
  "cefr_level": "A2",
  "status": "authored",
  "new_skills": ["prefixes_suffixes"],
  "prerequisite_skills": ["reading_skimming", "reading_scanning"],
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "reading", "pronunciation", "speaking", "writing"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.word_formation_derived_form",
      "grammar.present_simple_s"
    ],
    "vocab": [
      "vocab.word_formation_prefixes",
      "vocab.word_formation_suffixes",
      "vocab.word_formation_deceptive_cognates",
      "vocab.it_terms_root_scan"
    ],
    "listening": [
      "listening.word_formation_ticket_context"
    ],
    "reading": [
      "reading.word_formation_ticket_scan",
      "reading.word_formation_cognate_detail"
    ],
    "pronunciation": [
      "pronunciation.word_formation_stress"
    ],
    "speaking": [
      "speaking.word_formation_incident_recap"
    ],
    "writing": [
      "writing.word_formation_ticket_note"
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
