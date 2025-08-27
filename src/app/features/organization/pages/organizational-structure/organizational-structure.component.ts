import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardItem, GenericListCardsComponent } from '../../../../shared/components/components-cards/generic-list-cards/generic-list-cards.component';
import { CardVariant } from '../../../../shared/components/components-cards/generic-cards/generic-cards.component';

interface OrganizationalCard extends CardItem {
  route?: string;
}

@Component({
  selector: 'app-estructura-organizativa',
  imports: [CommonModule, GenericListCardsComponent],
  templateUrl: './organizational-structure.component.html',
  styleUrl: './organizational-structure.component.css'
})
export class EstructuraOrganizativaComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}

    onCardClick(card: OrganizationalCard): void {
      this.router.navigate([card.route], { relativeTo: this.route });
    }

  organizationalCards: OrganizationalCard[] = [

    {
      title: 'Sucursales',
      content: 'Administra las sucursales de tu organización',
      imageUrl: '/assets/organizaciones/surcursales.png',
      route: '/sucursales'
    },
    {
      title: 'Unidades Organizativas',
      content: 'Gestiona las unidades organizativas de tu organización',
      imageUrl: '/assets/organizaciones/unidadOrganizativa.png',
      route: '/unidades-organizativas'
    },
    {
      title: 'Divisiones Internas',
      content: 'Administra las divisiones de tu organización',
      imageUrl: '/assets/organizaciones/divisionesInternas.png',
      route: 'divisiones-internas'
    },
    {
      title: 'Perfiles',
      content: 'Define los perfiles de los empleados del sistema',
      imageUrl: '/assets/organizaciones/perfiles.png',
      route: 'perfiles'
    },
    {
      title: 'Jornadas',
      content: 'Configura las jornadas laborales de tu organización',
      imageUrl: '/assets/organizaciones/jornadas.png',
      route: 'jornadas'
    }
  ];

  onSectionClick(card: OrganizationalCard): void {
    if (card.route) {
      this.router.navigate([card.route], { relativeTo: this.route });
    }
  }
}
