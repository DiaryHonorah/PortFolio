const API_URL = 'http://localhost/portfolio/backend';

// Récupérer les images d'un projet
export const getProjectImages = async (projectId) => {
    try {
        const response = await fetch(`${API_URL}/projects/${projectId}/images`);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

// Ajouter une image à un projet
export const addProjectImage = async (data) => {
    try {
        const response = await fetch(`${API_URL}/project-images`, {
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

// Modifier une image
export const updateProjectImage = async (id, data) => {
    try {
        const response = await fetch(`${API_URL}/project-images/${id}`, {
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

// Supprimer une image
export const deleteProjectImage = async (id) => {
    try {
        const response = await fetch(`${API_URL}/project-images/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false };
    }
};

// Upload multiple d'images
export const uploadMultipleImages = async (files) => {
    try {
        const formData = new FormData();
        
        // ✅ Utiliser 'images' (sans crochets)
        files.forEach(file => {
            formData.append('images', file);
        });
        
        console.log(`Upload de ${files.length} fichier(s)`);
        
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
            // ⚠️ NE PAS ajouter Content-Type, le navigateur le fait
        });
        
        console.log('Statut:', response.status);
        
        const text = await response.text();
        console.log('Réponse:', text);
        
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Erreur parsing:', e);
            return { success: false, error: 'Réponse invalide du serveur' };
        }
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false, error: 'Erreur de connexion' };
    }
};