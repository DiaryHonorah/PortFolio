import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

const SkillList = () => {
    const { showToast } = useToast();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ========== Chargement des compétences ==========
    const fetchSkills = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost/portfolio/backend/skills');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSkills(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.message);
            showToast('❌ Erreur lors du chargement des compétences', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    // ========== Suppression d'une compétence ==========
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la compétence "${name}" ?`)) return;

        try {
            const response = await fetch(`http://localhost/portfolio/backend/skills/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchSkills();
                showToast(`🗑️ Compétence "${name}" supprimée avec succès`, 'info');
            } else {
                showToast('❌ Erreur lors de la suppression', 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showToast('❌ Erreur de connexion au serveur', 'error');
        }
    };

    // ========== Grouper les compétences par catégorie ==========
    const groupedSkills = skills.reduce((acc, skill) => {
        const category = skill.category || 'Non classé';
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
    }, {});

    const categories = Object.keys(groupedSkills);

    // Couleurs par catégorie
    const categoryColors = {
        'Frontend': 'text-blue-400',
        'Backend': 'text-green-400',
        'Database': 'text-orange-400',
        'Network': 'text-cyan-400'
    };

    // Icônes par catégorie
    const categoryIcons = {
        'Frontend': '🎨',
        'Backend': '⚙️',
        'Database': '🗄️',
        'Network': '🌐'
    };

    // ========== États de chargement ==========
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-2">Chargement des compétences...</p>
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

    if (!skills || skills.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-400 text-2xl">⚡</p>
                <p className="text-gray-400 mt-2">Aucune compétence</p>
            </div>
        );
    }

    // ========== Rendu principal ==========
    return (
        <div>
            {/* En-tête */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">⚡ Compétences ({skills.length})</h2>
                <button
                    className="bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition text-white"
                    onClick={() => alert('Formulaire d\'ajout à venir')}
                >
                    ➕ Ajouter
                </button>
            </div>

            {/* Liste des compétences par catégorie */}
            <div className="space-y-6">
                {categories.map((category) => (
                    <div key={category} className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">{categoryIcons[category] || '📌'}</span>
                            <h3 className={`font-semibold text-lg ${categoryColors[category] || 'text-white'}`}>
                                {category}
                            </h3>
                            <span className="text-gray-500 text-sm ml-2">
                                ({groupedSkills[category].length})
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {groupedSkills[category].map((skill) => (
                                <div 
                                    key={skill.id} 
                                    className="flex items-center gap-2 glass px-3 py-1.5 rounded-full hover:scale-105 transition"
                                >
                                    <span 
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: skill.color || '#0066FF' }}
                                    />
                                    <span className="text-white text-sm">{skill.name}</span>
                                    <span className="text-gray-400 text-xs">{skill.level}%</span>
                                    <button 
                                        onClick={() => handleDelete(skill.id, skill.name)}
                                        className="text-red-400 hover:text-red-300 ml-1 text-sm transition"
                                        title="Supprimer"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Total */}
            {skills.length > 0 && (
                <p className="text-gray-500 text-xs mt-4">
                    Total: {skills.length} compétence(s) - {categories.length} catégorie(s)
                </p>
            )}
        </div>
    );
};

export default SkillList;