// ===== BUTTON COMPONENT =====
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-light' | 'outline-dark' | 'link' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() type: ButtonType = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() ariaLabel: string = '';
  @Input() title: string = '';
  @Input() customClass: string = '';

  @Output() onClick = new EventEmitter<Event>();

  buttonClasses: string = '';

  ngOnInit(): void {
    this.buildClasses();
  }

  ngOnChanges(): void {
    this.buildClasses();
  }

  private buildClasses(): void {
    const classes = [
      'btn',
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.fullWidth ? 'btn-full-width' : '',
      this.loading ? 'btn-loading' : '',
      this.disabled ? 'btn-disabled' : '',
      this.customClass
    ];

    this.buttonClasses = classes.filter(cls => cls).join(' ');
  }

  onButtonClick(event: Event): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.onClick.emit(event);
  }
}