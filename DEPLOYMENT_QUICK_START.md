# 🚀 Démarrage Rapide - Déploiement en 5 minutes

Vous voulez déployer votre site rapidement? Voici le chemin le plus court:

---

## 📋 Pré-requis (30 secondes)

✅ Avez-vous:
1. Un compte **GitHub** (créez-en un gratuitement)
2. Git installé sur votre ordinateur
3. Votre code dans `/home/aylon/Bureau`

---

## 🎯 Plan d'action (5 étapes)

### ⏱️ 1 min: Préparer GitHub

```bash
cd /home/aylon/Bureau

# Initialiser un repo Git
git init

# Ajouter tous les fichiers (sauf ceux du .gitignore)
git add .

# Faire un commit initial
git commit -m "🚀 WayMe.fr - Préparation déploiement"

# Créer un nouveau repo sur GitHub (GitHub.com)
# Puis, ajouter le remote et push:
git remote add origin https://github.com/VOTRE_USERNAME/wayme.git
git branch -M main
git push -u origin main
```

### ⏱️ 2 min: Créer un compte Render

1. Allez sur: **https://render.com**
2. Cliquez **"Sign up"** avec GitHub
3. Autorisez Render

### ⏱️ 1 min: Créer le service

1. Cliquez **"New +"** → **"Web Service"**
2. Sélectionnez votre repo `wayme`
3. Remplissez:
   - **Name:** `wayme`
   - **Environment:** `Python 3`
   - **Build Cmd:** `pip install -r requirements.txt`
   - **Start Cmd:** `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`

### ⏱️ 1 min: Ajouter les variables

1. Scroll → **"Environment"**
2. **"Add Environment Variable"**
3. Key: `GMAIL_PASSWORD` → Value: *(laissez vide pour l'instant)*
4. Cliquez **"Deploy"**

### ⏱️ Attendre (3-5 min)

- ⏳ Attendez que le déploiement se termine
- 🌍 Votre URL sera: `https://wayme.onrender.com` (générée automatiquement)

---

## ✅ C'est fait!

Allez sur votre URL et testez l'inscription! 🎉

---

## 🔧 Tester localement d'abord? (Recommandé)

```bash
# Aller au dossier
cd /home/aylon/Bureau

# Tester localement
python app.py

# Puis allez à: http://localhost:5000
```

---

## 📧 Activer les emails (optionnel)

Si vous voulez que les emails de bienvenue s'envoient:

1. Gmail: https://myaccount.google.com/apppasswords
2. Générez un **App Password** (16 caractères)
3. Sur Render: **Settings** → **Environment** 
4. Mettez `GMAIL_PASSWORD` = votre 16 caractères
5. Cliquez **"Save"** et **"Manual Deploy"**

---

## 🆘 Ça ne marche pas?

### "Port already in use"
```bash
# Relancez d'une autre façon
python app.py --port 3000
```

### "Module not found"
```bash
# Installez les dépendances locales
pip install -r requirements.txt
```

### "Page blanche en accédant"
- Attendez 2 minutes (serveur démarre)
- Vérifiez les logs Render: Dashboard → Logs

---

## 🎉 Prochaines étapes

1. ✅ Testez votre app en prod
2. ✅ Ajoutez un domaine personnalisé (Freenom.com ou eu.org)
3. ✅ Invitez vos amis!

---

*Fait? Consultez `DEPLOY_GUIDE.md` pour plus de détails 📖*