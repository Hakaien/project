import { Pipe, PipeTransform } from '@angular/core';
// TruncatePipe : Tronque le texte avec une longueur personnalisable et des ellipses

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, ellipsis: string = '...'): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit).trim() + ellipsis;
  }
}