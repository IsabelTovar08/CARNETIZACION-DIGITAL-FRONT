import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FormRoleFormPermissionComponent } from './form-role-form-permission.component';

describe('FormRoleFormPermissionComponent', () => {
  let component: FormRoleFormPermissionComponent;
  let fixture: ComponentFixture<FormRoleFormPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,           // 👉 simula HttpClient para DataService / ApiService
        FormRoleFormPermissionComponent    // 👉 standalone
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormRoleFormPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
