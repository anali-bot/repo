// Vérifier si l'utilisateur est déjà connecté
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showMainContent();
    }
});

// Récupérer les éléments du DOM
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginScreen = document.getElementById('login-screen');
const mainContent = document.getElementById('main-content');

// Gérer la soumission du formulaire
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Identifiants de connexion (À modifier selon tes besoins)
    const validUsername = 'admin';
    const validPassword = '1234';
    
    // Valider les identifiants
    if (username === validUsername && password === validPassword) {
        // Connexion réussie
        localStorage.setItem('isLoggedIn', 'true');
        showMainContent();
    } else {
        // Connexion échouée
        alert('Identifiants invalides! Essaie:\nUtilisateur: admin\nMot de passe: 31012012');
        passwordInput.value = '';
        usernameInput.focus();
    }
});

// Fonction pour afficher le contenu principal
function showMainContent() {
    loginScreen.classList.add('hidden');
    mainContent.classList.remove('hidden');
}

// Fonction pour se déconnecter (optionnel)
function logout() {
    localStorage.removeItem('isLoggedIn');
    usernameInput.value = '';
    passwordInput.value = '';
    loginScreen.classList.remove('hidden');
    mainContent.classList.add('hidden');
    usernameInput.focus();
}

// Raccourci clavier: CTRL+Q pour se déconnecter
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'q') {
        logout();
    }
});
