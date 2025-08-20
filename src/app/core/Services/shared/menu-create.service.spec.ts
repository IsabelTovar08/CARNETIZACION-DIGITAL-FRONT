import { TestBed } from '@angular/core/testing';

import { MenuCreateService } from './menu-create.service';

describe('MenuCreateService', () => {
  let service: MenuCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
