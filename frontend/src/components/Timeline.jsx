import { useState } from 'react';

const timelineData = [
    {
        year: "2023",
        title: "Début de ma formation en Informatique",
        description: "Entrée à l'Ecole Nationale d'Informatique (ENI) pour suivre une formation en développement web et systèmes réseaux.",
        icon: "🎓",
        details: [
            "Découverte des fondamentaux de la programmation",
            "Premiers pas en HTML, CSS et JavaScript",
            "Introduction aux réseaux informatiques"
        ]
    },
    {
        year: "2024",
        title: "L1 - Informatique & Réseaux",
        description: "Acquisition des bases solides en informatique et réseaux. Réalisation de mes premiers projets concrets.",
        icon: "💻",
        details: [
            "Projets en HTML, CSS, JavaScript",
            "Administration réseaux et systèmes embarqués",
            "MSI - Maintenance et Systèmes Informatiques",
            "Projet: Compteur intelligent d'énergie"
        ]
    },
    {
        year: "2025",
        title: "L2 - Développement Web & Réseaux",
        description: "Approfondissement en développement full-stack avec des technologies modernes.",
        icon: "🚀",
        details: [
            "Développement d'applications C# (Gestion de vente)",
            "Applications React JS (Gestion d'enseignants)",
            "Projets PHP (Gestion d'église)",
            "Applications Java (Gestion de station essence)",
            "Double compétence : Dev Web + Réseaux"
        ]
    },
    {
        year: "2026",
        title: "Recherche de stage académique",
        description: "À la recherche d'un stage en développement web pour mettre en pratique mes compétences.",
        icon: "🔍",
        details: [
            "Stage en développement web",
            "Développement full-stack",
            "Administration réseaux",
            "Projets innovants"
        ]
    }
];

const Timeline = () => {
    const [expandedItem, setExpandedItem] = useState(null);

    const toggleDetails = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };

    return (
        <section id="timeline" className="py-20">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" data-aos="fade-up">
                    Mon <span className="gradient-text">Parcours</span>
                </h2>
                <p className="text-gray-400 text-center mb-12" data-aos="fade-up">
                    Ligne du temps de ma formation
                </p>

                <div className="relative">
                    {/* Ligne verticale */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>

                    {timelineData.map((item, index) => (
                        <div 
                            key={index} 
                            className={`relative flex flex-col md:flex-row items-start mb-8 ${
                                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                            }`}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            {/* Point sur la ligne */}
                            <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-white z-10"></div>

                            {/* Contenu */}
                            <div className={`ml-12 md:ml-0 w-full md:w-[45%] ${
                                index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                            }`}>
                                <div className="glass p-6 rounded-2xl hover:scale-[1.02] transition cursor-pointer"
                                     onClick={() => toggleDetails(index)}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">{item.icon}</span>
                                        <span className="text-secondary font-bold text-lg">{item.year}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.description}</p>
                                    
                                    {/* Détails */}
                                    {expandedItem === index && (
                                        <div className="mt-4 pt-4 border-t border-white/10 animate-fadeIn">
                                            <ul className="space-y-2">
                                                {item.details.map((detail, i) => (
                                                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                                        <span className="text-secondary mt-1">▸</span>
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    <div className="mt-3 text-gray-500 text-xs flex items-center gap-1">
                                        {expandedItem === index ? '▲' : '▼'} 
                                        {expandedItem === index ? 'Réduire' : 'Voir les détails'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Timeline;