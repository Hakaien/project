# Test du Workflow de Login Complet

## Workflow de création d'utilisateur et connexion

### 1. Création d'un utilisateur par l'administrateur

1. **Se connecter en tant qu'admin**
   - Aller sur `/login`
   - Se connecter avec un compte admin

2. **Accéder à l'administration**
   - Cliquer sur "Administration" dans le dashboard
   - Aller sur "Gestion des utilisateurs"

3. **Créer un nouvel utilisateur**
   - Cliquer sur "Créer un utilisateur"
   - Remplir le formulaire :
     - Prénom : `John`
     - Nom : `Doe`
     - Email : `john.doe@example.com`
   - Cliquer sur "Créer l'utilisateur"

4. **Vérifier la création**
   - L'utilisateur apparaît dans la liste avec le statut "En attente de mot de passe"
   - Un email d'invitation est envoyé (vérifier les logs ou la console)

### 2. Configuration du compte par l'utilisateur

1. **Définir le mot de passe**
   - Ouvrir l'email d'invitation
   - Cliquer sur le lien "Définir mon mot de passe"
   - Saisir un mot de passe sécurisé (minimum 8 caractères)
   - Confirmer le mot de passe
   - Cliquer sur "Définir le mot de passe"

2. **Configurer la 2FA**
   - Choisir une méthode de 2FA (email, TOTP, ou Google Authenticator)
   - Suivre les instructions selon la méthode choisie
   - Saisir le code de vérification
   - Cliquer sur "Configurer la 2FA"

3. **Vérifier la configuration**
   - Un email de confirmation est envoyé
   - L'utilisateur est redirigé vers la page de connexion

### 3. Connexion de l'utilisateur

1. **Se connecter**
   - Aller sur `/login`
   - Saisir l'email : `john.doe@example.com`
   - Saisir le mot de passe défini
   - Cliquer sur "Se connecter"

2. **Vérification 2FA**
   - Si 2FA par email : vérifier l'email et saisir le code
   - Si 2FA par application : saisir le code de l'application
   - Cliquer sur "Vérifier"

3. **Accès au dashboard**
   - L'utilisateur est connecté et redirigé vers le dashboard
   - Les informations du compte sont affichées

### 4. Vérifications dans l'administration

1. **Retourner à l'administration**
   - Se reconnecter en tant qu'admin
   - Aller sur "Gestion des utilisateurs"

2. **Vérifier le statut**
   - L'utilisateur `john.doe@example.com` doit avoir le statut "Actif"
   - La 2FA doit être marquée comme activée
   - La date de dernière connexion doit être mise à jour

## Points de vérification

### Backend (Symfony)
- [ ] L'utilisateur est créé avec `isPasswordSet = false`
- [ ] Un token de réinitialisation est généré
- [ ] L'email d'invitation est envoyé
- [ ] Le mot de passe est correctement hashé
- [ ] La 2FA est configurée selon la méthode choisie
- [ ] L'email de confirmation est envoyé
- [ ] La connexion fonctionne avec JWT
- [ ] La 2FA est vérifiée lors de la connexion

### Frontend (Angular)
- [ ] Les routes sont correctement configurées
- [ ] Les guards fonctionnent (AuthGuard, AdminGuard, GuestGuard)
- [ ] Les formulaires sont valides
- [ ] Les erreurs sont affichées correctement
- [ ] La navigation fonctionne entre les étapes
- [ ] Les services API fonctionnent
- [ ] L'interface utilisateur est responsive

### Emails
- [ ] Email d'invitation avec lien de définition de mot de passe
- [ ] Email de confirmation après configuration 2FA
- [ ] Email de code 2FA lors de la connexion

## Commandes utiles

### Démarrer les serveurs
```bash
# Backend Symfony
cd symfony-backend
symfony server:start

# Frontend Angular
cd angular-frontend
ng serve
```

### Vérifier les logs
```bash
# Logs Symfony
tail -f symfony-backend/var/log/dev.log

# Logs Angular
# Vérifier la console du navigateur
```

### Tester les API
```bash
# Créer un utilisateur (en tant qu'admin)
curl -X POST http://localhost:8000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"email":"test@example.com","firstName":"Test","lastName":"User"}'

# Définir un mot de passe
curl -X POST http://localhost:8000/api/auth/set-password \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN_FROM_EMAIL","password":"newpassword123"}'

# Configurer 2FA
curl -X POST http://localhost:8000/api/auth/setup-2fa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"method":"email","authCode":"123456"}'
```

## Problèmes courants et solutions

1. **Erreur CORS** : Vérifier la configuration du proxy Angular
2. **Token JWT invalide** : Vérifier la configuration JWT dans Symfony
3. **Email non envoyé** : Vérifier la configuration SMTP
4. **2FA ne fonctionne pas** : Vérifier la configuration Scheb 2FA
5. **Routes non trouvées** : Vérifier la configuration des routes Angular
