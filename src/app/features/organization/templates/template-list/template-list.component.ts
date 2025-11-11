import { CommonModule } from '@angular/common'; // 👈 Agregá esto
import { Component } from '@angular/core';
import { ApiService } from '../../../../core/Services/api/api.service';
import { Template } from '../../../../core/Models/operational/card-template.model';
import { TemplateRendererComponent } from "../template-renderer/template-renderer.component";

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [CommonModule, TemplateRendererComponent], // ✅ Importá CommonModule acá
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.css'
})
export class TemplateListComponent {
  templates: Template[] = [];

  constructor(private templateService: ApiService<Template, Template>) {}

  ngOnInit(): void {
    this.templateService.ObtenerTodo('CardTemplate').subscribe({
      next: (data) => this.templates = data.data,
      error: (err) => console.error('Error cargando plantillas', err)
    });
  }
}
