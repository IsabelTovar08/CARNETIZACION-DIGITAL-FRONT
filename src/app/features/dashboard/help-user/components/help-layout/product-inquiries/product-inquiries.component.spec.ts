import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInquiriesComponent } from './product-inquiries.component';

describe('ProductInquiriesComponent', () => {
  let component: ProductInquiriesComponent;
  let fixture: ComponentFixture<ProductInquiriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInquiriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductInquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
