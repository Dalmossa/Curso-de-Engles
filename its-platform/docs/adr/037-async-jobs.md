---
adr: 037
title: Trabalho assíncrono exposto como recurso — 202, Location e /jobs/{job_id}
status: Proposed
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@backend-lead, @sre-lead]
informed: [@team]
tags: [api, async, jobs, 202, location, celery, adr-005, adr-011, rfc9110]
---

## Context

`CONSTITUTION.md` §4.3 trata o trabalho assíncrono no plano do domínio, não no plano do HTTP:

> *"Event-driven work | Work that is asynchronous, decoupled, or outside the request path is
> dispatched as a domain event. In-process via `@nestjs/event-emitter`; externalised via broker where
> ADR-005/ADR-011 require durability. Event handlers are idempotent — at-least-once delivery is
> assumed."*

A §4.3 **não** diz como um cliente observa o resultado, e é isso que está aberto. Os consumidores que
já existem no repositório, nomeados e não hipotéticos (R3):

| Consumidor | Natureza | Origem |
|---|---|---|
| Renderização de áudio por clipe (uma por *take*) | caro, idempotente, fora do request path | `ADR-028` §3 |
| Exportação de dados do titular (LGPD art. 18 II/V) | varredura de todas as tabelas learner-scoped; não cabe inline | A6 / `ADR-042` |
| Eliminação / anonimização do titular | efeito distribuído e auditável | A6 / `ADR-042` |
| Re-indexação em massa após o loader | maior que qualquer timeout de requisição | `ADR-020`/`ADR-022` |

Hoje **não existe** nenhum endpoint de job, e não existe nenhum contrato para o que um cliente faz
enquanto espera. Sem isso, cada consumidor inventa o seu — e o primeiro a inventar um `200` com
`{"status":"processing"}` cria um contrato que nunca poderá ser mudado (ADR-033).

## Decision

**D1 — Trabalho que não termina no request path responde `202 Accepted`, com `Location`.** A rota de
criação devolve:

```
HTTP/1.1 202 Accepted
Location: /api/v1/jobs/{job_id}
Retry-After: <segundos>
Content-Type: application/json
{ "jobId": "…", "status": "queued", "links": { "self": "/api/v1/jobs/…" } }
```

`202` e `Location` (RFC 9110 §15.3.3: *"the request has been accepted for processing"*) são a forma
padrão; `200` com estado de processamento é rejeitado (D-Alternatives 1).

**D2 — O job é um recurso de primeira classe, com estado fechado.** `GET /api/v1/jobs/{job_id}`:

| `status` | Significado | Termina? |
|---|---|---|
| `queued` | aceito, não iniciado | não |
| `running` | em execução | não |
| `succeeded` | concluído; há resultado | sim |
| `failed` | concluído com falha; há `error` | sim |
| `cancelled` | cancelado pelo dono | sim |

O estado é **fechado** (enumeração do ERD/spec, não string livre) — §4.4 trata "remover valor de
enum" como breaking change, logo o conjunto tem de ser explícito desde o início.

**D3 — `failed` não é `5xx` tampouco um `200` feliz.** Quando o job falha, o **job** carrega o
problema (ADR-034) no membro `error`; a requisição de *consulta* continua `200` (o job foi lido com
sucesso). Confundir "falha do job" com "falha da leitura" é o defeito que D1 evita no outro sentido.
O código HTTP da **criação** (`202`) não muda depois por causa do resultado.

**D4 — Jobs que carregam dado de aprendiz são learner-scoped e obedecem à RLS.** `PgSessionContext`
(`ADR-026`) é aberto com o sujeito do token. Consultar o job de **outro** aprendiz responde **404**
(ADR-038, R6) — e não 403, pela mesma razão de sempre: não se confirma existência.

**D5 — `/jobs` não é uma API de administração de fila.** Não há listagem global de jobs, nem
cancelamento de job alheio, nem inspeção de payload. O escopo é: criar, consultar o próprio, listar
os próprios (paginado — ADR-032), cancelar o próprio. Uma API de fila é uma superfície de operação,
não de produto, e aqui não tem consumidor nomeado (R3).

**D6 — Criar job é sujeito a `Idempotency-Key` (ADR-035).** Sem isso, um retry cria dois jobs — e
para "eliminação do titular" isso é um segundo efeito irreversível. D6 é obrigatório para todo job
com efeito de domínio; para job puramente de leitura (export) é recomendado.

**D7 — O job é *handle*, não *payload*.** O resultado não é embutido indefinidamente na resposta do
job: `succeeded` devolve um `links.result` (URL) com validade, e a política de validade é
`UNVERIFIED` — depende de volume e de PII, e varia por tipo de job.

### Números pendentes (UNVERIFIED — a fixar em A7)

| Parâmetro | Situação |
|---|---|
| `Retry-After` por tipo de job | **UNVERIFIED** — só a medição do tempo real de render/export dá número |
| Validade de `links.result` | **UNVERIFIED** — difere entre export (PII) e render (asset) |
| Retenção do registro do job | **UNVERIFIED** — cruza com `ADR-042` (H2) |

## Consequences

### Positive
- Os quatro consumidores da §Context ganham **um** contrato, e ele é o padrão HTTP: um cliente HTTP
  genérico já sabe o que fazer com `202` + `Location` + `Retry-After`.
- D4 torna o job tão protegido quanto o dado que ele produz — sem isso, `GET /jobs/{id}` seria o
  ponto mais fácil de vazar o resultado de uma exportação.
- D3 evita a ambiguidade "o job falhou" versus "não consegui ler o job".

### Negative
- **Sem push.** O cliente *poll*a; `Retry-After` mal calibrado (UNVERIFIED) faz polling excessivo ou
  lentidão percebida. Alternativas de push não estão excluídas para depois (D-Alternatives 3).
- D2 cria uma máquina de estados que precisa ser mantida com o broker (`ADR-011`). Um job `running`
  órfão (worker morto) exige reconciliação — não resolvido aqui.
- D5 recusa um recurso que operações vão querer de todo modo; a recusa é deliberada e vai reaparecer
  como pedido (ver `docs/api/candidatos.md`).

### Neutral
- `202` muda a semântica das rotas que hoje respondem síncrono: nenhuma rota implementada fica
  assíncrona por este ADR; D1 só vincula **novos** consumidores.

## Alternatives Considered

1. **`200 OK` imediato com `{"status":"processing"}` e polling na mesma rota.** Rejeitada: `§4.3`
   proíbe *"`GET` … never returns `200` with an error body"* e, por extensão de espírito, `200` como
   "ainda não"; e torna impossível distinguir aceito de concluído sem inspecionar o corpo.
2. **`303 See Other` para uma página de status.** Rejeitada: `303` obriga o cliente a fazer `GET` na
   `Location`, o que é redundante com `202`+`Location` e perde o `Retry-After` na resposta imediata.
3. **SSE/WebSocket para progresso.** Adiada, não rejeitada: adiciona estado de conexão, o que
   colide com *"Stateless"* (§4.3) e com o modelo Resource Server (§4.5). Reavaliar se o polling
   provar-se insuficiente em A7.
4. **Webhook de callback.** Adiada: exigiria registro de endpoint por aprendiz (mais PII, mais
   superfície de SSRF) e não há consumidor nomeado que o peça (R3).
5. **Síncrono com timeout longo.** Rejeitada: transforma o timeout do gateway no limite real e viola
   o motivo pelo qual §4.3 tira esses trabalhos do request path.
6. **Fila exposta (`/queues/{name}`) a la ADR-005.** Rejeitada neste ADR: é superfície de operação
   (D5) e acopla o contrato público ao broker escolhido por `ADR-011`.

## Implementation Plan

- [ ] A2 — `POST` dos consumidores nomeados (render, export, erase, reindex) com `202`+`Location`;
      `GET /api/v1/jobs/{job_id}`; `Location` e o schema de job no spec canônico (ADR-040).
- [ ] A2 — enumeração fechada de `status` e o mapeamento estado-do-broker → estado-do-job.
- [ ] A3 — `PgSessionContext` no caminho do job (D4) e teste cross-learner ⇒ **404**.
- [ ] A3 — controle negativo: consultar job alheio não revela nada; criar job com a mesma
      `Idempotency-Key` não cria dois (D6, ADR-035).
- [ ] A7 — medir tempos de render/export para calibrar `Retry-After` (D7).

## References

- `CONSTITUTION.md` §4.3 (event-driven work, métodos, stateless), §4.4 (enum como contrato),
  §4.6 (audit log de export/erase), §4.5 (Resource Server)
- **RFC 9110** — *HTTP Semantics*, Standards Track, jun/2022 — §15.3.3 (`202`), §10.2.3 (`Retry-After`),
  §10.2.2 (`Location`)
- `docs/adr/005-async-celery.md`, `docs/adr/011-message-broker-selection.md` (broker e durabilidade)
- `docs/adr/026-learner-context-app-role.md` (RLS no caminho do job)
- `docs/adr/028-audio-delivery.md` (render por clipe) · `docs/adr/035` (idempotência) ·
  `docs/adr/038` (404 cross-learner) · `docs/adr/040` (spec canônico)
