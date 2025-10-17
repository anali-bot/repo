# 🚀 Guide de Déploiement - WayMe.fr

Votre application est maintenant prête à être déployée sur internet! Voici comment le faire gratuitement avec **Render.com** ou **Railway.app**.

---

## 📋 Pré-requis

- ✅ Un compte **GitHub** (créez-en un si nécessaire)
- ✅ Votre code poussé sur GitHub
- ✅ Un email Gmail pour les notifications d'inscription (optionnel mais recommandé)

---

## 🔑 Étape 1: Préparer les secrets (Variables d'environnement)

### Gmail (pour les emails de bienvenue)

1. **Créer un App Password Gmail:**
   - Allez sur: https://myaccount.google.com/apppasswords
   - Sélectionnez "Mail" et "Windows Computer"
   - Google vous génère un **App Password** (16 caractères)
   - **Copez ce mot de passe** - vous en aurez besoin

### Alternative: Désactiver les emails temporairement

Si vous n'avez pas de Gmail:
- Laissez `GMAIL_PASSWORD` vide
- Les emails ne seront pas envoyés, mais l'app fonctionnera

---

## 🎯 Option A: Déployer avec RENDER.com (Recommandé - Plus simple)

### Étape 1: Push votre code sur GitHub

```bash
# Initialiser un repo Git (si pas déjà fait)
git init
git add .
git commit -m "Préparation pour déploiement"
git remote add origin https://github.com/VOTRE_USERNAME/wayme.git
git push -u origin main
```

### Étape 2: Se connecter à Render

1. Allez sur: https://render.com
2. Cliquez **"Sign up"** avec GitHub
3. Autorisez Render à accéder à vos repos GitHub

### Étape 3: Créer un nouveau service

1. Cliquez **"New +"** → **"Web Service"**
2. Sélectionnez votre repo **wayme**
3. Remplissez les infos:
   - **Name:** `wayme` (ou ce que vous voulez)
   - **Region:** `Frankfurt (EU)` (plus rapide pour la France)
   - **Branch:** `main`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`

### Étape 4: Variables d'environnement

1. Scroll down jusqu'à **"Environment"**
2. Cliquez **"Add Environment Variable"**
3. Ajoutez:
   - **Key:** `GMAIL_PASSWORD`
   - **Value:** `votre_app_password_gmail_ici` (collez le 16 caractères)
4. Cliquez **"Deploy"**

### Étape 5: Attendre le déploiement

- ⏳ Attendez 3-5 minutes
- Vous verrez une URL comme: `https://wayme.onrender.com`
- C'est votre site! 🎉

---

## 🎯 Option B: Déployer avec RAILWAY.app

### Étape 1: Push code sur GitHub (même que Render)

### Étape 2: Se connecter à Railway

1. Allez sur: https://railway.app
2. Cliquez **"Login"** → **"GitHub"**
3. Autorisez Railway

### Étape 3: Créer un nouveau projet

1. Cliquez **"Create New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Connectez votre repo **wayme**

### Étape 4: Variables d'environnement

1. Dans le dashboard, allez à **"Variables"**
2. Cliquez **"New Variable"**
3. Ajoutez:
   - **Key:** `GMAIL_PASSWORD`
   - **Value:** `votre_app_password_gmail_ici`
4. Sauvegardez

### Étape 5: Déploiement automatique

- Railway déploie automatiquement
- Vous verrez votre URL dans le dashboard
- Par défaut: `https://wayme-production.up.railway.app`

---

## 🌐 Étape 2: Obtenir un domaine gratuit

### Option A: Freenom.com (`.tk`, `.ml`, `.ga`, `.cf`)

1. Allez sur: https://www.freenom.com
2. **Register** un domaine gratuit (ex: `wayme.tk`)
3. Une fois enregistré:
   - Allez à **"Services"** → **"My Domains"**
   - Cliquez sur votre domaine
   - Allez à **"Management Tools"** → **"Nameservers"**
   - Changez les **Nameservers** (selon Render/Railway)

### Option B: eu.org (Domaine `.eu.org` gratuit et professionnel)

1. Allez sur: https://nic.eu.org
2. Demandez un domaine (ex: `wayme.eu.org`)
3. C'est gratuit et sans publicité!

---

## 🔗 Configurer votre domaine personnalisé

### Avec Render:

1. Allez dans votre service Render
2. **Settings** → **Custom Domains**
3. Ajoutez votre domaine
4. Suivez les instructions pour les DNS

### Avec Railway:

1. Dashboard → **Domains**
2. Cliquez **"New Domain"**
3. Entrez votre domaine
4. Configurez les DNS selon les instructions

---

## ✅ Vérifier que tout fonctionne

Une fois déployé:

1. Allez sur votre URL: `https://wayme.onrender.com` (ou votre domaine)
2. Testez l'inscription
3. Testez la connexion
4. Vérifiez l'email de bienvenue (dans spam si Gmail)

---

## 🐛 Dépannage

### "Port already in use"
- **Solution:** Render/Railway gère les ports automatiquement, pas d'action nécessaire

### "Module not found"
- **Solution:** Vérifiez que `requirements.txt` contient tous les packages
- Relancez le déploiement

### "Les emails ne s'envoient pas"
- **Solution:** Vérifiez que `GMAIL_PASSWORD` est correct
- Cochez les conditions Gmail App Password: https://support.google.com/accounts/answer/185833

### "Page blanche au démarrage"
- **Solution:** Attendez 1-2 minutes (le serveur démarre)
- Vérifiez les logs dans le dashboard Render/Railway

---

## 🔄 Mettre à jour votre app

Pour ajouter des modifications:

```bash
git add .
git commit -m "Ma modification"
git push origin main
```

Le déploiement se relancera automatiquement! 🚀

---

## 📊 Monitoring

### Render
- Dashboard → **Logs** pour voir les erreurs
- Vérifiez la charge mémoire dans **Metrics**

### Railway
- Cliquez sur votre service
- **Logs** pour les erreurs
- **Metrics** pour les statistiques

---

## 💡 Conseils de production

✅ **À faire:**
- Configurez un email Gmail réel
- Utilisez un domaine personnalisé
- Vérifiez que `IS_PRODUCTION` fonctionne
- Sauvegardez `users.json` régulièrement

⚠️ **À éviter:**
- Ne commitez pas `.env` sur GitHub
- Ne partagez pas votre `GMAIL_PASSWORD` en public
- Ne désactivez pas CORS sans raison

---

## 🎉 Succès!

Votre site est en ligne! Voici ce qui se passe maintenant:

- ✅ N'importe qui peut accéder à `https://votreurl.com`
- ✅ Les utilisateurs peuvent s'inscrire
- ✅ Les emails de bienvenue s'envoient
- ✅ Les profils et associations sont sauvegardés
- ✅ Tout fonctionne en temps réel

---

## 📞 Support

En cas de problème:
- Consultez les logs du dashboard
- Vérifiez votre configuration d'environnement
- Relancez le déploiement depuis GitHub

**Vous avez maintenant un site web public! 🌍**

---

*Créé pour WayMe.fr - 2024*