import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  log(message?: any, ...optionalParams: any[]) {
    if (isDevMode()) {
      console.log('[LOG]', message, ...optionalParams);
    }
    // En prod, on peut envoyer sur un serveur de logs
  }

  info(message?: any, ...optionalParams: any[]) {
    if (isDevMode()) {
      console.info('[INFO]', message, ...optionalParams);
    }
  }

  warn(message?: any, ...optionalParams: any[]) {
    if (isDevMode()) {
      console.warn('[WARN]', message, ...optionalParams);
    }
  }

  error(message?: any, ...optionalParams: any[]) {
    console.error('[ERROR]', message, ...optionalParams);
    // Ici, on peut aussi envoyer l’erreur à un service de monitoring
  }
}
