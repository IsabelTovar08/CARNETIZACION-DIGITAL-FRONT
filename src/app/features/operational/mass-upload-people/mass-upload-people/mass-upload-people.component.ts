import { Component, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
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

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDialog } from '@angular/material/dialog';
import { TargetPersonComponent } from '../../../security/people/components/target-person/target-person.component';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { CardsService } from '../../../../core/Services/api/card/cards.service';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from "@angular/material/paginator";

@Component({
  selector: 'app-mass-upload-people',
  imports: [
    CommonModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    GenericTableComponent,
    ConfigFormComponent,
    FileUploadComponent,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './mass-upload-people.component.html',
  styleUrl: './mass-upload-people.component.css'
})
export class MassUploadPeopleComponent {

  @ViewChild('loadingPortal') loadingPortal!: TemplateRef<any>;
  overlayRef!: OverlayRef;
  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private importBatchService: ImportBatchService,
    private templateService: ApiService<any, any>,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private cardConfigurationService: CardsService
  ) { }


  displayedColumns = [
    'fileName', 'source', 'startedByUserName', 'totalRows',
    'successCount', 'errorCount', 'startedAt', 'endedAt', 'actions'
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

  loadingStep = 0;
  intervalId: any;
  uploadType: 'masiva' | 'individual' = 'masiva';
  isConfigValid: boolean = false;
  existingConfigurations: any[] = [];

  showSelectExisting = false;
  persons: any[] = [];
  filteredPersons: any[] = [];
  personColumns: string[] = ['document', 'name', 'action'];

  pagedPersons: any[] = [];
  pageIndex = 0;
  pageSize = 5;


  loadingMessages = [
    { icon: 'upload', text: 'Subiendo archivo...' },
    { icon: 'inventory_2', text: 'Procesando datos...' },
    { icon: 'badge', text: 'Generando carnets...' },
    { icon: 'check_circle', text: 'Finalizando...' }
  ];

  ngOnInit(): void {
    this.getImportBatches();
  }

  private showLoading(): void {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'loading-overlay-backdrop',
      positionStrategy
    });

    const portal = new TemplatePortal(this.loadingPortal, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }


  private hideLoading(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
    clearInterval(this.intervalId);
  }

  uploadToBackend() {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Debes seleccionar un archivo', 'error');
      return;
    }

    this.showLoading();
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
        this.hideLoading();
        Swal.fire('Éxito', 'Carnets generados correctamente', 'success');
        this.getImportBatches();
      },
      error: (err) => {
        this.hideLoading();

        const msg = err?.error?.message || 'No se pudo procesar el archivo.';

        Swal.fire('Archivo inválido', msg, 'error');
      }
    });
  }

  onFileSelected(file: File) { this.selectedFile = file; }

  onConfigChanged(config: any) {
    this.configData = config;

    const isManualValid =
      !!config?.CardConfigurationName &&
      !!config?.CardTemplateId &&
      !!config?.ProfileId &&
      !!config?.InternalDivisionId &&
      !!config?.ValidFrom &&
      !!config?.ValidTo &&
      !!config?.SheduleId;

    const isPresetValid =
      !!config?.cardConfigurationId &&
      !!config?.SheduleId;

    this.isConfigValid = isManualValid || isPresetValid;

    console.log('CONFIG DATA:', this.configData);
    console.log('CONFIG VALID:', this.isConfigValid);
  }


  getImportBatches() {
    this.importBatchService.getAll().subscribe({
      next: (data) => this.records = data.data,
      error: (err) => console.error(err)
    });
  }


  verDetalles(item: any) {
    this.router.navigate([`dashboard/operational/import-batches/${item.id}/details`]);
  }

  openIndividualForm() {
    const dialogRef = this.dialog.open(TargetPersonComponent, {
      width: '800px',
      height: '90vh',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
      data:
      {
        createUser: true
      }
    });

    dialogRef.afterClosed().subscribe(personId => {
      if (!personId) return;

      this.createIndividualCard(personId);
    });
  }

  /**
   * Crea un carnet individual usando el ID de la persona recién creada.
   * Combina los datos seleccionados en el formulario principal.
   */
  createIndividualCard(personId: number): void {
    // 2️ Construir payload para crear el carnet individual
    var payload = this.buildPayload(personId)
    // servicio que guarda el carnet individual
    this.templateService.Crear('IssuedCard', payload).subscribe({
      next: (res) => {
        this.snackbarService.showSuccess('Carnet individual creado con éxito');
        this.getImportBatches();
      },
      error: (err) => {
        console.error(err);
        this.snackbarService.showError('Error al crear el carnet individual');
      }
    });
  }


  buildPayload(personId: number) {

    const c = this.configData;

    // 1. MODO PRESET (solo ID + schedule)
    if (c?.cardConfigurationId && c?.SheduleId) {
      return {
        personId: personId,
        cardId: c.cardConfigurationId,
        sheduleId: c.SheduleId,
        internalDivisionId: c.InternalDivisionId,
        isActive: true
      };
    }

    // 2. MODO MANUAL (todo explícito)
    return {
      personId: personId,
      cardName: c.CardConfigurationName,
      cardTemplateId: c.CardTemplateId,
      internalDivisionId: c.InternalDivisionId,
      profileId: c.ProfileId,
      validFrom: c.ValidFrom,
      validTo: c.ValidTo,
      sheduleId: c.SheduleId,
    };
  }



  toggleSelectExisting() {
    this.showSelectExisting = !this.showSelectExisting;

    if (this.showSelectExisting && this.persons.length === 0) {
      this.loadPersons();
    }
  }

  loadPersons() {
    this.templateService.ObtenerActivos('Person').subscribe({
      next: res => {
        this.persons = res.data;
        this.filteredPersons = [...this.persons];
        this.updatePagedData();   // <-- agregar
      },
      error: err => {
        console.error(err);
        this.snackbarService.showError('Error cargando personas');
      }
    });
  }

  searchPerson(event: any) {
    const value = event.target.value.toLowerCase().trim();

    this.filteredPersons = this.persons.filter(p =>
      p.firstName.toLowerCase().includes(value) ||
      p.lastName.toLowerCase().includes(value) ||
      p.documentNumber.toLowerCase().includes(value) ||
      (p.email ?? '').toLowerCase().includes(value)
    );

    this.pageIndex = 0;
    this.updatePagedData();   // <-- agregar
  }


  selectPerson(person: any) {
    this.showSelectExisting = false;

    this.snackbarService.showSuccess(
      `Persona seleccionada: ${person.firstName} ${person.lastName}`
    );

    this.createIndividualCard(person.id);
  }

  private updatePagedData() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedPersons = this.filteredPersons.slice(start, end);
  }
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedData();
  }


}
