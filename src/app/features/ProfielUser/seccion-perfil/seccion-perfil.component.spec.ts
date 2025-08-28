import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionPerfilComponent } from './seccion-perfil.component';

describe('SeccionPerfilComponent', () => {
  let component: SeccionPerfilComponent;
  let fixture: ComponentFixture<SeccionPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
