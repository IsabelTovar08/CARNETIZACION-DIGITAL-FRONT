import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IssuedCardService } from './issued-card.service';
import { HttpServiceWrapperService } from '../../../loanding/http-service-wrapper.service';

describe('IssuedCardService', () => {
  let service: IssuedCardService;
  let httpMock: HttpTestingController;
  let wrapperMock: jasmine.SpyObj<HttpServiceWrapperService>;

  beforeEach(() => {
    const wrapperSpy = jasmine.createSpyObj('HttpServiceWrapperService', ['handleRequest']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IssuedCardService,
        { provide: HttpServiceWrapperService, useValue: wrapperSpy }
      ]
    });

    service = TestBed.inject(IssuedCardService);
    httpMock = TestBed.inject(HttpTestingController);
    wrapperMock = TestBed.inject(HttpServiceWrapperService) as jasmine.SpyObj<HttpServiceWrapperService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getCardPdf and return blob', () => {
    const issuedCardId = 123;
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
    const mockObservable = jasmine.createSpyObj('Observable', ['subscribe']);

    wrapperMock.handleRequest.and.returnValue(mockObservable);

    const result = service.getCardPdf(issuedCardId);

    expect(wrapperMock.handleRequest).toHaveBeenCalled();
    expect(result).toBe(mockObservable);
  });
});