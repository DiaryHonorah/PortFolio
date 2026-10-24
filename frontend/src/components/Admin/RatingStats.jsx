import React, { useState, useEffect } from 'react';
import { getTopRatedProjects, getGlobalRatingStats } from '../../services/ratingService';
import RatingStars from '../RatingStars';

const RatingStats = () => {
    const [topProjects, setTopProjects] = useState([]);
    const [stats, setStats] = useState({
        total_ratings: 0,
        global_average: 0,
        rated_projects: 0,
        unique_voters: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [top, globalStats] = await Promise.all([
                getTopRatedProjects(10),
                getGlobalRatingStats()
            ]);
            setTopProjects(Array.isArray(top) ? top : []);
            setStats(globalStats);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 mt-2">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">⭐ Statistiques de notation</h3>

            {/* Statistiques globales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass p-4 rounded-xl text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <p className="text-2xl font-bold text-yellow-400">
                        {stats.global_average > 0 ? stats.global_average : '-'}
                    </p>
                    <p className="text-gray-400 text-xs">Note moyenne</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <p className="text-2xl font-bold text-primary">{stats.total_ratings}</p>
                    <p className="text-gray-400 text-xs">Total votes</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <div className="text-3xl mb-2">📁</div>
                    <p className="text-2xl font-bold text-secondary">{stats.rated_projects}</p>
                    <p className="text-gray-400 text-xs">Projets notés</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <p className="text-2xl font-bold text-accent">{stats.unique_voters}</p>
                    <p className="text-gray-400 text-xs">Visiteurs votants</p>
                </div>
            </div>

            {/* Top des projets */}
            {topProjects.length > 0 ? (
                <div className="glass p-4 rounded-xl">
                    <h4 className="text-gray-400 text-sm font-semibold mb-4">
                        🏆 Top {topProjects.length} projets les mieux notés
                    </h4>
                    <div className="space-y-3">
                        {topProjects.map((project, index) => (
                            <div 
                                key={project.id} 
                                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                    index === 0 ? 'bg-yellow-400 text-black' :
                                    index === 1 ? 'bg-gray-300 text-black' :
                                    index === 2 ? 'bg-orange-400 text-black' :
                                    'bg-white/10 text-gray-400'
                                }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{project.title}</p>
                                    <p className="text-gray-500 text-xs">{project.category}</p>
                                </div>
                                <div className="text-right">
                                    <RatingStars 
                                        rating={Math.round(parseFloat(project.average))} 
                                        readonly 
                                        size="text-sm"
                                    />
                                    <p className="text-gray-400 text-xs mt-1">
                                        {parseFloat(project.average).toFixed(1)} ({project.total} votes)
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-4xl mb-2">⭐</p>
                    <p className="text-gray-400">Aucune note pour le moment</p>
                    <p className="text-gray-500 text-sm mt-1">Les statistiques apparaîtront après les premières notations</p>
                </div>
            )}
        </div>
    );
};

export default RatingStats;