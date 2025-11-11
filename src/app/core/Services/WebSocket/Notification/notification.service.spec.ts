import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NotificationWService } from './notification.service';
import { WebSocketService } from '../web-socket.service';
import { NotificationsService } from '../../api/notifications/notifications.service';

describe('NotificationWService', () => {
  let service: NotificationWService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotificationWService,
        {
          provide: WebSocketService,
          useValue: {
            startConnection: jasmine.createSpy('startConnection'),
            on: jasmine.createSpy('on')
          }
        },
        {
          provide: NotificationsService,
          useValue: {
            getMyNotifications: jasmine.createSpy('getMyNotifications').and.returnValue({
              subscribe: jasmine.createSpy('subscribe')
            })
          }
        }
      ]
    });
    service = TestBed.inject(NotificationWService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with unread count of 0', (done) => {
    service.onUnreadCount().subscribe(count => {
      expect(count).toBe(0);
      done();
    });
  });

  it('should reset unread count', (done) => {
    service.resetUnread();
    service.onUnreadCount().subscribe(count => {
      expect(count).toBe(0);
      done();
    });
  });

  it('should provide notifications observable', () => {
    const observable = service.onNotifications();
    expect(observable).toBeDefined();
    expect(typeof observable.subscribe).toBe('function');
  });
});
