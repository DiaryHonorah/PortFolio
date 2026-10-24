import React, { useState, useEffect } from 'react';
import { getTimelineEvents } from '../services/timelineService';

const TimelineInteractive = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (filter === 'all') {
            setFilteredEvents(events);
        } else {
            setFilteredEvents(events.filter(e => e.type === filter));
        }
    }, [filter, events]);

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

    const getTypeLabel = (type) => {
        const labels = {
            education: '🎓 Formation',
            work: '💼 Expérience',
            project: '📁 Projet',
            achievement: '🏆 Réalisation'
        };
        return labels[type] || type;
    };

    const getTypeColor = (type) => {
        const colors = {
            education: '#0066FF',
            work: '#FF6B00',
            project: '#00D4FF',
            achievement: '#FFD700'
        };
        return colors[type] || '#0066FF';
    };

    const availableTypes = ['all', ...new Set(events.map(e => e.type))];

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 mt-4">Chargement de la timeline...</p>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-4xl mb-4">📅</p>
                <p className="text-gray-400">Aucun événement dans la timeline</p>
            </div>
        );
    }

    return (
        <section id="timeline" className="py-12 sm:py-16 md:py-20 overflow-x-hidden w-full">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
                {/* En-tête */}
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-2" data-aos="fade-up">
                    Mon <span className="gradient-text">Parcours</span>
                </h2>
                <p className="text-gray-400 text-center mb-8" data-aos="fade-up">
                    Découvrez mon parcours académique et professionnel
                </p>

                {/* Filtres */}
                <div className="flex flex-wrap justify-center gap-2 mb-10" data-aos="fade-up">
                    {availableTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                                filter === type
                                    ? 'text-white'
                                    : 'glass text-gray-300 hover:bg-white/10'
                            }`}
                            style={filter === type ? {
                                backgroundColor: type === 'all' ? '#0066FF' : getTypeColor(type)
                            } : {}}
                        >
                            {type === 'all' ? '📋 Tous' : getTypeLabel(type)}
                        </button>
                    ))}
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Ligne verticale */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent transform md:-translate-x-1/2"></div>

                    {filteredEvents.map((event, index) => (
                        <div
                            key={event.id}
                            className={`relative flex flex-col md:flex-row items-start mb-6 sm:mb-8 ${
                                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                            }`}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            {/* Point sur la ligne */}
                            <div
                                className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full border-4 border-[#0F0F1A] z-10 flex items-center justify-center text-xs"
                                style={{ backgroundColor: event.color || getTypeColor(event.type) }}
                            >
                                <span className="text-white text-xs">{event.icon}</span>
                            </div>

                            {/* Contenu */}
                            <div className={`ml-12 md:ml-0 w-full md:w-[45%] ${
                                index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                            }`}>
                                <div
                                    onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                                    className="glass p-4 sm:p-6 rounded-2xl hover:scale-[1.02] transition duration-300 cursor-pointer"
                                    style={{
                                        borderLeft: `4px solid ${event.color || getTypeColor(event.type)}`,
                                    }}
                                >
                                    {/* En-tête */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl sm:text-3xl">{event.icon}</span>
                                        <div>
                                            <span
                                                className="text-sm font-bold"
                                                style={{ color: event.color || getTypeColor(event.type) }}
                                            >
                                                {event.year}
                                            </span>
                                            <span className="block text-xs text-gray-500">
                                                {getTypeLabel(event.type)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Titre */}
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">
                                        {event.title}
                                    </h3>

                                    {/* Description */}
                                    {event.description && (
                                        <p className="text-gray-400 text-xs sm:text-sm">
                                            {event.description}
                                        </p>
                                    )}

                                    {/* Détails (dépliables) */}
                                    {selectedEvent?.id === event.id && event.details && event.details.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/10 animate-fadeIn">
                                            <p className="text-gray-400 text-xs font-semibold mb-2">
                                                📌 Détails :
                                            </p>
                                            <ul className="space-y-1.5">
                                                {event.details.map((detail, i) => (
                                                    <li key={i} className="text-gray-300 text-xs sm:text-sm flex items-start gap-2">
                                                        <span
                                                            className="mt-1 flex-shrink-0"
                                                            style={{ color: event.color || getTypeColor(event.type) }}
                                                        >
                                                            ▸
                                                        </span>
                                                        <span className="break-words">{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Indicateur */}
                                    <div className="mt-3 text-gray-500 text-xs flex items-center gap-1">
                                        {selectedEvent?.id === event.id ? '▲ Réduire' : '▼ Voir les détails'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Statistiques */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4" data-aos="fade-up">
                    {['education', 'work', 'project', 'achievement'].map(type => {
                        const count = events.filter(e => e.type === type).length;
                        if (count === 0) return null;
                        return (
                            <div key={type} className="glass p-4 rounded-xl text-center">
                                <p className="text-2xl font-bold" style={{ color: getTypeColor(type) }}>
                                    {count}
                                </p>
                                <p className="text-gray-400 text-xs">{getTypeLabel(type)}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TimelineInteractive;