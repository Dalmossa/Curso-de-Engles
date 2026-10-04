# Lesson: Reading Technical Texts — five moves, not "read it twice"

**Lesson ID:** `les_a2_it_reading_strategy`
**Module:** `mod_a2_it_fundamentals`
**CEFR:** A2
**Reuse basis:** `cite_only`
**Source:** `Ingles-Tecnico-Para-Informatica.md` Aula 2.1 "Clues for reading of texts" / 2.2 "Reading strategy" (©CETAM, restricted — bibliography only)
**Estimated time:** 15 min

> **Why this lesson is `cite_only`.** The CETAM course book is © Centro de Educação Tecnológica do
> Amazonas and grants no redistribution right. It was read to decide the *scope* — that A2 technical
> reading is about hunting for structure rather than decoding every word, and that "clues" means
> non-linguistic signals first. No text, table, or activity from Aula 2 is reproduced. The five
> moves below are standard skimming practice and are written from scratch. See `external-sources.md`
> §0.5 / §7.0.

---

## FASE 1 — Input (i+1) [4 min]

### The target text (authored, 150 words)

> **Rotating a database replica without downtime**
>
> Most teams run one primary and two replicas. Reads are cheap, so replicas take them. Writes go to
> the primary, and the primary streams its change log to the replicas. **A replica falls behind
> whenever it cannot apply a change as fast as the primary writes it.** Replication lag is the gap
> between the two positions in the log.
>
> **If a read must not be stale, send it to the primary.** This costs write capacity, and at scale
> it is the wrong default.
>
> **If a read may be up to 200 ms old, a replica is correct and far cheaper.** Most product
> features do not notice the difference. Billing, permissions, and anything with a rate limit based
> on fresh counts do notice.
>
> **Failover** means promoting a replica to primary. It is fast, and it is not free: in-flight
> writes on the old primary are lost unless the replica acknowledged them.

### The five moves (this is the lesson)

| Move | What you look at | Seconds | What you get |
|------|------------------|--------:|--------------|
| 1. **Title + first line** | what is this about | 5 | the topic |
| 2. **Bolded or signposted lines** | the author's claims | 20 | the argument's spine |
| 3. **Numbers and units** | 200 ms, two, one | 15 | the scale |
| 4. **The last paragraph** | the conclusion or a warning | 15 | the direction |
| 5. **Only then**, re-read what you flagged | the detail | the rest | the detail |

> **Why this order is the lesson.** A PT-PT speaker's instinct is to read linearly from the first
> word, because Portuguese expository prose is heavily front-loaded — the thesis comes early and the
> rest is support. English technical writing **front-loads the topic but buries the caveat**, because
> the caveat is the thing most likely to be wrong. Reading linearly in English means you reach the
> qualification ("in-flight writes are lost") *after* you have already decided the feature is safe.
> Move 4 exists specifically to catch that sentence.

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
*"Replication lag is the gap between the two positions in the log."* Here **lag** means:
| Slot | Value |
|------|-------|
| A | A scheduled delay before a planned maintenance window |
| B | **The distance between how far the primary has written and how far a replica has applied** |
| C | A network cable that is too short |
| D | A rule that says how long logs are kept |
**Key:** B
**br_pt_form:** "atraso de replicação"

### Item 2 — Vocabulary (MCQ)
*"Failover means promoting a replica to primary."* **Promote** means:
| Slot | Value |
|------|-------|
| A | To advertise the promotion publicly |
| B | To raise something to a new, higher role |
| C | To remove a server from the cluster |
| D | To apply a database migration |
**Key:** B
**br_pt_form:** "promover / elevar a um cargo superior"

### Item 3 — Reading inference (MCQ) — the item that tests the lesson
You applied only moves 1–4, in 15 seconds. Which sentences did you capture?
| Slot | Value |
|------|-------|
| A | The first sentence and the word "Failover" |
| B | The bolded claim, the 200 ms threshold, and the in-flight-write warning |
| C | The definition of the change log |
| D | The whole text, because A2 texts are short |
**Key:** B
**br_pt_form:** "a afirmação em negrito, o limite de 200 ms e o aviso sobre escritas em trânsito"

### Item 4 — Vocabulary (MCQ)
The last paragraph says in-flight writes "are lost **unless** the replica acknowledged them."
**Unless** here means:
| Slot | Value |
|------|-------|
| A | Even if |
| B | **Except when** |
| C | Because of |
| D | In spite of |
**Key:** B
**br_pt_form:** "a menos que / exceto quando"

> **Interference note.** PT speakers often read *unless* as "even if", because Portuguese *a menos que*
> and English *unless* are both subtractive but the negative scope sits differently. The
> disambiguating pair: *unless it acked* = se não acknowledged, writes survive; *even if it acked* =
> mesmo tendo acknowledged, writes are lost. One word, opposite meanings.

---

## FASE 3 — Output Task [4 min]

### Reading + Speaking: "The 30-second read" [2 min read + 2 min report]

Here is a second authored text, 190 words:

> **Why we moved from cron to a queue**
>
> Our nightly report ran from a cron job on one application server. It was scheduled, it ran, and
> for two years nobody looked at whether it finished. **Cron tells you when a job starts. It cannot
> tell you when a job did not start at all.** A deploy that took the server down at 02:00 silently
> skipped the report, and the only signal was a Slack message from someone who noticed the numbers
> had not moved.
>
> A queue separates *when work is scheduled* from *when work runs*. The scheduler enqueues at 02:00
> regardless of application health. The worker picks it up when it comes back. A run that fails
> retries with backoff, and a run that has failed eleven times goes to a dead-letter queue that
> pages a human. **The guarantee changed from "usually" to "at-least-once, and you will be told when
> it is not."**
>
> We now also have duplicates, which cron never had. A worker that dies after enqueuing but before
> acknowledging will run the report twice. For a read-only report that is harmless. For anything
> that charges a card, it is a real bug, and idempotency is the property that makes it survivable.

**Task:** Apply the five moves. Then report to your team, in 60 seconds:
1. What is this text about? (move 1)
2. What are the author's two claims? (move 2)
3. What is the number or threshold, and what does it govern? (move 3)
4. What is the warning in the final paragraph — and what is the word that signals it? (move 4)
5. Which sentence would you still need to re-read before you trusted the text? (move 5)

**Success rubric:**
- Move 1 stated as a topic, not a summary of the first sentence
- Move 2 separates the two claims (*"cron cannot detect a skip"* / *"at-least-once, and you are told when it is not"*) rather than paraphrasing one
- Move 3 names *eleven* retries and connects it to the dead-letter queue
- Move 4 identifies the idempotency paragraph as the caveat and names the signal word (*however*, *for anything that charges a card*)
- Move 5 names a real sentence — acceptable answers: the idempotency clause, the backoff clause, or the cron sentence about the deploy

**L1 interference to pre-empt:** the final warning is signposted by *"For anything that charges a
card, it is a real bug"* — a PT speaker who read linearly will report the queue guarantee as the
conclusion and stop. The rubric marks that as move 3, not move 4.

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
In technical writing, a **caveat** is:
| Slot | Value |
|------|-------|
| A | The section with the references |
| B | **A qualification or warning that limits the main claim** |
| C | A list of the tools used |
| D | The author's job title |
**Key:** B
**br_pt_form:** "ressalva"

### Item 2 — Grammar (L1, adaptive)
Choose the correct conditional: "In-flight writes are lost ______ the replica acknowledged them."
| Slot | Value |
|------|-------|
| A | because |
| B | **unless** |
| C | although |
| D | so that |
**Key:** B
**br_pt_form:** "a menos que"

---

**Listening input:** `deferred_render` — no clip exists; both texts are served on the page.
**Pack ID:** `pack_les_a2_it_reading_strategy_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_reading_strategy",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "both expository texts, the five-move table and its justification paragraph, the interference note, all 6 practice items, the 5-part report rubric, the 2 Shadow CAT items",
    "bibliography_only": [
      "Ingles-Tecnico-Para-Informatica.md (CETAM 2010, (c) Centro de Educacao Tecnologica do Amazonas, no redistribution grant) Aula 2.1-2.2 - scoping only: that A2 technical reading is structure-hunting rather than full decoding, and that 'clues' means non-linguistic signals first. No text, table, or activity reproduced."
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no clip rendered; both input texts are authored and served as text",
    "verbatim_reproduction": "none - the five moves are standard skimming practice and the two technical texts were written for this lesson"
  },
  "skills_touched": ["reading", "vocabulary", "grammar", "listening", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.unless_subtractive"
    ],
    "vocab": [
      "vocab.reading.lag",
      "vocab.reading.promote",
      "vocab.reading.caveat",
      "vocab.reading.five_moves",
      "vocab.reading.at_least_once",
      "vocab.reading.idempotency"
    ],
    "reading": [
      "reading.skimming.claim_extraction",
      "reading.skimming.caveat_identification"
    ],
    "listening": [
      "listening.structure_following"
    ],
    "pronunciation": [
      "pronunciation.caveat_stress"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```
