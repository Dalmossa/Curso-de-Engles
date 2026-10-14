---
adr: 033
title: Versionamento em path, depreciação e a contradição entre a CONSTITUTION §4.4 e a RFC 9745
status: Accepted
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@sre-lead, @security-lead]
informed: [@team]
tags: [api, versioning, deprecation, sunset, rfc9745, rfc8594, constitution-amendment]
---

## Status

**Accepted** (2026-10-14). The only decision that needed a human act was **D2** — amending
`CONSTITUTION.md` §4.4 — and it was ratified that day as **H-1** (`reports/api/fase-1.md` §5.1). §4.4
now reads v**2.2.0**, and the amendment record (diff, defect, what weakens) is in `CONSTITUTION.md` §9.

Two points a reader of the decision list must know:

- **D2 executed, and the wording is in §4.4**, not here: `Deprecation: <sf-date>` (`@<unix-seconds>`,
  RFC 9745 §2.1 → RFC 9651 §3.3.7) + `Sunset: <HTTP-date>` (RFC 8594), with `Sunset ≥ Deprecation`.
- **D5 is withdrawn.** RFC 9745 §2.2 makes the field apply to *the resource in the response's
  context*; the "whole version, never a single endpoint" rule came from conflating the granularity of
  §4.4's *retirement metric* (a prefix) with the *scope of the header* (a resource). Details and the
  quote are in *Post-acceptance amendment* below.

`deciders` stays `unassigned` on purpose: §9 step 5 names Tech Lead + Security Lead + Director, the
ratification was given by the project's decision authority, and writing a handle here would assert
that a named person approved it.

## Context

`CONSTITUTION.md` §4.4 é vinculante e já decide quase tudo. A A1 não reabre nada disso:

| Aspecto §4.4 | Decisão vinculante |
|---|---|
| Estratégia | *"URL path, mandatory: `/api/v1/…`"* — header e query **proibidos** |
| Breaking change | remover/renomear rota ou campo · mudar tipo/semântica · **apertar validação** · mudar status de sucesso · mudar código de erro · remover valor de enum |
| Não-breaking | endpoint novo · campo opcional novo · enum novo **com fallback documentado** · afrouxar validação · query param opcional novo |
| Depreciação | `Deprecation: true` + `Sunset: <HTTP-date>` (RFC 8594); **mínimo 90 dias** (security/correctness) e **180 dias** (feature retirement). *(Linha histórica — emendada em 2026-10-14 para a forma da RFC 9745; ver **Status**.)* |
| Portão de aposentadoria | só depois do `Sunset` **e** de 30 dias consecutivos sem tráfego externo nos logs do Kong — *"This metric must exist before a version is deprecated, not after."* |
| Changelog | toda breaking change em `CHANGELOG.md` **com o caminho de migração, antes do merge** |

Três fatos medidos entram em conflito com esse texto:

1. **A implementação não tem versão alguma.** `src/main.ts` não chama `setGlobalPrefix` nem
   `enableVersioning`; as 12 rotas servem em `/`. O spec velho (`docs/api/openapi.yaml`) publica
   `servers: …/v1` (sem `/api`) e `localhost:8000`; o spec novo publica `/api/v1`. Nenhum dos dois
   descreve o binário. (`reports/api/fase-0.md` §1.1.)
2. **`Deprecation: true` é a forma de um draft retirado.** A §4.4 manda `Deprecation: true`. O
   header hoje é definido pela **RFC 9745 — *The Deprecation HTTP Response Header Field***,
   Standards Track, **março de 2025** (verificado em fonte primária, §References). A RFC 9745
   define `Deprecation` como um **campo estruturado com valor de data**, não um booleano. A forma
   booleana vem do draft `draft-ietf-httpapi-deprecation-header`, que a RFC obsoletou. Ou seja: a
   §4.4 manda emitir uma forma que a norma vigente não define.
3. **O portão de aposentadoria depende de uma métrica que não tem instrumento.** A §4.4 apoia a
   remoção de versão em *"Kong/ADR-006 access logs"*. O artefato do Kong **existe** hoje
   (`iac/kong/kong.yml`, 1 serviço / 5 rotas / 3 plugins de rate limit — `kong:check` PASS), mas
   **não configura nenhum plugin de log, de Prometheus ou de correlação**: um `grep -iE
   "http-log|file-log|prometheus|opentelemetry|correlation"` em `iac/kong/kong.yml` não encontra
   nada. Sem um destino de log de acesso, a plataforma não consegue contar "30 dias consecutivos sem
   tráfego externo". A regra da §4.4 é, hoje, **insatisfazível** — não por ausência do gateway, mas
   por ausência da métrica.

## Decision

**D1 — `/api/v1` é o único prefixo, e a implementação é alinhada a ele.** `setGlobalPrefix('api')` +
versionamento por URI com default `1`. As 12 rotas passam a viver sob `/api/v1`. Isto não é uma
escolha: é a §4.4 sendo aplicada a um binário que a ignorava.

**D2 — A emissão de depreciação adota a RFC 9745, com `Sunset` da RFC 8594, e a §4.4 precisa ser
emendada.** Forma proposta:

```
Deprecation: @<unix-seconds>          # RFC 9745 — campo estruturado, valor de data
Sunset: <HTTP-date>                   # RFC 8594 — Informational, mai/2019
Link: <https://…/docs/deprecations/x>; rel="deprecation"; type="text/markdown"
```

A forma `Deprecation: true` da §4.4 é **retirada**. Como emendar a CONSTITUTION é ato humano
(§9), este ADR fica `Proposed` e **para aqui** (R9).

**D3 — As janelas de 90/180 dias são ratificadas como estão.** Elas **não** são uma decisão aberta
(isto corrige a premissa de H3 em A1: a janela já existe na §4.4). O que falta é o **portão de
métrica** que as torna verificáveis — ver D4.

**D4 — O portão de 30 dias não tem instrumento, e ganha um declarado antes de qualquer
depreciação.** O artefato do gateway **existe** (`iac/kong/kong.yml`), mas ele não configura **nenhum**
plugin de log de acesso/observabilidade — `grep -iE "http-log|file-log|prometheus|opentelemetry|correlation"`
não encontra nada no arquivo. Logo a plataforma **não consegue** contar "30 dias consecutivos sem
tráfego externo". Propõe-se: (a) o destino de log de acesso é pré-requisito de *qualquer* depreciação;
(b) enquanto ele não existir, a depreciação pode ser **anunciada** (`Deprecation`/`Sunset`) mas a
aposentadoria fica bloqueada por falta de evidência, e isto é dito explicitamente no `CHANGELOG.md`.

**D7 — O prefixo de D1 é uma mudança acoplada: `iac/kong/kong.yml` e `kong-config-check.mjs` mudam
junto.** Isto é um fato medido, não uma precaução. Hoje o gateway publica
`paths: ["/health"]`, `["/ready"]`, `["/auth"]`, `["/content"]`, `["/learners"]` com
`strip_path: false`, e o gate **codifica a ausência de prefixo como invariante**:

- `scripts/kong-config-check.mjs:21-22` (asserção 6) — *"Every route keeps `strip_path: false` — the
  API has no global prefix and @Controller() paths are served as-is (D1)"*;
- `scripts/kong-config-check.mjs:23` / `:48` / `:139-149` (asserção 7) — deriva o primeiro segmento
  dos paths de **`docs/api/openapi.yaml`** (o spec obsoleto) e exige rota Kong para cada um.

Consequência: aplicar D1 sem atualizar esses dois artefatos **derruba o `kong:check`** e deixa o
gateway sem rota. A ordem obrigatória é: (1) prefixo na aplicação, (2) paths do `kong.yml`,
(3) asserção 6 do gate reescrita (o invariante deixa de ser "sem prefixo" e passa a ser "prefixo
coerente com o spec canônico"), e (4) só então D5 do ADR-040 repontar a asserção 7 para o canônico.

**D5 — Depreciação é anunciada por recurso, e o escopo maior é documentado.**
*(Withdrawn and replaced on 2026-10-14 — see **Post-acceptance amendment**. The original text read:
"Depreciação é anunciada por versão inteira, nunca por endpoint solto. É a única forma compatível com
D4: a métrica de 30 dias é por prefixo (`/api/v1`)". That conflated the **retirement metric's**
granularity with the **header's** scope: RFC 9745 §2.2 makes the field apply to the resource in the
response's context, and an increased scope is permitted **if documented** — which is exactly what the
amended §4.4 now requires. The retirement metric stays per-prefix; only the header's scope changed.)*

**D6 — Toda breaking change tem `CHANGELOG.md` antes do merge, e o "caminho de migração" é um
artefato, não uma frase.** O `CHANGELOG.md` já registra breaking changes (ADR-012/027); D6 só exige
que a entrada nomeie: o que quebrou, quem é afetado, o que fazer, e **desde quando** (§4.4).

## Consequences

### Positive
- As 12 rotas implementadas passam a ser **a mesma coisa** que o contrato publicado — hoje são duas.
- A adoção da RFC 9745 evita emitir um header que nenhum parser moderno reconhece como booleano.
- D4 torna honesto o portão da §4.4: não se aposenta versão sem a métrica que a própria §4.4 exige.

### Negative
- **D1 quebra todo cliente atual** (as rotas estão em `/`). Como são mocks, o custo real é do
  contrato e dos testes, não de consumidores — mas é breaking change formal e vai para o CHANGELOG.
- **D2 exige emenda constitucional.** Até a emenda, o repositório tem uma regra escrita (§4.4) e uma
  proposta (este ADR) em desacordo — estado que precisa ser fechado, não deixado aberto.
- D4 admite que a organização **não consegue** cumprir o portão de aposentadoria hoje. É uma
  limitação declarada, não resolvida.

### Neutral
- As janelas 90/180 (D3) permanecem; o que muda é o que as acompanha.

## Alternatives Considered

1. **Manter `Deprecation: true` (como a §4.4 manda).** Rejeitada: contraria a norma vigente
   (RFC 9745) e um header inválido é pior que nenhum. Mas **só a emenda constitucional** pode
   executar esta rejeição — por isso o ADR para aqui (R9).
2. **Emendar a §4.4 para uma forma própria.** Rejeitada: inventa campo onde existe RFC.
3. **Versionamento por header (`Accept: application/vnd.…+json`).** Rejeitada por §4.4, que o
   proíbe explicitamente.
4. **Versionamento por query (`?version=1`).** Rejeitada pela mesma razão.
5. **Não versionar (mudança in-place, "sempre compatível").** Rejeitada: a §4.3 já lista o que
   **é** breaking change (apertar validação, mudar status de sucesso, remover enum), e D1/ADR-032
   produzem pelo menos duas dessas. Sem versão, elas não teriam como ser entregues.
6. **Deprecar por endpoint.** Rejeitada: incompatível com a métrica por prefixo da §4.4 (D5).
   **Reaberta e aceita em 2026-10-14** — a rejeição transferia a granularidade da *métrica de
   aposentadoria* (um prefixo) para o *escopo do header* (um recurso). RFC 9745 §2.2 define o padrão
   como o recurso, e §4.4 v2.2.0 agora exige que o escopo maior seja **documentado**. Ver
   *Post-acceptance amendment*.

## Implementation Plan

- [x] **Ato humano — feito em 2026-10-14.** `CONSTITUTION.md` §4.4 emendada para **2.2.0** via o
      processo da §9: `Deprecation: <sf-date>` (`@<unix-seconds>`) + `Sunset: <HTTP-date>`, com
      `Sunset` não-anterior a `Deprecation`. Ratificação: **H-1** (`reports/api/fase-1.md` §5.1).
      *(Esta linha dizia `<HTTP-date/unix>`; a forma correta não admite HTTP-date em `Deprecation` —
      é `@<unix-seconds>`, RFC 9745 §2.1 → RFC 9651 §3.3.7. Corrigido na própria emenda.)*
- [x] A2 — `setGlobalPrefix('api')` + `enableVersioning` (D1) e atualização do spec canônico (ADR-040)
      — commit `d3747db`.
- [ ] **Metade feita em A2.** O gate de contrato rejeita a forma booleana (`scripts/contract-gate.mjs`,
      commit `809d68f`). A outra metade — publicar os headers no spec canônico com schema — **não tem o
      que publicar ainda**: nenhum path do spec canônico está marcado como depreciado (`/auth/refresh`
      é `x-mvp-scope: excluded`, que não significa depreciado). Fica para o primeiro endpoint que
      entrar em depreciação.
- [ ] A2+ — bloquear aposentadoria de versão por ausência da métrica de 30 dias (D4); registrar a
      dependência de `ADR-006`. **Aberto em 2026-10-14:** `iac/kong/kong.yml` continua sem plugin de
      log de acesso/observabilidade — `grep -iE "http-log|file-log|prometheus|opentelemetry|correlation"`
      não encontra nada no arquivo.
- [ ] A2 — template de entrada de `CHANGELOG.md` com os quatro campos de D6. **Parcial:** os quatro
      campos estão na entrada de breaking change de A2 (commit `6e49ba2`), mas não há *template*
      formal no arquivo — o formato se deduz do exemplo.

## Post-acceptance amendment — 2026-10-14

Written after acceptance, because the ratification of D2 exposed a defect **in D5** that the
`Proposed` status had been hiding behind D2.

**D2 — executed.** §4.4's `Deprecation` row now mandates `Deprecation: <sf-date>` and states the
`Sunset ≥ Deprecation` ordering; `CONSTITUTION.md` is at v2.2.0 and §9 carries the diff, the defect
identifier and the "what weakens" table. The choice among the alternatives is settled: Alternative 2
(*invent a form of our own*) stays rejected, Alternative 1 (*keep the boolean*) is now formally
rejected by the constitution rather than by this ADR.

**D5 — withdrawn, and the reason it was wrong is worth recording.** D5 read *"Depreciação é anunciada
por versão inteira, nunca por endpoint solto"* and justified it by D4. RFC 9745 §2.2 says the opposite
about the header's default scope:

> The Deprecation header field applies to the resource identified with the response it occurred
> within (see Section 6.4.2 of [HTTP]), meaning that it announces the upcoming deprecation of that
> specific resource. However, there may be scenarios where the scope of the announced deprecation is
> larger than just the single resource where it appears.
> — RFC 9745 §2.2

and it is explicit that the wider reading is the dangerous one:

> Resources are free to define such an increased scope […]. When doing so, it is important to take
> into account that such increased scoping is **invisible for consumers who are unaware of the
> increased scoping rules**.
> — RFC 9745 §2.2

The error was a category mistake between two different granularities:

| Question | Granularity | Where it lives |
|---|---|---|
| *What does this header deprecate?* | the **resource** in the response's context | RFC 9745 §2.2; §4.4 v2.2.0 |
| *What does the 30-day no-traffic metric measure?* | a **prefix** (`/api/v1`) | §4.4 *Retirement gate* (unchanged) |

D4's requirement — the metric must exist before any deprecation — is unaffected and is **still
unsatisfied** (no log sink in `iac/kong/kong.yml`), so a deprecation can be announced and cannot be
retired on evidence. That is a missing instrument, not a wrong rule.

**Consequence for the pending work.** D-3 (`/auth/refresh` removal, ADR-040 D5) is unblocked as far as
the header form goes: the RFC-conformant way to deprecate one resource now exists, and it is the
constitutionally mandated one. The remaining question for D-3 is not the header but §4.5's
*"`/auth/refresh` is out of MVP scope"* — an endpoint that was never in scope is not the same thing as
a deprecated one, and the `CHANGELOG.md` *Deprecated* entry already says so.

## References

- `CONSTITUTION.md` §4.4 (Versioning & Lifecycle — texto vinculante; desde 2026-10-14, v2.2.0, o
  `Deprecation` é `<sf-date>` e não mais `true`), §4.3 (breaking changes), §9 (Amendment)
- **RFC 9745** — *The Deprecation HTTP Response Header Field*, Standards Track, **março de 2025**
  §2.1 (sintaxe), §2.2 (escopo), §3 (`rel="deprecation"`), §4 (`Sunset` não-anterior a `Deprecation`)
  (fonte primária: `https://www.rfc-editor.org/rfc/rfc9745.txt`, verificado em 2026-10-14)
- **RFC 9651** — *Structured Field Values for HTTP*, Standards Track, **setembro de 2024** §3.3.7
  (o tipo `sf-date`: `@` + segundos desde a época Unix — e **não** um HTTP-date)
  (fonte primária: `https://www.rfc-editor.org/rfc/rfc9651.txt`, verificado em 2026-10-14)
- **RFC 8594** — *The Sunset HTTP Header Field*, Informational, **maio de 2019**
- **RFC 8288** — *Web Linking*, Standards Track, out/2017 (obsoleta 5988)
- `docs/adr/030-gateway-rate-limiting.md` (mede que o artefato do Kong **não existe**)
- `docs/adr/006-kong-api-gateway.md` · `docs/api/openapi.yaml` (`servers: …/v1`) ·
  `docs/api-spec.openapi.yaml` (`servers: /api/v1`) · `its-platform/src/main.ts`
