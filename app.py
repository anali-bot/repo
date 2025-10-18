"""
API Python pour gérer l'authentification (Login/Signup)
Utilise Flask et stockage JSON pour simplifier
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import hashlib
import re
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Charger les variables d'environnement depuis .env
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Configuration pour production et développement
app = Flask(__name__, static_folder='.', static_url_path='/')
CORS(app)

# WhiteNoise pour servir les fichiers statiques en production avec gunicorn
try:
    from whitenoise import WhiteNoise
    app.wsgi_app = WhiteNoise(app.wsgi_app, root='.', index_file=True)
except ImportError:
    pass

# ===== DÉTECTION ENVIRONNEMENT =====
IS_PRODUCTION = os.environ.get('ENVIRONMENT', 'development') == 'production'
PORT = int(os.environ.get('PORT', 5000))

# ===== CONFIGURATION EMAIL =====
EMAIL_SENDER = 'wayme.noreply@gmail.com'  # Adresse d'envoi (WayMe.fr)
EMAIL_PASSWORD = os.environ.get('GMAIL_PASSWORD', '')  # App Password Gmail
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587

# Fichier de stockage des utilisateurs
USERS_FILE = 'users.json'

# ===== FONCTIONS UTILITAIRES =====

def load_users():
    """Charge les utilisateurs depuis le fichier JSON"""
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_users(users):
    """Sauvegarde les utilisateurs dans le fichier JSON"""
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

def get_user_by_username(username):
    """Récupère un utilisateur par son nom d'utilisateur"""
    users = load_users()
    for user_id, user_data in users.items():
        if user_data['username'] == username:
            return user_id, user_data
    return None, None

def hash_password(password):
    """Hash le mot de passe avec SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def is_valid_email(email):
    """Valide le format de l'email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def send_welcome_email(email, username):
    """Envoie un email de bienvenue à l'utilisateur"""
    try:
        # Créer le message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Merci Pour Votre Inscription au service de WayMe.fr ✓'
        msg['From'] = EMAIL_SENDER
        msg['To'] = email

        # Contenu texte
        text = f"Bonjour {username},\n\nMerci Pour Votre Inscription au service de WayMe.fr ✓\n\nBienvenue dans notre communauté!\n\nCordialement,\nL'équipe WayMe.fr"

        # Contenu HTML
        html = f"""\
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
              <h2 style="color: #2c3e50; text-align: center;">🎉 Bienvenue sur WayMe.fr!</h2>
              
              <p>Bonjour <strong>{username}</strong>,</p>
              
              <p style="font-size: 18px; color: #27ae60; text-align: center; font-weight: bold;">
                Merci Pour Votre Inscription au service de WayMe.fr ✓
              </p>
              
              <p>Nous sommes heureux de vous accueillir dans notre communauté!</p>
              
              <div style="background-color: #ecf0f1; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
                <p><strong>Informations de votre compte:</strong></p>
                <p>📧 Email: <strong>{email}</strong></p>
                <p>👤 Nom d'utilisateur: <strong>{username}</strong></p>
              </div>
              
              <p style="margin-top: 30px;">Vous pouvez maintenant vous connecter et commencer à utiliser WayMe.fr!</p>
              
              <hr style="border: none; border-top: 1px solid #bdc3c7; margin: 20px 0;">
              
              <p style="text-align: center; color: #7f8c8d; font-size: 12px;">
                © 2024 WayMe.fr - Tous droits réservés<br>
                <em>Si vous n'avez pas créé ce compte, veuillez ignorer cet email.</em>
              </p>
            </div>
          </body>
        </html>
        """

        # Attacher les parties
        part1 = MIMEText(text, 'plain')
        part2 = MIMEText(html, 'html')
        msg.attach(part1)
        msg.attach(part2)

        # Envoyer l'email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()

        print(f"✓ Email de bienvenue envoyé à {email}")
        return True

    except Exception as e:
        print(f"✗ Erreur lors de l'envoi de l'email: {str(e)}")
        return False

# ===== ROUTES API =====

@app.route('/api/signup', methods=['POST'])
def signup():
    """Route pour créer un nouveau compte"""
    try:
        data = request.get_json()
        
        # Validation des données
        if not data or not all(k in data for k in ['email', 'username', 'password']):
            return jsonify({'message': 'Données manquantes'}), 400
        
        email = data.get('email', '').strip().lower()
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        # Validations
        if not email or not is_valid_email(email):
            return jsonify({'message': 'Email invalide'}), 400
        
        if not username or len(username) < 3:
            return jsonify({'message': 'Le nom d\'utilisateur doit contenir au moins 3 caractères'}), 400
        
        if not password or len(password) < 6:
            return jsonify({'message': 'Le mot de passe doit contenir au moins 6 caractères'}), 400
        
        # Vérifier si le username est "admin" et si l'email n'est pas wayme.noreply@gmail.com
        if username.lower() == 'admin' and email != 'wayme.noreply@gmail.com':
            return jsonify({'message': 'Ce nom d\'utilisateur est réservé'}), 400
        
        # Charger les utilisateurs existants
        users = load_users()
        
        # Vérifier si l'utilisateur ou l'email existe déjà
        for user_data in users.values():
            if user_data['email'] == email:
                return jsonify({'message': 'Cet email est déjà utilisé'}), 400
            if user_data['username'] == username:
                return jsonify({'message': 'Ce nom d\'utilisateur est déjà pris'}), 400
        
        # Créer le nouvel utilisateur
        user_id = str(len(users) + 1)
        
        # Déterminer les rôles
        if email == 'wayme.noreply@gmail.com':
            roles = ['Admin', 'Dev']
        else:
            roles = ['Client']
        
        users[user_id] = {
            'email': email,
            'username': username,
            'password': hash_password(password),
            'roles': roles,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        # Sauvegarder
        save_users(users)
        
        print(f"✓ Nouvel utilisateur créé: {username} ({email})")
        
        # Envoyer l'email de bienvenue
        send_welcome_email(email, username)
        
        return jsonify({
            'message': 'Compte créé avec succès!',
            'username': username
        }), 201
    
    except Exception as e:
        print(f"Erreur lors de l'inscription: {str(e)}")
        return jsonify({'message': f'Erreur serveur: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Route pour se connecter"""
    try:
        data = request.get_json()
        
        # Validation des données
        if not data or not all(k in data for k in ['username', 'password']):
            return jsonify({'message': 'Données manquantes'}), 400
        
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not password:
            return jsonify({'message': 'Nom d\'utilisateur et mot de passe requis'}), 400
        
        # Charger les utilisateurs
        users = load_users()
        
        # Rechercher l'utilisateur
        for user_id, user_data in users.items():
            if user_data['username'] == username:
                # Vérifier le mot de passe
                if user_data['password'] == hash_password(password):
                    print(f"✓ Connexion réussie: {username}")
                    return jsonify({
                        'message': 'Connexion réussie!',
                        'username': username,
                        'email': user_data['email'],
                        'roles': user_data.get('roles', ['Client'])
                    }), 200
                else:
                    return jsonify({'message': 'Mot de passe incorrect'}), 401
        
        return jsonify({'message': 'Utilisateur non trouvé'}), 404
    
    except Exception as e:
        print(f"Erreur lors de la connexion: {str(e)}")
        return jsonify({'message': f'Erreur serveur: {str(e)}'}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    """Route pour récupérer la liste des utilisateurs (développement uniquement)"""
    try:
        users = load_users()
        # Ne pas renvoyer les mots de passe en production!
        safe_users = []
        for user_id, user_data in users.items():
            safe_users.append({
                'id': user_id,
                'username': user_data['username'],
                'email': user_data['email'],
                'roles': user_data.get('roles', ['Client']),
                'created_at': user_data['created_at']
            })
        return jsonify({'users': safe_users}), 200
    
    except Exception as e:
        return jsonify({'message': f'Erreur: {str(e)}'}), 500

@app.route('/api/profile/<username>', methods=['GET'])
def get_profile(username):
    """Route pour récupérer le profil complet d'un utilisateur"""
    try:
        user_id, user_data = get_user_by_username(username)
        
        if not user_data:
            return jsonify({'message': 'Utilisateur non trouvé'}), 404
        
        return jsonify({
            'username': user_data['username'],
            'email': user_data['email'],
            'roles': user_data.get('roles', ['Client']),
            'created_at': user_data['created_at'],
            'updated_at': user_data.get('updated_at', user_data['created_at']),
            'profile_picture': user_data.get('profile_picture', ''),
            'associations': user_data.get('associations', {})
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Erreur: {str(e)}'}), 500

@app.route('/api/profile/<username>/picture', methods=['POST'])
def upload_profile_picture(username):
    """Route pour sauvegarder la photo de profil (base64 ou URL d'avatar)"""
    try:
        user_id, user_data = get_user_by_username(username)
        
        if not user_data:
            return jsonify({'message': 'Utilisateur non trouvé'}), 404
        
        data = request.get_json()
        picture_data = data.get('picture_data', '')
        
        if not picture_data:
            return jsonify({'message': 'Pas de données d\'image'}), 400
        
        # Charger les utilisateurs
        users = load_users()
        users[user_id]['profile_picture'] = picture_data
        users[user_id]['updated_at'] = datetime.now().isoformat()
        
        # Sauvegarder
        save_users(users)
        
        return jsonify({
            'message': 'Photo de profil mise à jour!',
            'profile_picture': picture_data
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Erreur: {str(e)}'}), 500

@app.route('/api/profile/<username>/associations', methods=['POST', 'GET'])
def manage_associations(username):
    """Route pour gérer les associations avec les liens"""
    try:
        user_id, user_data = get_user_by_username(username)
        
        if not user_data:
            return jsonify({'message': 'Utilisateur non trouvé'}), 404
        
        users = load_users()
        
        if request.method == 'GET':
            # Retourner les associations actuelles
            associations = users[user_id].get('associations', {})
            return jsonify({'associations': associations}), 200
        
        elif request.method == 'POST':
            # Ajouter/mettre à jour une association
            data = request.get_json()
            platform = data.get('platform', '').lower()
            account = data.get('account', '').strip()
            
            if not platform or not account:
                return jsonify({'message': 'Platform et account requis'}), 400
            
            if 'associations' not in users[user_id]:
                users[user_id]['associations'] = {}
            
            users[user_id]['associations'][platform] = account
            users[user_id]['updated_at'] = datetime.now().isoformat()
            save_users(users)
            
            return jsonify({
                'message': f'Association {platform} ajoutée!',
                'associations': users[user_id]['associations']
            }), 200
    
    except Exception as e:
        return jsonify({'message': f'Erreur: {str(e)}'}), 500

@app.route('/api/profile/<username>/associations/<platform>', methods=['DELETE'])
def delete_association(username, platform):
    """Route pour supprimer une association"""
    try:
        user_id, user_data = get_user_by_username(username)
        
        if not user_data:
            return jsonify({'message': 'Utilisateur non trouvé'}), 404
        
        users = load_users()
        platform = platform.lower()
        
        if 'associations' in users[user_id] and platform in users[user_id]['associations']:
            del users[user_id]['associations'][platform]
            users[user_id]['updated_at'] = datetime.now().isoformat()
            save_users(users)
        
        return jsonify({
            'message': f'Association {platform} supprimée!',
            'associations': users[user_id].get('associations', {})
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Erreur: {str(e)}'}), 500

# ===== ROUTES RÔLES =====

@app.route('/api/roles/<username>', methods=['GET'])
def get_user_roles(username):
    """Route pour récupérer les rôles d'un utilisateur"""
    try:
        user_id, user_data = get_user_by_username(username)
        
        if not user_data:
            return jsonify({'message': 'Utilisateur non trouvé'}), 404
        
        return jsonify({
            'username': username,
            'roles': user_data.get('roles', ['Client'])
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Erreur: {str(e)}'}), 500

@app.route('/api/roles/admin/all', methods=['GET'])
def get_all_user_roles():
    """Route pour récupérer les rôles de tous les utilisateurs (Admin uniquement)"""
    try:
        users = load_users()
        all_roles = []
        
        for user_id, user_data in users.items():
            all_roles.append({
                'username': user_data['username'],
                'email': user_data['email'],
                'roles': user_data.get('roles', ['Client'])
            })
        
        return jsonify({'users': all_roles}), 200
    
    except Exception as e:
        return jsonify({'message': f'Erreur: {str(e)}'}), 500

@app.route('/api/roles/<username>/update', methods=['POST'])
def update_user_roles(username):
    """Route pour modifier les rôles d'un utilisateur (Admin uniquement)"""
    try:
        data = request.get_json()
        
        if not data or 'roles' not in data:
            return jsonify({'message': 'Rôles manquants'}), 400
        
        new_roles = data.get('roles', [])
        
        # Validation des rôles
        valid_roles = ['Admin', 'Dev', 'Client']
        for role in new_roles:
            if role not in valid_roles:
                return jsonify({'message': f'Rôle invalide: {role}'}), 400
        
        user_id, user_data = get_user_by_username(username)
        
        if not user_data:
            return jsonify({'message': 'Utilisateur non trouvé'}), 404
        
        users = load_users()
        users[user_id]['roles'] = new_roles
        users[user_id]['updated_at'] = datetime.now().isoformat()
        save_users(users)
        
        print(f"✓ Rôles mis à jour pour {username}: {new_roles}")
        
        return jsonify({
            'message': f'Rôles mis à jour!',
            'username': username,
            'roles': new_roles
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Erreur: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Route de santé pour vérifier que l'API fonctionne"""
    return jsonify({'status': 'API en ligne ✓'}), 200

@app.errorhandler(404)
def not_found(error):
    # Servir index.html pour les routes qui ne sont pas des API
    if not error.code or error.code == 404:
        request_path = request.path
        # Si c'est une route API, retourner JSON
        if request_path.startswith('/api/'):
            return jsonify({'message': 'Route non trouvée'}), 404
        # Sinon, servir le frontend
        try:
            return send_from_directory('.', 'index.html'), 200
        except:
            return jsonify({'message': 'Route non trouvée'}), 404
    return jsonify({'message': 'Route non trouvée'}), 404

# ===== ROUTE RACINE - SERVIR LE FRONTEND =====

@app.route('/')
def serve_index():
    """Servir le fichier index.html à la racine"""
    try:
        return send_from_directory('.', 'index.html'), 200
    except:
        return jsonify({'message': 'Erreur lors du chargement du frontend'}), 500

# ===== LANCEMENT DE L'APP =====

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Démarrage de l'API WayMe")
    print("=" * 50)
    print(f"📍 Adresse: http://0.0.0.0:{PORT}")
    print(f"🔧 Environnement: {'PRODUCTION' if IS_PRODUCTION else 'DÉVELOPPEMENT'}")
    print("📊 Users file: users.json")
    print("=" * 50)
    
    # En développement: debug=True avec localhost
    # En production: debug=False avec 0.0.0.0 (pour accepter les connexions externes)
    app.run(
        debug=not IS_PRODUCTION,
        host='0.0.0.0',
        port=PORT,
        threaded=True
    )