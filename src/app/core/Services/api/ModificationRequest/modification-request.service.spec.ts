import { TestBed } from '@angular/core/testing';
import { ModificationRequestService } from './modification-request.service';


describe('ModificationRequestService', () => {
  let service: ModificationRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModificationRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
