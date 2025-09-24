import { Component } from '@angular/core';
import { MatChipsModule } from "@angular/material/chips";
import { GenericTableComponent } from "../../../../shared/components/generic-table/generic-table.component";
import { ConfigFormComponent } from "../config-form/config-form.component";
import { FileUploadComponent } from "../file-upload/file-upload.component";
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { ImportBatchService } from '../../../../core/Services/import-banch/import-banch.service';
import { ImportBatchRowTable } from '../../../../core/Models/operational/import-banch.models';

@Component({
  selector: 'app-mass-upload-people',
  imports: [MatChipsModule, GenericTableComponent, ConfigFormComponent, FileUploadComponent, MatButtonModule],
  templateUrl: './mass-upload-people.component.html',
  styleUrl: './mass-upload-people.component.css'
})
export class MassUploadPeopleComponent {
 displayedColumns = ['photo', 'name', 'org', 'division', 'state', 'actions'];

  columns = [
    { key: 'photo', label: 'Foto' },
    { key: 'name', label: 'Nombre' },
    { key: 'org', label: 'Unidad Organizativa' },
    { key: 'division', label: 'División Interna' },
    { key: 'state', label: 'Estado' }
  ];

  records: ImportBatchRowTable[] = [];

  constructor(private importBatchService: ImportBatchService) {}

  ngOnInit(): void {
  this.importBatchService.getRowsForTable(2).subscribe({
    next: (data) => {
      this.records = data.data;
      console.log('Filas cargadas:', this.records);
    },
    error: (err) => console.error('Error cargando filas:', err)
  });
}


  onEdit(item: ImportBatchRowTable) {
    console.log('Editar:', item);
  }

  onDelete(item: ImportBatchRowTable) {
    console.log('Eliminar:', item);
  }

  onToggleStatus(item: ImportBatchRowTable) {
    console.log('Toggle status:', item);
  }

  viewCard(item: ImportBatchRowTable) {
    Swal.fire({
      title: `${item.name}`,
      html: `
        <div style="display:flex; flex-direction:column; align-items:center;">
          <img src="${item.photo ?? '/assets/default-avatar.png'}"
               style="border-radius:50%; width:80px; height:80px; margin-bottom:10px;" />
          <p><strong>Unidad:</strong> ${item.org}</p>
          <p><strong>División:</strong> ${item.division}</p>
          <p><strong>Estado:</strong> ${item.state}</p>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      width: 400
    });
  }
}
