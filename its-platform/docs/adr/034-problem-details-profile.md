---
adr: 034
title: Erros — perfil da plataforma sobre a RFC 9457, e os defeitos do filtro atual
status: Proposed
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@security-lead, @backend-lead]
informed: [@team]
tags: [api, errors, problem-details, rfc9457, observability, correlation, validation]
---

## Context

`CONSTITUTION.md` §4.3 já manda o padrão:

> *"Errors | RFC 9457 (Problem Details for HTTP APIs) — `application/problem+json` with `type`,
> `title`, `status`, `detail`, `instance`. Business failures use 4xx/5xx, **never `200` with an
> error payload**. Stack traces and internal messages are never serialised."*

A escolha do padrão **não** está aberta. O que está aberto é o **perfil**: o que vai dentro de cada
membro, que **URIs de `type`** existem, qual é o código de erro *machine-readable*, e como a
validação de entrada é reportada. Medido em A0, o filtro atual
(`src/common/filters/problem-exception.filter.ts`) viola a §4.3 em quatro pontos:

| Linha | O que faz | Por que é defeito |
|---|---|---|
| `:34` | `type: https://httpstatuses.com/${status}` | URI de **terceiro**; não é um tipo que *a plataforma* define e governa. RFC 9457 §3.1: o `type` é uma URI que **identifica o problema**, não o código de status. |
| `:35` | `title: error` (onde `error` é `'not_found'`, `'bad_request'`, …) | `title` deve ser **texto legível e estável**; aqui é um código colado num campo humano. RFC 9457 §3.1.1: `title` é *"a short, human-readable summary"*. |
| `:43` | `response.status(status).json(problem)` | Emite `application/json`. §4.3 exige **`application/problem+json`**. Um cliente que negocie pelo media type não reconhece a resposta. |
| `:39` | `request_id: this.generateId()` | Gera um id **por resposta de erro**, desconectado do `Correlation-ID`/`traceparent` que a §4.6 manda propagar. Não correlaciona com nada — nem com o log, nem com o trace. |

Além disso: **não há `errors[]`**. O `ValidationPipe` global está configurado
(`src/main.ts:9-18`, `whitelist`/`forbidNonWhitelisted`/`transform`), mas todo `@Body()` é `any` e
não existe um DTO em `src/` — então, quando a validação **passar** a funcionar (A3), a
`BadRequestException` do NestJS traz `message: string[]` sem nenhum caminho de campo. Reportar
`["nome é obrigatório", "email inválido"]` sem dizer **de qual campo** é inútil para o cliente.

E há um **teste que protege o defeito**: `tests/contract/endpoints.spec.ts:59` asserta
`expect(r400.content['application/json']).toBeDefined()` para as respostas de erro 400/404 — exigindo
exatamente o media type que a §4.3 proíbe. D4 é, portanto, uma mudança que **quebra um teste verde**;
corrigi-lo é pré-requisito de D4, não consequência (e por isso está no Implementation Plan).

## Decision

**D1 — Membro `type` é uma URI sob um namespace próprio da plataforma, e o namespace é um
artefato versionado.** A tabela de tipos é um arquivo no repositório (proposto:
`docs/api/problem-types.md`) e o spec canônico aponta para ela. Cada tipo tem: slug, URI, status,
título, condição de disparo, e se é `breaking` para clientes que ramificam por `code`.

> **UNVERIFIED:** o domínio canônico (`https://its.example.com/…` hoje é *placeholder* em
> `docs/api/openapi.yaml`) não está decidido em fonte alguma. Até que esteja, as URIs de `type`
> usam um domínio reservado **não publicável** e este ADR **não** pode ser aceito como final.
> R2: sem medição/spec/lei, o domínio é `needs_human_review`.

**D2 — `title` é humano; o identificador de máquina é um membro de extensão `code`.** Mapa proposto:

| Membro | Papel | Exemplo |
|---|---|---|
| `type` | URI do **tipo** de problema (D1) | `https://…/problems/learner-not-found` |
| `title` | resumo humano, **estável** para o tipo | `"Learner not found"` |
| `status` | código HTTP | `404` |
| `detail` | ocorrência específica (não vaza interno) | `"No learner with that id is visible to this token."` |
| `instance` | path da requisição | `/api/v1/learners/…` |
| `code` | **extensão** — estável, `snake_case`, para ramificação de cliente | `learner_not_found` |
| `trace_id` | **extensão** — o `traceparent`/Correlation-ID da §4.6 | `4bf92f3577b34da6…` |

`code` existe porque a §4.4 trata *"changing an error code that clients branch on"* como breaking
change: para a §4.4 ter sentido, o código precisa **existir** e ser distinto do `status` e do
`title`. Hoje a plataforma ramifica por nada: `mapStatusToError` (`:46-57`) deriva o código do
status, então não há código, há uma função do status.

**D3 — `type: about:blank` (RFC 9457 §4.2) quando não houver tipo específico.** Não se inventa uma
URI por status para disfarçar ausência de tipo. Um tipo próprio só existe quando há **uma condição**
bem definida por trás dele.

**D4 — O media type é `application/problem+json`, sempre.** `Content-Type` na resposta de erro; e o
`Accept` do cliente é respeitado — se ele não aceita `application/problem+json` (§4.3), a resposta é
`406` com... `application/problem+json` de novo (não há outro formato permitido).

**D5 — Falha de validação é `422`/`400` com `errors[]` posicional.** Proposto (a forma do
`errors[]` é a decisão que este ADR de fato toma; o status fica a ratificar):

```json
{
  "type": "https://…/problems/validation-failed",
  "title": "Validation failed",
  "status": 422,
  "detail": "2 fields failed validation.",
  "instance": "/api/v1/learners/…/practice",
  "code": "validation_failed",
  "trace_id": "…",
  "errors": [
    { "pointer": "/answers/0/itemId", "code": "invalid_content_id", "detail": "Not a canonical item id." },
    { "pointer": "/answers/2/choice", "code": "required", "detail": "Missing." }
  ]
}
```

`pointer` é um JSON Pointer (RFC 6901) para o campo — é o que torna o erro **acionável** por um
cliente, e é o que o `message: string[]` do NestJS não dá. Isto exige um `exceptionFactory` no
`ValidationPipe` de `main.ts:9-18` (A3).

**D6 — Nenhum detalhe interno, nunca.** Sem stack, sem driver, sem SQL, sem nome de tabela — §4.3.
O filtro atual já não serializa stack; D6 torna isso um invariante com **controle negativo**
(A3: forçar um erro de DB e afirmar que a resposta não contém o nome da tabela).

**D7 — O catálogo de códigos é fechado e coberto por gate.** Todo `throw` no código usa um `code`
do catálogo; um `code` fora do catálogo falha o gate de contrato (ADR-040). Sem isso, o catálogo
vira documentação morta no primeiro `throw` apressado.

## Consequences

### Positive
- Um cliente passa a poder ramificar por `code` — o que dá sentido à cláusula de breaking change da
  §4.4 e evita "quebrar" clientes que hoje só têm `status` (que muda por razões que não são do
  cliente).
- `errors[]` com `pointer` transforma "400" em erro corrigível.
- `trace_id` (extensão) liga a resposta de erro ao log estruturado e ao trace (§4.6), o que o
  `request_id` atual, gerado na hora, não fazia.

### Negative
- O `type` deixa de ser derivável do status (`httpstatuses.com/{status}`): passa a ser um
  **artefato mantido**. É o preço de ter tipos reais.
- D1 fica **bloqueado** por um domínio que não existe. Enquanto isso, o perfil não pode ser
  congelado, e o `type` publicável tem de ser provisório — o que é, por si, uma razão para decidir
  o domínio.

### Neutral
- RFC 9457 obsoleta a RFC 7807 (jul/2023 vs. mar/2016, verificado em fonte primária). Documentação
  ou comentário que cite 7807 tem de ser atualizado.

## Alternatives Considered

1. **Manter `httpstatuses.com/{status}`.** Rejeitada: é o `type` de outra pessoa; a plataforma não
   controla o que essa URI resolve, e ela não distingue dois `404` de causas diferentes.
2. **`type` = `about:blank` para tudo.** Rejeitada: perde toda a informação do tipo; D3 reserva
   `about:blank` para o caso genuinamente genérico.
3. **Não ter `code` (só `status` + `type`).** Rejeitada: a §4.4 exige que "mudar um código de erro"
   seja breaking change — logo o código tem de existir como campo próprio.
4. **Erros de validação como `message: string[]` (default do NestJS).** Rejeitada: não endereça
   campo, viola "input validation" acionável (§4.5) e não passa o controle negativo D6.
5. **Campo `errors[]` com índice numérico em vez de JSON Pointer.** Rejeitada: `pointer` funciona
   para corpo aninhado (`/answers/0/itemId`) e para query param, sem inventar duas convenções.
6. **Emitir `application/json` (como hoje) "por compatibilidade".** Rejeitada: §4.3 é mandatório, e
   não há cliente em produção para compatibilizar com.

## Implementation Plan

- [ ] **Bloqueado — ato humano.** Decidir o domínio canônico das URIs de `type` (D1).
- [ ] A2 — `docs/api/problem-types.md` (catálogo fechado) e o schema `Problem` no spec canônico
      (ADR-040) com `code`/`trace_id`/`errors[]` obrigatórios onde couber.
- [ ] A3 — reescrever `problem-exception.filter.ts`: media type (D4), `title` humano (D2),
      `about:blank` (D3), `trace_id` a partir do contexto (§4.6), preservando `details` apenas via
      `errors[]`.
- [ ] A3 — **corrigir `tests/contract/endpoints.spec.ts:59`** (`application/json` →
      `application/problem+json`); enquanto ele existir, D4 não pode ser implementado sem deixar o
      gate vermelho.
- [ ] A3 — `exceptionFactory` no `ValidationPipe` para `errors[]` com JSON Pointer (D5).
- [ ] A3 — controle negativo D6: provocar erro de persistência e afirmar ausência de nome de tabela,
      SQL e stack na resposta.
- [ ] A2 — gate: todo `code` emitido existe no catálogo, e todo `type` do catálogo tem `title`
      e `status` (D7).

## References

- `CONSTITUTION.md` §4.3 (Errors — RFC 9457, `application/problem+json`), §4.4 (error code como
  breaking change), §4.5 (ValidationPipe, sem vazar interno), §4.6 (Correlation-ID em toda resposta
  de erro, logs sem PII)
- **RFC 9457** — *Problem Details for HTTP APIs*, Standards Track, jul/2023 (**obsoleta a RFC 7807**,
  mar/2016) — §3.1 (`type`), §3.1.1 (`title`), §4.2 (`about:blank`). Verificado em fonte primária
  em 2026-10-14.
- **RFC 6901** — *JavaScript Object Notation (JSON) Pointer*
- `its-platform/src/common/filters/problem-exception.filter.ts:34,35,39,43,46-57` ·
  `its-platform/src/main.ts:9-18` · `.opencode/agents` (herança FastAPI: não consultar para código)

---

## Nota de estado — A4a (2026-10-14)

> Esta nota não decide nada deste ADR, e ele continua **`Proposed`**. Ela existe porque A4a mexeu no
> **terreno que o plano cita**, e uma citação de arquivo/linha envelhecida é indistinguível de um
> plano correto enquanto ninguém a lê — a mesma falha que o `MIGRATION NOTE` do spec canônico tinha.

**O que mudou de lugar.** A configuração da aplicação saiu de `src/main.ts` e vive em
`src/app.setup.ts` (`configureApp`) — o `ValidationPipe` inclusive. `main.ts` agora só chama a função;
`tests/integration/error-response.spec.ts` monta a aplicação pela mesma chamada, e
`npm run contract:gate` lê os dois arquivos (§4.4, controles N-16/N-17/N-19). As citações
`src/main.ts:9-18` do Contexto, de D5 e de References apontam para o arquivo antigo.

**O que do plano já está feito, e por qual evidência** (A4a implementa só o que **já era lei** —
spec canônica + §4.3/§4.6 + RFC 9457 — e não ratifica nada deste ADR):

| item | estado após A4a |
|---|---|
| D2 — `title` humano e estável por tipo | **feito**: a frase do status HTTP, que é o que RFC 9457 §4.2.1 exige quando `type` é `about:blank` |
| D3 — `about:blank` | **feito**: o `type` de terceiro (`httpstatuses.com/{status}`) saiu |
| D4 — media type | **feito**: `application/problem+json`, o único corpo de erro da plataforma |
| D6 — sem interno na resposta | **feito, com controle negativo**: 5xx não carrega `detail` nenhum e a mensagem interna vai para o log com o correlation id (`tests/unit/…filter.spec.ts`, `tests/integration/error-response.spec.ts`) |
| `trace_id` a partir do contexto (§4.6) | **feito como `request_id` = o id da requisição** (um por requisição, não um por erro), ecoado no header `X-Correlation-ID` |
| D1 — domínio canônico das URIs de `type` | **não decidido, e é o único bloqueio**: ato humano |
| D2 — `code` | **não feito**: depende de D1 |
| D5 — `errors[]` com JSON Pointer | **não feito**: depende de D1; hoje um array de validação é juntado com `"; "` em `detail`, e o teste HTTP afirma que **não** existe membro `errors` — o recibo do que está aberto |
| D7 — catálogo `problem-types.md` e o gate | **não feito**: depende de D1 |

**Um item do plano ficou sem objeto:** *"corrigir `tests/contract/endpoints.spec.ts:59`"* — A3
removeu esse arquivo (subsumido pelo gate), e a obrigação que só ele cobria (o media type dos erros)
está no gate e no teste de integração. Quando D1 for decidido, o plano deve ser rebaselinado contra o
estado real em vez de executado linha a linha.
