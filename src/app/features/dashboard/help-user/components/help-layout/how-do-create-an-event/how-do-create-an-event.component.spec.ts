import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowDoCreateAnEventComponent } from './how-do-create-an-event.component';

describe('HowDoCreateAnEventComponent', () => {
  let component: HowDoCreateAnEventComponent;
  let fixture: ComponentFixture<HowDoCreateAnEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowDoCreateAnEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowDoCreateAnEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
