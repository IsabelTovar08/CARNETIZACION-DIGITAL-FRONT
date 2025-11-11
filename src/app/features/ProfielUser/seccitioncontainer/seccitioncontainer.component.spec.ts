import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // ✅ Importar

import { SeccitioncontainerComponent } from './seccitioncontainer.component';

describe('SeccitioncontainerComponent', () => {
  let component: SeccitioncontainerComponent;
  let fixture: ComponentFixture<SeccitioncontainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SeccitioncontainerComponent,
        HttpClientTestingModule 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SeccitioncontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
