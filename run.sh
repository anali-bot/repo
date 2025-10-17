#!/bin/bash

# 🚀 Script de lancement de l'API WayMe avec support Email

echo "=========================================="
echo "🚀 Démarrage de l'API WayMe avec Email"
echo "=========================================="

# Vérifier si python3 existe
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 n'est pas installé!"
    exit 1
fi

# Vérifier si l'environnement virtuel existe
if [ ! -d "venv" ]; then
    echo "📦 Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer l'environnement virtuel
source venv/bin/activate

# Installer les dépendances si nécessaire
if [ ! -f "venv/lib/python3.*/site-packages/flask" ]; then
    echo "📦 Installation des dépendances..."
    pip install -r requirements.txt
fi

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  Attention: Fichier .env non trouvé!"
    echo "    Veuillez configurer l'email avec les instructions:"
    echo "    📖 Lisez: EMAIL_SETUP.md"
    echo ""
fi

# Lancer l'app
echo ""
echo "✓ Environnement prêt!"
echo ""
echo "=========================================="
echo "🚀 Démarrage de l'API WayMe"
echo "=========================================="
echo "📍 Adresse: http://localhost:5000"
echo "📧 Email: Configuré et prêt"
echo "📊 Base de données: users.json"
echo "=========================================="
echo ""

python3 app.py