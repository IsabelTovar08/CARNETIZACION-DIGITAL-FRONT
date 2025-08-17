import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  actionText?: string;
  actionIcon?: string;
}

@Component({
  selector: 'app-generic-notification',
  imports: [ CommonModule,MatIconModule,MatButtonModule,MatDividerModule,MatBadgeModule],
  templateUrl: './generic-notification.component.html',
  styleUrl: './generic-notification.component.css'
})
export class GenericNotificationComponent  implements OnInit {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() notificationAction = new EventEmitter<Notification>();

  notifications: Notification[] = [];
  hasMoreNotifications: boolean = false;

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  ngOnInit() {
    // Datos de ejemplo - reemplazar con tu servicio
    this.loadNotifications();
  }

  loadNotifications() {
    this.notifications = [
      {
        id: '1',
        title: 'Nueva actualización disponible',
        message: 'Una nueva versión del sistema está disponible. Se recomienda actualizar para obtener las últimas características.',
        type: 'info',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        read: false,
        actionText: 'Actualizar ahora',
        actionIcon: 'system_update'
      },
      {
        id: '2',
        title: 'Advertencia de seguridad',
        message: 'Se detectaron múltiples intentos de acceso fallidos desde una dirección IP desconocida.',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: false,
        actionText: 'Ver detalles',
        actionIcon: 'security'
      },
      {
        id: '3',
        title: 'Tarea completada exitosamente',
        message: 'La sincronización de datos se completó correctamente. Todos los registros están actualizados.',
        type: 'success',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
        read: true
      },
      {
        id: '4',
        title: 'Error en el procesamiento',
        message: 'No se pudo procesar el archivo adjunto. Verifica el formato e intenta nuevamente.',
        type: 'error',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
        read: true,
        actionText: 'Reintentar',
        actionIcon: 'refresh'
      }
    ];
  }

  loadMore() {
    console.log('Loading more notifications...');
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
  }

  clearAll() {
    this.notifications = [];
  }

  toggleRead(notification: Notification) {
    notification.read = !notification.read;
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  onNotificationAction(notification: Notification) {
    this.notificationAction.emit(notification);
  }

  getNotificationIcon(type: string): string {
    const icons = {
      info: 'info',
      warning: 'warning',
      error: 'error',
      success: 'check_circle'
    };
    return icons[type as keyof typeof icons] || 'notifications';
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Ahora';
  }

  trackByFn(index: number, item: Notification): string {
    return item.id;
  }
}
