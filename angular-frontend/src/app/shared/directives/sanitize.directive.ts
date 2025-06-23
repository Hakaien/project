import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// SanitizeDirective : Nettoie et sécurise le contenu HTML avant l'affichage

@Directive({
  selector: '[appSanitize]',
  standalone: true
})
export class SanitizeDirective implements OnChanges {
  @Input() appSanitize: string = '';

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appSanitize'] && this.appSanitize) {
      const sanitizedHtml: SafeHtml = this.sanitizer.sanitize(1, this.appSanitize) || '';
      this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', sanitizedHtml);
    }
  }
}