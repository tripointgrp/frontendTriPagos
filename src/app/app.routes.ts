// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PagosComponent } from './pagos/pagos.component';
import { ReservaComponent } from './reserva/reserva.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { WebSidebarComponent } from './components/web-sidebar/web-sidebar.component';
import { IngresosRegistroComponent } from './ingresos-registro/ingresos-registro.component';
import { AdminResidentesComponent } from './admin-residentes/admin-residentes.component';
import { AdminPagosComponent } from './admin-pagos/admin-pagos.component';
import { AdminCondominiosComponent } from './admin-condominios/admin-condominios.component';
import { AdminReservacionesComponent } from './admin-reservaciones/admin-reservaciones.component';
import { AdminCalendarioComponent } from './admin-calendario/admin-calendario.component';
import { AdminNotificacionesComponent } from './admin-notificaciones/admin-notificaciones.component';
import { AdminAreascomunalesComponent } from './admin-areascomunales/admin-areascomunales.component';
import { AdminReportesComponent } from './admin-reportes/admin-reportes.component';
import { AdminConfiguracionComponent } from './admin-configuracion/admin-configuracion.component';
import { userOnlyGuard } from './guard/auth.guard';
import { ApartamentosComponent } from './apartamentos/apartamentos.component';

export const routes: Routes = [
 // Rutas de usuario normal (bloqueadas para admin con el guard)
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'reserva', component: ReservaComponent },
  { path: 'consulta', component: ConsultaComponent },
  { path: 'apartamentos', component: ApartamentosComponent },
  { path: 'notificaciones', component: NotificacionesComponent },

//PANTALLAS ADMIN
  { path: 'ingresos', component: IngresosRegistroComponent},
  { path: 'sidebar', component: WebSidebarComponent},
  { path: 'residentes', component: AdminResidentesComponent},
  { path: 'condominios', component: AdminCondominiosComponent},
  { path: 'reservaciones', component: AdminReservacionesComponent},
  { path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: 'calendario', component: AdminCalendarioComponent},
  { path: 'admin-pagos', component: AdminPagosComponent},
  { path: 'admin-notificaciones', component: AdminNotificacionesComponent},
  { path: 'admin-areascomunales', component: AdminAreascomunalesComponent},
  { path: 'admin-reportes', component: AdminReportesComponent},
  { path: 'admin-configuracion', component: AdminConfiguracionComponent},
  { path: '**', redirectTo: '' } // Ruta comodín redirige a la landing
];
