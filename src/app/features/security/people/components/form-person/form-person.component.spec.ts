import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPErsonComponent } from './form-person.component';

describe('FormPErsonComponent', () => {
  let component: FormPErsonComponent;
  let fixture: ComponentFixture<FormPErsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPErsonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPErsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
