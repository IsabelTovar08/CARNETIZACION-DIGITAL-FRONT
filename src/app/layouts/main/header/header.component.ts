import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationStateService } from '../../../core/Services/navigation-state/navigation-state.service';
import { GenericNotificationComponent } from '../../../shared/components/generic-notification/generic-notification.component';
import { Router } from '@angular/router';

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

  @Input() tipoUsuario: string = '';
  @Input() isMobile: boolean = false;
  @Output() toggleMenu: EventEmitter<void> = new EventEmitter<void>();
  @Input() titulo: string = '';
  @Input() sidebarOpened: boolean = false;

  // Variables para las notificaciones
  showNotifications: boolean = false;
  notificationCount: number = 4; // Ejemplo: número de notificaciones

  @ViewChild('notificationTrigger') notificationTrigger!: ElementRef;

  constructor(private router: Router,private navState: NavigationStateService) { }

  ngOnInit(): void {
    this.navState.pathTitles$.subscribe(path => {
      this.breadcrumbPath = path;
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
}
