import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPasswordComponent } from './new-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from '../../../../../core/Services/auth/auth-service.service';
import { VerificationCredencials } from '../../../../../core/Services/token/verificationCredencials';
import { TokenService } from '../../../../../core/Services/token/token.service';

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent;
  let fixture: ComponentFixture<NewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPasswordComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ email: 'test@example.com', token: 'abc123' })
          }
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        },
        {
          provide: AuthService,
          useValue: {
            login: jasmine.createSpy('login')
          }
        },
        {
          provide: VerificationCredencials,
          useValue: {
            resetPassword: jasmine.createSpy('resetPassword').and.returnValue(of({ success: true }))
          }
        },
        {
          provide: TokenService,
          useValue: { removeAll: jasmine.createSpy('removeAll') }
        },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
