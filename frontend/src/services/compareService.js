const API_URL = 'http://localhost/portfolio/backend';

// Comparer 2 projets
export const compareProjects = async (projectIds) => {
    try {
        if (!Array.isArray(projectIds) || projectIds.length < 2) {
            return { error: 'Au moins 2 projets requis' };
        }
        
        const ids = projectIds.slice(0, 2).join(',');
        const response = await fetch(`${API_URL}/projects/compare?ids=${ids}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { error: 'Erreur de connexion' };
    }
};