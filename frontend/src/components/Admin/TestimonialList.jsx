import React, { useState, useEffect } from 'react';
import { 
    getAllTestimonials, 
    approveTestimonial, 
    rejectTestimonial, 
    deleteTestimonial,
    getTestimonialsCount 
} from '../../services/testimonialService';
import StarRating from '../StarRating';

const TestimonialList = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [count, setCount] = useState({ total: 0, approved: 0, pending: 0, average_rating: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [data, cnt] = await Promise.all([
                getAllTestimonials(),
                getTestimonialsCount()
            ]);
            setTestimonials(Array.isArray(data) ? data : []);
            setCount(cnt);
            setLoading(false);
        } catch (error) {
            console.error('Erreur:', error);
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        const result = await approveTestimonial(id);
        if (result.success) {
            await fetchData();
        }
    };

    const handleReject = async (id) => {
        const result = await rejectTestimonial(id);
        if (result.success) {
            await fetchData();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce témoignage ?')) {
            const result = await deleteTestimonial(id);
            if (result.success) {
                await fetchData();
            }
        }
    };

    const filteredTestimonials = testimonials.filter(t => {
        if (filter === 'approved') return t.approved;
        if (filter === 'pending') return !t.approved;
        return true;
    });

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 mt-2">Chargement...</p>
            </div>
        );
    }

    return (
        <div>
            {/* En-tête */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-bold text-white">
                    💬 Témoignages ({count.total})
                </h2>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                            filter === 'all' ? 'bg-primary text-white' : 'glass text-gray-300'
                        }`}
                    >
                        Tous ({count.total})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                            filter === 'approved' ? 'bg-green-500/50 text-white' : 'glass text-gray-300'
                        }`}
                    >
                        ✅ Approuvés ({count.approved})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                            filter === 'pending' ? 'bg-yellow-500/50 text-white' : 'glass text-gray-300'
                        }`}
                    >
                        ⏳ En attente ({count.pending})
                    </button>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="glass p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-primary">{count.total}</p>
                    <p className="text-gray-400 text-sm">Total</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-400">{count.approved}</p>
                    <p className="text-gray-400 text-sm">Approuvés</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-yellow-400">
                        {count.average_rating > 0 ? count.average_rating : '-'}
                    </p>
                    <p className="text-gray-400 text-sm">Note moyenne</p>
                </div>
            </div>

            {/* Liste des témoignages */}
            {filteredTestimonials.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-4xl mb-2">💬</p>
                    <p className="text-gray-400">Aucun témoignage</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTestimonials.map((testimonial) => (
                        <div 
                            key={testimonial.id} 
                            className={`glass p-4 rounded-xl ${
                                !testimonial.approved ? 'border-l-4 border-yellow-500' : 'border-l-4 border-green-500'
                            }`}
                        >
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold text-white">{testimonial.name}</p>
                                        {!testimonial.approved && (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500 text-black">
                                                ⏳ EN ATTENTE
                                            </span>
                                        )}
                                        {testimonial.approved && (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                                                ✅ Approuvé
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm">{testimonial.email}</p>
                                    {testimonial.role && (
                                        <p className="text-gray-300 text-sm mt-1">👤 {testimonial.role}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <StarRating rating={testimonial.rating} readonly size="text-lg" />
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm mt-2 border-t border-white/5 pt-2">
                                {testimonial.message}
                            </p>

                            <p className="text-gray-500 text-xs mt-1">
                                📅 {new Date(testimonial.created_at).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                                {!testimonial.approved ? (
                                    <button
                                        onClick={() => handleApprove(testimonial.id)}
                                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded-lg text-xs font-semibold transition"
                                    >
                                        ✅ Approuver
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleReject(testimonial.id)}
                                        className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-3 py-1 rounded-lg text-xs font-semibold transition"
                                    >
                                        ⏳ Désapprouver
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(testimonial.id)}
                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-lg text-xs font-semibold transition"
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestimonialList;