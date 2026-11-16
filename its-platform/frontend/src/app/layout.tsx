import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

import './globals.css';
import { QueryProvider } from '@/presentation/providers/query-provider';
import { ThemeProvider } from '@/presentation/providers/theme-provider';
import { AccountIdentityProvider } from '@/presentation/providers/account-identity-provider';
import { ServiceWorkerRegistrar } from '@/presentation/components/service-worker-registrar';
import { SiteHeader } from '@/presentation/components/site-header';
import { ThemeScript } from '@/presentation/components/theme-script';
import { APP_DESCRIPTION, APP_NAME } from '@/shared/constants';
import { SESSION_TOKEN_COOKIE } from '@/shared/auth-cookies';
import type { AccountIdentity } from '@/core';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

/**
 * A identidade da conta, lida no servidor.
 *
 * **Só quando há sessão.** O gatilho do perfil é uma promessa que a plataforma precisa
 * poder cumprir: um botão de conta para quem não entrou é um botão que abre um menu
 * vazio. E o `ITS_LEARNER_ID` do ambiente é um *fallback* de desenvolvimento — sem o
 * cookie de sessão, ele não é a identidade de ninguém.
 *
 * **Falhar aqui é uma decisão, não um acidente.** A API fora do ar não pode derrubar a
 * página inteira: o learner continua vendo a trilha, o progresso e o diagnóstico, e só o
 * menu da conta some. Por isso o erro é engolido aqui e vale `null` — "sem identidade" e
 * "não sei a identidade" produzem a mesma tela, e as duas são uma tela que funciona.
 */
async function readAccountIdentity(): Promise<AccountIdentity | null> {
  try {
    const jar = await cookies();
    if (jar.get(SESSION_TOKEN_COOKIE)?.value === undefined) return null;

    const { getServerContext } = await import('@/infrastructure/composition/server-container');
    const { useCases, learnerId } = await getServerContext();
    return await useCases.getAccountIdentity.execute(learnerId);
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const identity = await readAccountIdentity();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            {/*
              A identidade vive num contexto do cliente, semeado pelo servidor aqui em
              cima. O cabeçalho mora no layout raiz, e o layout raiz **não é redesenhado
              pelo cliente** quando uma Server Action muda os dados por trás dele — o
              nome novo chegava ao banco e o cabeçalho continuava com o nome antigo.
              O contexto é o que fecha essa distância: quem grava o nome publica a
              identidade nova, e o cabeçalho a desenha na hora.
            */}
            <AccountIdentityProvider initialIdentity={identity}>
              <div className="min-h-screen flex flex-col bg-surface-sunken text-ink-900">
                {/*
                  WCAG 2.4.1 (Bypass Blocks): the header is the same block on every route, so a
                  keyboard or switch user needs one tab stop that skips it. `focus:not-sr-only`
                  is what reveals the link only while it holds focus; without it the link would
                  be a permanent line of text above the header.
                */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
                >
                  Pular para o conteúdo
                </a>
                <SiteHeader />
                {/*
                  A single `main` for the app, and `tabIndex={-1}` so the skip link above can
                  actually move focus here — an anchor jump alone does not, in every browser.
                */}
                <main
                  id="main-content"
                  tabIndex={-1}
                  className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8"
                >
                  {children}
                </main>
              </div>
            </AccountIdentityProvider>
          </QueryProvider>
        </ThemeProvider>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
