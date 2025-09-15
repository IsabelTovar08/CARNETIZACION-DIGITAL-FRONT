import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    // Angular Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule
  ],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      name: [''],
      description: [''],
      eventStart: [''],
      eventEnd: [''],
      multipleJourneys: [false],
      repeatEvent: [false],
      accessType: ['public'],
      profiles: [''],
      organizationalUnits: [''],
      divisions: ['']
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      console.log('✅ Event Data:', this.eventForm.value);
      
      // 🔧 TODO: Conectar con tu API aquí
      // Ejemplo de estructura para tu servicio:
      /*
      this.eventService.createEvent(this.eventForm.value).subscribe({
        next: (response) => {
          console.log('Evento creado exitosamente:', response);
          // Redirigir o mostrar mensaje de éxito
        },
        error: (error) => {
          console.error('Error al crear evento:', error);
          // Mostrar mensaje de error
        }
      });
      */
      
      // Simulación temporal - remover cuando conectes tu API
      alert('¡Formulario válido! Datos listos para enviar al API');
      
    } else {
      console.log('❌ Form is invalid');
      this.markFormGroupTouched();
      alert('Por favor, completa todos los campos requeridos');
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      control?.markAsTouched();
    });
  }

  // 📝 Método para agregar puntos de acceso
  addAccessPoint() {
    console.log('➕ Adding new access point...');
    
    // 🔧 TODO: Implementar lógica para agregar puntos de acceso
    // Puedes abrir un modal, dialog o form inline
    /*
    const dialogRef = this.dialog.open(AddAccessPointDialog, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.accessPoints.push(result);
      }
    });
    */
    
    // Simulación temporal
    alert('Funcionalidad para agregar punto de acceso - Conectar con tu lógica');
  }

  // 🗑️ Método para eliminar puntos de acceso
  deleteAccessPoint(index: number) {
    console.log('🗑️ Deleting access point at index:', index);
    
    // 🔧 TODO: Implementar lógica para eliminar puntos de acceso
    // Confirmar con el usuario y remover del array
    /*
    if (confirm('¿Estás seguro de eliminar este punto de acceso?')) {
      this.accessPoints.splice(index, 1);
    }
    */
    
    // Simulación temporal
    if (confirm('¿Eliminar este punto de acceso?')) {
      alert(`Punto de acceso ${index + 1} eliminado`);
    }
  }
}