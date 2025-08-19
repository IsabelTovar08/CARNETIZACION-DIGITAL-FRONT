import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUnidadOrganizativaComponent } from './list-organizational-unit.component';

describe('ListUnidadOrganizativaComponent', () => {
  let component: ListUnidadOrganizativaComponent;
  let fixture: ComponentFixture<ListUnidadOrganizativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUnidadOrganizativaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUnidadOrganizativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
