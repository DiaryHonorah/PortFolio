import ContactEnhanced from './ContactEnhanced';

const Contact = () => {
    return (
        <section id="contact" className="py-20">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" data-aos="fade-up">
                    Me <span className="gradient-text">contacter</span>
                </h2>
                <p className="text-gray-400 text-center mb-12" data-aos="fade-up">
                    N'hésitez pas à me joindre pour un stage ou une collaboration
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Formulaire avec validation dynamique */}
                    <div data-aos="fade-right">
                        <ContactEnhanced />
                    </div>

                    {/* Informations de contact */}
                    <div data-aos="fade-left">
                        <h3 className="text-2xl font-bold text-white mb-6">Autres moyens de me contacter</h3>

                        <div className="space-y-4">
                            <div className="glass p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition duration-300">
                                <div className="text-3xl">📧</div>
                                <div>
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <a href="mailto:votre.email@example.com" className="text-white hover:text-secondary transition">
                                        rakotosolofoharisondiary@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="glass p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition duration-300">
                                <div className="text-3xl">📱</div>
                                <div>
                                    <p className="text-gray-400 text-sm">Téléphone</p>
                                    <a href="tel:+261XXXXXXXXX" className="text-white hover:text-secondary transition">
                                        +261 34 22 489 66
                                    </a>
                                </div>
                            </div>

                            <div className="glass p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition duration-300">
                                <div className="text-3xl">🔗</div>
                                <div>
                                    <p className="text-gray-400 text-sm">LinkedIn</p>
                                    <a href="#" className="text-white hover:text-secondary transition">
                                        linkedin.com/in/harison-rakotosolofoharison-693322435
                                    </a>
                                </div>
                            </div>

                            <div className="glass p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition duration-300">
                                <div className="text-3xl">🐙</div>
                                <div>
                                    <p className="text-gray-400 text-sm">GitHub</p>
                                    <a href="#" className="text-white hover:text-secondary transition">
                                        github.com/DiaryHonorah
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 glass p-4 rounded-xl border border-secondary/20">
                            <p className="text-gray-300 text-sm">
                                💡 <span className="text-secondary font-semibold">Disponible pour :</span>
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="bg-secondary/10 text-secondary text-xs px-3 py-1 rounded-full">Stages</span>
                                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">Alternance</span>
                                <span className="bg-accent/10 text-accent text-xs px-3 py-1 rounded-full">Projets</span>
                                <span className="bg-cyan-400/10 text-cyan-400 text-xs px-3 py-1 rounded-full">Collaboration</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;