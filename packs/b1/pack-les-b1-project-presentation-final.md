# Practice Pack — `les_b1_project_presentation_final`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_project_presentation_final_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_project_presentation_final.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US). No external source text is reproduced or adapted.
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_project_presentation_final_v1
lesson_id: les_b1_project_presentation_final
learner_profile: default
estimated_minutes: 5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 2
  listening_items: 0
  br_pt_form_coverage: 6/6 scored items
  speaking_writing_items: 1
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 2 | 2–3 | ✅ |
| Vocabulary | 1 | 1–3 | ✅ |
| Reading | 1 | 1–2 | ✅ |
| Coherence | 2 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_project_presentation_final_perfect_past_001
skill: `grammar.present_perfect_past_simple`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Last month we have measured the p95 before the change."
    br_pt_form: "Mês passado nós medimos o p95 antes da mudança."
    note: "finished time expression last month requires the past simple; the present perfect does not combine with it"
  - option: "Since we shipped the cache layer, the p95 dropped to 310 ms."
    br_pt_form: "Desde que colocamos o cache, o p95 caiu para 310 ms."
    note: "a result that still matters now takes the present perfect; the past simple alone breaks the link to the present"
  - option: "We have finished the pilot yesterday and measured the p95."
    br_pt_form: "Nós terminamos o piloto ontem e medimos o p95."
    note: "yesterday closes the time; Brazilian learners often map the Portuguese compound tense straight into English"
```

**Item:**
> The tech lead is closing the pilot during the final presentation. Choose the sentence that uses the two tenses correctly.

| Slot | Value |
|------|-------|
| A | "Last month we have measured the p95 before the change." |
| B | "Since we shipped the cache layer, the p95 dropped to 310 ms." |
| C | **"Last month we measured the p95, and since we shipped the cache layer it has dropped to 310 ms."** ✓ |
| D | "We have finished the pilot yesterday and measured the p95." |

**Key:** C

**Feedback:**
> A finished time such as **A** (*last month*) takes the past simple, and a result that reaches now such as **B** takes the present perfect; **D** repeats the first mistake with *yesterday*. Only the sentence that pairs *measured* with *has dropped* is correct.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: voc_project_presentation_final_exec_summary_001
skill: `vocab.presentation_executive_summary`
type: `contextual_selection`
difficulty_b: -0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "A full technical spec with every endpoint and schema."
    br_pt_form: "Uma especificação técnica completa com todos os endpoints e esquemas."
    note: "the executive summary is a one-slide overview, not the detailed design document"
  - option: "A list of every engineer who worked on the pilot."
    br_pt_form: "Uma lista de todos os engenheiros que trabalharam no piloto."
    note: "team bios belong in an appendix; the summary covers problem, solution, impact and ask"
  - option: "A transcript of the rehearsal with every audience question."
    br_pt_form: "Uma transcrição do ensaio com todas as perguntas da audiência."
    note: "Q&A notes are useful, but they are not the executive summary"
```

**Item:**
> You have ten slides and one minute to open the final presentation. What belongs in the executive summary?

| Slot | Value |
|------|-------|
| A | "A full technical spec with every endpoint and schema." |
| B | **"One slide with the problem, the solution, the impact and the ask."** ✓ |
| C | "A list of every engineer who worked on the pilot." |
| D | "A transcript of the rehearsal with every audience question." |

**Key:** B

**Feedback:**
> The summary is the one-slide map of the talk: problem, solution, impact and ask. **A** is the spec, **C** is the team roster and **D** is rehearsal material; none of them gives the audience the opening orientation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: rdg_project_presentation_final_key_findings_001
skill: `reading.presentation_findings`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The cache removed every incident during the pilot."
    br_pt_form: "O cache removeu todos os incidentes durante o piloto."
    note: "the note says two incidents remain open, so the claim contradicts the text"
  - option: "The team sampled 1,200 requests after enabling the cache."
    br_pt_form: "A equipe amostrou 1.200 requisições depois de ativar o cache."
    note: "the sampling happened last week on the old path, before the change"
  - option: "The p95 increased from 310 ms to 820 ms."
    br_pt_form: "O p95 subiu de 310 ms para 820 ms."
    note: "the direction is reversed; the note says the p95 fell from 820 ms to 310 ms"
```

**Stimulus:**
> "Pilot update: last week we sampled 1,200 requests on the old path. Since we enabled the cache, the p95 has fallen from 820 ms to 310 ms. Two incidents remain open, both caused by stale invalidation."

**Item:**
> Which statement about the key findings is supported by the note?

| Slot | Value |
|------|-------|
| A | "The cache removed every incident during the pilot." |
| B | "The team sampled 1,200 requests after enabling the cache." |
| C | "The p95 increased from 310 ms to 820 ms." |
| D | **"The p95 is now 310 ms, but two incidents are still open."** ✓ |

**Key:** D

**Feedback:**
> The note joins the improved p95 to two open incidents, so **D** is the supported finding. **A** denies the open incidents, **B** moves the sampling to the wrong side of the change and **C** reverses the metric.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Coherence, current lesson

```yaml
item_id: coh_project_presentation_final_call_to_action_001
skill: `coherence.presentation_call_to_action`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: grammar            # weights the item in the bank; the SKILL is pair-level
provenance: authored
distractors:
  - option: "I recommend to approve the rollout on Friday."
    br_pt_form: "Eu recomendo aprovar o rollout na sexta-feira."
    note: "recommend is followed by a clause with we or by an -ing form, not by a to-infinitive"
  - option: "Approves the rollout on Friday."
    br_pt_form: "Aprova o rollout na sexta-feira."
    note: "the imperative uses the base form; Portuguese third-person agreement does not transfer here"
  - option: "Maybe we could think about the rollout."
    br_pt_form: "Talvez pudéssemos pensar sobre o rollout."
    note: "a call to action is explicit; this hedge asks the audience to consider, not to decide"
```

**Item:**
> The audience needs one clear next step at the end of the presentation. Which closing line works best?

| Slot | Value |
|------|-------|
| A | **"Approve the rollout on Friday."** ✓ |
| B | "I recommend to approve the rollout on Friday." |
| C | "Approves the rollout on Friday." |
| D | "Maybe we could think about the rollout." |

**Key:** A

**Feedback:**
> The direct imperative gives the audience an action and a deadline. **B** uses an invalid complement after *recommend*, **C** adds third-person agreement to an imperative and **D** softens the request until no decision is asked for.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_project_presentation_final_ed_cluster_001
skill: `pronunciation.presentation_ed_clusters`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *shipped* /ʃɪpt/ and *dropped* /drɑːpt/ close with /t/ and no vowel after it; *has* ends in /z/, not in /s/.
**Step 2 — produce (ASR-scored):** read aloud:

> "Since we shipped the cache layer, the p95 has dropped to 310 milliseconds."

**Target phonemes:** /t/ closing *shipped* and *dropped* · /z/ in *has* · no extra vowel after the final plosive.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_project_presentation_final_psq_past_simple_001
skill: `grammar.past_simple_finished_time`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_it_meeting_standup`
distractors:
  - option: "We have deployed the hotfix at 09:40 this morning."
    br_pt_form: "Nós fizemos o deploy do hotfix às 09:40 desta manhã."
    note: "an exact finished time takes the past simple, never the present perfect"
  - option: "We deploy the hotfix at 09:40 this morning."
    br_pt_form: "Nós fazemos o deploy do hotfix às 09:40 desta manhã."
    note: "the present simple describes a routine schedule, not a completed action at a stated time"
  - option: "We are deploying the hotfix at 09:40 this morning."
    br_pt_form: "Nós estamos fazendo o deploy do hotfix às 09:40 desta manhã."
    note: "the progressive says the action was in progress; the standup update reports a finished action"
```

**Item:**
> In the standup recap you report a hotfix that went out at a stated time this morning. Choose the natural report.

| Slot | Value |
|------|-------|
| A | "We have deployed the hotfix at 09:40 this morning." |
| B | **"We deployed the hotfix at 09:40 this morning."** ✓ |
| C | "We deploy the hotfix at 09:40 this morning." |
| D | "We are deploying the hotfix at 09:40 this morning." |

**Key:** B

**Feedback:**
> **B** reports a completed action at a finished time with the past simple. **A** mixes the present perfect with a closed time, **C** turns the event into a schedule and **D** leaves it in progress.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Coherence, prerequisite review

```yaml
item_id: coh_project_presentation_final_psq_signpost_order_001
skill: `coherence.presentation_signpost_order`
type: `contextual_selection`
difficulty_b: -0.1
cefr: B1
domain: grammar            # weights the item in the bank; the SKILL is pair-level
provenance: authored
prereq_lesson: `les_b1_it_presentations`
distractors:
  - option: "Finally, I'll start with the context, then I'll show the findings."
    br_pt_form: "Por fim, vou começar com o contexto e depois mostrar os resultados."
    note: "finally closes a sequence and cannot introduce its first step"
  - option: "I'll show the findings, then I'll start with the context."
    br_pt_form: "Vou mostrar os resultados e depois começar com o contexto."
    note: "the context has to come before the findings; the signposts are in the wrong order"
  - option: "I'll start with the context, then I'll close with the findings."
    br_pt_form: "Vou começar com o contexto e depois encerrar com os resultados."
    note: "the closing step is the ask, not the findings; the audience is left without a next step"
```

**Item:**
> You are rehearsing the opening of the final presentation. Which signpost sequence guides the audience correctly?

| Slot | Value |
|------|-------|
| A | "Finally, I'll start with the context, then I'll show the findings." |
| B | "I'll show the findings, then I'll start with the context." |
| C | **"I'll start with the context, then I'll show the findings, and I'll close with the ask."** ✓ |
| D | "I'll start with the context, then I'll close with the findings." |

**Key:** C

**Feedback:**
> The natural arc is context → findings → ask, signposted with *I'll...*. **A** puts the closing marker first, **B** reverses the first two steps and **D** ends on the findings instead of the ask.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `present_perfect_finished_time` | Item 1 missed | **L2** | Drill *last month / yesterday* with the past simple against *since / has dropped* with a result that still holds. |
| `executive_summary_scope` | Item 2 missed | **L2** | Sort one-slide overview content away from spec details, team bios and rehearsal transcripts. |
| `open_incident_evidence` | Item 3 missed | **L2** | Rebuild the distinction between an improved metric and the incidents that remain open. |
| `imperative_vs_hedge` | Item 4 missed | **L2** | Rebuild the closing ask against *recommend to...* and *maybe we could...*. |
| `final_cluster_release` | Item 5 missed | **L3** | Recast *shipped* and *dropped* without a vowel after /t/; replay the model clip. |
| `standup_time_markers` | Item 6 missed | **L2** | Rebuild the standup report with *at 09:40 this morning* and the past simple. |
| `signpost_sequence` | Item 7 missed | **L2** | Rehearse *I'll start..., then I'll..., and I'll close...* in that order. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration; listening stays deferred with the lesson's text-only input.
3. Items target authored lesson content; no external source text is reproduced.
