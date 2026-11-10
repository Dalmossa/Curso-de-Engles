---
name: nestjs-its
description: Use ao implementar módulos, endpoints, auth, filas ou testes no backend NestJS 10 (ESM) do ITS Platform em its-platform/src.
---

# NestJS 10 — Backend ITS (`its-platform/src/`)

## Runtime e convenções

- NestJS 10 + TypeScript 5.6, Node ≥ 20, **ESM** (`"type": "module"`): imports de arquivo locais **exigem extensão `.js`** (`./app.module.js`), mesmo sendo `.ts` na origem.
- Erros e validação: `class-validator` + `class-transformer` (não Zod no backend).
- Auth: `jose` (RS256/JWKS) — nunca inventar outro fluxo sem ADR.

## Estrutura real (não invente outra)

```
its-platform/src/
├── main.ts                 # bootstrap; DEVE chamar configureApp(app)
├── app.module.ts           # módulo raiz
├── app.setup.ts            # COMPOSITION ROOT: prefixo /api/v1, correlation id, error filter
├── modules/<feature>/      # audit, auth, content, curriculum, learners, placement, practice
│   ├── <feature>.controller.ts | .service.ts | .module.ts
│   └── dto/                # DTOs validados com class-validator
├── domain/                 # entities, events, services — regra pura, sem Nest/DB
├── infrastructure/         # persistence, repositories, mappers, queue, auth, audio, content, curriculum
├── common/                 # auth, filters, guards, http, interceptors
├── dto/  ├── health/  └── migrations/
```

- Isolamento de domínio é gateado: `npm run domain:check`. A regra de dependência vale igual à skill `clean-architecture` (camadas apontam para dentro), mas o mapa de pastas acima é o verdadeiro.

## Padrões

- **Módulo novo**: copiar o padrão de `modules/practice/` (module + controller + service + dto), registrar no módulo pai, exportar só o necessário.
- **Fila**: jamais `@Processor`/`BullModule` direto — toda fila passa por `src/infrastructure/queue/` (`QueueService`, `TaskProcessor`, `QueueHealthIndicator`). BullMQ é detalhe de implementação atrás dessa abstração.
- **Auth**: token verifiers em `infrastructure/auth/` (`jwks-token-verifier`, `token-verifier-from-env`, `deny-all-token-verifier`) + guards em `common/guards/`. Segredos só via env (ver `nestjs-env-config`).
- **Erros**: exception filters globais em `common/filters/`; padrão de erro definido na CONSTITUTION §4.3 — não criar formato paralelo.
- **`configureApp` em `app.setup.ts` é o composition root** (prefixo `/api/v1`, correlation id §4.6, filters): `contract:gate` falha se `main.ts` parar de chamá-lo — não mova configuração para `main.ts`.

## Contrato e testes

- `docs/api-spec.openapi.yaml` é lei: mudou rota/schema → atualize a spec primeiro (skills `openapi-spec`, `contract-testing`).
- Jest roda em ESM: sempre `node --experimental-vm-modules node_modules/jest/bin/jest.js` (os scripts npm já fazem isso — use os scripts, não `npx jest`).
- Gates pré-commit (ver `git-ci-gates`): `typecheck`, `lint`, `test:unit`, `test:gate`, `contract:gate`, `domain:check`, `rls:check`, `kong:check`.
- Integração constrói a app via `configureApp` (mesmo caminho do runtime), não montando providers soltos.
