/**
 * Génère une URL de partage accessible depuis n'importe quel appareil
 * Utilise l'IP réseau au lieu de localhost
 */
export const getShareableUrl = (path = '') => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
    // Si on est sur localhost, utiliser l'IP réseau
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Récupérer l'IP réseau depuis une variable d'environnement ou une config
        const networkIP = getNetworkIP();
        const baseUrl = `${protocol}//${networkIP}${port ? ':' + port : ''}`;
        return `${baseUrl}${path}`;
    }
    
    // Sinon, utiliser l'URL actuelle
    return `${window.location.origin}${path}`;
};

/**
 * Récupère l'IP réseau (à configurer manuellement)
 */
const getNetworkIP = () => {
    // ⚠️ IMPORTANT : Remplacez par votre IP réseau
    // Pour la trouver : ouvrez PowerShell et tapez `ipconfig`
    // Cherchez "Adresse IPv4" de votre carte Wi-Fi
    return '192.168.1.222'; // ← À REMPLACER par votre IP
};

/**
 * Récupère l'IP réseau de manière dynamique (méthode alternative)
 */
export const getNetworkIPFromEnv = () => {
    // Vite expose les variables d'environnement
    return import.meta.env.VITE_NETWORK_IP || '192.168.1.222';
};

export default getShareableUrl;