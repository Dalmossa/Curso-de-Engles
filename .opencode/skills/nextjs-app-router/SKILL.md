---
name: nextjs-app-router
description: Use ao criar páginas, layouts, rotas ou componentes em projetos Next.js com App Router (pasta app/) e React.
---

# Next.js App Router — Páginas, Layouts e Componentes

## Regras

- Server Components são o padrão; não adicione `'use client'` por hábito.
- Use `'use client'` **somente** para: estado (`useState`), efeitos (`useEffect`), handlers de evento (`onClick`, `onChange`) ou APIs do navegador (`window`, `localStorage`).
- Coloque `'use client'` o mais baixo possível na árvore: só no componente que precisa, nunca na página inteira nem no `layout.tsx` raiz.
- Server Components não têm hooks nem `onClick`; isole a interatividade em um filho `'use client'` e passe dados via props.
- Mantenha a busca de dados no servidor (Server Component) e passe o resultado como props para Client Components.
- Segredos ficam só no servidor: variável sem prefixo `NEXT_PUBLIC_` nunca aparece no bundle do navegador.
- Prefixo `NEXT_PUBLIC_` é embutido no código do cliente em build time; nunca use para token, senha ou PII.

## Estrutura de arquivos (pasta `app/`)

- `app/layout.tsx` — root layout (obrigatório; `html`, `body`, providers globais).
- `app/page.tsx` — rota raiz `/`.
- `app/(dashboard)/page.tsx` — route group; agrupa rotas sem afetar a URL.
- `app/(lessons)/[lesson_id]/page.tsx` — rota dinâmica.
- `app/loading.tsx` — fallback de carregamento (Suspense automático do segmento).
- `app/error.tsx` — boundary de erro; **exige** `'use client'`.
- `app/not-found.tsx` — página 404.
- `app/api/<rota>/route.ts` — Route Handler (webhooks/externos apenas).

## Next 15+: `params` e `searchParams` são Promises

Em Next 15+ (e 16) os parâmetros chegam como `Promise` — sempre use `await`:

```tsx
// app/(lessons)/[lesson_id]/page.tsx
type PageProps = {
  params: Promise<{ lesson_id: string }>;
  searchParams: Promise<{ revisao?: string }>;
};

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { lesson_id } = await params;
  const { revisao } = await searchParams;
  const lesson = await getLesson(lesson_id);
  return <LessonView lesson={lesson} modo={revisao ? 'revisao' : 'normal'} />;
}
```

`params` também é Promise em `layout.tsx`:

```tsx
export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lesson_id: string }>;
}) {
  const { lesson_id } = await params;
  return <LessonNav lessonId={lesson_id}>{children}</LessonNav>;
}
```

## Componentes: servidor por padrão, cliente sob demanda

```tsx
// app/(lessons)/[lesson_id]/practice/practice-form.tsx
'use client'; // necessário: useState + onClick

import { useState } from 'react';

export function PracticeForm({ itemId }: { itemId: string }) {
  const [resposta, setResposta] = useState('');
  return (
    <form className="flex flex-col gap-2">
      <input value={resposta} onChange={(e) => setResposta(e.target.value)} />
      <button onClick={() => enviar(itemId, resposta)}>Enviar</button>
    </form>
  );
}
```

A página que o usa permanece Server Component — o `'use client'` fica no componente filho mais baixo:

```tsx
// app/(lessons)/[lesson_id]/practice/page.tsx  (sem 'use client')
import { PracticeForm } from './practice-form';

export default async function PracticePage({ params }: { params: Promise<{ lesson_id: string }> }) {
  const { lesson_id } = await params;
  const item = await getNextItem(lesson_id);
  return <PracticeForm itemId={item.id} />;
}
```

## Erros comuns

- **`X is not defined` / `useState is not a function`**: hook ou evento em Server Component — falta `'use client'` no topo do arquivo do componente.
- **`window is not defined` / `document is not defined`**: acesso a API de navegador no render do servidor — envolva em `'use client'` ou execute dentro de `useEffect`.
- **Erro de hidratação** ("Text content does not match", "Hydration failed"): HTML do servidor difere do cliente. Causas típicas: `new Date()`, `Math.random()`, `toLocaleString` sem fuso fixo, `typeof window` no JSX. Gere o valor dependente do cliente dentro de `useEffect`; use `suppressHydrationWarning` apenas para diffs intencionais.
- **`error.tsx` sem `'use client'`**: o boundary de erro é um Client Component por definição.
- **Ler `searchParams.x` sem `await`** em Next 15+: `searchParams` é Promise, a leitura vira `undefined`.
