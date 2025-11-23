import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericListCardComponent } from '../../../../shared/components/generic-list-card/generic-list-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTemplateComponent } from '../create-template/create-template.component';
import Swal from 'sweetalert2';

interface TemplateAvaleCard {
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  route?: string;
}

@Component({
  selector: 'app-templates-available',
  imports: [CommonModule, GenericListCardComponent, MatButtonModule],
  templateUrl: './templates-available.component.html',
  styleUrl: './templates-available.component.css'
})
export class TemplatesAvailableComponent {
  constructor(private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {}

  openCreateTemplateModal(): void {
    const dialogRef = this.dialog.open(CreateTemplateComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Plantilla creada:', result);
        // Aquí puedes agregar lógica para actualizar la lista de plantillas
      }
    });
  }


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

  showTemplateSummary(template: TemplateAvaleCard): void {
    Swal.fire({
      title: template.title,
      html: `
        <div style="text-align: left; line-height: 1.6; border-radius: 8px;">
          <p style="margin-bottom: 16px; font-size: 16px;">${template.content}</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #a855f7;">
            <h4 style="margin: 0 0 8px 0; color: #a855f7;">Características del diseño:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Colores vibrantes y modernos</li>
              <li>Tipografía clara y legible</li>
              <li>Elementos visuales atractivos</li>
              <li>Diseño profesional para carnets corporativos</li>
            </ul>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#a855f7',
      width: '600px',
      customClass: {
        popup: 'template-summary-modal'
      }
    });
  }
}
