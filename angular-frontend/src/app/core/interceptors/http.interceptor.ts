import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Add any custom headers or modify the request here if needed
        const clonedRequest = request.clone({
            // Example: set a custom header
            // headers: request.headers.set('Authorization', 'Bearer your-token')
        });

        return next.handle(clonedRequest).pipe(
            catchError(err => {
                // Handle errors here
                console.error('HTTP Error:', err);
                throw err;
            })
        );
    }
}