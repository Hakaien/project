import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService } from '../../../core/auth/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading$: Observable<boolean>;

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly loadingService: LoadingService
  ) {
    this.isLoading$ = this.loadingService.loading$;

    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  // Form control getters used by tests
  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get acceptTerms() {
    return this.registerForm.get('acceptTerms');
  }

  passwordsMatchValidator(group: FormGroup) {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  markFormGroupTouched(): void {
    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const payload = this.registerForm.value;

    this.loadingService.setLoading(true);

    this.authService.register(payload).subscribe({
      next: (response: any) => {
        this.loadingService.setLoading(false);
        this.notificationService.notify('success', 'register.successMessage', {});
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loadingService.setLoading(false);
        // handle status-based messages
        if (err?.status === 409) {
          this.notificationService.notify('error', 'register.error.conflict');
        } else if (err?.status === 422) {
          this.notificationService.notify('error', 'register.error.validation');
        } else if (err?.error?.message) {
          this.notificationService.notify('error', 'register.error.custom', { message: err.error.message });
        } else {
          this.notificationService.notify('error', 'register.error.generic');
        }
      }
    });
  }
}
