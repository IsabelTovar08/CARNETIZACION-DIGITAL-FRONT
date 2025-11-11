import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TemplateListComponent } from './template-list.component';
import { ApiService } from '../../../../core/Services/api/api.service';

class MockApiService {
  ObtenerTodo() {
    return of({ data: [] }); // simulamos respuesta vacía
  }
}

describe('TemplateListComponent', () => {
  let component: TemplateListComponent;
  let fixture: ComponentFixture<TemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateListComponent],
      providers: [
        { provide: ApiService, useClass: MockApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
