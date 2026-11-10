# F1 — Verificadores (verify-integrity.py + verify-release-gates.py)

Data: 2026-10-19
Escopo desta sessão: itens **I1..I8** de `prompt-claude.md` §4/F1 (linhas 57–71).
Fora de escopo, por decisão de sessão: **P1..P6** (`prd-score.py`).

> **F1.1 (mesma data):** os 4 achados reais que os checks endurecidos encontraram (§4) foram
> corrigidos de forma mínima e o gate ficou **verde**. Ver **§9**. O gate **não** foi afrouxado.

| | |
|---|---|
| Branch | `fix/auditoria` (nada commitado nesta fase) |
| Ordem | uma fase por sessão; F1 antes de F2 porque tudo depende dos verificadores |

---

## 1. Estado do gate antes e depois

| | `verify-integrity.py` | `verify-release-gates.py` |
|---|---|---|
| Antes | `RESULT: PASS — 0 failures, 1 warning` (exit 0) | `RESULT: FAIL — 10 failures, 1 warning` (exit 1) |
| Depois (F1) | `RESULT: FAIL — 4 failures, 0 warnings` (exit 1) | `RESULT: FAIL — 10 failures, 1 warning` (exit 1) |
| Depois (F1.1) | **`RESULT: PASS — 0 failures, 0 warnings` (exit 0)** | `RESULT: FAIL — 10 failures, 1 warning` (exit 1) — saída idêntica |
| Delta | 256 → 258 `ok`; 1 `WARN` → 0; 4 falhas novas (achados reais, §4) → corrigidas (§9) | +1 linha `ok expected-failing record`; exit code inalterado |

O gate ficou vermelho exatamente o tempo necessário: as 4 falhas eram defeitos reais que a varredura
ampliada encontrou em conteúdo existente e foram corrigidas no conteúdo, **nunca** no check (R1, R4).

Saídas cruas: `/tmp/opencode/vi_before.txt`, `/tmp/opencode/vi_after4.txt`,
`/tmp/opencode/rg_before.txt`, `/tmp/opencode/rg_after.txt`.

---

## 2. Arquivos alterados

```
 AGENTS.md                                    | 151 ++++++++-
 its-platform/scripts/verify-release-gates.py |  83 ++++-
 verify-integrity.py                          | 488 +++++++++++++++++++++------
 3 files changed, 618 insertions(+), 104 deletions(-)
?? its-platform/scripts/_release_gates_expected_failures.json   (novo, registrado p/ commit)
```

`AGENTS.md` foi editado porque é o documento que **declara** o número de checks e a tabela 1–14
(é o objeto verificado por [14], e a linha [10] publicava os números antigos). Nenhum outro
documento de conteúdo foi tocado.

---

## 3. Item por item

### I6 — derivar o número de checks do código (P0)

**Antes:** `AGENTS.md`: *"It runs **14 checks**"* enquanto `main()` chamava 13.
**Agora:** o total vive num registry e é lido do código.

- `CHECKS` + decorator `@check(n)`: cada check se registra; `main()` itera o registry (não há mais
  lista paralela de chamadas).
- Novo check **[14] `check_declared_count`**: `n = len(CHECKS)`; lê de volta a frase
  `It runs **N checks**` em `AGENTS.md` e falha se divergir, se a frase sumir, **ou** se a
  numeração não for a sequência contígua `1..n`.

```
ok   agents count — AGENTS.md declares 14, and 14 checks are registered
```

### I2 — passes vazios falham (P0)

- [12] com 0 tabelas → **FAIL** (`a table check that sees no tables is a silent pass, not a pass`).
- [13] com 0 blocos qualificados → **FAIL**.
- [10] com 0 documentos (`scanned == 0`) **ou** 0 referências → **FAIL** (R5).
- [13] deixou de pular em silêncio blocos JSON que **não parseiam** e declaram `"skills"`:
  passam a falhar em [13] (o defeito é "bloco que parseia contradizendo a si mesmo", mas um bloco
  ilegível também é indecidível).

```
[FAIL] table:   [12] found 0 markdown tables across 1 documents — a table check that sees no tables is a silent pass, not a pass
[FAIL] example: [13] found 0 JSON blocks declaring "skills" across 1 documents — an example check that sees no examples is a silent pass, not a pass
[FAIL] sxref:   [10] checked 0 section references across 1 documents — a reference check that finds no references is a FAIL, never an ok (R5)
[FAIL] sxref:   [10] scanned 0 documents — nothing to check is a FAIL, never an ok (R5)
```

### I3 — uma gramática de status (P0)

- `status_state(status)` é a única fonte: `shipped` / `shadow-only` / `withdrawn` / `unknown`.
  [5c] (`== shipped`) e [5c-ii] (`startswith`) foram unificados sobre ela.
- `unknown` **falha** e não cai mais no balde "withdrawn" (era o caminho pelo qual um status que
  ninguém reconhece virava item aceito).
- `dialogue_level(did)` exige `^dlg_([a-z]\d)_` com nível ∈ {A1, A2, B2}; prefixo desconhecido
  **falha** em vez de virar B1 por default.

```
[FAIL] corpus: L2-2 lst_prn_th_004 declares Status 'repaired — §9 DEF-4', which is none of ('shipped', 'shadow-only', 'withdrawn') — an item whose state no check recognises is an item the next one files by default
[FAIL] corpus: dlg_b2_probe carries no CEFR level this corpus models (A1/A2/B1); its level used to be inferred as B1 by default, which would file its coverage under the wrong column of §8.2
```

### I5 — aviso de packs legadas → catraca com baseline versionado (P0)

Piso: `_legacy_packs_baseline.json` (`{"count": 115, ...}`, já em HEAD desde `48f67d2`).

| Situação | Resultado |
|---|---|
| contagem > piso | **FAIL** (CATRACA) |
| contagem < piso | `ok` + instrução de re-pin |
| arquivo ausente/ilegível | **FAIL** (`no floor`) |

Sem auto-rewrite: o check **não muta o repositório**. Re-pin manual:
`python3 verify-integrity.py --update-legacy-baseline` (exige commit depois).

```
ok   pack legacy ratchet — 115 legacy packs, exactly at the committed floor (_legacy_packs_baseline.json)
[FAIL] pack legacy ratchet: CATRACA: 116 `pack_les_*_v1.md` packs against a committed floor of 115 — 1 legacy pack(s) appeared. New content must be authored in the `pack-les-*.md` schema (post-lesson-practice-spec.md §12)
[FAIL] pack legacy ratchet: _legacy_packs_baseline.json is missing — the legacy-pack ratchet has no floor.
```

O `WARN` permanente que existia antes ([9] globava 7 de 122 packs) **desapareceu** do resultado
(`0 warnings`): a parte que ainda é verdadeira virou uma linha `ok pack schema` (o disclosure
permanece, agora que [10]/[12]/[13] realmente cobrem esses packs) e a parte que precisava de um
limite virou o check de catraca acima.

```
ok   pack legacy ratchet — 115 legacy packs, exactly at the committed floor (_legacy_packs_baseline.json)
ok   pack schema — 115 of 122 packs use the `pack_les_<lesson>_v1.md` schema (806 items) and stay outside check [9]'s per-distractor rules; ...
```

### I1 — [10]/[12]/[13] no escopo completo (P1)

**Antes:** `[10] ok sxref — 79 internal section references resolved`, `[12] ok table — 1003 tables`.
**Agora:** 259 documentos (16 specs + 3 `ROOT_DOCS` + 243 artefatos, incluindo os 115
`pack_les_*_v1.md`), **1332** referências (era 79), **1829** tabelas (era 1003).

`BACKLOG.md` **não existe na raiz** — o único `BACKLOG.md` do repo está em `its-platform/`, que a
própria F1 não pede para varrer (a F2 é que o corrige). Registro como lacuna, não como pendência.

Três mecanismos novos, cada um nascido de um falso resultado medido:

1. **`DOC_ALIAS` estendido** (`CONSTITUTION`, `ADR`, `ERD`, `runbook`, `MEMORY`, `PRD`, `SDD`,
   `BACKLOG`, `ITS-ARCHITECTURE`): `PRD.md`/`MEMORY.md`/`ITS-ARCHITECTURE.md` citam
   `` `CONSTITUTION §4.9` ``, `` `ERD §6.9` ``, `` `ADR-018 §9` `` o tempo todo; sem esses nomes a
   janela lia 15 referências cruzadas legítimas como self-references dangling.
2. **`SELF_ALIAS`**: o nome do próprio arquivo não é referência a outro documento. Sem isso,
   alargar o escopo para documentos que se citam pelo nome teria *desligado* a verificação de
   self-reference dentro deles em vez de *ligar* a de cross-reference.
3. **`SCHEMA_GOVERNING`** (`pack_les_*_v1.md → post-lesson-practice-spec.md`): o manifest
   `spec_conformance:` dos packs legados cita `§2.1`/`§4.2` sem nomear documento algum, e o pack
   nunca nomeia `post-lesson-practice-spec.md`. Resolver pelo spec que o **schema** declara é
   estritamente **mais forte** que pular: uma referência a seção inexistente passa a falhar.

**Defeito encontrado na própria implementação (e corrigido), pelo controle negativo:**
461 das 691 referências dos manifests estavam sendo *puladas* pela janela de 400 caracteres,
porque o próprio `lesson_id: les_*` do arquivo cai dentro dela. Conserto: `OWN_ID_FIELD` +
`own_id_alias()` mascaram os identificadores próprios antes da leitura da janela, e a ordem foi
invertida — **resolver primeiro (local/governante), classificar depois**. Resultado medido:

```
resolved by governing spec                     691
resolved locally                               398
skipped — file declares its spec in the header 315
skipped — clause names another document        242
FAILED                                           1
TOTAL                                           1647   (1332 das 1647 são "checked")
```

```
ok   sxref — 1332 internal section references checked across 259 documents
```

(A mensagem passou de "resolved" para "checked" de propósito: o total **inclui** a referência que
falha; uma mensagem que diz "resolved" com o gate vermelho esconde de onde saiu o número.)

### I8 — release-gates: registro do conjunto que falha (P1)

**Antes:** as 12 falhas esperadas (o número do prompt não é derivável — ver abaixo) eram aceitas
por exit code `1` sem nomear nada.
**Agora:** `_release_gates_expected_failures.json` versionado, **derivado** com
`--update-expected-failures`:

```json
{"CI Green": 1, "Code Complete": 2, "Integration Tests": 1, "Load Test": 1,
 "Prod Approval": 2, "Security Scan": 1, "Staging Deployed": 2}   // 10 falhas / 7 gates
```

| Situação | Resultado |
|---|---|
| gate falha **mais** que o registro | **FAIL** nomeando o gate |
| gate falha **menos** que o registro | `ok` + instrução de re-pin |
| registro ausente/ilegível | **FAIL** (R5 fail-closed) |

```
ok   expected-failing record — 10 failing check(s) across 7 gate(s), exactly the committed set (_release_gates_expected_failures.json)
[FAIL] expected-failing record: gate(s) failing MORE than the committed record: {'Load Test': 1}. This is the only place a new failure shows up — the exit code was already 1. ...
```

Exit code continua `1`: baseline vermelho não é aceito, só é **nomeado**. Extra X1–X4 do script
passam e não entram no registro. O "12 falhas esperadas" do prompt **não é derivável**: os 7 gates
de §6.3 produzem 10 falhas.

**Tensão declarada com R12 (para decisão humana).** R12 pede allowlist **por ID de check** e falha
"se o conjunto mudar em qualquer direção". O registro aqui é **por gate, com contagem**, e
assimétrico: subir falha, descer apenas avisa. Justificativa: (a) a unidade observável do script é
o gate, e é ele que o commit tem de explicar; (b) a assimetria evita que "consertar um gate" deixe
o CI vermelho — mas é exatamente o caso que R12 quer vermelho. **Decisão de humano** que fica
registrada, não resolvida por mim.

---

## 4. Achados reais (as 4 falhas novas)

| # | Achado | Arquivo | Detalhe |
|---|---|---|---|
| 1 | `sxref` | `PRD.md:247` | cita `§1.2`; o PRD define só 1..10 e não nomeia documento na cláusula — dangling |
| 2 | `table` | `MEMORY.md:15` | 4 células contra header de 3 |
| 3 | `table` | `MEMORY.md:60` | 7 células contra header de 4 |
| 4 | `table` | (agregado) | `2 malformed table rows total` |

Os dois últimos são a classe de defeito que [12] existe para ver: linhas que perderam/ganharam
célula e que todo check que lê célula lê como "presente". **Corrigidos em F1.1 — ver §9.**

---

## 5. Controles negativos (R4)

Ambos em cópia descartável; **nada toca a árvore de trabalho**.

`verify-integrity.py` — `/tmp/opencode/negctl_final.txt` (driver `/tmp/opencode/negctl_driver.py`):

```
20 controles, 0 "CONTROL DID NOT FIRE"
I6-a/b/c  I2-a/b/c/d/e/e2  I3-a/b/c  I5-a/b/c/d  I1-a/b/c/d
```

Cada controle imprime `defect injected -> EXIT=…, N FAIL line(s)` + a linha `[FAIL]` exata do
defeito, e em seguida `reverted -> FAILS: …` mostrando o defeito removido. Dois controles são
"controle do achado pré-existente" (`NO MATCHING FAIL`: corrigir o defeito real limpa a falha e o
check segue verificando as 1332 referências). `I5-c` é o caso *slack*: reportado com a instrução de
re-pin, não falhado — é o residual abaixo.

`verify-release-gates.py` — `/tmp/opencode/rg_controls_out2.txt` (driver `/tmp/opencode/rg_controls.py`):

```
I8 baseline · I8-a · I8-b · I8-c · I8-d · I8-e · I8-f · FINAL (restaurado)
7 controles, 0 "CONTROL DID NOT FIRE"
```

---

## 6. Lacunas residuais medidas (não são regressões: são o limite do que foi feito)

1. **315 referências** puladas porque o arquivo declara `**Spec:**` no próprio header (`GOVERNED`).
   A convenção existe e é correta; o check não a resolve, só a respeita.
2. **37 referências** em **10 documentos que não definem seção numerada** (17 no `AGENTS.md`, 20 em
   9 lições). Todas pertencem a esse tipo de arquivo — a guarda `if not defined: continue` é
   **load-bearing**: numerar `AGENTS.md` faria 6 delas (citações legítimas a §4.3/§4.1/§2/§13/§8.2
   de `content-map.md`) virarem dangling falsas.
3. **Piso slack** de I5 e I8: enquanto o piso/registro estiver acima da realidade, conteúdo novo
   entra até o piso sem falhar. Ambos avisam com a instrução de re-pin; nenhum reescreve o arquivo.
4. **`BACKLOG.md` da raiz não existe** (`its-platform/BACKLOG.md` fica fora do escopo desta fase).

---

## 7. Pendências (sem solução nesta fase)

### I4 — gramática única da chave de slot (ADIADO, por decisão de sessão)

Divergência confirmada:

- verificador (`verify-integrity.py`): conta `✓` em **qualquer lugar** do bloco (`body.count("✓")`, `tables[-1].count("✓")`);
- loader (`its-platform/src/infrastructure/content/listening-parser.ts`, ADR-027 §3a): `rawValue.includes('✓') || rawNote.includes('✓')` — lê a **coluna**.

Definir uma gramática única exige módulo compartilhado entre Python e TS — mudança de arquitetura,
não de check. **Apenas relatado.**

### I7 — matriz de cobertura do `SDD.md` §10 gerada do código (ADIADO)

Hoje é escrita à mão. Gerar do código é a fase/decisão seguinte. **Apenas relatado.**

### Crash pré-existente em `gate_ci_green` (`verify-release-gates.py:334`)

`on: push` (escalar) e `on: [push, pull_request]` (lista) são YAML **válido** do GitHub Actions.
Ambos derrubam o script:

```
ok   workflow parses — 1 jobs
Traceback (most recent call last):
  File ".../its-platform/scripts/verify-release-gates.py", line 856, in main
    fn(name, criteria, owner)
  File ".../its-platform/scripts/verify-release-gates.py", line 334, in gate_ci_green
    push_branches = set((triggers.get("push") or {}).get("branches") or [])
AttributeError: 'str' object has no attribute 'get'
```

Só **não** dispara hoje porque o repo não tem `.github/workflows/ci.yml` (o gate falha antes, com
"does not exist"). Evidência crua: `/tmp/opencode/ci_crash.txt` (sandbox `/tmp/opencode/ci_crash2`).
Não corrigido nesta fase (o item é I8, e o crash é de código de produto do script); patch mínimo
proposto para `workflow_triggers()`:

```python
        if isinstance(wf, dict) and key in wf:
            t = wf[key] or {}
            if isinstance(t, str):          # `on: push`
                return {t: {}}
            if isinstance(t, list):         # `on: [push, pull_request]`
                return {k: {} for k in t if isinstance(k, str)}
            return t
```

### P1..P6 (`prd-score.py`)

Não tocado nesta sessão (fora do escopo declarado no topo).

---

## 8. Como reproduzir

```bash
cd Curso-de-Ingles
python3 verify-integrity.py                                          # exit 0, PASS — 0 failures, 0 warnings
python3 its-platform/scripts/verify-release-gates.py                 # exit 1, 10 failures + ok do registro

# re-pin (cada um exige commit depois)
python3 verify-integrity.py --update-legacy-baseline
python3 its-platform/scripts/verify-release-gates.py --update-expected-failures

# controles negativos (sandboxes em /tmp/opencode, nunca a árvore de trabalho)
python3 /tmp/opencode/negctl_driver.py
python3 /tmp/opencode/rg_controls.py
```

---

## 9. F1.1 — correção dos 3 defeitos (a 4ª falha era o roll-up de [12])

Regra do repositório: gate vermelho → corrigir o conteúdo, nunca o check. Nenhuma linha de
`verify-integrity.py` foi afrouxada nesta correção.

### 9.1 Arquivos e linhas

```
 MEMORY.md | 6 +++---
 PRD.md    | 2 +-
 2 files changed, 4 insertions(+), 4 deletions(-)
```

| # | Arquivo:linha | Antes | Depois | Por quê |
|---|---|---|---|---|
| 1 | `PRD.md:247` | `... rename dotted \`item_id\`s to §1.2's prefix convention` | `... rename dotted \`item_id\`s to \`assessment-item-spec.md\` §1.2's prefix convention` | a cláusula não nomeava documento; o alvo é `assessment-item-spec.md` §1.2, que o próprio `PRD.md:154` já cita assim. Sentido da linha inalterado |
| 2 | `MEMORY.md:15` | pipe **não escapado** dentro do code span (`` `grep -n` `` … `` `D[0-9]` ``) | pipe **escapado** com barra invertida no fonte | GFM exige escapar o pipe mesmo dentro de code span, senão ele divide a célula |
| 3 | `MEMORY.md:60` | 7 células; rabo `1d \| P0.8 \| — \| verify-integrity/... OK` | 4 células (esquema `Frente \| Status \| Entregue em \| Commit(s)`) | a linha carregava campos de outro esquema |
| 4 | `MEMORY.md:66` | `**PASS — 0 failures, 1 warning**` + `warning = 115/122 packs em schema legacy` | `**PASS — 0 failures, 0 warnings**` + a catraca versionada | acurácia: o aviso que a linha publicava deixou de existir em F1 (I5) |

### 9.2 O escape do pipe (item 2) preserva o comando

Verificado com o **próprio parser do frontend** (`remark-parse` + `remark-gfm`, de
`its-platform/frontend/node_modules`), não só com a regex do check:

```
TABLE: 2 rows (1 header + 1 body)
  header: 3 cells
  body1: 3 cells
    cell[2]: "`grep -n \"^| D[0-9]\"`"      <- o `\|` do fonte é consumido; o leitor vê `^| D[0-9]`
```

Varredura independente completa (remark-gfm) dos três arquivos tocados/afetados:

```
MEMORY.md: 7 tables (GFM/remark-gfm), 0 malformed row(s)
PRD.md: 7 tables (GFM/remark-gfm), 0 malformed row(s)
AGENTS.md: 5 tables (GFM/remark-gfm), 0 malformed row(s)
```

### 9.3 Item 3 — para onde foram os dados que sobravam (decisão explícita)

O rabo era `1d | P0.8 | — | verify-integrity/prd-score/typecheck/build/content-check/domain/contract-check OK`.
`grep` em `MEMORY.md` mostra que **não existe** nenhuma tabela com esquema de esforço/dependência
para recebê-los (não há coluna `Esforço` nem `Dep`) e a tabela "Gates" tem 3 colunas
`Gate | Resultado | Observação`, onde uma linha nova seria **inventada** de uma string de evidência
histórica (R2 proíbe). Então os dados foram preservados **dentro da própria linha**, como
anotação explícita — nada foi descartado, e nenhuma outra linha de `MEMORY.md` foi tocada:

```
... all core gates green (campos herdados de um esquema anterior, preservados:
esforço `1d`, dependência `P0.8`, evidência de gates `verify-integrity/prd-score/.../contract-check OK`) | — |
```

**Desvio assumido** da sugestão "(ex.: a nota de gates para a seção/tabela Gates)": movê-la para
lá exigiria mexer em outra linha (proibido) e a tabela de Gates não tem coluna onde a string caiba
sem virar uma linha de gate que não existe. Se você preferir a versão na seção Gates, é 1 linha.

### 9.4 Saída crua do gate

Antes (F1):

```
[FAIL] sxref: PRD.md:247 references §1.2 but that section does not exist (...; it names no document in the clause, so the reference cannot be resolved anywhere)
[FAIL] table: MEMORY.md:15 has 4 cells, its header has 3 — `| [§3 Avaliação crítica](#3-avaliação-crítica) | Forças, defeitos aber`
[FAIL] table: MEMORY.md:60 has 7 cells, its header has 4 — `| P0.9 delete legacy Python tree | ✅ **DONE** (2026-10-08) | Removed ``
[FAIL] table: 2 malformed table rows total
RESULT: FAIL — 4 failures, 0 warnings            (exit 1)
```

Depois (F1.1):

```
[10] Internal section references resolve
  ok   sxref — 1332 internal section references checked across 259 documents

[12] Markdown table column consistency
  ok   table — 1829 tables across 259 documents, all rows match their header width

[13] Worked examples honour their own disclosures
  ok   example — 1 worked example(s) across 259 documents — no estimate printed for a domain the example itself declares non-reportable

[14] AGENTS.md declares the real number of checks
  ok   agents count — AGENTS.md declares 14, and 14 checks are registered

==============================================================================
==============================================================================
RESULT: PASS — 0 failures, 0 warnings            (exit 0)
```

Saída crua completa: `/tmp/opencode/vi_f2.txt`.

`[10]` continua verificando **1332** referências e `[12]` **1829** tabelas — a correção tirou as
falhas *de conteúdo*, não enfraqueceu a varredura. `verify-release-gates.py` roda **idêntico**
(`diff` vazio contra a saída de F1): nenhuma falha nova em nenhum gate.

### 9.5 Controles negativos após a correção (R4)

`/tmp/opencode/negctl_f2.txt` — **20/20** controles ainda disparam, `0` "CONTROL DID NOT FIRE",
e agora todos os `reverted -> FAILS: 0`.

Um controle precisou mudar de papel, e o motivo importa: **I1-c** era "o achado real de
`PRD.md:247` some quando a referência é corrigida". Com o achado corrigido, um controle que
conserta uma referência dangling não tem mais o que provar; ele virou **controle de regressão** —
sem defeito injetado, [10] não pode ter FAIL e tem de continuar verificando 1332 referências
(o `ok` sozinho não bastaria: um check que não verifica nada também não falha — R5).

O efeito colateral é a melhor evidência de que a correção foi real: em F1, `I1-d` (linha de tabela
malformada em `MEMORY.md` recém-postos em escopo) imprimia **3** FAILs, dois deles pré-existentes.
Agora imprime **1** — só o defeito injetado:

```
  defect injected -> EXIT=1, 2 FAIL line(s) in the whole gate
    [FAIL] table: MEMORY.md:264 has 3 cells, its header has 2 — `| um | dois | tres |`
  reverted -> FAILS: 0
```

### 9.6 O que NÃO foi tocado

- `MEMORY.md:68` (`verify-release-gates.py` → `**FAIL — 12 failures, 4 warnings, exit 1**`) está
  **desatualizado** (a realidade é 10 failures, 1 warning) e continua lá de propósito: é F3, não
  esta correção. Vale notar que é a origem mais provável do "12 falhas esperadas" citado em I8.
- Todo o resto de `MEMORY.md` (D1–D4, pendências) e de `PRD.md`.
- Nenhum check de `verify-integrity.py`.

