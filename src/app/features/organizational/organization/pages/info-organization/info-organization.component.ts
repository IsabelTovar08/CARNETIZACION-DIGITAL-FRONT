import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PuntoAcceso {
  nombre: string;
  tipo: string;
}

@Component({
  selector: 'app-info-organization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './info-organization.component.html',
  styleUrls: ['./info-organization.component.css']
})
export class InfoOrganizationComponent {
  evento = {
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    multiplesJornadas: false,
    repetirEvento: false,
    accesoPublico: true,
    perfil: '',
    unidad: '',
    division: ''
  };

  perfiles = ['Administrador', 'Invitado', 'Staff'];
  unidades = ['Unidad 1', 'Unidad 2', 'Unidad 3'];
  divisiones = ['División A', 'División B'];

  puntosAcceso: PuntoAcceso[] = [
    { nombre: 'Main Entrance', tipo: 'Entrance' },
    { nombre: 'Exit 1', tipo: 'Exit' },
    { nombre: 'VIP Lounge', tipo: 'Both' }
  ];

  nuevoPunto: PuntoAcceso = { nombre: '', tipo: 'Entrance' };

  agregarPunto() {
    if (this.nuevoPunto.nombre.trim() !== '') {
      this.puntosAcceso.push({ ...this.nuevoPunto });
      this.nuevoPunto.nombre = '';
      this.nuevoPunto.tipo = 'Entrance';
    }
  }

  eliminarPunto(index: number) {
    this.puntosAcceso.splice(index, 1);
  }

  crearEvento() {
    console.log('Evento creado:', this.evento, this.puntosAcceso);
    alert('Evento creado exitosamente!');
  }
}
