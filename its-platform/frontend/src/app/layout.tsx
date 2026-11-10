import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/presentation/providers/query-provider';
import { ThemeProvider } from '@/presentation/providers/theme-provider';
import { ServiceWorkerRegistrar } from '@/presentation/components/service-worker-registrar';
import { SiteHeader } from '@/presentation/components/site-header';
import { ThemeScript } from '@/presentation/components/theme-script';
import { APP_DESCRIPTION, APP_NAME } from '@/shared/constants';

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

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <QueryProvider>
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
          </QueryProvider>
        </ThemeProvider>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
