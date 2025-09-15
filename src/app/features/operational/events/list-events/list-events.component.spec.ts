import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; 
import { ListEventsComponent } from './list-events.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

providers: [{
  provide: ActivatedRoute,
  useValue: {
    paramMap: of(convertToParamMap({ id: '123' })),       
    queryParamMap: of(convertToParamMap({ q: 'abc' })),   
    snapshot: {
      paramMap: convertToParamMap({ id: '123' }),
      queryParamMap: convertToParamMap({ q: 'abc' }),
    },
  },
}]

describe('ListEventsComponent', () => {
  let component: ListEventsComponent;
  let fixture: ComponentFixture<ListEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,   
        ListEventsComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
