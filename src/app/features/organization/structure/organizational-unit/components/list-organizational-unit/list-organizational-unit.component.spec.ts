import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrganizationalUnitComponent } from './list-organizational-unit.component';

describe('ListOrganizationalUnitComponent', () => {
  let component: ListOrganizationalUnitComponent;
  let fixture: ComponentFixture<ListOrganizationalUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOrganizationalUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOrganizationalUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
