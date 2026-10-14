---
adr: 039
title: Rate limiting — forma da resposta, headers e a proibição de inventar números
status: Proposed
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@sre-lead, @security-lead]
informed: [@team]
tags: [api, rate-limiting, 429, retry-after, draft, adr-030, needs-human-review]
---

## Context

A **política** de rate limiting já está decidida e não é reaberta:

- `CONSTITUTION.md` §4.5 — *"A centralised API Gateway (Kong, ADR-006, declarative config) applies
  rate limiting and throttling **before** the request reaches application code. Limits are
  per-learner and per-IP."*
- `ADR-030` (Accepted, 2026-10-12) — três camadas com **números**: `ip` **1000/min** (service-wide),
  `consumer` **100/min** em `/learners` (declarada agora, aplicada quando a autenticação chegar),
  `ip` **5/min** em `/auth` (por `S-03`). E o `ADR-030` **corrigiu** o BDD: o *"15-minute block"* vira
  **`429` + `Retry-After`**.
- `ADR-030` também rejeitou `limit_by: header` porque um `X-Learner-Id` fornecido pelo cliente é
  **forjável**.

O que está aberto é o que o **cliente** vê: qual header informa o limite, qual informa o restante, e
o que exatamente o corpo de um `429` contém. Estado das normas (fonte primária, 2026-10-14):

| Norma | Status |
|---|---|
| RFC 6585 — `429 Too Many Requests` | Standards Track, abr/2012 (§4) |
| RFC 9110 — `Retry-After` | Standards Track, jun/2022 (§10.2.3) |
| `draft-ietf-httpapi-ratelimit-headers` | **draft-11, expira 2026-11-24 — não é RFC** |

## Decision

**D1 — A aplicação não conta requisições.** A imposição fica no gateway (`ADR-006`/`ADR-030`). O
obrigação da aplicação é (a) **não** contradizer o gateway, (b) produzir a **forma** correta quando o
gateway bloqueia, e (c) expor o `429` no contrato. Reimplementar contadores na aplicação é rejeitado
(D-Alternatives 1), pelo mesmo motivo que o `ADR-030` consolidou tudo num monólito upstream.

**D2 — `429` com `Retry-After` e corpo de problema.** `429` **sempre** acompanha `Retry-After`
(RFC 9110 §10.2.3) — sob o formato que o `ADR-030` fixou — e o corpo é `application/problem+json`
(ADR-034) com `type` próprio e `code: rate_limited`. Como o `ADR-030` já corrigiu o BDD de um
"bloqueio de 15 minutos" para `429 + Retry-After`, D2 é a consolidação dessa correção no catálogo de
problemas, não uma decisão nova.

**D3 — Os headers de limite são o draft IETF, e isso é `needs_human_review`.**
`draft-ietf-httpapi-ratelimit-headers` (rev **11**, expira **2026-11-24**) define `RateLimit` e
`RateLimit-Policy`. Proposta: adotá-los em vez de `X-RateLimit-*`. Mesma estrutura de risco do
ADR-035 D3.1: adota-se um documento **sem status normativo**, e migrar depois é breaking change
(§4.4). Alternativa: emitir **só** `Retry-After` (que é RFC) e **nenhum** header de limite — mais
pobre, porém sem dívida de draft. **Escolher é ato humano** (R9).

**D4 — Nenhum número novo.** Este ADR **não** fixa limite algum: os únicos números da plataforma são
os do `ADR-030` (1000/min ip, 100/min consumer, 5/min `/auth`), e números de cliente (quanto ele pode
esperar, qual `Retry-After` é aceitável) vêm de **A7**, com medição. R2: sem medição/spec/lei, um
número aqui seria `UNVERIFIED` — e um limite inventado é pior que nenhum, porque vira contrato.

**D5 — O limite per-learner **só existe depois** da autenticação; até lá, é per-IP.** Isto não é uma
escolha deste ADR: `ADR-030` já declarou o limite `consumer` como *"declared now and enforced the
moment authentication lands"*. Combinado com ADR-038 (guards), a ordem é: `learner:self` no token →
gateway chaveia por consumidor; sem token → só o limite de IP protege. **Consequência honesta:**
antes de D-A2/A3, a única proteção é por IP, e D5 diz isso em voz alta.

**D6 — Rate limiting não é controle de enumeração.** Ele reduz tentativa, não substitui o 404 de
ADR-038 nem a opacidade de id de ADR-031. Tratar `429` como a defesa contra scraping de ids é
confundir disponibilidade com confidencialidade.

**D7 — As métricas de `429` e a métrica de aposentadoria são diferentes.** O `ADR-030` pede alerta
sobre saúde do Redis (fail-open); o ADR-033 D4 exige "30 dias sem tráfego" para aposentar versão.
São contadores distintos, com consumidores distintos; misturá-los produziria um alerta que dispara
na hora errada.

### Pendências (UNVERIFIED — A7)

| Item | Situação |
|---|---|
| `Retry-After` de cada camada | **UNVERIFIED** — derivar da janela/capacidade real |
| Limites por endpoint além dos do ADR-030 | **UNVERIFIED** — exige medição de carga |
| Emissão de `RateLimit`/`RateLimit-Policy` (D3) | **needs_human_review** — draft vs. só `Retry-After` |

## Consequences

### Positive
- Um cliente recebe `429` de forma **acionável** (`Retry-After` + `type` + `code`) em vez de um corpo
  de erro genérico.
- D4 impede o erro mais comum deste tópico: um número copiado de um blog virando contrato.
- D5 declara a lacuna de segurança real (sem auth, só IP) em vez de prometer per-learner que ainda
  não existe.

### Negative
- **D3 é dívida de draft.** Se `draft-ietf-httpapi-ratelimit-headers` morrer, o header emitido fica
  órfão — e o custo de migração é breaking change. A alternativa (nada além de `Retry-After`) é
  mais segura e menos informativa; o ADR deixa a escolha aberta.
- D1 significa que a aplicação **não** consegue garantir o `429` em ambiente que não passe pelo
  gateway (ex.: chamada direta ao pod). Isso é aceito porque o perímetro é o gateway (§4.5), mas é
  um modo de falha real em teste/desenvolvimento.

### Neutral
- O `ADR-030` permanece a fonte dos números; este ADR governa a **forma**.

## Alternatives Considered

1. **Contadores na aplicação (além do gateway).** Rejeitada: duplica estado, e o `ADR-030` mostrou
   que o perímetro é o gateway. Duas fontes de verdade sobre limite divergem sob carga.
2. **`X-RateLimit-Limit` / `X-RateLimit-Remaining`.** Rejeitada como recomendação: existe draft IETF;
   inventar `X-` foi exatamente o que o `ADR-030` evitou no caso de keying (D3.1 do ADR-035). Fica
   como alternativa se o draft for rejeitado.
3. **Emitir apenas `Retry-After`.** Alternativa **viável** a D3 — a mais conservadora. Não escolhida
   por omissão: é o outro lado da decisão humana de D3.
4. **`503` + `Retry-After` em vez de `429`.** Rejeitada: `429` é o status correto para excesso do
   cliente; `503` significa indisponibilidade do servidor e confundiria o alerta de SRE.
5. **Bloqueio de 15 minutos (como o BDD dizia).** Já rejeitada pelo `ADR-030`; registrada aqui
   porque o texto do BDD só foi corrigido no ADR-030, e quem ler `tests/bdd/README.md` isolado
   ainda encontra a versão antiga.

## Implementation Plan

- [ ] **Bloqueado — ato humano.** Decidir D3 (draft `RateLimit`/`RateLimit-Policy` × apenas
      `Retry-After`).
- [ ] A2 — publicar `429` + `Retry-After` + o `type` de rate limit no spec canônico (ADR-040) e no
      catálogo de problemas (ADR-034); declarar os headers de D3 se aprovados.
- [ ] A3 — garantir que o `429` do gateway chegue ao cliente como `application/problem+json` quando
      a aplicação estiver no caminho; documentar a exceção quando não estiver (D1).
- [ ] A7 — medir e fixar `Retry-After` por camada; reavaliar o status do draft de D3.
- [ ] A2 — alinhar `tests/bdd/README.md` ao texto do `ADR-030` (429, não bloqueio de 15 min).

## References

- `CONSTITUTION.md` §4.5 (perímetro/Kong, limites per-learner e per-IP), §4.4 (breaking change)
- `docs/adr/030-gateway-rate-limiting.md` (**os números**: 1000/min ip, 100/min consumer, 5/min
  `/auth`; fail-open; correção do BDD "15-minute block" → 429 + `Retry-After`)
- `docs/adr/006-kong-api-gateway.md` (perímetro)
- **RFC 6585** — *Additional HTTP Status Codes*, Standards Track, abr/2012, §4 (`429`)
- **RFC 9110** — *HTTP Semantics*, Standards Track, jun/2022, §10.2.3 (`Retry-After`)
- `draft-ietf-httpapi-ratelimit-headers-11` — **draft, expira 2026-11-24** (não é RFC)
- `docs/adr/035` (D3.1 — o mesmo raciocínio sobre draft) · `docs/adr/038` (404 como antienumeração)
