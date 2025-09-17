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
import { PersonCreate } from '../../../core/Models/security/person.models';
import { ApiService } from '../../../core/Services/api/api.service';


@Component({
  selector: 'app-seccion-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, GenericCredincialsComponent],
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

  constructor(
    private snackbarService: SnackbarService,
  ) {

    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      email: [''],
      telefono: ['', [Validators.pattern(/^\+?[\d\s-()]+$/)]]

      // [Validators.required, Validators.email]
    });
    this.perfilForm.disable();
  }

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.meData = res.data;

          this.perfilForm.patchValue({
            nombre: this.meData.firstName,
            primerApellido: this.meData.lastName,
            segundoApellido: this.meData.secondLastName,
            email: this.meData.email,
            telefono: this.meData.phone ?? ''
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar usuario', err);
        this.snackbarService.showError('No se pudieron cargar los datos del usuario.');
      }
    });
  }

  onSubmit() {
  if (this.perfilForm.valid) {
    const updatedData: UserMeDto = {
      ...this.meData!,          
      ...this.perfilForm.value  
    };

    this.userService.updateProfile(updatedData).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackbarService.showSuccess('Perfil actualizado exitosamente');
          this.meData = res.data; 
          this.perfilForm.patchValue(this.meData); 
          this.isEditable = false;
          this.perfilForm.disable();
        } else {
          this.snackbarService.showError(res.message || 'Error al actualizar perfil');
        }
      },
      error: (err) => {
        console.error('Error al actualizar perfil', err);
        this.snackbarService.showError('Hubo un problema al actualizar el perfil');
      }
    });
  } else {
    this.snackbarService.showError('Formulario inválido, revisa los campos');
    this.markAllFieldsAsTouched();
  }
}

  abrirModal() {
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
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
  if (this.meData) {
    this.perfilForm.reset({
      nombre: this.meData.firstName,
      primerApellido: this.meData.lastName, 
      segundoApellido: this.meData.secondLastName || '',
      email: this.meData.email,
      telefono: this.meData.phone || ''
    });
  } else {
   
    this.perfilForm.reset({
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      email: '',
      telefono: ''
    });
  }

  this.isEditable = false;
  this.perfilForm.disable();
}
}