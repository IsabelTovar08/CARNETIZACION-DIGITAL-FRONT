import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOfferednComponent } from './service-offeredn.component';

describe('ServiceOfferednComponent', () => {
  let component: ServiceOfferednComponent;
  let fixture: ComponentFixture<ServiceOfferednComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceOfferednComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceOfferednComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
