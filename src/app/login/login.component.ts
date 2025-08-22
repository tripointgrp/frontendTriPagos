import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  selectedTab: 'admin' | 'vecino' = 'admin'; // valor por defecto seguro en SSR

  admin = {
    usuario: '',
    password: '',
  };

  vecino = {
    codigo: '',
  };

  constructor(
    private router: Router,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.handleResize.bind(this));
      this.handleResize(); // ahora sí puedes calcular con innerWidth
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
  }

  private handleResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.selectedTab = window.innerWidth <= 767 ? 'vecino' : 'admin';
    }
  }

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
