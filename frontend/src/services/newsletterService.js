const API_URL = 'http://localhost/portfolio/backend';

// Inscription à la newsletter
export const subscribeNewsletter = async (email, name = null) => {
    try {
        const response = await fetch(`${API_URL}/newsletter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name })
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur inscription newsletter:', error);
        return { success: false, error: 'Erreur de connexion' };
    }
};

// Vérifier la confirmation
export const checkConfirmation = async (token) => {
    try {
        const response = await fetch(`${API_URL}/newsletter/confirm/${token}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur confirmation:', error);
        return { success: false, error: 'Erreur de connexion' };
    }
};

// Récupérer les abonnés (admin)
export const getSubscribers = async (onlyConfirmed = false) => {
    try {
        const url = onlyConfirmed 
            ? `${API_URL}/newsletter/subscribers?confirmed=true`
            : `${API_URL}/newsletter/subscribers`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Erreur abonnés:', error);
        return [];
    }
};

// Récupérer le nombre d'abonnés
export const getSubscribersCount = async () => {
    try {
        const response = await fetch(`${API_URL}/newsletter/count`);
        return await response.json();
    } catch (error) {
        console.error('Erreur comptage:', error);
        return { total: 0, confirmed: 0 };
    }
};

// Se désabonner
export const unsubscribeNewsletter = async (email) => {
    try {
        const response = await fetch(`${API_URL}/newsletter/unsubscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur désabonnement:', error);
        return { success: false, error: 'Erreur de connexion' };
    }
};

// Supprimer un abonné (admin)
export const deleteSubscriber = async (id) => {
    try {
        const response = await fetch(`${API_URL}/newsletter/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur suppression:', error);
        return { success: false, error: 'Erreur de connexion' };
    }
};