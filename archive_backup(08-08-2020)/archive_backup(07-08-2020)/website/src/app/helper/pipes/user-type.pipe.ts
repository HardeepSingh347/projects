import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userType'
})
export class UserTypePipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) {
      return 'Owner';
    } else if (value === 1) {
      return 'Admin';
    } else if (value === 2) {
      return 'User';
    }
  }

}
