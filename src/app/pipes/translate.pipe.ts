import { Pipe, PipeTransform } from '@angular/core';
import {TranslationService} from "../services/translation/translation.service";

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {

  constructor(private translationService: TranslationService) {
  }
  transform(key: string, ...args: any[]): string {
    return this.translationService.translateMessage(key, args);
  }

}
