import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  imports: [CommonModule,GenericCardsComponent],
  templateUrl: './organizational-structure.component.html',
  styleUrl: './organizational-structure.component.css'
})
export class EstructuraOrganizativaComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}

    onCardClick(card: OrganizationalCard): void {
      this.router.navigate([card.route], { relativeTo: this.route });
    }

  organizationalCards: OrganizationalCard[] = [
    { id: 'sucursales',              title: 'Sucursales',             description: 'Administra las sucursales de tu organización', imageUrl: '/assets/organizaciones/surcursales.png',        route: 'branch' },
    { id: 'unidades-organizativas',  title: 'Unidades Organizativas', description: 'Gestiona las unidades organizativas de tu organización', imageUrl: '/assets/organizaciones/unidadOrganizativa.png', route: '/dashboard/organizational/structure/unit' },
    { id: 'divisiones-internas',     title: 'Divisiones Internas',    description: 'Administra las divisiones de tu organización', imageUrl: '/assets/organizaciones/divisionesInternas.png', route: 'internal-division' },
    { id: 'perfiles',                title: 'Perfiles',                description: 'Define los perfiles de los empleados del sistema', imageUrl: '/assets/organizaciones/perfiles.png',            route: 'perfiles' },
    { id: 'jornadas',                title: 'Jornadas',                description: 'Configura las jornadas laborales de tu organización', imageUrl: '/assets/organizaciones/jornadas.png',            route: 'jornadas' }

  ];


}
