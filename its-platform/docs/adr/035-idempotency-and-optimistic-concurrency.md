---
adr: 035
title: Idempotência de escrita e concorrência otimista
status: Proposed
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@backend-lead, @database-engineer, @security-lead]
informed: [@team]
tags: [api, idempotency, concurrency, etag, if-match, rfc9110, rfc6585, draft, needs-human-review]
---

## Context

`CONSTITUTION.md` §4.3 fixa a semântica dos métodos mas **não** trata de repetição de requisição:

> *"`POST` — create or non-idempotent action. `PUT` — full replacement, idempotent. `PATCH` —
> partial update. `DELETE` — idempotent (repeating returns the same outcome)."*

Duas classes de risco, sem mecanismo hoje:

1. **Retry de escrita do aprendiz.** A submissão de uma resposta a um item é `POST`, e é o evento
   que move o modelo do aprendiz: BKT (`P1.4`), FSRS (`P1.5`), `ErrorLogEntry` (`ADR-015` §4). Uma
   resposta reenviada — rede móvel, timeout de 30 s num cliente, retry de gateway — aplica o
   **mesmo evento duas vezes**. Nada em `src/` hoje distingue uma primeira tentativa de um replay:
   as rotas `/learners/*` são mocks, e não há chave de idempotência em lugar nenhum.
2. **Edição perdida em recurso do aprendiz.** `PATCH /learners/{id}/profile` (ou equivalente de
   consentimento/preferências) com dois cliques simultâneos: o segundo sobrescreve o primeiro sem
   que nenhum dos dois saiba. `§4.5` já exige *"mass assignment: persistence accepts an explicit
   field allow-list"* — mas allow-list evita escrever coluna não nomeada, não evita sobrescrever
   a **mesma** coluna.

O `ERD` (`docs/data-model.erd.md`, 33 tabelas) é contrato por `ADR-018`/`ADR-004`: **não há** tabela
de chaves de idempotência nem coluna de versão (`version`/`xmin`) declarada. Logo, qualquer mecanismo
escolhido tem consequência de schema, e o schema deriva dos specs — não deste documento.

Estado das normas (verificado em fonte primária, 2026-10-14):

| Norma | Status | Uso aqui |
|---|---|---|
| RFC 9110 — *HTTP Semantics* | Standards Track, jun/2022 | `If-Match` (§13.1.1), `If-None-Match` (§13.1.2), `412` (§15.5.13) |
| RFC 6585 — *Additional HTTP Status Codes* | Standards Track, abr/2012 | `428 Precondition Required` (§3), `429` (§4) |
| `draft-ietf-httpapi-idempotency-key-header` | **draft-07, expirado 2026-04-18 — não é RFC** | ver D3 |
| `draft-ietf-httpapi-ratelimit-headers` | draft-11 — não é RFC | ADR-039 |
| Redis 7.2 (cluster) | ADR-005/ADR-006 | armazenamento de chaves (D3) |

## Decision

**D1 — Concorrência otimista por `ETag` + `If-Match`, e a precondição é obrigatória.** Todo recurso
mutável do aprendiz responde `ETag` (valor forte, derivado do estado persistido). `PUT`/`PATCH`
sobre esses recursos **exigem** `If-Match`:

- `If-Match` ausente → **`428 Precondition Required`** (RFC 6585 §3). Não se aplica um update
  otimista por *default*: exigi-lo é o único jeito de o `§4.5` ("deny by default") valer também
  para concorrência.
- `If-Match` presente e obsoleto → **`412 Precondition Failed`** (RFC 9110 §15.5.13), com o novo
  `ETag` no problema (ADR-034) para o cliente re-ler e reescrever.
- `If-Match: *` é aceito apenas onde a pré-condição é "recurso existe" (§5.4 de `DELETE`).

**D2 — `ETag` forte, nunca fraco, em recurso mutável.** `W/` transforma igualdade em equivalência
semântica, e "semanticamente igual" não é o que protege contra corrida de escrita. O valor é
derivado do estado persistido (hash/versão), **não** de `Last-Modified` nem de tempo.

**D3 — Chave de idempotência em `POST` não-idempotente, com armazenamento em Redis.** Forma
proposta:

```
POST /api/v1/learners/{learner_id}/practice
Idempotency-Key: <opaque client-generated UUID>
```

Comportamento: (1) a chave é **escopada ao sujeito do token** (ADR-013) e ao método+path — nunca
global; (2) primeira execução: processa e guarda `(chave → status, corpo, hash do request)`;
(3) replay idêntico: devolve **a resposta original**, não reprocessa; (4) replay com corpo
**diferente** para a mesma chave: `409 Conflict` com `code: idempotency_key_reuse` (ADR-034).

**D3.1 — `Idempotency-Key` é um draft, não uma norma.** O header vem de
`draft-ietf-httpapi-idempotency-key-header`, revisão **07**, expirado em **2026-04-18** — **não é
RFC**. Adotá-lo significa adotar um documento sem status normativo. Este ADR **propõe** a adoção
(D3) e marca a decisão como `needs_human_review`: a alternativa é um header próprio (`X-…`), que a
revisão do ADR-030 já mostrou ser o caminho errado quando existe draft IETF. Escolher entre os dois
é ato humano.

**D4 — O armazenamento é Redis, com TTL, e o TTL é `UNVERIFIED`.** Redis 7.2 cluster já é
infraestrutura decidida (ADR-005, ADR-006) e o ADR-030 já aloca DBs dedicados por serviço (DB 0
broker, DB 1 result, DB 2 contadores do gateway). Proposta: **um DB dedicado** para chaves de
idempotência, com `SETNX` como teste-e-seta atômico. **Não** se cria tabela no ERD: (a) o ERD é
contrato e derivado dos specs (ADR-018), (b) a chave é estado de transporte com validade curta, não
dado de domínio. **Isto é uma decisão de design com consequência de durabilidade** — se a chave
expira antes de o cliente desistir, o replay reprocessa. O TTL e a semântica de falha do Redis
(fail-open ≠ fail-closed) ficam como `UNVERIFIED` até A7.

> **UNVERIFIED:** TTL da chave, DB do Redis, e política em queda do Redis — nenhuma medição os
> sustenta. A analogia com os 300 s do `ADR-028` (URL assinada) **não** transfere: aqui o tempo é o
> de vida de um *retry* de cliente, não o de validade de um link.

**D5 — `DELETE` é idempotente por §4.3, mas não é `->204` cego.** Repetir devolve a **mesma**
resposta (o `§4.3` exige "the same outcome", não "um 204 de novo"): o segundo `DELETE` de um recurso
já ausente responde conforme o recurso pai (`204` se o pai existe, `404` se não — ADR-038).

**D6 — Um evento de aprendizagem processado uma vez.** D3 fecha o caminho de rede; a garantia
**de domínio** continua sendo a dos handlers idempotentes (`§4.3`: *"Event handlers are idempotent —
at-least-once delivery is assumed"*, ADR-011/ADR-005). D3 e os handlers **não** são a mesma
idempotência: a primeira é de transporte, a segunda é de efeito. Este ADR exige as duas e **não**
aceita a primeira como prova da segunda.

## Consequences

### Positive
- O modo de falha "mesma resposta contada duas vezes" deixa de existir para o caminho público.
- `428` por default (D1) evita o pior caso silencioso: um `PATCH` sem precondição que sobrepõe
  silenciosamente a alteração de outra sessão.
- Nada de schema novo: o ERD continua sendo a derivação dos specs (ADR-018).

### Negative
- **D3 depende de um draft expirado** (D3.1). Se o draft morrer sem virar RFC, o header adotado
  fica órfão — e a migração para outro nome é, por §4.4, *"removing a required enum value"*-like:
  breaking change.
- **Redis como fonte de idempotência é memória, não registro.** Um `flush` perde as chaves e o
  replay volta a reprocessar. Declarado em D4, não mitigado.
- `428` é incomum: clientes que não enviam `If-Match` vão falhar no primeiro uso. É intencional, mas
  é atrito de adoção.
- D1 não cobre o caso "dois `POST` de criação concorrentes com corpos diferentes" — isso é unicidade
  de domínio (constraint), não `ETag`.

### Neutral
- Redis já existe na stack; D4 não adiciona componente, adiciona um DB.

## Alternatives Considered

1. **Sem idempotência: confiar no `POST` único.** Rejeitada: retry de rede é normal, e o efeito é
   duplicar evidência de aprendizagem — erro irrecuperável num modelo adaptativo.
2. **`Idempotency-Key` com armazenamento em tabela do ERD.** Rejeitada neste ADR: a tabela teria de
   ser derivada de um spec (ADR-018), e a chave é estado de transporte. Reavaliar se a durabilidade
   passar a ser exigida (ex.: garantia contratual de deduplicação por 24 h).
3. **Header próprio (`X-Idempotency-Key`).** Rejeitada como recomendação (mas é a alternativa de
   D3.1): inventa onde existe draft IETF e onde o ADR-030 já corrigiu o mesmo instinto.
4. **Concorrência via `PATCH` com merge por campo.** Rejeitada: não evita edição perdida na *mesma*
   chave; troca o problema por um mais sutil.
5. **`409` para `If-Match` obsoleto.** Rejeitada: `412` existe exatamente para pré-condição não
   satisfeita (RFC 9110 §15.5.13); `409` é para conflito de estado de recurso.
6. **`ETag` fraco + `If-Match`.** Rejeitada: `W/` compara equivalência semântica, insuficiente para
   controle de concorrência (D2).
7. **Bloqueio pessimista (`SELECT … FOR UPDATE`) no caminho de leitura.** Rejeitada: serializa
   escrita de aprendiz por recurso e contradiz a Stateless da §4.3; o custo recai no caminho quente.

## Implementation Plan

- [ ] **Bloqueado — ato humano.** Decidir D3.1 (`Idempotency-Key` do draft × header próprio) e
      ratificar o domínio de exposição.
- [ ] A2 — declarar `Idempotency-Key` (ou o escolhido) nos `POST` que movem estado, `ETag`/`If-Match`
      nos recursos mutáveis, e `412`/`428`/`409` no catálogo de problemas (ADR-034), no spec canônico
      (ADR-040).
- [ ] A3 — guard de precondição (`If-Match` → `428`/`412`) e guard de idempotência (Redis `SETNX`,
      escopo token+path); property test: N replays da mesma chave ⇒ um único efeito de domínio.
- [ ] A3 — controle negativo: replay com corpo diferente ⇒ `409` e **nenhum** efeito de domínio.
- [ ] A7 — medir e fixar o TTL da chave e o comportamento em queda do Redis (D4).

## References

- `CONSTITUTION.md` §4.3 (métodos, handlers idempotentes, stateless), §4.5 (mass assignment)
- **RFC 9110** — *HTTP Semantics*, Standards Track, jun/2022 — §13.1.1 `If-Match`, §13.1.2
  `If-None-Match`, §15.5.13 `412`
- **RFC 6585** — *Additional HTTP Status Codes*, Standards Track, abr/2012 — §3 `428`, §4 `429`
- `draft-ietf-httpapi-idempotency-key-header-07` — **draft, expirado 2026-04-18** (não é RFC)
- `docs/adr/005-async-celery.md`, `docs/adr/011-message-broker-selection.md` (Redis; entrega
  at-least-once) · `docs/adr/018-persistence-derived-from-specs.md` (ERD derivado dos specs)
- `docs/adr/028-audio-delivery.md` (por que 300 s **não** se transfere para D4)
- `docs/data-model.erd.md` (ausência de tabela de idempotência e de coluna de versão)
