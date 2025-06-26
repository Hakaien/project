import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { passwordStrengthValidator } from '../../../shared/validators/password-strength.validator';
import { emailFormatValidator } from '../../../shared/validators/email-format.validator';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading$!: Observable<boolean>;
  showPassword = false;
  showConfirmPassword = false;

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
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, emailFormatValidator()]],
      password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loadingService.setLoading(true);

      const formValue = this.registerForm.value;
      const registerData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        acceptTerms: formValue.acceptTerms
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.loadingService.setLoading(false);
          this.notificationService.showSuccess('Compte créé avec succès ! Veuillez vérifier votre email.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loadingService.setLoading(false);
          this.handleRegistrationError(error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleRegistrationError(error: any): void {
    let errorMessage = 'Une erreur est survenue lors de la création du compte.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 409) {
      errorMessage = 'Cette adresse email est déjà utilisée.';
    } else if (error.status === 422) {
      errorMessage = 'Les données saisies ne sont pas valides.';
    }

    this.notificationService.showError(errorMessage);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
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

  // Getters pour faciliter l'accès aux contrôles du formulaire
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get acceptTerms() { return this.registerForm.get('acceptTerms'); }
}
