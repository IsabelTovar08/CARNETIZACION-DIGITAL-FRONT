import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // 👈 mock para ActivatedRoute

import { ListCitiesComponent } from './list-cities.component';

describe('ListCitiesComponent', () => {
  let component: ListCitiesComponent;
  let fixture: ComponentFixture<ListCitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  
        RouterTestingModule,       
        ListCitiesComponent       
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
