import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardHomeComponent } from './dashboard-home.component';
import { CardsService } from '../../../../core/Services/api/card/cards.service';
import { EventService } from '../../../../core/Services/api/event/event.service';

class MockCardsService {
  GetTotalNumberOfIDCardsAsync = jasmine.createSpy().and.returnValue(of({ data: 42 }));
  getByUnit = jasmine.createSpy().and.returnValue(of({ data: { total: 100, data: [] } }));
  getByShedule = jasmine.createSpy().and.returnValue(of({ data: [] }));
  getInternalDivisionByUnit = jasmine.createSpy().and.returnValue(of({ data: [] }));
}

class MockEventService {
  GetAvailableEventsCount = jasmine.createSpy().and.returnValue(of({ data: 5 }));
}

describe('DashboardHomeComponent', () => {
  let component: DashboardHomeComponent;
  let fixture: ComponentFixture<DashboardHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHomeComponent],
      providers: [
        { provide: CardsService, useClass: MockCardsService },
        { provide: EventService, useClass: MockEventService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
