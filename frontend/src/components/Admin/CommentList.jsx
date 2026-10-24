import React, { useState, useEffect } from 'react';
import { 
    getAllComments, 
    approveComment, 
    rejectComment, 
    deleteComment,
    getCommentsCount 
} from '../../services/commentService';

const CommentList = () => {
    const [comments, setComments] = useState([]);
    const [count, setCount] = useState({ total: 0, approved: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [data, cnt] = await Promise.all([
                getAllComments(),
                getCommentsCount()
            ]);
            setComments(Array.isArray(data) ? data : []);
            setCount(cnt);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        const result = await approveComment(id);
        if (result.success) {
            await fetchData();
        }
    };

    const handleReject = async (id) => {
        const result = await rejectComment(id);
        if (result.success) {
            await fetchData();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce commentaire ?')) {
            const result = await deleteComment(id);
            if (result.success) {
                await fetchData();
            }
        }
    };

    const filteredComments = comments.filter(c => {
        if (filter === 'approved') return c.approved;
        if (filter === 'pending') return !c.approved;
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
                    💬 Commentaires ({count.total})
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

            {filteredComments.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-4xl mb-2">💬</p>
                    <p className="text-gray-400">Aucun commentaire</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredComments.map((comment) => (
                        <div 
                            key={comment.id} 
                            className={`glass p-4 rounded-xl ${
                                !comment.approved ? 'border-l-4 border-yellow-500' : 'border-l-4 border-green-500'
                            }`}
                        >
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold text-white">{comment.name}</p>
                                        {!comment.approved && (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500 text-black">
                                                ⏳ EN ATTENTE
                                            </span>
                                        )}
                                        {comment.is_admin_reply && (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                                                👑 Admin
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-xs">{comment.email}</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        📁 Projet ID: {comment.project_id}
                                        {comment.parent_id && ` • Réponse au commentaire #${comment.parent_id}`}
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm mt-2 border-t border-white/5 pt-2">
                                {comment.message}
                            </p>

                            <p className="text-gray-500 text-xs mt-1">
                                📅 {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>

                            <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                                {!comment.approved ? (
                                    <button
                                        onClick={() => handleApprove(comment.id)}
                                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded-lg text-xs font-semibold transition"
                                    >
                                        ✅ Approuver
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleReject(comment.id)}
                                        className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-3 py-1 rounded-lg text-xs font-semibold transition"
                                    >
                                        ⏳ Désapprouver
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(comment.id)}
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

export default CommentList;