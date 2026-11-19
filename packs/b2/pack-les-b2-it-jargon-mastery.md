# Practice Pack — `les_b2_it_jargon_mastery`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_b2_it_jargon_mastery_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_it_jargon_mastery.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_jargon_mastery_v1
lesson_id: les_b2_it_jargon_mastery
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
item_id: grm_it_jargon_mastery_appositive_001
skill: `grammar.acronym_expansion_appositives`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "The SLI is measure as successful requests divided by total requests."
    br_pt_form: "O SLI é medido como requisições bem-sucedidas divididas pelo total."
    note: "the passive needs the past participle 'measured', not the base form"
  - option: "The SLI (Service Level Indicator) measured as successful requests divided by total requests."
    br_pt_form: "O SLI (indicador de nível de serviço) medido como requisições bem-sucedidas divididas pelo total."
    note: "the appositive is fine, but the clause has no auxiliary verb"
  - option: "The SLI is measuring successful requests divided by total requests."
    br_pt_form: "O SLI está medindo requisições bem-sucedidas divididas pelo total."
    note: "the continuous tense turns a stable definition into an action happening now"
```

**Item:**
> Which line defines an acronym correctly on its first use in a technical update?

| Slot | Value |
|------|-------|
| A | "The SLI is measure as successful requests divided by total requests." |
| B | **"The SLI (Service Level Indicator) is measured as successful requests divided by total requests."** ✓ |
| C | "The SLI (Service Level Indicator) measured as successful requests divided by total requests." |
| D | "The SLI is measuring successful requests divided by total requests." |

**Key:** B

**Feedback:**
> **B** expands the acronym in an appositive and uses the passive *is measured as*. **A** puts the base form *measure* after *is*, **C** drops the auxiliary entirely, and **D** replaces the definition with a continuous action.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_it_jargon_mastery_status_note_001
skill: `reading.jargon_status_note`
type: `inference`
difficulty_b: 0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The team missed its SLA because latency doubled."
    br_pt_form: "O time descumpriu o SLA porque a latência dobrou."
    note: "the note reports an SLO held inside the SLA; no breach is stated"
  - option: "RTO and RPO were both increased after the incident."
    br_pt_form: "RTO e RPO foram ambos aumentados depois do incidente."
    note: "the runbook values stayed at fifteen and five minutes"
  - option: "MTTR measures the percentage of failed requests."
    br_pt_form: "MTTR mede a porcentagem de requisições falhas."
    note: "MTTR is recovery time; the failure ratio is the SLI"
```

**Stimulus:**
> "Status note: Our SLA promises 99.9% availability. We track an SLI of successful requests over total requests and hold the SLO at 99.95%. Last week P95 latency doubled and MTTR reached forty minutes; the runbook still sets RTO at fifteen and RPO at five."

**Item:**
> Which conclusion is supported by the status note?

| Slot | Value |
|------|-------|
| A | The team missed its SLA because latency doubled. |
| B | **The internal target is stricter than the promise made to customers.** ✓ |
| C | RTO and RPO were both increased after the incident. |
| D | MTTR measures the percentage of failed requests. |

**Key:** B

**Feedback:**
> 99.95% (the **SLO**) is tighter than 99.9% (the **SLA**). **A** invents a breach the note never reports, **C** changes unchanged runbook values, and **D** assigns the SLI's job to MTTR.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_it_jargon_mastery_rpo_001
skill: `vocab.it_jargon.recovery_targets`
type: `contextual_selection`
difficulty_b: 0.0
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "RTO (Recovery Time Objective)"
    br_pt_form: "RTO (objetivo de tempo de recuperação)"
    note: "RTO limits downtime, not the amount of lost data"
  - option: "MTTR (Mean Time to Recovery)"
    br_pt_form: "MTTR (tempo médio de recuperação)"
    note: "MTTR reports an observed average, not a planned data-loss limit"
  - option: "P95 (95th percentile)"
    br_pt_form: "P95 (percentil 95)"
    note: "P95 is a latency statistic, not a recovery target"
```

**Item:**
> Which term answers "how much data can we afford to lose in a restore?"

| Slot | Value |
|------|-------|
| A | RTO (Recovery Time Objective) |
| B | MTTR (Mean Time to Recovery) |
| C | **RPO (Recovery Point Objective)** ✓ |
| D | P95 (95th percentile) |

**Key:** C

**Feedback:**
> **RPO** is the point in time you can restore back to, so it answers the data-loss question. **A** is about time offline, **B** is an observed average after a failure, and **D** describes where 95% of latency readings sit.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_it_jargon_mastery_release_note_001
skill: `reading.jargon_status_note`
type: `detail_identification`
difficulty_b: 0.2
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The SSO rollout doubled the QPS limit."
    br_pt_form: "A implantação do SSO dobrou o limite de QPS."
    note: "SSO is about login reuse; the note links the load to the campaign"
  - option: "The CI/CD pipeline rejected the release at 18:00."
    br_pt_form: "O pipeline de CI/CD rejeitou a versão às 18:00."
    note: "the note says the change went out through CI/CD, not that it was rejected"
  - option: "An SLA breach stopped the campaign."
    br_pt_form: "Uma violação de SLA interrompeu a campanha."
    note: "the note explicitly says no customer-facing SLA was affected"
```

**Stimulus:**
> "Release note: At 18:00 the gateway hit eight hundred QPS during the campaign. The change went out through CI/CD, and SSO let staff reuse their corporate login. No customer-facing SLA was affected."

**Item:**
> What explains the load on the gateway at 18:00?

| Slot | Value |
|------|-------|
| A | **A campaign drove traffic to the gateway.** ✓ |
| B | The SSO rollout doubled the QPS limit. |
| C | The CI/CD pipeline rejected the release at 18:00. |
| D | An SLA breach stopped the campaign. |

**Key:** A

**Feedback:**
> The note says the gateway hit eight hundred QPS *during the campaign*, so **A** is the supported cause. **B** assigns the traffic to SSO, **C** reverses the CI/CD outcome, and **D** contradicts the explicit "no customer-facing SLA was affected".

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_it_jargon_mastery_initialisms_001
skill: `pronunciation.initialisms_letter_by_letter`
type: `minimal_pair_production`
difficulty_b: 0.3
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *SLA* is /es el eɪ/ and *SLI* is /es el aɪ/ — three letters each, with a glide on the last one, never "sla"/"sli" as a single word. *MTTR* is /em tiː tiː ɑːr/, with two long /tiː/ syllables; Brazilian learners often collapse them into /mɪtər/. *SSO* stays /es es oʊ/ in this reading, even though some teams say /soʊ/.

**Step 2 — produce (ASR-scored):** read aloud:

> "Our SLA is safe, but the SLI dropped; MTTR was forty minutes and SSO was slow."

**Target phonemes:** /eɪ/ in *SLA* · /aɪ/ in *SLI* · /tiː/ twice and /ɑːr/ in *MTTR* · /es es oʊ/ in *SSO* · /ð/ in *the*, with voice, not /d/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_it_jargon_mastery_comparison_001
skill: `grammar.technical_comparisons`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_it_algorithms_basics`
distractors:
  - option: "P95 latency was twice higher than the target."
    br_pt_form: "A latência P95 era duas vezes mais alta que a meta."
    note: "'twice as ... as' is the standard multiplicative comparison"
  - option: "P95 latency was as twice high as the target."
    br_pt_form: "A latência P95 era como duas vezes alta quanto a meta."
    note: "'as' cannot precede 'twice' in the equative frame"
  - option: "P95 latency was twice more high than the target."
    br_pt_form: "A latência P95 era duas vezes mais alta do que a meta."
    note: "'more' and the '-er' form are doubled here"
```

**Item:**
> Reviewing technical comparisons: which line reports that latency was two times the target?

| Slot | Value |
|------|-------|
| A | "P95 latency was twice higher than the target." |
| B | **"P95 latency was twice as high as the target."** ✓ |
| C | "P95 latency was as twice high as the target." |
| D | "P95 latency was twice more high than the target." |

**Key:** B

**Feedback:**
> Multiplicative comparisons use **twice as + adjective + as**. **A** uses *higher than* after *twice*, **C** puts the first *as* before *twice*, and **D** stacks *more* on the comparative form.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_it_jargon_mastery_sso_001
skill: `vocab.it_jargon.delivery_access`
type: `contextual_selection`
difficulty_b: -0.1
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_corpus_intro`
distractors:
  - option: "Single Sign-On — a separate password for each system."
    br_pt_form: "Login único — uma senha diferente para cada sistema."
    note: "that describes the situation SSO removes"
  - option: "Service Sign-On — the SLA login page."
    br_pt_form: "Login de serviço — a página de login do SLA."
    note: "the expansion is invented and confuses SSO with an SLA"
  - option: "Secure System Operation — a firewall setting."
    br_pt_form: "Operação Segura do Sistema — uma configuração de firewall."
    note: "an invented expansion unrelated to login reuse"
```

**Item:**
> Reviewing acronyms: which option expands **SSO** and gives its plain-language sense?

| Slot | Value |
|------|-------|
| A | **Single Sign-On — one corporate login for several systems.** ✓ |
| B | Single Sign-On — a separate password for each system. |
| C | Service Sign-On — the SLA login page. |
| D | Secure System Operation — a firewall setting. |

**Key:** A

**Feedback:**
> **SSO** means *single sign-on*: one corporate credential opens several systems. **B** states the opposite, **C** invents an expansion and mixes in the SLA, and **D** invents a firewall meaning.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `acronym_expansion_first_use` | Item 1 missed | **L2** | Practise the appositive frame *SLA (Service Level Agreement) is...* and the passive *is measured as* in short status lines. |
| `sla_slo_sli_distinction` | Items 2 and 3 missed | **L2** | Drill promise / internal target / measured indicator with numbers, and separate RTO from RPO in a restoration scenario. |
| `jargon_plain_language_recast` | Items 4, 6 and 7 missed | **L2** | Recast release-note details and comparisons (*twice as high as*) into plain language; expand SSO without inventing meanings. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_it_algorithms_basics` and `les_a2_corpus_intro` respectively, and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every acronym, definition, gloss, option and note in this pack was selected and written from scratch for this lesson. No acronym list was copied, reordered or respelled from any restricted source.
