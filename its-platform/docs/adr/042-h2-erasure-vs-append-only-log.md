---
adr: 042
title: H2 — direito à eliminação (LGPD art. 18) versus o log append-only imutável
status: Proposed
date: 2026-10-14
authors: [@api-lead]
deciders: [unassigned]
consulted: [@security-lead, @backend-lead, @database-engineer, @legal]
informed: [@team]
tags: [lgpd, privacy, erasure, wcm, append-only, worm, audit-log, human-decision, needs-human-review, adr-015, adr-019, adr-026]
---

## Context

**Esta é uma decisão humana (H2).** Este ADR enquadra, recomenda e **para** (R9). Não pode ser
"aceito" por um agente, e a parte jurídica **exige parecer humano**.

### O conflito, em uma frase

A LGPD dá ao titular o direito de obter a **eliminação** de seus dados; a CONSTITUTION exige que o log
de segurança seja **append-only, hash-chained e WORM**. Um log que não pode ser alterado não pode
eliminar nada — e um dado pessoal nele permanece.

### Fontes primárias (verificado em 2026-10-14, planalto.gov.br, texto compilado)

| Dispositivo | Texto (fonte primária) |
|---|---|
| **LGPD art. 18, *caput*** | *"O titular dos dados pessoais tem direito a obter do controlador, em relação aos dados do titular por ele tratados, a qualquer momento e mediante requisição:"* |
| art. 18, **II** | *"acesso aos dados"* |
| art. 18, **IV** | *"anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com o disposto nesta Lei"* |
| art. 18, **VI** | *"eliminação dos dados pessoais tratados com o consentimento do titular, **exceto nas hipóteses previstas no art. 16** desta Lei"* |
| art. 18, **§5** | atendimento *"sem custos para o titular, nos **prazos e nos termos previstos em regulamento**"* |
| **art. 16** | *"Os dados pessoais serão eliminados após o término de seu tratamento … autorizada a conservação para as seguintes finalidades:"* — I *"cumprimento de obrigação legal ou regulatória"*; II *"estudo por órgão de pesquisa, garantida … a anonimização"*; III *"transferência a terceiro"*; IV *"uso exclusivo do controlador, **vedado seu acesso por terceiro, e desde que anonimizados os dados**"* |
| art. 19, **II** | declaração completa *"no prazo de até **15 (quinze) dias**"* (acesso/confirmação) |

### Restrições internas aceitas

- `CONSTITUTION.md` §4.6 — *"Security audit log | Authentication decisions (success **and** failure),
  access-control denials, validation failures, consent changes, and data-subject export/erasure are
  written to an **append-only, tamper-evident** log — hash-chained, WORM-backed. ASVS `v4.0.3-7.3.3`
  requires security logs be 'protected from unauthorized access **and modification**'."*
- `ADR-015` — `AppendOnlyEvent` é a classe de artefato #8; `ADR-019` — WORM com hash chain.
- `docs/data-model.erd.md` inclui as tabelas de eventos append-only.

### Onde o art. 16 **permite** conservar — e o que ele exige em troca

O art. 16 é a resposta do legislador à pergunta "eliminar o quê, exatamente". Ele autoriza conservação,
mas as hipóteses relevantes aqui (II e IV) **exigem anonimização**. A hipótese I (obrigação legal)
autoriza conservação **sem** anonimização, mas exige que exista a obrigação legal — o que é uma
afirmação de Direito, não de engenharia, e não pode ser presumida pelo time técnico.

### Nota sobre prazos: dois números circulam **sem fonte**

| Número | Onde aparece | Fonte primária? |
|---|---|---|
| **"< 30 dias"** | `BACKLOG.md` | **NÃO** — o art. 18 §5 remete a *"regulamento"*, que não foi citado |
| **"48h / 72h"** | relato do agente de segurança | **NÃO** — nenhuma fonte citada |
| **15 dias** | LGPD art. 19 II | **SIM** — *"até 15 (quinze) dias"*, e apenas para **acesso/confirmação** |

Por R2, os dois primeiros são **UNVERIFIED** e **não** podem virar SLA neste ADR. O prazo de
atendimento de eliminação depende de regulamento da ANPD, que **não** foi lido nesta fase.

## Decision (proposta — não vinculante até decisão humana e parecer jurídico)

**R1 (recomendação) — O log de eventos é, por construção, livre de PII identificável (Opção B).** Os
eventos guardam **surrogates** (ids de Classe L, ADR-031) e **não** nome, e-mail, IP, áudio, ou
qualquer campo do art. 5º I. O vínculo surrogate → pessoa vive numa tabela **apagável**, separada do
log. Consequência: *"eliminação"* passa a ser uma operação sobre a tabela de vínculo, e o log
permanece íntegro — o que satisfaz §4.6 **e** o art. 18 ao mesmo tempo, porque o log deixa de
conter dado pessoal.

**R2 — Para o PII residual inevitável, *crypto-shredding* (Opção A).** Se algum campo pessoal precisar
mesmo estar no log (a avaliar), ele é cifrado com uma chave **por titular**, e a eliminação destrói a
chave. O log mantém o texto cifrado e a cadeia de hash; o dado se torna ininteligível. **Isto é uma
decisão de segurança com consequência criptográfica** e exige revisão de segurança dedicada.

**R3 — Eliminação NÃO é "apagar a linha do log".** A Opção D é rejeitada de plano: viola §4.6, viola
ASVS 7.3.3, e destrói a propriedade de prova que o log existe para ter.

**R4 — Se houver base legal para retenção, ela é nomeada por escrito — nunca presumida.** Conservar
eventos com PII ao abrigo do art. 16 I exige a **obrigação legal identificada** e registrada. Sem
isso, a conservação se apoia só em II/IV — **ambas exigem anonimização**.

**R5 — A plataforma registra, e não decide, o prazo.** O `export`/`erase` é auditado (§4.6 lista
*"data-subject export/erasure"*); o **SLA** fica fora deste ADR enquanto não houver regulamento
citado. Se for necessário operar com um prazo, ele é decidido por H2 + jurídico e entra por emenda a
este ADR, com a fonte.

**R6 — O caso da *equipe*/staff não é o mesmo do titular.** Um aprendiz pedindo eliminação dos
próprios dados não autoriza apagar o log de ações de **staff** sobre ele (que são prova de §4.6).
Distinguir os dois é parte da decisão, não um detalhe de implementação.

## Consequences

### Positive
- R1 resolve o conflito **por desenho**, não por exceção: o log nunca chega a guardar PII
  identificável, então §4.6 e o art. 18 deixam de competir.
- R1/R2 preservam a propriedade de **prova** do log (a razão de ele existir) enquanto honram o direito.
- R5 recusa transformar um número sem fonte em SLA — o erro que A0 já encontrou duas vezes.

### Negative
- **R1 é caro e retroativo.** Todo evento hoje escrito precisa ser auditado quanto a PII; e um campo
  que "por acaso" carrega identificação exige migração de eventos **imutáveis** — o que é,
  literalmente, o problema que este ADR tenta evitar. Ou seja: R1 fica muito mais barato **agora**
  do que depois.
- **R2 é criptografia com destruição de chave**: perder a chave por acidente é perda de dado legítimo.
  Exige procedimento de custódia, e um erro aqui é irrecuperável.
- Nada disso é verificável sem um **parecer jurídico** sobre o art. 16 aplicado ao caso concreto —
  e este ADR **não** substitui esse parecer.

### Neutral
- R5 deixa o SLA em aberto deliberadamente. Um ADR que inventasse "30 dias" seria mais confortável
  e menos correto.

## Alternatives Considered

1. **Opção A — *crypto-shredding* apenas.** Válida e necessária em parte (vira R2); insuficiente
   sozinha, porque não elimina PII em claro de eventos históricos nem resolve o art. 18 IV.
2. **Opção B — eventos livres de PII + tabela de vínculo apagável (recomendada, R1).** Melhor custo
   para o futuro e o único caminho em que o conflito deixa de existir.
3. **Opção C — recusar a eliminação com base no art. 16 I, sem obrigação legal nomeada.** Rejeitada:
   apoiar-se numa obrigação legal que ninguém identificou é a definição de risco jurídico não
   assumido — e a recusa ao titular teria de ser fundamentada (art. 18 §4).
4. **Opção D — apagar/`UPDATE` no log.** Rejeitada (R3): viola §4.6 e ASVS 7.3.3, e destrói a
   cadeia de hash (ou exige reescrita dela, que é a mesma coisa vista de outro ângulo).
5. **SLA de 30 dias (BACKLOG) ou 48h/72h.** Rejeitadas por R2 (R2 do plano): **sem fonte primária**.
   Ficam registradas na tabela do §Context como UNVERIFIED.
6. **Tratar eliminação como "anonimizar in-place todos os eventos".** Rejeitada: reescrever eventos
   imutáveis é a Opção D por outro nome.

## Decisão requerida (ato humano)

> (1) **Parecer jurídico** sobre o art. 16 aplicado ao log de segurança: existe obrigação legal de
> retenção? Qual? (2) Escolher A / B / C / D. (3) Confirmar que o **prazo** fica fora do ADR até haver
> regulamento citado.
> Recomendação técnica deste ADR: **B (R1) + A onde inevitável (R2)**, com R3/R4 como invariantes.

## Implementation Plan

- [ ] **Bloqueado — ato humano e jurídico.** Os três itens da *Decisão requerida*.
- [ ] Pré-requisito técnico (pode começar antes da decisão): **auditoria de PII** em todo evento
      append-only hoje escrito, com a lista de campos e a classificação de cada um.
- [ ] Se R1: schema do vínculo surrogate → titular como entidade **apagável**, separada do log; o
      `erase` age sobre ela. Derivação do ERD via `ADR-018` (o ERD é contrato — R4 do plano).
- [ ] Se R2: desenho de chaves por titular, custódia e destruição, com revisão de segurança.
- [ ] A6 — `export` e `erase` como jobs assíncronos (ADR-037) com trilha em §4.6 (D6 do ADR-038).
- [ ] Gate: nenhum campo de PII em evento append-only (teste de schema + controle negativo).

## References

- **LGPD (Lei 13.709/2018)**, texto compilado — art. 5º I/II/III, art. 16 I–IV, art. 18 *caput* e
  II/IV/VI/§3/§4/§5, art. 19 II. Fonte primária: `planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm`
  (lido em 2026-10-14)
- `CONSTITUTION.md` §4.6 (log append-only hash-chained WORM; export/erase auditáveis), §4.5 (PII)
- `docs/adr/015-domain-model-bounded-contexts.md` (`AppendOnlyEvent`, classe #8)
- `docs/adr/019-p0.4-schema-migration.md` (WORM hash chain)
- `docs/adr/026-learner-context-app-role.md` · `docs/adr/031` (surrogates de Classe L)
- `docs/adr/037` (jobs de export/erase) · `docs/adr/038` (escopos `learner:export`/`learner:erase`)
- `its-platform/BACKLOG.md` (o "<30 dias" sem fonte) · `docs/data-model.erd.md`
