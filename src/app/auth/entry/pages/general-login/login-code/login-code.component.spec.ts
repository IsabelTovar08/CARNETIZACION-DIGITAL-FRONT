import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoginCodeComponent } from './login-code.component';

describe('LoginCodeComponent', () => {
  let component: LoginCodeComponent;
  let fixture: ComponentFixture<LoginCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  // 👉 necesario por AuthService → HttpClient
        LoginCodeComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
