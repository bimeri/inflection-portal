import { Routes } from '@angular/router';
import {PageNotFoundComponent} from "./components/page-404/page-not-found/page-not-found.component";
import {PartnerComponent} from "./components/partner/partner/partner.component";

export const routes: Routes = [
  { path: '', component: PartnerComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];
