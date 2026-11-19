# Practice Pack — `les_a2_meeting_participate`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_meeting_participate_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_meeting_participate.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_meeting_participate_v1
lesson_id: les_a2_meeting_participate
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3-5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 2
  listening_items: 0
  br_pt_form_coverage: 6/6 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 2 | 2-3 | ✅ |
| Vocabulary | 2 | 1-3 | ✅ |
| Reading | 2 | 1-2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| **Total** | **7** | 4-8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_meeting_participate_agree_verb_001
skill: `grammar.agree_verb_not_adjective`
type: `error_correction`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "I'm agree with you on the scope."
    br_pt_form: "Estou de acordo com voce sobre o escopo."
    note: "agree is a verb, so a form of be before it is wrong"
  - option: "I am agree the scope."
    br_pt_form: "Estou de acordo o escopo."
    note: "keeps be and drops the preposition with"
  - option: "I agree of you on the scope."
    br_pt_form: "Eu concordo de voce sobre o escopo."
    note: "the person after agree takes with, not of"
```

**Item:**
> Correct this sentence: "I'm agree with you on the scope."

| Slot | Value |
|------|-------|
| A | "I'm agree with you on the scope." |
| B | **"I agree with you on the scope."** ✓ |
| C | "I am agree the scope." |
| D | "I agree of you on the scope." |

**Key:** B

**Feedback:** `agree` is a verb, so **A** wrongly puts a form of `be` before it, and **C** keeps `be` while dropping the preposition. **D** uses `of` where the person needs `with`. The rule that catches all three — a verb of opinion never takes `be`.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: voc_meeting_participate_interrupt_001
skill: `vocab.polite_interruption`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Stop. I want to talk now."
    br_pt_form: "Pare. Eu quero falar agora."
    note: "a direct command, not a request for the floor"
  - option: "Excuse me interrupt you."
    br_pt_form: "Desculpe interromper voce."
    note: "literal calque that leaves a bare verb after excuse me"
  - option: "Wait, you are wrong about the plan."
    br_pt_form: "Espere, voce esta errada sobre o plano."
    note: "challenges the person instead of asking to speak"
```

**Item:**
> Your colleague is speaking. You need to enter the conversation politely. Choose the natural line.

| Slot | Value |
|------|-------|
| A | "Stop. I want to talk now." |
| B | **"Sorry to jump in — can I add something?"** ✓ |
| C | "Excuse me interrupt you." |
| D | "Wait, you are wrong about the plan." |

**Key:** B

**Feedback:** **B** combines the two soft formulas *Sorry to jump in* and *can I add something?*. **A** is a command, **C** is a literal translation with a broken verb form, and **D** attacks the person's claim rather than asking for the floor.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: rdg_meeting_participate_clarify_001
skill: `reading.clarification_intent`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Whether the loading state is merged."
    br_pt_form: "Se o loading state foi mesclado."
    note: "she states it is not merged, so it is not the question"
  - option: "Who owns the release plan."
    br_pt_form: "Quem e dono do plano de release."
    note: "nobody asks about ownership in the exchange"
  - option: "Why the deadline moved to Friday."
    br_pt_form: "Por que o prazo mudou para sexta."
    note: "Friday is never mentioned in the microtext"
```

**Stimulus:**
> Bia: "Just to clarify, are we freezing before or after the QA pass? I agree with the date, but the loading state is not merged yet."
> Rafa: "The QA pass is on Wednesday, so we freeze on Thursday."

**Item:**
> What does Bia want to know?

| Slot | Value |
|------|-------|
| A | "Whether the loading state is merged." |
| B | **"Whether the freeze happens before or after QA."** ✓ |
| C | "Who owns the release plan." |
| D | "Why the deadline moved to Friday." |

**Key:** B

**Feedback:** The question after *Just to clarify* asks about the order of freeze and QA. **A** is already answered by Bia herself, **C** introduces an ownership topic that never appears, and **D** invents a Friday deadline the text never mentions.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: voc_meeting_participate_actually_001
skill: `vocab.actually_disagreement`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Actually, the deadline is Thursday, not Friday."
    br_pt_form: "Na verdade, o prazo e quinta, nao sexta."
    note: "actually alone corrects an expectation, it does not confirm"
  - option: "Actually, I don't think that will work."
    br_pt_form: "Na verdade, acho que isso nao vai funcionar."
    note: "actually here opens a disagreement, not a confirmation"
  - option: "Actually, sorry, I misread the date."
    br_pt_form: "Na verdade, desculpe, eu li a data errado."
    note: "actually here introduces a self-correction"
```

**Item:**
> A teammate proposes shipping today. You agree, with a touch of surprise. Choose the best reply.

| Slot | Value |
|------|-------|
| A | "Actually, the deadline is Thursday, not Friday." |
| B | "Actually, I don't think that will work." |
| C | **"Actually yes, that works for me."** ✓ |
| D | "Actually, sorry, I misread the date." |

**Key:** C

**Feedback:** *Actually yes* confirms and still signals a slight contrast, which is what the situation licenses. In **A**, **B** and **D**, *Actually* on its own opens a correction, a disagreement or a self-correction — a different move from confirmation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: grm_meeting_participate_disagree_001
skill: `grammar.disagreement_negation`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_meeting_open`
distractors:
  - option: "I don't agree. That's wrong."
    br_pt_form: "Eu nao concordo. Isso esta errado."
    note: "direct confrontation, which reads as a personal attack in a meeting"
  - option: "I'm not agree with you."
    br_pt_form: "Eu nao estou de acordo com voce."
    note: "agree is a verb, so a form of be is wrong here too"
  - option: "I no think that."
    br_pt_form: "Eu nao acho isso."
    note: "English negation needs the auxiliary do, not no before the verb"
```

**Item:**
> You need to disagree with a proposal without confrontating your colleague. Choose the softest natural line.

| Slot | Value |
|------|-------|
| A | "I don't agree. That's wrong." |
| B | **"I don't think so."** ✓ |
| C | "I'm not agree with you." |
| D | "I no think that." |

**Key:** B

**Feedback:** **B** softens the disagreement through the negated opinion verb. **A** attacks the idea head-on, **C** repeats the *be + verb* error, and **D** uses `no` where English needs the auxiliary `do` — *I don't think so*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Pronunciation, current lesson

```yaml
item_id: prn_meeting_participate_th_001
skill: `pronunciation.th_voiced_meeting`
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

**Step 1 — hear the contrast:** `that` [ðæt] uses the voiced TH, tongue lightly between the teeth; a plain /t/ would not. `think` [θɪŋk] uses the same tongue position without voice.
**Step 2 — produce (ASR-scored):** record: *"Sorry to jump in, but I don't think that's right."*

**Target phonemes:** [ð] in *that, that's* · [θ] in *think* · linking between *jump* and *in*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · ⚠️ blocked on render

---

### ITEM 7 — Reading, current lesson

```yaml
item_id: rdg_meeting_participate_two_part_001
skill: `reading.two_part_frame`
type: `detail_identification`
difficulty_b: 0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Agreeing with the reviewer."
    br_pt_form: "Concordando com o revisor."
    note: "I see your point validates understanding, not agreement with the conclusion"
  - option: "Asking for more time."
    br_pt_form: "Pedindo mais tempo."
    note: "no deadline or extension is mentioned"
  - option: "Ending the meeting."
    br_pt_form: "Encerrando a reuniao."
    note: "no closing language appears in the quote"
```

**Stimulus:**
> "I see your point, but the config is read-only now. I don't think it's a real coupling."

**Item:**
> What is the speaker doing?

| Slot | Value |
|------|-------|
| A | "Agreeing with the reviewer." |
| B | **"Disagreeing while acknowledging the point."** ✓ |
| C | "Asking for more time." |
| D | "Ending the meeting." |

**Key:** B

**Feedback:** The two-part frame validates first and then reserves. **A** mistakes *I see your point* for agreement, **C** invents a request for time, and **D** reads a closing that never occurs.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `agree_verb_not_adjective` | Item 1 or 5 missed | **L2** | Drill *agree* as a verb against *be + opinion verb*. |
| `polite_interruption` | Item 2 missed | **L2** | Rebuild *Sorry to jump in / Can I add something?* as a pair. |
| `actually_disagreement` | Item 4 missed | **L2** | Contrast *Actually* (correction) with *Actually yes* (confirmation). |
| `two_part_frame` | Item 7 missed | **L3** | Validate-then-reserve is a B1 construct; log it, do not gate A2 on it. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 6 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.
