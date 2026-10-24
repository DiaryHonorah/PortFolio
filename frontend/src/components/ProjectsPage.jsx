import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/api';
import ProjectFilters from './ProjectFilters';
import ProjectCard from './ProjectCard';

const ProjectsPage = () => {
    const [allProjects, setAllProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                const projectsArray = Array.isArray(data) ? data : [];
                setAllProjects(projectsArray);
                setFilteredProjects(projectsArray);
                setLoading(false);
            } catch (error) {
                console.error('Erreur:', error);
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleFilterChange = (filters) => {
        let result = [...allProjects];

        // Filtre par recherche
        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(p =>
                p.title?.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term) ||
                p.category?.toLowerCase().includes(term) ||
                (p.technologies && p.technologies.some(t => t.toLowerCase().includes(term)))
            );
        }

        // Filtre par catégorie
        if (filters.category && filters.category !== 'all') {
            result = result.filter(p => p.category === filters.category);
        }

        // Filtre par année
        if (filters.year && filters.year !== 'all') {
            const yearNum = parseInt(filters.year);
            result = result.filter(p => p.year === yearNum);
        }

        // Filtre par vedette
        if (filters.featured && filters.featured !== 'all') {
            const isFeatured = filters.featured === 'true';
            result = result.filter(p => p.featured === isFeatured);
        }

        setFilteredProjects(result);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading-spinner mx-auto"></div>
                    <p className="text-gray-400 mt-4">Chargement des projets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 pb-10 bg-[#0F0F1A]">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                    Mes <span className="gradient-text">Projets</span>
                </h1>
                <p className="text-gray-400 text-center mb-6">
                    {filteredProjects.length} projet(s) trouvé(s)
                </p>

                {/* Filtres avancés */}
                <ProjectFilters onFilterChange={handleFilterChange} />

                {/* Résultats */}
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-4">🔍</p>
                        <p className="text-gray-400">Aucun projet ne correspond à vos critères</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project, index) => (
                            <ProjectCard 
                                key={project.id || index} 
                                project={project} 
                                index={index} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;