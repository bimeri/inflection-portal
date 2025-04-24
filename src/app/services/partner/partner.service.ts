import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {Partner} from "../../model/partner";

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private apiUrl = 'https://mockanapi.com/s/67ae1b3403f9ffca6f47eb79/partners?mock_delay=500';

  constructor(private http: HttpClient) {}

  getPartners(): Observable<Partner[]> {
    return this.http.get<Record<number, Partner>>(this.apiUrl).pipe(
      map(response => Object.values(response)),
      catchError(error => {
        console.error('API error:', error);
        return throwError(() => new Error('Failed to fetch partners'));
      })
    );
  }
}
