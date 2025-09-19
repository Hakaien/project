import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
        next: (response) => {
          this.successMessage = 'Si cet email existe, un lien de réinitialisation a été envoyé.';
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error || 'Erreur lors de l\'envoi de l\'email';
          this.isLoading = false;
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}