import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.scss']
})
export class TwoFactorComponent implements OnInit {
  twoFactorForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  method: string = 'email';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.twoFactorForm = this.fb.group({
      authCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    // Récupérer la méthode 2FA depuis les paramètres de route ou la session
    this.method = this.route.snapshot.queryParamMap.get('method') || 'email';
  }

  onSubmit(): void {
    if (this.twoFactorForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const authCode = this.twoFactorForm.value.authCode;

      // Ici, on devrait envoyer le code 2FA au backend
      // Pour l'instant, on simule une validation réussie
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }, 1000);
    }
  }

  resendCode(): void {
    // Logique pour renvoyer le code 2FA
    console.log('Renvoyer le code 2FA');
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
