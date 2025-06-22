# AngularFrontend

Ce projet utilise l’API standalone moderne d’Angular (Angular 14+) pour le routage et le bootstrap de l’application.

## Démarrage du serveur de développement

Pour démarrer le serveur de développement local, exécutez :

```bash
ng serve
```

Une fois le serveur en cours d'exécution, ouvrez votre navigateur et accédez à `http://localhost:4200/`. L'application se rechargera automatiquement chaque fois que vous modifiez l'un des fichiers source.

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

## Génération de code

Angular CLI inclut des outils de génération de code puissants. Pour générer un composant standalone, exécutez :

```bash
ng generate component features/ma-feature --standalone
```

## Build de production

Pour construire le projet pour la production, exécutez :

```bash
ng build
```

Cela compilera votre projet et stockera les artefacts de construction dans le répertoire `dist/`. Par défaut, la construction pour la production optimise votre application pour les performances et la vitesse.

## Tests unitaires

Pour exécuter les tests unitaires avec le test runner [Karma](https://karma-runner.github.io), utilisez la commande suivante :

```bash
ng test
```

## Tests end-to-end

Pour les tests end-to-end (e2e), exécutez :

```bash
ng e2e
```

Angular CLI ne fournit pas de framework de test end-to-end par défaut. Vous pouvez en choisir un qui convient à vos besoins.

## Ressources complémentaires

- [Angular Standalone Components](https://angular.dev/guide/standalone-components)
- [Angular Routing (API moderne)](https://angular.dev/guide/router)
- [Angular CLI](https://angular.dev/tools/cli)
