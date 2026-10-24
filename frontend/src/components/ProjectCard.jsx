import React, { useState, useEffect } from 'react';
import FavoriteButton from './FavoriteButton';
import ImageGallery from './ImageGallery';
import ProjectRating from './ProjectRating';
import ShareButtons from './ShareButtons';
import ShareModal from './ShareModal';
import CommentSection from './CommentSection';
import { getImageUrl } from '../utils/imageUrl';

const ProjectCard = ({ project, index }) => {
    const [images, setImages] = useState([]);
    const [showGallery, setShowGallery] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Vérifier si l'utilisateur est admin
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                setIsAdmin(userData.role === 'admin');
            } catch (e) {
                setIsAdmin(false);
            }
        }
    }, []);

    // Récupérer les images du projet
    useEffect(() => {
        const fetchImages = async () => {
            if (!project.id) return;
            
            try {
                const response = await fetch(`http://localhost/portfolio/backend/projects/${project.id}/images`);
                const data = await response.json();
                setImages(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Erreur chargement images:', error);
                setImages([]);
            } finally {
                setImagesLoaded(true);
            }
        };
        
        fetchImages();
    }, [project.id]);

    const colors = ['border-primary', 'border-secondary', 'border-accent', 'border-cyan-400', 'border-emerald-400'];

    return (
        <>
            <div
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={`glass p-6 rounded-2xl border-l-4 ${colors[index % colors.length]} hover:scale-[1.02] transition duration-300`}
            >
                {/* Image principale du projet */}
                {project.image_url && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                        <img 
                            src={getImageUrl(project.image_url)}
                            alt={project.title}
                            className="w-full h-32 object-cover hover:scale-110 transition duration-500"
                            onError={(e) => { 
                                console.error('Erreur image principale:', project.image_url);
                                e.target.style.display = 'none'; 
                            }}
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Titre */}
                <h3 className="text-xl font-bold text-white mb-2">
                    {project.title || 'Projet sans titre'}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4">
                    {project.description || 'Aucune description'}
                </p>

                {/* Catégorie */}
                {project.category && (
                    <span className="inline-block bg-primary/20 text-primary text-xs px-3 py-1 rounded-full mb-3">
                        {project.category}
                    </span>
                )}

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies && Array.isArray(project.technologies) && 
                        project.technologies.slice(0, 4).map((tech, i) => (
                            <span key={i} className="bg-white/5 text-xs px-3 py-1 rounded-full text-gray-300">
                                {tech}
                            </span>
                        ))}
                    {project.technologies && Array.isArray(project.technologies) && 
                        project.technologies.length > 4 && (
                            <span className="bg-white/5 text-xs px-3 py-1 rounded-full text-gray-500">
                                +{project.technologies.length - 4}
                            </span>
                        )}
                </div>

                {/* Année */}
                {project.year && (
                    <p className="text-gray-500 text-xs mb-3">
                        📅 {project.year}
                    </p>
                )}

                {/* 🔒 Galerie d'images - ADMIN UNIQUEMENT */}
                

                {/* Bouton commentaires */}
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="mb-3 text-secondary hover:text-cyan-300 text-sm flex items-center gap-1 transition"
                >
                    💬 {showComments ? 'Masquer' : 'Voir'} les commentaires
                </button>

                {/* Section commentaires */}
                {showComments && (
                    <div className="mb-4 pt-4 border-t border-white/10 animate-fadeIn">
                        <CommentSection projectId={project.id} />
                    </div>
                )}

                {/* Notation et Partage */}
                <div className="mb-3 pt-3 border-t border-white/5 flex justify-between items-center gap-2 flex-wrap">
                    <ProjectRating projectId={project.id} compact />
                    <div className="flex items-center gap-2">
                        <ShareButtons 
                            title={project.title}
                            compact={true}
                            showQR={false}
                        />
                        <button
                            type="button"
                            onClick={() => setShowShareModal(true)}
                            className="text-gray-400 hover:text-secondary transition p-1 text-lg"
                            title="Plus d'options de partage"
                        >
                            📱
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <div className="flex gap-4">
                        {project.github_url && (
                            <a 
                                href={project.github_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-secondary hover:text-cyan-300 transition flex items-center gap-1 text-sm"
                            >
                                <span>💻</span> Code
                            </a>
                        )}
                        {project.demo_url && (
                            <a 
                                href={project.demo_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary hover:text-blue-300 transition flex items-center gap-1 text-sm"
                            >
                                <span>🔗</span> Demo
                            </a>
                        )}
                        {!project.github_url && !project.demo_url && (
                            <span className="text-gray-500 text-sm">Projet académique</span>
                        )}
                    </div>
                    
                    {/* Bouton Favori */}
                    <FavoriteButton projectId={project.id} />
                </div>
            </div>

            {/* Modale de partage */}
            <ShareModal 
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                project={project}
            />
        </>
    );
};

export default ProjectCard;