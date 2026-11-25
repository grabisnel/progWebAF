import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';

// Números e dinheiro no formato brasileiro (R$ 1.250,90)
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(), // libera o HttpClient para o serviço chamar a API
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
