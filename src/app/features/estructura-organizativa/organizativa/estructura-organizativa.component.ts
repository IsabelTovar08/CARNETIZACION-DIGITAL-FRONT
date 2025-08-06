import { Component } from '@angular/core';

interface Notificacion {
  usuario: string;
  mensaje: string;
  avatar: string;
}

@Component({
  selector: 'app-estructura-organizativa',
  templateUrl: './estructura-organizativa.component.html',
  styleUrls: ['./estructura-organizativa.component.css']
})
export class EstructuraOrganizativaComponent {

  notificaciones: Notificacion[] = [
    {
      usuario: 'Ana García',
      mensaje: 'Solicitud de modificación de datos',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    {
      usuario: 'Carlos López',
      mensaje: 'Solicitud de modificación de datos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      usuario: 'Sofía Martínez',
      mensaje: 'Solicitud de modificación de datos',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    }
  ];

  constructor() { }

}