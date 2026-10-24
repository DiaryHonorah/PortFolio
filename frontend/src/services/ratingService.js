const API_URL = 'http://localhost/portfolio/backend';

// Récupérer la note d'un projet
export const getProjectRating = async (projectId) => {
    try {
        const response = await fetch(`${API_URL}/projects/${projectId}/rating`);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { average: 0, total: 0, user_rating: false };
    }
};

// Noter un projet
export const rateProject = async (projectId, rating, comment = null) => {
    try {
        const response = await fetch(`${API_URL}/projects/${projectId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, comment })
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false, error: 'Erreur de connexion' };
    }
};

// Récupérer toutes les notes d'un projet
export const getProjectRatings = async (projectId) => {
    try {
        const response = await fetch(`${API_URL}/projects/${projectId}/ratings`);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

// Récupérer le top des projets
export const getTopRatedProjects = async (limit = 5) => {
    try {
        const response = await fetch(`${API_URL}/ratings/top?limit=${limit}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

// Récupérer les statistiques globales
export const getGlobalRatingStats = async () => {
    try {
        const response = await fetch(`${API_URL}/ratings/stats`);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { total_ratings: 0, global_average: 0, rated_projects: 0, unique_voters: 0 };
    }
};