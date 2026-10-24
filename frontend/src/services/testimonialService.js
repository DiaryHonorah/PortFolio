const API_URL = 'http://localhost/portfolio/backend';

// Récupérer les témoignages approuvés
export const getApprovedTestimonials = async (limit = null) => {
    try {
        const url = limit 
            ? `${API_URL}/testimonials-approved?limit=${limit}`
            : `${API_URL}/testimonials-approved`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

// Récupérer tous les témoignages (admin)
export const getAllTestimonials = async (approved = null) => {
    try {
        const url = approved !== null
            ? `${API_URL}/testimonials?approved=${approved}`
            : `${API_URL}/testimonials`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

// Créer un témoignage
export const createTestimonial = async (data) => {
    try {
        const response = await fetch(`${API_URL}/testimonials`, {
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

// Approuver un témoignage
export const approveTestimonial = async (id) => {
    try {
        const response = await fetch(`${API_URL}/testimonials/${id}/approve`, {
            method: 'PUT'
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false };
    }
};

// Rejeter un témoignage
export const rejectTestimonial = async (id) => {
    try {
        const response = await fetch(`${API_URL}/testimonials/${id}/reject`, {
            method: 'PUT'
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false };
    }
};

// Supprimer un témoignage
export const deleteTestimonial = async (id) => {
    try {
        const response = await fetch(`${API_URL}/testimonials/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false };
    }
};

// Récupérer les statistiques
export const getTestimonialsCount = async () => {
    try {
        const response = await fetch(`${API_URL}/testimonials-count`);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { total: 0, approved: 0, pending: 0, average_rating: 0 };
    }
};