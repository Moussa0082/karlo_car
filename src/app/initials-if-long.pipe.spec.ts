import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initialsIfLong'
})
export class InitialsIfLongPipe implements PipeTransform {

  transform(value: string | null): string {
    if (value && value.length > 10) {
      return value.split(' ')
                  .map(word => word[0].toUpperCase())
                  .join('');
    }
    return value || '';
  }

}