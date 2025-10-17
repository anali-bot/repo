# ✅ Checklist Avant Déploiement

Avant de déployer votre site en production, vérifiez tout cela:

## 🔒 Sécurité

- [ ] `.env` n'est **PAS** dans le repo GitHub
- [ ] `users.json` n'est **PAS** dans le repo GitHub (seulement `users_sample.json`)
- [ ] `.gitignore` inclut `.env` et `users.json`
- [ ] Pas de mots de passe en dur dans le code
- [ ] GMAIL_PASSWORD sera défini comme variable d'environnement sur Render/Railway

## 📦 Dépendances

- [ ] `requirements.txt` est à jour et contient:
  - Flask==2.3.0
  - Flask-CORS==4.0.0
  - Werkzeug==2.3.0
  - python-dotenv==1.0.0
  - gunicorn==21.2.0
- [ ] `Procfile` existe avec: `web: gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
- [ ] `runtime.txt` existe avec: `python-3.12.0`

## 🚀 Code

- [ ] `app.py`:
  - `static_folder='.'` configuré ✅
  - Route `/` sert `index.html` ✅
  - Variables d'environnement détectées ✅
  - `send_from_directory` importé ✅

- [ ] `config.js`:
  - Détecte automatiquement l'environnement ✅
  - URL API devient locale en dev, domaine en prod ✅

## 📝 Fichiers nécessaires

- [ ] `index.html` existe
- [ ] `script.js` existe
- [ ] `style.css` existe
- [ ] `terminal.js` existe (optionnel mais recommandé)
- [ ] `users_sample.json` existe (backup)

## 🌐 Préparation de déploiement

- [ ] Code pushé sur GitHub
- [ ] Repo GitHub est **PUBLIC** (pour Render/Railway gratuit)
- [ ] Vous avez l'App Password Gmail (optionnel)

## ✨ Configuration Render/Railway

### Render.com:
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
- [ ] Variable d'environnement: `GMAIL_PASSWORD` = votre 16 caractères
- [ ] Région: `Frankfurt (EU)` ou `Amsterdam`

### Railway.app:
- [ ] Variable d'environnement: `GMAIL_PASSWORD` = votre 16 caractères
- [ ] Procfile détecté automatiquement
- [ ] Python 3.12 sélectionné

## 🧪 Tests locaux (AVANT déploiement)

```bash
# Tester localement d'abord!
python app.py

# Vérifier que:
# - Vous pouvez accéder à http://localhost:5000
# - Le frontend s'affiche
# - Vous pouvez vous inscrire
# - Vous pouvez vous connecter
# - Les associations fonctionnent
# - Les emails (si Gmail configuré) s'envoient
```

## 📊 Après déploiement

- [ ] Allez à votre URL (ex: https://wayme.onrender.com)
- [ ] Testez l'inscription complète
- [ ] Testez la connexion
- [ ] Vérifiez un email de bienvenue
- [ ] Testez les associations et profils
- [ ] Configurez votre domaine personnalisé (optionnel)

## 🎉 Success!

Si tout coché:

```
✅ Votre site fonctionne en production!
```

---

## 🆘 En cas de problème après déploiement

### Erreur: "Page blanche"
1. Vérifiez les logs (Dashboard → Logs)
2. Attendez 1-2 minutes (serveur peut démarrer)
3. Relancez le déploiement

### Erreur: "Port X already in use"
1. Ce n'est PAS votre problème (le serveur gère ça)
2. C'est un problème de configuration
3. Vérifiez que `PORT` est lu depuis `os.environ.get('PORT', 5000)`

### Erreur: "Module not found"
1. Ajoutez le package à `requirements.txt`
2. Faites `git push` pour redéployer

### Les emails ne s'envoient pas
1. Vérifiez `GMAIL_PASSWORD` est correct (16 caractères)
2. Vérifiez que Gmail a créé un "App Password"
3. Attendez 1-2 minutes avant de retester

---

## 📞 Vérification finale

Avant de dire que c'est "terminé":

- [ ] Vous pouvez vous inscrire
- [ ] Un email de bienvenue est envoyé ✓
- [ ] Vous pouvez vous connecter
- [ ] Vous pouvez ajouter des associations
- [ ] Vous pouvez voir d'autres profils
- [ ] Les rôles s'affichent correctement
- [ ] L'app fonctionne sur mobile aussi

**Bravo! 🎉 Vous avez un site web en production!**

---

*Guide de déploiement WayMe.fr 2024*