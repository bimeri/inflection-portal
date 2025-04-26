import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ErrorResponseDto} from "../../model/ErrorResponseDto";
import {ToastService} from "../notification/toast.service";
import {TranslationService} from "../translation/translation.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Partner} from "../../model/partner";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private windowWidthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(window.innerWidth);
  // @ts-ignore
  private allPartners: BehaviorSubject<Partner[]> = new BehaviorSubject<Partner[]>();
  public windowWidth$: Observable<number> = this.windowWidthSubject.asObservable();

  constructor(private toastService: ToastService, private translationService: TranslationService) { }

  setWindowWidthAndHeight(width: number, height: number): void {
    this.windowWidthSubject.next(width);
  }

  public setPartner(partner: Partner[]): void {
    this.allPartners.next(partner);
  }

  public getAllPartners(): Partner[] {
    return this.allPartners.value;
  }

  public buildErrorResponse(error: any): ErrorResponseDto | any {
    const errorResponse: ErrorResponseDto = new ErrorResponseDto();
    errorResponse.timestamp = new Date();
    if (error && error.status == 0) {
      this.toastService.showWarning(
        this.translationService.translateMessage('offline_title'),
        this.translationService.translateMessage('offline_message'));
    }
    if (error && error.status == 404) {
      this.toastService.showWarning(
        this.translationService.translateMessage('404_error_title'),
        this.translationService.translateMessage('404_error_content'));
    }
    if (error.status === 500) {
      errorResponse.detailMessage = error.error?.message;
      errorResponse.httpStatus = error.error?.status;
      errorResponse.timestamp = error.error?.timestamp;
      errorResponse.errorMessage = error.error?.error;
      errorResponse.url = error.path;
      this.toastService.showError(
        errorResponse.errorMessage || this.translationService.translateMessage('internal_server_error'),
        errorResponse.detailMessage || this.translationService.translateMessage('internal_server_error_message')
      );
      return errorResponse;
    }
    if(error.error == null && error instanceof HttpErrorResponse) {
      errorResponse.errorMessage =  error?.error?.errorMessage || this.translationService.translateMessage("unknown_error");
      errorResponse.detailMessage = error?.error?.detailMessage || this.translationService.translateMessage("detail_error");
      errorResponse.httpStatus = error?.status;
      errorResponse.code = error.error?.code;
      errorResponse.url = error?.url;
      errorResponse.code = error.error?.code;
      errorResponse.errorCode = error.error?.errorCode;
      return errorResponse;
    }
    if (!error || Object.keys(error).length === 0) {
      errorResponse.errorMessage = this.translationService.translateMessage("unknown_error");
      errorResponse.detailMessage = this.translationService.translateMessage("detail_error");
      errorResponse.httpStatus = 500;
    } else {
      errorResponse.detailMessage = error.error?.detailMessage;
      errorResponse.httpStatus = error.error?.httpStatus;
      errorResponse.timestamp = error.error?.timestamp;
      errorResponse.errorMessage = error.error?.errorMessage;
      errorResponse.url = error.error?.url;
      errorResponse.code = error.error?.code;
      errorResponse.errorCode = error.error?.errorCode;
    }
    return errorResponse;
  }
}
