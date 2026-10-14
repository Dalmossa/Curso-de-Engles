# Fase A2 — Contrato canônico e gates de contrato

**Data:** 2026-10-14 · branch `main` · `4e2fad0` → **`cdb5cdd`** (9 commits, **nada pushed**)
**Escopo:** `docs/api-spec.openapi.yaml` (canônico), gates de contrato, `main.ts` + `kong.yml` (prefixo §4.4), `CHANGELOG.md`, skill `openapi-spec`. **Nenhum endpoint novo, nenhuma rota nova, nenhuma tabela, nenhum DTO.**
**Veredito:** ✅ **A2 concluída** — D-0, D-1, D-2, D-4, D-5, D-6, e a metade de D-3 que não depende de decisão humana.
**Bloqueio remanescente:** ⛔ **D-3 (remover `/auth/refresh`) está bloqueado por H-1** — ver §8.1.
**Achado que precisa da sua decisão:** as obrigações que A2 herdou dos 13 ADRs **não cabem em uma fase**. Proposta de divisão em §2.8.

---

## 1. Tarefas e veredito

| # | Tarefa (A2) | Veredito | Evidência |
|---:|---|---|---|
| 0 | **R11 / D-0** — gate de teste verde **e confiável**: allowlist por ID + fim do flake | ✅ feito | `3af85a3`; `scripts/test-gate.mjs`, `tests/allowlist/known-failures.json` (5 IDs, ADR-021) |
| 1 | **D-1 / D-2** — separar o canônico da prosa que o envolvia | ✅ feito | `138b561`; `docs/api-spec.openapi.yaml` (YAML puro) + `docs/api-spec.md` (55 linhas) |
| 2 | todo erro do canônico vira RFC 9457 `application/problem+json` + `$ref: Problem` | ✅ feito | `0297436`; 14/14 respostas de erro |
| 3 | achado de A0: `/learners/{learner_id}/mastery` não declarava `404` | ✅ feito | `0297436`; §2.3 |
| 4 | **D-5** — gate de contrato real, substituindo o `String.includes` de 31 linhas | ✅ feito | `809d68f`; `scripts/contract-gate.mjs` (432 l.) + 18 casos |
| 5 | **D-5 (cont.)** — `endpoints.spec.ts` deixa de proteger o defeito de media type | ✅ feito | `4b10007` |
| 6 | **D-6** — o contrato declara de que revisão derivou, e o gate verifica | ✅ feito | `983ab6d`; `info.x-contract-provenance`, 6 blobs, regra `pin` |
| 7 | **D-4** — o skill deixa de ser a terceira cópia do contrato | ✅ feito | `cd484b5`; 888 → 84 linhas |
| 8 | **ADR-031/033 D1** — a aplicação serve `/api/v1`; Kong acompanha | ✅ feito | `d3747db` |
| 9 | **ADR-033 D7 passo 4** — o `kong:check` passa a ler o canônico | ✅ feito | `d3747db`, `cdb5cdd` |
| 10 | **ADR-033 D6 / §4.4** — CHANGELOG com *o que quebrou, quem é afetado, o que fazer, desde quando* | ✅ feito | `cdb5cdd` |
| 11 | **D-3** — remover `/auth/refresh` | ⛔ **BLOQUEADO** por H-1 | §8.1 |

**Contagem:** 9 commits, +1.081 / −979 em 12 arquivos. **A2 é fase de contrato, de gates e de prefixo** — não de comportamento. O que A0 mediu como estruturalmente quebrado (BOLA, RLS inalcançável, `items[].key` servido ao cliente, mocks em 8 de 12 rotas, `/auth/refresh` devolvendo token) **continua como estava**, e por desenho: cada item custa código de aplicação e tem ADR próprio (§2.8).

---

## 2. Achados

### 2.1 O gate que escrevi em A2.4 tinha um ponto cego, e ele só apareceu quando eu mexi no código

Ao aplicar D1 (`@Controller({ version: VERSION_NEUTRAL })` no health controller), o `contract:gate` reprovou:

```
FAIL: stale exemption: /health is exempted but no controller implements it
FAIL: stale exemption: /ready is exempted but no controller implements it
```

O extrator de rotas casava `@Controller('x')` por regex e **não entendia a forma de objeto**. Com isso ele deixava de ver o controller inteiro — e a falha **não** aparecia como "rota faltando" (que pareceria grave), e sim como *exemption obsoleta*.

Generalizando, porque é a classe de erro que este repositório inteiro combate: **um gate que lê menos implementação do que existe não reporta a lacuna — reporta concordância.** Foi o mesmo defeito do `String.includes` que o ADR-040 D5 mandou substituir, em grau menor. Correção: o extrator passou a ler as três formas (`@Controller()`, `('x')`, `({...})`), com o porquê no código e controle negativo N-16/N-17 (§5).

### 2.2 Duas entradas do CHANGELOG descreviam um estado que o código nunca teve — e nenhum gate lê o CHANGELOG

As linhas *"Base URL gains an `/api` prefix"* e *"Global path versioning enforced"* atribuíam o prefixo e o `enableVersioning` à ADR-012. Medido em A0:

```
$ grep -rn "setGlobalPrefix\|enableVersioning\|VersioningType" src/
(nada)
```

O arquivo registrava uma mudança de **documento** como se fosse de **comportamento**. Não é erro de digitação: é a diferença entre um changelog escrito *antes* do código e um changelog *de* código — e um registro antecipado é indistinguível de um registro de algo que existe. As duas linhas ficaram com correção datada e a metade que faltava entrou na tabela de *breaking*, onde a §4.4 a põe.

**Achado colateral, do mesmo tipo:** `CHANGELOG.md` não é lido por gate nenhum — nem `verify-integrity.py` (varre o repositório de conteúdo) nem `contract:gate` (varre o contrato). Escrevi uma checagem de largura de coluna na hora, e ela encontrou um defeito **pré-existente**: a linha da emenda dos três schemas de `/content/*` tem **4 células numa tabela de 3** (um `|` não escapado no meio do texto). É exatamente a classe do check **[12]** do `verify-integrity.py` — *"uma regex destinada a remover uma coluna removeu a coluna de glosas"* — encontrada **lá** porque havia um check. Aqui não há. Não corrigi a linha (defeito alheio a A2; R8 pede edição mínima): fica registrada como candidato a check novo.

### 2.3 O drift inverso: o spec obsoleto declarava um 404 que o canônico não declarava

A0 mediu o canônico **perdendo** conteúdo em relação ao obsoleto. `/learners/{learner_id}/mastery` é o contrário: o obsoleto publicava `404`, o canônico não. E o lado certo é o obsoleto — R6 diz que objeto de outro aprendiz responde **404, não 403**, logo um GET com parâmetro de caminho *precisa* declarar 404. Corrigido em `0297436`, com a regra correspondente no gate (N-9).

Consequência metodológica: "qual dos dois documentos é o canônico" não é o mesmo que "qual dos dois está certo". D-1/D-2 decidiu o primeiro; a comparação linha a linha resolveu o segundo.

### 2.4 Dois buracos na política de depreciação tornam regras inaplicáveis — e um deles eu criei

Estão agora escritos no próprio `CHANGELOG.md` (§*Deprecation policy*), porque nenhum dos dois é visível lendo a tabela:

**(a) A §4.4 mandava uma forma de header que o IETF aposentou — resolvido em 2026-10-14.** Ela exigia `Deprecation: true`; o RFC 9745 (mar/2025) §2.1 define `Deprecation` como uma **data** (RFC 9651 §3.3.7, serializada `@<unix-seconds>`), e o booleano era a forma do draft. A emenda é o ADR-033 D2, que **foi ratificado** (§10, adendo) e levou `CONSTITUTION.md` §4.4 a **v2.2.0**. *Correção de uma frase que eu havia escrito aqui:* o texto acima dizia que §4.5 manda "seguir convenções e não prosa" — **essa frase não existe na §4.5**. A contradição era real, mas a citação era inventada; removida.

**A consequência que A2 criou, e como ela terminou:** entre `809d68f` e a ratificação, o `contract:gate` **rejeitava `Deprecation: true`** (ADR-040 D5.4) enquanto a §4.4 vigente o **mandava** — o gate aplicando um ADR `Proposed` contra uma cláusula vigente. Isso está fechado: a §4.4 agora manda a forma que o gate aceita. A regra do gate continua **inerte** (nenhum path do spec canônico declara `Deprecation` hoje), e por isso o `Sunset ≥ Deprecation` que a §4.4 v2.2.0 exige **não é verificável por gate ainda** — não há valores sobre os quais comparar.

**(b) O portão de 30 dias não tem instrumento.** A regra exige "sem tráfego externo por 30 dias consecutivos", e `iac/kong/kong.yml` não configura **nenhum** plugin de log de acesso, observabilidade ou correlação. Uma depreciação pode ser **anunciada** (`Deprecation` + `Sunset`) e **não** pode ser **aposentada** por evidência (ADR-033 D4).

### 2.5 O prefixo era a única mudança de A2 capaz de quebrar um cliente — e o alcance foi medido antes de editar

Medido antes: **nenhum teste sobe a aplicação, nenhum cliente HTTP, nenhum IaC chama a API** (`src/main.ts` é o único arquivo com `app.listen`; não há `supertest` nem `fetch` em teste). O alcance real de D1 é `main.ts`, `kong.yml` e dois checks.

Ainda assim a mudança tinha duas consequências não-óbvias, e **as duas foram encontradas pelo gate, não por leitura**: o ponto cego do extrator (§2.1) e o `kong:check`, que derivava cobertura do spec **obsoleto** e comparava segmentos sem normalizar o prefixo.

**Decisão de projeto dentro de D1:** os probes `/health` e `/ready` ficam **na raiz** (`VERSION_NEUTRAL` + `exclude` do prefixo). Motivo: são consumidos pelo orquestrador e pelo Kong, não são superfície de API, e o próprio `contract:gate` já os isenta pela mesma razão. Alternativa rejeitada: versioná-los também, o que faria o liveness probe de todo cluster depender do número da versão da API.

### 2.6 O pin: seis arquivos — e a primeira correção de número que faço em mim mesmo

`info.x-contract-provenance.spec-blobs` fixa o blob de cada spec de que o contrato deriva. Medido, hoje:

| Arquivo pinado | blob (`git hash-object`) |
|---|---|
| `specs/assessment-item-spec.md` | `ccad934d…b35b47f` |
| `specs/curriculum-graph-spec.md` | `b809be2a…5424b16c` |
| `specs/listening-corpus-spec.md` | `295e1b85…47535f2f` |
| `specs/post-lesson-practice-spec.md` | `9566fe60…c7dd9c59` |
| `specs/stats-progress-evaluation-spec.md` | `a8ae6bb6…84d86cc8` |
| `external-sources.md` | `3aba1a1c…3b6e8cb0` |

**Seis** arquivos, `derived-at: 2026-10-14`. A mensagem do commit `983ab6d` diz *"Sete arquivos pinados"* e lista seis — erro meu, no número, não na lista. R2 vale para mim também: junto com ele há mais dois números que as mensagens afirmam errado e este relatório mede certo:

| Commit | Mensagem diz | Medido |
|---|---|---|
| `983ab6d` | "Sete arquivos pinados" | **6** blobs |
| `cd484b5` | "887 → ~100 linhas" | **888 → 84** linhas |
| `cd484b5` | "carregava 862 linhas (16–877)" | ✅ 862 (correto) |

**Não reescrevi a história.** `git rebase` exigiria mexer nos 7 arquivos `packs/a2/*.md` modificados e não commitados que **não são meus**, e reescrever mensagens/commits é decisão sua. Se quiser, é um `git rebase -i` de quatro commits.

### 2.7 O achado de escopo: A2 herdou mais trabalho do que cabe em uma fase

Ao implementar, ficou claro que o conjunto de obrigações que os 13 ADRs de A1 atribuem a "A2" não é uma fase — é pelo menos quatro. Elas estão espalhadas por ADRs diferentes, e cada uma exige código que A2, por definição, não escreve. Implementar 20% de cada e chamar de pronto seria violar R7 (DONE exige evidência) e R8 (uma classe por commit).

Proposta — **para sua ratificação; não decidi sozinho**:

| Fase | Escopo | Por que não cabia em A2 | ADRs |
|---|---|---|---|
| **A3** | *um* contrato, *um* leitor: remover `docs/api/openapi.yaml` e repontar seus **5 leitores**; unificar `endpoints.spec.ts` com o gate (hoje se sobrepõem em 2 blocos) | depende de A2 fechado (o canônico tinha de existir e ser verificável) — **agora está** | ADR-040 D3 |
| **A4** | erros de verdade: `ProblemExceptionFilter` emitindo `problem+json` com `type`/`title`/`status` reais (hoje `application/json`, `type: https://httpstatuses.com/{status}`, `title = <código>`), catálogo `problem-types.md`, `code`/`trace_id`/`errors[]` | toca o filtro global e **todo** teste que asserta corpo de erro — é a maior superfície do plano | ADR-034 D1–D3 |
| **A5** | autorização por objeto e RLS: `PgSessionContext` nas 5 rotas `/learners/*` (**nenhuma** usa; 15 tabelas de RLS inalcançáveis), 404-e-nunca-403, primeira leva de DTOs de request (**zero** hoje, o que torna `whitelist`/`forbidNonWhitelisted` inertes), e `/auth/refresh` deixa de devolver `mock_access_token` | exige o guard e o sujeito da requisição (ADR-013) — é código de aplicação, não de contrato | ADR-038, ADR-013, ADR-026 |
| **A6** | confidencialidade: `content.service.ts:237` serve `items[].key` — o gabarito sai na resposta | **uma linha de `select`**. É o único item de R6 que é trivial, e exatamente por isso não pode esperar uma fase grande | R6, ADR-027 §3 |
| **A7+** | paginação (032), idempotência (035), cache condicional/ETag (036), jobs assíncronos (037), forma do 429 (039), CORS (043) | cada uma é um ADR inteiro; agrupá-las é o que produziu a fase-elástica | 032, 035, 036, 037, 039, 043 |

Se a divisão for aprovada, sugiro **A6 primeiro** (uma linha, fecha um vazamento de gabarito) e **A3 em seguida** (os leitores do spec obsoleto, enquanto a memória de onde estão é fresca). Se preferir o plano original, a consequência é que "A2" segue aberta por várias sessões e cada relatório terá de dizer o que ficou.

---

## 3. Arquivos / commits

| Commit | Classe | Arquivos | Δ |
|---|---|---|---|
| `3af85a3` | gate de teste + allowlist (D-0) | `scripts/test-gate.mjs`, `tests/allowlist/known-failures.json`, `bkt-engine.spec.ts` | +2 novos |
| `138b561` | separação canônico / prosa (D-2) | `docs/api-spec.openapi.yaml`, `docs/api-spec.md` | +70 / −40 |
| `0297436` | 14 erros → `problem+json`; 404 de mastery | `docs/api-spec.openapi.yaml` | +50 / −4 |
| `809d68f` | gate de contrato (D-5) | `scripts/contract-gate.mjs` (432 l.), `tests/contract/gate.spec.ts` (240 l.), `package.json` | +529 |
| `4b10007` | `endpoints.spec.ts` repontado | `tests/contract/endpoints.spec.ts` | +31 / −19 |
| `983ab6d` | pin de proveniência (D-6) | `api-spec.openapi.yaml`, `contract-gate.mjs`, `gate.spec.ts` | +99 |
| `cd484b5` | skill deixa de duplicar (D-4) | `.opencode/skills/openapi-spec/SKILL.md` | +75 / −879 |
| `d3747db` | prefixo `/api/v1` (D1) | `main.ts`, `health.controller.ts`, `kong.yml`, `kong-config-check.mjs`, `contract-gate.mjs`, `gate.spec.ts` | +158 / −22 |
| `cdb5cdd` | CHANGELOG (+ asserção 7 repontada) | `CHANGELOG.md`, `kong-config-check.mjs` | +43 / −15 |

`docs/api-spec.openapi.yaml`: **1.174 linhas**, YAML puro (era 1.108 depois do split, 1.108+20 do pin+respostas de erro).

---

## 4. Saídas dos gates — ANTES → DEPOIS

| Gate | A0/A1 (antes) | A2 (depois) | O que mudou |
|---|---|---|---|
| `npm run test:gate` | 🔴 vermelho **e não-determinístico** | ✅ PASS — **360 passed, 5 failed (allowlist), 8 skipped**, 373 total | allowlist por ID + flake removido |
| `npm run contract:check` | ✅ PASS — mas **incapaz de falhar** pelas razões que existem | ✅ PASS (inalterado; sai em A3) | — |
| `npm run contract:gate` | — | ✅ PASS — 13 regras, 432 linhas | substitui o anterior em A3 |
| `npm run kong:check` | ✅ PASS — cobertura derivada do spec **obsoleto** | ✅ PASS — lê o **canônico**, normaliza o prefixo, 9 asserções | ADR-033 D7 passo 4 |
| `npm run domain:check` | ✅ 0 violações (23 arquivos) | ✅ 0 violações | — |
| `npm run rls:check` | ✅ 0 violações (120 arquivos, escritor único) | ✅ 0 violações | — |
| `npm run lint` | ✅ | ✅ 0 erros, 3 avisos | — |
| `npm run typecheck` | ✅ | ✅ | — |
| `node scripts/migration-check.mjs` | ✅ 13/13 (pglite) | ✅ 13/13 | — |
| `node scripts/curriculum-check.mjs` | ✅ 18 módulos / 123 lições | ✅ inalterado | — |
| `python3 verify-integrity.py` | ✅ PASS | ✅ PASS — 0 falhas, 1 aviso | — |
| `python3 prd-score.py` | 92.6% | **92.6%** (limiar 80%) | — |

**Nota de infraestrutura, a registrar:** `migration:check` **não existe** como script npm. O `package.json` tem 8 scripts de gate (`typecheck`, `lint`, `domain:check`, `rls:check`, `contract:check`, `contract:gate`, `kong:check`, `test:gate`). Mas `migration-check.mjs`, `content-check.mjs`, `curriculum-check.mjs`, `contract-check-full.mjs` e `verify-release-gates.py` **existem sem npm script** — ou seja, não entram em CI por nome. "Todos os gates verdes" pode significar conjuntos diferentes em duas sessões; vale fixar a lista (candidato: um `gate:all`).

---

## 5. Controles negativos executados (R7)

Todo item é execução real com a saída observada. "Em cópia" = o gate rodou sobre uma cópia mutada do spec ou de `src/`; "real" = o artefato de verdade foi alterado e restaurado.

| # | Controle | Resultado observado |
|---|---|---|
| A2.1 | allowlist nos dois sentidos: (N-A) remover a entrada de um teste que falha; (N-B) deixar entrar falha não listada | `test:gate` reprova nos dois casos |
| A2.4 | 13 mutações do spec, em cópia: `components.schemas` vazio; método trocado; path fictício; path removido com rota viva; `servers` sem `/api/v1`; `Problem` removido; erro em `application/json`; GET com parâmetro sem 404; `Deprecation` booleano; documento dentro de fence Markdown; rota implementada e não publicada; exemption obsoleta | 13 × `FAIL` com a regra nomeada (N-1…N-13) |
| A2.5 | contra o spec **obsoleto**, `endpoints.spec.ts` | `Expected: "#/components/schemas/Problem"` / `Received: "#/components/schemas/ErrorResponse"` |
| A2.6 | N-14 blob divergente no pin (cópia) | `FAIL: pin`, exit 1 |
| A2.6 | N-15 pin ausente (cópia) | `FAIL: pin`, exit 1 |
| **A2.6** | **real:** um byte acrescentado a `specs/listening-corpus-spec.md` | `FAIL: pin: … pinned 295e1b8546d0, actual 827f3be3fbe8` → revertido → PASS |
| A2.8 | N-16 `setGlobalPrefix` removido do `main.ts` (cópia) | `FAIL: prefix`, exit 1 |
| A2.8 | N-17 `VersioningType.URI` → `HEADER` (cópia) | `FAIL: prefix`, exit 1 |
| **A2.8** | **real:** rota do Kong revertida para `/content` | `FAIL: route "content-route" path "/content" is not under /api/v1 …` → restaurado → PASS |
| **A2.9** | **real:** segmento `/catalog` criado no canônico, sem rota Kong | `FAIL: no kong route covers openapi first segment "/catalog"` → restaurado → PASS |

Total: **18 casos automatizados** em `tests/contract/gate.spec.ts` (1 positivo + 17 negativos) mais **3 controles reais** executados à mão sobre artefatos de verdade.

---

## 6. Desvios registrados

1. **`@stoplight/spectral` não foi adotado (D5.2).** O ADR-040 D5.2 nomeia o Spectral como ferramenta do gate. Não há ruleset no repositório, o pacote não está em `node_modules`, e adotar toolchain nova é fato de versão (R9 — exigiria fonte primária com URL e data). O que D5.2 exige **de fato** — `$ref` resolve, documento é 3.1, `components.schemas` não vazio — está implementado. Registrado aqui e no commit.
2. **O media type é afirmado só no gate (contraria a redação literal de D5.7).** D5.7 diz que `endpoints.spec.ts` deve repetir a asserção de media type. Não dupliquei: D5.1 manda cada obrigação viver num lugar, e duplicar é o defeito que o ADR-040 remove. O gate afirma; `endpoints.spec.ts` cobre instância × schema. Registrado no commit.
3. **`endpoints.spec.ts` foi repontado ao canônico já em A2** (adianta parte de D3/A3), porque a correção da linha 59 não era verificável contra o documento errado.
4. **O `kong:check` passou a ler o canônico já em A2** — ADR-033 D7 passo 4, que só fazia sentido depois de D1.
5. **Os probes ficam fora do prefixo** — decisão de projeto dentro de D1, documentada em `main.ts`, `kong.yml` e nas asserções 6–7 (§2.5).

---

## 7. Como o gate novo se distribui (uma obrigação por lugar)

| Artefato | Obrigação | Não faz |
|---|---|---|
| `scripts/contract-gate.mjs` | spec × implementação: parse/3.1, `$ref`, `servers`, `Problem`, media type, 404 em GET, rotas nos **dois sentidos**, método por path, prefixo da aplicação, pin de proveniência | não valida instâncias contra schema |
| `tests/contract/schemas.spec.ts` | instância × schema; guarda de drift entre documentos | não compara com as rotas |
| `tests/contract/gate.spec.ts` | controles negativos **do próprio gate** | não é gate de release |
| `tests/contract/endpoints.spec.ts` | ainda se sobrepõe ao gate em 2 blocos → **consolidar em A3** | — |

---

## 8. Pendências humanas e bloqueios

### 8.1 O que bloqueava D-3 — **resolvido no mesmo dia** (ver §10)

**H-1 — emenda da §4.4 para a forma RFC 9745 de `Deprecation`.** Sem ela, remover `/auth/refresh` exigiria publicar `Deprecation: true`, que o `contract:gate` (por ADR-040 D5.4) rejeita. **Você ratificou H-1 em 2026-10-14**; a §4.4 está em v2.2.0 e o ADR-033 virou `Accepted`. **A rota não foi removida** — D-3 está desbloqueado, mas é trabalho de outra fase (§10).

Quando for feito, D-3 tocará (medido, para não redescobrir):

| Superfície | Estado hoje |
|---|---|
| `docs/api-spec.openapi.yaml` | `/auth/refresh` com `x-mvp-scope: excluded`, resposta `501` |
| `src/**/auth.controller.ts` | devolve `{ access_token: 'mock_access_token' }` (viola R6 / ADR-013) |
| `iac/kong/kong.yml` | `auth-route` em `/api/v1/auth` |
| `scripts/kong-config-check.mjs` | asserção 8 exige a camada de rate-limit do `/auth` (S-03, 5/min) |
| `scripts/contract-check.mjs` (antigo) | lista `/auth/refresh` entre os 10 paths |
| `CHANGELOG.md` | *Deprecated*: **"No sunset date. Blocked on ADR-013"** |

### 8.2 Continua `Proposed` (você não autorizou decidir)

| ADR | Tema | Precisa de |
|---|---|---|
| 041 | H1 — catálogo somente-leitura × superfície de autoria | decisão de produto |
| 042 | H2 — LGPD apagamento × `append_only_events` WORM | **parecer jurídico** (LGPD art. 18/19 vs. registro imutável) |
| 043 | H3 — janela de depreciação, CORS, SDK, exposição de θ | decisão de produto + K-3 do PRD |
| ~~033 D2~~ | ~~forma do header `Deprecation`~~ | ✅ **ratificado em 2026-10-14** (§10) |
| 031, 032, 034–040 | as demais decisões de contrato de A1 | várias já foram **ratificadas por decisão sua** e implementadas com o frontmatter ainda `Proposed` — ver o `docs/adr/README.md` §*Open ADRs*, ponto 1. Virar o status de 040 é bookkeeping de A3 (o último item não marcado dele é D3) |

### 8.3 UNVERIFIED que A2 **não** resolveu (não usar número inventado)

Continuam abertos de A1: TTL da chave de idempotência; `max-age`/ETag de coleção; `limit` default e máximo e TTL do cursor (ADR-032); `Retry-After` por camada e por tipo de job (ADR-039); validade de `links.result` (ADR-037); prazo de eliminação LGPD. `Range`/`206` para áudio está fora de escopo (ADR-028). Os "<30 dias" do BACKLOG e os "48h/72h" seguem UNVERIFIED.

---

## 9. O que NÃO foi feito e por quê

- **Nenhum código de aplicação além de `main.ts` e do health controller.** A2 é fase de contrato.
- **BOLA, RLS, DTOs, guard de auth, `items[].key`, mocks** — inalterados; cada um tem ADR e fase (§2.7).
- **`docs/api/openapi.yaml` não foi removido** — é A3, depois de o canônico estar fechado (ADR-040 D3).
- **`spectral`** — §6.1.
- **A linha de 4 células do `CHANGELOG.md`** — §2.2; defeito alheio a A2.
- **As mensagens de commit com números errados** — §2.6; reescrever história exige mexer nos 7 arquivos `packs/a2/*.md` modificados e não commitados, que são pré-existentes e **não são desta missão**. Não toquei neles.

---

## Apêndice — evidência crua

```
$ npm run test:gate
PASS: test gate — failing set equals the allowlist (5 known-red from ADR-021); 360 passed, 373 total
Test Suites: 1 failed, 1 skipped, 22 passed, 23 of 24 total
Tests:       5 failed, 8 skipped, 360 passed, 373 total

$ npm run contract:gate
PASS: contract gate — canonical spec parses, servers carry /api/v1, errors are application/problem+json,
      and spec × routes agree in both directions

$ npm run kong:check
PASS: Kong config checks (1 service, 5 routes, 3 rate-limiting plugins, 9 assertions)

$ npm run domain:check   → ✓ 23 file(s) scanned, 0 violations
$ npm run rls:check      → ✓ 120 file(s) scanned, 0 violations
                           (single writer: src/infrastructure/persistence/pg-session-context.ts, set_config(…, true))
$ npm run lint           → 0 errors, 3 warnings
$ node scripts/migration-check.mjs  → ✓ migration-check green
$ python3 verify-integrity.py       → RESULT: PASS — 0 failures, 1 warning
$ python3 prd-score.py              → TOTAL 92.6/100.0 = 92.6%   threshold 80.0%

# controle negativo real do pin (arquivo de verdade, não cópia):
FAIL: pin: specs/listening-corpus-spec.md changed since the contract was derived
      (pinned 295e1b8546d0, actual 827f3be3fbe8) — review the diff and re-derive before moving the pin
FAIL: contract gate — 1 violation(s)                                  [exit 1]

# controle negativo real do prefixo no gateway:
FAIL: route "content-route" path "/content" is not under /api/v1
      (CONSTITUTION §4.4 requires /api/v1; only the probes are exempt)

# controle negativo real da cobertura do Kong (lê o canônico):
FAIL: no kong route covers openapi first segment "/catalog" (ADR-030 D7)
```

**Fontes primárias usadas nesta fase** (R2/R9, com URL e data):
RFC 9745 (mar/2025) — forma `sf-date` do campo `Deprecation`; documentação de versioning do NestJS (`nestjs/docs.nestjs.com`, `http/versioning`) — `VERSION_NEUTRAL` (URI: sem segmento de versão) e a ordem prefixo → versão. Comportamento conferido contra a versão instalada: **`@nestjs/core` 10.4.5** (`node_modules/@nestjs/core/package.json`).

---

## 10. Adendo — as duas respostas chegaram (2026-10-14)

Depois de o relatório acima ser escrito, você respondeu às duas perguntas de §8. O registro desta
seção existe para que a fase não fique contando uma história que deixou de ser verdade.

### 10.1 H-1 — **ratificada**; a §4.4 está em v2.2.0

Ato humano executado no mesmo dia, pelo processo da §9:

| Artefato | O que mudou |
|---|---|
| `CONSTITUTION.md` §4.4 | a linha `Deprecation` passa a mandar `Deprecation: <sf-date>` (RFC 9745 §2.1 → RFC 9651 §3.3.7, `@<unix-seconds>`), mantém `Sunset: <HTTP-date>` (RFC 8594) e **acrescenta** `Sunset` não-anterior a `Deprecation` (RFC 9745 §4). O escopo do campo passa a ser **o recurso** (RFC 9745 §2.2), com a obrigação de documentar escopo maior |
| `CONSTITUTION.md` §9 | changelog `2.2.0 — Ratified`, com o defeito identificado (**H-1**) e a seção **"2.2.0 — What weakens"** exigida pelo passo 3. O cabeçalho passa a `Version: 2.2.0 · Status: Ratified · Pending: 2.1.0` |
| `docs/adr/033-...md` | `status: Proposed` → **`Accepted`**; seção **Status** no topo; **D5 retirado** com a citação da RFC 9745 §2.2 e a tabela que separa as duas granularidades (escopo do header × métrica de aposentadoria); plano de implementação com o que está feito e o que não está |
| `docs/adr/README.md` | linha 033 → `Accepted`; a seção *Open ADRs* deixou de dizer que 031–043 estão todas `Proposed`, e passou a registrar que **`Proposed` não significa "não usado"** — 040 e 031/033 D1 têm decisões ratificadas e implementadas com o frontmatter ainda `Proposed` |
| `CHANGELOG.md` | a nota da política de depreciação foi reescrita: um dos dois buracos **fechou**, o outro (o portão sem instrumento) continua; a tabela restata da §4.4 passou à forma nova |
| `scripts/contract-gate.mjs` | a mensagem da regra `Deprecation` citava `CONSTITUTION §4.4` como se ela mandasse o booleano. Agora cita a RFC 9745 §2.1 e a §4.4 **v2.2.0** — gate e constituição concordam |
| `.opencode/skills/openapi-spec/SKILL.md` | a linha da regra idem |

**Duas coisas que só apareceram ao executar a emenda, e que valem mais que a emenda:**

1. **O ADR-033 D5 estava errado, e o `Proposed` escondia isso.** D5 dizia *"depreciação é anunciada por
   versão inteira, nunca por endpoint solto"*, justificado pela métrica de 30 dias. RFC 9745 §2.2 diz o
   oposto sobre o escopo padrão do header — **o recurso** — e é explícita que o escopo maior é
   *"invisible for consumers who are unaware of the increased scoping rules"*. O erro era uma troca de
   granularidades: a **métrica de aposentadoria** é por prefixo; o **escopo do header** é por recurso.
   Retirei D5 e reabri a Alternativa 6 (que existia exatamente para rejeitar depreciação por endpoint).
   *Achado no processo:* enunciar a decisão em voz alta (escrever o diff da emenda) foi o que expôs a
   troca — o ADR `Proposed` havia sido lido duas vezes sem que ela aparecesse.
2. **Eu havia citado uma regra que não existe.** O texto de A2 que registrava a contradição dizia que
   *"§4.5 manda seguir convenções e não prosa"*, e **a §4.5 não contém essa frase** (a §4.5 é *Security,
   Authentication & Data Sanitization*). A contradição entre §4.4 e RFC 9745 era real e está medida;
   a citação era inventada. Corrigida no `CHANGELOG.md` e em §2.4(a) acima, com a marca de que foi
   correção e não omissão — porque uma citação inventada em um arquivo normativo é exatamente o defeito
   que este repositório persegue, e quem o comete é quem deve carregá-lo.

**O que continua em aberto depois de H-1:** o portão de aposentadoria ainda não tem instrumento
(`kong.yml` sem plugin de log — medido de novo em 2026-10-14); a ordem `Sunset ≥ Deprecation` não é
verificável por gate enquanto nenhum path declarar `Deprecation`; e os 90/180 dias continuam como a §4.4
já dizia (a ratificação de D3 é disso).

### 10.2 A divisão de fases — **aprovada**

A proposta de §2.7 foi aprovada como está: **A3** (um contrato, um leitor: remover
`docs/api/openapi.yaml` e repontar os 5 leitores; unificar `endpoints.spec.ts` com o gate), **A4**
(erros `problem+json` de verdade no filtro, catálogo `problem-types.md`, `code`/`trace_id`/`errors[]`),
**A5** (RLS/`PgSessionContext`, 404-não-403, primeiros DTOs de request, `/auth/refresh` deixando de ser
mock), **A6** (parar de servir `items[].key`), **A7+** (paginação, idempotência, cache, jobs, 429, CORS).
A próxima fase é **A3**.

**D-3 (`/auth/refresh`) fica para depois de A3**, como combinado na pergunta de H-1 — e agora não tem
mais bloqueio constitucional. O que resta decidir sobre ele **não** é o header: é o que a §4.5 já diz
(*"`/auth/refresh` is out of MVP scope"*) — o endpoint não é algo a depreciar, é algo que nunca deveria
ter sido implementado, e a rota existe em `auth.controller.ts` devolvendo `mock_access_token`. Tratar
isso é A5, não depreciação.

---

**Próximo passo — paro aqui, de novo.** As duas decisões que eu precisava chegaram e estão registradas
acima; a fase A2 está fechada com a emenda constitucional no lugar. Diga **"continuar"** para eu abrir
**A3** (remover o spec obsoleto e repontar seus 5 leitores — nada nele depende de decisão humana).
