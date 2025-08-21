import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  selectedTab: 'admin' | 'vecino' =
    window.innerWidth <= 767 ? 'vecino' : 'admin';

  ngOnInit() {
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize() {
    this.selectedTab = window.innerWidth <= 767 ? 'vecino' : 'admin';
  }

  admin = {
    usuario: '',
    password: '',
  };

  vecino = {
    codigo: '',
  };

  constructor(private router: Router, private auth: AuthService) {}

  login() {
    if (this.selectedTab === 'admin') {
      console.log('Login admin:', this.admin);
      this.auth.setRole('admin');
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/home']);
      this.auth.setRole('user');
      console.log('Login vecino:', this.vecino);
    }
  }
}
