import { TestBed } from '@angular/core/testing';

import { CustomTypeService } from './custom-type.service';

describe('CustomTypeService', () => {
  let service: CustomTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
