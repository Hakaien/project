import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-setup-2fa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './setup-2fa.component.html',
  styleUrls: ['./setup-2fa.component.scss']
})
export class Setup2FAComponent implements OnInit {
  setup2FAForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedMethod: string = '';
  qrCodeUrl = '';
  secret = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.setup2FAForm = this.fb.group({
      method: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  onMethodChange(): void {
    this.selectedMethod = this.setup2FAForm.get('method')?.value;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    if (this.setup2FAForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const method = this.setup2FAForm.value.method;

      this.authService.setup2FA({ method }).subscribe({
        next: (response) => {
          this.successMessage = 'Double authentification configurée avec succès !';
          this.secret = response.secret || '';

          if (method === 'totp' || method === 'google') {
            this.qrCodeUrl = this.generateQRCodeUrl(response.secret);
          }

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la configuration de la 2FA';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  private generateQRCodeUrl(secret: string): string {
    const user = this.authService.getCurrentUser();
    const email = user?.email || 'user@example.com';
    const issuer = 'Mon App';

    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`
    )}`;
  }

  skip2FA(): void {
    this.router.navigate(['/dashboard']);
  }
}
