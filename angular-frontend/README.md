# AngularFrontend

Ce projet utilise l'API standalone moderne d'Angular (Angular 14+) pour le routage et le bootstrap de l'application, avec Tailwind CSS pour les styles.

## 🎨 Build CSS avec Tailwind

Le projet utilise Tailwind CSS pour les styles. Le processus de build est automatisé :

```bash
# Build CSS seulement
npm run build:css

# Build complet (CSS + Angular)
npm run build
```

Le fichier `output.css` est généré dans `src/` et est automatiquement inclus dans le build final.

---ularFrontend

Ce projet utilise l’API standalone moderne d’Angular (Angular 14+) pour le routage et le bootstrap de l’application.

---

## ⚙️ Prérequis techniques

| Logiciel         | Version recommandée |
|------------------|--------------------|
| Node.js          | >= 18.x            |
| npm              | >= 9.x             |
| Angular CLI      | >= 15.x            |

Installez Angular CLI globalement si besoin :

```bash
npm install -g @angular/cli
```

---

## Démarrage du serveur de développement

Pour démarrer le serveur de développement local, exécutez :

```bash
ng serve
```

Une fois le serveur en cours d'exécution, ouvrez votre navigateur et accédez à `http://localhost:4200/`. L'application se rechargera automatiquement chaque fois que vous modifiez l'un des fichiers source.

---

## 🌐 Configuration des environnements

Les variables d’environnement (API endpoints, etc.) sont définies dans :

- `src/environments/environment.ts` (développement)
- `src/environments/environment.prod.ts` (production)

Adaptez ces fichiers pour pointer vers le backend ou les services externes souhaités.

---

## Architecture du routage (standalone)

- Les routes sont définies dans `src/app/app.routes.ts` avec la syntaxe standalone :

  ```typescript
  export const appRoutes: Routes = [ ... ];
  ```

- Le bootstrap de l’application se fait dans `src/main.ts` avec `provideRouter(appRoutes)` :

  ```typescript
  import { bootstrapApplication } from '@angular/platform-browser';
  import { AppComponent } from './app/app.component';
  import { provideRouter } from '@angular/router';
  import { appRoutes } from './app/app.routes';

  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(appRoutes)
      // autres providers globaux
    ]
  });
  ```

- Les composants routés doivent être déclarés avec `standalone: true`.
- Les modules `AppModule` et `AppRoutingModule` ne sont plus utilisés.

### Note sur `src/app/app-routing.module.ts`

Le fichier `src/app/app-routing.module.ts` peut apparaître dans le dépôt (généré par un squelette). Dans ce projet il est volontairement laissé vide et commenté parce que le routing est fourni via `provideRouter(appRoutes)` au moment du bootstrap (voir `src/main.ts` et `src/app/app.routes.ts`).

Nous conservons le fichier pour la sécurité / compatibilité historique. Si vous préférez nettoyer, il est sans danger de le supprimer, mais garder le commentaire aide les nouveaux contributeurs.

Un test basique de `app.routes` est présent dans `src/app/app.routes.spec.ts` pour vérifier que les redirections et routes clés existent.

---

## Génération de code

Angular CLI inclut des outils de génération de code puissants. Pour générer un composant standalone, exécutez :

```bash
ng generate component features/ma-feature --standalone
```

---

## Build de production

Pour construire le projet pour la production, exécutez :

```bash
ng build
```

Cela compilera votre projet et stockera les artefacts de construction dans le répertoire `dist/`. Par défaut, la construction pour la production optimise votre application pour les performances et la vitesse.

---

## ✅ Bonnes pratiques Angular

- Utilisez le dossier `environments/` pour séparer les configurations dev/prod.
- Préférez les composants standalone pour une architecture moderne et modulaire.
- Utilisez les services Angular pour centraliser la logique métier et les appels API.
- Placez les assets statiques dans `src/assets/`.
- Utilisez les outils de linting (`ng lint`) et de formatage (`prettier`, `eslint`).

---

## Tests unitaires

Pour exécuter les tests unitaires avec le test runner [Karma](https://karma-runner.github.io), utilisez la commande suivante :

```bash
ng test
```

---

## Tests end-to-end

Pour les tests end-to-end (e2e), exécutez :

```bash
ng e2e
```

> **Remarque** : Angular CLI ne fournit pas de framework de test end-to-end par défaut. Si vous utilisez Cypress ou un autre outil, adaptez la commande et la configuration en conséquence.

---

## Ressources complémentaires

- [Angular Standalone Components](https://angular.dev/guide/standalone-components)
- [Angular Routing (API moderne)](https://angular.dev/guide/router)
- [Angular CLI](https://angular.dev/tools/cli)
