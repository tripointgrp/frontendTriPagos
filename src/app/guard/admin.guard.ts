import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminOnlyGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole();
  console.log(`Admin guard check: role = ${role}`);
  if (role !== 'admin') {
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};
