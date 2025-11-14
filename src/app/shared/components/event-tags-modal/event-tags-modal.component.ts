import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-event-tags-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIcon],
  templateUrl: './event-tags-modal.component.html',
  styleUrl: './event-tags-modal.component.css'
})
export class EventTagsModalComponent {
  private pastelColors = [
    '#a8d8ea', // Pastel blue
    '#b0c4de', // Light steel blue
    '#d3d3d3', // Light gray
    '#f7dc6f', // Pastel yellow
    '#d4a5c7', // Bluish purple
    '#b8e6d4', // Pastel green
    '#e6e6fa', // Lavender (light purple)
    '#f0f8ff'  // Alice blue (light blue)
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  private darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  getTagStyle(tag: any): any {
    const color = tag.color;
    const darkerColor = this.darkenColor(color, 30); // Darken by 30% for border and text
    return {
      background: color + '40', // 25% opacity for lighter fill
      border: `1px solid ${darkerColor}`,
      color: darkerColor
    };
  }

  getAccessPointType(typeId: number): string {
    switch (typeId) {
      case 1: return 'Entrada';
      case 2: return 'Salida';
      case 3: return 'Mixto';
    }
    return 'Desconocido';
  }
}
