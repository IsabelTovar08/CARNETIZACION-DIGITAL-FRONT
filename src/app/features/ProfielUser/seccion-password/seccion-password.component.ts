import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../core/Services/snackbar/snackbar.service';

@Component({
  selector: 'app-seccion-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seccion-password.component.html',
  styleUrl: './seccion-password.component.css'
})
export class SeccionPasswordComponent {
  private fb = inject(FormBuilder);

  passwordForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
        private snackbarService: SnackbarService,
    
  ) {
     
    this.passwordForm = this.fb.group({
      contrasenaActual: ['', [Validators.required, Validators.minLength(6)]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const nuevaContrasena = form.get('nuevaContrasena');
    const confirmarContrasena = form.get('confirmarContrasena');
    
    if (nuevaContrasena && confirmarContrasena && nuevaContrasena.value !== confirmarContrasena.value) {
      confirmarContrasena.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmarContrasena?.hasError('passwordMismatch')) {
      delete confirmarContrasena.errors!['passwordMismatch'];
      if (Object.keys(confirmarContrasena.errors!).length === 0) {
        confirmarContrasena.setErrors(null);
      }
    }
    
    return null;
  }

  togglePasswordVisibility(field: string) {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      console.log('Contraseña cambiada:', this.passwordForm.value);
      // Aquí iría la lógica para cambiar la contraseña
        this.snackbarService.showSuccess("Contraseña cambiada exitosamente");

      this.passwordForm.reset();
    } else {
      console.log('Formulario inválido');
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return 'Mínimo 6 caracteres';
      if (field.errors['passwordMismatch']) return 'Las contraseñas no coinciden';
    }
    return '';
  }
}
