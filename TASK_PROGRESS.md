# TASK_PROGRESS — Onda 1 / Lote 1 (IT B1/B2)

## Modo
- [x] Execução autônoma (sem perguntas/confirmações).
- [x] `Ingles/` e `archive/` não foram lidos, abertos, listados nem transcritos.
- [x] Infra tratada como bare-metal (PostgreSQL `:5433`, backend `:3000`, frontend `:3100`) — sem Docker/Helm/kind/ArgoCD.

## Lote 1 — Reautoria 100% `authored_material` (concluído)
- [x] Consultas RAG realizadas (`tools/grammar-rag/.venv/bin/python tools/grammar-rag/query_grammar.py --top-k 2`) para: passive voice/design decisions, modais must/should/could (code review), modais de conselho/recomendação (mentoria), MUST/SHOULD/MAY em requisitos/RFC, signposting/sequencing de apresentações técnicas.
- [x] `lessons/b1/les_b1_it_presentations.md` criado/desbloqueado (4 fases, glossário contrastivo pt-BR↔en-US, armadilhas, 5 sentenças-alvo corridas, foco articulatório, prompt, Shadow CAT, JSON `provenance`/`reuse_basis`=`authored_material`, `status`=`authored`).
- [x] `lessons/b1/les_b1_it_architecture_vocab.md` reautorado para `authored_material`.
- [x] `lessons/b1/les_b1_it_code_review.md` reautorado para `authored_material`.
- [x] `lessons/b2/les_b2_it_mentoring.md` reautorado para `authored_material`.
- [x] `lessons/b2/les_b2_it_rfc_writing.md` reautorado para `authored_material`.
- [x] Packs canônicos `authored_material` criados: `packs/b1/pack-les-b1-it-presentations.md`, `packs/b1/pack-les-b1-it-architecture-vocab.md`, `packs/b1/pack-les-b1-it-code-review.md`, `packs/b2/pack-les-b2-it-mentoring.md`, `packs/b2/pack-les-b2-it-rfc-writing.md` (itens originais, `br_pt_form`/distratores plausíveis, sem duplicatas).
- [x] Packs legados migrados removidos (`pack_les_b1_it_architecture_vocab_v1.md`, `pack_les_b1_it_code_review_v1.md`, `pack_les_b2_it_mentoring_v1.md`, `pack_les_b2_it_rfc_writing_v1.md`) e `_legacy_packs_baseline.json` atualizado para 111.
- [x] `specs/curriculum-graph-spec.md` atualizado (desbloqueio de `les_b1_it_presentations`, remoção de sufixos `sourced_external*` nas 4 lições reautoradas, marcação `reauthored_authored_material`, contagens/sumários ajustados).
- [x] `specs/assessment-item-spec.md` (censo `br_pt_form`), `external-sources.md` (§0.5) e `verify-integrity.py` alinhados para reconhecer/validar `authored_material` e o novo estado.
- [x] `docs/copyright-reauthoring-plan.md` atualizado com conclusão do Lote 1 e novo placar jurídico.
- [x] `python3 verify-integrity.py` → `PASS 14/14` (0 falhas, 0 warnings).

## Seed/sincronização em `its_platform` (:5433)
- [x] Verificação de scripts de seed/carga dedicada para lições/packs em `its-platform/src`: não encontrado script de carga/seed específico das 5 lições/packs além do carregamento de conteúdo existente no backend; nenhuma exclusão de dados de usuários/tentativas de pronúncia realizada.

## Observações
- Placar jurídico pós-Lote 1: **5/123** lições `authored_material` (Lote 1), 0 bloqueadas; packs legados restantes: **111** (catraca).
- Commit desta entrega limitado aos arquivos da tarefa (lições/packs do Lote 1 e atualizações estritamente necessárias de specs/registros/gates/progresso/plano).

## Lote 1 Onda 2 (Fundação A1/A2) — 2026-11-16
- [x] `lessons/a1/les_a1_greetings.md`, `lessons/a1/les_a1_intro_dialogue.md`, `lessons/a1/les_a1_daily_basics.md`, `lessons/a1/les_a1_pronunciation_intro.md` e `lessons/a2/les_a2_it_meeting_standup.md` reautoradas para `authored_material` (clean-room, 4 fases, proveniência autoral).
- [x] Packs canônicos `authored_material` criados: `packs/a1/pack-les-a1-greetings.md`, `packs/a1/pack-les-a1-intro-dialogue.md`, `packs/a1/pack-les-a1-daily-basics.md`, `packs/a1/pack-les-a1-pronunciation-intro.md`, `packs/a2/pack-les-a2-it-meeting-standup.md` (itens originais, `br_pt_form`/distratores coerentes, IDs únicos).
- [x] Packs legados v1 removidos: `packs/a1/pack_les_a1_greetings_v1.md`, `packs/a1/pack_les_a1_intro_dialogue_v1.md`, `packs/a1/pack_les_a1_daily_basics_v1.md`, `packs/a1/pack_les_a1_pronunciation_intro_v1.md`, `packs/a2/pack_les_a2_it_meeting_standup_v1.md`; `_legacy_packs_baseline.json` atualizado para **106**.
- [x] `specs/curriculum-graph-spec.md` atualizado (linhas §4.3 das 5 lições, ajustes §4.4.5/§4.4.6/§13 e sumários coerentes com disco: `sourced_external_thin` 0, `reauthored_authored_material` 10, `sourced_external` 7, `blocked_no_adequate_source` 0, packs 17/106).
- [x] `specs/assessment-item-spec.md` §2.2.1 (censo `br_pt_form` recomputado) e `external-sources.md` (§0.5/§5, placar 17/123 reutilizáveis/autoralmente limpos, `cite_only` 104, `sourced_external_thin` 0) alinhados; `verify-integrity.py` ajustado apenas na expectativa de `sourced_external_thin` (0) mantendo 14 checks.
- [x] `docs/copyright-reauthoring-plan.md` atualizado com placar/inventários/contagens e registro da Lote 1 Onda 2 (2026-11-16).
- [x] `python3 verify-integrity.py` → **PASS 14/14** (0 falhas, 0 warnings).

**Placar Lote 1 Onda 2 (Fundação A1/A2):** 10/123 lições `authored_material`; 17 packs canônicos / 106 packs legados (catraca). Commit limitado aos 17 paths especificados.
