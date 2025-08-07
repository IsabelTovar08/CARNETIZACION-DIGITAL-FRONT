import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-generic-notification',
  imports: [CommonModule],
  templateUrl: './generic-notification.component.html',
  styleUrl: './generic-notification.component.css'
})
export class GenericNotificationComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  notifications = [
    { empresa: 'Empresa A' },
    { empresa: 'Empresa B' },
    { empresa: 'Empresa C' },
    { empresa: 'Empresa D' }
  ];

  verMas(noti: any) {
    console.log('Ver más:', noti);
  }

  verTodas() {
    console.log('Redirigir a vista de notificaciones');
  }
}
