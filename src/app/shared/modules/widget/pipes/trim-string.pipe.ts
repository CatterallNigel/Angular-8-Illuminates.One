import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'trimString'
})
export class TrimStringPipe implements PipeTransform {

  transform(value: string, length: number): string {
    return value.length > length ? value.substr(0, length) + '...' : value;
  }

}
