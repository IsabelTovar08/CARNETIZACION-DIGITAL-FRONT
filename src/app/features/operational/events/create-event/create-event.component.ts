import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
import { EventService,  } from '../../../../core/Services/api/event/event.service';
import {
  CreateEventRequest,SelectOption,AccessPointDto,EventDtoRequest} from '../../../../core/Models/operational/event.model';
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

  // Removemos el array regular ya que usaremos FormArray

  profilesOptions: SelectOption[] = [];
  organizationalUnitOptions: SelectOption[] = [];
  internalDivisionOptions: SelectOption[] = [];
  eventTypeOptions: any[] = [];

  // Almacenar datos del evento cargado para actualizar selecciones de audiencia
  private loadedEventData: any = null;

  // Progress tracking
  progressPercentage = 0;
  currentStep = 1;

  accessPointTypes = [
    { id: 1, name: 'Entrada' },
    { id: 2, name: 'Exit' },
    { id: 3, name: 'Mixto' }
  ];

  // Getter para el FormArray de access points
  get accessPointsArray(): FormArray {
    return this.eventForm.get('accessPoints') as FormArray;
  }

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
      endDate: [''],

      schedules: [[], [Validators.required, this.atLeastOneSchedule]],
      eventTypeId: [null, Validators.required],
      accessType: ['public'],
      statusId: [1],

      // Audiencia
      profiles: this.fb.control({ value: [], disabled: true }),
      organizationalUnits: this.fb.control({ value: [], disabled: true }),
      divisions: this.fb.control({ value: [], disabled: true }),

      // Mini-form AP (controles separados para el formulario de agregar)
      apName: [''],
      apDescription: [''],
      typeId: [null], // Sin validadores

      // FormArray para puntos de acceso
      accessPoints: this.fb.array([])
    }, { validators: this.dateRangeValidator });

    // Asegurar que el control typeId no tenga validadores
    this.eventForm.get('typeId')?.clearValidators();
    this.eventForm.get('typeId')?.updateValueAndValidity();

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

    // Apply conditional validation for event start date
    if (this.isEdit) {
      this.eventForm.get('scheduleDate')?.setValidators([Validators.required]);
    } else {
      this.eventForm.get('scheduleDate')?.setValidators([Validators.required, this.eventStartValidator.bind(this)]);
    }
    this.eventForm.get('scheduleDate')?.updateValueAndValidity();

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
        this.loadedEventData = event; // Almacenar los datos para usarlos después

        this.eventForm.patchValue({
          name: event.name,
          code: event.code,
          description: event.description,
          scheduleDate: event.eventStart ? new Date(event.eventStart) : '',
          endDate: event.eventEnd ? new Date(event.eventEnd) : '',
          scheduleId: event.scheduleId || event.scheduleId,
          eventTypeId: event.eventTypeId,
          accessType: event.ispublic ? 'public' : 'private',
          profiles: event.profileIds || [],
          organizationalUnits: event.organizationalUnitIds || [],
          divisions: event.internalDivisionIds || []
        });
        if (event.accessPoints) {
          // Limpiar el FormArray actual
          while (this.accessPointsArray.length !== 0) {
            this.accessPointsArray.removeAt(0);
          }

          // Agregar cada access point al FormArray
          event.accessPoints.forEach((ap: any) => {
            this.accessPointsArray.push(this.fb.group({
              name: [ap.name, Validators.required],
              description: [ap.description || ''],
              typeId: [ap.typeId, Validators.required]
            }));
          });
        }
    },
    error: (err) => {
      this.useservice.showError('Error al cargar el evento');
      console.error('Error al cargar evento:', err);
    }
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
      next: res => {
        this.profilesOptions = res.data;
        // Si estamos editando, actualizar el form después de cargar las opciones
        if (this.isEdit && this.editingEventId) {
          this.updateAudienceSelections();
        }
      },
      error: () => this.useservice.showError('Error al cargar perfiles')
    });

    this.eventService.getOrganizationalUnits().subscribe({
      next: res => {
        this.organizationalUnitOptions = res.data;
        // Si estamos editando, actualizar el form después de cargar las opciones
        if (this.isEdit && this.editingEventId) {
          this.updateAudienceSelections();
        }
      },
      error: () => this.useservice.showError('Error al cargar unidades organizativas')
    });

    this.eventService.getInternalDivisions().subscribe({
      next: res => {
        this.internalDivisionOptions = res.data;
        // Si estamos editando, actualizar el form después de cargar las opciones
        if (this.isEdit && this.editingEventId) {
          this.updateAudienceSelections();
        }
      },
      error: () => this.useservice.showError('Error al cargar divisiones internas')
    });
  }

  openAddAccessPointDialog(): void {
    this.showAddForm = true;
    this.eventForm.patchValue({
      apName: '',
      apDescription: '',
      typeId: null
    });
  }

  cancelAddAccessPoint(): void {
    this.showAddForm = false;
    this.eventForm.patchValue({
      apName: '',
      apDescription: '',
      typeId: null
    });
  }

  addAccessPointManual(): void {
    const name = (this.eventForm.get('apName')?.value || '').trim();
    const description = (this.eventForm.get('apDescription')?.value || '').trim();
    const typeId = this.eventForm.get('typeId')?.value;

    console.log('🔍 Valores del formulario:', { name, description, typeId });

    if (!name) {
      this.useservice.showInfo('Ingresa un nombre para el punto de acceso');
      return;
    }
    if (!typeId) {
      this.useservice.showInfo('Selecciona el tipo del punto de acceso');
      return;
    }

    // Agregar al FormArray
    const newAccessPointGroup = this.fb.group({
      name: [name, Validators.required],
      description: [description],
      typeId: [typeId, Validators.required]
    });

    console.log('📝 Nuevo FormGroup creado:', newAccessPointGroup.value);
    console.log('✅ FormGroup válido:', newAccessPointGroup.valid);

    this.accessPointsArray.push(newAccessPointGroup);
    console.log('📊 FormArray después de agregar:', this.accessPointsArray.value);

    this.showAddForm = false;
    this.eventForm.patchValue({ apName: '', apDescription: '', typeId: null });
    this.useservice.showSuccess('Punto de acceso agregado');
  }

  deleteAccessPoint(index: number): void {
    this.accessPointsArray.removeAt(index);
    this.useservice.showSuccess('Punto de acceso eliminado');
  }

  getAccessPointTypeName(typeId: number): string {
    const type = this.accessPointTypes.find(t => t.id === typeId);
    return type?.name || `Tipo ${typeId}`;
  }

 // Mapear para CREAR evento (con objetos anidados)
 private mapFormToCreateDto(): CreateEventRequest {
  const f = this.eventForm.getRawValue(); // getRawValue() obtiene todos los valores incluso los disabled

  return {
    event: {
      name: f.name,
      code: (f.code && f.code.trim()) || this.generateCode(8),
      description: f.description || "",
      eventStart: f.scheduleDate ? new Date(f.scheduleDate).toISOString() : null,
      eventEnd: f.endDate ? new Date(f.endDate).toISOString() : null,
      eventTypeId: f.eventTypeId,
      ispublic: f.accessType === 'public',
      statusId: 1
    },
    scheduleIds: f.schedules.map((s: any) => s.id),
    accessPoints: this.accessPointsArray.value.map((ap: any) => ({
      name: ap.name,
      description: ap.description || "",
      typeId: ap.typeId
    })),
    profileIds: f.profiles || [],
    organizationalUnitIds: f.organizationalUnits || [],
    internalDivisionIds: f.divisions || []
  };
}

// Mapear para ACTUALIZAR evento (objeto plano con IDs)
private mapFormToUpdateDto(): EventDtoRequest {
  const f = this.eventForm.getRawValue();

  return {
    id: this.editingEventId!,
    name: f.name,
    code: (f.code && f.code.trim()) || this.generateCode(8),
    description: f.description || "",
    eventStart: f.scheduleDate ? new Date(f.scheduleDate).toISOString() : null,
    eventEnd: f.endDate ? new Date(f.endDate).toISOString() : null,
    scheduleIds: f.schedules.map((s: any) => s.id),
    eventTypeId: f.eventTypeId,
    eventName: f.name,
    ispublic: f.accessType === 'public',
    statusId: 1,
    accessPoints: this.accessPointsArray.value.map((ap: any) => ap.id || 0).filter((id: number) => id > 0),
    profileIds: f.profiles || [],
    organizationalUnitIds: f.organizationalUnits || [],
    internalDivisionIds: f.divisions || []
  };
}




  onSubmit(): void {
   console.log('🔥 onSubmit llamado');
   console.log('📋 Formulario válido?', this.eventForm.valid);
   console.log('📊 Estado del formulario:', this.eventForm.value);
   console.log('🎯 Puntos de acceso:', this.accessPointsArray.value);
   console.log('🔍 Estado del control typeId:', this.eventForm.get('typeId')?.value, this.eventForm.get('typeId')?.valid, this.eventForm.get('typeId')?.errors);

  // Validación del formulario
  if (!this.eventForm.valid) {
    console.log('❌ Formulario inválido');
    this.markFormGroupTouched();

    // Validaciones específicas con mensajes
    if (!this.eventForm.get('name')?.value) {
      this.useservice.showError('El nombre del evento es obligatorio');
      return;
    }
    if (!this.eventForm.get('eventTypeId')?.value) {
      this.useservice.showError('Debes seleccionar un tipo de evento');
      return;
    }
    if (!this.eventForm.get('schedules')?.value || this.eventForm.get('schedules')?.value.length === 0) {
      this.useservice.showError('Debes seleccionar al menos una jornada');
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

    if (this.eventForm.hasError('dateRangeInvalid')) {
      this.useservice.showError('La fecha de finalización debe ser posterior o igual a la fecha de inicio');
      return;
    }

    if (this.eventForm.get('scheduleDate')?.hasError('eventStartPast')) {
      this.useservice.showError('La fecha de inicio del evento no puede ser anterior a la fecha actual');
      return;
    }

    // Mostrar todos los errores del formulario
    console.log('🚨 Errores del formulario:', this.eventForm.errors);
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      if (control?.errors) {
        console.log(`❌ Campo ${key} tiene errores:`, control.errors);
      }

      // Si es el FormArray, revisar cada FormGroup
      if (key === 'accessPoints' && control instanceof FormArray) {
        control.controls.forEach((group, index) => {
          const formGroup = group as FormGroup;
          if (formGroup.errors) {
            console.log(`❌ FormGroup ${index} en accessPoints tiene errores:`, formGroup.errors);
          }
          Object.keys(formGroup.controls).forEach(groupKey => {
            const groupControl = formGroup.get(groupKey);
            if (groupControl?.errors) {
              console.log(`❌ FormGroup ${index}, campo ${groupKey} tiene errores:`, groupControl.errors);
            }
          });
        });
      }
    });

    return;
  }

  // Validación de puntos de acceso
  if (this.accessPointsArray.length === 0) {
    console.log('❌ No hay puntos de acceso');
    this.useservice.showError('Debes agregar al menos un Punto de Acceso');
    return;
  }

  console.log('✅ Validaciones pasadas, procediendo a guardar...');

  if (this.isEdit && this.editingEventId) {
    // ACTUALIZAR
    const updateDto = this.mapFormToUpdateDto();
    console.log('📤 DTO UPDATE a enviar:', updateDto);

    this.eventService.updateEvent(updateDto).subscribe({
      next: (res) => {
        console.log('✅ Evento actualizado exitosamente:', res);
        this.useservice.showSuccess(res.message || 'Evento actualizado exitosamente');
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('❌ Error al actualizar evento:', err);
        this.useservice.showError(err?.error?.message || 'Error al actualizar evento');
      }
    });
  } else {
    // CREAR
    const createDto = this.mapFormToCreateDto();
    console.log('📤 DTO CREATE a enviar:', createDto);

    this.eventService.createEvent(createDto).subscribe({
      next: (res) => {
        console.log('✅ Evento creado exitosamente:', res);
        this.useservice.showSuccess(res.message || 'Evento creado exitosamente');
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('❌ Error al crear evento:', err);
        this.useservice.showError(err?.error?.message || 'Error al crear evento');
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

  // Validador personalizado para fecha de inicio no pasada
  eventStartValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.value;

    if (startDate) {
      const start = new Date(startDate);
      const today = new Date();

      // Normalizar ambas fechas a medianoche para comparar solo día, mes y año
      const startNormalized = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (startNormalized < todayNormalized) {
        return { eventStartPast: true };
      }
    }

    return null;
  }

  // Validador para al menos una jornada
  atLeastOneSchedule(control: AbstractControl): ValidationErrors | null {
    const schedules = control.value;
    if (!schedules || schedules.length === 0) {
      return { atLeastOneSchedule: true };
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
    if (form.get('schedules')?.value?.length > 0) completedFields++;

    // Access (Step 3)
    if (form.get('accessType')?.value) completedFields++;
    if (this.accessPointsArray.length > 0) completedFields++;

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
    if (!form.get('scheduleDate')?.value || !form.get('endDate')?.value || !form.get('schedules')?.value?.length) {
      this.currentStep = 2;
      return;
    }

    // Step 3: Access points
    if (!form.get('accessType')?.value || this.accessPointsArray.length === 0) {
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

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Actualizar las selecciones de audiencia después de cargar las opciones
  private updateAudienceSelections(): void {
    if (this.loadedEventData) {
      this.eventForm.patchValue({
        profiles: this.loadedEventData.profileIds || [],
        organizationalUnits: this.loadedEventData.organizationalUnitIds || [],
        divisions: this.loadedEventData.internalDivisionIds || []
      });
    }
  }
}