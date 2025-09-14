import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-seccion-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './seccion-perfil.component.html',
  styleUrl: './seccion-perfil.component.css'
})
export class SeccionPerfilComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  perfilForm: FormGroup;

  constructor() {
    
    this.perfilForm = this.fb.group({
      nombre: ['Juan Carlos', Validators.required],
      primerApellido: ['García', Validators.required],
      segundoApellido: ['López'],
      email: ['juan.garcia@email.com', [Validators.required, Validators.email]],
      telefono: ['+57 301 234 5678', [Validators.pattern(/^\+?[\d\s-()]+$/)]]
    });
  }

  onSubmit() {
    if (this.perfilForm.valid) {
      console.log('Datos actualizados:', this.perfilForm.value);
      alert('Perfil actualizado exitosamente');
    } else {
      console.log('Formulario inválido');
      this.markAllFieldsAsTouched();
    }
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
    this.perfilForm.reset({
      nombre: 'Juan Carlos',
      primerApellido: 'García',
      segundoApellido: 'López',
      email: 'juan.garcia@email.com',
      telefono: '+57 301 234 5678'
    });


  }

  
}