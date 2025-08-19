import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstructuraOrganizativaComponent } from './organizational-structure.component';

describe('EstructuraOrganizativaComponent', () => {
  let component: EstructuraOrganizativaComponent;
  let fixture: ComponentFixture<EstructuraOrganizativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstructuraOrganizativaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstructuraOrganizativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
