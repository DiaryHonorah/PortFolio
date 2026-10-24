import React, { useEffect, useState } from 'react';
import { checkConfirmation } from '../services/newsletterService';

const NewsletterConfirmed = () => {
    const [status, setStatus] = useState({
        loading: true,
        success: false,
        message: ''
    });

    useEffect(() => {
        const confirmSubscription = async () => {
            try {
                // Récupérer le token depuis l'URL
                const hash = window.location.hash;
                const token = hash.replace('#newsletter-confirmed?token=', '');
                
                if (token) {
                    const result = await checkConfirmation(token);
                    setStatus({
                        loading: false,
                        success: result.success,
                        message: result.success 
                            ? 'Votre inscription à la newsletter est confirmée !'
                            : result.error || 'Erreur de confirmation'
                    });
                } else {
                    setStatus({
                        loading: false,
                        success: true,
                        message: 'Votre inscription à la newsletter est confirmée !'
                    });
                }
            } catch (error) {
                setStatus({
                    loading: false,
                    success: false,
                    message: 'Erreur de connexion'
                });
            }
        };
        confirmSubscription();
    }, []);

    if (status.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400 mt-4">Vérification en cours...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] px-4">
            <div className="glass p-8 rounded-2xl max-w-md w-full text-center border border-white/10">
                {status.success ? (
                    <>
                        <div className="text-6xl mb-4">✅</div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Inscription confirmée !
                        </h1>
                        <p className="text-gray-400 mb-6">{status.message}</p>
                        <a
                            href="/"
                            className="inline-block bg-primary hover:bg-blue-700 px-6 py-3 rounded-full font-semibold transition text-white"
                        >
                            🏠 Retour à l'accueil
                        </a>
                    </>
                ) : (
                    <>
                        <div className="text-6xl mb-4">❌</div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Erreur de confirmation
                        </h1>
                        <p className="text-gray-400 mb-6">{status.message}</p>
                        <a
                            href="/"
                            className="inline-block bg-primary hover:bg-blue-700 px-6 py-3 rounded-full font-semibold transition text-white"
                        >
                            🏠 Retour à l'accueil
                        </a>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsletterConfirmed;