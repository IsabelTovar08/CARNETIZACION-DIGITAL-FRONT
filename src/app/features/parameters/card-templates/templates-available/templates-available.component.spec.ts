import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TemplatesAvailableComponent } from './templates-available.component';

describe('TemplatesAvailableComponent', () => {
  let component: TemplatesAvailableComponent;
  let fixture: ComponentFixture<TemplatesAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,     // <-- provee ActivatedRoute
        HttpClientTestingModule, // <-- si dentro se usan servicios con HttpClient
        TemplatesAvailableComponent // standalone
      ],
      // Si NO fuera standalone usa: declarations: [TemplatesAvailableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplatesAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
