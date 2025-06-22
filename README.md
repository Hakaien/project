# Dashboard Application

Ce projet est une application de gestion de projets composée de deux parties principales :

- **Frontend Angular** (interface utilisateur)
- **Backend Symfony** (API, logique métier, gestion BDD)

---

## Architecture du projet

```
project_default/
├── deploy.sh                  # Script de build et déploiement (Angular → Symfony)
├── README.md                  # Documentation du projet
│
├── angular-frontend/          # Application Angular (frontend)
│   ├── angular.json           # Configuration Angular CLI
│   ├── package.json           # Dépendances npm
│   ├── proxy.conf.json        # Proxy pour le dev (API Symfony)
│   ├── tsconfig*.json         # Configurations TypeScript
│   ├── public/                # Fichiers statiques publics (favicon, etc.)
│   └── src/
│       ├── app/               # Composants, modules, services Angular
│       │   ├── core/          # Services et modules centraux
│       │   ├── features/      # Modules fonctionnels
│       │   ├── layout/        # Composants de layout
│       │   ├── models/        # Modèles de données
│       │   └── shared/        # Composants partagés
│       ├── assets/            # Images, polices, données statiques
│       ├── environments/      # Configurations d'environnement Angular
│       ├── i18n/              # Fichiers de traduction
│       ├── styles/            # Fichiers SCSS globaux et utilitaires
│       ├── index.html         # Point d'entrée Angular
│       ├── main.ts            # Bootstrap Angular
│       ├── input.css          # Source Tailwind CSS
│       ├── output.css         # CSS généré par Tailwind (pour le déploiement)
│       └── styles.scss        # Styles globaux
│
├── symfony-backend/           # Application Symfony (backend)
│   ├── bin/                   # Commandes Symfony
│   ├── config/                # Configurations Symfony
│   │   ├── packages/          # Configs par bundle
│   │   └── routes/            # Configs de routes
│   ├── migrations/            # Migrations BDD
│   ├── public/                # Racine web (sert Angular et API)
│   │   ├── index.html         # Fichier d'entrée Angular copié (prod)
│   │   ├── output.css         # CSS versionné copié (prod)
│   │   ├── manifest.json      # Manifest de versioning
│   │   ├── assets/            # Assets Angular copiés (prod)
│   │   └── ...                # JS/CSS versionnés
│   ├── src/                   # Contrôleurs, entités, repositories Symfony
│   │   ├── Controller/
│   │   ├── Entity/
│   │   └── Repository/
│   ├── var/                   # Fichiers temporaires, logs, cache
│   ├── vendor/                # Dépendances PHP (Composer)
│   ├── composer.json          # Dépendances Composer
│   ├── composer.lock
│   └── symfony.lock
```

---

## Fonctionnement

- **Développement** :
  - Angular : `npm start` ou `ng serve` sur le port 4200 (proxy API via `proxy.conf.json`)
  - Symfony : `symfony serve` ou `php -S localhost:8000 -t public`
- **Production** :
  - Utiliser le script `deploy.sh` pour builder Angular, générer le CSS Tailwind, copier et versionner les fichiers dans `symfony-backend/public/`
  - Symfony sert à la fois l’API et l’interface Angular sur le même port

---

## Démarrage rapide

```bash
# Backend
cd symfony-backend
composer install
symfony serve

# Frontend (dev)
cd ../angular-frontend
npm install
npm start

# Déploiement (prod)
cd ..
bash deploy.sh
```

---

## Accès

- **Frontend Angular** :  
  - Dev : [http://localhost:4200](http://localhost:4200)
  - Prod : [http://localhost:8000/](http://localhost:8000/)
- **API Symfony** : [http://localhost:8000/api/](http://localhost:8000/api/)

---

## Notes importantes

- Le script `deploy.sh` gère :
  - La compilation Tailwind CSS (input.css → output.css)
  - Le build Angular (production)
  - La copie et le versioning des fichiers JS/CSS dans Symfony (`public/`)
  - La génération d’un `manifest.json` pour le mapping des fichiers versionnés
  - La copie des assets Angular (images, fonts, etc.)
- Le proxy Angular (`proxy.conf.json`) permet d’éviter les problèmes de CORS en développement.
- Les routes `/api/*` sont réservées à l’API Symfony.
- Les fichiers statiques Angular sont servis depuis `symfony-backend/public/` en production.
- Pour de meilleures performances, configure ton serveur web pour :
  - `Cache-Control: max-age=31536000, immutable` pour les fichiers versionnés
  - `no-cache` ou `must-revalidate` pour `index.html`

---

## 🔄 Gestion des mises à jour des dépendances

Dans ce projet, nous utilisons des outils pour **gérer proprement les mises à jour des packages** npm et éviter les erreurs dues à des dépendances obsolètes ou dépréciées.

### 🧰 Outils utilisés

#### [`npm-check-updates`](https://www.npmjs.com/package/npm-check-updates)

Cet outil permet de :
- Lister les versions majeures, mineures ou patch disponibles
- Mettre à jour les versions dans le fichier `package.json` sans modifier immédiatement les fichiers installés
- Forcer les dernières versions stables, même si elles cassent la compatibilité

### 🛠️ Mise en place

Installe `npm-check-updates` globalement (si ce n’est pas déjà fait) :

```bash
npm install -g npm-check-updates
```

#### Vérifier les mises à jour disponibles

Dans le dossier du projet :

```bash
ncu
```

Cela affichera les dépendances dans package.json avec leur version actuelle et la version la plus récente disponible.

#### Mettre à jour package.json automatiquement

```bash
ncu -u
npm install
```

#### Nettoyage recommandé

Avant de réinstaller après des mises à jour :

```bash
rm -rf node_modules package-lock.json
npm install
```

#### Aplatir les dépendances

```bash
npm dedupe
```

#### Vérifier les vulnérabilités de sécurité

```bash
npm audit fix
npm audit
```

#### Gérer les dépendances dépréciées

Lors de l’installation, tu peux voir des avertissements comme :

```
npm WARN deprecated inflight@1.0.6: This module is not supported...
npm WARN deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
```

Pour identifier leur provenance :

```bash
npm ls inflight
npm ls rimraf
npm ls glob
```

Ensuite, mets à jour les packages parents ou cherche une alternative plus récente.

---

## Exemple de configuration Nginx

Pour servir Symfony et Angular proprement en production :

```nginx
location / {
    root /var/www/html/symfony-backend/public;
    try_files $uri $uri/ /index.html;
}

location ~* \.(js|css|png|jpg|svg|woff|woff2)$ {
    root /var/www/html/symfony-backend/public;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

Cette configuration :
- Sert les fichiers statiques Angular et Symfony depuis le même dossier public
- Permet le fallback Angular (SPA) sur index.html
- Met en cache fort les fichiers versionnés (js, css, images, polices)

---

## Structure évolutive

Ajoute ici les modules, dossiers ou conventions spécifiques à ton projet au fur et à mesure de son évolution.
