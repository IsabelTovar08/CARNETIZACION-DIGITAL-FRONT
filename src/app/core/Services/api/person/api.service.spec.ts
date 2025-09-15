import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../api.service';



// mocks de prueba
interface MockEntity { id: number; name: string }
interface MockDto { id?: number; name: string }

describe('ApiService', () => {
  let service: ApiService<MockEntity, MockDto>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApiService, useClass: ApiService<MockEntity, MockDto> }
      ]
    });

    service = TestBed.inject(ApiService) as ApiService<MockEntity, MockDto>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
