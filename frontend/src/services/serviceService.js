const API_URL = 'http://localhost/portfolio/backend';

export const getServices = async (activeOnly = false) => {
    try {
        const url = activeOnly
            ? `${API_URL}/services?active=true`
            : `${API_URL}/services`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

export const createService = async (data) => {
    try {
        const response = await fetch(`${API_URL}/services`, {
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

export const updateService = async (id, data) => {
    try {
        const response = await fetch(`${API_URL}/services/${id}`, {
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

export const deleteService = async (id) => {
    try {
        const response = await fetch(`${API_URL}/services/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false };
    }
};