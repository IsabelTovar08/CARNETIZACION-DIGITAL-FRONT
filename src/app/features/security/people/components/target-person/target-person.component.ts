import { ApiService } from './../../../../../core/Services/api/api.service';
import { Component, Inject, Input, Optional, Signal, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CustomTypeService } from '../../../../../core/Services/api/customType/custom-type.service';
import { UbicationService } from '../../../../../core/Services/api/ubication/ubication.service';
import { CustomTypeSpecific } from '../../../../../core/Models/parameter/custom-type.models';
import { CityCreate, CityList, Deparment } from '../../../../../core/Models/parameter/ubication.models';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GenericFormComponent } from '../../../../../shared/components/generic-form/generic-form.component';
import { PersonCreate, PersonList } from '../../../../../core/Models/security/person.models';
import { ActionButtonsComponent } from "../../../../../shared/components/action-buttons/action-buttons.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ListService } from '../../../../../core/Services/shared/list.service';
import { ScheduleList } from '../../../../../core/Models/organization/schedules.models';
import { VerificationCredencials } from '../../../../../core/Services/token/verificationCredencials';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';
import { UserMe } from '../../../../../core/Models/security/user.models';
import { UserStoreService } from '../../../../../core/Services/auth/user-store.service';

@Component({
  selector: 'app-target-person',
  imports: [
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    ActionButtonsComponent,
    MatDividerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './target-person.component.html',
  styleUrl: './target-person.component.css'
})
export class TargetPersonComponent {
  // Input para recibir datos de la empresa si es necesario
  @Input() companyData: any;
  // Input para controlar si requiere validación de contraseña
  @Input() requirePasswordValidation = false;

  createUser: boolean = false;


  @Output() formSubmitted = new EventEmitter<any>();

  profileForm!: FormGroup;
  documentTypes: CustomTypeSpecific[] = [];
  bloodTypes: CustomTypeSpecific[] = [];
  cities: CityCreate[] = [];
  deparments: Deparment[] = [];
  schedules: ScheduleList[] = [];

  user!: Signal<UserMe | null>;
  isLoggedIn!: Signal<boolean>;

  // Variables para el control de edición y modal

  constructor(
    private fb: FormBuilder,
    private listService: ListService,
    private ubicationService: UbicationService,
    private dialog: MatDialog,
    private userService: VerificationCredencials,
    private snackbarService: SnackbarService,
    private apiServicePerson: ApiService<PersonCreate, PersonList>,
    private store: UserStoreService,
    @Optional() private dialogRef: MatDialogRef<TargetPersonComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
  ) { }

  // propiedad para simular cierre si es modal

  ngOnInit(): void {
    this.user = this.store.user;
    this.isLoggedIn = this.store.isLoggedIn;
    if (this.data.createUser) this.createUser = this.data.createUser;

    this.profileForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: ['', [Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      secondLastName: [''],
      documentTypeId: [0, [Validators.required, Validators.min(1)]],
      documentNumber: ['', [Validators.required, Validators.minLength(6)]],
      bloodTypeId: [0, [Validators.required, Validators.min(1)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.minLength(10)],
      departmentId: [null, Validators.required],
      cityId: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]],
      createUser: [this.createUser]
    });

    this.getData();

    this.profileForm.get('departmentId')?.valueChanges.subscribe(departmentId => {
      if (departmentId) {
        this.getCytie(departmentId);
        this.profileForm.get('cityId')?.enable();
      } else {
        this.cities = [];
        this.profileForm.get('cityId')?.disable();
      }
    });
  }

  getData() {
    this.listService.getdocumentTypes().subscribe(data => this.documentTypes = data);
    this.listService.getbloodTypes().subscribe(data => this.bloodTypes = data);
    this.listService.getdeparments().subscribe(data => this.deparments = data);
  }

  getCytie(id: number) {
    this.ubicationService.GetCytiesByDeparment(id).subscribe((res: any) => {

      this.cities = Array.isArray(res.data) ? res.data : res;
    });
  }

  // Métodos de validación de contraseña removidos ya que es modo creación

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Datos enviados:', this.profileForm.value);

      // Preparar datos para crear nueva persona
      const personData = {
        ...this.profileForm.value,
        id: 0
      };

      // Emitir el evento con los datos del formulario
      this.formSubmitted.emit(personData);

      this.apiServicePerson.Crear('Person', personData).subscribe((data) => {
        console.log(data);
        this.snackbarService.showSuccess('Persona creada con éxito');
        const personId = data.data.id;

        this.dialogRef?.close(personId);
        this.profileForm.reset();
        // Resetear validaciones del formulario
        this.profileForm.get('cityId')?.disable();
      }, (error) => {
        console.error(error);
        this.snackbarService.showError('Error al crear persona');
      });
    }
  }

  // Función para cancelar cambios
  onCancel() {
    this.dialogRef?.close();
  }

}
