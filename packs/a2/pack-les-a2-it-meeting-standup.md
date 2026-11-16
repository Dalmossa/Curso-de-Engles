# Practice Pack — `les_a2_it_meeting_standup`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_a2_it_meeting_standup_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_meeting_standup.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_meeting_standup_v1
lesson_id: les_a2_it_meeting_standup
learner_profile: default
estimated_minutes: 4.5
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

### 1.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 3 | 2–3 | ✅ |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: `grm_standup_present_perfect_recent_001`
skill: `grammar.present_perfect_completed_recent`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Yesterday I have fixed the login bug."
    br_pt_form: "Ontem eu tenho corrigido o bug."
    note: "present perfect usado com tempo passado definido (yesterday); em inglês natural usa-se past simple"
  - option: "Yesterday I am fixing the login bug."
    br_pt_form: "Ontem eu estou corrigindo o bug."
    note: "presente contínuo inadequado para ação concluída em tempo definido"
  - option: "Yesterday I fix the login bug."
    br_pt_form: "Ontem eu corrijo o bug."
    note: "presente simples inadequado para evento concluído no passado"
```

**Item:**
> Which sentence is correct for a finished action at a specific time in the past?

| Slot | Value |
|------|-------|
| A | "Yesterday I have fixed the login bug." |
| B | **"Yesterday I fixed the login bug."** ✓ |
| C | "Yesterday I am fixing the login bug." |
| D | "Yesterday I fix the login bug." |

**Key:** B

**Feedback:**
> Use the **past simple** (*fixed*) with a finished time like **yesterday**. The **present perfect** (*have fixed*) is better when the result matters now and the exact past time is not stated.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_standup_blocker_001`
skill: `vocab.meeting.blocker`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "a ticket I finished yesterday"
    br_pt_form: "um ticket que terminei ontem"
    note: "descreve trabalho concluído, não um impedimento atual"
  - option: "the plan for today's meeting"
    br_pt_form: "o plano da reunião de hoje"
    note: "agenda/plano, não algo que impede o progresso"
  - option: "a message in the team chat"
    br_pt_form: "uma mensagem no chat do time"
    note: "comunicação genérica; não indica necessariamente um bloqueio"
```

**Item:**
> In a daily stand-up, what is a **blocker**?

| Slot | Value |
|------|-------|
| A | A ticket you finished yesterday |
| B | **Something that stops your progress right now** ✓ |
| C | The plan for today's meeting |
| D | A message in the team chat |

**Key:** B

**Feedback:**
> A **blocker** is an impediment: something that prevents you from moving forward. In a stand-up, you mention it so the team can help remove it.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Grammar, current lesson

```yaml
item_id: `grm_standup_present_perfect_status_001`
skill: `grammar.present_perfect_completed_recent`
type: `contextual_selection`
difficulty_b: 0.0
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "I already finished the code review, but I didn't receive feedback yet."
    br_pt_form: "Eu já terminei a revisão, mas eu não recebi feedback ainda."
    note: "mistura past simple com 'yet' em contexto de resultado atual; em en-US é mais natural usar present perfect nas duas partes ligadas ao agora"
  - option: "I have finish the code review, but I haven't receive feedback yet."
    br_pt_form: "Eu tenho terminar a revisão, mas eu não tenho receber feedback ainda."
    note: "forma verbal incorreta (falta particípio passado) e calque estrutural do pt-BR"
  - option: "I finished already the code review, but I haven't received feedback yesterday."
    br_pt_form: "Eu terminei já a revisão, mas eu não recebi feedback ontem."
    note: "ordem pouco natural com 'already' e uso contraditório de 'yesterday' com present perfect negativo"
```

**Item:**
> Choose the best stand-up update for a result that matters now.

| Slot | Value |
|------|-------|
| A | "I already finished the code review, but I didn't receive feedback yet." |
| B | **"I have already finished the code review, but I haven't received feedback yet."** ✓ |
| C | "I have finish the code review, but I haven't receive feedback yet." |
| D | "I finished already the code review, but I haven't received feedback yesterday." |

**Key:** B

**Feedback:**
> Use the **present perfect** for completed work and current status: *have already finished* and *haven't received ... yet*. It connects past actions to the present situation in your stand-up.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: `rdg_standup_update_flow_001`
skill: `reading.standup_update`
type: `detail_identification`
difficulty_b: 0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Today, blocker, yesterday"
    br_pt_form: null
    note: "ordem invertida que dificulta entender progresso e impedimento"
  - option: "Blocker, yesterday, today"
    br_pt_form: null
    note: "começa pelo problema sem contexto do que foi feito"
  - option: "Yesterday, blocker, today"
    br_pt_form: null
    note: "plausível, mas deixa o plano de hoje por último e menos claro"
```

**Stimulus:**
> "Yesterday I fixed the API timeout. Today I will update the monitoring dashboard. I have a blocker: I haven't received production access."

**Item:**
> Which order best matches this stand-up update?

| Slot | Value |
|------|-------|
| A | **Yesterday → Today → Blocker** ✓ |
| B | Today → Blocker → Yesterday |
| C | Blocker → Yesterday → Today |
| D | Yesterday → Blocker → Today |

**Key:** A

**Feedback:**
> A clear stand-up update usually follows **yesterday, today, blocker**. This order shows what is done, what comes next, and what needs help.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Vocabulary, prerequisite review

```yaml
item_id: `voc_standup_prereq_ticket_001`
skill: `vocab.it_basics.ticket`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_terms_basics`
distractors:
  - option: "a short daily meeting"
    br_pt_form: "uma reunião diária curta"
    note: "confunde ticket com stand-up; termos diferentes no fluxo de trabalho"
  - option: "a server password"
    br_pt_form: "uma senha de servidor"
    note: "credencial de acesso, não unidade de trabalho rastreada"
  - option: "a code comment"
    br_pt_form: "um comentário no código"
    note: "anotação no código, sem função de rastreamento de tarefa"
```

**Item:**
> In software teams, a **ticket** is usually:

| Slot | Value |
|------|-------|
| A | A short daily meeting |
| B | **A task or issue tracked on a team board** ✓ |
| C | A server password |
| D | A code comment |

**Key:** B

**Feedback:**
> A **ticket** (or issue) is a unit of work tracked in tools like Jira or GitHub Issues. It helps the team organize, assign, and follow progress.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: `grm_standup_prereq_have_has_001`
skill: `grammar.present_perfect_auxiliary`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_it_terms_basics`
distractors:
  - option: "She have finished the deployment checklist."
    br_pt_form: "Ela têm terminado a lista de deploy."
    note: "auxiliar incorreto para terceira pessoa do singular (he/she/it → has)"
  - option: "She has finish the deployment checklist."
    br_pt_form: "Ela tem terminar a lista de deploy."
    note: "falta o particípio passado (finished) na estrutura do present perfect"
  - option: "She finished already the deployment checklist."
    br_pt_form: "Ela terminou já a lista de deploy."
    note: "ordem pouco natural e perde o foco no resultado relevante agora com 'already' em contexto de status"
```

**Item:**
> Choose the correct sentence for a completed task with present relevance.

| Slot | Value |
|------|-------|
| A | "She have finished the deployment checklist." |
| B | **"She has finished the deployment checklist."** ✓ |
| C | "She has finish the deployment checklist." |
| D | "She finished already the deployment checklist." |

**Key:** B

**Feedback:**
> In the **present perfect**, use *has* with *he/she/it* and the past participle: *has finished*. This form highlights that the task is complete now.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_standup_h_th_cluster_001`
skill: `pronunciation.h_initial`
type: `minimal_pair_production`
difficulty_b: -0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *have* /hæv/ starts with a light aspiration (not "rave"). *think* /θɪŋk/ uses /θ/ with the tongue between the teeth (not "tink"/"fink"). *fixed* /fɪkst/ keeps the final cluster without adding an extra vowel.
**Step 2 — produce (ASR-scored):** read aloud:

> "I have fixed this bug, but I haven't finished the tests yet."

**Target phonemes:** /h/ in *have, haven't* · /ð/ in *this* · final clusters in *fixed, tests* without epenthetic vowel.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `present_perfect_vs_past_simple` | Item 1 or 3 missed | **L2** | Contrast *yesterday I fixed* with *I have already fixed* using short stand-up updates. |
| `standup_blocker_vocabulary` | Item 2 missed | **L2** | Practice identifying blockers vs. plans and completed tasks in agile updates. |
| `have_has_participle_form` | Item 6 missed | **L2** | Review *have/has + past participle* with third-person and negative forms. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target the authored lesson content and prerequisite review; no external source text is reproduced.
