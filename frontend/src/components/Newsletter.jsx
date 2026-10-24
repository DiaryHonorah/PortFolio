import React, { useState } from 'react';
import { subscribeNewsletter } from '../services/newsletterService';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        message: null
    });
    const [confirmationLink, setConfirmationLink] = useState(null);

    // Validation email
    const validateEmail = (value) => {
        if (!value || value.trim().length === 0) return 'L\'email est requis';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Email invalide';
        if (value.trim().length > 100) return 'Maximum 100 caractères';
        return '';
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (touched) {
            setError(validateEmail(value));
        }
    };

    const handleFocus = () => setTouched(true);

    const handleBlur = () => {
        setTouched(true);
        setError(validateEmail(email));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(true);

        const validationError = validateEmail(email);
        if (validationError) {
            setError(validationError);
            return;
        }

        setStatus({ loading: true, success: false, message: null });
        setConfirmationLink(null);

        try {
            const result = await subscribeNewsletter(email, name);
            
            if (result.success) {
                setStatus({
                    loading: false,
                    success: true,
                    message: result.message || 'Un email de confirmation vous a été envoyé.'
                });
                
                // Afficher le lien de confirmation en développement
                if (result.confirm_link) {
                    setConfirmationLink(result.confirm_link);
                }
                
                // Réinitialiser le formulaire après 3 secondes
                setTimeout(() => {
                    setEmail('');
                    setName('');
                    setTouched(false);
                    setStatus({ loading: false, success: false, message: null });
                    setConfirmationLink(null);
                }, 10000);
            } else {
                setStatus({
                    loading: false,
                    success: false,
                    message: result.error || 'Erreur lors de l\'inscription'
                });
            }
        } catch (error) {
            console.error('Erreur:', error);
            setStatus({
                loading: false,
                success: false,
                message: 'Erreur de connexion au serveur'
            });
        }
    };

    return (
        <div className="glass p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white text-center mb-2">📧 Newsletter</h3>
            <p className="text-gray-400 text-center text-sm mb-6">
                Recevez mes actualités et nouveaux projets
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom (optionnel) */}
                <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-1">
                        Nom (optionnel)
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition"
                        placeholder="Votre nom"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-1">
                        Email <span className="text-secondary">*</span>
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition ${
                            error && touched
                                ? 'border-red-500 focus:border-red-500'
                                : touched && !error && email
                                ? 'border-green-500 focus:border-green-500'
                                : 'border-white/10 focus:border-secondary'
                        }`}
                        placeholder="votre@email.com"
                        required
                    />
                    
                    {touched && error && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <span>⚠️</span> {error}
                        </p>
                    )}
                    {touched && !error && email && (
                        <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                            <span>✅</span> Email valide
                        </p>
                    )}
                </div>

                {/* Bouton */}
                <button
                    type="submit"
                    disabled={status.loading || !!error}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition text-white ${
                        status.loading || error
                            ? 'bg-blue-900 cursor-not-allowed opacity-70'
                            : 'bg-primary hover:bg-blue-700'
                    }`}
                >
                    {status.loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Inscription...
                        </span>
                    ) : (
                        "S'inscrire"
                    )}
                </button>

                {/* Message de succès */}
                {status.success && (
                    <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-lg animate-fadeIn">
                        <p className="font-semibold mb-1">✅ Inscription enregistrée !</p>
                        <p className="text-sm">{status.message}</p>
                        
                        {/* Lien de confirmation (développement uniquement) */}
                        {confirmationLink && (
                            <div className="mt-3 pt-3 border-t border-green-500/30">
                                <p className="text-xs text-yellow-400 mb-2">
                                    ⚠️ Mode développement - Cliquez pour confirmer :
                                </p>
                                <a 
                                    href={confirmationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-secondary hover:text-cyan-300 underline break-all"
                                >
                                    {confirmationLink}
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* Message d'erreur */}
                {status.message && !status.success && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-center text-sm animate-fadeIn">
                        ❌ {status.message}
                    </div>
                )}
            </form>

            {/* Indicateur de sécurité */}
            <p className="text-gray-500 text-xs text-center mt-4">
                🔒 Votre email est sécurisé. Aucun spam.
            </p>
            <p className="text-gray-600 text-xs text-center mt-1">
                📩 Confirmation par email requise
            </p>
        </div>
    );
};

export default Newsletter;