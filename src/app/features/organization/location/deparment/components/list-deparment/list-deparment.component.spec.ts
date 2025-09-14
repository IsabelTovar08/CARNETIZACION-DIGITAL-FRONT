import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDeparmentComponent } from './list-deparment.component';

describe('ListDeparmentComponent', () => {
  let component: ListDeparmentComponent;
  let fixture: ComponentFixture<ListDeparmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDeparmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDeparmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
