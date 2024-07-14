import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'SortConcat',
})
export class SortConcatPipe implements PipeTransform {
  transform(value: string[]): string {
    return value.sort().join(', ');
  }
}
