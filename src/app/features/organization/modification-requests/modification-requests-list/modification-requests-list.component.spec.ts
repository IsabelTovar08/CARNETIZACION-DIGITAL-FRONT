import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificationRequestsListComponent } from './modification-requests-list.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ModificationRequestsListComponent', () => {
  let component: ModificationRequestsListComponent;
  let fixture: ComponentFixture<ModificationRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationRequestsListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            // Simulamos queryParams o snapshot si es necesario
            queryParams: of({}),
            snapshot: { params: {} }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificationRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
