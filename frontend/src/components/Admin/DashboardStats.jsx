import { useState, useEffect } from 'react';

const DashboardStats = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalSkills: 0,
        totalMessages: 0,
        unreadMessages: 0,
        featuredProjects: 0,
        categories: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Récupérer les données
                const [projectsRes, skillsRes, messagesRes] = await Promise.all([
                    fetch('http://localhost/portfolio/backend/projects'),
                    fetch('http://localhost/portfolio/backend/skills'),
                    fetch('http://localhost/portfolio/backend/messages')
                ]);

                const projects = await projectsRes.json();
                const skills = await skillsRes.json();
                const messages = await messagesRes.json();

                const featuredProjects = projects.filter(p => p.featured).length;
                const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];
                const unreadMessages = messages.filter(m => m.status === 'unread').length;

                setStats({
                    totalProjects: projects.length,
                    totalSkills: skills.length,
                    totalMessages: messages.length,
                    unreadMessages: unreadMessages,
                    featuredProjects: featuredProjects,
                    categories: categories
                });
                setLoading(false);
            } catch (error) {
                console.error('Erreur stats:', error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass p-4 rounded-xl animate-pulse">
                        <div className="h-8 bg-white/10 rounded w-1/2 mx-auto"></div>
                        <div className="h-4 bg-white/5 rounded w-3/4 mx-auto mt-2"></div>
                    </div>
                ))}
            </div>
        );
    }

    const statItems = [
        { label: 'Projets', value: stats.totalProjects, icon: '📁', color: 'text-primary' },
        { label: 'Compétences', value: stats.totalSkills, icon: '⚡', color: 'text-secondary' },
        { label: 'Messages', value: stats.totalMessages, icon: '✉️', color: 'text-accent' },
        { label: 'Non lus', value: stats.unreadMessages, icon: '🔴', color: 'text-red-400' }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statItems.map((item, index) => (
                    <div key={index} className="glass p-4 rounded-xl text-center hover:scale-105 transition">
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                        <p className="text-gray-400 text-sm">{item.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl">
                    <h4 className="text-gray-400 text-sm font-semibold mb-2">⭐ Projets en vedette</h4>
                    <p className="text-2xl font-bold text-yellow-400">{stats.featuredProjects}</p>
                </div>
                <div className="glass p-4 rounded-xl">
                    <h4 className="text-gray-400 text-sm font-semibold mb-2">📂 Catégories</h4>
                    <div className="flex flex-wrap gap-1">
                        {stats.categories.map((cat, i) => (
                            <span key={i} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;