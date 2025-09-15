import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FormPErsonComponent } from './form-person.component';

describe('FormPErsonComponent', () => {
  let component: FormPErsonComponent;
  let fixture: ComponentFixture<FormPErsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormPErsonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormPErsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
