import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassUploadPeopleComponent } from './mass-upload-people.component';

describe('MassUploadPeopleComponent', () => {
  let component: MassUploadPeopleComponent;
  let fixture: ComponentFixture<MassUploadPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MassUploadPeopleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassUploadPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
