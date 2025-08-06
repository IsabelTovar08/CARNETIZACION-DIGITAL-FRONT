import { TestBed } from '@angular/core/testing';

import { LoangingServiceService } from './loanging-service.service';

describe('LoangingServiceService', () => {
  let service: LoangingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoangingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
