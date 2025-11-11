import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateSelectorDialogComponent } from './template-selector-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('TemplateSelectorDialogComponent', () => {
  let component: TemplateSelectorDialogComponent;
  let fixture: ComponentFixture<TemplateSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateSelectorDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') } // simula el método close
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { templates: [] } // simula los datos inyectados
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
