import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionPasswordComponent } from './seccion-password.component';

describe('SeccionPasswordComponent', () => {
  let component: SeccionPasswordComponent;
  let fixture: ComponentFixture<SeccionPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
