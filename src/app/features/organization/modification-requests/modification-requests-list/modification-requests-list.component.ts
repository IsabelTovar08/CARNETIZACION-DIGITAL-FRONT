import { Component, TemplateRef, ViewChild } from '@angular/core';
import { GenericTableComponent } from "../../../../shared/components/generic-table/generic-table.component";
import { ModificationRequestDto } from '../../../../core/Models/organization/notifications-request.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modification-requests-list',
  imports: [GenericTableComponent, CommonModule],
  templateUrl: './modification-requests-list.component.html',
  styleUrl: './modification-requests-list.component.css'
})
export class ModificationRequestsListComponent {
 title = 'Solicitudes de Modificación';

  displayedColumns = ['personName', 'modificationType', 'requestDate', 'status', 'actions'];
  columns = [
    { key: 'personName', label: 'Nombre' },
    { key: 'modificationType', label: 'Tipo de Modificación' },
    { key: 'requestDate', label: 'Fecha' },
    { key: 'status', label: 'Estado' }
  ];

  requests: ModificationRequestDto[] = [
    { id: 1, personName: 'Sophia Clark', modificationType: 'Address Change', requestDate: new Date('2024-07-26'), status: 'Aprobado' },
    { id: 2, personName: 'Ethan Bennett', modificationType: 'Name Correction', requestDate: new Date('2024-07-25'), status: 'Aprobado' },
    { id: 3, personName: 'Olivia Carter', modificationType: 'Contact Update', requestDate: new Date('2024-07-24'), status: 'Rechazado' },
    { id: 4, personName: 'Liam Davis', modificationType: 'Photo Update', requestDate: new Date('2024-07-23'), status: 'Pendiente' },
    { id: 5, personName: 'Ava Evans', modificationType: 'Address Change', requestDate: new Date('2024-07-22'), status: 'Aprobado' }
  ];

  // templates personalizados
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  customTemplates: any = {};

  ngOnInit(): void {
    this.customTemplates = {
      status: this.statusTemplate,
      actions: this.actionsTemplate
    };
  }

  approve(item: ModificationRequestDto) {
    item.status = 'Aprobado';
    console.log(`Solicitud aprobada: ${item.id}`);
  }

  reject(item: ModificationRequestDto) {
    item.status = 'Rechazado';
    console.log(`Solicitud rechazada: ${item.id}`);
  }

}
