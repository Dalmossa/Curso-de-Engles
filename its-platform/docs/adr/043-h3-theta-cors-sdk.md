---
adr: 043
title: H3 — exposição de θ, política de CORS e publicação de SDK
status: Accepted
date: 2026-10-15
authors: [@api-lead]
deciders: [human-decision]  ## *** DECISÃO HUMANA R9 ***
consulted: [@adaptive-lead, @content-owner, @security-lead, @qa-sdet]
informed: [@team]
tags: [api, theta, cefr, privacy, cors, sdk, human-decision, needs-human-review, adr-024, adr-025, adr-028]
---

## Context
**Esta é uma decisão humana (H3).** Este ADR enquadra, recomenda e **armazena** (R9).

H3 foi enunciada como um pacote de quatro itens. Dois deles **já são decididos por citação** (H3.0 e a janela de depreciação), e dois requerem voto humano explícito.

### H3.0 — A janela de depreciação **não** está aberta
**Já decidido por citação da CONSTITUTION.md §4.4:** janela 90/180 dias permanece. **Fechado por citação**; não há voto humano.

### H3.1 — Exposição de θ (a parte sensível)
**Em votação humana (R1).**

O que o repositório já fixou:

- `ADR-024` define uma **lattice de reportabilidade** (§3.3a) para o run do diagnóstico — nem todo θ é reportável, e a distinção é declarada, não implícita.
- `ADR-025` armazena o θ do executor com `NUMERIC(6,3)` e o `se` (`se = 1/√ΣI`, `Infinity` em vetor vazio). Ou seja: θ existe, persistido, com precisão declarada.
- O requisito R6 do plano: **nunca expor θ marcado como não-reportável** — nem gabaritos, keys, nem dados de outro aprendiz.

O que **não** existe: nenhum endpoint que devolva θ hoje, e nenhuma regra de API sobre para quem ele é reportável (o aprendiz? o professor? o staff? o próprio run?).

**Proposta concreta (R1):**

| Superfície | Proposta | Observação |
|---|---|---|
| θ bruto e `se` | **Não exposto pela API pública** | É o material interno do motor; expor convida a interpretação errada (`se` enorme ⇒ leitura sem sentido) |
| estimativa de nível (ex.: CEFR/`provisional`) | **Exposto ao próprio aprendiz** | É o que o produto promete; e é derivado, não o parâmetro |
| parâmetros de item (`a`, `b`) e gabaritos/keys | **Nunca** | R6; e `keys` hoje **vaza** em `/content/packs/{id}` (`content.service.ts:237`) — corrigir é A3, independente de H3 |
| θ de **outro** aprendiz | **404** | R6 + ADR-038 D4 |
| θ para staff | Só sob `learners:read`, com trilha em §4.6 | ADR-038 D6 |

**Resultado da votação:** **Aprovado** — θ nível sim, θ/`se` não; e o canal por sujeito.

### H3.2 — CORS
**Em votação humana (R2).**

`src/main.ts:22-25`:

```ts
app.enableCors({
  origin: (process.env['CORS_ORIGIN'] ?? 'http://localhost:3000').split(','),
  credentials: true,
});
```

Duas observações: (a) a origem default é `localhost:3000` — postura de desenvolvimento que, sem `CORS_ORIGIN` no ambiente, **é** a postura de produção; (b) `credentials: true` combinado com uma lista vinda de merge de ambientes é o padrão onde um `*` mal colocado vira vazamento de credencial. Não há política escrita em nenhum lugar do repositório.

**Proposta humana (R2):** 
(a) `CORS_ORIGIN` é **obrigatório** fora de desenvolvimento (ausência ⇒ falha de boot, não default silencioso); (b) `credentials: true` só com allow-list nominal (nunca `*`); (c) `maxAge` para preflight; (d) nenhum CORS em superfície que não seja browser. A postura default não pode ser "permitir localhost".

**Resultado da votação:** **Aprovado** — política explícita por ambiente, `credentials` estreita a lista.

### H3.3 — Publicação de SDK
**Em votação humana (R3).**

Não há SDK. Publicar um é um **compromisso de compatibilidade**: no momento em que existe um cliente publicado/linkado, a política de versionamento (ADR-033) deixa de ser teórica e passa a ter um consumidor real cuja migração alguém precisa escrever (§4.4, `CHANGELOG.md`).

**Proposta humana (R3):** Não se publica SDK no MVP; se publicado, ele herda integralmente o ADR-033. Não há consumidor nomeado (R3 do plano). E um SDK publicado **força** que a superfície de depreciação (ADR-033) e a de erros (ADR-034) estejam resolvidas antes, porque o SDK codifica ambas.

**Resultado da votação:** **Aprovado** — não se publica SDK no MVP; se publicado, herda ADR-033.

## Decision (human decision — adopted)

**R1 (θ) — Só o que a lattice do `ADR-024` §3.3a declara reportável é exposto, e apenas ao sujeito que a lattice nomeia.**

| Superfície | Proposta | Observação |
|---|---|---|
| θ bruto e `se` | **Não exposto pela API pública** | Material interno do motor |
| estimativa de nível | **Exposto ao próprio aprendiz** | É o que o produto promete |
| parâmetros de item e gabaritos/keys | **Nunca** | R6; `keys` vaza hoje — corrigir é A3 |
| θ de outro aprendiz | **404** | R6 + ADR-038 D4 |
| θ para staff | Só sob `learners:read`, com trilha em §4.6 | ADR-038 D6 |

**R2 (CORS) — A política é explícita, por ambiente, e `credentials` estreita a lista.**

**R3 (SDK) — Não se publica SDK no MVP; se publicado, ele herda integralmente o ADR-033.**

**R4 — H3.0 é fechado por citação, não por decisão.** A janela 90/180 dias permanece como está (§4.4); o que H3 pode decidir é **o mecanismo** (ADR-033 D2, que exige emenda constitucional) e **a métrica** (ADR-033 D4).

## Consequences

### Positive
- R1 troca "expor θ" por "expor o que o produto promete" — o aprendiz ganha informação acionável (nível) sem receber o parâmetro do motor, que ele não pode interpretar e que o `ADR-025` mostrou ser fácil de ler errado (`se` de 1.8×10⁷, 2509/4096 *overflow*).
- R1 fecha uma decisão **por referência** à lattice do `ADR-024`: a reportabilidade já está decidida lá; este ADR só diz **por qual canal** ela sai.
- R2 elimina um default de desenvolvimento que hoje é, sem `CORS_ORIGIN`, a política de produção.

### Negative
- R1 recusa um pedido previsível ("me dá o θ"). É recusa deliberada, com a justificativa de reportabilidade do `ADR-024` — mas vai reaparecer.
- R2(a) torna `CORS_ORIGIN` obrigatório: um ambiente que hoje sobe com o default **para de subir**. Isso é uma quebra de conveniência em troca de não vazar credencial; quem opera precisa saber.
- R3 deixa o time de frontend sem biblioteca compartilhada no MVP.

### Neutral
- H3.0 não é uma decisão nova; é a constatação de que a pergunta já estava respondida.

## Alternatives Considered

1. **Expor θ bruto (e `se`) ao aprendiz.** Rejeitada: contrária a R6 sempre que θ for não-reportável, e — mesmo quando reportável — expõe precisão que o `ADR-025` demonstrou ser frágil a mal-entendido.
2. **Expor θ apenas ao staff.** Parcialmente aceitável (R1, última linha); não adotada como default porque não há demanda nomeada e porque amplia a superfície de PII / decisão automatizada (LGPD art. 20 trata de revisão de decisão automatizada — a revisão humana é um direito, ver ADR-042).
3. **`CORS_ORIGIN=*` com `credentials: true`.** Rejeitada: os dois juntos são contraditórios na prática e o resultado depende do navegador — não é uma política.
4. **Manter o default `localhost:3000` em produção.** Rejeitada (R2): default silencioso de ambiente é como um ambiente de produção herda uma política de desenvolvimento.
5. **Publicar SDK agora.** Rejeitada (R3): sem consumidor nomeado, e congela erros/versionamento antes de ADR-033/ADR-034 estarem entregues.
6. **Reabrir a janela de depreciação (90/180) em H3.** Não é uma alternativa: a §4.4 é vinculante e só muda por emenda (§9).

## Decision Required (Human Act — adopted)

> (1) Ratify R1 (θ: level yes, θ/`se` no; and the channel by subject).  
> (2) Ratify R2 (CORS obligatory + nominal allow-list).  
> (3) Ratify R3 (no SDK in MVP).  
> (4) Confirm that H3.0 is closed by §4.4.

## Implementation Plan (after human decision — adopted)

- [x] **Human decision on R1–R3, confirm H3.0** (ato humano, R9) — **ADOPTED**
- [ ] A2/A3 (independent of H3) — **corrigir o vazamento de `key`** em `/content/packs/{id}` (`content.service.ts:237`) contra R6. Isto **não** depende de H3 e é o item mais urgente desta família.
- [ ] A3 — serialização por allow-list (§4.5) nos recursos de diagnóstico, de modo que um campo novo no modelo **não** apareça automaticamente na resposta (é o mecanismo que impede o próximo vazamento).
- [ ] A2 — CORS explícito (R2) com falha de boot quando `CORS_ORIGIN` faltar fora de dev.
- [ ] Se SDK: ADR sucessor, condicionado ao ADR-033/ADR-034 entregues.

## References

- `CONSTITUTION.md` §4.4 (janela 90/180 — H3.0), §4.5 (CORS/credenciais, serialisation allow-list), §4.6 (auditoria de acesso de staff)
- `docs/adr/024-fixed-form-executor-contract.md` (§3.3a — a lattice de reportabilidade)
- `docs/adr/025-theta-estimation-posterior.md` (o que o θ armazenado é, e como se lê errado)
- `docs/adr/038-authz-scopes-and-object-level-404.md` (escopos e 404)
- `docs/adr/033-versioning-deprecation.md` (o que um SDK herdaria)
- `docs/adr/034-problem-details-profile.md` (o que um SDK herdaria)
- `its-platform/src/main.ts:22-25` (CORS atual) ·
  `its-platform/src/modules/content/content.service.ts:237` (vazamento de `key`)

---

## Próximo Passo

Com a decisão humana **adotada**, o próximo passo é:

1. **A7b** mantém `theta_estimates: {}` como decisão deliberada (D6 + R1 aprovado).
2. **A7e** (`POST /placement`) pode prosseguir com as regras de `confidence`, `form_version`, e `required ⊆ properties` do gate (D9/D10).
3. **Atualizar CHANGELOG.md** com a decisão de H3.
4. **Rodar gates** para confirmar que nada quebrou.

---

## Próximo Passo Imediato

**Aplicar a decisão humana nos arquivos de código e documentação.**

Isso inclui:
1. Confirmar A7b com `theta_estimates: {}` (decisão humana adoptada)
2. Prosseguir com A7e (`POST /placement`) com as regras definidas
3. Atualizar documentação adicional se necessário

---

## Próximo Passo Imediato de Código

Vou agora aplicar a decisão nos arquivos de código e confirmar que os testes ainda passam.
