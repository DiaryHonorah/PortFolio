import React, { useState } from 'react';
import FileUpload from './FileUpload';

const ContactEnhanced = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [attachments, setAttachments] = useState([]);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null
    });

    // ========== VALIDATION ==========
    const validateName = (value) => {
        if (!value || value.trim().length === 0) return 'Le nom est requis';
        if (value.trim().length < 2) return 'Minimum 2 caractères';
        if (value.trim().length > 50) return 'Maximum 50 caractères';
        if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) return 'Lettres uniquement';
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
        if (value.trim().length > 1000) return 'Maximum 1000 caractères';
        return '';
    };

    const validateAll = () => {
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const messageError = validateMessage(formData.message);

        setErrors({
            name: nameError,
            email: emailError,
            message: messageError
        });

        return !nameError && !emailError && !messageError;
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
        setTouched({ name: true, email: true, subject: true, message: true });

        if (!validateAll()) return;

        setStatus({ loading: true, success: false, error: null });

        try {
            const response = await fetch('http://localhost/portfolio/backend/messages-with-attachments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    attachments: attachments
                })
            });

            const data = await response.json();

            if (data.success) {
                setStatus({ loading: false, success: true, error: null });
                setFormData({ name: '', email: '', subject: '', message: '' });
                setAttachments([]);
                setTouched({});
                setErrors({});

                setTimeout(() => {
                    setStatus(prev => ({ ...prev, success: false }));
                }, 5000);
            } else {
                setStatus({ loading: false, success: false, error: data.error || 'Erreur envoi' });
            }
        } catch (error) {
            console.error('Erreur:', error);
            setStatus({ loading: false, success: false, error: 'Erreur de connexion' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Nom */}
            <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Nom complet <span className="text-secondary">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition ${
                        errors.name && touched.name
                            ? 'border-red-500 focus:border-red-500'
                            : touched.name && !errors.name && formData.name
                            ? 'border-green-500 focus:border-green-500'
                            : 'border-white/10 focus:border-secondary'
                    }`}
                    placeholder="Votre nom complet"
                />
                {touched.name && errors.name && (
                    <p className="text-red-400 text-xs mt-1">⚠️ {errors.name}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Email <span className="text-secondary">*</span>
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition ${
                        errors.email && touched.email
                            ? 'border-red-500 focus:border-red-500'
                            : touched.email && !errors.email && formData.email
                            ? 'border-green-500 focus:border-green-500'
                            : 'border-white/10 focus:border-secondary'
                    }`}
                    placeholder="votre@email.com"
                />
                {touched.email && errors.email && (
                    <p className="text-red-400 text-xs mt-1">⚠️ {errors.email}</p>
                )}
            </div>

            {/* Sujet */}
            <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Sujet
                </label>
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition"
                    placeholder="Sujet de votre message"
                />
            </div>

            {/* Message */}
            <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Message <span className="text-secondary">*</span>
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    rows="5"
                    className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition resize-none ${
                        errors.message && touched.message
                            ? 'border-red-500 focus:border-red-500'
                            : touched.message && !errors.message && formData.message
                            ? 'border-green-500 focus:border-green-500'
                            : 'border-white/10 focus:border-secondary'
                    }`}
                    placeholder="Votre message..."
                />
                {touched.message && errors.message && (
                    <p className="text-red-400 text-xs mt-1">⚠️ {errors.message}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                    {formData.message.length}/1000 caractères
                </p>
            </div>

            {/* Pièces jointes */}
            <FileUpload 
                onFilesChange={setAttachments}
                maxFiles={3}
                maxSize={5}
            />

            {/* Bouton d'envoi */}
            <button
                type="submit"
                disabled={status.loading}
                className={`w-full px-6 py-3 rounded-full font-semibold transition text-white ${
                    status.loading
                        ? 'bg-blue-900 cursor-not-allowed'
                        : 'bg-primary hover:bg-blue-700'
                }`}
            >
                {status.loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi...
                    </span>
                ) : (
                    '📤 Envoyer le message'
                )}
            </button>

            {/* Messages de statut */}
            {status.success && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-center animate-fadeIn">
                    ✅ Message envoyé avec succès !
                </div>
            )}
            {status.error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-center animate-fadeIn">
                    ❌ {status.error}
                </div>
            )}
        </form>
    );
};

export default ContactEnhanced;