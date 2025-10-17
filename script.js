// Récupérer les éléments du DOM
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginScreen = document.getElementById('login-screen');
const mainContent = document.getElementById('main-content');
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username-display');

// Éléments d'inscription
const signupForm = document.getElementById('signup-form');
const signupEmail = document.getElementById('signup-email');
const signupUsername = document.getElementById('signup-username');
const signupPassword = document.getElementById('signup-password');
const signupConfirm = document.getElementById('signup-confirm');
const signupMessage = document.getElementById('signup-message');
const loginFormDiv = document.getElementById('login-form-div');
const signupFormDiv = document.getElementById('signup-form-div');
const toggleSignupBtn = document.getElementById('toggle-signup');
const toggleLoginBtn = document.getElementById('toggle-login');

// URL de l'API Python (à adapter selon votre configuration)
const API_URL = 'http://localhost:5000';

// ===== ÉVÉNEMENTS DE BASCULEMENT LOGIN/SIGNUP =====
toggleSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginFormDiv.classList.add('hidden');
    signupFormDiv.classList.remove('hidden');
});

toggleLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupFormDiv.classList.add('hidden');
    loginFormDiv.classList.remove('hidden');
    signupMessage.textContent = '';
    signupMessage.className = 'message';
});

// ===== GÉRER LA SOUMISSION DU FORMULAIRE DE CONNEXION =====
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Connexion réussie
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            showMainContent();
        } else {
            // Connexion échouée
            alert(data.message || 'Identifiants invalides!');
            passwordInput.value = '';
            usernameInput.focus();
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        alert('Erreur de connexion au serveur. Assurez-vous que l\'API est en cours d\'exécution.');
    }
});

// ===== GÉRER LA SOUMISSION DU FORMULAIRE D'INSCRIPTION =====
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = signupEmail.value.trim();
    const username = signupUsername.value.trim();
    const password = signupPassword.value.trim();
    const confirmPassword = signupConfirm.value.trim();
    
    // Validation locale
    if (!email || !username || !password || !confirmPassword) {
        showMessage('Tous les champs sont requis.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Les mots de passe ne correspondent pas.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Le mot de passe doit contenir au moins 6 caractères.', 'error');
        return;
    }
    
    if (username.length < 3) {
        showMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères.', 'error');
        return;
    }
    
    showMessage('Inscription en cours...', 'loading');
    
    try {
        const response = await fetch(`${API_URL}/api/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('✓ Compte créé avec succès! Redirection...', 'success');
            setTimeout(() => {
                // Connexion automatique
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                showMainContent();
            }, 1500);
        } else {
            showMessage(data.message || 'Erreur lors de l\'inscription.', 'error');
        }
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        showMessage('Erreur de connexion au serveur.', 'error');
    }
});

// Fonction pour afficher les messages
function showMessage(message, type) {
    signupMessage.textContent = message;
    signupMessage.className = `message ${type}`;
}

// Fonction pour afficher le contenu principal
function showMainContent() {
    loginScreen.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // Afficher le nom d'utilisateur
    const username = localStorage.getItem('username') || 'user';
    usernameDisplay.textContent = username;
}

// Fonction pour se déconnecter (optionnel)
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    usernameInput.value = '';
    passwordInput.value = '';
    loginScreen.classList.remove('hidden');
    mainContent.classList.add('hidden');
    usernameInput.focus();
}

// Ajouter l'événement de déconnexion au bouton
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// Raccourci clavier: CTRL+Q pour se déconnecter
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'q') {
        logout();
    }
});

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, observerOptions);

    // Observer toutes les catégories et cartes de liens
    const elements = document.querySelectorAll('.category, .link-card');
    let delayIndex = 0;
    
    elements.forEach((el) => {
        el.classList.add('reveal-element');
        el.style.animationDelay = (delayIndex * 0.08) + 's';
        delayIndex++;
        observer.observe(el);
    });
}

// ===== PARALLAXE EFFECT + SCROLL BLUR =====
function initParallax() {
    let ticking = false;
    
    function updateOnScroll() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('header');
        
        // Parallaxe header
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.4}px)`;
            header.style.opacity = Math.max(0.5, 1 - scrolled * 0.001);
        }
        
        // Parallaxe sur les catégories
        const categories = document.querySelectorAll('.category');
        categories.forEach((cat, index) => {
            const speed = 0.1 + (index * 0.05);
            cat.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
}

// ===== ANIMATION INITIALE AU CHARGEMENT =====
function initLoadingAnimation() {
    const header = document.querySelector('header');
    const container = document.querySelector('.container');
    
    if (header) {
        header.style.animation = 'fadeInDown 0.8s ease-out';
    }
    if (container) {
        container.style.animation = 'fadeInUp 1s ease-out 0.2s both';
    }
}

// ===== GESTION DE LA MODAL PROFIL =====
const profileModal = document.getElementById('profile-modal');
const userBtn = document.getElementById('user-btn');
const closeModalBtn = document.getElementById('close-modal');

// Avatars prédéfinis (emojis)
const avatars = ['😀', '😎', '🤖', '👽', '🎭', '🦄', '🐶', '🐱', '🦁', '🐼', '🦊', '🐯'];

// Ouvrir la modal
userBtn.addEventListener('click', async () => {
    const username = localStorage.getItem('username') || 'user';
    await loadProfile(username);
    profileModal.classList.remove('hidden');
});

// Fermer la modal
closeModalBtn.addEventListener('click', () => {
    profileModal.classList.add('hidden');
});

// Fermer la modal en cliquant dehors
profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
        profileModal.classList.add('hidden');
    }
});

// Charger le profil utilisateur
async function loadProfile(username) {
    try {
        const response = await fetch(`${API_URL}/api/profile/${username}`);
        const data = await response.json();

        if (response.ok) {
            // Afficher les infos
            document.getElementById('profile-username').textContent = data.username;
            document.getElementById('profile-email').textContent = data.email;
            const date = new Date(data.created_at).toLocaleDateString('fr-FR');
            document.getElementById('profile-created').textContent = `Créé le: ${date}`;

            // Afficher les rôles
            displayRolesInHeader(data.roles || ['Client']);

            // Afficher la photo
            if (data.profile_picture) {
                document.getElementById('profile-img').src = data.profile_picture;
            }

            // Charger les avatars
            loadAvatars(data.profile_picture);

            // Charger les associations
            loadAssociations(data.associations);

            // Charger les rôles dans l'onglet
            loadRolesTab(data.roles || ['Client']);
        }
    } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
    }
}

// Charger les avatars prédéfinis
function loadAvatars(currentPicture) {
    const grid = document.getElementById('avatars-grid');
    grid.innerHTML = '';

    avatars.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'avatar-btn';
        btn.textContent = emoji;
        btn.type = 'button';

        btn.addEventListener('click', () => {
            saveProfilePicture(emoji);
            loadAvatars(emoji);
        });

        grid.appendChild(btn);
    });
}

// Sauvegarder la photo de profil
async function saveProfilePicture(pictureData) {
    const username = localStorage.getItem('username');
    try {
        const response = await fetch(`${API_URL}/api/profile/${username}/picture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ picture_data: pictureData })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('profile-img').src = pictureData;
            alert('✓ Photo mise à jour!');
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Upload photo depuis ordinateur
document.getElementById('upload-photo-btn').addEventListener('click', async () => {
    const fileInput = document.getElementById('photo-upload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Veuillez sélectionner une image');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64 = e.target.result;
        await saveProfilePicture(base64);
        fileInput.value = '';
    };
    reader.readAsDataURL(file);
});

// Charger les associations
function loadAssociations(associations) {
    const list = document.getElementById('associations-list');
    list.innerHTML = '';

    if (Object.keys(associations).length === 0) {
        list.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center;">Aucune association pour le moment</p>';
        return;
    }

    for (const [platform, account] of Object.entries(associations)) {
        const item = document.createElement('div');
        item.className = 'association-item';
        item.innerHTML = `
            <div class="association-info">
                <div class="association-platform">${platform}</div>
                <div class="association-account">${account}</div>
            </div>
            <button class="delete-association-btn" onclick="deleteAssociation('${platform}')">✕ Supprimer</button>
        `;
        list.appendChild(item);
    }
}

// Ajouter une association
document.getElementById('add-association-btn').addEventListener('click', async () => {
    const platform = document.getElementById('platform-select').value;
    const account = document.getElementById('account-input').value.trim();

    if (!platform || !account) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const username = localStorage.getItem('username');

    try {
        const response = await fetch(`${API_URL}/api/profile/${username}/associations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ platform, account })
        });

        const data = await response.json();

        if (response.ok) {
            alert('✓ Association ajoutée!');
            document.getElementById('platform-select').value = '';
            document.getElementById('account-input').value = '';
            loadAssociations(data.associations);
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
});

// Supprimer une association
async function deleteAssociation(platform) {
    if (!confirm(`Supprimer l'association avec ${platform}?`)) return;

    const username = localStorage.getItem('username');

    try {
        const response = await fetch(`${API_URL}/api/profile/${username}/associations/${platform}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            alert('✓ Association supprimée!');
            loadAssociations(data.associations);
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Afficher les rôles dans l'en-tête du profil
function displayRolesInHeader(roles) {
    const rolesContainer = document.getElementById('profile-roles');
    rolesContainer.innerHTML = '';

    if (roles && roles.length > 0) {
        roles.forEach(role => {
            const badge = document.createElement('span');
            badge.className = `role-badge ${role.toLowerCase()}`;
            badge.textContent = role;
            rolesContainer.appendChild(badge);
        });
    }
}

// Charger les rôles dans l'onglet Rôles
function loadRolesTab(roles) {
    const rolesList = document.getElementById('roles-list');
    rolesList.innerHTML = '';

    if (!roles || roles.length === 0) {
        rolesList.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center;">Aucun rôle attribué</p>';
        return;
    }

    const rolesInfo = {
        'Admin': { icon: '👑', description: 'Accès complet à l\'administration' },
        'Dev': { icon: '💻', description: 'Accès aux outils de développement' },
        'Client': { icon: '👤', description: 'Utilisateur standard' }
    };

    const grid = document.createElement('div');
    grid.className = 'roles-grid';

    roles.forEach(role => {
        const info = rolesInfo[role] || { icon: '🏷️', description: 'Rôle utilisateur' };
        const item = document.createElement('div');
        item.className = 'role-item';
        item.title = info.description;
        item.innerHTML = `
            <div class="role-item-icon">${info.icon}</div>
            <div class="role-item-name">${role}</div>
        `;
        grid.appendChild(item);
    });

    rolesList.appendChild(grid);
}

// Charger tous les utilisateurs
let allUsers = [];

async function loadAllUsers() {
    try {
        const response = await fetch(`${API_URL}/api/users`);
        const data = await response.json();
        
        if (response.ok) {
            allUsers = data.users;
            displayUsers(allUsers);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
    }
}

// Afficher les utilisateurs
function displayUsers(users) {
    const list = document.getElementById('users-list');
    list.innerHTML = '';

    if (users.length === 0) {
        list.innerHTML = '<div class="no-users-message">Aucun utilisateur trouvé</div>';
        return;
    }

    users.forEach(user => {
        const roles = user.roles || ['Client'];
        const rolesHTML = roles.map(role => 
            `<span class="user-role-badge ${role.toLowerCase()}">${role}</span>`
        ).join('');

        const item = document.createElement('div');
        item.className = 'user-item';
        item.innerHTML = `
            <div class="user-info">
                <div class="user-name">${user.username}</div>
                <div class="user-email">${user.email}</div>
                <div class="user-roles">${rolesHTML}</div>
            </div>
            <button class="view-profile-btn" onclick="viewUserProfile('${user.username}')">Voir profil</button>
        `;
        list.appendChild(item);
    });
}

// ===== PROFIL PUBLIC D'AUTRES UTILISATEURS =====

// Afficher le profil d'un autre utilisateur
async function viewUserProfile(username) {
    try {
        const response = await fetch(`${API_URL}/api/profile/${username}`);
        const data = await response.json();

        if (response.ok) {
            // Afficher les infos de base
            document.getElementById('public-profile-username').textContent = data.username;
            document.getElementById('public-profile-email').textContent = data.email;
            const date = new Date(data.created_at).toLocaleDateString('fr-FR');
            document.getElementById('public-profile-created').textContent = `Créé le: ${date}`;

            // Afficher les rôles
            displayPublicRoles(data.roles || ['Client']);

            // Afficher la photo
            if (data.profile_picture) {
                document.getElementById('public-profile-img').src = data.profile_picture;
            } else {
                document.getElementById('public-profile-img').src = 'https://via.placeholder.com/150?text=Avatar';
            }

            // Charger les associations
            loadPublicAssociations(data.associations || {});

            // Afficher les rôles dans l'onglet
            loadPublicRolesTab(data.roles || ['Client']);

            // Afficher la modal
            document.getElementById('public-profile-modal').classList.remove('hidden');
        } else {
            alert('Utilisateur non trouvé');
        }
    } catch (error) {
        console.error('Erreur lors du chargement du profil public:', error);
        alert('Erreur lors du chargement du profil');
    }
}

// Afficher les rôles dans l'en-tête du profil public
function displayPublicRoles(roles) {
    const container = document.getElementById('public-profile-roles');
    container.innerHTML = '';

    roles.forEach(role => {
        const badge = document.createElement('span');
        badge.className = `role-badge role-${role.toLowerCase()}`;
        badge.textContent = role;
        container.appendChild(badge);
    });
}

// Charger les associations publiques
function loadPublicAssociations(associations) {
    const list = document.getElementById('public-associations-list');
    list.innerHTML = '';

    if (Object.keys(associations).length === 0) {
        list.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center;">Aucune association pour le moment</p>';
        return;
    }

    for (const [platform, account] of Object.entries(associations)) {
        const item = document.createElement('div');
        item.className = 'association-item';
        item.innerHTML = `
            <div class="association-info">
                <div class="association-platform">${platform}</div>
                <div class="association-account">${account}</div>
            </div>
        `;
        list.appendChild(item);
    }
}

// Charger les rôles dans l'onglet public
function loadPublicRolesTab(roles) {
    const list = document.getElementById('public-roles-list');
    list.innerHTML = '';

    const roleDescriptions = {
        'Admin': { icon: '👑', desc: 'Accès complet à l\'administration' },
        'Dev': { icon: '💻', desc: 'Accès aux outils de développement' },
        'Client': { icon: '👤', desc: 'Utilisateur standard' }
    };

    roles.forEach(role => {
        const info = roleDescriptions[role] || { icon: '❓', desc: role };
        const item = document.createElement('div');
        item.className = 'role-item';
        item.innerHTML = `
            <span class="role-icon">${info.icon}</span>
            <div class="role-details">
                <strong>${role}</strong>
                <p>${info.desc}</p>
            </div>
        `;
        list.appendChild(item);
    });
}

// Fermer la modal publique
const closePublicModalBtn = document.getElementById('close-public-modal');
const publicProfileModal = document.getElementById('public-profile-modal');

closePublicModalBtn.addEventListener('click', () => {
    publicProfileModal.classList.add('hidden');
});

publicProfileModal.addEventListener('click', (e) => {
    if (e.target === publicProfileModal) {
        publicProfileModal.classList.add('hidden');
    }
});

// Gestion des onglets pour la modal publique
document.querySelectorAll('.public-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');

        // Retirer la classe active de tous les onglets publics
        document.querySelectorAll('.public-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('#public-associations-tab, #public-roles-tab').forEach(tab => tab.classList.remove('active'));

        // Ajouter la classe active au bouton cliqué
        btn.classList.add('active');
        const tabContent = document.getElementById(tabName + '-tab');
        if (tabContent) {
            tabContent.classList.add('active');
        }
    });
});

// Barre de recherche
const searchInput = document.getElementById('user-search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query === '') {
            displayUsers(allUsers);
        } else {
            const filtered = allUsers.filter(user => 
                user.username.toLowerCase().includes(query) || 
                user.email.toLowerCase().includes(query)
            );
            displayUsers(filtered);
        }
    });
}

// Gestion des onglets
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');

        // Retirer la classe active de tous les onglets
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

        // Ajouter la classe active à l'onglet cliqué
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Charger les utilisateurs si on clique sur l'onglet Utilisateurs
        if (tabName === 'users' && allUsers.length === 0) {
            loadAllUsers();
        }
    });
});

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Vérifier si l'utilisateur est déjà connecté
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            showMainContent();
        }
        
        setTimeout(() => {
            initLoadingAnimation();
            initScrollAnimations();
            initParallax();
        }, 100);
    });
} else {
    // Vérifier si l'utilisateur est déjà connecté
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        showMainContent();
    }
    
    setTimeout(() => {
        initLoadingAnimation();
        initScrollAnimations();
        initParallax();
    }, 100);
}
