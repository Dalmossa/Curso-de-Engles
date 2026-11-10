---
name: nextjs-env-config
description: Use ao configurar, validar ou depurar variáveis de ambiente (.env.local) em projetos Next.js.
---

# Next.js — Variáveis de Ambiente

## Segurança

- **Nunca leia nem imprima valores de `.env`, `.env.local` ou equivalentes.** Para depurar, liste apenas os **nomes** das chaves esperadas.
- Consulte apenas `.env.example` (nomes + placeholders) para documentar o que o projeto espera.
- Confirme que `.gitignore` cobre `.env*` (`.env`, `.env.local`, `.env.*.local`). O Next ignora `.env.local` por padrão, mas **não** ignora `.env` — registre no `.gitignore`.

## O que chega ao navegador

- Somente variáveis com prefixo `NEXT_PUBLIC_` são embutidas no bundle do cliente (em **build time**, substituição textual).
- Tudo sem o prefixo existe apenas no servidor: Server Components, Server Actions, Route Handlers.
- `NEXT_PUBLIC_*` nunca pode conter token, senha, URL interna sensível ou PII — é texto público para qualquer usuário.
- Dentro do código, prefira um módulo central (`env.ts`) a `process.env` espalhado.

## Validação com Zod em `env.ts`

- Valide todas as variáveis em um único arquivo e **falhe na inicialização** se algo faltar/for inválido.

```ts
// src/env.ts (server-only — nunca importar de componente 'use client')
import { z } from 'zod';

const schema = z.object({
  // servidor (sem prefixo — indisponíveis no navegador)
  API_URL: z.string().url(),
  API_TOKEN: z.string().min(1),
  // público (com prefixo — embutidas no build)
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('ITS Platform'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1); // falha cedo: build/dev nunca sobe com config quebrada
}

export const env = parsed.data;
```

- Importe `env.ts` no `instrumentation.ts` (rodar na inicialização do servidor) para validar também em produção, não só no dev.
- Mantenha os schemas público/privado separados (ex.: `env.server.ts` / `env.client.ts`) para impedir import acidental de segredo em Client Component.
- Adicione sempre ao `.env.example` toda chave nova (nomes e placeholders).

## Troubleshooting

- **Mudou `.env.local` e nada refletiu**: reinicie o servidor (`npm run dev`) — o Next carrega os arquivos `.env*` uma vez, na inicialização.
- **Variável `undefined` no Client Component**: falta o prefixo `NEXT_PUBLIC_` (ou a chave está errada — lembre: leia os *nomes* no `.env.example`, nunca o valor).
- **Funciona no dev e quebra no build**: `NEXT_PUBLIC_*` é resolvida em **build time** — o valor embutido é o do ambiente da máquina de build; variáveis privadas no runtime dependem do ambiente do servidor/deploy.
- **Valor veio de outro lugar**: variáveis do **shell/CI/Docker sobrescrevem** os arquivos `.env*`; entre arquivos, o mais específico (`.env.local`, `.env.production.local`) vence o genérico (`.env`). Confira a origem com `echo "$NOME_DA_VARIAVEL"` sem expor valores sensíveis.
- **Diferença build time vs runtime**: `NEXT_PUBLIC_*` → resolvida no build (mudou = rebuild); privadas → lidas em runtime pelo servidor (mudou = restart). Nunca espere que uma variável privada apareça no navegador sem rebuild de uma pública.
