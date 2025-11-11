import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GenericNotificationComponent } from './generic-notification.component';
import { NotificationsService } from '../../../core/Services/api/notifications/notifications.service';
import { DateHelperService } from '../../../core/helpers/Date/date-helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

class MockNotificationsService {
  getMyNotifications() {
    return of({ data: [] });
  }
}

class MockDateHelperService {
  timeAgo(date: string) {
    return 'some time ago';
  }
}

describe('GenericNotificationComponent', () => {
  let component: GenericNotificationComponent;
  let fixture: ComponentFixture<GenericNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericNotificationComponent],
      providers: [
        { provide: NotificationsService, useClass: MockNotificationsService },
        { provide: DateHelperService, useClass: MockDateHelperService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
