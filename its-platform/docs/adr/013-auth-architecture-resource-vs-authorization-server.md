---
adr: 013
title: Auth architecture — Resource Server vs Authorization Server, and IdP selection
status: Proposed
deciders: [unassigned]
tags: [security, auth, oauth2, oidc, jwt, open-question]
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

### Settled — MVP scope (binding)

**The API is a Resource Server. It does not issue tokens.**

- The NestJS layer validates JWTs issued by an external IdP and nothing more.
- `JwtAuthGuard` is registered as a global guard; public routes opt out via `@Public()`
  (`CONSTITUTION.md` §4.5, deny by default).
- **`/auth/refresh` is out of MVP scope and must not be implemented.** The path remains in
  the OpenAPI document so the contract keeps its intent, but it is annotated as blocked on
  this ADR. It is annotated rather than deleted because removing a published path is a
  breaking change under §4.4, and this record is not the place to authorise one.
- Token *consumption* requirements are binding now: RS256, `verifyOptions.algorithms`
  pinned to `['RS256']`, and `iss` / `aud` / `exp` / `nbf` validated on every request.
- Short-lived access tokens (~15 min). Refresh-token rotation and reuse detection are the
  **IdP's** responsibility under this decision; the platform does not track `jti`.

The purpose of recording this half now is to make "the API does not issue tokens" a
*prohibition* rather than an omission, so that an implementer who finds `/auth/refresh`
in the contract does not quietly build an IdP.

### Open — do not assume either answer

1. **Does the platform ever become an Authorization Server?** If yes, what is the trigger —
   institutional federation, white-label deployment, or absence of a suitable provider?
2. **If yes, is it built or bought?** A self-hosted IdP (Keycloak, Zitadel, Ory) versus a
   managed one. Trade-off is control versus operational burden, and it is partly a
   commercial decision, not a technical one.
3. **Where does token storage and refresh live** if the platform delegates issuance but
   still needs session continuity?
4. **What is the LGPD posture of the chosen provider?** Controller vs processor, data
   residency, sub-processor list. This is a §8.1 compliance input, not an afterthought.

## Consequences

### Positive

- **The MVP cannot accidentally become a credential authority.** §4.5 and this record both
  state the prohibition; an implementer has to actively override two documents.
- **Signing-key custody stays outside the platform** for the MVP, removing the highest-
  severity item from the threat model (§8 tamper / spoofing of credentials).
- **The decision is reversible.** Moving to an Authorization Server later is additive —
  it adds endpoints — rather than requiring the Resource Server role to be unwound.
- **The blocking dependency is explicit.** P0/P1 work that needs authentication can proceed
  against a stub IdP without waiting for this ADR to close.

### Negative

- **The contract is temporarily inconsistent.** `/auth/refresh` is published but must not
  be built. This is a real cost: a reader of the OpenAPI document alone would conclude the
  platform mints tokens. Mitigated by the annotation on the path, and it resolves the
  moment this ADR closes — in one direction or the other.
- **Client-side token handling moves outside our control.** Session continuity, refresh
  cadence, and revocation UX are constrained by whichever IdP is selected.
- **A stub IdP is required for P1.** Integration tests need a token source before Question
  2 closes. A local JWKS-signing fixture is sufficient and is explicitly *not* a product
  IdP.

### Neutral

- **The choice does not affect the adaptive engine, content pipeline, or curriculum graph.**
  Authentication is an edge concern; deferring it costs nothing in the core domain.
- **Token format is unaffected.** RS256 and the claim-validation rules hold under both
  answers, so the work done for the MVP half is not wasted.

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

- [x] Annotate `/auth/refresh` in `docs/api-spec.openapi.yaml` as out of MVP scope, blocked on ADR-013
      — done; the path carries the annotation and `x-blocked-by: ADR-013`, and A5a made it answer
      `501` rather than mint a token (`reports/api/fase-5.md`, C3; the `501` is in the document)
- [x] Build a local JWKS-signing fixture for P1 integration tests (test-only; not a product IdP)
      — done in A5b: `its-platform/tests/helpers/tokens.ts` generates a key pair per suite and serves
      a real JWKS over loopback HTTP, so the application under test fetches and verifies exactly as it
      would in production. It signs; it does not issue for a person, and it is not shipped
- [ ] Close Question 1 — decide whether the platform ever issues tokens, and record the trigger if yes
- [ ] Close Question 2 — only if Question 1 resolves to "yes"; evaluate managed versus self-hosted, including LGPD posture
- [ ] If Question 1 resolves to "no permanently": delete `/auth/refresh` from the contract as a breaking change under §4.4, and update §4.5 to remove the deferral language
- [ ] Update `docs/threat-model.md` — remove the token-minting entries if the platform never issues tokens

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
