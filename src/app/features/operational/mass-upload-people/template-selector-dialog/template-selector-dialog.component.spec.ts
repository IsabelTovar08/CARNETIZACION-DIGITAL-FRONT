import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSelectorDialogComponent } from './template-selector-dialog.component';

describe('TemplateSelectorDialogComponent', () => {
  let component: TemplateSelectorDialogComponent;
  let fixture: ComponentFixture<TemplateSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateSelectorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
