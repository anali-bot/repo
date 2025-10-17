# ⚡ Démarrage Rapide - WayMe Portal

## 🎯 En 4 étapes

### 1️⃣ Configurer l'email (Optionnel mais recommandé)

```bash
# Créez un fichier .env avec votre App Password Gmail
echo "GMAIL_PASSWORD=votre_app_password_16_caracteres" > .env
```

📖 [Guide complet: EMAIL_SETUP.md](./EMAIL_SETUP.md)

### 2️⃣ Installer les dépendances

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3️⃣ Lancer l'API Python

**Linux/Mac:**
```bash
source venv/bin/activate
python3 app.py
```

**Windows:**
```bash
venv\Scripts\activate
python app.py
```

Vous devez voir:
```
==================================================
🚀 Démarrage de l'API WayMe
==================================================
📍 Adresse: http://localhost:5000
📧 Email: Configuré et prêt
📊 Users file: users.json
==================================================
```

### 4️⃣ Ouvrir le portail

Ouvrez `index.html` dans votre navigateur et:
- 📝 **Je veux m'inscrire** - Créer un nouveau compte (email envoyé!)
- 🔐 **Se connecter** - Accéder au portail avec vos identifiants

---

## 📧 Tester l'inscription (avec email)

1. Cliquez sur **"Je veux m'inscrire"**
2. Remplissez le formulaire:
   - Email: `votre_email@example.com`
   - Username: `testuser`
   - Password: `password123`
   - Confirm: `password123`
3. Cliquez sur **"S'inscrire"**
4. Vous êtes connecté automatiquement! ✓
5. **Vérifiez votre email** - vous recevez un message de bienvenue! 🎉

---

## 🧪 Tester la connexion

1. Rechargez la page et cliquez sur 🚪 (logout) en haut à droite
2. Cliquez sur **"Se connecter"**
3. Identifiants:
   - Username: `testuser`
   - Password: `password123`
4. Cliquez sur **"Se connecter"**
5. Vous êtes connecté! ✓

---

## 📁 Fichiers importants

| Fichier | Description |
|---------|-------------|
| `app.py` | 🐍 API Python (Backend + Email) |
| `script.js` | ⚡ Logique d'authentification (Frontend) |
| `users.json` | 👥 Base de données des utilisateurs |
| `index.html` | 📄 Interface d'authentification |
| `.env` | 🔐 Variables d'environnement (Email) |
| `EMAIL_SETUP.md` | 📧 Configuration Gmail |

**⚠️ Important:** Ajoutez `.env` à `.gitignore` pour ne pas révéler vos credentials!

---

## 🚨 Dépannage rapide

### ❌ "Erreur de connexion au serveur"
→ Assurez-vous que `python app.py` est en cours d'exécution

### ❌ "Ce nom d'utilisateur est déjà pris"
→ Utilisez un autre nom d'utilisateur

### ❌ "Cet email est déjà utilisé"
→ Utilisez un autre email

### ❌ "Impossible de lancer app.py"
→ Vérifiez que Python 3.8+ est installé: `python --version`

### ❌ "Email invalide" ou "Erreur lors de l'envoi de l'email"
→ Consultez `EMAIL_SETUP.md` pour configurer Gmail correctement

### ❌ "SMTPAuthenticationError"
→ Vérifiez que votre App Password est correct dans `.env`

---

## 💡 Infos utiles

- ✅ Les mots de passe sont sécurisés (hash SHA-256)
- ✅ Les données sont persistantes (stockées dans `users.json`)
- ✅ Chaque utilisateur a son profil unique
- ✅ Vous pouvez créer autant de comptes que vous voulez
- 📧 **Email automatique** envoyé lors de chaque inscription
- 🔐 App Password Gmail = plus sécurisé que le mot de passe principal

---

## 📞 Besoin d'aide?

Consultez `SETUP.md` pour plus de détails et d'options de configuration.

**Bon développement! 🚀**