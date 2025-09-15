import { TestBed } from '@angular/core/testing';

import { HttpServiceWrapperService } from './http-service-wrapper.service';

describe('HttpServiceWrapperService', () => {
  let service: HttpServiceWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpServiceWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
