import { Component, inject, Input } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../core/Services/api/api.service';
import { PersonCreate, PersonList, PersonRegistrer } from '../../../../../core/Models/security/person.models';
import { CustomTypeSpecific } from '../../../../../core/Models/parameter/custom-type.models';
import { CustomTypeService } from '../../../../../core/Services/api/customType/custom-type.service';
import { UbicationService } from '../../../../../core/Services/api/ubication/ubication.service';
import { CityCreate, CityList, Deparment } from '../../../../../core/Models/parameter/ubication.models';
import { UserCreate, UserList } from '../../../../../core/Models/security/user.models';
import { PersonService } from '../../../../../core/Services/api/person/person.service';
import Swal from 'sweetalert2';
import { ListService } from '../../../../../core/Services/shared/list.service';
import { DataService } from '../../../../../core/Services/shared/data.service';
import { VerificationCredencials } from '../../../../../core/Services/token/verificationCredencials';
import { GenericCredincialsComponent } from "../../../../../shared/components/generic-credincials/generic-credincials.component";
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../../../users/components/change-password/change-password.component';

@Component({
  selector: 'app-form-person',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    CommonModule,
    GenericCredincialsComponent
  ],
  templateUrl: './form-person.component.html',
  styleUrl: './form-person.component.css'
})
export class FormPErsonComponent {
  @Input() mode: 'create' | 'edit' = 'create'; //define el modo
  isEditMode = false;
  isLinear = true;
  isEditableBlocked = false;
  isModalOpen = false;

  hidePassword = true;
  hideConfirmPassword = true;

  // FormGroups para cada paso
  personalInfoForm: FormGroup;
  documentForm: FormGroup;
  contactForm: FormGroup;
  userForm: FormGroup;

  // Datos para los selectores
  documentTypes: CustomTypeSpecific[] = [];
  bloodTypes: CustomTypeSpecific[] = [];
  cities: CityCreate[] = [];
  deparments: Deparment[] = [];


  constructor(private formBuilder: FormBuilder,
    private personService: PersonService,
    private userService: ApiService<UserCreate, UserList>,
    private verificationService: VerificationCredencials,
    private listService: ListService,
    private ubicationService: UbicationService,
    private dialog: MatDialog,

  ) {
    // Inicializar formularios
    this.personalInfoForm = this.formBuilder.group({
      id: [''],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      secondLastName: ['']
    });

    this.documentForm = this.formBuilder.group({
      documentTypeId: [0, [Validators.required, Validators.min(1)]],
      documentNumber: ['', [Validators.required, Validators.minLength(6)]],
      bloodTypeId: [0, [Validators.required, Validators.min(1)]]
    });

    this.contactForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.minLength(5)],
      deparmentId: [null, Validators.required],
      cityId: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]]
    });

    this.userForm = this.formBuilder.group({
      personId: [''],
      username: ['', [Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.isEditMode = this.mode === 'edit';

    this.getData();

    // Si es modo edición, cargamos datos del usuario actual
    if (this.isEditMode) {
      this.loadCurrentProfile();
      this.isEditableBlocked = true; // bloquea edición inicialmente
      this.disableAllForms();
    }

    // cambio dinámico de departamentos
    this.contactForm.get('deparmentId')?.valueChanges.subscribe(departmentId => {
      if (departmentId) {
        this.getCitie(departmentId);
        this.contactForm.get('cityId')?.enable();
      } else {
        this.cities = [];
        this.contactForm.get('cityId')?.disable();
      }
    });
  }

  // Deshabilitar todos los formularios
  disableAllForms(): void {
    this.personalInfoForm.disable();
    this.documentForm.disable();
    this.contactForm.disable();
    this.userForm.disable();
  }

  // Cargar datos para los selectores

  getData() {
    this.listService.getdocumentTypes().subscribe(data => this.documentTypes = data);
    this.listService.getbloodTypes().subscribe(data => this.bloodTypes = data);
    this.listService.getdeparments().subscribe(data => this.deparments = data);
  }

  // Cargar datos del perfil actual
  loadCurrentProfile() {
    this.verificationService.getProfile().subscribe({
      next: (res) => {
        const person = res.data;
        this.patchFormValues(person);
        this.userForm.disable(); // el usuario no puede cambiar user/password aquí
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar la información del perfil.', 'error');
      }
    });
  }

  private patchFormValues(person: PersonList): void {
    this.personalInfoForm.patchValue({
      id: person.id,
      firstName: person.firstName,
      middleName: person.middleName,
      lastName: person.lastName,
      secondLastName: person.secondLastName
    });
    this.documentForm.patchValue({
      documentTypeId: person.documentTypeId,
      documentNumber: person.documentNumber,
      bloodTypeId: person.bloodTypeId
    });
    this.contactForm.patchValue({
      phone: person.phone,
      email: person.email,
      address: person.address,
      // deparmentId: person.deparmentId,
      cityId: person.cityId
    });
  }

  abrirModal() {
     console.log('🟢 Abriendo modal...');
    this.isModalOpen = true;
  }

  cerrarModal() {
     console.log('🔴 Cerrando modal...');
    this.isModalOpen = false;
  }

  onValidacionExitosa(password: string) {
    this.verificationService.verifyPassword(password).subscribe({
      next: (res) => {
        if (res.status) {
          this.isEditableBlocked = false;
          this.enableAllForms();
          Swal.fire('Verificado', 'Puedes editar tu información.', 'success');
        } else {
          Swal.fire('Error', 'Contraseña incorrecta.', 'error');
        }
        this.isModalOpen = false;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo verificar la contraseña.', 'error');
        this.isModalOpen = false;
      }
    });
  }

  // Habilitar todos los formularios
  enableAllForms(): void {
    this.personalInfoForm.enable();
    this.documentForm.enable();
    this.contactForm.enable();
    // userForm no, porque solo se usa en modo crear
  }


  // Método para abrir el diálogo de cambio de contraseña
  onChangePassword() {
    this.dialog.open(ChangePasswordComponent, {
      width: '400px',
      data: { email: this.contactForm.get('email')?.value }
    });
  }

  get isCityDisabled(): boolean {
    return this.contactForm?.get('cityId')?.disabled ?? true;
  }

  get getEmail() {
    return this.contactForm?.get('email')?.value;
  }

  getCitie(id: number) {
    this.ubicationService.GetCytiesByDeparment(id).subscribe((res: any) => {
      // si viene con data.data → úsalo, si no, usa el arreglo directo
      this.cities = Array.isArray(res.data) ? res.data : res;
    });
  }



  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  // Métodos para obtener nombres de los selectores
  getDocumentTypeName(): string {
    const docTypeId = this.documentForm.get('documentTypeId')?.value;
    const docType = this.documentTypes.find(dt => dt.id === docTypeId);
    return docType ? docType.name : '';
  }

  getBloodTypeName(): string {
    const bloodTypeId = this.documentForm.get('bloodTypeId')?.value;
    const bloodType = this.bloodTypes.find(bt => bt.id === bloodTypeId);
    return bloodType ? bloodType.name : '';
  }

  getCityName(): string {
    const cityId = this.contactForm.get('cityId')?.value;
    const city = this.cities.find(c => c.id === cityId);
    return city ? city.name : '';
  }

  getFullName(): string {
    const firstName = this.personalInfoForm.get('firstName')?.value || '';
    const middleName = this.personalInfoForm.get('middleName')?.value || '';
    const lastName = this.personalInfoForm.get('lastName')?.value || '';
    const secondLastName = this.personalInfoForm.get('secondLastName')?.value || '';

    return `${firstName} ${middleName} ${lastName} ${secondLastName}`.replace(/\s+/g, ' ').trim();
  }

  // Verificar si todo el formulario es válido
  isFormValid(): boolean {
    if (this.isEditMode) {
      return this.personalInfoForm.valid && this.documentForm.valid && this.contactForm.valid;
    }
    return this.personalInfoForm.valid && this.documentForm.valid && this.contactForm.valid && this.userForm.valid;
  }


  // Recopilar datos del formulario
  getFormData(): PersonCreate {
    return {
      id: this.personalInfoForm.get('id')?.value || 0,
      firstName: this.personalInfoForm.get('firstName')?.value || '',
      middleName: this.personalInfoForm.get('middleName')?.value || '',
      lastName: this.personalInfoForm.get('lastName')?.value || '',
      secondLastName: this.personalInfoForm.get('secondLastName')?.value || '',
      documentTypeId: this.documentForm.get('documentTypeId')?.value || 0,
      documentNumber: this.documentForm.get('documentNumber')?.value || '',
      bloodTypeId: this.documentForm.get('bloodTypeId')?.value || 0,
      phone: this.contactForm.get('phone')?.value || '',
      email: this.contactForm.get('email')?.value || '',
      address: this.contactForm.get('address')?.value || '',
      cityId: this.contactForm.get('cityId')?.value || 0
    };
  }

  // Recopilar datos del usuario
  getDataUser(): UserCreate {
    return {
      userName: this.userForm.get('username')?.value || "null",
      password: this.userForm.get('password')?.value || '',
      personId: this.personalInfoForm.get('id')?.value || 1
    }
  }

  // Método para enviar el formulario
  submitForm(): void {
    if (!this.isFormValid()) {
      Swal.fire('Formulario inválido', 'Complete los campos requeridos', 'warning');
      return;
    }

    const formData = this.getFormData();

    if (this.isEditMode) {
      // 🔁 Actualiza perfil
      this.verificationService.updateProfile(formData).subscribe({
        next: () => Swal.fire('Actualizado', 'Tu información fue actualizada exitosamente', 'success'),
        error: () => Swal.fire('Error', 'No se pudo actualizar la información', 'error')
      });
    } else {
      // 🆕 Crea nueva persona + usuario
      const personRegister: PersonRegistrer = {
        person: formData,
        user: this.getDataUser()
      };
      this.personService.SavePersonWithUser(personRegister).subscribe({
        next: () => Swal.fire('Éxito', 'Persona creada correctamente', 'success'),
        error: () => Swal.fire('Error', 'No se pudo crear la persona', 'error')
      });
    }
  }

  // Marcar todos los campos como tocados para mostrar errores
  private markAllFieldsAsTouched(): void {
    Object.keys(this.personalInfoForm.controls).forEach(key => {
      this.personalInfoForm.get(key)?.markAsTouched();
    });

    Object.keys(this.documentForm.controls).forEach(key => {
      this.documentForm.get(key)?.markAsTouched();
    });

    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });

    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  // Método para limpiar todos los formularios
  resetAllForms(): void {
    this.personalInfoForm.reset();
    this.documentForm.reset();
    this.contactForm.reset();
    this.userForm.reset();

    // Resetear valores por defecto para los selectores
    this.documentForm.patchValue({
      documentTypeId: 0,
      bloodTypeId: 0
    });

    this.contactForm.patchValue({
      cityId: 0
    });
  }

  // Métodos opcionales para mostrar mensajes (puedes usar Angular Material Snackbar)
  private showSuccessMessage(): void {
    // Implementar con MatSnackBar o tu sistema de notificaciones preferido
    console.log('Mostrar mensaje de éxito');
  }

  private showErrorMessage(): void {
    // Implementar con MatSnackBar o tu sistema de notificaciones preferido
    console.log('Mostrar mensaje de error');
  }
}