import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../classes/item';

@Pipe({
  name: 'available'
})
export class AvailablePipe implements PipeTransform {

  transform(allItem: Item[]): any {
    return allItem.filter(item => item.available);
  }

}
