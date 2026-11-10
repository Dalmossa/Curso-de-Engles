---
name: frontend-its
description: Use ao criar ou evoluir o frontend Next.js do ITS (its-platform/frontend/): stack aprovada, camadas e convenções.
---

# Frontend ITS — Next.js (plano aprovado)

## Status

- Frontend ainda **não existe**; será criado em `its-platform/frontend/` (subpasta deste monorepo).
- Plano completo (fases, estimativas, riscos): `~/.opencode/plan/frontend-interface.md`. Confirme com o usuário antes de gerar a estrutura inicial.
- Objetivo: UI do ITS para falantes de BR-PT; PWA com offline para lições e prática de pronúncia; consome a API NestJS existente (`its-platform/docs/api-spec.openapi.yaml`, base `/api/v1`).

## Stack aprovada (não substituir sem decidir com o usuário)

- **Next.js App Router 15+** + React + **TypeScript** + **Tailwind CSS** + PWA (`manifest.json`, `sw.js`).
- UI: **Radix UI** (acessível por padrão); gráficos: **Recharts**; estado servidor: **TanStack Query**.
- Áudio: player/gravação com URLs assinadas pelo backend (`HmacAudioUrlSigner`) — requer CORS no NestJS.
- Testes: **Vitest + React Testing Library** (unit/integration) e **Playwright** (E2E); a11y com **axe-core**.
- Tipos da API gerados do OpenAPI — ver skill `openapi-typescript`.
- Código: skills `nextjs-app-router`, `nextjs-data-fetching`, `nextjs-env-config`, `clean-code`, `solid`, `oop`.

## Camadas (Clean Architecture — obrigatório)

```
frontend/src/
├── core/            # entidades, value objects, interfaces de repositório (sem deps externas)
├── application/     # casos de uso (startDiagnostic, submitPractice, getNextActivity)
├── infrastructure/  # API clients, storage (IndexedDB/localStorage), audio
├── presentation/    # componentes React (components/, forms/, charts/, audio/, layout/)
└── shared/          # types.ts, constants.ts, utils.ts
```

- Regra de dependência: `presentation → application → core`; `infrastructure` implementa interfaces definidas em `core`.
- Regras de negócio (mastery gate, seleção de próxima atividade) vivem em `core`/`application`, **nunca** em componente React — pura e testável sem DOM.

## Rotas App Router (planejadas)

- `(auth)/` login, register; `(dashboard)/`; `(lessons)/[lesson_id]/` + `practice/`; `(diagnostic)/`; `(mastery)/`; root `layout.tsx` com providers.
- `params`/`searchParams` são Promises (Next 15+) — ver `nextjs-app-router`.

## Definition of Done

- `npm run dev` e `npm run build` sem erros; `tsc --noEmit` zero erros; gate de testes verde.
- PWA instala e funciona offline; fluxo diagnóstico → lição → prática → progresso completo.
- Acessibilidade: teclado, leitor de tela, contraste (axe-core limpo).
- Docker build funciona (deploy via Helm/ArgoCD — ver `devops` skills).
