/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { environment } from './environments/environment';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebaseConfig);
      console.log(`✅ Firebase inicializado por: ${app.name}`);
      return app;
    }),
    provideAnalytics(() => {
      try {
        return getAnalytics();
      } catch (e) {
        console.warn('⚠️ Analytics no inicializado', e);
        return undefined as any;
      }
    }),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
}).catch(err => console.error('Error en bootstrap:', err));
