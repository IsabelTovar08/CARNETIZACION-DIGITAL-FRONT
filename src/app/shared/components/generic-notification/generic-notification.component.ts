import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationDto } from '../../../core/Models/notifications/notifications.models';
import { NotificationsService } from '../../../core/Services/api/notifications/notifications.service';
import { ApiResponse } from '../../../core/Models/api-response.models';
import { DateHelperService } from '../../../core/helpers/Date/date-helper.service';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  actionText?: string;
  actionIcon?: string;
  sendDate: string;         // Fecha en que fue enviada

}

@Component({
  selector: 'app-generic-notification',
  imports: [ CommonModule,MatIconModule,MatButtonModule,MatDividerModule,MatBadgeModule],
  templateUrl: './generic-notification.component.html',
  styleUrl: './generic-notification.component.css'
})
export class GenericNotificationComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() notificationAction = new EventEmitter<Notification>();

  notifications: Notification[] = []; // 👈 ya no usamos backendNotifications
  hasMoreNotifications: boolean = false;

  constructor(
    private notificationService: NotificationsService,
    private dateHelper: DateHelperService
  ) {}

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getMyNotifications().subscribe({
      next: (response: ApiResponse<NotificationDto[]>) => {
        const dtos = response.data ?? [];
        this.notifications = dtos.map(dto => this.mapDtoToNotification(dto));
      },
      error: (err: unknown) => {
        console.error('Error loading notifications:', err);
        this.notifications = [];
      }
    });
  }

  private mapDtoToNotification(dto: NotificationDto): Notification {
    return {
      id: String(dto.id),
      title: dto.title,
      message: dto.message,
      type: this.mapTypeNameToUiType(dto.notificationTypeName),
      timestamp: new Date(dto.creationDate),
      read: false,
      sendDate: dto.sendDate
    };
  }

  private mapTypeNameToUiType(typeName?: string): 'info' | 'warning' | 'error' | 'success' {
    const name = (typeName ?? '').toLowerCase();
    if (name.includes('warn') || name.includes('advert')) return 'warning';
    if (name.includes('error') || name.includes('fail') || name.includes('danger')) return 'error';
    if (name.includes('success') || name.includes('ok') || name.includes('done')) return 'success';
    return 'info';
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }

  clearAll(): void {
    this.notifications = [];
  }

  toggleRead(notification: Notification): void {
    notification.read = !notification.read;
  }

  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  onNotificationAction(notification: Notification): void {
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

  trackByFn(index: number, item: Notification): string {
    return item.id;
  }

  getTimeAgo(date: string) {
    return this.dateHelper.timeAgo(date);
  }

  readonly messageCharThreshold: number = 160; // cantidad a partir de la cual mostramos "Ver más"
private expandedIds = new Set<string>();     // ids expandidos

/** Determina si un item está expandido en UI */
isExpanded(id: string): boolean {
  return this.expandedIds.has(id);
}

/** Alterna expandir/contraer el mensaje */
toggleExpand(id: string): void {
  if (this.expandedIds.has(id)) this.expandedIds.delete(id);
  else this.expandedIds.add(id);
}

/** Muestra "Ver más" si el mensaje supera el umbral */
shouldShowReadMore(n: Notification): boolean {
  return (n.message?.length || 0) > this.messageCharThreshold;
}
}
