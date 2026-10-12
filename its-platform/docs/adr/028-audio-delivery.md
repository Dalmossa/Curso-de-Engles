---
adr: 028
title: Audio delivery for the listening catalogue — a dialogue-scoped signing endpoint, an AudioUrlSigner port, and the ear check as the admission gate
status: Accepted
date: 2026-10-11
authors: [@its-architect]
deciders: [@its-architect, @platform-lead, @security-lead]
consulted: [@backend-lead, @sre-lead, @content-owner]
informed: [@team]
tags: [audio, listening, signed-urls, kms, s3, lgpd, p1.13, m3, adr-027]
---

## Context

`BACKLOG.md` **P1.13** reads:

> | **P1.13** | Audio streaming with signed URLs | M5.2 | Must | 2d | P1.12 | ADR-005 | 5 min TTL;
> KMS-encrypted; consent checked before issue |

It cites **ADR-005**, and ADR-005 is *"Async processing via Celery + Redis"*. No ADR in
`docs/adr/` decides audio delivery: the only ADR-set mentions of the subject are
`009-pgbackrest-backup.md` (S3 for backups) and one line in the ADR-027 index. So P1.13 is not
"implement a decision that exists"; **it is the decision**. This ADR makes it, and the four
measurements below are why it does not look like the story it was filed as.

### 1. There is no audio, and nothing in this repository can produce it

| Artefact | Says |
|---|---|
| Audio files (`*.mp3`, `*.ogg`, `*.opus`, `*.wav`, `*.m4a`) anywhere in the repository | **0** |
| `PRD.md` §5 | `Rendered audio clips \| 0 \| blocked` |
| `PRD.md` §7, blocker 1 | *"**No audio has been rendered.** 13 transcripts require 30 speaker-clips (`v_a` 8, `v_b` 7, `v_c` 7, `v_d` 8)"* |
| `PRD.md` §9, milestone M3 | *"30 speaker-clips exist; every listening item's status is `shipped`, `withdrawn` or `shadow-only`, with no unresolved render deferrals"* |
| The loader | writes **`clips`** — measured **171**, one per dialogue turn, 9–16 per dialogue — and writes **`clip_renders`**: measured **0**. `content-loader.ts` has no statement touching `clip_renders` |
| `specs/listening-corpus-spec.md` | is titled *"…and the TTS Problem"* |

So the table this endpoint reads is empty, and M3 — which P1.13 does not appear on the critical
path of — is the milestone that fills it. That does not make P1.13 wrong; it makes it an
**endpoint that is verifiable against seeded rows and not against a single real clip**, and the
ADR has to say so in its consequences rather than discover it at first play.

### 2. `items.clip_ids` has no producer, so the corpus spec's per-clip ear check has no join

`items.clip_ids TEXT[]` exists. Measured over the loaded catalogue: of the **74** listening items
(**55** `L1`, **19** `L2` — and the 19 `L2` rows are exactly the `lst_pron_minpair` items),
**0** have a non-null `clip_ids`. The column is NULL on every row.

`listening-corpus-spec.md` §2.3 gates the L2 tier on a **per-clip human ear check** (*"`[θ]`
present, not [s]/[t]"*), and `Q-L7` states the requirement: *"100% of L2 clips; 20% sample of L1"*.
With no item→clip reference in the data, "which clip is the minimal-pair clip" is not
answerable. The only granularity the schema supports is the **dialogue**.

### 3. The audio bucket's lifecycle rule would delete the catalogue

`docs/iac-spec.md` §2.4 gives the audio bucket a lifecycle rule:

```hcl
rule {
  id     = "expire-audio-recordings"
  filter { prefix = "audio/" }
  expiration { days = 30 }
}
```

and `docs/security-spec.md` §7 stores **learner recordings** at
`audio/{learner_id}/{uuid4()}.opus.enc`, also 30 days. A catalogue clip render written anywhere
under `audio/` — the only prefix a developer reading either document would reach for — is
**silently deleted 30 days after it is written**, and nothing fails at the time. The listening
corpus is the one asset class in this system that must live as long as the lesson does.

Two related numbers are already inconsistent and are recorded rather than fixed here:
`runbook.md` §SLO says *"S3 (Audio) … 90 days"* while `iac-spec.md` says 30, and the `temp/`
rule expires in 1 day. Both govern learner recordings, not the catalogue — a later story.

### 3b. The vocabulary is overloaded, and the overload hides the unit of delivery

`listening-corpus-spec.md` uses **"clip"** for a whole dialogue's audio: `Q-L2` sets *"clip
duration 45–120 s"*, which is `dialogues.duration_seconds BETWEEN 45 AND 120` (measured 49–84 s
over the 13 rows). The DDL's `clips` is a **single turn** — `(dialogue_id, sort_index,
utterance_text)`, 171 of them. `clip_renders` is keyed on the DDL sense (`UNIQUE (clip_id,
take)`). Both readings are live in the same sentence of the corpus spec, and the endpoint's
response shape depends on choosing one: this ADR serves the **DDL** unit (a turn per render) and
says so, because that is what `slot_responses` and `Q-L6` need (below).

### 4. What *is* already decided, and where

| Source | Decision |
|---|---|
| `security-spec.md` §4 | `Signed URLs (audio) \| HMAC-SHA256 \| Rotating signing key in KMS` |
| `diagnostic-spec.md` §9 | `Audio Delivery \| CDN, pre-signed URLs, opus 24kbps, <200ms TTFB` |
| `iac-spec.md` §2.4 | audio bucket: `sse_algorithm = "aws:kms"`, `aws_kms_key.s3` with `enable_key_rotation = true`, public access fully blocked; a `modules/cloudfront/` module |
| `docs/iac/` | **empty** — none of the above is implemented |

Three of those agree on the shape (a pre-signed URL on a CDN origin, KMS-held key, opus), and
they agree with each other on the algorithm: **HMAC-SHA256**. The platform has no AWS SDK and no
JWT library in `dependencies`, so a signing implementation needs no new dependency: `node:crypto`
is HMAC-SHA256.

### 3c. `slot_responses` names the render, so the response must let the client name it back

`slot_responses` already carries `clip_id`, `voice_id`, `replays` and `assist_used`, and
`listening-corpus-spec.md` §2.1–§2.2 requires `voice_id` and `dialogue_id` on every response so
the voice-balance analysis can be run, and records that *"a learner using the 0.75× clip is
recorded as having been given an accommodation"*. A response that returned only a URL could not
tell the client which `clip_id`/`voice_id`/`take` it had just played, and the response row would
be unfillable. The delivery payload therefore has to name the render — which is a constraint on
the *contract*, decided at the same time as the signing.

---

## Decision

### 1. Audio is a resource of its own: `GET /content/listening/{dialogue_id}/audio`

The 10th published path, in **both** `docs/api/openapi.yaml` and `docs/api-spec.openapi.yaml`.

Rejected: adding a `url` to `DialogueContent`. That response is a **catalog read** (ADR-027 §1) —
a function of tables, stable, and legitimately cacheable. A signed URL is none of those three: it
expires in 300 s. A cacheable payload that carries a URL with a lifetime is a defect waiting for
the first CDN or the first client that caches, and it would make ADR-027's "one read path"
property false the day CORS or a proxy is added.

Rejected: `GET /content/clips/{clip_id}/url`. It forces the client to reassemble the dialogue
from N responses, exposes an id space the client has no other use for, and cannot express the
dialogue-scoped invariants in §3 (a per-clip endpoint cannot know that take 2 exists for three
clips and take 1 for the other ten).

### 2. One render per clip, one take per dialogue, the speaker's own voice

The response is the **playlist** of a dialogue's clips in `sort_index` order. For each clip:

* the render chosen is from the **single highest `take` that is complete for the whole dialogue**
  (every clip has a render with that `take`). A partially re-rendered dialogue is not a mixture
  of takes: `Q-L6` requires both members of a minimal pair at *the same voice and the same rate*,
  and `Q-L3` bounds the rate at 130–165 wpm, so a dialogue is one render pass or it is nothing;
* the voice is the voice `dialogue_speakers` pins to that clip's speaker. Measured: voice is
  pinned **per speaker per dialogue** (the loader writes `dialogue_speakers (dialogue_id,
  speaker_id, voice_id)`; the corpus fixes `dlg_a1_01_first_intro` = Ana `v_a` · Ben `v_b`, and
  4 panel voices exist), and every dialogue has 2–4 speakers. A dialogue is *not*
  single-voice, and the endpoint must not flatten it to one.

The payload names the render — `clip_id`, `sort_index`, `speaker_id`, `voice_id`, `take`, `rate`,
`duration_s`, `url`, `expires_at` — so the client can fill `slot_responses.clip_id` and
`slot_responses.voice_id` with what it actually played (§3b of the Context).

`rate` is a query parameter (`1.00` default, `0.75` on demand). The accommodation is **recorded**,
not silent: `slot_responses.assist_used` already exists for it, and
`listening-corpus-spec.md` §2.2 is explicit that an unrecorded accommodation inflates the
listening estimate.

> **Implementation note, and the reason it is in the ADR.** `clip_renders.rate` and
> `clip_renders.duration_s` are `NUMERIC`. `pg`/TypeORM return `NUMERIC` as a **string** by
> default. A mapper that passes the row through publishes `"1.00"` where the schema says
> `type: number` — the same defect class ADR-027 had to repair in `PackOption.note`, where the
> published type no real payload satisfied. `rate` and `duration_s` must be converted with
> `Number(...)`, and the contract test must assert the **type**, not the presence, of both.

### 3. The admission gate is the ear check, and a refusal is the same 404

A request for dialogue `D` succeeds only when **all** of the following hold. Otherwise it
returns the **same 404 body as an id that does not exist** — the rule ADR-027 §3 established for
`/content/listening/{dialogue_id}`, applied to this endpoint too, so that "not admitted" cannot
be probed for:

1. `D.status = 'shipped'`;
2. every clip of `D` has at least one render;
3. one `take` is complete for every clip of `D` (§2);
4. **if any item of `D` has `listening_tier = 'L2'`, every selected render has both
   `ear_checked_at IS NOT NULL` and `ear_checked_by IS NOT NULL`.**

A dialogue with **no clips at all** is refused rather than served empty: condition 2 is vacuously
true of an empty set, but no take is complete *for the whole dialogue* over nothing, and
`DialogueAudio.clips` publishes `minItems: 1` — an empty playlist is the one response a client
could not tell apart from a bug in its own code.

Condition 4 is `Q-L7`'s L2 obligation, and its granularity is forced by the measurement in
Context §2: `items.clip_ids` is NULL on all 74 listening items, so the ear check **cannot** be
located at the specific minimal-pair clip. The data supports exactly one granularity — the
dialogue — and this ADR takes it and names the cost: measured against the loaded catalogue, **11 of
the 13 dialogues carry at least one L2 item** (19 L2 items in total, all `lst_pron_minpair`; 26 L2
items are declared in `corpus/listening-corpus.md`, 19 ship and 7 are `withdrawn`). The two L2-free
dialogues, `dlg_a2_02_what_does` and `dlg_b1_01_incident`, are L2-free because **both** of their L2
items are withdrawn (`§9 DEF-7` ×2; `DEF-10`, `DEF-11`), so the loader writes no L2 tier for them
and this condition does not bind — 11 of 13 dialogues are withheld until their renders are
ear-checked. Because the gate is read from `items.listening_tier` and not from a list of dialogue
ids, `DEF-11`'s **deferred replacement** (`§10.3`) re-arms it for `dlg_b1_01_incident` the day that
replacement ships, with no change to this ADR or to the code. An L1 item's
own 20% sample (`Q-L7`) is deliberately *not* promoted to a gate here: the spec relaxed it
because an L1 mis-render fails *toward easiness*, and a gate stricter than the spec would be a
different decision to make on evidence, not a safety margin to assume.

`ear_checked_by` is required as well as `ear_checked_at`: `listening-corpus-spec.md` §2.3
qualifies the performer (*"a speaker who has the target phoneme natively"*), so a check with no
performer is not a check.

The consequence is faced in §Consequences: until M3 **and** the L2 ear checks, this endpoint
serves nothing. That is already true — there are 0 renders — so the gate costs nothing today and
is the correct gate the day the renders arrive.

### 4. Consent is **not** a precondition here — and that is a correction, not an omission

The backlog row's third clause, *"consent checked before issue"*, does not apply to this path.
Catalogue audio is authored by the platform, identical for every learner, and contains no
personal data. The consent-gated audio flow in `security-spec.md` §7 is the **learner's own
recording** (per-learner DEK, `audio/{learner_id}/…`, 30-day lifecycle, a 5-minute URL for the
ASR worker) — a different asset class with a different threat model.

Requiring a `consent_records` row before streaming a dialogue would:

* make a shared catalogue asset a **learner-scoped** resource, which it is not, and force every
  cache to be per-learner;
* put a **learner identifier in the URL**. A signed URL is logged by proxies, CDNs and browsers;
  an identifier in it is disclosure with no compensating control. `security-spec.md` §8's
  Information-Disclosure row is about θ/mastery/audio *and PII*; the mitigation here is that
  there is nothing to disclose.

**The signed URL therefore carries no learner identifier, and this endpoint reads no learner
context.** The consent check belongs to the recording path, in the story that owns that path,
and this ADR is the record that it was deliberately not placed here.

### 5. The signer is a port; the mechanism the specs name is HMAC-SHA256

`AudioUrlSigner` (application port) with `sign(clip, {take, voiceId, rate, ttlSeconds}) →
{url, expiresAt}`.

* **Implemented now — `HmacAudioUrlSigner`.** `security-spec.md` §4 names *"Signed URLs (audio) |
  HMAC-SHA256 | Rotating signing key in KMS"*, and this is exactly that: the URL
  `{AUDIO_BASE_URL}/catalog/render/{clip_id}/take-{take}.opus?rate={rate}&exp={unix}&sig={hex}`
  carries `sig = HMAC-SHA256(key, "{clip_id}/take-{take}?rate={rate}&exp={unix}")`. The key comes
  from configuration, sourced from the secret manager (KMS-wrapped, rotated) — the *mechanism* is
  the platform's, and it is fully testable: sign, verify, expire, tamper, and the 300 s boundary
  are all just function calls.
* **Specified, not built — `S3PresignAudioUrlSigner`.** Valid when the bucket is exposed
  directly; SigV4 presign against the audio bucket with `SSE-KMS`, as `iac-spec.md` §2.4
  configures it. Deliberately deferred: this environment has **no S3, no KMS and no CDN**, so an
  adapter written now would be unexercised code asserting a behaviour nothing can check —
  the artefact class this repository has had to repair more than once (`content-check.mjs`'s
  callback bug, the `ErrorResponse` drift). It lands with M3, when there is a bucket and a clip
  to fetch.

The bytes are served by the origin/CDN, **never by the Nest process**: `diagnostic-spec.md` §9
budgets *"<200ms TTFB"*, which an application server streaming Opus through Node cannot promise,
and `AUDIO_BASE_URL` is the seam that makes dev, staging and prod differ by configuration only.

TTL is **300 s**, the value `security-spec.md` §7, the backlog row and `diagnostic-spec.md` §9's
pricing of a pre-signed URL all agree on.

### 6. Object keys: `catalog/`, never `audio/` — asserted by the database

`clip_renders.uri` holds the object key. Catalogue renders live under **`catalog/render/…`**.
Because the consequence of getting this wrong is that the content disappears 30 days later with
nothing to see at the time, the rule is not left to a convention document:

```sql
CHECK (uri NOT LIKE 'audio/%' AND uri NOT LIKE 'temp/%')
```

A render recorded under the expired namespace is refused **at insert**. This is the same
reasoning that put `CHECK (is_key OR note IS NOT NULL)` in `item_options`: the database is the one
place in this system that cannot be bypassed, and the schema is the only schema.

`uri` keeps its name; it stores a key, not a URL, and the port is what turns a key into a URL. The
name is a wart, noted in §Neutral.

### 7. The contract

| Artefact | Change |
|---|---|
| `docs/api/openapi.yaml` **and** `docs/api-spec.openapi.yaml` | the path, the `getDialogueAudio` operation (`operationId`), and the schemas `DialogueAudio` + `DialogueAudioClip`, constraint-identical between the files as ADR-027 §2 requires |
| `400` **and** `404` | both, on the new path: `tests/contract/endpoints.spec.ts` requires a `400` on every path that publishes a `404`, and a malformed `dialogue_id` is a `400`, not a `404` |
| `DialogueAudioClip.rate` | `type: number`, `enum: [1, 0.75]` — see §2's `NUMERIC` note |
| `DialogueAudioClip.url` | `type: string`, `pattern: '^https?://'` — the only honest constraint, since the origin differs by environment |
| `DialogueAudio` | `required: [dialogue_id, cefr_level, ttl_seconds, clips]`; `ttl_seconds` is the TTL actually used (300), so a client never has to know the policy |
| `DialogueAudioClip.expires_at` | `type: string` with an explicit RFC-3339 `pattern`, chosen over `format: date-time` because the hand-rolled validator in `tests/contract/schemas.spec.ts` checks `pattern` and would silently skip `format` |
| `CHANGELOG.md` | **Added**, not Changed: a new path on a 0.1.0 API that has never been released is not a breaking change (CONSTITUTION §4.4) |

### 7b. The DDL gains one constraint, and it is additive on an empty table

`CHECK (uri NOT LIKE 'audio/%' AND uri NOT LIKE 'temp/%')` on `clip_renders`, in the single
create-schema migration (the pattern ADR-022/ADR-027 use: the schema is replayed, not versioned
per change), with `docs/data-model.erd.md` **§6.2** (Listening Corpus — where `clip_renders` actually
lives; §6.1 is Reference & Curriculum Catalog) updated. The table holds 0 rows, so the
constraint cannot fail on existing data, and `migration-check.mjs` replays the migration on a new
cluster and re-checks the trigger/constraint inventory.

### 8. What this story does not do

* it does not render, generate, upload or store a single audio byte;
* it does not serve bytes (the origin does) and adds no media route to the Nest process;
* it does not perform ear checks, and does not treat their absence as a defect — it treats it as
  a gate, which is the only honest handling of a corpus M3 has not reached;
* it does not populate `items.clip_ids`. Narrowing §3's dialogue-scoped ear check to a per-clip
  one is a follow-up that requires that column to have a producer, and the follow-up is recorded
  in §Consequences rather than silently assumed;
* it does not touch learner recordings, per-learner DEKs, `consent_records` or the 30/90-day
  retention inconsistency (§1's second note).

---

## Consequences

### Positive

* P1.13 becomes implementable, testable and honest in an environment with no audio: the signing
  is a pure function, the admission gate is a SQL predicate, and the API never claims to serve a
  byte it cannot.
* The 30-day deletion of the catalogue is now **impossible** rather than unlikely, enforced by
  the database where the mistake would be made (§6).
* The admission rule converts `listening-corpus-spec.md` §2.3's *"honest position"* — L2 is
  *"not admitted to the CAT until the per-clip ear check is done"* — from a paragraph into a
  condition the endpoint enforces, which is the only form in which it survives contact with a
  deployment.
* The contract stops over-claiming in a new place: `rate`/`duration_s` are typed as the numbers
  they are, with the `NUMERIC`-returns-`string` hazard named where the mapper is written.
* `AudioUrlSigner` is the seam that lets M3 land an S3/CloudFront origin without touching the
  service, the controller or the contract.

### Negative

* **The endpoint serves nothing until M3 and the L2 ear checks.** With 0 renders, all 13
  dialogues 404 today; with renders but no ear checks, 11 of 13 still 404 (§3). This is not a
  cost the ADR introduces, but it is one it refuses to hide: P1.13 alone does not make listening
  playable, and a demo that reads "P1.13 done" as "listening works" will be wrong.
* The ear-check gate is coarser than the corpus spec's own unit (dialogue, not clip), because
  `items.clip_ids` is empty. It withholds 4 L1 items along with the 2 L2 items of the same
  dialogue. Populating `clip_ids` (§8) is the fix, and until then the coarse gate is the
  conservative one.
* `HmacAudioUrlSigner` requires the platform to terminate the audio request (or front it with a
  worker that verifies the HMAC), which is one more moving part than a presigned S3 URL. It is
  taken because it is the mechanism the security spec names and the only one this environment can
  verify.
* The signature is verified by the origin, so a rotation of the signing key invalidates URLs
  already issued. The TTL is 300 s, which bounds the exposure to one rotation window.

### Neutral

* **P1.13's dependency on P1.12 is real but thin**: it consumes `dialogues`/`clips` and the
  `status='shipped'` + 45 s rule ADR-027 §3 already fixed, and reuses its 404 convention. It
  shares no schema with the three content responses.
* **The `M5.2` milestone reference is loose.** Audio rendering is M3 in `PRD.md` §9; M5 is
  *"Publishable subset"*. Recorded, not corrected: it is the same class of stale cross-reference
  as the `ADR-005` citation above, and the difference is that this one does not mislead the
  implementer.
* **Recorded and not fixed**: `runbook.md` says S3 audio retention is 90 days, `iac-spec.md`
  says 30; both are about learner recordings. `specs/listening-corpus-spec.md` **DEF-13** (the A1
  level is CAT-ineligible on voice grounds, because its items are all on the two speaker voices
  and no panel voice covers A1) is untouched here: `v_a`–`v_d` are 4 voices and the render plan is
  M3's.
* A `clip_render` row's `take` is per clip while §2's rule is per dialogue, so the DDL permits
  exactly the partial re-render the rule refuses to serve. Consistency is a rendering-pipeline
  obligation, not a schema one — an L1-style all-or-nothing `CHECK` cannot be expressed across
  rows without a trigger, and a trigger here would be an untestable invariant with no data behind
  it yet.

---

## Alternatives Considered

| # | Alternative | Rejected because |
|---|---|---|
| 1 | Bake `url` into `DialogueContent` | Makes a cacheable catalog read carry a 300 s lifetime (§Decision 1). The first CDN or client cache turns it into a stale-URL bug |
| 2 | `GET /content/clips/{clip_id}/url`, one URL per call | Cannot express the dialogue-scoped take/voice invariants, and forces N round-trips for one play |
| 3 | Return the object key and let the client build the URL | Moves the signing key, or the presign API, into the client. The client is a browser |
| 4 | Serve the bytes from Nest (`@nestjs/serve-static`, a stream route) | `diagnostic-spec.md` §9 buys audio at <200ms TTFB through a CDN; an app server doing Opus streaming is the wrong component, and it puts the catalogue behind the same pods as the adaptive engine |
| 5 | Require consent on this path, as the backlog row says | §Decision 4: it is a catalogue asset with no personal data; the control would put a learner id in a loggable URL and break shared caching |
| 6 | Public (unsigned) URLs for catalogue audio | The corpus is authored content with reuse constraints (PRD §2): the URL is the access control, and the bucket's `restrict_public_buckets` is already true |
| 7 | TTL 3600 s to reduce re-signing | The three specs say 300; a longer TTL widens the window in which a leaked URL is usable, for a re-sign that costs one HMAC |
| 8 | Per-render ear check for L1 too (stricter than Q-L7) | Contradicts the spec's deliberate 20 % sample, whose rationale (L1 fails toward easiness) the ADR has no evidence to overturn |
| 9 | Serve only `lst_pron_minpair`-free dialogues (drop the 12 L2 dialogues) | Removes 74 of the corpus's 74 shipped slots' dialogues' audio for the sake of 19 items, and reverses §2.3's own framing: the L2 items are gated, the corpus is not discarded |
| 10 | Write the S3 presign adapter now, tested with a mocked client | An adapter nothing can exercise is an unverified claim; the repository's own history is a catalogue of those. §Decision 5 defers it to M3 with the seam already in place |
| 11 | Build P1.13's endpoint against fixtures and declare M3 out of scope entirely | The *endpoint* is what is being delivered; M3 is the *asset*. The distinction is in Consequences ("serves nothing until M3") rather than hidden in a status field |
| 12 | Wait for M3 and re-file P1.13 behind it | The contract, the signer and the gate are all M3-independent, and the drift this ADR prevents (a URL in the catalog payload, a catalogue render in the expiring prefix) would otherwise be decided by whoever renders first |

---

## Implementation Plan

### A — the signer, and the object-key constraint

- [x] `src/infrastructure/audio/audio-url-signer.ts`: the port and its `SignedAudioUrl` type —
      a plain TypeScript interface with no framework import, in the tree the *adapter* lives in.
      (Not `src/domain/`: the domain has no notion of a URL, and the precedent is that
      `ContentService` already depends on `infrastructure/repositories`.)
- [x] `src/infrastructure/audio/hmac-audio-url-signer.ts`: HMAC-SHA256, `exp` in the signature
      input, `timingSafeEqual` on verify, key + `AUDIO_BASE_URL` from config
- [x] `AUDIO_URL_SIGNING_KEY` / `AUDIO_BASE_URL` config, sourced from the secret manager in
      deployed environments
- [x] `tests/unit/audio/hmac-audio-url-signer.spec.ts`: sign/verify round-trip; expiry at the
      300 s boundary (just inside, just outside); tampered `sig`, `exp`, `take`, `clip_id`;
      `timingSafeEqual` on a wrong-length signature; the TTL is exactly 300 by default
- [x] `src/migrations/1791331200000-create-schema.ts`: `CHECK (uri NOT LIKE 'audio/%' AND uri
      NOT LIKE 'temp/%')` on `clip_renders`
- [x] `docs/data-model.erd.md` §6.1: the constraint row
      — **done at §6.2**: `clip_renders` is part of the *Listening Corpus* section (context 3),
      not *Reference & Curriculum Catalog* (context 1). The table, the constraint and this
      adendum's own §6 reference all sit at §6.2; §6.1 is where the reference in §7b pointed.
- [x] `scripts/migration-check.mjs`: assert the constraint exists and that an `audio/`-prefixed
      `uri` is refused at insert (negative control)

### B — the read path and the endpoint

- [x] `ContentRepository.findDialogueAudio(dialogueId, rate)`: one query for the dialogue +
      clips, one for the renders of the chosen complete take, one for the L2 ear-check gate; the
      §3 conditions as SQL, not as post-filtering
- [x] `ContentService.getDialogueAudio()`: assembles the playlist, signs each clip, converts
      `rate`/`duration_s` with `Number(...)`
- [x] `content.controller.ts`: `@Get('listening/:dialogue_id/audio')`, `@Query('rate')`, the
      same 404 body as the other two routes, `400` on a malformed `dialogue_id` and on an
      unsupported `rate`
- [x] `content.module.ts`: the signer provider, injected as the port

### C — the contract, the tests, the record

- [x] `docs/api/openapi.yaml` **and** `docs/api-spec.openapi.yaml`: the path + `DialogueAudio` +
      `DialogueAudioClip`; verified constraint-identical with descriptions stripped
- [x] `tests/contract/schemas.spec.ts`: a `DialogueAudio` instance with `rate: 1` as a **number**
      (the `NUMERIC` guard), a `0.75` instance, and the path's `400`+`404` pair
- [x] `tests/contract/endpoints.spec.ts`: the new path in the published-path list
- [x] `tests/integration/content-audio.spec.ts`: seed `clip_renders` (labelled as seed — M3 is
      the real producer) and assert: a complete take is served in `sort_index` order with the
      speaker's voice; a partial take 404s; an L2 dialogue without ear checks 404s and with them
      serves; a non-`shipped` dialogue 404s with the **same body** as an unknown id; `rate=0.75`
      is echoed and signed; an unknown rate is a `400`
- [x] a negative control for §3 condition 4: with the ear-check predicate removed, the L2 test
      fails
- [x] `tests/bdd/README.md`: the scenario (audio of a not-admitted dialogue is indistinguishable
      from an unknown dialogue)
- [x] `CHANGELOG.md` — **Added**; `BACKLOG.md` P1.13 corrected to cite **this ADR** instead of
      ADR-005; `MEMORY.md`; `docs/adr/README.md` index row
- [x] all gates green, committed
      — **gates green; not committed.** The branch is left dirty deliberately (the story was
      implemented under an explicit "do not commit" instruction). Everything in this list is on
      disk and was verified by the numbers in `MEMORY.md`.

## References

* `BACKLOG.md` P1.13 · `PRD.md` §5, §7 (blocker 1), §9 (M3)
* `docs/adr/027-content-api.md` §1, §3 (the read path and the same-404 rule)
* `specs/listening-corpus-spec.md` §2.1–§2.4, §3 (`Q-L2`, `Q-L3`, `Q-L6`, `Q-L7`), §4
* `docs/security-spec.md` §4, §7, §8 · `docs/iac-spec.md` §2.4 · `docs/runbook.md` (SLO table)
* `specs/diagnostic-spec.md` §9
* `src/migrations/1791331200000-create-schema.ts`: `clip_renders`, `dialogue_speakers`, `items`,
  `slot_responses`
* `tests/contract/schemas.spec.ts`, `tests/contract/endpoints.spec.ts`
