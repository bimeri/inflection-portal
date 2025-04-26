import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toast: ToastrService) { }

  public showSuccess(title?: string, message?: string, timeOut?: number) {
    this.toast.success(message, title,
      {
        positionClass: "toast-top-right",
        easing: 'ease-in',
        timeOut: timeOut || 5000,
        easeTime: 300,
        enableHtml: true,
        closeButton: true
      }
    );
  }

  public showError(title?: string, message?: string, timeOut?: number) {
    this.toast.error(message, title,
      {
        positionClass: "toast-top-right",
        easing: 'ease-out',
        timeOut: timeOut || 5000,
        easeTime: 300,
        closeButton: true,
      });
  }

  public showInfo(title?: string, message?: string, timeOut?: number) {
    this.toast.info(message, title, {
      positionClass: "toast-top-right",
      easing: 'ease-out',
      timeOut: timeOut || 5000,
      easeTime: 300,
      closeButton: true,
    });
  }

  public showWarning(title?: string, message?: string, timeOut?: number) {
    this.toast.warning(message, title, {
      positionClass: "toast-top-right",
      easing: 'ease-out',
      timeOut: timeOut || 5000,
      easeTime: 300,
      closeButton: true,
    });
  }
}
