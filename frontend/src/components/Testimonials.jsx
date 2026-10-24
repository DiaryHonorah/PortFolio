import React, { useState, useEffect } from 'react';
import { getApprovedTestimonials } from '../services/testimonialService';
import StarRating from './StarRating';
import TestimonialForm from './TestimonialForm';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await getApprovedTestimonials();
                setTestimonials(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (loading) {
        return (
            <section id="temoignages" className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </section>
        );
    }

    return (
        <section id="temoignages" className="py-20">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" data-aos="fade-up">
                    <span className="gradient-text">Témoignages</span>
                </h2>
                <p className="text-gray-400 text-center mb-12" data-aos="fade-up">
                    Ce que les autres disent de moi
                </p>

                {/* Carrousel de témoignages */}
                {testimonials.length > 0 ? (
                    <div className="glass p-8 rounded-2xl relative mb-8" data-aos="fade-up">
                        <div className="text-center">
                            {/* Étoiles */}
                            <div className="flex justify-center mb-4">
                                <StarRating 
                                    rating={testimonials[currentIndex].rating} 
                                    readonly 
                                    size="text-3xl"
                                />
                            </div>

                            {/* Message */}
                            <p className="text-gray-300 text-lg italic mb-6 leading-relaxed">
                                "{testimonials[currentIndex].message}"
                            </p>

                            {/* Auteur */}
                            <p className="text-white font-bold text-lg">
                                {testimonials[currentIndex].name}
                            </p>
                            {testimonials[currentIndex].role && (
                                <p className="text-gray-400 text-sm">
                                    {testimonials[currentIndex].role}
                                </p>
                            )}
                        </div>

                        {/* Navigation */}
                        {testimonials.length > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-6">
                                <button 
                                    onClick={prev}
                                    className="glass px-4 py-2 rounded-lg hover:bg-white/10 transition"
                                    aria-label="Témoignage précédent"
                                >
                                    ←
                                </button>
                                <span className="text-gray-500 text-sm">
                                    {currentIndex + 1} / {testimonials.length}
                                </span>
                                <button 
                                    onClick={next}
                                    className="glass px-4 py-2 rounded-lg hover:bg-white/10 transition"
                                    aria-label="Témoignage suivant"
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="glass p-8 rounded-2xl text-center mb-8">
                        <p className="text-4xl mb-3">💬</p>
                        <p className="text-gray-400">
                            Aucun témoignage pour le moment.
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            Soyez le premier à partager votre expérience !
                        </p>
                    </div>
                )}

                {/* Bouton pour ouvrir le formulaire */}
                <div className="text-center">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 px-6 py-3 rounded-full font-semibold transition text-white"
                    >
                        {showForm ? '✕ Fermer le formulaire' : '✍️ Laisser un témoignage'}
                    </button>
                </div>

                {/* Formulaire */}
                {showForm && (
                    <div className="mt-8 animate-fadeIn">
                        <TestimonialForm />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;