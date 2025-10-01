import { TestBed } from '@angular/core/testing';

import { ImportBanchService } from './import-banch.service';

describe('ImportBanchService', () => {
  let service: ImportBanchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportBanchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
