---
name: git-ci-gates
description: Use ao commitar, abrir PR ou rodar verificações no repo Curso-de-Ingles: comandos de gate, commits convencionais e checklist.
---

# Gates, Commits e PR — Repo Curso-de-Ingles

## Commits convencionais

- Formato: `tipo(escopo): mensagem` — tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`.
- Escopos úteis: `adaptive`, `auth`, `api`, `content`, `frontend`, `infra`.
- Mensagem no imperativo, minúscula, sem ponto final: `feat(adaptive): add FSRS-4.5 scheduler`.

## Dois diretórios, dois mundos

- **`its-platform/`** (backend NestJS): comandos `npm` rodam **dentro dessa pasta**.
- **Raiz do repo** (conteúdo/curriculo): scripts Python de integridade.

## Gates do backend (em `its-platform/`)

| Comando | O que verifica |
|---|---|
| `npm run typecheck` | `tsc --noEmit` — zero erros |
| `npm run lint` / `format:check` | ESLint + Prettier |
| `npm run test:unit` | Jest unit (ESM via `--experimental-vm-modules`) |
| `npm run test:gate` | Gate de testes agregado (`scripts/test-gate.mjs`) |
| `npm run contract:gate` | API real × `docs/api-spec.openapi.yaml`; falha se `main.ts` parar de chamar `configureApp` |
| `npm run domain:check` | Isolamento de domínio entre módulos |
| `npm run rls:check` | Contexto RLS nas queries |
| `npm run kong:check` | Configuração declarativa do Kong |

## Integridade de conteúdo (raiz do repo)

```
python3 verify-integrity.py   # 14 verificações; exit 1 em qualquer FAIL
python3 prd-score.py
```

- Rode **após editar qualquer spec ou autorizar artefato** de conteúdo — a maioria dos defeitos históricos do repo foi achada por ele, não por leitura.

## Ordem típica pré-commit

1. `lint` + `format:check` → 2. `typecheck` → 3. `test:unit` → 4. `test:gate` → 5. `contract:gate` (se mexeu em API) → 6. `domain:check`/`rls:check` (se mexeu em módulo/DB) → 7. `verify-integrity.py` (se mexeu em docs/specs/conteúdo).

## PR

- Descrição com o quê/porquê; testes passando; review aprovada.
- Specs são lei: não quebrar `api-spec.openapi.yaml`, `data-model.erd.md` nem cenários BDD sem passar pelo processo de mudança (`SDD.md`, na raiz).
- Mudança de arquitetura/contrato → ADR em `its-platform/docs/adr/`.
- Deploy: ArgoCD auto-sync em **dev**; **staging/prod** são manuais (skill `argocd-gitops`).

## Governance

- `its-platform/CONSTITUTION.md` (regras do platform) e `its-platform/BACKLOG.md` (prioridades) são referência obrigatória em decisões não triviais.
