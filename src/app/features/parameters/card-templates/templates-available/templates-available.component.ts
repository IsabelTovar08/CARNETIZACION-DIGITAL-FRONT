import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardItem, GenericListCardsComponent } from '../../../../shared/components/components-cards/generic-list-cards/generic-list-cards.component';

interface TemplateAvaleCard extends CardItem { 
  route?: string;
}

@Component({
  selector: 'app-templates-available',
  imports: [CommonModule, GenericListCardsComponent],
  templateUrl: './templates-available.component.html',
  styleUrl: './templates-available.component.css'
})
export class TemplatesAvailableComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}


  TemplateAvaleCards: TemplateAvaleCard[] = [

    {
      title: 'Diseño Corporativo A',
      content: 'Diseño elegante y minimalista',
      imageUrl: '/assets/tipos-carnet/administradorFrontal.png',
      route: '/sucursales'
    },
    {
      title: 'Diseño Corporativo B',
      content: 'Estilo contemporáneo y vibrante',
      imageUrl: '/assets/tipos-carnet/carnet1Frontal.png',
      route: '/unidades-organizativas'
    },
    {
      title: 'Diseño Corporativo C',
      content: 'Adaptable a cualquier evento',
      imageUrl: '/assets/tipos-carnet/carnet2Frontal.png',
      route: 'divisiones-internas'
    }
  ];

  onSectionClick(card: TemplateAvaleCard): void {
    if (card.route) {
      this.router.navigate([card.route], { relativeTo: this.route });
    }
  }
}
