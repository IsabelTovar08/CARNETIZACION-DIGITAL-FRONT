// src/app/core/Services/api/api.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../api/api.service';


// Tipos mock solo para pruebas
interface MockEntity { id: number; name: string; }
interface MockDto { id?: number; name: string; }

describe('ApiService', () => {
  let service: ApiService<MockEntity, MockDto>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      // Si ApiService NO tiene providedIn:'root', agrega:
      // providers: [ApiService]
    });

    // Tipamos al inyectar (generics son solo de TypeScript)
    service = TestBed.inject(ApiService) as ApiService<MockEntity, MockDto>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
