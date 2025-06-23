import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  /**
   * Validator pour la force d’un mot de passe
   * Exige au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
   */
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const validLength = value.length >= 8;

      const passwordValid =
        hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && validLength;

      return !passwordValid
        ? {
            passwordStrength:
              'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
          }
        : null;
    };
  }

  /**
   * Validator pour vérifier que deux contrôles sont égaux (ex: mot de passe + confirmation)
   */
  matchValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);
      if (!control || !matchingControl) return null;

      if (matchingControl.errors && !matchingControl.errors['matchValidator']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ matchValidator: true });
        return { matchValidator: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Validator pour une adresse email
   */
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const emailRegex =
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      return emailRegex.test(value)
        ? null
        : { email: 'Adresse email invalide' };
    };
  }
}
