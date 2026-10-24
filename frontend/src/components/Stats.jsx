import { useState, useEffect } from 'react';
import { getProjects, getSkills } from '../services/api';

const Stats = () => {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        experience: 2,
        certificates: 3
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [projects, skills] = await Promise.all([
                    getProjects(),
                    getSkills()
                ]);
                setStats(prev => ({
                    ...prev,
                    projects: projects.length,
                    skills: skills.length
                }));
            } catch (error) {
                console.error('Erreur stats:', error);
            }
        };
        fetchStats();
    }, []);

    const statItems = [
        { label: 'Projets', value: stats.projects, icon: '📁', color: 'text-primary' },
        { label: 'Compétences', value: stats.skills, icon: '⚡', color: 'text-secondary' },
        { label: "Années d'études", value: stats.experience, icon: '🎓', color: 'text-accent' },
        { label: 'Certifications', value: stats.certificates, icon: '🏆', color: 'text-cyan-400' }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {statItems.map((item, index) => (
                <div key={index} className="glass p-4 rounded-xl text-center" data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}+</p>
                    <p className="text-gray-400 text-sm">{item.label}</p>
                </div>
            ))}
        </div>
    );
};

export default Stats;