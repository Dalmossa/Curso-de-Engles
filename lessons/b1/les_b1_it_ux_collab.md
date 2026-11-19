# Lesson: UX Collaboration: Wireframes, Prototypes, Personas, Accessibility

**Lesson ID:** `les_b1_it_ux_collab`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: revisando um protótipo antes do handoff

> **Marina (product designer, Curitiba):** "Let's walk through the prototype before the handoff. The wireframe is approved, so I added a real user flow."
>
> **Túlio (frontend developer, remoto):** "Good. I still have one question about the persona we designed for — Ana, the accountant who uses a keyboard only."
>
> **Marina:** "That persona drives the whole iteration. If the focus order is wrong for Ana, the usability test fails for everyone."
>
> **Túlio:** "Understood. The contrast on this mockup is 3:1, but our accessibility rule says buttons must reach 4.5:1."
>
> **Marina:** "Right. Fix the contrast, keep the label visible and add an ARIA name for the custom select."
>
> **Túlio:** "I will. Please put your feedback in the handoff note so I can close each item in the next iteration."
>
> **Marina:** "Deal. I will mark the blocked items and send the note right after the review."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **wireframe** | wireframe, esboço de baixa fidelidade | Escreva junto; *wire frame* é erro gráfico. É a estrutura, não o visual final. |
| **prototype** | protótipo | Use *build a prototype* ou *test a prototype*; *do a prototype* soa estranho em reunião. |
| **persona** | persona | Não é a pessoa real: é um perfil fictício que guia decisões. Diga *the persona we designed for*. |
| **user flow** | fluxo do usuário | *Flow* aqui é o caminho entre telas; escreva *login → dashboard → export*. |
| **mockup** | mockup, composição visual | É a versão com aparência definida; *mockup* e *wireframe* não são sinônimos. |
| **usability test** | teste de usabilidade | Diga *test with five users*, não *test in five users*. |
| **feedback** | feedback, retorno | *Feedback* é incontável: *much feedback*, não *many feedbacks*. |
| **iteration** | iteração | Cada rodada de ajuste é *an iteration*; *iterations* no plural para o ciclo. |
| **accessible** | acessível | Use *more accessible* (nunca *accessibler*); o substantivo é *accessibility*. |
| **contrast** | contraste | Em requisitos, fale em *contrast ratio*: *4.5:1 contrast*. |
| **screen reader** | leitor de tela | É o software que lê a tela; não confunda com *screen* (monitor). |
| **handoff** | handoff, passagem de bastão | O substantivo é *the handoff*; o verbo é *hand off the feature*. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Let's **do a prototype**." | "Let's **build a prototype**." | *Build* combina com artefatos que você monta; *do* é vago demais aqui. |
| "The **low fidelity wireframe** is ready." | "The **low-fidelity wireframe** is ready." | O modificador composto leva hífen antes do substantivo. |
| "This screen is **accessibler**." | "This screen is **more accessible**." | Adjetivos longos formam o comparativo com *more*. |
| "Buttons **should have** 4.5:1 contrast." | "Buttons **must have** 4.5:1 contrast." | *Should* é recomendação; um requisito normativo pede *must*. |
| "Color **don't must be** the only signal." | "Color **must not be** the only signal." | A negativa de *must* é *must not*; *don't must* não existe. |
| "We tested **in five users**." | "We tested **with five users**." | *With* introduz quem participa do teste. |
| "I sent **many feedbacks**." | "I sent **a lot of feedback**." | *Feedback* não tem plural contável em uso corrente. |
| "The persona uses **only keyboard**." | "The persona uses **a keyboard only**." | O artigo aparece e *only* vem depois do nome. |
| "Please make the **handoff of the feature**." | "Please **hand off the feature**." | O verbo é *hand off*; *handoff* é o substantivo. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Gramática: modais para requisitos de acessibilidade

Escolha **must / should / must not** para cada lacuna:

"Buttons ______ have a contrast ratio of at least 4.5:1. Focus order ______ follow the visual order. Color ______ be the only signal for an error."

| Lacuna | Modal |
|---|---|
| 1 | **must** |
| 2 | **should** |
| 3 | **must not** |

**Key:** must / should / must not

*Must* marca o requisito verificável (4.5:1), *should* marca a boa prática de ordem de foco e *must not* proíbe usar a cor como único sinal. Depois de qualquer modal, o verbo fica na forma base: *must have*, *must not be*.

### Exercício 2 — Vocabulário: qual artefato faz o quê

Antes de escrever código, o time quer testar cliques em uma jornada real. Qual artefato serve para isso?

| Opção | Artefato |
|---|---|
| A | The wireframe. |
| B | **The prototype.** |
| C | The persona. |
| D | The handoff note. |

**Key:** B

O *prototype* é a versão interativa que permite testar a jornada. O *wireframe* mostra estrutura sem cliques, a *persona* é o perfil do usuário e o *handoff note* é o registro da passagem para o time de desenvolvimento.

### Exercício 3 — Transformação L1 → L2

Reescreva as intenções em inglês natural:

| Português (intenção) | Resposta esperada |
|---|---|
| "O protótipo precisa ser testado com cinco usuários." | "The prototype should be tested with five users." |
| "A persona usa apenas o teclado." | "The persona uses a keyboard only." |
| "A cor não pode ser o único jeito de mostrar o erro." | "Color must not be the only way to show an error." |

**Key:** ver tabela.

*Test with five users* usa *with* para os participantes; *a keyboard only* mantém o artigo e a posição de *only*; e a proibição normativa usa *must not be*, não *don't must be*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

We reviewed the wireframe before we built the clickable prototype.
The persona is a keyboard-only user, so the focus order must be logical.
This mockup looks clean, but the contrast fails our accessibility check.
We ran a usability test with five users and collected the feedback in one note.
I will hand off the iteration to the developer after the screen reader check.

### Foco articulatório para falantes de pt-BR

- **/ˈwaɪərˌfreɪm/ em *wireframe***: são duas sílabas, /waɪər/ + /freɪm/; não reduza a /ˈwai.fɾei.mi/.
- **/ˈproʊtətaɪp/ em *prototype***: o acento cai na primeira sílaba; evite o ritmo *pro-TÓ-tipo* do pt-BR.
- **/ˈpɜːrsənə/ em *persona***: mantenha a vogal /ɜːr/ com a rhoticidade do en-US e o acento inicial.
- **/əkˈsesəbəl/ em *accessible***: acento na segunda sílaba e /ks/ no início, não /aks/.
- **/ˈskriːn ˌriːdər/ em *screen reader***: a segunda palavra começa com /r/ e tem /d/ medial; não vire *screen reader* em *screen ríder*.
- **/ˈkɑːntræst/ em *contrast***: no substantivo, o acento é na primeira sílaba e a vogal final é /æ/, não /a/.

### Prompt de produção (oral ou escrita)

Você está passando uma funcionalidade do design para o time de desenvolvimento. Escreva ou diga um texto curto de **4 a 6 falas** em que você:

1. Nomeia o **wireframe** e o **prototype** e diz qual dos dois já foi aprovado.
2. Apresenta uma **persona** com uma necessidade concreta (por exemplo, teclado apenas).
3. Usa **must** para um requisito de acessibilidade e **must not** para uma proibição.
4. Fecha com o **handoff note**: o que ficou bloqueado e o que será feito na próxima **iteration**.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** O designer diz "The handoff note is blocked on contrast." O que isso quer dizer?
   A) O protótipo foi aprovado sem ajustes.  B) A passagem está parada por causa do contraste.  C) O teste de usabilidade terminou.  D) A persona mudou de perfil.
   **Key:** B
   *Blocked on* indica o item que impede o avanço; aqui é o contraste, não o protótipo ou o teste.

2. **Gramática (L1):** Qual frase está correta para uma proibição de acessibilidade?
   A) Color don't must be the only signal.  B) Color mustn't to be the only signal.  C) Color must not be the only signal.  D) Color must no be the only signal.
   **Key:** C
   *Must not* é a forma negativa padrão e o verbo vem na base (*be*); *mustn't to* e *don't must* são erros.

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_ux_collab_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_ux_collab",
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
      "grammar.ux_accessibility_modals",
      "grammar.ux_requirement_modals_review"
    ],
    "vocab": [
      "vocab.ux_collab_people",
      "vocab.ux_collab_a11y",
      "vocab.it_terms_core_review"
    ],
    "reading": [
      "reading.ux_collab_handoff_scan",
      "reading.ux_collab_checklist_detail"
    ],
    "listening": [
      "listening.ux_collab_review_context"
    ],
    "pronunciation": [
      "pronunciation.ux_collab_tech_stress"
    ]
  },
  "prereq_lessons": [
    "les_a1_reading_skimming",
    "les_a2_reading_strategy",
    "les_a2_it_reading_strategy",
    "les_a2_it_terms_basics",
    "les_a2_modals_can_need"
  ],
  "estimated_time_min": 15
}
```
