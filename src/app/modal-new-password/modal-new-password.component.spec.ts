import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewPasswordComponent } from './modal-new-password.component';

describe('ModalNewPasswordComponent', () => {
  let component: ModalNewPasswordComponent;
  let fixture: ComponentFixture<ModalNewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNewPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
