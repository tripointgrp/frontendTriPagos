import {
  Injectable,
  NgZone,
  Inject,
  computed,
  signal,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type UserRole = 'admin' | 'user' | null;

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private role = signal<UserRole>(null);
  isAdmin = computed(() => this.role() === 'admin');

  private storageHandler = (ev: StorageEvent) => {
    if (ev.key === 'type') {
      this.zone.run(() => this.setRoleFromStorage());
    }
  };

  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Solo ejecuta lógica de browser
    if (this.isBrowser()) {
      this.setRoleFromStorage();
      window.addEventListener('storage', this.storageHandler);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser()) {
      window.removeEventListener('storage', this.storageHandler);
    }
  }

  /** Helper: estoy en navegador? */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /** Lee rol desde localStorage (seguro para SSR/tests) */
  setRoleFromStorage(): void {
    if (!this.isBrowser()) {
      this.role.set(null);
      return;
    }
    try {
      const type = (localStorage.getItem('type') || '').toLowerCase();
      this.role.set(
        type === 'admin' ? 'admin' : type === 'user' ? 'user' : null
      );
    } catch {
      this.role.set(null);
    }
  }

  /** Cambia rol y persiste (solo en browser) */
  setRole(role: UserRole): void {
    this.role.set(role);
    if (!this.isBrowser()) return;
    try {
      if (role) localStorage.setItem('type', role);
      else localStorage.removeItem('type');
    } catch {
      // ignora errores de quota/privacidad
    }
  }

  /** (opcional) para leer sin exponer el signal */
  getRole(): UserRole {
    return this.role();
  }
}
