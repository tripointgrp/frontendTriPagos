import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { PhoneAppBarComponent } from '../components/phone-app-bar/phone-app-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule,PhoneAppBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // Variables e inputs
  rutaActual: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('Ruta actual:', this.router.url);
    this.rutaActual = this.router.url;
  }

  redirecTo(ruta: string) {
    console.log('Redirigiendo a:', ruta);
    this.router.navigate([ruta]);
  }
}
