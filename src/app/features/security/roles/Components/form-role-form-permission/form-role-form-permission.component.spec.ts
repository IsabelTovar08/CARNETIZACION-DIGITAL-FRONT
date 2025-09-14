import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRoleFormPermissionComponent } from './form-role-form-permission.component';

describe('FormRoleFormPermissionComponent', () => {
  let component: FormRoleFormPermissionComponent;
  let fixture: ComponentFixture<FormRoleFormPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRoleFormPermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRoleFormPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
