import { useState, useEffect } from 'react';
import { getSkills } from '../services/api';

const SkillsPage = () => {
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

    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="loading-spinner mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 pb-10 bg-[#0F0F1A]">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
                    Mes <span className="gradient-text">Compétences</span>
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    {skills.length} compétences maîtrisées
                </p>

                <div className="space-y-8">
                    {Object.entries(groupedSkills).map(([category, items]) => (
                        <div key={category} className="glass p-6 rounded-2xl">
                            <h2 className="text-xl font-bold text-secondary mb-4">{category}</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((skill) => (
                                    <div key={skill.id} className="bg-white/5 p-4 rounded-xl">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-white">{skill.name}</span>
                                            <span className="text-gray-400">{skill.level}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
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
        </div>
    );
};

export default SkillsPage;