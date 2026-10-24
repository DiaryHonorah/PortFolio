import React, { useState } from 'react';
import StarRating from './StarRating';
import { createTestimonial } from '../services/testimonialService';

const TestimonialForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        message: '',
        rating: 5
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null
    });

    // Validation
    const validateName = (value) => {
        if (!value || value.trim().length === 0) return 'Le nom est requis';
        if (value.trim().length < 2) return 'Minimum 2 caractères';
        if (value.trim().length > 100) return 'Maximum 100 caractères';
        return '';
    };

    const validateEmail = (value) => {
        if (!value || value.trim().length === 0) return 'L\'email est requis';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Email invalide';
        return '';
    };

    const validateMessage = (value) => {
        if (!value || value.trim().length === 0) return 'Le message est requis';
        if (value.trim().length < 10) return 'Minimum 10 caractères';
        if (value.trim().length > 500) return 'Maximum 500 caractères';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (touched[name]) {
            let error = '';
            if (name === 'name') error = validateName(value);
            if (name === 'email') error = validateEmail(value);
            if (name === 'message') error = validateMessage(value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleFocus = (e) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        let error = '';
        if (name === 'name') error = validateName(value);
        if (name === 'email') error = validateEmail(value);
        if (name === 'message') error = validateMessage(value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Valider tous les champs
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const messageError = validateMessage(formData.message);

        setErrors({
            name: nameError,
            email: emailError,
            message: messageError
        });

        setTouched({ name: true, email: true, role: true, message: true });

        if (nameError || emailError || messageError) return;

        setStatus({ loading: true, success: false, error: null });

        try {
            const result = await createTestimonial(formData);
            
            if (result.success) {
                setStatus({ 
                    loading: false, 
                    success: true, 
                    error: null 
                });
                setFormData({ name: '', email: '', role: '', message: '', rating: 5 });
                setTouched({});
                setErrors({});

                setTimeout(() => {
                    setStatus(prev => ({ ...prev, success: false }));
                }, 8000);
            } else {
                setStatus({ 
                    loading: false, 
                    success: false, 
                    error: result.error || 'Erreur lors de l\'envoi' 
                });
            }
        } catch (error) {
            console.error('Erreur:', error);
            setStatus({ 
                loading: false, 
                success: false, 
                error: 'Erreur de connexion au serveur' 
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-2">
                ✍️ Laissez votre témoignage
            </h3>
            <p className="text-gray-400 text-center text-sm mb-4">
                Partagez votre expérience avec moi
            </p>

            {/* Nom */}
            <div>
                <label className="block text-gray-300 text-sm font-semibold mb-1">
                    Nom complet <span className="text-secondary">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none transition ${
                        errors.name && touched.name
                            ? 'border-red-500'
                            : touched.name && !errors.name && formData.name
                            ? 'border-green-500'
                            : 'border-white/10 focus:border-secondary'
                    }`}
                    placeholder="Votre nom"
                    required
                />
                {touched.name && errors.name && (
                    <p className="text-red-400 text-xs mt-1">⚠️ {errors.name}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-gray-300 text-sm font-semibold mb-1">
                    Email <span className="text-secondary">*</span>
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none transition ${
                        errors.email && touched.email
                            ? 'border-red-500'
                            : touched.email && !errors.email && formData.email
                            ? 'border-green-500'
                            : 'border-white/10 focus:border-secondary'
                    }`}
                    placeholder="votre@email.com"
                    required
                />
                {touched.email && errors.email && (
                    <p className="text-red-400 text-xs mt-1">⚠️ {errors.email}</p>
                )}
            </div>

            {/* Rôle / Fonction */}
            <div>
                <label className="block text-gray-300 text-sm font-semibold mb-1">
                    Rôle / Fonction (optionnel)
                </label>
                <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition"
                    placeholder="Ex: Enseignant, Collègue, Client..."
                />
            </div>

            {/* Note */}
            <div>
                <label className="block text-gray-300 text-sm font-semibold mb-1">
                    Votre note
                </label>
                <StarRating 
                    rating={formData.rating} 
                    onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                />
            </div>

            {/* Message */}
            <div>
                <label className="block text-gray-300 text-sm font-semibold mb-1">
                    Votre témoignage <span className="text-secondary">*</span>
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    rows="4"
                    className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none transition resize-none ${
                        errors.message && touched.message
                            ? 'border-red-500'
                            : touched.message && !errors.message && formData.message
                            ? 'border-green-500'
                            : 'border-white/10 focus:border-secondary'
                    }`}
                    placeholder="Partagez votre expérience..."
                    required
                />
                {touched.message && errors.message && (
                    <p className="text-red-400 text-xs mt-1">⚠️ {errors.message}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                    {formData.message.length}/500 caractères
                </p>
            </div>

            {/* Bouton */}
            <button
                type="submit"
                disabled={status.loading}
                className={`w-full px-6 py-3 rounded-full font-semibold transition text-white ${
                    status.loading
                        ? 'bg-blue-900 cursor-not-allowed'
                        : 'bg-primary hover:bg-blue-700'
                }`}
            >
                {status.loading ? '⏳ Envoi...' : '📤 Envoyer mon témoignage'}
            </button>

            {/* Messages de statut */}
            {status.success && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg text-center text-sm animate-fadeIn">
                    ✅ Merci ! Votre témoignage sera publié après validation.
                </div>
            )}

            {status.error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-center text-sm animate-fadeIn">
                    ❌ {status.error}
                </div>
            )}
        </form>
    );
};

export default TestimonialForm;