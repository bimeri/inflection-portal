import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {Partner} from "../../model/partner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  async downloadAsPDF(elementId: string, fileName: string = 'download.pdf'): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id '${elementId}' not found!`);
      return;
    }

    try {
      this.cleanUnsupportedColors(element);

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  }

  private cleanSingleElement(el: HTMLElement): void {
    const computedStyle = window.getComputedStyle(el);

    const bgColor = computedStyle.getPropertyValue('background-color');
    if (bgColor.includes('oklch')) {
      el.style.setProperty('background-color', '#ffffff', 'important');
    }

    const color = computedStyle.getPropertyValue('color');
    if (color.includes('oklch')) {
      el.style.setProperty('color', '#000000', 'important');
    }

    const borderColor = computedStyle.getPropertyValue('border-color');
    if (borderColor.includes('oklch')) {
      el.style.setProperty('border-color', '#000000', 'important');
    }
  }

  private cleanUnsupportedColors(element: HTMLElement): void {
    this.cleanSingleElement(element);

    const allElements = element.querySelectorAll<HTMLElement>('*');
    allElements.forEach(el => this.cleanSingleElement(el));
  }

}
