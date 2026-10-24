import { useState } from 'react';

const ActivityLog = () => {
    const [logs] = useState([
        { id: 1, action: 'Connexion', user: 'admin', date: '19/07/2026 14:30', icon: '🔐' },
        { id: 2, action: 'Création de projet', user: 'admin', date: '19/07/2026 14:15', icon: '📁' },
        { id: 3, action: 'Modification de compétence', user: 'admin', date: '19/07/2026 13:45', icon: '⚡' },
        { id: 4, action: 'Suppression de message', user: 'admin', date: '19/07/2026 12:30', icon: '🗑️' },
        { id: 5, action: 'Connexion', user: 'admin', date: '19/07/2026 10:00', icon: '🔐' },
        { id: 6, action: 'Déconnexion', user: 'admin', date: '19/07/2026 09:45', icon: '🚪' },
        { id: 7, action: 'Export des données', user: 'admin', date: '19/07/2026 09:30', icon: '📤' },
        { id: 8, action: 'Création de sauvegarde', user: 'admin', date: '19/07/2026 08:15', icon: '💾' }
    ]);

    return (
        <div>
            <h3 className="text-xl font-bold text-white mb-4">📋 Activités récentes</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between glass px-4 py-2 rounded-lg hover:bg-white/5 transition">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{log.icon}</span>
                            <div>
                                <p className="text-white text-sm">{log.action}</p>
                                <p className="text-gray-400 text-xs">👤 {log.user}</p>
                            </div>
                        </div>
                        <span className="text-gray-500 text-xs">{log.date}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityLog;