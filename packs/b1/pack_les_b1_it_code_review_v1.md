# Practice Pack: Code Review Comments

**Pack ID:** `pack_les_b1_it_code_review_v1`
**Lesson:** `les_b1_it_code_review.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---

### ITEM 1
**item_id:** `vocab.codereview.blocking`
**domain:** `vocab`
**level:** L1
**stem:** A **blocking** code review comment means:
| Slot | Value |
|------|-------|
| A | Optional, merge anyway |
| B | **Must fix before merge** |
| C | Style preference only |
| D | Compliment |
**Key:** B
**br_pt_form:** "bloqueante / deve corrigir antes do merge"

### ITEM 2
**item_id:** `vocab.codereview.non_blocking`
**domain:** `vocab`
**level:** L1
**stem:** A **non-blocking** comment is:
| Slot | Value |
|------|-------|
| A | Must fix immediately |
| B | **Optional, can be addressed later** |
| C | Security issue |
| D | Test failure |
**Key:** B
**br_pt_form:** "não bloqueante / opcional"

### ITEM 3
**item_id:** `vocab.codereview.suggestion`
**domain:** `vocab`
**level:** L1
**stem:** A **suggestion** in a PR review:
| Slot | Value |
|------|-------|
| A | Blocks the merge |
| B | **One-click fix the author can apply** |
| C | Requires new commit |
| D | Deletes the line |
**Key:** B
**br_pt_form:** "sugestão / correção com 1 clique"

### ITEM 4
**item_id:** `vocab.codereview.nitpick`
**domain:** `vocab`
**level:** L1
**stem:** A **nitpick** is:
| Slot | Value |
|------|-------|
| A | A critical bug |
| B | **Minor style issue, non-blocking** |
| C | A security vulnerability |
| D | A test failure |
**Key:** B
**br_pt_form:** "detalhe menor / sugestão de estilo"

### ITEM 5
**item_id:** `vocab.codereview.lgtm`
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

### ITEM 6
**item_id:** `grammar.modals_review`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct modal for a **blocking** security issue:
| Slot | Value |
|------|-------|
| A | You **could** fix the SQL injection. |
| B | You **should** fix the SQL injection. |
| C | You **must** fix the SQL injection. |
| D | You **might** fix the SQL injection. |
**Key:** C
**br_pt_form:** "Você deve corrigir a injeção SQL."

### ITEM 7
**item_id:** `vocab.codereview.prereq_refactor`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Refactor** means:
| Slot | Value |
|------|-------|
| A | Add new features |
| B | **Restructure code without changing behavior** |
| C | Fix a bug |
| D | Write documentation |
**Key:** B
**br_pt_form:** "refatorar"