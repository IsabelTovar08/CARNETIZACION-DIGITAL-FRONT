import { Component, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-form-contact',
  standalone: true,
  imports: [
    CommonModule,
  ReactiveFormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule
  ],
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.css']
})
export class FormContactComponent implements OnDestroy {
  contactForm: FormGroup;
  isSubmitting = false;
  private observer?: IntersectionObserver;

  @Output() formSubmitted = new EventEmitter<any>();

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

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      const formData = this.contactForm.value;
      console.log('Datos del formulario:', formData);

      // Emitir el evento con los datos del formulario
      this.formSubmitted.emit(formData);

      setTimeout(() => {
        this.isSubmitting = false;
        this.contactForm.reset();
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.hasError(errorType) && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('email')) return 'Ingresa un email válido';
    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }
    if (field?.hasError('pattern')) return 'Formato inválido';
    return '';
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
