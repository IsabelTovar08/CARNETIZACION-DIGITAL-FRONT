// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/Services/auth/auth-service.service';
import { MenuCreateService } from '../../../../../core/Services/shared/menu-create.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: `./login.component.html`,
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgotten-password']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    // Implementar lógica para recuperar contraseña
    console.log('Recuperar contraseña');
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          // ✅ Caso exitoso
          // this.menu.reload();
          this.router.navigate(['auth/login-code']);

          // Opcional: mostrar notificación
          console.log(response.message);
        } else {
          // ❌ La API respondió 200 pero con error lógico
          console.warn('Login fallido:', response.message);
          alert(response.message); // o tu propio servicio de toast
        }
      },
      error: (error) => {
        // ❌ Error de red o statusCode >= 400
        console.error('Error al iniciar sesión:', error);
        // alert('Ocurrió un error inesperado, intenta de nuevo.');
      }
    });


    if (this.loginForm.valid) {
      this.isLoading = true;

      const formData = this.loginForm.value;
      console.log('Datos del formulario:', formData);

      // Simular llamada a API
      setTimeout(() => {
        this.isLoading = false;
        // Aquí implementarías la lógica real de autenticación
        console.log('Login exitoso');
      }, 2000);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
