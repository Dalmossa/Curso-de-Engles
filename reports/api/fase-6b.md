# Fase A6b — a implementação: o gabarito fora da projeção, e o sétimo canal

**Data:** 2026-10-15 · **Baseline:** `a8ffa86` (A6a fechada; ADR-044 ratificado no mesmo dia) ·
**Estado:** A6b **entregue** — projeção, contrato, CHANGELOG, controle negativo e gates. Um achado
novo vai marcado para revisão humana (§6); nada mais está aberto.

---

## 1. O que a ratificação fechou

A resposta do usuário em 2026-10-15 foi "Ratifico D1–D4 e D6 + D5 como recomendado (Recommended)".
Lido contra o texto do ADR, isso fixa: o servidor deixa de publicar o gabarito nas duas rotas de
catálogo (`D1`–`D4`), os membros saem **da projeção e não do banco** (D2), o `slots[].key` dá lugar
ao conjunto completo de opções (D3), a **aula mantém o gabarito no corpo autorado** (D5, material
didático) e o fechamento é um **predicado verificável**, não uma lista de membros (D6).

## 2. O sétimo canal — e por que ele contradiz um bullet do ADR

A medição de A6a foi feita **sobre o catálogo** e concluiu que `br_pt_form` não separa nada (43/841
opções-chave têm `null`, 48/2523 distratoras têm — há `null` dos dois lados). O enquadramento certo
é **dentro do item**, e ele inverte a conclusão:

| Forma do item (medido 2026-10-15) | Itens | O que acontece |
|---|---|---|
| todas as opções com glosa | 798 | nada separa; publicar é inócuo |
| nenhuma opção com glosa | 9 | nada separa; publicar seria `null` em todas |
| **glosa em algumas, `null` em outras** | **34** | **a opção sem glosa é a chave**: em 17 desses 34 itens a opção sem glosa era a *única*, e era a chave nos 17 |

Isto é um **sétimo canal**, e ele contradiz o bullet *Neutral* do ADR-044 ("`br_pt_form` fica"). A
regra aplicada é a aplicação literal de D6(b) — as opções de um item têm de ser **isomórficas** — e
é a menor intervenção que satisfaz o predicado ratificado: `br_pt_form` é publicado **por item**, e
só quando **todas** as opções daquele item têm glosa. Resultado: **798 mantêm, 43 perdem** (9 sem
glosa alguma, 34 mistos).

Alternativas medidas e **não** adotadas, registradas para a revisão:

1. **remover `br_pt_form` globalmente** — fecha o canal com a mesma certeza e custa 798 itens de
   apoio em português ao aprendiz A1/A2;
2. **manter como estava** — deixa 34 itens (17 deles com gabarito univocamente identificável) abertos.

O valor **não sai do banco** (`item_options.br_pt_form` continua lá), e a superfície que o leria — a
pós-resposta — é a mesma que D2 deixou para outra fase. O contrato acompanha: `PackOption.br_pt_form`
virou opcional e `type: string`, de modo que a **ausência seja ausência**: um `null` de preenchimento
é o mesmo vazamento com outro acento, e `tests/contract/schemas.spec.ts` agora **rejeita** esse caso
(`PACK_WRONG`) em vez de apenas tolerá-lo.

**Marcado para revisão humana:** a regra por item é interpretação direta de D6(b), mas o bullet
*Neutral* ratificado diz o contrário. Registrado em `docs/adr/044` (§Decision, D6 e *Neutral*) e aqui.

---

## 3. A projeção, antes → depois

| Rota | Antes | Depois |
|---|---|---|
| `GET /content/packs/{id}` | `items[].key` (`"B"`), `options[].is_key`, `options[].note` | nada disso; `options[]` é o conjunto **completo**, em `position`, sem rótulo; `br_pt_form` só com glosa uniforme |
| `GET /content/listening/{id}` | `slots[].key` + `slots[].distractors[]` (o complemento do gabarito) | `slots[].options[]` — as quatro opções, a chave entre elas |
| `GET /content/lessons/{id}` | corpo da aula com a chave | **inalterado, por decisão** (D5) — é material didático |
| banco (`items.key`, `item_options.is_key`) | — | **inalterado**: a pontuação server-side, `migration-check` e `content-check.mjs` leem a tabela como antes |

O oráculo das asserções continua sendo a **tabela**, nunca o payload: a primeira versão do *pin* de
A6a lia `option.is_key` e ficava vácuo exatamente quando o canal seguia aberto (`reports/api/fase-6.md` §3).

---

## 4. Controle negativo da implementação (R7)

Um canal por vez, reintroduzido na projeção **e na interface** — é o que uma regressão real teria de
fazer, e é o que faz o código compilar antes de a asserção julgá-lo. Executado sobre
`tests/integration/content-api.spec.ts -t 'R6'`, revertido em seguida (`git diff` de `src/` volta a zero).

| Reintrodução | Asserções que ficam vermelhas |
|---|---|
| `items[].key` | (a) ausência |
| `options[].is_key` | (a) ausência · "tabela vs payload" |
| `options[].note` | (a) ausência · (b) isomorfismo |
| `br_pt_form` por opção (o sétimo canal) | (b) isomorfismo · regra da glosa |
| `slots[].key` | conjunto completo de `slots[].options[]` |

Nenhum canal passa despercebido — e os dois **derivados** (`note`, `br_pt_form`) são pegos
*especificamente* por (b), que é a medição de que (b) não é decorativa.

---

## 5. Gates — antes → depois

| Gate | Antes (`a8ffa86`) | Depois | O que mudou |
|---|---|---|---|
| `npm run test:gate` | PASS — 504 passed, 5 known-red (allowlist), 8 skipped, 517 | **PASS — 504 passed, 5 known-red, 8 skipped, 517** | nenhum: o bloco `A6` foi invertido, não ampliado |
| `npm run contract:gate` | PASS | PASS | o contrato mudou e continua conformante (spec × rotas, `$ref`s) |
| `npm run rls:check` | PASS — 133 arquivos, 0 violações | PASS — igual | — |
| `npm run domain:check` | PASS — 23 arquivos, 0 violações | PASS — igual | — |
| `npm run kong:check` | PASS — 9 asserções | PASS — igual | — |
| `npm run typecheck` | clean | clean | — |
| `npm run lint` | 0 errors, 3 warnings (arquivos ignorados) | igual | — |
| `python3 verify-integrity.py` | PASS — 0 falhas, 1 aviso herdado | PASS — igual | — |
| `python3 prd-score.py` | 92,6% | 92,6% | — |
| `npm test -- tests/contract/` | 35 passed | **35 passed** | `PACK_WRONG` passou a rejeitar `br_pt_form: null` |

`format:check` continua vermelho **antes e depois** (arquivos de `src/` fora do Prettier) — não é
gate nesta série e não foi tocado; registrado para não ser confundido com regressão.

---

## 6. O que sobra

1. **A revisão humana do §2** — a regra de `br_pt_form` por item: manter, remover globalmente, ou
   aceitar o canal. As três estão medidas; a aplicada é a leitura literal de D6(b).
2. **Nada mais desta fase.** As pendências herdadas (ADR-038 D4, a credencial da conexão, os ADRs
   031–043 `Proposed`, `Sunset`, o aviso de 90 dias, `x-required-scope`) continuam onde estavam e
   não bloqueiam A6 — a lista está em `reports/api/fase-6.md` §7.
