import React, { useState, useEffect, useRef } from 'react';
import { 
    getProjectImages, 
    addProjectImage, 
    deleteProjectImage,
    uploadMultipleImages
} from '../../services/galleryService';
import { getImageUrl } from '../../utils/imageUrl';

const ProjectGallery = ({ projectId, projectTitle }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (projectId) {
            fetchImages();
        }
    }, [projectId]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const data = await getProjectImages(projectId);
            setImages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setError(null);
        setUploading(true);

        // Vérifier la taille et le type
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                setError('Seules les images sont autorisées');
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Les images ne doivent pas dépasser 5MB');
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) {
            setUploading(false);
            return;
        }

        try {
            const result = await uploadMultipleImages(validFiles);
            
            if (result.success && result.files) {
                // Ajouter chaque image à la base
                for (const file of result.files) {
                    await addProjectImage({
                        project_id: projectId,
                        image_url: file.file_path,
                        caption: ''
                    });
                }
                
                await fetchImages();
            } else {
                setError(result.error || 'Erreur lors de l\'upload');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur de connexion');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette image ?')) {
            const result = await deleteProjectImage(id);
            if (result.success) {
                await fetchImages();
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 text-sm mt-2">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-white font-semibold">
                    🖼️ Galerie ({images.length} image{images.length > 1 ? 's' : ''})
                </h4>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-primary hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition text-white disabled:opacity-50"
                >
                    {uploading ? '⏳ Upload...' : '➕ Ajouter des images'}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg text-sm">
                    ❌ {error}
                </div>
            )}

            {images.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
                    <p className="text-4xl mb-2">🖼️</p>
                    <p className="text-gray-400 text-sm">Aucune image dans la galerie</p>
                    <p className="text-gray-500 text-xs mt-1">Cliquez sur "Ajouter des images" pour commencer</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((image) => (
                        <div 
                            key={image.id} 
                            className="relative group aspect-video rounded-lg overflow-hidden border border-white/10"
                        >
                            <img
                                src={getImageUrl(image.image_url)}
                                alt={image.caption || 'Image du projet'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.error('Erreur image:', image.image_url);
                                    e.target.onerror = null;
                                    e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect fill='%231a1a2e' width='200' height='150'/%3E%3Ctext x='100' y='75' text-anchor='middle' dy='.3em' fill='%230066FF' font-size='24'%3E🖼️%3C/text%3E%3C/svg%3E`;
                                }}
                            />
                            
                            {/* Overlay avec actions */}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDelete(image.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
                                    title="Supprimer"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-gray-500 text-xs">
                💡 Formats acceptés : JPG, PNG, GIF, WEBP • Max 5MB par image
            </p>
        </div>
    );
};

export default ProjectGallery;