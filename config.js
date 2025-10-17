/**
 * Configuration globale du portail
 * À modifier selon votre environnement
 */

// Déterminer l'environnement automatiquement
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

// Configuration de l'API
const API_CONFIG = {
    // Development (local)
    DEV: 'http://localhost:5000',
    
    // Production (URL actuelle du site)
    PROD: `${window.location.protocol}//${window.location.host}`,
    
    // Sélection de l'environnement (automatique)
    CURRENT: isDevelopment ? 'DEV' : 'PROD'
};

// Fonction pour obtenir l'URL de l'API
function getApiUrl() {
    return API_CONFIG[API_CONFIG.CURRENT];
}

// Debug info (à commenter en production)
// console.log('API URL:', getApiUrl());
// console.log('Environment:', API_CONFIG.CURRENT);

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, getApiUrl };
}