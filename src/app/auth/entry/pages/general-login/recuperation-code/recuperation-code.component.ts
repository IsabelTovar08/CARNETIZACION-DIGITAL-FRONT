import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-code-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: `./recuperation-code.component.html`,
  styleUrl: `./recuperation-code.component.css`
})
export class RecuperationCodeComponent {
   codeInputs = signal([
    { value: '' },
    { value: '' },
    { value: '' },
    { value: '' },
    { value: '' }
  ]);

    constructor(private router: Router) {
    // Effect para monitorear cambios en el código completo
    effect(() => {
      if (this.isCodeComplete()) {
        console.log('Código completo:', this.fullCode());
      }
    });
  }

  // Señal computada para verificar si el código está completo
  isCodeComplete = computed(() => {
    return this.codeInputs().every(input => input.value.length === 1);
  });

  

  // Señal computada para obtener el código completo
  fullCode = computed(() => {
    return this.codeInputs().map(input => input.value).join('');
  });



  onInputChange(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/[^0-9]/g, ''); // Solo números

    // Actualizar la señal
    this.codeInputs.update(inputs => {
      const newInputs = [...inputs];
      newInputs[index] = { value: value.slice(-1) }; // Solo el último dígito
      return newInputs;
    });

    // Mover al siguiente input si hay un valor
    if (value && index < 4) {
      const nextInput = target.parentElement?.children[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;

    // Backspace: limpiar y mover al anterior
    if (event.key === 'Backspace' && !target.value && index > 0) {
      const prevInput = target.parentElement?.children[index - 1] as HTMLInputElement;
      if (prevInput) {
        this.codeInputs.update(inputs => {
          const newInputs = [...inputs];
          newInputs[index - 1] = { value: '' };
          return newInputs;
        });
        prevInput.focus();
      }
    }

    // Arrow keys para navegación
    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = target.parentElement?.children[index - 1] as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }

    if (event.key === 'ArrowRight' && index < 4) {
      const nextInput = target.parentElement?.children[index + 1] as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 5);

    if (digits.length > 0) {
      this.codeInputs.update(inputs => {
        return inputs.map((input, index) => ({
          value: digits[index] || ''
        }));
      });

      // Enfocar el último input con valor o el primero vacío
      const lastFilledIndex = Math.min(digits.length - 1, 4);
      const targetInput = event.target as HTMLInputElement;
      const nextInput = targetInput.parentElement?.children[lastFilledIndex] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onContinue(): void {
    if (this.isCodeComplete()) {
      console.log('Verificando código:', this.fullCode());
      this.router.navigate(['/auth/new-password']);
      alert(`Código ingresado: ${this.fullCode()}`);
    }
  }
  reenviarCodigo() {
      Swal.fire("Reenvio exitoso! prueba el nuevo codigo");
    }
  
  onResend(): void {
    // Limpiar todos los inputs
    this.codeInputs.set([
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' }
    ]);
    
    console.log('Reenviando código...');
    alert('Código reenviado exitosamente');
    
    // Enfocar el primer input
    setTimeout(() => {
      const firstInput = document.querySelector('.code-digit') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    }, 100);
  }
}