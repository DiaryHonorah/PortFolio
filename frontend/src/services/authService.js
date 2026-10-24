const API_URL = 'http://localhost/portfolio/backend';

export async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true');
        }
        return data;
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Erreur de connexion au serveur' };
    }
}

export async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/check`);
        const data = await response.json();
        return data.isLoggedIn || false;
    } catch (error) {
        console.error('Check auth error:', error);
        return false;
    }
}

export async function logout() {
    try {
        await fetch(`${API_URL}/auth/logout`);
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false };
    }
}

export function getCurrentUser() {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}