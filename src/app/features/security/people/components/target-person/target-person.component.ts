import { ApiService } from './../../../../../core/Services/api/api.service';
import { Component, Inject, Input, Optional, Signal } from '@angular/core';
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
import { ChangePasswordComponent } from '../../../users/components/change-password/change-password.component';
import { GenericCredincialsComponent } from '../../../../../shared/components/generic-credincials/generic-credincials.component';
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
    MatIconModule,
    GenericCredincialsComponent
  ],
  templateUrl: './target-person.component.html',
  styleUrl: './target-person.component.css'
})
export class TargetPersonComponent {

  

  // Input para controlar si requiere validación de contraseña
  @Input() requirePasswordValidation = false;

  profileForm!: FormGroup;
  documentTypes: CustomTypeSpecific[] = [];
  bloodTypes: CustomTypeSpecific[] = [];
  cities: CityCreate[] = [];
  deparments: Deparment[] = [];
  schedules: ScheduleList[] = [];

   user!: Signal<UserMe | null>;
  isLoggedIn!: Signal<boolean>;

  // Variables para el control de edición y modal
  isEditable = true; // Por defecto editable si no requiere validación
  isModalOpen = false;
  originalFormData: any = {};

  constructor(
    private fb: FormBuilder,
    private listService: ListService,
    private ubicationService: UbicationService,
    private dialog: MatDialog,
    private userService: VerificationCredencials,
    private snackbarService: SnackbarService,
    private apiServicePerson: ApiService<PersonCreate, PersonList>,
     private store: UserStoreService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  // propiedad para simular cierre si es modal
  dialogRef?: MatDialogRef<TargetPersonComponent>;

  ngOnInit(): void {
    const item = this.data?.item ?? {};   // 👈 evita el error si no viene de MatDialog

    this.user = this.store.user;
    this.isLoggedIn = this.store.isLoggedIn;
    
    this.profileForm = this.fb.group({
      id: [item.id || ''],
      firstName: [item.firstName || '', [Validators.required, Validators.minLength(2)]],
      middleName: [item.middleName || '', [Validators.minLength(2)]],
      lastName: [item.lastName || '', [Validators.required, Validators.minLength(2)]],
      secondLastName: [item.secondLastName || ''],
      documentTypeId: [item.documentTypeId || 0, [Validators.required, Validators.min(1)]],
      documentNumber: [item.documentNumber || '', [Validators.required, Validators.minLength(6)]],
      bloodTypeId: [item.bloodTypeId || 0, [Validators.required, Validators.min(1)]],
      phone: [item.phone || '', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: [item.email || '', [Validators.required, Validators.email]],
      address: [item.address || '', Validators.minLength(10)],
      departmentId: [item.departmentId || 0],
      cityId: [item.cityId || 0, [Validators.required]],
    });

    // Solo aplicar validación de contraseña si es requerida
    if (this.requirePasswordValidation) {
      this.originalFormData = this.profileForm.value;
      this.isEditable = false;
      this.profileForm.disable();
    }

    this.getData();

    this.profileForm.get('departmentId')?.valueChanges.subscribe(departmentId => {
      if (departmentId) {
        this.getCytie(departmentId);
        // Solo habilitar cityId si el formulario está en modo editable
        if (this.isEditable) {
          this.profileForm.get('cityId')?.enable();
        }
      } else {
        this.cities = [];
        this.profileForm.get('cityId')?.setValue(null);
        // Solo deshabilitar cityId si el formulario está en modo editable
        if (this.isEditable) {
          this.profileForm.get('cityId')?.disable();
        }
      }
    });
  }

  getData(){
    this.listService.getdocumentTypes().subscribe(data => this.documentTypes = data);
    this.listService.getbloodTypes().subscribe(data => this.bloodTypes = data);
    this.listService.getdeparments().subscribe(data => this.deparments = data);
    this.listService.getCities().subscribe(data => this.cities = data);
  }

  getCytie(id: number) {
    this.ubicationService.GetCytiesByDeparment(id).subscribe((data) => {
      this.cities = data.data;
      console.log(data)
    })
  }

  // Solo mostrar botón editar si requiere validación
  showEditButton(): boolean {
    return this.requirePasswordValidation && !this.isEditable;
  }

  // Función para abrir el modal de validación (solo si requirePasswordValidation = true)
  onEdit() {
    if (this.requirePasswordValidation) {
      this.isModalOpen = true;
    }
  }

  // Función para cerrar el modal
  cerrarModal() {
    this.isModalOpen = false;
  }

  // Función que se ejecuta cuando la validación de contraseña es exitosa
  onValidacionExitosa(password: string) {
    this.userService.verifyPassword(password).subscribe({
      next: (res) => {
        if (res.status) {
          this.isEditable = true;
          this.profileForm.enable();
          
          // Aplicar lógica especial para cityId después de habilitar
          const departmentId = this.profileForm.get('departmentId')?.value;
          if (!departmentId || departmentId === 0) {
            this.profileForm.get('cityId')?.disable();
          }
          
          this.snackbarService.showSuccess('¡Credenciales validadas! Ahora puedes editar la información.');
        } else {
          this.snackbarService.showError('Contraseña incorrecta');
        }
        this.isModalOpen = false;
      },
      error: (err) => {
        console.error('Error al verificar contraseña', err);
        this.snackbarService.showError('Error al verificar la contraseña');
        this.isModalOpen = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Datos enviados:', this.profileForm.value);
      this.apiServicePerson.update('Person', this.profileForm.value).subscribe((data) => {
        console.log(data);
        this.snackbarService.showSuccess('Persona actualizada con éxito');
        
        // Si requiere validación, desactivar edición después de guardar
        if (this.requirePasswordValidation) {
          this.originalFormData = this.profileForm.value;
          this.isEditable = false;
          this.profileForm.disable();
        }
      }, (error) => {
        console.error(error);
        this.snackbarService.showError('Error al actualizar persona');
      });
    }
  }

  // Función para cancelar cambios
  onCancel() {
    if (this.requirePasswordValidation) {
      this.profileForm.patchValue(this.originalFormData);
      this.isEditable = false;
      this.profileForm.disable();
    } else {
      // En modo normal, cerrar modal si existe
      this.dialogRef?.close();
    }
  }

  onChangePassword() {
    const dialogRef = this.dialog?.open(ChangePasswordComponent, {
      disableClose: true,
      width: '400px',
      data: { email: this.profileForm.get('email')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Contraseña actualizada');
      }
    });
  }
}