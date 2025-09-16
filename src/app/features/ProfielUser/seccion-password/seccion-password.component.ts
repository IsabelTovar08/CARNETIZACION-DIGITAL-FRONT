import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../core/Services/snackbar/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { VerificationCredencials } from '../../../core/Services/token/verificationCredencials';

@Component({
  selector: 'app-seccion-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './seccion-password.component.html',
  styleUrl: './seccion-password.component.css'
})
export class SeccionPasswordComponent {
  private fb = inject(FormBuilder);
  private userService = inject(VerificationCredencials);
  private snackbarService = inject(SnackbarService);

  passwordForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.passwordForm = this.fb.group(
      {
        contrasenaActual: ['', [Validators.required, Validators.minLength(6)]],
        nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContrasena: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(form: FormGroup) {
    const nuevaContrasena = form.get('nuevaContrasena')?.value;
    const confirmarContrasena = form.get('confirmarContrasena');

    if (confirmarContrasena && nuevaContrasena !== confirmarContrasena.value) {
      confirmarContrasena.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') this.showCurrentPassword = !this.showCurrentPassword;
    if (field === 'new') this.showNewPassword = !this.showNewPassword;
    if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (!this.passwordForm.valid) {
      this.snackbarService.showError('Formulario inválido, revisa los campos');
      this.markAllFieldsAsTouched();
      return;
    }

    const { contrasenaActual, nuevaContrasena, confirmarContrasena } = this.passwordForm.value;

    this.userService.changePassword(contrasenaActual, nuevaContrasena, confirmarContrasena)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.snackbarService.showSuccess(res.message || 'Contraseña cambiada correctamente');
            this.passwordForm.reset();
            this.resetVisibility();
          } else {
            this.snackbarService.showError(res.message || 'Error al cambiar contraseña');
          }
        },
        error: (err) => {
          console.error('Error al cambiar contraseña:', err);

          if (err.status === 400 && err.error?.message) {
            this.snackbarService.showError(err.error.message); 
          } else if (err.status === 401) {
            this.snackbarService.showError('Sesión expirada, inicia sesión nuevamente.');
          } else {
            this.snackbarService.showError('Error inesperado al cambiar contraseña.');
          }
        }

      });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.passwordForm.controls).forEach(key => {
      this.passwordForm.get(key)?.markAsTouched();
    });
  }

  private resetVisibility() {
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  getFieldError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return 'Mínimo 8 caracteres';
      if (field.errors['passwordMismatch']) return 'Las contraseñas no coinciden';
    }
    return '';
  }
}
