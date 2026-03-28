
/**
 * Simple Authentication and "Database" simulation using localStorage
 */

const STORAGE_KEY = 'marirych_users';
const SESSION_KEY = 'marirych_current_user';

// Detect if localStorage is actually working across pages
let isLocalStorageAvailable = false;
try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    isLocalStorageAvailable = true;
} catch (e) {
    console.error('LocalStorage is blocked or not available:', e);
}

// Memory fallback if localStorage is blocked
let memoryStorage = {};
const storage = {
    getItem(key) {
        if (isLocalStorageAvailable) {
            try { return localStorage.getItem(key); } 
            catch (e) { return memoryStorage[key] || null; }
        }
        return memoryStorage[key] || null;
    },
    setItem(key, val) {
        if (isLocalStorageAvailable) {
            try { localStorage.setItem(key, val); } 
            catch (e) { memoryStorage[key] = val; }
        } else {
            memoryStorage[key] = val;
        }
    },
    removeItem(key) {
        if (isLocalStorageAvailable) {
            try { localStorage.removeItem(key); } 
            catch (e) { delete memoryStorage[key]; }
        } else {
            delete memoryStorage[key];
        }
    }
};

// Mock some initial data if empty
if (!storage.getItem(STORAGE_KEY)) {
    const initialUsers = [
        { username: 'admin', password: '123', role: 'teacher' },
        { username: 'student', password: '456', role: 'student' }
    ];
    storage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
}

const Auth = {
    getUsers() {
        return JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
    },

    login(username, password) {
        console.log('Logging in with:', username);
        const users = this.getUsers();
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
        if (user) {
            storage.setItem(SESSION_KEY, JSON.stringify(user));
            return user;
        }
        return null;
    },

    logout() {
        storage.removeItem(SESSION_KEY);
        window.location.href = 'index.html';
    },

    getCurrentUser() {
        const user = storage.getItem(SESSION_KEY);
        return user ? JSON.parse(user) : null;
    },

    isTeacher() {
        const user = this.getCurrentUser();
        return user && user.role === 'teacher';
    },

    checkAuth(requiredRole = null) {
        const user = this.getCurrentUser();
        if (!user) {
            console.warn('Auth check failed: No user found. Redirecting to login.html');
            window.location.href = 'login.html';
            return;
        }
        if (requiredRole && user.role !== requiredRole) {
            window.location.href = 'index.html';
            return;
        }
    },

    isStorageHealthy() {
        return isLocalStorageAvailable;
    }
};

window.Auth = Auth;
