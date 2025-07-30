import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-code-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.css']
})
export class CreatePasswordComponent {

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  loadingMessage = 'Actualizando contraseña...';

  constructor(private fb: FormBuilder,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  goToForgotPassword(): void{
      this.router.navigate(['/forgotten-password']);
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
