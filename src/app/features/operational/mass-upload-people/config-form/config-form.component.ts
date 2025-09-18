import { Component } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config-form',
  imports: [MatInputModule, MatDatepickerModule, MatSelectModule, MatCardModule, CommonModule],
  templateUrl: './config-form.component.html',
  styleUrl: './config-form.component.css'
})
export class ConfigFormComponent {
  templates: any[] = [];
  divisions: any[] = [];
  profiles: any[] = [];
}
