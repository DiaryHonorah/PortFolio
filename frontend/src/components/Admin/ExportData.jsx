import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportData = () => {
    const [exporting, setExporting] = useState(false);
    const [exportType, setExportType] = useState('');
    const [progress, setProgress] = useState(0);

    const fetchData = async (endpoint) => {
        const response = await fetch(`http://localhost/portfolio/backend/${endpoint}`);
        if (!response.ok) throw new Error('Erreur réseau');
        return response.json();
    };

    // ========== EXPORT CSV ==========
    const exportCSV = async (type) => {
        setExporting(true);
        setExportType('CSV');
        setProgress(10);

        try {
            let data = [];
            let filename = '';
            let headers = [];

            if (type === 'projects') {
                data = await fetchData('projects');
                filename = 'projets_export.csv';
                headers = ['ID', 'Titre', 'Description', 'Catégorie', 'Technologies', 'Année', 'Featured'];
                setProgress(50);
                const rows = data.map(p => [
                    p.id,
                    p.title,
                    p.description,
                    p.category || '',
                    p.technologies ? p.technologies.join(', ') : '',
                    p.year || '',
                    p.featured ? 'Oui' : 'Non'
                ]);
                downloadCSV(headers, rows, filename);
            } else if (type === 'skills') {
                data = await fetchData('skills');
                filename = 'competences_export.csv';
                headers = ['ID', 'Nom', 'Catégorie', 'Niveau', 'Couleur'];
                setProgress(50);
                const rows = data.map(s => [
                    s.id,
                    s.name,
                    s.category || '',
                    s.level || 0,
                    s.color || ''
                ]);
                downloadCSV(headers, rows, filename);
            } else if (type === 'messages') {
                data = await fetchData('messages');
                filename = 'messages_export.csv';
                headers = ['ID', 'Nom', 'Email', 'Sujet', 'Message', 'Statut', 'Date'];
                setProgress(50);
                const rows = data.map(m => [
                    m.id,
                    m.name,
                    m.email,
                    m.subject || '',
                    m.message,
                    m.status || 'unread',
                    new Date(m.created_at).toLocaleDateString('fr-FR')
                ]);
                downloadCSV(headers, rows, filename);
            }

            setProgress(100);
            setTimeout(() => setProgress(0), 2000);
        } catch (error) {
            console.error('Erreur export CSV:', error);
            alert('Erreur lors de l\'exportation CSV');
        } finally {
            setExporting(false);
            setExportType('');
        }
    };

    const downloadCSV = (headers, rows, filename) => {
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // ========== EXPORT EXCEL ==========
    const exportExcel = async (type) => {
        setExporting(true);
        setExportType('Excel');
        setProgress(10);

        try {
            let data = [];
            let sheetName = '';
            let filename = '';

            if (type === 'projects') {
                data = await fetchData('projects');
                sheetName = 'Projets';
                filename = 'projets_export.xlsx';
                setProgress(50);
                data = data.map(p => ({
                    ID: p.id,
                    Titre: p.title,
                    Description: p.description,
                    Catégorie: p.category || '',
                    Technologies: p.technologies ? p.technologies.join(', ') : '',
                    Année: p.year || '',
                    Featured: p.featured ? 'Oui' : 'Non'
                }));
            } else if (type === 'skills') {
                data = await fetchData('skills');
                sheetName = 'Compétences';
                filename = 'competences_export.xlsx';
                setProgress(50);
                data = data.map(s => ({
                    ID: s.id,
                    Nom: s.name,
                    Catégorie: s.category || '',
                    Niveau: s.level || 0,
                    Couleur: s.color || ''
                }));
            } else if (type === 'all') {
                const [projects, skills, messages] = await Promise.all([
                    fetchData('projects'),
                    fetchData('skills'),
                    fetchData('messages')
                ]);
                filename = 'portfolio_complet_export.xlsx';
                setProgress(30);
                
                const wb = XLSX.utils.book_new();
                
                // Sheet Projets
                const projectsData = projects.map(p => ({
                    ID: p.id,
                    Titre: p.title,
                    Description: p.description,
                    Catégorie: p.category || '',
                    Technologies: p.technologies ? p.technologies.join(', ') : '',
                    Année: p.year || '',
                    Featured: p.featured ? 'Oui' : 'Non'
                }));
                const ws1 = XLSX.utils.json_to_sheet(projectsData);
                XLSX.utils.book_append_sheet(wb, ws1, 'Projets');
                setProgress(60);
                
                // Sheet Compétences
                const skillsData = skills.map(s => ({
                    ID: s.id,
                    Nom: s.name,
                    Catégorie: s.category || '',
                    Niveau: s.level || 0,
                    Couleur: s.color || ''
                }));
                const ws2 = XLSX.utils.json_to_sheet(skillsData);
                XLSX.utils.book_append_sheet(wb, ws2, 'Compétences');
                setProgress(80);
                
                // Sheet Messages
                const messagesData = messages.map(m => ({
                    ID: m.id,
                    Nom: m.name,
                    Email: m.email,
                    Sujet: m.subject || '',
                    Message: m.message,
                    Statut: m.status || 'unread',
                    Date: new Date(m.created_at).toLocaleDateString('fr-FR')
                }));
                const ws3 = XLSX.utils.json_to_sheet(messagesData);
                XLSX.utils.book_append_sheet(wb, ws3, 'Messages');
                setProgress(90);
                
                XLSX.writeFile(wb, filename);
                setProgress(100);
                setTimeout(() => setProgress(0), 2000);
                setExporting(false);
                setExportType('');
                return;
            }

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            XLSX.writeFile(wb, filename);
            setProgress(100);
            setTimeout(() => setProgress(0), 2000);
        } catch (error) {
            console.error('Erreur export Excel:', error);
            alert('Erreur lors de l\'exportation Excel');
        } finally {
            setExporting(false);
            setExportType('');
        }
    };

    // ========== EXPORT PDF ==========
    const exportPDF = async (type) => {
        setExporting(true);
        setExportType('PDF');
        setProgress(10);

        try {
            let data = [];
            let title = '';
            let headers = [];
            let rows = [];

            if (type === 'projects') {
                data = await fetchData('projects');
                title = 'Liste des Projets';
                headers = [['ID', 'Titre', 'Catégorie', 'Année', 'Featured']];
                setProgress(50);
                rows = data.map(p => [p.id, p.title, p.category || '', p.year || '', p.featured ? '⭐' : '']);
            } else if (type === 'skills') {
                data = await fetchData('skills');
                title = 'Liste des Compétences';
                headers = [['ID', 'Nom', 'Catégorie', 'Niveau', 'Couleur']];
                setProgress(50);
                rows = data.map(s => [s.id, s.name, s.category || '', s.level || 0, s.color || '']);
            } else if (type === 'messages') {
                data = await fetchData('messages');
                title = 'Liste des Messages';
                headers = [['ID', 'Nom', 'Email', 'Statut', 'Date']];
                setProgress(50);
                rows = data.map(m => [m.id, m.name, m.email, m.status || 'unread', new Date(m.created_at).toLocaleDateString('fr-FR')]);
            }

            const doc = new jsPDF('landscape');
            const pageWidth = doc.internal.pageSize.getWidth();

            // Titre
            doc.setFontSize(20);
            doc.setTextColor(0, 102, 255);
            doc.text(title, pageWidth / 2, 20, { align: 'center' });

            // Date
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Exporté le: ${new Date().toLocaleString('fr-FR')}`, 14, 30);

            // Tableau
            doc.autoTable({
                head: headers,
                body: rows,
                startY: 35,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    textColor: [50, 50, 50],
                },
                headStyles: {
                    fillColor: [0, 102, 255],
                    textColor: [255, 255, 255],
                    fontSize: 9,
                    fontStyle: 'bold',
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 245],
                },
            });

            setProgress(90);
            doc.save(`${title.replace(/ /g, '_')}.pdf`);
            setProgress(100);
            setTimeout(() => setProgress(0), 2000);
        } catch (error) {
            console.error('Erreur export PDF:', error);
            alert('Erreur lors de l\'exportation PDF');
        } finally {
            setExporting(false);
            setExportType('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white">📤 Exportation des données</h3>
                    <p className="text-gray-400 text-sm mt-1">Exportez vos données dans différents formats</p>
                </div>
                {exporting && (
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-400 text-sm">Export {exportType}...</span>
                    </div>
                )}
            </div>

            {/* Barre de progression */}
            {exporting && progress > 0 && (
                <div className="w-full">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-right text-xs text-gray-500 mt-1">{progress}%</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Carte CSV */}
                <div className="glass p-5 rounded-xl border border-white/5 hover:border-primary/30 transition group">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📄</span>
                        <h4 className="text-white font-semibold">CSV</h4>
                        <span className="ml-auto text-xs text-gray-500">(Universal)</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Export compatible avec tous les tableurs</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => exportCSV('projects')}
                            disabled={exporting}
                            className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition disabled:opacity-50"
                        >
                            📁 Projets
                        </button>
                        <button
                            onClick={() => exportCSV('skills')}
                            disabled={exporting}
                            className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition disabled:opacity-50"
                        >
                            ⚡ Compétences
                        </button>
                        <button
                            onClick={() => exportCSV('messages')}
                            disabled={exporting}
                            className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition disabled:opacity-50"
                        >
                            ✉️ Messages
                        </button>
                    </div>
                </div>

                {/* Carte Excel */}
                <div className="glass p-5 rounded-xl border border-white/5 hover:border-green-500/30 transition group">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📊</span>
                        <h4 className="text-white font-semibold">Excel</h4>
                        <span className="ml-auto text-xs text-green-400">✓ Avancé</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Export avec mise en forme et multiple sheets</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => exportExcel('projects')}
                            disabled={exporting}
                            className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition disabled:opacity-50"
                        >
                            📁 Projets
                        </button>
                        <button
                            onClick={() => exportExcel('skills')}
                            disabled={exporting}
                            className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition disabled:opacity-50"
                        >
                            ⚡ Compétences
                        </button>
                        <button
                            onClick={() => exportExcel('all')}
                            disabled={exporting}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                        >
                            📦 Tout exporter
                        </button>
                    </div>
                </div>

                {/* Carte PDF */}
                <div className="glass p-5 rounded-xl border border-white/5 hover:border-red-500/30 transition group">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📕</span>
                        <h4 className="text-white font-semibold">PDF</h4>
                        <span className="ml-auto text-xs text-red-400">✓ Pro</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Export professionnel avec mise en page</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => exportPDF('projects')}
                            disabled={exporting}
                            className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition disabled:opacity-50"
                        >
                            📁 Projets
                        </button>
                        <button
                            onClick={() => exportPDF('skills')}
                            disabled={exporting}
                            className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition disabled:opacity-50"
                        >
                            ⚡ Compétences
                        </button>
                        <button
                            onClick={() => exportPDF('messages')}
                            disabled={exporting}
                            className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition disabled:opacity-50"
                        >
                            ✉️ Messages
                        </button>
                    </div>
                </div>
            </div>

            {/* Indicateur de progression */}
            {exporting && (
                <div className="text-center text-gray-500 text-xs">
                    Préparation de l'export... Veuillez patienter
                </div>
            )}
        </div>
    );
};

export default ExportData;