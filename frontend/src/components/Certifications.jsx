const certifications = [
    {
        id: 1,
        name: "MSI - Maintenance et Systèmes Informatiques",
        issuer: "Centre de Formation Professionnelle",
        date: "2024",
        icon: "🖥️"
    },
    {
        id: 2,
        name: "Administration Réseaux",
        issuer: "Ecole Nationale d'Informatique (ENI)",
        date: "2024",
        icon: "🌐"
    },
    {
        id: 3,
        name: "Développement Web Full-Stack",
        issuer: "ENI",
        date: "2025",
        icon: "📱"
    }
];

const Certifications = () => {
    return (
        <section id="certifications" className="py-20">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="fade-up">
                    <span className="gradient-text">Certifications</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="glass p-6 rounded-2xl text-center hover:scale-105 transition" data-aos="fade-up">
                            <div className="text-5xl mb-4">{cert.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{cert.name}</h3>
                            <p className="text-gray-400 text-sm">{cert.issuer}</p>
                            <p className="text-gray-500 text-xs mt-2">📅 {cert.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certifications;