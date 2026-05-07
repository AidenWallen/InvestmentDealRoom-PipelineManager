import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { msalInstance } from './app/core/auth/msal.config';

msalInstance.initialize().then(() => {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
});
