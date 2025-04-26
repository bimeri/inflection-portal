import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {constants} from "../../../assets/resorces/constants";
import {LocalStorageService} from "../storage/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  message: any = {};
  constructor(private storageService: LocalStorageService,
              private httpClient: HttpClient) { }

  async getTranslationMessages(lang: string): Promise<any> {
    let language = this.storageService.getItem(constants.LANG) || lang;
    const path: string = `${constants.ASSET_DIR}/lang/${language}.json`;
    this.storageService.setItem(constants.LANG, language);

    return new Promise<any>((resolve, reject): void => {
      this.httpClient.get<any>(path).subscribe({
        next: (response): void => {
          this.message = response;
          resolve(this.message);
        },
        error: (error): void => {
          reject(error);
        }
      });
    });
  }

  public translateMessage(key: string, args?: any[]): string {
    let newMessage = this.message[key] || key;
    if (!args || args.length < 1 ) return newMessage;
    for (let i: number = 0; i < args.length; i++) {
      newMessage = newMessage.replace(`{${i}}`, args[i]);
    }
    return newMessage;
  }

}
