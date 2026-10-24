import { useState, useEffect } from 'react';
import { getProjects } from '../services/api';
import ProjectCard from './ProjectCard';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                const projectsArray = Array.isArray(data) ? data : [];
                setProjects(projectsArray.slice(0, 6));
                setLoading(false);
            } catch (error) {
                console.error('Erreur:', error);
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <section id="projets" className="py-20">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Mes <span className="gradient-text">projets</span>
                    </h2>
                    <div className="loading-spinner mx-auto"></div>
                    <p className="text-gray-400 mt-4">Chargement des projets...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="projets" className="py-20">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" data-aos="fade-up">
                    Mes <span className="gradient-text">projets</span>
                </h2>
                <p className="text-gray-400 text-center mb-12" data-aos="fade-up">
                    {projects.length} projets récents
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard 
                            key={project.id || index} 
                            project={project} 
                            index={index} 
                        />
                    ))}
                </div>

                {/* Bouton voir tous les projets */}
                <div className="text-center mt-10">
                    <a
                        href="#projects"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 px-6 py-3 rounded-full font-semibold transition text-white"
                    >
                        📂 Voir tous les projets
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Projects;