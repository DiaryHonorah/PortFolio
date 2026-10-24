import React, { useState, useEffect } from 'react';

const ProjectFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        year: 'all',
        featured: 'all'
    });
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [years, setYears] = useState([]);

    // Récupérer les catégories et années disponibles
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await fetch('http://localhost/portfolio/backend/projects');
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const cats = [...new Set(data.map(p => p.category).filter(Boolean))];
                    const yrs = [...new Set(data.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
                    setCategories(cats);
                    setYears(yrs);
                }
            } catch (error) {
                console.error('Erreur chargement filtres:', error);
            }
        };
        fetchFilters();
    }, []);

    const handleChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        const defaultFilters = {
            search: '',
            category: 'all',
            year: 'all',
            featured: 'all'
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== 'all').length;

    return (
        <div className="mb-6">
            {/* Barre de recherche */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="🔍 Rechercher un projet..."
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    {filters.search && (
                        <button
                            onClick={() => handleChange('search', '')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                        >
                            ✕
                        </button>
                    )}
                </div>
                
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 glass px-4 py-2.5 rounded-lg hover:bg-white/10 transition"
                >
                    <span>⚙️</span>
                    <span className="font-medium">Filtres</span>
                    {activeFiltersCount > 0 && (
                        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                    <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
                </button>
                
                {activeFiltersCount > 0 && (
                    <button
                        onClick={resetFilters}
                        className="text-red-400 hover:text-red-300 text-sm px-3 py-2 rounded-lg hover:bg-red-500/10 transition"
                    >
                        🔄 Réinitialiser
                    </button>
                )}
            </div>

            {/* Panneau des filtres */}
            {isOpen && (
                <div className="glass p-4 rounded-xl animate-fadeIn border border-white/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Filtre Catégorie */}
                        <div>
                            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                                📂 Catégorie
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-secondary transition"
                            >
                                <option value="all">Toutes les catégories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre Année */}
                        <div>
                            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                                📅 Année
                            </label>
                            <select
                                value={filters.year}
                                onChange={(e) => handleChange('year', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-secondary transition"
                            >
                                <option value="all">Toutes les années</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre Vedette */}
                        <div>
                            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                                ⭐ Vedette
                            </label>
                            <select
                                value={filters.featured}
                                onChange={(e) => handleChange('featured', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-secondary transition"
                            >
                                <option value="all">Tous</option>
                                <option value="true">⭐ Projets en vedette</option>
                                <option value="false">📌 Projets standards</option>
                            </select>
                        </div>
                    </div>

                    {/* Filtres actifs */}
                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/5">
                            {filters.category !== 'all' && (
                                <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                    📂 {filters.category}
                                    <button 
                                        onClick={() => handleChange('category', 'all')}
                                        className="hover:text-red-400 transition"
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                            {filters.year !== 'all' && (
                                <span className="bg-secondary/20 text-secondary text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                    📅 {filters.year}
                                    <button 
                                        onClick={() => handleChange('year', 'all')}
                                        className="hover:text-red-400 transition"
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                            {filters.featured !== 'all' && (
                                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                    {filters.featured === 'true' ? '⭐ Vedette' : '📌 Standard'}
                                    <button 
                                        onClick={() => handleChange('featured', 'all')}
                                        className="hover:text-red-400 transition"
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectFilters;