@echo off
REM 🚀 Script de lancement de l'API WayMe avec support Email (Windows)

echo.
echo ==========================================
echo 🚀 Demarrage de l'API WayMe avec Email
echo ==========================================
echo.

REM Vérifier si Python existe
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installe!
    pause
    exit /b 1
)

REM Créer l'environnement virtuel s'il n'existe pas
if not exist "venv" (
    echo 📦 Creation de l'environnement virtuel...
    python -m venv venv
)

REM Activer l'environnement virtuel
call venv\Scripts\activate.bat

REM Installer les dépendances si nécessaire
if not exist "venv\Lib\site-packages\flask" (
    echo 📦 Installation des dependances...
    pip install -r requirements.txt
)

REM Vérifier si .env existe
if not exist ".env" (
    echo.
    echo ⚠️  Attention: Fichier .env non trouve!
    echo    Veuillez configurer l'email avec les instructions:
    echo    📖 Lisez: EMAIL_SETUP.md
    echo.
)

REM Lancer l'app
echo.
echo ✓ Environnement pret!
echo.
echo ==========================================
echo 🚀 Demarrage de l'API WayMe
echo ==========================================
echo 📍 Adresse: http://localhost:5000
echo 📧 Email: Configure et pret
echo 📊 Base de donnees: users.json
echo ==========================================
echo.

python app.py
pause