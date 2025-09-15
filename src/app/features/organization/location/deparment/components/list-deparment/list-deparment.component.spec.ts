import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';  // 👉 mock de routing

import { ListDeparmentComponent } from './list-deparment.component';

describe('ListDeparmentComponent', () => {
  let component: ListDeparmentComponent;
  let fixture: ComponentFixture<ListDeparmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,   
        RouterTestingModule,       
        ListDeparmentComponent     
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListDeparmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
