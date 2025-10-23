import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../shared/components/generic-table/generic-table.component";
import { MatChipsModule } from "@angular/material/chips";
import { ImportBatchRowTable } from '../../../../core/Models/operational/import-banch.models';
import Swal from 'sweetalert2';
import { ImportBatchService } from '../../../../core/Services/import-banch/import-banch.service';
import { ActivatedRoute } from '@angular/router';
import { CdkNoDataRow } from "@angular/cdk/table";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details-people-import',
  imports: [GenericTableComponent, MatChipsModule, CdkNoDataRow, CommonModule],
  templateUrl: './details-people-import.component.html',
  styleUrl: './details-people-import.component.css'
})
export class DetailsPeopleImportComponent {
  constructor(
    private importBatchService: ImportBatchService,
    private route: ActivatedRoute
  ) { }

  displayedColumns: string[] = ['rowNumber', 'status', 'message'];

  // ✅ Configuración de columnas
  columns = [
    { key: 'rowNumber', label: 'Fila' },
    { key: 'status', label: 'Estado' },
    { key: 'message', label: 'Mensaje' }
  ];
  records: ImportBatchRowTable[] = [];
  importBatchId!: number;

  ngOnInit(): void {
    this.getImportBatchId();
    this.getImportBatchRows();
  }

  getImportBatchRows() {
    this.importBatchService.getRowsForTable(this.importBatchId).subscribe({
      next: (data) => {
        this.records = data.data;
        console.log('Filas cargadas:', this.records);
      },
      error: (err) => console.error('Error cargando filas:', err)
    });
  }

  getImportBatchId() {
    this.importBatchId = Number(this.route.snapshot.paramMap.get('id'));
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
