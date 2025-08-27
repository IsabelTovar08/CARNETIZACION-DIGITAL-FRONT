import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  goToLogin(): void{
      this.router.navigate(['/auth/login']);
  }

  goToVerificitonCode(): void{
      this.router.navigate(['/auth/recuperation-code']);
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const email = this.forgotPasswordForm.get('email')?.value;
      
      // Aquí implementarías la lógica para enviar el email de recuperación
      console.log('Enviando email de recuperación a:', email);
      
      // Simular petición
      setTimeout(() => {
        this.isLoading = false;
        // Mostrar mensaje de éxito o manejar error
      }, 2000);
    }
  }

  onCancel() {
    // Navegar de vuelta al login
    console.log('Cancelar recuperación');
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
}