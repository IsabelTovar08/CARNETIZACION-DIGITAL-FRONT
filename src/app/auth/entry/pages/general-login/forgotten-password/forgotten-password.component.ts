import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VerificationCredencials } from '../../../../../core/Services/token/verificationCredencials';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgotten-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgotten-password.component.html',
  styleUrl: './forgotten-password.component.css'
})
export class ForgottenPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private verificationCredencials: VerificationCredencials

  ) {
  this.forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
}
 get email() {
  return this.forgotPasswordForm.get('email');
}
goToLogin(): void {
  this.router.navigate(['/auth/login']);
}

goToVerificitonCode(): void {
  this.router.navigate(['/auth/recuperation-code']);
}

onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const email = this.email?.value;

    this.verificationCredencials.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: res.message || 'Revisa tu bandeja de entrada para continuar.',
            timer: 2000,
            showConfirmButton: false
          });

          // 🔹 Redirigir al componente de verificación (pasamos el email por queryParams)
          this.router.navigate(['/auth/recuperation-code'], { queryParams: { email } });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: res.message || 'No se pudo enviar el correo.'
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al enviar el correo. Intenta de nuevo.'
        });
      }
    });
  }

onCancel() {
  // Navegar de vuelta al login
  console.log('Cancelar recuperación');
}

 
}