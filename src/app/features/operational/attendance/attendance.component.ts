import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericListCardComponent } from '../../../shared/components/generic-list-card/generic-list-card.component';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, GenericListCardComponent],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {
  attendances = [
    {
      name: 'Asistencia General',
      subtitle: 'Evento principal',
      dateLabel: '01/10/2025',
      description: 'Control de asistencia masiva',
      tags: ['obligatorio', 'activo'],
      isLocked: false,
      isDeleted: false
    },
    {
      name: 'Asistencia Taller',
      subtitle: 'Robótica',
      dateLabel: '03/10/2025',
      description: 'Ingreso restringido',
      tags: ['cupos limitados'],
      isLocked: true,
      isDeleted: false
    }
  ];

  onAdd() {
    alert('Agregar nueva asistencia');
  }

  onView(item: any) {
    alert('Ver detalle: ' + item.name);
  }

  onEdit(item: any) {
    alert('Editar: ' + item.name);
  }

  onDelete(item: any) {
    alert('Eliminar: ' + item.name);
  }

  onToggle(item: any) {
    alert(`Estado cambiado: ${item.name} → ${item.isDeleted ? 'Inactivo' : 'Activo'}`);
  }
}
