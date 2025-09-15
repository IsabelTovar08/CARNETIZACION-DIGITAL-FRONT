import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generic-credincials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generic-credincials.component.html',
  styleUrl: './generic-credincials.component.css'
})
export class GenericCredincialsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isOpen = false;
  @Input() modalTitle = 'Validar Credenciales';
  @Input() modalSubtitle = 'Ingresa tu contraseña para continuar';
  @Input() userEmail = '';

  @Output() closeModal = new EventEmitter<void>();
  @Output() validationSuccess = new EventEmitter<string>();

  password = '';
  showPassword = false;
  error = '';
  isValidating = false;
  // validationSuccess = false; // Comentado hasta tener el servicio

  ngOnInit() {
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  ngOnChanges() {
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  async handleSubmit() {
    if (!this.password.trim()) {
      this.error = 'La contraseña es requerida';
      return;
    }

    if(this.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    if(this.password.length >= 100) {
      this.error = 'La contraseña alconzo el maximo de 100 caracteres';
      return;
    }

    this.isValidating = true;
    this.error = '';

    // Simular un pequeño delay para mostrar el loading
    setTimeout(() => {
      this.isValidating = false;
      
      // Por ahora simplemente emitimos el evento con la contraseña ingresada
      // Cuando tengas el servicio, aquí harías la validación real
      this.validationSuccess.emit(this.password);
      this.handleClose();
      this.resetModal();
    }, 1000); // Delay de 1 segundo para mostrar el spinner
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearError() {
    this.error = '';
  }

  handleClose() {
    if (!this.isValidating) {
      this.closeModal.emit();
      this.resetModal();
    }
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.handleClose();
    }
  }

  private resetModal() {
    this.password = '';
    this.error = '';
    // this.validationSuccess = false; // Comentado hasta tener el servicio
    this.isValidating = false;
    this.showPassword = false;
    document.body.style.overflow = 'auto';
  }

  getInputClasses(): string {
    const baseClasses = 'w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition-all';
    const errorClasses = 'border-red-300 focus:ring-red-200 focus:border-red-400';
    const normalClasses = 'border-gray-300 focus:ring-purple-200 focus:border-purple-400';
    
    return `${baseClasses} ${this.error ? errorClasses : normalClasses}`;
  }

  getButtonClasses(): string {
    const baseClasses = 'w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform';
    const disabledClasses = 'bg-gray-400 cursor-not-allowed';
    const enabledClasses = 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl';
    
    return `${baseClasses} ${this.isValidating || !this.password.trim() ? disabledClasses : enabledClasses}`;
  }
}