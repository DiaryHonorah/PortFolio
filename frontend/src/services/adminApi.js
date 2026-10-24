const API_URL = 'http://localhost/portfolio/backend';

// ========== GESTION DES PROJETS ==========
export const getProjects = async (featured = null) => {
    const url = featured !== null ? `${API_URL}/projects?featured=${featured}` : `${API_URL}/projects`;
    const response = await fetch(url);
    return response.json();
};

export const getProjectById = async (id) => {
    const response = await fetch(`${API_URL}/projects/${id}`);
    return response.json();
};

export const createProject = async (data) => {
    const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const updateProject = async (id, data) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const deleteProject = async (id) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE'
    });
    return response.json();
};

// ========== GESTION DES COMPÉTENCES ==========
export const getSkills = async () => {
    const response = await fetch(`${API_URL}/skills`);
    return response.json();
};

export const createSkill = async (data) => {
    const response = await fetch(`${API_URL}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const updateSkill = async (id, data) => {
    const response = await fetch(`${API_URL}/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const deleteSkill = async (id) => {
    const response = await fetch(`${API_URL}/skills/${id}`, {
        method: 'DELETE'
    });
    return response.json();
};

// ========== GESTION DES MESSAGES ==========
export const getMessages = async (status = null) => {
    const url = status ? `${API_URL}/messages?status=${status}` : `${API_URL}/messages`;
    const response = await fetch(url);
    return response.json();
};

export const updateMessageStatus = async (id, status) => {
    const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    return response.json();
};

export const deleteMessage = async (id) => {
    const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'DELETE'
    });
    return response.json();
};