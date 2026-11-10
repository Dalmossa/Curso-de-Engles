---
name: nextjs-data-fetching
description: Use ao buscar dados, mutar dados, criar Server Actions ou Route Handlers em projetos Next.js com App Router.
---

# Next.js — Data Fetching, Server Actions e Route Handlers

## Buscar dados em Server Components

- Busque com `async`/`await` direto no componente; Server Component aceita `async`.
- Não use `useEffect` + `fetch` para dados da página — gera waterfall, spinner manual e expõe o endpoint no cliente.
- Trate falha com `throw` (causa o `error.tsx` do segmento) ou `notFound()`.

```tsx
// app/(dashboard)/page.tsx — Server Component, sem 'use client'
export default async function DashboardPage() {
  const res = await fetch(`${process.env.API_URL}/learners/me/progress`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
  if (!res.ok) throw new Error('Falha ao carregar progresso');
  const progresso: ProgressoResponse = await res.json();
  return <MasteryChart progresso={progresso} />;
}
```

## Cache e revalidação

- **Antes de afirmar o comportamento de cache, rode `next --version`** — o default mudou entre majors:
  - Next ≤ 14: `fetch` é cacheado por padrão (`force-cache`).
  - Next 15+ (e 16): `fetch` **não** é cacheado por padrão; cache é opt-in.
- Opt-in por requisição: `fetch(url, { cache: 'force-cache' })` ou time-based `next: { revalidate: 60 }`.
- Opt-in por tag (invalidação on-demand): `next: { tags: ['lesson'] }` + `revalidateTag('lesson')`.
- `revalidatePath('/rota')` — revalida todas as páginas sob o caminho.
- Em Next 16 (Cache Components) o caminho moderno é `'use cache'` + `cacheLife`/`cacheTag` dentro da função assíncrona; use quando o projeto já tiver a flag habilitada, senão `revalidateTag`/`revalidatePath` continuam válidos.

```ts
export async function getLessons(tag: string) {
  return fetch(`${process.env.API_URL}/lessons`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
    next: { tags: ['lessons'], revalidate: 300 },
  }).then((r) => r.json());
}
```

## Server Actions (mutações da própria UI)

- Marque com `'use server'` — no topo do arquivo (`actions.ts`) ou na função inline.
- **Valide a entrada com Zod** antes de tocar no banco; nunca confie em `FormData` cru.
- Retorne resultado tipado (sucesso/erro) para o formulário consumir.
- Após mutation, revalide com `revalidatePath` ou `revalidateTag`.

```ts
// app/(lessons)/[lesson_id]/practice/actions.ts
'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';

const RespostaSchema = z.object({
  itemId: z.string().uuid(),
  resposta: z.string().min(1).max(500),
});

export async function submitPractice(prev: Estado, formData: FormData): Promise<Estado> {
  const parsed = RespostaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, erros: parsed.error.flatten().fieldErrors };

  const resultado = await api.post('/practice/answers', parsed.data);
  revalidateTag('progress');
  return { ok: true, acertou: resultado.correct, feedback: resultado.feedback };
}
```

Consumo em Client Component com `useActionState`:

```tsx
'use client';
import { useActionState } from 'react';
import { submitPractice } from './actions';

export function PracticeForm() {
  const [estado, formAction, pendente] = useActionState(submitPractice, estadoInicial);
  return <form action={formAction}>{/* campos + botão disabled={pendente} */}</form>;
}
```

## Route Handlers

- Use `app/api/**/route.ts` **apenas** para webhooks (ex.: confirmação de pagamento) e clientes externos (app móvel, integrações).
- Para a própria UI, prefira Server Actions — menos boilerplate, tipagem compartilhada, sem endpoint exposto.
- Exporte verbos nomeados: `GET`, `POST`, `PATCH`, `DELETE`.

```ts
// app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const payload = await req.text();
  if (!verificarAssinatura(payload, req.headers.get('stripe-signature')))
    return NextResponse.json({ erro: 'assinatura inválida' }, { status: 400 });
  await processarEvento(JSON.parse(payload));
  return NextResponse.json({ recebido: true });
}
```

## Erros comuns

- **`fetch` no cliente sem necessidade** (`useEffect` carregando dados da página): latência extra, waterfalls, endpoint exposto — mova para Server Component.
- **Dados sensíveis em Client Component**: resposta com token, e-mail ou PII passada como prop para `'use client'` vaza para o bundle; mantenha no servidor e passe só o renderizado.
- **Esquecer de revalidar após mutation**: UI mostra dados antigos por causa do cache (Router Cache ou Data Cache).
- **Server Action sem validação Zod**: `FormData` chega adulterado do cliente; toda a validação de servidor é obrigatória.
- **Route Handler para a própria UI**: desnecessário; prefira Server Action.
- **Assumir comportamento de cache sem checar a versão**: confirme com `next --version` antes de afirmar se `fetch` está cacheado ou não.
