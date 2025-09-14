import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericListCardsComponent } from './generic-list-cards.component';

describe('GenericListCardsComponent', () => {
  let component: GenericListCardsComponent;
  let fixture: ComponentFixture<GenericListCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericListCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericListCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
