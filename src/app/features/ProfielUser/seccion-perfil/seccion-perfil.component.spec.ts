import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SeccionPerfilComponent } from './seccion-perfil.component';
import { ListService } from '../../../core/Services/shared/list.service';
import { UbicationService } from '../../../core/Services/api/ubication/ubication.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';

class MockListService {
  getdocumentTypes = jasmine.createSpy('getdocumentTypes').and.returnValue(of([]));
  getbloodTypes = jasmine.createSpy('getbloodTypes').and.returnValue(of([]));
  getdeparments = jasmine.createSpy('getdeparments').and.returnValue(of([]));
}

class MockUbicationService {
  GetCytiesByDeparment = jasmine.createSpy('GetCytiesByDeparment').and.returnValue(of([]));
}

describe('SeccionPerfilComponent', () => {
  let component: SeccionPerfilComponent;
  let fixture: ComponentFixture<SeccionPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SeccionPerfilComponent,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        ReactiveFormsModule,
        SeccionPerfilComponent,
        HttpClientTestingModule 
      ],
      providers: [
        { provide: ListService, useClass: MockListService },
        { provide: UbicationService, useClass: MockUbicationService } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SeccionPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
