import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon'

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: number): string {
    return DateTime.fromMillis(value).toLocaleString(DateTime.DATETIME_MED);
  }
}
