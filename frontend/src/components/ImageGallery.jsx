import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUrl';

const ImageGallery = ({ images = [], projectTitle = '' }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Ouvrir la lightbox
    const openLightbox = (index) => {
        setCurrentIndex(index);
        setSelectedImage(images[index]);
        document.body.style.overflow = 'hidden';
    };

    // Fermer la lightbox
    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    // Image suivante
    const nextImage = (e) => {
        if (e) e.stopPropagation();
        const newIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(newIndex);
        setSelectedImage(images[newIndex]);
    };

    // Image précédente
    const prevImage = (e) => {
        if (e) e.stopPropagation();
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        setCurrentIndex(newIndex);
        setSelectedImage(images[newIndex]);
    };

    // Navigation clavier
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedImage) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, currentIndex]);

    if (!images || images.length === 0) return null;

    return (
        <>
            {/* Galerie de miniatures */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((image, index) => (
                    <div
                        key={image.id || index}
                        onClick={() => openLightbox(index)}
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group border border-white/10 hover:border-secondary transition"
                    >
                        <img
                            src={getImageUrl(image.image_url)}
                            alt={image.caption || `${projectTitle} - Image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect fill='%231a1a2e' width='200' height='150'/%3E%3Ctext x='100' y='75' text-anchor='middle' dy='.3em' fill='%230066FF' font-size='24'%3E🖼️%3C/text%3E%3C/svg%3E`;
                            }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                            <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition">
                                🔍
                            </span>
                        </div>
                        {image.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <p className="text-white text-xs truncate">{image.caption}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
                    onClick={closeLightbox}
                >
                    {/* Bouton fermer */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white text-3xl hover:text-red-400 transition z-10 w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10"
                        aria-label="Fermer"
                    >
                        ✕
                    </button>

                    {/* Compteur */}
                    <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Navigation précédente */}
                    {images.length > 1 && (
                        <button
                            onClick={prevImage}
                            className="absolute left-4 text-white text-4xl hover:text-secondary transition z-10 w-14 h-14 flex items-center justify-center rounded-full hover:bg-white/10"
                            aria-label="Image précédente"
                        >
                            ‹
                        </button>
                    )}

                    {/* Image principale */}
                    <div 
                        className="max-w-4xl max-h-[80vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={getImageUrl(selectedImage.image_url)}
                            alt={selectedImage.caption || 'Image'}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%231a1a2e' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='.3em' fill='%230066FF' font-size='48'%3E🖼️%3C/text%3E%3C/svg%3E`;
                            }}
                        />
                        {selectedImage.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                                <p className="text-white text-center">{selectedImage.caption}</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation suivante */}
                    {images.length > 1 && (
                        <button
                            onClick={nextImage}
                            className="absolute right-4 text-white text-4xl hover:text-secondary transition z-10 w-14 h-14 flex items-center justify-center rounded-full hover:bg-white/10"
                            aria-label="Image suivante"
                        >
                            ›
                        </button>
                    )}

                    {/* Miniatures en bas */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(idx);
                                        setSelectedImage(images[idx]);
                                    }}
                                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                                        idx === currentIndex 
                                            ? 'border-secondary scale-110' 
                                            : 'border-white/20 hover:border-white/50'
                                    }`}
                                >
                                    <img
                                        src={getImageUrl(img.image_url)}
                                        alt={`Miniature ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ImageGallery;