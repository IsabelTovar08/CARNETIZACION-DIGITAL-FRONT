import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderSeccionComponent } from '../header-seccion/header-seccion.component';

@Component({
  selector: 'app-seccitioncontainer',
  imports: [CommonModule, RouterOutlet, HeaderSeccionComponent],
  templateUrl: './seccitioncontainer.component.html',
  styleUrl: './seccitioncontainer.component.css'
})
export class SeccitioncontainerComponent {
constructor() {
   
  }
}
