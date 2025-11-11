import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeccionPasswordComponent } from './seccion-password.component';
import { FormBuilder } from '@angular/forms';
import { SnackbarService } from '../../../core/Services/snackbar/snackbar.service';
import { VerificationCredencials } from '../../../core/Services/token/verificationCredencials';
import { of } from 'rxjs';

describe('SeccionPasswordComponent', () => {
  let component: SeccionPasswordComponent;
  let fixture: ComponentFixture<SeccionPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionPasswordComponent],
      providers: [
        FormBuilder,
        {
          provide: SnackbarService,
          useValue: {
            showError: jasmine.createSpy('showError'),
            showSuccess: jasmine.createSpy('showSuccess')
          }
        },
        {
          provide: VerificationCredencials,
          useValue: {
            changePassword: jasmine.createSpy('changePassword').and.returnValue(of({ success: true, message: 'Contraseña cambiada' }))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SeccionPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
