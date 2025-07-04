import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  selectedTab: 'admin' | 'vecino' = 'admin';

  admin = {
    usuario: '',
    password: ''
  };

  vecino = {
    codigo: ''
  };

  login() {
    if (this.selectedTab === 'admin') {
      console.log('Login admin:', this.admin);
    } else {
      console.log('Login vecino:', this.vecino);
    }
  }
}
