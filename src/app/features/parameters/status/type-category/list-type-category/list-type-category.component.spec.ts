import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeCategoryComponent } from './list-type-category.component';

describe('ListTypeCategoryComponent', () => {
  let component: ListTypeCategoryComponent;
  let fixture: ComponentFixture<ListTypeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTypeCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTypeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
