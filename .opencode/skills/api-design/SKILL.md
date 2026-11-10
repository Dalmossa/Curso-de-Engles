---
name: api-design
description: Use ao criar ou revisar endpoints REST, DTOs validados e documentação OpenAPI no backend NestJS do ITS Platform.
---

# API Design — ITS Platform (NestJS)

## When to Use

- Projetar novos endpoints REST ou alterar existentes
- Definir DTOs de request/response
- Documentar rotas no Swagger
- Versionamento e depreciação de API

## Workflow (contrato primeiro)

1. **Spec é lei**: altere `docs/api-spec.openapi.yaml` antes do código (skills `openapi-spec`, `contract-testing`).
2. Implemente o DTO + controller seguindo a spec.
3. Rode `npm run contract:gate` — falha se código e spec divergirem.

## DTOs — class-validator (não Pydantic)

```ts
// src/modules/curriculum/dto/next-activity-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class NextActivityQueryDto {
  @ApiPropertyOptional({ minimum: 5, maximum: 60 })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(60)
  time_budget_minutes?: number;
}
```

- Validação global já configurada (`whitelist` + `forbidNonWhitelisted`) via `configureApp` — campos extras são rejeitados automaticadamente.
- Regras ricas (`@Matches`, `@IsIn`, `@ValidateNested`) espelham os `pattern`/`enum` da spec.

## Controller — NestJS (não FastAPI)

```ts
// src/modules/curriculum/curriculum.controller.ts
@ApiTags('curriculum')
@Controller('learners/:learnerId/next')   // prefixo global /api/v1 vem do configureApp
export class CurriculumController {
  constructor(private readonly curriculum: CurriculumService) {}

  @Get()
  @ApiParam({ name: 'learnerId', format: 'uuid' })
  @ApiOkResponse({ description: 'Próxima atividade com racional' })
  @ApiNotFoundResponse({ description: 'Learner não encontrado' })
  async getNextActivity(
    @Param('learnerId', ParseUUIDPipe) learnerId: string,
    @Query() query: NextActivityQueryDto,
  ): Promise<NextActivityResponseDto> {
    return this.curriculum.getNextActivity(learnerId, query.time_budget_minutes);
  }
}
```

- Injeção via construtor + providers do módulo (ver `clean-architecture`); nunca `new Service()` no controller.
- Controller valida e delega — regra de negócio fica no `domain/services` (ex.: `next-activity-selector.ts`).

## Padrões da casa (não reinventar)

- **Prefixo/versionamento**: `/api/v1` global em `app.setup.ts` (CONSTITUTION §4.4) — não hardcode versão no `@Controller`.
- **Erros**: RFC 7807 (Problem Details) pelo exception filter global (`common/filters`, CONSTITUTION §4.3) — `throw new NotFoundException()` e o formato sai certo; não monte `{ error: ... }` à mão.
- **Correlation ID**: propagado pelo `configureApp` (§4.6) — não crie middleware novo.
- **Rate limiting**: plugin Kong (config declarativa; `npm run kong:check`), não no código do Nest.
- **Auth**: guards + token verifiers existentes (`nestjs-its`) — reutilize.

## Validation Checklist

- [ ] Spec OpenAPI atualizada no mesmo PR, com exemplos de request/response
- [ ] DTOs com class-validator, sem `any`, sem lógica de negócio
- [ ] Status codes corretos (404 NotFound, 409 Conflict, 422/400 Validation)
- [ ] Erros no formato RFC 7807 (filtro global)
- [ ] Correlation-ID propagada (grátis via configureApp)
- [ ] `npm run contract:gate` verde
- [ ] Rota refletida no Swagger (`@ApiTags`/`@Api*` decorators)
