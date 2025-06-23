import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
// emailFormatValidator : Validation basique et avancée des formats d'email

export function emailFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(control.value);

    return isValid ? null : { emailFormat: { value: control.value } };
  };
}

export function customEmailValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  // Regex plus stricte pour les emails
  const strictEmailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;

  if (!strictEmailRegex.test(control.value)) {
    return { emailFormat: true };
  }

  // Vérifications supplémentaires
  const parts = control.value.split('@');
  if (parts.length !== 2) {
    return { emailFormat: true };
  }

  const [localPart, domainPart] = parts;

  // Vérification de la partie locale
  if (localPart.length > 64 || localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return { emailFormat: true };
  }

  // Vérification du domaine
  if (domainPart.length > 253 || domainPart.startsWith('-') || domainPart.endsWith('-')) {
    return { emailFormat: true };
  }

  return null;
}