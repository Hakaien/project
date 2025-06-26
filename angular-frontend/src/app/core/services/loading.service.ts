import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }

  start(): void {
    this.setLoading(true);
  }

  stop(): void {
    this.setLoading(false);
  }
}
