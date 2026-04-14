/**
 * auth.js
 * Frontend utility to handle authentication state and route protection
 */

const Auth = {
    login: async (username, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('hospital_token', data.data.token || 'demo-token');
                localStorage.setItem('hospital_role', String(data.data.role || '').toLowerCase());
                localStorage.setItem('hospital_username', data.data.username || username);
                return data;
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('hospital_token');
        localStorage.removeItem('hospital_role');
        localStorage.removeItem('hospital_username');
        window.location.href = '/index.html';
    },

    isLoggedIn: () => {
        return !!localStorage.getItem('hospital_token');
    },

    getUserRole: () => {
        return (localStorage.getItem('hospital_role') || '').toLowerCase();
    },

    getUsername: () => {
        return localStorage.getItem('hospital_username') || 'Guest';
    },

    protectRoute: (allowedRoles = []) => {
        if (!Auth.isLoggedIn()) {
            window.location.href = '/index.html';
            return;
        }

        const role = Auth.getUserRole();
        const normalizedAllowed = allowedRoles.map(r => String(r).toLowerCase());

        if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(role)) {
            Auth.redirectToDashboard();
        }
    },

    redirectToDashboard: () => {
        const role = Auth.getUserRole();

        if (role === 'admin') {
            window.location.href = '/dashboard-admin.html';
        } else if (role === 'doctor') {
            window.location.href = '/dashboard-doctor.html';
        } else if (role === 'receptionist') {
            window.location.href = '/dashboard-receptionist.html';
        } else {
            Auth.logout();
        }
    }
};