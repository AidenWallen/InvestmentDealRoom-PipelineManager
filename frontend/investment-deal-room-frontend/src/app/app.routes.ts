import { Routes } from '@angular/router';
import { DealPage } from './deal/pages/deal-page/deal-page';
import { CounterpartyPage } from './counterparty/pages/counterparty-page/counterparty-page';
import { CounterpartyDetail } from './counterparty/pages/counterparty-detail-page/counterparty-detail';
import { ProfilePage } from './deal/pages/profile-page/profile-page';
import { DealDetail } from './deal/pages/deal-detail-page/deal-detail';
import { MsalGuard } from '@azure/msal-angular';


// export const routes: Routes = [
//   { path: '', redirectTo: 'deals', pathMatch: 'full' },
//   { path: 'deals',           component: DealPage,         canActivate: [MsalGuard] },
//   { path: 'deals/:id',       component: DealDetailPage,   canActivate: [MsalGuard] },
//   { path: 'counterparties',  component: CounterpartyPage, canActivate: [MsalGuard] },
//   { path: 'profile',         component: ProfilePage,      canActivate: [MsalGuard] },
// ];

export const routes: Routes = [
  { path: '', redirectTo: 'deals', pathMatch: 'full' },
  { path: 'deals',              component: DealPage           },
  { path: 'deals/:id',          component: DealDetail         },
  { path: 'counterparties',     component: CounterpartyPage   },
  { path: 'counterparties/:id', component: CounterpartyDetail },
  { path: 'profile',            component: ProfilePage        },
];