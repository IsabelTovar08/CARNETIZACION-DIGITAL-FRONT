import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperationCodeComponent } from './recuperation-code.component';

describe('VerificationCodeComponent', () => {
  let component: RecuperationCodeComponent;
  let fixture: ComponentFixture<RecuperationCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperationCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
