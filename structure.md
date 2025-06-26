# Structure

angular-frontend/
├── .editorconfig
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── angular.json
├── package-lock.json
├── package.json
├── proxy.conf.json
├── public/
│   └── favicon.ico
├── README.md
├── src/
│   ├── app/
│   │   ├── app-routing.module.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   ├── app.module.ts
│   │   ├── app.routes.ts
│   │   ├── core/
│   │   │   ├── core.module.ts
│   │   │   ├── auth/
│   │   │   │   ├── .gitkeep *
│   │   │   │   ├── auth.module.ts*
│   │   │   │   ├── guards/
│   │   │   │   │   ├── auth.guard.ts
│   │   │   │   │   └── guest.guard.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── auth.interceptor.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── auth-token.model.ts
│   │   │   │   │   ├── auth.model.ts
│   │   │   │   │   ├── login-request.model.ts
│   │   │   │   │   ├── login-response.model.ts
│   │   │   │   │   └── user.model.ts
│   │   │   │   └── services/
│   │   │   │       ├── auth.service.ts
│   │   │   │       ├── token.service.ts
│   │   │   │       └── user.service.ts
│   │   │   ├── guards/
│   │   │   │   ├── .gitkeep *
│   │   │   │   └── role.guard.ts*
│   │   │   ├── http/
│   │   │   │   └── .gitkeep *
│   │   │   ├── interceptors/
│   │   │   │   ├── .gitkeep*
│   │   │   │   ├── cache.interceptor.ts *
│   │   │   │   ├── error.interceptor.ts*
│   │   │   │   └── loading.interceptor.ts *
│   │   │   └── services/
│   │   │       ├── .gitkeep*
│   │   │       ├── api.service.ts *← (fichier vide)
│   │   │       ├── config.service.ts*
│   │   │       ├── error-handler.service.ts *
│   │   │       ├── is-mobile.service.ts*
│   │   │       ├── loading.service.ts *
│   │   │       ├── logger.service.ts*
│   │   │       ├── notification.service.ts *
│   │   │       ├── storage.service.ts*
│   │   │       ├── theme.service.ts *
│   │   │       └── validation.service.ts*
│   │   ├── features/
│   │   │   ├── admin/
│   │   │   │   └── admin.module.ts *
│   │   │   ├── auth/
│   │   │   │   ├── forgot-password/   (dossier vide)*
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.html *
│   │   │   │   │   ├── login.component.scss*
│   │   │   │   │   ├── login.component.spec.ts *
│   │   │   │   │   └── login.component.ts*   ← (strict minimum)
│   │   │   │   └── register/   (dossier vide) *
│   │   │   └── dashboard/
│   │   │       ├── dashboard.component.html*
│   │   │       ├── dashboard.component.scss *
│   │   │       ├── dashboard.component.spec.ts*
│   │   │       └── dashboard.component.ts *
│   │   ├── layout/
│   │   │   ├── footer/
│   │   │   │   ├── footer.component.html*
│   │   │   │   ├── footer.component.scss *
│   │   │   │   ├── footer.component.spec.ts*
│   │   │   │   └── footer.component.ts *
│   │   │   ├── header/
│   │   │   │   ├── header.component.html*
│   │   │   │   ├── header.component.scss *
│   │   │   │   ├── header.component.spec.ts*
│   │   │   │   └── header.component.ts *
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.component.html*
│   │   │   │   ├── sidebar.component.scss *
│   │   │   │   ├── sidebar.component.spec.ts*
│   │   │   │   └── sidebar.component.ts *
│   │   │   └── layout.module.ts*
│   │   ├── models/
│   │   │   ├── .gitkeep *
│   │   │   ├── api-response.model.ts*
│   │   │   ├── error.model.ts *
│   │   │   └── pagination.model.ts*
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── breadcrumb/
│   │   │   │   │   ├── breadcrumb.component.html *
│   │   │   │   │   ├── breadcrumb.component.scss*
│   │   │   │   │   ├── breadcrumb.component.spec.ts *
│   │   │   │   │   └── breadcrumb.component.ts*
│   │   │   │   ├── buttons/
│   │   │   │   │   └── button/
│   │   │   │   │       ├── button.component.html *
│   │   │   │   │       ├── button.component.scss*
│   │   │   │   │       ├── button.component.spec.ts *
│   │   │   │   │       └── button.component.ts
│   │   │   │   ├── confirmation-dialog/
│   │   │   │   │   ├── confirmation-dialog.component.html*
│   │   │   │   │   ├── confirmation-dialog.component.scss *
│   │   │   │   │   ├── confirmation-dialog.component.spec.ts*
│   │   │   │   │   └── confirmation-dialog.component.ts *
│   │   │   │   ├── data-table/
│   │   │   │   │   ├── data-table.component.html*
│   │   │   │   │   ├── data-table.component.scss *
│   │   │   │   │   ├── data-table.component.spec.ts*
│   │   │   │   │   └── data-table.component.ts *
│   │   │   │   ├── form-controls/
│   │   │   │   │   ├── .gitignore
│   │   │   │   │   ├── README.md
│   │   │   │   │   ├── form-example/
│   │   │   │   │   │   ├── form-example.component.html*
│   │   │   │   │   │   ├── form-example.component.scss *
│   │   │   │   │   │   ├── form-example.component.spec.ts*
│   │   │   │   │   │   └── form-example.component.ts
│   │   │   │   │   ├── input-email/
│   │   │   │   │   │   ├── input-email.component.html *
│   │   │   │   │   │   ├── input-email.component.scss*
│   │   │   │   │   │   ├── input-email.component.spec.ts *
│   │   │   │   │   │   └── input-email.component.ts*
│   │   │   │   │   ├── input-error/
│   │   │   │   │   │   ├── input-error.component.html *
│   │   │   │   │   │   ├── input-error.component.scss*
│   │   │   │   │   │   ├── input-error.component.spec.ts *
│   │   │   │   │   │   └── input-error.component.ts*
│   │   │   │   │   ├── input-text/
│   │   │   │   │   │   ├── input-text.component.html *
│   │   │   │   │   │   ├── input-text.component.scss*
│   │   │   │   │   │   ├── input-text.component.spec.ts *
│   │   │   │   │   │   └── input-text.component.ts*
│   │   │   │   ├── loading-spinner/
│   │   │   │   │   ├── loading-spinner.component.html *
│   │   │   │   │   ├── loading-spinner.component.scss*
│   │   │   │   │   ├── loading-spinner.component.spec.ts *
│   │   │   │   │   └── loading-spinner.component.ts*
│   │   │   │   ├── modal/
│   │   │   │   │   ├── modal.component.html *
│   │   │   │   │   ├── modal.component.scss*
│   │   │   │   │   ├── modal.component.spec.ts *
│   │   │   │   │   └── modal.component.ts*
│   │   │   │   ├── pagination/
│   │   │   │   │   ├── pagination.component.html *
│   │   │   │   │   ├── pagination.component.scss*
│   │   │   │   │   ├── pagination.component.spec.ts *
│   │   │   │   │   └── pagination.component.ts*
│   │   │   │   └── toast/
│   │   │   │       ├── toast.component.html *
│   │   │   │       ├── toast.component.scss*
│   │   │   │       ├── toast.component.spec.ts *
│   │   │   │       └── toast.component.ts*   ← (strict minimum)
│   │   │   ├── directives/
│   │   │   │   ├── .gitkeep *
│   │   │   │   ├── autofocus.directive.ts*
│   │   │   │   ├── click-outside.directive.ts *
│   │   │   │   ├── lazy-loading.directive.ts*
│   │   │   │   ├── permission.directive.ts *
│   │   │   │   ├── sanitize.directive.ts*
│   │   │   │   └── tooltip.directive.ts *
│   │   │   ├── pipes/
│   │   │   │   ├── .gitkeep*
│   │   │   │   ├── date-format.pipe.ts *
│   │   │   │   ├── highlight.pipe.ts*
│   │   │   │   ├── safe-html.pipe.ts *
│   │   │   │   └── truncate.pipe.ts*
│   │   │   ├── shared.module.ts *
│   │   │   └── validators/
│   │   │       ├── email-format.validator.ts*
│   │   │       └── password-strength.validator.ts *
│   │   ├── utils/
│   │   │   └── (dossier vide)*
│   │   ├── assets/
│   │   │   ├── data/
│   │   │   │   └── .gitkeep *
│   │   │   ├── fonts/
│   │   │   │   └── .gitkeep*
│   │   │   └── images/
│   │   │       └── .gitkeep *
│   │   ├── environments/
│   │   │   ├── environment.prod.ts
│   │   │   ├── environment.staging.ts
│   │   │   └── environment.ts
│   │   ├── i18n/
│   │   │   ├── .gitkeep*
│   │   │   ├── en.json
│   │   │   └── fr.json
│   │   ├── index.html
│   │   ├── input.css
│   │   ├── main.ts
│   │   ├── styles/
│   │   │   ├── main.scss
│   │   │   ├── _mixins.scss
│   │   │   └──_variables.scss
│   │   └── styles.scss
├── testing/
│   ├── cypress/
│   │   ├── cypress.config.ts
│   │   ├── downloads/ *
│   │   ├── e2e/
│   │   │   ├── authy.cy.ts
│   │   │   ├── dashboard.cy.ts
│   │   │   └── navigation.cy.ts
│   │   ├── fixtures/
│   │   │   └── users.json
│   │   └── support/
│   │       ├── commands.ts
│   │       ├── e2e.ts
│   │       └── index.ts
│   ├── fixtures/
│   │   ├── api-data.json
│   │   ├── index.ts
│   │   └── users.json
│   ├── jest.config.js
│   ├── mocks/
│   │   ├── api-responses.mock.ts
│   │   ├── index.ts
│   │   ├── services.mock.ts
│   │   └── user.mock.ts
│   ├── README.md
│   ├── setup-jest.js
│   └── test.utils.ts
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
