import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initialsIfLong'
})
export class InitialsIfLongPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
