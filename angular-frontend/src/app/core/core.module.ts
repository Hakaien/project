import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { LoggerService } from './services/logger.service';
import { AuthGuard } from './guards/auth.guard';
import { HttpInterceptor } from './interceptors/http.interceptor';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    NotificationService,
    LoggerService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true }
  ]
})
export class CoreModule { }