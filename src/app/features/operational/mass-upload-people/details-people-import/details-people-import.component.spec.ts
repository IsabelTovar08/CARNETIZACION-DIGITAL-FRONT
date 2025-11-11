import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // ✅ Para mockear ActivatedRoute

import { DetailsPeopleImportComponent } from './details-people-import.component';

describe('DetailsPeopleImportComponent', () => {
  let component: DetailsPeopleImportComponent;
  let fixture: ComponentFixture<DetailsPeopleImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetailsPeopleImportComponent,
        HttpClientTestingModule, 
        RouterTestingModule    
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsPeopleImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
