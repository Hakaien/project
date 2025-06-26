import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';

type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'debug';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly typeMap: Record<NotificationType, { class: string; duration: number }> = {
    success: { class: 'snackbar-success', duration: 3000 },
    error: { class: 'snackbar-error', duration: 5000 },
    info: { class: 'snackbar-info', duration: 4000 },
    warning: { class: 'snackbar-warning', duration: 4000 },
    debug: { class: 'snackbar-debug', duration: 2500 },
  };

  constructor(
    private snackBar: MatSnackBar,
    private transloco: TranslocoService
  ) {}

  notify(type: NotificationType, messageKey: string, translateParams: any = {}): void {
    const config = this.typeMap[type];
    const message = this.transloco.translate(messageKey, translateParams);
    const closeLabel = this.transloco.translate('actions.close');

    // Console debug uniquement en mode debug
    if (type === 'debug') {
      console.debug('[NotificationService] Debug message:', message);
    }

    this.snackBar.open(message, closeLabel, {
      duration: config.duration,
      panelClass: [config.class],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
