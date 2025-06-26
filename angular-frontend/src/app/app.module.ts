import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoModule, TRANSLOCO_CONFIG, TRANSLOCO_LOADER, translocoConfig } from '@ngneat/transloco';
import { TranslocoHttpLoader } from '../assets/i18n/transloco-loader'; // adapte le chemin si besoin

@NgModule({
  imports: [
    // autres imports de ton projet
    HttpClientModule,            // Important pour que HttpClient fonctionne
    MatSnackBarModule,
    TranslocoModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['fr', 'en'],
        defaultLang: 'fr',
        reRenderOnLangChange: true,
        prodMode: false // true en production
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ],
  // composants, bootstrap, etc...
})
export class AppModule {}
