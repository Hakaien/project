# Dashboard Application

Ce projet est une application de gestion de projets composée de deux parties principales :  

- **Frontend Angular** (interface utilisateur)
- **Backend Symfony** (API, logique métier, gestion BDD)

---

## Architecture du projet

dashboard-app/
│
├── angular-frontend/           # Application Angular (frontend)
│   ├── src/
│   │   ├── app/                # Composants, modules, services Angular
│   │   ├── assets/             # Fichiers statiques (images, etc.)
│   │   ├── environments/       # Configurations d'environnement Angular
│   │   ├── index.html          # Point d'entrée Angular
│   │   ├── main.ts             # Bootstrap Angular
│   │   ├── styles.scss         # Styles globaux
│   │   └── polyfills.ts        # Polyfills (si nécessaire)
│   ├── angular.json            # Configuration Angular CLI
│   ├── package.json            # Dépendances npm
│   ├── tsconfig.json           # Configuration TypeScript
│   ├── tsconfig.app.json       # Config TypeScript spécifique à l'app
│   ├── proxy.conf.json         # Proxy pour le dev (API Symfony)
│   └── ...                     # Autres fichiers de config
│
├── symfony-backend/            # Application Symfony (backend)
│   ├── bin/                    # Commandes Symfony
│   ├── config/                 # Configurations Symfony
│   ├── public/                 # Racine web (sert Angular et API)
│   │   └── app/                # Build Angular (prod)
│   │         └── browser/      # Build Angular
│   ├── src/                    # Contrôleurs, entités, services Symfony
│   ├── var/                    # Fichiers temporaires, logs, cache
│   ├── vendor/                 # Dépendances PHP (Composer)
│   ├── composer.json           # Dépendances Composer
│   ├── .env                    # Variables d'environnement
│   └── ...                     # Autres fichiers Symfony
│
├── README.md                   # Documentation du projet
└── ...

---

## Fonctionnement

- **Développement** :
  - Angular : `ng serve` sur le port 4200 (proxy API via `proxy.conf.json`)
  - Symfony : `symfony serve` ou `php -S localhost:8000 -t public`
- **Production** :
  - Builder Angular dans `symfony-backend/public/app/`
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

# Frontend (prod)
ng build --output-path=../symfony-backend/public/app/browser --base-href=/app/
```

---

## Accès

- **Frontend Angular** :  
  - Dev : [http://localhost:4200](http://localhost:4200)
  - Prod : [http://localhost:8000/app/](http://localhost:8000/app/)
- **API Symfony** : [http://localhost:8000/api/](http://localhost:8000/api/)

---

## Notes

- Les fichiers statiques Angular sont servis depuis `public/app/browser/` en production.
- Le proxy Angular (`proxy.conf.json`) permet d’éviter les problèmes de CORS en développement.
- Les routes `/api/*` sont réservées à l’API Symfony.

---

## Structure évolutive

Ajoute ici les modules, dossiers ou conventions spécifiques à ton projet au fur et à mesure de son évolution.