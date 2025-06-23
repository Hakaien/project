import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { InputTextComponent } from './input-text.component';
import { By } from '@angular/platform-browser';

describe('InputTextComponent', () => {
  let component: InputTextComponent;
  let fixture: ComponentFixture<InputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputTextComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label when provided', () => {
    component.label = 'Test Label';
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('.form-label'));
    expect(labelElement.nativeElement.textContent.trim()).toContain('Test Label');
  });

  it('should show required indicator when required is true', () => {
    component.label = 'Test Label';
    component.required = true;
    fixture.detectChanges();

    const requiredIndicator = fixture.debugElement.query(By.css('.required-indicator'));
    expect(requiredIndicator).toBeTruthy();
    expect(requiredIndicator.nativeElement.textContent).toBe('*');
  });

  it('should set input value correctly', () => {
    const testValue = 'test value';
    component.writeValue(testValue);
    fixture.detectChanges();

    expect(component.value).toBe(testValue);

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.value).toBe(testValue);
  });

  it('should call onChange when input value changes', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    component.registerOnChange(onChangeSpy);

    const inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = 'new value';
    inputElement.nativeElement.dispatchEvent(new Event('input'));

    expect(onChangeSpy).toHaveBeenCalledWith('new value');
  });

  it('should call onTouched when input loses focus', () => {
    const onTouchedSpy = jasmine.createSpy('onTouched');
    component.registerOnTouched(onTouchedSpy);

    const inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.dispatchEvent(new Event('blur'));

    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should disable input when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.disabled).toBeTruthy();
  });

  it('should set input type correctly', () => {
    component.type = 'password';
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.type).toBe('password');
  });

  it('should apply error class when control has errors', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    component.control = control;
    fixture.detectChanges();

    expect(component.hasError).toBeTruthy();
    expect(component.inputClasses).toContain('form-input--error');
  });

  it('should set placeholder correctly', () => {
    component.placeholder = 'Enter text here';
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.placeholder).toBe('Enter text here');
  });

  it('should set maxlength attribute', () => {
    component.maxlength = 50;
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.maxLength).toBe(50);
  });

  it('should set fieldName from label if not provided', () => {
    component.label = 'Test Label';
    component.ngOnInit();

    expect(component.fieldName).toBe('Test Label');
  });
});