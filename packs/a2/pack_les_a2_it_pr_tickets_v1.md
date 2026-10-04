# Practice Pack: PRs, Tickets & Code Comments

**Pack ID:** `pack_les_a2_it_pr_tickets_v1`
**Lesson:** `les_a2_it_pr_tickets.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---

### ITEM 1
**item_id:** `vocab.pr.lgtm`
**domain:** `vocab`
**level:** L1
**stem:** **LGTM** means:
| Slot | Value |
|------|-------|
| A | Let's Get This Merged |
| B | **Looks Good To Me** |
| C | Last Git Test Merge |
| D | Local Git Tag Master |
**Key:** B
**br_pt_form:** "Parece bom para mim"

### ITEM 2
**item_id:** `vocab.pr.nitpick`
**domain:** `vocab`
**level:** L1
**stem:** A **nitpick** in code review is:
| Slot | Value |
|------|-------|
| A | A blocking issue |
| B | **A minor, non-blocking suggestion** |
| C | A security vulnerability |
| D | A test failure |
**Key:** B
**br_pt_form:** "detalhe menor / sugestão pequena"

### ITEM 3
**item_id:** `vocab.pr.request_changes`
**domain:** `vocab`
**level:** L1
**stem:** **Request changes** means:
| Slot | Value |
|------|-------|
| A | Approve the PR |
| B | **Fix these issues before merge** |
| C | Merge immediately |
| D | Delete the branch |
**Key:** B
**br_pt_form:** "solicitar alterações"

### ITEM 4
**item_id:** `vocab.pr.approve`
**domain:** `vocab`
**level:** L1
**stem:** **Approve** a PR means:
| Slot | Value |
|------|-------|
| A | Request changes from the author |
| B | **Looks good, ready to merge** |
| C | Needs more work |
| D | Cancel the PR |
**Key:** B
**br_pt_form:** "aprovar"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key; *request changes* is the other real review action). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.

### ITEM 5
**item_id:** `vocab.pr.wip`
**domain:** `vocab`
**level:** L1
**stem:** **WIP** in a PR title means:
| Slot | Value |
|------|-------|
| A | Work Is Perfect |
| B | **Work In Progress** |
| C | Waiting In Pipeline |
| D | With Integrated Patches |
**Key:** B
**br_pt_form:** "Em andamento"

### ITEM 6
**item_id:** `grammar.imperative_commit`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **imperative** commit message:
| Slot | Value |
|------|-------|
| A | **Fix** login timeout |
| B | **Fixing** login timeout |
| C | **Fixed** login timeout |
| D | **Fixes** login timeout |
**Key:** A
**br_pt_form:** "Corrigir timeout no login"

### ITEM 7
**item_id:** `vocab.pr.prereq_branch`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] A **branch** in Git is:
| Slot | Value |
|------|-------|
| A | A commit message |
| B | **A separate line of development** |
| C | A merge conflict |
| D | A tag |
**Key:** B
**br_pt_form:** "branch / ramificação"