import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import {
  PreloadAllModules,
  withPreloading,
  withComponentInputBinding
} from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),  // Optimización: precarga lazy routes
      withComponentInputBinding()
    ),
    provideHttpClient(),  // ← Habilita HttpClient en toda la app
  ]
};