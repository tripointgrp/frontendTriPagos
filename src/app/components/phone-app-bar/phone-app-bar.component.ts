import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phone-app-bar',
  standalone: true,
  imports: [],
  templateUrl: './phone-app-bar.component.html',
  styleUrl: './phone-app-bar.component.scss',
})
export class PhoneAppBarComponent {

  constructor(private router: Router) {}

  redirecTo(ruta: string) {
    console.log('Redirigiendo a:', ruta);
    this.router.navigate([ruta]);
  }

  get currentRoute(): string {
    return this.router.url;
  }
}
