---
name: openapi-typescript
description: Use ao gerar ou atualizar tipos TypeScript do contrato OpenAPI (its-platform/docs/api-spec.openapi.yaml) para frontend e clientes.
---

# OpenAPI → TypeScript — Contrato Gerado

## Regra de ouro

- A spec `its-platform/docs/api-spec.openapi.yaml` é a **única fonte de verdade** dos contratos.
- Tipos gerados **nunca** são editados à mão — a próxima geração apaga a edição.
- Antes de mudar a spec: skill `openapi-spec` (validação, spectral) e `contract-testing` (conformidade).

## Geração

```bash
# no frontend (quando existir) ou em shared gerado:
npx openapi-typescript its-platform/docs/api-spec.openapi.yaml \
  -o its-platform/frontend/src/infrastructure/api/api-types.ts
```

- Commitar o arquivo gerado (build offline/CI determinístico) **ou** gerar no CI com diff gate — escolher uma das duas e padronizar.
- Sempre que a spec mudar, regenerar no mesmo PR da mudança de spec.

## Consumo

- Preferir `openapi-fetch` (cliente leve tipado contra os `paths` gerados):

```ts
import createClient from 'openapi-fetch';
import type { paths } from './api-types';

const api = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
const { data, error } = await api.GET('/api/v1/lessons/{lesson_id}', {
  params: { path: { lesson_id } },
});
```

- No backend NestJS os tipos gerados servem de **checagem espelhada**: schemas class-validator devem bater com a spec (o `contract:gate` já falha se divergirem).
- Frontend: mapear `data` para domínio (`core/entities`) em `infrastructure/api/` — não vazar tipos gerados para `presentation`.

## Erros comuns

- Editar `api-types.ts` à mão → perde tudo no próximo `openapi-typescript`.
- Tipar resposta como `any`/`unknown` sem validar → o cliente quebra em runtime sem sinal no compile; para dados externos, Zod no boundary (frontend).
- Esquecer de regenerar após mudar spec → `contract:gate` falha no CI (bom: é o gate existindo); rodar a geração localmente evita o ciclo.
- Duplicar tipos DTO escritos à mão em vez de importar do gerado → divergência silenciosa entre frontend e backend.
