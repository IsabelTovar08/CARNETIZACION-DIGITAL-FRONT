import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Imports correctos de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements OnInit, OnDestroy {
  inView = false;             // (ES) clase que activa animaciones CSS
  contactForm: FormGroup;
  isSubmitting = false;
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      advisorName: ['', [Validators.required, Validators.minLength(2)]],
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/)]],
      position: [''],
      quantity: [''],
      message: ['']
    });
  }

  ngOnInit(): void {
    // (ES) Activa animaciones cuando el hero entra al viewport
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        entries => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            this.inView = true;
            this.observer?.disconnect(); // disparar solo una vez
          }
        },
        { threshold: 0.2 }
      );
      this.observer.observe(this.el.nativeElement as Element);
    } else {
      // (ES) Fallback si no hay soporte
      this.inView = true;
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Aquí realizarías el envío real de los datos
      const formData = this.contactForm.value;
      console.log('Datos del formulario:', formData);
      
      // Simulación de envío exitoso
      setTimeout(() => {
        this.isSubmitting = false;
        this.contactForm.reset();
        
        // Aquí podrías mostrar una notificación de éxito
        // Por ejemplo, usando MatSnackBar:
        // this.snackBar.open('¡Formulario enviado con éxito!', 'Cerrar', {
        //   duration: 3000,
        //   panelClass: ['success-snackbar']
        // });
        
      }, 2000);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  // metodo para verificar si un campo específico tiene errores
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.hasError(errorType) && field.touched);
  }

  // metodo para obtener el mensaje de error de un campo
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('email.com')) {
      return 'Ingresa un email válido';
    }
    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }
    if (field?.hasError('pattern')) {
      return 'Formato inválido';
    }
    return '';
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}