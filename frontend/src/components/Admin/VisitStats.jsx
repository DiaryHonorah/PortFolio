import React, { useState, useEffect } from 'react';
import { getVisitStats } from '../../services/visitService';

const VisitStats = () => {
    const [stats, setStats] = useState({
        total: 0,
        unique_visitors: 0,
        today: 0,
        by_page: [],
        last_7_days: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getVisitStats();
                setStats(data);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 mt-2">Chargement des statistiques...</p>
            </div>
        );
    }

    // Calculer la hauteur max pour les graphiques
    const maxVisits = Math.max(...stats.last_7_days.map(d => d.count), 1);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">📊 Statistiques de visites</h3>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-xl text-center">
                    <div className="text-3xl mb-2">👁️</div>
                    <p className="text-2xl font-bold text-primary">{stats.total}</p>
                    <p className="text-gray-400 text-sm">Total visites</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <p className="text-2xl font-bold text-secondary">{stats.unique_visitors}</p>
                    <p className="text-gray-400 text-sm">Visiteurs uniques</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <div className="text-3xl mb-2">📅</div>
                    <p className="text-2xl font-bold text-accent">{stats.today}</p>
                    <p className="text-gray-400 text-sm">Aujourd'hui</p>
                </div>
            </div>

            {/* Graphique des 7 derniers jours */}
            {stats.last_7_days.length > 0 && (
                <div className="glass p-4 rounded-xl">
                    <h4 className="text-gray-400 text-sm font-semibold mb-4">📈 Visites des 7 derniers jours</h4>
                    <div className="flex items-end justify-between gap-2 h-40">
                        {stats.last_7_days.map((day, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex items-end justify-center h-32">
                                    <div 
                                        className="w-full max-w-[40px] bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all duration-500"
                                        style={{ height: `${(day.count / maxVisits) * 100}%`, minHeight: '4px' }}
                                        title={`${day.count} visites`}
                                    ></div>
                                </div>
                                <span className="text-gray-400 text-xs">
                                    {new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                                </span>
                                <span className="text-white text-xs font-semibold">{day.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Visites par page */}
            {stats.by_page.length > 0 && (
                <div className="glass p-4 rounded-xl">
                    <h4 className="text-gray-400 text-sm font-semibold mb-4">📄 Visites par page</h4>
                    <div className="space-y-3">
                        {stats.by_page.map((page, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300 capitalize">{page.page}</span>
                                    <span className="text-white font-semibold">{page.count}</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                                        style={{ 
                                            width: `${(page.count / stats.total) * 100}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Message si aucune donnée */}
            {stats.total === 0 && (
                <div className="text-center py-8">
                    <p className="text-4xl mb-2">📊</p>
                    <p className="text-gray-400">Aucune visite enregistrée</p>
                    <p className="text-gray-500 text-sm mt-1">Les statistiques apparaîtront après les premières visites</p>
                </div>
            )}
        </div>
    );
};

export default VisitStats;