import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // 👉 mock HttpClient
import { MenuCreateService } from './menu-create.service';

describe('MenuCreateService', () => {
  let service: MenuCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] 
    });
    service = TestBed.inject(MenuCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
