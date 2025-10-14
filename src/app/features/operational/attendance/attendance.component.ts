import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {
  constructor(private router: Router) {}

  events = [
    {
      id: 1,
      title: 'Reunión de equipo',
      description: 'Discusión de estrategia de marketing',
      icon: 'groups',
      image: 'https://picsum.photos/600/300?random=1',
      isLocked: false
    },
    {
      id: 2,
      title: 'Taller de diseño',
      description: 'Explorando nuevas tendencias de diseño',
      icon: 'palette',
      image: 'https://picsum.photos/600/300?random=2',
      isLocked: false
    },
    {
      id: 3,
      title: 'Conferencia de Robótica',
      description: 'Certificado de Google',
      icon: 'lock',
      image: 'https://picsum.photos/600/300?random=3',
      isLocked: true
    }
  ];

  onCardClick(event: any) {
    if (event.isLocked) {
      alert('Este evento está bloqueado');
    } else {
      this.router.navigate([`/dashboard/operational/attendance/${event.id}/people`]);
    }
  }
}
