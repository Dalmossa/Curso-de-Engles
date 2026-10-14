# Endpoints candidatos — sem consumidor nomeado (R3)

> **Regra R3 da missão:** *"Todo endpoint tem consumidor nomeado (história do BACKLOG, RF do PRD ou
> tela/fluxo descrito). Sem consumidor, vai para `docs/api/candidatos.md` e **NÃO** é implementado
> (como o pgvector foi removido até ter consumidor)."*
>
> Este arquivo é a lista de bloqueio. Um item sai daqui apenas quando um **consumidor nomeado**
> aparecer num artefato do repositório (nova linha no `BACKLOG.md`, RF no `PRD.md`, ou cenário em
> `tests/bdd/README.md`). Nada aqui deve ser implementado antes disso.
>
> **Fase:** A0 · **Data:** 2026-10-14.

---

## 1. Já implementados sem consumidor → **remover ou rebaixar**

| Endpoint | Por que não tem consumidor | Ação |
|---|---|---|
| `POST /auth/refresh` | `BACKLOG.md:90` — *"It must not implement `/auth/refresh` — the platform is a Resource Server only."* `P1.14` — *"Refresh rotation is the IdP's responsibility — `/auth/refresh` stays out of scope"*. `CHANGELOG.md` — `x-mvp-scope: excluded`, retorna `501`. | A1 formaliza (ADR Proposed); até então **não** é um recurso do produto. Hoje devolve um token mock (`auth.service.ts:5`) |

## 2. Pedidos pelo plano (A3–A5) mas **sem** consumidor nomeado → **bloqueados**

Cada linha é algo que o plano sugere construir. Sem um dos três artefatos de consumidor, fica aqui.

| Endpoint pretendido (plano) | Fase | O que falta | Como se promove |
|---|---|---|---|
| `GET /v1/cefr-levels` | A3 | nenhuma história lê a tabela como recurso | história de UI/admin que liste bandas CEFR |
| `GET /v1/domains` | A3 | idem (`domains` é referência; `assessment` §1.2 é spec, não consumidor) | idem |
| `GET /v1/skills` | A3 | idem | idem |
| `GET /v1/modules` | A3 | `P1.1` carrega o grafo; nenhuma história o serve | tela de trilha/currículo |
| `GET /v1/lessons` (coleção, paginada) | A3 | `P1.12` serve **um** lesson por id; não há listagem | tela de catálogo/índice |
| `GET /v1/packs` (coleção) | A3 | idem | idem |
| `GET /v1/items` (coleção, representação staff) | A3 | nenhuma história pede a listagem de itens; a representação staff é de A5 | história de autoria/QA |
| `GET /v1/dialogues` (coleção) | A3 | idem ao lesson | tela de biblioteca de listening |
| `GET /v1/clips` | A3 | `P1.13` entrega a playlist assinada; `clips` como recurso não tem história | — (provável que nunca deva existir) |
| `GET /v1/learners/me/sessions` | A4 | `PRD.md` §9 M6 descreve "completa uma lição"; não nomeia histórico de sessões | fluxo de histórico |
| `GET /v1/learners/me/review-queue` (FSRS) | A4 | `P1.5` constrói o scheduler; nenhuma história expõe a fila | tela de revisão espaçada |
| `GET /v1/learners/me/error-log` | A4 | `post-lesson` §4.2 **ranks** o log; não há superfície de leitura nomeada | tela "meus erros" |
| `POST /v1/jobs/import` (disparar loader) | A5 | `P0.5` roda o loader em CI/CLI; disparar por API não é história | necessidade operacional nomeada |
| `GET /v1/jobs/{id}` | A5 | só existe se o anterior existir | idem |
| `POST /v1/jobs/refit` | A5 | `stats` §9.2 é job noturno; não há história de trigger por API | idem |
| `GET /v1/admin/health-reports` | A5 | `P2.7` entrega observabilidade via Prom/Grafana, não via API | — (provável redundância) |

## 3. Pedidos pelo plano **com** consumidor nomeado → **autorizados** (não são candidatos)

Registrado para contraste — estes **podem** ser implementados nas fases indicadas.

| Endpoint pretendido | Consumidor nomeado | Fase |
|---|---|---|
| `GET /learners/me` (perfil) | `PRD.md` §9 M6; `tests/bdd/README.md:237` | A4 |
| `POST /learners/me/consents` / retirada | `P1.15` — "Granular consents; withdrawal triggers erasure" | A4 |
| `POST /learners/me/practice-attempts` | `tests/bdd/README.md:81` — "Practice Pack Submission (M3)" | A4 |
| `POST /learners/me/diagnostic` (iniciar/responder/resultado) | `tests/bdd/README.md:10`; `P1.9`, `P1.10` | A4 |
| `GET /learners/me/mastery` | `PRD.md` §9 M6; `P1.2` | A4 |
| `GET /learners/me/next-activity` | `P1.3` (bloqueada por ADR-021) — **só depois de `P1.3` sair do NOT DONE** | A4 (condicional) |
| `GET /content/lessons/{lesson_id}` | `P1.12` | já existe (manter) |
| `GET /content/packs/{pack_id}` | `P1.12` | já existe (manter) |
| `GET /content/listening/{dialogue_id}` | `P1.12` | já existe (manter) |
| `GET /content/listening/{dialogue_id}/audio` | `P1.13`, ADR-028 | já existe (manter) |
| `GET /me/data-export` | `P1.16` — literal no texto da história | A6 |
| `DELETE /me` | `P1.16` | A6 (condicionado a H2) |

---

## 4. Regra de saída

Um candidato vira endpoint quando **e somente quando** o consumidor aparecer num artefato
versionado. O gate de A2 ("endpoint sem história/consumidor", §6 do plano) deve falhar-fechado:
uma rota no código sem entrada neste arquivo **nem** em §3 é um defeito de CI, não uma
funcionalidade.
