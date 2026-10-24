import React, { useState, useEffect } from 'react';
import { getSubscribers, getSubscribersCount, deleteSubscriber } from '../../services/newsletterService';

const NewsletterList = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [count, setCount] = useState({ total: 0, confirmed: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subs, cnt] = await Promise.all([
                getSubscribers(),
                getSubscribersCount()
            ]);
            setSubscribers(Array.isArray(subs) ? subs : []);
            setCount(cnt);
            setLoading(false);
        } catch (error) {
            console.error('Erreur:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet abonné ?')) {
            const result = await deleteSubscriber(id);
            if (result.success) {
                await fetchData();
            }
        }
    };

    const filteredSubscribers = subscribers.filter(sub => {
        if (filter === 'confirmed') return sub.confirmed;
        if (filter === 'pending') return !sub.confirmed;
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
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-bold text-white">
                    📧 Abonnés Newsletter ({count.total})
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
                        onClick={() => setFilter('confirmed')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                            filter === 'confirmed' ? 'bg-green-500/50 text-white' : 'glass text-gray-300'
                        }`}
                    >
                        ✅ Confirmés ({count.confirmed})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                            filter === 'pending' ? 'bg-yellow-500/50 text-white' : 'glass text-gray-300'
                        }`}
                    >
                        ⏳ En attente ({count.total - count.confirmed})
                    </button>
                </div>
            </div>

            {filteredSubscribers.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-4xl mb-2">📭</p>
                    <p className="text-gray-400">Aucun abonné</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 border-b border-white/10">
                                <th className="pb-3 pr-2">Email</th>
                                <th className="pb-3 pr-2 hidden md:table-cell">Nom</th>
                                <th className="pb-3 pr-2">Statut</th>
                                <th className="pb-3 pr-2 hidden sm:table-cell">Date</th>
                                <th className="pb-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubscribers.map((sub) => (
                                <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="py-3 pr-2 text-white truncate max-w-[200px]">
                                        {sub.email}
                                    </td>
                                    <td className="py-3 pr-2 text-gray-300 hidden md:table-cell">
                                        {sub.name || '-'}
                                    </td>
                                    <td className="py-3 pr-2">
                                        {sub.confirmed ? (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                                                ✅ Confirmé
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">
                                                ⏳ En attente
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 pr-2 text-gray-400 text-xs hidden sm:table-cell">
                                        {new Date(sub.created_at).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="py-3 text-right">
                                        <button
                                            onClick={() => handleDelete(sub.id)}
                                            className="text-red-400 hover:text-red-300 transition"
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NewsletterList;