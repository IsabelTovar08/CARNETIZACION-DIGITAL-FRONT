import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { WebSocketService } from '../web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {
  private eventAssistance$ = new Subject<any>();
  private hubUrl = environment.API_BASE_URL + 'assistanceHub';

  constructor(private wsService: WebSocketService) {}

  /**
   * @summary Conecta al hub de asistencia a eventos
   */
  public connect(token?: string): void {
    this.wsService.startConnection(this.hubUrl, token);

    // Escuchar evento del hub
    this.wsService.on<any>('ReceiveEventAssistance', (data) => {
      this.eventAssistance$.next(data);
    });
  }

  /**
   * @summary Observable para escuchar eventos de asistencia
   */
  public onEventAssistance(): Observable<any> {
    return this.eventAssistance$.asObservable();
  }

  /**
   * @summary Confirmar asistencia
   */
  public confirmAssistance(eventId: number): Promise<any> {
    return this.wsService.invoke('ConfirmAssistance', eventId);
  }
}
