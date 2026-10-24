const API_URL = 'http://localhost/portfolio/backend';

// Générer un ID de session unique
const getSessionId = () => {
    let sessionId = sessionStorage.getItem('visitor_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('visitor_session_id', sessionId);
    }
    return sessionId;
};

// Enregistrer une visite
export const registerVisit = async (page = 'home') => {
    try {
        const response = await fetch(`${API_URL}/visits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                page: page,
                session_id: getSessionId()
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur enregistrement visite:', error);
        return { success: false };
    }
};

// Récupérer les statistiques de visites
export const getVisitStats = async () => {
    try {
        const response = await fetch(`${API_URL}/visits`);
        return await response.json();
    } catch (error) {
        console.error('Erreur stats visites:', error);
        return {
            total: 0,
            unique_visitors: 0,
            today: 0,
            by_page: [],
            last_7_days: []
        };
    }
};