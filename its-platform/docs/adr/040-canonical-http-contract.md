---
adr: 040
title: Fonte de verdade do contrato HTTP — um único OpenAPI, parseável, e o que o gate deve validar
status: Proposed
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@backend-lead, @sre-lead]
informed: [@team]
tags: [api, openapi, contract, drift, gate, adr-027, adr-016, breaking-change]
---

## Context

Existem **dois** documentos OpenAPI, eles divergem, e o gate valida o **obsoleto**. Medido em A0:

| | `docs/api-spec.openapi.yaml` | `docs/api/openapi.yaml` |
|---|---|---|
| Formato | **Markdown** com um bloco ```yaml de ~1092 linhas — **não parseia como YAML** | YAML válido |
| `servers` | `/api/v1` | `…/v1`, `localhost:8000` — **contradiz §4.4** |
| `info.version` | `0.1.0-draft` | `1.0.0` |
| Schemas | **15** (inclui `Problem`) | 14 (sem `Problem`) |
| `/auth/refresh` | presente, anotado `x-mvp-scope: excluded` + `501` | presente, sem anotação |
| Quem lê | só `tests/contract/schemas.spec.ts:250`, em par com o outro | **cinco** leitores — e nenhum compara com a implementação |

Quatro fatos adicionais, todos citáveis:

1. **A CONSTITUTION aponta para o arquivo novo.** §4.4: *"Current | `/api/v1` — see
   `docs/api-spec.openapi.yaml` `servers`"*. O documento que a lei interna nomeia é o que **não
   parseia** e que **nenhum gate lê**.
2. **O próprio spec novo declara sua origem.** Cabeçalho: *"Source of truth for contracts:
   `Curso-de-Ingles/specs/*.md`"*. Ou seja: nenhum dos dois OpenAPI é a fonte de verdade **dos
   contratos** — os specs são; os OpenAPI são **derivados**. A pergunta D-1 ("qual é a fonte de
   verdade") tem, portanto, duas respostas em níveis diferentes, e confundi-las é o que produziu o
   estado atual.
3. **`ADR-027` já registrou a dívida e a adiou.** A alternativa *"One OpenAPI file"* foi **rejeitada
   naquele ADR** — *"it is the right end state, but choosing which…"* —, e o ADR-027 exigiu os dois
   arquivos **constraint-idênticos** nos três schemas, com uma tabela de drift medida. O drift
   reapareceu depois (`ADR-027` §:137–:138: enum `shadow_only` × `shadow-only`; `slots[].skill` com 6
   valores num arquivo e 5 no outro, violado 7 vezes pelo corpus).
4. **Existe uma terceira cópia.** `ADR-027` §:420: *"`.opencode/skills/openapi-spec/SKILL.md` carries
   a third copy of the schema"*.
5. **Há cinco leitores do spec obsoleto, e nenhum compara com a implementação.** Medido em A1, o que
   **refina o A0** (que contava dois): `contract-check.mjs:5` (o gate `contract:check`),
   `scripts/contract-check-full.mjs:6` (não wired no `package.json`), `scripts/kong-config-check.mjs:48`
   (o gate `kong:check`), `tests/contract/endpoints.spec.ts:9` e `tests/contract/openapi.spec.ts:6`.
   Um sexto — `tests/contract/schemas.spec.ts:250` — lê **os dois** (`SPEC_PATHS`) e trata a cerca
   Markdown explicitamente (`:237`).

E o gate *wired* é fraco: `contract-check.mjs` (31 linhas) verifica `spec.includes('openapi: 3.1')` e
`spec.includes(<10 paths>)` — **presença de substring**. O controle negativo N-4 de A0 provou, em
cópia, que ele **passa** com `components.schemas = {}`, com `POST` trocado por `GET` em
`/auth/refresh`, e com um path fictício.

**Correção ao A0 (A1).** O A0 concluiu *"não existe gate de drift"*. Isso é **verdadeiro para o gate
`contract:check`** e **falso para a suíte de contrato**, e a distinção muda D5:

- `tests/contract/schemas.spec.ts:691-710` valida **instâncias reais** do `ContentService` contra os
  dois documentos, com um validador escrito à mão (cobre `$ref`, `type`, `required`, `enum`, `const`,
  `pattern`, `if`/`then`/`else`, `additionalProperties`);
- `tests/contract/schemas.spec.ts:712-727` — `it('the two files define the six content schemas
  identically (drift guard)')` — compara `withoutAnnotations(...)` de seis schemas de conteúdo entre
  os dois arquivos.

O que **não** existe é **spec ↔ implementação**: nenhum teste (nem gate) falha quando uma rota
implementada diverge do documento — que é exatamente o que o N-4 demonstrou. E há um teste que
**codifica o comportamento errado**: `tests/contract/endpoints.spec.ts:59` exige
`content['application/json']` nas respostas 400/404, contra a §4.3 (RFC 9457) e o ADR-034 D4.

## Decision

**D1 — `docs/api-spec.openapi.yaml` é o contrato HTTP publicado e canônico.** A razão não é
preferência: a `CONSTITUTION.md` §4.4 já o nomeia como o `servers` vigente. Adotar o outro arquivo
exigiria emendar a §4.4 — custo desnecessário quando o documento que a lei já aponta é o mais novo,
o mais completo (15 schemas, `Problem`) e o único anotado com escopo de MVP.

**D2 — O arquivo canônico tem de ser YAML de verdade.** Este é o D-2, e ele não é cosmético:
um arquivo com extensão `.yaml` que contém uma cerca Markdown é a razão pela qual **nenhuma**
ferramenta o consumiu. Proposta:

```
docs/api-spec.openapi.yaml   →  YAML puro, parseável (o bloco, sem cerca)
docs/api-spec.md             →  o preâmbulo Markdown atual (versão, origem, notas), com o link
```

O preâmbulo **não** se perde: ele carrega a declaração de origem que D6 torna obrigatória. Ele sai de
*antes* do YAML e passa a ser um documento irmão que o cita.

**D3 — `docs/api/openapi.yaml` é deprecado, não deletado no mesmo passo.** Ordem obrigatória:
(a) os **seis** schemas de conteúdo que a guarda de `schemas.spec.ts:712-727` mantém idênticos
precisam estar corretos no canônico (D2); (b) o
arquivo velho recebe cabeçalho de depreciação e data de remoção; (c) a remoção entra no
`CHANGELOG.md` com caminho de migração (§4.4); (d) só então é removido. Remover primeiro destruiria
a única cópia correta de qualquer constraint que o canônico ainda não tenha.

**D4 — A terceira cópia é eliminada por referência.** `.opencode/skills/openapi-spec/SKILL.md` passa a
**citar** o canônico em vez de conter o schema. Enquanto houver uma cópia fora do gate, o drift volta
por construção.

**D5 — O gate de contrato é substituído por validação real + verificação de drift.** O gate novo
(A2) precisa, no mínimo:

1. **parsear** o canônico (e falhar se não parsear — é o defeito atual);
2. resolver `$ref` e validar com `spectral` contra as regras do repositório;
3. comparar **rotas** do spec × rotas registradas no NestJS (as duas direções: rota sem spec e spec
   sem rota — A0 mediu 12 × 10 e nenhum gate vê isso);
4. assertar `servers` = `/api/v1` (§4.4) e rejeitar `Deprecation: true` (ADR-033 D2);
5. assertar que `Problem` (ADR-034) existe e tem os membros de D2 daquele ADR;
6. assertar **método** por path (o controle negativo de A0 mostrou que `POST`→`GET` passava);
7. assertar o **media type** dos erros é `application/problem+json` (ADR-034 D4) — e **corrigir**
   `tests/contract/endpoints.spec.ts:59`, que hoje exige `application/json` e portanto *protege* o
   defeito.

**D5.1 — O gate novo complementa `tests/contract/schemas.spec.ts`, não o substitui.** Aquele arquivo
já faz o que o gate não fazia (validar instância real × schema, e guardar o drift entre os dois
documentos). Duplicá-lo no gate criaria duas cópias da mesma verificação — o defeito que este ADR
existe para corrigir — e quebraria a guarda de drift no momento em que o arquivo obsoleto for
removido (D3). A divisão proposta: `schemas.spec.ts` continua dono do **schema**, o gate novo passa a
ser dono do **spec ↔ implementação**.

**D6 — O OpenAPI derivado cita a revisão do spec de origem.** Como a fonte de verdade dos contratos
são `Curso-de-Ingles/specs/*.md` (`ADR-018`, `ADR-027` §:45), o canônico declara **de qual revisão**
derivou. Sem esse pin, o drift deixa de ser detectável: o OpenAPI e o spec podem divergir e **ambos**
parecem corretos. D6 é o que transforma "gerado de" em uma afirmação verificável.

**D7 — Nomenclatura: o nome atual fica.** `docs/api-spec.openapi.yaml` é redundante
("api-spec" + ".openapi"), e renomear arrastaria a §4.4 e todo o `ADR-027` junto — sem ganho. Preferir
menos movimento constitucional a um nome melhor (D-Alternatives 4).

**D8 — Este ADR é o desfecho de uma dívida registrada, não uma decisão nova de gosto.** O `ADR-027`
deferiu a escolha; a A1 a resolve **por citação** (a §4.4 já escolheu) e nomeia o que ficou faltando
(parseabilidade, gate, terceira cópia). Ele **não** superseda o `ADR-027`, cujas constraints de schema
permanecem válidas e agora têm um único destino.

## Consequences

### Positive
- Uma cópia, um gate, uma verdade — e a verdade é a que a CONSTITUTION já nomeava.
- O gate deixa de ser `String.includes`: passa a falhar por método errado, por rota implementada sem
  spec e por spec publicado sem rota — falhas que o N-4 de A0 demonstrou passarem hoje. (O schema já
  é protegido, por outra via: `schemas.spec.ts` — D5.1.)
- D2/D6 tornam o drift **detectável**, não evitável por disciplina — para além dos seis schemas de
  conteúdo que a guarda atual cobre.

### Negative
- **D3 é breaking para consumidores internos, e eles existem hoje.** Cinco arquivos leem
  `docs/api/openapi.yaml` pelo nome (Context 5). Dois são **gates**: `contract:check`
  (`contract-check.mjs:5`) e `kong:check` (`scripts/kong-config-check.mjs:48`). E o `kong:check` não
  lê o spec de passagem — ele deriva o primeiro segmento de cada path e **exige** que exista rota no
  gateway (`:139-149`), com `strip_path: false` como invariante (`:122-129`). Trocar o canônico para
  um documento cujos paths começam em `/api/v1` faz a asserção 7 derivar `/api` e falhar. Isto não é
  preparatório: `iac/kong/kong.yml` **existe** (1 serviço / 5 rotas / 3 plugins — `kong:check` PASS
  em A1) e o gate está verde. A mudança **quebra** um gate verde, e a ordem de ADR-033 D7 é o que
  evita isso.
- D5 troca um gate de 31 linhas por um que precisa de dependência (`spectral`) e de um mapa
  rota↔controller. É manutenção real, e o gate novo tem de ser mantido sob pena de virar o velho.
- D6 exige um pin que alguém precisa **atualizar** a cada mudança de spec; um pin desatualizado é
  ruído (e um pin **automaticamente** atualizado é inútil).

### Neutral
- D1 não é uma escolha entre iguais: os dois arquivos diferem em correção, não em estilo.

## Alternatives Considered

1. **`docs/api/openapi.yaml` como canônico (o que o gate já lê).** Rejeitada: publica `servers` sem
   `/api`, contradiz a §4.4, tem 14 schemas e **nenhum `Problem`** — adotá-lo significaria emendar a
   CONSTITUTION para apontar para o documento mais incompleto.
2. **Manter os dois, constraint-idênticos (status quo do ADR-027).** Rejeitada: é exatamente o que
   falhou. O `ADR-027` exigiu a identidade e o drift voltou; uma obrigação sem gate é uma esperança.
3. **Derivar os dois de uma fonte geradora única.** Rejeitada **neste ADR**, não por mérito: resolve
   a causa (cópia) com mais máquina do que a A1 pode instalar, e D2+D5 já fecham o modo de falha por
   outra via. Registrar como direção futura.
4. **Renomear o canônico para `docs/api/openapi.yaml` e apagar o velho.** Rejeitada (D7): arrasta
   emenda da §4.4 e a tabela do `ADR-027` inteira, por um nome.
5. **Sem gate, com revisão humana.** Rejeitada: A0 mediu que a leitura humana **não** encontrou as
   divergências (dois specs, 15×14 schemas, `/v1` sem `/api`) por um período indeterminado.
6. **Gate que só valida o spec, sem comparar com as rotas.** Rejeitada: deixa passar as 2 rotas
   implementadas sem spec e as 10 operações de spec sem rota — metade do problema de A0.

## Implementation Plan

- [ ] A2 — D2: extrair o bloco para `docs/api-spec.openapi.yaml` (YAML) e criar `docs/api-spec.md`
      com o preâmbulo; **validar parse** antes de qualquer outra mudança.
- [ ] A2 — D5: gate novo (parse + `spectral` + rotas × controllers + `servers` + `Problem` +
      método por path), com os **quatro** controles negativos de A0/`§D5` como casos de teste.
- [ ] A2 — D4: substituir a cópia em `.opencode/skills/openapi-spec/SKILL.md` por referência.
- [ ] A2 — D6: campo de pin da revisão de spec de origem.
- [ ] A3 — D3: deprecar e remover `docs/api/openapi.yaml`, **depois** de repontar os **cinco**
      leitores: `contract-check.mjs:5`, `scripts/contract-check-full.mjs:6`,
      `scripts/kong-config-check.mjs:48` (com a asserção 6 de ADR-033 D7),
      `tests/contract/endpoints.spec.ts:9` e `tests/contract/openapi.spec.ts:6`; e reduzir
      `SPEC_PATHS` (`tests/contract/schemas.spec.ts:250`) a um elemento (D5.1).
- [ ] A2 — corrigir `tests/contract/endpoints.spec.ts:59` (`application/json` → o media type de
      ADR-034) e adicionar a asserção 7 de D5.
- [ ] A2 — `CHANGELOG.md` com a entrada de D3 antes do merge (§4.4).

## References

- `CONSTITUTION.md` §4.4 (nomeia `docs/api-spec.openapi.yaml` como o `servers` vigente),
  §4.3 (RFC 9457), §4.2 (a verificação de camadas é feita por CI)
- `docs/adr/027-content-api.md` (`:45` origem declarada; `:137`–`:138` drift medido; `:420` a terceira
  cópia; `:463` *"One OpenAPI file"* rejeitada e adiada; `:480` os dois arquivos mantidos idênticos)
- `docs/adr/018-persistence-derived-from-specs.md` (specs como fonte; o que é derivado)
- `docs/adr/030-gateway-rate-limiting.md` D7 (cobertura de rotas do Kong derivada de
  `docs/api/openapi.yaml`)
- `docs/adr/033` (D2 — `Deprecation` não-booleano, que o gate novo deve rejeitar)
- `docs/adr/034` (o `Problem` do perfil da plataforma) · `docs/adr/039`, `docs/adr/036`
  (schemas que dependem de um único canônico)
- `its-platform/contract-check.mjs:5,9,13-30` (o gate: 31 linhas, substring-only)
- `its-platform/scripts/contract-check-full.mjs:6` (leitor não wired) ·
  `its-platform/scripts/kong-config-check.mjs:23,48,122-129,131-149` (gate do Kong: asserções 6 e 7)
- `its-platform/tests/contract/endpoints.spec.ts:9,30-31,59` (lê o obsoleto; `:59` exige
  `application/json` nos erros — o defeito protegido por teste)
- `its-platform/tests/contract/openapi.spec.ts:6` ·
  `its-platform/tests/contract/schemas.spec.ts:1-20,237,250,691-727` (validador real + guarda de
  drift — o que A0 não viu)
- `reports/api/fase-0.md` §1.1 e os controles negativos N-4 (`docs/api/inventario.md` §7) ·
  `reports/api/fase-1.md` (a correção do A0)
