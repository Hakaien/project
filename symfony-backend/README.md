# 🧩 Symfony Backend – Documentation Technique

Ce dossier contient la partie **backend** de l’application Angular/Symfony. L’API REST est sécurisée (JWT, CSRF, 2FA, headers HTTP) et Angular est servi via le dossier `public/` de Symfony, supprimant tout problème de CORS en production.

---

## 📌 Sommaire

- [📦 Bundles & dépendances](#-bundles--dépendances)
- [🛣️ Routes exposées](#️-routes-exposées)
- [📋 Prérequis serveur](#-prérequis-serveur)
- [🚀 Lancement du projet](#-lancement-du-projet)
- [🔑 Sécurité avancée (JWT, 2FA)](#-sécurité-avancée-jwt-2fa)
- [🧪 Tests et documentation](#-tests-et-documentation)
- [🔐 Gestion de la sécurité](#-gestion-de-la-sécurité)
- [📎 Notes supplémentaires](#-notes-supplémentaires)

---

## 📦 Bundles & dépendances

| Bundle / Package                        | Version   | Description                                 |
|-----------------------------------------|-----------|---------------------------------------------|
| symfony/framework-bundle                | 7.2.*     | Base du framework Symfony                   |
| doctrine/orm                            | ^3.4      | ORM Doctrine                                |
| doctrine/doctrine-bundle                | ^2.15     | Intégration Doctrine/Symfony                |
| doctrine/doctrine-migrations-bundle     | ^3.4      | Migrations de base de données               |
| lexik/jwt-authentication-bundle         | *         | Authentification JWT                        |
| nelmio/security-bundle                  | ^3.5      | Headers de sécurité HTTP                    |
| symfony/security-bundle                 | 7.2.*     | Système de sécurité (firewalls, rôles, etc) |
| symfony/dotenv                          | 7.2.*     | Variables d’environnement                   |
| symfony/console                         | 7.2.*     | Commandes CLI Symfony                       |
| symfony/maker-bundle (dev)              | ^1.63     | Génération de code (dev uniquement)         |
| scheb/2fa-bundle                        | *         | 2FA générique pour Symfony                  |
| scheb/2fa-totp                          | *         | 2FA via TOTP (Google Authenticator compatible) |
| scheb/2fa-google-authenticator          | *         | 2FA via Google Authenticator                |
| scheb/2fa-email                         | *         | 2FA par email                               |

---

## 🛣️ Routes exposées

| Méthode | URI                  | Description                                 |
|---------|----------------------|---------------------------------------------|
| POST    | `/api/auth/login`    | Authentification JWT                        |
| POST    | `/api/auth/logout`   | Déconnexion JWT                             |
| GET     | `/api/user/profile`  | Récupération du profil utilisateur          |
| GET     | `/2fa`               | Démarrage de la 2FA                         |
| POST    | `/2fa_check`         | Vérification du code 2FA                    |
| GET/POST| `/test/api`          | Endpoint de test sécurisé (dev/admin)       |

> **Remarque** : Les routes de test sont accessibles uniquement en environnement de développement ou aux administrateurs.

---

## 📋 Prérequis serveur

- PHP >= **8.3**
- Composer >= **2.6**
- Symfony CLI (optionnel mais recommandé)
- Serveur Web (Apache / Nginx)
- Base de données MySQL ou PostgreSQL
- OpenSSL (pour les clés JWT)
- Node.js >= 18.x (si assets front à builder)

---

## 🔐 Gestion de la sécurité

### Sécurité HTTP

La sécurité HTTP vise à protéger l’application contre les attaques courantes du web (XSS, clickjacking, etc.) en configurant des headers HTTP adaptés.

- **Configuration via [nelmio/security-bundle](https://symfony.com/doc/current/bundles/NelmioSecurityBundle/index.html)** :
  - **Content Security Policy (CSP)** : Limite les sources de scripts, styles, images, etc. pour réduire les risques XSS.
  - **X-Frame-Options** : Empêche l’intégration du site dans une iframe (protection contre le clickjacking).
  - **X-Content-Type-Options** : Empêche le navigateur d’interpréter les fichiers comme autre chose que leur type déclaré.
  - **Strict-Transport-Security (HSTS)** : Force l’utilisation du HTTPS.

Exemple de configuration (config/packages/nelmio_security.yaml) :

```yaml
nelmio_security:
    clickjacking:
        paths: { '^/': DENY }
    content_type:
        nosniff: true
    csp:
        enforce: true
        default_src: ['self']
        script_src: ['self']
        style_src: ['self']
```

### Sécurité CSRF

Le CSRF (Cross-Site Request Forgery) protège contre les attaques où un utilisateur authentifié est amené à exécuter une action non désirée sur une application où il est connecté.

- **Activé par défaut dans Symfony pour les formulaires**.
- **Pour les APIs stateless (JWT)**, le CSRF n’est généralement pas utilisé, mais il reste pertinent pour les endpoints sensibles ou d’administration accessibles via interface web.
- **Token CSRF** : Symfony génère un token unique à chaque formulaire, à valider côté serveur.

Exemple d’utilisation dans un formulaire Twig :

```twig
<form method="post">
    <input type="hidden" name="_csrf_token" value="{{ csrf_token('intention') }}">
    ...
</form>
```

### Sécurité JWT (JSON Web Token)

Le JWT permet une authentification stateless, adaptée aux APIs modernes.

- **Bundle utilisé** : [LexikJWTAuthenticationBundle](https://github.com/lexik/LexikJWTAuthenticationBundle)
- **Fonctionnement** :
  - L’utilisateur s’authentifie via `/api/auth/login` (POST, avec email/mot de passe).
  - Le backend retourne un token JWT signé.
  - Ce token est envoyé dans le header `Authorization: Bearer <token>` à chaque requête API.
  - Le backend vérifie la validité et la signature du token à chaque appel.
- **Avantages** :
  - Stateless (pas de session côté serveur)
  - Facile à intégrer avec Angular ou tout autre frontend moderne
- **Sécurité** :
  - Les clés privées/publics doivent être protégées (voir section génération des clés JWT)
  - Le token doit être stocké côté client de façon sécurisée (ex : stockage en mémoire, jamais en localStorage si possible)
  - Prévoir une expiration courte et un mécanisme de refresh si besoin

Exemple d’appel API avec JWT :

```http
GET /api/user/profile HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
```

### Sécurité 2FA (Double authentification)

La double authentification (2FA) ajoute une couche de sécurité supplémentaire après la saisie du mot de passe.

- **Bundles utilisés** : [scheb/2fa-bundle](https://github.com/scheb/two-factor-bundle), [scheb/2fa-totp](https://github.com/scheb/2fa), [scheb/2fa-google-authenticator](https://github.com/scheb/2fa), [scheb/2fa-email](https://github.com/scheb/2fa)
- **Fonctionnement** :
  - Après login, l’utilisateur doit saisir un code reçu par email ou généré par une application (Google Authenticator, etc.).
  - Les routes `/2fa` (démarrage) et `/2fa_check` (vérification) gèrent ce processus.
- **Configuration** :
  - Personnaliser dans `config/packages/scheb_2fa.yaml` (méthode, durée, etc.)
  - Pour la 2FA par email, configurer le transport mailer dans `.env`
- **Bonnes pratiques** :
  - Proposer la 2FA en option à l’utilisateur, mais la rendre obligatoire pour les comptes sensibles (admin)
  - Stocker les secrets 2FA de façon sécurisée (hashés ou chiffrés)
  - Prévoir un mécanisme de récupération en cas de perte du second facteur

---

## 🚀 Lancement du projet

1. **Cloner le dépôt**

   ```bash
   git clone <url-du-repo> symfony-backend
   cd symfony-backend
   ```

2. **Installer les dépendances**

   ```bash
   composer install
   ```

3. **Configurer les variables d’environnement**
   - Copier `.env` en `.env.local` et adapter vos paramètres :

     ```env
     DATABASE_URL="mysql://user:pass@127.0.0.1:3306/nom_bdd"
     JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
     JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
     JWT_PASSPHRASE=<votre-passphrase>
     ```

   **À quoi servent ces variables ?**

   - `DATABASE_URL` : Connexion à la base de données.
   - `JWT_SECRET_KEY` / `JWT_PUBLIC_KEY` : Clés privées/publiques pour signer et vérifier les tokens JWT.
   - `JWT_PASSPHRASE` : Mot de passe de la clé privée JWT.
   - `MAILER_DSN` : Configuration de l’envoi d’emails (utilisé pour la 2FA par email).

4. **Générer les clés JWT**

   1. **Créer le dossier des clés (si besoin) :**

      ```bash
      mkdir -p config/jwt
      ```

   2. **Générer la clé privée (protégée par mot de passe) :**

      ```bash
      openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
      ```

   3. **Générer la clé publique :**

      ```bash
      openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout
      ```

   **À quoi servent ces clés ?**
   - La clé **privée** (`private.pem`) sert à signer les tokens JWT.
   - La clé **publique** (`public.pem`) sert à vérifier la signature des tokens JWT.

   **Sécurité :**
   - **Ne jamais versionner** `private.pem` dans Git ni le transférer sur un dépôt public.
   - Le fichier `private.pem` doit être gardé secret et uniquement transféré sur le serveur de production de façon sécurisée.
   - Le fichier `public.pem` peut être partagé entre plusieurs serveurs si besoin.

5. **Lancer le serveur Symfony**

   ```bash
   symfony serve
   ```

   Ou configurer Apache/Nginx en production.

---

## 🧪 Tests et documentation

- Les fichiers de test se trouvent dans le dossier :

   ```docs
   symfony-backend/src/Test/
   ```

- Le fichier d’explication des tests :

  ```files
  symfony-backend/src/Test/README.md
  ```

- Pour exécuter les tests unitaires (si présents dans `tests/`) :

  ```bash
  php bin/phpunit
  ```

---

## 📎 Notes supplémentaires

- Si vous utilisez un reverse proxy (Varnish, Traefik…), configurez correctement `trusted_proxies` dans `framework.yaml`.
- Pour la 2FA par email, configurez le transport mailer dans `.env`.
- Les routes de test ne doivent jamais être exposées en production.

---

## 📮 Contact

Pour toute question technique sur cette partie Symfony, contactez l’équipe backend ou ouvrez un ticket sur le repo Git.
