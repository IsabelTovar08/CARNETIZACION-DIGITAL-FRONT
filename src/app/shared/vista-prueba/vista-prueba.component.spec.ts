import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPruebaComponent } from './vista-prueba.component';

describe('VistaPruebaComponent', () => {
  let component: VistaPruebaComponent;
  let fixture: ComponentFixture<VistaPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaPruebaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
