import { Component, inject } from '@angular/core';
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
import {  CityCreate, CityList, Deparment } from '../../../../../core/Models/parameter/ubication.models';
import { UserCreate, UserList } from '../../../../../core/Models/security/user.models';
import { PersonService } from '../../../../../core/Services/api/person/person.service';
import Swal from 'sweetalert2';
import { ListService } from '../../../../../core/Services/shared/list.service';
import { DataService } from '../../../../../core/Services/shared/data.service';

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
    CommonModule
  ],
  templateUrl: './form-person.component.html',
  styleUrl: './form-person.component.css'
})
export class FormPErsonComponent {
  isLinear = true;

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

    private listService: ListService,
    private ubicationService: UbicationService,



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
      address: ['', Validators.minLength(10)],
      deparmentId: [null, Validators.required],
      cityId: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]]
    });

    this.userForm = this.formBuilder.group({
      personId: [''],
      username: ['', [Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.getData()
    this.contactForm.get('deparmentId')?.valueChanges.subscribe(departmentId => {
      if (departmentId) {
        this.getCytie(departmentId);
        this.contactForm.get('cityId')?.enable();
      } else {
        this.cities = [];
        this.contactForm.get('cityId')?.setValue(null);
        this.contactForm.get('cityId')?.disable();
      }
    });


  }

  getData(){
    this.listService.getdocumentTypes().subscribe(data => this.documentTypes = data);
    this.listService.getbloodTypes().subscribe(data => this.bloodTypes = data);
    this.listService.getdeparments().subscribe(data => this.deparments = data);
  }

  get isCityDisabled(): boolean {
    return this.contactForm?.get('cityId')?.disabled ?? true;
  }

  get getEmail() {
    return this.contactForm?.get('email')?.value;
  }

  getCytie(id: number) {
    this.ubicationService.GetCytiesByDeparment(id).subscribe((data) => {
      this.cities = data.data;
    })
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
    return this.personalInfoForm.valid &&
      this.documentForm.valid &&
      this.contactForm.valid
  }

  // Recopilar todos los datos del formulario
  getFormData(): PersonCreate {
    return {
      id: 0,
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
  getDataUser() : UserCreate {
    return {
      userName: this.userForm.get('username')?.value || "null",
      password: this.userForm.get('password')?.value || '',
      personId: this.personalInfoForm.get('id')?.value || 0
    }
  }

  // Método para enviar el formulario
  submitForm(): void {
    if (this.isFormValid()) {
      const formData = this.getFormData();
      var peronRegistrer: PersonRegistrer = {
        person: formData,
        user: this.getDataUser()
      }


      // Aquí puedes llamar a tu servicio para guardar los datos
      console.log('Datos del formulario:', peronRegistrer);

      this.personService.SavePersonWithUser(peronRegistrer).subscribe({
        next: (personaResponse) => {
          // Guardar el ID de la persona en el formulario

          console.log('Persona creada exitosamente:', personaResponse);
          Swal.fire({
            title: 'Persona creada exitosamente'
          })

        },
        error: (personaError) => {
          console.error('Error al crear persona:', personaError);
          this.showErrorMessage(); // puedes personalizar con mensaje específico para "persona"
        }
      });

    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.markAllFieldsAsTouched();
      alert('Por favor complete todos los campos requeridos correctamente.');
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
