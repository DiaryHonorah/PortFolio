import React, { useState, useEffect, useCallback } from 'react';
import { getProjectComments, createComment } from '../services/commentService';

const CommentSection = ({ projectId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null
    });

    // ✅ Utiliser useCallback pour la fonction de chargement
    const fetchComments = useCallback(async () => {
        if (!projectId) return;
        
        try {
            setLoading(true);
            const data = await getProjectComments(projectId);
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    // ✅ Recharger à chaque montage
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

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
        if (value.trim().length < 5) return 'Minimum 5 caractères';
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

        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const messageError = validateMessage(formData.message);

        setErrors({
            name: nameError,
            email: emailError,
            message: messageError
        });
        setTouched({ name: true, email: true, message: true });

        if (nameError || emailError || messageError) return;

        setStatus({ loading: true, success: false, error: null });

        try {
            const result = await createComment({
                project_id: projectId,
                ...formData
            });

            if (result.success) {
                setStatus({ loading: false, success: true, error: null });
                setFormData({ name: '', email: '', message: '' });
                setTouched({});
                setErrors({});

                // ✅ Recharger les commentaires après envoi
                await fetchComments();

                setTimeout(() => {
                    setStatus(prev => ({ ...prev, success: false }));
                    setShowForm(false);
                }, 5000);
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
                error: 'Erreur de connexion'
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;
        
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-4">
            {/* En-tête */}
            <div className="flex justify-between items-center flex-wrap gap-2">
                <h4 className="text-white font-semibold flex items-center gap-2">
                    💬 Commentaires ({comments.length})
                    <button
                        onClick={fetchComments}
                        className="text-gray-400 hover:text-secondary transition text-sm"
                        title="Rafraîchir"
                        disabled={loading}
                    >
                        {loading ? '⏳' : '🔄'}
                    </button>
                </h4>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="text-secondary hover:text-cyan-300 text-sm transition"
                >
                    {showForm ? '✕ Annuler' : '➕ Ajouter un commentaire'}
                </button>
            </div>

            {/* Formulaire */}
            {showForm && (
                <form onSubmit={handleSubmit} className="glass p-4 rounded-xl space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="Votre nom *"
                                className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none transition ${
                                    errors.name && touched.name
                                        ? 'border-red-500'
                                        : touched.name && !errors.name && formData.name
                                        ? 'border-green-500'
                                        : 'border-white/10 focus:border-secondary'
                                }`}
                            />
                            {touched.name && errors.name && (
                                <p className="text-red-400 text-xs mt-1">⚠️ {errors.name}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="Votre email *"
                                className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none transition ${
                                    errors.email && touched.email
                                        ? 'border-red-500'
                                        : touched.email && !errors.email && formData.email
                                        ? 'border-green-500'
                                        : 'border-white/10 focus:border-secondary'
                                }`}
                            />
                            {touched.email && errors.email && (
                                <p className="text-red-400 text-xs mt-1">⚠️ {errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder="Votre commentaire *"
                            rows="3"
                            className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none transition resize-none ${
                                errors.message && touched.message
                                    ? 'border-red-500'
                                    : touched.message && !errors.message && formData.message
                                    ? 'border-green-500'
                                    : 'border-white/10 focus:border-secondary'
                            }`}
                        />
                        {touched.message && errors.message && (
                            <p className="text-red-400 text-xs mt-1">⚠️ {errors.message}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                            {formData.message.length}/500 caractères
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={status.loading}
                        className={`w-full px-4 py-2 rounded-lg font-semibold transition text-white text-sm ${
                            status.loading
                                ? 'bg-blue-900 cursor-not-allowed'
                                : 'bg-primary hover:bg-blue-700'
                        }`}
                    >
                        {status.loading ? '⏳ Envoi...' : '📤 Envoyer le commentaire'}
                    </button>

                    {status.success && (
                        <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-2 rounded-lg text-center text-xs animate-fadeIn">
                            ✅ Merci ! Votre commentaire sera publié après validation.
                        </div>
                    )}

                    {status.error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-2 rounded-lg text-center text-xs animate-fadeIn">
                            ❌ {status.error}
                        </div>
                    )}
                </form>
            )}

            {/* Liste des commentaires */}
            {loading && comments.length === 0 ? (
                <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-white/10 rounded-lg">
                    <p className="text-3xl mb-2">💬</p>
                    <p className="text-gray-400 text-sm">Aucun commentaire approuvé</p>
                    <p className="text-gray-500 text-xs mt-1">
                        {showForm ? 'Soyez le premier à commenter !' : 'Ajoutez un commentaire'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div key={comment.id} className="glass p-3 rounded-xl border border-white/5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {comment.name.charAt(0).toUpperCase()}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-white font-semibold text-sm">{comment.name}</p>
                                        {comment.is_admin_reply ? (
                                            <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                                                👑 Admin
                                            </span>
                                        ) : null}
                                        <span className="text-gray-500 text-xs">
                                            {formatDate(comment.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm mt-1 break-words">
                                        {comment.message}
                                    </p>
                                </div>
                            </div>

                            {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-3 ml-12 space-y-2">
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="glass p-2 rounded-lg border border-primary/20 bg-primary/5">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-primary font-semibold text-xs">
                                                    {reply.name}
                                                </p>
                                                <span className="bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded-full">
                                                    👑 Admin
                                                </span>
                                                <span className="text-gray-500 text-xs">
                                                    {formatDate(reply.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-xs mt-1">
                                                {reply.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;