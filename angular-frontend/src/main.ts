import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { TranslocoHttpLoader } from './assets/i18n/transloco-loader';
import { provideTransloco } from '@ngneat/transloco';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes), provideHttpClient(), provideTransloco({
        config: {
          availableLangs: ['en'],
          defaultLang: 'en',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      })
    // Ajoute ici d'autres providers globaux si besoin (HTTP, etc.)
  ]
}).catch((err) => console.error(err));
