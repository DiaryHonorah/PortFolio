import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const CVGenerator = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const cvRef = useRef(null);

    const userData = {
        firstName: 'Diary Honorah',
        lastName: 'RAKOTOSOLOFOHARISON',
        title: 'Étudiant en Développement Web & Réseaux',
        email: 'honorahrakotosolofoharison@gmail.com',
        phone: '+261 34 22 489 66',
        location: 'Madagascar',
        linkedin: 'linkedin.com/in/Solofoson',
        github: 'github.com/DiaryHonorah',
        about: 'Étudiant passionné en développement web et systèmes réseaux, à la recherche d\'un stage académique pour mettre en pratique mes compétences et développer de nouvelles expertises.',
        experience: [
            {
                title: 'Projets académiques',
                company: 'Ecole Nationale d\'Informatique (ENI)',
                period: '2024 - Aujourd\'hui',
                description: 'Réalisation de projets en développement web et administration réseaux.'
            }
        ],
        education: [
            {
                degree: 'Licence 2 - Développement Web & Réseaux',
                school: 'Ecole Nationale d\'Informatique (ENI)',
                year: '2025 - Aujourd\'hui'
            },
            {
                degree: 'Licence 1 - Informatique & Réseaux',
                school: 'Ecole Nationale d\'Informatique (ENI)',
                year: '2024 - 2025'
            },
            {
                degree: 'Baccalauréat Scientifique',
                school: 'Lycée',
                year: '2023 - 2024'
            }
        ],
        skills: {
            'Frontend': ['React JS', 'HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript'],
            'Backend': ['PHP', 'Java', 'C#', 'Python (Django)'],
            'Database': ['MySQL', 'SQL Server', 'PostgreSQL', 'JDBC'],
            'Network': ['TCP/IP', 'Administration réseau', 'Systèmes embarqués', 'SSI', 'Fibre optique']
        },
        languages: [
            { name: 'Malagasy', level: '95%' },
            { name: 'Français', level: '70%' },
            { name: 'Anglais', level: '40%' }
        ],
        certifications: [
            'MSI - Maintenance et Systèmes Informatiques',
            'Administration Réseaux'
        ]
    };

    const generatePDF = async () => {
        if (!cvRef.current) return;
        
        setIsGenerating(true);
        
        try {
            const canvas = await html2canvas(cvRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('CV_RAKOTOSOLOFOHARISON_Diary_Honorah.pdf');
        } catch (error) {
            console.error('Erreur génération PDF:', error);
            alert('Erreur lors de la génération du PDF');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Bouton de téléchargement */}
            <div className="flex justify-center">
                <button
                    onClick={generatePDF}
                    disabled={isGenerating}
                    className={`px-6 py-3 rounded-lg font-semibold transition text-white flex items-center gap-2 ${
                        isGenerating 
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-primary hover:bg-blue-700 hover:scale-[1.02]'
                    }`}
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Génération...
                        </>
                    ) : (
                        <>
                            📄 Télécharger mon CV en PDF
                        </>
                    )}
                </button>
            </div>

            {/* Aperçu du CV */}
            <div className="glass p-4 rounded-xl border border-white/5">
                <p className="text-gray-400 text-sm text-center mb-4">
                    👆 Cliquez sur le bouton ci-dessus pour télécharger votre CV au format PDF
                </p>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg max-h-[600px] overflow-y-auto">
                    {/* CV - Version imprimable */}
                    <div ref={cvRef} className="p-8 text-gray-800" style={{ backgroundColor: '#ffffff' }}>
                        {/* En-tête */}
                        <div className="border-b-2 border-blue-600 pb-4 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {userData.firstName} {userData.lastName}
                                    </h1>
                                    <p className="text-lg text-blue-600 font-semibold">{userData.title}</p>
                                </div>
                                <div className="text-right text-sm text-gray-600">
                                    <p>📧 {userData.email}</p>
                                    <p>📱 {userData.phone}</p>
                                    <p>📍 {userData.location}</p>
                                    <p>🔗 {userData.linkedin}</p>
                                    <p>🐙 {userData.github}</p>
                                </div>
                            </div>
                        </div>

                        {/* À propos */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-blue-600 border-b border-gray-200 pb-1 mb-2">
                                À PROPOS
                            </h2>
                            <p className="text-sm text-gray-700">{userData.about}</p>
                        </div>

                        {/* Compétences */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-blue-600 border-b border-gray-200 pb-1 mb-2">
                                COMPÉTENCES
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(userData.skills).map(([category, skills]) => (
                                    <div key={category}>
                                        <p className="font-semibold text-sm text-gray-800">{category}</p>
                                        <ul className="list-disc list-inside text-xs text-gray-600">
                                            {skills.map((skill, i) => (
                                                <li key={i}>{skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Expériences */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-blue-600 border-b border-gray-200 pb-1 mb-2">
                                EXPÉRIENCES
                            </h2>
                            {userData.experience.map((exp, index) => (
                                <div key={index} className="mb-3">
                                    <div className="flex justify-between">
                                        <p className="font-semibold text-sm">{exp.title}</p>
                                        <p className="text-xs text-gray-500">{exp.period}</p>
                                    </div>
                                    <p className="text-xs text-gray-600">{exp.company}</p>
                                    <p className="text-xs text-gray-500">{exp.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Formation */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-blue-600 border-b border-gray-200 pb-1 mb-2">
                                FORMATION
                            </h2>
                            {userData.education.map((edu, index) => (
                                <div key={index} className="mb-2">
                                    <div className="flex justify-between">
                                        <p className="font-semibold text-sm">{edu.degree}</p>
                                        <p className="text-xs text-gray-500">{edu.year}</p>
                                    </div>
                                    <p className="text-xs text-gray-600">{edu.school}</p>
                                </div>
                            ))}
                        </div>

                        {/* Langues */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-blue-600 border-b border-gray-200 pb-1 mb-2">
                                LANGUES
                            </h2>
                            <div className="flex gap-6">
                                {userData.languages.map((lang, index) => (
                                    <div key={index}>
                                        <p className="font-semibold text-sm">{lang.name}</p>
                                        <p className="text-xs text-gray-600">{lang.level}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div>
                            <h2 className="text-lg font-bold text-blue-600 border-b border-gray-200 pb-1 mb-2">
                                CERTIFICATIONS
                            </h2>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                                {userData.certifications.map((cert, index) => (
                                    <li key={index}>{cert}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVGenerator;