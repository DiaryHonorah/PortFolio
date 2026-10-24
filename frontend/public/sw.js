// ============================================
// SERVICE WORKER - Portfolio PWA
// ============================================
// Version : 1.0.0

const CACHE_NAME = 'portfolio-cache-v1';
const RUNTIME_CACHE = 'portfolio-runtime-v1';

// Ressources à mettre en cache au démarrage
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/vite.svg'
];

// ============================================
// INSTALLATION
// ============================================
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installation...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Mise en cache des ressources initiales');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// ============================================
// ACTIVATION
// ============================================
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activation...');
    
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        console.log('[Service Worker] Suppression ancien cache:', cacheToDelete);
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// ============================================
// INTERCEPTION DES REQUÊTES
// ============================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requêtes non-GET
    if (request.method !== 'GET') {
        return;
    }

    // Ignorer les requêtes vers l'API (toujours en ligne)
    if (url.pathname.includes('/backend/')) {
        return;
    }

    // Ignorer les requêtes chrome-extension
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Stratégie : Cache First, puis Network
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Mettre à jour le cache en arrière-plan
                    fetch(request)
                        .then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                caches.open(RUNTIME_CACHE)
                                    .then((cache) => cache.put(request, networkResponse));
                            }
                        })
                        .catch(() => {});
                    
                    return cachedResponse;
                }

                // Pas dans le cache, essayer le réseau
                return fetch(request)
                    .then((networkResponse) => {
                        // Ne pas mettre en cache les réponses non-200
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }

                        // Mettre en cache la nouvelle ressource
                        const responseToCache = networkResponse.clone();
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => cache.put(request, responseToCache));

                        return networkResponse;
                    })
                    .catch(() => {
                        // Si le réseau échoue et c'est une page HTML, retourner index.html
                        if (request.headers.get('accept')?.includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        
                        // Sinon, retourner une réponse d'erreur
                        return new Response('Contenu non disponible hors ligne', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// ============================================
// MESSAGES
// ============================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// ============================================
// NOTIFICATIONS PUSH (optionnel)
// ============================================
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nouvelle notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Portfolio Diary Honorah', options)
    );
});

// ============================================
// CLIC SUR NOTIFICATION
// ============================================
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});