import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMenuStructureComponent } from './form-menu-structure.component';

describe('FormMenuStructureComponent', () => {
  let component: FormMenuStructureComponent;
  let fixture: ComponentFixture<FormMenuStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMenuStructureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMenuStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
