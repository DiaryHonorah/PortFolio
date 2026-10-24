import React, { useState, useRef } from 'react';
import { getImageUrl } from '../../utils/imageUrl';

const ImageUpload = ({ onUpload, onRemove, currentImage, label = 'Image' }) => {
    const [preview, setPreview] = useState(currentImage || null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            setError('Veuillez sélectionner une image');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('L\'image ne doit pas dépasser 5MB');
            return;
        }

        setError(null);
        setUploading(true);
        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('Envoi du fichier:', file.name);
            
            const response = await fetch('http://localhost/portfolio/backend/upload', {
                method: 'POST',
                body: formData
            });

            console.log('Statut réponse:', response.status);

            const text = await response.text();
            console.log('Réponse brute:', text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('Erreur parsing JSON:', parseError);
                setError('Réponse invalide du serveur');
                setPreview(currentImage || null);
                return;
            }

            console.log('Données reçues:', data);

            if (data.success) {
                setPreview(data.file_path);
                if (onUpload) {
                    onUpload(data.file_path);
                }
            } else {
                setError(data.error || 'Erreur lors de l\'upload');
                setPreview(currentImage || null);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setError('Erreur de connexion au serveur: ' + error.message);
            setPreview(currentImage || null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onRemove) {
            onRemove();
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-gray-300 text-sm font-semibold">{label}</label>

            <div className="flex flex-col items-center gap-4">
                {/* Aperçu */}
                {preview && (
                    <div className="relative">
                        <div className="w-48 h-32 rounded-lg overflow-hidden border-2 border-white/10">
                            <img
                                src={getImageUrl(preview)}
                                alt="Aperçu"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.error('Erreur chargement image:', preview);
                                    e.target.onerror = null;
                                    e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect fill='%231a1a2e' width='200' height='150'/%3E%3Ctext x='100' y='75' text-anchor='middle' dy='.3em' fill='%230066FF' font-size='24'%3E🖼️%3C/text%3E%3C/svg%3E`;
                                }}
                            />
                        </div>
                        <button
                            onClick={handleRemove}
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition text-sm"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                />

                <div className="flex flex-wrap gap-3">
                    <label
                        htmlFor="image-upload"
                        className={`glass px-4 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition text-sm ${
                            uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {uploading ? '⏳ Upload...' : '📁 Choisir une image'}
                    </label>
                    {preview && !uploading && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm transition"
                        >
                            🗑️ Supprimer
                        </button>
                    )}
                </div>

                {/* Messages */}
                {error && (
                    <p className="text-red-400 text-xs">{error}</p>
                )}
                {uploading && (
                    <p className="text-gray-400 text-xs">⏳ Téléchargement en cours...</p>
                )}
                <p className="text-gray-500 text-xs">Formats: JPG, PNG, GIF, WEBP • Max: 5MB</p>
            </div>
        </div>
    );
};

export default ImageUpload;