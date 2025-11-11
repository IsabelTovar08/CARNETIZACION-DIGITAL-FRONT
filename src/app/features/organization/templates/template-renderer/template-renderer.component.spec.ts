import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateRendererComponent } from './template-renderer.component';
import { Template } from '../../../../core/Models/operational/card-template.model';

describe('TemplateRendererComponent', () => {
  let component: TemplateRendererComponent;
  let fixture: ComponentFixture<TemplateRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateRendererComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateRendererComponent);
    component = fixture.componentInstance;

    // ✅ Asigna un objeto válido a `template`
    component.template = {
      frontBackgroundUrl: 'front.jpg',
      backBackgroundUrl: 'back.jpg',
      frontElementsJson: {},
      backElementsJson: {}
    } as Template;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show front background by default', () => {
    expect(component.currentBackgroundUrl).toBe('front.jpg');
  });

  it('should toggle background to back when toggleSide is called', () => {
    component.toggleSide();
    expect(component.currentBackgroundUrl).toBe('back.jpg');
  });
});
