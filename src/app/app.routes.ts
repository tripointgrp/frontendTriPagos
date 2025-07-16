// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PagosComponent } from './pagos/pagos.component';

export const routes: Routes = [
  { path: '', redirectTo: '*', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '*', component: LandingPageComponent },
  { path: 'pagos', component: PagosComponent },
  { path: '**', redirectTo: 'login' } // <-- Ruta comodín
];
