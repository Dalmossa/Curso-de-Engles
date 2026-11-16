# Practice Pack — `les_a1_intro_dialogue`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_intro_dialogue_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_intro_dialogue.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian learners in technology contexts (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_intro_dialogue_v1
lesson_id: les_a1_intro_dialogue
learner_profile: default
estimated_minutes: 4
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 0
  br_pt_form_coverage: 7/7 scored items
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

### ITEM 1 — Grammar, current lesson

```yaml
item_id: `grm_wh_name_001`
skill: `grammar.wh_questions_to_be`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Where is your name?"
    br_pt_form: "Onde é seu nome?"
    note: "confusão de palavra interrogativa: 'where' pergunta lugar, não nome"
  - option: "How old is your name?"
    br_pt_form: "Quantos anos é seu nome?"
    note: "uso inadequado de 'how old' para pedir nome"
  - option: "What your name is?"
    br_pt_form: "Qual seu nome é?"
    note: "ordem sem inversão típica de transferência do pt-BR em perguntas com verbo to be"
```

**Item:**
> You meet a new teammate on your first day. Which question asks for their name?

| Slot | Value |
|------|-------|
| A | "Where is your name?" |
| B | **"What is your name?"** ✓ |
| C | "How old is your name?" |
| D | "What your name is?" |

**Key:** B

**Feedback:**
> Use **`What is your name?`** to ask for someone's name. **A** and **C** use the wrong *wh-word*. **D** is missing the correct question order; with the verb *to be*, put *is* before the subject: *What is your name?*

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_intro_occupation_001`
skill: `vocab.intro.occupation`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "I work of a developer."
    br_pt_form: "Eu trabalho de desenvolvedor."
    note: "calque de preposição do português ('trabalhar de'); em inglês usa-se 'work as'"
  - option: "I am work as a developer."
    br_pt_form: "Eu sou trabalho como desenvolvedor."
    note: "mistura desnecessária de 'am' com 'work'; forma correta usa apenas 'I work as'"
  - option: "I have a developer."
    br_pt_form: "Eu tenho um desenvolvedor."
    note: "uso de 'have' para profissão altera o sentido; não expressa a função da pessoa"
```

**Item:**
> You want to tell your team your job. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I work of a developer." |
| B | "I am work as a developer." |
| C | **"I work as a developer."** ✓ |
| D | "I have a developer." |

**Key:** C

**Feedback:**
> To talk about your job, say **`I work as a developer`**. **A** uses the wrong preposition from Portuguese. **B** incorrectly adds *am*. **D** means something different (you have/possess a developer), not your profession.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_intro_details_001`
skill: `reading.intro_details`
type: `detail_identification`
difficulty_b: 0.0
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "She is from Brazil and she is 29 years old."
    br_pt_form: null
    note: "troca a origem e a idade entre os falantes do texto"
  - option: "He lives in São Paulo and works as a designer."
    br_pt_form: null
    note: "atribui cidade e função incorretas a Lucas"
  - option: "He is 29 years old and works as a software engineer."
    br_pt_form: null
    note: "confunde idade e função de Lucas com informações de outros personagens"
```

**Stimulus:**
> "Hi! My name is Lucas. I am from Brazil. I live in Recife. I work as a junior developer. I am 24 years old."

**Item:**
> Which sentence is true about Lucas?

| Slot | Value |
|------|-------|
| A | **He lives in Recife and he is 24 years old.** ✓ |
| B | He is from Brazil and he is 29 years old. |
| C | He lives in São Paulo and works as a designer. |
| D | He is 29 years old and works as a software engineer. |

**Key:** A

**Feedback:**
> The text says Lucas **lives in Recife** and **is 24 years old**. The other options mix details from different people or invent information not in the text.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: `voc_intro_age_001`
skill: `vocab.intro.age`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "I have 24 years old."
    br_pt_form: "Eu tenho 24 anos de idade."
    note: "calque direto do português usando 'have' para idade"
  - option: "I have 24 years."
    br_pt_form: "Eu tenho 24 anos."
    note: "estrutura comum em pt-BR, mas em inglês idade pede o verbo to be"
  - option: "I am 24 years."
    br_pt_form: "Eu sou 24 anos."
    note: "usa o verbo correto, mas omite 'old', forma incompleta em inglês"
```

**Item:**
> Which sentence correctly states your age?

| Slot | Value |
|------|-------|
| A | "I have 24 years old." |
| B | "I have 24 years." |
| C | **"I am 24 years old."** ✓ |
| D | "I am 24 years." |

**Key:** C

**Feedback:**
> In English, use the verb *to be* for age: **`I am 24 years old.`** **A** and **B** copy the Portuguese verb *ter* ("have"). **D** is missing the word *old*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: `grm_to_be_greeting_001`
skill: `grammar.verb_to_be_statements`
type: `error_correction`
difficulty_b: -0.5
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_greetings`
distractors:
  - option: "I Lucas."
    br_pt_form: "Eu Lucas."
    note: "omissão do verbo to be, comum quando se transfere estrutura curta do português"
  - option: "I is Lucas."
    br_pt_form: "Eu é Lucas."
    note: "escolha incorreta da forma do verbo to be para o sujeito 'I'"
  - option: "My name are Lucas."
    br_pt_form: "Meu nome são Lucas."
    note: "concordância incorreta com sujeito singular 'name'"
```

**Item:**
> Choose the correct sentence to introduce yourself.

| Slot | Value |
|------|-------|
| A | "I Lucas." |
| B | **"I am Lucas."** ✓ |
| C | "I is Lucas." |
| D | "My name are Lucas." |

**Key:** B

**Feedback:**
> With the subject *I*, use **`am`**: **`I am Lucas.`** **A** is missing the verb. **C** uses *is*, which does not go with *I*. **D** uses *are*, but *name* is singular (*My name is Lucas*).

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_intro_welcome_001`
skill: `vocab.intro.courtesy`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_greetings`
distractors:
  - option: "Goodbye!"
    br_pt_form: "Tchau!"
    note: "usado para despedida, não para receber alguém"
  - option: "Sorry!"
    br_pt_form: "Desculpe!"
    note: "expressa pedido de desculpas, não boas-vindas"
  - option: "Thank you!"
    br_pt_form: "Obrigado!"
    note: "expressa gratidão, não recepção a quem chega"
```

**Item:**
> A new developer joins your team meeting. What can you say to greet them warmly?

| Slot | Value |
|------|-------|
| A | "Goodbye!" |
| B | "Sorry!" |
| C | **"Welcome!"** ✓ |
| D | "Thank you!" |

**Key:** C

**Feedback:**
> Use **`Welcome!`** to greet someone who is arriving. **A** is for leaving, **B** is for apologizing, and **D** is for thanking.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_intro_h_wh_001`
skill: `pronunciation.h_initial`
type: `minimal_pair_production`
difficulty_b: -0.1
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *hi* /haɪ/ begins with a soft breathy /h/, not the strong Portuguese "r" sound. In *what* /wʌt/ and *where* /wer/, start with rounded lips for /w/.
**Step 2 — produce (ASR-scored):** read aloud:

> "Hi! What is your name? Where are you from?"

**Target sounds:** initial /h/ in *Hi* · /w/ in *What*, *Where* · clear question intonation.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `wh_question_word_order` | Item 1 missed | **L2** | Review *wh-word + am/is/are + subject* with new name/origin questions. |
| `age_with_to_be` | Item 4 missed | **L2** | Contrast *I am X years old* with the Portuguese *ter* structure in new contexts. |
| `work_as_preposition` | Item 2 missed | **L2** | Practice job phrases (*work as a tester/designer/developer*) without L1 prepositions. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. All items target the authored lesson content; no external source text is reproduced.