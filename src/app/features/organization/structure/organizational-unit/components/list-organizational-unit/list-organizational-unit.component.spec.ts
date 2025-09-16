import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ListOrganizationalUnitComponent } from './list-organizational-unit.component';

describe('ListOrganizationalUnitComponent', () => {
  let component: ListOrganizationalUnitComponent;
  let fixture: ComponentFixture<ListOrganizationalUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ListOrganizationalUnitComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'Test', permissions: [] } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOrganizationalUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
