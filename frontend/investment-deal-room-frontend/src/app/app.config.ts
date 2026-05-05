import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { DealService } from './deal/services/deal';
import { MockDealService } from './deal/services/deal.mock.service';
import { MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalService } from '@azure/msal-angular';
import { msalGuardConfig, msalInstance, msalInterceptorConfig } from './core/auth/msal.config';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // {provide: DealService, useClass: MockDealService},
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
    }),
    provideHttpClient(withInterceptorsFromDi()),
    MsalModule.forRoot(
      msalInstance,
      msalGuardConfig,
      msalInterceptorConfig
    ).providers!,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ]
};
