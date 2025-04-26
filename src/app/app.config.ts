import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {TranslationService} from "./services/translation/translation.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideHttpClient } from '@angular/common/http';
import {constants} from "../assets/resorces/constants";
import { registerLocaleData } from '@angular/common';
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import { provideRouter } from '@angular/router';
import {NzIconModule} from "ng-zorro-antd/icon";
import { FormsModule } from '@angular/forms';
import en from '@angular/common/locales/en';
import { routes } from './app.routes';
import {TranslatePipe} from "./pipes/translate.pipe";
import {provideToastr} from "ngx-toastr";

registerLocaleData(en);
const translationFactory = (translationService: TranslationService) => {
  return () => translationService.getTranslationMessages(constants.LANG_VALUE);
};

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: APP_INITIALIZER, useFactory: translationFactory, deps: [TranslationService], multi: true},
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideNzI18n(en_US),
    provideHttpClient(),
    BrowserAnimationsModule,
    FontAwesomeModule,
    provideToastr(),
    TranslatePipe,
    NzAvatarModule,
    NzIconModule
  ]
};
