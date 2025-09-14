import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericCredincialsComponent } from './generic-credincials.component';

describe('GenericCredincialsComponent', () => {
  let component: GenericCredincialsComponent;
  let fixture: ComponentFixture<GenericCredincialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericCredincialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericCredincialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
