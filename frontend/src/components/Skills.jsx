import { useState, useEffect } from 'react';
import { getSkills } from '../services/api';

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await getSkills();
                setSkills(data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur:', error);
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    // Grouper par catégorie et prendre les 4 premières
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        if (acc[skill.category].length < 4) {
            acc[skill.category].push(skill);
        }
        return acc;
    }, {});

    if (loading) {
        return (
            <section id="competences" className="py-20">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="loading-spinner mx-auto"></div>
                </div>
            </section>
        );
    }

    return (
        <section id="competences" className="py-20">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" data-aos="fade-up">
                    Mes <span className="gradient-text">compétences</span>
                </h2>
                <p className="text-gray-400 text-center mb-12" data-aos="fade-up">
                    {skills.length} compétences maîtrisées
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {Object.entries(groupedSkills).map(([category, items]) => (
                        <div key={category} className="glass p-6 rounded-2xl" data-aos="fade-up">
                            <h3 className="text-xl font-bold text-secondary mb-4">{category}</h3>
                            <div className="space-y-4">
                                {items.map((skill) => (
                                    <div key={skill.id}>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">{skill.name}</span>
                                            <span className="text-gray-400">{skill.level}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${skill.level}%`,
                                                    background: `linear-gradient(90deg, ${skill.color || '#0066FF'}, ${skill.color || '#00D4FF'})`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;