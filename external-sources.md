# Source Registry & Licence Clearance — external sources, and the local corpus

**Purpose, in two parts.** `curriculum-graph-spec.md` §4.4 established that **13 lessons had no
source at all** (`deferred_no_source`) because the 7 local PDFs contain *language about computers* and
*corporate vocabulary* but **zero professional IT discourse** — `architecture` 0 hits, `code review`
0, `incident` 0, `RFC` 0, `stand-up` 0, `mentoring` 0 across all 7 files. **Part 1** supplies those
sources.

**Part 2 is the more consequential half, and it is not about the 13.** Verifying licence strings on
the *external* sources led to checking the *local* ones, and **none of the 7 local PDFs is
permissively licensed** — three carry an explicit non-redistribution notice, four are silent. Only
**11 of 123 lessons (9%)** currently have a source that may lawfully be reused. §0.5 is that
finding; §7.0 is the obligation register that follows from it.

**Every source below was fetched and its licence string read.** Every URL was tested. Sample text is
verbatim, not paraphrased. Where a source is **rejected**, the rejection and its reason are recorded —
that list is half the value of this file, because the most likely failure mode for this project was
sourcing from material that cannot legally or pedagogically be reused.

**Retrieved:** 2026-09-30. **Registry version:** 1.0.

**Two rules this file exists to enforce** (`AGENTS.md`):

1. *Never present authored material as source-derived.* A source is cleared for a lesson only when
   (a) the licence permits the intended use, **and** (b) the page contains the **discourse** the
   lesson teaches — not merely the topic word.
2. *Never adapt a source you have not read the licence of.* Not reading the licence is the failure
   mode; permission is not implied by availability, and this repo now contains a worked example of
   exactly that mistake in both directions (§0 and §0.5).

---

## 0. THE CORRECTION THAT MATTERS MOST

`AGENTS.md` and the previous plan of record both assumed the **Google SRE Book** was the natural
CC-BY source for incident and postmortem material. **It is not.**

```
Copyright © 2017 Google, Inc. Published by O'Reilly Media, Inc.
Licensed under CC BY-NC-ND 4.0
```

*(verbatim, page footer, `https://sre.google/sre-book/postmortem-culture/`)*

**NC** forbids commercial use — this blocks a paid course. **ND** forbids derivatives — this blocks
exactly the adaptation into lesson material that the ITS requires. The SRE Book is the richest and
most authentic register available, and it is the **wrong licence for the job**.

The same trap appeared in four other places (§3, with §3.0 and §3.1 for the two that are worth
reading), including two sources that look canonical and are the first thing anyone would reach for.
**That is the lesson, and it is the reason this file was worth building**: for courseware, the best material and the usable material are frequently
different things, and the difference is only visible if someone actually reads the licence footer.

**Replacement chosen:** Google Cloud Well-Architected Framework, Reliability pillar — genuine
**CC-BY-4.0**, and it carries the *same* blameless-postmortem framing. Thinner than the SRE Book, but
legally clean, and it is a framework document rather than a narrative, which is better input for a
non-native reader anyway.

---

## 0.5 THE LOCAL CORPUS IS NOT LICENCE-CLEAN EITHER — and that is the bigger finding

This was found **after** the 13 lessons were already repointed, and while looking for chapter
headings in `frases-ingles-trabalho.md`. Three of the seven local PDFs carry an explicit licence
notice in their own front matter. Verbatim:

> **LICENÇA DE USO** — "Disponibilização gratuita e integral por meio da plataforma BaixeLivros.
> Caso deseje compartilhar-lo fora deste ambiente, é necessário obter a devida permissão. Além
> disso, a licença gratuita concedida para este material poderá ser alterada futuramente a critério
> do autor. Reforçamos o compromisso com a ética e a valorização do trabalho dos autores,
> tradutores e editores, oferecendo acesso responsável à leitura."
>
> — `Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md` L37–43, `leia-e-escreva-melhor-em-ingles.md`
> L42–49, `frases-ingles-trabalho.md` L26–32 (wording differs: "do autor" / "da autora")

Three operative terms, and all three matter:

| Term | Consequence for this project |
|------|------------------------------|
| *"compartilhar-lo fora deste ambiente … obter a devida permissão"* | **Redistribution requires the author's permission.** A course is redistribution. |
| *"a licença gratuita … poderá ser alterada futuramente a critério do autor"* | The grant is **revocable at will**. Even permission obtained today may not hold tomorrow, so it must be in writing and perpetual. |
| *"acesso responsável à leitura"* | The grant is **read access**, not reuse. |

The other four local files are not better — they are simply silent:

| Local source | What it actually states |
|--------------|-------------------------|
| `Ingles-basico.md` | `©2012 Tiago Rodrigues` (L22). No licence grant. |
| `Ingles-Tecnico-Para-Informatica.md` | `© Centro de Educação Tecnológica do Amazonas – CETAM` (L24). No licence grant. |
| `apostila-ingles-para-iniciantes-impresso.md` | No copyright statement, no licence, found anywhere in the file. |
| `Ingles para Viagens.md` | No copyright statement, no licence. |

Applying §1's own rule — *unverifiable is treated as reserved* — **not one of the seven local
sources is permissively licensed.** Applying it to the 123-lesson registry:

| Class | Lessons | Share | Verdict |
|-------|--------:|------:|---------|
| cites an **explicitly restricted** source (BaixeLivros) | **54** | 44% | ❌ blocked by an explicit term |
| cites a **©-only** source (CETAM, Tiago Rodrigues) — no licence grant | **13** | 11% | ❌ all rights reserved by default |
| cites a source with **no copyright statement at all** | **7** | 6% | ❌ reserved by default |
| cites a **permissive external** source (this file, §2) | **11** | 9% | ✅ reusable with attribution (7 `sourced_external` lições IT ainda pendentes de reautoria integral) |
| cites **no specific source** (inclui 5 exam, 5 remediação e lições reautoradas/originais clean-room) | **38** | 31% | ⚠️ sem fonte externa declarada no registro — inclui 30 lições `authored_material` (5 Lote 1 + 5 Lote 2 Onda 2 + 5 Onda 2 — Lote 2 (batch 2) + 5 Onda 2 — Lote 3 (batch 3) — Fase A + 5 Onda 2 — Lote 4 (batch 4) — Fase B + 5 Onda 2 — Lote 5 (batch 5) — Fase C) |

> **Placar pós-Onda 2 — Lote 5 (batch 5) — Fase C (2026-11-16): 37 de 123 lições** estão em base reutilizável/autoralmente limpa para a meta — **30 `authored_material`** (Lote 1: `les_b1_it_presentations`, `les_b1_it_architecture_vocab`, `les_b1_it_code_review`, `les_b2_it_mentoring`, `les_b2_it_rfc_writing`; Lote 2 Onda 2: `les_a1_greetings`, `les_a1_intro_dialogue`, `les_a1_daily_basics`, `les_a1_pronunciation_intro`, `les_a2_it_meeting_standup`; Onda 2 — Lote 2 (batch 2): `les_a1_alphabet_sounds`, `les_a1_en_us_en_gb`, `les_a1_to_be_forms`, `les_a1_pronouns_subject_object`, `les_a1_pronouns_possessive`; Onda 2 — Lote 3 (batch 3) — Fase A: `les_a1_pronouns_demonstrative`, `les_a1_wh_questions`, `les_a1_numbers_colors`, `les_a1_days_months`, `les_a1_time_dates`; Onda 2 — Lote 4 (batch 4) — Fase B: `les_a1_food`, `les_a1_occupations`, `les_a1_regular_verbs_past`, `les_a1_present_simple`, `les_a1_present_simple_questions`; Onda 2 — Lote 5 (batch 5) — Fase C: `les_a1_have_has`, `les_a1_there_is_are`, `les_a1_reading_skimming`, `les_a1_false_cognates`, `les_a2_phone_calls`) + **7 `sourced_external`** permissivas ainda pendentes de reautoria integral. **86 lições permanecem `cite_only`** e as demais bases de reuso/adaptação seguem conforme o inventário e a política de `cite_only`/reautoria: **7 `adapt_with_attribution`** e 0 `adapt_requires_permission`. As 5 classes de `§0.5` somam 123: 54 bloqueadas por termo explícito e 20 por ausência de licença/padrão restritivo no corpus local (©/sem declaração), 11 em fonte externa permissiva e 38 sem fonte específica declarada no registro. |

### 0.5.1 What this does and does not change

**Reuse basis of this section: `authored analysis`.** Nothing here is derived from a restricted
source. The three PDFs are *named* because the finding is about them; the finding is the repository's
own. This declaration is not ceremonial — it is the answer to check [11], which correctly refuses
to accept a section that names a restricted source and discusses what to do with it without saying
what the section itself is.

**It does not invalidate any work done so far.** The curriculum graph, the 123-lesson registry, the
IRT skill map, the diagnostic blueprint, the 12-dialogue listening corpus, the BKT/FSRS
specification and the item schema are **all original work**. The listening corpus was already
`authored` and is unaffected. The Tier B false-cognate review was original analysis. Nothing
authored from memory has been published as source-derived.

> ⚠️ **That sentence was false when written, and it stayed false for a while.**
> `verify-integrity.py` [11] — added 2026-09-30, and itself built because of `content-map.md` §11.1 —
> found the counterexample: `content-map.md` §11.1, the **P0** corporate-term deck, was headed
> *"Source-derived, zero authoring"* and then reproduced a restricted book's 40-row list, its
> invented phonetic notation, and 8 verbatim sentences. Not "authored from memory" — the opposite
> failure, and the more serious one: material that *was* source-derived, labelled as if it were
> authored, marked `P0` and `FSRS-anchored`, and planned as a lesson's vocabulary source at line 746
> under a CC-BY licence claim. §11.1 has been rewritten as a research scaffold with its basis
> declared; the respelling column and the verbatim block are gone.
>
> The general lesson, and the reason [11] checks the *claim* rather than the content: **a licence
> audit that walks the lessons but not the specs will pass, because specs are where the
> publishable-looking material accumulates.** §11.1 lived in `content-map.md` — the skill-ID source
> of truth — and was read by every downstream lesson as a ready-made deck.

**It does invalidate one framing.** The local PDFs are the repo's *reasoning substrate*, not its
*publishable substrate*. `AGENTS.md` describes them as "source material for curriculum
engineering", which remains correct — but it never said they were licensable, and they are not.
`content-map.md` and the registry treat a `Source` cell as evidence of provenance; it is evidence of
**where the idea came from**, and must now carry a second, separate field recording whether that
source may be **reproduced or adapted**.

**It inverts the strategy for the remaining 110 lessons.** The instruction implied by the 13-lesson
repair — *find a source, cite it, author the lesson from it* — is not available for 110 lessons.
What is available, for every one of them:

1. **Author original lesson material and cite the local PDFs as bibliography only.** Reproduce
   nothing verbatim. This is the default and it costs nothing but discipline.
2. **Rebuild the lesson on a permissive external source** where one exists (§2), which is now the
   preferred path for vocabulary and discourse work.
3. **Seek written, perpetual permission** from the BaixeLivros authors for the list-shaped lessons
   where (1) does not work.

**Point 1 has a hard limit that must be stated, not glossed.** For a lesson that *is* a list —
`les_b2_it_jargon_mastery` ("dicionário, all 250"), `les_b1_it_acronyms_deep` (Bônus 1, 40 terms),
`les_a1_false_cognates` (leia Ch2, 10 traps), `les_a2_travel_vocab_core` (viagens Dia 2, 20 items) —
"author it and cite it" does not work. A list of 250 jargon terms *is* the source; reproducing it and
citing the book is laundering, and those 14 list-shaped lessons need option 2 or 3, not option 1.

**Two of those list-shaped sources have already been partly replaced by this file**, which is the
pattern to extend:

- The 40 corporate acronyms from `Dicionario` Bônus 1 are superseded for teaching purposes by
  **S16** (Kubernetes glossary, CC-BY-4.0) + **S01** (Google word list, CC-BY-4.0) + the authored
  listening corpus, which already carries a BR-PT contrastive glossary in `listening-corpus.md`.
- The 10 false cognates from `leia` Ch2 are superseded by the **22 Tier A/B items** in
  `content-map.md` §11.2, which are original contrastive analysis, not a reproduction.

### 0.5.2 The corrective this forces in the specs

Every `Source` cell in the registry becomes a **pair**, and the second half is the one that
governs publication:

| Lesson | Concept source (where the idea came from) | Reuse basis (what we may do with it) |
|--------|------------------------------------------|--------------------------------------|
| `les_a1_false_cognates` | ~~`leia` Ch2 + IT A7~~ (histórico — reautoria clean-room de 2026-11-16) | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 5 (batch 5) — Fase C — original Tier A/B analysis replaces the source list |
| `les_b2_it_postmortem` | S02 (CC-BY-4.0) | `adapt_with_attribution` |
| `les_a1_present_simple` | ~~`apostila` §3~~ (histórico — reautoria clean-room de 2026-11-16) | ~~`cite_only`~~ → `authored_material` ✅ Onda 2 — Lote 4 (batch 4) — Fase B — grammar rules are unprotectable facts, and the *presentation* is now fully authored |

`cite_only` is the default and it is cheap. `adapt_with_attribution` is the exception and requires a
§7.1 attribution string. `adapt_requires_permission` is the third state, and it is where the 48
blocked lessons sit until option 3 is exercised.

---

## 1. LICENCE CLASSES AND WHAT EACH ONE COSTS US

| Class | SPDX | Can we adapt into lessons? | Obligation |
|-------|------|----------------------------|------------|
| **Public-domain dedication** | `CC0-1.0` | ✅ yes | attribution appreciated, not required |
| **Permissive** | `CC-BY-4.0`, `CC-BY-3.0`, `CC-BY-2.5` | ✅ yes | **attribution required** — author, title, licence, URL |
| **Copyleft** | `CC-BY-SA-4.0`, `CC-BY-SA-2.5` | ⚠️ yes, but **derivative course material must carry the same licence** | attribution + **share-alike on our output** |
| **Source-available, restricted** | `IETF TLP` (RFCs), `GFDL-1.3` | ❌ no | quotation only, with attribution |
| **Non-commercial / no-derivatives** | `CC-BY-NC-ND-4.0` | ❌ no | quotation only, and not in a paid course |
| **All rights reserved** | — | ❌ no | **nothing**. Reading is not licensing. |
| **Unverifiable** | — | ❌ no | treated as reserved until proven otherwise |

> **Share-alike is a real cost, not a footnote.** Two sources we want (`Scrum Guide 2020`,
> `CC-BY-SA-4.0`; all `MDN` documentation, `CC-BY-SA-2.5`) would force the **derived lesson material**
> into the same licence. For a paid course that is a genuine decision, not a formality. §7 records
> which lessons are affected so the choice can be made per lesson rather than by accident.

> **Unverifiable = reserved.** `OpenLearn`, `handbook.gitlab.com`, and the Microsoft style guide all
> returned usable content and no licence grant. They are excluded. "I could not find a licence" is
> not "there is no restriction" — it is the state in which you must assume there is one.

---

## 2. THE REGISTRY — accepted sources

18 sources, all fetched, all permissively licensed. Each card records what it **cannot** support,
because that is the field that prevents a citation from being stretched the way the 13 `IT A<n>`
citations were (§4.4.1).

### S01 · Google developer documentation style guide — **CC-BY-4.0**

```
url       https://developers.google.com/style
          (index) + /highlights /voice /person /sentence-structure /lists /procedures
          /text-formatting /word-list /capitalization /abbreviations /headings /tone
licence   CC-BY-4.0 (text) + Apache-2.0 (code). Verbatim footer:
          "Except as otherwise noted, the content of this page is licensed under the Creative
           Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0
           License. For details, see the Google Developers Site Policies."
anchor    /highlights#tone-and-content · /voice · /sentence-structure · /lists · /word-list
verbatim  "Be conversational and friendly without being frivolous."
          "Use second person: \"you\" rather than \"we.\""
          "Put conditions before instructions, not after."
          "In general, use active voice (in which the grammatical subject of the sentence is the
           person or thing performing the action) instead of passive voice (in which the
           grammatical subject of the sentence is the person or thing being acted upon), although
           there are exceptions. Make clear who's performing the action."
          "In passive voice, it's easy to neglect to indicate who or what is performing a
           particular action."
          "If you want to tell the reader to do something, try to mention the circumstance,
           conditions, or goal before you provide the instruction."
          "This guide contains guidelines, not rules. Depart from it when doing so improves your
           content."
          (Recommended / Not recommended pair) "To delete the entire document, click **Delete**."
          vs "Click **Delete** if you want to delete the entire document."
cannot    It is meta-commentary *about* writing — it cannot support a lesson on the content of an
support   incident report, ADR, RFC or KEP. No spoken English, no meetings, no email. Prescriptive
          "Do not / Don't" register that learners may over-generalise into their own writing.
teaches   The **Recommended / Not recommended** pairs are minimal-pair sentence pairs already — the
          single most lesson-ready artifact in this registry. Ideal for noticing + rewriting drills.
```

### S02 · Google Cloud Well-Architected — Reliability, "Conduct thorough postmortems" — **CC-BY-4.0**

```
url       https://docs.cloud.google.com/architecture/framework/reliability/conduct-postmortems
          https://docs.cloud.google.com/architecture/framework/operational-excellence/manage-incidents-and-problems
          (pt-BR machine translation exists: append ?hl=pt-br — verified lang="pt-BR-x-mtfrom-en")
licence   CC-BY-4.0. Verbatim footer:
          "Except as otherwise noted, the content of this page is licensed under the Creative
           Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0
           License."
verbatim  "A postmortem is a written record of an incident, its impact, the actions taken to
           mitigate or resolve the incident, the root causes, and the follow-up actions to prevent
           the incident from recurring. The goal of a postmortem is to learn from mistakes and not
           assign blame."
          "Effective postmortems focus on processes, tools, and technologies, and don't place
           blame on individuals or teams. The purpose of a postmortem analysis is to improve your
           technology and future, not to find who is guilty. Everyone makes mistakes."
          "Define postmortem criteria before an incident occurs so that everyone knows when a post
           mortem is necessary."
          "The value of a postmortem is proportional to the learning that occurs after the postmortem."
          "Clear roles and responsibilities are essential to ensure effective and coordinated
           response to incidents."
          "The runbook must outline the steps to be taken at each stage of the incident response
           process, including communication, triage, investigation, and resolution."
          workflow: "Create postmortem" / "Capture the facts" / "Identify and analyze the root
           causes" / "Plan for the future" / "Execute the plan"
cannot    Thinner than the SRE Book: no worked postmortem, no timeline artefact, no "what went well
support   / what went wrong" triad — the blameless framing is compressed to one paragraph. Cloud
          product vocabulary (Cloud SQL, GKE, Pub/Sub) must be stripped.
note      The source itself writes "post mortem" in one place and "postmortem" in another. A genuine
          error in the source, and a usable teaching point **if quoted with the inconsistency shown**.
```

### S03 · MADR — Markdown Architectural Decision Records, v4.0.0 — **MIT OR CC0-1.0**

```
url       https://adr.github.io/madr/
          template: https://raw.githubusercontent.com/adr/madr/4.0.0/template/adr-template.md
licence   Verbatim from the site: "This work is dual-licensed under MIT and CC0. You can choose
          between one of them if you use this work." / "SPDX-License-Identifier: MIT OR CC0-1.0"
          → we take the **CC0-1.0** option: no attribution obligation at all.
          (note: /madr/license/ is a 404; the licence text is in the page body at #license)
verbatim  status: "{proposed | rejected | accepted | deprecated | … | superseded by ADR-0123}"
          "consulted: {list everyone whose opinions are sought ...; and with whom there is a
           two-way communication}"
          "informed: {list everyone who is kept up-to-date on progress; and with whom there is a
           one-way communication}"
          "# {short title, representative of solved problem and found solution}"
          "Chosen option: \"{title of option 1}\", because {justification ... | which resolves
           force {force} | …}"
          "* Good, because {positive consequence ...}"
          "* Neutral, because {argument c}"
          sections: Context and Problem Statement → Decision Drivers → Considered Options →
           Decision Outcome → Consequences → Confirmation → Pros and Cons
cannot    A **skeleton, not prose** — nearly every line is a placeholder, so the linguistic input is
support   meta-instructional ("Describe…", "list everyone…"), not running text. Teaches no vocabulary
          about trade-offs, cost, migration or rollback. Must be paired with S04/S05.
```

### S04 · adr.github.io — the discourse of ADRs — **MIT**

```
url       https://adr.github.io/
licence   MIT (repo github/adr/adr.github.io, LICENSE; GitHub API spdx_id "MIT")
verbatim  "An Architectural Decision (AD) is a justified design choice that addresses a functional
           or non-functional requirement that is architecturally significant."
          "An Architectural Decision Record (ADR) captures a single AD and its rationale; Put it
           simply, ADR can help you understand the reasons for a chosen architectural decision,
           along with its trade-offs and consequences."
          "The collection of ADRs created and maintained in a project constitute its decision log."
cannot    Extremely thin on its own — one substantive paragraph plus links. "decision log" and
support   "Architectural Significance Requirement" are jargon a B1 learner will not acquire from one
          occurrence. Pairs with S03.
```

### S05 · Google Cloud Architecture Center — Architecture decision records — **CC-BY-4.0**

```
url       https://docs.cloud.google.com/architecture/architecture-decision-records
licence   CC-BY-4.0 (same footer as S02)
verbatim  "To help explain why your infrastructure or application teams make certain design choices,
           you can use architecture decision records (ADRs)."
          "An ADR captures the key options available, the main requirements that drive a decision,
           and the design decisions themselves."
          "When there are two or more engineering options and you want to document your thoughts and
           reasons behind the selection."
          "The primary readers are members of the team that work on the technology covered by the ADR."
          "An ADR helps new contributors understand the background of the engineering choices that
           were made. An ADR also makes it easier to plan future changes."
          outline: "Authors and the team" / "Context and problem you want to solve" / "Functional
           and non-functional requirements you want to address" / "Overview of the key options" /
           "Your decision and reasons behind the accepted choice"
cannot    A SHORT page — body ≈ 600 words, most of the HTML is nav. Explicit outline and good
support   when/why sentences, but no worked example. GKE / Pub/Sub / Cloud Tasks vocabulary must be
          cut. Carries "Last reviewed 2024-08-16" — content frozen, no rot.
```

### S06 · Google eng-practices — Small CLs — **CC-BY-3.0**

```
url       https://google.github.io/eng-practices/review/developer/small-cls.html
licence   CC-BY-3.0 Unported, from
          https://raw.githubusercontent.com/google/eng-practices/master/LICENSE
          (the rendered page footer does NOT print the licence — cite the repo LICENSE)
anchors   #why-write-small-cls #what-is-small #when-are-large-cls-okay
          #splitting-cls #separate-out-refactorings #dont-break-the-build
verbatim  "In general, the right size for a CL is **one self-contained change**."
          "In general it's better to err on the side of writing CLs that are too small vs. CLs that
           are too large."
          "There are no hard and fast rules about how large is \"too large.\" 100 lines is usually a
           reasonable size for a CL, and 1000 lines is usually too large, but it's up to the
           judgment of your reviewer."
          "Note that **reviewers have discretion to reject your change outright for the sole reason
           of it being too large.**"
          "It's usually best to do refactorings in a separate CL from feature changes or bug fixes."
          "CLs should include related test code."
cannot    Vocabulary is Google's "CL" (change list), **not** "PR" — needs an explicit glossary
support   bridge or learners fossilise the wrong term for most of the world's other tooling. No
          spoken language. No Brazilian workplace scenario.
```

### S07 · Google eng-practices — The Standard of Code Review — **CC-BY-3.0**

```
url       https://google.github.io/eng-practices/review/reviewer/standard.html
licence   CC-BY-3.0 (same LICENSE)
anchors   #the-standard-of-code-review #mentoring #principles #resolving-conflicts
verbatim  "**In general, reviewers should favor approving a CL once it is in a state where it
           definitely improves the overall code health of the system being worked on, even if the
           CL isn't perfect.**"
          "A key point here is that there is no such thing as \"perfect\" code—there is only
           *better* code."
          "Technical facts and data overrule opinions and personal preferences."
          "Reviewers should *always* feel free to leave comments expressing that something could
           be better, but if it's not very important, prefix it with something like \"Nit: \" to let
           the author know that it's just a point of polish that they could choose to ignore."
          "Code review can have an important function of teaching developers something new about a
           language, a framework, or general software design principles."
          "**Don't let a CL sit around because the author and the reviewer can't come to an
           agreement.**"
cannot    The #mentoring section is **4 sentences** — enough to seed one exercise, not a mentoring
support   unit. Dense nominal style ("code health", "senior principle") is above A2/B1 and must be
          rewritten, not copied, for low levels.
```

### S08 · GitHub Docs — About pull requests — **CC-BY-4.0**

```
url       https://docs.github.com/en/pull-requests/get-started/about-pull-requests
licence   CC-BY-4.0, from https://raw.githubusercontent.com/github/docs/main/LICENSE
          (the file is `LICENSE`, no extension; `LICENSE.md` is a 404)
verbatim  "Pull requests turn a set of code changes into a conversation."
          "Catch bugs and problems early, before they reach the main branch."
          "Discuss and improve changes together, with feedback tied to specific lines."
          "Keep a clear, reviewable history of what changed and why."
cannot    Product documentation, not pedagogy — no register contrast, no error correction, no task
support   design. Product UI will change; the durable value is the four lines only. Bridges the
          "CL" vs "PR" gap left by S06/S07.
```

### S09 · web.dev — How to file a good browser bug — **CC-BY-4.0**

```
url       https://web.dev/articles/how-to-file-a-good-bug
          (https://developers.google.com/web/feedback/file-a-bug 301-redirects here)
licence   CC-BY-4.0 (prose) + Apache-2.0 (code). Verbatim footer:
          "Except as otherwise noted, the content of this page is licensed under the Creative
           Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0
           License."
          last updated 2020-06-15. Has an official pt-BR translation at ?hl=pt-br.
anchors   "Verify it is a bug" → "What's the correct behavior?" / "Does it work in a different
          browser?" / "Did it break in a recent release?" / "Are others seeing the same problem?"
          · "Report the bug" → "Create a minimized test case" · "File your issue"
verbatim  "Bugs that make fast progress tend to be quick to reproduce with a clear expected behavior."
          "The first step is to figure out what the \"correct\" behavior should be."
          "A minimal code sample is the number one thing you can do to increase the odds of your
           bug getting fixed."
          "What is the expected result?"  /  "What is the actual result?"
          "Some bugs are reproducible only on certain operating systems ... Be sure to include the
           details of any test environments you used."
cannot    Front-end/browser only. No server, database, network or infra debugging. No severity or
support   priority vocabulary. No spoken register. Its own link to MDN's "Bug report writing
          guidelines" is a **dead 404 link** — see §4.
```

### S10 · Google eng-practices — Writing good CL descriptions — **CC-BY-3.0**

```
url       https://google.github.io/eng-practices/review/developer/cl-descriptions.html
licence   CC-BY-3.0 (repo LICENSE)
anchors   "First Line" / "Body is Informative" / "Bad CL Descriptions" / "Good CL Descriptions"
verbatim  "A CL description is a public record of change, and it is important that it communicates:"
          "What change is being made? This should summarize the major changes such that readers have
           a sense of what is being changed without needing to read the entire CL."
          "Why are these changes being made? What contexts did you have as an author when making
           this change? Were there decisions you made that aren't reflected in the source code?"
          "Complete sentence, written as though it was an order."
          "By tradition, the first line of a CL description is a complete sentence, written as
           though it were an order (an imperative sentence)."
          "\"Fix bug\" is an inadequate CL description. What bug? What did you do to fix it?"
          "If there are any shortcomings to the approach, they should be mentioned."
          (bad examples) "\"Fix build.\"  \"Add patch.\"  \"Moving code from A to B.\"  \"Phase 1.\""
cannot    About change-lists, not incident bugs. "CL" does not transfer to Jira/Linear/Azure DevOps.
support   Teaches the imperative first line but gives no layering/diagnostic vocabulary and no spoken
          register.
teaches   The **bad-description list is a ready-made diagnostic drill** for the vague-writing error
          class in `content-map.md` §9.1.
```

### S11 · Chromium — Bug Life Cycle & Reporting Guidelines — **CC-BY-2.5**

```
url       https://www.chromium.org/for-testers/bug-reporting-guidelines/
licence   CC-BY-2.5 (content) + BSD-3-Clause (examples). Verbatim footer:
          "Except as otherwise noted, the content of this page is licensed under a Creative
           Commons Attribution 2.5 license, and examples are licensed under the BSD License."
verbatim  "Make sure the bug is verified with the latest Chromium (or Chrome canary) build."
          "Provide a high-level problem description."
          "Mention detailed steps to replicate the issue."
          "Include the expected behavior."
          "If a bug can be reduced to a simplified test, then create a simplified test and attach it
           to the bug."
          "When a bug is first logged, it is given **New** status."
          "A status of **Fixed** means that the bug has been fixed, and **Verified** means that the
           fix has been tested and confirmed."
cannot    No anatomy of an error message, no stack-trace language, no spoken English. Status names
support   are Chromium-internal. Good as a checklist skeleton, nothing more.
```

### S12 · Chromium — Triage Best Practices — **CC-BY-2.5**

```
url       https://www.chromium.org/for-testers/bug-reporting-guidelines/triage-best-practices/
licence   CC-BY-2.5 (confirmed in page HTML: creativecommons.org/licenses/by/2.5/)
verbatim  "A process (often taking the form of a regular meeting) for _making_ decisions about the
           need, priority, timing, and assignment of work _requests_."
          "Do we want to do this work?"
          "How important is it to us (Priority) and when do we want it done (Schedule/Milestone)?"
          "Who should own it?"
          "Be definitive. If the work isn't something that we intend on doing (or isn't something
           we're able to confirm is a real issue), then close the issue out and provide honest and
           _courteous_ feedback."
          "People can only do a finite amount of work, adding more work to someone's pile won't get
           it done faster."
          "The test: \"Would someone notice (in a bad way) if this issue were present in the
           release?\""
cannot    Not about writing reports. P0–P3 scheme is Chromium-internal. **No technical content at
support   all** — only meeting, priority and ownership language. This is the closest thing in the
          registry to a spoken triage register, and it is still written prose.
```

### S13 · MDN — JavaScript debugging and error handling — **CC-BY-SA-2.5** (share-alike)

```
url       https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Debugging_JavaScript
licence   CC-BY-SA-2.5 (prose); the `throw new Error(...)` sample is CC0
verbatim  "You should validate your code first before trying to track down specific errors."
          "The exact wording is browser-dependent, but it will be something like: \"Uncaught
           TypeError: heroes is not iterable\", and the referenced line number is 25."
          "So the code falls over as soon as we try to use jsonObj"
          "These lines are referred to as a call stack, and can be really useful when trying to
           track down the source of an error involving several different locations in your code."
          "The main feature of such tools is the ability to add breakpoints to code — these are
           points where the execution of the code stops, and at that point you can examine the
           environment in its current state and see what is going on."
          "It's better to get our function to return a custom error when it doesn't receive the
           correct data."
cannot    JavaScript/front-end only — no services, logs, metrics or distributed tracing. Assumes
support   the learner can already read code, so it is not a source of *describing* failures for a
          non-programmer. **Share-alike obligation** — see §1 and §7.
```

### S14 · MDN — JavaScript error reference — **CC-BY-SA-2.5** (share-alike)

```
url       https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors
licence   CC-BY-SA-2.5, the uniform MDN content licence (see §3.2)
verbatim  "Each error is an object based upon the `Error` object, and has a `name` and a `message`."
          "Together, these two properties provide a starting point toward understanding and
           resolving the error."
          "Error: Permission denied to access property \"x\""
          "InternalError: too much recursion"
          "RangeError: invalid array length"
          "ReferenceError: \"x\" is not defined"
          "SyntaxError: \"x\" is a reserved identifier"
cannot    A catalogue, not a method. Only JS *runtime* errors — nothing about HTTP status codes, DB
support   errors, timeouts or partial failures. Excellent as a name/message pattern drill, nothing
          more. **Share-alike obligation.**
```

### S15 · MDN — How the web works — **CC-BY-SA-2.5** (share-alike)

```
url       https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works
licence   CC-BY-SA-2.5, the uniform MDN content licence (see §3.2)
verbatim  "Computers connected to the internet are called **clients** and **servers**."
          "A **header**, which includes details such as the server and client IP address, the packet
           number, the total number of packets in the transmission, and details of the protocols used."
          "A **payload**, which contains the actual data sent in the packet."
          "The server can't process the request. This usually happens when the request isn't in a
           format the server understands, or has errors in it."  [400]
          "The server will not give the client access to the requested resource."  [403]
          "The request cannot be handled due to a problem with the server. This is common when
           servers are offline for maintenance, and it's expected to be temporary."  [503]
cannot    Internet/HTTP layer only. No coupling, no service boundaries, no redundancy, no
support   scaling/sharding, no SLOs. The "road and shop" analogy is A2-level framing — useful as a
          gateway, not as architecture. **Share-alike obligation.**
```

### S16 · Kubernetes documentation — Cluster Architecture & Glossary — **CC-BY-4.0**

```
url       https://kubernetes.io/docs/concepts/architecture/
          https://kubernetes.io/docs/reference/glossary/
licence   CC-BY-4.0. Verbatim footer on every page:
          "© 2026 The Kubernetes Authors | Documentation Distributed under CC BY 4.0"
verbatim  "A Kubernetes cluster consists of a control plane plus a set of worker machines, called
           nodes, that run containerized applications."
          "The control plane manages the worker nodes and the Pods in the cluster."
          "kube-apiserver is designed to scale horizontally—that is, it scales by deploying more
           instances."
          "Control plane component that watches for newly created Pods with no assigned node, and
           selects a node for them to run on."
          "In Kubernetes, _affinity_ is a set of rules that give hints to the scheduler about where
           to place pods."
          "Node controller: Responsible for noticing and responding when nodes go down."
cannot    K8s object model dominates (Pod, Deployment, StatefulSet…) — too much infrastructure
support   vocabulary for a non-architect. No latency/throughput numbers, no SLO practice, no
          vendor-neutral prose. Use selectively: control plane / worker / fault tolerance /
          horizontal scaling only. The glossary UI strips sentence-final punctuation — do not
          reproduce its rendering.
```

### S17 · Kubernetes Enhancement Proposals (KEPs) — **Apache-2.0**

```
url       https://github.com/kubernetes/enhancements/blob/master/keps/README.md
          .../keps/NNNN-kep-template/README.md
          .../keps/sig-architecture/0000-kep-process/README.md
          ⚠️ https://kubernetes.io/docs/contribute/enhancement-proposal/ is **404** — do not cite.
licence   Apache-2.0 (GitHub API spdx_id "Apache-2.0"). Permissive with attribution + NOTICE.
verbatim  "A Kubernetes Enhancement Proposal (KEP) is a way to propose, communicate and coordinate
           on new efforts for the Kubernetes project."
          "A standardized development process for Kubernetes is proposed, in order to: - provide a
           common structure for proposing changes to Kubernetes - ensure that the motivation for a
           change is clear"
          "Avoid getting hung up on specific details and instead aim to get the goals of the KEP
           clarified and merged quickly."
          "Just because a KEP is merged does not mean it is complete or approved. Any KEP marked as
           `provisional` is a working document and subject to change."
          "What is out of scope for this KEP? Listing non-goals helps to focus discussion and make
           progress."
          "What are the risks of this proposal, and how do we mitigate? Think broadly."
          metadata enum: "Must be one of `provisional`, `implementable`, `implemented`, `deferred`,
           `rejected`, `withdrawn`, or `replaced`."
          template sections: Summary / Motivation / Goals / Non-Goals / Proposal / User Stories /
           Risks and Mitigations / Design Details / Test Plan / Graduation Criteria / Drawbacks /
           Alternatives
cannot    K8s vocabulary everywhere (SIG, graduation, feature gate, alpha/beta/GA, version skew).
support   The template file is ~1 000 lines, mostly HTML comments — the *readable* prose is a small
          fraction, so it is thinner as language input than it looks.
must-not  **Do not conflate KEP with ADR.** A KEP is forward-looking ("what we will build"); an ADR
          is backward-looking ("what we decided and why"). This conflation is the single most likely
          authoring error for `les_b2_it_architecture_decisions` vs `les_b2_it_rfc_writing`.
```

### S18 · opensource.guide (GitHub) — CC-BY-4.0

```
url       https://opensource.guide/building-community/
          https://opensource.guide/how-to-contribute/
          https://opensource.guide/finding-users/
licence   CC-BY-4.0 (https://opensource.guide/notices/ — "CC licensed content")
verbatim  (building-community) "If you have a contribution you disagree with, thank them for their
           idea and explain why it doesn't fit into the scope of the project, linking to relevant
           documentation if you have it."
          "Resist fixing easy (non-critical) bugs. Instead, use them as opportunities to recruit new
           contributors, or mentor someone who'd like to contribute."
          "If you notice multiple users running into the same problem, document the answers in the
           README."
          "When someone new lands on your project, thank them for their interest!"
          (finding-users) "If you speak at a meetup or event, make sure that your contact information
           is included in your bio or slides."
          "If you're new to public speaking, start by finding a local meetup that's related to the
           language or ecosystem of your project."
          "If you've never spoken at an event before, it's perfectly normal to feel nervous!"
          "As you write your talk, focus on what your audience will find interesting and get value
           out of. Keep your language friendly and approachable."
          "Before you submit your talk, research the conference to tailor your talk for attendees."
cannot    Framed around OSS projects and *maintainer-to-stranger* relationships, not
support   manager-to-new-hire onboarding. No HR lifecycle, no 30-60-90, no buddy/shadowing
          vocabulary. The politeness formulas are the real teaching gold and transfer directly to
          code review + onboarding.
teaches   The disagreement formula in `building-community` is the **written-register twin of the
          spoken `I see X, but` frame** in `listening-corpus.md` `dlg_b1_02_disagree`. Same skill,
          written and spoken — pair them.
```

### S19 · The 2020 Scrum Guide™ — **CC-BY-SA-4.0** (share-alike)

```
url       https://scrumguides.org/scrum-guide.html
licence   CC-BY-SA-4.0. Verbatim footer:
          "© 2020 Ken Schwaber and Jeff Sutherland This publication is offered for license under
           the Attribution Share-Alike license of Creative Commons"
          ⚠️ The separate line "© 2025 ScrumGuides.org. All rights reserved." governs site chrome,
          not the Guide text. **Share-alike on our derived lesson material is a real obligation.**
verbatim  "The Daily Scrum is a 15-minute event for the Developers of the Scrum Team."
          "The purpose of the Daily Scrum is to inspect progress toward the Sprint Goal and adapt
           the Sprint Backlog as necessary, adjusting the upcoming planned work."
          "Daily Scrums improve communications, identify impediments, promote quick decision-making,
           and consequently eliminate the need for other meetings."
          "Transparency enables inspection. Inspection without transparency is misleading and
           wasteful."
          "Inspection enables adaptation. Inspection without adaptation is considered pointless."
          "The Sprint Review is a working session and the Scrum Team should avoid limiting it to a
           presentation."
cannot    **No spoken English at all** — normative prose, so it cannot supply "yesterday / today /
support   blocked" or any turn-taking language. Framework-locked vocabulary (Sprint, Product Owner,
          Definition of Done) does not transfer to non-Scrum teams. **Scrum 2020 deleted the
          three-question Daily Scrum format**, so it cannot teach that format. One page — cannot
          build a unit alone.
```

---

## 3. REJECTED — and why, which is the useful part

| Source | Why it was the obvious choice | Verdict | Evidence |
|--------|------------------------------|---------|----------|
| **Google SRE Book** (Ch. 14/15, App. C/D) | the canonical incident/postmortem register; richest source found | ❌ **CC-BY-NC-ND-4.0** | footer: "Licensed under CC BY-NC-ND 4.0" — NC blocks a paid course, ND blocks adaptation |
| **Google SRE Workbook** | postmortem templates, same corpus | ❌ **CC-BY-NC-ND-4.0** | footer: "Copyright © 2018 Google, Inc. ... CC BY-NC-ND 4.0" |
| **AWS Well-Architected Framework** | the other canonical architecture source | ❌ **all rights reserved** | no CC licence on the page; `aws.amazon.com/legal/` footer: "© 2026, Amazon Web Services, Inc. or its affiliates. All rights reserved." |
| **RFC 2119 / 8174 / 9110** | *the* source for normative technical language; genuinely valuable | ⚠️ **IETF TLP — quote only** | RFC 8174 in-document notice: "Copyright (c) 2017 IETF Trust ... All rights reserved. This document is subject to BCP 78 and the IETF Trust's Legal Provisions". Redistribution restricted; derivatives restricted. **Worth a legal opinion** — it is the best normative-language source and the only weak link in §1 |
| **Nygard, "Documenting Architecture Decisions"** (Cognitect) | the founding ADR essay | ❌ all rights reserved | only copyright statement on the page: "Copyright 2025, Cognitect, a Nu Holdings, Ltd. company". No CC, no SPDX. Also archaic (pre-MADR, predates ADRs-as-code) |
| **Microsoft Writing Style Guide** | the other canonical tech-writing style guide | ❌ all rights reserved | page closes "© 2024 Microsoft. All rights reserved."; zero CC/Apache hits in HTML |
| **Diátaxis** (Procida) | the documentation-IA framework everyone cites | ❌ **no licence** | footer is "Copyright © Daniele Procida"; repo `plain-guides/diataxis` has **no LICENSE file**; sold on Leanpub |
| **speaking.io** (Holman) | *the* engineering-talks guide | ❌ no licence | no licence statement on the site; repo LICENSE is 404 on both `master` and `main` |
| **Lumen / OpenSUNY "Creating an Informative Presentation"** | university OER, expected CC-BY | ❌ **CC-BY-NC-ND-4.0** | page footer states verbatim: "**License**: *CC BY-NC-ND: Attribution-NonCommercial-NoDerivatives*" |
| **OpenLearn "Effective communication in the workplace"** | Open University OER | ❌ **unverifiable** | page shows a "Copyrighted" icon, not a CC one; the terms page is Cloudflare-403 |
| **GitLab Handbook — meetings** | real remote-team meeting norms | ❌ unverifiable | no CC licence in HTML; repo LICENSE is MIT-scoped to "the GitLab Software"; CONTRIBUTING reserves rights via DCO |
| **Google re:Work** | the canonical onboarding/manager material | ❌ not CC | governed by Google Terms of Service |
| **GDB manual** | debugging reference | ❌ GFDL-1.3 | copyleft-for-manuals, not permissive; short quotation only |
| **Atlassian Team Playbook — daily standup** | the obvious stand-up source | ❌ **404** | `/plays/daily-standup`, `/daily`, `/stand-up`, `/standups` all 404; only the `/plays` index resolves |
| **Azure Architecture Center** | the strongest architecture-styles prose found | ⚠️ **attribute-only** | repo `MicrosoftDocs/architecture-center` LICENSE = CC-BY-4.0, **but** `learn.microsoft.com` ToU: "Services are for your personal and non-commercial use. You may not modify, copy, distribute, ... without prior written consent". Also unavoidably Azure-branded in the prose. **Not used.** |

### 3.0 The MDN licence is uniform, and there is no page to move

S13, S14 and S15 are all **CC-BY-SA-2.5**, and this is not a per-page accident that a careful
author could route around. MDN's contribution policy fixes CC-BY-SA-2.5 as the licence for content
and explicitly **prohibits creating a page under a different licence** — so there is no "the
JavaScript pages are CC0" exception to find. Code snippets are separately CC0 (contributions on or
after 2010-08-20) or MIT (older), which is the one asymmetry, and it does not help because the
*prose* is what we want.

The practical consequence is in §7.2: any MDN-sourced lesson text we adapt inherits share-alike.
The practical workaround is also in §7.2: **cite, don't adapt.** We use MDN for the error-reference
vocabulary and the client/server framing, both of which are short factual lists that are cheaper to
re-author and cite than to adapt under a copyleft licence.

### 3.1 Two structural gaps no permitted source can fill

Both are stated rather than papered over, and both force authoring decisions:

1. **No permissively-licensed source gives a spoken, non-specialist-facing IT register.** Every
   accepted source in §2 is **written documentation register**. The closest written models are S12
   (triage/priority meeting language), S05 (constraint and trade-off prose) and S01 (word-choice
   discipline). Spoken stand-ups, spoken incident reports and spoken design reviews **must be
   authored**, and labelled `authored` — which is exactly what `listening-corpus.md` already is. The
   sources above tell us the *words*; they do not give us the *turn-taking*.

2. **No permissively-licensed source gives a technical-presentations guide.** S18 is the best
   available and it is a *promotion* guide — roughly one page, no slide design, no talk structure, no
   delivery, no Q&A handling. `les_b1_it_presentations` therefore has **no adequate source** and its
   disposition is a decision, not a citation (§6).

---

## 4. DEAD, MOVED, AND REDIRECTED URLs

Recorded so that no one re-spends a fetch on them, and so that no citation in a pack points at a 404.
Every one of these was tested on 2026-09-30.

| URL | Status | Correct target |
|-----|--------|----------------|
| `kubernetes.io/docs/contribute/enhancement-proposal/` | **404** | moved to `github.com/kubernetes/enhancements` (S17) |
| `developers.google.com/web/feedback/file-a-bug` | **301** | → `web.dev/articles/how-to-file-a-good-bug` (S09) |
| `developers.google.com/style/word-choice` | **404** | `/style/word-list` |
| `developers.google.com/style/grammar` | **404** | `/style/sentence-structure` |
| `developers.google.com/style/code-examples` | **404** | `/style/code-samples` |
| `google.github.io/eng-practices/review/developer/small_cl.html` | **404** | `small-cls.html` (S06) |
| `google.github.io/eng-practices/testing/` | **404** | eng-practices has **no Testing Code chapter**; only `/review/` exists |
| `developer.mozilla.org/.../Core/Debugging` | **404** | `.../Core/Scripting/Debugging_JavaScript` (S13) |
| `developer.mozilla.org/.../Web/Console` | **404** | `.../Web/API/console` |
| `developer.mozilla.org/.../Mozilla/QA/Bug_report_writing_guidelines` | **404** | no equivalent — **this is a dead link inside S09, a CC-BY-4.0 source** |
| `web.dev/glossary` · `/articles/glossary` · `/collections/glossary` | **404** | web.dev has no glossary |
| `developer.chrome.com/docs/glossary` | **404** | — |
| `docs.github.com/.../about-code-reviews` (old path) | **404** | `.../get-started/about-pull-requests` (S08) |
| `kubernetes.io/docs/contribute/documentation/style-guide/` | **404** | `kubernetes.io/docs/contribute/style-guide/` |
| `sourceware.org/gdb/current/onlinedocs/html/` | **404** | `.../onlinedocs/gdb.html/index.html` |
| `adr.github.io/madr/license/` | **404** | licence text is in the page body at `adr.github.io/madr/#license` |
| `raw.githubusercontent.com/github/docs/main/LICENSE.md` | **404** | the file is `LICENSE`, no extension |
| `aws.amazon.com/wellarchitected/.../framework/welcome.pdf` | **404** | rejected on licence anyway |
| **RFC 7231** (HTTP/1.1 Semantics) | **obsoleted** | superseded by **RFC 9110** (2022). If cited anywhere, cite as historical |

**The dead MDN link inside S09 deserves a note.** A CC-BY-4.0 source points at an MDN page that no
longer exists. That is a reminder that licence clearance is not the same as link durability, and that
a pack citing S09 must not transitively cite the dead anchor.

---

## 5. THE 13 DEFERRED LESSONS, REPOINTED (e lições reautoradas correlatas)

Historicamente, cada lição abaixo moveu de `deferred_no_source` para um sourcing externo. A coluna **Coverage** preserva a avaliação honesta original; a coluna **Estado atual (2026-11-16)** reflete o `curriculum-graph-spec.md` §4.3/§4.4.5 após os Lotes 1 e 2 e as Onda 2 — Lote 2 (batch 2), Lote 3 (batch 3) — Fase A, Lote 4 (batch 4) — Fase B e Lote 5 (batch 5) — Fase C.

| # | Lesson | Primary source(s) | Coverage (original) | Estado atual (2026-11-16) | Authoring consequence / nota |
|---|--------|-------------------|---------------------|---------------------------|-----------------------------|
| 1 | `les_a2_it_terms_basics` | S18, S16 | **adequate** | `sourced_external` | glossary + word-list supply the terms. ⚠️ **Do not teach from `content-map.md` §11.1** — use §11.2 para glosses BR-PT. |
| 2 | `les_a2_it_meeting_standup` | S19, S12, S16 | **thin — needs authored spoken register** | `reauthored_authored_material` (Lote 2 Onda 2) | Reautorado em clean-room como 100% original; fontes externas ficam apenas como contexto histórico/bibliográfico. |
| 3 | `les_a2_it_incidents` | S02, S15 | **adequate** | `sourced_external` | S02 para o enquadramento; S15 para vocabulário 4xx/5xx. |
| 4 | `les_b1_it_architecture_vocab` | S16, S05, S01 | **adequate** | `reauthored_authored_material` (Lote 1) | Reautorado em clean-room como 100% original. |
| 5 | `les_b1_it_debugging` | S09, S13, S14, S11 | **strong** | `sourced_external` | expected-vs-actual, call stack, `name`/`message`, ciclo de status. |
| 6 | `les_b1_it_code_review` | S07, S06, S08, S10, S18 | **strong** | `reauthored_authored_material` (Lote 1) | Reautorado em clean-room como 100% original. |
| 7 | `les_b1_it_presentations` | S18 only | ❌ **NO ADEQUATE SOURCE** | `reauthored_authored_material` (Lote 1) | Lacuna original resolvida por autoria clean-room (lição criada/desbloqueada). |
| 8 | `les_b1_it_write_docs` | S01, S10, S16 | **adequate** | `sourced_external` | voz ativa, instruções, registro documental. |
| 9 | `les_b2_it_mentoring` | S18, S07 | **thin** | `reauthored_authored_material` (Lote 1) | Reautorado em clean-room como 100% original. |
| 10 | `les_b2_it_architecture_decisions` | S03, S04, S05 | **strong** | `sourced_external` | template ADR, definição, quando/por quê. |
| 11 | `les_b2_it_incident_postmortem` | S02 | **adequate, and the licence win** | `sourced_external` | enquadramento blameless em fonte permissiva. |
| 12 | `les_b2_it_rfc_writing` | S17, S01, ⚠️RFC 2119 | **partial** | `reauthored_authored_material` (Lote 1) | Reautorado em clean-room; sublição normativa IETF permanece ponto de atenção legal se voltar a depender da fonte. |
| 13 | `les_b1_project_case_study` | S01, S05, S10 | **adequate** | `sourced_external` | metade escrita adequadamente suportada. |

**Lições reautoradas adicionadas no Lote 2 Onda 2 (fora do conjunto original dos 13):**

| # | Lesson | Primary source(s) | Coverage | Estado atual (2026-11-16) | Nota |
|---|--------|-------------------|----------|---------------------------|------|
| 14 | `les_a1_greetings` | — (clean-room) | n/a | `reauthored_authored_material` (Lote 2 Onda 2) | Antes `cite_only` (bibliografia local restrita); reautoria integral. |
| 15 | `les_a1_intro_dialogue` | — (clean-room) | n/a | `reauthored_authored_material` (Lote 2 Onda 2) | Antes `cite_only`; reautoria integral. |
| 16 | `les_a1_daily_basics` | — (clean-room) | n/a | `reauthored_authored_material` (Lote 2 Onda 2) | Antes `cite_only`; reautoria integral. |
| 17 | `les_a1_pronunciation_intro` | — (clean-room) | n/a | `reauthored_authored_material` (Lote 2 Onda 2) | Antes `cite_only`; reautoria integral. |

**Lições reautoradas adicionadas na Onda 2 — Lote 2 (batch 2) (fora do conjunto original dos 13):**

| # | Lesson | Primary source(s) | Coverage | Estado atual (2026-11-16) | Nota |
|---|--------|-------------------|----------|---------------------------|------|
| 18 | `les_a1_alphabet_sounds` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 2 (batch 2)) | Antes `cite_only` (bibliografia local restrita); reautoria integral. |
| 19 | `les_a1_en_us_en_gb` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 2 (batch 2)) | Antes `cite_only`; reautoria integral. |
| 20 | `les_a1_to_be_forms` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 2 (batch 2)) | Antes `cite_only`; reautoria integral. |
| 21 | `les_a1_pronouns_subject_object` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 2 (batch 2)) | Antes `cite_only`; reautoria integral. |
| 22 | `les_a1_pronouns_possessive` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 2 (batch 2)) | Antes `cite_only`; reautoria integral. |

**Lições reautoradas adicionadas na Onda 2 — Lote 3 (batch 3) — Fase A (fora do conjunto original dos 13):**

| # | Lesson | Primary source(s) | Coverage | Estado atual (2026-11-16) | Nota |
|---|--------|-------------------|----------|---------------------------|------|
| 23 | `les_a1_pronouns_demonstrative` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 3 (batch 3) — Fase A) | Antes `cite_only`; reautoria integral. |
| 24 | `les_a1_wh_questions` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 3 (batch 3) — Fase A) | Antes `cite_only`; reautoria integral. |
| 25 | `les_a1_numbers_colors` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 3 (batch 3) — Fase A) | Antes `cite_only`; reautoria integral. |
| 26 | `les_a1_days_months` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 3 (batch 3) — Fase A) | Antes `cite_only`; reautoria integral. |
| 27 | `les_a1_time_dates` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 3 (batch 3) — Fase A) | Antes `cite_only`; reautoria integral. |

**Lições reautoradas adicionadas na Onda 2 — Lote 4 (batch 4) — Fase B (fora do conjunto original dos 13):**

| # | Lesson | Primary source(s) | Coverage | Estado atual (2026-11-16) | Nota |
|---|--------|-------------------|----------|---------------------------|------|
| 28 | `les_a1_food` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 4 (batch 4) — Fase B) | Antes `cite_only` (apostila 5.4 + basico 1L3); reautoria integral. |
| 29 | `les_a1_occupations` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 4 (batch 4) — Fase B) | Antes `cite_only` (apostila 5.5); reautoria integral. |
| 30 | `les_a1_regular_verbs_past` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 4 (batch 4) — Fase B) | Antes `cite_only` (apostila 3.2.1); reautoria integral. |
| 31 | `les_a1_present_simple` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 4 (batch 4) — Fase B) | Antes `cite_only` (basico 2L2); reautoria integral. |
| 32 | `les_a1_present_simple_questions` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 4 (batch 4) — Fase B) | Antes `cite_only` (basico 3ª); reautoria integral. |

**Lições reautoradas adicionadas na Onda 2 — Lote 5 (batch 5) — Fase C (fora do conjunto original dos 13):**

| # | Lesson | Primary source(s) | Coverage | Estado atual (2026-11-16) | Nota |
|---|--------|-------------------|----------|---------------------------|------|
| 33 | `les_a1_have_has` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 5 (batch 5) — Fase C) | Antes `cite_only` (IT A3); reautoria integral. |
| 34 | `les_a1_there_is_are` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 5 (batch 5) — Fase C) | Antes `cite_only` (IT A6); reautoria integral. |
| 35 | `les_a1_reading_skimming` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 5 (batch 5) — Fase C) | Antes `cite_only` (leia Ch2 + IT A2); reautoria integral. |
| 36 | `les_a1_false_cognates` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 5 (batch 5) — Fase C) | Antes `cite_only` (leia Ch2 + IT A7); reautoria integral — a lista de falsos cognatos foi reconstruída como análise contrastiva original. |
| 37 | `les_a2_phone_calls` | — (clean-room) | n/a | `reauthored_authored_material` (Onda 2 — Lote 5 (batch 5) — Fase C) | Antes `cite_only` (frases Ch6); reautoria integral. |

**Resumo (estado atual):** 7 lições permanecem `sourced_external`, 30 estão `reauthored_authored_material` (5 Lote 1 + 5 Lote 2 Onda 2 + 5 Onda 2 — Lote 2 (batch 2) + 5 Onda 2 — Lote 3 (batch 3) — Fase A + 5 Onda 2 — Lote 4 (batch 4) — Fase B + 5 Onda 2 — Lote 5 (batch 5) — Fase C), 0 `sourced_external_thin`, 0 `blocked_no_adequate_source`. O conjunto documentado aqui corresponde exatamente aos nós marcados como externamente relacionados/reautorados no `curriculum-graph-spec.md` §4.3.

### 5.1 The vocabulary debt this repays

| Term (0 hits in all 7 local sources) | Now sourced by | Usable teaching material |
|----------------------------------------|----------------|-------------------------|
| `architecture` | S16, S05 | 2 sources, clear register |
| `code review` | S06, S07, S08, S10, S18 | 5 sources — the best-covered topic |
| `incident` | S02, S15 | adequate |
| `RFC` | S17 + ⚠️IETF | partial — see #12 |
| `stand-up` | S19 (normative only) | **no spoken register** |
| `mentoring` | S18 (thin) | needs authoring |
| `debug` | S09, S13, S14, S11 | strong |
| `presentation` | S18 only | **insufficient** |

---

## 6. THE ONE DECISION THIS FILE CANNOT MAKE

`les_b1_it_presentations` has **no adequate source**. Three options, in order of my recommendation:

1. **Author it, and scope it honestly** (recommended). Build the lesson on what S18 genuinely
   supports — *preparing and submitting* a technical talk: research the audience, know your message,
   put contact details in your bio, expect nerves, keep the language approachable — and **exclude**
   slide design, delivery technique and Q&A handling, which no permitted source covers. This
   becomes an `authored` lesson with one external citation, and the limitation is stated in the
   lesson file.
2. **Commission or licence a text.** Legally clean, slower, costs money, and adds a dependency.
3. **Drop the lesson** and shrink `mod_b1_it_technical` to 5 lessons. Rejected: it breaks the
   6-lessons-per-module invariant that §4.2 and the IRT skill map depend on, and
   `les_b1_project_case_study` (#13) presupposes it.

**This is flagged rather than decided** because it is a scope-and-budget question, not a technical
one. Option 1 is what this file assumes until told otherwise.

---

## 7. ATTRIBUTION AND SHARE-ALIKE REGISTER

Legal obligations that attach the moment any of this material is used. Kept here so they are decided
per lesson rather than discovered at publication.

### 7.0 The local corpus — three states, one default, and a written request

Per §0.5, every `Source` citation in the registry now needs a second field: the **reuse basis**.

| Reuse basis | Applies to | Obligation | Cost |
|-------------|-----------|------------|------|
| **`cite_only`** (default) | the ~22 silent/©-only lessons, and any restricted lesson whose content is original | Reproduce nothing. Cite in the bibliography. | none |
| **`adapt_with_attribution`** | the 7 external-sourced lessons | Reproduce/adapt, publish the §7.1 attribution string | one line per lesson |
| **`adapt_requires_permission`** | the 48 restricted lessons that are list-shaped | **Written, perpetual, redistribution-granting permission** before publication | a letter and a wait |

**The `cite_only` default is genuinely cheap for grammar and register work.** A rule like "third
person singular takes `-s`" is an unprotectable fact about the language, and no reasonable claim
arises from *our* explanation of it. What must be ours is the explanation, the examples, the
exercises, and the ordering. That is not a workaround; it is how a language course is built anyway.

**It is not cheap for lists, and the 14 list-shaped lessons are the real exposure.** Reproducing 250
jargon entries with a citation is a reproduction with a footnote, not authorship. These need
permission or a rebuilt source:

| Lesson | List size | Replaceable from this file? |
|--------|----------:|----------------------------|
| `les_b2_it_jargon_mastery` | ~250 | **partly** — S16 + S01 + authored corpus cover the IT half; the corporate half needs a permissive business-glossary source, which this registry does not yet have |
| `les_b1_it_acronyms_deep` | 40 | **yes** — already superseded by S16 + S01 + `listening-corpus.md` glossary |
| `les_a1_false_cognates` | 10 | **yes** — superseded by the 22 original Tier A/B items in `content-map.md` §11.2 |
| `les_a2_travel_vocab_core` | 20 | **no** — travel is out of scope for the IT focus; `viagens` is ©-only anyway |
| `les_b1_finance_business`, `les_b1_hr_career`, `les_b1_sales_marketing`, `les_a2_corpus_intro` | ~40 each | **no** — no permissive business/corporate glossary found yet |

**The template for the permission request**, which is identical for the BaixeLivros authors and the
CETAM/Tiago Rodrigues rights holders:

> Subject: written permission to adapt excerpts of *<title>* into a paid English course
>
> 1. the specific sections we intend to adapt, by chapter and line range;
> 2. the intended use: a **paid** course, commercial, distributed worldwide;
> 3. a request for a **perpetual, irrevocable, royalty-free** grant of adaptation and
>    redistribution rights, in writing, surviving any change to your free distribution terms —
>    because the current notice states the free licence *"poderá ser alterada futuramente a critério
>    do autor"*, which makes reliance on it unsafe;
> 4. attribution wording we will publish, agreed in advance;
> 5. for any list reproduced substantially, a modest royalty or a credit line, at your election.

**Item 3 is the non-negotiable one.** A permission revocable at the author's discretion is not
permission; it is a promise to ask again. Given notice §0.5, any grant we accept must explicitly
outlive the revocation clause.

**Track this as an open dependency, not a task.** Until §7.0's `adapt_requires_permission` set is
cleared, the honest publishable scope of the course is the 32 lessons already on a reusable
clean-room basis (25 `authored_material` + 7 `sourced_external`) plus
original material — which is a small course, and the product plan should say so rather than discover
it at launch.

### 7.1 Attribution strings (required — CC-BY family)

| Source | Attribution line to publish |
|--------|---------------------------|
| S01, S02, S05, S08, S09 | *"[Title]", Google, licensed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).* |
| S06, S07, S10 | *"Google Engineering Practices, licensed under [CC-BY-3.0](https://creativecommons.org/licenses/by/3.0/)."* |
| S11, S12 | *"[Title], The Chromium Projects, licensed under [CC-BY-2.5](https://creativecommons.org/licenses/by/2.5/)."* |
| S16 | *"[Title], The Kubernetes Authors, licensed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)."* |
| S17 | *"Kubernetes Enhancement Proposals, Kubernetes project, licensed under [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)."* + NOTICE obligations |
| S18 | *"[Title], opensource.guide, licensed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)."* |
| S02, S05 pt-BR | Google Cloud machine translations (`?hl=pt-br`) — **verify quality before relying on them** |
| S03, S04 | **none required** — we take the CC0-1.0 option for S03; S04 is MIT (retain notice) |

### 7.2 Share-alike exposure — a decision, not a formality

| Source | Licence | If used to author lessons, then |
|--------|---------|---------------------------------|
| S19 Scrum Guide | CC-BY-SA-4.0 | historicamente relevante para `les_a2_it_meeting_standup`; a lição foi reautorada como `authored_material` (Lote 2 Onda 2), removendo dependência de adaptação share-alike desse material |
| S13, S14, S15 MDN | CC-BY-SA-2.5 | the **derived lesson material** for `les_a2_it_incidents` and the MDN-sourced half of `les_b1_it_debugging` must be published under CC-BY-SA-2.5 |

**Why this matters and is not being waved through.** A share-alike licence on a *source* is
commonly assumed to stop at the source. It does not: CC-BY-SA requires that **adapted material carry
the same licence**. If the course is sold, forcing the IT-track lesson material into share-alike is
a real commercial constraint, and it may be cheaper to author those lessons than to inherit a
licence. **Two ways out, both legitimate:**

- **Author instead of adapt** — the lesson is original work; the source is cited as background and
  no text is reproduced. No share-alike attaches. (This is what §3.1 already forces for spoken
  register.)
- **Accept the obligation** and publish those lessons under CC-BY-SA.

**Recommendation (estado atual):** `les_a2_it_meeting_standup` já foi reautorado como `authored_material` (Lote 2 Onda 2), eliminando a exposição share-alike dessa lição. Para `les_a2_it_incidents`, **author and cite rather than adapt** quando possível, pois o registro falado não é suprido pelas fontes; para `les_b1_it_debugging`, S09/S11 (CC-BY, não-SA) sustentam a maior parte do material, então **adapt and attribute** onde apropriado e trate as metades MDN (share-alike) como citação/contexto, não reprodução literal.

### 7.3 Still requiring a legal opinion

| Item | Question |
|------|----------|
| RFC 2119 / 8174 normative keywords | IETF TLP permits redistribution with restrictions and restricts derivatives. Quoting 5 short key-word definitions inside a lesson is very likely fair use; **adapting RFC structure into a lesson template is not clearly permitted.** Needed before `les_b2_it_rfc_writing` ships its normative-keyword half |
| IETF code components | BCP 78 §4.e requires Simplified BSD text for extracted code components. We plan **no** code from RFCs, which avoids it |
| Google Cloud machine translations | `?hl=pt-br` output is machine-generated. Attribution to Google is required; **accuracy of the PT-BR text is our problem, not theirs** |

---

## 8. VALIDATION

`verify-integrity.py` check **[6] External source registry** enforces two rules against this file:
every `http(s)://` URL appearing in a table row must carry a licence verdict on the same line, and
the file's presence is what retires the `deferred_no_source` warning.

```
[6] External source registry
  ok   external URLs — 34 distinct
  ok   every registry row carries a licence verdict
```

### 8.1 What was verified, and what was not

**Verified by direct fetch on 2026-09-30:** every URL in §2 returns 200; every licence string quoted
is present in the fetched page (or, for S03/S06/S07/S08/S10/S17, in the fetched repository LICENSE);
every URL in §4 was tested and its status recorded.

**Not verified, and stated as such:**

- **Licences can change.** A source cleared today can be relicensed. The URLs are re-checkable and
  §4 records the footer strings that would change with them.
- **No pt-BR quality assessment.** S02, S05 and S09 have machine translations. I have not read
  them. If a lesson leans on a PT-BR rendering, a human must check it first.
- **No pedagogical validation.** §2 establishes that these sources *can legally and factually*
  support the lessons. It does not establish that they are *good teaching material* for a
  B1/B2 Brazilian learner. That requires a pilot and, ideally, the independent ELT review already
  outstanding in `content-map.md` §11.2.
- **The spoken-register gap is unclosed.** §3.1 gap 1 stands. Sources give vocabulary; turn-taking
  is authored.

---

*Registry built 2026-09-30 from three independent fetch-and-verify passes. 19 sources accepted, 15
rejected with reasons, 19 dead or moved URLs recorded. 13/13 `deferred_no_source` lessons repointed,
with 1 (`les_b1_it_presentations`) explicitly lacking an adequate source and referred for decision in
§6. Share-alike exposure and the outstanding legal opinion are in §7.*
