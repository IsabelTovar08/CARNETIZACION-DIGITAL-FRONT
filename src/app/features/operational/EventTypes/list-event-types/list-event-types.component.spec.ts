import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ListEventTypesComponent } from './list-event-types.component';

describe('ListEventTypesComponent', () => {
  let component: ListEventTypesComponent;
  let fixture: ComponentFixture<ListEventTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,   
        RouterTestingModule,       
        ListEventTypesComponent    
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListEventTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
