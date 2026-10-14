---
adr: 031
title: Identificadores, URLs e profundidade de aninhamento da API
status: Proposed
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@backend-lead, @security-lead]
informed: [@team]
tags: [api, rest, naming, identifiers, bola, adr-013, adr-016, adr-026]
---

## Context

`CONSTITUTION.md` §4.3 já fixa parte do vocabulário de URL e **não** está em discussão aqui:

| Regra §4.3 | Texto |
|---|---|
| Recursos | *"RESTful. Plural noun resources (`/learners/{learner_id}`), semantic HTTP verbs, no verbs in paths."* |
| Segmentos fixos | `kebab-case` |
| Propriedades JSON | `camelCase` |
| Query parameters | `camelCase` |
| Identificadores de conteúdo | `snake_case` e **imutáveis** — *"This is a data-integrity rule, not a style rule."* |

O que §4.3 **não** decide, e o que A0 mediu que está aberto ou errado:

1. **Não há prefixo de versão nem `api`.** `src/main.ts` não chama `setGlobalPrefix` nem
   `enableVersioning`. A §4.4 exige `/api/v1`, então as 12 rotas implementadas hoje estão fora
   do contrato publicado. (`reports/api/fase-0.md` §1.1.)
2. **As 5 rotas `/learners/*` ecoam o `:id` da URL.** `learners.controller.ts` devolve o id
   recebido como se fosse o dono do recurso. Nenhuma rota aciona `PgSessionContext` — só
   `audit.service.ts:141` e `diagnostic-result.service.ts:26` o fazem. Isso é **BOLA estrutural**:
   as 15 tabelas learner-scoped com RLS (`docs/data-model.erd.md` §9) são inalcançáveis pela API,
   e a autorização por objeto não tem onde acontecer. (`docs/api/inventario.md` §6.)
3. **Não existe regra de profundidade.** A §4.3 dá o exemplo `/learners/{learner_id}`, e o
   `docs/api-spec.openapi.yaml` publica `/{collection}/{id}/audio` (2 níveis), mas nada impede um
   recurso de 3–4 níveis, que é onde as URLs deixam de ser estáveis.
4. **Duas classes de id convivem sem regra.** O conteúdo tem ids canônicos e significativos
   (`les_a1_greetings`, `pack_les_a1_greetings_v1`, `lst_prn_th_001`), imutáveis por §4.3 e
   guardados por `ADR-016` + `scripts/verify-identifiers.py`. O resto (learner, run, mastery)
   tem chave surrogate. Não há registro dizendo qual classe cada recurso usa.

## Decision

**D1 — Duas classes de identificador, com contratos opostos e explícitos.** Mantém-se a distinção
que §4.3/ADR-016 já impõem, agora aplicada às URLs:

- **Classe C (conteúdo)** — id canônico, `snake_case`, significativo, **imutável**: `les_a1_greetings`,
  `pack_les_a1_greetings_v1`, `lst_prn_th_001`. É a **chave pública da URL** e é a mesma em todos
  os ambientes. Renomear exige emenda ao registry (`specs/curriculum-graph-spec.md` §4.3).
- **Classe L (learner-scoped)** — id surrogate, **opaco**, **server-issued**, estável por toda a
  vida do recurso e **nunca reutilizado**. Não é sequencial nem derivável, para não vazar volume
  nem permitir enumeração. O DDL/ERD é a única autoridade sobre a geração.

**D2 — A URL nunca é fonte de autorização.** (`/learners/{learner_id}` permanece como recurso plural
conforme §4.3, mas o `{learner_id}` do path **não** decide de quem são os dados.) O sujeito vem do
token (`ADR-013` — Resource Server) e é **o único** valor que alimenta
`PgSessionContext.withLearner` (`ADR-026`). Consequência direta: um `{learner_id}` que não seja o
sujeito do token responde **404** — nunca 200 com dados de outro, nunca 403 (ver ADR-038 §D-5).

**D3 — `/me` é um alias de leitura resolvido do token.** Propõe-se publicar o mesmo recurso em
`/api/v1/me` (sem id), resolvido do sujeito do token, porque é a forma que **não pode** ser escrita
errada pelo cliente. `/learners/{learner_id}` continua existindo para o registry e para operadores
de staff (§4.3 obriga o plural e o `{learner_id}`); `/me` é conveniência, não um segundo recurso.

**D4 — Profundidade máxima: 2 segmentos de recurso após a versão.** Formas permitidas:

```
/api/v1/{collection}                                  → 1 nível
/api/v1/{collection}/{id}                             → 2 níveis
/api/v1/{collection}/{id}/{sub-resource}              → 3 níveis (máximo; ex.: /audio, /mastery)
```

Além disso usa-se filtro/parâmetro, não path: `/api/v1/items?packId=…`, não
`/api/v1/packs/{id}/lessons/{lid}/items/{iid}`. O `{collection}` é sempre plural; o
`{sub-resource}` é um recurso singular ou plural conforme o que ele de fato é (ex.: `/audio` é um
recurso próprio — `ADR-028`).

**D5 — Identificadores de conteúdo nunca são traduzidos na borda.** `snake_case` na URL e no JSON
de conteúdo; `camelCase` só em propriedades JSON de **envelope/API** e em query params (§4.3 mantém:
o id é dado, não estilo). Não se aplica `camelCase` a um valor de `item_id`.

**D6 — Chaves surrogates internas não são publicáveis por default.** Uma coluna de PK que o ERD não
marca como identificador público não entra no corpo da resposta (ver o allow-list de serialização de
§4.5). Publicar um id interno é um ato explícito, registrado neste ADR ou num sucessor.

## Consequences

### Positive
- As 12 rotas ganham prefixo/versão e passam a existir *dentro* do contrato (§4.4), em vez de
  paralelamente a ele.
- BOLA deixa de ser estrutural: sem o sujeito do token, nenhuma consulta learner-scoped executa —
  e o 404 de D2 é a resposta que não vaza existência (R6).
- D4 torna o aninhamento decidível em revisão: ou a URL tem ≤3 níveis, ou precisa de ADR.

### Negative
- D2/D3 implicam **mudança de comportamento** nas rotas `/learners/*` atuais: o mock que ecoa o
  `:id` é substituído por resolução de token + RLS. Como as rotas são mock, isto é correção, não
  regressão — mas `docs/api/openapi.yaml` (o spec que o gate lê) precisa acompanhar (ver ADR-040).
- D6 pode remover campos que um cliente já consome de `/content/*`.

### Neutral
- `/me` (D3) cria um segundo caminho para o mesmo recurso; é aceito porque o custo de errar o id
  é maior que o custo de manter o alias.

## Alternatives Considered

1. **Só `/me`, removendo `/learners/{learner_id}`.** Rejeitada: §4.3 dá `/learners/{learner_id}`
   como a forma canônica e operadores de staff precisam endereçar um aprendiz. A remoção também
   seria breaking change (§4.4).
2. **Só `/learners/{learner_id}`, sem `/me`.** Rejeitada: mantém o cliente responsável por acertar
   o id — exatamente o erro que produziu a BOLA de A0.
3. **UUID v4 opaco para a Classe L.** Não decidido aqui: D1 fixa as *propriedades* exigidas
   (opaco, não sequencial, não reutilizado, estável), e deixa o formato concreto para o ERD/migration
   (ADR-018 — a persistência deriva dos specs). Registrar o formato neste ADR seria decidir
   armazenamento por documento de API.
4. **Aninhamento profundo estilo `/packs/{id}/lessons/{lid}/items/{iid}`.** Rejeitada: URLs longas,
   id composto, e cada nível vira um pré-requisito de autorização. Filtro é mais barato.
5. **Sem versão no path (`/content/lessons/{id}`).** Rejeitada por §4.4, que é vinculante:
   *"URL path, mandatory: `/api/v1/…`"*, e declara header/query *"not permitted"*.

## Implementation Plan

- [ ] A2 — `setGlobalPrefix('api')` + `enableVersioning(URI, defaultVersion '1')`; ajustar as 12
      rotas e o spec canônico (ADR-040) na mesma mudança (R4: migration de contrato, não de schema).
- [ ] A2 — completar `docs/api/inventario.md` §4 com a classe (C/L) de cada um dos 33 recursos do
      ERD, e conferir com `docs/data-model.erd.md` §9 quais são learner-scoped.
- [ ] A3 — `/learners/*` passa a resolver o sujeito do token e a abrir `PgSessionContext`; o
      controle negativo é o acesso cross-learner respondendo 404 (ADR-038).
- [ ] ADR sucessor — formato concreto do id da Classe L, se o ERD ainda não o fixar.

## References

- `CONSTITUTION.md` §4.3 (API Design & Semantics), §4.4 (Versioning & Lifecycle), §4.5 (Security)
- `docs/adr/013-auth-architecture-resource-vs-authorization-server.md` (Resource Server, `@Public()`)
- `docs/adr/016-canonical-identifier-registry.md` (registry canônico, `verify-identifiers.py`)
- `docs/adr/026-learner-context-app-role.md` (único escritor de `app.current_learner_id`)
- `docs/adr/028-audio-delivery.md` (recurso `/audio` como recurso próprio)
- `docs/api/inventario.md` §2–§4, §6 · `reports/api/fase-0.md` §1.1 · `docs/data-model.erd.md` §9
- `its-platform/src/main.ts` (sem `setGlobalPrefix`/`enableVersioning`)
