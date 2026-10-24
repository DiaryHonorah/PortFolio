import React, { useState, useEffect } from 'react';
import { getServices } from '../services/serviceService';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await getServices(true);
            setServices(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setSelectedService(null);
        };
        
        if (selectedService) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [selectedService]);

    if (loading) {
        return (
            <section id="services" className="py-20">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400 mt-4">Chargement des services...</p>
                </div>
            </section>
        );
    }

    if (services.length === 0) return null;

    return (
        <section id="services" className="py-20">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-2" data-aos="fade-up">
                    Mes <span className="gradient-text">Services</span>
                </h2>
                <p className="text-gray-400 text-center mb-12" data-aos="fade-up">
                    Ce que je peux faire pour vous
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                            onClick={() => setSelectedService(service)}
                            className="glass p-6 rounded-2xl hover:scale-[1.03] transition duration-300 cursor-pointer group"
                            style={{ borderTop: `4px solid ${service.color || '#0066FF'}` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition"
                                    style={{
                                        backgroundColor: `${service.color}20`,
                                        border: `2px solid ${service.color}40`
                                    }}
                                >
                                    {service.icon || '💼'}
                                </div>
                                {service.price && (
                                    <span
                                        className="text-xs font-semibold px-2 py-1 rounded-full"
                                        style={{
                                            backgroundColor: `${service.color}20`,
                                            color: service.color
                                        }}
                                    >
                                        {service.price}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                                {service.title}
                            </h3>

                            <p className="text-gray-400 text-sm mb-4">
                                {service.description}
                            </p>

                            {service.duration && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                    <span>⏱️</span>
                                    <span>{service.duration}</span>
                                </div>
                            )}

                            <button
                                className="text-sm font-semibold flex items-center gap-1 transition"
                                style={{ color: service.color }}
                            >
                                En savoir plus
                                <span className="group-hover:translate-x-1 transition">→</span>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12" data-aos="fade-up">
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 px-8 py-4 rounded-full font-semibold transition text-white"
                    >
                        💬 Discutons de votre projet
                    </a>
                </div>
            </div>

            {selectedService && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setSelectedService(null)}
                >
                    <div
                        className="glass p-6 sm:p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                        style={{ borderTop: `4px solid ${selectedService.color || '#0066FF'}` }}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                                    style={{
                                        backgroundColor: `${selectedService.color}20`,
                                        border: `2px solid ${selectedService.color}40`
                                    }}
                                >
                                    {selectedService.icon || '💼'}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">
                                        {selectedService.title}
                                    </h3>
                                    {selectedService.duration && (
                                        <p className="text-gray-400 text-sm mt-1">
                                            ⏱️ {selectedService.duration}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedService(null)}
                                className="text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition flex-shrink-0"
                            >
                                ✕
                            </button>
                        </div>

                        {selectedService.long_description && (
                            <div className="mb-6">
                                <p className="text-gray-300 leading-relaxed">
                                    {selectedService.long_description}
                                </p>
                            </div>
                        )}

                        {selectedService.features && selectedService.features.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                    📋 Ce qui est inclus :
                                </h4>
                                <ul className="space-y-2">
                                    {selectedService.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                                            <span
                                                className="mt-0.5 flex-shrink-0 font-bold"
                                                style={{ color: selectedService.color }}
                                            >
                                                ✓
                                            </span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedService.price && (
                            <div
                                className="p-4 rounded-xl mb-6 text-center"
                                style={{
                                    backgroundColor: `${selectedService.color}15`,
                                    border: `1px solid ${selectedService.color}30`
                                }}
                            >
                                <p className="text-gray-400 text-xs mb-1">💰 Tarif</p>
                                <p className="text-2xl font-bold" style={{ color: selectedService.color }}>
                                    {selectedService.price}
                                </p>
                            </div>
                        )}

                        <a
                            href="#contact"
                            onClick={() => setSelectedService(null)}
                            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 px-6 py-3 rounded-full font-semibold transition text-white"
                        >
                            💬 Demander un devis
                        </a>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Services;