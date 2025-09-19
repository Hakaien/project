# Workflow de Login Complet - Angular + Symfony

Ce projet implémente un système de login complet avec workflow d'invitation utilisateur, double authentification (2FA) et interface d'administration.

## Architecture

### Backend (Symfony)
- **Authentification JWT** avec Lexik JWT Bundle
- **Double authentification** avec Scheb 2FA Bundle (Email, TOTP, Google Authenticator)
- **Gestion des utilisateurs** avec workflow d'invitation
- **API REST** pour toutes les interactions frontend
- **Envoi d'emails** avec templates Twig

### Frontend (Angular)
- **Interface utilisateur** moderne avec Tailwind CSS
- **Gestion d'état** avec services Angular
- **Guards de sécurité** pour protéger les routes
- **Composants standalone** pour une architecture modulaire

## Workflow Complet

### 1. Création d'utilisateur par l'administrateur
```
Admin → Interface Admin → Créer utilisateur → Email d'invitation envoyé
```

### 2. Configuration du compte par l'utilisateur
```
Email invitation → Définir mot de passe → Configurer 2FA → Email de confirmation
```

### 3. Connexion utilisateur
```
Login → Vérification 2FA → Accès au dashboard
```

## Fonctionnalités Implémentées

### ✅ Backend Symfony
- [x] Entité User avec tous les champs nécessaires
- [x] Contrôleur d'authentification (AuthController)
- [x] Contrôleur d'administration (AdminController)
- [x] Contrôleur 2FA (TwoFactorController)
- [x] Service d'envoi d'emails (EmailService)
- [x] Configuration de sécurité avec 2FA
- [x] Templates email Twig
- [x] Routes API complètes

### ✅ Frontend Angular
- [x] Composant de connexion (LoginComponent)
- [x] Composant de définition de mot de passe (SetPasswordComponent)
- [x] Composant de configuration 2FA (Setup2FAComponent)
- [x] Composant de vérification 2FA (TwoFactorComponent)
- [x] Composant de mot de passe oublié (ForgotPasswordComponent)
- [x] Composant d'inscription (RegisterComponent)
- [x] Dashboard utilisateur (DashboardComponent)
- [x] Interface d'administration (AdminDashboardComponent)
- [x] Gestion des utilisateurs (UserManagementComponent)
- [x] Service d'authentification (AuthService)
- [x] Service d'administration (AdminService)
- [x] Guards de sécurité (AuthGuard, AdminGuard, GuestGuard)
- [x] Routes configurées

### ✅ Emails
- [x] Template d'invitation utilisateur
- [x] Template de confirmation de configuration
- [x] Template de code 2FA
- [x] Template de réinitialisation de mot de passe

## Installation et Configuration

### Prérequis
- PHP 8.1+
- Composer
- Node.js 18+
- Angular CLI
- Symfony CLI (optionnel)

### Backend Symfony

1. **Installer les dépendances**
```bash
cd symfony-backend
composer install
```

2. **Configuration de la base de données**
```bash
# Créer la base de données
php bin/console doctrine:database:create

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Charger les fixtures (optionnel)
php bin/console doctrine:fixtures:load
```

3. **Configuration des variables d'environnement**
```bash
# Copier le fichier .env
cp .env .env.local

# Configurer les variables nécessaires
# - DATABASE_URL
# - JWT_SECRET_KEY
# - MAILER_DSN (pour l'envoi d'emails)
# - FRONTEND_URL
```

4. **Générer les clés JWT**
```bash
php bin/console lexik:jwt:generate-keypair
```

5. **Démarrer le serveur**
```bash
symfony server:start
# ou
php -S localhost:8000 -t public/
```

### Frontend Angular

1. **Installer les dépendances**
```bash
cd angular-frontend
npm install
```

2. **Configuration de l'environnement**
```bash
# Vérifier les fichiers environment.ts
# - apiUrl: URL du backend Symfony
```

3. **Démarrer le serveur de développement**
```bash
ng serve
```

## Utilisation

### 1. Créer un utilisateur administrateur

```bash
# Via les fixtures ou manuellement
php bin/console doctrine:fixtures:load
```

### 2. Se connecter en tant qu'admin

1. Aller sur `http://localhost:4200/login`
2. Se connecter avec les identifiants admin
3. Accéder à l'administration via le bouton "Administration"

### 3. Créer un nouvel utilisateur

1. Aller sur "Gestion des utilisateurs"
2. Cliquer sur "Créer un utilisateur"
3. Remplir le formulaire
4. L'utilisateur recevra un email d'invitation

### 4. Configuration du compte utilisateur

1. L'utilisateur clique sur le lien dans l'email
2. Définit son mot de passe
3. Configure sa méthode de 2FA
4. Reçoit un email de confirmation

### 5. Connexion utilisateur

1. L'utilisateur se connecte avec ses identifiants
2. Saisit le code 2FA
3. Accède à son dashboard

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/profile` - Profil utilisateur
- `POST /api/auth/set-password` - Définir mot de passe
- `POST /api/auth/setup-2fa` - Configurer 2FA
- `POST /api/auth/forgot-password` - Mot de passe oublié

### Administration
- `GET /api/admin/users` - Liste des utilisateurs
- `POST /api/admin/users` - Créer un utilisateur
- `GET /api/admin/users/{id}` - Détails d'un utilisateur
- `PUT /api/admin/users/{id}` - Modifier un utilisateur
- `DELETE /api/admin/users/{id}` - Supprimer un utilisateur

### 2FA
- `GET /api/2fa/status` - Statut 2FA
- `POST /api/2fa/disable` - Désactiver 2FA

## Sécurité

### Backend
- Authentification JWT stateless
- Double authentification obligatoire
- Validation des données d'entrée
- Protection CSRF
- Hachage sécurisé des mots de passe

### Frontend
- Guards de sécurité sur les routes
- Validation des formulaires
- Gestion des erreurs
- Stockage sécurisé des tokens

## Déploiement

### Production
1. **Backend**
   - Configurer les variables d'environnement de production
   - Optimiser l'autoloader Composer
   - Configurer le serveur web (Apache/Nginx)
   - Configurer SSL/TLS

2. **Frontend**
   - Compiler l'application Angular
   - Copier les fichiers dans le dossier `public` de Symfony
   - Configurer le serveur web pour servir les fichiers statiques

### Docker (optionnel)
```bash
# Créer les fichiers Dockerfile et docker-compose.yml
# pour un déploiement containerisé
```

## Tests

Voir le fichier `test-workflow.md` pour les tests complets du workflow.

## Support

Pour toute question ou problème :
1. Vérifier les logs Symfony (`var/log/`)
2. Vérifier la console du navigateur
3. Tester les endpoints API directement
4. Consulter la documentation des bundles utilisés

## Améliorations Futures

- [ ] Interface de gestion des rôles
- [ ] Statistiques d'utilisation
- [ ] Logs d'audit
- [ ] Notifications en temps réel
- [ ] Support multi-tenant
- [ ] API GraphQL
- [ ] Tests automatisés
- [ ] CI/CD pipeline
