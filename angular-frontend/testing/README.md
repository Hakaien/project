# Dossier Testing - Angular 19.12

Ce dossier centralise tous les fichiers et outils liés aux tests de l'application Angular 19.12.

## 📁 Structure du dossier

```
testing/
├── README.md                   # Ce fichier d'explication
├── jest.config.js              # Configuration Jest (tests unitaires)
├── test-utils.ts              # Fonctions utilitaires pour les tests
├── setup-jest.ts              # Configuration globale Jest
├── mocks/                     # Données simulées pour les tests
│   ├── user.mock.ts
│   ├── api-responses.mock.ts
│   └── services.mock.ts
├── fixtures/                  # Données de test statiques
│   ├── users.json
│   └── api-data.json
└── cypress/                   # Tests end-to-end avec Cypress
    ├── cypress.config.ts      # Configuration Cypress
    ├── e2e/                   # Tests e2e
    │   ├── auth.cy.ts
    │   ├── dashboard.cy.ts
    │   └── navigation.cy.ts
    ├── fixtures/              # Données pour tests e2e
    │   └── example.json
    ├── support/               # Commandes personnalisées
    │   ├── commands.ts
    │   └── e2e.ts
    └── downloads/             # Fichiers téléchargés pendant tests
```

## 📄 Description des fichiers

### `jest.config.js`

**Rôle :** Configuration du framework de test Jest (remplace Karma)

- Configure l'environnement de test
- Définit les transformations TypeScript
- Paramètre les rapports de couverture de code
- Gère les mocks automatiques

**Utilisation :**

```bash
ng test                        # Lance Jest avec cette config
ng test --coverage            # Génère un rapport de couverture
ng test --watch              # Mode watch (défaut)
```

### `setup-jest.ts`

**Rôle :** Configuration globale Jest

- Initialisation avant tous les tests
- Polyfills nécessaires
- Configuration globale des mocks

### `test-utils.ts`

**Rôle :** Fonctions utilitaires pour simplifier l'écriture des tests

- Création rapide de mocks
- Helpers pour les tests de composants
- Fonctions de configuration communes avec Testing Library

**Exemple d'utilisation :**

```typescript
import { createMockUser, renderComponent } from '../testing/test-utils';

describe('UserComponent', () => {
  it('should display user name', async () => {
    const mockUser = createMockUser();
    const { getByText } = await renderComponent(UserComponent, {
      componentInputs: { user: mockUser }
    });
    
    expect(getByText(mockUser.name)).toBeInTheDocument();
  });
});
```

### `mocks/`

**Rôle :** Contient les données et services simulés

- `user.mock.ts` : Utilisateurs fictifs
- `api-responses.mock.ts` : Réponses API simulées
- `services.mock.ts` : Services mockés avec Jest

**Utilisation :**

```typescript
import { MOCK_USERS } from '../testing/mocks/user.mock';
import { mockApiService } from '../testing/mocks/services.mock';
```

### `fixtures/`

**Rôle :** Données statiques au format JSON pour les tests

- Permet de tester avec des jeux de données réalistes
- Facilite la maintenance des données de test

### `cypress/`

**Rôle :** Tests end-to-end avec Cypress (remplace Protractor)

- **`cypress.config.ts`** : Configuration principale Cypress
- **`e2e/`** : Tests de parcours utilisateur complets
- **`fixtures/`** : Données pour les tests e2e
- **`support/`** : Commandes personnalisées Cypress

**Utilisation :**

```bash
npx cypress open              # Interface graphique Cypress
npx cypress run               # Exécution en mode headless
ng e2e                        # Si configuré dans angular.json
```

## 🧪 Types de tests dans Angular 19.12

### Tests Unitaires (`*.spec.ts`)

- **Framework :** Jest + Angular Testing Library
- **Où :** À côté des fichiers source (`src/app/`)
- **Quoi :** Teste une unité isolée (composant, service, pipe)
- **Configuration :** `jest.config.js`

### Tests d'Intégration

- **Framework :** Jest + TestBed Angular
- **Où :** Dans `src/app/` avec les composants
- **Quoi :** Teste l'interaction entre plusieurs composants
- **Configuration :** `jest.config.js`

### Tests End-to-End

- **Framework :** Cypress
- **Où :** `testing/cypress/e2e/`
- **Quoi :** Teste l'application complète côté utilisateur
- **Configuration :** `testing/cypress/cypress.config.ts`

## 🚀 Commandes utiles Angular 19.12

```bash
# Tests unitaires avec Jest
ng test                           # Exécute Jest en mode watch
ng test --watch=false            # Exécute Jest une seule fois
ng test --coverage               # Génère un rapport de couverture
ng test --watch=false --browsers=ChromeHeadless  # Mode CI

# Tests e2e avec Cypress
npx cypress open                 # Interface graphique
npx cypress run                  # Mode headless
npx cypress run --spec "cypress/e2e/auth.cy.ts"  # Test spécifique

# Linter et qualité
ng lint                          # ESLint
npm run format                   # Prettier (si configuré)
```

## 📊 Couverture de code

Les rapports de couverture Jest sont générés dans `coverage/` à la racine du projet après `ng test --coverage`.

**Fichiers générés :**

- `coverage/lcov-report/index.html` : Rapport HTML détaillé
- `coverage/lcov.info` : Format LCOV pour outils CI/CD

## 🔧 Configuration personnalisée

### Jest (Tests unitaires)

- **Config principale :** `jest.config.js`
- **Setup global :** `setup-jest.ts`
- **Mocks :** Dossier `mocks/`

### Cypress (Tests e2e)

- **Config principale :** `cypress/cypress.config.ts`
- **Commandes custom :** `cypress/support/commands.ts`
- **Fixtures :** `cypress/fixtures/`

## 📦 Dépendances requises

```json
{
  "devDependencies": {
    "@angular/testing": "^19.12.0",
    "jest": "^29.0.0",
    "jest-preset-angular": "^14.0.0",
    "@testing-library/angular": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "cypress": "^13.0.0",
    "@cypress/schematic": "^2.0.0"
  }
}
```

## 📝 Bonnes pratiques Angular 19.12

1. **Nommage :** Les fichiers de test se terminent par `.spec.ts`
2. **Jest :** Utilisez `describe`, `it`, `expect` de Jest
3. **Testing Library :** Privilégiez les sélecteurs utilisateur (`getByRole`, `getByText`)
4. **Mocks :** Utilisez `jest.mock()` pour les services
5. **Isolation :** Chaque test doit être indépendant
6. **Couverture :** Visez au minimum 80% de couverture de code
7. **E2E :** Testez les parcours critiques avec Cypress
8. **Signals :** Testez correctement les nouveaux Angular signals

## 🔄 Migration depuis versions antérieures

Si vous migrez depuis une version antérieure d'Angular :

- ✅ Remplacez Karma par Jest
- ✅ Remplacez Protractor par Cypress
- ✅ Utilisez Angular Testing Library
- ✅ Adaptez vos tests aux nouveaux APIs Angular 19
