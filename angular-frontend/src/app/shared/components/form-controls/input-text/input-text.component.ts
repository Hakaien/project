import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputErrorComponent } from '../input-error/input-error.component';
import { AutofocusDirective } from '../../../directives/autofocus.directive';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputErrorComponent, AutofocusDirective],
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ]
})
export class InputTextComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() type: string = 'text';
  @Input() maxlength?: number;
  @Input() minlength?: number;
  @Input() autofocus: boolean = false;
  @Input() control: FormControl | null = null;
  @Input() fieldName: string = '';

  value: string = '';
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
    return `input-text-${Math.random().toString(36).slice(2, 11)}`;
  }

  get hasError(): boolean {
    return !!(this.control?.errors && this.control?.touched);
  }

  get inputClasses(): string {
    let classes = 'form-input';
    if (this.hasError) {
      classes += ' form-input--error';
    }
    if (this.disabled) {
      classes += ' form-input--disabled';
    }
    return classes;
  }
}
