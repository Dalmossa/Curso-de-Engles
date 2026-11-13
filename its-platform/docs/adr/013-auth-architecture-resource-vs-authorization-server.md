---
adr: 013
title: Auth architecture — Resource Server vs Authorization Server, and IdP selection
status: Accepted
decided: 2026-11-10
deciders: [@system-design-architect, @content-owner, @adaptive-lead]
tags: [security, auth, oauth2, oidc, jwt, answered]
---

> **This ADR is intentionally incomplete.** The decision below has two halves. The
> **MVP half is settled** and is binding on `BACKLOG.md` P0/P1. The **long-term half is
> open** — no Identity Provider has been evaluated or chosen, and nothing in this record
> should be read as a recommendation for one. It is published as `Proposed` so that the
> open half stays visible rather than being resolved silently during implementation.

## Context

The platform must authenticate learners and staff. Two architectural questions are
conflated, and they have very different deadlines.

### Question 1 — Does the API issue tokens?

A **Resource Server** validates tokens minted by someone else. An **Authorization Server**
mints them: it owns `/authorize`, `/token`, and `/revocation`, stores client credentials,
and manages refresh-token families.

**This is currently a live contradiction in the published contract.**
`docs/api-spec.openapi.yaml` defines `/auth/refresh` (line 849) whose `200` response
returns `{access_token, expires_in}`, secured by the `RefreshToken` scheme (line 51).
An endpoint that mints access tokens is Authorization Server behaviour. Meanwhile
`CONSTITUTION.md` §4.5 states the API is a Resource Server and that `/auth/refresh` is
out of MVP scope. The contract and the Constitution currently disagree, and the code
implements neither.

This matters beyond tidiness. Building a token issuer means taking on responsibilities
that are easy to under-estimate and expensive to get wrong:

| Responsibility | Consequence if skipped |
|---|---|
| Key custody | The platform holds signing keys for a credential it does not need to authenticate |
| Refresh-token rotation with reuse detection | A stolen refresh token is replayable indefinitely |
| Token revocation on account disable | A disabled learner's access token stays valid until expiry |
| Consent and client registration | OAuth 2.0 §10 client-registration surface becomes our liability |
| Federation with institutional IdPs | Universities and corporate tenants cannot federate |

None of these are needed to run an adaptive tutor. All of them are needed if the platform
ever becomes the credential authority for its users.

### Question 2 — Which Identity Provider?

**Not evaluated, not chosen.** No comparison of managed versus self-hosted providers has
been performed, and no provider is named here by intent. This question is **blocked on
Question 1**: it is only worth asking if the platform issues tokens. If the answer to
Question 1 is "Resource Server, permanently", Question 2 is answered automatically — we
consume a third-party IdP and select one on operational grounds (SSO requirement,
data residency, cost per MAU, LGPD posture) rather than on protocol design.

Deciding Question 2 first, as a proxy for Question 1, is the failure mode this record
exists to prevent.

## Decision

### Settled — Question 1 (binding)

**The platform issues tokens. It operates as an Authorization Server.**

- The NestJS layer implements `/auth/token`, `/auth/refresh`, and `/auth/revocation` endpoints.
- Token minting uses RS256 with keys managed by the platform (key custody, rotation, revocation).
- `JwtAuthGuard` validates tokens minted by the platform itself.
- Access tokens are short-lived (~15 min); refresh tokens use rotation with reuse detection.
- The `/auth/refresh` endpoint in the OpenAPI contract is **in scope** and must be implemented (previously blocked, now active).

### Open — Question 2 (IdP selection)

**Not evaluated, not chosen.** The platform is the Authorization Server for its own tokens. A third-party IdP may still be used for:
- Social login (Google, GitHub) via OAuth 2.0 federation
- Institutional SAML/OIDC federation for enterprise tenants
- The platform remains the token authority; external IdPs are identity sources, not token issuers.

## Consequences

### Positive

- **Full control over token lifecycle** — issuance, rotation, revocation, and audit trail.
- **No external dependency for core auth** — the platform can operate independently.
- **LGPD posture simplified** — the platform is the controller for auth credentials; no sub-processor for token minting.
- **Session continuity owned** — refresh cadence, device management, and revocation UX are in our hands.

### Negative

- **Key custody responsibility** — signing keys must be managed, rotated, and protected (HSM or KMS recommended).
- **Refresh-token rotation with reuse detection** — implementation burden; a stolen refresh token must be detected and invalidated.
- **Token revocation on account disable** — must be immediate; access tokens stay valid until expiry unless introspection is used.
- **Client registration surface** — OAuth 2.0 dynamic client registration or manual client management becomes our liability.

### Neutral

- The choice does not affect the adaptive engine, content pipeline, or curriculum graph.
- Token format remains RS256 with `verifyOptions.algorithms` pinned to `['RS256']`, `iss` / `aud` / `exp` / `nbf` validated.

## Alternatives Considered

1. **Build an Authorization Server in the MVP** — Rejected *for now*. It adds key custody,
   rotation, revocation, and client registration to a product that needs none of them to
   deliver a working tutor. If a suitable managed IdP proves unavailable or uneconomic, this
   ADR should be revisited rather than treated as settled.
2. **Choose an IdP first, decide the role second** — Rejected as the ordering. Protocol
   selection cannot substitute for the role decision; it biases it toward "we will need
   token issuance eventually."
3. **Session cookies with server-side sessions** — Rejected in §4.3. The API is stateless;
   a server-side session store reintroduces state, complicates horizontal scaling, and
   diverges from the declared architecture.

## Implementation Plan

- [ ] Implement `/auth/token` (password grant + client credentials for machine-to-machine)
- [ ] Implement `/auth/refresh` with refresh-token rotation and reuse detection
- [ ] Implement `/auth/revocation` (RFC 7009)
- [ ] Key management: generate RS256 key pair, store private key in KMS/HSM, publish JWKS at `/.well-known/jwks.json`
- [ ] `JwtAuthGuard` global registration with `@Public()` opt-out
- [ ] Token validation: RS256, algorithm pinning, `iss` / `aud` / `exp` / `nbf` claims
- [ ] Short-lived access tokens (~15 min), refresh tokens with rotation
- [ ] Evaluate managed vs self-hosted IdP for social/institutional federation (Question 2) — only if federation is required
- [ ] Update `docs/threat-model.md` — add token-minting entries (key custody, rotation, revocation)
- [ ] Remove `x-blocked-by: ADR-013` annotation from `/auth/refresh` in OpenAPI spec
- [ ] Update `CONSTITUTION.md` §4.5 to reflect Authorization Server role
- [ ] Update `iac/kong/kong.yml` to allow `/auth/refresh` (remove 501 block)

## References

- `CONSTITUTION.md` §4.3 (stateless API), §4.5 (security, authentication, data sanitisation), §4.4 (breaking-change policy)
- [ADR-012](012-migrate-api-layer-to-nestjs.md) — the guard that enforces this role
- `docs/api-spec.openapi.yaml` — `/auth/refresh` (line 849), `securitySchemes` (lines 45–54)
- `docs/threat-model.md` — spoofing / tampering of credentials
- OAuth 2.0 RFC 6749 · OIDC Core 1.0 · RFC 8725 (JWT BCP — algorithm pinning)

## Nota de estado — A5a (2026-10-15)

> Nota datada, não uma decisão nova. Este ADR segue `Proposed`, e o que A5a executou é a metade
> **Settled**, que esta própria página declara *"binding on `BACKLOG.md` P0/P1"*. Nada da metade
> **Open** foi tocado: nenhuma das quatro perguntas foi respondida.

**O que mudou no repositório.** `POST /auth/refresh` deixa de devolver
`{access_token: 'mock_access_token', expires_in: 900}` com `200` e passa a devolver `501`, e
`AuthService` — cujo único método cunhava o mock — é deletado. Até A5a este ADR estava correto e o
**código** era o único artefacto que discordava dele: `CHANGELOG.md` (*"Returns `501`"*),
`docs/security-audit.md` V2.2.1, `iac/kong/kong.yml` (*"501 until P1.15–P1.17"*) e o contrato
canônico (`x-mvp-scope: excluded` + resposta `501`) já afirmavam o mesmo desde A2. A execução segue
a instrução desta página ao pé da letra — *"must not be implemented"*, com o path **mantido** e
anotado — e **não** antecipa a remoção, que esta página reserva explicitamente (*"this record is not
the place to authorise one"*) e que `docs/api/inventario.md` D-3 mantém como ato humano.

**Uma frase de outro documento foi corrigida por causa disto.** `docs/api-spec.md` dizia que a rota
*"must be deleted from the NestJS routes, not merely annotated"* e atribuía a remoção a ADR-038 /
ADR-043; medido, **nenhum dos dois documentos menciona o endpoint**. O que a frase tinha de
operativo — o mock **emitir** um token era a violação em si — foi o que A5a removeu; a remoção da
rota continua nomeada como a opção aberta de `docs/api/inventario.md` D-3.

**Estado do Implementation Plan desta página.** A caixa 1 está feita desde A2 e a instrução que ela
implementava passou a ser verdadeira no servidor em A5a; as outras seguem abertas, e as duas que
importam dependem de **ato humano**, não de trabalho:

| Item do plano | Estado após A5a |
|---|---|
| *"Annotate `/auth/refresh` … blocked on ADR-013"* | feito em A2 (contrato canônico); **A5a fez a anotação verdadeira no comportamento**: `501` + `AuthService` deletado |
| *"Build a local JWKS-signing fixture for P1"* | não feito — pertence a P1.14, não a A5a |
| *"Close Question 1"* | **aberto, e é a única coisa que bloqueia o resto de P1.14** — ato humano |
| *"Close Question 2"* | aberto; depende da Questão 1 |
| *"If Question 1 resolves to 'no permanently': delete `/auth/refresh`"* | **não feito, e não antecipado**: remover um path publicado é mudança breaking (§4.4) que esta página recusa autorizar. Continua sendo o outro ramo de `docs/api/inventario.md` D-3 |
| *"Update `docs/threat-model.md`"* | aberto; depende da Questão 1 |

**Evidência.** `tests/integration/auth-refresh.spec.ts` (6 casos sobre HTTP real, contra o
`AuthModule` real; vermelho antes da mudança com `Expected: 501, Received: 201`); `CHANGELOG.md`
(entrada breaking com o caminho de migração); `reports/api/fase-5.md` §2 e §8.
