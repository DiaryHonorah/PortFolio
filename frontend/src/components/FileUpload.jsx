import React, { useState, useRef } from 'react';

const FileUpload = ({ onFilesChange, maxFiles = 3, maxSize = 5 }) => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return '🖼️';
        if (type === 'application/pdf') return '📕';
        if (type.includes('word')) return '📘';
        if (type.includes('excel') || type.includes('spreadsheet')) return '📗';
        if (type === 'text/plain') return '📄';
        if (type.includes('zip')) return '📦';
        return '📎';
    };

    const handleFileSelect = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setError(null);

        // Vérifier le nombre max de fichiers
        if (files.length + selectedFiles.length > maxFiles) {
            setError(`Maximum ${maxFiles} fichiers autorisés`);
            return;
        }

        // Vérifier la taille de chaque fichier
        const oversizedFiles = selectedFiles.filter(f => f.size > maxSize * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            setError(`Fichier(s) trop volumineux (max ${maxSize}MB)`);
            return;
        }

        setUploading(true);
        const uploadedFiles = [];

        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost/portfolio/backend/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    uploadedFiles.push({
                        file_name: data.file_name,
                        file_path: data.file_path,
                        file_type: data.file_type,
                        file_size: data.file_size,
                        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
                    });
                } else {
                    setError(data.error || 'Erreur upload');
                }
            } catch (error) {
                console.error('Erreur:', error);
                setError('Erreur de connexion');
            }
        }

        const newFiles = [...files, ...uploadedFiles];
        setFiles(newFiles);
        onFilesChange(newFiles);
        setUploading(false);

        // Réinitialiser l'input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFilesChange(newFiles);
    };

    return (
        <div className="space-y-3">
            <label className="block text-gray-300 text-sm font-semibold">
                📎 Pièces jointes (max {maxFiles} fichiers, {maxSize}MB chacun)
            </label>

            {/* Zone de dépôt */}
            <div 
                className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-secondary/50 transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                />
                
                {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-400 text-sm">Upload en cours...</span>
                    </div>
                ) : (
                    <>
                        <p className="text-3xl mb-2">📎</p>
                        <p className="text-gray-400 text-sm">
                            Cliquez ou glissez des fichiers ici
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            Images, PDF, Word, Excel, ZIP
                        </p>
                    </>
                )}
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg text-xs">
                    ❌ {error}
                </div>
            )}

            {/* Liste des fichiers */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="text-gray-400 text-xs">{files.length} fichier(s) joint(s)</p>
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 glass p-2 rounded-lg">
                            {/* Aperçu ou icône */}
                            {file.preview ? (
                                <img 
                                    src={file.preview} 
                                    alt={file.file_name}
                                    className="w-10 h-10 object-cover rounded"
                                />
                            ) : (
                                <span className="text-2xl">{getFileIcon(file.file_type)}</span>
                            )}

                            {/* Informations */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm truncate">{file.file_name}</p>
                                <p className="text-gray-500 text-xs">{formatSize(file.file_size)}</p>
                            </div>

                            {/* Bouton supprimer */}
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-400 hover:text-red-300 transition p-1"
                                title="Supprimer"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;