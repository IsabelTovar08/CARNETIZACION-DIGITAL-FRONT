import { computed, Injectable, signal } from '@angular/core';
import { UserMe } from '../../Models/security/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  // Estado global
  private _user = signal<UserMe | null>(null);

  // Lecturas públicas
  user = computed(() => this._user());
  isLoggedIn = computed(() => !!this._user());
  roles = computed(() => this._user()?.roles ?? []);
  permissions = computed(() => this._user()?.permissions ?? []);

  // Mutaciones
  setUser(u: UserMe | null) { this._user.set(u); }
  clear() { this._user.set(null); }

  updateUserPhoto(newPhotoUrl: string): void {
    const currentUser = this._user();
    if (currentUser) {
      this._user.set({ ...currentUser, photoUrl: newPhotoUrl });
    }
  }
}
