import { Component } from '@angular/core';
import { MatChipsModule } from "@angular/material/chips";
import { GenericTableComponent } from "../../../../shared/components/generic-table/generic-table.component";
import { ConfigFormComponent } from "../config-form/config-form.component";
import { FileUploadComponent } from "../file-upload/file-upload.component";
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { ImportBatchService } from '../../../../core/Services/import-banch/import-banch.service';
import { ImportBatch, ImportBatchRowTable } from '../../../../core/Models/operational/import-banch.models';
import { ApiService } from '../../../../core/Services/api/api.service';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mass-upload-people',
  imports: [MatChipsModule,
    CommonModule,
    GenericTableComponent, ConfigFormComponent, FileUploadComponent, MatButtonModule, MatIconModule],
  templateUrl: './mass-upload-people.component.html',
  styleUrl: './mass-upload-people.component.css'
})
export class MassUploadPeopleComponent {
  constructor(private importBatchService: ImportBatchService,
    private templateService: ApiService<any, any>,
    private router: Router
  ) { }

  displayedColumns = [
    'fileName',
    'source',
    'startedByUserName',
    'totalRows',
    'successCount',
    'errorCount',
    'startedAt',
    'endedAt',
    'actions'
  ];

  columns = [
    { key: 'fileName', label: 'Archivo' },
    { key: 'source', label: 'Origen' },
    { key: 'startedByUserName', label: 'Iniciado por' },
    { key: 'totalRows', label: 'Total Filas' },
    { key: 'successCount', label: 'Correctos' },
    { key: 'errorCount', label: 'Errores' },
    { key: 'startedAt', label: 'Inicio' },
    { key: 'endedAt', label: 'Fin' }
  ];

  records: ImportBatch[] = [];
  configData: any = {};
  selectedFile: File | null = null;
  loading = false;
  loadingStep = 0;
  loadingMessages = [
    { icon: 'upload', text: 'Subiendo archivo...' },
    { icon: 'inventory_2', text: 'Procesando datos...' },
    { icon: 'badge', text: 'Generando carnets...' },
    { icon: 'check_circle', text: 'Finalizando...' }
  ];
  intervalId: any;

  ngOnInit(): void {
    this.getImportBatches();
  }

  getImportBatches() {
    this.importBatchService.getAll().subscribe({
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

  // viewCard(item: ImportBatchRowTable) {
  //   Swal.fire({
  //     title: `${item.name}`,
  //     html: `
  //       <div style="display:flex; flex-direction:column; align-items:center;">
  //         <img src="${item.photo ?? '/assets/default-avatar.png'}"
  //              style="border-radius:50%; width:80px; height:80px; margin-bottom:10px;" />
  //         <p><strong>Unidad:</strong> ${item.org}</p>
  //         <p><strong>División:</strong> ${item.division}</p>
  //         <p><strong>Estado:</strong> ${item.state}</p>
  //       </div>
  //     `,
  //     confirmButtonText: 'Cerrar',
  //     width: 400
  //   });
  // }


  onConfigChanged(config: any) {
    this.configData = config;
  }

  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  uploadToBackend() {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Debes seleccionar un archivo', 'error');
      return;
    }

    this.loading = true;
    this.loadingStep = 0;

    this.intervalId = setInterval(() => {
      this.loadingStep = (this.loadingStep + 1) % this.loadingMessages.length;
    }, 2000);

    const formData = new FormData();
    Object.entries(this.configData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });
    formData.append('file', this.selectedFile);

    this.templateService.uploadImport(formData).subscribe({
      next: () => {
        this.stopLoading();
        Swal.fire('Éxito', 'Carnets generados correctamente', 'success');
        this.getImportBatches();
      },
      error: () => {
        this.stopLoading();
        Swal.fire('Error', 'No se pudo generar carnets', 'error');
      }
    });
  }

  stopLoading() {
    this.loading = false;
    clearInterval(this.intervalId);
  }

  verDetalles(item: any) {
    console.log('Ver detalles de lote:', item);
    this.router.navigate([`dashboard/operational/import-batches/${item.id}/details`]);
  }

}
