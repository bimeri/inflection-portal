import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public clearAll() {
    localStorage.clear();
  }

  public setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getItem(key: string, noDecryption?: boolean): any {
    return JSON.parse(<any>localStorage.getItem(key));
  }

  public deleteItem(key: string): any {
    localStorage.removeItem(key);
  }
}
