import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UbicationService } from '../ubication/ubication.service';

describe('UbicationService', () => {
  let service: UbicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]   
    });
    service = TestBed.inject(UbicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
