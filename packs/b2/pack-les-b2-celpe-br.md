# Practice Pack — `les_b2_celpe_br`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_celpe_br_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_celpe_br.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_celpe_br_v1
lesson_id: les_b2_celpe_br
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
item_id: grm_celpe_br_extended_response_001
skill: `grammar.extended_response_sequence`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "Well... uh... the thing is, you know, it was bad, tipo."
    br_pt_form: "Bem... uh... o negócio é, sabe, foi ruim, tipo."
    note: "stacks fillers and a Portuguese discourse marker; it does not develop the answer"
  - option: "It was bad. We fixed it. Done."
    br_pt_form: "Foi ruim. Nós corrigimos. Pronto."
    note: "three fragments give no evidence and no result for the listener"
  - option: "In my opinion the product owner was wrong and the team was right."
    br_pt_form: "Na minha opinião o product owner estava errado e o time estava certo."
    note: "a bare opinion without example or outcome is not an extended response"
```

**Item:**
> In the fictional interview, which answer is an extended response with a clear sequence?

| Slot | Value |
|------|-------|
| A | "Well... uh... the thing is, you know, it was bad, tipo." |
| B | **"The delay was the problem — by that I mean users waited eight seconds. We trimmed the scope, and the release went out on Friday."** ✓ |
| C | "It was bad. We fixed it. Done." |
| D | "In my opinion the product owner was wrong and the team was right." |

**Key:** B

**Feedback:**
> **B** states the problem, gives evidence and closes with the result — the *problem → example → result* frame of an extended response. **A** piles up fillers, **C** is a string of fragments, and **D** voices an opinion without developing it.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_celpe_br_self_correction_001
skill: `reading.celpe_interview_transcript`
type: `detail_identification`
difficulty_b: 0.0
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "It apologises and ends the answer."
    br_pt_form: "Ela pede desculpas e encerra a resposta."
    note: "the candidate continues with the measurement after the apology"
  - option: "It changes the topic to a different project."
    br_pt_form: "Ela muda de assunto para outro projeto."
    note: "the project is still the payments dashboard"
  - option: "It claims the measurement was invented."
    br_pt_form: "Ela afirma que a medição foi inventada."
    note: "no data is denied; the term is clarified, not retracted"
```

**Stimulus:**
> "The main issue was latency — sorry, by latency I mean the delay between a click and the updated chart. We measured about eight seconds."

**Item:**
> What does the candidate's self-correction accomplish?

| Slot | Value |
|------|-------|
| A | It apologises and ends the answer. |
| B | **It clarifies the technical term for the interviewer.** ✓ |
| C | It changes the topic to a different project. |
| D | It claims the measurement was invented. |

**Key:** B

**Feedback:**
> **B** is right: *by latency I mean...* redefines the term and keeps the answer going. **A** misses the continuation, **C** invents a topic change, and **D** mistakes a clarification for a retraction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_celpe_br_reformulation_001
skill: `vocab.celpe.reformulation`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "Anyway, next topic."
    br_pt_form: "De todo modo, próximo tópico."
    note: "this closes the topic instead of restating the previous idea"
  - option: "Exactly, that's it."
    br_pt_form: "Exatamente, é isso."
    note: "agreement confirms the idea but does not reformulate it"
  - option: "Sorry, I was completely wrong."
    br_pt_form: "Desculpa, eu estava completamente errado."
    note: "this retracts the claim rather than expressing it in another way"
```

**Item:**
> Which phrase reformulates the previous idea instead of merely adding a filler?

| Slot | Value |
|------|-------|
| A | Anyway, next topic. |
| B | Exactly, that's it. |
| C | **What I mean is, we measured eight seconds before the fix.** ✓ |
| D | Sorry, I was completely wrong. |

**Key:** C

**Feedback:**
> **C** restates the measurement with *What I mean is*, the reformulation frame taught in the lesson. **A** moves on, **B** only agrees, and **D** withdraws the statement instead of rephrasing it.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_celpe_br_turn_taking_001
skill: `reading.turn_taking_cue`
type: `inference`
difficulty_b: 0.3
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "She is ending the interaction politely."
    br_pt_form: "Ela está encerrando a interação de forma educada."
    note: "she asks to continue, not to finish the conversation"
  - option: "She is agreeing to cut the feature immediately."
    br_pt_form: "Ela está concordando em cortar a funcionalidade imediatamente."
    note: "she asks to finish the example before deciding between the two options"
  - option: "She is changing to an unrelated example."
    br_pt_form: "Ela está mudando para um exemplo sem relação."
    note: "the example is the same payments story; only the turn is being held"
```

**Stimulus:**
> "I see your point, but can I finish this one example before we move on? There are two options: we trim the scope, or we move the date. I'd choose the first, because we keep the release date."

**Item:**
> What is the candidate doing in the first sentence?

| Slot | Value |
|------|-------|
| A | She is ending the interaction politely. |
| B | **She acknowledges the other speaker while holding the turn.** ✓ |
| C | She is agreeing to cut the feature immediately. |
| D | She is changing to an unrelated example. |

**Key:** B

**Feedback:**
> **B** captures the two moves of turn-taking: *I see your point* recognises the interlocutor and *can I finish this example?* keeps the floor. **A** reverses the direction, **C** anticipates a decision, and **D** invents a topic change.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_celpe_br_dental_fricatives_001
skill: `pronunciation.fluency_pace_dental_fricatives`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *think* /θɪŋk/ starts with the voiceless /θ/, tongue tip between the teeth; *the* /ðə/ uses the voiced /ð/ at the same place. *mean* /miːn/ has the long /iː/, while *finish* /ˈfɪnɪʃ/ has short /ɪ/. *click* /klɪk/ ends in /k/ with no extra vowel.

**Step 2 — produce (ASR-scored):** read aloud:

> "Let me think for a second — by latency I mean the delay between a click and the updated chart. Sorry, let me rephrase that."

**Target phonemes:** /θ/ in *think* · /ð/ in *the* · /iː/ in *mean* · /ɪ/ in *finish* · /eɪ/ in *delay* · /k/ final in *click*, without epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_celpe_br_pause_boundary_001
skill: `grammar.pause_boundary_review`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: les_b1_presentation_skills
distractors:
  - option: "Let me think. For a second. The delay. Was about eight seconds."
    br_pt_form: "Deixa eu pensar. Por um segundo. O atraso. Era de cerca de oito segundos."
    note: "too many sentence boundaries break the pace into fragments"
  - option: "Let me think for a second, the delay was about eight seconds."
    br_pt_form: "Deixa eu pensar por um segundo, o atraso era de cerca de oito segundos."
    note: "a comma alone joins two independent clauses; an em dash or a period is needed"
  - option: "Let me to think for a second — the delay was about eight seconds."
    br_pt_form: "Deixa eu para pensar por um segundo — o atraso era de cerca de oito segundos."
    note: "'let me' takes the bare verb; 'to' after 'let me' is L1 transfer"
```

**Item:**
> Reviewing presentation pacing: which line marks a short pause without breaking the sentence into fragments?

| Slot | Value |
|------|-------|
| A | "Let me think. For a second. The delay. Was about eight seconds." |
| B | **"Let me think for a second — the delay was about eight seconds."** ✓ |
| C | "Let me think for a second, the delay was about eight seconds." |
| D | "Let me to think for a second — the delay was about eight seconds." |

**Key:** B

**Feedback:**
> **B** uses one breath group and a single em dash for the hesitation boundary. **A** over-punctuates into fragments, **C** joins two clauses with only a comma, and **D** inserts *to* after *let me*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_celpe_br_latency_001
skill: `vocab.celpe.tech_evidence`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "the number of transactions processed per second"
    br_pt_form: "o número de transações processadas por segundo"
    note: "that is throughput, a rate, not the delay of a single interaction"
  - option: "the amount of data stored in the log"
    br_pt_form: "a quantidade de dados armazenada no log"
    note: "log volume says nothing about the time between click and update"
  - option: "the act of restoring an older release"
    br_pt_form: "o ato de restaurar uma versão mais antiga"
    note: "that is a rollback, an action, not a timing measurement"
```

**Item:**
> Reviewing core IT terms: in the interview story, "latency" means...

| Slot | Value |
|------|-------|
| A | the number of transactions processed per second |
| B | **the delay between a click and the updated chart** ✓ |
| C | the amount of data stored in the log |
| D | the act of restoring an older release |

**Key:** B

**Feedback:**
> **B** is the meaning used in the dialogue: the time between an action and its visible result. **A** defines *throughput*, **C** describes *log volume*, and **D** describes a *rollback*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `extended_response_frame` | Item 1 missed | **L2** | Rebuild answers as problem → evidence → result; ban one-word replies and filler stacks. |
| `self_correction_reformulation` | Items 2 and 3 missed | **L2** | Drill *by that I mean*, *What I mean is* and *let me rephrase that* in the payments story. |
| `pace_and_turns` | Items 4, 5, 6 and 7 missed | **L2** | Recycle *I see your point, but can I finish this point?*, the single em dash for pauses, /θ/ vs /ð/ and *latency* vs *throughput*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 1–5 review the current lesson's `fluency_pace`, extended-response, reformulation, turn-taking and articulation targets; items 6 and 7 review `les_b1_presentation_skills` and `les_a2_it_terms_basics`, both real ids in §4.3, and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every stimulus, option, gloss and note is original and authored in a clean room. No official CELPE-Bras item, prompt, transcript or answer key was reproduced; the interview is a fictional simulation.
6. The grammar-rag query `"speaking fluency pace hesitation reformulation turn taking"` (top-k 2) returned two low-similarity passages about unrelated verb patterns (*tolerate it*, *avoid answering*). Nothing from those passages was used; the lesson and this pack remain 100% authored.
7. Item ids use the distinctive `celpe_br` token with the namespace prefix required by `assessment-item-spec.md` §1.2 and were checked for collisions against canonical `pack-les-*.md` packs; the legacy `pack_les_*_v1.md` file was removed by path, not read.
