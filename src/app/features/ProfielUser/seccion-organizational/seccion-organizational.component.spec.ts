import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionOrganizationalComponent } from './seccion-organizational.component';

describe('SeccionOrganizationalComponent', () => {
  let component: SeccionOrganizationalComponent;
  let fixture: ComponentFixture<SeccionOrganizationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionOrganizationalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionOrganizationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
