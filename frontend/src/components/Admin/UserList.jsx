import { useState, useEffect } from 'react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost/portfolio/backend/users');
                const data = await response.json();
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (error) {
                console.error('Erreur:', error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet utilisateur ?')) {
            try {
                await fetch(`http://localhost/portfolio/backend/users/${id}`, { method: 'DELETE' });
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="loading-spinner"></div>
                <p className="text-gray-400 ml-4">Chargement des utilisateurs...</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-400 text-lg">👤 Aucun utilisateur</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-bold text-white mb-4">👥 Gestion des utilisateurs</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-400 border-b border-white/10">
                            <th className="pb-2">ID</th>
                            <th className="pb-2">Utilisateur</th>
                            <th className="pb-2">Email</th>
                            <th className="pb-2">Rôle</th>
                            <th className="pb-2">Date</th>
                            <th className="pb-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-2 text-gray-400">{user.id}</td>
                                <td className="py-2 text-white">{user.username}</td>
                                <td className="py-2 text-gray-300">{user.email}</td>
                                <td className="py-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                        user.role === 'admin' 
                                            ? 'bg-primary/20 text-primary' 
                                            : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-2 text-gray-400">
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}
                                </td>
                                <td className="py-2 text-right">
                                    <button className="text-secondary hover:text-cyan-300 mr-2 transition">✏️</button>
                                    {user.username !== 'admin' && (
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-400 hover:text-red-300 transition"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-gray-500 text-xs mt-4">Total: {users.length} utilisateur(s)</p>
        </div>
    );
};

export default UserList;