import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string, format: string = 'dd/MM/yyyy'): string {
    if (!value) return '';

    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {};

    switch (format) {
      case 'dd/MM/yyyy':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        break;
      case 'MM/dd/yyyy':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        break;
      case 'yyyy-MM-dd':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        break;
      default:
        return value.toString();
    }

    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  }
}