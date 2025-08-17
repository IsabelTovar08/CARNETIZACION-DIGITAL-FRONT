import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurcursalComponent } from './branches.component';

describe('SurcursalComponent', () => {
  let component: SurcursalComponent;
  let fixture: ComponentFixture<SurcursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurcursalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurcursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
