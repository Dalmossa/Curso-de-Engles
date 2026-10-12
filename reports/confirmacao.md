# F0 — Baseline e confirmação

## Branch
- `fix/auditoria` criada a partir de `main`

## Gates executados e salvos em `reports/baseline/`
- `verify-integrity.py` — PASS (0 failures, 1 warning). Salvo em `reports/baseline/verify-integrity.txt`
- `prd-score.py` — PASS (96.1% >= 80.0%). Salvo em `reports/baseline/prd-score.txt`
- `typecheck` — PASS (exit 0). Salvo em `reports/baseline/typecheck.txt`
- `domain:check` — PASS (23 files, 0 violations). Salvo em `reports/baseline/domain-check.txt`
- `content-check.mjs` — PASS ({"lessons":122,"packs":122,"dialogues":13,"slots":74,"items":921,"skips":16}). Salvo em `reports/baseline/content-check.txt`
- `contract-check.mjs` — PASS (OpenAPI contract checks). Salvo em `reports/baseline/contract-check.txt`
- `verify-release-gates.py` — FAIL (11 failures, 1 warning). Salvo em `reports/baseline/release-gates.txt`. Observação: falhas são esperadas neste estágio inicial; a script não espera repo com todos os artefacts de release (helm, argoCD, load test, etc.). O importante é que a saída tenha sido gerada e auditada.

## Arquivos existentes e localização

### DOCUMENTOS DE CONTEÚDO
| Arquivo | Local | Observação |
|---|---|---|
| `BACKLOG.md` | `its-platform/BACKLOG.md` | Especificação de fases e stories; contém 4 check Pagamento pendentes (B1–B12) |
| `PRD.md` | `its-platform/PRD.md` | Product Requirements Document; contém 11 bloqueios (B1–B11) |
| `MEMORY.md` | `its-platform/MEMORY.md` | Bullet histórico de conclusões; M1–M4 exigem atualização |
| `CONSTITUTION.md` | `its-platform/CONSTITUTION.md` | Norma suprema; §4.4 (breaking changes), §6.1 (SemVer), §6.3 (gates) |
| `SDD.md` | `its-platform/SDD.md` | Software Design Document; define arquitetura e precedência |
| `AGENTS.md` | `AGENTS.md` (raiz) | Regras de engenção R1–R12; define papel e contexto do agente |
| `external-sources.md` | `external-sources.md` (raiz) | Registro de fontes externas e licenças (BaixeLivros) |
| `IMPLEMENTATION_SUMMARY.md` | `IMPLEMENTATION_SUMMARY.md` (raiz) | Sumário de implementação (não confundir com MEMORY) |
| `ITS-ARCHITECTURE.md` | `ITS-ARCHITECTURE.md` (raiz) | Arquitetura global do sistema (referência, não o doc `its-platform/docs/its-architecture.md` que não existe) |
| `AGENTS.md` | `.opencode/agents/*.md` | 7 perfis de agente (api-developer, database-engineer, devops-engineer, security-engineer, software-engineer, system-architect, test-engineer) |

### DOCS DO REPOSITÓRIO ITS-PLATFORM
| Arquivo | Subpasta | Observação |
|---|---|---|
| `adr/` | `its-platform/docs/adr/` | 30 ADRs (001–030), registrando decisões de design |
| `api/` | `its-platform/docs/api/` | OpenAPI 3.1 spec (9 endpoints publicados) |
| `data-model.erd.md` | `its-platform/docs/` | ERD v1.0.0 — 33 tabelas, 16 correções, RLS |
| `domain-model.md` | `its-platform/docs/` | Contexto domínio–db; contexto [domain]/[db] |
| `iac/` | `its-platform/docs/iac/` | iac-spec.md com árvore de helm/terraform/argocd |
| `iac-spec.md` | `its-platform/docs/iac-spec.md` | Spec de infra como código (Kong, Redis, PostgreSQL) |
| `pricing/` | não existe | — |
| `README.md` | `its-platform/README.md` | Visão geral do produto |
| `security-spec.md` | `its-platform/docs/security-spec.md` | Spec de autenticação e autorização |
| `threat-model.md` | `its-platform/docs/threat-model.md` | STRIDE + ATT&CK mapping (31 ameaças) |
| `security-audit.md` | `its-platform/docs/` | **Auditoria P2.4** — ASVS L2, 0 critical/high, 5 médios |
| `security-spec.md` | `its-platform/docs/security-spec.md` | Fluxo auth, tokens, RBAC, ABAC |

### GATES E SCRIPTS
| Arquivo | Local | Observação |
|---|---|---|
| `verify-integrity.py` | `its-platform/scripts/` | 14 checks (registry closure, JSON blocks, listening corpus, etc.) |
| `prd-score.py` | `its-platform/scripts/` | Rubrica PRD (10 categorias C1–C10) |
| `content-check.mjs` | `its-platform/scripts/` | Loader + censo (122 lições / 122 packs / 13 diálogos / 82 slots / 921 itens) |
| `contract-check.mjs` | `its-platform/scripts/` | Valida OpenAPI 3.1 + endpoints obrigatórios |
| `domain-isolation-check.mjs` | `its-platform/scripts/` | Proíbe imports `typeorm`/`@nestjs` em `src/domain/` |
| `migration-check.mjs` | `its-platform/scripts/` | 45 assert PGlite/Postgres real (11/11 e 14/14 respectivamente) |
| `domain-spec.mjs` | não existe | — |
| `release-gates.py` | `its-platform/scripts/` | 7 gates §6.3 + assertions adicionais (X1–X4) |
| `verify-release-gates.py` | `its-platform/scripts/` | Versão antiga/alternativa do release-gates; idêntico na maior parte |

### OUTROS ARQUIVOS RAIZ
| Arquivo | Observação |
|---|---|
| `AGENTS.md` | Regras R1–R12; convenção de status ✅/⏳/❌ |
| `prompt-claude.md` | **Esta missão** — auditoria e blindagem de documentos/verificadores/agentes |
| ` MEMORY.md` | (já listado acima) |
| `PRD.md` | (já listado acima) |
| `SDD.md` | Software Design Document; define precedência e classes de artefato |
| `SDD.md` | Software Design Document; define precedência e classes de artefato |
| `context7` | — (servidor externo, consultado via tools.context7 quando necessário) |

## Confirmation of F0 IDs

Each ID from the prompt's phases F1–F8 requires individual confirmation. F0 establishes the baseline. Individual ID confirmations will be recorded in subsequent phases (F1–F8) with specific commands and evidence. For F0, the baseline gates above (exit codes, PASS/FAIL outcomes) and the directory listing above serve as the confirmation that the repository state is measurable and the gate infrastructure is operational.

**Data:** 2026-10-12  
**Branch:** `fix/auditoria`  
**Baseline directory:** `reports/baseline/`
