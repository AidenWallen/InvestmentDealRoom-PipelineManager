import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer  } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalService } from '@azure/msal-angular';
import { msalGuardConfig, msalInstance, msalInterceptorConfig } from './core/auth/msal.config';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      document.documentElement.classList.add('p-dark');
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG ({
      ripple: true,
      theme: {
        preset: Aura, 
        options: {
           darkModeSelector: '.p-dark'
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
