import { PersonService } from './../../../core/Services/api/person/person.service';
import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { UserStoreService } from '../../../core/Services/auth/user-store.service';
import { UserMe } from '../../../core/Models/security/user.models';
import { SnackbarService } from '../../../core/Services/snackbar/snackbar.service';


@Component({
  selector: 'app-header-seccion',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltip],
  templateUrl: './header-seccion.component.html',
  styleUrl: './header-seccion.component.css'
})
export class HeaderSeccionComponent implements OnInit {
  activeTab: string = 'profile';

  profileImage: string = '/assets/default-avatar.png';
  tempImage: string | null | undefined = null;
  selectedFile: File | null = null;
  isEditing: boolean = false;

  user!: Signal<UserMe | null>;
  isLoggedIn!: Signal<boolean>;

  tabs = [
    { key: 'me', label: 'Perfil', route: '/dashboard/perfil/me' },
    { key: 'organizational', label: 'Organizacional', route: '/dashboard/perfil/organizational' }
  ];

  constructor(
    private router: Router,
    private store: UserStoreService,
    private PersonService: PersonService,
    private snackbarService: SnackbarService

  ) {
    // Detectar cambios de ruta para actualizar el tab activo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url.includes('/perfil/me')) {
        this.activeTab = 'me';
      } else if (event.url.includes('/perfil/organizational')) {
        this.activeTab = 'organizational';
      }
    });
  }
  ngOnInit(): void {
    this.user = this.store.user;
    this.isLoggedIn = this.store.isLoggedIn;
    this.updateProfileImage();
  }

  private updateProfileImage(): void {
    // Siempre usar la imagen del usuario si existe, sino usar la predeterminada
    this.profileImage = this.user()?.photoUrl || '/assets/default-avatar.png';
  }

  selectTab(tabKey: string, route: string) {
    this.activeTab = tabKey;
    this.router.navigate([route]);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempImage = e.target.result;  // preview temporal en base64
        this.isEditing = true;
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveImage(): void {
    if (this.selectedFile) {
      this.PersonService.SavePhoto(this.selectedFile).subscribe({
        next: (response) => {

          this.store.updateUserPhoto(this.tempImage!);
          // Actualizar la imagen de perfil localmente
          this.updateProfileImage();

          this.snackbarService.showSuccess('Imagen actualizada con éxito');
          this.tempImage = null;
          this.selectedFile = null;
          this.isEditing = false;
        },
        error: (err) => {
          console.error("Error subiendo la imagen", err);
          this.snackbarService.showError('Ocurrió un error al subir la imagen');
        }
      });
    }
  }

  cancelEdit(): void {
    this.tempImage = null;
    this.selectedFile = null;
    this.isEditing = false;
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    // Si la imagen falla al cargar, usar la imagen predeterminada
    if (imgElement.src !== '/assets/default-avatar.png') {
      imgElement.src = '/assets/default-avatar.png';
    }
  }

}
