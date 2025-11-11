import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { of } from 'rxjs';
import { NavigationStateService } from '../../../core/Services/navigation-state/navigation-state.service';
import { UserStoreService } from '../../../core/Services/auth/user-store.service';
import { TokenService } from '../../../core/Services/token/token.service';
import { NotificationWService } from '../../../core/Services/WebSocket/Notification/notification.service';
import { SnackbarService } from '../../../core/Services/snackbar/snackbar.service';
import { Router } from '@angular/router';

class MockNavigationStateService {
  pathTitles$ = of(['Inicio', 'Dashboard']);
}

class MockUserStoreService {
  user = () => of({ name: 'John Doe' });
  isLoggedIn = () => of(true);
}

class MockTokenService {
  logout = jasmine.createSpy('logout');
}

class MockNotificationWService {
  connect = jasmine.createSpy('connect');
  onNotifications = jasmine.createSpy('onNotifications').and.returnValue(of([]));
  onUnreadCount = jasmine.createSpy('onUnreadCount').and.returnValue(of(3));
}

class MockSnackbarService {
  showSuccess = jasmine.createSpy('showSuccess');
  showError = jasmine.createSpy('showError');
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: NavigationStateService, useClass: MockNavigationStateService },
        { provide: UserStoreService, useClass: MockUserStoreService },
        { provide: TokenService, useClass: MockTokenService },
        { provide: NotificationWService, useClass: MockNotificationWService },
        { provide: SnackbarService, useClass: MockSnackbarService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
