import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from '@angular/material/icon';
import { VerificationCredencials } from '../../../../../core/Services/token/verificationCredencials';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';


@Component({
  selector: 'app-change-password',
  imports: [MatDialogModule, MatInputModule, ReactiveFormsModule, MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private userService: VerificationCredencials,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword');

    if (confirmPassword && newPassword !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') this.showCurrentPassword = !this.showCurrentPassword;
    if (field === 'new') this.showNewPassword = !this.showNewPassword;
    if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSave() {
    if (!this.passwordForm.valid) {
      this.snackbarService.showError('Formulario inválido, revisa los campos');
      this.markAllFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    this.userService.changePassword(currentPassword, newPassword, confirmPassword)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.snackbarService.showSuccess('Contraseña actualizada con éxito');
            this.dialogRef.close(true); // Indica que se actualizó correctamente
          } else {
            this.snackbarService.showError('Error al cambiar contraseña');
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al cambiar contraseña:', err);

          if (err.status === 400) {
            this.snackbarService.showError('Contraseña actual incorrecta');
          } else if (err.status === 401) {
            this.snackbarService.showError('Sesión expirada, inicia sesión nuevamente');
          } else {
            this.snackbarService.showError('Error inesperado al cambiar contraseña');
          }
        }
      });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.passwordForm.controls).forEach(key => {
      this.passwordForm.get(key)?.markAsTouched();
    });
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