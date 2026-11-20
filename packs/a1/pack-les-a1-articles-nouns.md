# Practice Pack — `les_a1_articles_nouns`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_articles_nouns_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_articles_nouns.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_articles_nouns_v1
lesson_id: les_a1_articles_nouns
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
item_id: grm_articles_definite_001
skill: `grammar.articles_definite`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "I found a issue, and the issue is on page two."
    br_pt_form: "Eu encontrei um problema, e o problema está na página dois."
    note: "BR-PT um covers both genders; English selects an before the vowel sound /ɪ/ in issue"
  - option: "I found an issue, and a issue is on page two."
    br_pt_form: "Eu encontrei um problema, e um problema está na página dois."
    note: "the second mention of the same singular countable noun takes the; Portuguese can repeat um where English needs the"
  - option: "I found issue, and the issue is on page two."
    br_pt_form: "Eu encontrei problema, e o problema está na página dois."
    note: "a singular countable noun cannot stand alone in English; Portuguese drops the article freely"
```

**Item:**
> Bia tells Caio about the API guide they are both reading. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "I found a issue, and the issue is on page two." |
| B | **"I found an issue, and the issue is on page two."** ✓ |
| C | "I found an issue, and a issue is on page two." |
| D | "I found issue, and the issue is on page two." |

**Key:** B

**Feedback:**
> **An** comes before the vowel sound /ɪ/ in *issue*, and the second mention of the same item takes **the**: **`I found an issue, and the issue is on page two.`** **A** uses *a* before a vowel sound, **C** repeats *a* for a known item, and **D** leaves the singular countable noun without a determiner.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: voc_countable_noun_phrases_001
skill: `vocab.countable_noun_phrases`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "We add a note short to the guide."
    br_pt_form: "Nós adicionamos uma nota curta ao guia."
    note: "Portuguese puts the adjective after the noun; English places short before note"
  - option: "We add a short notes to the guide."
    br_pt_form: "Nós adicionamos uma notas curtas ao guia."
    note: "a and a plural noun cannot combine; use a short note or two short notes"
  - option: "We add short note to the guide."
    br_pt_form: "Nós adicionamos nota curta ao guia."
    note: "a singular countable noun needs a determiner before the adjective; Portuguese often omits it"
```

**Item:**
> The team improves the API guide with a brief piece of writing. Choose the natural noun phrase.

| Slot | Value |
|------|-------|
| A | **"We add a short note to the guide."** ✓ |
| B | "We add a note short to the guide." |
| C | "We add a short notes to the guide." |
| D | "We add short note to the guide." |

**Key:** A

**Feedback:**
> **A short note** has the article first, the adjective before the noun, and a singular noun after **a**. **B** copies the Portuguese order *nota curta*, **C** combines **a** with a plural, and **D** drops the article before a singular countable noun.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: rdg_articles_guide_note_001
skill: `reading.articles_guide_note`
type: `detail_identification`
difficulty_b: -0.1
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "In the short note we add."
    br_pt_form: "Na nota curta que adicionamos."
    note: "the note is the fix, not the place where the issue was found"
  - option: "On the last page of the draft."
    br_pt_form: "Na última página do rascunho."
    note: "the note names page two; the last page is not mentioned"
  - option: "In the header of the old guide."
    br_pt_form: "No cabeçalho do guia antigo."
    note: "the issue is in the current API guide; the old guide is not part of this message"
```

**Stimulus:**
> "Team note: I found an issue in the API guide. The issue is in a header example on page two. We add a short note, and the note goes to the new developers after lunch."

**Item:**
> Where is the issue?

| Slot | Value |
|------|-------|
| A | "In the short note we add." |
| B | "On the last page of the draft." |
| C | **"In a header example on page two."** ✓ |
| D | "In the header of the old guide." |

**Key:** C

**Feedback:**
> The text says **`The issue is in a header example on page two.`** **A** mixes up the fix with the problem, **B** changes page two into the last page, and **D** moves the example to a guide the message never mentions.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, prerequisite review

```yaml
item_id: grm_demonstrative_number_001
skill: `grammar.demonstratives_number_agreement`
type: `error_correction`
difficulty_b: 0.1
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_pronouns_demonstrative`
distractors:
  - option: "This examples are in the guide."
    br_pt_form: "Este exemplos estão no guia."
    note: "this agrees with a singular noun; the BR-PT este/estes contrast is often carried over loosely"
  - option: "These example is in the guide."
    br_pt_form: "Estes exemplo está no guia."
    note: "these requires a plural noun; Portuguese tolerates a plural demonstrative next to a singular form more freely"
  - option: "These examples is in the guide."
    br_pt_form: "Estes exemplos está no guia."
    note: "the verb agrees with the plural subject; BR-PT speakers often transfer a single form of estar"
```

**Item:**
> Before describing the guide, you review demonstratives. Two examples are on your screen. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "This examples are in the guide." |
| B | "These example is in the guide." |
| C | **"These examples are in the guide."** ✓ |
| D | "These examples is in the guide." |

**Key:** C

**Feedback:**
> **These** points to plural items near the speaker, and the verb agrees with the plural subject: **`These examples are in the guide.`** **A** pairs *this* with a plural noun, **B** pairs *these* with a singular noun, and **D** leaves *is* after a plural subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Reading, current lesson

```yaml
item_id: rdg_article_reference_001
skill: `reading.article_reference`
type: `detail_identification`
difficulty_b: 0.0
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "The API guide."
    br_pt_form: "O guia de API."
    note: "the writer opens the guide, but does not send it to the developer"
  - option: "A short note."
    br_pt_form: "Uma nota curta."
    note: "the note goes to the docs channel, not to the new developer"
  - option: "A bad header."
    br_pt_form: "Um cabeçalho ruim."
    note: "the header is the problem inside the example, not the thing that is sent"
```

**Stimulus:**
> "Channel message: I opened the API guide this morning. It has an example with a bad header. I add a short note, and the note goes to the docs channel. A new developer asks about the header, so I send an answer."

**Item:**
> What does the writer send to the new developer?

| Slot | Value |
|------|-------|
| A | "The API guide." |
| B | "A short note." |
| C | "A bad header." |
| D | **"An answer."** ✓ |

**Key:** D

**Feedback:**
> The last sentence says **`so I send an answer`** to the new developer. **A** confuses opening with sending, **B** redirects the note to the docs channel, and **C** mistakes the problem in the example for the reply.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: voc_demonstrative_reference_001
skill: `vocab.demonstratives_near_far`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_pronouns_demonstrative`
distractors:
  - option: "That draft is mine, and these examples are from the guide."
    br_pt_form: "Esse rascunho é meu, e estes exemplos são do guia."
    note: "this/that encode distance from the speaker; the PT esse/estes pair does not map one-to-one"
  - option: "This draft is mine, and these examples are from the guide."
    br_pt_form: "Este rascunho é meu, e estes exemplos são do guia."
    note: "these points to items near the speaker; the examples are across the room, so those is needed"
  - option: "That draft is mine, and those examples are from the guide."
    br_pt_form: "Aquele rascunho é meu, e aqueles exemplos são do guia."
    note: "that points to something far; the draft is on your desk, so this is needed"
```

**Item:**
> Reviewing demonstratives: the draft is on your desk, and the examples are on a screen across the room. Choose the natural sentence.

| Slot | Value |
|------|-------|
| A | "That draft is mine, and these examples are from the guide." |
| B | **"This draft is mine, and those examples are from the guide."** ✓ |
| C | "This draft is mine, and these examples are from the guide." |
| D | "That draft is mine, and those examples are from the guide." |

**Key:** B

**Feedback:**
> Near the speaker takes **this / these**, far from the speaker takes **that / those**: **`This draft is mine, and those examples are from the guide.`** **A** reverses both distances at once, **C** brings the far examples close, and **D** pushes the desk draft away.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: prn_article_dental_schwa_001
skill: `pronunciation.article_dental_schwa`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_article_dental_schwa_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *the* /ðə/ before a consonant and /ði/ before a vowel use the voiced dental fricative /ð/: tongue tip between the teeth, voice on — not the pt-BR /d/ of "de". The article *a* /ə/ is a weak schwa, and in *an issue* /æn ˈɪʃuː/ the /n/ links straight into the vowel.

**Step 2 — produce (ASR-scored):** read aloud:

> "The issue is in an example, and we add a short note to the guide."

**Target phonemes:** /ð/ in *the* · weak /ə/ in *a* · /ɪ/ in *issue* · linking /n/ in *an example* · final /s/ in *notes* with no extra vowel.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `articles_first_second_mention` | Item 1 missed | **L2** | Rebuild *an issue* → *the issue* in short guide-review updates. |
| `adjective_noun_order` | Item 2 missed | **L2** | Contrast *a short note* with *a note short* and *a short notes* in docs feedback. |
| `guide_note_reference_reading` | Items 3 and 5 missed | **L2** | Scan a team note for location and recipient before answering detail questions. |
| `demonstrative_distance_review` | Items 4 and 6 missed | **L2** | Rebuild *this/these* versus *that/those* with desk and screen references. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 4 and 6 review `les_a1_pronouns_demonstrative`, the lesson that introduces the prerequisite skill `demonstrative_pronouns`; both carry `prereq_lesson` for the interleaving rule.
4. Grammar rules were checked against the local grammar-RAG on the topic "articles and countable nouns" (singular countables need a determiner; *a/an* before singular countables); all stems, distractors and feedback are original authored text.
5. Items target authored lesson content; no external source text is reproduced.
