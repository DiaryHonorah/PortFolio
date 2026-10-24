import React, { useState, useEffect, useCallback } from 'react';
import ImageUpload from './ImageUpload';
import ProjectGallery from './ProjectGallery';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        long_description: '',
        category: '',
        technologies: '',
        year: new Date().getFullYear(),
        featured: false,
        image_url: '',
        github_url: '',
        demo_url: ''
    });

    // ========== fetchProjects avec useCallback ==========
    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost/portfolio/backend/projects');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // ========== useEffect ==========
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // ========== Gestion des changements ==========
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // ========== Gestion de l'image ==========
    const handleImageUpload = (url) => {
        setFormData(prev => ({ ...prev, image_url: url }));
    };

    const handleImageRemove = () => {
        setFormData(prev => ({ ...prev, image_url: '' }));
    };

    // ========== Réinitialisation du formulaire ==========
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            long_description: '',
            category: '',
            technologies: '',
            year: new Date().getFullYear(),
            featured: false,
            image_url: '',
            github_url: '',
            demo_url: ''
        });
        setEditingProject(null);
    };

    // ========== Soumission du formulaire ==========
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingProject 
                ? `http://localhost/portfolio/backend/projects/${editingProject.id}`
                : 'http://localhost/portfolio/backend/projects';
            const method = editingProject ? 'PUT' : 'POST';
            
            const payload = {
                ...formData,
                technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
                year: parseInt(formData.year)
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                await fetchProjects();
                setShowForm(false);
                resetForm();
            } else {
                const data = await response.json();
                alert('Erreur: ' + (data.error || 'Erreur lors de l\'enregistrement'));
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        }
    };

    // ========== Édition d'un projet ==========
    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title || '',
            description: project.description || '',
            long_description: project.long_description || '',
            category: project.category || '',
            technologies: project.technologies ? project.technologies.join(', ') : '',
            year: project.year || new Date().getFullYear(),
            featured: project.featured || false,
            image_url: project.image_url || '',
            github_url: project.github_url || '',
            demo_url: project.demo_url || ''
        });
        setShowForm(true);
        // Scroll vers le formulaire
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ========== Suppression d'un projet ==========
    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            try {
                const response = await fetch(`http://localhost/portfolio/backend/projects/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    await fetchProjects();
                } else {
                    alert('Erreur lors de la suppression');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur de connexion au serveur');
            }
        }
    };

    // ========== États de chargement ==========
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-2">Chargement des projets...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/20 border border-red-500 p-4 rounded-xl text-red-400">
                ❌ Erreur: {error}
                <br />
                <span className="text-sm text-gray-400">
                    Vérifiez que le backend est lancé (Apache dans XAMPP)
                </span>
            </div>
        );
    }

    // ========== Rendu principal ==========
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-white">📁 Projets ({projects.length})</h2>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition text-white"
                >
                    {showForm ? '✕ Fermer' : '➕ Ajouter un projet'}
                </button>
            </div>

            {/* Formulaire */}
            {showForm && (
                <div className="bg-white/5 p-4 sm:p-6 rounded-xl mb-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        {editingProject ? '✏️ Modifier le projet' : '➕ Nouveau projet'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Titre <span className="text-secondary">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition"
                                    placeholder="Titre du projet"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Catégorie
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition"
                                    placeholder="Web, Desktop, Réseaux..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-1">
                                Description courte <span className="text-secondary">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="2"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition resize-none"
                                placeholder="Brève description du projet"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-1">
                                Description détaillée
                            </label>
                            <textarea
                                name="long_description"
                                value={formData.long_description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition resize-none"
                                placeholder="Description détaillée du projet..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Année
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    GitHub URL
                                </label>
                                <input
                                    type="url"
                                    name="github_url"
                                    value={formData.github_url}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition"
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Demo URL
                                </label>
                                <input
                                    type="url"
                                    name="demo_url"
                                    value={formData.demo_url}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition"
                                    placeholder="https://demo.com/..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-1">
                                Technologies (séparées par des virgules)
                            </label>
                            <input
                                type="text"
                                name="technologies"
                                value={formData.technologies}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition"
                                placeholder="React, Node.js, MongoDB..."
                            />
                        </div>

                        <div>
                            <ImageUpload
                                currentImage={formData.image_url}
                                onUpload={handleImageUpload}
                                onRemove={handleImageRemove}
                                label="Image principale du projet"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="w-4 h-4 accent-primary"
                            />
                            <label className="text-gray-300 text-sm font-semibold">
                                ⭐ Projet en vedette
                            </label>
                        </div>

                        {/* Galerie d'images (uniquement en mode édition) */}
                        {editingProject && (
                            <div className="pt-4 border-t border-white/10">
                                <ProjectGallery 
                                    projectId={editingProject.id} 
                                    projectTitle={editingProject.title}
                                />
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                type="submit"
                                className="bg-primary hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold transition"
                            >
                                {editingProject ? '💾 Mettre à jour' : '➕ Ajouter'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    resetForm();
                                    setShowForm(false);
                                }}
                                className="glass px-6 py-2 rounded-lg text-gray-300 hover:bg-white/10 transition"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tableau des projets */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-400 border-b border-white/10">
                            <th className="pb-3 pr-2">#</th>
                            <th className="pb-3 pr-2">Image</th>
                            <th className="pb-3 pr-2">Titre</th>
                            <th className="pb-3 pr-2 hidden md:table-cell">Catégorie</th>
                            <th className="pb-3 pr-2 hidden sm:table-cell">Année</th>
                            <th className="pb-3 pr-2">⭐</th>
                            <th className="pb-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project, index) => (
                            <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                <td className="py-3 pr-2 text-gray-500">{index + 1}</td>
                                <td className="py-3 pr-2">
                                    {project.image_url ? (
                                        <img 
                                            src={project.image_url} 
                                            alt={project.title} 
                                            className="w-10 h-8 object-cover rounded"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <span className="text-gray-600 text-xs">-</span>
                                    )}
                                </td>
                                <td className="py-3 pr-2 text-white font-medium truncate max-w-[120px]">{project.title}</td>
                                <td className="py-3 pr-2 text-gray-300 hidden md:table-cell">{project.category || '-'}</td>
                                <td className="py-3 pr-2 text-gray-300 hidden sm:table-cell">{project.year}</td>
                                <td className="py-3 pr-2">
                                    {project.featured ? (
                                        <span className="text-yellow-400">⭐</span>
                                    ) : (
                                        <span className="text-gray-500">-</span>
                                    )}
                                </td>
                                <td className="py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            className="text-blue-400 hover:text-blue-300 text-sm px-2 py-1 rounded hover:bg-white/5 transition"
                                            onClick={() => handleEdit(project)}
                                            title="Modifier"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-white/5 transition"
                                            onClick={() => handleDelete(project.id)}
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {projects.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-2xl">📁</p>
                    <p className="text-gray-400 mt-2">Aucun projet</p>
                </div>
            )}

            {projects.length > 0 && (
                <p className="text-gray-500 text-xs mt-4">
                    Total: {projects.length} projet(s)
                </p>
            )}
        </div>
    );
};

export default ProjectList;