import { useState } from 'react';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'info', message: 'Nouveau message reçu de Jean Dupont', date: '14:30', read: false },
        { id: 2, type: 'success', message: 'Projet "Gestion d\'église" créé avec succès', date: '13:15', read: false },
        { id: 3, type: 'warning', message: 'Base de données bientôt pleine (85%)', date: '10:00', read: true },
        { id: 4, type: 'info', message: 'Nouvelle compétence ajoutée: TypeScript', date: '09:30', read: true },
        { id: 5, type: 'success', message: 'Sauvegarde automatique effectuée', date: '08:00', read: true }
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const typeColors = {
        info: 'border-blue-500 bg-blue-500/10',
        success: 'border-green-500 bg-green-500/10',
        warning: 'border-yellow-500 bg-yellow-500/10',
        error: 'border-red-500 bg-red-500/10'
    };

    const typeIcons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">🔔 Notifications</h3>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {unreadCount} non lu(s)
                        </span>
                    )}
                    <button
                        onClick={markAllAsRead}
                        className="text-secondary hover:text-cyan-300 text-sm transition"
                    >
                        Tout marquer comme lu
                    </button>
                </div>
            </div>

            {notifications.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {notifications.map((notif) => (
                        <div 
                            key={notif.id} 
                            className={`glass p-3 rounded-lg border-l-4 ${typeColors[notif.type]} flex justify-between items-center hover:bg-white/5 transition ${
                                !notif.read ? 'opacity-100' : 'opacity-70'
                            }`}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="text-xl">{typeIcons[notif.type]}</span>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm truncate ${!notif.read ? 'text-white font-medium' : 'text-gray-300'}`}>
                                        {notif.message}
                                    </p>
                                    <span className="text-gray-500 text-xs">🕐 {notif.date}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                {!notif.read && (
                                    <button 
                                        onClick={() => markAsRead(notif.id)}
                                        className="text-secondary hover:text-cyan-300 text-sm transition"
                                        title="Marquer comme lu"
                                    >
                                        ✅
                                    </button>
                                )}
                                <button 
                                    onClick={() => deleteNotification(notif.id)}
                                    className="text-red-400 hover:text-red-300 transition"
                                    title="Supprimer"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center py-4">Aucune notification</p>
            )}
        </div>
    );
};

export default AdminNotifications;