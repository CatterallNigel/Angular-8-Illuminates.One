import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'prefixPadNoToString'
})
export class PrefixPadNoToStringPipe implements PipeTransform {

  transform(value: number, prefix: string): string {
    if (value < 10) {
      return prefix  + value;

    } else {
      return  value.toString();
    }
  }
}
