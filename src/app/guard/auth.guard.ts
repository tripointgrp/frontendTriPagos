import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const userOnlyGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole(); // 'admin' | 'user' | null
  console.log('userOnlyGuard - role:', role);
  if (role === 'admin') {
    // si es admin, no debe ver páginas de usuario
    return router.parseUrl('/admin-dashboard');
  }

  if (role === null || role === undefined) {
    // sin rol -> a login
    return router.parseUrl('/login');
  }

  // user normal -> permitir
  return true;
};
