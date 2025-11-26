import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardConfigurationsComponent } from './card-configurations.component';

describe('CardConfigurationsComponent', () => {
  let component: CardConfigurationsComponent;
  let fixture: ComponentFixture<CardConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardConfigurationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
