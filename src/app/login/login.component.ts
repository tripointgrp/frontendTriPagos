import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  selectedTab: 'admin' | 'vecino' = window.innerWidth <= 767 ? 'vecino' : 'admin';

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
    password: ''
  };

  vecino = {
    codigo: ''
  };

  constructor(private router: Router) {}


  login() {
    if (this.selectedTab === 'admin') {
      console.log('Login admin:', this.admin);
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home']);
      console.log('Login vecino:', this.vecino);
    }
  }
}
