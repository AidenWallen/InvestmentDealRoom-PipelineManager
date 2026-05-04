import { Routes } from '@angular/router';
import { DealPage } from './deal/pages/deal-page/deal-page';
import { CounterpartyPage } from './deal/pages/counterparty-page/counterparty-page';
import { ProfilePage } from './deal/pages/profile-page/profile-page';
import { DealDetailPage } from './deal/pages/deal-detail-page/deal-detail-page';


export const routes: Routes = [
  { path: '', redirectTo: 'deals', pathMatch: 'full' },
  { path: 'deals', component: DealPage },
  { path: 'deals/:id', component: DealDetailPage },
  { path: 'counterparties', component: CounterpartyPage },
  { path: 'profile', component: ProfilePage },
];