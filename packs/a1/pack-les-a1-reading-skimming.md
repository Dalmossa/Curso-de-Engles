# Practice Pack — `les_a1_reading_skimming`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_reading_skimming_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_reading_skimming.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_reading_skimming_v1
lesson_id: les_a1_reading_skimming
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
| Grammar | 3 | 2–3 | ✅ |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Vocabulary, current lesson

```yaml
item_id: `voc_skimming_purpose_001`
skill: `vocab.reading.skim_scan`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "Read every word slowly."
    br_pt_form: "Ler cada palavra devagar."
    note: "slow, complete reading is the opposite of a fast pass for the general idea"
  - option: "Translate the note into Portuguese."
    br_pt_form: "Traduzir a nota para português."
    note: "translation task, not a strategy to get the main idea in seconds"
  - option: "Count the pages and the lines."
    br_pt_form: "Contar as páginas e as linhas."
    note: "counting task that never reads the content for meaning"
```

**Item:**
> Your manager sends a two-page release note and you have thirty seconds before standup. Which approach is skimming?

| Slot | Value |
|------|-------|
| A | "Read every word slowly." |
| B | **"Read the title and the first sentence quickly."** ✓ |
| C | "Translate the note into Portuguese." |
| D | "Count the pages and the lines." |

**Key:** B

**Feedback:**
> **`Skimming`** is a fast pass over the parts that carry the general idea — the title, the first sentence and the last sentences. **A** reads everything slowly, **C** is a translation task, and **D** only measures the text.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_imperatives_skim_scan_001`
skill: `grammar.imperatives_reading`
type: `error_correction`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Skimming the title first."
    br_pt_form: "Fazendo skimming do título primeiro."
    note: "the -ing form describes an activity but does not work as an instruction"
  - option: "To skim the title first."
    br_pt_form: "Para fazer skimming do título primeiro."
    note: "the infinitive names an action after 'need' or 'want', but it does not give an instruction"
  - option: "Skims the title first."
    br_pt_form: "Faz skimming do título primeiro."
    note: "the -s form belongs to a statement about he, she or it, not to a direct instruction"
```

**Item:**
> Choose the correct instruction for a skimming task.

| Slot | Value |
|------|-------|
| A | **"Skim the title first."** ✓ |
| B | "Skimming the title first." |
| C | "To skim the title first." |
| D | "Skims the title first." |

**Key:** A

**Feedback:**
> An instruction in English starts with the base verb: **`Skim the title first.`** **B** and **C** name the activity without giving the instruction, and **D** adds the third-person *-s*, which belongs to a statement, not to a task.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_skim_main_idea_001`
skill: `reading.skim_scan`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "Every number in the note."
    br_pt_form: "Todos os números da nota."
    note: "numbers are targets for scanning, not the fastest route to the main idea"
  - option: "The author of the note."
    br_pt_form: "O autor da nota."
    note: "the author line rarely states the main idea of a short release note"
  - option: "The last paragraph only."
    br_pt_form: "Apenas o último parágrafo."
    note: "the last paragraph closes the note, while the main idea usually opens it"
```

**Stimulus:**
> "Release note 42: the checkout service was slow for twenty minutes. The team added a cache, and the queue is empty again. No customer data was lost."

**Item:**
> You need the main idea in ten seconds. Which part do you read first?

| Slot | Value |
|------|-------|
| A | "Every number in the note." |
| B | "The author of the note." |
| C | **"The title and the first sentence."** ✓ |
| D | "The last paragraph only." |

**Key:** C

**Feedback:**
> The title and the first sentence tell the reader that *the checkout service was slow* — that is the main idea. **A** and **B** are detail checks, and **D** misses the opening where the idea lives.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, prerequisite review

```yaml
item_id: `grm_rvw_there_is_are_001`
skill: `grammar.there_is_are`
type: `contextual_selection`
difficulty_b: -0.6
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_there_is_are`
distractors:
  - option: "There is two open bugs in the queue."
    br_pt_form: "Tem dois bugs abertos na fila."
    note: "the singular 'is' is carried over from Portuguese 'tem'; 'two open bugs' is plural"
  - option: "There am two open bugs in the queue."
    br_pt_form: "Tem dois bugs abertos na fila."
    note: "'am' only follows the subject 'I', never 'there'"
  - option: "There be two open bugs in the queue."
    br_pt_form: "Tem dois bugs abertos na fila."
    note: "'be' after 'there' needs an auxiliary such as 'will' or 'going to'"
```

**Stimulus:**
> "Staging queue, scanned quickly: two open bugs, one hotfix, no failures."

**Item:**
> Scan the queue report. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "There is two open bugs in the queue." |
| B | **"There are two open bugs in the queue."** ✓ |
| C | "There am two open bugs in the queue." |
| D | "There be two open bugs in the queue." |

**Key:** B

**Feedback:**
> Plural nouns take **`There are two open bugs in the queue.`** — exactly what the scan of the report shows. **A** transfers the Portuguese *tem* with a singular verb, **C** uses *am* outside *I*, and **D** leaves *be* without an auxiliary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Vocabulary, current lesson

```yaml
item_id: `voc_scanning_detail_001`
skill: `vocab.reading.skim_scan`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "Read every word slowly."
    br_pt_form: "Ler cada palavra devagar."
    note: "careful reading of the whole text costs the time that scanning saves"
  - option: "Translate the note into Portuguese."
    br_pt_form: "Traduzir a nota para português."
    note: "translation work is not a targeted search for one detail"
  - option: "Skim for the main idea."
    br_pt_form: "Fazer uma leitura rápida pela ideia geral."
    note: "skimming answers what the text is about, not what time the deploy was"
```

**Item:**
> Now you only need the deploy time from the same note. Which approach is scanning?

| Slot | Value |
|------|-------|
| A | "Read every word slowly." |
| B | "Translate the note into Portuguese." |
| C | **"Look for the time and read only that part."** ✓ |
| D | "Skim for the main idea." |

**Key:** C

**Feedback:**
> **`Scanning`** moves the eyes to one target and reads only that part: *look for the time and read only that part*. **A** is slow close reading, **B** is a translation task, and **D** answers a different question — the main idea, not the deploy time.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: `grm_rvw_there_is_are_002`
skill: `grammar.there_is_are`
type: `error_correction`
difficulty_b: 0.0
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_there_is_are`
distractors:
  - option: "There aren't a new build in staging."
    br_pt_form: "Não tem nenhum build novo em staging."
    note: "'aren't' pairs with plural nouns; 'a new build' is singular, so 'isn't' is required"
  - option: "There amn't a new build in staging."
    br_pt_form: "Não tem nenhum build novo em staging."
    note: "'amn't' is not a contraction in English; 'isn't' carries the singular negative"
  - option: "There don't a new build in staging."
    br_pt_form: "Não tem nenhum build novo em staging."
    note: "'don't' needs a main verb after it, and the negative already lives in 'isn't'"
```

**Stimulus:**
> "Staging changelog, scanned quickly: one hotfix in staging, no new build, no open blocker."

**Item:**
> Scan the changelog. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | **"There isn't a new build in staging."** ✓ |
| B | "There aren't a new build in staging." |
| C | "There amn't a new build in staging." |
| D | "There don't a new build in staging." |

**Key:** A

**Feedback:**
> A singular subject in the negative needs **`There isn't a new build in staging.`** — and the scan of the changelog confirms it. **B** uses a plural form with a singular noun, **C** invents *amn't*, and **D** puts *don't* where no main verb follows.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_ee_ih_minimal_pair_001`
skill: `pronunciation.ee_ih_contrast`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *cheap* /tʃiːp/ has the long /iː/ sound, like the "ii" in "vi"; *chip* /tʃɪp/ has the short /ɪ/, like the "i" in "wi-fi".
**Step 2 — produce (ASR-scored):** read aloud:

> "Please check the chip count and ship the cheap tickets on Wednesday."

**Target phonemes:** /iː/ in *cheap* · /ɪ/ in *chip* · /ʃ/ in *ship* · silent *d* in *Wednesday*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `skim_scan_strategy_selection` | Item 3 missed | **L2** | Contrast *skim for the main idea* with *scan for one detail* over a second short release note. |
| `imperatives_reading_tasks` | Item 2 missed | **L2** | Produce instruction phrases: *Read the title*, *Skim the note*, *Scan for the build number*. |
| `there_is_are_singular_plural` | Item 4 or 6 missed | **L2** | Re-run singular vs plural *there is / there are* with sprint-queue nouns. |
| `ee_ih_production_drill` | Item 7 below ASR threshold | **L3** | Minimal-pair drill *cheap / chip* with a recorded model and a phoneme-level score. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration; listening stays deferred until the audio corpus exists.
3. Items 4 and 6 review `les_a1_there_is_are` and are scored as prerequisite review, not as new evidence for this lesson's skills.
4. Items target authored lesson content; no external source text is reproduced.