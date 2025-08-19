import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadOrganizativaComponent } from './organizational-unit.component';

describe('UnidadOrganizativaComponent', () => {
  let component: UnidadOrganizativaComponent;
  let fixture: ComponentFixture<UnidadOrganizativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadOrganizativaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadOrganizativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
