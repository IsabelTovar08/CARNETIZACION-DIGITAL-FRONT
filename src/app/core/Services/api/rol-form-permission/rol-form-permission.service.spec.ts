import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RolFormPermissionService } from '../rol-form-permission/rol-form-permission.service';

describe('RolFormPermissionService', () => {
  let service: RolFormPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      // providers: [RolFormPermissionService], // si NO tiene providedIn:'root'
    });
    service = TestBed.inject(RolFormPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
