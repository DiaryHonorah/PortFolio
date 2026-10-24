const Hero = () => {
    return (
        <section id="accueil" className="min-h-screen flex items-center pt-20" aria-label="Section d'accueil">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    
                    {/* ========== COLONNE GAUCHE : PHOTO + STATUT ========== */}
                    <div data-aos="fade-right" className="flex flex-col items-start">
                        {/* Photo de profil - CERCLE AGRANDI */}
                        <div className="relative group">
                            {/* Bordure animée - agrandie */}
                            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-full animate-spin-slow blur-md"></div>
                            
                            {/* Photo - CERCLE PLUS GRAND */}
                            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl shadow-primary/20">
                                <img 
                                    src="/profile.jpg" 
                                    alt="RAKOTOSOLOFOHARISON Diary Honorah"
                                    className="w-full h-full object-cover hover:scale-105 transition duration-700 object-top"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%231a1a2e' width='400' height='400'/%3E%3Ctext x='200' y='200' text-anchor='middle' dy='.3em' fill='%230066FF' font-size='60' font-family='Arial'%3E👨‍💻%3C/text%3E%3C/svg%3E`;
                                    }}
                                />
                            </div>
                            
                            {/* Badge en ligne - repositionné */}
                            <div className="absolute bottom-4 right-4 bg-green-500 w-5 h-5 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                        </div>

                        {/* Nom sous la photo */}
                        <div className="mt-5 text-left">
                            <h2 className="text-xl font-bold text-white">
                                RAKOTOSOLOFOHARISON
                            </h2>
                            <p className="text-secondary text-sm font-medium">
                                Diary Honorah
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                                🚀 Étudiant en Dev Web & Réseaux
                            </p>
                        </div>

                        {/* Badge disponible */}
                        <div className="mt-3 flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-sm font-medium border border-green-500/20">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Disponible pour un stage et emploi
                        </div>
                    </div>

                    {/* ========== COLONNE DROITE : TEXTE DE BIENVENUE ========== */}
                    <div data-aos="fade-left" className="text-left md:pt-4">
                        <p className="text-secondary font-semibold text-sm uppercase tracking-wider flex items-center gap-2" aria-hidden="true">
                            <span className="text-2xl">👋</span> Bienvenue sur mon portfolio
                        </p>
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-2">
                            Je suis <br />
                            <span className="gradient-text text-5xl md:text-6xl">RAKOTOSOLOFOHARISON</span><br />
                            <span className="gradient-text text-4xl md:text-5xl">Diary Honorah</span><br />
                            <span className="text-white text-3xl md:text-4xl">en Dev Web & Réseaux</span>
                        </h1>
                        <p className="text-gray-400 text-lg mt-4 max-w-lg">
                            Étudiant à l'Ecole Nationale d'Informatique (ENI), passionné à la recherche d'un stage académique.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-6">
                            <a 
                                href="#projets" 
                                className="bg-primary hover:bg-blue-700 px-6 py-3 rounded-full font-semibold transition transform hover:scale-105"
                                aria-label="Voir mes projets"
                            >
                                📁 Voir mes projets
                            </a>
                            <a 
                                href="#contact" 
                                className="border border-secondary text-secondary hover:bg-secondary/10 px-6 py-3 rounded-full font-semibold transition transform hover:scale-105"
                                aria-label="Me contacter"
                            >
                                ✉️ Me contacter
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flèche vers le bas */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <a href="#a-propos" className="text-gray-400 hover:text-secondary transition text-2xl" aria-label="Défiler vers le bas">
                    ↓
                </a>
            </div>
        </section>
    );
};

export default Hero;