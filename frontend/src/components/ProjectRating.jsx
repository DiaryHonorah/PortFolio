import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import { getProjectRating, rateProject } from '../services/ratingService';

const ProjectRating = ({ projectId, compact = false }) => {
    const [rating, setRating] = useState({
        average: 0,
        total: 0,
        user_rating: false
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchRating();
    }, [projectId]);

    const fetchRating = async () => {
        try {
            setLoading(true);
            const data = await getProjectRating(projectId);
            setRating(data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async (e, value) => {
        // Empêcher la propagation
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        setSubmitting(true);
        setMessage(null);
        
        try {
            const result = await rateProject(projectId, value, comment);
            
            if (result.success) {
                setRating({
                    average: result.average,
                    total: result.total,
                    user_rating: value
                });
                setMessage({
                    type: 'success',
                    text: result.action === 'created' 
                        ? '✅ Merci !' 
                        : '✅ Note mise à jour !'
                });
                setShowComment(false);
                setComment('');
                
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({
                    type: 'error',
                    text: '❌ ' + (result.error || 'Erreur')
                });
            }
        } catch (error) {
            console.error('Erreur:', error);
            setMessage({
                type: 'error',
                text: '❌ Erreur de connexion'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ============================================
    // VERSION COMPACTE (pour les cartes)
    // ============================================
    if (compact) {
        return (
            <div 
                className="space-y-2"
                onClick={(e) => e.preventDefault()}
            >
                <div className="flex items-center justify-between gap-2">
                    {/* Étoiles cliquables */}
                    <RatingStars 
                        rating={rating.user_rating || 0} 
                        onRate={(value) => handleRate(null, value)} 
                        size="text-lg"
                    />
                    
                    {/* Note moyenne */}
                    <div className="flex items-center gap-1 text-xs">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-300 font-semibold">
                            {rating.average > 0 ? rating.average.toFixed(1) : '0'}
                        </span>
                        <span className="text-gray-500">
                            ({rating.total})
                        </span>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`text-center text-xs p-1.5 rounded ${
                        message.type === 'success' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Bouton commentaire */}
                {rating.user_rating && !showComment && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowComment(true);
                        }}
                        className="text-secondary hover:text-cyan-300 text-xs transition"
                    >
                        💬 Ajouter un commentaire
                    </button>
                )}

                {/* Champ commentaire */}
                {showComment && (
                    <div className="space-y-2 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Votre commentaire..."
                            rows="2"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-secondary transition resize-none"
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleRate(null, rating.user_rating)}
                                disabled={submitting}
                                className="flex-1 bg-primary hover:bg-blue-700 disabled:opacity-50 px-2 py-1 rounded text-xs font-semibold transition text-white"
                            >
                                {submitting ? '⏳' : '💾 Envoyer'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowComment(false);
                                    setComment('');
                                }}
                                className="glass px-2 py-1 rounded text-xs text-gray-300 hover:bg-white/10 transition"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ============================================
    // VERSION COMPLÈTE
    // ============================================
    return (
        <div className="glass p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-gray-300 text-sm font-semibold">
                    ⭐ Notez ce projet
                </h4>
                <span className="text-gray-400 text-xs">
                    {rating.total} vote{rating.total > 1 ? 's' : ''}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">
                        {rating.average > 0 ? rating.average.toFixed(1) : '0.0'}
                    </p>
                    <RatingStars 
                        rating={Math.round(rating.average)} 
                        readonly 
                        size="text-sm"
                    />
                </div>

                <div className="flex-1">
                    <p className="text-gray-400 text-xs mb-2">
                        {rating.user_rating 
                            ? `Votre note : ${rating.user_rating}/5` 
                            : 'Cliquez pour noter :'}
                    </p>
                    <RatingStars 
                        rating={rating.user_rating || 0} 
                        onRate={(value) => handleRate(null, value)} 
                        size="text-2xl"
                    />
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`text-center text-xs p-2 rounded-lg ${
                    message.type === 'success' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                }`}>
                    {message.text}
                </div>
            )}

            {/* Bouton commentaire */}
            {rating.user_rating && !showComment && (
                <button
                    type="button"
                    onClick={() => setShowComment(true)}
                    className="text-secondary hover:text-cyan-300 text-xs transition"
                >
                    💬 Ajouter un commentaire
                </button>
            )}

            {/* Champ commentaire */}
            {showComment && (
                <div className="space-y-2 animate-fadeIn">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Votre commentaire (optionnel)..."
                        rows="3"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-secondary transition resize-none"
                    />
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleRate(null, rating.user_rating)}
                            disabled={submitting}
                            className="flex-1 bg-primary hover:bg-blue-700 disabled:opacity-50 px-3 py-2 rounded-lg text-xs font-semibold transition text-white"
                        >
                            {submitting ? '⏳ Envoi...' : '💾 Envoyer'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowComment(false);
                                setComment('');
                            }}
                            className="glass px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/10 transition"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectRating;