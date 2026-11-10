---
name: clean-architecture
description: Clean Architecture no ITS: Dependency Rule, camadas e ports/adapters em TypeScript (backend NestJS e frontend Next.js).
---

# Clean Architecture — ITS Platform (TypeScript)

## When to Use

- Estruturar módulos novos (backend) ou features novas (frontend)
- Enforcar regra de dependência entre camadas
- Code review de conformidade arquitetural
- Refatorar código que mistura camadas

## A Dependency Rule

```
Fontes de dependência APONTAM PARA DENTRO.
Camadas internas NÃO conhecem camadas externas.
```

## Camadas reais do repo

Backend (`its-platform/src/` — NestJS 10, ESM, detalhes na skill `nestjs-its`):

```
┌────────────────────────────────────────────────┐
│ Domain (src/domain/)                          │  ← regra de negócio PURA
│ entities, events, services (AdaptiveEngine)   │     sem Nest, sem DB, sem HTTP
├────────────────────────────────────────────────┤
│ Application / Modules (src/modules/)          │  ← casos de uso (practice, placement,
│ controllers, services, DTOs                   │     learners, curriculum, content, audit)
├────────────────────────────────────────────────┤
│ Interface Adapters (src/common/, mappers)     │  ← filters, guards, interceptors, mappers
├────────────────────────────────────────────────┤
│ Infrastructure (src/infrastructure/)          │  ← persistence, repositories, queue, auth,
│                                                 │     audio — detalhes concretos aqui
└────────────────────────────────────────────────┘
```

Frontend (`its-platform/frontend/` — ver skill `frontend-its`):

```
presentation/ → application/ → core/    (infrastructure/ implementa interfaces do core)
```

## Permitido vs Proibido

- ✅ `modules/*` → `domain/`; `infrastructure/` → `domain/` (implementa ports); controllers → services do próprio módulo.
- ❌ `domain/` importar `@nestjs/*`, TypeORM, BullMQ ou qualquer `infrastructure/`; `domain/` importar `modules/`.
- O gate `npm run domain:check` falha violações — rode antes do commit (skill `git-ci-gates`).

## Ports & Adapters (TypeScript)

Interface no domínio, implementação na infraestrutura:

```ts
// src/domain/repositories/lesson-repository.port.ts  (port — sem imports de infra)
export interface ILessonRepository {
  findById(id: LessonId): Promise<Lesson | null>;
  findPrerequisites(id: LessonId): Promise<Lesson[]>;
}

// src/infrastructure/repositories/typeorm-lesson-repository.ts  (adapter)
@Injectable()
export class TypeOrmLessonRepository implements ILessonRepository {
  constructor(@InjectRepository(LessonModel) private readonly repo: Repository<LessonModel>) {}
  async findById(id: LessonId): Promise<Lesson | null> { /* mapeia model → domínio */ }
}

// src/modules/curriculum/curriculum.service.ts  (consumidor depende da abstração)
@Injectable()
export class CurriculumService {
  constructor(@Inject(ILessonRepository) private readonly lessons: ILessonRepository) {}
}
```

- Injeção: token `ILessonRepository` no `useProviders` do módulo; nunca `new TypeOrmLessonRepository()` fora do DI container.
- Frontend: mesmo padrão — `core/repositories/` define a interface, `infrastructure/api/` implementa com TanStack Query/fetch, `application/` orquestra, `presentation/` só renderiza e despacha caso de uso.

## Domain Entities e Value Objects

- Entidades com identidade (`Learner`, `Mastery`, `Lesson`); VOs imutáveis com validação no construtor (`CEFRLevel`, `Theta`, `LessonId`) — detalhes na skill `oop`.
- Casos de uso orquestram, não contêm regra de negócio: a regra vive em `domain/services` (ex.: `AdaptiveEngine`) e permanece testável sem Nest nem DB.

## Validation Checklist

- [ ] `domain/` sem imports de Nest/TypeORM/BullMQ/HTTP
- [ ] Controllers apenas validam (class-validator) e delegam ao service do módulo
- [ ] Repositories: interface no domínio, implementação em `infrastructure/`
- [ ] Nenhuma dependência circular entre módulos
- [ ] Casos de uso orquestram; regra de negócio no domínio
- [ ] `npm run domain:check` verde
