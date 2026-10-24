const API_URL = 'http://localhost/portfolio/backend';

// Récupérer tous les projets
export const getProjects = async (featured = null) => {
    const url = featured !== null 
        ? `${API_URL}/projects?featured=${featured}`
        : `${API_URL}/projects`;
    const response = await fetch(url);
    return response.json();
};

// Récupérer les compétences
export const getSkills = async () => {
    const response = await fetch(`${API_URL}/skills`);
    return response.json();
};

// Récupérer les compétences par catégorie
export const getSkillsByCategory = async (category) => {
    const response = await fetch(`${API_URL}/skills/${category}`);
    return response.json();
};

// Récupérer les catégories de compétences
export const getSkillCategories = async () => {
    const response = await fetch(`${API_URL}/skills-categories`);
    return response.json();
};

// Envoyer un message
export const sendMessage = async (data) => {
    const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};