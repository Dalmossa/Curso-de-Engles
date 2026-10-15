---
adr: 044
title: A6 — o catálogo deixa de servir o gabarito (`key`, `is_key`, `slots[].key`, e os canais derivados)
status: Accepted
date: 2026-10-15
authors: [@api-lead]
deciders: [unassigned]
consulted: [@security-lead, @backend-lead]
informed: [@team]
tags: [api, content, confidentiality, answer-key, r6, adr-027, adr-038, adr-041, human-decision, needs-human-review]
---

**Accepted** (2026-10-15). Ratificação humana, naquele dia: **D1–D4 e D6 como propostos, e D5 como
recomendado** — a aula **mantém** o gabarito no corpo autorado, por ser material didático. Esta é a
decisão humana (A6) que este ADR enquadrou, **mediu**, recomendou e sobre a qual **parou** (R9); a
implementação entrou como A6b, na mesma data.

O que fica registrado com todas as letras, para que o escopo não se alargue depois:

- **Fecha:** `GET /content/packs/{id}` (`items[].key`, `options[].is_key`, `options[].note`) e
  `GET /content/listening/{id}` (`slots[].key`, `slots[].distractors[]` → `slots[].options[]`).
- **Mantém:** `GET /content/lessons/{id}` publica o gabarito no corpo autorado, **por decisão** (D5),
  e o banco continua com `items.key`/`item_options.is_key` (a pontuação é server-side).
- **Não abre superfície nova** (D4): não há `?include=key`, rota irmã, nem escopo de staff.

O *pin* de A6a (`tests/integration/content-api.spec.ts`) fixava o defeito para que a correção tivesse
superfície exata de inversão; A6c o inverteu, e o controle negativo de A6d mostra que revertendo a
projeção as asserções voltam ao vermelho.

## Context

### 1. A6 como o plano a enunciou — e por que a frase é falsa

`reports/api/fase-2.md` §2.7 fixa a fase assim:

> **A6** | confidencialidade: `content.service.ts:237` serve `items[].key` — o gabarito sai na
> resposta | **uma linha de `select`**. É o único item de R6 que é trivial, e exatamente por isso
> não pode esperar uma fase grande | R6, ADR-027 §3

`reports/api/fase-5.md` §8.11 já registrou que "uma linha" é falso: o spec canônico declara `key` e
`is_key` **`required`** e o teste de integração os asserta, logo removê-los é *breaking* (§4.4). A
medição abaixo mostra que a frase é falsa por uma segunda razão, independente da primeira: **o
gabarito tem mais de um canal, e três deles continuam abertos depois de remover tudo o que o
contrato declara.**

### 2. O requisito

R6 é incondicional — `docs/adr/043-h3-theta-cors-sdk.md`, tabela R1:

> parâmetros de item (`a`, `b`) e gabaritos/keys | **nunca** | R6; e `keys` hoje **vaza** em
> `/content/packs/{id}` (`content.service.ts:237`)

E o inventário de A0 já registrava a pendência por nome: `docs/api/inventario.md` **Apêndice B**
exige a checagem *"aprendiz nunca recebe `key`"* e anota que *"hoje `PackContent.items[].key` **é
servido**"*; o mesmo documento classifica `item_options` como interno — *"nunca servido cru"* (§4.1).
R6 não tem gradação: "nunca" não admite exceção não declarada.

### 2.1 O que a exposição é, hoje

Ela é **decidida**, não acidental — e é isso que a torna uma decisão humana em vez de um bug:

- **ADR-027 (Accepted)** §2: *"`options[]` ordered by `item_options.position`; `letter` is that
  position's letter (`A`→1 … `F`→6); `is_key` marks the key."* A mesma seção amendou o contrato
  para `items[].key` continuar publicado com `required` quando `scoring: choice`.
- **ADR-027** §Consequences/*Neutral*: *"The data is there for whoever needs it; the pack's consumer
  needs `is_key` and `scoring`, which are published."*

Fechar a exposição **emenda um ADR Accepted** e **quebra a forma publicada**, em dois lugares do
contrato. `CONSTITUTION.md` §4.4 classifica "removing … a field" como breaking; a nota de 90 dias
para correções de segurança tem conjunto afetado vazio (0 tags, nunca implantado), como nas
entradas já registradas em A5a/A5b — mas a *decisão* de quebrar continua sendo humana, não minha.

### 2.2 As seis superfícies, medidas

Medição de 2026-10-15 sobre o catálogo real carregado em PGlite (`loadContent` sobre a raiz do
repositório de conteúdo), lida de `ContentService` — o mesmo caminho que a API serve. O bloco `A6`
de `tests/integration/content-api.spec.ts` é essa medição em forma executável, e ele passa: o
estado atual **é** o que a tabela diz.

| # | Rota | Membro | Medido |
|---|---|---|---|
| 1 | `GET /content/packs/{id}` | `items[].key` | **841 de 841** itens `scoring: 'choice'` (os outros 6 são `asr_phoneme_match`, `key: null` por desenho — ADR-004) |
| 2 | `GET /content/packs/{id}` | `items[].options[].is_key` | **841** opções, exatamente uma por item pontuável |
| 3 | `GET /content/packs/{id}` | `items[].options[].note` | **derivado**: `null` em **841 de 841** opções-chave e em **0 de 2523** distratoras — `note === null` **é** o gabarito |
| 4 | `GET /content/listening/{id}` | `slots[].key` | **74 de 74** slots, nos 13 diálogos publicados |
| 5 | `GET /content/listening/{id}` | `slots[].distractors[]` | **derivado**: em **74 de 74** slots a letra correta é a que **falta** no conjunto de distratores (o conjunto é fechado em A–D) |
| 6 | `GET /content/lessons/{id}` | `phases[].markdown` | **122 de 122** aulas: a linha `**Key:** B` e a linha correta em **negrito**, texto autorado (116 com `**Key:**`, 6 só com `✓`) |

Contexto da tabela: 122 packs e **847** itens servidos (841 `choice` + 6 produção); 841 + 2523 =
**3364** opções publicadas; banco: 921 `items`, 915 com `key`, 915 `item_options.is_key`; 13
diálogos, **74** slots, todos com gabarito e com distratores. Todo item `choice` serve **quatro**
opções com as letras A–D **sem lacuna** — é o que torna os itens 3 e 5 canais: a
retirada do membro declarado não esvazia o conjunto, ela só deixa de rotulá-lo. Medido: os 841 itens
`choice` servem exatamente quatro opções, `ABCD`, sem exceção; e cada um dos 74 slots tem quatro
opções no banco (a chave e três distratores).

**Um sétimo canal foi encontrado na implementação (A6b), e ele não aparece nesta tabela** porque a
medição dela é sobre o catálogo e não sobre cada item: `options[].br_pt_form`. Dentro de um item, uma
opção sem glosa entre opções com glosa é a chave — em 17 dos 841 itens era exatamente o caso. D6
registra a medição e a regra que fecha o canal.

`br_pt_form` foi medido e **não** é canal: `null` em 43 de 841 opções-chave e em 48 de 2523
distratoras — há `null` dos dois lados, então um cliente não lê o gabarito nele. O bloco `A6` fixa
isso para que um leitor posterior não "corrija" um campo que não vaza.

### 3. O controle negativo que decidiu o enquadramento

O bloco `A6` tem 7 asserções. Com `items[].key`, `options[].is_key` e `slots[].key` **todos**
retirados da projeção — exatamente "uma linha de `select`" — o resultado medido é:

```
✕ serves `items[].key` for every item the pack can score
✕ serves `options[].is_key` — exactly one key option per scorable item, on the table key
✓ hands the key over through `options[].note` too, which is null on exactly the key options
✓ does not leak through `options[].br_pt_form`, which separates no option from another
✕ serves `slots[].key`, equal to the table value
✓ hands the key over through `slots[].distractors[]` too — the letter the slot distractor set omits
✓ serves the authored key inside the lesson body itself
Tests: 3 failed, 15 skipped, 4 passed, 22 total
```

Três canais continuam abertos depois da "correção": `note` (item 3), o complemento dos distratores
(item 5) e o corpo da aula (item 6, 122 de 122). **A6 não é uma linha de `select`; é uma projeção
de leitura, e o que a define não é a lista de membros a remover, é o predicado que nenhum membro da
projeção pode satisfazer.**

O mesmo controle expôs um defeito no *pin* que valeu corrigir: a primeira versão da asserção do
`note` lia a identidade da opção-chave **do payload** (`option.is_key`), então, com o membro
retirado, ela não provava nada em vez de provar que o canal seguia aberto. A asserção passou a ler a
identidade-chave de `items.key` — **a tabela é o oráculo, nunca o payload**, a mesma regra que
`tests/integration/learner-scope-rls.spec.ts` precisou em A5b.

### 4. Ninguém, no repositório, lê os membros servidos

- A pontuação é **server-side**: `ContentRepository` → `item_options.is_key` no banco. O
  `POST /learners/{id}/practice` recebe `{item_id, response, response_time_ms}` — a resposta, nunca
  o gabarito.
- `PilotBankService`/`diagnostic-*` constroem a forma do diagnóstico no servidor.
- O único leitor dos campos servidos são os testes de contrato e integração.

Não há, portanto, consumidor nomeado (R3) que perca algo com o fechamento — que é a diferença entre
esta decisão e uma quebra de contrato comum.

## Decision (ratificada em 2026-10-15)

**D1 — Em `PackContent`, `items[].key` e `items[].options[].is_key` deixam de ser servidos**, e o
contrato deixa de exigi-los (`api-spec.openapi.yaml` 416, 538). A projeção do item publica o
enunciado (`prompt`), `scoring`, `item_type`, `skill`, `domain` e o **conjunto completo** de opções
com `letter`/`text` — é o que um cliente precisa para renderizar e o que o servidor precisa para
pontuar. `scoring`/`item_type` **ficam**: são o que distingue um item `asr_phoneme_match` de um
item quebrado (a razão medida de ADR-027 §2), e não são função do gabarito.

**D2 — `options[].note` sai da projeção pré-resposta**, por ser o item 3 da tabela: `null`
exatamente na opção-chave. O `note` é *material de feedback* do distrator ("por que este distrator
é plausível"), que pertence a uma superfície **pós-resposta** — que não existe e não é desta fase
(R3: não se constroem superfícies sem consumidor nomeado). A coluna continua no banco.

**D3 — Em `DialogueContent`, `slots[].key` sai e `slots[].distractors[]` vira `slots[].options[]`**
— o conjunto completo, com `letter`/`text`, **sem** `key` e **sem** `type`. Manter `distractors[]`
como está e retirar só `key` deixa o gabarito recuperável como {A…D} \ distratores (item 5, 74 de
74), o que é o mesmo vazamento por outra porta. O `type` do distrator é feedback, como o `note`.

**D4 — O gabarito não é servido a staff nenhum.** Não há consumidor nomeado (R3), e ADR-041 (H1 —
também `Proposed`) **recomenda** o catálogo somente-leitura no MVP, com a autoria fora da API; um
escopo novo — `content:author` ou equivalente — emendaría o conjunto fechado de escopos de ADR-038 D2
para servir um consumidor que não existe. Se H1 algum dia aprovar uma superfície de autoria/QA, ela vem
com o seu próprio ADR e o seu próprio escopo; este ADR não a pré-autoriza.

**D5 — O corpo da aula (`phases[].markdown`) é decisão pedagógica, e a recomendação é mantê-lo.**
Item 6: 122 de 122 aulas publicam o gabarito dos próprios itens, no texto autorado. A recomendação é
**manter**, por três razões: (a) a aula é o *material didático*, e a chave ali é recurso deliberado
de *prática guiada* — o `AGENTS.md` descreve o ciclo da aula como Input → Guided Practice → Output
Task → Formative Check, e a verificação do próprio exercício é parte do desenho; (b) a rota é definida por
ADR-027 §4/§5 como o corpo autorado materializado, e retirar a chave exige cirurgia de markdown, com
segunda renderização e risco de saída malformada; (c) o que R6 protege é a **carga de avaliação**
— o payload que um cliente recebe para responder e pontuar —, não o material de estudo. A
consequência fica registrada com todas as letras: **quem lê a aula conhece o gabarito dos itens
daquela aula**; é a natureza de um livro com respostas, não uma porta deixada aberta. Se o produto
precisar de itens que o aprendiz *não* tenha visto, o que muda é a **curadoria do item** (item novo,
não o mesmo item da aula) — decisão de outra fase, não um filtro nesta rota.

**D6 — O que define o fechamento é um predicado, e ele é verificável.** A projeção de um item é
válida quando **nenhum membro dela é função do gabarito**. Concretamente, e testável sobre o
catálogo inteiro: (a) a projeção não carrega membro cujo valor se correlacione com a posição da
chave; (b) os objetos de opção de um mesmo item são **isomórficos** — mesmo conjunto de membros e
mesmo padrão de `null` — de modo que nenhum campo separe a opção correta; (c) o **conjunto de letras
servido é o conjunto completo** de opções daquele item, de modo que a letra correta não seja
recuperável por complemento. (a) sozinho não basta e (c) sozinho não basta: cada um cobre um dos
canais derivados que a medição encontrou.

**D6, medido de novo na implementação (A6b) — o sétimo canal.** Na primeira medição o enquadramento
foi o **catálogo inteiro**, e ali `br_pt_form` parecia inofensivo: `null` em 43 das 841 opções-chave
e em 48 das 2523 distratoras. O enquadramento que importa é **dentro do item**, e ele muda a
conclusão: **17 dos 841 itens** tinham exatamente uma opção sem glosa, e essa opção era a chave nos
17; 34 itens misturavam glosa e ausência de glosa dentro do item. Ou seja: `note` não era o único
membro cuja *ausência* entregava a resposta — `br_pt_form` também entregava, nos 17 itens em que a
opção correta era a única sem glosa. Aplicar (b) ao pé da letra resolve sem exceção e sem lista
escura: **a glosa é publicada por item, e só quando todas as opções daquele item têm uma.** Com a
regra, as opções de um item ficam isomórficas e nenhum membro aponta uma delas; 798 dos 841 itens
escoráveis mantêm o membro e 43 perdem-no (9 porque nenhuma opção tem glosa, 34 porque o item
mistura). O valor continua no banco (`item_options.br_pt_form`) para a superfície pós-resposta de D2.

## Consequences

### Positive

- R6 deixa de ser violado por duas rotas, e a violação passa a ser **detectável por predicado**, não
  por leitura: a projeção não pode reintroduzir o canal sem que o teste caia.
- O payload fica menor e mais simples: 3364 opções perdem `is_key` e `note`; 74 slots perdem `key`
  e ganham `options[]`, que é o que um renderizador precisa (um cliente hoje recebe o *complemento*
  do conjunto de opções e não tem como desenhar o item sem conhecer o gabarito).
- A decisão fica registrada onde a exposição foi decidida (emenda a ADR-027), em vez de ficar só no
  código.

### Negative

- **Breaking** nos dois schemas: `key`, `is_key`, `note` (packs) e `key`, `distractors[]` (listening)
  saem; `slots[].options[]` entra. Conjunto afetado **vazio** — 0 tags, nunca implantado —, como nas
  entradas já registradas em A5a/A5b; a entrada de CHANGELOG é obrigatória de qualquer forma (§4.4).
- A opção correta não é mais visível ao cliente: perde-se qualquer *self-check* offline no lado do
  cliente. É a consequência pretendida, e a superfície de feedback que a substituiria não existe.
- A assembleia dos três payloads ganha uma projeção explícita (um lugar a mais para manter). É o
  preço de (b) e (c) de D6.

### Neutral

- **O banco não muda.** O loader continua escrevendo `items.key` e `item_options.is_key` — a
  pontuação server-side e `migration-check` não são tocados. A correção é de **leitura**.
- `PackOption.br_pt_form` fica, **mas por item**: publicado só quando todas as opções daquele item
  têm glosa. A medição de A6a usava o enquadramento errado (o catálogo inteiro); A6b mediu item a
  item e achou o sétimo canal — ver D6. Com a regra, 798 dos 841 itens escoráveis mantêm o membro e
  43 perdem-no; o valor não sai do banco, só da projeção, e a superfície que o consumiria (pós-
  resposta) é a mesma que D2 deixou para outra fase.
- `listening_items` continua servido como `[]` (ADR-004) e `transcript` continua servido — é o
  material do item, não o gabarito.

## Alternatives Considered

1. **Só remover os membros declarados** ("uma linha de `select`", o enunciado do plano) —
   **medido e rejeitado**: deixa abertos `note`, o complemento dos distratores e o corpo da aula.
   Ver §3.
2. **Servir o gabarito a um escopo de staff** — emendaría ADR-038 D2 (conjunto fechado, ratificado
   em 2026-10-15) para criar consumidor onde R3 não nomeia nenhum; ADR-041 (H1) recomenda manter a
   autoria fora da API no MVP. Rejeitado em D4.
3. **Operação separada com projeção completa** (`GET /content/packs/{id}?include=key` ou rota
   irmã) — mesma objeção de R3: superfície sem consumidor nomeado; e o parâmetro transforma um
   esquecimento de escopo em vazamento.
4. **Manter e registrar uma exceção explícita ao R6** — é a única alternativa que não quebra
   contrato, e é coerente só se o requisito for reescrito: R6 diz "nunca", e um "nunca, exceto" é
   outra decisão, maior que esta. Se for a escolha humana, este ADR vira o registro da exceção e a
   fase A6 muda de "fechar" para "declarar".
5. **Hash/compromisso do gabarito** (servir `h(key)` para verificação) — nenhum consumidor pede
   verificação de gabarito, e um compromisso não resolve o problema que a exposição cria.

## Implementation Plan

Executado em **A6b**, em 2026-10-15, na mesma data da ratificação, na ordem de menor risco de
regressão silenciosa.

- [x] **A6.1 — a projeção.** `src/modules/content/content.service.ts`: `getPack` deixou de copiar
      `key`/`is_key`/`note`; a opção passou a `{letter, text, br_pt_form?}`; `getDialogue` monta
      `slots[].options[]` a partir de **todas** as opções do item (a chave inclusive, sem rótulo) e
      não serve `key` nem `distractors[]`.
- [x] **A6b — o contrato.** `docs/api-spec.openapi.yaml`: `PackOption` perdeu `is_key` e `note`
      (com o `if/then` de `note`, cujo `if` era *sobre* `is_key`); `PackItemContent` perdeu o membro
      `key` e o seu `if/then`; `slots[].key` + `distractors[]` deram lugar a `slots[].options[]`.
      `br_pt_form` virou `type: string` **não obrigatório**, e é essa a metade que o contrato tem de
      saber: a regra de D6(b) exige que a ausência seja ausência, e um `null` de preenchimento é o
      mesmo vazamento com outro acento — é exatamente o caso que `tests/contract/schemas.spec.ts`
      passou a **rejeitar** (`PACK_WRONG`). `contract:gate` **PASS**.
- [x] **A6c — as asserções do *pin*, invertidas.** O bloco `A6` de
      `tests/integration/content-api.spec.ts` passou a ser o **predicado** de D6 — sete asserções,
      uma por conjuntura mais o controle de que a tabela e o corpo da aula não mudaram — e as quatro
      asserções antigas que fixavam a exposição foram invertidas junto (pack legacy, pack
      canônico/ASR, diálogo e os 11 slots de ADR-027 §3a). O oráculo continua sendo
      `items.key`/`item_options.is_key` na tabela: a primeira tentativa de A6a lia o gabarito do
      *payload* e ficava vácuo exatamente quando o canal ainda estava aberto (§3).
- [x] **A6d — a entrada de CHANGELOG** (`breaking`), com o conjunto afetado vazio declarado e o
      caminho de migração do cliente (renderizar `options[]`; pontuar no servidor).
- [x] **A6e — o controle negativo da implementação** (R4). Um canal por vez, reintroduzido na
      projeção **e na interface** — é o que uma regressão real teria de fazer, e é o que faz o código
      compilar antes de a asserção julgá-lo:

      | Reintrodução | Asserções que ficam vermelhas |
      |---|---|
      | `items[].key` | (a) ausência |
      | `options[].is_key` | (a) ausência · "tabela vs payload" |
      | `options[].note` | (a) ausência · (b) isomorfismo |
      | `br_pt_form` por opção | (b) isomorfismo · regra da glosa |
      | `slots[].key` | conjunto completo de `slots[].options[]` |

      Nenhum canal passa despercebido — e os dois **derivados** (`note`, `br_pt_form`) são pegos
      *especificamente* por (b), que é a medição de que (b) não é decorativa.
- [x] **A6f — relatório** `reports/api/fase-6b.md`, com o antes → depois dos gates. A5a/A5b fixaram
      o precedente de um relatório por sub-fase; `reports/api/fase-6.md` fica sendo o registro de A6a.

## The question, and the answer (2026-10-15)

> Ratifica D1–D4 e D6 como propostos, e **D5** como recomendado (a aula mantém o gabarito, por ser
> material didático), ou prefere a outra metade de D5 — retirar também do corpo da aula?

**Resposta: ratificado D1–D4 e D6, e D5 como recomendado.** A resposta é a que fecha em **dois**
schemas (`PackContent`, `DialogueContent`); `LessonContent` não ganha projeção de markdown, e a
alternativa de D5 (cirurgia de markdown em 122/122 aulas, com segunda renderização) fica registrada
como considerada e **não** escolhida. Quem ler a aula conhece o gabarito dos itens daquela aula: é a
natureza do material, explicitada em D5, e não uma porta deixada aberta.

## References

- `reports/api/fase-2.md` §2.7 — A6 como o plano a enunciou; `reports/api/fase-5.md` §8.11 — por que
  "uma linha" é falso; `reports/api/fase-0.md` §1.1, item 4 — o achado original.
- `docs/adr/027-content-api.md` (Accepted) §2, §3, §Consequences — o que a exposição decidiu.
- `docs/adr/043-h3-theta-cors-sdk.md` R1 — o requisito R6; `docs/api/inventario.md` §4.1 e
  Apêndice B.
- `docs/api-spec.openapi.yaml` — `PackOption.required` (416), `items[].key` `if/then` (538),
  `slots[].key` `required` (589). As linhas citadas em `reports/api/fase-5.md` §8.11 (386, 479, 510,
  571) são as de **antes** de A5b somar as respostas de `401`/`403` ao spec: a numeração andou, os
  membros são os mesmos.
- `tests/integration/content-api.spec.ts` — bloco `A6`: a medição como teste, com a tabela como
  oráculo.
- `CONSTITUTION.md` §4.4 — a política de mudança quebrada; §9 — o processo de decisão humana.
