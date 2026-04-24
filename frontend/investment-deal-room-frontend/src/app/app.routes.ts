import { Routes } from '@angular/router';
import { DealPage } from './deal/pages/deal-page/deal-page';

export const routes: Routes = [
  { path: '', redirectTo: 'deals', pathMatch: 'full' },
  { path: 'deals', component: DealPage }
];