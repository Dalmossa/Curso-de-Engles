# Practice Pack — `les_a1_en_us_en_gb`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_en_us_en_gb_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_en_us_en_gb.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_en_us_en_gb_v1
lesson_id: les_a1_en_us_en_gb
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 0
  br_pt_form_coverage: 6/6 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 2 | 2–3 | ✅ |
| Vocabulary | 3 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Vocabulary, current lesson

```yaml
item_id: `voc_enu_hi_hello_001`
skill: `vocab.dialect.hi_hello`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "Goodbye."
    br_pt_form: "Tchau / Adeus."
    note: "despedida, não saudação de abertura"
  - option: "See you later."
    br_pt_form: "Até mais."
    note: "despedida para encerrar, não para iniciar"
  - option: "Good night."
    br_pt_form: "Boa noite (para dormir ou sair à noite)."
    note: "usada ao final do dia, não como saudação matinal"
```

**Item:**
> You arrive at the office at 9:00 a.m. and see a colleague. What is the best way to start?

| Slot | Value |
|------|-------|
| A | "Goodbye." |
| B | **"Hi."** ✓ |
| C | "See you later." |
| D | "Good night." |

**Key:** B

**Feedback:**
> **`Hi.`** é uma saudação neutra e natural para iniciar a conversa no escritório. **A**, **C** e **D** são despedidas, não aberturas.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_enu_here_you_go_001`
skill: `vocab.dialect.here_you_go`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "Wait for me."
    br_pt_form: "Espere por mim."
    note: "instrução de espera, não entrega de algo pedido"
  - option: "Before noon."
    br_pt_form: "Antes do meio-dia."
    note: "prazo de tempo, não frase de entrega"
  - option: "I need the report."
    br_pt_form: "Eu preciso do relatório."
    note: "pedido do falante, não resposta de quem entrega"
```

**Item:**
> A colleague asks you for the report and you hand it over. What do you say?

| Slot | Value |
|------|-------|
| A | "Wait for me." |
| B | "Before noon." |
| C | "I need the report." |
| D | **"Here you go."** ✓ |

**Key:** D

**Feedback:**
> **`Here you go.`** é a frase usada ao entregar algo que foi pedido. **A** pede para esperar, **B** é um prazo e **C** é quem pede, não quem entrega.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_enu_before_noon_001`
skill: `reading.dialect_context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "Before midnight."
    br_pt_form: "Antes da meia-noite."
    note: "horário noturno, não o prazo da manhã"
  - option: "After noon."
    br_pt_form: "Depois do meio-dia."
    note: "período posterior ao prazo solicitado"
  - option: "All day."
    br_pt_form: "O dia todo."
    note: "período indefinido, não o horário limite específico"
```

**Stimulus:**
> "Hi Alex. Could you help me, please? I need the report before noon."

**Item:**
> By what time does the speaker need the report?

| Slot | Value |
|------|-------|
| A | Before midnight. |
| B | After noon. |
| C | All day. |
| D | **Before noon.** ✓ |

**Key:** D

**Feedback:**
> O texto diz **`I need the report before noon.`**, ou seja, o prazo é antes do meio-dia.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, current lesson

```yaml
item_id: `grm_enu_could_you_please_001`
skill: `grammar.requests_could_you_please`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Could you to help me, please?"
    br_pt_form: "Você poderia para me ajudar, por favor?"
    note: "transferência L1 adicionando 'to' após o modal; modais levam o verbo base diretamente"
  - option: "You could help me please?"
    br_pt_form: "Você poderia me ajudar por favor?"
    note: "ordem de afirmação com marcação de educação fraca; menos claro como pedido que a forma interrogativa"
  - option: "Help me, you could?"
    br_pt_form: "Me ajuda, você poderia?"
    note: "ordem de palavras quebrada que mistura imperativo e pergunta"
```

**Item:**
> Choose the most polite and correct request.

| Slot | Value |
|------|-------|
| A | "Could you to help me, please?" |
| B | **"Could you help me, please?"** ✓ |
| C | "You could help me please?" |
| D | "Help me, you could?" |

**Key:** B

**Feedback:**
> Com **could/can**, use o verbo base: **`Could you help me, please?`** **A** adiciona incorretamente *to* após o modal. **C** e **D** não usam uma estrutura de pedido clara e natural.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, current lesson

```yaml
item_id: `grm_enu_wait_for_001`
skill: `grammar.wait_for_preposition`
type: `error_correction`
difficulty_b: 0.0
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Wait the report."
    br_pt_form: "Espere o relatório."
    note: "faltam a preposição 'for'; em inglês 'wait' exige 'for' antes do objeto esperado"
  - option: "Waiting for the report."
    br_pt_form: "Esperando o relatório."
    note: "gerúndio não expressa uma instrução direta"
  - option: "To wait for the report."
    br_pt_form: "Para esperar o relatório."
    note: "infinitivo não funciona como instrução direta"
```

**Item:**
> Choose the correct polite instruction for waiting.

| Slot | Value |
|------|-------|
| A | "Wait the report." |
| B | "Waiting for the report." |
| C | "To wait for the report." |
| D | **"Wait for the report."** ✓ |

**Key:** D

**Feedback:**
> A instrução direta e correta é **`Wait for the report.`** (ou *Please wait for the report.*). **A** falta a preposição *for*, e **B** e **C** usam formas verbais que não dão uma instrução clara.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_enu_greeting_morning_001`
skill: `vocab.greetings.basic`
type: `contextual_selection`
difficulty_b: -0.6
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_greetings`
distractors:
  - option: "Good night."
    br_pt_form: "Boa noite (despedida / dormir)."
    note: "usada à noite ou ao dormir; não abre uma interação matinal"
  - option: "Goodbye."
    br_pt_form: "Tchau."
    note: "expressão de encerramento, não de abertura"
  - option: "See you later."
    br_pt_form: "Até mais."
    note: "frase de despedida que não inicia a conversa"
```

**Item:**
> You arrive at the office at 9:00 a.m. What is the best way to start?

| Slot | Value |
|------|-------|
| A | "Good night." |
| B | **"Good morning."** ✓ |
| C | "Goodbye." |
| D | "See you later." |

**Key:** B

**Feedback:**
> **`Good morning.`** é a saudação natural para o início do dia. **A** é para a noite ou dormir, e **C** e **D** são despedidas.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_enu_h_th_001`
skill: `pronunciation.h_initial`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *help* /help/ starts with a clear /h/ sound, not silence and not /r/. *this* /ðɪs/ uses /ð/, made with the tongue between the teeth.

**Step 2 — produce (ASR-scored):** read aloud:

> "Could you help me with this, please?"

**Target phonemes:** /h/ in *help* · /ð/ in *this* · smooth, polite rhythm in *could you... please*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `requests_could_you_please` | Item 4 missed | **L2** | Contrast *Can you...?* and *Could you...?* in short workplace requests. |
| `wait_for_preposition` | Item 5 missed | **L2** | Practice *Wait for...* with common objects (*the report, the feedback, the meeting*). |
| `greeting_time_of_day` | Item 6 missed | **L2** | Contrast *Good morning / Good afternoon / Good evening / Good night* by time of day. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content and prerequisite review; no external source text is reproduced.
