import { useState, useEffect, useCallback } from 'react';

const MessageList = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedMessage, setExpandedMessage] = useState(null);

    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch('http://localhost/portfolio/backend/messages');
            if (!response.ok) throw new Error('Erreur réseau');
            const data = await response.json();
            setMessages(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Erreur:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const fetchAttachments = async (messageId) => {
        try {
            const response = await fetch(`http://localhost/portfolio/backend/messages/${messageId}/attachments`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Erreur:', error);
            return [];
        }
    };

    const toggleExpand = async (messageId) => {
        if (expandedMessage === messageId) {
            setExpandedMessage(null);
            return;
        }
        
        const attachments = await fetchAttachments(messageId);
        setExpandedMessage({ id: messageId, attachments });
    };

    const handleStatusChange = async (id, status) => {
        try {
            const response = await fetch(`http://localhost/portfolio/backend/messages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                await fetchMessages();
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
            try {
                const response = await fetch(`http://localhost/portfolio/backend/messages/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    await fetchMessages();
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    };

    const getFileIcon = (type) => {
        if (!type) return '📎';
        if (type.startsWith('image/')) return '🖼️';
        if (type === 'application/pdf') return '📕';
        if (type.includes('word')) return '📘';
        if (type.includes('excel') || type.includes('spreadsheet')) return '📗';
        if (type === 'text/plain') return '📄';
        if (type.includes('zip')) return '📦';
        return '📎';
    };

    const formatSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 mt-2">Chargement des messages...</p>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-4xl mb-2">📭</p>
                <p className="text-gray-400">Aucun message</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-4">📬 Messages ({messages.length})</h2>
            <div className="space-y-3">
                {messages.map((msg) => (
                    <div key={msg.id} className={`glass p-4 rounded-xl ${
                        msg.status === 'unread' ? 'border-l-4 border-yellow-500' : ''
                    }`}>
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold text-white">{msg.name}</p>
                                    {msg.status === 'unread' && (
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500 text-black animate-pulse">
                                            NOUVEAU
                                        </span>
                                    )}
                                    {msg.has_attachments ? (
                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                                            📎 Pièces jointes
                                        </span>
                                    ) : null}
                                </div>
                                <p className="text-gray-400 text-sm">{msg.email}</p>
                                {msg.subject && (
                                    <p className="text-gray-300 text-sm mt-1">📌 {msg.subject}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    msg.status === 'unread' 
                                        ? 'bg-yellow-500/20 text-yellow-400' 
                                        : 'bg-green-500/20 text-green-400'
                                }`}>
                                    {msg.status === 'unread' ? '📩 Non lu' : '📖 Lu'}
                                </span>
                                <button
                                    onClick={() => handleStatusChange(msg.id, msg.status === 'unread' ? 'read' : 'unread')}
                                    className="text-secondary hover:text-cyan-300 text-sm"
                                >
                                    {msg.status === 'unread' ? '✅' : '↩️'}
                                </button>
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mt-2 border-t border-white/5 pt-2">
                            {msg.message}
                        </p>
                        
                        <p className="text-gray-500 text-xs mt-1">
                            {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>

                        {/* Bouton pour afficher les pièces jointes */}
                        {msg.has_attachments ? (
                            <button
                                onClick={() => toggleExpand(msg.id)}
                                className="mt-2 text-secondary hover:text-cyan-300 text-sm flex items-center gap-1"
                            >
                                {expandedMessage?.id === msg.id ? '▲ Masquer les pièces jointes' : '▼ Voir les pièces jointes'}
                            </button>
                        ) : null}

                        {/* Liste des pièces jointes */}
                        {expandedMessage?.id === msg.id && expandedMessage.attachments?.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                                <p className="text-gray-400 text-xs font-semibold">
                                    📎 {expandedMessage.attachments.length} pièce(s) jointe(s)
                                </p>
                                {expandedMessage.attachments.map((att) => (
                                    <div key={att.id} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                                        <span className="text-2xl">{getFileIcon(att.file_type)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm truncate">{att.file_name}</p>
                                            <p className="text-gray-500 text-xs">{formatSize(att.file_size)}</p>
                                        </div>
                                        <a
                                            href={`http://localhost/portfolio/backend/${att.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-secondary hover:text-cyan-300 text-sm px-2 py-1 rounded hover:bg-white/5 transition"
                                            download
                                        >
                                            ⬇️
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageList;