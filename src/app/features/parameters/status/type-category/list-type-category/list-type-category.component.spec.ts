import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ListTypeCategoryComponent } from './list-type-category.component';

describe('ListTypeCategoryComponent', () => {
  let component: ListTypeCategoryComponent;
  let fixture: ComponentFixture<ListTypeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,       
        HttpClientTestingModule,    
        ListTypeCategoryComponent  
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListTypeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
