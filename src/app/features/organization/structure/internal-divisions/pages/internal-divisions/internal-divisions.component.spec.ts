import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // 👉 mock para ActivatedRoute y Router

import { DivisionesInternasComponent } from './internal-divisions.component';

describe('DivisionesInternasComponent', () => {
  let component: DivisionesInternasComponent;
  let fixture: ComponentFixture<DivisionesInternasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,   
        RouterTestingModule,       
        DivisionesInternasComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DivisionesInternasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
