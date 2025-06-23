// ===== MODAL COMPONENT =====
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ModalConfig {
  title?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() config: ModalConfig = {};
  @Output() onClose = new EventEmitter<void>();
  @Output() onOpen = new EventEmitter<void>();

  defaultConfig: ModalConfig = {
    title: '',
    showCloseButton: true,
    closeOnBackdropClick: true,
    closeOnEscape: true,
    size: 'md',
    centered: true
  };

  modalConfig: ModalConfig = {};

  ngOnInit(): void {
    this.modalConfig = { ...this.defaultConfig, ...this.config };
    if (this.isOpen) {
      this.openModal();
    }
  }

  ngOnDestroy(): void {
    this.closeModal();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen && this.modalConfig.closeOnEscape) {
      this.closeModal();
    }
  }

  openModal(): void {
    this.isOpen = true;
    document.body.classList.add('modal-open');
    this.onOpen.emit();
  }

  closeModal(): void {
    this.isOpen = false;
    document.body.classList.remove('modal-open');
    this.onClose.emit();
  }

  onBackdropClick(): void {
    if (this.modalConfig.closeOnBackdropClick) {
      this.closeModal();
    }
  }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  getSizeClass(): string {
    return `modal-${this.modalConfig.size}`;
  }
}