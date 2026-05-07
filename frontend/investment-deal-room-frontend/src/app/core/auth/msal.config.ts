import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../../../environments/environments';

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId:    environment.azureClientId,
    // authority:   `https://login.microsoftonline.com/common`,
    authority:   `https://login.microsoftonline.com/${environment.azureTenantId}`,
    redirectUri: environment.redirectUri,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  }
});

export const msalGuardConfig: MsalGuardConfiguration = {
    interactionType: InteractionType.Redirect,
    authRequest: {
        scopes: [environment.azureApiScope]
    }
};

export const msalInterceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Redirect,
  protectedResourceMap: new Map([
    [`http://localhost:8080/api/v1/**`, [environment.azureApiScope]]
  ])
};

