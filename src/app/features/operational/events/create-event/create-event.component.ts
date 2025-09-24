import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

=======
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Modules
>>>>>>> c56a32e10b106e304da0a2263168acd074e7bc84
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

<<<<<<< HEAD
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { EventService } from '../../../../core/Services/api/event/event.service';
import {
  CreateEventRequest,
  SelectOption,
  AccessPointDto
} from '../../../../core/Models/operational/event.model';

=======
>>>>>>> c56a32e10b106e304da0a2263168acd074e7bc84
@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
<<<<<<< HEAD
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatSlideToggleModule, MatButtonModule, MatIconModule, MatRadioModule
=======

    // Angular Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule
>>>>>>> c56a32e10b106e304da0a2263168acd074e7bc84
  ],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
<<<<<<< HEAD
  eventForm!: FormGroup;
  showAddForm = false;

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
    { id: 1, name: 'Entrance' },
    { id: 2, name: 'Exit' },
    { id: 3, name: 'Both' }
  ];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private useservice: SnackbarService,
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      code: [''], // si lo dejas vacío, generaré uno
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

      // mini-form para agregar AP
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

  // --------- CARGAS ---------

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

  // --------- ACCESS POINTS UI ---------

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

  /** Agregar AP desde el mini-form (nuevo) */
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

    // limpiar mini-form y ocultar
    this.showAddForm = false;
    this.eventForm.patchValue({ apName: '', apDescription: '', apTypeId: null });
    this.useservice.showSuccess('Punto de acceso agregado');
  }

  /** Agregar AP tomando uno del catálogo (lo clona como NUEVO con id 0) */
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

    // genera code si no lo llenaron
    const code = (f.code && String(f.code).trim().length > 0) ? f.code : this.generateCode(8);

    return {
      event: {
        id: 0,
        name: f.name,
        code, // 👈 requerido por backend
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
        id: 0, // nuevo
        name: ap.name,
        description: ap.description,
        typeId: ap.typeId
        // eventId NO es necesario para crear
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
=======
  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      name: [''],
      description: [''],
      eventStart: [''],
      eventEnd: [''],
      multipleJourneys: [false],
      repeatEvent: [false],
      accessType: ['public'],
      profiles: [''],
      organizationalUnits: [''],
      divisions: ['']
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      console.log('✅ Event Data:', this.eventForm.value);
      
      // 🔧 TODO: Conectar con tu API aquí
      // Ejemplo de estructura para tu servicio:
      /*
      this.eventService.createEvent(this.eventForm.value).subscribe({
        next: (response) => {
          console.log('Evento creado exitosamente:', response);
          // Redirigir o mostrar mensaje de éxito
        },
        error: (error) => {
          console.error('Error al crear evento:', error);
          // Mostrar mensaje de error
        }
      });
      */
      
      // Simulación temporal - remover cuando conectes tu API
      alert('¡Formulario válido! Datos listos para enviar al API');
      
    } else {
      console.log('❌ Form is invalid');
      this.markFormGroupTouched();
      alert('Por favor, completa todos los campos requeridos');
    }
>>>>>>> c56a32e10b106e304da0a2263168acd074e7bc84
  }

  private markFormGroupTouched() {
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      control?.markAsTouched();
    });
  }

<<<<<<< HEAD
  private generateCode(len = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let out = '';
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
=======
  // 📝 Método para agregar puntos de acceso
  addAccessPoint() {
    console.log('➕ Adding new access point...');
    
    // 🔧 TODO: Implementar lógica para agregar puntos de acceso
    // Puedes abrir un modal, dialog o form inline
    /*
    const dialogRef = this.dialog.open(AddAccessPointDialog, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.accessPoints.push(result);
      }
    });
    */
    
    // Simulación temporal
    alert('Funcionalidad para agregar punto de acceso - Conectar con tu lógica');
  }

  // 🗑️ Método para eliminar puntos de acceso
  deleteAccessPoint(index: number) {
    console.log('🗑️ Deleting access point at index:', index);
    
    // 🔧 TODO: Implementar lógica para eliminar puntos de acceso
    // Confirmar con el usuario y remover del array
    /*
    if (confirm('¿Estás seguro de eliminar este punto de acceso?')) {
      this.accessPoints.splice(index, 1);
    }
    */
    
    // Simulación temporal
    if (confirm('¿Eliminar este punto de acceso?')) {
      alert(`Punto de acceso ${index + 1} eliminado`);
    }
>>>>>>> c56a32e10b106e304da0a2263168acd074e7bc84
  }
}