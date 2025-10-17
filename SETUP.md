# 🚀 Configuration - WayMe Portal

## 📋 Prérequis

- Python 3.8+ installé
- Un navigateur web moderne
- Terminal/CMD

## ⚙️ Installation

### Étape 1: Installer les dépendances Python

```bash
pip install -r requirements.txt
```

Ou si vous utilisez Python 3 spécifiquement:
```bash
pip3 install -r requirements.txt
```

### Étape 2: Lancer l'API Python

```bash
python app.py
```

Ou:
```bash
python3 app.py
```

Vous devriez voir:
```
==================================================
🚀 Démarrage de l'API WayMe
==================================================
📍 Adresse: http://localhost:5000
📊 Users file: users.json
==================================================
```

### Étape 3: Ouvrir le portail dans le navigateur

1. Ouvrez `index.html` dans votre navigateur
2. Cliquez sur "Je veux m'inscrire" pour créer un compte
3. Remplissez le formulaire et cliquez sur "S'inscrire"

## 🎯 Fonctionnalités

### Inscription (Sign Up)
- Créez un nouveau compte avec email, nom d'utilisateur et mot de passe
- Validation en temps réel du formulaire
- Protection contre les doublons d'email/username
- Connexion automatique après inscription

### Connexion (Login)
- Connexion avec nom d'utilisateur et mot de passe
- Gestion sécurisée des mots de passe (hash SHA-256)
- Stockage en localStorage (côté client)

### Profil Utilisateur
- Affichage du nom d'utilisateur en haut à droite
- Bouton de déconnexion avec icône rouge

## 📁 Structure des fichiers

```
/home/aylon/Bureau/
├── app.py                 # 🐍 API Python (Backend)
├── requirements.txt       # 📦 Dépendances Python
├── index.html            # 📄 Page HTML (Frontend)
├── script.js             # ⚡ Logique JavaScript
├── style.css             # 🎨 Styles CSS
├── terminal.js           # 💻 Simulateur Linux
├── users.json            # 👥 Base de données (créée automatiquement)
└── SETUP.md              # 📖 Ce fichier
```

## 🗄️ Base de données

Les utilisateurs sont stockés dans `users.json`:

```json
{
  "1": {
    "email": "user@example.com",
    "username": "user",
    "password": "hash_du_mot_de_passe",
    "created_at": "2024-01-15T10:30:00.000000",
    "updated_at": "2024-01-15T10:30:00.000000"
  }
}
```

## 🔒 Sécurité

- ✓ Mots de passe hashés avec SHA-256
- ✓ Validation des emails
- ✓ Vérification des doublons
- ✓ CORS activé pour les requêtes cross-origin
- ✓ Validation côté client et serveur

## 🐛 Dépannage

### L'API ne démarre pas
```bash
# Vérifiez que Python est installé
python --version

# Vérifiez que Flask est installé
pip list | grep Flask
```

### Erreur "Erreur de connexion au serveur"
- Assurez-vous que `python app.py` est en cours d'exécution
- Vérifiez que l'API écoute sur `http://localhost:5000`
- Vérifiez les logs dans le terminal

### Impossible de créer un compte
- Vérifiez que tous les champs sont remplis
- Assurez-vous que le mot de passe a au moins 6 caractères
- Vérifiez que l'email n'est pas déjà utilisé
- Vérifiez que le nom d'utilisateur n'est pas déjà pris

## 📝 Exemples d'utilisation

### Tester l'API directement

Créer un compte:
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

Se connecter:
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

Vérifier la santé de l'API:
```bash
curl http://localhost:5000/api/health
```

Voir tous les utilisateurs:
```bash
curl http://localhost:5000/api/users
```

## 🚀 Déploiement

Pour déployer en production:

1. Remplacez le stockage JSON par une vraie base de données (PostgreSQL, MongoDB, etc.)
2. Utilisez un serveur WSGI comme Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 app:app
   ```
3. Mettez à jour `API_URL` dans `script.js` avec l'URL de votre serveur
4. Activez HTTPS en production
5. Ajoutez des contrôles d'authentification appropriés (JWT tokens, etc.)

## 💡 Conseils

- Les mots de passe sont hachés avec SHA-256 (acceptable pour le développement, utilisez bcrypt en production)
- Tous les 5 mots de passe sauront être mis en cache
- Maintenant n'hésitez pas à personnaliser l'API selon vos besoins!

## 📞 Support

Pour plus d'informations, consultez:
- 📚 Documentation Flask: https://flask.palletsprojects.com/
- 🔐 Security Best Practices: https://cheatsheetseries.owasp.org/