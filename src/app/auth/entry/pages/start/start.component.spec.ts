import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StartComponent } from './start.component';
import { ListService } from '../../../../core/Services/shared/list.service';
import { CustomTypeService } from '../../../../core/Services/api/customType/custom-type.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockListService {
  getList = jasmine.createSpy('getList').and.returnValue(of([]));
  getdocumentTypes = jasmine.createSpy('getdocumentTypes').and.returnValue(of([]));
  getbloodTypes = jasmine.createSpy('getbloodTypes').and.returnValue(of([]));
  getdeparments = jasmine.createSpy('getdeparments').and.returnValue(of([]));
  getCities = jasmine.createSpy('getCities').and.returnValue(of([])); // 👈 este es el que te falta
}

class MockCustomTypeService {
  // Si CustomTypeService también se usa directamente, mockealo
  getTypes = jasmine.createSpy('getTypes').and.returnValue(of([]));
}

describe('StartComponent', () => {
  let component: StartComponent;
  let fixture: ComponentFixture<StartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StartComponent,
        HttpClientTestingModule, 
      ],
      providers: [
        { provide: ListService, useClass: MockListService },
        { provide: CustomTypeService, useClass: MockCustomTypeService },
      ]
  }).compileComponents();

    fixture = TestBed.createComponent(StartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
