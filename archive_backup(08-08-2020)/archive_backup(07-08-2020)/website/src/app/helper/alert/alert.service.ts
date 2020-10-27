import { Injectable } from '@angular/core';
import { MatSnackBarModule, MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  toggleStatus = true;
  toggled = new Subject<any>();

  // constructor(private toastrService: ToastrService) { }

  constructor(public snackBar: MatSnackBar) {}

  /**
   *
   * @param title - Modal Header # 'Oops...'
   * @param message - Warning Message # 'No internet connection found.'
   * @param type -  error, success
   */
  errorAlert(title, message, type) {
    Swal.fire(title, message, type);
  }

  // /**
  //  *
  //  * @param type success/error/warning/info/show
  //  * @param message Message - everything is broken
  //  * @param subject Subject - Major Error
  //  */
  // showToast(type, message, subject?) {
  //   // this.toastrService.success(message);
  //   switch (type) {
  //     case 'success':
  //       this.toastrService.success(message);
  //       break;
  //     case 'error':
  //       this.toastrService.error(message);
  //       break;
  //     default:
  //       this.toastrService.success(message);
  //       break;
  //   }
  // }

  /**
   *
   * @param message Message - everything is broken
   * @param type success/error/warning/info/show
   */
  showSnackbar(message, type?) {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'center';
    config.duration = 5000;
    config.panelClass = 'custom-snackbar';
    this.snackBar.open(message, undefined, config);
  }

  toggleNavbar = () => {
    this.toggleStatus = !this.toggleStatus;
    this.toggled.next(this.toggleStatus);
  }

}
