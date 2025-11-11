import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperationCodeComponent } from './recuperation-code.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../../../core/Services/auth/auth-service.service';
import { MenuCreateService } from '../../../../../core/Services/shared/menu-create.service';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';
import { VerificationCredencials } from '../../../../../core/Services/token/verificationCredencials';

describe('RecuperationCodeComponent', () => {
  let component: RecuperationCodeComponent;
  let fixture: ComponentFixture<RecuperationCodeComponent>;

 beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperationCodeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ email: 'test@example.com' })
          }
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        },
        {
          provide: AuthService,
          useValue: {
            getPendingUserId: () => 123,
            verifiCode: () => of({ success: true, message: 'OK' })
          }
        },
        {
          provide: VerificationCredencials,
          useValue: {
            resendCode: () => of({ success: true, message: 'Reenviado' })
          }
        },
        {
          provide: MenuCreateService,
          useValue: { reload: jasmine.createSpy('reload') }
        },
        {
          provide: SnackbarService,
          useValue: {
            showError: jasmine.createSpy('showError'),
            showWarning: jasmine.createSpy('showWarning'),
            showSuccess: jasmine.createSpy('showSuccess')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
