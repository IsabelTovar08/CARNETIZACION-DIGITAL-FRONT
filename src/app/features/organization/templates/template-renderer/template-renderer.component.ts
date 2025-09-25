import { Component, Input } from '@angular/core';
import { Template } from '../../../../core/Models/operational/card-template.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-renderer',
  imports: [CommonModule],
  templateUrl: './template-renderer.component.html',
  styleUrl: './template-renderer.component.css'
})
export class TemplateRendererComponent {
  @Input() template!: Template;
  

  // Estado local: ¿estamos viendo el reverso?
  isBackSide = false;

  // Cambiar entre frente y reverso
  toggleSide(): void {
    this.isBackSide = !this.isBackSide;
  }

  // Helper para posiciones absolutas
  getPositionStyle(element: { x: number; y: number }): any {
    return {
      position: 'absolute',
      left: `${element.x}px`,
      top: `${element.y}px`
    };
  }

  // Devolver el objeto de elementos según el lado actual
  get currentElements(): Record<string, { x: number; y: number }> {
    return this.isBackSide
      ? this.template.backElementsJson
      : this.template.frontElementsJson;
  }

  // Devolver la imagen de fondo según el lado actual
  get currentBackgroundUrl(): string {
    return this.isBackSide
      ? this.template.backBackgroundUrl
      : this.template.frontBackgroundUrl;
  }

  // Texto del botón
  get toggleLabel(): string {
    return this.isBackSide ? 'Ver frente' : 'Ver reverso';
  }
}
