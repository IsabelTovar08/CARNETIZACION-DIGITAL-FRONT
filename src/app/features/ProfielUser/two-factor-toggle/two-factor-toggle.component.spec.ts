import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorToggleComponent } from './two-factor-toggle.component';

describe('TwoFactorToggleComponent', () => {
  let component: TwoFactorToggleComponent;
  let fixture: ComponentFixture<TwoFactorToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoFactorToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoFactorToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
