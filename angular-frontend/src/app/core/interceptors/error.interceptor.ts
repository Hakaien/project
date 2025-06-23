import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Gestion globale des erreurs
        if (error.status === 401) {
          // Erreur Unauthorized : redirection vers login par exemple
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Accès refusé
          alert('Accès refusé.');
        } else if (error.status >= 500) {
          // Erreur serveur
          alert('Erreur serveur, veuillez réessayer plus tard.');
        } else {
          // Autres erreurs : on peut logger ou afficher un message générique
          console.error('Erreur HTTP:', error);
          alert(error.error?.message || 'Une erreur est survenue.');
        }

        // On propage l'erreur pour que les composants puissent aussi la gérer
        return throwError(() => error);
      })
    );
  }
}
