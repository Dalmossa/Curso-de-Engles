# Fase A5b — A credencial, o escopo, e a leitura que a RLS governa

**Data:** 2026-10-15 · **HEAD ao começar:** `2c0b0bc` · **Escopo ratificado:** ADR-038 inteiro
(ato humano de 2026-10-15), com implementação **mínima — "só a leitura que a RLS governa"**.

A fase responde três perguntas que a API respondia errado: *quem é o chamador* (não havia
credencial alguma), *o que ele pode fazer* (nenhum escopo existia) e **qual objeto ele pode ver**
(as cinco rotas `/learners/*` respondiam um stub `200` para qualquer id). A primeira e a segunda
foram fechadas em A5b-1 (`134d1da`); a terceira, D3, é o assunto principal deste relatório.

---

## 1. Tarefas e veredito

| # | Tarefa | Veredito | Evidência |
|---|---|---|---|
| A | `JwtAuthGuard` global, `@Public()` só em `/health`/`/ready`, 6 escopos, JWKS RS256, *fail closed* (D1/D2) | **feito** (`134d1da`) | 3 specs unit + `tests/integration/auth-guard.spec.ts` |
| B | `401`/`403` no spec canônico + regra de gate (ADR-040/ADR-034) | **feito** (`2c0b0bc`); metade do catálogo aberta (§4.3) | `contract:gate` PASS; 2 controles negativos |
| C | As 5 rotas `/learners/*` leem sob `PgSessionContext`; o 404 é consequência da política (D3) | **feito** (`78d8bf6`) | `tests/integration/learner-scope-rls.spec.ts` (10 casos) + `tests/unit/learners/` (27) |
| D | Controle negativo obrigatório (L1→L1 200; L1→L2 404; "a query não devolveu linha") | **feito** | §5, com os dois controles medidos |
| E | Nenhum handler learner-scoped roda com credencial de owner | **medido, não fechado** | §4.2 |
| F | Token inválido ⇒ 401; escopo ausente ⇒ 403; objeto alheio ⇒ 404 (D4/D4.1) | **feito**, com a tensão de D4 nomeada | §4.1; `auth-guard.spec.ts`, BDD emendado (`db5ba88`) |

O que A5b **não** fez: reescrever o corpo das rotas (stub por decisão ratificada), P1.10/P1.11, o
catálogo de problemas de ADR-034 (§4.3), a correção da credencial de conexão (§4.2) e o log de
negações de §4.6 (D6).

---

## 2. Achados

### 2.1 O documento estava certo e o servidor era um stub — o 404 não era implementável

`docs/api-spec.openapi.yaml` declara `404` nos reads de `/learners/*` desde A0. As 5 rotas
respondiam `200` com um payload fixo **para qualquer id**: o do próprio, o de outro aprendiz e um
que nunca existiu. Não era um 404 que falhava — era um 200 que não consultava nada. É por isso que
A5b é uma fase de *comportamento* e não de contrato: a declaração já estava lá, e o `contract:gate`
não podia vê-la (ele compara rotas e status declarados, não se o servidor consulta um banco).

### 2.2 *Deny by default* era falso, e o catálogo deixou de ser anônimo

A0 mediu **zero** `@UseGuards` em `src/`. §4.5 exige guard global com opt-out explícito; o que
existia era o oposto (allow por omissão, superfície inteira aberta). D1 foi ratificado com o
catálogo **autenticado** — não há consumidor anônimo nomeado (R3) — e isso é *breaking* em §4.4,
registrado no CHANGELOG. A decisão é reversível ao lado permissivo (afrouxar não é breaking), o que
está anotado no ADR como reversibilidade, não como dívida.

### 2.3 O `sub` do token é o `learner_id`, e o escritor único do contexto sobreviveu

D7 põe o sujeito do token como o id do aprendiz, e a consequência verificável é que
`PgSessionContext` continua a ser o **único** escritor do contexto de sessão (ADR-026 §1): a rota
não escreve nada, ela passa `subject` a `withLearner`. O contexto recebe o token; a query recebe o
**path**. Uma troca entre os dois não quebra nada visível — devolve 200 com os dados do próprio
chamador — e é por isso que a prova de posição existe em unit (§5, N-2).

### 2.4 Havia uma obrigação de contrato sem gate: `security` sem `401`

O spec não declarava `401`/`403` em operação alguma, e o `contract:gate` não tinha regra sobre
isso. A regra nova (operação que exige credencial declara o `401` com que pode ser respondida) foi
escrita depois de dois controles negativos medidos (§5, N-3/N-4). Contagens finais: **`401` em 10
de 10** operações, **`403` em 9 de 10**, `404` em 8.

### 2.5 A carga é a única coisa que mudou; o corpo continua stub

Os quatro serviços passam `(subject, learnerId)` e chamam `requireVisible` antes de montar o
payload; **o payload é o mesmo de antes**. Isso é o escopo ratificado, e é também a razão de
`mastery-gate` não ter sido tocado: `gate_passed` não é computável hoje sem as observações
individuais (n_eff), que `learner_mastery` não guarda — não se inventou o valor.

---

## 3. Arquivos e commits

| Commit | Classe | Conteúdo |
|---|---|---|
| `db5ba88` | ADR/BDD | ADR-038 → `Accepted`, *Implementation note* sob D4, cenário BDD 403→404, ADR-013 |
| `134d1da` | guarda global | `src/common/auth/*`, `src/common/guards/jwt-auth.guard.ts`, `src/infrastructure/auth/*`, wiring em `configureApp`, `tests/helpers/tokens.ts` |
| `2c0b0bc` | contrato | `401`×10 e `403`×9 no spec, `BearerAuth.description`, regra nova no `contract-gate.mjs`, `docs/api-spec.md` |
| `54a59c9` | correção de gate | `token-principal.ts` deixa de nomear o GUC fora do escritor único (`rls:check`) — §6.1 |
| `78d8bf6` | D3 (código + provas) | `learner.repository.ts`, `learner-scope.service.ts`, os 4 serviços/controllers/módulos, 3 specs unit, o spec HTTP/RLS, padrão do job `rls-integration`, 4 specs existentes ajustados |
| `e18c567` | CHANGELOG | as duas entradas *breaking* de A5b |
| *(este)* | relatório | este arquivo + caixas do plano de ADR-038 |

---

## 4. Decisões humanas e obrigações abertas

### 4.1 A tensão dentro de D4 (o item que o ADR marca `needs_human_review`)

A **linha 1** da tabela de D4 (escopo insuficiente ⇒ **403**) e a **nota** ("escopo falta **e**
objeto não é do solicitante ⇒ 404") não podem valer as duas sob D3. A5b implementou a linha 1: o
guard decide pelo que a **rota** exige e o que o **token** traz, nunca pelo objeto — e por isso
responde o mesmo `403` quer o id exista, quer não.

Aplicar a nota exigiria saber se o objeto é alheio **antes** de decidir o escopo, e a única forma
de o saber sem ler o banco é comparar o path com o sujeito — a forma que D3 rejeita por nome. Lendo
primeiro, a ordem deixa de ser "escopo, depois objeto" e passa a ser "objeto, depois escopo".

**A decisão pedida é uma:** em `GET /learners/{id}/…`, um token sem `learner:self` que pede o id
**de outro** responde **403** (como hoje) ou **404** (como a nota diz)? As duas respostas são
defensáveis; a segunda mantém "a RLS decide o que existe" ao custo de mover a checagem de escopo
para dentro do handler, depois do carregamento. **Nada foi decidido aqui** — a nota segue marcada
`needs_human_review` no ADR.

### 4.2 A credencial da conexão: a decisão está inerte na configuração entregue

**O achado mais grave de A5b, e ele é medido, não inferido.** Uma tabela **isenta o próprio dono**
das suas políticas (nenhuma tabela aqui usa `FORCE ROW LEVEL SECURITY`), e
`src/infrastructure/data-source.ts` conecta como `DB_USERNAME`, cujo default é `postgres` — o dono.
Logo, na configuração que este repositório entrega, `learner_isolation` não se aplica ao processo e
o 404 de D3 **não acontece**: `SELECT id FROM learners WHERE id = $1` devolve a linha alheia.

As duas metades estão no mesmo spec, com a conexão trocada explicitamente:

```
com SET ROLE its_platform_app    L1 → /learners/{L1}/profile  = 200
                                 L1 → /learners/{L2}/profile  = 404
na conexão owner (sem SET ROLE)  L1 → /learners/{L2}/profile  = 200   ← a política não se aplica
```

Continua verdadeiro, e não foi tocado: o papel **pretendido** (ADR-019/ADR-026) é
`its_platform_app`, o role é `NOLOGIN` (troca-se por `SET ROLE`, não por login), e é por isso que o
teste troca de papel. O que falta é uma decisão de configuração/implantação — opções, não
exaustivas:

1. conexão com um login membro de `its_platform_app` mais `SET ROLE` no boot (ou
   `options=-c role=its_platform_app` na string de conexão);
2. a aplicação **falhar no boot** se `SELECT current_user` não for o papel sujeito à política — o
   que transforma a armadilha em erro de partida, não em leitura silenciosa;
3. `FORCE ROW LEVEL SECURITY` nas 15 tabelas (muda a migração e afeta quem mais escreve nelas).

Nenhuma é do caminho de código que A5b ratificou ("mínimo: só a leitura que a RLS governa"), e a
caixa A3 correspondente no plano do ADR-038 continua `[ ]`, com esta medição anexada.

### 4.3 O catálogo de problemas de ADR-034 não existe

A caixa A2 pedia `401`/`403` "no spec canônico **e** no catálogo de problemas (ADR-034)". O spec
foi feito; o catálogo não existe (`docs/api/problem-types.md` é `[ ]` no plano do próprio ADR-034).
Não há, portanto, tabela em que registrar os dois — e não se inventou uma: o que é servido hoje
(`type: about:blank`, `title` = frase do status, D3 de ADR-034) cobre `401`/`403` sem tabela.

---

## 5. Controles negativos (R7)

| # | Mutação | Esperado | Medido |
|---|---|---|---|
| N-1 | `requireVisible` deixa de olhar o resultado da consulta (a rota responde sem consultar a política) | os casos L1→L2 caem | **5 de 10 vermelhos** — `profile`, `mastery`, `next`, `placement`, `practice` |
| N-2 | troca dos argumentos: o contexto recebe o **path id** em vez do `subject` | leitura alheia volta a passar | **6 de 10** na integração **+ 2** em `tests/unit/learners/` |
| N-3 | spec sem o `401` de `content/lessons/{lesson_id}` | `contract:gate` vermelho | vermelho |
| N-4 | `$ref` do `403` do placement trocado | `contract:gate` vermelho | vermelho |

**N-1 encontrou um caso vacuoso.** No primeiro passe, o caso *"um id que não existe é respondido
igual a um id alheio"* continuou **verde** com a carga removida: comparar duas respostas é
satisfeito por quaisquer duas respostas iguais (ambas passaram a `200`). O caso agora fixa primeiro
que os dois são `404` e só depois compara — igualdade **a um valor**, não apenas entre si.

---

## 6. Desvios registrados

### 6.1 `rls:check` ficou vermelho por um commit

O commit do guard (`134d1da`) escreveu `app.current_learner_id` num comentário de
`token-principal.ts`; `rls:check` (ADR-026 §3b) só admite o literal em dois lugares sob `src/` (o
escritor único e a migração). O gate **não está no `test:gate`** (que é jest + allowlist), e a
verificação local da fase usou `test:gate` — a CI usa (`job rls-context`, `npm run rls:check`) e
teria ficado vermelha. Corrigido em `54a59c9`. Eram 5 menções em 3 arquivos, todas em prosa, nenhuma
em código. **Desvio de processo registrado:** o ritual local não cobre todos os gates que a CI roda.

### 6.2 `cryptoRandom()`: removido por engano, restaurado antes do commit

Nas 3 controllers reescritas as funções mortas (P2 de `reports/api/fase-4.md` §2.7) foram removidas
e **restauradas**: remoção de código morto não é a classe de A5b, e misturá-la tornaria o diff da
regra de D3 ilegível. Os 3 continuam onde estavam, incluindo o de `auth.controller.ts`.

### 6.3 Quatro specs existentes foram ajustados, não alargados

O código mudou de forma sob eles. `auth-guard` e `error-response` afirmavam o 404 que o controller
lançava à mão; agora afirmam o que cada um possui — a guarda deixa passar (o handler responde o seu
próprio valor) e o filtro renderiza os bytes — e apontam para o spec que possui a recusa.
`request-validation` e `post-success-status` passaram a prover um `LearnerScopeService` "visível",
porque nada neles é sobre o banco.

---

## 7. Saídas dos gates — ANTES → DEPOIS

| Gate | ANTES (A5a, `0552094`) | DEPOIS (A5b) |
|---|---|---|
| `npm run test:gate` | PASS — 460 passed · 5 red (allowlist) · 8 skip · 473 total | **PASS — 497 passed · 5 red · 8 skip · 510 total** |
| `npm run contract:gate` | PASS | PASS (regra nova do `401` + 2 controles) |
| `npm run rls:check` | PASS | PASS — **após** `54a59c9`; vermelho em `134d1da` (§6.1) |
| `npm run domain:check` | PASS | PASS |
| `npm run kong:check` | PASS | PASS |
| `npm run typecheck` | limpo | limpo |
| `npm run lint` | 0 errors | 0 errors (3 warnings de arquivo ignorado, herdados) |
| `verify-integrity.py` (raiz) | PASS — 0 falhas, 1 warning | PASS — 0 falhas, 1 warning (herdado) |
| `prd-score.py` (raiz) | 92.6% | 92.6% |

Os 37 testes novos (27 unit + 10 integração) explicam a diferença: 460 → 497.

---

## 8. Onde cada obrigação mora agora

| Obrigação | Onde | Prova |
|---|---|---|
| Credencial válida; `/health` e `/ready` públicos | `src/common/guards/jwt-auth.guard.ts` + `configureApp` | `tests/unit/auth/jwt-auth-guard.spec.ts`, `auth-guard.spec.ts` |
| RS256 pinado, `iss`/`aud`/`exp`/`nbf`, JWKS remoto | `src/infrastructure/auth/jwks-token-verifier.ts` | `tests/unit/auth/jwks-token-verifier.spec.ts` |
| Configuração ausente ⇒ nega tudo | `token-verifier-from-env.ts` + `deny-all-token-verifier.ts` | `tests/unit/auth/token-verifier-from-env.spec.ts` |
| Escopo por rota (D2) | `@Scopes` nos controllers | `auth-guard.spec.ts` |
| `401`/`403` publicados | spec canônico + `contract-gate.mjs` | `tests/contract/gate.spec.ts` + N-3/N-4 |
| Objeto alheio ⇒ 404; inexistente ⇒ mesmo 404 | `LearnerScopeService` + `LearnerRepository` | `learner-scope-rls.spec.ts`, `tests/unit/learners/` |
| Contexto de sessão com um único escritor | `PgSessionContext` (intocado) | `rls:check` (Rules 1–3) + `rls-isolation.spec.ts` |

---

## 9. Pendências humanas e bloqueios

1. **A tensão de D4** (§4.1) — a pergunta única, com duas respostas defensáveis.
2. **A credencial da conexão** (§4.2) — sem ela o 404 de D3 é inerte na configuração entregue.
3. **O catálogo de problemas de ADR-034** (§4.3) — depende do plano daquele ADR.
4. **`x-required-scope` por operação** — hoje o escopo exigido está no código (`@Scopes`), não no
   documento; declará-lo é decisão de contrato.
5. **Herdadas, não tocadas:** `key`/`is_key` `required` no spec; `Sunset` do `ErrorResponse`;
   `format: uri` / `^(A|B|C|D)$` / `{}`; `additionalProperties: false` em respostas; aviso de 90 dias
   (§4.4) do *tightening* de A5a; `201`+`Location`; remoção de `/auth/refresh`; `cryptoRandom()` em
   `auth.controller.ts`; ADRs `031–032, 034–039, 041–043` `Proposed`.
6. **A6 é a próxima fase** (superfície de erro/observabilidade) e não foi iniciada.

---

## 10. O que NÃO foi feito e por quê

- **O corpo das rotas** — stub por decisão ratificada; substituí-lo é P1.10/P1.11.
- **`FORCE ROW LEVEL SECURITY` / `SET ROLE` no boot / login membro do role** — §4.2, decisão de
  configuração/implantação, com três opções nomeadas.
- **O catálogo de problemas** (§4.3) — não existe; criá-lo aqui seria produzir o artefato de outro
  ADR.
- **Eventos de staff e de negação no log (§4.6/D6)** — A3/A6, não desta classe.
- **Os 80 `*.spec.{js,js.map,d.ts,d.ts.map}` rastreados** e o
  `tsc -p tsconfig.test.json --noEmit` vermelho (TS6059 + TS5110) — P2 herdados; nenhum criado por
  A5b, e o gate real (`npm run typecheck`) passa.

---

## Apêndice — evidência crua

```
# 1. O spec do D3 (PGlite; a mesma suíte roda no job `rls-integration`, PostgreSQL 16)
$ npm test -- --no-coverage tests/integration/learner-scope-rls.spec.ts
  ✓ hands the connection to the application in the application role, not as its owner
  ✓ answers the caller its own profile — the positive control the 404 is read against
  ✓ refuses another learner's profile with 404 and a Problem body
  ✓ answers an id that does not exist exactly as it answers another learner — no oracle
  ✓ refuses another learner's mastery with 404
  ✓ refuses another learner's next activity with 404
  ✓ refuses a placement addressed to another learner, and runs the caller's own
  ✓ refuses a practice submission addressed to another learner, and scores the caller's own
  ✓ the row the 404 hid is present: another learner's id exists, and the 404 was not absence
  ✓ serves another learner's profile when no policy is in force — the role is what refuses
  Tests: 10 passed, 10 total

# 2. N-1 — a consulta removida do caminho
$ (patch) npm test -- --no-coverage tests/integration/learner-scope-rls.spec.ts
  ✕ refuses another learner's profile with 404 and a Problem body
  ✓ answers an id that does not exist exactly as it answers another learner ← a vacuidade
  ✕ refuses another learner's mastery with 404
  ✕ refuses another learner's next activity with 404
  ✕ refuses a placement addressed to another learner, and runs the caller's own
  ✕ refuses a practice submission addressed to another learner, and scores the caller's own
  Tests: 5 failed, 5 passed, 10 total

# 3. N-2 — os dois argumentos trocados
$ (patch) integração:  Tests: 6 failed, 4 passed, 10 total
$ (patch) unit:        Tests: 2 failed, 25 passed, 27 total

# 4. O gate completo, no fim de A5b
$ npm run test:gate
  Tests: 5 failed, 8 skipped, 497 passed, 510 total
  PASS: test gate — failing set equals the allowlist (5 known-red from ADR-021); 497 passed, 510 total

$ npm run contract:gate
  PASS: ... every operation that requires a token declares the 401 it can be answered with ...

# 5. O que `rls:check` viu em 134d1da (e deixou de ver em 54a59c9)
$ npm run rls:check
  Rule 1  src/common/auth/token-principal.ts:11
  Rule 1  src/infrastructure/repositories/learner.repository.ts:6
  Rule 1  src/infrastructure/repositories/learner.repository.ts:52
  Rule 1  src/modules/learners/learner-scope.service.ts:20
  Rule 1  src/modules/learners/learners.service.ts:6
  Total: 5 violation(s) → depois: ✓ 133 file(s) scanned, 0 violations

# 6. Contagens do contrato canônico
$ 401: 10 de 10 · 403: 9 de 10 · 404: 8 · securityScheme BearerAuth: presente
```
