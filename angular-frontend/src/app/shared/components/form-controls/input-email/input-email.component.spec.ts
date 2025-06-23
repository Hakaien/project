import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { InputEmailComponent } from './input-email.component';
import { By } from '@angular/platform-browser';

describe('InputEmailComponent', () => {
  let component: InputEmailComponent;
  let fixture: ComponentFixture<InputEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputEmailComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputEmailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default email label and placeholder', () => {
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('.form-label'));
    expect(labelElement.nativeElement.textContent.trim()).toContain('Email');

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.placeholder).toBe('exemple@domaine.com');
  });

  it('should set input type to email', () => {
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.type).toBe('email');
  });

  it('should show valid icon when email is valid', () => {
    const control = new FormControl('test@example.com', Validators.email);
    control.markAsTouched();
    component.control = control;
    component.value = 'test@example.com';
    fixture.detectChanges();

    expect(component.isValid).toBeTruthy();

    const validIcon = fixture.debugElement.query(By.css('.icon-valid'));
    expect(validIcon).toBeTruthy();
  });

  it('should show error icon when email is invalid', () => {
    const control = new FormControl('invalid-email', Validators.email);
    control.markAsTouched();
    component.control = control;
    fixture.detectChanges();

    expect(component.hasError).toBeTruthy();

    const errorIcon = fixture.debugElement.query(By.css('.icon-error'));
    expect(errorIcon).toBeTruthy();
  });

  it('should apply correct CSS classes for valid state', () => {
    const control = new FormControl('test@example.com', Validators.email);
    control.markAsTouched();
    component.control = control;
    component.value = 'test@example.com';
    fixture.detectChanges();

    expect(component.inputClasses).toContain('form-input--valid');
  });

  it('should apply correct CSS classes for error state', () => {
    const control = new FormControl('invalid-email', Validators.email);
    control.markAsTouched();
    component.control = control;
    fixture.detectChanges();

    expect(component.inputClasses).toContain('form-input--error');
  });

  it('should set autocomplete attribute to email', () => {
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.autocomplete).toBe('email');
  });

  it('should call onChange when input value changes', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    component.registerOnChange(onChangeSpy);

    const inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = 'test@example.com';
    inputElement.nativeElement.dispatchEvent(new Event('input'));

    expect(onChangeSpy).toHaveBeenCalledWith('test@example.com');
  });

  it('should add padding for validation icon when needed', () => {
    const control = new FormControl('test@example.com', Validators.email);
    control.markAsTouched();
    component.control = control;
    component.value = 'test@example.com';
    fixture.detectChanges();

    expect(component.wrapperClasses).toContain('input-wrapper--with-icon');
  });
});