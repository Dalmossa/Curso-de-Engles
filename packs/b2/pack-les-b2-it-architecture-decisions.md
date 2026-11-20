# Practice Pack — `les_b2_it_architecture_decisions`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_it_architecture_decisions_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_it_architecture_decisions.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_architecture_decisions_v1
lesson_id: les_b2_it_architecture_decisions
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
item_id: grm_it_architecture_decisions_passive_001
skill: `grammar.passive_adr`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "Database polling was reject because of latency."
    br_pt_form: "A consulta ao banco foi rejeitar por causa da latência."
    note: "the passive needs a past participle, not the base form of the verb"
  - option: "Database polling were rejected because of latency."
    br_pt_form: "As consultas ao banco foram rejeitadas por causa da latência."
    note: "the singular subject 'database polling' takes 'was', not 'were'"
  - option: "Database polling rejected because of latency."
    br_pt_form: "A consulta ao banco rejeitou por causa da latência."
    note: "a passive clause requires the auxiliary 'was'; without it the subject looks like an agent"
```

**Item:**
> In an ADR, which sentence records a rejected alternative correctly in the passive voice?

| Slot | Value |
|------|-------|
| A | "Database polling was reject because of latency." |
| B | **"Database polling was rejected because of latency."** ✓ |
| C | "Database polling were rejected because of latency." |
| D | "Database polling rejected because of latency." |

**Key:** B

**Feedback:**
> **B** uses *was* + past participle and keeps the process as the subject. **A** leaves the verb in the base form after *was*, **C** breaks agreement with a singular subject, and **D** drops the auxiliary and turns the patient into an agent.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_it_architecture_decisions_context_001
skill: `reading.adr_scan`
type: `detail_identification`
difficulty_b: -0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The managed queue costs more than expected."
    br_pt_form: "A fila gerenciada custa mais do que o esperado."
    note: "the new monthly cost appears in consequences, not in the motivating context"
  - option: "The retention policy is too short."
    br_pt_form: "A política de retenção é curta demais."
    note: "less control over retention is a stated trade-off, not the problem being solved"
  - option: "On-call engineers cannot reach the broker."
    br_pt_form: "Os engenheiros de plantão não conseguem acessar o broker."
    note: "on-call load is the reason for rejecting the self-hosted broker, not the context"
```

**Stimulus:**
> "ADR-027 — Status: proposed. Context: order events are dropped when the checkout service restarts during a deploy. Decision: we will publish order events to a managed queue. Consequences: fewer dropped events and simpler recovery, but a new monthly cost and less control over retention. Alternatives considered: a self-hosted broker (rejected — on-call load) and database polling (rejected — latency)."

**Item:**
> What problem does the **context** of ADR-027 describe?

| Slot | Value |
|------|-------|
| A | The managed queue costs more than expected. |
| B | The retention policy is too short. |
| C | **Order events are dropped when the checkout service restarts during a deploy.** ✓ |
| D | On-call engineers cannot reach the broker. |

**Key:** C

**Feedback:**
> **C** restates the context sentence about dropped order events. **A** belongs to consequences, **B** recasts the retention trade-off as a defect, and **D** misplaces the rejection reason for a self-hosted broker.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_it_architecture_decisions_tradeoff_001
skill: `vocab.adr.trade_off`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "constraint"
    br_pt_form: "restrição / limitação de projeto"
    note: "a constraint limits the design space; it does not name what is gained and lost"
  - option: "rationale"
    br_pt_form: "justificativa"
    note: "the rationale explains why the decision was made, not the balance of benefits and costs"
  - option: "rejection"
    br_pt_form: "rejeição de uma alternativa"
    note: "rejection is the act of discarding an option, not the balance itself"
```

**Item:**
> Which word names the balance between a benefit and a cost in an ADR?

| Slot | Value |
|------|-------|
| A | constraint |
| B | rationale |
| C | **trade-off** ✓ |
| D | rejection |

**Key:** C

**Feedback:**
> **C** — a *trade-off* is exactly what you gain on one side and give up on the other. **A** is a limit on the design, **B** is the reason for choosing, and **D** is what happens to an alternative that was not chosen.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_it_architecture_decisions_alternatives_001
skill: `reading.adr_scan`
type: `inference`
difficulty_b: 0.3
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "It adds about two seconds of polling lag."
    br_pt_form: "Isso adiciona cerca de dois segundos de atraso de consulta."
    note: "the polling lag is a consequence of the chosen outbox design, not a rejection reason"
  - option: "It cannot keep a consistent read model."
    br_pt_form: "Não consegue manter um modelo de leitura consistente."
    note: "consistency is the goal in the context; it is not given as the reason for rejection"
  - option: "It requires synchronous dual writes."
    br_pt_form: "Exige gravações duplas síncronas."
    note: "dual writes were a separate alternative, rejected for inconsistent commits"
```

**Stimulus:**
> "ADR-031 — Status: accepted. Context: the orders service must keep a consistent read model after checkout. Decision: use the outbox pattern with the existing relational database. Consequences: no new infrastructure, but extra storage and a polling lag of about two seconds. Alternatives considered: a managed event stream (rejected — new operational surface) and synchronous dual writes (rejected — inconsistent commits)."

**Item:**
> Why was the managed event stream rejected in ADR-031?

| Slot | Value |
|------|-------|
| A | **It would create a new operational surface.** ✓ |
| B | It adds about two seconds of polling lag. |
| C | It cannot keep a consistent read model. |
| D | It requires synchronous dual writes. |

**Key:** A

**Feedback:**
> **A** matches the parenthetical reason after *rejected*. **B** is a consequence of the selected design, **C** turns the context goal into a rejection reason, and **D** assigns the motive of a different alternative to this one.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_it_architecture_decisions_word_stress_001
skill: `pronunciation.adr_word_stress`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_it_architecture_decisions_word_stress_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — focus:** In ADR reviews, the voiced /ð/ in *the* must not become /d/; the /ʒ/ in *decision* must not become the voiceless /ʃ/ of *ship*. Keep the final /t/ in *rejected* clean, without epenthetic /ɪ/. Stress *supersede* on the last syllable: /ˌsuːpərˈsiːd/ — "su-per-**SEED**".

**Step 2 — produce (ASR-scored):** read aloud:

> "The decision was rejected, so a new ADR will supersede the old one."

**Target phonemes:** /ð/ in *the* · /ʒ/ in *decision* · /t/ final in *rejected*, without an added /ɪ/ · /iː/ in the final syllable of *supersede*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_it_architecture_decisions_passive_basics_001
skill: `grammar.passive_basics`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: les_a2_it_typescript_basics
distractors:
  - option: "The interface is implement by the service."
    br_pt_form: "A interface é implementar pelo serviço."
    note: "the passive requires a past participle after 'is'"
  - option: "The interface are implemented by the service."
    br_pt_form: "As interfaces são implementadas pelo serviço."
    note: "a singular subject takes 'is', not 'are'"
  - option: "The interface implemented by the service."
    br_pt_form: "A interface implementada pelo serviço."
    note: "a fragment with no auxiliary cannot be the main clause of the sentence"
```

**Item:**
> Reviewing technical passives: which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The interface is implement by the service." |
| B | **"The interface is implemented by the service."** ✓ |
| C | "The interface are implemented by the service." |
| D | "The interface implemented by the service." |

**Key:** B

**Feedback:**
> **B** has *is* + past participle and agrees with the singular subject. **A** uses the base form after *is*, **C** uses plural agreement with a singular subject, and **D** is only a fragment because the auxiliary is missing.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_it_architecture_decisions_it_terms_001
skill: `vocab.it_computer_terms`
type: `contextual_selection`
difficulty_b: -0.1
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_algorithms_basics
distractors:
  - option: "hash map"
    br_pt_form: "mapa de hash"
    note: "a hash map is a data structure, not a description of growth rate"
  - option: "array"
    br_pt_form: "vetor / array"
    note: "an array stores elements; it does not express how runtime scales"
  - option: "interface"
    br_pt_form: "interface"
    note: "an interface is a contract in code, unrelated to complexity measurement"
```

**Item:**
> Reviewing IT terms: which expression describes how runtime grows as the input size increases?

| Slot | Value |
|------|-------|
| A | **Big O notation** ✓ |
| B | hash map |
| C | array |
| D | interface |

**Key:** A

**Feedback:**
> **A** — *Big O notation* describes the growth of an algorithm's runtime or space. **B** and **C** are data structures, while **D** is a code contract; none of them names a growth rate.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `adr_passive_voice` | Item 1 or 6 missed | **L2** | Contrast *was rejected / were rejected / rejected* in short ADR records with a singular technical subject. |
| `adr_section_scan` | Items 2 and 4 missed | **L2** | Drill *context* versus *consequences* versus *alternatives considered* in two short ADR excerpts; separate the problem from the trade-off. |
| `adr_decision_vocab` | Item 3 or 7 missed | **L2** | Recycle *trade-off / constraint / rationale / rejection* alongside *Big O notation* in one review sentence about a technical decision. |

---

## 4. VALIDATION NOTES

1. All `b` values are illustrative priors, per `assessment-item-spec.md` §8.2; the pack is authored, not calibrated.
2. Item 5 is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration. The lesson's listening input is `deferred_render`.
3. Items 6 and 7 review `les_a2_it_typescript_basics` and `les_a2_it_algorithms_basics` respectively and carry `prereq_lesson` for the interleaving rule; `les_a2_it_terms_basics` is also a verified prerequisite of the lesson, in `it_computer_terms`.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room. The ADR excerpts (ADR-027 and ADR-031) are invented for this pack; no external source text is reproduced or adapted.
