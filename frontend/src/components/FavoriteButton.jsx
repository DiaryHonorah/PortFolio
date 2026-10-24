import React, { useState, useEffect } from 'react';

const FavoriteButton = ({ projectId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFavorites();
    }, [projectId]);

    const fetchFavorites = async () => {
        try {
            const response = await fetch(`http://localhost/portfolio/backend/favorites/${projectId}`);
            const data = await response.json();
            setCount(data.count || 0);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const toggleFavorite = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost/portfolio/backend/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: projectId })
            });
            const data = await response.json();
            
            if (data.success) {
                setIsFavorite(data.action === 'added');
                setCount(data.count);
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`flex items-center gap-1 text-sm transition ${
                isFavorite ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
            <span className="text-lg">{isFavorite ? '❤️' : '🤍'}</span>
            <span>{count}</span>
        </button>
    );
};

export default FavoriteButton;