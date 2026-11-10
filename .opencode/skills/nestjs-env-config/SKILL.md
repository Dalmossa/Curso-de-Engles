---
name: nestjs-env-config
description: Use ao configurar, tipar, validar ou depurar variáveis de ambiente (.env) em projetos NestJS com TypeScript.
---

# NestJS: variáveis de ambiente

## Segurança (regra principal)
- Nunca leia, imprima ou copie valores do `.env`. Leia `.env.example` e liste só os nomes das chaves.
- Se precisar do `.env` real, peça ao usuário e ajuste `permission` no `opencode.json`. A skill não concede acesso.
- Confirme que `.env` está no `.gitignore` e que `.env.example` está versionado.

## Passos
1. Detecte o gerenciador pelo lockfile (npm, pnpm ou yarn) e verifique se `@nestjs/config` está no `package.json`. Se faltar, instale com ele.
2. Importe o `ConfigModule` globalmente no `AppModule`:
```typescript
ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
  }),
})
```
   Use `envFilePath` só para múltiplos arquivos (ex.: `.env.${process.env.NODE_ENV}`).
3. Acesse via `ConfigService` injetado, nunca `process.env` nos serviços:
```typescript
const port = this.config.get<number>('PORT', 3000);
const url = this.config.getOrThrow<string>('DATABASE_URL');
```
4. No `main.ts`, use `app.get(ConfigService)` em vez de `process.env.PORT`.
5. Para config agrupada e tipada, use `registerAs('db', () => ({...}))` e injete com `ConfigType<typeof dbConfig>`.

## Módulos que dependem de config (TypeORM, JWT, etc.)
`process.env` dentro de decorators é lido antes do carregamento e vira `undefined`. Use a forma assíncrona:
```typescript
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (c: ConfigService) => ({
    url: c.getOrThrow<string>('DATABASE_URL'),
  }),
})
```

## Fora do container do Nest
CLI de migrations, seeds e scripts podem usar `dotenv` diretamente (`import 'dotenv/config'`). Dentro de módulos Nest, use `@nestjs/config`.

## Troubleshooting
- Variável `undefined`: confira o diretório de execução (cwd), pois o `.env` deve estar na raiz, junto do `package.json`.
- Em produção, o `.env` não é copiado para `dist`. Passe as variáveis pelo ambiente.
- Variáveis do sistema sobrescrevem o `.env`.
- Valores com `#` ou espaços devem ficar entre aspas.
- Prefira `CHAVE=valor`, sem espaços ao redor do `=`. Isso quebra em `docker --env-file` e `source .env`.
- Erro de validação na subida: o Joi mostra qual chave falhou. Corrija o `.env` ou o schema.