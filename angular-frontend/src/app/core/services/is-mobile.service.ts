import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IsMobileService {
  private readonly mobileBreakpoint = 768; // px, largeur max pour mobile/tablette
  private isMobileSubject = new BehaviorSubject<boolean>(this.checkIsMobile());

  constructor() {
    // Écoute les changements de taille de fenêtre pour mettre à jour l’état
    window.addEventListener('resize', () => {
      this.isMobileSubject.next(this.checkIsMobile());
    });
  }

  private checkIsMobile(): boolean {
    const width = window.innerWidth;
    return width <= this.mobileBreakpoint;
  }

  getIsMobile(): Observable<boolean> {
    return this.isMobileSubject.asObservable();
  }

  isMobileSync(): boolean {
    return this.isMobileSubject.getValue();
  }
}
