import React, { useState, useEffect } from 'react';
import { 
    getTimelineEvents, 
    createTimelineEvent, 
    updateTimelineEvent, 
    deleteTimelineEvent 
} from '../../services/timelineService';

const TimelineList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        year: '',
        title: '',
        description: '',
        type: 'education',
        icon: '📚',
        color: '#0066FF',
        details: '',
        display_order: 0
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await getTimelineEvents();
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const dataToSend = {
            ...formData,
            details: formData.details ? formData.details.split('\n').filter(d => d.trim()) : [],
            display_order: parseInt(formData.display_order) || 0
        };

        try {
            let result;
            if (editingEvent) {
                result = await updateTimelineEvent(editingEvent.id, dataToSend);
            } else {
                result = await createTimelineEvent(dataToSend);
            }

            if (result.success) {
                await fetchEvents();
                setShowForm(false);
                resetForm();
            } else {
                alert('Erreur: ' + (result.error || 'Erreur'));
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de connexion');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            year: event.year,
            title: event.title,
            description: event.description || '',
            type: event.type,
            icon: event.icon || '📚',
            color: event.color || '#0066FF',
            details: event.details ? event.details.join('\n') : '',
            display_order: event.display_order || 0
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet événement ?')) {
            const result = await deleteTimelineEvent(id);
            if (result.success) {
                await fetchEvents();
            }
        }
    };

    const resetForm = () => {
        setFormData({
            year: '',
            title: '',
            description: '',
            type: 'education',
            icon: '📚',
            color: '#0066FF',
            details: '',
            display_order: 0
        });
        setEditingEvent(null);
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
        <div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-bold text-white">📅 Timeline ({events.length})</h2>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition text-white"
                >
                    {showForm ? '✕ Fermer' : '➕ Ajouter un événement'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white/5 p-4 sm:p-6 rounded-xl mb-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        {editingEvent ? '✏️ Modifier l\'événement' : '➕ Nouvel événement'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Année <span className="text-secondary">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition"
                                    placeholder="2024 - 2025"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition"
                                >
                                    <option value="education">🎓 Formation</option>
                                    <option value="work">💼 Expérience</option>
                                    <option value="project">📁 Projet</option>
                                    <option value="achievement">🏆 Réalisation</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-1">
                                Titre <span className="text-secondary">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition"
                                placeholder="Titre de l'événement"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="2"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition resize-none"
                                placeholder="Brève description"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-1">
                                Détails (une ligne par détail)
                            </label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                                rows="4"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition resize-none"
                                placeholder="Premier détail&#10;Deuxième détail&#10;Troisième détail"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Icône (emoji)
                                </label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition"
                                    placeholder="📚"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Couleur
                                </label>
                                <input
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Ordre
                                </label>
                                <input
                                    type="number"
                                    name="display_order"
                                    value={formData.display_order}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                type="submit"
                                className="bg-primary hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold transition"
                            >
                                {editingEvent ? '💾 Mettre à jour' : '➕ Ajouter'}
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

            {/* Liste des événements */}
            <div className="space-y-3">
                {events.map((event) => (
                    <div key={event.id} className="glass p-4 rounded-xl" style={{
                        borderLeft: `4px solid ${event.color || '#0066FF'}`
                    }}>
                        <div className="flex justify-between items-start flex-wrap gap-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-2xl">{event.icon}</span>
                                    <span className="font-bold text-sm" style={{ color: event.color }}>
                                        {event.year}
                                    </span>
                                    <span className="text-xs text-gray-500">{event.type}</span>
                                </div>
                                <p className="text-white font-semibold mt-1">{event.title}</p>
                                {event.description && (
                                    <p className="text-gray-400 text-sm mt-1">{event.description}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="text-blue-400 hover:text-blue-300 text-sm px-2 py-1"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="text-red-400 hover:text-red-300 text-sm px-2 py-1"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineList;