import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ModalPermissionsComponent } from './modal-permissions.component';
import { DataService } from '../../../../../core/Services/shared/data.service';
import { RolFormPermissionService } from '../../../../../core/Services/api/rol-form-permission/rol-form-permission.service';
import { Permission } from '../../../../../core/Models/security/permission.models';
import { Role } from '../../../../../core/Models/security/role.models';
import { FromModel } from '../../../../../core/Models/security/form.models';

describe('ModalPermissionsComponent', () => {
  let component: ModalPermissionsComponent;
  let fixture: ComponentFixture<ModalPermissionsComponent>;

  // Mocks simples
  const mockPermissions: Permission[] = [{ id: 1, name: 'Crear' } as any];
  const mockRole: Role = { id: 10, name: 'Administrador' } as any;
  const mockForm: FromModel = { id: 5, name: 'Usuarios' } as any;

  const dataServiceMock = {
    permissions$: of(mockPermissions),
    getPermissions: jasmine.createSpy('getPermissions'),
  };

  const rfPermissionServiceMock = {
    savePermissions: jasmine.createSpy('savePermissions').and.returnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,   // por si algo interno usa HttpClient
        ModalPermissionsComponent, // standalone
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            permissions: mockPermissions,
            role: mockRole,
            form: mockForm,
            selectedPermissionIds: [1],
          },
        },
        { provide: DataService, useValue: dataServiceMock },
        { provide: RolFormPermissionService, useValue: rfPermissionServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build form with selected permissions', () => {
    expect(component.permissionsForm.value).toEqual({ permissions: [1] });
  });

  it('should call service on submit and close dialog', () => {
    component.onSubmit();
    expect(rfPermissionServiceMock.savePermissions).toHaveBeenCalled();
    expect((TestBed.inject(MatDialogRef) as any).close).toHaveBeenCalledWith(true);
  });
});
