import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }


  public setItem(key: string, value: any): void {
    const storageValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, storageValue);
  }

  public getItem(key: string): any {
    const item = localStorage.getItem(key);

    if (item === null) {
      return null;
    }

    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  }
}
