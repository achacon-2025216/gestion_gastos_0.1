import { ApplicationConfig, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <-- Importa withInterceptors
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor'; // <-- Importa tu interceptor
import { 
  GoogleLoginProvider, 
  SocialAuthServiceConfig, 
  SocialLoginModule 
} from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) // <-- Registra aquí el interceptor para los tokens de 2 minutos
    ),
    importProvidersFrom(SocialLoginModule),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '463867676917-g8hga9ugqt9um24hpkoakhrl7jjhbs.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err: any) => { // Tipado explícito 'any' para evitar errores de TypeScript
          console.error(err);
        }
      } as SocialAuthServiceConfig
    }
  ]
};