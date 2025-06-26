import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/auth/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    // Création des spies
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['setLoading'], {
      loading$: of(false)
    });

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values and proper validators', () => {
      expect(component.registerForm).toBeDefined();
      expect(component.firstName?.value).toBe('');
      expect(component.lastName?.value).toBe('');
      expect(component.email?.value).toBe('');
      expect(component.password?.value).toBe('');
      expect(component.confirmPassword?.value).toBe('');
      expect(component.acceptTerms?.value).toBe(false);
    });

    it('should have required validators on all fields', () => {
      expect(component.firstName?.hasError('required')).toBeTruthy();
      expect(component.lastName?.hasError('required')).toBeTruthy();
      expect(component.email?.hasError('required')).toBeTruthy();
      expect(component.password?.hasError('required')).toBeTruthy();
      expect(component.confirmPassword?.hasError('required')).toBeTruthy();
      expect(component.acceptTerms?.hasError('required')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should validate firstName minimum length', () => {
      component.firstName?.setValue('a');
      expect(component.firstName?.hasError('minlength')).toBeTruthy();

      component.firstName?.setValue('ab');
      expect(component.firstName?.hasError('minlength')).toBeFalsy();
    });

    it('should validate lastName minimum length', () => {
      component.lastName?.setValue('a');
      expect(component.lastName?.hasError('minlength')).toBeTruthy();

      component.lastName?.setValue('ab');
      expect(component.lastName?.hasError('minlength')).toBeFalsy();
    });

    it('should validate password minimum length', () => {
      component.password?.setValue('1234567');
      expect(component.password?.hasError('minlength')).toBeTruthy();

      component.password?.setValue('12345678');
      expect(component.password?.hasError('minlength')).toBeFalsy();
    });

    it('should validate password mismatch', () => {
      component.password?.setValue('password123');
      component.confirmPassword?.setValue('password456');

      expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();

      component.confirmPassword?.setValue('password123');
      expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();
    });

    it('should require acceptTerms to be true', () => {
      component.acceptTerms?.setValue(false);
      expect(component.acceptTerms?.hasError('required')).toBeTruthy();

      component.acceptTerms?.setValue(true);
      expect(component.acceptTerms?.hasError('required')).toBeFalsy();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword).toBeFalsy();

      component.togglePasswordVisibility();
      expect(component.showPassword).toBeTruthy();

      component.togglePasswordVisibility();
      expect(component.showPassword).toBeFalsy();
    });

    it('should toggle confirm password visibility', () => {
      expect(component.showConfirmPassword).toBeFalsy();

      component.toggleConfirmPasswordVisibility();
      expect(component.showConfirmPassword).toBeTruthy();

      component.toggleConfirmPasswordVisibility();
      expect(component.showConfirmPassword).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Préparer un formulaire valide
      component.firstName?.setValue('John');
      component.lastName?.setValue('Doe');
      component.email?.setValue('john.doe@example.com');
      component.password?.setValue('password123');
      component.confirmPassword?.setValue('password123');
      component.acceptTerms?.setValue(true);
    });

    it('should call authService.register when form is valid', () => {
      mockAuthService.register.and.returnValue(of({ success: true }));

      component.onSubmit();

      expect(mockAuthService.register).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: true
      });
    });

    it('should handle successful registration', () => {
      mockAuthService.register.and.returnValue(of({ success: true }));

      component.onSubmit();

      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(true);
      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        'Compte créé avec succès ! Veuillez vérifier votre email.'
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle registration error with custom message', () => {
      const errorResponse = { error: { message: 'Custom error message' } };
      mockAuthService.register.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
      expect(mockNotificationService.showError).toHaveBeenCalledWith('Custom error message');
    });

    it('should handle 409 conflict error', () => {
      const errorResponse = { status: 409 };
      mockAuthService.register.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Cette adresse email est déjà utilisée.'
      );
    });

    it('should handle 422 validation error', () => {
      const errorResponse = { status: 422 };
      mockAuthService.register.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Les données saisies ne sont pas valides.'
      );
    });

    it('should handle generic error', () => {
      const errorResponse = { status: 500 };
      mockAuthService.register.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Une erreur est survenue lors de la création du compte.'
      );
    });

    it('should mark form as touched when invalid', () => {
      component.registerForm.reset();
      spyOn(component as any, 'markFormGroupTouched');

      component.onSubmit();

      expect((component as any).markFormGroupTouched).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page', () => {
      component.navigateToLogin();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Form Control Getters', () => {
    it('should return correct form controls', () => {
      expect(component.firstName).toBe(component.registerForm.get('firstName'));
      expect(component.lastName).toBe(component.registerForm.get('lastName'));
      expect(component.email).toBe(component.registerForm.get('email'));
      expect(component.password).toBe(component.registerForm.get('password'));
      expect(component.confirmPassword).toBe(component.registerForm.get('confirmPassword'));
      expect(component.acceptTerms).toBe(component.registerForm.get('acceptTerms'));
    });
  });

  describe('Loading State', () => {
    it('should initialize loading$ observable', () => {
      expect(component.isLoading$).toBeDefined();
      component.isLoading$.subscribe(loading => {
        expect(loading).toBeFalsy();
      });
    });
  });
}); 
