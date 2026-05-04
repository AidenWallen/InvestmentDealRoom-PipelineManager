import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { DealService } from './deal/services/deal';
import { MockDealService } from './deal/services/deal.mock.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: DealService, useClass: MockDealService},
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG ({
      ripple: true,
      theme: {
        preset: Aura, 
        options: {
          // cssLayer: {
          //   name: 'primeng',
          //   order: 'theme, base, primeng'
          // }

        }
      }
    })
  ]
};
