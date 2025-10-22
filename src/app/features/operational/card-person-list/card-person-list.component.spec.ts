import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPersonListComponent } from './card-person-list.component';

describe('CardPersonListComponent', () => {
  let component: CardPersonListComponent;
  let fixture: ComponentFixture<CardPersonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPersonListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
