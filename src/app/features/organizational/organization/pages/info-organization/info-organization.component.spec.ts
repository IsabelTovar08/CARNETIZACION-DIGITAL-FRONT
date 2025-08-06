import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoOrganizationComponent } from './info-organization.component';

describe('InfoOrganizationComponent', () => {
  let component: InfoOrganizationComponent;
  let fixture: ComponentFixture<InfoOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoOrganizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});