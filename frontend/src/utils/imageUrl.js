const BACKEND_URL = 'http://localhost/portfolio/backend';

/**
 * Convertit un chemin relatif en URL complète
 * @param {string} path - Le chemin de l'image
 * @returns {string} - L'URL complète
 */
export const getImageUrl = (path) => {
    if (!path) return '';
    
    // Si c'est déjà une URL complète
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Si le chemin commence par /portfolio/backend/
    if (path.startsWith('/portfolio/backend/')) {
        return `http://localhost${path}`;
    }
    
    // Si le chemin commence par /
    if (path.startsWith('/')) {
        return `${BACKEND_URL}${path}`;
    }
    
    // Sinon, on ajoute le préfixe
    return `${BACKEND_URL}/${path}`;
};

export default getImageUrl;