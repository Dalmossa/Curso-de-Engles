# Lesson: Stand-ups & Technical Meetings

**Lesson ID:** `les_a2_it_meeting_standup`
**Module:** `mod_a2_it_communication`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US), clean-room.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: daily stand-up de um time de produto

> **Camila (Scrum Master):** "Good morning, team. Let's start our stand-up. We have fifteen minutes. Lucas, can you go first?"
>
> **Lucas (backend engineer):** "Sure. Yesterday I fixed a login bug in ticket PAY-214. I have already pushed the patch to the review branch. Today I will test the payment flow with QA. I have a blocker: I haven't received access to the staging database."
>
> **Bruna (frontend engineer):** "I have finished the new settings screen. Today I will connect it to the API. I haven't started the error messages yet, but I have no blockers right now."
>
> **Camila:** "Thanks. Lucas, let's talk about the database access after the stand-up. Now, let's keep the updates short and clear."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso em TI |
|---|---|---|
| **stand-up** | reunião diária rápida | Atualização curta do time; foco em status e impedimentos. |
| **yesterday** | ontem | Momento passado específico; costuma aparecer com *past simple* no relato oral. |
| **today** | hoje | Plano imediato do dia atual. |
| **blocker** | impedimento/bloqueio | Algo que impede o progresso e pede ajuda. |
| **ticket** | chamado/tarefa | Item de trabalho rastreado no board (Jira, GitHub Issues etc.). |
| **I have finished...** | eu terminei / já concluí | *Present perfect*: resultado concluído com relevância agora. |
| **I haven't started...** | eu ainda não comecei | *Present perfect*: situação atual ligada ao passado recente. |
| **to push a patch** | enviar uma correção | Publicar alteração em branch/repositório para revisão. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| **Vogal epentética:** "I have finish*ed*i the ticket." / "bloc*k*i-er" | "I have **finished** the ticket." / "**blocker**" | Falantes de pt-BR tendem a inserir vogal em grupos finais; mantenha as consoantes juntas. |
| **TH:** "I fixed *dis* yesterday." / "*tink*" for *think* | "I fixed **this** yesterday." / "**think**" | /ð/ e /θ/ não existem no pt-BR; evite trocar por /d/, /t/, /f/ ou /s/. |
| **/h/ vs /r/:** "*Rave* you finished?" / "I *rave* a blocker." | "**Have** you finished?" / "I **have** a blocker." | O *h* inicial em inglês é aspirado; não substitua pelo som de "r" do português. |
| **Falso cognato:** "I will make a *reunion* tomorrow." | "I will attend a **meeting** tomorrow." | *Reunion* em inglês é reencontro; para reunião de trabalho use *meeting* ou *stand-up*. |
| **Preposição/tempo verbal:** "Yesterday I **have fixed** the bug." / "I finished already." (sem contexto de tempo fechado) | "Yesterday I **fixed** the bug." / "I **have already finished**." | Com tempo passado definido (*yesterday*) use *past simple*; para resultado recente/relevante agora use *present perfect*. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Escolha entre *present perfect* e *past simple*

Complete com a forma correta do verbo entre parênteses:

| Frase | Resposta esperada |
|---|---|
| "Yesterday I ____ (deploy) the hotfix." | **deployed** (*past simple*: tempo definido) |
| "I ____ already ____ (review) the pull request." | **have already reviewed** (*present perfect*: resultado relevante agora) |
| "We ____ not ____ (receive) the design yet." | **have not received** / **haven't received** (*present perfect*: situação atual) |
| "Today I ____ (test) the new endpoint." (plano do dia) | **will test** / **am going to test** (plano para hoje) |

### Exercício 2 — Organização do update de stand-up

Coloque as partes na ordem natural de um update curto:

| Posição | Parte |
|---|---|
| 1 | **Yesterday:** o que foi concluído (ex.: "Yesterday I fixed... / I have fixed...") |
| 2 | **Today:** o que será feito hoje |
| 3 | **Blocker:** impedimento ou "No blockers" |

**Key:** 1 → 2 → 3. Em times ágeis, essa ordem ajuda a manter o stand-up objetivo.
**Chave:** 1 → 2 → 3. Em times ágeis, essa ordem ajuda a manter o stand-up objetivo.

### Exercício 3 — Transformação L1 → L2 (contexto TI)

| Português (intenção) | Resposta esperada |
|---|---|
| "Ontem eu corrigi o bug do login." | "Yesterday I fixed the login bug." |
| "Eu já terminei o teste da API." | "I have already finished the API test." / "I've already finished the API test." |
| "Ainda não recebi acesso ao banco." | "I haven't received access to the database yet." |
| "Hoje vou atualizar o board. Não tenho impedimentos." | "Today I will update the board. I have no blockers." / "No blockers." |

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

Yesterday I fixed a critical bug in the payment service. I have already pushed the update to the review branch. Today I will test the new feature with the QA team. I have not received access to the staging server yet. I have a blocker, but I have no other issues right now.

### Foco articulatório para falantes de pt-BR

- **Vogal epentética:** evite inserir "i" em finais como *fixed*, *finished*, *blocked*; pronuncie o grupo consonantal final de forma direta.
- **/θ/ e /ð/ (TH):** em *think*, coloque a língua entre os dentes e sopre sem voz (/θ/); em *this/that*, mantenha a língua entre os dentes com voz (/ð/).
- **/h/ vs /r/:** em *have*, *has*, *haven't*, produza uma aspiração leve no início; não use o som vibrante de "r" do português.
- **Ritmo e contrações:** pratique *I've*, *I haven't*, *I'll* para soar natural em atualizações rápidas de stand-up.
- **Clareza em grupos consonantais:** em *pushed*, *fixed*, *tests*, mantenha os sons finais sem acrescentar vogal extra.

### Prompt de produção (oral ou escrita)

Prepare um **stand-up update de 45–60 segundos** como engenheiro(a) de software. Inclua:
- **Yesterday:** uma tarefa concreta concluída (mencione ticket, bug, teste ou deploy).
- **Today:** uma ação clara para hoje.
- **Blocker:** um impedimento realista ou diga "No blockers."
Use pelo menos **duas formas de present perfect** (*I have finished...*, *I haven't received...*, *I've already pushed...*) e pelo menos **uma frase com tempo definido** (*Yesterday I...*).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Gramática (L1):** Qual frase está correta para um tempo passado definido?  
   A) "Yesterday I have fixed the API bug."  
   B) **"Yesterday I fixed the API bug."**  
   C) "Yesterday I have fix the API bug."  
   D) "Yesterday I am fixed the API bug."  
   **Key:** B
   **Chave:** B

2. **Gramática e vocabulário (L1):** Escolha a melhor atualização de status para agora:  
   A) "I have finish the code review, but I not receive feedback yet."  
   B) "I finished already the code review, but I didn't receive feedback yet."  
   C) **"I have already finished the code review, but I haven't received feedback yet."**  
   D) "I already finish the code review, but I haven't receive feedback yesterday."  
   **Key:** C
   **Chave:** C

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_meeting_standup_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_meeting_standup",
  "cefr_level": "A2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material; clean-room lesson created for Brazilian software engineers (pt-BR → en-US). No external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.present_perfect_completed_recent",
      "grammar.past_simple_defined_time",
      "grammar.standup_status_update"
    ],
    "vocabulary": [
      "vocab.meeting.standup",
      "vocab.meeting.yesterday",
      "vocab.meeting.today",
      "vocab.meeting.blocker",
      "vocab.meeting.ticket",
      "vocab.meeting.no_blockers"
    ],
    "listening": [
      "listening.standup_context"
    ],
    "pronunciation": [
      "pronunciation.th_voiced_voiceless",
      "pronunciation.h_initial",
      "pronunciation.consonant_cluster_epenthesis"
    ],
    "speaking": [
      "speaking.standup_update"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```