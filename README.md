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

- Les fichiers statiques Angular sont servis depuis `public/app/` en production.
- Le proxy Angular (`proxy.conf.json`) permet d’éviter les problèmes de CORS en développement.
- Les routes `/api/*` sont réservées à l’API Symfony.

---

## Structure évolutive

Ajoute ici les modules, dossiers ou conventions spécifiques à ton projet au fur et à mesure de son évolution.

## 🔄 Gestion des mises à jour des dépendances

Dans ce projet, nous utilisons des outils pour **gérer proprement les mises à jour des packages** npm et éviter les erreurs dues à des dépendances obsolètes ou dépréciées.

### 🧰 Outils utilisés

#### [`npm-check-updates`](https://www.npmjs.com/package/npm-check-updates)

Cet outil permet de :

- Lister les versions *majeures*, *mineures* ou *patch* disponibles
- Mettre à jour les versions dans le fichier `package.json` **sans modifier immédiatement les fichiers installés**
- Forcer les dernières versions stables, même si elles cassent la compatibilité

---

### 🛠️ Mise en place

Installe `npm-check-updates` globalement (si ce n’est pas déjà fait) :

```bash
npm install -g npm-check-updates
```

🔍 Vérifier les mises à jour disponibles

Dans le dossier du projet :

ncu

Cela affichera les dépendances dans package.json avec leur version actuelle et la version la plus récente disponible.

Exemple de sortie :

 tailwindcss     ^3.4.1  →  ^4.1.7
 postcss         ^8.4.21 →  ^9.0.0

🚀 Mettre à jour package.json automatiquement

Une fois prêt à mettre à jour les versions :

ncu -u

Cela met à jour les versions listées dans package.json, mais ne modifie pas encore les dépendances installées.

Ensuite, exécute :

npm install

🧹 Nettoyage recommandé

Avant de réinstaller après des mises à jour :

rm -rf node_modules package-lock.json
npm install

🪓 Supprimer les versions obsolètes et aplatir les dépendances

Pour éviter les conflits liés aux anciennes dépendances :

npm dedupe

⚠️ Gérer les dépendances dépréciées

Lors de l’installation, tu peux voir des avertissements comme :

npm WARN deprecated inflight@1.0.6: This module is not supported...
npm WARN deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported

Ces messages indiquent que certaines sous-dépendances utilisées sont obsolètes. Pour identifier leur provenance :

npm ls inflight
npm ls rimraf
npm ls glob

Ensuite, mets à jour les packages parents ou cherche une alternative plus récente.
🛡️ Vérifier les vulnérabilités de sécurité

Exécute ces commandes pour vérifier et corriger les vulnérabilités :

npm audit fix         # Correction automatique si possible
npm audit             # Audit complet des failles restantes

🔄 Routine de mise à jour recommandée

#### 1. Mettre à jour les outils globaux si besoin

npm install -g npm-check-updates

#### 2. Vérifier les mises à jour disponibles

ncu

#### 3. Mettre à jour le package.json

ncu -u

#### 4. Nettoyer et réinstaller

rm -rf node_modules package-lock.json
npm install

#### 5. Aplatir les dépendances

npm dedupe

#### 6. Vérifier les failles de sécurité

npm audit fix
