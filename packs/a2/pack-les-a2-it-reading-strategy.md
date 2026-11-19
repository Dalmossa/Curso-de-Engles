# Practice Pack — `les_a2_it_reading_strategy`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_reading_strategy_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_reading_strategy.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_reading_strategy_v1
lesson_id: les_a2_it_reading_strategy
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
item_id: grm_it_reading_imperative_001
skill: `grammar.it_reading_imperatives`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Scan the changelog for the rollback command."
    br_pt_form: "Faça scan no changelog para o comando de rollback."
    note: "scanning targets one datum; the instruction asks for the overall point"
  - option: "Skimming the changelog for the main change."
    br_pt_form: "Fazendo skimming no changelog para a mudança principal."
    note: "the -ing form cannot open a direct instruction; Portuguese gerund is carried over"
  - option: "Skims the changelog for the main change."
    br_pt_form: "Faz skimming no changelog para a mudança principal."
    note: "a third-person -s ending turns the instruction into a statement about someone else"
```

**Item:**
> You have ten seconds before a release. Which instruction tells a teammate to read the changelog for the **main change**?

| Slot | Value |
|------|-------|
| A | "Scan the changelog for the rollback command." |
| B | **"Skim the changelog for the main change."** ✓ |
| C | "Skimming the changelog for the main change." |
| D | "Skims the changelog for the main change." |

**Key:** B

**Feedback:**
> A direct reading instruction uses the base verb: **`Skim the changelog for the main change.`** **A** describes *scanning*, **C** uses a gerund where the imperative is required and **D** adds a third-person **-s**.
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_it_reading_skim_001
skill: `reading.it_skimming_structure`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Requests are limited to 100 per minute."
    br_pt_form: "As requisições são limitadas a 100 por minuto."
    note: "a true datum, but a detail found by scanning, not the structural main change"
  - option: "The endpoint returns a customer's orders."
    br_pt_form: "O endpoint retorna os pedidos de um cliente."
    note: "states what the endpoint does; it does not say what changed in this version"
  - option: "The limit starts on 30 June."
    br_pt_form: "O limite começa em 30 de junho."
    note: "an effective date is a scan target, not the headline of the excerpt"
```

**Stimulus:**
> "GET /v2/orders — Rate limits. This endpoint returns a customer's orders. The legacy endpoint /v1/orders still works, but new clients should use /v2/orders. Requests are limited to 100 per minute. The limit starts on 30 June."

**Item:**
> Skim the excerpt for structure. Which sentence states the main change?

| Slot | Value |
|------|-------|
| A | "Requests are limited to 100 per minute." |
| B | **"New clients should use /v2/orders; /v1/orders is legacy."** ✓ |
| C | "The endpoint returns a customer's orders." |
| D | "The limit starts on 30 June." |

**Key:** B

**Feedback:**
> The heading names the topic and the sentence about the legacy endpoint carries the change: **`New clients should use /v2/orders; /v1/orders is legacy.`** **A** and **D** are scan targets (limit and date), while **C** describes the endpoint's function, not a change.
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_it_reading_cognate_001
skill: `vocab.it_reading_cognates`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Actually the legacy endpoint still answers requests."
    br_pt_form: "Atualmente o endpoint legado ainda responde requisições."
    note: "actually means de fato; using it for atualmente is the classic BR-PT false cognate"
  - option: "Eventually the legacy endpoint still answers requests."
    br_pt_form: "Eventualmente o endpoint legado ainda responde requisições."
    note: "eventually means com o tempo; the Portuguese adverb misleads in a status line"
  - option: "In the moment the legacy endpoint still answers requests."
    br_pt_form: "No momento o endpoint legado ainda responde requisições."
    note: "calque of no momento; English uses currently or at the moment, not in the moment"
```

**Item:**
> A Brazilian teammate writes a status line meaning "Atualmente o endpoint legado ainda responde requisições." Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "Actually the legacy endpoint still answers requests." |
| B | "Eventually the legacy endpoint still answers requests." |
| C | "In the moment the legacy endpoint still answers requests." |
| D | **"Currently the legacy endpoint still answers requests."** ✓ |

**Key:** D

**Feedback:**
> The natural word for "atualmente" in a status update is **`currently`**: **`Currently the legacy endpoint still answers requests.`** **A** means "de fato", **B** means "com o tempo" and **C** is a calque of "no momento".
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_it_reading_scan_001
skill: `reading.it_scan_datum`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "deploy --rollback 2.4.0"
    br_pt_form: "deploy --rollback 2.4.0 (a versão nova)"
    note: "uses the new version instead of the last known good version in the note"
  - option: "deploy --migrate 2.3.9"
    br_pt_form: "deploy --migrate 2.3.9 (migração)"
    note: "the note explicitly says no database migration is needed; the verb is wrong"
  - option: "deploy --rollback v1/session"
    br_pt_form: "deploy --rollback v1/session (o endpoint antigo)"
    note: "swaps the version for an endpoint name; scanning must preserve the exact token"
```

**Stimulus:**
> "Release 2.4.0 — Login is faster. The old /v1/session endpoint is deprecated but still answers requests. New clients must use /v2/session from 30 June. Rollback: deploy --rollback 2.3.9. No database migration is needed."

**Item:**
> Scan the note for the exact rollback command. Which line do you copy?

| Slot | Value |
|------|-------|
| A | "deploy --rollback 2.4.0" |
| B | **"deploy --rollback 2.3.9"** ✓ |
| C | "deploy --migrate 2.3.9" |
| D | "deploy --rollback v1/session" |

**Key:** B

**Feedback:**
> Scanning fixes on the token after *Rollback*: **`deploy --rollback 2.3.9`**. **A** changes the version, **C** changes the verb and contradicts the no-migration line, and **D** substitutes an endpoint for the version.
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_it_reading_s_cluster_001
skill: `pronunciation.it_reading_s_cluster`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *skim* /skɪm/ and *scan* /skæn/ begin with the /sk/ cluster; *some* /sʌm/ begins with /s/ alone. Brazilian Portuguese inserts a vowel before the cluster and produces "esquim" and "escã". Keep the /s/ and /k/ attached, with no extra vowel.

**Step 2 — produce (ASR-scored):** read aloud:

> "I skim the doc and scan the issue for the date."

**Target phonemes:** /sk/ in *skim, scan* · /s/ in *scan, section* · /ð/ in *the*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_it_reading_ps_regular_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_present_simple
distractors:
  - option: "The old endpoint still answer requests."
    br_pt_form: "O endpoint antigo ainda responder requisições."
    note: "Portuguese has no third-person -s, so the singular subject loses the English verb marker"
  - option: "The old endpoint is still answer requests."
    br_pt_form: "O endpoint antigo está ainda responder requisições."
    note: "Portuguese estar + infinitive invites a be-form before the English bare verb"
  - option: "The old endpoint still answering requests."
    br_pt_form: "O endpoint antigo ainda respondendo requisições."
    note: "the gerund maps onto the Portuguese respondendo but is not a finite present form"
```

**Item:**
> Reviewing the present simple before you describe a recurring behaviour in API docs, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The old endpoint still answer requests." |
| B | **"The old endpoint still answers requests."** ✓ |
| C | "The old endpoint is still answer requests." |
| D | "The old endpoint still answering requests." |

**Key:** B

**Feedback:**
> A recurring fact uses the present simple with a third-person **-s**: **`The old endpoint still answers requests.`** **A** drops **-s**, **C** inserts *be* before the bare verb and **D** leaves a gerund with no auxiliary.
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_it_reading_core_terms_001
skill: `vocab.it_core_terms`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "Run the return command if the release breaks production."
    br_pt_form: "Rode o comando de retorno se a release quebrar a produção."
    note: "calque of retorno; English release notes use rollback for undoing a deploy"
  - option: "Run the rollback command to publish the next release."
    br_pt_form: "Rode o comando de rollback para publicar a próxima release."
    note: "rollback undoes a release; it does not publish the next one"
  - option: "Run the rollback command to add a new feature."
    br_pt_form: "Rode o comando de rollback para adicionar uma nova funcionalidade."
    note: "a new feature is delivered by a deploy, not by rolling back"
```

**Item:**
> Reviewing core IT terms before you read a README, which sentence uses **rollback** with the right meaning?

| Slot | Value |
|------|-------|
| A | "Run the return command if the release breaks production." |
| B | "Run the rollback command to publish the next release." |
| C | "Run the rollback command to add a new feature." |
| D | **"Run the rollback command if the release breaks production."** ✓ |

**Key:** D

**Feedback:**
> **`Rollback`** means undoing a bad release: **`Run the rollback command if the release breaks production.`** **A** calques *retorno*, **B** reverses the direction of the action and **C** confuses rollback with adding a feature.
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `it_reading_skim_scan_contrast` | Items 1, 2 or 4 missed | **L2** | Contrast *skim for structure* and *scan for the command/date/limit* in short API-doc previews. |
| `it_reading_false_cognates` | Item 3 missed | **L2** | Separate *currently*, *actually* and *eventually* in status lines written by BR-PT speakers. |
| `it_reading_present_simple_review` | Item 6 missed | **L2** | Drill the third-person **-s** in recurring-behaviour lines such as *the old endpoint still answers requests*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_it_terms_basics` and carry `prereq_lesson` for the interleaving rule.
4. Every stimulus, option and feedback line is authored for this lesson; no external source text is reproduced or adapted.
5. Listening is deferred (`listening_items: 0`); its slot is redistributed to the two reading items, per `post-lesson-practice-spec.md` §2.2.
6. Item ids carry the distinctive `it_reading` token to avoid collisions with the A2 general reading pack.
