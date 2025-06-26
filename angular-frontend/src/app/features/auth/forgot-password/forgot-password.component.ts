import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { emailFormatValidator } from '../../../shared/validators/email-format.validator';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isLoading$!: Observable<boolean>;
  emailSent = false;
  countdown = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.isLoading$ = this.loadingService.loading$;
  }

  private initializeForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, emailFormatValidator()]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loadingService.setLoading(true);

      const email = this.forgotPasswordForm.get('email')?.value;

      this.authService.forgotPassword({ email }).subscribe({
        next: (response) => {
          this.loadingService.setLoading(false);
          this.emailSent = true;
          this.startCountdown();
          this.notificationService.showSuccess('Email de récupération envoyé avec succès !');
        },
        error: (error) => {
          this.loadingService.setLoading(false);
          this.handleForgotPasswordError(error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleForgotPasswordError(error: any): void {
    let errorMessage = 'Une erreur est survenue lors de l\'envoi de l\'email.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'Aucun compte n\'est associé à cette adresse email.';
    } else if (error.status === 429) {
      errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard.';
    }

    this.notificationService.showError(errorMessage);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      this.forgotPasswordForm.get(key)?.markAsTouched();
    });
  }

  private startCountdown(): void {
    this.countdown = 60; // 60 secondes
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  resendEmail(): void {
    if (this.countdown <= 0) {
      this.onSubmit();
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Getter pour faciliter l'accès au contrôle email
  get email() { return this.forgotPasswordForm.get('email'); }
}