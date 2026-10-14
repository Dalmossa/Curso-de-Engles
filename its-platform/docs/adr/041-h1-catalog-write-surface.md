---
adr: 041
title: H1 — superfície de escrita do catálogo: somente leitura, ou autoria pela API?
status: Proposed
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@content-lead, @backend-lead, @security-lead]
informed: [@team]
tags: [api, content, authoring, crud, adr-010, adr-020, adr-029, human-decision, needs-human-review]
---

## Context

**Esta é uma decisão humana (H1).** Este ADR enquadra, recomenda e **para** (R9). Ele não pode ser
"aceito" por um agente.

A pergunta: o catálogo (`lessons`, `packs`, `items`, `dialogues`, …) é uma superfície **somente
leitura** na API, ou a API expõe **autoria** (CRUD) para editores de conteúdo?

O que o repositório já fixou, e que restringe muito a resposta:

1. **A autoria já existe, e é git + loader.** `ADR-010` fez do `Curso-de-Ingles` um **submodule**;
   `P0.5` (`ADR-020`) construiu o loader que lê os markdown reais e faz upsert idempotente; `ADR-022`
   reconciliou loader ↔ schema. A fonte de verdade do conteúdo é o repositório de conteúdo
   (`docs/api-spec.openapi.yaml` header: *"Source of truth for contracts: `Curso-de-Ingles/specs/*.md`"*;
   `ADR-018`).
2. **Os ids de conteúdo são imutáveis por regra de integridade.** `CONSTITUTION.md` §4.3 —
   *"content identifiers `snake_case` and **immutable** … This is a data-integrity rule, not a style
   rule."* Renomear quebra `verify-integrity.py` checks [1], [2], [8], [11] e exige emenda ao registry.
   **Um CRUD de autoria existe, em grande parte, para renomear e reorganizar** — que é a operação
   proibida.
3. **A imutabilidade é imposta por trigger, para todo papel.** `ADR-029` mediu que `REVOKE` era
   inerte e substituiu-o por `trg_append_only_guard` / `trg_item_id_immutable`, que recusam a mutação
   *"for **every** role — owner and `its_platform_admin` included"*. Consequência direta: **uma API
   de autoria escrita hoje seria rejeitada pelo próprio banco.** Não é uma questão de gosto; é uma
   colisão com um controle já aceito.
4. **Não há consumidor nomeado.** R3: nenhum artefato em `BACKLOG.md`/`PRD.md`/`SPEC` pede autoria
   por API. Os únicos escritores nomeados do catálogo são o loader (P0.5) e o git.

Medido em A0: as rotas de conteúdo existentes são **somente leitura** (`/content/lessons/{id}`,
`/content/packs/{id}`, `/content/listening/{id}`, `/content/listening/{id}/audio`) e são as **únicas
rotas reais** do serviço — *"8 das 12 rotas são mocks (`learners`, `practice`, `curriculum`,
`placement`, `auth`); só `/content/*` é real (DB)"*.

## Decision (proposta — não vinculante até decisão humana)

**R1 (recomendação) — O catálogo é somente leitura na API no MVP (Opção A).** A autoria permanece:
(a) git no repositório de conteúdo, (b) loader (`ADR-020`) como único caminho de escrita no banco,
(c) triggers (`ADR-029`) como garantia de que nada mais escreve. Nenhum endpoint `POST`/`PUT`/`PATCH`/
`DELETE` sobre recursos de catálogo é publicado no MVP.

**R2 — Se e quando a autoria vier, ela é uma superfície separada, com identidade separada (Opção C).**
Não é "os mesmos endpoints com escopo `content:admin`". Consequências obrigatórias: (a) ids imutáveis
continuam imutáveis — logo o CRUD **cria e desativa**, nunca renomeia (§4.3); (b) os triggers precisam
de um caminho de exceção **auditado**, o que é uma mudança no `ADR-029`, não um contorno; (c) a
superfície vive sob um recurso próprio (`/admin/…` ou versão própria) para não contaminar o contrato
do aprendiz (ADR-033); (d) o conflito git ↔ banco precisa de uma regra de merge, que hoje não existe.

**R3 — O que este ADR decide hoje, independentemente de H1.** Os candidatos de escrita de conteúdo
levantados em A0 ficam **em `docs/api/candidatos.md`** e **não** são implementados (R3), porque não
têm consumidor nomeado. H1 decide se algum dia saem de lá — não se saem agora.

## Consequences

### Positive
- R1 mantém **uma** fonte de verdade do conteúdo (o repositório) e **um** caminho de escrita (o
  loader), o que é o que torna `verify-integrity.py` e `verify-identifiers.py` verificações com
  sentido. Duas superfícies de escrita exigiriam as duas verificações no caminho online.
- R1 não cria superfície de escrita onde não há consumidor (R3) — e cada endpoint não construído é
  superfície que não precisa de autorização, validação, idempotência (ADR-035) e auditoria.

### Negative
- **Sem autoria pela API, corrigir um erro de conteúdo é um ciclo de deploy do loader.** Para um erro
  de digitação num item publicado, o custo é latência de pipeline, não um `PATCH`. Isso é um custo
  real de operação, e é o argumento mais forte do lado da Opção B.
- R2 admite que a eventual Opção C **reabre o `ADR-029`**. Quem escolher C está escolhendo também
  uma revisão de um ADR Accepted.

### Neutral
- R3 não remove a pergunta; só impede que ela seja respondida por omissão durante a implementação.

## Alternatives Considered

1. **Opção A — somente leitura (recomendada).** Coerente com `ADR-010`/`ADR-020`/`ADR-029`/§4.3.
2. **Opção B — CRUD completo de autoria na API com RBAC.** Rejeitada como recomendação: colide com
   os triggers do `ADR-029` (que recusam mutação para todo papel), com a imutabilidade de ids (§4.3),
   e duplica a fonte de verdade sem resolver o merge git ↔ banco. Rejeitada, não impossível.
3. **Opção C — somente leitura agora, autoria depois, superfície separada (R2).** É o caminho
   recomendado **se** H1 responder "autoria um dia". Não adotada agora porque não há consumidor (R3).
4. **CRUD de "metadados" apenas (não de itens), para permitir correção sem deploy.** Parcialmente
   atraente e merece consideração explícita; rejeitada aqui por abrir o mesmo problema em escala
   menor (quem escreve? sob qual trilha? como o loader reconciliaria na próxima carga?).
5. **Escrever direto no banco por uma ferramenta interna fora da API.** É o que já acontece via
   loader; mantê-lo fora do contrato público é o centro de R1.

## Decisão requerida (ato humano)

> Escolher **A** (somente leitura no MVP), **B** (CRUD de autoria agora) ou **C** (leitura agora,
> autoria depois em superfície separada). A recomendação deste ADR é **A agora** e **C como
> direção**, com a nota de que C reabre o `ADR-029`.

## Implementation Plan

- [ ] **Bloqueado — ato humano.** Escolher A / B / C.
- [ ] Se A: nenhuma ação de código. Confirmar `docs/api/candidatos.md` como o registro dos
      candidatos recusados (R3).
- [ ] Se C: ADR sucessor definindo a superfície de administração, a identidade/escopos (ADR-038 D2)
      e a **revisão do `ADR-029`** para o caminho de escrita auditado.
- [ ] Em todos os casos: nenhum endpoint de escrita de catálogo entra em A2 antes desta decisão.

## References

- `CONSTITUTION.md` §4.3 (imutabilidade de identificadores de conteúdo), §4.5 (deny by default, mass
  assignment), §4.4 (breaking change)
- `docs/adr/010-content-submodule.md` (o conteúdo é submodule) · `docs/adr/020-content-loader-port.md`
  e `docs/adr/022-content-loader-schema-reconciliation.md` (o loader é o escritor)
- `docs/adr/029-immutability-by-trigger.md` (**os triggers recusam mutação para todo papel** — o
  argumento técnico decisivo)
- `docs/adr/018-persistence-derived-from-specs.md` (specs são a fonte)
- `docs/api/candidatos.md` (R3 — candidatos bloqueados) · `docs/api/inventario.md` §3, §5
