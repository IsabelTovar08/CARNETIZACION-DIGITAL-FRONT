import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationRequestsListComponent } from './modification-requests-list.component';

describe('ModificationRequestsListComponent', () => {
  let component: ModificationRequestsListComponent;
  let fixture: ComponentFixture<ModificationRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationRequestsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificationRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
