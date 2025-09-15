import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomTypeService } from './custom-type.service';

describe('CustomTypeService', () => {
  let service: CustomTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
    });
    service = TestBed.inject(CustomTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
