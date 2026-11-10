'use strict';

const CACHE_NAME = 'its-platform-v1';
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icon.svg',
];

const runtimeCacheNames = {
  lessonContent: 'lesson-content-v1',
  dialogueContent: 'dialogue-content-v1',
  dialogueAudio: 'dialogue-audio-v1',
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        }),
      ).then(() => self.clients.claim()),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Do not intercept cross-origin requests.
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first to keep content fresh.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  // --- Lesson content: stale-while-revalidate, cache first ---
  if (url.pathname.startsWith('/content/lessons/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (!response.ok) return response;
            const responseClone = response.clone();
            caches.open(runtimeCacheNames.lessonContent).then((cache) => {
              cache.keys().then((keys) => {
                if (keys.length >= 10) {
                  cache.delete(keys[0]);
                }
                cache.put(event.request, responseClone);
              });
            });
            return response;
          })
          .catch(() => undefined);
        return cached || fetchPromise;
      }),
    );
    return;
  }

  // --- Practice pack content: stale-while-revalidate, cache first ---
  if (url.pathname.startsWith('/content/packs/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (!response.ok) return response;
            const responseClone = response.clone();
            caches.open(runtimeCacheNames.lessonContent).then((cache) => {
              cache.keys().then((keys) => {
                if (keys.length >= 10) {
                  cache.delete(keys[0]);
                }
                cache.put(event.request, responseClone);
              });
            });
            return response;
          })
          .catch(() => undefined);
        return cached || fetchPromise;
      }),
    );
    return;
  }

  // --- Dialogue content: stale-while-revalidate, cache first ---
  if (url.pathname.startsWith('/content/listening/') && !url.pathname.endsWith('/audio')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (!response.ok) return response;
            const responseClone = response.clone();
            caches.open(runtimeCacheNames.dialogueContent).then((cache) => {
              cache.keys().then((keys) => {
                if (keys.length >= 10) {
                  cache.delete(keys[0]);
                }
                cache.put(event.request, responseClone);
              });
            });
            return response;
          })
          .catch(() => undefined);
        return cached || fetchPromise;
      }),
    );
    return;
  }

  // --- Dialogue audio metadata: cache first, fall back to network ---
  if (url.pathname.startsWith('/content/listening/') && url.pathname.endsWith('/audio')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (!response.ok) return response;
            const responseClone = response.clone();
            caches.open(runtimeCacheNames.dialogueAudio).then((cache) => {
              cache.keys().then((keys) => {
                if (keys.length >= 10) {
                  cache.delete(keys[0]);
                }
                cache.put(event.request, responseClone);
              });
            });
            return response;
          })
          .catch(() => undefined);
        return cached || fetchPromise;
      }),
    );
    return;
  }

  // --- Other same-origin GETs: stale-while-revalidate ---
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => undefined);

      return cachedResponse || fetchPromise;
    }),
  );
});