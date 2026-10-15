# Fase A4 — O erro *servido* é o do contrato

**Data:** 2026-10-14 · branch `main` · `17f2927` → `8ba778c`, **5 commits** (o 5º é este relatório)
**Não há remoto configurado** — `git remote -v` é vazio, nada foi publicado.
**Escopo:** o corpo de erro que a plataforma **serve**; o id de correlação (`CONSTITUTION.md` §4.6); a
raiz de composição; os sete `throw` de controller que montavam o seu próprio corpo; o `ErrorResponseDto`
morto; `scripts/contract-gate.mjs` + `tests/contract/gate.spec.ts`; `CHANGELOG.md`; `BACKLOG.md` P1.17;
`docs/api-spec.md`; a nota do spec canônico; notas de estado em `ADR-034` e `ADR-043`.
**Nenhum endpoint, migration, schema ou rota novos.**

**A fase foi cortada em duas por medição, não por preferência.**

| metade | conteúdo | o que a autoriza | estado |
|---|---|---|---|
| **A4a** | o filtro serve `Problem` (media type, `about:blank`, `title`, `status`, `detail`, `instance`), o id de correlação por requisição, os 7 `throw` de controller, o DTO morto, a raiz de composição, o gate | o spec canônico já declara `Problem` em **14 de 14** respostas 4xx/5xx; `CONSTITUTION.md` §4.3 manda RFC 9457, §4.5 minimização, §4.6 correlation id | **entregue** |
| **A4b** | `code`, `errors[]` com JSON Pointer, catálogo `docs/api/problem-types.md`, domínio canônico das URIs de `type`, `406` | ADR-034 está **`Proposed`** e o primeiro item do plano é *"Bloqueado — ato humano: decidir o domínio canônico das URIs de `type` (D1)"* | **bloqueado** (§8.1) |

---

## 1. Tarefas e veredito

| # | tarefa | veredito | evidência |
|---|---|---|---|
| 1 | media type `application/problem+json` em toda resposta de erro | ✅ | `PROBLEM_CONTENT_TYPE` + `res.type()`; o teste HTTP lê o `content-type` da resposta e proíbe o literal `application/json` |
| 2 | `type: about:blank` — nunca a URI de terceiro (`httpstatuses.com/{status}`) | ✅ | `ABOUT_BLANK`; unit: `expect(...).not.toMatch(/httpstatuses\.com|https?:\/\//)` |
| 3 | `title` = frase do status HTTP, estável por tipo (RFC 9457 §4.2.1) | ✅ | `http.STATUS_CODES`; unit: `"Not Found"`, não `not_found` |
| 4 | `status` = o código efetivamente enviado (RFC 9457 §3.1.2) | ✅ | HTTP: o corpo e a linha de status são lidos juntos |
| 5 | `detail`: só em 4xx, **string**, omitido quando repetiria o `title`, e **nunca** interno | ✅ | array de `ValidationPipe` juntado com `"; "`; 5xx sem `detail` — unit **e** HTTP, com spy no log |
| 6 | `instance` = o caminho **sem** a query string (§4.5) | ✅ | unit: `?token=…` não aparece no `instance` |
| 7 | `request_id` = **um id por requisição** (§4.6), não um por resposta | ✅ | HTTP: dois erros seguidos não compartilham id; o header carrega o mesmo valor |
| 8 | o id volta ao cliente em **toda** resposta (média, não só erro) | ✅ | HTTP: asserção em sucesso **e** em erro |
| 9 | os **sete** `throw` que montavam `{error, message, request_id}` | ✅ | viraram mensagens simples; `grep -rn "error: '" src/` = **0** |
| 10 | o `ErrorResponseDto` órfão | ✅ | `grep` dava **0** referências; removido |
| 11 | a raiz de composição existe e é **a mesma** que embarca | ✅ | `src/app.setup.ts` (`configureApp`); `main.ts` 51 → **19** linhas |
| 12 | o gate lê as raízes de composição, não `main.ts` | ✅ | `contract-gate` PASS; **N-19** novo |
| 13 | testes: unit + integration + gate | ✅ | **56** testes nas três suítes (23 + 13 + 20) |
| 14 | doutrina: migração no `CHANGELOG.md`, prosa viva, nota do canônico, `BACKLOG.md` | ✅ | §3 |
| 15 | **A4b** — `code`, `errors[]`, catálogo, domínio de `type`, `406` | ⛔ **bloqueado** | ADR-034 `Proposed`, D1 é ato humano (§8.1) |

---

## 2. Achados

### 2.1 A lacuna estava atribuída a A3, e não era de A3

`CHANGELOG.md` dizia, na linha 56, que *"o documento está à frente do servidor"* e fechava com **"That gap
is A3's"**. A3 removeu um documento; não tocou no filtro. A lacuna era justamente esta fase, e a frase —
escrita em A2 — sobreviveu à fase que supostamente a fecharia. Corrigida com a data e com o motivo.

### 2.2 O spec canônico afirmava o falso em voz de presente

O bloco acima de `Problem` dizia: *"os 9 endpoints publicados **ainda declaram** `ErrorResponse`"*.
Medido: **nenhum** caminho e **nenhuma** operação referencia `ErrorResponse`, e as **14** respostas
4xx/5xx referenciam `Problem` — as únicas ocorrências que sobraram no arquivo são a própria definição e
os comentários que a descrevem. A nota havia sido escrita **à frente** da migração e nunca foi relida.

É a mesma classe de defeito que ela mesma documentava, e o gate não a podia ver: ele afirma que toda
resposta de erro referencia `Problem` (verdade), não que o comentário diga o mesmo.

### 2.3 A tabela *Deprecated* prometia uma data que ninguém podia datar sozinho

A linha do schema `ErrorResponse` dizia: *"Sunset: TBD — set when P1.17 lands"*. P1.17 **é** esta fase.
Chegou o momento e **a data não é derivável de nenhum artefato do repositório**: o prazo é uma escolha de
§4.4 (90 dias para correção, 180 para feature) e os consumidores do schema estão fora daqui. Inventar uma
data seria o tipo de número que R2 proíbe. A linha agora diz que a data é devida, por que não foi
inventada, e aponta para a decisão (§8.4).

### 2.4 Dois membros a mais que o schema — e um deles vazava a query string

O filtro anterior emitia os seis membros **mais** um `details` condicional (7º membro, fora do schema) e,
pior, `instance: request.url`. No Express, `req.url` **inclui a query string**: um `?token=…` ou um
`?email=…` voltava dentro do corpo do erro — o corpo que clientes, proxies e agregadores de log copiam.
§4.5 manda o contrário. `instanceOf()` agora usa `request.path` e cai para o `url` cortado no `?` se o
path não vier; o teste afirma que a query não aparece.

### 2.5 O `request_id` era sorteado por resposta, e havia um segundo id sendo descartado

O filtro gerava um UUID **por resposta**. E os sete `throw` de controller geravam **outro** UUID por
*throw* — que o filtro descartava, porque lia somente `error`/`message`/`details` do objeto lançado. Duas
consequências medidas: dois erros da mesma requisição não compartilhavam id nenhum, e o `request_id` não
servia para correlacionar nada — nem com o log, que não tinha id, nem com o cliente, que não recebia
header nenhum. Agora o id nasce **uma vez por requisição** (middleware), vai para toda resposta e é o
mesmo no corpo e no header.

### 2.6 O `request_id` era descartado — e o `X-Correlation-ID` de entrada podia ser qualquer byte

O middleware adota o id que o cliente manda **só se for UUID**. Um valor com `\n` ou `\r\n` seria injetado
no header e na linha de log (log injection / header injection); não sendo UUID, é substituído. Essa é
também a razão de a asserção existir em teste.

### 2.7 Quatro controladores declaravam `cryptoRandom()` sem nenhum *call site*

`auth`, `practice`, `curriculum` e `placement` declaram `cryptoRandom()` e **não a chamam** — o `grep`
devolve só a linha da definição em cada arquivo, e isso já era verdade em `17f2927`; o helper nasceu em
`ad8bf9e` (P0.6). **Não é desta fase:** nenhum `throw` desses arquivos o usa, então ele não é superfície
de erro. Fica registrado como P2 (§9) em vez de virar diff de A4.

### 2.9 A §4.6 tem quatro obrigações de log, e nenhuma está implementada — o que A4a acrescentou seguiu o padrão da casa

§4.6 pede, no lado do log: *"a `Correlation-ID` is attached to every log line"*, **JSON estruturado**,
*"Every log value is encoded to prevent log injection"* com *"Serialize structured fields; never
interpolate raw strings into a log format"*, redação de PII **no logger**, e `traceparent` (W3C) propagado
em cada salto. Medido no repositório inteiro:

| obrigação de §4.6 | medição |
|---|---|
| OpenTelemetry / `traceparent` | **0** ocorrências em `package.json` e em `src/` |
| logger próprio (JSON estruturado, redação no logger) | **0** — nada chama `app.useLogger` nem implementa `LoggerService`; a plataforma usa o `Logger` textual do Nest |
| "nunca interpolar" | **19** das **28** chamadas de log de `src/` interpolam: 18 são da fila (`task-processor` 12, `queue.service` 6) e **1 é nova** — a de 5xx deste filtro, com a interpolação nas linhas de continuação |
| id em **toda** linha de log | só a linha de 5xx deste filtro carrega o id; as outras 18 não |
| `Correlation-ID` em toda resposta de erro | ✅ — fechado por A4a |

É uma lacuna **anterior** a A4 (18 das 19 interpolações já existiam) e é uma fase de observabilidade, não
um ajuste de erro: um logger conforme precisa ser escrito, e §4.6 pede OTel junto. A4a **não** a fecha e
**não** a piora — mas o que ela acrescentou **não** é conforme, e está registrado assim (§8.7).

**O id do request e o id dos eventos de domínio são dois espaços que não se falam.** Medido:
`createCorrelationId()` (`src/domain/events/domain-events.ts:226`) agrupa eventos de uma sessão no
`adaptive-engine`, e o id HTTP de A4a não chega ao bus — `src/common/http/correlation.ts` é importado só
por `app.setup.ts` e pelo filtro. §4.6 fala em **um** `Correlation-ID`; se são um ou dois é decisão
aberta (§8.7).

### 2.10 A configuração não era alcançável por teste — logo, testar o pipeline só podia testar uma cópia

A configuração inteira vivia em `main.ts`, que também faz bootstrap. Um teste de integração que quisesse
exercitar o pipeline **teria** que repetir `useGlobalPipes`/`useGlobalFilters`/`setGlobalPrefix` — e
assim testaria a cópia, não o que embarca. `configureApp()` extraído para `src/app.setup.ts` resolve
isso, e foi o que obrigou o gate a mudar de alvo (§6).

---

## 3. Arquivos / commits

| commit | assunto | stat |
|---|---|---|
| `7bb9128` | `feat(api)`: o filtro passa a servir o `Problem` do contrato, e o id de correlação passa a ser por requisição | 8 files, +604/−107 (2 novos: `app.setup.ts`, `correlation.ts`) |
| `710b3ec` | `fix(api)`: os sete corpos de erro escritos à mão saem, e o que o cliente recebe passa a ter teste HTTP | 5 files, +340/−52 |
| `c07c098` | `docs(changelog)`: a migração deixa de estar no futuro e passa a dizer o que o cliente deve fazer agora | 1 file, +4/−4 |
| `8ba778c` | `docs(api)`: os documentos que afirmavam o estado antigo em voz de presente passam a afirmar o medido | 5 files, +85/−11 |
| *(este relatório)* | — | — |

`17f2927..8ba778c`: **18 arquivos, +1033 / −174** (dos quais 558 linhas são os dois arquivos de teste
novos; nenhuma linha de migration, schema ou rota).

Documentos **não** tocados, de propósito: `docs/api/inventario.md` (snapshot de A0) e
`docs/security-audit.md` (datado 2026-10-12) — são documentos **datados**, que registram o que foi medido
na data deles; a distinção é a de A3. Ambos citam `main.ts` para o `ValidationPipe`/CORS, que agora vive
em `app.setup.ts`.

---

## 4. Saídas dos gates — ANTES → DEPOIS

| gate | antes (abertura de A4) | depois |
|---|---|---|
| `npm run typecheck` | OK | OK |
| `npm run lint` | 0 erros, 3 *warnings* (arquivos ignorados) | 0 erros, 3 *warnings* (os mesmos) |
| `npm run domain:check` | 23 arquivos, 0 violações | 23 arquivos, 0 violações |
| `npm run rls:check` | 120 arquivos, 0 violações | **121** arquivos, 0 violações (A4 somou 2 arquivos a `src/` e removeu o DTO morto — o censo sobe e desce com o arquivo) |
| `npm run contract:gate` | PASS | PASS |
| `npm run kong:check` | PASS | PASS |
| `node scripts/migration-check.mjs` | 13 passando | 13 passando |
| `npm run test:gate` | PASS (5 vermelhas de ADR-021) | PASS — **361 passando, 5 vermelhas allowlistadas, 8 *skipped*, 374 no total** |

---

## 5. Controles negativos executados (R7)

Sem negativa, uma regra verde não se distingue de uma regra que não roda. Os que provam cada afirmação:

| afirmação | controle negativo | resultado |
|---|---|---|
| o gate impede a API de perder o prefixo `/api/v1` | **N-19** (novo): `main.ts` deixa de chamar `configureApp` — todas as regras de texto continuam satisfeitas | **FAIL** (era o furo: o alvo do gate mudou de arquivo nesta fase) |
| idem, no arquivo que agora carrega a configuração | N-16/N-17 passam a mutar `app.setup.ts` | **FAIL** |
| nenhuma resposta de erro fica sem `Problem` | N-18: uma resposta de erro passa a referenciar `ErrorResponse` | **FAIL** |
| 5xx nunca serializa mensagem interna (§4.3) | exceção de domínio real cuja mensagem contém `app.current_learner_id`: HTTP 500 | corpo **sem** `detail` e sem nenhum fragmento interno; `Logger.prototype.error` espionado prova que a mensagem **e** o correlation id foram para o log |
| `type` não é a URI de terceiro | asserção de que o corpo não casa com `httpstatuses.com` nem com `https?://` | verde |
| a query não volta no `instance` | requisição com `?token=…` | `instance` é só o caminho |
| o id é por requisição, não por resposta | dois erros consecutivos | ids distintos |
| um `X-Correlation-ID` inválido não é ecoado | valor com `\n` | substituído por UUID novo |
| `detail` é string como o schema declara | array de `ValidationPipe` | string única; e o teste afirma que **não** existe membro `errors` |

---

## 6. Desvios registrados

1. **`configureApp` extraído para `src/app.setup.ts`.** Fora do corpo de erro, e feito *porque* o teste de
   integração tinha de montar o que embarca (§2.10). Consequência: o `contract-gate` lia `main.ts` e passou
   a ler as raízes de composição; sem isso o gate passaria a aprovar um `main.ts` que não configura nada.
2. **O nome do header de correlação foi escolhido por mim** (`X-Correlation-ID`). Nada no repositório o
   decide — ver §8.2.
3. **A régua do `detail`** (omitir quando repetiria o `title`; juntar array com `"; "`) é leitura de
   *"SHOULD"* do RFC, não texto de lei do repositório — §8.3.
4. **O schema `ErrorResponse` continua no canônico.** Removê-lo é breaking change de §4.4 sem data de
   `Sunset` decidida (§8.4). A metade que **é** desta fase (ninguém o referencia, e nenhum corpo o
   produz) está fechada.
5. **Notas de estado em ADR-034 e ADR-043** (`Proposed`): bookkeeping de citação de arquivo, com data, e
   a primeira linha de cada nota diz que não decide nada.
6. **`BACKLOG.md` P1.17** dizia *"`application/problem+json` on all 9 paths"*; medido, são **10** caminhos
   e **14** respostas de erro (o 10º caminho, `GET /content/listening/{dialogue_id}/audio`, entrou em
   P1.13, depois daquele critério). O veredito registra o critério e a medição.
7. **A linha de log de 5xx interpola valores** (`${method} ${instance} -> ${status} [${id}] ${nome}`), e
   §4.6 diz *"never interpolate raw strings into a log format"*. É o padrão da casa (as outras 18
   interpolações são da fila) e a API do `Logger` do Nest não oferece campos estruturados — um logger
   conforme é uma fase própria (§2.9, §8.7). Mitigação existente, medida: o id é UUID validado antes de
   entrar, e o caminho não pode carregar CR/LF cru, porque a linha de requisição HTTP termina neles.
   **Não** está registrado aqui como conforme.

---

## 7. Onde cada obrigação do contrato mora agora

| obrigação | artefato | o que a pega |
|---|---|---|
| §4.3 — RFC 9457, `application/problem+json` | `src/common/filters/problem-exception.filter.ts` | unit (`toProblem`) + HTTP (bytes na rede) + `contract:gate` (todas as 14 respostas) |
| §4.3 — sem interno na resposta | `detailOf` (5xx ⇒ `undefined`) | unit + HTTP com spy no log (controle negativo) |
| §4.4 — prefixo `/api/v1` e `/health`,`/ready` fora dele | `src/app.setup.ts` | `contract:gate` (raízes de composição) + N-16/N-17/N-19 + HTTP |
| §4.5 — minimização (sem query no `instance`) | `instanceOf()` | unit |
| §4.6 — correlation id em toda resposta | `src/common/http/correlation.ts` | unit (`resolveCorrelationId`) + HTTP (sucesso e erro, adoção e troca) |
| o schema `Problem` (6 membros, e só eles) | `docs/api-spec.openapi.yaml` × o filtro | HTTP: `Object.keys(body)` ordenado, sem `error`/`message`/`errors` |

---

## 8. Pendências humanas e bloqueios

### 8.1 **A4b está bloqueado**, e o bloqueio é o D1 — a decisão de quem é o `type`

ADR-034 continua `Proposed` e o primeiro item do plano é *"Bloqueado — ato humano: decidir o domínio
canônico das URIs de `type`"*. Sem esse domínio, `code`, `errors[]` com JSON Pointer, o catálogo
`docs/api/problem-types.md`, o gate de catálogo e o `406` ficam todos sem chão: cada um depende de
identificar um tipo de problema de forma que não seja só o status. **A4a implementa o que já era lei e
não ratifica nenhum item de ADR-034** — a nota de estado em ADR-034 diz, item por item, o que passou a
ser verdade no terreno e o que segue `Proposed`.

Nota adicional que interessa a A4b: o plano de ADR-034 tem um item *"corrigir
`tests/contract/endpoints.spec.ts:59`"* que **ficou sem objeto** — A3 removeu aquele arquivo, e a
obrigação que só ele cobria está no gate. O plano deve ser rebaselinado contra o estado real, não
executado linha a linha.

### 8.2 O nome do header de correlação é uma decisão **sua**, não do repositório

A4a usa **`X-Correlation-ID`**. Nada no repositório decide o nome: ADR-006 prescreve o plugin
`correlation-id` do Kong **sem** `header_name`, e `iac/kong/kong.yml` **não carrega** esse plugin (medido:
o gate de Kong conta 3 plugins, todos de rate limiting). Consequências, para decidir com o quadro certo:

- hoje o id nasce **na aplicação**, não no gateway; atrás do Kong, uma requisição sem header entra sem id
  e sai com um id que o gateway não conhece;
- se o Kong passar a carregar o plugin com um nome próprio, o header servido muda — e muda junto a
  promessa feita em `CHANGELOG.md`;
- o nome do schema no canônico **não** foi tocado: declarar o header é uma adição de contrato.

### 8.3 A régua do `detail` pede ratificação

Três regras foram escolhidas por leitura, não por texto de lei: `detail` **é string** (arrays de
`ValidationPipe` são juntados com `"; "`); **é omitido** quando igual ao `title`; **é sempre omitido** em
5xx. A terceira é obrigação de §4.3; as duas primeiras são RFC 9457 ("*SHOULD*", `detail` é opcional) e a
estrutura por campo é justamente o que ADR-034 D5 quer substituir por `errors[]`. Quando D5 for decidido,
estas duas regras morrem com ele — até lá, estão **afirmadas em teste** (inclusive a ausência de `errors`)
para que a decisão seja reversível e visível.

### 8.4 `Sunset` do schema `ErrorResponse` — devido, e não decidido

Ver §2.3. A linha da tabela *Deprecated* agora diz que a data é devida e por que não foi inventada.

### 8.5 O portão de aposentadoria continua sem instrumento (inalterado desde A3)

Nada aqui mudou: sem plugin de log/métricas/correlação no Kong e sem consumidor declarado, a regra
`Sunset ≥ Deprecation` segue inerte e **não** verificável por gate. A4 não piorou nem melhorou isso.

### 8.6 H-1/H-2/H-3 seguem `Proposed`

ADRs 041/042/043 continuam `Proposed` (não autorizados a decidir). A nota de estado em ADR-043 só registra
que o bloco de CORS mudou de arquivo em A4a, palavra por palavra o mesmo.

### 8.7 Log conforme §4.6 — fase própria, e uma decisão dentro dela

§2.9 mede o estado: sem OTel/`traceparent`, sem logger estruturado, 19 interpolações, id em uma linha de
log só. Fechar isso é escrever um `LoggerService` (JSON, redação no logger, id automático em toda linha) e
ligar OTel — trabalho de observabilidade, com o seu próprio gate, e **não** um anexo de A4a.

Dentro dessa fase há **uma decisão que é sua**: `CONSTITUTION.md` §4.6 fala de **um** `Correlation-ID`. Hoje
existem dois espaços de id com esse nome — o do request (A4a, `src/common/http/correlation.ts`) e o dos
eventos de domínio (`src/domain/events/domain-events.ts`, que agrupa eventos de uma sessão). As duas
leituras são defensáveis: *um id por requisição, do gateway ao evento* (rastreio ponta a ponta) ou *dois
conceitos distintos com o mesmo nome* (aí um deles deveria mudar de nome, senão o log fica ambíguo). A4a
não escolhe: mantém os dois separados e mede que não se falam.

---

## 9. O que NÃO foi feito e por quê

| não feito | por quê |
|---|---|
| A4b (`code`, `errors[]`, catálogo, domínio de `type`, `406`) | ADR-034 `Proposed`; D1 é ato humano (§8.1) |
| log conforme §4.6 (OTel/`traceparent`, JSON estruturado, sem interpolação, id em toda linha, redação no logger) | é uma fase de observabilidade — exige `LoggerService` próprio —, e não um anexo do pipeline de erro; medido em §2.9, e a decisão sobre um ou dois espaços de id está em §8.7 |
| remover `ErrorResponse` do spec canônico | é breaking change de §4.4 e o `Sunset` não está decidido (§8.4) |
| declarar `X-Correlation-ID` no canônico | depende do nome (§8.2) |
| retirar `/auth/refresh` (D-3) | adiada em A3 §8.2, sem bloqueio constitucional; fora do escopo desta fase |
| os 4 `cryptoRandom()` mortos (§2.7) | não são superfície de erro; nenhum `throw` os usa. **P2** |
| os **80** `*.spec.{js,js.map,d.ts,d.ts.map}` rastreados fora de `tests/contract/` | P2 herdado de A3; os dois arquivos de teste desta fase **não** ganharam irmão compilado, para não aumentar a dívida |
| `tsc -p tsconfig.test.json --noEmit` falha com **TS6059** | P2 herdado de A3 (raiz/projeto) |
| suspeita de bug de caminho em `prd-score.py` | P2 herdado de A3; fora do `its-platform` |
| `docs/security-audit.md` citando `main.ts` para o `ValidationPipe` | documento **datado** (2026-10-12) — A3 fixou a distinção entre datado e vivo |

---

## Apêndice — evidência crua

```bash
# 1. O filtro ANTES (17f2927), linhas 33-43 — a forma que saiu
$ git show 17f2927:its-platform/src/common/filters/problem-exception.filter.ts | sed -n '33,43p'
    const problem = {
      type: `https://httpstatuses.com/${status}`,
      title: error,                       # not_found, bad_request, …
      status,
      detail: message,                    // sempre, inclusive 500
      instance: request.url,              # ← a query string junto
      request_id: this.generateId(),       // sorteado POR RESPOSTA
      ...(details ? { details } : {}),     // 7º membro, fora do schema
    };

# 2. O censo que decide o desenho (medido)
#    referências a Problem no canônico ....... 20
#    respostas com application/problem+json .. 15 ocorrências = 14 em `responses:` (linhas 849…1172)
#                                              + 1 no comentário do bloco §4.3 (linha 739)
#    referências a ErrorResponse ............. 3 (a definição + 2 comentários) — nenhuma em rota
#    corpos de erro escritos à mão .......... 7 throws (content ×6, learners ×1), hoje 0
#    `grep -rn "error: '" src/` ............. 0

# 3. A contagem que a fase moveu
#    main.ts ..... 51 → 19 linhas (a configuração saiu)
#    filtro ...... 65 → 147 linhas (docblock de autoridade + função pura + log de 5xx)
#    novos ....... src/common/http/correlation.ts (82), src/app.setup.ts (62)

# 4. Suítes tocadas
#    tests/unit/problem-exception.filter.spec.ts ....... 23
#    tests/integration/error-response.spec.ts .......... 13
#    tests/contract/gate.spec.ts ....................... 20 (N-1 … N-19)
#    total das três .................................... 56

# 5. Censo de log (§2.9), no repositório inteiro
#    opentelemetry | traceparent | useLogger ........... 0
#    chamadas de log em src/ ........................... 28
#    destas, com interpolação em template literal ..... 19 (18 na fila: 12 + 6; 1 no filtro)
#    linhas de log que carregam o correlation id ....... 1 (a de 5xx do filtro)
#    espaços distintos de id chamados "correlation" .... 2 (request; eventos de domínio) — sem ligação
```

**Árvore verificável:** `8ba778c` (o relatório é o 5º commit, e não muda código).
