import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPrueba2Component } from './vista-prueba2.component';

describe('VistaPrueba2Component', () => {
  let component: VistaPrueba2Component;
  let fixture: ComponentFixture<VistaPrueba2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaPrueba2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaPrueba2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
