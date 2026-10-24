const API_URL = 'http://localhost/portfolio/backend';

// Récupérer tous les événements
export const getTimelineEvents = async (type = null) => {
    try {
        const url = type && type !== 'all'
            ? `${API_URL}/timeline?type=${type}`
            : `${API_URL}/timeline`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

// Récupérer un événement par ID
export const getTimelineEvent = async (id) => {
    try {
        const response = await fetch(`${API_URL}/timeline/${id}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
};

// Créer un événement
export const createTimelineEvent = async (data) => {
    try {
        const response = await fetch(`${API_URL}/timeline`, {
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

// Mettre à jour un événement
export const updateTimelineEvent = async (id, data) => {
    try {
        const response = await fetch(`${API_URL}/timeline/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false };
    }
};

// Supprimer un événement
export const deleteTimelineEvent = async (id) => {
    try {
        const response = await fetch(`${API_URL}/timeline/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false };
    }
};

// Récupérer les types
export const getTimelineTypes = async () => {
    try {
        const response = await fetch(`${API_URL}/timeline-types`);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};