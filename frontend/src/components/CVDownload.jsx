import { useState } from 'react';
import CVGenerator from './CVGenerator';

const CVDownload = () => {
    const [showOptions, setShowOptions] = useState(false);
    const [showGenerator, setShowGenerator] = useState(false);

    const handleDownload = (format) => {
        const link = document.createElement('a');
        if (format === 'pdf') {
            link.href = '/cv.pdf';
            link.download = 'CV_RAKOTOSOLOFOHARISON_Diary_Honorah.pdf';
        } else if (format === 'jpg') {
            link.href = '/cv.png';
            link.download = 'CV_RAKOTOSOLOFOHARISON_Diary_Honorah.jpg';
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowOptions(false);
    };

    return (
        <div className="text-center mt-8">
            {/* Bouton principal */}
            <button
                onClick={() => {
                    setShowOptions(!showOptions);
                    if (showGenerator) setShowGenerator(false);
                }}
                className="glass px-8 py-4 rounded-full hover:bg-white/10 transition inline-flex items-center gap-3 group relative"
            >
                <span className="text-2xl">📄</span>
                <span className="font-semibold">Télécharger mon CV</span>
                <span className="text-gray-400 text-sm group-hover:text-white transition">
                    {showOptions ? '▲' : '▼'}
                </span>
            </button>

            {/* Options de téléchargement */}
            {showOptions && (
                <div className="mt-4 glass p-4 rounded-2xl max-w-lg mx-auto animate-fadeIn">
                    {/* Nouveau : Générer un CV personnalisé */}
                    <div className="mb-4 pb-4 border-b border-white/5">
                        <button
                            onClick={() => {
                                setShowGenerator(!showGenerator);
                                setShowOptions(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-secondary/30 hover:from-primary/30 hover:to-secondary/40 rounded-xl transition group border border-white/10"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">✨</span>
                                <span className="text-white font-medium">Générer un CV personnalisé</span>
                                <span className="text-gray-400 text-xs">(PDF)</span>
                            </div>
                            <span className="text-secondary text-sm group-hover:scale-110 transition">
                                ➜
                            </span>
                        </button>
                        <p className="text-gray-500 text-xs mt-2 text-center">
                            Créez un CV à partir de vos données
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Aperçu */}
                        <div className="flex-1">
                            <div className="bg-white/5 rounded-xl p-2">
                                <img 
                                    src="/cv-preview.jpg" 
                                    alt="Aperçu du CV"
                                    className="w-full rounded-lg object-cover max-h-48"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%231a1a2e' width='200' height='200'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='.3em' fill='%230066FF' font-size='40' font-family='Arial'%3E📄%3C/text%3E%3C/svg%3E`;
                                    }}
                                />
                            </div>
                            <p className="text-gray-500 text-xs mt-2 text-center">
                                Aperçu du CV
                            </p>
                        </div>

                        {/* Options de téléchargement */}
                        <div className="flex-1 flex flex-col gap-3 justify-center">
                            <p className="text-gray-400 text-sm text-center md:text-left">
                                Choisissez le format :
                            </p>
                            
                            {/* Option PDF */}
                            <button
                                onClick={() => handleDownload('pdf')}
                                className="flex items-center justify-between w-full px-4 py-3 bg-primary/20 hover:bg-primary/30 rounded-xl transition group border border-primary/20"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📕</span>
                                    <span className="text-white font-medium">PDF</span>
                                    <span className="text-gray-400 text-xs">(Haute qualité)</span>
                                </div>
                                <span className="text-primary text-sm group-hover:scale-110 transition">
                                    ⬇️
                                </span>
                            </button>

                            {/* Option JPG */}
                            <button
                                onClick={() => handleDownload('jpg')}
                                className="flex items-center justify-between w-full px-4 py-3 bg-secondary/20 hover:bg-secondary/30 rounded-xl transition group border border-secondary/20"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🖼️</span>
                                    <span className="text-white font-medium">JPG</span>
                                    <span className="text-gray-400 text-xs">(Image)</span>
                                </div>
                                <span className="text-secondary text-sm group-hover:scale-110 transition">
                                    ⬇️
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Fermer */}
                    <button
                        onClick={() => setShowOptions(false)}
                        className="mt-3 text-gray-500 text-xs hover:text-gray-300 transition w-full text-center"
                    >
                        ✕ Fermer
                    </button>
                </div>
            )}

            {/* CV Generator */}
            {showGenerator && (
                <div className="mt-6 max-w-4xl mx-auto animate-fadeIn">
                    <CVGenerator />
                </div>
            )}
        </div>
    );
};

export default CVDownload;