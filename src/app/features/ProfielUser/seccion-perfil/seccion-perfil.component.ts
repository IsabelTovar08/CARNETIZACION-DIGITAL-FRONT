import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { GenericCredincialsComponent } from '../../../shared/components/generic-credincials/generic-credincials.component';
import { VerificationCredencials } from '../../../core/Services/token/verificationCredencials';
import { SnackbarService } from '../../../core/Services/snackbar/snackbar.service';
import { UserMeDto } from '../../../core/Models/security/user-me.models';
import { ApiResponse } from '../../../core/Models/api-response.models';
import { PersonCreate, PersonRegistrer } from '../../../core/Models/security/person.models';
import { ApiService } from '../../../core/Services/api/api.service';
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { CityCreate, Deparment } from '../../../core/Models/parameter/ubication.models';
import { ListService } from '../../../core/Services/shared/list.service';
import { UbicationService } from '../../../core/Services/api/ubication/ubication.service';
import { CustomTypeSpecific } from '../../../core/Models/parameter/custom-type.models';
import { MatDialog } from '@angular/material/dialog';
import { PersonService } from '../../../core/Services/api/person/person.service';
import Swal from 'sweetalert2';
import { UserCreate } from '../../../core/Models/security/user.models';


@Component({
  selector: 'app-seccion-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, GenericCredincialsComponent, MatInputModule, MatAutocompleteModule],
  templateUrl: './seccion-perfil.component.html',
  styleUrls: ['./seccion-perfil.component.css']
})
export class SeccionPerfilComponent implements OnInit {
  isEditable = false;
  isModalOpen = false;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(VerificationCredencials);
  private apiService = inject(ApiService<UserMeDto, UserMeDto>);

  meData?: UserMeDto;
  perfilForm: FormGroup;

  documentTypes: CustomTypeSpecific[] = [];
  bloodTypes: CustomTypeSpecific[] = [];
  cities: CityCreate[] = [];
  deparments: Deparment[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private listService: ListService,
    private ubicationService: UbicationService,
    private dialog: MatDialog,
    private personService: PersonService,
  ) {

    this.perfilForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      secondLastName: [''],
      documentTypeId: [0, [Validators.required, Validators.min(1)]],
      documentNumber: ['', [Validators.required, Validators.minLength(6)]],
      bloodTypeId: [0, [Validators.required, Validators.min(1)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.minLength(5)],
      deparmentId: [null, Validators.required],
      cityId: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]]
    });

    // al inicio el form queda bloqueado
    this.perfilForm.disable();
  }

  ngOnInit(): void {
    this.getData();

    // cambio dinámico de departamentos
    this.perfilForm.get('deparmentId')?.valueChanges.subscribe(departmentId => {
      if (departmentId) {
        this.getCitie(departmentId);
        this.perfilForm.get('cityId')?.enable();
      } else {
        this.cities = [];
        this.perfilForm.get('cityId')?.disable();
      }
    });
  }

  getData() {
    this.listService.getdocumentTypes().subscribe(data => this.documentTypes = data);
    this.listService.getbloodTypes().subscribe(data => this.bloodTypes = data);
    this.listService.getdeparments().subscribe(data => this.deparments = data);
  }

  get isCityDisabled(): boolean {
    return this.perfilForm?.get('cityId')?.disabled ?? true;
  }

  get getEmail() {
    return this.perfilForm?.get('email')?.value;
  }

  getCitie(id: number) {
    this.ubicationService.GetCytiesByDeparment(id).subscribe((res: any) => {
      // si viene con data.data → úsalo, si no, usa el arreglo directo
      this.cities = Array.isArray(res.data) ? res.data : res;
    });
  }

  // Métodos para obtener nombres de los selectores
  getDocumentTypeName(): string {
    const docTypeId = this.perfilForm.get('documentTypeId')?.value;
    const docType = this.documentTypes.find(dt => dt.id === docTypeId);
    return docType ? docType.name : '';
  }

  getBloodTypeName(): string {
    const bloodTypeId = this.perfilForm.get('bloodTypeId')?.value;
    const bloodType = this.bloodTypes.find(bt => bt.id === bloodTypeId);
    return bloodType ? bloodType.name : '';
  }

  getCityName(): string {
    const cityId = this.perfilForm.get('cityId')?.value;
    const city = this.cities.find(c => c.id === cityId);
    return city ? city.name : '';
  }

  getFullName(): string {
    const firstName = this.perfilForm.get('firstName')?.value || '';
    const middleName = this.perfilForm.get('middleName')?.value || '';
    const lastName = this.perfilForm.get('lastName')?.value || '';
    const secondLastName = this.perfilForm.get('secondLastName')?.value || '';

    return `${firstName} ${middleName} ${lastName} ${secondLastName}`.replace(/\s+/g, ' ').trim();
  }

  // Verificar si todo el formulario es válido
  isFormValid(): boolean {
    return this.perfilForm.valid && this.perfilForm.valid && this.perfilForm.valid && this.perfilForm.valid;
  }
  // Recopilar datos del formulario
  getFormData(): PersonCreate {
    return {
      id: this.perfilForm.get('id')?.value || 0,
      firstName: this.perfilForm.get('firstName')?.value || '',
      middleName: this.perfilForm.get('middleName')?.value || '',
      lastName: this.perfilForm.get('lastName')?.value || '',
      secondLastName: this.perfilForm.get('secondLastName')?.value || '',
      documentTypeId: this.perfilForm.get('documentTypeId')?.value || 0,
      documentNumber: this.perfilForm.get('documentNumber')?.value || '',
      bloodTypeId: this.perfilForm.get('bloodTypeId')?.value || 0,
      phone: this.perfilForm.get('phone')?.value || '',
      email: this.perfilForm.get('email')?.value || '',
      address: this.perfilForm.get('address')?.value || '',
      cityId: this.perfilForm.get('cityId')?.value || 0
    };
  }

  // Recopilar datos del usuario
  getDataUser(): UserCreate {
    return {
      userName: this.perfilForm.get('username')?.value || "null",
      password: this.perfilForm.get('password')?.value || '',
      personId: this.perfilForm.get('id')?.value || 1
    }
  }

  // Método para enviar el formulario
    submitForm(): void {
      if (!this.isFormValid()) {
        Swal.fire('Formulario inválido', 'Complete los campos requeridos', 'warning');
        return;
      }
  const formData = this.getFormData();
        
        const personRegister: PersonRegistrer = {
          person: formData,
          user: this.getDataUser()
        };
        this.personService.SavePersonWithUser(personRegister).subscribe({
          next: () => Swal.fire('Éxito', 'Persona creada correctamente', 'success'),
          error: () => Swal.fire('Error', 'No se pudo crear la persona', 'error')
        });
    }

  onValidacionExitosa(password: string) {
    this.userService.verifyPassword(password).subscribe({
      next: (res) => {
        if (res.status) {
          this.isEditable = true;
          this.perfilForm.enable();
          this.snackbarService.showSuccess('¡Credenciales validadas! Ahora puedes editar tu perfil.');
        } else {
          this.snackbarService.showError(res.message || 'Contraseña incorrecta.');
        }
        this.isModalOpen = false;
      },
      error: (err) => {
        console.error('Error al verificar contraseña', err);
        this.snackbarService.showError('Hubo un problema al verificar tu contraseña.');
      }
    });
  }


  private markAllFieldsAsTouched() {
    Object.keys(this.perfilForm.controls).forEach(key => {
      this.perfilForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.perfilForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['email']) return 'Ingresa un email válido';
      if (field.errors['pattern']) return 'Formato de teléfono inválido';
    }
    return '';
  }

  resetForm() {
    this.perfilForm.disable();
  }
}