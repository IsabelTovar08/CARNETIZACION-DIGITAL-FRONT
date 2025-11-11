import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MassUploadPeopleComponent } from './mass-upload-people.component';
import { ImportBatchService } from '../../../../core/Services/import-banch/import-banch.service';
import { ApiService } from '../../../../core/Services/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

class MockImportBatchService {
  getAll() {
    return of({ data: [] });
  }
}

class MockApiService {
  uploadImport(formData: FormData) {
    return of({});
  }

  ObtenerTodo(endpoint: string) {
    return of({ data: [] });
  }
}

describe('MassUploadPeopleComponent', () => {
  let component: MassUploadPeopleComponent;
  let fixture: ComponentFixture<MassUploadPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MassUploadPeopleComponent],
      providers: [
        provideNativeDateAdapter(), 
        { provide: ImportBatchService, useClass: MockImportBatchService },
        { provide: ApiService, useClass: MockApiService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} }, queryParams: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MassUploadPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
