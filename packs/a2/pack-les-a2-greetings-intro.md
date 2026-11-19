# Practice Pack — `les_a2_greetings_intro`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_a2_greetings_intro_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `lesson-15min-workplace-greetings.md` (canonical lesson `les_a2_greetings_intro`)
**Provenance:** all items `authored`; 100% original material written for Brazilian software engineers (pt-BR → en-US). No external text reproduced or adapted.
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_greetings_intro_v1
lesson_id: les_a2_greetings_intro
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 2
  listening_items: 0
  br_pt_form_coverage: 6/6 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 1.1 Domain distribution (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 2 | 2–3 | ✅ |
| Vocabulary | 2 | 1–3 | ✅ |
| Reading | 2 | 1–2 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred — no calibrated audio; slot goes to Reading |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

> The listening slot is not filled with a placeholder: an uncalibrated listening item would add noise to the θ estimate. The pronunciation item is ASR-scored production and does not substitute for the listening pool.

---

## 2. L1 ITEMS

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_greetings_workplace_formal_register_001
skill: grammar.formal_informal_register
type: `contextual_selection`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Yo, what's up, Mr. Alves?"
    br_pt_form: "E aí, tudo bem, Sr. Alves?"
    note: "greeting is far too informal for a client meeting; register must stay neutral"
  - option: "Good night, Mr. Alves."
    br_pt_form: "Boa noite, Sr. Alves."
    note: "good night is a farewell or a bedtime line, not an arrival greeting"
  - option: "How's it going, dude?"
    br_pt_form: "Como vai, cara?"
    note: "slang pronoun and casual formula are out of place in a first client meeting"
```

**Item:**
> You walk into a 9 a.m. meeting with a client you have never met. Choose the most suitable opening.

| Slot | Value |
|------|-------|
| A | "Yo, what's up, Mr. Alves?" |
| B | **"Good morning, Mr. Alves. Nice to meet you."** ✓ |
| C | "Good night, Mr. Alves." |
| D | "How's it going, dude?" |

**Key:** B

**Feedback:** **A** and **D** are far too casual for a first meeting with a client; **C** uses a farewell as an arrival greeting. **B** pairs a time-appropriate greeting with the first-meeting formula.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: voc_greetings_workplace_time_of_day_001
skill: vocab.greetings_time_of_day
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Good evening, team."
    br_pt_form: "Boa noite, equipe."
    note: "evening belongs to a later arrival; the standup happens at eight thirty in the morning"
  - option: "Good night, team."
    br_pt_form: "Boa noite, equipe."
    note: "good night closes an encounter; it does not open one"
  - option: "Good afternoon, team."
    br_pt_form: "Boa tarde, equipe."
    note: "afternoon starts around noon; eight thirty in the morning is still morning"
```

**Item:**
> You join the daily standup at 8:30 a.m. Choose the natural greeting.

| Slot | Value |
|------|-------|
| A | "Good evening, team." |
| B | "Good night, team." |
| C | **"Good morning, team."** ✓ |
| D | "Good afternoon, team." |

**Key:** C

**Feedback:** **A** and **D** name the wrong part of the day for 8:30 a.m., and **B** is a farewell. **C** is the neutral morning greeting used in a workplace standup.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Coherence, current lesson

```yaml
item_id: coh_greetings_workplace_how_are_you_001
skill: coherence.greeting_formula_vs_literal_question
type: `contextual_selection`
difficulty_b: -0.1
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "I have a bug, a deadline and a cold."
    br_pt_form: "Eu tenho um bug, um prazo e um resfriado."
    note: "treats the greeting as a request for a full status report; too much detail for a hallway exchange"
  - option: "Yes, I am."
    br_pt_form: "Sim, eu estou."
    note: "answers a yes/no question that was not asked; the formula expects a short polite reply"
  - option: "I work on the API."
    br_pt_form: "Eu trabalho na API."
    note: "answers an information question about role, not the greeting formula"
```

**Item:**
> A teammate passes you in the hallway and says: "How are you?" Choose the natural reply.

| Slot | Value |
|------|-------|
| A | "I have a bug, a deadline and a cold." |
| B | **"Fine, thanks. And you?"** ✓ |
| C | "Yes, I am." |
| D | "I work on the API." |

**Key:** B

**Feedback:** **A** over-answers a greeting formula with a full problem list, **C** answers a question that was not asked, and **D** changes the topic to your role. **B** is the short polite reply and returns the greeting.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_greetings_workplace_intro_note_001
skill: reading.introduction_details
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Daniela, the data engineer."
    br_pt_form: "Daniela, a engenheira de dados."
    note: "Daniela is the newcomer who sent the note; she is not the owner of the release pipeline"
  - option: "The QA pair."
    br_pt_form: "A dupla de QA."
    note: "no QA pair is mentioned in the note"
  - option: "The sprint board owner."
    br_pt_form: "O responsável pelo quadro de sprint."
    note: "the sprint board is not mentioned; the note names a pipeline owner"
```

**Stimulus:**
> "Hi team. I'm Daniela, the new data engineer. This is Bruno, our platform lead. He owns the release pipeline. Nice to meet you all. I'm currently working on the ingest job, and I plan to ship it on Thursday."

**Item:**
> Who owns the release pipeline?

| Slot | Value |
|------|-------|
| A | "Daniela, the data engineer." |
| B | "The QA pair." |
| C | **"Bruno, the platform lead."** ✓ |
| D | "The sprint board owner." |

**Key:** C

**Feedback:** The note says **"This is Bruno, our platform lead. He owns the release pipeline."** **A** is the author of the note, while **B** and **D** refer to people or things never mentioned in it.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Vocabulary, prereq review

```yaml
item_id: voc_greetings_workplace_false_friend_001
skill: vocab.false_cognates_greetings
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "I'm anxious to start."
    br_pt_form: "Estou ansioso para começar."
    note: "anxious means worried; the intended sense is excited, not nervous"
  - option: "I'm actually to start."
    br_pt_form: "Estou atualmente para começar."
    note: "actually means in fact and cannot take an infinitive complement here"
  - option: "I'm pretending to start."
    br_pt_form: "Estou fingindo começar."
    note: "pretend means to fake an action; it is not the Portuguese pretender"
```

**Item:**
> You want to say "Estou animado para começar" to your new team. Choose the natural sentence.

| Slot | Value |
|------|-------|
| A | "I'm anxious to start." |
| B | "I'm actually to start." |
| C | **"I'm excited to start."** ✓ |
| D | "I'm pretending to start." |

**Key:** C

**Feedback:** **A** says you are worried, **B** misuses *actually* as if it meant "currently", and **D** says you are faking it. **C** is the natural way to say you are eager to begin.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Reading, current lesson

```yaml
item_id: rdg_greetings_workplace_reply_match_001
skill: reading.greeting_reply_match
type: `detail_identification`
difficulty_b: 0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Write a bug report."
    br_pt_form: "Escrever um relatório de bug."
    note: "the exchange says nothing about a written report"
  - option: "Call her on the phone."
    br_pt_form: "Ligar para ela."
    note: "the channel is a written team channel, not a phone call"
  - option: "Rebuild the pipeline."
    br_pt_form: "Reconstruir o pipeline."
    note: "the pipeline is not part of this short greeting exchange"
```

**Stimulus:**
> **Priya:** "Good morning, Lucas. Welcome to the team!" — **Lucas:** "Good morning. Thanks, Priya. I'm excited to be here." — **Priya:** "If the build fails, ping me in the channel." — **Lucas:** "Will do."

**Item:**
> What does Priya ask Lucas to do if the build fails?

| Slot | Value |
|------|-------|
| A | "Write a bug report." |
| B | "Call her on the phone." |
| C | **"Ping her in the channel."** ✓ |
| D | "Rebuild the pipeline." |

**Key:** C

**Feedback:** Priya's exact instruction is **"ping me in the channel"**. **A** introduces a report, **B** changes the medium to a phone call, and **D** invents a task about the pipeline.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: prn_greetings_workplace_th_h_001
skill: pronunciation.th_h_greetings
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *this* /ðɪs/ starts with a voiced dental fricative — the tongue touches the edge of the upper teeth; Portuguese speakers often flatten it to /d/. *thanks* /θæŋks/ uses the same tongue position without voice, so it is not /t/ or /f/. *How* /haʊ/ begins with an aspirated /h/, a sound that is weak or absent in Brazilian Portuguese.

**Step 2 — produce (ASR-scored):** read aloud:

> "This is Thiago, our new frontend engineer. Good morning, Thiago. Nice to meet you. Thanks, and how's it going?"

**Target phonemes:** /ð/ in *this* · /θ/ in *thanks* · /h/ in *how* · /t/ before *h* not inserted in *thanks*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · ⚠️ blocked on render

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `formal_informal_register` | Item 1 missed | **L2** | Rebuild the greeting register scale in client meetings against hallway chat with peers. |
| `greeting_formula_vs_literal` | Item 3 missed | **L2** | Drill *How are you?* as a short formula; contrast with a genuine request for news. |
| `false_cognates_excited` | Item 5 missed | **L2** | Contrast *excited/anxious*, *actually/currently* and *pretend/plan* in new-job small talk. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Every item targets the authored lesson content; no restricted or external source text is reproduced.
4. Item 3 uses the `coherence.*` skill namespace; its tracked domain is `grammar` (not a sixth domain).
