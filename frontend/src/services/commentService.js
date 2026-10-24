const API_URL = 'http://localhost/portfolio/backend';

// Récupérer les commentaires d'un projet
export const getProjectComments = async (projectId, includeAll = false) => {
    try {
        const url = includeAll 
            ? `${API_URL}/projects/${projectId}/comments?all=true`
            : `${API_URL}/projects/${projectId}/comments`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

// Récupérer tous les commentaires (admin)
export const getAllComments = async (approved = null) => {
    try {
        const url = approved !== null
            ? `${API_URL}/comments?approved=${approved}`
            : `${API_URL}/comments`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

// Créer un commentaire
export const createComment = async (data) => {
    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false, error: 'Erreur de connexion' };
    }
};

// Approuver un commentaire
export const approveComment = async (id) => {
    try {
        const response = await fetch(`${API_URL}/comments/${id}/approve`, {
            method: 'PUT'
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false };
    }
};

// Rejeter un commentaire
export const rejectComment = async (id) => {
    try {
        const response = await fetch(`${API_URL}/comments/${id}/reject`, {
            method: 'PUT'
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false };
    }
};

// Supprimer un commentaire
export const deleteComment = async (id) => {
    try {
        const response = await fetch(`${API_URL}/comments/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false };
    }
};

// Compter les commentaires
export const getCommentsCount = async () => {
    try {
        const response = await fetch(`${API_URL}/comments-count`);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { total: 0, approved: 0, pending: 0 };
    }
};