import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstructuraOrganizativaComponent } from './estructura-organizativa.component';


describe('EstructuraOrganizativaComponent', () => {
  let component: EstructuraOrganizativaComponent;
  let fixture: ComponentFixture<EstructuraOrganizativaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstructuraOrganizativaComponent]
    });
    fixture = TestBed.createComponent(EstructuraOrganizativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have notifications', () => {
    expect(component.notificaciones).toBeDefined();
    expect(component.notificaciones.length).toBeGreaterThan(0);
  });

  it('should display notification users', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.notification-user')).toBeTruthy();
  });
});