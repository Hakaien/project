import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
// AutofocusDirective : Met automatiquement le focus sur un élément après le rendu

@Directive({
  selector: '[appAutofocus]',
  standalone: true
})
export class AutofocusDirective implements AfterViewInit {
  @Input() appAutofocus: boolean = true;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.appAutofocus) {
      setTimeout(() => {
        this.elementRef.nativeElement.focus();
      }, 100);
    }
  }
}