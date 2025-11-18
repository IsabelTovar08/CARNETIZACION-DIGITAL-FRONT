import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { GenericCredincialsComponent } from './generic-credincials.component';

describe('GenericCredincialsComponent', () => {
  let component: GenericCredincialsComponent;
  let fixture: ComponentFixture<GenericCredincialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericCredincialsComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericCredincialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isOpen).toBeFalse();
    expect(component.modalTitle).toBe('Validar Credenciales');
    expect(component.modalSubtitle).toBe('Ingresa tu contraseña para continuar');
    expect(component.userEmail).toBe('');
    expect(component.form.get('password')?.value).toBe('');
    expect(component.showPassword).toBeFalse();
    expect(component.error).toBe('');
    expect(component.isValidating).toBeFalse();
  });

  it('should validate password length', () => {
    component.form.get('password')?.setValue('12345'); // Less than 8 characters
    component.handleSubmit();
    expect(component.error).toBe('La contraseña debe tener al menos 8 caracteres');

    component.form.get('password')?.setValue('a'.repeat(101)); // More than 100 characters
    component.handleSubmit();
    expect(component.error).toBe('La contraseña alcanzó el máximo de 100 caracteres');
  });

  it('should require password', () => {
    component.form.get('password')?.setValue('');
    component.handleSubmit();
    expect(component.error).toBe('La contraseña es requerida');
  });

  it('should emit validationSuccess on valid password', (done) => {
    component.form.get('password')?.setValue('validpassword123');
    component.validationSuccess.subscribe((password) => {
      expect(password).toBe('validpassword123');
      done();
    });
    component.handleSubmit();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('should clear error on input', () => {
    component.error = 'Some error';
    component.clearError();
    expect(component.error).toBe('');
  });

  it('should handle close modal', () => {
    component.isValidating = false;
    spyOn(component.closeModal, 'emit');
    component.handleClose();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should not close modal when validating', () => {
    component.isValidating = true;
    spyOn(component.closeModal, 'emit');
    component.handleClose();
    expect(component.closeModal.emit).not.toHaveBeenCalled();
  });

  it('should reset modal on close', () => {
    component.form.get('password')?.setValue('test');
    component.error = 'error';
    component.showPassword = true;
    component.isValidating = false; // Set to false so handleClose can proceed

    component.handleClose();

    expect(component.form.get('password')?.value).toBe('');
    expect(component.error).toBe('');
    expect(component.showPassword).toBeFalse();
    expect(component.isValidating).toBeFalse();
  });

  it('should get correct input classes', () => {
    component.error = '';
    let classes = component.getInputClasses();
    expect(classes).toContain('border-gray-300');

    component.error = 'Error';
    classes = component.getInputClasses();
    expect(classes).toContain('border-red-300');
  });

  it('should get correct button classes', () => {
    component.form.get('password')?.setValue('');
    component.isValidating = false;
    let classes = component.getButtonClasses();
    expect(classes).toContain('bg-gray-400');

    component.form.get('password')?.setValue('password');
    classes = component.getButtonClasses();
    expect(classes).toContain('bg-gradient-to-r');
  });

  it('should handle backdrop click', () => {
    spyOn(component, 'handleClose');
    const backdropElement = document.createElement('div');
    const modalElement = document.createElement('div');
    modalElement.classList.add('modal-container');
    backdropElement.appendChild(modalElement);

    const mockEvent = {
      target: backdropElement,
      currentTarget: backdropElement
    };
    component.onBackdropClick(mockEvent as any);
    expect(component.handleClose).toHaveBeenCalled();
  });

  it('should not handle backdrop click on modal content', () => {
    spyOn(component, 'handleClose');
    const targetElement = document.createElement('div');
    targetElement.classList.add('modal-container');
    const mockEvent = {
      target: targetElement,
      currentTarget: document.createElement('div')
    };
    component.onBackdropClick(mockEvent as any);
    expect(component.handleClose).not.toHaveBeenCalled();
  });
});
