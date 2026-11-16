# Practice Pack — `les_a1_pronunciation_intro`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_a1_pronunciation_intro_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_pronunciation_intro.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_pronunciation_intro_v1
lesson_id: les_a1_pronunciation_intro
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 4 current / 3 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 0
  br_pt_form_coverage: 7/7 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Vocabulary | 3 | 1–3 | ✅ |
| Pronunciation | 2 | 1 | ⚠️ extended for pronunciation-focused lesson |
| Grammar | 1 | 2–3 | ✅ |
| Reading | 1 | 1–2 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Vocabulary, current lesson

```yaml
item_id: `voc_pron_think_001`
skill: `vocab.pron.think`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "tink"
    br_pt_form: "tincar (troca TH por /t/)"
    note: "common BR-PT substitution of voiceless TH /θ/ with /t/"
  - option: "sink"
    br_pt_form: "afundar (troca TH por /s/)"
    note: "different word; reflects /s/ substitution for TH in some learners"
  - option: "fink"
    br_pt_form: "fink (troca TH por /f/)"
    note: "reflects /f/ substitution for voiceless TH"
```

**Item:**
> In a daily meeting, which word correctly completes the sentence: "I ____ the script is ready"?

| Slot | Value |
|------|-------|
| A | "tink" |
| B | **"think"** ✓ |
| C | "sink" |
| D | "fink" |

**Key:** B

**Feedback:**
> The correct word is **`think`** (/θɪŋk/). Its initial sound is the voiceless **TH** /θ/, made with the tongue between the teeth. **A**, **C**, and **D** show common substitutions (/t/, /s/, /f/) that change the sound and, in C, the meaning.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Pronunciation, current lesson

```yaml
item_id: `prn_s_clusters_script_001`
skill: `pronunciation.s_clusters`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A1
domain: pronunciation
provenance: authored
distractors:
  - option: "escript"
    br_pt_form: "escript (vogal epentética antes de scr-)"
    note: "typical epenthetic vowel added before s+consonant cluster by pt-BR speakers"
  - option: "iscript"
    br_pt_form: "iscript (vogal epentética com /i/)"
    note: "alternative epenthetic vowel insertion before cluster"
  - option: "scrip"
    br_pt_form: "scrip (omissão do /t/ final)"
    note: "drops final consonant; different error but plausible in fast speech"
```

**Item:**
> Which form shows the correct start of the word used in: "Check the deployment ____"?

| Slot | Value |
|------|-------|
| A | "escript" |
| B | "iscript" |
| C | **"script"** ✓ |
| D | "scrip" |

**Key:** C

**Feedback:**
> The correct form is **`script`**. In English, **s + consonant** clusters (*scr-, st-, sp-*) start directly with /s/, without adding a vowel before it. **A** and **B** insert an extra vowel ("escript"/"iscript"), a common transfer from pt-BR. **D** removes the final /t/.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Grammar, prerequisite review

```yaml
item_id: `grm_article_sound_an_001`
skill: `grammar.article_before_sound`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_alphabet_sounds`
distractors:
  - option: "a"
    br_pt_form: "um/uma (artigo antes de som consonantal)"
    note: "common error: learners pick 'a' without checking the initial sound"
  - option: "the"
    br_pt_form: "o/a (artigo definido)"
    note: "definite article does not fit this general introduction"
  - option: "no article"
    br_pt_form: "sem artigo"
    note: "singular countable noun in this context requires an article"
```

**Item:**
> When naming the letter **H** aloud (pronounced "aitch"), you say: "____ H comes after G."

| Slot | Value |
|------|-------|
| A | "a" |
| B | **"an"** ✓ |
| C | "the" |
| D | "(no article)" |

**Key:** B

**Feedback:**
> Use **`an`** before the **name** of the letter H because "aitch" begins with a vowel sound. The choice depends on sound, not spelling. **A** would fit a word starting with a consonant sound. **C** and **D** do not fit this general statement.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: `voc_pron_health_001`
skill: `vocab.pron.health`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "heat"
    br_pt_form: "calor (sem som TH final)"
    note: "minimal-pair contrast; ends with /t/ instead of /θ/"
  - option: "help"
    br_pt_form: "ajuda (sons iniciais/finais diferentes)"
    note: "shares initial /h/ but different word and ending"
  - option: "heal"
    br_pt_form: "curar (sem som TH final)"
    note: "related meaning area but different form and ending sound"
```

**Item:**
> Complete the technical phrase: "Run the ____ check before the release."

| Slot | Value |
|------|-------|
| A | "heat" |
| B | "help" |
| C | **"health"** ✓ |
| D | "heal" |

**Key:** C

**Feedback:**
> The correct phrase is **`health check`**. **Health** ends with the voiceless **TH** /θ/ sound. **A** (*heat*) and **D** (*heal*) end with different sounds, and **B** (*help*) is a different word that does not form this common technical expression.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Reading, current lesson

```yaml
item_id: `rdg_pron_scenario_001`
skill: `reading.pronunciation_context`
type: `detail_identification`
difficulty_b: 0.0
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "Run three tests and share the report"
    br_pt_form: null
    note: "action assigned to Ana's request, not what Bruno says he will do after the call"
  - option: "Fix the health check script"
    br_pt_form: null
    note: "plausible but not stated; the script is already ready"
  - option: "Write the release notes"
    br_pt_form: null
    note: "not mentioned in the scenario"
```

**Stimulus:**
> **Bruno:** "Hi team. I think the script for the health check is ready."  
> **Ana:** "Great. Can you run it three times and share the report?"  
> **Bruno:** "Sure. Right after this call, I will start the screen share and help with the release."

**Item:**
> What will Bruno do right after the call?

| Slot | Value |
|------|-------|
| A | **Start the screen share and help with the release** ✓ |
| B | Run three tests and share the report |
| C | Fix the health check script |
| D | Write the release notes |

**Key:** A

**Feedback:**
> Bruno says, "Right after this call, I will start the screen share and help with the release." **B** is what Ana asks him to do, but the question asks for Bruno's stated next action after the call. **C** and **D** are not mentioned.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Pronunciation, prerequisite review

```yaml
item_id: `prn_h_initial_help_001`
skill: `pronunciation.h_initial`
type: `minimal_pair_selection`
difficulty_b: -0.4
cefr: A1
domain: pronunciation
provenance: authored
prereq_lesson: `les_a1_alphabet_sounds`
distractors:
  - option: "elp"
    br_pt_form: "elp (omissão do H inicial)"
    note: "drops the initial /h/, a common transfer when learners treat H as silent like in some pt-BR contexts"
  - option: "yelp"
    br_pt_form: "yelp (som inicial diferente /j/)"
    note: "different initial sound; contrasts with target but is not the requested word"
  - option: "alp"
    br_pt_form: "alp (vogal inicial sem H)"
    note: "removes /h/ and alters vowel onset perception"
```

**Item:**
> A teammate asks for support during a demo. Which word has the clear initial /h/ sound in: "I need ____ with the screen"?

| Slot | Value |
|------|-------|
| A | "elp" |
| B | **"help"** ✓ |
| C | "yelp" |
| D | "alp" |

**Key:** B

**Feedback:**
> The correct word is **`help`**. In English, initial **H** is pronounced as a light breath before the vowel. **A** and **D** omit that sound, and **C** begins with a different sound (/j/).

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: `voc_pron_minimal_pair_001`
skill: `vocab.pron.minimal_pair`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_alphabet_sounds`
distractors:
  - option: "Words that mean the same thing"
    br_pt_form: "palavras com o mesmo significado"
    note: "confuses minimal pairs with synonyms"
  - option: "Words that have the same spelling"
    br_pt_form: "palavras com a mesma escrita"
    note: "confuses minimal pairs with homographs/spelling similarity"
  - option: "Words that rhyme in every sound"
    br_pt_form: "palavras que rimam em todos os sons"
    note: "overgeneralizes; rhymes share endings but minimal pairs differ by one sound in the same position"
```

**Item:**
> In pronunciation practice, **minimal pairs** are:

| Slot | Value |
|------|-------|
| A | Words that mean the same thing |
| B | **Words that differ in only one sound** ✓ |
| C | Words that have the same spelling |
| D | Words that rhyme in every sound |

**Key:** B

**Feedback:**
> **Minimal pairs** are words that differ in only one sound, such as *three/tree* or *help/elp* in perception training. Practicing them helps you hear and produce small sound contrasts that change meaning.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `th_voiceless_discrimination` | Item 1 missed | **L2** | Contrast *think/three/thank* with common substitutions (/t/, /s/, /f/) in short tech phrases. |
| `s_cluster_epenthesis` | Item 2 missed | **L2** | Drill *script/screen/start/sprint* without adding a vowel before /s/. |
| `h_initial_audibility` | Item 6 missed | **L2** | Practice initial /h/ in *help/health/host/header* with breath-first onset. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Listening is deferred (`listening_items: 0`) until audio is rendered and ear-checked.
3. All items are authored for this lesson; no external source text is reproduced or adapted.
4. `br_pt_form` is provided for every scored item with a distractor set (7/7).
