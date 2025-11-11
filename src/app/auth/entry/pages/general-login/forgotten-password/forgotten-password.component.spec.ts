import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgottenPasswordComponent } from './forgotten-password.component';
import { Router } from '@angular/router';
import { VerificationCredencials } from '../../../../../core/Services/token/verificationCredencials';
import { of } from 'rxjs';

class MockVerificationCredencials {
  forgotPassword = jasmine.createSpy('forgotPassword').and.returnValue(of({ success: true, message: 'Correo enviado' }));
}

describe('ForgottenPasswordComponent', () => {
  let component: ForgottenPasswordComponent;
  let fixture: ComponentFixture<ForgottenPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgottenPasswordComponent],
      providers: [
        { provide: VerificationCredencials, useClass: MockVerificationCredencials },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgottenPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
