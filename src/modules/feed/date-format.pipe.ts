import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon'

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: number): string {
    return DateTime.fromMillis(value).toFormat("hh:mm - dd/MM/yyyy");
  }

}
