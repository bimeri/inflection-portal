
export class ErrorResponseDto {
 errorMessage?: string;
 detailMessage?: string;
 errorCode?: number;
 code?: string;
 timestamp?: Date;
 url?: string | null;
 httpStatus?: number;

  constructor(errorMessage?: string, detailMessage?: string, errorCode?: number, code?: string, url?: string | null, timestamp?: Date, httpStatus?: number) {
    this.errorMessage = errorMessage;
    this.detailMessage = detailMessage;
    this.timestamp = timestamp;
    this.errorCode = errorCode;
    this.code = code;
    this.url = url;
    this.httpStatus = httpStatus;
  }

}
