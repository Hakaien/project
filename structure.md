# Structure

## Règles de création de ce fichier

- Un fichier est marqué d’un astérisque (*) uniquement s’il est totalement vide ou ne contient que le strict minimum généré par Angular CLI ou Symfony (pas de logique métier, pas de contenu spécifique au projet, pas de modification après génération).
- Les fichiers `.gitkeep` ne sont jamais marqués d’un astérisque.
- Les fichiers de configuration standards (ex : angular.json, tsconfig.json, composer.json) ne sont pas marqués d’un astérisque sauf s’ils sont vides (ce qui n’arrive jamais en pratique).
- Les fichiers de migration Symfony générés automatiquement peuvent être marqués d’un astérisque s’ils n’ont pas été modifiés.
- Les dossiers suivants sont indiqués par `{...}` et ne sont pas détaillés pour alléger la structure :
  - Pour Angular : `.angular`, `.vscode`, `dist`, `node_modules`
  - Pour Symfony : `var`, `vendor`
- Tous les autres dossiers et fichiers sont détaillés pour donner une vision claire de l’architecture du projet, en particulier les dossiers `public`, `config` et `src` de Symfony.
- Les fichiers ou dossiers marqués comme “autres fichiers…” ou “autres contrôleurs…” doivent être explicités si possible pour une meilleure compréhension.

---

## Projet global

├── .vscode/ {...}
├── deploy.sh
├── README.md
├── structure.md
├── angular-frontend/
│   ├── .angular/ {...}
│   ├── .editorconfig
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── .prettierrc
│   ├── angular.json
│   ├── dist/ {...}
│   ├── node_modules/ {...}
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── proxy.conf.json
│   ├── README.md
│   ├── tailwind.config.js
│   ├── transloco.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.spec.json
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── app/
│   │   │   ├── app-routing.module.ts*
│   │   │   ├── app.component.html
│   │   │   ├── app.component.scss
│   │   │   ├── app.component.spec.ts*
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts*
│   │   │   ├── app.module.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── core/
│   │   │   │   ├── core.module.ts*
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.module.ts*
│   │   │   │   │   ├── guards/
│   │   │   │   │   │   ├── auth.guard.ts*
│   │   │   │   │   │   └── guest.guard.ts*
│   │   │   │   │   ├── interceptors/
│   │   │   │   │   │   └── auth.interceptor.ts*
│   │   │   │   │   ├── models/
│   │   │   │   │   │   ├── auth-token.model.ts*
│   │   │   │   │   │   ├── auth.model.ts*
│   │   │   │   │   │   ├── login-request.model.ts*
│   │   │   │   │   │   ├── login-response.model.ts*
│   │   │   │   │   │   └── user.model.ts*
│   │   │   │   │   ├── services/
│   │   │   │   │       ├── auth.service.ts
│   │   │   │   │       ├── token.service.ts*
│   │   │   │   │       └── user.service.ts*
│   │   │   │   ├── guards/
│   │   │   │   │   └── role.guard.ts*
│   │   │   │   ├── http/
│   │   │   │   │   └── http-client.service.ts*
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── cache.interceptor.ts*
│   │   │   │   │   ├── error.interceptor.ts*
│   │   │   │   │   └── loading.interceptor.ts*
│   │   │   │   ├── services/
│   │   │   │       ├── api.service.ts*
│   │   │   │       ├── config.service.ts*
│   │   │   │       ├── error-handler.service.ts*
│   │   │   │       ├── is-mobile.service.ts
│   │   │   │       ├── loading.service.ts*
│   │   │   │       ├── logger.service.ts*
│   │   │   │       ├── notification.service.ts
│   │   │   │       ├── storage.service.ts*
│   │   │   │       ├── theme.service.ts*
│   │   │   │       └── validation.service.ts*
│   │   │   ├── features/
│   │   │   │   ├── admin/
│   │   │   │   │   └── admin.module.ts*
│   │   │   │   ├── auth/
│   │   │   │   │   ├── forgot-password/
│   │   │   │   │   ├── login/
│   │   │   │   │   │   ├── login.component.html*
│   │   │   │   │   │   ├── login.component.scss*
│   │   │   │   │   │   ├── login.component.spec.ts*
│   │   │   │   │   │   └── login.component.ts*
│   │   │   │   │   └── register/*
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── dashboard.component.html*
│   │   │   │   │   ├── dashboard.component.scss*
│   │   │   │   │   ├── dashboard.component.spec.ts*
│   │   │   │   │   └── dashboard.component.ts*
│   │   │   ├── layout/
│   │   │   │   ├── footer/
│   │   │   │   │   ├── footer.component.html*
│   │   │   │   │   ├── footer.component.scss*
│   │   │   │   │   ├── footer.component.spec.ts*
│   │   │   │   │   └── footer.component.ts*
│   │   │   │   ├── header/
│   │   │   │   │   ├── header.component.html*
│   │   │   │   │   ├── header.component.scss*
│   │   │   │   │   ├── header.component.spec.ts*
│   │   │   │   │   └── header.component.ts*
│   │   │   │   ├── sidebar/
│   │   │   │   │   ├── sidebar.component.html*
│   │   │   │   │   ├── sidebar.component.scss*
│   │   │   │   │   ├── sidebar.component.spec.ts*
│   │   │   │   │   └── sidebar.component.ts*
│   │   │   │   └── layout.module.ts*
│   │   │   ├── models/
│   │   │   │   ├── api-response.model.ts*
│   │   │   │   ├── error.model.ts*
│   │   │   │   └── pagination.model.ts*
│   │   │   ├── shared/
│   │   │   │   ├── components/
│   │   │   │   │   ├── breadcrumb/
│   │   │   │   │   │   ├── breadcrumb.component.html*
│   │   │   │   │   │   ├── breadcrumb.component.scss*
│   │   │   │   │   │   ├── breadcrumb.component.spec.ts*
│   │   │   │   │   │   └── breadcrumb.component.ts*
│   │   │   │   │   ├── buttons/
│   │   │   │   │   │   └── button/
│   │   │   │   │   │       ├── button.component.html*
│   │   │   │   │   │       ├── button.component.scss*
│   │   │   │   │   │       ├── button.component.spec.ts*
│   │   │   │   │   │       └── button.component.ts*
│   │   │   │   │   ├── confirmation-dialog/
│   │   │   │   │   │   ├── confirmation-dialog.component.html*
│   │   │   │   │   │   ├── confirmation-dialog.component.scss*
│   │   │   │   │   │   ├── confirmation-dialog.component.spec.ts*
│   │   │   │   │   │   └── confirmation-dialog.component.ts*
│   │   │   │   │   ├── data-table/
│   │   │   │   │   │   ├── data-table.component.html*
│   │   │   │   │   │   ├── data-table.component.scss*
│   │   │   │   │   │   ├── data-table.component.spec.ts*
│   │   │   │   │   │   └── data-table.component.ts*
│   │   │   │   │   ├── form-controls/
│   │   │   │   │   │   ├── .gitignore
│   │   │   │   │   │   ├── README.md*
│   │   │   │   │   │   ├── form-example/
│   │   │   │   │   │   │   ├── form-example.component.html*
│   │   │   │   │   │   │   ├── form-example.component.scss*
│   │   │   │   │   │   │   ├── form-example.component.spec.ts*
│   │   │   │   │   │   │   └── form-example.component.ts*
│   │   │   │   │   │   ├── input-email/
│   │   │   │   │   │   │   ├── input-email.component.html*
│   │   │   │   │   │   │   ├── input-email.component.scss*
│   │   │   │   │   │   │   ├── input-email.component.spec.ts*
│   │   │   │   │   │   │   └── input-email.component.ts*
│   │   │   │   │   │   ├── input-error/
│   │   │   │   │   │   │   ├── input-error.component.html*
│   │   │   │   │   │   │   ├── input-error.component.scss*
│   │   │   │   │   │   │   ├── input-error.component.spec.ts*
│   │   │   │   │   │   │   └── input-error.component.ts*
│   │   │   │   │   │   ├── input-text/
│   │   │   │   │   │   │   ├── input-text.component.html*
│   │   │   │   │   │   │   ├── input-text.component.scss*
│   │   │   │   │   │   │   ├── input-text.component.spec.ts*
│   │   │   │   │   │   │   └── input-text.component.ts*
│   │   │   │   │   ├── loading-spinner/
│   │   │   │   │   │   ├── loading-spinner.component.html*
│   │   │   │   │   │   ├── loading-spinner.component.scss*
│   │   │   │   │   │   ├── loading-spinner.component.spec.ts*
│   │   │   │   │   │   └── loading-spinner.component.ts*
│   │   │   │   │   ├── modal/
│   │   │   │   │   │   ├── modal.component.html*
│   │   │   │   │   │   ├── modal.component.scss*
│   │   │   │   │   │   ├── modal.component.spec.ts*
│   │   │   │   │   │   └── modal.component.ts*
│   │   │   │   │   ├── pagination/
│   │   │   │   │   │   ├── pagination.component.html*
│   │   │   │   │   │   ├── pagination.component.scss*
│   │   │   │   │   │   ├── pagination.component.spec.ts*
│   │   │   │   │   │   └── pagination.component.ts*
│   │   │   │   │   └── toast/
│   │   │   │   │       ├── toast.component.html*
│   │   │   │   │       ├── toast.component.scss*
│   │   │   │   │       ├── toast.component.spec.ts*
│   │   │   │   │       └── toast.component.ts*
│   │   │   │   ├── directives/
│   │   │   │   │   ├── autofocus.directive.ts*
│   │   │   │   │   ├── click-outside.directive.ts*
│   │   │   │   │   ├── lazy-loading.directive.ts*
│   │   │   │   │   ├── permission.directive.ts*
│   │   │   │   │   ├── sanitize.directive.ts*
│   │   │   │   │   └── tooltip.directive.ts*
│   │   │   │   ├── pipes/
│   │   │   │   │   ├── date-format.pipe.ts*
│   │   │   │   │   ├── highlight.pipe.ts*
│   │   │   │   │   ├── safe-html.pipe.ts*
│   │   │   │   │   └── truncate.pipe.ts*
│   │   │   │   ├── shared.module.ts*
│   │   │   │   └── validators/
│   │   │   │       ├── email-format.validator.ts*
│   │   │   │       └── password-strength.validator.ts*
│   │   │   ├── utils/
│   │   │   │   └── (dossier vide)*
│   │   │   ├── assets/
│   │   │   │   ├── data/
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── fonts/
│   │   │   │   │   └── .gitkeep
│   │   │   │   └── images/
│   │   │   │       └── .gitkeep
│   │   │   ├── environments/
│   │   │   │   ├── environment.prod.ts
│   │   │   │   ├── environment.staging.ts
│   │   │   │   └── environment.ts
│   │   │   ├── i18n/
│   │   │   │   ├── en.json
│   │   │   │   └── fr.json
│   │   │   ├── index.html
│   │   │   ├── input.css
│   │   │   ├── main.ts
│   │   │   ├── styles/
│   │   │   │   ├── main.scss
│   │   │   │   ├──_mixins.scss
│   │   │   │   └── _variables.scss
│   │   │   └── styles.scss
│   ├── testing/
│   │   ├── cypress/
│   │   │   ├── cypress.config.ts
│   │   │   ├── downloads/*
│   │   │   ├── e2e/
│   │   │   │   ├── authy.cy.ts
│   │   │   │   ├── dashboard.cy.ts
│   │   │   │   └── navigation.cy.ts
│   │   │   ├── fixtures/
│   │   │   │   └── users.json
│   │   │   └── support/
│   │   │       ├── commands.ts
│   │   │       ├── e2e.ts
│   │   │       └── index.ts
│   │   ├── fixtures/
│   │   │   ├── api-data.json
│   │   │   ├── index.ts
│   │   │   └── users.json
│   │   ├── jest.config.js
│   │   ├── mocks/
│   │   │   ├── api-responses.mock.ts
│   │   │   ├── index.ts
│   │   │   ├── services.mock.ts
│   │   │   └── user.mock.ts
│   │   ├── README.md
│   │   ├── setup-jest.js
│   │   └── test.utils.ts
├── symfony-backend/
│   ├── .env
│   ├── .env.dev
│   ├── .gitignore
│   ├── composer.json
│   ├── composer.lock
│   ├── symfony.lock
│   ├── bin/
│   │   └── console
│   ├── config/
│   │   ├── bundles.php
│   │   ├── preload.php
│   │   ├── routes.yaml
│   │   ├── services.yaml
│   │   ├── packages/
│   │   │   ├── doctrine.yaml
│   │   │   ├── framework.yaml
│   │   │   ├── nelmio_security.yaml
│   │   │   └── autres fichiers de configuration...
│   │   ├── routes/
│   │   │   ├── annotations.yaml
│   │   │   └── autres fichiers de routes...
│   ├── migrations/
│   │   ├── .gitignore
│   │   └── (fichiers de migration)*
│   ├── public/
│   │   ├── index.php
│   │   ├── robots.txt*
│   │   ├── favicon.ico*
│   │   ├── assets/
│   │   │   └── (fichiers statiques, images, js, css...)
│   │   └── autres fichiers publics...
│   ├── src/
│   │   ├── Controller/
│   │   │   ├── DefaultController.php
│   │   │   └── autres contrôleurs...
│   │   ├── Entity/
│   │   │   ├── User.php
│   │   │   └── autres entités...
│   │   ├── Repository/
│   │   │   ├── UserRepository.php
│   │   │   └── autres repositories...
│   │   ├── Kernel.php
│   │   └── autres fichiers sources...
│   ├── var/ {...}
│   ├── vendor/ {...}
