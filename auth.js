
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
        { username: 'student', password: '456', role: 'student', progress: { moduleId: 1, subModuleIdx: 2, title: 'Грамматическая основа' } },
        { username: 'мария', password: '789', role: 'student', progress: { moduleId: 1, subModuleIdx: 0, title: 'Введение' } }
    ];
    storage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
}

const Auth = {
    getUsers() {
        try {
            return JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
        } catch(e) { return []; }
    },

    saveUsers(users) {
        storage.setItem(STORAGE_KEY, JSON.stringify(users));
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
        if (!user) return null;
        try {
            const parsed = JSON.parse(user);
            // Always refresh from "db" to get latest progress
            const dbUsers = this.getUsers();
            return dbUsers.find(u => u.username === parsed.username) || parsed;
        } catch(e) { return null; }
    },

    updateProgress(moduleId, subModuleIdx, title) {
        const currentUser = this.getCurrentUser();
        if (!currentUser || currentUser.role !== 'student') return;

        const users = this.getUsers();
        const userIdx = users.findIndex(u => u.username === currentUser.username);
        
        if (userIdx !== -1) {
            users[userIdx].progress = {
                moduleId,
                subModuleIdx,
                title,
                timestamp: new Date().toISOString()
            };
            this.saveUsers(users);
            // Update session too
            storage.setItem(SESSION_KEY, JSON.stringify(users[userIdx]));
            console.log('Progress updated for', currentUser.username);
        }
    },

    isTeacher() {
        const user = this.getCurrentUser();
        return user && user.role === 'teacher';
    },

    checkAuth(requiredRole = null) {
        const user = this.getCurrentUser();
        if (!user) {
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
