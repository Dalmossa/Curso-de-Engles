---
adr: 032
title: Paginação, ordenação, filtros e projeções de coleção
status: Proposed
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@backend-lead, @database-engineer]
informed: [@team]
tags: [api, rest, pagination, cursor, keyset, filtering, sparse-fieldsets]
---

## Context

`CONSTITUTION.md` §4.3 exige o **esquema**, não a **escolha**:

> *"Pagination: Consistent cursor or offset scheme across list endpoints, with a server-enforced
> maximum page size."*

A escolha entre cursor e offset está aberta, e A0 não encontrou nenhuma implementação de lista
paginada: os endpoints de conteúdo devolvem a coleção inteira. O que torna a decisão não-trivial:

1. **As coleções de conteúdo são grandes e estáveis.** Medido em A0: 122 packs, 123 lições
   (`docs/api/inventario.md` §3). O corpus não muda durante a leitura; itens são imutáveis por
   trigger (`ADR-029`). É o caso em que o cursor/keyset é estritamente melhor.
2. **Os dados learner-scoped crescem, e crescem por baixo do aprendiz.** Histórico de eventos,
   tentativas e agenda FSRS avançam entre duas páginas — a assinatura clássica do `OFFSET`: um item
   inserido no meio duplica ou pula uma linha entre a página *n* e a *n+1*.
3. **A ordem não é sempre `id`.** `mastery` ordena por probabilidade/recência; a agenda FSRS por
   vencimento; o catálogo por CEFR e por posição. Um cursor precisa carregar a chave de ordenação
   para sobreviver a empates.
4. **A `§4.3` também exige tamanho máximo imposto pelo servidor** — hoje não existe nenhum.

## Decision

**D1 — Cursor/keyset é o esquema padrão de paginação.** Todos os endpoints de coleção aceitam
`limit` e `cursor`; **`offset` não é publicado**. O cursor é uma string **opaca** (base64url) que
codifica a tupla de ordenação efetiva — `(sortKey…, id)` —, com o `id` sempre como desempate final
para garantir ordem total. O cliente **não** pode construir nem interpretar o cursor; ele só o
devolve como veio.

**D2 — A resposta é um envelope explícito, com paginação nomeada.** Proposto:

```json
{
  "data": [ … ],
  "page": { "limit": 20, "nextCursor": "eyJ…", "hasMore": true }
}
```

`nextCursor` é `null` na última página. O envelope é o que permite acrescentar metadados depois sem
breaking change. **Isto altera o corpo de `/content/*`, que hoje devolve o array cru — é mudança
de contrato e entra sob ADR-040/ADR-033 (breaking change, com entrada em `CHANGELOG.md`).**

**D3 — `Link` (RFC 8288) é obrigatório junto do envelope.** `rel="next"` e, quando aplicável,
`rel="prev"`. RFC 8288 é Standards Track (out/2017, obsoleta 5988 — verificado em fonte primária,
§References). O `Link` é para *feeds*/clientes HTTP genéricos; o envelope é para clientes que leem
JSON. Ambos apontam para a mesma coisa.

**D4 — Ordenação por allow-list, nunca livre.** `sort` é um enum por endpoint (ex.: `sort=cefr`,
`sort=-updatedAt`), resolvido a um índice. Ordenar por coluna arbitrária não é exposto: (a) é um
vetor de DoS por sort caro, (b) o keyset precisa de índice para ter custo constante. A direção
`-` prefixa decrescente.

**D5 — Filtros são parâmetros nomeados, `camelCase`, e explícitos.** (§4.3 fixa `camelCase` para
query params.) Cada filtro é uma condição que o servidor reconhece — `cefrLevel=A2`, `skill`,
`dueBefore`, `packId` — e é **rejeitado se desconhecido** (`forbidNonWhitelisted`, §4.5), em vez de
ignorado. Um filtro ignorado em silêncio devolve um conjunto errado com status 200, que é o pior
modo de falha possível numa API de conteúdo.

**D6 — *Sparse fieldsets* por `fields=`, *expansões* por `include=`.** Ambos com allow-list por
recurso e ambos **opt-in**. Isto é o mecanismo que evita um segundo recurso de "resumo" para cada
recurso existente. `include` limita a profundidade a 1 nível (`include=options`, não
`include=options.foo`).

**D7 — Os números ficam para A7 (medição).** `limit` default, teto, e o TTL do cursor **não** são
fixados aqui — nenhuma medição de A0 os sustenta, e R2 proíbe inventar número. Ver `§ Números
pendentes`.

### Números pendentes (UNVERIFIED — a fixar em A7, com medição)

| Parâmetro | Situação | Onde será fixado |
|---|---|---|
| `limit` default e máximo | **UNVERIFIED** — nenhum valor medido ou especificado | A7 (carga medida no corpus real) |
| TTL/expiração do cursor | **UNVERIFIED** — depende do custo de manter a chave de ordenação | A7 |
| Nº máximo de `include`/`fields` | **UNVERIFIED** | A7 |

## Consequences

### Positive
- Estabilidade de página sobre dados que mudam (RLS-scoped) e sobre dados imutáveis (catálogo):
  o keyset não duplica nem pula item quando algo é inserido entre páginas.
- Custo de leitura constante com índice: `(sortKey, id)` já é o índice que as consultas learner-scoped
  precisam (`ADR-018` — o piso de invariantes).
- Allow-list de `sort`/filtros/`fields` fecha três vetores de DoS/enumeração de uma vez.

### Negative
- **Breaking change** em `/content/*`: array cru → envelope. Exige `CHANGELOG.md` e a política de
  depreciação de ADR-033; o spec obsoleto que o gate lê também precisa mudar (ADR-040).
- Cursor opaco obriga o servidor a versionar a codificação do cursor; uma mudança de ordenação
  pode invalidar cursores emitidos (⇒ o cliente recebe 400 com `type` próprio, ADR-034).
- Não há `total`/`pageCount` — keyset não os tem barato. Clientes que mostram "página 3 de 20"
  perdem isso; a alternativa (contagem) é `COUNT(*)` sob RLS, caro.

### Neutral
- `Link` + envelope (D2/D3) duplicam a mesma informação de propósito, para dois estilos de cliente.

## Alternatives Considered

1. **`limit`/`offset` (page-based).** Rejeitada como padrão: instável sob escrita concorrente — e a
   escrita concorrente é o caso normal aqui (um evento de aprendizagem por resposta, `ADR-015`).
   Fica permitida apenas onde a coleção é *snapshot* e a ordem é por posição declarada.
2. **`page`/`perPage`.** Rejeitada pelo mesmo motivo, mais um: `page` esconde o custo do salto.
3. **Cursor como id cru (`?after=les_a1_greetings`).** Rejeitada: só funciona com ordem por id;
   quebra em `-updatedAt` e em `dueBefore`, onde a chave é composta.
4. **Retornar o array cru com `Link` apenas.** Rejeitada: não deixa lugar para `limit`/`hasMore`
   sem inventar header customizado (`X-…`), que §4.3 não autoriza e que é justamente o que a
   revisão do ADR-030 corrigiu no caso do rate limit.
5. **`POST /search` com corpo para toda consulta.** Rejeitada: perde cacheabilidade (`ADR-036`) e
   transforma leitura em método não-idempotente por §4.3.
6. **GraphQL.** Fora de escopo: §4.3 diz RESTful e o ADR-012 fixou NestJS + REST.

## Implementation Plan

- [ ] A2 — publicar `page`, `limit`, `cursor`, `sort`, `fields`, `include` e o envelope no spec
      canônico (ADR-040) para **todos** os endpoints de coleção, com schema de cursor opaco.
- [ ] A2 — decidir em qual versão o envelope entra (ADR-033) e escrever a entrada de
      `CHANGELOG.md` **antes** do merge (§4.4).
- [ ] A3 — implementar o codec de cursor (encode/decode) e o guard de allow-list; property test:
      para qualquer `limit` e qualquer sequência de inserções, percorrer a coleção com
      `nextCursor` visita cada item exatamente uma vez, em ordem `(sortKey, id)`.
- [ ] A7 — medir `limit` default/máximo e o TTL do cursor no corpus real e substituir a tabela
      *Números pendentes* por valores medidos.

## References

- `CONSTITUTION.md` §4.3 (paginação, query params `camelCase`, erros 4xx), §4.5 (validation pipe)
- RFC 8288 — *Web Linking*, Standards Track, out/2017 (obsoleta 5988) — `Link` `rel="next"`/`"prev"`
- `docs/adr/029-immutability-by-trigger.md` (imutabilidade dos itens ⇒ páginas estáveis no catálogo)
- `docs/adr/018-persistence-derived-from-specs.md` (piso de invariantes, índices)
- `docs/api/inventario.md` §3 (tamanho do corpus) · `reports/api/fase-0.md` §1.1
