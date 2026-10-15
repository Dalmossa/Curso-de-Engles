---
adr: 038
title: Autenticação, escopos e autorização por objeto — e por que outro aprendiz responde 404, não 403
status: Accepted
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@security-lead, @backend-lead]
informed: [@team]
tags: [api, security, authz, bola, idor, scopes, rls, adr-013, adr-026, bdd-amendment, needs-human-review]
---

**Accepted** (2026-10-15). Ratificado integralmente naquele dia — **D1, D2, D4, D4.1 e D7** — e a
ratificação veio junto com a escolha do escopo de implementação: **"mínimo: só a leitura que a RLS
governa"**. O que isso fechou e o que isso deixa aberto:

- **D1 e D2 implementadas** (`reports/api/fase-5b.md`). `JwtAuthGuard` é um guard **global**,
  instalado em `configureApp` — o mesmo caminho que os testes de integração percorrem, e não um
  provider de módulo que só o processo de produção carregaria. A lista de `@Public()` é fechada e
  tem dois membros (`GET /health`, `GET /ready`). O conjunto de escopos de D2 é um valor **e** um
  tipo (`SCOPES`/`Scope`, `src/common/auth/scopes.decorator.ts`), para que um erro de escrita seja
  erro de compilação. Sem `OIDC_JWKS_URI`/`OIDC_ISSUER`/`OIDC_AUDIENCE` configurados o guard
  **recusa tudo** (`DenyAllTokenVerifier`) em vez de verificar nada — a metade aberta de ADR-013
  não pode ser preenchida por omissão.
- **D4.1 executada**: `tests/bdd/README.md` passou a exigir **404** no cenário do aprendiz alheio.
- **D7 respondida**: o claim de sujeito é o `sub` do JWT e o seu valor é o `learner_id` opaco
  (Classe L, ADR-031 D1). É esse valor, e nada mais, que entra em `PgSessionContext`; a forma do
  claim é a decisão de identidade que ADR-013 mantém aberta quanto ao *IdP*, não quanto ao claim.
- **Uma tensão dentro de D4 fica nomeada e não resolvida** — o *Implementation note* abaixo. Ela é
  a razão de `needs-human-review` continuar nos `tags`.

`deciders` continua `unassigned` de propósito: a ratificação foi dada pela autoridade de decisão do
projeto, e escrever um handle aqui afirmaria que uma pessoa nomeada aprovou — a mesma razão pela
qual ADR-033 o mantém assim.

## Context

O arcabouço está decidido e **não** é reaberto aqui:

- `CONSTITUTION.md` §4.5 — *"Deny by default: `JwtAuthGuard` registered as a **global** guard; public
  routes opt out explicitly via `@Public()`. Authorisation is a separate concern from authentication
  and is never inferred from token validity alone."* Claims `iss`/`aud`/`exp`/`nbf` validados em
  toda requisição; `verifyOptions.algorithms` fixado (`RS256`).
- `ADR-013` (Proposed; a metade MVP é vinculante) — a API é **Resource Server**; não emite token.
- `ADR-026` — `PgSessionContext` é o **único** escritor de `app.current_learner_id`.

O que A0 mediu (e é grave):

1. **Zero guards.** Não existe um único `@UseGuards` em `src/`. *"Deny by default"* não está
   implementado: hoje o default é **allow**.
2. **BOLA estrutural.** As 5 rotas `/learners/*` devolvem o `:id` recebido da URL. Um pedido por
   `learner_id` alheio devolve dados "daquele" aprendiz sem qualquer verificação — porque não há dado
   real nem verificação.
3. **RLS inalcançável pela API.** As 15 tabelas learner-scoped com política (`docs/data-model.erd.md`
   §9) só são tocadas por `audit.service.ts:141` e `diagnostic-result.service.ts:26`. Ou seja: existe
   uma política de isolamento **e** ela nunca é exercida pelo caminho HTTP.
4. **O BDD contradiz o R6.** `tests/bdd/README.md:237` — *"When L2 requests GET /learners/L1/profile
   Then the response is 403 Forbidden"*. O R6 manda **404** (não confirmar existência). O cenário
   Gherkin está errado sob o requisito, e é um artefato executável (uma suíte que implemente 404
   falharia o BDD, e vice-versa).

## Decision

**D1 — `JwtAuthGuard` é global; a lista de `@Public()` é fechada e curta.** Proposta:

| Rota | Acesso | Justificativa |
|---|---|---|
| `GET /health` | `@Public()` | sonda de liveness; §4.6 a exige sem token |
| `GET /ready` | `@Public()` | sonda de readiness; §4.6 |
| `/api/v1/content/*` | autenticado | é o produto; expor catálogo anonimamente não tem consumidor nomeado (R3) |
| todo o resto | autenticado + escopo | deny by default (§4.5) |

A decisão "catálogo é público?" fica **proposta** como "não" e é reversível para o lado permissivo
(afrouxar é não-breaking; apertar é breaking — §4.4).

**D2 — Conjunto de escopos fechado e mínimo.** Escopos são afirmações sobre o **sujeito do token**,
nunca sobre um id de path:

| Escopo | Concede | Detentor |
|---|---|---|
| `content:read` | ler catálogo (`/content/*`) | aprendiz |
| `learner:self` | ler/escrever **apenas** os próprios recursos | aprendiz |
| `learner:export` | exportar os próprios dados (LGPD 18 II/V) | aprendiz |
| `learner:erase` | solicitar a eliminação dos próprios dados (LGPD 18 IV/VI) | aprendiz |
| `learners:read` | ler dados de aprendiz nomeado | staff |
| `learners:admin` | operar sobre aprendiz nomeado | staff |

**D3 — A autorização por objeto é a RLS, não uma comparação de ids.** O recurso é carregado
**dentro** de `PgSessionContext` com o sujeito do token (ADR-026/ADR-003). Se a política não deixa
ver, a linha não existe — e a API responde **404**. Não há *"if (pathId === tokenSubject)"*: essa
comparação é o que quebra quando um recurso passa a ser endereçado por outro id (ADR-031 Classe L),
quando um staff lê por outro, ou quando um recurso é composto por dois aprendizes (ex.: turma).
D3 é o que torna D4 executável: o 404 não precisa ser lembrado em cada controller, ele **é** a
consequência de a consulta não devolver linha.

**D4 — Objeto de outro aprendiz responde 404 (R6); 403 é outra coisa.** Regra:

| Situação | Resposta | Por quê |
|---|---|---|
| token válido, escopo insuficiente (`content:read` acessando `/learners/*`) | **403** | o cliente **pode** saber que falta escopo; nada é revelado sobre o objeto |
| token válido, sem escopo, objeto **inexistente ou alheio** | **404** | 403 confirmaria a existência do objeto — é a definição de *enumeration oracle* |
| token inválido/ausente/claim faltando | **401** | §4.5: nunca rebaixar para "anônimo" |
| recurso do **próprio** aprendiz | 200 | — |

Nota: quando o escopo falta e o objeto **não** é do solicitante, o resultado é 404 — a escassez de
escopo não justifica confirmar existência.

> **Implementation note (A5b) — `needs_human_review`.** A **linha 1** da tabela acima e a **nota**
> não podem valer as duas sob D3, e a implementação teve de escolher. O mesmo pedido — token com
> `content:read`, `GET /learners/{learner_id}/profile` — cai nas duas: a linha 1 diz **403** (escopo
> insuficiente para a rota), a nota diz **404** quando o objeto é alheio.
>
> Aplicar a **nota** exigiria saber se o objeto é alheio **antes** de decidir o escopo. A única
> forma de o saber sem consultar o banco é comparar o `{learner_id}` do path com o sujeito do token
> — a forma `if (pathId === tokenSubject)` que **D3 rejeita por nome**. Consultando primeiro, a
> resposta só chega depois da leitura, e nesse ponto a ordem já não é "escopo, depois objeto": é
> "objeto, depois escopo".
>
> Aplicar a **linha 1** é o que A5b implementou: o guard decide pelo que a **rota** exige e pelo que
> o **token** traz, nunca pelo objeto, e por isso responde o mesmo `403` quer o id exista, quer não.
> Não há oráculo de enumeração em nenhuma das duas ordens — mas as linhas 2 e 3 de D4 descrevem o
> caso "objeto alheio ⇒ 404" **para um token que já tem o escopo da rota**, que é o caso do cenário
> de aceitação (D4.1) e o que está implementado. A linha 1, a nota, as linhas 2–4: **a nota é a
> única das cinco afirmações que a implementação não satisfaz.**
>
> Medição e os testes que fixam a leitura adotada: `reports/api/fase-5b.md` §4. A decisão humana
> pedida é uma só: **em `GET /learners/{id}/…`, um token sem `learner:self` que pede o id *de outro*
> responde 403 (como hoje) ou 404 (como a nota diz)?** Responder 404 mantém D3 — a RLS continua a
> decidir o que existe — ao custo de a checagem de escopo passar para dentro do handler, depois de
> carregar o recurso.

**D4.1 — `tests/bdd/README.md:237` é corrigido de 403 para 404.** O cenário fica: *"Then the response
is 404 Not Found and the PostgreSQL RLS policy blocks the query."* Como é um artefato de aceitação,
esta correção é uma **emenda ao BDD** e portanto um ato humano: este ADR fica `Proposed` e para (R9).

**D5 — Sem IDOR por adivinhação.** Ids de Classe L são opacos (ADR-031 D1). D4 garante que um acerto
na adivinhação não se distingue de um id inexistente. D5 também cobre a listagem: um filtro por id
alheio **filtra para vazio**, não erra — devolver coleção vazia não é vazamento.

**D6 — Acesso de staff é escopo separado, com trilha de auditoria própria.** `learners:read` /
`learners:admin` **não** são "o mesmo que `learner:self` com mais poder": são atores distintos. Toda
leitura e escrita de staff entra no log append-only/hash-chained da §4.6 — que já lista
*"access-control denials"* como evento auditável obrigatório. Sem D6, o staff vira um canal sem
trilha.

**D7 — O mapeamento token → `learner_id` é decisão de identidade, não deste ADR.** Como o IdP
de `ADR-013` ainda não existe (a metade aberta daquele registro), D7 apenas **nomeia a dependência**:
sem claim estável de sujeito, D3 não tem o que colocar no `PgSessionContext`.

> **UNVERIFIED / needs_human_review:** o IdP e a forma do claim de sujeito (ADR-013, half-open).
> Enquanto a metade aberta de ADR-013 não fechar: (a) D1–D6 podem ser implementados contra um
> verificador de JWKS; (b) D7 **não**; e (c) nenhuma rota pode emitir token (§4.5, ADR-013).

## Consequences

### Positive
- "Deny by default" passa a ser **verdade** no código: hoje o default é permitir tudo.
- D3 faz a segurança de objeto ser uma propriedade do banco (RLS) e não uma checagem que se esquece.
  É a diferença entre um controle e uma convenção — o mesmo argumento que fez o `ADR-029` trocar
  `REVOKE` por trigger.
- D4 fecha o oráculo de enumeração; e o conflito com o BDD fica **nomeado** e resolvido por D4.1,
  não deixado para o implementador descobrir.

### Negative
- D1 torna `/content/*` inacessível sem token — **quebra** qualquer consumidor anônimo do catálogo
  (não há um hoje, mas é breaking change sob §4.4 e vai para o CHANGELOG).
- D4.1 **altera um cenário de aceitação**. Isso é visível, deliberado e precisa de aprovação explícita.
- D3 significa que **ninguém** no meio do caminho pode "checar o dono" sem abrir a sessão do banco;
  a corretude inteira passa a depender de `ADR-026` ter sido usado. Um handler que consulte com
  credencial de owner (bypass de RLS, como A0 mediu que o harness de teste faz — `ADR-014`/`ADR-026`)
  **não** tem isolamento e o teste não achará o problema.
- 404 onde "objeto alheio" e "objeto inexistente" são iguais significa que **depurar** um caso de
  permissão exige correlacionar com o log — não dá para distinguir pela resposta, por design.

### Neutral
- O conjunto de escopos (D2) pode mudar para mais escopos sem quebrar (aditivo); removê-los é
  breaking change.

## Alternatives Considered

1. **403 para objeto de outro aprendiz (como o BDD diz hoje).** Rejeitada por R6: 403 confirma
   existência e transforma a API num oráculo de enumeração. É a alternativa *mais provável de ser
   pedida* e por isso está registrada aqui explicitamente.
2. **Checagem explícita `pathId === tokenSubject` por controller.** Rejeitada (D3): duplica uma
   decisão de segurança em N lugares, quebra com staff e recursos compostos, e é precisamente o
   padrão que falha por esquecimento.
3. **Middleware de autorização sobre o id, antes da consulta.** Rejeitada: decide sobre um id sem
   conhecer o recurso; no melhor caso reproduz D3 mais complexo, no pior caso vaza existência.
4. **Um escopo único `learner` cobrindo self e staff.** Rejeitada (D6): colapsa dois atores distintos
   e remove a possibilidade de trilha diferenciada.
5. **Catálogo público (`/content/*` sem token).** Não adotada (D1), e é reversível — afrouxar não é
   breaking change. Reavaliar quando houver consumidor anônimo nomeado (R3).
6. **Confiar apenas no gateway para autorização.** Rejeitada: §4.5 exige guard global na aplicação;
   o gateway aplica rate limit (§4.5, ADR-030), não autorização de objeto.

## Implementation Plan

- [x] **Ato humano (2026-10-15).** Ratificado: ADR-038 inteiro — D1 (guard global; só `/health` e
      `/ready` públicos; catálogo autenticado), D2, D4, D4.1 (emenda do BDD 403 → 404) e D7. Escopo
      escolhido para a implementação: **mínimo — só a leitura que a RLS governa**.
- [x] A2 (A5b) — `JwtAuthGuard` global + `@Public()` (D1) e o conjunto de escopos (D2), com o
      verificador de JWKS (RS256, `iss`/`aud`/`exp`/`nbf`), o *fail closed* de uma configuração
      ausente e a fixture de JWKS de teste que ADR-013 pedia.
- [ ] A2 — `401`/`403` no spec canônico (ADR-040) e no catálogo de problemas (ADR-034).
- [ ] A3 — trocar as 5 rotas `/learners/*` mock por consultas sob `PgSessionContext` (D3).
- [ ] A3 — controle negativo **obrigatório**: L2 pedindo recurso de L1 ⇒ **404**, e a query não
      retornou linha (provar RLS, não só o status) — o par positivo é L1 lendo o próprio ⇒ 200.
- [ ] A3 — nenhum handler learner-scoped pode rodar com credencial de owner (a armadilha medida em
      `ADR-026`); o teste asserta o papel da conexão.
- [ ] A3/A6 — eventos de staff e de negação no log §4.6 (D6).

## References

- `CONSTITUTION.md` §4.5 (deny by default, guard global, claims, escopos, mass assignment),
  §4.6 (audit log de negações e de export/erase), §4.4 (breaking change)
- `docs/adr/013-auth-architecture-resource-vs-authorization-server.md` (Resource Server; metade
  aberta = IdP)
- `docs/adr/026-learner-context-app-role.md` (único escritor de `app.current_learner_id`)
- `docs/adr/003-postgresql-rls.md`, `docs/data-model.erd.md` §9 (as 15 tabelas com política)
- `docs/adr/031` (ids Classe L opacos) · `docs/adr/034` (`404`/`403` no `Problem`) ·
  `docs/adr/042` (H2 — export/erase)
- `its-platform/tests/bdd/README.md:237` (o cenário 403 a emendar) · `docs/api/inventario.md` §6
