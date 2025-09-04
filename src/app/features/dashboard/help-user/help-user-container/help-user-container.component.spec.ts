import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpUserContainerComponent } from './help-user-container.component';

describe('HelpUserContainerComponent', () => {
  let component: HelpUserContainerComponent;
  let fixture: ComponentFixture<HelpUserContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpUserContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpUserContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
