import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';


@Component({
  selector: 'app-header-seccion',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltip],
  templateUrl: './header-seccion.component.html',
  styleUrl: './header-seccion.component.css'
})
export class HeaderSeccionComponent {
  activeTab: string = 'profile';

  tabs = [
    { key: 'me', label: 'Perfil', route: '/dashboard/perfil/me' },
    { key: 'password', label: 'Contraseña', route: '/dashboard/perfil/password' }
  ];

  constructor(private router: Router) {
    // Detectar cambios de ruta para actualizar el tab activo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url.includes('profile')) {
        this.activeTab = 'profile';
      } else if (event.url.includes('password')) {
        this.activeTab = 'password';
      }
    });
  }

  selectTab(tabKey: string, route: string) {
    this.activeTab = tabKey;
    this.router.navigate([route]);
  }
}