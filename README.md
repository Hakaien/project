# Dashboard Application – Guide Général

Ce projet est une application de gestion composée de deux parties :

- **Frontend Angular** (interface utilisateur)
- **Backend Symfony** (API, logique métier, gestion BDD)

---

## 🚀 Logique du projet & déploiement

L’application est conçue pour que **le frontend Angular soit compilé puis intégré dans le dossier `public/` du backend Symfony**. Ainsi, Symfony sert à la fois l’API et l’interface Angular en production.

- **En développement** :
  - Angular tourne sur son propre serveur (`ng serve`), communique avec Symfony via un proxy (`proxy.conf.json`) pour éviter les problèmes de CORS.
  - Symfony tourne sur son propre serveur (`symfony serve` ou `php -S`).
- **En production ou préproduction** :
  - Seul le dossier `symfony-backend/` est déployé sur le serveur.
  - Le dossier `public/` de Symfony contient les fichiers compilés Angular (HTML, JS, CSS, assets).
  - Symfony sert l’API et l’interface Angular sur le même domaine et port.

---

## 📦 Utilisation du script `deploy.sh`

Le script `deploy.sh` automatise le processus de build et d’intégration du frontend dans le backend. Il effectue :

1. **Compilation Tailwind CSS** (si utilisé)
2. **Installation des dépendances Node.js** (si besoin)
3. **Build Angular en mode production**
4. **Nettoyage du dossier `public/` de Symfony**
5. **Copie des fichiers Angular compilés dans `symfony-backend/public/`**
6. **Versioning des fichiers JS/CSS pour le cache busting**
7. **Mise à jour des références dans `index.html` et génération d’un `manifest.json`**
8. **Copie des assets (images, polices, etc.)**
9. **Logs détaillés et arrêt en cas d’erreur**

**Commande à lancer à la racine du projet :**

```bash
bash deploy.sh
```

---

## 🛠️ Installation sur un serveur de production ou de test métier

- **Ne déploie que le dossier `symfony-backend/`** sur le serveur cible.
- Le dossier `public/` doit déjà contenir les fichiers Angular compilés (générés par `deploy.sh`).
- Installe les dépendances PHP avec Composer :

  ```bash
  composer install
  ```

- Configure les variables d’environnement (`.env.local`), la base de données, les clés JWT, etc.
- Lance le serveur web (Apache/Nginx) pointant sur `symfony-backend/public/`.
- **Ne jamais exposer le dossier Angular non compilé ni le dossier racine du projet.**

---

## 🔒 Règles de sécurité & connexions front/back

- **Connexion front/back** :
  - En dev, Angular communique avec Symfony via un proxy (`proxy.conf.json`), ce qui évite les problèmes de CORS.
  - En prod, tout passe par le backend Symfony : l’API et l’interface Angular sont servies sur le même domaine, supprimant tout problème de CORS.
- **CORS** : Strictement configuré via `nelmio/cors-bundle` pour n’autoriser que les domaines nécessaires.
- **CSRF** : Activé pour les endpoints sensibles, désactivé pour l’API JWT (stateless).
- **JWT** : Authentification sécurisée via tokens, transmis dans le header `Authorization`.
- **2FA** : Authentification à deux facteurs possible selon la configuration du backend.
- **Sécurité HTTP** : Headers de sécurité (CSP, XSS, clickjacking) gérés via `nelmio/security-bundle`.
- **Jamais exposer les routes de test ou de debug en production.**
- **Ne jamais exposer les fichiers de configuration sensibles ou les clés privées.**

---

## 📚 Pour aller plus loin

- Les détails techniques, commandes, et bonnes pratiques spécifiques à chaque partie sont dans :
  - `angular-frontend/README.md` (frontend)
  - `symfony-backend/Readme.md` (backend)
- La structure complète du projet est décrite dans `structure.md` à la racine.

---

**Résumé** : Ce projet s’appuie sur un workflow moderne où le frontend Angular est compilé puis servi par Symfony. Le script `deploy.sh` garantit un déploiement propre, sécurisé et optimisé. En production, seul le dossier Symfony-backend (avec Angular compilé dans `public/`) doit être installé sur le serveur.
