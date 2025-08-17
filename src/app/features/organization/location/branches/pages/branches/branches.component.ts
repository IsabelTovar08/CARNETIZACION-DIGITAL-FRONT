import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sucursal',
  standalone: true, // Si tu componente es standalone
  imports: [CommonModule], // Importa CommonModule para usar *ngIf
   templateUrl: './branches.component.html',
  styleUrl: './branches.component.css'
})
export class SucursalComponent {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLElement>;

  sucursalNorte = {
    nombre: 'Sucursal Norte',
    direccion: 'Calle 18 #67-45 Oriente',
    horario: '05:00 AM - 04:00 PM',
    imagen: 'assets/sucursal1.jpg'
  };

  sucursalCentro = {
    nombre: 'Sucursal Centro',
    direccion: 'Av Siempre Viva #742',
    horario: '08:00 AM - 05:00 PM',
    imagen: 'assets/sucursal2.jpg'
  };

  sucursalSur = {
    nombre: 'Sucursal Sur',
    direccion: 'Cra 10 #23-45 Centro',
    horario: '09:00 AM - 06:00 PM',
    imagen: 'assets/sucursal3.jpg'
  };

  sucursalSeleccionada: any = null;
  modalTop = 0;
  modalLeft = 0;

  mostrarInfo(sucursal: any, event: MouseEvent) {
    this.sucursalSeleccionada = sucursal;

    const markerEl = event.currentTarget as HTMLElement;
    const markerRect = markerEl.getBoundingClientRect();
    const containerRect = this.mapContainer.nativeElement.getBoundingClientRect();

    const centerX = (markerRect.left - containerRect.left) + (markerRect.width / 2);
    const topY = (markerRect.top - containerRect.top);

    this.modalLeft = centerX;
    this.modalTop = topY;
  }

  cerrarModal() {
    this.sucursalSeleccionada = null;
  }
}
