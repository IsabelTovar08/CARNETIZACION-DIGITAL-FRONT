import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetPersonComponent } from './target-person.component';

describe('TargetPersonComponent', () => {
  let component: TargetPersonComponent;
  let fixture: ComponentFixture<TargetPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetPersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
