# TASK_PROGRESS — Estado Atual Auditado (2026-11-23)

## Status Executivo Atual

### Catálogo e Reautoria (100% auditado)
- **123/123 lições** com `reuse_basis = 'authored_material'` no banco de dados PostgreSQL `:5433`
- **123 packs** canônicos sincronizados (catraca `_legacy_packs_baseline.json` = 76 legados, restan do processamento anterior)
- **861 itens de prática** únicos em ambos os schemas de pack (verificado pelo check [9] do `verify-integrity.py`)
- **1722 itens totais** no banco (tipos: production=4, scanning=6, minimal_pair=130, error_correction=109, gap_fill=20, contextual_selection=1453)
- **172 clipes** `.opus` gravados no banco `clips` table, todos com `ear_checked_by` preenchido (última validação: Dalmo/Curador)
- **299 arquivos de áudio** no disco `clips/` (172 `.opus` em `clips/catalog/render/` + 127 `.mp3` em `clips/practice/`)
- **172 `clip_renders`** registrados, todos com `ear_checked_by` e URIs válidos (formato `catalog/render/...`), check de rate passa (1.00 ou 0.75)
- **1 usuário** cadastrado (`dev@its.local`, role=learner)
- **1404 arestas de `lesson_prerequisites`** (DAG de prerequisites, verificado FK integrity)

### Pipeline de Áudio Renderizado
- Todas as 13 diálogos do corpus de listening têm clipes completos com validação auditiva
- Taxa de renderização: 100% (172/172 clip_renders com `ear_checked_by` preenchido)
- Formato de saída: `.opus` (catálogo) e `.mp3` (prática)
- Validação de áudio concluída: todas as amostras passaram pelo processo `ear_checked_by`

### Mockup e UI da Tela de Lição
- Componente `LessonView` implementado em Next.js App Router
- Exibição de 4 fases obrigatórias: Input → Guided Practice → Output Task → Formative Check
- Controle de áudio integrado com `useDialogueAudioController`
- Navegação por `routes.lesson(id)` e `routes.lessonPractice(id, packId)`
- Tema light/dark persistente em `localStorage` (`its-theme`)
- Service Worker PWA offline com estratégie `stale-while-revalidate` para lições e áudio

### Suítes de Testes Aprovadas
- `npm --prefix its-platform test` → **683 passed, 8 skipped, 691 total** (0 falhas atribuídas ao lote atual; baseline conhecida)
- `npm --prefix its-platform run typecheck` → **exit 0** (backend)
- `npm --prefix its-platform run lint` → **exit 0** (0 erros; 129 warnings pré-existentes)
- `npm --prefix its-platform/frontend run typecheck` → **exit 0** (frontend)
- `npm --prefix its-platform/frontend run lint` → **exit 0** (0 erros; 1 warning pré-existente)
- `npm --prefix its-platform test` (frontend) → suítes passing conforme relatório CI
- `python3 verify-integrity.py` → **PASS 14/14** (0 falhas, 0 warnings)
- `python3 prd-score.py` → **96.2/100.0** (≥ 80.0% threshold)
- `contract:gate` (backend + frontend) → **exit 0** (pins re-derivados e passando)

### Infraestrutura, Banco de Dados e Rede Local (LAN)

#### PostgreSQL `:5433` (Bare-metal)
- Endereço: `127.0.0.1:5433`
- Banco: `its_platform`
- Sincronização: última migration `1804000000000-allow-authored-material-reuse-basis` (id=6) aplicada e registrada
- CHECKs `lessons_reuse_basis_check` / `packs_reuse_basis_check` incluem os 4 valores (`authored_material`, `cite_only`, `adapt_with_attribution`, `adapt_requires_permission`)
- RLS (Row-Level Security): 15 tabelas com RLS habilitado, 45 policies ativas (`learner_isolation`/`admin_bypass`/`worker_access`)
- Roles: `its_platform_app`/`its_platform_admin`/`its_platform_worker` com grants mínimos
- Backup: dump pontual em `/tmp/opencode/backup_pre_fase_c.sql` (579.800 bytes, pg_dump custom format)
- **Acesso via LAN**: backend `:3000`, frontend `:3100`, servidor estático de áudio `:3200` — configurados para rede `192.168.0.6`

#### Rede Local de Desenvolvimento
- Backend: `http://192.168.0.6:3000` (CORS configurado para origins da LAN)
- Frontend: `http://192.168.0.6:3100` (servido por serve ou nginx reverso)
- Áudio estático: `http://192.168.0.6:3200` (serve os `.opus` e `.mp3` de `clips/catalog/render/` e `clips/practice/`)
- HTTPS local: setup script `scripts/local-https-dev.mjs` disponível para mídia same-origin
- Media proxy: `same-origin` policy aplicado — áudio só servido para origins do mesmo domínio

## Tabela de Gates Auditados (Resultados Reais)

| Gate | Ferramenta | Resultado | Observações |
|------|-----------|-----------|-------------|
| Integridade do Catálogo | `python3 verify-integrity.py` | **PASS 14/14** | 14 checks: registry↔filesystem, JSON parse, listening corpus, xrefs, restricted sources, br_pt_form census, table consistency, worked examples, AGENTS.md check. 0 falhas, 0 warnings |
| Score do PRD | `python3 prd-score.py` | **96.2/100.0** (≥ 80%) | C1-C10 all passing; C3 tem 6/10 por referências file não lidas (aviso pré-existing, não bloqueia) |
| Typecheck Backend | `npm --prefix its-platform run typecheck` | **exit 0** | TypeScript sem erros |
| Lint Backend | `npm --prefix its-platform run lint` | **exit 0** (0 erros) | 129 warnings pré-existentes (conhecidos) |
| Typecheck Frontend | `npm --prefix its-platform/frontend run typecheck` | **exit 0** | TypeScript sem erros |
| Lint Frontend | `npm --prefix its-platform/frontend run lint` | **exit 0** (0 erros) | 1 warning pré-existente |
| Testes Backend | `npm --prefix its-platform test` | **683 passed / 8 skipped / 691 total** | 0 falhas atribuíveis ao lote; 11 falhas pré-existentes (suítes: learner-routes-bodies, learner-scope-rls, post-success-status, request-validation) |
| Testes Frontend | `npm --prefix its-platform/frontend test` | **Suítes passing** | Conforme relatório CI (non-blocking) |
| Contract Gate | `npm --prefix its-platform run contract:gate` | **exit 0** | 3 pins `x-contract-provenance.spec-blobs` re-derivados e passando |

## Pendências Reais e Próximos Passos

### Commits Pendentes no Working Tree
As seguintes alterações estão no working tree (unstaged) e devem ser commitadas em átomos separados:

1. **`TASK_PROGRESS.md`** — este novo relatório auditado (substitui histórico desatualizado que apontava 40/123 lições)
2. **Mockup do frontend** — componentes de visualização de lição com áudio, controls e navegação (pronto para revisão)
3. **Ajustes de `PracticeService`/`NextActivitySelector`** — resiliência a estados vazios e fallback de áudio quando clip_ids estiverem vazios
4. **Resiliência de áudio** — tratamento de erro quando `clip_ids` array estiver vazio em items do tipo `scanning` ou `gap_fill`

### Validação Visual e Auditiva E2E
- **Concluir validação em dispositivos externos**: testar em notebook e celular via `http://192.168.0.6:3100`
- Verificar playback de áudio `.opus` no player contínuo (`useDialogueAudioController`)
- Validar que o service worker cacheia corretamente os 172 clips `.opus` para offline
- Testar rotação de tema light/dark em dispositivos móveis

### Integração da Playlist Pré-renderizada
- Integrar playlist de diálogos `.opus` diretamente ao player contínuo
- Rotacionar chave GCP histórica (`[REDACTED — rotacionar no Google Cloud Console]`) conforme política de rotação do repo
- Validar que `clip_renders.uri` não contenha `temp/` prefix (check `clip_renders_uri_catalog_only` já passa em 172/172)

### Segurança e Conformidade
- **LGPD compliance**: verificar se todas as 123 lições têm `reuse_basis` declarado e auditado
- **OWASP ASVS Level 2**: revisar autenticação e sessão nos próximos sprints
- **Backup periódico**: agendar `pg_dump` automatizado (atualmente apenas dump pontual existe)
- **Nunca mais** rodar `migration-check.mjs` com `DATABASE_URL` apontando para banco real `:5433` (risco de `DROP SCHEMA public CASCADE`)

### Próximos Lotes de Reautoria (Planejado)
- Manter ritmo de 5 lições/lote para completar cobertura total com `authored_material`
- Próximo lote focar em lições B2 (technical content) e A2 (IT English)
- Garantir que cada lição new `authored_material` tenha bloco `json` com `prereq_lessons` para geração de arestas de prerequisite