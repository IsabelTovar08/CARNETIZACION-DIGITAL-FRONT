import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HeaderSeccionComponent } from './header-seccion.component';
import { PersonService } from './../../../core/Services/api/person/person.service';
import { UserStoreService } from '../../../core/Services/auth/user-store.service';
import { SnackbarService } from '../../../core/Services/snackbar/snackbar.service';
import { Router } from '@angular/router';

class MockPersonService {
  SavePhoto(file: File) {
    return of({ success: true });
  }
}

class MockUserStoreService {
  user = () => of(null); // puedes ajustar esto según el comportamiento esperado
  isLoggedIn = () => of(true);
  updateUserPhoto = jasmine.createSpy('updateUserPhoto');
}

class MockSnackbarService {
  showSuccess = jasmine.createSpy('showSuccess');
  showError = jasmine.createSpy('showError');
}

describe('HeaderSeccionComponent', () => {
  let component: HeaderSeccionComponent;
  let fixture: ComponentFixture<HeaderSeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSeccionComponent],
      providers: [
        { provide: PersonService, useClass: MockPersonService },
        { provide: UserStoreService, useClass: MockUserStoreService },
        { provide: SnackbarService, useClass: MockSnackbarService },
        { provide: Router, useValue: { events: of({ url: '/dashboard/perfil/me' }), navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
