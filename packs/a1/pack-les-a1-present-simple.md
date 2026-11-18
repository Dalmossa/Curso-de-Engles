# Practice Pack — `les_a1_present_simple`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_present_simple_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_present_simple.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_present_simple_v1
lesson_id: les_a1_present_simple
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
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 2 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: `grm_ps_third_person_s_001`
skill: `grammar.third_person_s`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "She check the alerts every morning."
    br_pt_form: "Ela verifica os alertas toda manhã."
    note: "third person singular without the -s ending; pt-BR does not mark person on the verb, but English requires -s with she"
  - option: "She checking the alerts every morning."
    br_pt_form: "Ela está verificando os alertas toda manhã."
    note: "-ing form needs the verb to be (is checking); the present continuous does not fit a daily routine"
  - option: "She checked the alerts every morning."
    br_pt_form: "Ela verificou os alertas naquela manhã."
    note: "past form (-ed) reports a finished action, not a repeated routine"
```

**Item:**
> Which sentence correctly describes a colleague's daily routine?

| Slot | Value |
|------|-------|
| A | "She check the alerts every morning." |
| B | **"She checks the alerts every morning."** ✓ |
| C | "She checking the alerts every morning." |
| D | "She checked the alerts every morning." |

**Key:** B

**Feedback:**
> **`She checks the alerts every morning.`** — com *she*, o verbo leva -s. **A** omite o -s (transferência do pt-BR), **C** usa -ing sem auxiliar e **D** coloca a ação no passado.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, prerequisite review

```yaml
item_id: `grm_ps_prereq_ed_review_001`
skill: `grammar.past_simple_regular`
type: `error_correction`
difficulty_b: -0.1
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_regular_verbs_past`
distractors:
  - option: "I deploy the fix yesterday."
    br_pt_form: "Eu faço deploy da correção ontem."
    note: "present simple cannot anchor a finished action to yesterday; the past ending -d is required"
  - option: "I deploys the fix yesterday."
    br_pt_form: "Eu faz deploy da correção ontem."
    note: "mixes the third person -s with the subject I and still misses the past ending"
  - option: "I deploying the fix yesterday."
    br_pt_form: "Eu fazendo deploy da correção ontem."
    note: "-ing without the verb to be cannot express a completed action"
```

**Item:**
> Your teammate reports what she finished. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | **"I deployed the fix yesterday."** ✓ |
| B | "I deploy the fix yesterday." |
| C | "I deploys the fix yesterday." |
| D | "I deploying the fix yesterday." |

**Key:** A

**Feedback:**
> **`I deployed the fix yesterday.`** — ação concluída ontem pede o passado (*deploy + -ed* → *deployed*). **B** fica no presente, **C** mistura -s de 3ª pessoa com *I* e **D** usa -ing sem auxiliar.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_ps_frequency_adverbs_001`
skill: `vocab.present_simple.frequency_adverbs`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: always
    br_pt_form: "sempre"
    note: "always means 100% of the time, the opposite of the described situation"
  - option: usually
    br_pt_form: "geralmente"
    note: "usually signals high frequency, not the complete absence described"
  - option: sometimes
    br_pt_form: "às vezes"
    note: "sometimes marks partial frequency, contradicting the 0% rate"
```

**Item:**
> The smoke tests fail 0% of the time on the main branch. Which adverb matches this frequency?

| Slot | Value |
|------|-------|
| A | always |
| B | usually |
| C | **never** ✓ |
| D | sometimes |

**Key:** C

**Feedback:**
> **`never`** indica frequência 0%. *Always* é 100%, *usually* é alta e *sometimes* é parcial — nenhuma descreve ausência total de falhas.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: `voc_ps_routine_verbs_001`
skill: `vocab.present_simple.routine_verbs`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "She opens the alerts."
    br_pt_form: "Ela abre os alertas."
    note: "open fits files or tickets; monitoring an active feed is watch"
  - option: "She reads the alerts."
    br_pt_form: "Ela lê os alertas."
    note: "read is a single, completed action; watch implies continuous monitoring"
  - option: "She writes the alerts."
    br_pt_form: "Ela escreve os alertas."
    note: "write means creating the alerts, the opposite of the monitoring role"
```

**Item:**
> An SRE engineer monitors production problems during the shift. Which verb completes the routine sentence: "She ______ the alerts."?

| Slot | Value |
|------|-------|
| A | "She opens the alerts." |
| B | "She reads the alerts." |
| C | **"She watches the alerts."** ✓ |
| D | "She writes the alerts." |

**Key:** C

**Feedback:**
> **`She watches the alerts.`** — *watch* descreve monitoramento contínuo. *Open* se aplica a arquivos e tickets, *read* é ação pontual e *write* é criar o alerta.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Reading, current lesson

```yaml
item_id: `rdg_ps_standup_update_001`
skill: `reading.present_simple.standup_update`
type: `detail_identification`
difficulty_b: 0.0
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: Deploys the dashboard.
    br_pt_form: "Faz deploy do dashboard."
    note: "the teammate deploys on Fridays; the speaker checks the tests before nine"
  - option: Answers the tickets.
    br_pt_form: "Responde os tickets."
    note: "Nina answers the tickets in the morning, not the speaker"
  - option: Watches the alerts all night.
    br_pt_form: "Observa os alertas a noite toda."
    note: "the alerts run all night; the speaker does not watch them personally"
```

**Stimulus:**
> "Good morning. I usually start with the CI results. My teammate deploys the dashboard on Fridays, so I check the smoke tests before nine. The alerts run all night, and Nina answers the tickets in the morning."

**Item:**
> What does the speaker do before nine?

| Slot | Value |
|------|-------|
| A | Deploys the dashboard. |
| B | Answers the tickets. |
| C | Watches the alerts all night. |
| D | **Checks the smoke tests.** ✓ |

**Key:** D

**Feedback:**
> O speaker afirma *I check the smoke tests before nine* diretamente. **A** é o teammate (sextas), **B** é a Nina e **C** é o que os alertas fazem, não o speaker.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Reading, prerequisite review

```yaml
item_id: `rdg_ps_prereq_ed_context_001`
skill: `reading.past_simple_regular`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
prereq_lesson: `les_a1_regular_verbs_past`
distractors:
  - option: The backup.
    br_pt_form: "O backup."
    note: "the teammate tested the backup at noon; the speaker finished the script"
  - option: The runbook.
    br_pt_form: "O runbook."
    note: "the team updated the runbook together, not the speaker alone"
  - option: The incident.
    br_pt_form: "O incidente."
    note: "the incident motivates the timeline; nobody finished it"
```

**Stimulus:**
> "Yesterday I finished the migration script. My teammate tested the backup at noon. We updated the runbook after the incident."

**Item:**
> What did the speaker finish yesterday?

| Slot | Value |
|------|-------|
| A | **The migration script.** ✓ |
| B | The backup. |
| C | The runbook. |
| D | The incident. |

**Key:** A

**Feedback:**
> "I finished the migration script" é afirmação direta do speaker. **B** foi testado pelo teammate, **C** foi atualizado pelo time e **D** é o contexto do trabalho, não algo concluído.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_ps_s_cluster_001`
skill: `pronunciation.third_person_s_endings`
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

**Step 1 — hear the contrast:** *works* termina no simples /s/ depois de /k/, sem sílaba extra; *watches* ganha a sílaba /ɪz/ porque -ch é sibilante; *deploys* termina em /z/ sonoro.
**Step 2 — produce (ASR-scored):** read aloud:

> "She works hard and she watches the alerts every morning."

**Target phonemes:** /s/ em works · /z/ em deploys · /ɪz/ em watches · cluster /ks/ sem vogal epentética.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `third_person_s_spelling` | Item 1 missed | **L2** | Drill the -s/-es spelling split after sibilants (*watches, releases*) vs. plain consonants (*works, deploys*). |
| `past_ed_review` | Item 2 missed | **L2** | Contrast present simple and past -ed in short shift reports. |
| `frequency_adverb_position` | Item 3 missed | **L2** | Reposition *always, usually, sometimes, never* before the main verb. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.