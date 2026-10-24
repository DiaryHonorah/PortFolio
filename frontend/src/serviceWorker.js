// ============================================
// ENREGISTREMENT DU SERVICE WORKER
// ============================================

export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('✅ Service Worker enregistré:', registration.scope);

                    // Vérifier les mises à jour
                    registration.onupdatefound = () => {
                        const installingWorker = registration.installing;
                        if (installingWorker == null) return;

                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    console.log('🔄 Nouveau contenu disponible');
                                    // Optionnel : afficher un message à l'utilisateur
                                } else {
                                    console.log('📦 Contenu mis en cache');
                                }
                            }
                        };
                    };
                })
                .catch((error) => {
                    console.error('❌ Erreur Service Worker:', error);
                });
        });
    }
};

// ============================================
// DÉSENREGISTREMENT (pour développement)
// ============================================
export const unregisterServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
            })
            .catch((error) => {
                console.error('Erreur désenregistrement:', error);
            });
    }
};