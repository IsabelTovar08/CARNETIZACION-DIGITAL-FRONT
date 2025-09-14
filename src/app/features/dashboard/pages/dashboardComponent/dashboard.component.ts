import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NavigationEnd, Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { menuAdmin } from '../../../../core/Menu-config/menu-admin';
import { MenuItem } from '../../../../core/Models/MenuItemModel';
import { HeaderComponent } from '../../../../layouts/main/header/header.component';
import { SidebarComponent } from '../../../../layouts/main/sidebar/sidebar.component';
import { NavigationStateService } from '../../../../core/Services/navigation-state/navigation-state.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatDividerModule,
    MatSidenavModule, MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatRippleModule,
    MatTooltipModule,
    MatDividerModule,
    SidebarComponent,
    RouterModule,
    CommonModule,
    HeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true
})
export class DashboardComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  menuItems: MenuItem[] = [];
  tipoUsuario: 'admin' | 'doctor' | 'paciente' = 'admin';
  sidebarOpened = true;
  isMobile = false;
  ocultarHeader: boolean = false;
  @Output() toggleMenu = new EventEmitter<void>();

  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private navState: NavigationStateService
  ) { }

  // Ciclo de vida
  ngOnInit(): void {
    this.menuItems = menuAdmin;
    this.checkScreenSize();

    // Escuchar eventos de navegación para actualizar el breadcrumb
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updatePathTitles(event.urlAfterRedirects);
      });

    // Ejecutar al iniciar (por si ya hay una ruta activa)
    this.updatePathTitles(this.router.url);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Evento emitido por <mat-drawer> cuando cambia su estado
  onDrawerOpenedChange(opened: boolean) {
    if (this.isMobile) {
      this.sidebarOpened = opened;
      this.ocultarHeader = opened;
    }
  }

  // Escucha cambios de tamaño de pantalla
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  // Ajusta flags y estado del drawer según el tamaño de pantalla
  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;

    if (this.drawer) {
      if (this.isMobile) {
        this.drawer.close();
        this.sidebarOpened = false;
        this.ocultarHeader = false;
      } else {
        this.drawer.open();
        this.sidebarOpened = true;
        this.ocultarHeader = false; // ⚠️ Nunca ocultar el header en escritorio
      }
    }
  }

  // toggleSidebar() es llamado desde el header (botón de menú)
  toggleSidebar(): void {
    if (this.isMobile) {
      // En móvil: abrir/cerrar y ocultar header
      this.sidebarOpened = !this.sidebarOpened;
      this.ocultarHeader = this.sidebarOpened;

      if (this.sidebarOpened) {
        this.drawer.open();
      } else {
        this.drawer.close();
      }
    } else {
      // En escritorio: solo hacer toggle del drawer y sincronizar el estado
      this.drawer.toggle().then(() => {
        this.sidebarOpened = this.drawer.opened;
      });
    }
  }

  // Actualiza el breadcrumb según la URL actual
  private updatePathTitles(currentUrl: string): void {
    const path = this.findPathTitles(this.menuItems, currentUrl);
    if (path) {
      this.navState.setPathTitles(path);
    }
  }

  // Busca el breadcrumb navegando por los items del menú
  private findPathTitles(menu: MenuItem[], targetUrl: string, path: string[] = []): string[] | null {
    for (const item of menu) {
      const currentPath = [...path, item.title];
      const normalizedUrl = targetUrl.startsWith('/') ? targetUrl : '/' + targetUrl;

      if (item.url) {
        const normalizedItemUrl = item.url.startsWith('/') ? item.url : '/' + item.url;
        if (normalizedUrl.endsWith(normalizedItemUrl)) {
          return currentPath;
        }
      }

      if (item.children) {
        const found = this.findPathTitles(item.children, targetUrl, currentPath);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  // Método para cerrar sidebar desde el backdrop (opcional)
  closeSidebar() {
    if (this.isMobile) {
      this.drawer.close();
    }
  }

  onBackdropClick() {
    if (this.isMobile && this.sidebarOpened) {
      this.toggleSidebar();
    }
  }
}
