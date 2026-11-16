# TASK_PROGRESS — Frentes 2 e 3 (ITS Platform)

## Concluído
- [x] Backend: `PronunciationScorer` enriquecido com `contrastive_tips` (vogal epentética, TH, contrastes `ship/sheep`, `live/leave`, `pull/pool`, `host/ghost`, `release`, `query`, `queue`, `asynchronous`) sem quebrar contrato.
- [x] Backend: entidade `pronunciation_attempts` + migration `1803000000000-create-pronunciation-attempts-table` (UUID PK, FK `learner_id`→`learners.id` ON DELETE CASCADE, `lesson_id` nullable, campos de texto/score/JSONB, `created_at`, índice `(learner_id, created_at DESC)`).
- [x] Backend: persistência automática de tentativas em `POST /api/v1/practice/pronunciation-evaluate` associada ao aprendiz autenticado (`principal.subject`), com falha de histórico não anulando avaliação.
- [x] Backend: endpoint protegido `GET /api/v1/practice/pronunciation-history` (`learner:self`) retornando `{ attempts, summary: { totalAttempts, averageScore, bestScore, weakWords } }`.
- [x] Backend: endpoint protegido `GET /api/v1/content/grammar-tip?topic=...` com execução sanitizada via `execFile` no RAG local (`tools/grammar-rag`), validação de `topic` e fallback gracioso `{ topic, tips: [], source: 'local-rag' }`.
- [x] Contrato OpenAPI atualizado (`contrastive_tips` em `PronunciationEvaluation`, `PronunciationHistoryResponse`, `GrammarTipResponse`, novos paths e erros `application/problem+json`).
- [x] Testes unitários adicionados/ajustados: dicas contrastivas no scorer e persistência/histórico no `PronunciationService`.
- [x] Migration aplicada no PostgreSQL `:5433` (`its_platform`) e confirmada (tabela, FK, índice e registro em `migrations`).
- [x] Frontend: operações BFF (`practice.pronunciationHistory`, `content.grammarTip`), mapeadores/repositório, use cases e server actions.
- [x] Frontend: `contrastive_tips` exibidas no feedback de pronúncia e botão discreto "Dica de Gramática" no painel de pronúncia da lição.
- [x] Frontend: cartão "Prática Oral e Pronúncia" em `/mastery` (total, média, melhor, "Palavras para Reforçar" com TTS).
- [x] `npm run api:types` executado no frontend.

## Em validação
- [ ] Gates backend: `typecheck`, `lint`, `test`, `contract:gate`, `domain:check`.
- [ ] Gates frontend: `typecheck`, `lint`, `test`, `build`.
- [ ] `python3 verify-integrity.py` (PASS 14/14).
- [ ] Reinício bare-metal `:3000`/`:3100` e validação real de `POST /api/v1/practice/pronunciation-evaluate`, `GET /api/v1/practice/pronunciation-history`, `GET /api/v1/content/grammar-tip?topic=Present+Simple`.
- [ ] Commits separados (backend/frontend), apenas arquivos da tarefa.

## Observações
- Infra bare-metal: PostgreSQL `:5433`, backend `:3000`, frontend `:3100`.
- `Ingles/` e `archive/` não foram lidos/abertos; grammar-tip usa `tools/grammar-rag/.venv/bin/python tools/grammar-rag/query_grammar.py --topic "<tema>" --top-k 2`.
- Baseline git sujo pré-existente mantido intacto.
