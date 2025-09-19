import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {
  setPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.setPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage = 'Token manquant ou invalide';
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.setPasswordForm.valid && this.token) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.setPassword(this.token, this.setPasswordForm.value.password).subscribe({
        next: (response) => {
          this.successMessage = 'Mot de passe défini avec succès !';
          this.isLoading = false;
          
          // Rediriger vers la configuration 2FA après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/setup-2fa'], { 
              queryParams: { token: this.token } 
            });
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error || 'Erreur lors de la définition du mot de passe';
          this.isLoading = false;
        }
      });
    }
  }
}