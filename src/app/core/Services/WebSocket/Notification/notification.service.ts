import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { WebSocketService } from '../web-socket.service';
import { environment } from '../../../../../environments/environment.development';
import { NotificationsService } from '../../api/notifications/notifications.service';
import { NotificationDto } from '../../../Models/notifications/notifications.models';
import { ApiResponse } from '../../../Models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationWService {
  private notifications$ = new Subject<any>();
  private unreadCount$ = new BehaviorSubject<number>(0); // 👈 estado centralizado

  private hubUrl = environment.API_BASE_URL + '/hubs/notifications';

  constructor(
    private wsService: WebSocketService,
    private notificationApi: NotificationsService
  ) {}

  /**
   * @summary Conecta al hub y carga la cantidad inicial desde API
   */
  public async connect(token?: string): Promise<void> {
    await this.wsService.startConnection(this.hubUrl, token);

    // Cargar las notificaciones iniciales desde API
    this.notificationApi.getMyNotifications().subscribe({
      next: (response: ApiResponse<NotificationDto[]>) => {
        const unread = (response.data ?? []).length
        this.unreadCount$.next(unread); //  set inicial
      },
      error: (err) => {
        console.error('Error al cargar notificaciones iniciales:', err);
        this.unreadCount$.next(0);
      }
    });

    // Escuchar nuevas desde el Hub
   this.wsService.on<any>('ReceiveNotification', (data) => {
      console.log('Notificación recibida:', data);

      this.notifications$.next(data);
      this.unreadCount$.next(this.unreadCount$.value + 1);

      this.playNotificationSound(); // sonido siempre
    });

  }

  /**
   * @summary Observable para nuevas notificaciones
   */
  public onNotifications(): Observable<any> {
    return this.notifications$.asObservable();
  }

  /**
   * @summary Observable para el contador centralizado
   */
  public onUnreadCount(): Observable<number> {
    return this.unreadCount$.asObservable();
  }

  /**
   * @summary Método para resetear el contador cuando se marcan como leídas
   */
  public resetUnread(): void {
    this.unreadCount$.next(0);
  }

    // Método par reproducir sonido
  private playNotificationSound(): void {
    const audio = new Audio('../../../../../assets/sounds/new-notification.mp3');
    audio.play().catch(err => console.warn('No se pudo reproducir sonido:', err));
  }
}

