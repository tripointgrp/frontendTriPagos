import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PhoneAppBarComponent } from '../components/phone-app-bar/phone-app-bar.component';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [RouterModule, CommonModule,PhoneAppBarComponent],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss',
})
export class PagosComponent {
  // Variables e inputs
  rutaActual: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('Ruta actual:', this.router.url);
    this.rutaActual = this.router.url;
  }
}
