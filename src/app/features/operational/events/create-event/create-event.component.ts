import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { EventService } from '../../../../core/Services/api/event/event.service';
import {
  CreateEventRequest,
  SelectOption,
  AccessPointDto
} from '../../../../core/Models/operational/event.model';
import { MatButtonToggleModule } from "@angular/material/button-toggle";

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatSlideToggleModule, MatButtonModule, MatIconModule, MatRadioModule,
    MatButtonToggleModule
],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  eventForm!: FormGroup;
  showAddForm = false;

  toppingList = [
    { name: 'Extra cheese', description: 'Mozzarella rallada fresca' },
    { name: 'Mushroom', description: 'Hongos frescos laminados' },
    { name: 'Pepperoni', description: 'Rodajas finas de salami picante' }
  ];

  // Catálogo disponible por sucursal (para ayudar a elegir/replicar)
  availableAccessPoints: Array<{ id: number; name: string; typeId?: number; type?: string; description?: string }> = [];

  // Lista que REALMENTE se enviará para crear (nuevos APs)
  accessPoints: AccessPointDto[] = [];

  // catálogos de audiencias
  profilesOptions: SelectOption[] = [];
  organizationalUnitOptions: SelectOption[] = [];
  internalDivisionOptions: SelectOption[] = [];

  // Tipos de access point
  accessPointTypes = [
    { id: 1, name: 'Entrada' },
    { id: 2, name: 'Exit' },
    { id: 3, name: 'Mixto' }
  ];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private useservice: SnackbarService,
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      code: [''],
      description: [''],
      eventStart: [''],
      eventEnd: [''],
      scheduleDate: [''],
      scheduleTime: [''],
      multipleJornadas: [false],
      repeatEvent: [false],
      sheduleId: [1, Validators.required],
      eventTypeId: [1, Validators.required],
      accessType: ['public'],
      profiles: [[]],
      organizationalUnits: [[]],
      divisions: [[]],
      branchId: [1],

      // mini formularios para agregar los nuevos puntos de acceso
      apName: [''],
      apDescription: [''],
      apTypeId: [null]
    });
  }

  ngOnInit(): void {
    this.eventForm.get('branchId')?.valueChanges.subscribe(branchId => {
      if (branchId) {
        this.loadAccessPoints(branchId);
      }
    });

    this.loadAudienceOptions();
  }

  // CARGAS de los datos de perfil, unidad organizativa, divicion interna y puntos de acceso

  loadAudienceOptions() {
    this.eventService.getProfiles().subscribe({
      next: res => this.profilesOptions = res.data,
      error: () => this.useservice.showError('Error al cargar perfiles')
    });

    this.eventService.getOrganizationalUnits().subscribe({
      next: res => this.organizationalUnitOptions = res.data,
      error: () => this.useservice.showError('Error al cargar unidades organizativas')
    });

    this.eventService.getInternalDivisions().subscribe({
      next: res => this.internalDivisionOptions = res.data,
      error: () => this.useservice.showError('Error al cargar divisiones internas')
    });
  }

  loadAccessPoints(branchId: number) {
    this.eventService.getAccessPointsByBranch(branchId).subscribe({
      next: (res) => {
        // Esto es solo catálogo para elegir/replicar
        this.availableAccessPoints = res.data ?? [];
      },
      error: () => {
        this.useservice.showError('Error al cargar puntos de acceso');
      }
    });
  }

  //ACCESS POINTS

  openAddAccessPointDialog() {
    this.showAddForm = true;
    this.eventForm.patchValue({
      apName: '',
      apDescription: '',
      apTypeId: null
    });
  }

  cancelAddAccessPoint() {
    this.showAddForm = false;
    this.eventForm.patchValue({
      apName: '',
      apDescription: '',
      apTypeId: null
    });
  }

  /** Agregar ounto de acceso desde el mini-form */
  addAccessPointManual() {
    const name = (this.eventForm.get('apName')?.value || '').trim();
    const description = (this.eventForm.get('apDescription')?.value || '').trim();
    const typeId = this.eventForm.get('apTypeId')?.value;

    if (!name) {
      this.useservice.showInfo('Ingresa un nombre para el punto de acceso');
      return;
    }
    if (!typeId) {
      this.useservice.showInfo('Selecciona el tipo del punto de acceso');
      return;
    }

    const ap: AccessPointDto = {
      id: 0,
      name,
      description,
      typeId
    };

    this.accessPoints.push(ap);

    // limpiar mini formormulario y ocultar
    this.showAddForm = false;
    this.eventForm.patchValue({ apName: '', apDescription: '', apTypeId: null });
    this.useservice.showSuccess('Punto de acceso agregado');
  }

  /** Agregar un punto de acceso tomando uno del catálogo (lo clona como NUEVO con id 0) */
  addAccessPointFromAvailable(item: {id: number; name: string; typeId?: number; description?: string}) {
    const ap: AccessPointDto = {
      id: 0,
      name: item.name,
      description: item.description,
      typeId: item.typeId ?? 1 // fallback si no te retorna typeId
    };
    this.accessPoints.push(ap);
    this.useservice.showSuccess('Punto de acceso agregado desde catálogo');
  }

  deleteAccessPoint(index: number) {
    this.accessPoints.splice(index, 1);
    this.useservice.showSuccess('Punto de acceso eliminado');
  }

  getAccessPointTypeName(typeId: number): string {
    const type = this.accessPointTypes.find(t => t.id === typeId);
    return type?.name || `Tipo ${typeId}`;
  }

  // --------- SUBMIT ---------

  private mapFormToDto(): CreateEventRequest {
    const f = this.eventForm.value;

    // genera un codigo si no lo llenaron
    const code = (f.code && String(f.code).trim().length > 0) ? f.code : this.generateCode(8);

    return {
      event: {
        id: 0,
        name: f.name,
        code,
        description: f.description,
        eventStart: f.eventStart,
        eventEnd: f.eventEnd,
        statusId: 1,
        isPublic: f.accessType === 'public',
        scheduleDate: f.eventStart || f.scheduleDate || null,
        scheduleTime: f.eventStart || f.scheduleTime || null,
        sheduleId: f.sheduleId || 1,
        eventTypeId: f.eventTypeId || 1
      },

      // 👇 ahora enviamos objetos, NO IDs
      accessPoints: this.accessPoints.map(ap => ({
        id: 0,
        name: ap.name,
        description: ap.description,
        typeId: ap.typeId
        // eventId NO es necesario
      })),

      profileIds: f.profiles || [],
      organizationalUnitIds: f.organizationalUnits || [],
      internalDivisionIds: f.divisions || []
    };
  }

  onSubmit() {
    if (!this.eventForm.valid) {
      this.markFormGroupTouched();
      this.useservice.showError('Por favor completa todos los campos requeridos');
      return;
    }

    const dto = this.mapFormToDto();

    this.eventService.createEvent(dto).subscribe({
      next: (res) => {
        this.useservice.showSuccess(res.message || 'Evento creado exitosamente');
        console.log('Nuevo evento:', res.data);
      },
      error: (err) => {
        console.error('Error al crear evento:', err);
        this.useservice.showError(err?.error?.message || 'Error al crear evento (400). Revisa el shape del JSON.');
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      control?.markAsTouched();
    });
  }

  private generateCode(len = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let out = '';
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }
}
