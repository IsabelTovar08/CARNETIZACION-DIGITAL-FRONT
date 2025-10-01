import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPeopleImportComponent } from './details-people-import.component';

describe('DetailsPeopleImportComponent', () => {
  let component: DetailsPeopleImportComponent;
  let fixture: ComponentFixture<DetailsPeopleImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPeopleImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsPeopleImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
