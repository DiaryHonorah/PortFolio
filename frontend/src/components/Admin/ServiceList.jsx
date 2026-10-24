import React, { useState, useEffect } from 'react';
import { 
    getServices, 
    createService, 
    updateService, 
    deleteService 
} from '../../services/serviceService';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        long_description: '',
        icon: '💼',
        color: '#0066FF',
        features: '',
        price: '',
        duration: '',
        display_order: 0,
        active: true
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await getServices(false);
            setServices(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const dataToSend = {
            ...formData,
            features: formData.features ? formData.features.split('\n').filter(f => f.trim()) : [],
            display_order: parseInt(formData.display_order) || 0,
            active: formData.active
        };

        try {
            let result;
            if (editingService) {
                result = await updateService(editingService.id, dataToSend);
            } else {
                result = await createService(dataToSend);
            }

            if (result.success) {
                await fetchServices();
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

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description,
            long_description: service.long_description || '',
            icon: service.icon || '💼',
            color: service.color || '#0066FF',
            features: service.features ? service.features.join('\n') : '',
            price: service.price || '',
            duration: service.duration || '',
            display_order: service.display_order || 0,
            active: service.active === 1 || service.active === true
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce service ?')) {
            const result = await deleteService(id);
            if (result.success) {
                await fetchServices();
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            long_description: '',
            icon: '💼',
            color: '#0066FF',
            features: '',
            price: '',
            duration: '',
            display_order: 0,
            active: true
        });
        setEditingService(null);
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
                <h2 className="text-xl font-bold text-white">💼 Services ({services.length})</h2>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition text-white"
                >
                    {showForm ? '✕ Fermer' : '➕ Ajouter un service'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white/5 p-4 sm:p-6 rounded-xl mb-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        {editingService ? '✏️ Modifier le service' : '➕ Nouveau service'}
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
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition"
                                    placeholder="Développement Web"
                                    required
                                />
                            </div>

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
                                    placeholder="💼"
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
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition resize-none"
                                placeholder="Brève description du service"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-1">
                                Description longue
                            </label>
                            <textarea
                                name="long_description"
                                value={formData.long_description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition resize-none"
                                placeholder="Description détaillée"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-1">
                                Fonctionnalités (une par ligne)
                            </label>
                            <textarea
                                name="features"
                                value={formData.features}
                                onChange={handleChange}
                                rows="4"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition resize-none"
                                placeholder="Site vitrine&#10;Application web&#10;Base de données"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Prix
                                </label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition"
                                    placeholder="Sur devis"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Durée
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition"
                                    placeholder="1-4 semaines"
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    Ordre d'affichage
                                </label>
                                <input
                                    type="number"
                                    name="display_order"
                                    value={formData.display_order}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-6">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-primary"
                                />
                                <label className="text-gray-300 text-sm font-semibold">
                                    ✅ Service actif
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                type="submit"
                                className="bg-primary hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold transition"
                            >
                                {editingService ? '💾 Mettre à jour' : '➕ Ajouter'}
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

            <div className="space-y-3">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="glass p-4 rounded-xl"
                        style={{ borderLeft: `4px solid ${service.color || '#0066FF'}` }}
                    >
                        <div className="flex justify-between items-start flex-wrap gap-2">
                            <div className="flex items-start gap-3 flex-1">
                                <span className="text-3xl">{service.icon || '💼'}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-white">{service.title}</h3>
                                        {service.active ? (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                                                ✅ Actif
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400">
                                                ⏸️ Inactif
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                        {service.price && <span>💰 {service.price}</span>}
                                        {service.duration && <span>⏱️ {service.duration}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="text-blue-400 hover:text-blue-300 text-sm px-2 py-1"
                                    title="Modifier"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="text-red-400 hover:text-red-300 text-sm px-2 py-1"
                                    title="Supprimer"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {services.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-4xl mb-2">💼</p>
                        <p className="text-gray-400">Aucun service</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceList;