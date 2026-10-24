import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Fonctions de navigation
    const goHome = () => {
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsOpen(false);
    };

    const goToProjectsPage = () => {
        window.location.hash = 'projects';
        setIsOpen(false);
    };

    const goToSkillsPage = () => {
        window.location.hash = 'skills';
        setIsOpen(false);
    };

    const scrollToSection = (sectionId) => {
        const hash = window.location.hash;
        if (hash === '#projects' || hash === '#skills' || hash === '#admin') {
            window.location.hash = '';
            setTimeout(() => {
                const element = document.querySelector(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 150);
        } else {
            const element = document.querySelector(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsOpen(false);
    };

    const goToContact = () => {
        const hash = window.location.hash;
        if (hash === '#projects' || hash === '#skills' || hash === '#admin') {
            window.location.hash = '';
            setTimeout(() => {
                const element = document.querySelector('#contact');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 150);
        } else {
            const element = document.querySelector('#contact');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsOpen(false);
    };

    const mainLinks = [
        { id: 'accueil', label: 'Accueil', action: goHome },
        { id: 'a-propos', label: 'À propos', action: () => scrollToSection('#a-propos') },
        { id: 'competences', label: 'Compétences', action: () => scrollToSection('#competences') },
        { id: 'projets', label: 'Projets', action: () => scrollToSection('#projets') },
        { id: 'contact', label: 'Contact', action: goToContact },
    ];

    const secondaryLinks = [
        { id: 'all-projects', label: '📂 Tous les projets', action: goToProjectsPage, highlight: true },
        { id: 'all-skills', label: '📊 Toutes les compétences', action: goToSkillsPage, highlight: true },
        { id: 'temoignages', label: '💬 Témoignages', action: () => scrollToSection('#temoignages') },
        { id: 'certifications', label: '🏆 Certifications', action: () => scrollToSection('#certifications') },
    ];

    return (
        <>
            {/* Barre de navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#0F0F1A]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex justify-between items-center">
                    {/* Logo avec dégradé */}
                    <button
                        onClick={goHome}
                        className="text-xl sm:text-2xl font-extrabold gradient-text cursor-pointer hover:opacity-80 transition whitespace-nowrap"
                        aria-label="Accueil"
                    >
                        Mon Portfolio
                    </button>

                    {/* Menu desktop */}
                    <div className="hidden lg:flex items-center gap-1">
                        <ul className="flex items-center gap-1 text-gray-300">
                            {mainLinks.map((link) => (
                                <li key={link.id}>
                                    <button
                                        onClick={link.action}
                                        className="hover:text-white transition cursor-pointer text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-white/5"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <span className="text-gray-600 mx-1">|</span>

                        <ul className="flex items-center gap-0.5 text-gray-300">
                            {secondaryLinks.map((link) => (
                                <li key={link.id}>
                                    <button
                                        onClick={link.action}
                                        className={`hover:text-white transition cursor-pointer text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-white/5 ${
                                            link.highlight 
                                                ? 'text-secondary hover:text-cyan-300' 
                                                : ''
                                        }`}
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Menu mobile - bouton (sans ThemeToggle) */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button 
                            className="text-white text-2xl hover:text-secondary transition relative z-50"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        >
                            {isOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Menu mobile */}
            {isOpen && (
                <>
                    {/* Overlay sombre derrière */}
                    <div 
                        className="lg:hidden fixed inset-0 bg-black/60 z-[9998]"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Menu qui glisse depuis la droite */}
                    <div 
                        className="lg:hidden fixed top-4 right-4 bottom-4 w-4/5 max-w-sm bg-[#0F0F1A] shadow-2xl z-[9999] overflow-y-auto animate-slide-in border border-white/10 rounded-2xl"
                    >
                        <div className="px-5 py-6 flex flex-col space-y-1">
                            {/* Bouton fermer */}
                            <div className="flex justify-end mb-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Email */}
                            <div className="text-center mb-3 pb-3 border-b border-white/5">
                                <p className="text-gray-400 text-sm">honorahrakotosolofoharison@gmail.com</p>
                            </div>

                            {/* Liens principaux */}
                            {mainLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={link.action}
                                    className="text-left hover:text-white transition cursor-pointer py-3 px-4 rounded-xl hover:bg-white/5 text-gray-300 w-full text-base font-medium"
                                >
                                    {link.label}
                                </button>
                            ))}

                            {/* Séparateur */}
                            <div className="border-t border-white/5 my-2"></div>

                            {/* Liens secondaires */}
                            {secondaryLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={link.action}
                                    className={`text-left hover:text-white transition cursor-pointer py-3 px-4 rounded-xl hover:bg-white/5 w-full text-base font-medium ${
                                        link.highlight 
                                            ? 'text-secondary hover:text-cyan-300' 
                                            : 'text-gray-300'
                                    }`}
                                >
                                    {link.label}
                                </button>
                            ))}

                            {/* Admin */}
                            <div className="border-t border-white/5 mt-2 pt-2">
                                <button
                                    onClick={() => {
                                        window.location.hash = 'admin';
                                        setIsOpen(false);
                                    }}
                                    className="text-left text-gray-400 hover:text-white transition cursor-pointer py-3 px-4 rounded-xl hover:bg-white/5 w-full text-base font-medium"
                                >
                                    🔐 Admin
                                </button>
                            </div>

                            {/* Version */}
                            <p className="text-center text-gray-600 text-xs mt-4 pt-4 border-t border-white/5">
                                v2.0 · Portfolio
                            </p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;