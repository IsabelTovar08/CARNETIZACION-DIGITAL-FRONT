import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEventTypesComponent } from './list-event-types.component';

describe('ListEventTypesComponent', () => {
  let component: ListEventTypesComponent;
  let fixture: ComponentFixture<ListEventTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEventTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEventTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
