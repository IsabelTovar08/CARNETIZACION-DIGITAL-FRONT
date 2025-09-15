import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // por si el componente usa ActivatedRoute
import { PerfilesComponent } from './profile.component';

describe('PerfilesComponent', () => {
  let component: PerfilesComponent;
  let fixture: ComponentFixture<PerfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // ✅ para mockear HttpClient
        RouterTestingModule,     // ✅ si usa ActivatedRoute o Router
        PerfilesComponent        // ✅ standalone component
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
