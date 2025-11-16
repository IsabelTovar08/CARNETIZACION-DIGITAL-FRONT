import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private hubConnection!: signalR.HubConnection;
  private connectionState$ = new BehaviorSubject<boolean>(false);

  public startConnection(hubUrl: string, accessToken?: string): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => accessToken || ''
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    return new Promise<void>((resolve, reject) => {
      this.hubConnection
        .start()
        .then(() => {
          console.log('✅ Conectado al hub:', hubUrl);
          this.connectionState$.next(true);
          resolve(); // 🔥 aseguras que await espere
        })
        .catch(err => {
          console.error('❌ Error al conectar con SignalR:', err);
          this.connectionState$.next(false);
          reject(err);
        });
    });
  }


  public getConnectionState() {
    return this.connectionState$.asObservable();
  }

  public on<T>(eventName: string, callback: (data: T) => void): void {
    this.hubConnection.on(eventName, callback);
  }

  public invoke(methodName: string, ...args: any[]): Promise<any> {
    return this.hubConnection.invoke(methodName, ...args);
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.connectionState$.next(false);
    }
  }
}
