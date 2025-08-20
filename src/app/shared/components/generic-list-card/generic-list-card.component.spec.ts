import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericListCardComponent } from './generic-list-card.component';

describe('GenericListCardComponent', () => {
  let component: GenericListCardComponent;
  let fixture: ComponentFixture<GenericListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericListCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
