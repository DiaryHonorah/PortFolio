import AnimatedSection from './AnimatedSection';
import AnimatedCounter from './AnimatedCounter';

const AnimationsExample = () => {
    return (
        <section className="py-20">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Animations <span className="gradient-text">Avancées</span>
                </h2>

                {/* Exemple 1: Section animée au scroll */}
                <AnimatedSection>
                    <div className="glass p-6 rounded-2xl text-center">
                        <p className="text-gray-300">Cette section apparaît avec une animation au scroll</p>
                    </div>
                </AnimatedSection>

                {/* Exemple 2: Compteur animé */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <AnimatedSection delay={100}>
                        <div className="glass p-6 rounded-2xl text-center">
                            <p className="text-3xl font-bold text-primary">
                                <AnimatedCounter target={100} duration={2000} suffix="+" />
                            </p>
                            <p className="text-gray-400 text-sm">Projets</p>
                        </div>
                    </AnimatedSection>
                    
                    <AnimatedSection delay={200}>
                        <div className="glass p-6 rounded-2xl text-center">
                            <p className="text-3xl font-bold text-secondary">
                                <AnimatedCounter target={50} duration={2000} suffix="+" />
                            </p>
                            <p className="text-gray-400 text-sm">Compétences</p>
                        </div>
                    </AnimatedSection>
                    
                    <AnimatedSection delay={300}>
                        <div className="glass p-6 rounded-2xl text-center">
                            <p className="text-3xl font-bold text-accent">
                                <AnimatedCounter target={2} duration={2000} suffix=" ans" />
                            </p>
                            <p className="text-gray-400 text-sm">Expérience</p>
                        </div>
                    </AnimatedSection>
                    
                    <AnimatedSection delay={400}>
                        <div className="glass p-6 rounded-2xl text-center">
                            <p className="text-3xl font-bold text-cyan-400">
                                <AnimatedCounter target={10} duration={2000} suffix="+" />
                            </p>
                            <p className="text-gray-400 text-sm">Certifications</p>
                        </div>
                    </AnimatedSection>
                </div>

                {/* Exemple 3: Animation de cartes */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    {[1, 2, 3].map((item) => (
                        <AnimatedSection key={item} delay={item * 150}>
                            <div className="glass p-6 rounded-2xl text-center hover:scale-105 transition">
                                <div className="text-4xl mb-3">🎯</div>
                                <h3 className="text-white font-bold">Compétence {item}</h3>
                                <p className="text-gray-400 text-sm">Description de la compétence</p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AnimationsExample;