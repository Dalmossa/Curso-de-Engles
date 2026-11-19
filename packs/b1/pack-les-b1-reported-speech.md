# Practice Pack — `les_b1_reported_speech`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_reported_speech_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_reported_speech.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_reported_speech_v1
lesson_id: les_b1_reported_speech
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
item_id: grm_reported_speech_backshift_001
skill: `grammar.reported_speech_backshift`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "She said she sends the logs by Friday."
    br_pt_form: "Ela disse que envia os logs até sexta-feira."
    note: "keeps the present tense after a past reporting verb instead of backshifting"
  - option: "She said she will send the logs by Friday."
    br_pt_form: "Ela disse que vai enviar os logs até sexta-feira."
    note: "leaves the future auxiliary 'will' unchanged after 'said'"
  - option: "She said she sent the logs by Friday."
    br_pt_form: "Ela disse que enviou os logs até sexta-feira."
    note: "turns a future promise into a finished past action"
```

**Item:**
> Ana said, "I will send the logs by Friday." Which line reports her promise correctly?

| Slot | Value |
|------|-------|
| A | "She said she sends the logs by Friday." |
| B | **"She said she would send the logs by Friday."** ✓ |
| C | "She said she will send the logs by Friday." |
| D | "She said she sent the logs by Friday." |

**Key:** B

**Feedback:**
> After the past reporting verb **said**, the promise *will send* backshifts to **would send**. **A** keeps a present tense, **C** leaves *will* untouched, and **D** reports a completed action instead of a promise.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_reported_speech_client_update_001
skill: `reading.reported_client_update`
type: `detail_identification`
difficulty_b: -0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Ana would send the logs by Friday."
    br_pt_form: "A Ana enviaria os logs até sexta-feira."
    note: "the logs are a future promise from the call, not an event that happened before it"
  - option: "The page was still slow on mobile."
    br_pt_form: "A página ainda estava lenta no celular."
    note: "the symptom describes the state at the time of the call, not an earlier completed action"
  - option: "We could reproduce it in staging."
    br_pt_form: "Nós poderíamos reproduzir isso em staging."
    note: "reproducing in staging is Ana's question to the team, not something already done"
```

**Stimulus:**
> "Recap from the client call — Ana said the payment page was still slow on mobile. She said it had started after the last release. She also told me their support team had logged twelve tickets by Thursday. She said she would send the logs by Friday and asked whether we could reproduce it in staging."

**Item:**
> According to the recap, what had already happened before Ana spoke to the team?

| Slot | Value |
|------|-------|
| A | "Ana would send the logs by Friday." |
| B | "The page was still slow on mobile." |
| C | **"Their support team had logged twelve tickets."** ✓ |
| D | "We could reproduce it in staging." |

**Key:** C

**Feedback:**
> The past perfect carries the earlier event: **their support team had logged twelve tickets by Thursday**. **A** is a promise still to come, **B** is the state Ana reported during the call, and **D** is her question about what the team could do.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_reported_speech_reporting_verbs_001
skill: `vocab.reported_reporting_verbs`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "said"
    br_pt_form: "disse"
    note: "'say' cannot take a personal object directly; 'said us' is not English"
  - option: "asked"
    br_pt_form: "perguntou"
    note: "'asked us that...' reports a statement with the wrong reporting structure"
  - option: "spoke"
    br_pt_form: "falou"
    note: "'spoke' takes no direct personal object here and cannot open a that-clause"
```

**Item:**
> In the meeting recap, which reporting verb fits? "Ana ___ us that the support team had logged twelve tickets."

| Slot | Value |
|------|-------|
| A | "said" |
| B | **"told"** ✓ |
| C | "asked" |
| D | "spoke" |

**Key:** B

**Feedback:**
> **Told** is the verb that takes a person and then the content: **Ana told us that...**. **A** would need *to us* and still sounds heavy, **C** requires a question, and **D** cannot introduce the clause.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_reported_speech_timeline_001
skill: `reading.reported_timeline`
type: `inference_from_context`
difficulty_b: 0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The twelve support tickets."
    br_pt_form: "Os doze tickets de suporte."
    note: "the tickets had already been logged by Thursday; the past perfect marks them as complete"
  - option: "The last release."
    br_pt_form: "O último release."
    note: "the release is the earlier cause of the slowdown, not a pending task"
  - option: "The slow mobile page."
    br_pt_form: "A página lenta no celular."
    note: "the slow page is the reported symptom, not an action anyone still owes"
```

**Stimulus:**
> "Channel note — Bruno: Ana said the payment page was still slow on mobile. She said the problem had started after the last release. She told me the support team had logged twelve tickets by Thursday. She said she would send the logs by Friday. Marina asked whether we could reproduce it in staging; I told her we would check the new query first."

**Item:**
> According to the note, what is still pending after the call?

| Slot | Value |
|------|-------|
| A | "The twelve support tickets." |
| B | **"The check of the new query."** ✓ |
| C | "The last release." |
| D | "The slow mobile page." |

**Key:** B

**Feedback:**
> Bruno closes with **I told her we would check the new query first**, so the query check is the open action. **A** was already logged, **C** is the earlier cause, and **D** is the symptom being reported.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_reported_speech_backshift_001
skill: `pronunciation.reported_backshift_contractions`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *said* is /sed/, with a short /e/ and no extra vowel after the final /d/. *will* /wɪl/ backshifts to *would* /wʊd/ and *can* /kæn/ to *could* /kʊd/ — the vowel shrinks to /ʊ/. In fast speech *she had* and *she would* both reduce to *she'd* /ʃiːd/; the surrounding verb tells you which one it is. *Whether* carries the voiced /ð/, the same sound as *the*, while *thank* uses the voiceless /θ/. Brazilian learners tend to say "said-e" and "could-e", adding a vowel after the final stop.

**Step 2 — produce (ASR-scored):** read aloud:

> "She said she'd sent the logs, and she asked whether we could check the query."

**Target phonemes:** /sed/ in *said*, with /d/ released and no epenthetic /i/ · /ʃiːd/ in *she'd* with a long /iː/ · /ð/ voiced in *whether* and *the* · /kʊd/ in *could*, not "could-e" · /iː/ in *she*, short /ɪ/ in *did* if you expand the question.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_reported_speech_hedging_001
skill: `grammar.hedging_modals`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_b1_modals
distractors:
  - option: "She said it might to be the cache."
    br_pt_form: "Ela disse que poderia para ser o cache."
    note: "a modal takes the bare verb; 'to' after 'might' is L1 transfer"
  - option: "She said it may be the cache."
    br_pt_form: "Ela disse que pode ser o cache."
    note: "keeps 'may' after a past reporting verb instead of the hedged 'might'"
  - option: "She said it might is the cache."
    br_pt_form: "Ela disse que poderia é o cache."
    note: "follows the modal with a finite verb 'is' instead of the bare 'be'"
```

**Item:**
> Reviewing hedging from modal verbs: Ana said, "It might be the cache." Which line keeps her caution and stays grammatical?

| Slot | Value |
|------|-------|
| A | "She said it might to be the cache." |
| B | **"She said it might be the cache."** ✓ |
| C | "She said it may be the cache." |
| D | "She said it might is the cache." |

**Key:** B

**Feedback:**
> **Might be** preserves the hedge and respects the modal + bare verb rule. **A** inserts *to*, **C** loses the backshift from *may* to *might*, and **D** puts a finite *is* after the modal.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_reported_speech_hedging_001
skill: `vocab.reported_hedging`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_b1_modals
distractors:
  - option: "will definitely"
    br_pt_form: "com certeza vai"
    note: "removes the hedge and turns the guess into a certainty"
  - option: "must"
    br_pt_form: "deve ter certeza"
    note: "in this reading expresses strong confidence, not a cautious possibility"
  - option: "is sure to"
    br_pt_form: "tem certeza de que vai"
    note: "asserts certainty, the opposite of the hedge the sentence needs"
```

**Item:**
> Reviewing hedging: report a cautious guess without sounding certain. "Ana said it ___ be the cache, not the database."

| Slot | Value |
|------|-------|
| A | "will definitely" |
| B | "must" |
| C | **"might"** ✓ |
| D | "is sure to" |

**Key:** C

**Feedback:**
> **Might** keeps the speaker's uncertainty intact: **it might be the cache**. **A** and **D** state confidence outright, while **B** (*must*) reads here as near-certainty rather than a tentative possibility.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `reported_speech_backshift_chain` | Items 1 and 6 missed | **L2** | Rebuild the *will → would / can → could / may → might* chain in short recaps before the next client handoff. |
| `reported_speech_timeline_reading` | Items 2 and 4 missed | **L2** | Sort recap details into *already done* (past perfect), *reported state* (past) and *still pending* (would) using the same channel note. |
| `reported_speech_reporting_verbs` | Items 3, 5 and 7 missed | **L2** | Drill *said / told me / asked whether* in one rewrite, then rehearse *said → she'd → could* aloud without epenthetic vowels. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration; its Gates stay blocked on render.
3. Items 6 and 7 review `les_b1_modals` (skill `hedging` in `curriculum-graph-spec.md` §4.3) and carry `prereq_lesson` for the interleaving rule.
4. Items 1–5 target authored lesson content; no restricted source text is reproduced or adapted.
5. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
6. Every `item_id` carries the distinctive `reported_speech` token and is written without backticks; `skill` and `type` keep the backticks required by the pack contract.
7. Within each MCQ, the four options and their `br_pt_form` values remain distinct after stripping `*✓⚠️❌_`, trimming and lowercasing — no pair differs by case alone.
8. Distractors follow the A–D table order with the keyed option removed, so the letter in `**Key:**` always matches the ✓ row.
