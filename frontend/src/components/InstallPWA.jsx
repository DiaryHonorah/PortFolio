import React, { useState, useEffect } from 'react';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Vérifier si déjà installé
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Écouter l'événement beforeinstallprompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
            
            // Afficher la bannière après 5 secondes
            setTimeout(() => {
                setShowBanner(true);
            }, 5000);
        };

        // Écouter l'installation
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
            setShowBanner(false);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('Installation:', outcome);
        
        if (outcome === 'accepted') {
            setIsInstalled(true);
        }
        
        setDeferredPrompt(null);
        setShowBanner(false);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        // Ne plus afficher pendant cette session
        sessionStorage.setItem('pwa-banner-dismissed', 'true');
    };

    // Ne pas afficher si déjà installé ou si l'utilisateur a fermé
    if (isInstalled || !isInstallable || !showBanner) {
        return null;
    }

    if (sessionStorage.getItem('pwa-banner-dismissed') === 'true') {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[9998] animate-slide-up">
            <div className="glass p-4 rounded-2xl border border-primary/30 shadow-2xl">
                <div className="flex items-start gap-3">
                    <div className="text-3xl">📱</div>
                    <div className="flex-1">
                        <h4 className="text-white font-bold text-sm mb-1">
                            Installer l'application
                        </h4>
                        <p className="text-gray-400 text-xs mb-3">
                            Accédez à mon portfolio plus rapidement depuis votre écran d'accueil.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="flex-1 bg-primary hover:bg-blue-700 px-3 py-2 rounded-lg text-white text-xs font-semibold transition"
                            >
                                📲 Installer
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="glass hover:bg-white/10 px-3 py-2 rounded-lg text-gray-400 text-xs transition"
                            >
                                Plus tard
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-400 hover:text-white transition text-lg"
                        aria-label="Fermer"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPWA;