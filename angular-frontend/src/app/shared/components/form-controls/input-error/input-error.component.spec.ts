import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { InputErrorComponent } from './input-error.component';

describe('InputErrorComponent', () => {
  let component: InputErrorComponent;
  let fixture: ComponentFixture<InputErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputErrorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputErrorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show error when control is null', () => {
    component.control = null;
    fixture.detectChanges();

    expect(component.hasError).toBeFalsy();
    expect(component.errorMessage).toBe('');
  });

  it('should not show error when control is not touched', () => {
    const control = new FormControl('', Validators.required);
    component.control = control;
    component.fieldName = 'Test Field';
    fixture.detectChanges();

    expect(component.hasError).toBeFalsy();
  });

  it('should show required error message', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    component.control = control;
    component.fieldName = 'Test Field';
    fixture.detectChanges();

    expect(component.hasError).toBeTruthy();
    expect(component.errorMessage).toBe('Test Field est requis');
  });

  it('should show email error message', () => {
    const control = new FormControl('invalid-email', Validators.email);
    control.markAsTouched();
    component.control = control;
    component.fieldName = 'Email';
    fixture.detectChanges();

    expect(component.hasError).toBeTruthy();
    expect(component.errorMessage).toBe('Format d\'email invalide');
  });

  it('should show minlength error message', () => {
    const control = new FormControl('abc', Validators.minLength(5));
    control.markAsTouched();
    component.control = control;
    component.fieldName = 'Password';
    fixture.detectChanges();

    expect(component.hasError).toBeTruthy();
    expect(component.errorMessage).toBe('Password doit contenir au moins 5 caractères');
  });

  it('should show maxlength error message', () => {
    const control = new FormControl('abcdefghijk', Validators.maxLength(10));
    control.markAsTouched();
    component.control = control;
    component.fieldName = 'Username';
    fixture.detectChanges();

    expect(component.hasError).toBeTruthy();
    expect(component.errorMessage).toBe('Username ne peut pas dépasser 10 caractères');
  });

  it('should show generic error message for unknown errors', () => {
    const control = new FormControl('test');
    control.setErrors({ customError: true });
    control.markAsTouched();
    component.control = control;
    component.fieldName = 'Test Field';
    fixture.detectChanges();

    expect(component.hasError).toBeTruthy();
    expect(component.errorMessage).toBe('Champ invalide');
  });
});