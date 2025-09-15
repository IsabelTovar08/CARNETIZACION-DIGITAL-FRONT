import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ModalUserRolesComponent } from './modal-user-roles.component';

describe('ModalUserRolesComponent', () => {
  let component: ModalUserRolesComponent;
  let fixture: ComponentFixture<ModalUserRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  
        ModalUserRolesComponent   
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }, 
        { provide: MAT_DIALOG_DATA, useValue: {} } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalUserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
