import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

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
  token: string | null = null;
  selectedMethod: string = 'email';
  qrCodeUrl: string = '';
  secretKey: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.setup2FAForm = this.fb.group({
      method: ['email', [Validators.required]],
      authCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage = 'Token manquant ou invalide';
    }
  }

  onMethodChange(): void {
    this.selectedMethod = this.setup2FAForm.get('method')?.value;
    this.setup2FAForm.get('authCode')?.setValue('');
    
    if (this.selectedMethod === 'totp' || this.selectedMethod === 'google') {
      this.generateQRCode();
    }
  }

  generateQRCode(): void {
    // Cette méthode sera appelée après la configuration 2FA pour générer le QR code
    // Pour l'instant, on simule avec un secret
    this.secretKey = 'JBSWY3DPEHPK3PXP';
    this.qrCodeUrl = `otpauth://totp/App:user@example.com?secret=${this.secretKey}&issuer=App`;
  }

  onSubmit(): void {
    if (this.setup2FAForm.valid && this.token) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const method = this.setup2FAForm.value.method;
      const authCode = this.setup2FAForm.value.authCode;

      this.authService.setup2FA(method, authCode).subscribe({
        next: (response) => {
          this.successMessage = 'Double authentification configurée avec succès !';
          this.isLoading = false;
          
          // Rediriger vers la page de connexion après 3 secondes
          setTimeout(() => {
            this.router.navigate(['/login'], { 
              queryParams: { message: 'setup-complete' } 
            });
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error || 'Erreur lors de la configuration de la 2FA';
          this.isLoading = false;
        }
      });
    }
  }

  skip2FA(): void {
    // Permettre de passer la 2FA (optionnel)
    this.router.navigate(['/login'], { 
      queryParams: { message: 'setup-skipped' } 
    });
  }
}