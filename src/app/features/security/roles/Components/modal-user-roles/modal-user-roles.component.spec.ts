import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserRolesComponent } from './modal-user-roles.component';

describe('ModalUserRolesComponent', () => {
  let component: ModalUserRolesComponent;
  let fixture: ComponentFixture<ModalUserRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUserRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
