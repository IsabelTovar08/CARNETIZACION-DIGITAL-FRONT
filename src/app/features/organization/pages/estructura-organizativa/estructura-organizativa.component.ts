import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GenericCardsComponent } from '../../../../shared/components/generic-cards/generic-cards.component';

interface OrganizationalCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  route: string;
}
@Component({
  selector: 'app-estructura-organizativa',
  imports: [CommonModule, GenericCardsComponent],
  templateUrl: './estructura-organizativa.component.html',
  styleUrl: './estructura-organizativa.component.css'
})
export class EstructuraOrganizativaComponent {
  organizationalCards: OrganizationalCard[] = [

    {
      id: 'sucursales',
      title: 'Sucursales',
      description: 'Administra las sucursales de tu organización',
      imageUrl: '/assets/organizaciones/surcursales.png', // Ajusta la ruta de tu imagen
      route: '/dashboard/estructura-organizativa/sucursales' // Ajusta la ruta según tu routing
    },
    {
      id: 'unidades-organizativas',
      title: 'Unidades Organizativas',
      description: 'Gestiona las unidades organizativas de tu organización',
      imageUrl: '/assets/organizaciones/unidadOrganizativa.png', // Ajusta la ruta de tu imagen
      route: '/dashboard/estructura-organizativa/unidades-organizativas' // Ajusta la ruta según tu routing
    },
    {
      id: 'divisiones-internas',
      title: 'Divisiones Internas',
      description: 'Administra las divisiones de tu organización',
      imageUrl: '/assets/organizaciones/divisionesInternas.png', // Ajusta la ruta de tu imagen
      route: '/dashboard/estructura-organizativa/divisiones-internas' // Ajusta la ruta según tu routing
    },
    {
      id: 'perfiles',
      title: 'Perfiles',
      description: 'Define los perfiles de los empleados del sistema',
      imageUrl: '/assets/organizaciones/perfiles.png', // Ajusta la ruta de tu imagen
      route: './organization.routes.ts/PerfilesComponent' // Ajusta la ruta según tu routing
    },
    {
      id: 'jornadas',
      title: 'Jornadas',
      description: 'Configura las jornadas laborales de tu organización',
      imageUrl: '/assets/organizaciones/jornadas.png', // Ajusta la ruta de tu imagen
      route: './organization.routes.ts/JornadasComponent' // Ajusta la ruta según tu routing
    }
  ];

  constructor(private router: Router) {}

  onCardClick(card: OrganizationalCard): void {
    this.router.navigate([card.route]);
  }
}
