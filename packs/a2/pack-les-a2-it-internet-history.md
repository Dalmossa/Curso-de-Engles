# Practice Pack — `les_a2_it_internet_history`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_internet_history_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_internet_history.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_internet_history_v1
lesson_id: les_a2_it_internet_history
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
item_id: grm_relative_packet_switching_001
skill: `grammar.relative_defining_who_which_that`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "ARPANET who linked four universities in 1969."
    br_pt_form: "ARPANET quem ligou quatro universidades em 1969."
    note: "'who' is reserved for people; a network takes 'that' or 'which'"
  - option: "ARPANET, that linked four universities in 1969."
    br_pt_form: "ARPANET, que ligou quatro universidades em 1969."
    note: "a defining relative clause must not be separated by a comma at A2 level"
  - option: "ARPANET what linked four universities in 1969."
    br_pt_form: "ARPANET o que ligou quatro universidades em 1969."
    note: "'what' cannot replace a subject relative pronoun after a noun"
```

**Item:**
> You are writing a one-line timeline for a new teammate. Which sentence defines ARPANET correctly?

| Slot | Value |
|------|-------|
| A | "ARPANET who linked four universities in 1969." |
| B | "ARPANET, that linked four universities in 1969." |
| C | **"ARPANET that linked four universities in 1969."** ✓ |
| D | "ARPANET what linked four universities in 1969." |

**Key:** C

**Feedback:**
> A network is a thing, so the defining clause uses **`that`**: **`ARPANET that linked four universities in 1969.`** **A** wrongly uses *who* for a non-person, **B** puts a comma in a defining clause, and **D** uses *what*, which cannot follow the noun it modifies.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_internet_timeline_001
skill: `reading.internet_timeline_detail`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "TCP/IP became the standard."
    br_pt_form: "O TCP/IP se tornou o padrão."
    note: "the stimulus dates this event to 1983, not to the earliest event"
  - option: "The Web was proposed at CERN."
    br_pt_form: "A Web foi proposta no CERN."
    note: "the stimulus dates this event to 1989, after the other two dated events"
  - option: "Companies rented servers in the cloud."
    br_pt_form: "Empresas alugavam servidores na nuvem."
    note: "cloud computing is not mentioned in the stimulus and is much later"
```

**Stimulus:**
> "In 1969 ARPANET linked four universities. In 1983 TCP/IP became the standard that let different networks exchange data. Tim Berners-Lee proposed the Web in 1989, and that system of pages runs on the Internet."

**Item:**
> Which event happened first?

| Slot | Value |
|------|-------|
| A | TCP/IP became the standard. |
| B | The Web was proposed at CERN. |
| C | Companies rented servers in the cloud. |
| D | **ARPANET linked four universities.** ✓ |

**Key:** D

**Feedback:**
> The dates in the text make the order clear: **`ARPANET linked four universities.`** in 1969, before 1983 and 1989. **A** and **B** are real events from the stimulus but happen later, and **C** introduces a later development the text never mentions.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_cloud_rental_001
skill: `vocab.it_internet_terms`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "The code has no bugs."
    br_pt_form: "O código não tem nenhum bug."
    note: "'cloud' describes where infrastructure runs, not the quality of the code"
  - option: "The app is offline."
    br_pt_form: "O app está offline."
    note: "cloud services are reached over a network; being offline is the opposite condition"
  - option: "The pages are stored only on your laptop."
    br_pt_form: "As páginas ficam guardadas só no seu notebook."
    note: "that describes local hosting, not rented infrastructure"
```

**Item:**
> A teammate says: "Our API runs in the cloud." What does that mean?

| Slot | Value |
|------|-------|
| A | The code has no bugs. |
| B | **The servers are rented from another operator.** ✓ |
| C | The app is offline. |
| D | The pages are stored only on your laptop. |

**Key:** B

**Feedback:**
> **`The servers are rented from another operator.`** is what *in the cloud* means in this lesson: someone else operates the infrastructure. **A** confuses hosting with code quality, **C** reverses the network dependence, and **D** describes a local machine instead of rented servers.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_packet_switching_gist_001
skill: `reading.relative_definition_gist`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "It keeps one line open for the whole message."
    br_pt_form: "Ele mantém uma linha aberta para a mensagem inteira."
    note: "packet switching splits the message; a single open line is the opposite idea"
  - option: "It translates Web pages into Portuguese."
    br_pt_form: "Ele traduz páginas da Web para o português."
    note: "translation is not part of the definition in the stimulus"
  - option: "It rents servers from a provider."
    br_pt_form: "Ele aluga servidores de um provedor."
    note: "that defines the cloud, not packet switching"
```

**Stimulus:**
> "Packet switching is a method that breaks a message into small blocks. Each block travels through the network and is reassembled at the end. The engineers whose design won the day did not need a single dedicated line."

**Item:**
> According to the text, what does packet switching do?

| Slot | Value |
|------|-------|
| A | It keeps one line open for the whole message. |
| B | **It breaks a message into blocks that travel separately.** ✓ |
| C | It translates Web pages into Portuguese. |
| D | It rents servers from a provider. |

**Key:** B

**Feedback:**
> The first sentence defines the method: **`It breaks a message into blocks that travel separately.`** **A** contradicts the last sentence about no dedicated line, **C** imports a task the text never assigns to it, and **D** borrows the definition of *cloud* from another item.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_ethernet_dental_001
skill: `pronunciation.relative_dental_fricatives`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_ethernet_dental_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *through* /θruː/ and *Ethernet* /ˈiːθərnet/ start with /θ/: tongue between the teeth, no voice. Saying /t/ turns *through* into *trough*. *the* /ðə/ and *they* /ðeɪ/ use the same tongue position with voice, not /d/ or /z/. *Web* /web/ and *which* /wɪtʃ/ begin with rounded /w/, while *server* /ˈsɜːrvər/ has /v/ with the lower lip against the upper teeth.

**Step 2 — produce (ASR-scored):** read aloud:

> "Through Ethernet, the Web browser which they use reaches the server."

**Target phonemes:** /θ/ in *through, Ethernet* · /ð/ in *the, they* · /w/ in *Web, which* · /v/ in *server*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_present_simple_protocol_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_present_simple
distractors:
  - option: "The protocol define how packets move."
    br_pt_form: "O protocolo definem como os pacotes se movem."
    note: "a singular subject takes the -s form in the present simple"
  - option: "The protocol defining how packets move."
    br_pt_form: "O protocolo definindo como os pacotes se movem."
    note: "a participle alone cannot be the main verb of a statement"
  - option: "The protocol is define how packets move."
    br_pt_form: "O protocolo é definir como os pacotes se movem."
    note: "'is' plus a bare infinitive is not the present simple of a regular verb"
```

**Item:**
> Reviewing the present simple before a protocol note, which sentence states a general fact correctly?

| Slot | Value |
|------|-------|
| A | "The protocol define how packets move." |
| B | **"The protocol defines how packets move."** ✓ |
| C | "The protocol defining how packets move." |
| D | "The protocol is define how packets move." |

**Key:** B

**Feedback:**
> A general fact about one thing uses the present simple with **-s**: **`The protocol defines how packets move.`** **A** drops the *-s* on a singular subject, **C** leaves the sentence with no finite verb, and **D** adds an unnecessary *is* before the base form.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_skimming_keyword_001
skill: `vocab.skimming_keywords`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a1_reading_skimming
distractors:
  - option: "Read every word slowly."
    br_pt_form: "Ler cada palavra devagar."
    note: "that is careful reading, not the quick search taught in the skimming lesson"
  - option: "Translate the note to Portuguese first."
    br_pt_form: "Traduzir a nota para o português primeiro."
    note: "translation adds a step and is slower than scanning for a keyword"
  - option: "Ask someone to read it aloud."
    br_pt_form: "Pedir para alguém ler em voz alta."
    note: "it depends on another person and does not use the keyword strategy"
```

**Item:**
> Reviewing the skimming lesson: you have 30 seconds to find the deploy time in a long release note. What is the fastest strategy?

| Slot | Value |
|------|-------|
| A | Read every word slowly. |
| B | **Scan for the time and the build number.** ✓ |
| C | Translate the note to Portuguese first. |
| D | Ask someone to read it aloud. |

**Key:** B

**Feedback:**
> Scanning means looking for one keyword: **`Scan for the time and the build number.`** **A** is the opposite of a quick search, **C** inserts a slower translation step, and **D** delegates the search instead of using the strategy.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `relative_pronoun_choice` | Item 1 or 5 missed | **L2** | Contrast *who / which / that / whose* in short definitions of network terms. |
| `internet_timeline_order` | Items 2 and 4 missed | **L2** | Rebuild the 1969 → 1983 → 1989 sequence and restate each definition with a relative clause. |
| `present_simple_and_skimming_review` | Item 6 or 7 missed | **L2** | Recycle the singular *-s* rule and keyword scanning before reading the next technical note. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration; the pack has zero `lst_*` items because the lesson's audio input remains `deferred_render`.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a1_reading_skimming` respectively and carry `prereq_lesson` for the interleaving rule; `vocab.skimming_keywords` is the lexical chunk of that skimming review.
4. Item ids carry the distinctive `internet_history`, `packet_switching`, `cloud_rental`, `ethernet` and `protocol` tokens so they cannot collide with other A2 packs.
5. All items are authored for this lesson; no external source text is reproduced or adapted.
