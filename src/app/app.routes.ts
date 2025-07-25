// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PagosComponent } from './pagos/pagos.component';
import { ReservaComponent } from './reserva/reserva.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'reserva', component: ReservaComponent },
  { path: 'consulta', component: ConsultaComponent},
  { path: 'notificaciones', component: NotificacionesComponent},
  { path: '**', redirectTo: '' } // Ruta comodín redirige a la landing
];
