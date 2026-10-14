---
adr: 036
title: Cache condicional do catálogo e onde Range/206 realmente se aplica
status: Proposed
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@sre-lead, @security-lead, @backend-lead]
informed: [@team]
tags: [api, caching, etag, conditional-get, rfc9111, rfc9110, range, audio, adr-028, pii]
---

## Context

`CONSTITUTION.md` §4.3 não menciona cache; §4.6/§4.5 introduzem as restrições que o cache tem de
respeitar: *"PII is never written to logs"*, *"Responses expose fields through an explicit
serialisation allow-list"*, e o princípio geral de que a superfície do aprendiz é dado pessoal.
Hoje o servidor não emite **nenhum** header de cache.

O corpus é o caso favorável ao cache condicional, e A0 o mediu:

1. **Imutabilidade real por trigger, não por convenção.** `ADR-029` mediu que `REVOKE UPDATE (id)`
   era **inerte** e substituiu-o por `trg_append_only_guard` / `trg_item_id_immutable`, que recusam
   a mutação para **todo** papel — owner e `its_platform_admin` inclusive. Um item, uma vez
   publicado, **não muda**. É exatamente o que torna um `ETag` forte seguro.
2. **O catálogo é lido muito e escrito quase nunca.** 122 packs / 123 lições
   (`docs/api/inventario.md` §3); a escrita é o loader (`P0.5`, ADR-020/022).
3. **A entrega de áudio já é indireta.** `ADR-028` decide `GET /content/listening/{dialogue_id}/audio`
   como **recurso próprio** que devolve uma **URL assinada com 300 s de validade** — e o motivo
   declarado é justamente que *"a signed URL has a 300 s lifetime and a catalog read does not"*.
   Logo a API **não serve bytes de áudio**.

Esse último ponto fecha um `UNVERIFIED` que A0 registrou: *"`Range`/`206` para áudio sem object
store no repo"* (`reports/api/fase-0.md` §5, lista de pendências).

## Decision

**D1 — `ETag` forte em todo recurso de catálogo, derivado do estado, nunca do tempo.** Aplicável a
`/content/lessons/{id}`, `/content/packs/{id}`, `/content/listening/{id}` e aos respectivos
endpoints de coleção (ADR-032). O valor é derivado do conteúdo servido (hash do corpo serializado
com a versão do schema, ou a versão do registro de conteúdo) — e **não** de `Last-Modified`. Um
`ETag` temporal seria fraco na prática: dois estados distintos no mesmo segundo colidem.

**D2 — `If-None-Match` → `304` sem corpo.** O fluxo condicional é obrigatório, e o `304` **não**
relê o banco para montar corpo. Consequência de implementação: a rota precisa de um caminho que
decida o `ETag` sem materializar a resposta — se o `ETag` só é conhecido depois de montar o corpo, o
ganho desaparece e D1 não se realiza.

**D3 — `Cache-Control: public, max-age=…, immutable` só no catálogo imutável.** Só onde D1 é
garantido por `ADR-029`. Os valores de `max-age` são **`UNVERIFIED`** — vão para a tabela abaixo.

**D4 — Nada de cache compartilhado em superfície de aprendiz.** Tudo sob `/api/v1/learners/*`
(resposta de perfil, mastery, agenda FSRS, e qualquer extensão) é **dado pessoal** (§4.5, LGPD):

```
Cache-Control: private, no-store
```

com `Vary: Authorization` onde houver qualquer proxy intermediário. **`public` em superfície de
aprendiz é proibido**, mesmo com `Vary` — porque `Vary: Authorization` só funciona se o
intermediário honrar o `Vary`, e a plataforma não controla o intermediário. Isto é o mesmo raciocínio
de "deny by default" da §4.5 aplicado a cache.

**D5 — `Range`/`206`/`416`/`Content-Range` (RFC 9110 §14) ficam fora do escopo da API.** Como
`ADR-028` torna `/…/audio` um **descritor** (JSON com URL assinada), a API **não** responde com
bytes e portanto não responde `206`. Requisição com `Range` ao descritor é **ignorada** (e o
`Accept-Ranges` **não** é anunciado — anunciá-lo prometeria uma capacidade inexistente).

**D5.1 — Se o descritor for cacheado, o `ETag` tem de ser estável apesar da URL.** A URL assinada
muda a cada leitura (300 s), então o corpo **muda** e um `ETag` do corpo seria sempre diferente.
Proposta: o recurso `/…/audio` **não** recebe `ETag` de corpo; usa `Cache-Control: private, no-store`
e o cliente trata a URL como efêmera. É a única leitura compatível com D1 (ETag derivado de estado)
e com a assinatura de `ADR-028`.

**D6 — `Vary` é explícito e mínimo.** `Accept-Encoding` onde há compressão; `Accept` onde o
conteúdo do problema e do erro varia (ADR-034). Ausência de `Vary` onde a resposta varia é o defeito
clássico: um cache intermediário serve a variante errada.

### Números pendentes (UNVERIFIED — a fixar em A7, com medição)

| Parâmetro | Situação |
|---|---|
| `max-age` do catálogo | **UNVERIFIED** — nenhum valor medido; depende da frequência do loader |
| Granularidade do `ETag` de coleção | **UNVERIFIED** — por página (ADR-032) ou pelo conjunto |
| `stale-while-revalidate` (RFC 5861) | **UNVERIFIED** — não avaliado |

## Consequences

### Positive
- Um `304` no catálogo é o caminho quente barato; e a garantia de D1 assenta numa medida
  (`ADR-029`: triggers recusam mutação para **todo** papel), não numa promessa.
- D4 impede que a otimização de catálogo vaze para a superfície de aprendiz por descuido de um
  `@Header` copiado.
- D5 resolve um `UNVERIFIED` de A0 e, de quebra, evita implementar `Range` onde ele não existe.

### Negative
- D2 obriga a rota de catálogo a ter um caminho "calcular `ETag` sem materializar" — a mudança de
  arquitetura não aparece em nenhum header, mas é o custo real.
- D5.1 significa que `/…/audio` **não** é cacheável de forma alguma. Todo cliente paga a assinatura
  a cada leitura. É o preço de `ADR-028`.
- D4 com `no-store` elimina qualquer ganho de cache no caminho do aprendiz — intencional, mas o
  custo de latência é real e só aparece sob carga (A7).

### Neutral
- RFC 9111 (cache) obsoleta a RFC 7234; RFC 9110 obsoleta 7232/7233. Comentário que cite "RFC 7232"
  para `ETag`/`If-Match` está desatualizado.

## Alternatives Considered

1. **`ETag` derivado de `Last-Modified`.** Rejeitada: colisão no mesmo segundo e semântica fraca
   contra o "não mudou" real do `ADR-029`.
2. **Sem cache (status quo).** Rejeitada: joga fora a única propriedade que o `ADR-029` comprou a
   alto custo (imutabilidade real) e que é diretamente monetizável em latência.
3. **`Cache-Control: public` sob `/learners/*` com `Vary: Authorization`.** Rejeitada (D4): depende
   de um intermediário honrar `Vary` para não vazar PII entre aprendizes. Risco não aceitável.
4. **`ETag` fraco no catálogo.** Rejeitada: `W/` não é o que D1 promete; e aqui o estado é
   byte-estável, então não há motivo para fraqueza.
5. **Responder `206` para áudio agora.** Rejeitada: a API não tem os bytes (`ADR-028`). Implementar
   `Range` sobre uma URL assinada é implementar a camada errada.
6. **Redirecionar `/…/audio` com `302` para o store.** Não avaliada — `ADR-028` escolheu o descritor;
   reabrir é uma decisão daquele ADR, não deste.

## Implementation Plan

- [ ] A2 — declarar `ETag`/`If-None-Match`/`Cache-Control`/`Vary` no spec canônico (ADR-040) para
      `/content/*`, e `no-store` para `/learners/*`; `304` no catálogo de problemas? **não** — `304`
      não tem corpo (ADR-034 não se aplica).
- [ ] A3 — implementar `ETag` de catálogo (D1) com caminho sem materialização (D2); teste: segunda
      leitura com `If-None-Match` ⇒ `304` e zero query de corpo.
- [ ] A3 — aplicar `no-store` a todo `/learners/*` por interceptor, de modo que a política **não**
      dependa de cada controller lembrar (D4).
- [ ] A3 — controle negativo: rota de catálogo com `Range` não responde `206` nem anuncia
      `Accept-Ranges` (D5).
- [ ] A7 — medir e fixar `max-age` e a granularidade do `ETag` de coleção.

## References

- `CONSTITUTION.md` §4.5 (PII, serialisation allow-list), §4.6 (logs sem PII)
- **RFC 9111** — *HTTP Caching*, Standards Track, jun/2022 (obsoleta a RFC 7234)
- **RFC 9110** — *HTTP Semantics*, Standards Track, jun/2022 — §13 (condicionais), §14 (`Range`,
  `206`, `416`, `Accept-Ranges`)
- `docs/adr/029-immutability-by-trigger.md` (imutabilidade para **todo** papel ⇒ `ETag` forte seguro)
- `docs/adr/028-audio-delivery.md` (descritor com URL assinada de 300 s ⇒ D5/D5.1)
- `docs/adr/020-content-loader-port.md`, `docs/adr/022-content-loader-schema-reconciliation.md`
  (a escrita do catálogo é o loader) · `docs/adr/032` (envelope/paginação)
