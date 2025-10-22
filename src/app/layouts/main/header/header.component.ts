import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationStateService } from '../../../core/Services/navigation-state/navigation-state.service';
import { GenericNotificationComponent } from '../../../shared/components/generic-notification/generic-notification.component';
import { Router } from '@angular/router';
import { UserStoreService } from '../../../core/Services/auth/user-store.service';
import { UserMe } from '../../../core/Models/security/user.models';
import Swal from 'sweetalert2';
import { TokenService } from '../../../core/Services/token/token.service';
import { NotificationWService } from '../../../core/Services/WebSocket/Notification/notification.service';
import { SnackbarService } from '../../../core/Services/snackbar/snackbar.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatIconModule, MatButtonModule, GenericNotificationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  breadcrumbPath: string[] = [];
  moduleName: string = '';
  submoduleName: string = '';

  user!: Signal<UserMe | null>;
  isLoggedIn!: Signal<boolean>;

  @Input() tipoUsuario: string = '';
  @Input() isMobile: boolean = false;
  @Output() toggleMenu: EventEmitter<void> = new EventEmitter<void>();
  @Input() titulo: string = '';
  @Input() sidebarOpened: boolean = false;

  // Variables para las notificaciones
  showNotifications: boolean = false;
  unreadNotifications: number = 0;

  @ViewChild('notificationTrigger') notificationTrigger!: ElementRef;

  constructor(
    private router: Router,
    private navState: NavigationStateService,
    private store: UserStoreService,
    private authService: TokenService,
    private notificaionWService: NotificationWService,
    private snackbarService: SnackbarService
  ) { }



  ngOnInit(): void {
    this.navState.pathTitles$.subscribe(path => {
      this.breadcrumbPath = path;
      this.user = this.store.user;
      this.isLoggedIn = this.store.isLoggedIn;
      console.log(this.user());
    });

    this.notificaionWService.connect();
    this.notificaionWService.onNotifications()
      .subscribe(n => {
        // this.notifications.push(n);
      });
    // Escuchar cambios de cantidad
    this.notificaionWService.onUnreadCount().subscribe(count => {
      this.unreadNotifications = count;
    });
  }



  onToggleMenu() {
    this.toggleMenu.emit();
  }

  // Métodos para manejar las notificaciones
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;

    // Prevenir scroll del body cuando el modal está abierto
    if (this.showNotifications) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  goToProfile() {
    this.router.navigate(['/dashboard/perfil/me']);
  }

  closeNotifications() {
    this.showNotifications = false;
    document.body.style.overflow = 'auto';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Comentado para usar overlay en su lugar
    // if (this.showNotifications && this.notificationTrigger &&
    //     !this.notificationTrigger.nativeElement.contains(event.target)) {
    //   this.closeNotifications();
    // }
  }

  // Cerrar con tecla Escape
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.showNotifications) {
      this.closeNotifications();
    }
  }

  onLogout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tu sesión se cerrará y deberás iniciar de nuevo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout(); // 👉 lógica de cerrar sesión
        Swal.fire('Sesión cerrada', 'Has salido correctamente.', 'success');
      }
    });
  }


  onUnreadCountChange(count: number): void {
    this.unreadNotifications = count;
    console.log('🔔 Cantidad actual de no leídas:', count);
  }
}
