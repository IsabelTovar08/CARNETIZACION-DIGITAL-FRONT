import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDialog } from '@angular/material/dialog';

import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { EventService } from '../../../../core/Services/api/event/event.service';
import {
  CreateEventRequest,
  SelectOption,
  AccessPointDto
} from '../../../../core/Models/operational/event.model';
import { ScheduleCreate, ScheduleList } from '../../../../core/Models/organization/schedules.models';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { fromApiTime } from '../../../../core/utils/time-only';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { ApiService } from '../../../../core/Services/api/api.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    GenericTableComponent,
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
  listSchedule: ScheduleList[] = [];
  displayedColumns: string[] = ['name', 'startTime', 'endTime', 'isDeleted', 'actions'];

  accessPoints: AccessPointDto[] = [];

  profilesOptions: SelectOption[] = [];
  organizationalUnitOptions: SelectOption[] = [];
  internalDivisionOptions: SelectOption[] = [];
  eventTypeOptions: any[] = [];

  accessPointTypes = [
    { id: 1, name: 'Entrada' },
    { id: 2, name: 'Exit' },
    { id: 3, name: 'Mixto' }
  ];

  constructor(
    private apiService: ApiService<ScheduleCreate, ScheduleList>,
    private fb: FormBuilder,
    private eventService: EventService,
    private useservice: SnackbarService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.eventForm = this.fb.group({
       name: ['', Validators.required],
  code: [''],
  description: [''],


  eventStart: [''],
  eventEnd: [''],

  scheduleDate: ['', Validators.required],   
  scheduleTime: ['', Validators.required],    

  multipleJornadas: [false],
  repeatEvent: [false],

  scheduleId: [null, Validators.required],   
  eventTypeId: [null, Validators.required],
  accessType: ['public'],
  statusId: [1],

  // DÍAS del evento (lista)
  days: [[]],                                 

  // Audiencia
  profiles: [[]],
  organizationalUnits: [[]],
  divisions: [[]],
  branchId: [1],

  // Mini-form AP
  apName: [''],
  apDescription: [''],
  apTypeId: [null]
    });
  }

  ngOnInit(): void {
    this.cargarJornadas();
    this.cargarTiposEvento();
    this.loadAudienceOptions();
  }

  cargarJornadas(): void {
    this.apiService.ObtenerTodo('Schedule').subscribe({
      next: (res) => {
        this.listSchedule = res.data || [];
      },
      error: () => this.useservice.showError('Error al cargar jornadas')
    });
  }

  cargarTiposEvento(): void {
    this.apiService.ObtenerTodo('EventType').subscribe({
      next: (res) => {
        this.eventTypeOptions = res.data || [];
      },
      error: () => this.useservice.showError('Error al cargar tipos de evento')
    });
  }

  //   MODAL SIMPLE PARA CREAR JORNADA
  openModal(item?: ScheduleList): void {
    const listDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '450px',
      data: {
        title: item ? 'Editar Jornada' : 'Crear Jornada',
        item,
        fields: [
          {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            value: item?.name || '',
            required: true
          },
          {
            name: 'startTime',
            label: 'Hora inicio',
            type: 'time',
            value: fromApiTime(item?.startTime || ''),
            required: true
          },
          {
            name: 'endTime',
            label: 'Hora fin',
            type: 'time',
            value: fromApiTime(item?.endTime || ''),
            required: true
          },
          //Agregar los días como checkboxes individuales
          ...listDays.map(day => ({
            name: `day_${day}`,
            label: day,
            type: 'checkbox',
            value: item?.days?.includes(day) || false,
            checked: item?.days?.includes(day) || false
          }))
        ],
        replaceBaseFields: true
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //Extraer los días seleccionados
        const selectedDays = listDays.filter(day => result[`day_${day}`]);

        const scheduleData = {
          name: result.name,
          startTime: result.startTime,
          endTime: result.endTime,
          days: selectedDays
        };

        if (item) {
          this.actualizarJornada(scheduleData, item.id);
        } else {
          this.crearJornada(scheduleData);
        }
      }
    });
  }

  private toHms(time: string): string {
  // "08:00" -> "08:00:00"
  if (!time) return "00:00:00";
  return time.length === 5 ? time + ":00" : time;
}

  crearJornada(data: any): void {
    this.apiService.Crear('Schedule', data).subscribe({
      next: () => {
        this.cargarJornadas();
        this.useservice.showSuccess('Jornada creada con éxito');
      },
      error: (err) => this.useservice.showError('Error al crear la jornada')
    });
  }

  actualizarJornada(data: any, id: number): void {
    const scheduleData = { ...data, id };
    this.apiService.update('Schedule', scheduleData).subscribe({
      next: () => {
        this.cargarJornadas();
        this.useservice.showSuccess('Jornada actualizada con éxito');
      },
      error: () => this.useservice.showError('Error al actualizar la jornada')
    });
  }

  loadAudienceOptions(): void {
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

  openAddAccessPointDialog(): void {
    this.showAddForm = true;
    this.eventForm.patchValue({
      apName: '',
      apDescription: '',
      apTypeId: null
    });
  }

  cancelAddAccessPoint(): void {
    this.showAddForm = false;
    this.eventForm.patchValue({
      apName: '',
      apDescription: '',
      apTypeId: null
    });
  }

  addAccessPointManual(): void {
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
    this.showAddForm = false;
    this.eventForm.patchValue({ apName: '', apDescription: '', apTypeId: null });
    this.useservice.showSuccess('Punto de acceso agregado');
  }

  deleteAccessPoint(index: number): void {
    this.accessPoints.splice(index, 1);
    this.useservice.showSuccess('Punto de acceso eliminado');
  }

  getAccessPointTypeName(typeId: number): string {
    const type = this.accessPointTypes.find(t => t.id === typeId);
    return type?.name || `Tipo ${typeId}`;
  }

 private mapFormToDto(): CreateEventRequest {
  const f = this.eventForm.value;

  // combinar fecha y hora
  const combineDateTime = (date: any, time: string): string | null => {
    if (!date || !time) return null;
    const [h, m] = time.split(':').map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  return {
    event: {
      id: 0,
      name: f.name,
      code: (f.code && f.code.trim()) || this.generateCode(8),
      description: f.description || "",
      scheduleDate: f.scheduleDate ? new Date(f.scheduleDate).toISOString() : null,
      scheduleTime: combineDateTime(f.scheduleDate, f.scheduleTime),
      scheduleId: f.scheduleId, 
      eventTypeId: f.eventTypeId,
      Ispublic: f.accessType === 'public',
      statusId: 1,
      days: f.days && f.days.length > 0 ? f.days : undefined
    },
    accessPoints: this.accessPoints.map(ap => ({
      id: 0,
      name: ap.name,
      description: ap.description || "",
      eventId: 0,
      typeId: ap.typeId
    })),
    profileIds: f.profiles || [],
    organizationalUnitIds: f.organizationalUnits || [],
    internalDivisionIds: f.divisions || []
  };
}



  onSubmit(): void {
  if (!this.eventForm.valid) {
    this.markFormGroupTouched();

    if (!this.eventForm.get('name')?.value) {
      this.useservice.showError('El nombre del evento es obligatorio');
      return;
    }
    if (!this.eventForm.get('eventTypeId')?.value) {
      this.useservice.showError('Debes seleccionar un tipo de evento');
      return;
    }
    if (!this.eventForm.get('scheduleId')?.value) {
      this.useservice.showError('Debes seleccionar una jornada');
      return;
    }
    if (!this.eventForm.get('scheduleDate')?.value) {
      this.useservice.showError('Debes seleccionar una fecha de programación');
      return;
    }
    if (!this.eventForm.get('scheduleTime')?.value) {
      this.useservice.showError('Debes seleccionar una hora de programación');
      return;
    }
    return;
  }

  if (this.accessPoints.length === 0) {
    this.useservice.showError('Debes agregar al menos un Punto de Acceso');
    return;
  }

  const dto = this.mapFormToDto();
  console.log('DTO a enviar:', dto);

  this.eventService.createEvent(dto).subscribe({
    next: (res) => {
      this.useservice.showSuccess(res.message || 'Evento creado exitosamente');
      console.log('Nuevo evento:', res.data);
    },
    error: (err) => {
      this.useservice.showError(err?.error?.message || 'Error al crear evento');
      console.error('Error al crear evento:', err);
    }
  });
}


  private markFormGroupTouched(): void {
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