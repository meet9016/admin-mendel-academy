import { clearToken } from './tokenManager';

export const logout = () => {
    // Clear token from both localStorage and cookies
    clearToken();

    // Clear user data from localStorage
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
    }

    // Redirect to signin page
    window.location.href = '/signin';
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('auth_token');
    return !!token;
};