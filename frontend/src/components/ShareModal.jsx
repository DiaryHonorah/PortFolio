import React, { useState, useEffect } from 'react';
import ShareButtons from './ShareButtons';

const ShareModal = ({ isOpen, onClose, project }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !project) return null;

    return (
        <div 
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="glass p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                            📤 Partager le projet
                        </h3>
                        <p className="text-gray-400 text-sm">{project.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition"
                        aria-label="Fermer"
                    >
                        ✕
                    </button>
                </div>

                {project.image_url && (
                    <div className="mb-6 rounded-lg overflow-hidden border border-white/10">
                        <img 
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>
                )}

                {/* ✅ Sans URL fixe - ShareButtons génère automatiquement */}
                <ShareButtons 
                    title={project.title}
                    compact={false}
                    showQR={true}
                />

                {project.description && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-gray-400 text-sm mb-2">📝 Description :</p>
                        <p className="text-gray-300 text-sm">{project.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareModal;