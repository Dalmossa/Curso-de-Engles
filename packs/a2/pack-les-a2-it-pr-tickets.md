# Practice Pack — `les_a2_it_pr_tickets`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_pr_tickets_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_pr_tickets.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_pr_tickets_v1
lesson_id: les_a2_it_pr_tickets
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
item_id: grm_pr_tickets_review_request_001
skill: `grammar.pr_review_requests`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Could you to review the PR before stand-up?"
    br_pt_form: "Você pode para revisar o PR antes do stand-up?"
    note: "'could' takes the bare verb; the inserted 'to' is L1 transfer"
  - option: "You could review the PR before stand-up?"
    br_pt_form: "Você poderia revisar o PR antes do stand-up?"
    note: "statement word order with a question mark is not the standard written request"
  - option: "Reviewing the PR before stand-up?"
    br_pt_form: "Revisando o PR antes do stand-up?"
    note: "a gerund fragment has no subject or modal and cannot make a request"
```

**Item:**
> You want a colleague to check your PR today. Which line is a natural request?

| Slot | Value |
|------|-------|
| A | "Could you to review the PR before stand-up?" |
| B | **"Could you review the PR before stand-up?"** ✓ |
| C | "You could review the PR before stand-up?" |
| D | "Reviewing the PR before stand-up?" |

**Key:** B

**Feedback:**
> A polite request keeps interrogative order and a bare verb after the modal: **`Could you review the PR before stand-up?`** **A** inserts *to* after *could*, **C** relies on statement order with a question mark, and **D** is a gerund fragment with no request structure.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_pr_tickets_description_001
skill: `reading.pr_description`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "A 200 response with an empty list."
    br_pt_form: "Uma resposta 200 com uma lista vazia."
    note: "that was the old behavior; the PR changes the status to 422"
  - option: "A second batch of results for page=2."
    br_pt_form: "Um segundo lote de resultados para page=2."
    note: "that is the other acceptance criterion, not the empty-page case"
  - option: "A new endpoint called /search/empty."
    br_pt_form: "Um novo endpoint chamado /search/empty."
    note: "the PR changes /search; no new endpoint is described"
```

**Stimulus:**
> "PR #318 — SRCH-137. Description: add pagination to `/search` and return 422 for an empty page. Acceptance criteria: `page=2` returns the second batch; an empty page returns 422 with code `EMPTY_PAGE`. How to test: call `/search?q=api&page=2`. Note: WIP until the error test lands."

**Item:**
> What does the acceptance criteria require for an empty page?

| Slot | Value |
|------|-------|
| A | A 200 response with an empty list. |
| B | **A 422 response with code `EMPTY_PAGE`.** ✓ |
| C | A second batch of results for `page=2`. |
| D | A new endpoint called `/search/empty`. |

**Key:** B

**Feedback:**
> The criterion says it directly: **`an empty page returns 422 with code EMPTY_PAGE.`** **A** keeps the old status being fixed, **C** answers the pagination criterion instead, and **D** invents an endpoint that is not in the description.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_pr_tickets_lgtm_001
skill: `vocab.pr_review_actions`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Work In Progress — don't merge it yet."
    br_pt_form: "Trabalho em andamento — não mescle ainda."
    note: "that is WIP, used in a title to signal an unfinished PR"
  - option: "Request changes — fix it before merging."
    br_pt_form: "Solicitar alterações — corrija antes de mesclar."
    note: "request changes blocks the merge; LGTM signals approval"
  - option: "A small non-blocking suggestion."
    br_pt_form: "Uma sugestão pequena, não bloqueante."
    note: "that is a nit, not a review approval"
```

**Item:**
> The reviewer wrote "LGTM" on the PR. What does it mean?

| Slot | Value |
|------|-------|
| A | Work In Progress — don't merge it yet. |
| B | Request changes — fix it before merging. |
| C | **Looks Good To Me — the review is approved.** ✓ |
| D | A small non-blocking suggestion. |

**Key:** C

**Feedback:**
> **`LGTM`** means *Looks Good To Me*: the reviewer approves. **A** describes *WIP*, **B** describes *request changes*, and **D** describes a *nit*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_pr_tickets_thread_001
skill: `reading.pr_review_thread`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Rename 'res' to 'response' on line 42."
    br_pt_form: "Renomear 'res' para 'response' na linha 42."
    note: "that is the nit, explicitly separated from the blocker"
  - option: "Squash the commits before the next review."
    br_pt_form: "Agrupar os commits antes da próxima revisão."
    note: "squashing comes after approval and is not the blocker"
  - option: "Close the ticket and delete the branch now."
    br_pt_form: "Fechar o ticket e apagar o branch agora."
    note: "the ticket moves to Done after the merge; it is not in the thread"
```

**Stimulus:**
> "Lucas: 'One blocker: the error response returns 200. Please change it to 422. Just a nit: rename `res` to `response` on line 42.' Marina: 'Fixed both. I pushed a new commit and left a reply on your comment.' Lucas: 'Approved — LGTM. Squash the commits and merge when the checks are green.'"

**Item:**
> What did Lucas ask Marina to do about the blocker?

| Slot | Value |
|------|-------|
| A | Rename 'res' to 'response' on line 42. |
| B | **Change the error response from 200 to 422.** ✓ |
| C | Squash the commits before the next review. |
| D | Close the ticket and delete the branch now. |

**Key:** B

**Feedback:**
> The review says **`One blocker: the error response returns 200. Please change it to 422.`** **A** is the nit, **C** is a post-approval step, and **D** happens after the merge and is not in the thread.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_pr_tickets_acronyms_001
skill: `pronunciation.pr_acronyms`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *LGTM* is read letter by letter, /el dʒiː tiː em/ — the G carries /dʒiː/, not the Portuguese "gê". *PR* is /piː ɑːr/ in en-US: keep the /iː/ long and pronounce the final /r/. Brazilian learners often say "peh-ar" and add a final vowel after /k/ in *ticket*.

**Step 2 — produce (ASR-scored):** read aloud:

> "LGTM on the PR — just a nit on the ticket comment."

**Target phonemes:** /dʒiː/ in the G of *LGTM* · /iː/ and /ɑːr/ in *PR* · /ɪ/ in *nit* and *ticket* · /k/ final in *ticket*, without epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_pr_tickets_commit_imperative_001
skill: `grammar.pr_commit_imperative`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_imperatives`
distractors:
  - option: "Adding the empty-page test to the PR."
    br_pt_form: "Adicionando o teste de página vazia ao PR."
    note: "a gerund phrase is a fragment, not a directive in a commit message"
  - option: "Added the empty-page test to the PR."
    br_pt_form: "Adicionou o teste de página vazia ao PR."
    note: "past tense reports a finished action; commit messages use the imperative"
  - option: "Adds the empty-page test to the PR."
    br_pt_form: "Adiciona o teste de página vazia ao PR."
    note: "third-person -s needs a subject, which a commit message does not have"
```

**Item:**
> Reviewing imperatives: which line is a correct commit message?

| Slot | Value |
|------|-------|
| A | "Adding the empty-page test to the PR." |
| B | **"Add the empty-page test to the PR."** ✓ |
| C | "Added the empty-page test to the PR." |
| D | "Adds the empty-page test to the PR." |

**Key:** B

**Feedback:**
> A commit message is a directive, so it opens with the base verb: **`Add the empty-page test to the PR.`** **A** is a gerund fragment, **C** reports the action in the past, and **D** uses an *-s* form without a subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_pr_tickets_tech_terms_001
skill: `vocab.it_computer_terms`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_terms_basics`
distractors:
  - option: "a branch"
    br_pt_form: "um branch"
    note: "a branch is a line of development, not the address client apps call"
  - option: "a label"
    br_pt_form: "uma etiqueta"
    note: "a label tags a ticket; it does not name a URL"
  - option: "a deploy"
    br_pt_form: "um deploy"
    note: "a deploy puts a build in an environment; it is not the URL itself"
```

**Item:**
> Reviewing IT terms: the PR fixes the `/search` URL that client apps call. What is that URL called?

| Slot | Value |
|------|-------|
| A | a branch |
| B | **an endpoint** ✓ |
| C | a label |
| D | a deploy |

**Key:** B

**Feedback:**
> An **endpoint** is the address a client calls: **`/search` is an endpoint.** **A** is a branch of the repository, **C** is a ticket tag, and **D** is the act of releasing a build.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `pr_review_request_form` | Item 1 missed | **L2** | Contrast *could you review / could you to review / reviewing* in short requests with a named PR and a deadline. |
| `pr_thread_detail_split` | Items 2 and 4 missed | **L2** | Drill *blocker* vs *nit* vs *acceptance criteria* in a four-line PR thread; ask who does what after the review. |
| `pr_review_register_recycle` | Items 3, 5, 6 and 7 missed | **L2** | Recycle *LGTM / WIP / request changes / approve* with the imperative commit form and the IT term *endpoint* in one review thread. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_imperatives` and `les_a2_it_terms_basics` and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. The grammar-rag query for this authoring returned weakly related material (verb complements in `-ing`, plus an answer key); the pedagogy is anchored in the canonical A2 models instead — technical-email register, `Could you...?` requests, imperative commit messages and contrastive pronunciation.
6. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced. The abbreviations PR, LGTM and WIP are unprotected professional conventions.
