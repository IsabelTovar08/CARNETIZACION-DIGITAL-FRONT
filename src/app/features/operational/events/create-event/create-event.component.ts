import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
import { ApiService } from '../../../../core/Services/api/api.service';

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
  isEdit = false;
  editingEventId: number | null = null;
  listSchedule: ScheduleList[] = [];
  displayedColumns: string[] = ['name', 'startTime', 'endTime', 'isDeleted', 'actions'];

  accessPoints: AccessPointDto[] = [];

  profilesOptions: SelectOption[] = [];
  organizationalUnitOptions: SelectOption[] = [];
  internalDivisionOptions: SelectOption[] = [];
  eventTypeOptions: any[] = [];

  // Progress tracking
  progressPercentage = 0;
  currentStep = 1;

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

      scheduleDate: ['', Validators.required],
      scheduleTime: ['', Validators.required],
      endDate: [''],

      scheduleId: [null, Validators.required],
      eventTypeId: [null, Validators.required],
      accessType: ['public'],
      statusId: [1],

      // Audiencia
      profiles: this.fb.control({ value: [], disabled: true }),
      organizationalUnits: this.fb.control({ value: [], disabled: true }),
      divisions: this.fb.control({ value: [], disabled: true }),

      // Mini-form AP
      apName: [''],
      apDescription: [''],
      apTypeId: [null]
    }, { validators: this.dateRangeValidator });

  }

  ngOnInit(): void {
    this.cargarJornadas();
    this.cargarTiposEvento();
    this.loadAudienceOptions();

    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.editingEventId = +params['id'];
        this.loadEvent(this.editingEventId);
      }
    });

    // Initialize progress tracking
    this.eventForm.valueChanges.subscribe(() => {
      this.updateProgress();
    });

    // Handle filter controls based on access type
    this.eventForm.get('accessType')?.valueChanges.subscribe(() => {
      this.updateFilterControls();
    });
    this.updateFilterControls(); // Initial call
  }

  private updateFilterControls(): void {
    const isPrivate = this.eventForm.get('accessType')?.value === 'private';
    if (isPrivate) {
      this.eventForm.get('profiles')?.enable();
      this.eventForm.get('organizationalUnits')?.enable();
      this.eventForm.get('divisions')?.enable();
    } else {
      this.eventForm.get('profiles')?.disable();
      this.eventForm.get('organizationalUnits')?.disable();
      this.eventForm.get('divisions')?.disable();
    }
  }

  private loadEvent(id: number): void {
    this.eventService.getEventDetails(id).subscribe({
      next: (res: any) => {
        const event = res.data;
        this.eventForm.patchValue({
          name: event.name,
          code: event.code,
          description: event.description,
          scheduleDate: new Date(event.scheduleDate),
          scheduleTime: event.scheduleTime ? new Date(event.scheduleTime).toTimeString().substring(0, 5) : '',
          endDate: event.endDate ? new Date(event.endDate) : '',
          scheduleId: event.scheduleId,
          eventTypeId: event.eventTypeId,
          accessType: event.ispublic ? 'public' : 'private',
          profiles: event.profileIds || [],
          organizationalUnits: event.organizationalUnitIds || [],
          divisions: event.internalDivisionIds || []
        });
        // After patching, update filter controls
        this.updateFilterControls();
        // Load access points if any
        if (event.accessPoints) {
          this.accessPoints = event.accessPoints.map((ap: any) => ({ id: ap.id, name: ap.name, description: ap.description, typeId: ap.typeId }));
        }
      },
      error: () => this.useservice.showError('Error al cargar evento')
    });
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

    return {
      event: {
        id: 0,
        name: f.name,
        code: (f.code && f.code.trim()) || this.generateCode(8),
        description: f.description || "",
        scheduleDate: f.scheduleDate ? new Date(f.scheduleDate).toISOString() : null,
        scheduleTime: f.scheduleTime
          ? new Date(`1970-01-01T${f.scheduleTime}:00Z`).toISOString()
          : null,
        scheduleId: f.scheduleId,
        eventTypeId: f.eventTypeId,
        ispublic: f.accessType === 'public',
        statusId: 1,
        accessPoints: this.accessPoints.map(ap => ap.id),
        profileIds: f.profiles || [],
        organizationalUnitIds: f.organizationalUnits || [],
        internalDivisionIds: f.divisions || []
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
      if (!this.eventForm.get('endDate')?.value) {
        this.useservice.showError('Debes seleccionar una fecha de finalización');
        return;
      }

      if (!this.eventForm.get('scheduleTime')?.value) {
        this.useservice.showError('Debes seleccionar una hora de programación');
        return;
      }


      // Validar que la fecha de fin sea posterior a la fecha de inicio
      if (this.eventForm.hasError('dateRangeInvalid')) {
        this.useservice.showError('La fecha de finalización debe ser posterior o igual a la fecha de inicio');
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

    if (this.isEdit && this.editingEventId) {
      // 🔹 Armamos el objeto plano (EventDtoRequest)
      const updateDto = {
        id: this.editingEventId,
        name: dto.event.name,
        code: dto.event.code,
        description: dto.event.description,
        scheduleDate: dto.event.scheduleDate,
        scheduleTime: dto.event.scheduleTime,
        scheduleId: dto.event.scheduleId,
        eventTypeId: dto.event.eventTypeId,
        ispublic: dto.event.ispublic,
        statusId: dto.event.statusId,
        accessPoints: this.accessPoints.map(ap => ap.id),
        profileIds: dto.profileIds,
        organizationalUnitIds: dto.organizationalUnitIds,
        internalDivisionIds: dto.internalDivisionIds
      };

      this.eventService.updateEvent(updateDto).subscribe({
        next: (res) => {
          this.useservice.showSuccess(res.message || 'Evento actualizado exitosamente');
          console.log('Evento actualizado:', res.data);
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err) => {
          this.useservice.showError(err?.error?.message || 'Error al actualizar evento');
          console.error('Error al actualizar evento:', err);
        }
      });
    } else {
      this.eventService.createEvent(dto).subscribe({
        next: (res) => {
          this.useservice.showSuccess(res.message || 'Evento creado exitosamente');
          console.log('Nuevo evento:', res.data);
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err) => {
          this.useservice.showError(err?.error?.message || 'Error al crear evento');
          console.error('Error al crear evento:', err);
        }
      });
    }
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

  // Validador personalizado para rango de fechas
  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('scheduleDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Normalizar las fechas para comparar solo día, mes y año
      const startNormalized = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endNormalized = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      if (endNormalized < startNormalized) {
        return { dateRangeInvalid: true };
      }
    }

    return null;
  }

  // Progress tracking methods
  updateProgress(): void {
    const form = this.eventForm;
    let completedFields = 0;
    const totalFields = 12; // Total number of fields to track

    // Basic info (Step 1)
    if (form.get('name')?.value) completedFields++;
    if (form.get('description')?.value) completedFields++;
    if (form.get('eventTypeId')?.value) completedFields++;

    // Dates (Step 2)
    if (form.get('scheduleDate')?.value) completedFields++;
    if (form.get('endDate')?.value) completedFields++;
    if (form.get('scheduleId')?.value) completedFields++;

    // Access (Step 3)
    if (form.get('accessType')?.value) completedFields++;
    if (this.accessPoints.length > 0) completedFields++;

    // Filters (Step 4)
    if (form.get('profiles')?.value?.length > 0) completedFields++;
    if (form.get('organizationalUnits')?.value?.length > 0) completedFields++;
    if (form.get('divisions')?.value?.length > 0) completedFields++;
    if (form.get('code')?.value) completedFields++;

    this.progressPercentage = Math.round((completedFields / totalFields) * 100);
    this.updateCurrentStep();
  }

  updateCurrentStep(): void {
    const form = this.eventForm;

    // Step 1: Basic info
    if (!form.get('name')?.value || !form.get('eventTypeId')?.value) {
      this.currentStep = 1;
      return;
    }

    // Step 2: Dates and schedule
    if (!form.get('scheduleDate')?.value || !form.get('endDate')?.value || !form.get('scheduleId')?.value) {
      this.currentStep = 2;
      return;
    }

    // Step 3: Access points
    if (!form.get('accessType')?.value || this.accessPoints.length === 0) {
      this.currentStep = 3;
      return;
    }

    // Step 4: Filters (optional, but if any are filled, consider it step 4)
    this.currentStep = 4;
  }

  getProgressPercentage(): number {
    return this.progressPercentage;
  }

  isStepActive(step: number): boolean {
    return this.currentStep >= step;
  }
}