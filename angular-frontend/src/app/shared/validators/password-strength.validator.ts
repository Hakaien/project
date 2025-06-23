import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordStrengthOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  specialChars?: string;
}

// passwordStrengthValidator : Validation de la complexité des mots de passe avec options configurables
export function passwordStrengthValidator(options: PasswordStrengthOptions = {}): ValidatorFn {
  const defaultOptions: PasswordStrengthOptions = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const config = { ...defaultOptions, ...options };

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values
    }

    const password = control.value;
    const errors: ValidationErrors = {};

    // Vérification de la longueur minimale
    if (config.minLength && password.length < config.minLength) {
      errors['minLength'] = {
        requiredLength: config.minLength,
        actualLength: password.length
      };
    }

    // Vérification des majuscules
    if (config.requireUppercase && !/[A-Z]/.test(password)) {
      errors['requireUppercase'] = true;
    }

    // Vérification des minuscules
    if (config.requireLowercase && !/[a-z]/.test(password)) {
      errors['requireLowercase'] = true;
    }

    // Vérification des chiffres
    if (config.requireNumbers && !/\d/.test(password)) {
      errors['requireNumbers'] = true;
    }

    // Vérification des caractères spéciaux
    if (config.requireSpecialChars && config.specialChars) {
      const specialCharRegex = new RegExp(`[${config.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);
      if (!specialCharRegex.test(password)) {
        errors['requireSpecialChars'] = { allowedChars: config.specialChars };
      }
    }

    return Object.keys(errors).length === 0 ? null : { passwordStrength: errors };
  };
}

// passwordMatchValidator : Vérifie que deux champs de mot de passe correspondent
export function passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordField);
    const confirmPassword = control.get(confirmPasswordField);

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Supprimer l'erreur passwordMismatch si elle existe
      if (confirmPassword.errors) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }

    return null;
  };
}

// passwordStrengthScoreValidator : Évalue la force d'un mot de passe avec un système de score
export function passwordStrengthScoreValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const password = control.value;
    let score = 0;
    const feedback: string[] = [];

    // Longueur
    if (password.length >= 8) score += 1;
    else feedback.push('Au moins 8 caractères');

    if (password.length >= 12) score += 1;

    // Complexité
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Au moins une minuscule');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Au moins une majuscule');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Au moins un chiffre');

    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 1;
    else feedback.push('Au moins un caractère spécial');

    // Bonus pour la diversité
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.7) score += 1;

    // Pénalité pour les patterns communs
    if (/(.)\1{2,}/.test(password)) score -= 1; // Caractères répétés
    if (/123|abc|qwe|aaa/i.test(password)) score -= 1; // Séquences communes

    const strength = score >= 5 ? 'strong' : score >= 3 ? 'medium' : 'weak';

    if (strength === 'weak') {
      return {
        weakPassword: {
          score,
          strength,
          feedback: feedback.slice(0, 3) // Limiter le feedback
        }
      };
    }

    return null;
  };
}