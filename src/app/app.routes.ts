import { Routes } from '@angular/router';
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {PartnersComponent} from "./components/partners/partners.component";
import {ApprovalsComponent} from "./components/approvals/approvals.component";
import {MessagingComponent} from "./components/messaging/messaging.component";
import {FilesComponent} from "./components/files/files.component";
import {ConversationComponent} from "./components/conversation/conversation.component";
import {AdminComponent} from "./components/admin/admin.component";

export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
  { path: 'partners', component: PartnersComponent },
  { path: 'approvals', component: ApprovalsComponent },
  { path: 'messaging', component: MessagingComponent },
  { path: 'marketing_resources', component: MessagingComponent },
  { path: 'files', component: FilesComponent },
  { path: 'conversion', component: ConversationComponent },
  { path: 'admin', component: AdminComponent },

  { path: '**', component: PageNotFoundComponent }
];
