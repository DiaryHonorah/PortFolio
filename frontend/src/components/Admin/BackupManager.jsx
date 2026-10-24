import { useState } from 'react';

const BackupManager = () => {
    const [backups, setBackups] = useState([
        { id: 1, date: '19/07/2026 14:30', size: '2.4 MB', type: 'Complet' },
        { id: 2, date: '18/07/2026 10:15', size: '2.1 MB', type: 'Complet' },
        { id: 3, date: '17/07/2026 22:00', size: '1.8 MB', type: 'Partiel' }
    ]);
    const [creating, setCreating] = useState(false);

    const createBackup = async () => {
        setCreating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const newBackup = {
                id: backups.length + 1,
                date: new Date().toLocaleString('fr-FR'),
                size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
                type: 'Complet'
            };
            setBackups([newBackup, ...backups]);
        } catch (error) {
            console.error('Erreur backup:', error);
            alert('Erreur lors de la création de la sauvegarde');
        } finally {
            setCreating(false);
        }
    };

    const downloadBackup = (id) => {
        alert(`Téléchargement de la sauvegarde #${id}`);
    };

    const deleteBackup = (id) => {
        if (window.confirm('Supprimer cette sauvegarde ?')) {
            setBackups(backups.filter(b => b.id !== id));
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-white mb-4">💾 Sauvegardes</h3>
            <button
                onClick={createBackup}
                disabled={creating}
                className="bg-primary hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition text-white disabled:opacity-50"
            >
                {creating ? '⏳ Création...' : '➕ Créer une sauvegarde'}
            </button>

            {backups.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 border-b border-white/10">
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Taille</th>
                                <th className="pb-2">Type</th>
                                <th className="pb-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {backups.map((backup) => (
                                <tr key={backup.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="py-2 text-gray-300">{backup.date}</td>
                                    <td className="py-2 text-gray-400">{backup.size}</td>
                                    <td className="py-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            backup.type === 'Complet' 
                                                ? 'bg-green-500/20 text-green-400' 
                                                : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {backup.type}
                                        </span>
                                    </td>
                                    <td className="py-2 text-right">
                                        <button 
                                            onClick={() => downloadBackup(backup.id)}
                                            className="text-secondary hover:text-cyan-300 mr-2 transition"
                                        >
                                            ⬇️
                                        </button>
                                        <button 
                                            onClick={() => deleteBackup(backup.id)}
                                            className="text-red-400 hover:text-red-300 transition"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-400 mt-4">Aucune sauvegarde disponible</p>
            )}
        </div>
    );
};

export default BackupManager;