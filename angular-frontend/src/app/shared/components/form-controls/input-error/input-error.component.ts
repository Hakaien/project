import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss']
})
export class InputErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() fieldName: string = '';

  get errorMessage(): string {
    if (!this.control || !this.control.errors || !this.control.touched) {
      return '';
    }

    const errors = this.control.errors;

    if (errors['required']) {
      return `${this.fieldName} est requis`;
    }

    if (errors['email']) {
      return 'Format d\'email invalide';
    }

    if (errors['emailFormat']) {
      return 'Format d\'email invalide';
    }

    if (errors['minlength']) {
      return `${this.fieldName} doit contenir au moins ${errors['minlength'].requiredLength} caractères`;
    }

    if (errors['maxlength']) {
      return `${this.fieldName} ne peut pas dépasser ${errors['maxlength'].requiredLength} caractères`;
    }

    if (errors['passwordStrength']) {
      return 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
    }

    if (errors['pattern']) {
      return `Format de ${this.fieldName} invalide`;
    }

    return 'Champ invalide';
  }

  get hasError(): boolean {
    return !!(this.control && this.control.errors && this.control.touched);
  }
}