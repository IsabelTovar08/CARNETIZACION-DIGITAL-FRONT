import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { ListEventsComponent } from './list-events.component';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../../../core/Services/api/api.service';
import { EventService } from '../../../../core/Services/api/event/event.service';
import { AttendanceService } from '../../../../core/Services/api/attendance.service/attendance.service';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import Swal from 'sweetalert2';

describe('ListEventsComponent', () => {
  let component: ListEventsComponent;
  let fixture: ComponentFixture<ListEventsComponent>;
  let mockApiService: jasmine.SpyObj<ApiService<any, any>>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockAttendanceService: jasmine.SpyObj<AttendanceService>;
  let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['deleteLogic']);
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getAllEventsFull']);
    const attendanceServiceSpy = jasmine.createSpyObj('AttendanceService', ['searchAttendance']);
    const snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['showError', 'showSuccess']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      paramMap: of(convertToParamMap({ id: '123' })),
      queryParamMap: of(convertToParamMap({ q: 'abc' })),
      snapshot: {
        paramMap: convertToParamMap({ id: '123' }),
        queryParamMap: convertToParamMap({ q: 'abc' }),
      },
    });

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ListEventsComponent
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: EventService, useValue: eventServiceSpy },
        { provide: AttendanceService, useValue: attendanceServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListEventsComponent);
    component = fixture.componentInstance;
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService<any, any>>;
    mockEventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    mockAttendanceService = TestBed.inject(AttendanceService) as jasmine.SpyObj<AttendanceService>;
    mockSnackbarService = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    fixture = TestBed.createComponent(ListEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadEvents on ngOnInit', () => {
    spyOn(component as any, 'loadEvents');
    component.ngOnInit();
    expect((component as any).loadEvents).toHaveBeenCalled();
  });

  describe('loadEvents', () => {
    it('should load events successfully', () => {
      const mockEvents = [{ id: 1, name: 'Event 1', eventTypeName: 'Type1' }];
      mockEventService.getAllEventsFull.and.returnValue(of({ success: true, message: '', data: mockEvents }));

      (component as any).loadEvents();

      expect(mockEventService.getAllEventsFull).toHaveBeenCalled();
      expect(component.allEvents.length).toBe(1);
    });

    it('should handle error when loading events', () => {
      mockEventService.getAllEventsFull.and.returnValue(throwError(() => new Error('error')));

      (component as any).loadEvents();

      expect(mockSnackbarService.showError).toHaveBeenCalledWith('Error al cargar los eventos completos');
    });
  });

  it('should navigate to create on create', () => {
    component.create();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['crear'], { relativeTo: mockActivatedRoute });
  });

  it('should open tags modal on view', () => {
    const event = { title: 'Test', description: 'Desc', dateLabel: 'Date', eventTypeName: 'Type', fullTags: [], accessPoints: [], schedules: [] };
    component.view(event);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should navigate to edit on edit', () => {
    const event = { id: 1 };
    component.edit(event);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['crear'], { relativeTo: mockActivatedRoute, queryParams: { id: 1 } });
  });

  it('should call deleteLogic on remove', () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    const event = { id: 1, title: 'Test' };
    mockApiService.deleteLogic.and.returnValue(of({} as Object));

    component.remove(event);

    expect(mockApiService.deleteLogic).toHaveBeenCalledWith('Event', 1);
  });

  it('should call deleteLogic on toggle', () => {
    const event = { id: 1, isDeleted: false };
    mockApiService.deleteLogic.and.returnValue(of({} as Object));

    component.toggle(event);

    expect(mockApiService.deleteLogic).toHaveBeenCalledWith('Event', 1);
  });

  it('should open attendance modal on viewAttendees', () => {
    const event = { id: 1, title: 'Test' };
    const mockAttendances = { total: 0, page: 1, pageSize: 20, items: [] };
    mockAttendanceService.searchAttendance.and.returnValue(of(mockAttendances));

    component.viewAttendees(event);

    expect(mockAttendanceService.searchAttendance).toHaveBeenCalledWith({
      eventId: 1,
      sortBy: 'TimeOfEntry',
      sortDir: 'DESC',
      page: 1,
      pageSize: 20
    });
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should apply status filter on onStatusChange', () => {
    component.allEvents = [{ statusId: 1 }];
    component.onStatusChange('Activo');
    expect(component.selectedStatus).toBe('Activo');
    expect(component.listEvents.length).toBe(1);
  });

  it('should apply type filter on onTypeChange', () => {
    component.allEvents = [{ eventTypeName: 'Type1' }];
    component.onTypeChange('Type1');
    expect(component.selectedType).toBe('Type1');
    expect(component.listEvents.length).toBe(1);
  });

  it('should apply visibility filter on onVisibilityChange', () => {
    component.allEvents = [{ isLocked: false }];
    component.onVisibilityChange('Público');
    expect(component.selectedVisibility).toBe('Público');
    expect(component.listEvents.length).toBe(1);
  });
});
