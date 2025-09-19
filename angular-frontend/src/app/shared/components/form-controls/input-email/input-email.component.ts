import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputErrorComponent } from '../input-error/input-error.component';
import { AutofocusDirective } from '../../../directives/autofocus.directive';

@Component({
  selector: 'app-input-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputErrorComponent, AutofocusDirective],
  templateUrl: './input-email.component.html',
  styleUrls: ['./input-email.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputEmailComponent),
      multi: true
    }
  ]
})
export class InputEmailComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = 'Email';
  @Input() placeholder: string = 'exemple@domaine.com';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() autofocus: boolean = false;
  @Input() control: FormControl | null = null;
  @Input() fieldName: string = 'Email';

  value: string = '';
  showValidationIcon: boolean = true;
  private onChange = (value: string) => {};
  private onTouched = () => {};

  ngOnInit() {
    if (!this.fieldName && this.label) {
      this.fieldName = this.label;
    }
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  get inputId(): string {
    return `input-email-${Math.random().toString(36).slice(2, 11)}`;
  }

  get hasError(): boolean {
    return !!(this.control?.errors && this.control?.touched);
  }

  get isValid(): boolean {
    return !!(this.control?.valid && this.control?.touched && this.value);
  }

  get inputClasses(): string {
    let classes = 'form-input form-input--email';
    if (this.hasError) {
      classes += ' form-input--error';
    }
    if (this.isValid && this.showValidationIcon) {
      classes += ' form-input--valid';
    }
    if (this.disabled) {
      classes += ' form-input--disabled';
    }
    return classes;
  }

  get wrapperClasses(): string {
    let classes = 'input-wrapper';
    if (this.showValidationIcon && (this.hasError || this.isValid)) {
      classes += ' input-wrapper--with-icon';
    }
    return classes;
  }
}
