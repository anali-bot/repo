# 📧 Configuration de l'Envoi d'Email - Gmail

## 🎯 Objectif
Configurer l'envoi automatique d'emails de bienvenue aux utilisateurs qui s'inscrivent sur WayMe.fr

---

## 🔑 Étape 1: Créer un Compte Gmail (ou utiliser un existant)

1. Allez sur [gmail.com](https://gmail.com)
2. Connectez-vous avec votre compte Google
3. **Activez la vérification en deux étapes** (obligatoire pour les App Passwords):
   - Allez dans **Paramètres** → **Sécurité**
   - Cliquez sur **Vérification en deux étapes**
   - Suivez les étapes

---

## 🔐 Étape 2: Générer un App Password

1. Allez dans **[https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)**
2. Sélectionnez:
   - **App:** `Mail`
   - **Device:** `Windows Computer` (ou votre OS)
3. Google génère un mot de passe de **16 caractères**
4. **Copiez ce mot de passe** (sans les espaces)

---

## 📝 Étape 3: Configurer l'Environnement

### Option A: Variables d'environnement (Recommandé)

#### Sur Linux/Mac:
```bash
export GMAIL_PASSWORD="votre_app_password_16_caracteres"
source venv/bin/activate
python3 app.py
```

#### Sur Windows (PowerShell):
```powershell
$env:GMAIL_PASSWORD="votre_app_password_16_caracteres"
./venv/Scripts/activate
python app.py
```

#### Sur Windows (CMD):
```cmd
set GMAIL_PASSWORD=votre_app_password_16_caracteres
venv\Scripts\activate
python app.py
```

---

### Option B: Fichier `.env` (Plus simple)

1. Créez un fichier `.env` à la racine du projet:
```
GMAIL_PASSWORD=votre_app_password_16_caracteres
```

2. Installez python-dotenv:
```bash
pip install python-dotenv
```

3. Modifiez le haut de `app.py`:
```python
from dotenv import load_dotenv
load_dotenv()
```

---

## 🧪 Étape 4: Tester

1. Lancez l'API:
```bash
python3 app.py
```

2. Inscrivez un nouvel utilisateur dans l'interface

3. **Vérifiez la console** - vous devriez voir:
   ```
   ✓ Email de bienvenue envoyé à user@example.com
   ```

4. **Vérifiez la boîte email** - l'utilisateur reçoit le mail! 🎉

---

## ❌ Dépannage

### "ModuleNotFoundError: No module named 'dotenv'"
```bash
pip install python-dotenv
```

### "SMTPAuthenticationError: Invalid credentials"
- Vérifiez que l'App Password est correct (16 caractères)
- Vérifiez que la vérification en deux étapes est activée
- Vérifiez que c'est un **App Password**, pas votre mot de passe Gmail normal

### "SMTPServerNotFoundError" ou connexion refusée
- Vérifiez votre connexion internet
- Vérifiez les pare-feu/antivirus

### L'email ne s'envoie pas mais pas d'erreur
- Vérifiez que `GMAIL_PASSWORD` est bien défini
- Vérifiez les logs de la console

---

## 📧 Personnaliser l'Email

Modifiez la fonction `send_welcome_email()` dans `app.py` pour:
- Changer le sujet
- Modifier le message
- Ajouter une signature
- Ajouter des images/logos

---

## 🔒 Sécurité

⚠️ **Ne commitez JAMAIS votre App Password sur GitHub!**

1. Ajoutez `.env` au `.gitignore`:
```
.env
.env.local
*.pyc
venv/
```

2. Utilisez toujours des variables d'environnement en production

3. Changez l'App Password périodiquement

---

## 🚀 Production

En production, considérez:
- ✅ Service d'email dédié (SendGrid, Mailgun, Brevo)
- ✅ Domaine email personnalisé (noreply@wayme.fr)
- ✅ Templates d'email professionnels
- ✅ Gestion des listes de diffusion

---

**Vous êtes prêt ! 🎉**