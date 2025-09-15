import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TargetPersonComponent } from './target-person.component';

describe('TargetPersonComponent', () => {
  let component: TargetPersonComponent;
  let fixture: ComponentFixture<TargetPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TargetPersonComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
       
        { provide: MAT_DIALOG_DATA, useValue: { person: { id: 123, name: 'Mock User' } } },
      
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TargetPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
