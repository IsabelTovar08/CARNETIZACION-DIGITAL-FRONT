import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserRolesService } from '../user-role/user-roles.service';

describe('UserRolesService', () => {
  let service: UserRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      // providers: [UserRolesService], // si NO tiene providedIn:'root'
    });
    service = TestBed.inject(UserRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
