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
import { PersonList } from '../../../../../core/Models/security/person.models';

interface DocumentType {
  id: number;
  name: string;
}

interface BloodType {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface PersonData {
  isDeleted: boolean;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  documentTypeId: number;
  identification: string;
  bloodTypeId: number;
  phone: string;
  email: string;
  address: string;
  cityId: number;
  username?: string;
  password?: string;
}

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
  documentTypes: DocumentType[] = [
    { id: 1, name: 'Cédula de Ciudadanía' },
    { id: 2, name: 'Tarjeta de Identidad' },
    { id: 3, name: 'Cédula de Extranjería' },
    { id: 4, name: 'Pasaporte' },
    { id: 5, name: 'NUIP' }
  ];

  bloodTypes: BloodType[] = [
    { id: 1, name: 'O+' },
    { id: 2, name: 'O-' },
    { id: 3, name: 'A+' },
    { id: 4, name: 'A-' },
    { id: 5, name: 'B+' },
    { id: 6, name: 'B-' },
    { id: 7, name: 'AB+' },
    { id: 8, name: 'AB-' }
  ];

  cities: City[] = [
    { id: 1, name: 'Bogotá' },
    { id: 2, name: 'Medellín' },
    { id: 3, name: 'Cali' },
    { id: 4, name: 'Barranquilla' },
    { id: 5, name: 'Cartagena' },
    { id: 6, name: 'Bucaramanga' },
    { id: 7, name: 'Pereira' },
    { id: 8, name: 'Santa Marta' },
    { id: 9, name: 'Ibagué' },
    { id: 10, name: 'Neiva' }
  ];

  constructor(private formBuilder: FormBuilder,
    private apiService: ApiService<PersonData, PersonList>
  ) {
    // Inicializar formularios
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      secondLastName: ['']
    });

    this.documentForm = this.formBuilder.group({
      documentTypeId: [0, [Validators.required, Validators.min(1)]],
      identification: ['', [Validators.required, Validators.minLength(6)]],
      bloodTypeId: [0, [Validators.required, Validators.min(1)]]
    });

    this.contactForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      cityId: [0, [Validators.required, Validators.min(1)]]
    });

    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Puedes cargar datos adicionales aquí si es necesario
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
           this.contactForm.valid &&
           this.userForm.valid;
  }

  // Recopilar todos los datos del formulario
  getFormData(): PersonData {
    return {
      isDeleted: false,
      firstName: this.personalInfoForm.get('firstName')?.value || '',
      middleName: this.personalInfoForm.get('middleName')?.value || '',
      lastName: this.personalInfoForm.get('lastName')?.value || '',
      secondLastName: this.personalInfoForm.get('secondLastName')?.value || '',
      documentTypeId: this.documentForm.get('documentTypeId')?.value || 0,
      identification: this.documentForm.get('identification')?.value || '',
      bloodTypeId: this.documentForm.get('bloodTypeId')?.value || 0,
      phone: this.contactForm.get('phone')?.value || '',
      email: this.contactForm.get('email')?.value || '',
      address: this.contactForm.get('address')?.value || '',
      cityId: this.contactForm.get('cityId')?.value || 0,
      username: this.userForm.get('username')?.value || '',
      password: this.userForm.get('password')?.value || ''
    };
  }

  // Método para enviar el formulario
  submitForm(): void {
    if (this.isFormValid()) {
      const formData = this.getFormData();

      // Aquí puedes llamar a tu servicio para guardar los datos
      console.log('Datos del formulario:', formData);

      // Ejemplo de llamada a servicio (descomenta y adapta según tu necesidad):
      this.apiService.Crear('Person' ,formData).subscribe({
        next: (response) => {
          console.log('Persona creada exitosamente:', response);
          // Mostrar mensaje de éxito
          this.showSuccessMessage();
        },
        error: (error) => {
          console.error('Error al crear persona:', error);
          // Mostrar mensaje de error
          this.showErrorMessage();
        }
      });

      // Por ahora solo mostramos un alert
      alert('¡Persona registrada exitosamente!\n\n' +
            'Nombre: ' + this.getFullName() + '\n' +
            'Email: ' + this.contactForm.get('email')?.value + '\n' +
            'Username: ' + this.userForm.get('username')?.value);
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
