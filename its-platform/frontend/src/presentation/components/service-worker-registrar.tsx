'use client';

import { useEffect } from 'react';

/**
 * Registers `/sw.js`.
 *
 * Only in production. A service worker in development caches assets the dev server is
 * actively rewriting, which produces "my change did not appear" bugs that cost more than
 * the feature is worth; and the offline shell is not what a developer is testing.
 *
 * Failures are swallowed deliberately: an unavailable service worker means the app does not
 * install as a PWA, which is a degraded experience and not a broken page.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const register = () => {
      void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Ignored on purpose — see above.
      });
    };

    // Registering after `load` keeps the worker's install off the critical path.
    if (document.readyState === 'complete') {
      register();
      return;
    }
    window.addEventListener('load', register, { once: true });
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
