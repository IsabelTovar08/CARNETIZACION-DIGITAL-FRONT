import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionesInternasComponent } from './divisiones-internas.component';

describe('DivisionesInternasComponent', () => {
  let component: DivisionesInternasComponent;
  let fixture: ComponentFixture<DivisionesInternasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivisionesInternasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivisionesInternasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
