import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

const Charts = () => {
    const [data, setData] = useState({
        projects: [],
        skills: [],
        messages: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, skillsRes, messagesRes] = await Promise.all([
                    fetch('http://localhost/portfolio/backend/projects'),
                    fetch('http://localhost/portfolio/backend/skills'),
                    fetch('http://localhost/portfolio/backend/messages')
                ]);

                const projects = await projectsRes.json();
                const skills = await skillsRes.json();
                const messages = await messagesRes.json();

                setData({ projects, skills, messages });
                setLoading(false);
            } catch (error) {
                console.error('Erreur:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 ml-4 text-sm">Chargement des données...</p>
            </div>
        );
    }

    const { projects, skills, messages } = data;

    // ========== GRAPHIQUE 1 : PROJETS PAR CATÉGORIE ==========
    const categoryCount = projects.reduce((acc, p) => {
        const cat = p.category || 'Non classé';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const barColors = [
        'rgba(0, 102, 255, 0.8)',
        'rgba(0, 212, 255, 0.8)',
        'rgba(255, 107, 0, 0.8)',
        'rgba(0, 255, 200, 0.8)',
        'rgba(255, 200, 0, 0.8)',
        'rgba(255, 99, 132, 0.8)',
    ];

    const barData = {
        labels: Object.keys(categoryCount),
        datasets: [
            {
                label: 'Projets par catégorie',
                data: Object.values(categoryCount),
                backgroundColor: barColors.slice(0, Object.keys(categoryCount).length),
                borderColor: barColors.map(c => c.replace('0.8', '1')),
                borderWidth: 1,
                borderRadius: 5,
            },
        ],
    };

    // ========== GRAPHIQUE 2 : COMPÉTENCES PAR CATÉGORIE ==========
    const skillCategoryCount = skills.reduce((acc, s) => {
        const cat = s.category || 'Non classé';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const pieColors = [
        'rgba(0, 102, 255, 0.8)',
        'rgba(0, 212, 255, 0.8)',
        'rgba(255, 107, 0, 0.8)',
        'rgba(0, 255, 200, 0.8)',
    ];

    const pieData = {
        labels: Object.keys(skillCategoryCount),
        datasets: [
            {
                data: Object.values(skillCategoryCount),
                backgroundColor: pieColors.slice(0, Object.keys(skillCategoryCount).length),
                borderColor: pieColors.map(c => c.replace('0.8', '1')),
                borderWidth: 1,
            },
        ],
    };

    // ========== GRAPHIQUE 3 : MESSAGES PAR JOUR (7 derniers jours) ==========
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }).reverse();

    const messagesByDay = last7Days.map(date => {
        return messages.filter(m => {
            const mDate = new Date(m.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
            return mDate === date;
        }).length;
    });

    const lineData = {
        labels: last7Days,
        datasets: [
            {
                label: 'Messages reçus',
                data: messagesByDay,
                borderColor: '#0066FF',
                backgroundColor: 'rgba(0, 102, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#0066FF',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

    // ========== GRAPHIQUE 4 : STATUT DES MESSAGES ==========
    const unreadCount = messages.filter(m => m.status === 'unread').length;
    const readCount = messages.filter(m => m.status === 'read' || m.status === 'replied').length;

    const doughnutData = {
        labels: ['📩 Non lus', '📖 Lus'],
        datasets: [
            {
                data: [unreadCount, readCount],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                ],
                borderColor: ['#FF6384', '#4BC0C0'],
                borderWidth: 2,
            },
        ],
    };

    // ========== OPTIONS ==========
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#9ca3af', font: { size: 11 } }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#9ca3af', stepSize: 1 },
                grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: {
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: { color: '#9ca3af', font: { size: 11 } }
            },
        },
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#9ca3af', font: { size: 11 } }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#9ca3af', stepSize: 1 },
                grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: {
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: { color: '#9ca3af', font: { size: 11 } }
            },
        },
        cutout: '60%',
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">📊 Statistiques avancées</h3>
                <span className="text-gray-500 text-xs">
                    {projects.length} projets · {skills.length} compétences · {messages.length} messages
                </span>
            </div>

            {/* Première ligne : 2 graphiques */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Graphique à barres */}
                <div className="glass p-4 rounded-xl border border-white/5">
                    <h4 className="text-gray-400 text-sm font-semibold mb-3">📁 Projets par catégorie</h4>
                    <div className="h-64">
                        {Object.keys(categoryCount).length > 0 ? (
                            <Bar data={barData} options={barOptions} />
                        ) : (
                            <p className="text-gray-500 text-center mt-8">Aucune donnée disponible</p>
                        )}
                    </div>
                </div>

                {/* Graphique en secteurs */}
                <div className="glass p-4 rounded-xl border border-white/5">
                    <h4 className="text-gray-400 text-sm font-semibold mb-3">⚡ Compétences par catégorie</h4>
                    <div className="h-64">
                        {Object.keys(skillCategoryCount).length > 0 ? (
                            <Pie data={pieData} options={pieOptions} />
                        ) : (
                            <p className="text-gray-500 text-center mt-8">Aucune donnée disponible</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Deuxième ligne : 2 graphiques */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Graphique en ligne */}
                <div className="glass p-4 rounded-xl border border-white/5">
                    <h4 className="text-gray-400 text-sm font-semibold mb-3">📈 Messages (7 derniers jours)</h4>
                    <div className="h-64">
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>

                {/* Doughnut */}
                <div className="glass p-4 rounded-xl border border-white/5">
                    <h4 className="text-gray-400 text-sm font-semibold mb-3">✉️ Statut des messages</h4>
                    <div className="h-64 flex justify-center items-center">
                        {messages.length > 0 ? (
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        ) : (
                            <p className="text-gray-500 text-center">Aucun message</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;