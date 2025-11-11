import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ImportBatchService } from './import-banch.service';

describe('ImportBatchService', () => {
  let service: ImportBatchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImportBatchService]
    });
    service = TestBed.inject(ImportBatchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all import batches', () => {
    const mockResponse = {
      success: true,
      message: 'Success',
      data: [{
        id: 1,
        source: 'file.xlsx',
        totalRows: 100,
        successCount: 95,
        errorCount: 5,
        startedAt: '2023-01-01T00:00:00Z'
      }]
    };

    service.getAll().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5100/api/importbatch');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get import batch by id', () => {
    const mockResponse = {
      success: true,
      message: 'Success',
      data: {
        id: 1,
        source: 'file.xlsx',
        totalRows: 100,
        successCount: 95,
        errorCount: 5,
        startedAt: '2023-01-01T00:00:00Z'
      }
    };
    const batchId = 1;

    service.getById(batchId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5100/api/importbatch/${batchId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get rows for table', () => {
    const mockResponse = {
      success: true,
      message: 'Success',
      data: [{
        rowNumber: 1,
        photo: 'photo.jpg',
        name: 'John Doe',
        org: 'Organization',
        division: 'Division',
        state: 'Active',
        isDeleted: false
      }]
    };
    const batchId = 1;

    service.getRowsForTable(batchId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5100/api/importbatch/${batchId}/rows`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get error rows', () => {
    const mockResponse = {
      success: true,
      message: 'Success',
      data: [{
        id: 1,
        rowNumber: 1,
        success: false,
        message: 'Error message',
        updatedPhoto: false
      }]
    };
    const batchId = 1;

    service.getErrorRows(batchId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5100/api/importbatch/${batchId}/rows/errors`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
