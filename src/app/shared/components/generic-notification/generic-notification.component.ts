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
import { NotificationWService } from '../../../core/Services/WebSocket/Notification/notification.service';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDetailComponent } from '../notification-detail/notification-detail.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from "@angular/material/menu";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  sendDate: string;

  notificationTypeId: number;
  notificationTypeName: string;
  redirectUrl?: string | null;
  notificationReceivedId?: number;
}

@Component({
  selector: 'app-generic-notification',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatInputModule,
    ReactiveFormsModule,
    MatMenuModule
],
  templateUrl: './generic-notification.component.html',
  styleUrl: './generic-notification.component.css'
})
export class GenericNotificationComponent implements OnInit {
debugClick() {
  console.log('CLICK LLEGÓ AL SELECT');
}

debugOpened() {
  console.log('SELECT ABIERTO');
}

debugClosed() {
  console.log('SELECT CERRADO');
}
typeDropdownOpen = false;

toggleTypeDropdown() {
  this.typeDropdownOpen = !this.typeDropdownOpen;
}

selectType(type: string) {
  this.selectedType = type;
  this.typeDropdownOpen = false;
  this.filterNotifications();
}

  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() unreadCountChange = new EventEmitter<number>();

  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];

  selectedType: string = '';
  selectedRead: string = '';

  constructor(
    private notificationService: NotificationsService,
    private dateHelper: DateHelperService,
    private wsService: NotificationWService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.wsService.connect();

    this.wsService.onNotifications().subscribe(n => {
      const mapped = this.mapDtoToNotification(n);
      this.notifications.push(mapped);
      this.filterNotifications();
      this.emitUnreadCount();
    });
  }

  loadNotifications(): void {
    this.notificationService.getMyNotifications().subscribe({
      next: (res: ApiResponse<NotificationDto[]>) => {
        const dtos = res.data ?? [];
        this.notifications = dtos.map(dto => this.mapDtoToNotification(dto));
        this.filterNotifications();
        this.emitUnreadCount();
      },
      error: () => {
        this.notifications = [];
        this.filterNotifications();
        this.emitUnreadCount();
      }
    });
  }

  onTypeFilterChange(value: string) {
    this.selectedType = value;
    this.filterNotifications();
  }

  onReadFilterChange(value: string) {
    this.selectedRead = value;
    this.filterNotifications();
  }

  filterNotifications(): void {
    this.filteredNotifications = this.notifications.filter(n => {

      const typeOk = this.selectedType
        ? n.notificationTypeName.toLowerCase().includes(this.selectedType.toLowerCase())
        : true;

      const readOk =
        this.selectedRead === 'read' ? n.read :
          this.selectedRead === 'unread' ? !n.read :
            true;

      return typeOk && readOk;
    });
  }

  private mapDtoToNotification(dto: NotificationDto): Notification {
    return {
      id: String(dto.id),
      title: dto.title,
      message: dto.message,
      type: this.mapTypeNameToUiType(dto.notificationTypeName),
      timestamp: new Date(dto.creationDate),
      read: dto.readDate != null,

      notificationTypeId: dto.notificationTypeId,
      notificationTypeName: dto.notificationTypeName,
      redirectUrl: dto.redirectUrl ?? null,

      sendDate: dto.sendDate,
      notificationReceivedId: dto.notificationReceivedId
    };
  }

  private mapTypeNameToUiType(name?: string): 'info' | 'warning' | 'error' | 'success' {
    const n = (name ?? '').toLowerCase();
    if (n.includes('advert')) return 'warning';
    if (n.includes('error') || n.includes('fail')) return 'error';
    if (n.includes('success')) return 'success';
    return 'info';
  }

  async onNotificationClick(notification: Notification): Promise<void> {
    if (notification.redirectUrl) {
      this.router.navigateByUrl(notification.redirectUrl);
    }
    if (!notification.read) {
      this.notificationService.markAsRead(notification.notificationReceivedId).subscribe();
      await this.markAsRead(notification);
    }
    this.close.emit();
    this.openModal(notification);
  }

  async markAsRead(notification: Notification): Promise<void> {
    try {
      notification.read = true;
      this.filterNotifications();
      this.emitUnreadCount();
    } catch (e) {
      console.error(e);
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.filterNotifications();
    this.emitUnreadCount();
  }

  clearAll(): void {
    this.notifications = [];
    this.filterNotifications();
    this.emitUnreadCount();
  }

  toggleRead(not: Notification): void {
    not.read = !not.read;
    this.filterNotifications();
    this.emitUnreadCount();
  }

  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.filterNotifications();
    this.emitUnreadCount();
  }

  private emitUnreadCount() {
    this.unreadCountChange.emit(this.unreadCount);
  }

  // UI Helpers
  getNotificationIcon(typeName: string): string {
    const n = (typeName ?? '').toLowerCase();
    if (n.includes('sistema')) return 'settings';
    if (n.includes('información') || n.includes('info')) return 'info';
    if (n.includes('advert')) return 'warning';
    if (n.includes('recordatorio')) return 'notifications_active';
    return 'notifications';
  }

  trackByFn(index: number, item: Notification): string {
    return item.id;
  }

  getTimeAgo(date: string) {
    return this.dateHelper.timeAgo(date);
  }

  readonly messageCharThreshold: number = 160;
  private expandedIds = new Set<string>();

  isExpanded(id: string): boolean {
    return this.expandedIds.has(id);
  }

  toggleExpand(id: string): void {
    if (this.expandedIds.has(id)) this.expandedIds.delete(id);
    else this.expandedIds.add(id);
  }

  shouldShowReadMore(n: Notification): boolean {
    return (n.message?.length ?? 0) > this.messageCharThreshold;
  }

  openModal(notification: Notification): void {
    const dialogRef = this.dialog.open(NotificationDetailComponent, {
      width: '400px',
      data: notification,
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'redirect' && notification.redirectUrl) {
        this.router.navigateByUrl(notification.redirectUrl);
      }
    });
  }

}
