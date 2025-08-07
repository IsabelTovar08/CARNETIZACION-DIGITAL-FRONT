import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPermissionsComponent } from './modal-permissions.component';

describe('ModalPermissionsComponent', () => {
  let component: ModalPermissionsComponent;
  let fixture: ComponentFixture<ModalPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPermissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
